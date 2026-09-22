#!/usr/bin/env python3
"""
le_siphon_v2.py — TRAJEKTIA ETL Pipeline V2
============================================
Aspiration totale des données CNP 2021 et OaSIS/SIPeC 2025
depuis le Portail du gouvernement ouvert du Canada.

Règles d'or :
  - Zéro API CKAN : scraping HTML direct + téléchargement CSV flat files
  - Pagination complète : parcourt toutes les pages ?res_page=N
  - Jointures en mémoire avant upsert Supabase
  - Legacy DPT : try/except local — warning si absent, on continue
  - Séparation stricte : occupation_oasis (SIPeC) ≠ occupation_competencies (O*NET)

Usage :
  python etl/le_siphon_v2.py [--cache-only] [--phase PHASE]

Options :
  --cache-only  : Utilise les fichiers mis en cache (évite re-téléchargement)
  --phase N     : Exécute uniquement la phase N (1-5)
"""

import os
import sys
import re
import time
import logging
import argparse
import hashlib
import warnings
from pathlib import Path
from datetime import datetime
from typing import Optional

import requests
import pandas as pd
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client, Client

warnings.filterwarnings("ignore", category=pd.errors.DtypeWarning)

# ─────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)8s] %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("etl/siphon_v2.log", encoding="utf-8"),
    ],
)
# Force UTF-8 sur stdout Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
log = logging.getLogger("siphon_v2")

# Répertoires
ROOT        = Path(__file__).parent.parent
CACHE_DIR   = ROOT / "etl" / ".cache_v2"
DATA_DIR    = ROOT / "data"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Supabase (connexion directe port 5432 pour ETL massif)
SUPABASE_URL      = os.getenv("SUPABASE_URL")
# Priorité : service_role (bypass RLS pour ETL) — fallback sur anon
SUPABASE_KEY      = (
    os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
)
SUPABASE_DB_URL   = os.getenv("SUPABASE_DB_URL_DIRECT") or os.getenv("SUPABASE_DB_URL")

CHUNK_SIZE = 500  # lignes par upsert batch

# ─────────────────────────────────────────────────────────────
# CATALOGUE DES SOURCES GOUVERNEMENTALES
# Structure : {dataset_id: {label, url_page, fichiers_cibles}}
# ─────────────────────────────────────────────────────────────
DATASETS = {
    "sipec_oasis": {
        "label": "SIPeC / OaSIS 2025 — Compétences, Habiletés, Contexte",
        "page_url": "https://ouvert.canada.ca/data/fr/dataset/10ce43bd-fb58-4969-806b-4bffebc87bec",
        "base_download": "https://open.canada.ca/data/dataset/10ce43bd-fb58-4969-806b-4bffebc87bec",
    },
    "cnp_2021": {
        "label": "Classification nationale des professions (CNP) 2021 v1.0",
        "page_url": "https://ouvert.canada.ca/data/fr/dataset/1feee3b5-8068-4dbb-b361-180875837593",
        "base_download": "https://open.canada.ca/data/dataset/1feee3b5-8068-4dbb-b361-180875837593",
    },
}

# Correspondance nom de fichier → catégorie de traitement
FILE_CATEGORIES = {
    # OaSIS / SIPeC
    r"guide.*oasis.*\.csv":            "oasis_guide",
    r"guide.*version.*\.csv":          "oasis_guide",
    r"skills.*oasis.*\.csv":           "oasis_skills",       # F — Compétences
    r"compet.*oasis.*\.csv":           "oasis_skills",
    r"abilities.*oasis.*\.csv":        "oasis_abilities",    # A — Habiletés
    r"habilet.*\.csv":                 "oasis_abilities",
    r"personal.*attr.*\.csv":          "oasis_personal",     # B — Attributs personnels
    r"attributs.*\.csv":               "oasis_personal",
    r"knowledge.*oasis.*\.csv":        "oasis_knowledge",    # G — Connaissances
    r"connais.*\.csv":                 "oasis_knowledge",
    r"interest.*oasis.*\.csv":         "oasis_interests",    # C — Domaines d'intérêt
    r"interet.*\.csv":                 "oasis_interests",
    r"work.*env.*\.csv":               "oasis_work_env",     # J — Milieux de travail
    r"milieux.*\.csv":                 "oasis_work_env",
    r"work.*context.*\.csv":           "oasis_work_ctx",     # K — Contexte de travail
    r"contexte.*\.csv":                "oasis_work_ctx",
    r"work.*activ.*\.csv":             "oasis_work_act",     # K — Activités
    # CNP 2021
    r"appell.*emploi.*\.csv":          "cnp_job_titles",
    r"job.*title.*noc.*\.csv":         "cnp_job_titles",
    r"exclusion.*\.csv":               "cnp_exclusions",
    r"exig.*emploi.*\.csv":            "cnp_requirements",
    r"employment.*req.*\.csv":         "cnp_requirements",
    r"concordance.*2016.*\.csv":       "cnp_concordance",
    r"concordance.*2021.*\.csv":       "cnp_concordance",
    r"noc.*concordance.*\.csv":        "cnp_concordance",
    r"cnp.*concordance.*\.csv":        "cnp_concordance",
    r"noc.*hierarchy.*\.csv":          "cnp_hierarchy",
    r"structure.*cnp.*\.csv":          "cnp_hierarchy",
    r"noc.*2021.*v1.*\.csv":           "cnp_hierarchy",
}

# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────
import psycopg2
from psycopg2.extras import execute_values


