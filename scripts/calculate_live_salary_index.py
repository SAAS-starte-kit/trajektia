#!/usr/bin/env python3
"""
Calcul de l'Indice Salarial Trajektia en Direct™.
Ce script agrège les salaires des offres actives dans `trajektia_live_job_postings`
pour mettre à jour `salary_live_median`, `salary_live_min` et `salary_live_max`
dans la table `trajektia_market_snapshots`.
"""
import os
import sys
from pathlib import Path
import psycopg2
from datetime import datetime

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

    print("Connexion à la base de données...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Le calcul de l'Indice :
        # On regroupe par cnp_code toutes les offres actives (is_active = true et expires_at > now)
        # On normalise en salaire horaire pour comparer (si salaire_type = 'annual', on divise par 2080 heures)
        # Mais pour la simplicité de l'exemple, on supposera que les salaires Adzuna sont principalement annuels.
        # Ajustement : on ramène tout à un taux annuel.
        
        query = """
        WITH normalized_salaries AS (
            SELECT 
                cnp_code,
                CASE 
                    WHEN salary_type = 'hourly' THEN salary_min * 2080
                    WHEN salary_type = 'monthly' THEN salary_min * 12
                    ELSE salary_min
                END as annual_min,
                CASE 
                    WHEN salary_type = 'hourly' THEN salary_max * 2080
                    WHEN salary_type = 'monthly' THEN salary_max * 12
                    ELSE salary_max
                END as annual_max
            FROM trajektia_live_job_postings
            WHERE is_active = true 
              AND expires_at > NOW()
              AND salary_min IS NOT NULL
        ),
        averages AS (
            SELECT 
                cnp_code,
                MIN(annual_min) as live_min,
                MAX(annual_max) as live_max,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (annual_min + COALESCE(annual_max, annual_min)) / 2) as live_median
            FROM normalized_salaries
            GROUP BY cnp_code
        )
        SELECT cnp_code, live_min, live_max, live_median FROM averages;
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        if not results:
            print("Aucune offre avec salaire trouvée pour le calcul de l'indice.")
            return

        snapshot_date = datetime.now().strftime("%Y-%m-01")
        updated_count = 0
        
        for row in results:
            cnp_code, live_min, live_max, live_median = row
            
            cursor.execute("""
                INSERT INTO trajektia_market_snapshots
                (cnp_code, snapshot_date, salary_live_min, salary_live_max, salary_live_median)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (cnp_code, snapshot_date) DO UPDATE SET
                    salary_live_min = EXCLUDED.salary_live_min,
                    salary_live_max = EXCLUDED.salary_live_max,
                    salary_live_median = EXCLUDED.salary_live_median;
            """, (cnp_code, snapshot_date, live_min, live_max, live_median))
            
            updated_count += 1
            
        print(f"Indice Salarial en Direct mis à jour pour {updated_count} professions (Snapshot: {snapshot_date}).")
        
    except Exception as e:
        print(f"Erreur lors du calcul : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
