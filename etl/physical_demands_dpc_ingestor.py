"""
physical_demands_dpc_ingestor.py
================================
Pipeline ETL Trajektia — Phase B5 / A7
Ingestion des exigences physiques (force, postures, motricité, vision, ouïe)
et des fonctions Données-Personnes-Choses (DPC) issues du Guide sur les carrières
d'Emploi et Développement Social Canada (EDSC) avec le pont officiel StatCan CNP 2021.

Objectif Métier :
Fournir aux conseillers d'orientation (c.o.), conseillers en réadaptation
et intervenants SST/CNESST un module d'évaluation de l'aptitude à l'emploi
et des limitations fonctionnelles (port de charge maximal, station assise/debout, etc.).
"""

import os
import sys
import io
import re
import ssl
import urllib.request
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from neo4j import GraphDatabase
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── 1. Configuration & Environnement ──────────────────────────────────────────
load_dotenv("trajektia/.env")

PG_URL = os.getenv("SUPABASE_DB_URL")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PWD = os.getenv("NEO4J_PASSWORD", "")

URL_PHYS = "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/59046f5f-4477-4906-b28e-9a78c736e2a7/download/guidesurlescarrieres-2016_fr_activitesphysiques.csv"
URL_DPC = "https://open.canada.ca/data/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f/resource/33358d5f-50f9-4809-a250-eace9c3fb5e1/download/guidesurlescarrieres-2016_fr_donneespersonneschoses.csv"
CONCORDANCE_PATH = "data/raw/crosswalks/statcan_noc_2016_2021_concordance.csv"

CACHE_DIR = "data/raw/edsc"
os.makedirs(CACHE_DIR, exist_ok=True)
CACHE_PHYS = os.path.join(CACHE_DIR, "gc_2016_activites_physiques.csv")
CACHE_DPC = os.path.join(CACHE_DIR, "gc_2016_donnees_personnes_choses.csv")

# ── 2. Dictionnaires de libellés officiels EDSC ────────────────────────────────
STRENGTH_LABELS = {
    "S-1": ("Limitée (jusqu'à 5 kg)", 5),
    "S-2": ("Légère (jusqu'à 10 kg)", 10),
    "S-3": ("Moyenne (10 à 20 kg)", 20),
    "S-4": ("Lourde (plus de 20 kg)", 50)
}

POSITION_LABELS = {
    "B-1": "Assis",
    "B-2": "Debout et/ou marcher",
    "B-3": "Courbé, accroupi, à genoux, ramper",
    "B-4": "Grimper (hauteur, échelles)"
}

LIMB_LABELS = {
    "L-0": "Non requise",
    "L-1": "Membres supérieurs (bras, mains, doigts)",
    "L-2": "Coordination membres multiples (bras et jambes simultanés)"
}

VISION_LABELS = {
    "V-1": "Normale",
    "V-2": "Vue de près ou de loin",
    "V-3": "Champ visuel / Perception profondeur"
}

COLOUR_LABELS = {
    "C-0": "Non requise",
    "C-1": "Requise",
    "C-2": "Critique"
}

HEARING_LABELS = {
    "H-1": "Normale",
    "H-2": "Échange verbal / Sons",
    "H-3": "Audition critique"
}


def download_or_load(url: str, cache_path: str) -> pd.DataFrame:
    """Télécharge ou charge depuis le cache un fichier tabulaire."""
    if os.path.exists(cache_path):
        print(f"  [Cache local] Chargement de {cache_path}")
        with open(cache_path, "rb") as f:
            content = f.read()
    else:
        print(f"  [Téléchargement] Récupération depuis {url}")
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=20, context=ssl_ctx) as resp:
            content = resp.read()
        with open(cache_path, "wb") as f:
            f.write(content)
        print(f"  Enregistré dans le cache local: {cache_path}")
        
    return pd.read_csv(io.BytesIO(content), encoding='latin1', sep=None, engine='python')


def clean_gc_code(val) -> str:
    """Extrait le code de base 2016 sans décimale."""
    if pd.isna(val): return ""
    s = str(val).split('.')[0].strip()
    return s