def get_supabase() -> Client:
    """Client Supabase REST — lectures uniquement (sanity check)."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise EnvironmentError("SUPABASE_URL / SUPABASE_KEY manquants dans .env")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def get_pgconn():
    """
    Connexion PostgreSQL via psycopg2.
    Essaie SUPABASE_DB_URL_DIRECT (port 5432) puis SUPABASE_DB_URL (pooler 6543).
    RLS bypasse car les tables ETL ont ete desactivees via ALTER TABLE ... DISABLE RLS.
    """
    urls_to_try = [
        os.getenv("SUPABASE_DB_URL_DIRECT"),  # direct port 5432
        os.getenv("SUPABASE_DB_URL"),           # pooler session mode port 6543
    ]
    last_err = None
    for db_url in urls_to_try:
        if not db_url:
            continue
        try:
            conn = psycopg2.connect(db_url, connect_timeout=10)
            conn.autocommit = False
            log.info(f"  DB connecee via : {db_url.split('@')[1] if '@' in db_url else db_url[:40]}")
            return conn
        except Exception as e:
            last_err = e
            log.warning(f"  [WARN] DB connexion echouee : {e}")
    raise EnvironmentError(
        f"Impossible de se connecter a PostgreSQL.\n"
        f"Derniere erreur : {last_err}\n"
        f"Verifiez SUPABASE_DB_URL dans .env"
    )


def cache_path(url: str) -> Path:
    fname = url.split("/")[-1].split("?")[0] or hashlib.md5(url.encode()).hexdigest()
    return CACHE_DIR / fname


def download_file(url: str, cache_only: bool = False) -> Optional[Path]:
    """Telecharge un fichier CSV — utilise le cache si dispo."""
    dest = cache_path(url)
    if dest.exists():
        log.info(f"  [CACHE] {dest.name}")
        return dest
    if cache_only:
        log.warning(f"  [SKIP] Fichier absent du cache : {url}")
        return None
    try:
        headers = {"User-Agent": "Trajektia-ETL/2.0 (education; contact@trajektia.ca)"}
        r = requests.get(url, headers=headers, timeout=60, stream=True)
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        log.info(f"  [DL] {dest.name} ({dest.stat().st_size // 1024} KB)")
        time.sleep(0.5)
        return dest
    except Exception as e:
        log.error(f"  [ERR] Telechargement echoue {url}: {e}")
        return None


def read_csv_flexible(path: Path) -> pd.DataFrame:
    """
    Lit un CSV avec detection automatique de l'encodage ET du separateur.
    Gouvernement canadien : souvent UTF-8-BOM + separateur ';'.
    """
    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        for sep in [";", ",", "\t"]:
            try:
                df = pd.read_csv(path, encoding=enc, sep=sep,
                                 low_memory=False, dtype=str)
                # Rejection si le parsing produit une seule colonne >> mauvais sep
                if len(df.columns) < 2:
                    continue
                df = df.dropna(how="all").fillna("")
                df.columns = [c.strip().lower().replace(" ", "_").replace("-", "_")
                              .replace("(", "").replace(")", "").replace("/", "_")
                              for c in df.columns]
                log.info(f"  [CSV] {path.name} — {len(df)} lignes, {len(df.columns)} col (enc={enc}, sep={repr(sep)})")
                return df
            except Exception:
                continue
    log.error(f"  [ERR] Impossible de lire {path.name}")
    return pd.DataFrame()


def classify_file(filename: str) -> str:
    fn = filename.lower()
    for pattern, category in FILE_CATEGORIES.items():
        if re.search(pattern, fn):
            return category
    return "unknown"


def upsert_chunks(conn, table: str, records: list[dict],
                  conflict_cols: list[str], chunk: int = CHUNK_SIZE):
    """
    Upsert massif via psycopg2 + execute_values.
    Bypass RLS complet — connexion superuser directe.
    """
    total = len(records)
    if total == 0:
        log.info(f"  [SKIP] {table} — aucune donnee")
        return 0

    all_cols = list({k for r in records for k in r.keys()})
    update_cols = [
        c for c in all_cols
        if c not in conflict_cols and c not in ("id", "created_at", "ingested_at")
    ]

    conflict_str = ", ".join(conflict_cols)
    col_str      = ", ".join(f'"{c}"' for c in all_cols)
    update_str   = (
        ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
        if update_cols else f'"{conflict_cols[0]}" = "{conflict_cols[0]}"'
    )

    sql = (
        f'INSERT INTO "{table}" ({col_str}) VALUES %s '
        f'ON CONFLICT ({conflict_str}) DO UPDATE SET {update_str}'
    )

    inserted = 0
    with conn.cursor() as cur:
        for i in range(0, total, chunk):
            batch = records[i : i + chunk]
            values = [tuple(r.get(c) for c in all_cols) for r in batch]
            try:
                execute_values(cur, sql, values, page_size=chunk)
                conn.commit()
                inserted += len(batch)
            except Exception as e:
                conn.rollback()
                log.error(f"  [ERR] Upsert {table} batch {i//chunk}: {e}")

    log.info(f"  [UPSERT] {table} — {inserted}/{total} lignes")
    return inserted


def count_table(conn, table: str) -> int:
    with conn.cursor() as cur:
        cur.execute(f'SELECT COUNT(*) FROM "{table}"')
        return cur.fetchone()[0]


# ─────────────────────────────────────────────────────────────
# PHASE 1 : SCRAPER — Extraction des URLs de téléchargement
# ─────────────────────────────────────────────────────────────

def scrape_dataset_files(dataset_id: str, cache_only: bool = False) -> list[dict]:
    """
    Parcourt toutes les pages du dataset sur le portail ouvert
    et extrait les URLs de téléchargement CSV/Excel.
    Retourne : [{name, url, lang, category, filename}]
    """
    info   = DATASETS[dataset_id]
    page_url = info["page_url"]
    files  = []
    seen   = set()

    log.info(f"\n[PHASE 1] Scraping {info['label']}")

    headers = {"User-Agent": "Trajektia-ETL/2.0"}

    for page_num in range(1, 20):  # max 20 pages de ressources
        url = f"{page_url}?res_page={page_num}" if page_num > 1 else page_url
        try:
            r = requests.get(url, headers=headers, timeout=30)
            r.raise_for_status()
        except Exception as e:
            log.debug(f"  [STOP] Page {page_num} inaccessible : {e}")
            break

        soup = BeautifulSoup(r.text, "html.parser")

        # Cherche tous les liens de téléchargement
        download_links = soup.find_all("a", href=re.compile(r"/download/"))
        if not download_links:
            # Essaie aussi les liens open.canada.ca directs
            download_links = soup.find_all(
                "a", href=re.compile(r"open\.canada\.ca.*download")
            )

        if not download_links and page_num > 1:
            log.debug(f"  [STOP] Plus de ressources à la page {page_num}")
            break

        for link in download_links:
            href = link.get("href", "")
            # Normalise vers open.canada.ca
            if href.startswith("/"):
                href = "https://open.canada.ca" + href
            elif href.startswith("http://"):
                href = href.replace("http://", "https://")

            # Filtre sur CSV et Excel uniquement
            ext = href.split("?")[0].split(".")[-1].lower()
            if ext not in ("csv", "xlsx", "xls"):
                continue
            if href in seen:
                continue
            seen.add(href)

            filename = href.split("/")[-1].split("?")[0]
            # Détecte la langue via le contexte HTML
            parent_text = (link.parent.get_text(" ", strip=True) if link.parent else "")
            lang = "fr" if ("français" in parent_text.lower() or
                            "_fr" in filename.lower() or
                            "-fr" in filename.lower()) else "en"

            category = classify_file(filename)

            files.append({
                "name":     filename,
                "url":      href,
                "lang":     lang,
                "category": category,
                "filename": filename,
                "dataset":  dataset_id,
            })
            log.info(f"  [+] {filename} [{lang}] → {category}")

        time.sleep(0.3)

    # Fallback : URLs connues si le scraper ne trouve rien
    if not files and dataset_id == "sipec_oasis":
        log.warning("  [FALLBACK] Utilisation des URLs connues SIPeC/OaSIS")
        known = [
            ("guide_oasis_2025_v4.0.csv",    "oasis_guide",    "en"),
            ("guide-2025-version-4.0-fr.csv", "oasis_guide",    "fr"),
            ("skills_oasis_2025_v1.1.csv",    "oasis_skills",   "en"),
        ]
        base = "https://open.canada.ca/data/dataset/10ce43bd-fb58-4969-806b-4bffebc87bec"
        resource_ids = {
            "guide_oasis_2025_v4.0.csv":    "2a7a17bf-b67c-4fc2-b636-959c7f1d7ae4",
            "guide-2025-version-4.0-fr.csv":"d7e31a9c-48ca-445e-b3c0-4fdc2f5514fd",
            "skills_oasis_2025_v1.1.csv":   "bd9cf3f2-4cd5-47b1-ba74-ab68cd0a941b",
        }
        for fname, cat, lang in known:
            rid = resource_ids.get(fname, "")
            url = f"{base}/resource/{rid}/download/{fname}"
            files.append({"name": fname, "url": url, "lang": lang,
                          "category": cat, "filename": fname, "dataset": dataset_id})

    log.info(f"  → {len(files)} fichiers identifiés pour {dataset_id}")
    # Téléchargement
    for f in files:
        f["local_path"] = download_file(f["url"], cache_only)
    return [f for f in files if f.get("local_path")]


# ─────────────────────────────────────────────────────────────
# PHASE 2 : PARSE EN MÉMOIRE
# ─────────────────────────────────────────────────────────────

def col_find(df: pd.DataFrame, *candidates) -> Optional[str]:
    """Trouve la première colonne correspondant à un des candidats."""
    cols = df.columns.tolist()
    for c in candidates:
        if c in cols:
            return c
        # Recherche partielle
        matches = [x for x in cols if c.lower() in x.lower()]
        if matches:
            return matches[0]
    return None


def parse_oasis_guide(df: pd.DataFrame, lang: str) -> tuple[list, list]:
    """
    Parse le fichier guide OaSIS → (descriptors_records, scale_labels_records)
    Colonnes attendues (varient selon version) :
      Code, Catégorie, Sous-catégorie, Groupe, Nom, Description,
      Échelle, Valeur, Libellé
    """
    descriptors  = []
    scale_labels = []

    # Détecte les colonnes de code et nom
    code_col  = col_find(df, "code", "oasis_code", "code_oasis")
    cat_col   = col_find(df, "categorie", "category", "cat")
    name_col  = col_find(df, "nom", "name", "descriptor", "descripteur")
    desc_col  = col_find(df, "description", "desc")
    scale_col = col_find(df, "echelle", "scale", "scale_id")
    val_col   = col_find(df, "valeur", "value", "level_value", "niveau")
    lbl_col   = col_find(df, "libelle", "label", "level_label")

    is_scale_file = (scale_col and val_col and lbl_col)

    for _, row in df.iterrows():
        code = str(row.get(code_col, "")).strip() if code_col else ""
        name = str(row.get(name_col, "")).strip() if name_col else ""

        if is_scale_file and scale_col:
            scale_id = str(row.get(scale_col, "")).strip()
            val_raw  = str(row.get(val_col, "")).strip().replace(",", ".")
            label    = str(row.get(lbl_col, "")).strip()
            if scale_id and val_raw:
                try:
                    val = float(val_raw)
                    rec: dict = {
                        "scale_id":       scale_id,
                        "level_value":    val,
                        "level_label_fr": label if lang == "fr" else "",
                        "level_label_en": label if lang == "en" else "",
                        "applicable_category": str(row.get(cat_col, "")).strip() if cat_col else None,
                        "guide_version":  "2025 v4.0",
                    }
                    if not rec.get("applicable_category"):
                        rec["applicable_category"] = None
                    scale_labels.append(rec)
                except ValueError:
                    pass

        if code and name and len(code) > 2:  # code OaSIS valide
            rec = {
                "oasis_code":     code,
                "category_code":  code.split(".")[0] if "." in code else code[:1],
                "name_fr" if lang == "fr" else "name_en": name,
                "competency_category": _map_oasis_category(code),
                "version":        "2025.0",
                "source_dataset": "SIPeC 2025 v1.0",
            }
            if desc_col:
                key = "description_fr" if lang == "fr" else "description_en"
                rec[key] = str(row.get(desc_col, "")).strip()
            descriptors.append(rec)

    return descriptors, scale_labels


def _map_oasis_category(code: str) -> Optional[str]:
    """Map le code OaSIS vers competency_category enum."""
    mapping = {
        "A": "ability",
        "B": "personal_attribute",
        "C": "interest",
        "F": "skill",
        "G": "knowledge",
        "J": "work_context",
        "K": "work_activity",
    }
    prefix = code.split(".")[0].upper() if "." in code else code[:1].upper()
    return mapping.get(prefix)


def parse_oasis_scores(df: pd.DataFrame, category: str, lang: str) -> tuple[list, list]:
    """
    Parse un fichier de scores OaSIS (compétences, habiletés, etc.)
    → (descriptor_records, occupation_oasis_records)
    Colonnes typiques : CNP_Code, OaSIS_Code, OaSIS_Name, Importance, Level
    """
    descriptors = []
    occ_oasis   = []

    cnp_col   = col_find(df, "cnp", "noc", "code_cnp", "profession_code",
                         "code_profession", "cnp_code", "noc_code")
    code_col  = col_find(df, "oasis_code", "code_oasis", "element_code",
                         "code_element", "sipec_code")
    name_col  = col_find(df, "nom", "name", "oasis_name", "descriptor")
    imp_col   = col_find(df, "importance", "importance_score", "score_importance",
                         "im_score", "importance_rating")
    lv_col    = col_find(df, "level", "niveau", "level_score", "score_niveau",
                         "lv_score", "complexity")
    fr_col    = col_find(df, "frequency", "frequence", "fr_score")
    ex_col    = col_find(df, "extent", "etendue", "ex_score")

    # Colonnes de libellés
    imp_lbl = col_find(df, "importance_label", "libelle_importance")
    lv_lbl  = col_find(df, "level_label", "libelle_niveau")

    cat_raw = {
        "oasis_skills":   "skill",
        "oasis_abilities": "ability",
        "oasis_personal": "personal_attribute",
        "oasis_knowledge":"knowledge",
        "oasis_interests":"interest",
        "oasis_work_ctx": "work_context",
        "oasis_work_act": "work_activity",
        "oasis_work_env": "work_context",
    }.get(category, "skill")

    source_file = f"{category}_{lang}.csv"

    for _, row in df.iterrows():
        cnp_raw  = str(row.get(cnp_col,  "")).strip() if cnp_col  else ""
        code_raw = str(row.get(code_col, "")).strip() if code_col else ""
        name_raw = str(row.get(name_col, "")).strip() if name_col else ""

        # Nettoyage du code CNP (peut avoir ".0" float artifact)
        cnp_code = cnp_raw.split(".")[0] if "." in cnp_raw else cnp_raw
        cnp_code = cnp_code.strip()

        # Enregistrement du descripteur
        if code_raw and name_raw:
            desc: dict = {
                "oasis_code":           code_raw,
                "category_code":        code_raw.split(".")[0] if "." in code_raw else code_raw[:1],
                "competency_category":  cat_raw,
                "version":              "2025.0",
                "source_dataset":       "SIPeC 2025 v1.0",
                "source_file":          source_file,
            }
            if lang == "fr":
                desc["name_fr"] = name_raw
            else:
                desc["name_en"] = name_raw
            descriptors.append(desc)

        # Enregistrement du score occupation ↔ OaSIS
        if cnp_code and code_raw:
            def _safe_float(r, c):
                if not c: return None
                v = str(r.get(c, "")).strip().replace(",", ".")
                try: return float(v) if v else None
                except: return None

            rec: dict = {
                "occupation_cnp_code": cnp_code,
                "oasis_code":          code_raw,
                "importance_score":    _safe_float(row, imp_col),
                "level_score":         _safe_float(row, lv_col),
                "frequency_score":     _safe_float(row, fr_col),
                "extent_score":        _safe_float(row, ex_col),
                "is_core_competency":  False,
                "source_file":         source_file,
                "source":              "SIPeC 2025",
            }
            if imp_lbl:
                key = "importance_label_fr" if lang == "fr" else "importance_label_en"
                rec[key] = str(row.get(imp_lbl, "")).strip()
            if lv_lbl:
                key = "level_label_fr" if lang == "fr" else "level_label_en"
                rec[key] = str(row.get(lv_lbl, "")).strip()
            occ_oasis.append(rec)

    return descriptors, occ_oasis


def parse_oasis_work_environments(df: pd.DataFrame, lang: str) -> tuple[list, list]:
    """Parse les milieux de travail → (env_records, occupation_env_records)"""
    envs      = []
    occ_envs  = []

    cnp_col   = col_find(df, "cnp", "noc", "code_cnp", "profession_code")
    code_col  = col_find(df, "oasis_code", "code", "element_code", "sipec_code")
    name_col  = col_find(df, "nom", "name", "milieu", "environment")
    score_col = col_find(df, "frequence", "frequency", "score", "importance")
    scale_col = col_find(df, "scale", "echelle", "scale_id")

    for _, row in df.iterrows():
        code = str(row.get(code_col, "")).strip() if code_col else ""
        name = str(row.get(name_col, "")).strip() if name_col else ""
        cnp  = str(row.get(cnp_col,  "")).strip() if cnp_col  else ""
        cnp  = cnp.split(".")[0] if "." in cnp else cnp

        if code and name:
            env: dict = {
                "oasis_code":       code,
                "category_code":    "J",
                "environment_type": "physical",
                "version":          "2025.0",
            }
            if lang == "fr":
                env["name_fr"] = name
            else:
                env["name_en"] = name
            envs.append(env)

        if cnp and code:
            def _sf(r, c):
                if not c: return None
                v = str(r.get(c, "")).replace(",", ".")
                try: return float(v) if v.strip() else None
                except: return None

            occ_envs.append({
                "occupation_cnp_code": cnp,
                "oasis_code":          code,
                "score":               _sf(row, score_col),
                "scale_id":            str(row.get(scale_col, "FR")).strip() if scale_col else "FR",
                "source":              "SIPeC 2025",
            })

    return envs, occ_envs


def parse_cnp_job_titles(df: pd.DataFrame, lang: str) -> list[dict]:
    """Parse les appellations d'emploi CNP."""
    records = []
    cnp_col  = col_find(df, "cnp", "noc", "code", "profession_code", "code_cnp")
    titl_col = col_find(df, "appellation", "title", "titre", "job_title",
                        "alternate_title", "titre_alternatif")

    for _, row in df.iterrows():
        cnp   = str(row.get(cnp_col,  "")).strip() if cnp_col  else ""
        title = str(row.get(titl_col, "")).strip() if titl_col else ""
        cnp   = cnp.split(".")[0] if "." in cnp else cnp
        if cnp and title and len(cnp) >= 4:
            records.append({
                "occupation_cnp_code": cnp,
                "title":               title,
                "language":            lang,
                "label_type":          "synonym",
                "source_file":         f"cnp_job_titles_{lang}.csv",
            })
    return records


