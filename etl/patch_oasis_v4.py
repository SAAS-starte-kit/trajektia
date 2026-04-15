#!/usr/bin/env python3
"""
patch_oasis_v4.py — Correction ETL OaSIS & Hiérarchie CNP
==========================================================
Corrige les problèmes identifiés dans la session précédente :

1. oasis_descriptors corrompus → réingestion depuis guide_oasis_2025_v4.0.csv
2. occupation_oasis incomplet (50 lignes O*NET) → réingestion correcte depuis
   fichiers score OaSIS (format pivot wide → long)
3. cnp_hierarchy vide → ingestion depuis fichiers CNP 2021
4. oasis_work_environments → ingestion depuis workplaces-employers_oasis

Usage :
    python etl/patch_oasis_v4.py [--step 1|2|3|4|all]
"""

import os
import sys
import re
import logging
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).parent.parent / ".env")

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

CACHE_DIR = Path(__file__).parent / ".cache_v2"
CHUNK = 500

# Fichiers scores OaSIS (format pivot wide)
# Colonnes: [Code OaSIS] [OaSIS 2021 Labels] [Competence1] [Competence2] ...
SCORE_FILES = {
    "skills_oasis_2025_v1.1.csv":           "skill",
    "abilities_oasis_2025_v1.1.csv":        "ability",
    "personal-attributes_oasis_2025_v1.1.csv": "personal_attribute",
    "knowledge_oasis_2025_v.1.1.csv":       "knowledge",
    "interests_oasis_2025_v1.1.csv":        "interest",
    "work-activities_oasis_2025_v1.1.csv":  "work_activity",
    "work-context_oasis_2025_v1.1.csv":     "work_context",
}

# Fichiers SIPeC (version FR)
SCORE_FILES_FR = {
    "competences_sipec_2025_v1.1.csv":         "skill",
    "habilites_oasis_2025_v1.1.csv":           "ability",
    "attributs-personnels_sipec_2025_v1.1.csv": "personal_attribute",
    "connaissance_sipec_2025_v.1.1.csv":       "knowledge",
    "interets_sipec_2025_v1.1.csv":            "interest",
    "activites-travail_sipec_2025_v1.1.csv":   "work_activity",
    "context-travail_sipec_2025_v1.1.csv":     "work_context",
}


# ─────────────────────────────────────────────────────────────
# DB HELPERS
# ─────────────────────────────────────────────────────────────
def get_conn():
    for key in ["SUPABASE_DB_URL_DIRECT", "SUPABASE_DB_URL"]:
        url = os.getenv(key)
        if not url:
            continue
        try:
            c = psycopg2.connect(url, connect_timeout=15)
            c.autocommit = False
            log.info(f"  [DB] Connecté via {key}")
            return c
        except Exception as e:
            log.warning(f"  [WARN] {key}: {e}")
    raise RuntimeError("Impossible de se connecter à PostgreSQL")


def upsert(conn, table: str, records: list[dict], conflict_cols: list[str]) -> int:
    if not records:
        log.info(f"  [SKIP] {table} — 0 enregistrements")
        return 0
    all_cols = list({k for r in records for k in r})
    exclude = set(conflict_cols) | {"id", "created_at", "ingested_at"}
    update_cols = [c for c in all_cols if c not in exclude]
    col_str = ", ".join(f'"{c}"' for c in all_cols)
    conflict_str = ", ".join(f'"{c}"' for c in conflict_cols)
    update_str = (
        ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
        if update_cols
        else f'"{conflict_cols[0]}" = "{conflict_cols[0]}"'
    )
    sql = (
        f'INSERT INTO "{table}" ({col_str}) VALUES %s '
        f"ON CONFLICT ({conflict_str}) DO UPDATE SET {update_str}"
    )
    inserted = 0
    with conn.cursor() as cur:
        for i in range(0, len(records), CHUNK):
            batch = records[i : i + CHUNK]
            values = [tuple(r.get(c) for c in all_cols) for r in batch]
            try:
                execute_values(cur, sql, values, page_size=CHUNK)
                conn.commit()
                inserted += len(batch)
            except Exception as e:
                conn.rollback()
                log.error(f"  [ERR] {table} batch {i // CHUNK}: {e}")
    log.info(f"  [UPSERT] {table} — {inserted}/{len(records)}")
    return inserted


