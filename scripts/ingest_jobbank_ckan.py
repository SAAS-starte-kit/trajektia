#!/usr/bin/env python3
"""
Ingestion des données agrégées Guichet-Emplois depuis CKAN vers Supabase.
"""
import os
import sys
import json
import urllib.request
import csv
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
        print("Erreur : Identifiants manquants dans .env (SUPABASE_DB_URL).")
        sys.exit(1)

    print("Recherche du dernier CSV sur Open Canada CKAN...")
    ckan_url = "https://open.canada.ca/data/api/action/package_show?id=ea639e28-c0fc-48bf-b5dd-b8899bd43072"
    
    try:
        req = urllib.request.Request(ckan_url, headers={"User-Agent": "Trajektia-DataFetcher/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
        resources = data.get("result", {}).get("resources", [])
        if not resources:
            print("Aucune ressource trouvée.")
            return

        latest_csv_url = None
        for res in sorted(resources, key=lambda x: x.get("created", ""), reverse=True):
            if res.get("format", "").upper() == "CSV" and "fr" in res.get("language", []):
                latest_csv_url = res.get("url")
                break
                
        if not latest_csv_url:
            print("Aucun CSV français trouvé.")
            return
            
        print(f"Téléchargement de l'échantillon de {latest_csv_url} ...")
        
        req_csv = urllib.request.Request(latest_csv_url, headers={"User-Agent": "Trajektia-DataFetcher/1.0"})
        with urllib.request.urlopen(req_csv, timeout=20) as resp_csv:
            content = resp_csv.read(1024 * 1024).decode('utf-8', errors='ignore').replace('\0', '') 
            
        lines = content.split('\n')
        reader = csv.DictReader(lines)
        
        volumes = {}
        for row in reader:
            if not row: continue
            cnp = None
            for key in row.keys():
                if key and ('NOC' in key.upper() or 'CNP' in key.upper()):
                    cnp = row[key]
                    break
            
            if cnp and str(cnp).strip().isdigit():
                cnp = str(cnp).strip()
                if len(cnp) == 4:
                    cnp = cnp.ljust(5, '0') # Ensure 5 digits for 2021 NOC format
                volumes[cnp] = volumes.get(cnp, 0) + 1
        
        print(f"Analyse terminée. {len(volumes)} codes CNP trouvés dans l'échantillon.")
        
        print("Connexion à la base de données...")
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        snapshot_date = datetime.now().strftime("%Y-%m-01")
        
        # Filter for valid CNP codes that exist in our occupations table
        cursor.execute("SELECT cnp_code FROM occupations;")
        valid_cnps = set(row[0] for row in cursor.fetchall())
        
        inserted = 0
        for cnp, volume in volumes.items():
            if cnp in valid_cnps:
                cursor.execute("""
                    INSERT INTO trajektia_market_snapshots
                    (cnp_code, snapshot_date, postings_volume)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (cnp_code, snapshot_date) DO UPDATE SET
                        postings_volume = trajektia_market_snapshots.postings_volume + EXCLUDED.postings_volume;
                """, (cnp, snapshot_date, volume))
                inserted += 1
            
        print(f"{inserted} agrégations CNP insérées dans trajektia_market_snapshots.")
        
    except Exception as e:
        print(f"Erreur CKAN: {e}")

if __name__ == "__main__":
    main()