def parse_cnp_exclusions(df: pd.DataFrame, lang: str) -> list[dict]:
    """Parse les exclusions CNP."""
    records = []
    cnp_col  = col_find(df, "cnp", "noc", "code", "profession_code")
    excl_col = col_find(df, "exclusion", "exclure", "excluded", "code_exclu",
                        "excl_cnp", "occupation_exclue")
    note_col = col_find(df, "note", "remarque", "comment")

    for _, row in df.iterrows():
        cnp  = str(row.get(cnp_col,  "")).strip() if cnp_col  else ""
        excl = str(row.get(excl_col, "")).strip() if excl_col else ""
        note = str(row.get(note_col, "")).strip() if note_col else ""
        cnp  = cnp.split(".")[0] if "." in cnp else cnp
        if cnp and len(cnp) >= 4:
            rec: dict = {
                "occupation_cnp_code": cnp,
                "source_file":         f"cnp_exclusions_{lang}.csv",
            }
            if lang == "fr":
                rec["excluded_occupation_fr"] = excl
                rec["exclusion_note_fr"]       = note
            else:
                rec["excluded_occupation_en"]  = excl
                rec["exclusion_note_en"]        = note
            excl_code = excl[:5] if len(excl) >= 4 and excl[:4].isdigit() else None
            if excl_code:
                rec["excluded_cnp_code"] = excl_code
            records.append(rec)
    return records


