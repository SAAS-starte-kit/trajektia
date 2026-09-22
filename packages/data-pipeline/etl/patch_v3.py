"""
patch_v3.py — Trajektia ETL Final Patch
========================================
Mission 1: Mapping OaSIS → occupation_oasis
  - La table occupation_oasis est un CROSSWALK CNP 2021 <-> OaSIS
  - Pour chaque code OaSIS (profession), on cherche le CNP 2021 correspondant
    via le label de la profession (titre), puis on insere l'enregistrement
    de liaison avec importance_score = score moyen des competences clés.

Mission 2: Ingestion Legacy DPT → occupation_legacy_dpt
  - Source: open.canada.ca (Career Handbook 2016)
  - Joindre via concordance CNP 2016 → CNP 2021 (si disponible)
  - Fallback : matching direct par code CH 4-chiffres → CNP 5-chiffres
"""

import os, sys, re, json, time, logging
from pathlib import Path

import requests
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# ──────────────────────────────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).parent.parent / ".env")

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

CACHE_DIR = Path(__file__).parent / ".cache_v2"
CACHE_DIR.mkdir(exist_ok=True)

HEADERS = {"User-Agent": "Trajektia-ETL/3.0 (education; contact@trajektia.ca)"}
CHUNK   = 250

# OaSIS score CSV files in the cache (semicolon-separated)
OASIS_SCORE_FILES = [
    "skills_oasis_2025_v1.1.csv",
    "abilities_oasis_2025_v1.1.csv",
    "knowledge_oasis_2025_v.1.1.csv",
    "work-activities_oasis_2025_v1.1.csv",
    "work-context_oasis_2025_v1.1.csv",
    "personal-attributes_oasis_2025_v1.1.csv",
]

# Career Handbook 2016 — open.canada.ca resources
DPT_URLS = {
    "dpt_core":      "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/35d2b32a-4243-4e95-b354-a1b444593fbe/download/careerhandbook-2016_en_datapeoplethings.csv",
    "dpt_interests": "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/b527a563-a18f-4061-957d-de9c166daca5/download/careerhandbook-2016_en_interests.csv",
    "dpt_aptitudes": "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/07ad6c4f-82f5-469a-bd99-f5e055d133f8/download/careerhandbook-2016_en_aptitudes.csv",
    "dpt_physical":  "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/057e1af1-39f3-425d-845a-ba7ed8d154ea/download/careerhandbook-2016_en_physical-activities.csv",
    "dpt_education": "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/f11baf53-a8d7-47fe-8adf-75677fd70d11/download/careerhandbook-2016_en_educationtraining.csv",
}

# ──────────────────────────────────────────────────────────────────────────────
# DB HELPERS
# ──────────────────────────────────────────────────────────────────────────────
def get_pgconn():
    for url in [os.getenv("SUPABASE_DB_URL_DIRECT"), os.getenv("SUPABASE_DB_URL")]:
        if not url:
            continue
        try:
            conn = psycopg2.connect(url, connect_timeout=10)
            conn.autocommit = False
            log.info(f"  [DB] {url.split('@')[-1][:50]}")
            return conn
        except Exception as e:
            log.warning(f"  [WARN] {e}")
    raise RuntimeError("Impossible de se connecter a PostgreSQL")


def upsert(conn, table: str, records: list[dict], conflict_cols: list[str]):
    if not records:
        log.info(f"  [SKIP] {table} — 0 records")
        return 0
    all_cols = list({k for r in records for k in r})
    # Exclure les colonnes système (gérées par DB default)
    exclude = set(conflict_cols) | {"ingested_at", "created_at"}
    update_cols = [c for c in all_cols if c not in exclude]
    col_str      = ", ".join(f'"{c}"' for c in all_cols)
    conflict_str = ", ".join(f'"{c}"' for c in conflict_cols)
    update_str   = (", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
                    if update_cols else f'"{conflict_cols[0]}" = "{conflict_cols[0]}"')
    sql = (f'INSERT INTO "{table}" ({col_str}) VALUES %s '
           f'ON CONFLICT ({conflict_str}) DO UPDATE SET {update_str}')
    inserted = 0
    with conn.cursor() as cur:
        for i in range(0, len(records), CHUNK):
            batch  = records[i:i+CHUNK]
            values = [tuple(r.get(c) for c in all_cols) for r in batch]
            try:
                execute_values(cur, sql, values, page_size=CHUNK)
                conn.commit()
                inserted += len(batch)
            except Exception as e:
                conn.rollback()
                log.error(f"  [ERR] {table} batch {i//CHUNK}: {e}")
    log.info(f"  [UPSERT] {table} — {inserted}/{len(records)}")
    return inserted


