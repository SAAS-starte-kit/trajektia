#!/usr/bin/env python3
"""
job_zones_supabase_ingestor.py
==============================
Ingestion des Job Zones O*NET (db_28_2 / 30.x) dans PostgreSQL / Supabase :
1. Crée / met à jour la table de référence `job_zones_reference` (5 zones avec métadonnées EN/FR et plages SVP).
2. Crée / met à jour la table `onet_job_zones` (924+ codes O*NET-SOC avec leur Job Zone).
3. Ajoute la colonne `job_zone` à la table centrale `occupations` si absente.
4. Propage `job_zone` dans `occupations` :
   - Correspondance directe : occupations.onet_soc_code = onet_job_zones.onet_soc_code
   - Correspondance indirecte : via `noc_onet_crosswalk` pour les codes CNP canadiens.

Usage:
    python etl/job_zones_supabase_ingestor.py
"""

import os
import sys
import logging
from pathlib import Path
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("job_zones_ingestor")

# Chemins du projet
TRAJ_ROOT = Path(__file__).resolve().parent.parent
DOTENV_PATH = TRAJ_ROOT / ".env"
load_dotenv(DOTENV_PATH, override=True)

# Chemins données O*NET
DATA_ONET = TRAJ_ROOT.parent / "data" / "raw" / "onet" / "db_28_2_text" / "db_28_2_text"
JOB_ZONE_REF_PATH = DATA_ONET / "Job Zone Reference.txt"
JOB_ZONES_PATH = DATA_ONET / "Job Zones.txt"

# Métadonnées en français pour chaque Job Zone (TEER / SVP / Préparation)
JOB_ZONE_FR_METADATA = {
    1: {
        "name_fr": "Zone 1 : Préparation minime ou inexistante",
        "experience_fr": "Peu ou pas d'expérience professionnelle préalable requise. L'employé peut débuter sans expérience antérieure.",
        "education_fr": "Diplôme d'études secondaires (DES/GED) parfois requis, ou aucune exigence formelle.",
        "job_training_fr": "Formation en cours d'emploi de quelques jours à quelques mois, souvent dispensée par un travailleur expérimenté.",
        "teer_equivalent": "TEER 5 (Aucune formation formelle requise)"
    },
    2: {
        "name_fr": "Zone 2 : Préparation de base requise",
        "experience_fr": "Une certaine expérience professionnelle préalable ou des compétences de base sont généralement nécessaires.",
        "education_fr": "Diplôme d'études secondaires (DES) habituellement requis.",
        "job_training_fr": "Formation pratique de quelques mois à un an sous supervision d'employés d'expérience ou apprentissage de base.",
        "teer_equivalent": "TEER 4 (Diplôme d'études secondaires ou formation spécifique courte)"
    },
    3: {
        "name_fr": "Zone 3 : Préparation moyenne requise",
        "experience_fr": "Expérience professionnelle significative, apprentissage ou formation professionnelle préalable obligatoire.",
        "education_fr": "Formation professionnelle (DEP/AEC), stage d'apprentissage reconnu ou diplôme d'études collégiales techniques (DEC).",
        "job_training_fr": "Un à deux ans de formation combinant pratique sur le terrain et théorie avec des professionnels chevronnés.",
        "teer_equivalent": "TEER 3 (Études collégiales de 2 ans, apprentissage ou responsabilités de supervision)"
    },
    4: {
        "name_fr": "Zone 4 : Préparation considérable requise",
        "experience_fr": "Vaste expérience professionnelle connexe requise (plusieurs années de pratique spécialisée).",
        "education_fr": "Baccalauréat universitaire de quatre ans (premier cycle) habituellement requis.",
        "job_training_fr": "Plusieurs années d'expérience pratique spécialisée, formation en cours d'emploi avancée ou accréditation professionnelle.",
        "teer_equivalent": "TEER 2 / TEER 1 (Diplôme universitaire de premier cycle ou collégial technique de 3 ans)"
    },
    5: {
        "name_fr": "Zone 5 : Préparation approfondie requise",
        "experience_fr": "Compétences et expérience très approfondies requises (souvent plus de 5 ans de spécialisation).",
        "education_fr": "Études supérieures de 2e ou 3e cycle (Maîtrise, Doctorat, diplôme professionnel en médecine ou droit).",
        "job_training_fr": "Formation médicale/clinique spécialisée (internat, résidence) ou recherche doctorale; expertise préalable postulée.",
        "teer_equivalent": "TEER 1 / TEER 0 (Diplôme universitaire supérieur / Cadres supérieurs)"
    }
}