def truncate(conn, table: str):
    """Vide une table — exécuté en autocommit via une connexion séparée."""
    # psycopg2 ne permet pas set_session dans une transaction active
    # On utilise une nouvelle connexion autocommit
    for key in ["SUPABASE_DB_URL_DIRECT", "SUPABASE_DB_URL"]:
        url = os.getenv(key)
        if not url:
            continue
        try:
            c2 = psycopg2.connect(url, connect_timeout=10)
            c2.autocommit = True
            with c2.cursor() as cur:
                cur.execute(f'TRUNCATE TABLE "{table}" CASCADE')
            c2.close()
            log.info(f"  [TRUNCATE] {table} videe")
            return
        except Exception as e:
            log.warning(f"  [WARN] truncate {table}: {e}")
            continue
    # Fallback: DELETE dans la connexion courante
    try:
        conn.rollback()
        with conn.cursor() as cur:
            cur.execute(f'DELETE FROM "{table}"')
        conn.commit()
        log.info(f"  [DELETE] {table} videe (fallback)")
    except Exception as e:
        conn.rollback()
        log.error(f"  [ERR] Impossible de vider {table}: {e}")



def count_table(conn, table: str) -> int:
    with conn.cursor() as cur:
        cur.execute(f'SELECT COUNT(*) FROM "{table}"')
        return cur.fetchone()[0]


# ─────────────────────────────────────────────────────────────
# CSV HELPERS
# ─────────────────────────────────────────────────────────────
def read_csv(fname: str, force_sep: str = None) -> pd.DataFrame:
    path = CACHE_DIR / fname
    if not path.exists():
        log.warning(f"  [MISSING] {fname}")
        return pd.DataFrame()
    
    separators = [force_sep] if force_sep else [";", ",", "\t"]
    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        for sep in separators:
            try:
                df = pd.read_csv(path, sep=sep, encoding=enc, dtype=str, low_memory=False)
                if len(df.columns) >= 2:
                    # BOM cleanup + normalisation
                    df.columns = [c.strip().lstrip("\ufeff") for c in df.columns]
                    df = df.fillna("").dropna(how="all")
                    log.info(f"  [CSV] {fname} — {len(df)} lignes, {len(df.columns)} cols (enc={enc}, sep={repr(sep)})")
                    return df
            except Exception:
                continue
    log.error(f"  [ERR] Impossible de lire {fname}")
    return pd.DataFrame()


# ─────────────────────────────────────────────────────────────
# ÉTAPE 1 : oasis_descriptors depuis le guide
# ─────────────────────────────────────────────────────────────
def step1_oasis_descriptors(conn):
    """
    Réingestion propre des descripteurs OaSIS depuis le fichier guide.
    """
    log.info("\n=== ÉTAPE 1 — oasis_descriptors depuis guide ===")
    
    records_en = _parse_guide("guide_oasis_2025_v4.0.csv", "en")
    records_fr = _parse_guide("guide-2025-version-4.0-fr.csv", "fr")
    
    # Fusion EN + FR par code
    merged: dict[str, dict] = {}
    for r in records_en:
        merged[r["oasis_code"]] = r
    for r in records_fr:
        code = r["oasis_code"]
        if code in merged:
            merged[code].update({k: v for k, v in r.items() if v and k not in ("oasis_code",)})
        else:
            merged[code] = r
    
    final = list(merged.values())
    
    # Nettoyage obligatoire : name_en NOT NULL et name_fr NOT NULL
    # Filtrer les codes invalides (ex: "Column12" = artefact d'en-tête)
    valid = []
    for r in final:
        code = r.get("oasis_code", "")
        # Un code OaSIS valide commence par une lettre + chiffres ou est hiérarchique
        if not code or code.startswith("Column") or code == "Code":
            continue
        # name_en = fallback vers name_fr si absent
        if not r.get("name_en"):
            r["name_en"] = r.get("name_fr", code)
        # name_fr = fallback vers name_en si absent
        if not r.get("name_fr"):
            r["name_fr"] = r.get("name_en", code)
        valid.append(r)
    
    log.info(f"  [TOTAL] {len(valid)} descripteurs valides à insérer (filtrés depuis {len(final)})")
    
    # Vider et réinsérer proprement
    truncate(conn, "oasis_descriptors")
    return upsert(conn, "oasis_descriptors", valid, ["oasis_code"])