def count_table(conn, table: str) -> int:
    with conn.cursor() as cur:
        cur.execute(f'SELECT COUNT(*) FROM "{table}"')
        return cur.fetchone()[0]


def fetch_col(conn, table: str, col: str) -> set:
    with conn.cursor() as cur:
        cur.execute(f'SELECT "{col}" FROM "{table}"')
        return {str(row[0]) for row in cur.fetchall()}


# ──────────────────────────────────────────────────────────────────────────────
# FILE HELPERS
# ──────────────────────────────────────────────────────────────────────────────
def download_csv(url: str, fname: str) -> pd.DataFrame:
    dest = CACHE_DIR / fname
    if not dest.exists():
        log.info(f"  [DL] {fname}")
        r = requests.get(url, headers=HEADERS, timeout=60)
        r.raise_for_status()
        dest.write_bytes(r.content)
        time.sleep(0.5)
    else:
        log.info(f"  [CACHE] {fname}")

    for enc in ["utf-8-sig", "utf-8", "latin-1", "cp1252"]:
        for sep in [";", ",", "\t"]:
            try:
                df = pd.read_csv(dest, encoding=enc, sep=sep, dtype=str, low_memory=False)
                if len(df.columns) >= 2:
                    df.columns = [c.strip().lstrip("\ufeff") for c in df.columns]
                    return df.fillna("")
            except Exception:
                continue
    return pd.DataFrame()


def load_cached(fname: str) -> pd.DataFrame:
    return download_csv("", fname)  # won't download, just reads cache


# ──────────────────────────────────────────────────────────────────────────────
# MISSION 1 — occupation_oasis crosswalk
#
# Logique:
#  - CSV OaSIS: lignes=professions (Code OaSIS=00010.00), colonnes=scores
#  - oasis_descriptors: contient les memes codes OaSIS
#  - occupations: contient les CNP 2021
#  - On fait la jointure par les TITRES (label OaSIS ≈ title_en de occupations)
#    + fallback par code OaSIS → cherche best match CNP
#
#  La table occupation_oasis stocke:
#    (occupation_cnp_code, oasis_code) avec importance_score = score moyen
#    Ces enregistrements peuplent le crosswalk CNP2021 ↔ OaSIS
# ──────────────────────────────────────────────────────────────────────────────
def _read_oasis_cache(fname: str) -> pd.DataFrame:
    path = CACHE_DIR / fname
    if not path.exists():
        return pd.DataFrame()
    for enc in ["utf-8-sig", "utf-8", "latin-1"]:
        for sep in [";", ","]:
            try:
                df = pd.read_csv(path, encoding=enc, sep=sep, dtype=str, low_memory=False)
                if len(df.columns) >= 2:
                    df.columns = [c.strip().lstrip("\ufeff") for c in df.columns]
                    return df.fillna("")
            except Exception:
                continue
    return pd.DataFrame()


def _find_code_col(df: pd.DataFrame) -> str | None:
    for c in df.columns:
        raw = c.lower().strip()
        if "oasis" in raw and "code" in raw:
            return c
        if raw == "code oasis":
            return c
    for c in df.columns:
        if "code" in c.lower():
            return c
    return None


