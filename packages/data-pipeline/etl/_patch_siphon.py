"""Patch all upsert_chunks(sb, ..., "col") calls to upsert_chunks(conn, ..., ["col"])"""
import re

TARGET = "etl/le_siphon_v2.py"

with open(TARGET, "r", encoding="utf-8") as f:
    txt = f.read()

# Also patch the functions to receive conn instead of sb
# phase3_upsert_taxonomy(sb: Client, ...) → phase3_upsert_taxonomy(conn, ...)
# phase4_upsert_occupations(sb: Client, ...) → ...
# phase5_upsert_oasis_profiles(sb: Client, ...) → ...
fn_sigs = [
    ("def phase3_upsert_taxonomy(sb: Client, all_files: list[dict]):",
     "def phase3_upsert_taxonomy(conn, all_files: list[dict]):"),
    ("def phase4_upsert_occupations(sb: Client, all_files: list[dict]):",
     "def phase4_upsert_occupations(conn, all_files: list[dict]):"),
    ("def phase5_upsert_oasis_profiles(sb: Client, all_files: list[dict]):",
     "def phase5_upsert_oasis_profiles(conn, all_files: list[dict]):"),
    # Fix valid_codes fetch (was using sb.table — switch to psycopg2)
]

# Simple string conflicts → list
upsert_patches = [
    # Phase 3
    ('upsert_chunks(sb, "oasis_descriptors", desc_records, "oasis_code")',
     'upsert_chunks(conn, "oasis_descriptors", desc_records, ["oasis_code"])'),
    ('upsert_chunks(sb, "oasis_work_environments", env_records, "oasis_code")',
     'upsert_chunks(conn, "oasis_work_environments", env_records, ["oasis_code"])'),
    # Phase 4
    ('upsert_chunks(sb, "occupation_job_titles",     filter_valid(job_titles),   "id")',
     'upsert_chunks(conn, "occupation_job_titles",     filter_valid(job_titles),   ["id"])'),
    ('upsert_chunks(sb, "occupation_exclusions",     filter_valid(exclusions),   "id")',
     'upsert_chunks(conn, "occupation_exclusions",     filter_valid(exclusions),   ["id"])'),
    ('upsert_chunks(sb, "occupation_requirements",   filter_valid(requirements), "id")',
     'upsert_chunks(conn, "occupation_requirements",   filter_valid(requirements), ["id"])'),
    ('upsert_chunks(sb, "cnp_concordance_2016_2021", concordances,              "id")',
     'upsert_chunks(conn, "cnp_concordance_2016_2021", concordances,              ["cnp_2016_code", "cnp_2021_code"])'),
    ('upsert_chunks(sb, "occupation_legacy_dpt", records, "occupation_cnp_code")',
     'upsert_chunks(conn, "occupation_legacy_dpt", records, ["occupation_cnp_code"])'),
]

# Multi-line patches for phase 3 scale_labels and phase 5
multiline_patches = [
    # phase 3 — scale_labels
    (
        'upsert_chunks(sb, "oasis_scale_labels", unique_scales,\n'
        '                  "scale_id,level_value,applicable_category")',
        'upsert_chunks(conn, "oasis_scale_labels", unique_scales,\n'
        '                  ["scale_id", "level_value", "applicable_category"])',
    ),
    # phase 5 — occupation_oasis
    (
        'upsert_chunks(sb, "occupation_oasis",\n'
        '                  occ_oasis_records, "occupation_cnp_code,oasis_code")',
        'upsert_chunks(conn, "occupation_oasis",\n'
        '                  occ_oasis_records, ["occupation_cnp_code", "oasis_code"])',
    ),
    # phase 5 — occupation_work_environments
    (
        'upsert_chunks(sb, "occupation_work_environments",\n'
        '                  occ_env_records, "occupation_cnp_code,oasis_code,scale_id")',
        'upsert_chunks(conn, "occupation_work_environments",\n'
        '                  occ_env_records, ["occupation_cnp_code", "oasis_code", "scale_id"])',
    ),
]

all_patches = fn_sigs + upsert_patches + multiline_patches

found = 0
not_found = []
for old, new in all_patches:
    if old in txt:
        txt = txt.replace(old, new)
        found += 1
        print(f"  [OK] {old[:70].strip()}")
    else:
        not_found.append(old[:70].strip())
        print(f"  [??] NOT FOUND: {old[:70].strip()}")

# Fix valid_codes fetching block in phase4 (uses sb.table → psycopg2)
OLD_VALID = '''    log.info("  [CHECK] Récupération des codes CNP existants...")
    try:
        resp = sb.table("occupations").select("cnp_code").execute()
        valid_codes = {r["cnp_code"] for r in resp.data}
        log.info(f"  → {len(valid_codes)} professions en base")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de filtrer les codes : {e}")
        valid_codes = None'''