def _parse_guide(fname: str, lang: str) -> list[dict]:
    """Parse le fichier guide OaSIS — le fichier a 2 lignes d'en-tête."""
    path = CACHE_DIR / fname
    if not path.exists():
        log.warning(f"  [MISSING] {fname}")
        return []
    
    # Lecture directe avec skiprows=1 pour sauter la 1ère ligne d'en-tête (Column1...)
    # La vraie ligne d'en-tête est à la position 1 (0-indexed)
    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        try:
            df = pd.read_csv(path, sep=";", encoding=enc, dtype=str,
                             skiprows=1, header=0, low_memory=False)
            if len(df.columns) >= 3:
                df.columns = ["code", "structure_type", "name", "description"] + \
                             [f"extra{i}" for i in range(len(df.columns) - 4)] \
                             if len(df.columns) >= 4 else ["code", "structure_type", "name"]
                df = df[df["code"] != "Code"].copy()  # retirer toute ligne résiduelle
                df = df.fillna("").dropna(how="all")
                log.info(f"  [CSV] {fname} — {len(df)} lignes (enc={enc}, skiprows=1)")
                break
        except Exception:
            continue
    else:
        log.error(f"  [ERR] Impossible de lire {fname}")
        return []
    
    records = []
    CATEGORY_MAP = {
        "A": "ability",
        "B": "personal_attribute",
        "C": "interest",
        "F": "skill",
        "G": "knowledge",
        "J": "work_context",
        "K": "work_activity",
    }
    
    for _, row in df.iterrows():
        code = str(row.get("code", "")).strip()
        name = str(row.get("name", "")).strip()
        desc = str(row.get("description", "")).strip()
        stype = str(row.get("structure_type", "")).strip()
        
        if not code or not name or code in ("Code", ""):
            continue
        
        # Seulement les Descriptors (feuilles de l'arbre) et catégories/sous-catégories
        prefix = code.split(".")[0].upper()
        cat = CATEGORY_MAP.get(prefix)
        
        # Détermine les codes hiérarchiques (category/subcategory/group)
        code_parts = code.split(".")
        cat_code = code_parts[0].upper() if code_parts else prefix
        subcat_code = (code_parts[0] + "." + code_parts[1]) if len(code_parts) >= 2 else None
        group_code = (".".join(code_parts[:3])) if len(code_parts) >= 3 else None
        
        # Niveau: A=category, A.01=subcategory, A.01.a=group, A.01.a.01=descriptor
        if len(code_parts) == 1 and not code[1:2].isdigit():
            pass  # category (A, B, C...)
        
        rec: dict = {
            "oasis_code":          code,
            "category_code":       cat_code,
            "competency_category": cat,
            "version":             "2025.0",
            "source_dataset":      "SIPeC 2025 v4.0 Guide",
        }
        if lang == "fr":
            rec["name_fr"] = name
            if desc and desc != "nan":
                rec["description_fr"] = desc
        else:
            rec["name_en"] = name
            if desc and desc != "nan":
                rec["description_en"] = desc
        records.append(rec)
    
    log.info(f"  [{lang.upper()}] {len(records)} descripteurs depuis {fname}")
    return records