def parse_cnp_requirements(df: pd.DataFrame, lang: str) -> list[dict]:
    """Parse les exigences d'emploi CNP."""
    records  = []
    cnp_col  = col_find(df, "cnp", "noc", "code", "profession_code")
    type_col = col_find(df, "type", "category", "categorie", "req_type")
    text_col = col_find(df, "exigence", "requirement", "text", "texte", "description")
    edu_col  = col_find(df, "education", "scolarite", "education_level")
    reg_col  = col_find(df, "reglement", "regulated", "regulated_profession",
                        "profession_reglementee")

    for _, row in df.iterrows():
        cnp   = str(row.get(cnp_col,  "")).strip() if cnp_col  else ""
        text  = str(row.get(text_col, "")).strip() if text_col else ""
        cnp   = cnp.split(".")[0] if "." in cnp else cnp
        if not (cnp and text and len(cnp) >= 4):
            continue
        req_type = str(row.get(type_col, "other")).strip() if type_col else "education"
        if not req_type:
            req_type = "education"

        is_reg = False
        if reg_col:
            reg_val = str(row.get(reg_col, "")).lower()
            is_reg  = reg_val in ("oui", "yes", "true", "1", "x")

        rec: dict = {
            "occupation_cnp_code": cnp,
            "requirement_type":    req_type.lower()[:30],
            "requirement_text_fr" if lang == "fr" else "requirement_text_en": text,
            "is_regulated":        is_reg,
            "source_file":         f"cnp_requirements_{lang}.csv",
        }
        # Fallback : requirement_text_fr est NOT NULL
        if "requirement_text_fr" not in rec:
            rec["requirement_text_fr"] = text

        if edu_col:
            rec["education_level_code"] = str(row.get(edu_col, "")).strip().lower()[:20] or None
        records.append(rec)
    return records