def get_connection():
    urls_to_try = [
        os.getenv("SUPABASE_DB_URL"),          # pooler port 6543 (fiable)
        os.getenv("SUPABASE_DB_URL_DIRECT"),   # direct port 5432
    ]
    last_err = None
    for db_url in urls_to_try:
        if not db_url:
            continue
        try:
            conn = psycopg2.connect(db_url, connect_timeout=10)
            log.info(f"DB connectée avec succès via : {db_url.split('@')[-1] if '@' in db_url else '...'}")
            return conn
        except Exception as e:
            last_err = e
            log.warning(f"Connexion échouée via {db_url.split('@')[-1] if '@' in db_url else '...'} : {e}")
    raise EnvironmentError(f"Impossible de se connecter à PostgreSQL. Dernière erreur: {last_err}")

def setup_schema(conn):
    """Crée les tables et ajoute les colonnes nécessaires."""
    with conn.cursor() as cur:
        log.info("Vérification et création des tables du schéma Job Zones...")
        
        # 1. Table job_zones_reference
        cur.execute("""
            CREATE TABLE IF NOT EXISTS job_zones_reference (
                job_zone INTEGER PRIMARY KEY,
                name_en TEXT NOT NULL,
                name_fr TEXT,
                experience_en TEXT,
                experience_fr TEXT,
                education_en TEXT,
                education_fr TEXT,
                job_training_en TEXT,
                job_training_fr TEXT,
                examples_en TEXT,
                svp_range TEXT,
                teer_equivalent TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        """)
        
        # 2. Table onet_job_zones
        cur.execute("""
            CREATE TABLE IF NOT EXISTS onet_job_zones (
                onet_soc_code VARCHAR(15) PRIMARY KEY,
                job_zone INTEGER REFERENCES job_zones_reference(job_zone),
                date_updated VARCHAR(15),
                domain_source VARCHAR(100),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        """)
        
        # 3. Ajout colonne job_zone sur occupations si absente
        cur.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'occupations' AND column_name = 'job_zone'
                ) THEN
                    ALTER TABLE occupations ADD COLUMN job_zone INTEGER REFERENCES job_zones_reference(job_zone);
                END IF;
            END $$;
        """)
        
        # 4. Index sur onet_soc_code et job_zone
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_occupations_job_zone ON occupations(job_zone);
            CREATE INDEX IF NOT EXISTS idx_onet_job_zones_zone ON onet_job_zones(job_zone);
        """)
        
    conn.commit()
    log.info("[OK] Schéma configuré avec succès.")

def ingest_job_zone_reference(conn):
    """Ingère les définitions des 5 Job Zones."""
    if not JOB_ZONE_REF_PATH.exists():
        log.error(f"Fichier référence introuvable: {JOB_ZONE_REF_PATH}")
        return
        
    log.info(f"Lecture des définitions depuis {JOB_ZONE_REF_PATH.name}...")
    df = pd.read_csv(JOB_ZONE_REF_PATH, sep='\t', encoding='utf-8')
    
    rows = []
    for _, r in df.iterrows():
        zone = int(r['Job Zone'])
        fr = JOB_ZONE_FR_METADATA.get(zone, {})
        rows.append((
            zone,
            r['Name'],
            fr.get('name_fr', r['Name']),
            r.get('Experience', ''),
            fr.get('experience_fr', ''),
            r.get('Education', ''),
            fr.get('education_fr', ''),
            r.get('Job Training', ''),
            fr.get('job_training_fr', ''),
            r.get('Examples', ''),
            r.get('SVP Range', ''),
            fr.get('teer_equivalent', '')
        ))
        
    query = """
        INSERT INTO job_zones_reference (
            job_zone, name_en, name_fr, 
            experience_en, experience_fr, 
            education_en, education_fr, 
            job_training_en, job_training_fr, 
            examples_en, svp_range, teer_equivalent
        ) VALUES %s
        ON CONFLICT (job_zone) DO UPDATE SET
            name_en = EXCLUDED.name_en,
            name_fr = EXCLUDED.name_fr,
            experience_en = EXCLUDED.experience_en,
            experience_fr = EXCLUDED.experience_fr,
            education_en = EXCLUDED.education_en,
            education_fr = EXCLUDED.education_fr,
            job_training_en = EXCLUDED.job_training_en,
            job_training_fr = EXCLUDED.job_training_fr,
            examples_en = EXCLUDED.examples_en,
            svp_range = EXCLUDED.svp_range,
            teer_equivalent = EXCLUDED.teer_equivalent,
            updated_at = NOW();
    """
    with conn.cursor() as cur:
        execute_values(cur, query, rows)
    conn.commit()
    log.info(f"[OK] {len(rows)} Job Zones de référence insérées / mises à jour.")