# ─────────────────────────────────────────────────────────────
# ÉTAPE 2 : occupation_oasis depuis fichiers score pivot
# ─────────────────────────────────────────────────────────────
def step2_occupation_oasis(conn):
    """
    Réingestion des scores occupation ↔ OaSIS.
    
    Les fichiers sont au format WIDE/PIVOT :
    - Ligne = 1 profession (code OaSIS)
    - Colonnes = scores pour chaque compétence
    
    Le code OaSIS de la PROFESSION ≠ code OaSIS du DESCRIPTEUR.
    Les scores OaSIS de professions sont décrit par des codes de descripteurs
    qui correspondent aux en-têtes de colonnes dans le guide.
    
    Stratégie : 
    - Charger les codes descripteurs valides depuis oasis_descriptors
    - Pour chaque fichier score : melt() wide→long, mapper le nom de colonne
      vers le code oasis_code du descripteur correspondant
    """
    log.info("\n=== ÉTAPE 2 — occupation_oasis depuis fichiers score (pivot→long) ===")
    
    # Codes CNP valides
    with conn.cursor() as cur:
        cur.execute('SELECT cnp_code FROM "occupations"')
        valid_cnp = {row[0] for row in cur.fetchall()}
    log.info(f"  [REF] {len(valid_cnp)} codes CNP 2021 en base")
    
    # Map: name_en (insensible casse) → oasis_code depuis oasis_descriptors
    with conn.cursor() as cur:
        cur.execute('SELECT oasis_code, name_en, name_fr FROM "oasis_descriptors"')
        rows = cur.fetchall()
    
    # Normaliseur de noms
    def norm(s: str) -> str:
        return re.sub(r"\s+", " ", str(s).lower().strip())
    
    name_en_to_code = {norm(r[1]): r[0] for r in rows if r[1]}
    name_fr_to_code = {norm(r[2]): r[0] for r in rows if r[2]}
    log.info(f"  [REF] {len(name_en_to_code)} descripteurs EN mappables")
    
    all_records: dict[tuple, dict] = {}  # (oasis_prof_code, desc_code) → record
    total_matched = 0
    total_skipped = 0
    
    # Traitement fichiers EN
    for fname, category in SCORE_FILES.items():
        n_m, n_s = _process_wide_file(
            fname, "en", category, valid_cnp, name_en_to_code, all_records
        )
        total_matched += n_m
        total_skipped += n_s
    
    # Traitement fichiers FR (complément / merge)
    for fname, category in SCORE_FILES_FR.items():
        n_m, n_s = _process_wide_file(
            fname, "fr", category, valid_cnp, name_fr_to_code, all_records
        )
        total_matched += n_m
        total_skipped += n_s
    
    records = list(all_records.values())
    log.info(f"  [TOTAL] {len(records)} liaisons occupation↔OaSIS ({total_skipped} colonnes non mappées)")
    
    # Vider et réinsérer
    truncate(conn, "occupation_oasis")
    n = upsert(conn, "occupation_oasis", records, ["occupation_cnp_code", "oasis_code"])
    
    # Mettre à jour le flag oasis_mapped
    if records:
        mapped_cnp = list({r["occupation_cnp_code"] for r in records})
        try:
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE "occupations" SET oasis_mapped = TRUE WHERE cnp_code = ANY(%s)',
                    (mapped_cnp,)
                )
            conn.commit()
            log.info(f"  [FLAG] oasis_mapped=TRUE sur {len(mapped_cnp)} professions")
        except Exception as e:
            conn.rollback()
            log.warning(f"  [WARN] flag oasis_mapped: {e}")
    
    return n


