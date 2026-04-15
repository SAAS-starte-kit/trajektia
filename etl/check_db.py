#!/usr/bin/env python3
"""Audit rapide de l'état de la base de données Trajektia."""
import os, psycopg2
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")
# Essaie direct puis pooler
for url_key in ["SUPABASE_DB_URL_DIRECT", "SUPABASE_DB_URL"]:
    url = os.getenv(url_key)
    try:
        conn = psycopg2.connect(url, connect_timeout=10)
        print(f"  [DB] Connecté via {url_key}")
        break
    except Exception as e:
        print(f"  [WARN] {url_key} échoué: {e}")
cur = conn.cursor()

tables = [
    "occupations", "oasis_descriptors", "oasis_work_environments",
    "occupation_oasis", "occupation_work_environments",
    "occupation_job_titles", "occupation_exclusions",
    "occupation_requirements", "cnp_concordance_2016_2021",
    "occupation_legacy_dpt",
]

# Vérification de la table cnp_hierarchy (peut ne pas exister)
try:
    cur.execute('SELECT COUNT(*) FROM "cnp_hierarchy"')
    tables.append("cnp_hierarchy")
except Exception:
    conn.rollback()
    print("  [INFO] Table cnp_hierarchy inexistante")

print("=== ÉTAT DE LA BASE ===")
for t in tables:
    try:
        cur.execute(f'SELECT COUNT(*) FROM "{t}"')
        n = cur.fetchone()[0]
        st = "OK  " if n > 0 else "VIDE"
        print(f"  [{st}] {t:45s} {n:>8} lignes")
    except Exception as e:
        conn.rollback()
        print(f"  [ERR] {t}: {e}")

# Exemples oasis_descriptors
print()
print("=== EXEMPLES oasis_descriptors (5 premières) ===")
try:
    cur.execute("SELECT oasis_code, name_en FROM oasis_descriptors LIMIT 5")
    for row in cur.fetchall():
        print(f"  {row}")
except Exception as e:
    conn.rollback()
    print(f"  ERR: {e}")

# Vérif occupation_oasis liens
print()
print("=== occupation_oasis: top codes CNP mappés ===")
try:
    cur.execute("""
        SELECT occupation_cnp_code, COUNT(*) as n
        FROM occupation_oasis
        GROUP BY occupation_cnp_code
        ORDER BY n DESC
        LIMIT 5
    """)
    for row in cur.fetchall():
        print(f"  {row}")
    cur.execute("SELECT COUNT(DISTINCT occupation_cnp_code) FROM occupation_oasis")
    print(f"  DISTINCT CNP couverts: {cur.fetchone()[0]}")
except Exception as e:
    conn.rollback()
    print(f"  ERR: {e}")

conn.close()
print("\nAudit terminé.")