def parse_dpc_number(text: str) -> str:
    """Extrait le chiffre d'une modalité DPC (ex: 'Synthétiser - 0' -> '0')."""
    if not text or pd.isna(text): return "?"
    m = re.search(r'-\s*(\d+)', str(text))
    return m.group(1) if m else "?"


def compute_prediger_axes(d_num: str, p_num: str, c_num: str) -> tuple[str, str]:
    """
    Projette le DPC sur les axes bipolaires de Prediger (1982) :
    - Choses vs Personnes (Réaliste vs Social)
    - Données vs Idées (Conventionnel vs Artistique/Investigateur)
    """
    try:
        d = int(d_num) if d_num.isdigit() else 8
        p = int(p_num) if p_num.isdigit() else 8
        c = int(c_num) if c_num.isdigit() else 8
    except:
        return "Équilibré", "Équilibré"

    # Axe Choses / Personnes
    is_things = (c <= 3) # Mise au point (0), Précision (1), Conduire (2), Faire fonctionner (3)
    is_people = (p <= 3) # Mentorat (0), Négocier (1), Instruire (2), Superviser (3)
    if is_things and not is_people:
        tp = "Choses (Réaliste R)"
    elif is_people and not is_things:
        tp = "Personnes (Social S)"
    elif is_things and is_people:
        tp = "Choses & Personnes (R/S)"
    else:
        tp = "Équilibré"

    # Axe Données / Idées
    if d <= 1:
        di = "Idées & Conception (A/I)" # Synthétiser (0), Coordonner (1)
    elif d in [2, 3, 4]:
        di = "Données & Analyse (C)"     # Analyser (2), Compiler (3), Calculer (4)
    else:
        di = "Opérationnel standard"

    return tp, di


