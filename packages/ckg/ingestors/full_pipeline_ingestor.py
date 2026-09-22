import os
import pandas as pd
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Configuration
load_dotenv()
URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "admin123")

# Data Paths
CROSSWALK_DIR = "data/raw/crosswalks"
ONET_DATA_PATH = "data/raw/onet/db_28_2_text/db_28_2_text/Occupation Data.txt"

class FullPipelineIngestor:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.database = "neo4j"

    def close(self):
        self.driver.close()

    def normalize_noc(self, code):
        """Normalizes NOC from 00010.00 to 10.0 to match current graph."""
        try:
            return str(float(code))
        except:
            return str(code).strip()

    def load_noc_onet_crosswalk(self):
        """Loads NOC 2021 -> O*NET SOC mapping."""
        csv_path = os.path.join(CROSSWALK_DIR, "noc_onet_mapping.csv")
        if not os.path.exists(csv_path):
            print(f"[ERROR] {csv_path} introuvable.")
            return

        print(f"[1/4] Chargement du Crosswalk NOC-O*NET...")
        df = pd.read_csv(csv_path)
        df['noc_norm'] = df['noc'].apply(self.normalize_noc)
        
        # O*NET codes in the CSV might be 11-1011.00, we want them as strings
        df['onet_code'] = df['onet'].astype(str).str.strip()

        query = """
        UNWIND $batch AS row
        MATCH (o:Occupation {code: row.noc_norm})
        SET o.onet_soc_code = row.onet_code
        MERGE (on:Occupation {code: row.onet_code})
        ON CREATE SET on.title_en = row.onet_title, on.taxonomy = 'O*NET'
        MERGE (o)-[:EQUIVALENT_TO {source: 'The Dais', confidence: 1.0}]->(on)
        """

        with self.driver.session(database=self.database) as session:
            batch = df[['noc_norm', 'onet_code', 'onet_title']].to_dict('records')
            session.run(query, batch=batch)
        print(f"   OK: {len(df)} relations NOC-O*NET créées.")

    def load_esco_onet_crosswalk(self):
        """Loads O*NET SOC -> ESCO URI mapping."""
        csv_path = os.path.join(CROSSWALK_DIR, "esco_onet_mapping.csv")
        if not os.path.exists(csv_path):
            print(f"[ERROR] {csv_path} introuvable.")
            return

        print(f"[2/4] Chargement du Crosswalk O*NET-ESCO...")
        # Skip metadata lines (16)
        df = pd.read_csv(csv_path, skiprows=16, encoding='utf-8-sig')
        df = df.rename(columns={
            'O*NET Id': 'onet_code',
            'ESCO or ISCO URI': 'esco_uri'
        })
        
        # Clean O*NET code (match the format in Neo4j)
        # Sometime O*NET in ESCO is 11-1021.00, sometimes it needs to match exactly the string
        df['onet_code'] = df['onet_code'].astype(str).str.strip()

        query = """
        UNWIND $batch AS row
        MATCH (on:Occupation {code: row.onet_code})
        SET on.esco_uri = row.esco_uri
        MERGE (e:Occupation {uri: row.esco_uri})
        ON CREATE SET e.taxonomy = 'ESCO'
        MERGE (on)-[:EQUIVALENT_TO {source: 'EU-O*NET v1.1', confidence: 1.0}]->(e)
        """

        with self.driver.session(database=self.database) as session:
            batch = df[['onet_code', 'esco_uri']].dropna().to_dict('records')
            session.run(query, batch=batch)
        print(f"   OK: {len(batch)} relations O*NET-ESCO créées.")

    def enrich_with_onet_metadata(self):
        """Injects English Titles and Descriptions from O*NET Data.txt."""
        if not os.path.exists(ONET_DATA_PATH):
            print(f"[ERROR] {ONET_DATA_PATH} introuvable.")
            return

        print(f"[3/4] Enrichissement avec les descriptions O*NET...")
        # O*NET file is tab-separated
        df = pd.read_csv(ONET_DATA_PATH, sep='\t')
        
        query = """
        UNWIND $batch AS row
        MATCH (o:Occupation)
        WHERE o.code = row.onet_code OR o.onet_soc_code = row.onet_code
        SET o.title_en = row.title,
            o.description_en = row.description
        """

        with self.driver.session(database=self.database) as session:
            # Rename columns to match query params
            batch = df.rename(columns={
                'O*NET-SOC Code': 'onet_code',
                'Title': 'title',
                'Description': 'description'
            }).to_dict('records')
            session.run(query, batch=batch)
        print(f"   OK: Métadonnées enrichies pour les occupations O*NET.")

    def mock_salaries(self):
        """Injects median salary data based on FEER/TEER level if available, otherwise random."""
        print(f"[4/4] Injection des salaires simulés (Mock)...")
        
        # Salary logic based on FEER level
        query = """
        MATCH (o:Occupation)
        WITH o, 
             CASE 
                WHEN o.feer = 0 OR o.teer = 0 THEN 95000 + (rand() * 40000)
                WHEN o.feer = 1 OR o.teer = 1 THEN 75000 + (rand() * 35000)
                WHEN o.feer = 2 OR o.teer = 2 THEN 60000 + (rand() * 25000)
                WHEN o.feer = 3 OR o.teer = 3 THEN 48000 + (rand() * 20000)
                WHEN o.feer = 4 OR o.teer = 4 THEN 38000 + (rand() * 15000)
                WHEN o.feer = 5 OR o.teer = 5 THEN 32000 + (rand() * 10000)
                ELSE 55000 + (rand() * 30000)
             END AS salary
        SET o.median_salary = round(salary)
        """

        with self.driver.session(database=self.database) as session:
            session.run(query)
        print(f"   OK: Salaires simulés injectés sur tous les nœuds Occupation.")

if __name__ == "__main__":
    ingestor = FullPipelineIngestor()
    try:
        print("--- DÉMARRAGE DE L'INGESTION FULL PIPELINE TRAJECTO ---")
        ingestor.load_noc_onet_crosswalk()
        ingestor.load_esco_onet_crosswalk()
        ingestor.enrich_with_onet_metadata()
        ingestor.mock_salaries()
        print("--- PIPELINE TERMINÉ AVEC SUCCÈS ---")
    finally:
        ingestor.close()