def _process_wide_file(fname: str, lang: str, category: str,
                        valid_cnp: set, name_to_code: dict,
                        all_records: dict) -> tuple[int, int]:
    """
    Traite un fichier score pivot (wide format) et ajoute les liaisons dans all_records.
    Retourne (nb_matched, nb_skipped).
    """
    df = read_csv(fname, force_sep=";")
    if df.empty:
        return 0, 0
    
    cols = list(df.columns)
    
    # Col 0: Code OaSIS de la profession (ex: "00010.00")
    # Col 1: Label de la profession (ex: "Legislators")
    # Cols 2..N: Scores pour chaque compétence (nom de competence = en-tête)
    if len(cols) < 3:
        log.warning(f"  [SKIP] {fname} — trop peu de colonnes ({len(cols)})")
        return 0, 0
    
    prof_code_col = cols[0]
    score_cols = cols[2:]  # Skip col 0 (code) et col 1 (label)
    
    # Map nom de colonne → code descripteur OaSIS
    def norm(s: str) -> str:
        return re.sub(r"\s+", " ", str(s).lower().strip())
    
    col_to_desc_code: dict[str, str] = {}
    unmatched_cols: list[str] = []
    for col in score_cols:
        code = name_to_code.get(norm(col))
        if code:
            col_to_desc_code[col] = code
        else:
            unmatched_cols.append(col)
    
    if unmatched_cols and lang == "en":
        log.warning(f"  [{fname}] {len(unmatched_cols)} colonnes non mappées: {unmatched_cols[:3]}...")
    
    matched = 0
    
    for _, row in df.iterrows():
        # Code OaSIS de la profession (ex: "00010.00")
        prof_raw = str(row[prof_code_col]).strip()
        if not prof_raw or prof_raw in ("Code OaSIS", "Code SIPeC", ""):
            continue
        
        # Normalise le code profession: "00010.00" → reste tel quel (c'est le cnp_code)
        # Ces codes correspondent aux cnp_code dans la table occupations
        prof_code = prof_raw.strip()
        
        if prof_code not in valid_cnp:
            # Essaie sans le .00 final
            alt = prof_code.rstrip("0").rstrip(".")
            if alt in valid_cnp:
                prof_code = alt
            else:
                continue
        
        for col, desc_code in col_to_desc_code.items():
            val_raw = str(row.get(col, "")).strip()
            if not val_raw or val_raw == "":
                continue
            try:
                score = float(val_raw)
            except ValueError:
                continue
            
            key = (prof_code, desc_code)
            if key not in all_records:
                all_records[key] = {
                    "occupation_cnp_code": prof_code,
                    "oasis_code":          desc_code,
                    "importance_score":    score,
                    "is_core_competency":  False,
                    "source_file":         fname,
                    "source":              "OaSIS-SIPeC-2025",
                }
                matched += 1
            else:
                # Completement des données manquantes
                existing = all_records[key]
                if existing.get("importance_score") is None:
                    existing["importance_score"] = score
    
    log.info(f"  [{fname[:40]:40s}] {matched} nouvelles liaisons ajoutées")
    return matched, len(unmatched_cols)