def parse_cnp_concordance(df: pd.DataFrame) -> list[dict]:
    """Parse la table de concordance 2016↔2021."""
    records   = []
    c16_col   = col_find(df, "2016", "noc_2016", "cnp_2016", "code_2016", "old_code")
    c21_col   = col_find(df, "2021", "noc_2021", "cnp_2021", "code_2021", "new_code")
    t16fr_col = col_find(df, "titre_2016", "title_2016_fr", "titre_fr_2016", "nom_2016_fr")
    t21fr_col = col_find(df, "titre_2021", "title_2021_fr", "titre_fr_2021", "nom_2021_fr")
    type_col  = col_find(df, "type", "correspondence_type", "type_correspondance")

    for _, row in df.iterrows():
        c16 = str(row.get(c16_col, "")).strip() if c16_col else ""
        c21 = str(row.get(c21_col, "")).strip() if c21_col else ""
        c16 = c16.split(".")[0] if "." in c16 else c16
        c21 = c21.split(".")[0] if "." in c21 else c21
        if not (c16 and c21) or not (c16[:4].isdigit()):
            continue
        rec: dict = {
            "cnp_2016_code":     c16,
            "cnp_2021_code":     c21,
            "correspondence_type": str(row.get(type_col, "")).strip() if type_col else "exact",
        }
        if t16fr_col:
            rec["cnp_2016_title_fr"] = str(row.get(t16fr_col, "")).strip()
        if t21fr_col:
            rec["cnp_2021_title_fr"] = str(row.get(t21fr_col, "")).strip()
        records.append(rec)
    return records