def ingest_onet_job_zones(conn):
    """Ingère les correspondances O*NET SOC -> Job Zone."""
    if not JOB_ZONES_PATH.exists():
        log.error(f"Fichier Job Zones introuvable: {JOB_ZONES_PATH}")
        return
        
    log.info(f"Lecture des Job Zones O*NET depuis {JOB_ZONES_PATH.name}...")
    df = pd.read_csv(JOB_ZONES_PATH, sep='\t', encoding='utf-8')
    
    rows = [
        (
            str(r['O*NET-SOC Code']).strip(),
            int(r['Job Zone']),
            str(r['Date']).strip() if pd.notna(r['Date']) else None,
            str(r['Domain Source']).strip() if pd.notna(r['Domain Source']) else None
        )
        for _, r in df.iterrows()
    ]
    
    query = """
        INSERT INTO onet_job_zones (onet_soc_code, job_zone, date_updated, domain_source)
        VALUES %s
        ON CONFLICT (onet_soc_code) DO UPDATE SET
            job_zone = EXCLUDED.job_zone,
            date_updated = EXCLUDED.date_updated,
            domain_source = EXCLUDED.domain_source,
            updated_at = NOW();
    """
    with conn.cursor() as cur:
        execute_values(cur, query, rows, page_size=1000)
    conn.commit()
    log.info(f"[OK] {len(rows)} codes O*NET-SOC associés à leur Job Zone insérés / mis à jour.")

def propagate_job_zones_to_occupations(conn):
    """Propage les Job Zones vers la table occupations."""
    log.info("Propagation des Job Zones vers la table occupations...")
    
    with conn.cursor() as cur:
        # Étape 1 : Correspondance directe via occupations.onet_soc_code
        cur.execute("""
            UPDATE occupations o
            SET job_zone = jz.job_zone,
                updated_at = NOW()
            FROM onet_job_zones jz
            WHERE o.onet_soc_code = jz.onet_soc_code
              AND (o.job_zone IS NULL OR o.job_zone != jz.job_zone);
        """)
        direct_updated = cur.rowcount
        log.info(f"  -> Étape 1 (Lien direct SOC) : {direct_updated} occupations mises à jour.")
        
        # Étape 2 : Correspondance via noc_onet_crosswalk pour les codes CNP n'ayant pas de job_zone direct
        # On calcule le mode ou arrondi de la médiane des Job Zones associées au code CNP
        cur.execute("""
            WITH cnp_zone_agg AS (
                SELECT 
                    cw.noc_code,
                    ROUND(AVG(jz.job_zone))::INTEGER AS calculated_job_zone
                FROM noc_onet_crosswalk cw
                JOIN onet_job_zones jz ON cw.onet_soc_code = jz.onet_soc_code
                GROUP BY cw.noc_code
            )
            UPDATE occupations o
            SET job_zone = agg.calculated_job_zone,
                updated_at = NOW()
            FROM cnp_zone_agg agg
            WHERE (o.cnp_code = agg.noc_code OR o.noc_2021_code = agg.noc_code OR o.noc_5digit_code = agg.noc_code)
              AND o.job_zone IS NULL;
        """)
        crosswalk_updated = cur.rowcount
        log.info(f"  -> Étape 2 (Lien crosswalk NOC-SOC) : {crosswalk_updated} occupations enrichies.")
        
        # Stats globales
        cur.execute("SELECT count(*) FROM occupations WHERE job_zone IS NOT NULL;")
        total_with_zone = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM occupations;")
        total_occupations = cur.fetchone()[0]
        
        cur.execute("""
            SELECT jz.job_zone, jzr.name_fr, count(o.cnp_code)
            FROM occupations o
            JOIN job_zones_reference jzr ON o.job_zone = jzr.job_zone
            JOIN job_zones_reference jz ON o.job_zone = jz.job_zone
            GROUP BY jz.job_zone, jzr.name_fr
            ORDER BY jz.job_zone;
        """)
        distribution = cur.fetchall()
        
    conn.commit()
    log.info(f"[BILAN] {total_with_zone:,} / {total_occupations:,} occupations ont un Job Zone assigné ({total_with_zone/total_occupations*100:.1f}%).")
    log.info("Répartition des professions par Job Zone :")
    for zone, name_fr, count in distribution:
        log.info(f"   Zone {zone} ({name_fr}) : {count:,} professions")

def main():
    try:
        conn = get_connection()
        log.info("Connexion Supabase PostgreSQL établie.")
        setup_schema(conn)
        ingest_job_zone_reference(conn)
        ingest_onet_job_zones(conn)
        propagate_job_zones_to_occupations(conn)
        conn.close()
        log.info("Ingestion Job Zones Supabase terminée avec succès.")
    except Exception as e:
        log.exception(f"Erreur durant l'ingestion : {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
