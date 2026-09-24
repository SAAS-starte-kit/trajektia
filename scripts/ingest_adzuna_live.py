#!/usr/bin/env python3
"""
Ingestion des offres en direct depuis Adzuna vers Supabase.
"""
import os
import sys
import json
import urllib.request
import urllib.parse
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

import argparse
import time

def main():
    parser = argparse.ArgumentParser(description="Ingestion en direct des offres Adzuna vers Supabase.")
    parser.add_argument("--limit", type=int, default=None, help="Nombre maximal de métiers à interroger (défaut: tous)")
    parser.add_argument("--cnp", type=str, default=None, help="Codes CNP ciblés séparés par des virgules (ex: 21232,21231,10011)")
    parser.add_argument("--delay", type=float, default=1.2, help="Délai en secondes entre deux requêtes Adzuna (défaut: 1.2s)")
    parser.add_argument("--per-page", type=int, default=10, help="Nombre de résultats par métier (défaut: 10)")
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    app_id = os.environ.get("ADZUNA_APP_ID")
    app_key = os.environ.get("ADZUNA_APP_KEY")
    db_url = os.environ.get("SUPABASE_DB_URL")

    if not app_id or not app_key or not db_url:
        print("Erreur : Identifiants manquants dans .env (ADZUNA_APP_ID, ADZUNA_APP_KEY ou SUPABASE_DB_URL).")
        sys.exit(1)

    print("Connexion à la base de données Supabase...")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    if args.cnp:
        target_cnps = [c.strip() for c in args.cnp.split(",") if c.strip()]
        placeholders = ",".join(["%s"] * len(target_cnps))
        query = f"SELECT cnp_code, title_fr FROM occupations WHERE cnp_code IN ({placeholders}) ORDER BY cnp_code"
        cursor.execute(query, tuple(target_cnps))
    else:
        limit_clause = f" LIMIT {args.limit}" if args.limit else ""
        query = f"""
            SELECT cnp_code, title_fr 
            FROM occupations 
            WHERE length(cnp_code) = 5 AND title_fr IS NOT NULL AND title_fr != '' 
            ORDER BY cnp_code{limit_clause};
        """
        cursor.execute(query)

    metiers = cursor.fetchall()
    total = len(metiers)
    print(f"[Adzuna Ingestion] {total} métiers à traiter (délai: {args.delay}s, per_page: {args.per_page})...")
    
    country = "ca"
    location = "Québec"
    total_inserted = 0

    for idx, (cnp_code, title) in enumerate(metiers, 1):
        clean_title = title.split('/')[0].split(',')[0].strip()
        print(f"[{idx}/{total}] Recherche pour {clean_title} (CNP {cnp_code})...", end="", flush=True)
        
        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "what": clean_title,
            "where": location,
            "results_per_page": args.per_page,
            "content-type": "application/json"
        }
        
        full_url = f"{url}?{urllib.parse.urlencode(params)}"
        try:
            req = urllib.request.Request(full_url, headers={"User-Agent": "Trajektia-JobFetcher/1.0"})
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            
            results = data.get("results", [])
            for job in results:
                external_id = str(job.get("id"))
                job_title = job.get("title", "Sans titre")
                company = job.get("company", {}).get("display_name", "Confidentiel")
                city = job.get("location", {}).get("display_name", location)
                salary_min = job.get("salary_min")
                salary_max = job.get("salary_max")
                apply_url = job.get("redirect_url", "")
                description = job.get("description", "")
                
                desc_lower = description.lower()
                skills_to_check = [
                    "python", "javascript", "typescript", "react", "node.js", "sql", "aws", "docker", 
                    "agile", "gestion", "communication", "analyse", "sécurité", "ventes", "comptabilité",
                    "soins", "ingénierie", "service client", "bilinguisme", "excel"
                ]
                extracted_skills = [s for s in skills_to_check if s in desc_lower]
                
                cursor.execute("""
                    INSERT INTO trajektia_live_job_postings
                    (source, external_id, cnp_code, title, company_name, location_city, salary_min, salary_max, description_snippet, apply_url, extracted_skills)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (external_id) DO UPDATE SET
                        title = EXCLUDED.title,
                        salary_min = EXCLUDED.salary_min,
                        salary_max = EXCLUDED.salary_max,
                        expires_at = NOW() + INTERVAL '30 days';
                """, ("adzuna", external_id, cnp_code, job_title, company, city, salary_min, salary_max, description[:250], apply_url, extracted_skills))
                total_inserted += 1
            
            print(f" -> {len(results)} offres.")
            time.sleep(args.delay)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f" -> Rate Limit 429! Pause de 15 secondes...")
                time.sleep(15)
            else:
                print(f" -> Erreur HTTP Adzuna ({e.code})")
        except Exception as e:
            print(f" -> Erreur pour {title}: {e}")

    cursor.close()
    conn.close()
    print(f"[Adzuna Ingestion] Terminé avec succès! Total opérations: {total_inserted} offres traitées.")

if __name__ == "__main__":
    main()
