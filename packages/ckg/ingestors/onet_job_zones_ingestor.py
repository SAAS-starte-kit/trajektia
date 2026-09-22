#!/usr/bin/env python3
"""
onet_job_zones_ingestor.py
==========================
Ingestion des Job Zones O*NET dans le Career Knowledge Graph Neo4j :
1. Crée les 5 nœuds (:JobZone {zone: 1..5, ...}) avec les métadonnées de référence (SVP, formation, etc.).
2. Relie les nœuds (:Occupation) à leur (:JobZone) correspondante via la relation [:IN_JOB_ZONE].
3. Assigne la propriété `o.job_zone = row.job_zone` sur (:Occupation).

Usage:
    python ckg/ingestors/onet_job_zones_ingestor.py
"""

import sys
import os
import logging
from pathlib import Path
import pandas as pd
from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable, AuthError

# Ajouter ckg/ au sys.path
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import (
    NEO4J_URI, 
    NEO4J_USER, 
    NEO4J_PASSWORD, 
    NEO4J_DATABASE,
    ONET_JOB_ZONES,
    ONET_JOB_ZONE_REF
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("onet_job_zones_ingestor")

JOB_ZONE_FR_METADATA = {
    1: {
        "name_fr": "Zone 1 : Préparation minime ou inexistante",
        "teer_equivalent": "TEER 5 (Aucune formation formelle requise)"
    },
    2: {
        "name_fr": "Zone 2 : Préparation de base requise",
        "teer_equivalent": "TEER 4 (Diplôme d'études secondaires ou formation spécifique)"
    },
    3: {
        "name_fr": "Zone 3 : Préparation moyenne requise",
        "teer_equivalent": "TEER 3 (Études collégiales de 2 ans ou apprentissage)"
    },
    4: {
        "name_fr": "Zone 4 : Préparation considérable requise",
        "teer_equivalent": "TEER 2 / TEER 1 (Baccalauréat universitaire ou DEC technique)"
    },
    5: {
        "name_fr": "Zone 5 : Préparation approfondie requise",
        "teer_equivalent": "TEER 1 / TEER 0 (Maîtrise, Doctorat, formation médicale/juridique)"
    }
}

class OnetJobZonesIngestor:
    def __init__(self):
        self.driver = None

    def connect(self):
        try:
            self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            with self.driver.session(database=NEO4J_DATABASE) as session:
                session.run("RETURN 1 as ping").single()
            log.info(f"Connecté à Neo4j ({NEO4J_URI}).")
            return True
        except (ServiceUnavailable, ConnectionRefusedError, Exception) as e:
            log.warning(f"Neo4j inaccessible ({NEO4J_URI}) : {e}")
            log.warning("Le graphe Neo4j local est actuellement hors ligne. Démarrez Neo4j/Docker pour ingérer dans le graphe.")
            return False

    def close(self):
        if self.driver:
            self.driver.close()

    def run(self):
        if not self.connect():
            log.info("Annulation de l'ingestion Neo4j (serveur hors ligne). Les données ont toutefois été sécurisées dans PostgreSQL/Supabase.")
            return

        # 1. Ingestion des 5 nœuds JobZone de référence
        if not os.path.exists(ONET_JOB_ZONE_REF):
            log.error(f"Fichier référence introuvable: {ONET_JOB_ZONE_REF}")
            return

        log.info(f"Création des nœuds JobZone depuis {ONET_JOB_ZONE_REF}...")
        df_ref = pd.read_csv(ONET_JOB_ZONE_REF, sep='\t', encoding='utf-8')
        
        ref_records = []
        for _, r in df_ref.iterrows():
            zone = int(r['Job Zone'])
            meta_fr = JOB_ZONE_FR_METADATA.get(zone, {})
            ref_records.append({
                "zone": zone,
                "name_en": str(r.get('Name', '')),
                "name_fr": meta_fr.get('name_fr', str(r.get('Name', ''))),
                "experience": str(r.get('Experience', '')),
                "education": str(r.get('Education', '')),
                "job_training": str(r.get('Job Training', '')),
                "examples": str(r.get('Examples', '')),
                "svp_range": str(r.get('SVP Range', '')),
                "teer_equivalent": meta_fr.get('teer_equivalent', '')
            })

        query_nodes = """
        UNWIND $batch as row
        MERGE (jz:JobZone {zone: row.zone})
        SET jz.name_en = row.name_en,
            jz.name_fr = row.name_fr,
            jz.experience = row.experience,
            jz.education = row.education,
            jz.job_training = row.job_training,
            jz.examples = row.examples,
            jz.svp_range = row.svp_range,
            jz.teer_equivalent = row.teer_equivalent,
            jz.taxonomy = 'O*NET 28.2'
        """

        with self.driver.session(database=NEO4J_DATABASE) as session:
            session.run(query_nodes, batch=ref_records)
            log.info(f"[OK] {len(ref_records)} nœuds JobZone créés / mis à jour dans Neo4j.")

        # 2. Ingestion des associations Occupation -> JobZone
        if not os.path.exists(ONET_JOB_ZONES):
            log.error(f"Fichier Job Zones introuvable: {ONET_JOB_ZONES}")
            return

        log.info(f"Liaison des occupations aux Job Zones depuis {ONET_JOB_ZONES}...")
        df_zones = pd.read_csv(ONET_JOB_ZONES, sep='\t', encoding='utf-8')
        df_zones = df_zones.rename(columns={
            'O*NET-SOC Code': 'soc_code',
            'Job Zone': 'job_zone',
            'Date': 'date_updated',
            'Domain Source': 'domain_source'
        })
        
        records = df_zones[['soc_code', 'job_zone', 'date_updated', 'domain_source']].dropna(subset=['soc_code', 'job_zone']).to_dict('records')
        for r in records:
            r['job_zone'] = int(r['job_zone'])

        query_rel = """
        UNWIND $batch as row
        MATCH (o:Occupation) 
        WHERE o.onet_soc_code = row.soc_code OR o.code = row.soc_code
        MATCH (jz:JobZone {zone: row.job_zone})
        MERGE (o)-[r:IN_JOB_ZONE]->(jz)
        SET r.date_updated = row.date_updated,
            r.domain_source = row.domain_source,
            o.job_zone = row.job_zone
        """

        total = len(records)
        with self.driver.session(database=NEO4J_DATABASE) as session:
            for i in range(0, total, 500):
                batch = records[i:i+500]
                session.run(query_rel, batch=batch)
                print(f"   [OK] {min(i+500, total):,}/{total:,} relations traitées", end="\r")
        print()
        log.info(f"[DONE] Ingestion Neo4j Job Zones terminée ({total:,} codes traités).")

if __name__ == "__main__":
    ingestor = OnetJobZonesIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