def mission1_oasis_crosswalk(conn):
    log.info("\n=== MISSION 1 — Crosswalk CNP 2021 <-> OaSIS ===")

    # Charge les donnees de reference
    valid_oasis = fetch_col(conn, "oasis_descriptors", "oasis_code")
    log.info(f"  [REF] {len(valid_oasis)} codes OaSIS en base")

    # Map: oasis_code → (cnp_code) depuis les occupations
    # Les occupations.cnp_code sont au format OaSIS (ex: '00010.00')
    # Ces memes codes sont dans oasis_descriptors.oasis_code
    with conn.cursor() as cur:
        cur.execute('SELECT cnp_code, title_en, title_fr, oasis_mapped FROM "occupations"')
        occ_rows = cur.fetchall()

    # Construit une map titre_en_normalisé → cnp_code
    def norm_title(t: str) -> str:
        return re.sub(r"\s+", " ", str(t).lower().strip())

    title_to_cnp = {norm_title(r[1]): r[0] for r in occ_rows if r[1]}
    cnp_set = {r[0] for r in occ_rows}

    # oasis_code en base = code de profession OaSIS (ex: '00010.00')
    # Les cnp_code des occupations sont aussi ces memes codes OaSIS
    # → La liaison directe est: oasis_code == cnp_code
    direct_matches = valid_oasis & cnp_set
    log.info(f"  [MATCH] {len(direct_matches)} codes OaSIS = CNP direct")

    records = []
    seen = set()

    for fname in OASIS_SCORE_FILES:
        df = _read_oasis_cache(fname)
        if df.empty:
            log.warning(f"  [SKIP] {fname}")
            continue

        code_col = _find_code_col(df)
        if code_col is None:
            log.warning(f"  [SKIP] {fname} — pas de colonne code")
            continue

        label_col = df.columns[1]  # 2e colonne = label profession
        score_cols = df.columns[2:].tolist()

        for _, row in df.iterrows():
            raw_code = str(row[code_col]).strip()
            # Normalise: 10010.00 → 10010.00 (5 chiffres)
            if "." in raw_code:
                left, right = raw_code.split(".", 1)
                oasis_code = f"{left.zfill(5)}.{right}"
            else:
                oasis_code = raw_code.zfill(5)

            if oasis_code not in valid_oasis:
                continue

            # Résolution CNP: si oasis_code == cnp_code → liaison directe
            cnp_code = oasis_code if oasis_code in cnp_set else None

            # Fallback: match par titre
            if cnp_code is None:
                label = norm_title(row[label_col])
                cnp_code = title_to_cnp.get(label)

            if cnp_code is None:
                continue

            key = (cnp_code, oasis_code)
            if key in seen:
                continue
            seen.add(key)

            # Calcule un score moyen sur toutes les colonnes numeriques non-nulles
            scores = []
            for sc in score_cols:
                v = str(row.get(sc, "")).strip()
                try:
                    fv = float(v)
                    if fv > 0:
                        scores.append(fv)
                except ValueError:
                    pass

            importance = round(sum(scores) / len(scores), 3) if scores else None
            max_score  = max(scores) if scores else None

            records.append({
                "occupation_cnp_code": cnp_code,
                "oasis_code":          oasis_code,
                "importance_score":    importance,
                "level_score":         max_score,
                "source_file":         fname,
                "source":              "OaSIS-2025",
            })

        log.info(f"  [{fname}] {len(records)} records cumules")

    log.info(f"  [TOTAL] {len(records)} crosswalk OaSIS a upserter")
    n = upsert(conn, "occupation_oasis", records, ["occupation_cnp_code", "oasis_code"])

    # Mise a jour flag oasis_mapped
    if records:
        mapped_codes = list({r["occupation_cnp_code"] for r in records})
        try:
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE "occupations" SET oasis_mapped = TRUE WHERE cnp_code = ANY(%s)',
                    (mapped_codes,)
                )
            conn.commit()
            log.info(f"  [FLAG] oasis_mapped = TRUE sur {len(mapped_codes)} professions")
        except Exception as e:
            conn.rollback()
            log.warning(f"  [WARN] flag oasis_mapped: {e}")

    return n


# ──────────────────────────────────────────────────────────────────────────────
# MISSION 2 — Legacy DPT (Career Handbook 2016)
# ──────────────────────────────────────────────────────────────────────────────
def _norm_ch_code(raw: str) -> str:
    """0011.0 → '0011' (supprime decimal, pad 4 chiffres)"""
    s = str(raw).strip().lstrip("\ufeff")
    try:
        return str(int(float(s))).zfill(4)
    except ValueError:
        return re.sub(r"[^0-9]", "", s).zfill(4)[:4]


def _extract_label(val: str) -> str:
    return re.sub(r"\s*-\s*\d+\s*$", "", str(val)).strip()


def _extract_score(val: str) -> str | None:
    m = re.search(r"-\s*(\d+)\s*$", str(val))
    return m.group(1) if m else None


RIASEC_MAP = {
    "R": "riasec_ca_score_r",
    "I": "riasec_ca_score_i",
    "A": "riasec_ca_score_a",
    "S": "riasec_ca_score_s",
    "E": "riasec_ca_score_e",
    "C": "riasec_ca_score_c",
    # Codes canadiens specifiques (Manuel des professions)
    "D": "riasec_ca_score_e",   # Directive → assimilé E
    "m": "riasec_ca_score_c",   # Methodical → assimilé C
    "T": "riasec_ca_score_r",   # Things → assimilé R
    "U": "riasec_ca_score_r",   # Utilitarian → assimilé R
    "P": "riasec_ca_score_s",   # People → assimilé S
}