# ─────────────────────────────────────────────────────────────
# ÉTAPE 3 : cnp_hierarchy
# ─────────────────────────────────────────────────────────────
def step3_cnp_hierarchy(conn):
    """
    Ingestion de la hiérarchie CNP depuis les données disponibles en cache.
    Utilise example-titles et lead-statement comme proxy pour construire
    la structure de la hiérarchie OaSIS/CNP.
    """
    log.info("\n=== ÉTAPE 3 — cnp_hierarchy OaSIS ===")
    
    # Vérifier la structure de la table cnp_hierarchy
    with conn.cursor() as cur:
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'cnp_hierarchy'
            ORDER BY ordinal_position
        """)
        cols = cur.fetchall()
    log.info(f"  [SCHEMA] cnp_hierarchy: {[c[0] for c in cols]}")
    
    if not cols:
        log.warning("  [SKIP] Table cnp_hierarchy n'existe pas")
        return 0
    
    col_names = [c[0] for c in cols]
    
    # Charger lead-statement (descriptions de professions par code OaSIS)
    df_lead = read_csv("lead-statement_oasis_2025_v1.0.csv", force_sep=",")
    if df_lead.empty:
        # Essai sans force_sep
        df_lead = read_csv("lead-statement_oasis_2025_v1.0.csv")
    if df_lead.empty:
        log.warning("  [SKIP] lead-statement manquant")
        return 0
    
    # Charger enonce-principal (version FR)
    df_lead_fr = read_csv("enonce-principal_sipec_2025_v1.0.csv", force_sep=",")
    if df_lead_fr.empty:
        df_lead_fr = read_csv("enonce-principal_sipec_2025_v1.0.csv")
    
    # Codes CNP valides
    with conn.cursor() as cur:
        cur.execute('SELECT cnp_code, title_en, title_fr, broad_category_code FROM "occupations"')
        occ_rows = cur.fetchall()
    
    occ_map = {r[0]: {"title_en": r[1], "title_fr": r[2], "broad_category_code": r[3]} for r in occ_rows}
    
    # Parser lead-statement EN
    cols_lead = list(df_lead.columns)
    code_col = cols_lead[0]  # "OaSIS profile code"
    lead_col = cols_lead[1] if len(cols_lead) > 1 else None
    
    lead_en: dict[str, str] = {}
    for _, row in df_lead.iterrows():
        code = str(row[code_col]).strip()
        lead = str(row[lead_col]).strip() if lead_col else ""
        if code and lead:
            lead_en[code] = lead
    
    # Parser lead-statement FR
    lead_fr: dict[str, str] = {}
    if not df_lead_fr.empty:
        cols_fr = list(df_lead_fr.columns)
        code_col_fr = cols_fr[0]
        lead_col_fr = cols_fr[1] if len(cols_fr) > 1 else None
        for _, row in df_lead_fr.iterrows():
            code = str(row[code_col_fr]).strip()
            lead = str(row[lead_col_fr]).strip() if lead_col_fr else ""
            if code and lead:
                lead_fr[code] = lead
    
    log.info(f"  [LEADS] {len(lead_en)} EN, {len(lead_fr)} FR")
    
    # Construire les enregistrements hiérarchie
    # Schéma réel: code (PK), level (smallint), parent_code, name_fr (NOT NULL),
    #              name_en, teer_level, description_fr, description_en
    records = []
    all_codes = set(lead_en.keys()) | set(lead_fr.keys()) | set(occ_map.keys())
    
    for cnp in all_codes:
        occ = occ_map.get(cnp, {})
        # level est un smallint: longueur du code (sans décimale)
        level_int = _infer_level_int(cnp)
        # teer_level: 2ème chiffre du code CNP à 5 chiffres (ex: 00010 → T=0)
        teer = None
        clean = cnp.split(".")[0]  # enleve .00
        if len(clean) >= 2 and clean[1].isdigit():
            teer = int(clean[1])
        
        name_fr = occ.get("title_fr") or lead_fr.get(cnp) or cnp
        name_en = occ.get("title_en") or lead_en.get(cnp) or ""
        
        rec: dict = {
            "code":           cnp,
            "level":          level_int,
            "parent_code":    _parent_code_cnp(cnp),
            "name_fr":        name_fr,
            "name_en":        name_en or None,
            "teer_level":     teer,
            "description_fr": lead_fr.get(cnp) or None,
            "description_en": lead_en.get(cnp) or None,
        }
        records.append(rec)
    
    log.info(f"  [TOTAL] {len(records)} entrees hierarchie a inserer")
    
    # La FK parent_code → code est auto-référentielle → insérer en 2 passes :
    # Passe 1: tous les codes sans parent (ou parent_code=NULL)
    # Passe 2: UPDATE pour remettre parent_code sur ceux qui ont un parent
    try:
        conn.rollback()
        with conn.cursor() as cur:
            # Désactiver temporairement la FK
            cur.execute("SET session_replication_role = replica")
        conn.commit()
        fk_disabled = True
        log.info("  [FK] Contrainte FK parent_code desactivee (replica mode)")
    except Exception as e:
        log.warning(f"  [WARN] replica mode impossible: {e} - insertion par passes")
        fk_disabled = False
    
    n = upsert(conn, "cnp_hierarchy", records, ["code"])
    
    if fk_disabled:
        try:
            with conn.cursor() as cur:
                cur.execute("SET session_replication_role = DEFAULT")
            conn.commit()
        except Exception as e:
            log.warning(f"  [WARN] restore replica mode: {e}")
    
    return n


def _infer_level_int(code: str) -> int:
    """Retourne le niveau hiérarchique comme entier (smallint) pour cnp_hierarchy."""
    # OaSIS codes like 00010.00 → niveau 5 (occupation unit)
    if "." in code:
        left = code.split(".")[0]
        return len(left.lstrip("0") or "0")
    return len(code)


def _parent_code_cnp(code: str) -> str | None:
    """Retourne le code parent CNP (un niveau au-dessus)."""
    if len(code) <= 1:
        return None
    # Pour les codes OaSIS (00010.00): parent = broad category
    if "." in code:
        left = code.split(".")[0]
        return left[:2] if len(left) > 2 else left[:1] if len(left) > 1 else None
    return code[:-1] or None


# ─────────────────────────────────────────────────────────────
# ÉTAPE 4 : oasis_work_environments
# ─────────────────────────────────────────────────────────────
def step4_work_environments(conn):
    """
    Ingestion des milieux de travail OaSIS.
    
    Fichiers: (code_cnp, workplace_name, occupation_name)
    Format: virgule, 3 colonnes
    
    Stratégie:
    1. Extraire tous les noms de milieux uniques -> oasis_work_environments
    2. Créer les liens occupation -> milieu -> occupation_work_environments
    """
    log.info("\n=== ETAPE 4 — oasis_work_environments ===")
    
    df_en = read_csv("workplaces-employers_oasis_2025_v1.0.csv", force_sep=",")
    df_fr = read_csv("lieux-de-travail-employeurs_sipec_2025_v1.0.csv", force_sep=",")
    if df_en.empty and df_fr.empty:
        log.warning("  [SKIP] Fichiers workplaces introuvables")
        return 0
    
    # Codes CNP valides
    with conn.cursor() as cur:
        cur.execute('SELECT cnp_code FROM "occupations"')
        valid_cnp = {row[0] for row in cur.fetchall()}
    
    # Construire le catalogue des milieux uniques (oasis_work_environments)
    # et les liens (occupation_work_environments)
    env_catalog: dict[str, dict] = {}   # oasis_code -> descriptor record
    occ_links: list[dict] = []          # occupation_cnp_code × oasis_code
    
    for df, lang in [(df_en, "en"), (df_fr, "fr")]:
        if df.empty:
            continue
        cols = list(df.columns)
        log.info(f"  [{lang.upper()}] {len(df)} lignes, cols={cols}")
        
        # Col 0: code OaSIS/SIPeC profession, Col 1: nom milieu, Col 2: nom profession
        code_col = cols[0]
        name_col = cols[1] if len(cols) > 1 else None
        
        for _, row in df.iterrows():
            cnp_raw = str(row[code_col]).strip()
            if not cnp_raw:
                continue
            
            cnp = cnp_raw
            if cnp not in valid_cnp:
                alt = cnp.rstrip("0").rstrip(".")
                if alt in valid_cnp:
                    cnp = alt
                else:
                    continue
            
            wp_name = str(row[name_col]).strip() if name_col else ""
            if not wp_name or wp_name.lower() in ("workplace/employer name", "lieux de travail/employeurs"):
                continue
            
            # Code synthétique stable pour chaque milieu unique
            clean = re.sub(r'[^A-Za-z0-9]', '_', wp_name[:40]).strip('_')
            oasis_code = f"WP_{clean.upper()[:35]}"
            
            # Ajouter au catalogue si pas encore présent
            if oasis_code not in env_catalog:
                env_catalog[oasis_code] = {
                    "oasis_code":       oasis_code,
                    "category_code":    "WP",
                    "environment_type": "workplace",
                    "name_fr":          wp_name if lang == "fr" else "",
                    "name_en":          wp_name if lang == "en" else "",
                    "version":          "2025.0",
                }
            else:
                if lang == "fr" and not env_catalog[oasis_code]["name_fr"]:
                    env_catalog[oasis_code]["name_fr"] = wp_name
                elif lang == "en" and not env_catalog[oasis_code]["name_en"]:
                    env_catalog[oasis_code]["name_en"] = wp_name
            
            # Lien occupation <-> milieu (éviter doublons)
            occ_links.append({
                "occupation_cnp_code": cnp,
                "oasis_code":          oasis_code,
                "scale_id":            "WP",
                "source":              "OaSIS-SIPeC-2025",
            })
    
    # Déduplique les liens
    seen_links = set()
    unique_links = []
    for lk in occ_links:
        k = (lk["occupation_cnp_code"], lk["oasis_code"])
        if k not in seen_links:
            seen_links.add(k)
            unique_links.append(lk)
    
    # S'assurer que name_fr est toujours rempli
    env_records = list(env_catalog.values())
    for r in env_records:
        if not r.get("name_fr"):
            r["name_fr"] = r.get("name_en", r["oasis_code"])
    
    log.info(f"  [CATALOG] {len(env_records)} milieux distincts")
    log.info(f"  [LIENS] {len(unique_links)} liens occupation<->milieu")
    
    n1 = upsert(conn, "oasis_work_environments", env_records, ["oasis_code"])
    n2 = upsert(conn, "occupation_work_environments", unique_links, ["occupation_cnp_code", "oasis_code", "scale_id"])
    return n1 + n2


# ─────────────────────────────────────────────────────────────

# SANITY CHECK
# ─────────────────────────────────────────────────────────────
def sanity_check(conn):
    tables = [
        "occupations", "oasis_descriptors", "oasis_work_environments",
        "occupation_oasis", "occupation_work_environments",
        "occupation_job_titles", "occupation_exclusions",
        "occupation_requirements", "cnp_concordance_2016_2021",
        "occupation_legacy_dpt", "cnp_hierarchy",
    ]
    log.info("\n=== SANITY CHECK ===")
    for t in tables:
        try:
            n = count_table(conn, t)
            st = "OK  " if n > 0 else "VIDE"
            log.info(f"  [{st}] {t:45s} {n:>8} lignes")
        except Exception as e:
            log.error(f"  [ERR] {t}: {e}")
    
    # Combien de CNP ont des scores OaSIS ?
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COUNT(DISTINCT occupation_cnp_code)
                FROM occupation_oasis
            """)
            n_cnp = cur.fetchone()[0]
        log.info(f"\n  [COUVERTURE] {n_cnp} / 1060 professions CNP avec scores OaSIS")
    except Exception as e:
        log.warning(f"  [WARN] couverture: {e}")
    
    # Refresh vue matérialisée via une nouvelle connexion autocommit
    try:
        url = os.getenv("SUPABASE_DB_URL") or os.getenv("SUPABASE_DB_URL_DIRECT")
        if url:
            c2 = psycopg2.connect(url, connect_timeout=10)
            c2.autocommit = True
            with c2.cursor() as cur:
                cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile")
            c2.close()
            log.info("  [VIEW] Vue mv_occupation_full_profile rafraîchie OK")
    except Exception as e:
        log.warning(f"  [VIEW] {e}")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    
    p = argparse.ArgumentParser(description="Patch OaSIS v4 — Correction ETL")
    p.add_argument("--step", default="all",
                   choices=["1", "2", "3", "4", "all"],
                   help="Étape à exécuter (1=descripteurs, 2=scores, 3=hiérarchie, 4=milieux, all=toutes)")
    args = p.parse_args()
    
    conn = get_conn()
    try:
        if args.step in ("1", "all"):
            step1_oasis_descriptors(conn)
        
        if args.step in ("2", "all"):
            step2_occupation_oasis(conn)
        
        if args.step in ("3", "all"):
            step3_cnp_hierarchy(conn)
        
        if args.step in ("4", "all"):
            step4_work_environments(conn)
        
        sanity_check(conn)
    finally:
        conn.close()
        log.info("\nPatch terminé.")