def run_pipeline():
    print("=" * 70)
    print("🚀 TRAJEKTIA — Ingestion Exigences Physiques & DPC (Phase B5 / A7)")
    print("=" * 70)

    # 1. Chargement de la concordance StatCan officielle
    print("\n1. Chargement de la concordance StatCan CNP 2016 ↔ CNP 2021...")
    if not os.path.exists(CONCORDANCE_PATH):
        raise FileNotFoundError(f"Fichier de concordance manquant: {CONCORDANCE_PATH}")
    
    df_conc = pd.read_csv(CONCORDANCE_PATH, encoding='latin1')
    col_16 = df_conc.columns[0]
    col_21 = df_conc.columns[3]
    df_conc['noc_2016_clean'] = df_conc[col_16].astype(str).str.strip()
    df_conc['noc_2021_clean'] = df_conc[col_21].astype(str).str.strip().str.zfill(5)
    print(f"  ✓ {len(df_conc)} paires de concordance chargées.")

    # 2. Téléchargement / Chargement GC 2016
    print("\n2. Chargement des données ouvertes du Guide sur les carrières (EDSC)...")
    df_phys = download_or_load(URL_PHYS, CACHE_PHYS)
    df_dpc = download_or_load(URL_DPC, CACHE_DPC)

    df_phys['noc_2016_clean'] = df_phys.iloc[:, 0].apply(clean_gc_code)
    df_dpc['noc_2016_clean'] = df_dpc.iloc[:, 0].apply(clean_gc_code)

    # Renommage standardisé indépendant de l'encodage
    def find_col(df, pattern):
        matches = [c for c in df.columns if re.search(pattern, str(c), re.IGNORECASE)]
        return matches[0] if matches else None

    # Colonnes physiques
    c_force = find_col(df_phys, r'force')
    c_pos   = find_col(df_phys, r'position|postur')
    c_coord = find_col(df_phys, r'coordinat')
    c_vue   = find_col(df_phys, r'vue|vision')
    c_coul  = find_col(df_phys, r'couleur|color')
    c_ouie  = find_col(df_phys, r'ou|hear')

    rename_phys = {c_force: 'force_val', c_pos: 'pos_val', c_coord: 'coord_val', 
                   c_vue: 'vue_val', c_coul: 'coul_val', c_ouie: 'ouie_val'}
    df_phys = df_phys.rename(columns={k: v for k, v in rename_phys.items() if k})

    # Colonnes DPC
    c_data   = find_col(df_dpc, r'donn|data')
    c_people = find_col(df_dpc, r'person|people')
    c_things = find_col(df_dpc, r'chose|thing')

    rename_dpc = {c_data: 'dpc_data_raw', c_people: 'dpc_people_raw', c_things: 'dpc_things_raw'}
    df_dpc = df_dpc.rename(columns={k: v for k, v in rename_dpc.items() if k})

    print(f"  ✓ Activités physiques: {len(df_phys)} lignes.")
    print(f"  ✓ Données, Personnes, Choses: {len(df_dpc)} lignes.")

    # 3. Fusion et Normalisation vers CNP 2021
    print("\n3. Normalisation et projection vers les codes CNP 2021...")
    m_phys = df_conc.merge(df_phys, on='noc_2016_clean', how='inner')
    m_dpc = df_conc.merge(df_dpc, on='noc_2016_clean', how='inner')

    # Fusion globale sur (noc_2021_clean)
    phys_unique = m_phys.drop_duplicates(subset=['noc_2021_clean'])
    dpc_unique = m_dpc.drop_duplicates(subset=['noc_2021_clean'])

    merged = phys_unique.merge(
        dpc_unique[['noc_2021_clean', 'dpc_data_raw', 'dpc_people_raw', 'dpc_things_raw']], 
        on='noc_2021_clean', 
        how='left'
    )
    print(f"  ✓ {len(merged)} groupes professionnels CNP 2021 enrichis.")

    # 4. Connexion Supabase et vérification des codes CNP existants
    print("\n4. Connexion à Supabase pour filtrage et upsert...")
    conn = psycopg2.connect(PG_URL)
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("SELECT cnp_code FROM occupations;")
    db_cnps = set(r[0] for r in cur.fetchall())
    print(f"  ✓ {len(db_cnps)} codes métiers trouvés dans occupations.")

    # Préparation des lignes à insérer
    rows_to_insert = []
    neo4j_updates = []

    for _, row in merged.iterrows():
        cnp = str(row['noc_2021_clean']).strip()
        if cnp not in db_cnps:
            continue

        # Force
        s_code = str(row.get('force_val', '')).strip()
        s_label, max_w = STRENGTH_LABELS.get(s_code, (None, None))

        # Position
        b_code = str(row.get('pos_val', '')).strip()
        b_label = POSITION_LABELS.get(b_code, None)

        # Coordination
        l_code = str(row.get('coord_val', '')).strip()
        l_label = LIMB_LABELS.get(l_code, None)

        # Vision
        v_code = str(row.get('vue_val', '')).strip()
        v_label = VISION_LABELS.get(v_code, None)

        # Couleur
        c_code = str(row.get('coul_val', '')).strip()
        c_label = COLOUR_LABELS.get(c_code, None)

        # Ouïe
        h_code = str(row.get('ouie_val', '')).strip()
        h_label = HEARING_LABELS.get(h_code, None)

        # DPC
        d_val = str(row.get('dpc_data_raw', '')).strip()
        p_val = str(row.get('dpc_people_raw', '')).strip()
        c_val = str(row.get('dpc_things_raw', '')).strip()

        d_num = parse_dpc_number(d_val)
        p_num = parse_dpc_number(p_val)
        c_num = parse_dpc_number(c_val)

        dpc_summary = f"D-{d_num} | P-{p_num} | C-{c_num}" if (d_num != "?" or p_num != "?") else None
        prediger_tp, prediger_di = compute_prediger_axes(d_num, p_num, c_num)

        rows_to_insert.append((
            cnp,
            s_code or None,
            s_label,
            max_w,
            b_code or None,
            b_label,
            l_code or None,
            l_label,
            v_code or None,
            v_label,
            c_code or None,
            c_label,
            h_code or None,
            h_label,
            d_val or None,
            p_val or None,
            c_val or None,
            dpc_summary,
            prediger_tp,
            prediger_di,
            'EDSC Guide sur les carrières / StatCan CNP 2021'
        ))

        neo4j_updates.append({
            "cnp": cnp,
            "strength_code": s_code or None,
            "max_weight_kg": max_w,
            "body_position": b_label,
            "dpc_summary": dpc_summary,
            "prediger_tp": prediger_tp
        })

    print(f"  ✓ {len(rows_to_insert)} profils physiques & DPC prêts pour insertion.")

    # 5. Injection Supabase
    upsert_sql = """
    INSERT INTO occupation_physical_demands (
        occupation_cnp_code,
        strength_code, strength_label_fr, max_weight_kg,
        body_position_code, body_position_label_fr,
        limb_coordination_code, limb_coordination_label_fr,
        vision_code, vision_label_fr,
        colour_code, colour_label_fr,
        hearing_code, hearing_label_fr,
        dpc_data, dpc_people, dpc_things, dpc_summary,
        prediger_things_people, prediger_data_ideas,
        source
    ) VALUES %s
    ON CONFLICT (occupation_cnp_code) DO UPDATE SET
        strength_code = EXCLUDED.strength_code,
        strength_label_fr = EXCLUDED.strength_label_fr,
        max_weight_kg = EXCLUDED.max_weight_kg,
        body_position_code = EXCLUDED.body_position_code,
        body_position_label_fr = EXCLUDED.body_position_label_fr,
        limb_coordination_code = EXCLUDED.limb_coordination_code,
        limb_coordination_label_fr = EXCLUDED.limb_coordination_label_fr,
        vision_code = EXCLUDED.vision_code,
        vision_label_fr = EXCLUDED.vision_label_fr,
        colour_code = EXCLUDED.colour_code,
        colour_label_fr = EXCLUDED.colour_label_fr,
        hearing_code = EXCLUDED.hearing_code,
        hearing_label_fr = EXCLUDED.hearing_label_fr,
        dpc_data = EXCLUDED.dpc_data,
        dpc_people = EXCLUDED.dpc_people,
        dpc_things = EXCLUDED.dpc_things,
        dpc_summary = EXCLUDED.dpc_summary,
        prediger_things_people = EXCLUDED.prediger_things_people,
        prediger_data_ideas = EXCLUDED.prediger_data_ideas,
        updated_at = NOW();
    """

    try:
        execute_values(cur, upsert_sql, rows_to_insert)
        conn.commit()
        print(f"  🎉 Succès Supabase : {len(rows_to_insert)} enregistrements insérés dans occupation_physical_demands !")
    except Exception as e:
        conn.rollback()
        print(f"  ❌ Erreur insertion Supabase: {e}")
        raise
    finally:
        cur.close()
        conn.close()

    # 6. Injection Neo4j (Phase A7)
    print("\n5. Mise à jour des propriétés ergonomiques dans le graphe Neo4j...")
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PWD))
        with driver.session() as session:
            cypher_query = """
            UNWIND $batch AS item
            MATCH (o:Occupation)
            WHERE o.code STARTS WITH item.cnp
            SET o.strength_code = item.strength_code,
                o.max_weight_kg = item.max_weight_kg,
                o.body_position = item.body_position,
                o.dpc_summary   = item.dpc_summary,
                o.prediger_tp   = item.prediger_tp
            RETURN count(o) as updated
            """
            result = session.run(cypher_query, batch=neo4j_updates)
            updated_count = result.single()["updated"]
            print(f"  🎉 Succès Neo4j : {updated_count} nœuds (:Occupation) enrichis de leurs exigences physiques !")
        driver.close()
    except Exception as e:
        print(f"  ⚠️ Avertissement Neo4j (non bloquant): {e}")

    print("\n" + "=" * 70)
    print("✨ Phase B5 / A7 TERMINÉE AVEC SUCCÈS !")
    print("=" * 70)


if __name__ == "__main__":
    run_pipeline()