def mission2_legacy_dpt(conn):
    log.info("\n=== MISSION 2 — Legacy DPT (Career Handbook 2016) ===")

    valid_cnp21 = fetch_col(conn, "occupations", "cnp_code")
    log.info(f"  [REF] {len(valid_cnp21)} codes CNP 2021 en base")

    # Tente concordance 2016→2021
    with conn.cursor() as cur:
        cur.execute('SELECT cnp_2016_code, cnp_2021_code FROM "cnp_concordance_2016_2021"')
        rows = cur.fetchall()
    concordance = {str(r[0]).zfill(4): str(r[1]) for r in rows}
    log.info(f"  [CONCORDANCE] {len(concordance)} entrees 2016->2021")

    # Télécharge les CSV
    df_dpt  = download_csv(DPT_URLS["dpt_core"],      "dpt_core.csv")
    df_int  = download_csv(DPT_URLS["dpt_interests"],  "dpt_interests.csv")
    df_apt  = download_csv(DPT_URLS["dpt_aptitudes"],  "dpt_aptitudes.csv")
    df_phys = download_csv(DPT_URLS["dpt_physical"],   "dpt_physical.csv")
    df_edu  = download_csv(DPT_URLS["dpt_education"],  "dpt_education.csv")

    # ── Index Intérêts (Holland codes)
    int_code_col = next((c for c in df_int.columns
                         if "subgroup" in c.lower() or "code" in c.lower()), df_int.columns[0])
    # "CODE" ou "Holland Codes - 1"
    holland_col  = next((c for c in df_int.columns
                         if c.strip().upper() == "CODE"), df_int.columns[2])
    interest_map: dict[str, list[str]] = {}
    for _, row in df_int.iterrows():
        ch = _norm_ch_code(row[int_code_col])
        v  = str(row[holland_col]).strip()
        if v and v != "nan":
            interest_map.setdefault(ch, []).append(v)

    # ── Index Aptitudes
    apt_code_col = next(c for c in df_apt.columns if "code" in c.lower())
    apt_score_cols = df_apt.columns[2:].tolist()
    aptitude_map: dict[str, dict] = {}
    for _, row in df_apt.iterrows():
        ch = _norm_ch_code(row[apt_code_col])
        aptitude_map[ch] = {sc: str(row.get(sc, "")).strip() for sc in apt_score_cols}

    # ── Index Physique
    phys_code_col = next(c for c in df_phys.columns if "code" in c.lower())
    phys_score_cols = df_phys.columns[2:].tolist()
    physical_map: dict[str, dict] = {}
    for _, row in df_phys.iterrows():
        ch = _norm_ch_code(row[phys_code_col])
        physical_map[ch] = {sc: str(row.get(sc, "")).strip() for sc in phys_score_cols}

    # ── Index Education
    edu_code_col = next((c for c in df_edu.columns
                         if "subgroup" in c.lower() or "code" in c.lower()), df_edu.columns[0])
    edu_val_col  = next((c for c in df_edu.columns
                         if "education" in c.lower() or "indicator" in c.lower()), df_edu.columns[2])
    education_map: dict[str, str] = {}
    for _, row in df_edu.iterrows():
        ch = _norm_ch_code(row[edu_code_col])
        education_map[ch] = str(row.get(edu_val_col, "")).strip()

    # ── DPT Core
    dpt_code_col = next(c for c in df_dpt.columns if "code" in c.lower())

    records = []
    skipped = 0

    for _, row in df_dpt.iterrows():
        ch = _norm_ch_code(row[dpt_code_col])

        # Resolution CNP 2021
        cnp21 = concordance.get(ch)
        if cnp21 is None:
            # Fallback: CNP 2016 4 chiffres → pad a 5 chiffres (zfill)
            # 0011 → 00011, 1234 → 01234
            ch5 = ch.zfill(5)         # '0011' → '00011'
            if ch5 in valid_cnp21:
                cnp21 = ch5
            else:
                # Match les 4 premiers chiffres du code CNP 2021 sur 5
                for cnp in sorted(valid_cnp21):
                    if cnp[:4] == ch or cnp[1:5] == ch or cnp[0:4] == ch[0:4]:
                        cnp21 = cnp
                        break
        if cnp21 is None or cnp21 not in valid_cnp21:
            skipped += 1
            continue

        # DPT values
        data_raw   = str(row.get("DATA",   "")).strip()
        people_raw = str(row.get("PEOPLE", "")).strip()
        thing_raw  = str(row.get("THING",  "")).strip()

        # Intérêts Holland → scores RIASEC
        holland_codes = interest_map.get(ch, [])
        riasec = {k: 0.0 for k in ["riasec_ca_score_r","riasec_ca_score_i",
                                     "riasec_ca_score_a","riasec_ca_score_s",
                                     "riasec_ca_score_e","riasec_ca_score_c"]}
        riasec_str = ""
        for hc in holland_codes:
            col = RIASEC_MAP.get(hc.strip().upper())
            if col and col in riasec:
                riasec[col] = (riasec[col] or 0) + 1.0
        if holland_codes:
            riasec_str = "".join(sorted(c.strip()[0].upper() for c in holland_codes
                                        if c.strip() and c.strip()[0].upper() in "RIASEC"))[:3]

        # Physical (JSONB)
        phys = physical_map.get(ch, {})
        phys_json = {k: v for k, v in phys.items() if v and v != "nan"} or None

        # Aptitudes → work_conditions_en
        apts = aptitude_map.get(ch, {})
        apt_str = "; ".join(f"{k}={v}" for k, v in apts.items() if v and v != "nan")

        edu = education_map.get(ch, "")

        # DPT summary → dpt_title_en
        dpt_parts = []
        if data_raw:   dpt_parts.append(f"Data:{_extract_label(data_raw)}({_extract_score(data_raw)})")
        if people_raw: dpt_parts.append(f"People:{_extract_label(people_raw)}({_extract_score(people_raw)})")
        if thing_raw:  dpt_parts.append(f"Things:{_extract_label(thing_raw)}({_extract_score(thing_raw)})")
        dpt_summary = " | ".join(dpt_parts)

        rec = {
            "occupation_cnp_code":   cnp21,
            "source_cnp_2016_code":  ch,
            "dpt_code":              ch,
            "dpt_title_en":          dpt_summary or None,
            "dpt_title_fr":          f"Education: {edu}" if edu else None,
            "riasec_ca_code":        riasec_str or None,
            "physical_requirements": json.dumps(phys_json, ensure_ascii=False) if phys_json else None,
            "work_conditions_en":    apt_str or None,
            "work_conditions_fr":    None,
        }
        # RIASEC scores individuels
        for k, v in riasec.items():
            rec[k] = v if v > 0 else None

        records.append(rec)

    log.info(f"  [DPT] {len(records)} profils assembles ({skipped} ignores sans CNP 2021)")

    # Deduplique: un seul enregistrement par cnp_code (premier match gagne)
    seen_cnp = {}
    for rec in records:
        k = rec["occupation_cnp_code"]
        if k not in seen_cnp:
            seen_cnp[k] = rec
    deduped = list(seen_cnp.values())
    log.info(f"  [DPT] {len(deduped)} uniques apres deduplication ({len(records) - len(deduped)} doublons supprimes)")

    n = upsert(conn, "occupation_legacy_dpt", deduped, ["occupation_cnp_code"])
    return n


