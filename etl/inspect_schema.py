#!/usr/bin/env python3
"""Vérifie le schéma exact des tables."""
import os, psycopg2
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

for key in ["SUPABASE_DB_URL_DIRECT", "SUPABASE_DB_URL"]:
    url = os.getenv(key)
    try:
        conn = psycopg2.connect(url, connect_timeout=10)
        print(f"[DB] Connecté via {key}")
        break
    except Exception as e:
        print(f"[WARN] {key}: {e}")

cur = conn.cursor()

tables = ["oasis_descriptors", "oasis_work_environments", "cnp_hierarchy", 
          "occupation_oasis", "occupation_work_environments"]

for t in tables:
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position
    """, (t,))
    rows = cur.fetchall()
    print(f"\n=== {t} ===")
    for r in rows:
        print(f"  {r[0]:40s} {r[1]:20s} nullable={r[2]}")

conn.close()