def parse_legacy_dpt(df: pd.DataFrame) -> list[dict]:
    """Parse le fichier local legacy DPT (Manuel des professions 2016)."""
    records = []
    cnp_col   = col_find(df, "cnp", "noc", "cnp_2021", "code")
    dpt_col   = col_find(df, "dpt", "dpt_code")
    riasec_col = col_find(df, "riasec", "riasec_code", "code_riasec")
    r_col = col_find(df, "r_score", "score_r", "realistic")
    i_col = col_find(df, "i_score", "score_i", "investigative")
    a_col = col_find(df, "a_score", "score_a", "artistic")
    s_col = col_find(df, "s_score", "score_s", "social")
    e_col = col_find(df, "e_score", "score_e", "enterprising")
    c_col = col_find(df, "c_score", "score_c", "conventional")
    phys_col = col_find(df, "physical", "physique", "exigences_physiques")

    def _sf(r, c):
        if not c: return None
        v = str(r.get(c, "")).replace(",", ".")
        try: return float(v) if v.strip() else None
        except: return None

    for _, row in df.iterrows():
        cnp = str(row.get(cnp_col, "")).strip() if cnp_col else ""
        cnp = cnp.split(".")[0] if "." in cnp else cnp
        if not cnp or len(cnp) < 4:
            continue

        rec: dict = {"occupation_cnp_code": cnp}
        if dpt_col:
            rec["dpt_code"] = str(row.get(dpt_col, "")).strip()
        if riasec_col:
            rec["riasec_ca_code"] = str(row.get(riasec_col, "")).strip()
        for score_key, col in [("riasec_ca_score_r", r_col), ("riasec_ca_score_i", i_col),
                                ("riasec_ca_score_a", a_col), ("riasec_ca_score_s", s_col),
                                ("riasec_ca_score_e", e_col), ("riasec_ca_score_c", c_col)]:
            val = _sf(row, col)
            if val is not None:
                rec[score_key] = val
        if phys_col:
            phys_text = str(row.get(phys_col, "")).strip()
            if phys_text:
                rec["physical_requirements"] = {"description": phys_text}
        records.append(rec)
    return records


# ─────────────────────────────────────────────────────────────
# PHASE 3 : UPSERT TAXONOMIE
# ─────────────────────────────────────────────────────────────

def phase3_upsert_taxonomy(conn, all_files: list[dict]):
    log.info("\n[PHASE 3] Upsert taxonomie (descripteurs, milieux, échelles)")

    oasis_desc_map   = {}  # oasis_code → record (merge FR+EN)
    scale_labels_all = []
    work_env_map     = {}

    for f in all_files:
        cat  = f["category"]
        lang = f["lang"]
        df   = read_csv_flexible(f["local_path"])
        if df.empty:
            continue

        if cat == "oasis_guide":
            descs, scales = parse_oasis_guide(df, lang)
            for d in descs:
                code = d["oasis_code"]
                if code not in oasis_desc_map:
                    oasis_desc_map[code] = d
                else:
                    oasis_desc_map[code].update({k: v for k, v in d.items() if v})
            scale_labels_all.extend(scales)

        elif cat in ("oasis_skills", "oasis_abilities", "oasis_personal",
                     "oasis_knowledge", "oasis_interests", "oasis_work_ctx", "oasis_work_act"):
            descs, _ = parse_oasis_scores(df, cat, lang)
            for d in descs:
                code = d["oasis_code"]
                if code not in oasis_desc_map:
                    oasis_desc_map[code] = d
                else:
                    oasis_desc_map[code].update({k: v for k, v in d.items() if v})

        elif cat == "oasis_work_env":
            envs, _ = parse_oasis_work_environments(df, lang)
            for e in envs:
                code = e["oasis_code"]
                if code not in work_env_map:
                    work_env_map[code] = e
                else:
                    work_env_map[code].update({k: v for k, v in e.items() if v})

    # Upsert oasis_descriptors
    desc_records = list(oasis_desc_map.values())
    # S'assurer que name_fr est présent (non-null)
    for r in desc_records:
        if "name_fr" not in r or not r["name_fr"]:
            r["name_fr"] = r.get("name_en", r.get("oasis_code", "?"))
    upsert_chunks(conn, "oasis_descriptors", desc_records, ["oasis_code"])

    # Upsert oasis_work_environments
    env_records = list(work_env_map.values())
    for r in env_records:
        if "name_fr" not in r or not r["name_fr"]:
            r["name_fr"] = r.get("name_en", r.get("oasis_code", "?"))
    upsert_chunks(conn, "oasis_work_environments", env_records, ["oasis_code"])

    # Upsert oasis_scale_labels (dédupliqué)
    seen_scales = set()
    unique_scales = []
    for s in scale_labels_all:
        key = (s["scale_id"], s["level_value"], s.get("applicable_category"))
        if key not in seen_scales:
            seen_scales.add(key)
            unique_scales.append(s)
    upsert_chunks(conn, "oasis_scale_labels", unique_scales,
                  ["scale_id", "level_value", "applicable_category"])

    log.info(f"  → {len(desc_records)} descripteurs OaSIS | "
             f"{len(env_records)} milieux | {len(unique_scales)} échelles")


# ─────────────────────────────────────────────────────────────
# PHASE 4 : UPSERT ENRICHISSEMENT OCCUPATIONS
# ─────────────────────────────────────────────────────────────