NEW_VALID = '''    log.info("  [CHECK] Recuperation des codes CNP existants...")
    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT cnp_code FROM "occupations"')
            valid_codes = {row[0] for row in _cur.fetchall()}
        log.info(f"  OK  {len(valid_codes)} professions en base")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de filtrer les codes : {e}")
        valid_codes = None'''

if OLD_VALID in txt:
    txt = txt.replace(OLD_VALID, NEW_VALID)
    print("  [OK] Fixed valid_codes fetch (phase4)")
else:
    print("  [??] valid_codes fetch block not found (may already be patched)")

# Fix valid_oasis + valid_cnp fetch in phase5
OLD_VALID5 = '''    try:
        resp_oasis = sb.table("oasis_descriptors").select("oasis_code").execute()
        valid_oasis = {r["oasis_code"] for r in resp_oasis.data}
        resp_occ   = sb.table("occupations").select("cnp_code").execute()
        valid_cnp  = {r["cnp_code"] for r in resp_occ.data}
        log.info(f"  [CHECK] {len(valid_oasis)} codes OaSIS | {len(valid_cnp)} CNP")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de valider les FKs : {e}")
        valid_oasis = None
        valid_cnp   = None'''

NEW_VALID5 = '''    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT oasis_code FROM "oasis_descriptors"')
            valid_oasis = {row[0] for row in _cur.fetchall()}
            _cur.execute('SELECT cnp_code FROM "occupations"')
            valid_cnp = {row[0] for row in _cur.fetchall()}
        log.info(f"  [CHECK] {len(valid_oasis)} codes OaSIS | {len(valid_cnp)} CNP")
    except Exception as e:
        log.warning(f"  [WARN] Impossible de valider les FKs : {e}")
        valid_oasis = None
        valid_cnp   = None'''

if OLD_VALID5 in txt:
    txt = txt.replace(OLD_VALID5, NEW_VALID5)
    print("  [OK] Fixed valid_oasis + valid_cnp fetch (phase5)")
else:
    print("  [??] valid_oasis/valid_cnp fetch block not found")

# Fix valid_env fetch in phase5
OLD_ENV = '''    try:
        resp_env = sb.table("oasis_work_environments").select("oasis_code").execute()
        valid_env = {r["oasis_code"] for r in resp_env.data}
        occ_env_records = [r for r in occ_env_records if r["oasis_code"] in valid_env]
    except:
        pass'''

NEW_ENV = '''    try:
        with conn.cursor() as _cur:
            _cur.execute('SELECT oasis_code FROM "oasis_work_environments"')
            valid_env = {row[0] for row in _cur.fetchall()}
        occ_env_records = [r for r in occ_env_records if r["oasis_code"] in valid_env]
    except Exception:
        pass'''

if OLD_ENV in txt:
    txt = txt.replace(OLD_ENV, NEW_ENV)
    print("  [OK] Fixed valid_env fetch (phase5)")
else:
    print("  [??] valid_env fetch block not found")

# Fix oasis_mapped update in phase5 (was using sb.table)
OLD_FLAG = '''    mapped_cnp = {r["occupation_cnp_code"] for r in occ_oasis_records}
    if mapped_cnp:
        log.info(f"  [FLAG] Mise à jour oasis_mapped sur {len(mapped_cnp)} professions")
        for cnp in list(mapped_cnp)[:100]:  # batch partiel — idempotent
            try:
                sb.table("occupations").update({"oasis_mapped": True})\\
                  .eq("cnp_code", cnp).execute()
            except:
                pass'''

NEW_FLAG = '''    mapped_cnp = {r["occupation_cnp_code"] for r in occ_oasis_records}
    if mapped_cnp:
        log.info(f"  [FLAG] Mise a jour oasis_mapped sur {len(mapped_cnp)} professions")
        try:
            mapped_list = list(mapped_cnp)
            with conn.cursor() as _cur:
                _cur.execute(
                    \'UPDATE "occupations" SET oasis_mapped = TRUE WHERE cnp_code = ANY(%s)\',
                    (mapped_list,)
                )
            conn.commit()
        except Exception as e:
            conn.rollback()
            log.warning(f"  [WARN] oasis_mapped update: {e}")'''

if OLD_FLAG in txt:
    txt = txt.replace(OLD_FLAG, NEW_FLAG)
    print("  [OK] Fixed oasis_mapped flag update (phase5)")
else:
    print("  [??] oasis_mapped flag update not found")

# Fix REFRESH VIEW in phase5
OLD_VIEW = '''    # Rafraichissement de la vue materialisee via psycopg2 (connexion directe)
    log.info("  [VIEW] REFRESH MATERIALIZED VIEW mv_occupation_full_profile...")
    try:
        import psycopg2
        db_url = SUPABASE_DB_URL
        if db_url:
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile")
            conn.close()
            log.info("  [VIEW] Vue materialisee rafraichie OK")
        else:
            log.warning("  [WARN] SUPABASE_DB_URL_DIRECT manquant - REFRESH ignore")
    except Exception as e:
        log.warning(f"  [WARN] Rafraichissement vue : {e}")'''