# ──────────────────────────────────────────────────────────────────────────────
# REFRESH VIEW + SANITY
# ──────────────────────────────────────────────────────────────────────────────
def refresh_view(conn):
    try:
        old = conn.autocommit
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile")
        conn.autocommit = old
        log.info("  [VIEW] Vue materialisee rafraichie")
    except Exception as e:
        log.warning(f"  [VIEW] {e}")


def sanity(conn):
    tables = [
        "occupations", "oasis_descriptors",
        "occupation_oasis", "occupation_legacy_dpt",
        "occupation_job_titles", "occupation_exclusions",
        "occupation_requirements", "mv_occupation_full_profile",
    ]
    log.info("\n=== SANITY CHECK ===")
    for t in tables:
        try:
            n = count_table(conn, t)
            s = "OK " if n > 0 else "VIDE"
            log.info(f"  [{s}] {t:45s} {n:>8} lignes")
        except Exception as e:
            log.error(f"  [ERR] {t}: {e}")


# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--skip-oasis", action="store_true")
    p.add_argument("--skip-dpt",   action="store_true")
    args = p.parse_args()

    conn = get_pgconn()
    try:
        n_oasis = 0
        n_dpt   = 0
        if not args.skip_oasis:
            n_oasis = mission1_oasis_crosswalk(conn)
        if not args.skip_dpt:
            n_dpt = mission2_legacy_dpt(conn)
        refresh_view(conn)
        sanity(conn)
        log.info("\n====================================")
        log.info(f"  occupation_oasis      : {n_oasis:>7} lignes")
        log.info(f"  occupation_legacy_dpt : {n_dpt:>7} lignes")
        log.info("====================================")
    finally:
        conn.close()
