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

def main():
    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    app_id = os.environ.get("ADZUNA_APP_ID")
    app_key = os.environ.get("ADZUNA_APP_KEY")
    db_url = os.environ.get("SUPABASE_DB_URL")

    if not app_id or not app_key or not db_url:
        print("Erreur : Identifiants manquants dans .env (ADZUNA_APP_ID, ADZUNA_APP_KEY ou SUPABASE_DB_URL).")
        sys.exit(1)

    print("Connexion à la base de données...")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute("SELECT cnp_code, title_fr FROM occupations WHERE title_fr IS NOT NULL AND title_fr != '' LIMIT 5;")
    metiers = cursor.fetchall()
    
    country = "ca"
    location = "Québec"

    for cnp_code, title in metiers:
        print(f"Recherche pour {title} (CNP {cnp_code})...")
        # Simplify title for search to get better results
        query = title.split('/')[0].split(',')[0].strip()
        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "what": query,
            "where": location,
            "results_per_page": 10,
            "content-type": "application/json"
        }
        
        full_url = f"{url}?{urllib.parse.urlencode(params)}"
        try:
            req = urllib.request.Request(full_url, headers={"User-Agent": "Trajektia-JobFetcher/1.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
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
                skills_to_check = ["python", "javascript", "typescript", "react", "node.js", "sql", "aws", "docker", "agile", "gestion", "communication", "analyse", "sécurité"]
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
                """, ("adzuna", external_id, cnp_code, job_title, company, city, salary_min, salary_max, description[:200], apply_url, extracted_skills))
            
            print(f" -> {len(results)} offres ingérées.")
        except urllib.error.HTTPError as e:
             print(f" -> Erreur HTTP Adzuna ({e.code}) : {e.read().decode('utf-8', errors='ignore')}")
        except Exception as e:
            print(f" -> Erreur pour {title}: {e}")

    cursor.close()
    conn.close()
    print("Ingestion terminée.")

if __name__ == "__main__":
    main()