def phase4_upsert_occupations(conn, all_files: list[dict]):
    log.info("\n[PHASE 4] Upsert enrichissement CNP 2021")

    job_titles   = []
    exclusions   = []
    requirements = []
    concordances = []

    for f in all_files:
        cat  = f["category"]
        lang = f["lang"]
        df   = read_csv_flexible(f["local_path"])
        if df.empty:
            continue

        if cat == "cnp_job_titles":
            job_titles.extend(parse_cnp_job_titles(df, lang))
        elif cat == "cnp_exclusions":
            exclusions.extend(parse_cnp_exclusions(df, lang))
        elif cat == "cnp_requirements":
            requirements.extend(parse_cnp_requirements(df, lang))
        elif cat == "cnp_concordance":
            concordances.extend(parse_cnp_concordance(df))

    # Filtre par cnp_code existant (évite FK violation)
    log.info("  [CHECK] Recuperation des codes CNP existants...")
    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT cnp_code FROM "occupations"')
            valid_codes = {row[0] for row in _cur.fetchall()}
        log.info(f"  OK  {len(valid_codes)} professions en base")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de filtrer les codes : {e}")
        valid_codes = None

    def filter_valid(records, field="occupation_cnp_code"):
        if valid_codes is None:
            return records
        return [r for r in records if r.get(field) in valid_codes]

    upsert_chunks(conn, "occupation_job_titles",     filter_valid(job_titles),   ["id"])
    upsert_chunks(conn, "occupation_exclusions",     filter_valid(exclusions),   ["id"])
    upsert_chunks(conn, "occupation_requirements",   filter_valid(requirements), ["id"])
    upsert_chunks(conn, "cnp_concordance_2016_2021", concordances,              ["cnp_2016_code", "cnp_2021_code"])

    # Legacy DPT — try/except avec fallback gracieux
    _ingest_legacy_dpt(conn, valid_codes)


def _ingest_legacy_dpt(conn, valid_codes):
    """Tente de lire ./data/legacy_dpt.csv — warning si absent (try/except gracieux)."""
    dpt_path = DATA_DIR / "legacy_dpt.csv"
    if not dpt_path.exists():
        log.warning(
            "  [WARN] Fichier legacy DPT introuvable : data/legacy_dpt.csv\n"
            "         → Ingestion DPT ignorée. Fournissez ce fichier manuellement plus tard."
        )
        return
    try:
        df = read_csv_flexible(dpt_path)
        if df.empty:
            log.warning("  [WARN] legacy_dpt.csv vide — ignoré.")
            return
        records = parse_legacy_dpt(df)
        if valid_codes:
            records = [r for r in records if r["occupation_cnp_code"] in valid_codes]
        upsert_chunks(conn, "occupation_legacy_dpt", records, ["occupation_cnp_code"])
        log.info(f"  [DPT] {len(records)} enregistrements legacy ingérés")
    except Exception as e:
        log.warning(f"  [WARN] Erreur lecture legacy_dpt.csv : {e} — ignoré.")


# ─────────────────────────────────────────────────────────────
# PHASE 5 : UPSERT LIAISONS OaSIS + RAFRAÎCHISSEMENT VUE
# ─────────────────────────────────────────────────────────────

def phase5_upsert_oasis_profiles(conn, all_files: list[dict]):
    log.info("\n[PHASE 5] Upsert profils OaSIS occupation_oasis + milieux")

    # Codes OaSIS valides en base (pour éviter FK violation)
    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT oasis_code FROM "oasis_descriptors"')
            valid_oasis = {row[0] for row in _cur.fetchall()}
            _cur.execute('SELECT cnp_code FROM "occupations"')
            valid_cnp = {row[0] for row in _cur.fetchall()}
        log.info(f"  [CHECK] {len(valid_oasis)} codes OaSIS | {len(valid_cnp)} CNP")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de valider les FKs : {e}")
        valid_oasis = None
        valid_cnp   = None

    occ_oasis_map = {}   # (cnp, oasis_code) → record — merge FR+EN
    occ_env_map   = {}   # (cnp, oasis_code) → record

    for f in all_files:
        cat  = f["category"]
        lang = f["lang"]
        df   = read_csv_flexible(f["local_path"])
        if df.empty:
            continue

        if cat in ("oasis_skills", "oasis_abilities", "oasis_personal",
                   "oasis_knowledge", "oasis_interests", "oasis_work_ctx", "oasis_work_act"):
            _, scores = parse_oasis_scores(df, cat, lang)
            for s in scores:
                key = (s["occupation_cnp_code"], s["oasis_code"])
                if key not in occ_oasis_map:
                    occ_oasis_map[key] = s
                else:
                    # Merge : on complète les libellés manquants
                    existing = occ_oasis_map[key]
                    for k, v in s.items():
                        if v is not None and (k not in existing or existing[k] is None):
                            existing[k] = v

        elif cat == "oasis_work_env":
            _, env_scores = parse_oasis_work_environments(df, lang)
            for e in env_scores:
                key = (e["occupation_cnp_code"], e["oasis_code"])
                if key not in occ_env_map:
                    occ_env_map[key] = e
                else:
                    occ_env_map[key].update({k: v for k, v in e.items() if v})

    # Filtrage FK
    occ_oasis_records = list(occ_oasis_map.values())
    if valid_cnp and valid_oasis:
        occ_oasis_records = [
            r for r in occ_oasis_records
            if r["occupation_cnp_code"] in valid_cnp
            and r["oasis_code"] in valid_oasis
        ]

    upsert_chunks(conn, "occupation_oasis",
                  occ_oasis_records, ["occupation_cnp_code", "oasis_code"])

    occ_env_records = list(occ_env_map.values())
    if valid_cnp:
        occ_env_records = [r for r in occ_env_records
                           if r["occupation_cnp_code"] in valid_cnp]
    # Ne garder que les codes de milieux qui existent
    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT oasis_code FROM "oasis_work_environments"')
            valid_env = {row[0] for row in _cur.fetchall()}
        occ_env_records = [r for r in occ_env_records if r["oasis_code"] in valid_env]
    except Exception:
        pass
    upsert_chunks(conn, "occupation_work_environments",
                  occ_env_records, ["occupation_cnp_code", "oasis_code", "scale_id"])

    # Mise à jour du flag oasis_mapped sur occupations
    mapped_cnp = {r["occupation_cnp_code"] for r in occ_oasis_records}
    if mapped_cnp:
        log.info(f"  [FLAG] Mise a jour oasis_mapped sur {len(mapped_cnp)} professions")
        try:
            mapped_list = list(mapped_cnp)
            with conn.cursor() as _cur:
                _cur.execute(
                    'UPDATE "occupations" SET oasis_mapped = TRUE WHERE cnp_code = ANY(%s)',
                    (mapped_list,)
                )
            conn.commit()
        except Exception as e:
            conn.rollback()
            log.warning(f"  [WARN] oasis_mapped update: {e}")

    # Rafraichissement de la vue materialisee via psycopg2 (conn partagee)
    log.info("  [VIEW] REFRESH MATERIALIZED VIEW mv_occupation_full_profile...")
    try:
        old_ac = conn.autocommit
        conn.autocommit = True
        with conn.cursor() as _cur:
            _cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile")
        conn.autocommit = old_ac
        log.info("  [VIEW] Vue materialisee rafraichie OK")
    except Exception as e:
        log.warning(f"  [WARN] Rafraichissement vue : {e}")

    log.info(f"  → {len(occ_oasis_records)} scores OaSIS | {len(occ_env_records)} milieux")


