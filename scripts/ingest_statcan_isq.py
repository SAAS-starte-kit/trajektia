#!/usr/bin/env python3
"""
Ingestion mockée des trajectoires LAD et ISQ baselines.
En production, les données viendront d'extraits officiels volumineux.
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

        # 1. ISQ Baselines
        age_groups = ['15-24', '25-34', '35-44', '45-54', '55-64', '65+']
        genders = ['Hommes', 'Femmes', 'Tous']
        year = 2023
        
        isq_inserted = 0
        for age in age_groups:
            for gender in genders:
                base_income = random.randint(25000, 65000)
                if age in ['35-44', '45-54']: base_income += 20000
                if gender == 'Hommes': base_income += 5000 # malheureusement réaliste
                
                cursor.execute("""
                    INSERT INTO isq_income_baselines (age_group, gender, median_income_quebec, snapshot_year)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (age_group, gender, snapshot_year) DO NOTHING;
                """, (age, gender, base_income, year))
                isq_inserted += cursor.rowcount
                
        print(f"-> {isq_inserted} baselines ISQ générées.")

        # 2. LAD Trajectories
        cursor.execute("SELECT cnp_code, median_salary FROM occupations WHERE median_salary IS NOT NULL LIMIT 50;")
        occupations = cursor.fetchall()
        
        lad_inserted = 0
        for cnp_code, base_salary in occupations:
            for years in [1, 5, 10, 15]:
                # Simulation de croissance
                growth = 1.0 + (years * random.uniform(0.02, 0.05))
                base = float(base_salary)
                if base < 1000:
                    base = base * 2080 # Convert hourly to annual
                income = base * growth # Apply growth
                retention = max(10, 95 - (years * random.uniform(1.0, 3.5)))
                
                cursor.execute("""
                    INSERT INTO statcan_lad_trajectories (cnp_code, years_post_grad, median_income, retention_rate_pct, snapshot_year)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (cnp_code, years_post_grad, snapshot_year) DO NOTHING;
                """, (cnp_code, years, income, retention, year))
                lad_inserted += cursor.rowcount

        print(f"-> {lad_inserted} trajectoires LAD générées.")
        print("Ingestion complète.")

    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
