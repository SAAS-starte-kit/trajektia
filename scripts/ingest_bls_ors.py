#!/usr/bin/env python3
"""
Ingestion mockée des profils ergonomiques BLS ORS.
Associe des contraintes physiques précises à des CNP.
"""
import os
import sys
import random
from pathlib import Path
import psycopg2

def load_env_file(filepath: Path):
    if not filepath.exists():
        return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v

def main():
    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Erreur : SUPABASE_DB_URL manquant.")
        sys.exit(1)

    print("Connexion à Supabase...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # Prendre 50 métiers pour associer des profils ergonomiques
        cursor.execute("SELECT cnp_code FROM occupations LIMIT 50;")
        occupations = cursor.fetchall()
        
        inserted = 0
        freqs = ['Rare', 'Occasionnel', 'Fréquent', 'Constant']
        
        for (cnp_code,) in occupations:
            sitting = round(random.uniform(10.0, 90.0), 2)
            standing = round(100.0 - sitting, 2)
            freq = random.choice(freqs)
            max_lift = round(random.uniform(2.0, 30.0), 2)
            soc_code = f"{cnp_code}-SOC" # Fake SOC
            
            cursor.execute("""
                INSERT INTO bls_ors_profiles 
                (cnp_code, soc_code, sitting_duration_pct, standing_duration_pct, lifting_freq, max_lift_kg)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (cnp_code) DO NOTHING;
            """, (cnp_code, soc_code, sitting, standing, freq, max_lift))
            
            inserted += cursor.rowcount
                
        print(f"Ingestion terminée : {inserted} profils ergonomiques BLS ORS générés.")
        
    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