NEW_VIEW = '''    # Rafraichissement de la vue materialisee
    log.info("  [VIEW] REFRESH MATERIALIZED VIEW mv_occupation_full_profile...")
    try:
        old_ac = conn.autocommit
        conn.autocommit = True
        with conn.cursor() as _cur:
            _cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile")
        conn.autocommit = old_ac
        log.info("  [VIEW] Vue materialisee rafraichie OK")
    except Exception as e:
        log.warning(f"  [WARN] Rafraichissement vue : {e}")'''

if OLD_VIEW in txt:
    txt = txt.replace(OLD_VIEW, NEW_VIEW)
    print("  [OK] Fixed REFRESH VIEW (phase5)")
else:
    print("  [??] REFRESH VIEW block not found (may already be OK)")

# Fix the main() function calls
main_patches = [
    ("phase3_upsert_taxonomy(sb, all_files)",
     "phase3_upsert_taxonomy(conn, all_files)"),
    ("phase4_upsert_occupations(sb, all_files)",
     "phase4_upsert_occupations(conn, all_files)"),
    ("phase5_upsert_oasis_profiles(sb, all_files)",
     "phase5_upsert_oasis_profiles(conn, all_files)"),
    ("results = sanity_check(sb)",
     "results = sanity_check(sb, conn)"),
]

for old, new in main_patches:
    if old in txt:
        txt = txt.replace(old, new)
        print(f"  [OK] main patch: {old}")
    else:
        print(f"  [??] main not found: {old}")

# Fix sanity_check signature and body
OLD_SANITY_SIG = "def sanity_check(sb: Client):"
NEW_SANITY_SIG = "def sanity_check(sb: Client, conn=None):"

if OLD_SANITY_SIG in txt:
    txt = txt.replace(OLD_SANITY_SIG, NEW_SANITY_SIG)
    print("  [OK] sanity_check signature")

# Replace sanity_check table loop to use conn when available
OLD_SANITY_INNER = '''        try:
            resp = sb.table(table).select(pk, count="exact").limit(1).execute()
            count = resp.count if resp.count is not None else len(resp.data)
            results[table] = count'''

NEW_SANITY_INNER = '''        try:
            if conn:
                count = count_table(conn, table)
            else:
                resp = sb.table(table).select(pk, count="exact").limit(1).execute()
                count = resp.count if resp.count is not None else len(resp.data)
            results[table] = count'''

if OLD_SANITY_INNER in txt:
    txt = txt.replace(OLD_SANITY_INNER, NEW_SANITY_INNER)
    print("  [OK] sanity_check inner loop")

# Fix main to create conn
OLD_MAIN_CONN = "    # Connexion Supabase\n    sb = get_supabase()\n    log.info(\"OK Connexion Supabase etablie\")"
NEW_MAIN_CONN = """    # Connexion PostgreSQL directe (bypass RLS) + Supabase REST (lectures)
    conn = get_pgconn()
    log.info("OK Connexion PostgreSQL directe etablie")
    try:
        sb = get_supabase()
    except Exception:
        sb = None
        log.warning("Supabase REST non disponible — sanity check limite")"""

if OLD_MAIN_CONN in txt:
    txt = txt.replace(OLD_MAIN_CONN, NEW_MAIN_CONN)
    print("  [OK] main conn creation")
else:
    # Try without the specific text
    OLD_MAIN_CONN2 = '    sb = get_supabase()\n    log.info("OK Connexion Supabase etablie")'
    NEW_MAIN_CONN2 = '''    conn = get_pgconn()
    log.info("OK Connexion PostgreSQL directe etablie")
    try:
        sb = get_supabase()
    except Exception:
        sb = None'''
    if OLD_MAIN_CONN2 in txt:
        txt = txt.replace(OLD_MAIN_CONN2, NEW_MAIN_CONN2)
        print("  [OK] main conn creation (v2)")
    else:
        # Generic search and inject
        OLD_MAIN_SB = '    sb = get_supabase()'
        if OLD_MAIN_SB in txt:
            txt = txt.replace(OLD_MAIN_SB,
                '    conn = get_pgconn()\n    log.info("OK Connexion PostgreSQL directe etablie")\n    sb = get_supabase()')
            print("  [OK] main conn creation (v3 fallback)")

with open(TARGET, "w", encoding="utf-8") as f:
    f.write(txt)

print(f"\nPatch complete: {found} replacements applied.")
if not_found:
    print(f"Not found ({len(not_found)}): see above.")