# ─────────────────────────────────────────────────────────────
# SANITY CHECK — Requêtes de vérification
# ─────────────────────────────────────────────────────────────

def sanity_check(sb: Client, conn=None):
    log.info("\n" + "="*60)
    log.info("SANITY CHECK — État de la base après ingestion")
    log.info("="*60)

    tables = [
        ("occupations",               "cnp_code"),
        ("oasis_descriptors",         "oasis_code"),
        ("oasis_scale_labels",        "id"),
        ("oasis_work_environments",   "oasis_code"),
        ("occupation_oasis",          "occupation_cnp_code"),
        ("occupation_work_environments","occupation_cnp_code"),
        ("occupation_job_titles",     "id"),
        ("occupation_exclusions",     "id"),
        ("occupation_requirements",   "id"),
        ("cnp_concordance_2016_2021", "id"),
        ("occupation_legacy_dpt",     "occupation_cnp_code"),
    ]

    results = {}
    for table, pk in tables:
        try:
            if conn:
                count = count_table(conn, table)
            else:
                resp = sb.table(table).select(pk, count="exact").limit(1).execute()
                count = resp.count if resp.count is not None else len(resp.data)
            results[table] = count
            status = "OK" if count > 0 else "!! VIDE"
            log.info(f"  {status:3} {table:<40} {count:>8} lignes")
        except Exception as e:
            results[table] = f"ERR: {e}"
            log.error(f"  ✗   {table:<40} {e}")

    # Check professions avec OaSIS mappe
    try:
        resp = sb.table("occupations")\
                 .select("cnp_code", count="exact")\
                 .eq("oasis_mapped", True)\
                 .limit(1).execute()
        mapped = resp.count or 0
        log.info(f"\n  OK  professions avec OaSIS mappe         : {mapped:>8}")
    except Exception as e:
        log.warning(f"  !!  oasis_mapped check: {e}")

    # Check vue materialisee
    try:
        resp = sb.table("mv_occupation_full_profile").select("cnp_code", count="exact")\
                 .limit(1).execute()
        mv_count = resp.count or 0
        log.info(f"  OK  mv_occupation_full_profile            : {mv_count:>8} lignes")
    except Exception as e:
        log.warning(f"  !!  mv_occupation_full_profile: {e}")

    log.info("="*60)
    return results


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

def parse_args():
    p = argparse.ArgumentParser(description="Le Siphon V2 — Trajektia ETL")
    p.add_argument("--cache-only", action="store_true",
                   help="N'utilise que le cache local — aucun téléchargement")
    p.add_argument("--phase", type=int, default=0,
                   help="0=toutes | 1=scrape | 2=skip | 3=taxonomie | 4=occupations | 5=oasis")
    p.add_argument("--dataset", default="all",
                   help="Dataset cible : sipec_oasis | cnp_2021 | all")
    return p.parse_args()


def main():
    args = parse_args()
    start_time = datetime.now()

    log.info("="*60)
    log.info("LE SIPHON V2 — TRAJEKTIA ETL Pipeline")
    log.info(f"Démarrage : {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    log.info(f"Cache-only : {args.cache_only}")
    log.info(f"Phase      : {args.phase or 'toutes'}")
    log.info("="*60)

    # Connexion Supabase
    conn = get_pgconn()
    log.info("OK Connexion PostgreSQL directe etablie")
    conn = get_pgconn()
    log.info("OK Connexion PostgreSQL directe etablie")
    conn = get_pgconn()
    log.info("OK Connexion PostgreSQL directe etablie")
    sb = get_supabase()
    log.info("✓ Connexion Supabase établie")

    # PHASE 1 — Scraping et téléchargement
    all_files = []
    if args.phase in (0, 1):
        datasets_to_scrape = (
            ["sipec_oasis", "cnp_2021"] if args.dataset == "all"
            else [args.dataset]
        )
        for dataset_id in datasets_to_scrape:
            if dataset_id in DATASETS:
                files = scrape_dataset_files(dataset_id, args.cache_only)
                all_files.extend(files)

        log.info(f"\n[PHASE 1] Total : {len(all_files)} fichiers téléchargés/en cache")
    else:
        # Rechargement depuis le cache pour les phases isolées
        log.info("[SKIP] Phase 1 — rechargement depuis le cache")
        for path in CACHE_DIR.glob("*.csv"):
            cat  = classify_file(path.name)
            lang = "fr" if ("_fr" in path.name.lower() or "-fr" in path.name.lower()) else "en"
            all_files.append({
                "name": path.name, "url": "", "lang": lang,
                "category": cat, "filename": path.name,
                "local_path": path,
            })
        log.info(f"  → {len(all_files)} fichiers en cache")

    # PHASE 3 — Upsert taxonomie
    if args.phase in (0, 3):
        phase3_upsert_taxonomy(conn, all_files)

    # PHASE 4 — Upsert enrichissement occupations
    if args.phase in (0, 4):
        phase4_upsert_occupations(conn, all_files)

    # PHASE 5 — Upsert profils OaSIS
    if args.phase in (0, 5):
        phase5_upsert_oasis_profiles(conn, all_files)

    # SANITY CHECK
    if args.phase == 0:
        results = sanity_check(sb, conn)

    elapsed = (datetime.now() - start_time).total_seconds()
    log.info(f"\n✓ Le Siphon V2 terminé en {elapsed:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
