#!/usr/bin/env python3
"""
Ingestion historique des offres d'emploi Guichet-Emplois (Open Canada CKAN)
sur les 12 à 14 derniers mois pour alimenter trajektia_market_snapshots.
"""
import os
import sys
import re
import csv
import io
import json
import time
import urllib.request
import statistics
from datetime import datetime
from pathlib import Path
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

CKAN_PACKAGE_URL = "https://open.canada.ca/data/api/action/package_show?id=ea639e28-c0fc-48bf-b5dd-b8899bd43072"

MONTH_MAP = {
    'jan': '01', 'fev': '02', 'mars': '03', 'avril': '04', 'apr': '04',
    'mai': '05', 'may': '05', 'juin': '06', 'jun': '06', 'juillet': '07',
    'jul': '07', 'aout': '08', 'aug': '08', 'septembre': '09', 'sep': '09',
    'octobre': '10', 'oct': '10', 'novembre': '11', 'nov': '11',
    'decembre': '12', 'dec': '12'
}

def get_available_ckan_months():
    """Découvre toutes les ressources CSV mensuelles disponibles sur Open Canada."""
    req = urllib.request.Request(CKAN_PACKAGE_URL, headers={'User-Agent': 'Trajektia-12m-Fetcher/1.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    
    resources = data.get('result', {}).get('resources', [])
    months_found = {}
    
    for r in resources:
        url = r.get('url', '')
        if not url.endswith('.csv'):
            continue
        m = re.search(r'-(fr|en)-([a-z]+)(202[0-9])\.csv', url)
        if m:
            lang, m_str, y_str = m.group(1), m.group(2), m.group(3)
            m_num = MONTH_MAP.get(m_str)
            if m_num:
                date_key = f"{y_str}-{m_num}-01"
                # Privilégier le CSV français, repli sur l'anglais
                if date_key not in months_found or lang == 'fr':
                    months_found[date_key] = {
                        'date': date_key,
                        'month_str': m_str,
                        'year_str': y_str,
                        'url': url,
                        'lang': lang,
                        'name': r.get('name')
                    }
    return sorted(months_found.values(), key=lambda x: x['date'])

def process_monthly_csv(resource_info, valid_cnps, statcan_salaries):
    """Télécharge et extrait les statistiques CNP d'un fichier mensuel."""
    url = resource_info['url']
    date_str = resource_info['date']
    print(f"\n[CKAN] Téléchargement du snapshot {date_str} ({resource_info['lang']}) : {url} ...")
    
    t0 = time.time()
    req = urllib.request.Request(url, headers={'User-Agent': 'Trajektia-12m-Fetcher/1.0'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        content = resp.read().decode('utf-8', errors='ignore').replace('\x00', '')
    
    dl_time = time.time() - t0
    size_mb = len(content) / (1024 * 1024)
    print(f"[CKAN] Téléchargé {size_mb:.1f} MB en {dl_time:.2f}s")
    
    reader = csv.reader(io.StringIO(content), delimiter='\t')
    header = next(reader)
    col_map = {col.strip(): i for i, col in enumerate(header)}
    
    # Repérage des index de colonnes
    cnp_idx = -1
    for k in ['Code CNP 2021', 'Code CNP21', '2021 NOC Code', 'NOC 2021']:
        if k in col_map:
            cnp_idx = col_map[k]
            break
    if cnp_idx == -1:
        # Fallback recherche partielle
        for k, v in col_map.items():
            if '2021' in k and ('cnp' in k.lower() or 'noc' in k.lower()):
                cnp_idx = v
                break
                
    sal_par_idx = col_map.get('Salaire par', col_map.get('Wage per', -1))
    sal_min_idx = col_map.get('Salaire Minimum', col_map.get('Wage Minimum', col_map.get('Low Wage', -1)))
    sal_max_idx = col_map.get('Salaire Maximum', col_map.get('Wage Maximum', col_map.get('High Wage', -1)))
    virtuel_idx = col_map.get("Conditions d'emploi Virtuel", col_map.get("Virtual work", -1))
    
    cnp_postings = {}
    cnp_salaries = {}
    cnp_virtuel = {}
    
    row_count = 0
    for row in reader:
        row_count += 1
        if len(row) <= cnp_idx or cnp_idx == -1:
            continue
        cnp = row[cnp_idx].strip()
        if len(cnp) == 4 and cnp.isdigit():
            cnp = cnp.ljust(5, '0')
        if not (len(cnp) == 5 and cnp.isdigit()):
            continue
        if cnp not in valid_cnps:
            continue
            
        cnp_postings[cnp] = cnp_postings.get(cnp, 0) + 1
        
        # Télétravail / Virtuel
        if virtuel_idx != -1 and len(row) > virtuel_idx:
            v_val = row[virtuel_idx].strip().lower()
            if v_val in ('oui', 'yes', 'true', '1'):
                cnp_virtuel[cnp] = cnp_virtuel.get(cnp, 0) + 1
                
        # Salaire
        if sal_par_idx != -1 and sal_min_idx != -1 and len(row) > max(sal_par_idx, sal_min_idx):
            par = row[sal_par_idx].strip().lower()
            s_min_raw = row[sal_min_idx].strip().replace(',', '.')
            try:
                val = float(s_min_raw)
                annual = None
                if 'heure' in par or 'hour' in par:
                    annual = val * 1820
                elif 'ann' in par or 'year' in par:
                    annual = val
                elif 'mois' in par or 'month' in par:
                    annual = val * 12
                elif 'semaine' in par or 'week' in par:
                    annual = val * 52
                elif 'jour' in par or 'day' in par:
                    annual = val * 260
                    
                if annual and 18000 <= annual <= 350000:
                    cnp_salaries.setdefault(cnp, []).append(annual)
            except (ValueError, TypeError):
                pass
                
    print(f"[CKAN] {row_count} lignes traitées. {len(cnp_postings)} CNP valides trouvées.")
    
    # Préparation des lignes de snapshots
    snapshot_rows = []
    avg_vol = (sum(cnp_postings.values()) / max(1, len(cnp_postings))) if cnp_postings else 1.0
    
    for cnp, vol in cnp_postings.items():
        sals = cnp_salaries.get(cnp, [])
        med_sal = round(statistics.median(sals), 2) if sals else None
        min_sal = round(min(sals), 2) if sals else None
        max_sal = round(max(sals), 2) if sals else None
        
        # Remote ratio
        virt_cnt = cnp_virtuel.get(cnp, 0)
        remote_pct = round((virt_cnt / vol) * 100, 2)
        
        # StatCan comparison
        statcan_med = statcan_salaries.get(cnp)
        delta_pct = None
        if med_sal and statcan_med and float(statcan_med) > 0:
            delta_pct = round(((med_sal - float(statcan_med)) / float(statcan_med)) * 100, 2)
            
        # Tension index (1.00 à 10.00 calibré sur ratio volume relatif)
        rel_demand = vol / avg_vol
        tension = min(10.0, max(1.0, round(1.0 + rel_demand * 2.5, 2)))
        
        meta = {
            "source": "Job Bank Open Data CKAN",
            "sample_salaries_count": len(sals),
            "remote_postings_count": virt_cnt,
            "processed_at": datetime.now().isoformat()
        }
        
        snapshot_rows.append((
            cnp,
            date_str,
            vol,
            med_sal,
            min_sal,
            max_sal,
            statcan_med,
            delta_pct,
            tension,
            remote_pct,
            json.dumps(meta)
        ))
        
    return snapshot_rows

def main():
    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Erreur: SUPABASE_DB_URL manquant dans l'environnement.")
        sys.exit(1)
        
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    
    # 1. Charger les CNP valides et les salaires StatCan officiels
    cursor.execute("SELECT cnp_code, median_salary FROM occupations WHERE length(cnp_code) = 5;")
    occupations_data = cursor.fetchall()
    valid_cnps = set(row[0] for row in occupations_data)
    statcan_salaries = {row[0]: row[1] for row in occupations_data if row[1] is not None}
    print(f"[Init] {len(valid_cnps)} professions CNP 2021 valides dans Supabase.")
    
    # 2. Récupérer les mois CKAN
    available_months = get_available_ckan_months()
    print(f"[Init] {len(available_months)} mois disponibles sur CKAN.")
    
    # Prendre les 14 derniers mois (e.g. août 2025 à août 2026)
    target_months = available_months[-14:]
    print("\n[Cible] Mois sélectionnés pour les séries temporelles 12 mois :")
    for tm in target_months:
        print(f"  - {tm['date']} ({tm['month_str']} {tm['year_str']}) [{tm['lang']}]")
        
    upsert_sql = """
    INSERT INTO trajektia_market_snapshots (
        cnp_code, snapshot_date, postings_volume,
        salary_live_median, salary_live_min, salary_live_max,
        statcan_official_median, delta_market_pct, market_tension_index,
        remote_ratio_pct, metadata
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (cnp_code, snapshot_date) DO UPDATE SET
        postings_volume = EXCLUDED.postings_volume,
        salary_live_median = COALESCE(EXCLUDED.salary_live_median, trajektia_market_snapshots.salary_live_median),
        salary_live_min = COALESCE(EXCLUDED.salary_live_min, trajektia_market_snapshots.salary_live_min),
        salary_live_max = COALESCE(EXCLUDED.salary_live_max, trajektia_market_snapshots.salary_live_max),
        statcan_official_median = COALESCE(EXCLUDED.statcan_official_median, trajektia_market_snapshots.statcan_official_median),
        delta_market_pct = COALESCE(EXCLUDED.delta_market_pct, trajektia_market_snapshots.delta_market_pct),
        market_tension_index = COALESCE(EXCLUDED.market_tension_index, trajektia_market_snapshots.market_tension_index),
        remote_ratio_pct = COALESCE(EXCLUDED.remote_ratio_pct, trajektia_market_snapshots.remote_ratio_pct),
        metadata = EXCLUDED.metadata;
    """
    
    total_snapshots_inserted = 0
    for res_info in target_months:
        snapshot_rows = process_monthly_csv(res_info, valid_cnps, statcan_salaries)
        if snapshot_rows:
            execute_batch(cursor, upsert_sql, snapshot_rows, page_size=200)
            total_snapshots_inserted += len(snapshot_rows)
            print(f"[Succès] {len(snapshot_rows)} snapshots insérés/mis à jour pour {res_info['date']}.")
            
    print(f"\n[Terminé] Total snapshots insérés : {total_snapshots_inserted}")
    
    # Vérification de la vue analytique
    cursor.execute("""
        SELECT count(*), 
               count(salary_growth_12m_pct), 
               ROUND(AVG(salary_growth_12m_pct), 2),
               count(demand_growth_12m_pct), 
               ROUND(AVG(demand_growth_12m_pct), 2)
        FROM v_trajektia_career_trends_12m;
    """)
    trends_summary = cursor.fetchone()
    print("\n[Vue v_trajektia_career_trends_12m] Statistiques :")
    print(f"  - Total métiers analysés : {trends_summary[0]}")
    print(f"  - Métiers avec calcul de croissance salariale 12m : {trends_summary[1]} (Moyenne : {trends_summary[2]} %)")
    print(f"  - Métiers avec calcul de croissance demande 12m : {trends_summary[3]} (Moyenne : {trends_summary[4]} %)")
    
    conn.close()

if __name__ == "__main__":
    main()
