import sys
import os
from pathlib import Path
import pandas as pd
from neo4j import GraphDatabase

# Ajouter ckg/ au sys.path pour importer ckg_config
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE, ONET_TECH_SKILLS, ONET_TOOLS_USED

class OnetTechIngestor:
    def __init__(self):
        self.uri = NEO4J_URI
        self.user = NEO4J_USER
        self.password = NEO4J_PASSWORD
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def run(self):
        tech_file = ONET_TECH_SKILLS
        tools_file = ONET_TOOLS_USED
        
        # 1. Charger les Technology Skills (Softwares)
        if os.path.exists(tech_file):
            self.ingest_tech_skills(tech_file)
        else:
            print(f"[ERROR] Fichier non trouve: {tech_file}")
            
        # 2. Charger les Tools Used (Outils matériels)
        if os.path.exists(tools_file):
            self.ingest_tools(tools_file)
        else:
            print(f"[ERROR] Fichier non trouve: {tools_file}")

    def ingest_tech_skills(self, file_path):
        print(f"[INFO] Ingestion des logiciels depuis {file_path}...")
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        # Renommer les colonnes avec caracteres speciaux pour Cypher
        df = df.rename(columns={
            'O*NET-SOC Code': 'soc_code',
            'Example': 'example',
            'Commodity Title': 'category',
            'Hot Technology': 'hot_tech'
        })
        query = """
        UNWIND $batch as row
        MATCH (o:Occupation {onet_soc_code: row.soc_code})
        MERGE (s:Software {name: row.example})
        ON CREATE SET s.category = row.category, s.taxonomy = 'O*NET'
        MERGE (o)-[r:REQUIRES_SOFTWARE]->(s)
        SET r.hot_tech = (row.hot_tech = 'Y')
        """
        self._execute_batch(query, df[['soc_code','example','category','hot_tech']].dropna(subset=['soc_code','example']))

    def ingest_tools(self, file_path):
        print(f"[INFO] Ingestion des outils depuis {file_path}...")
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        df = df.rename(columns={
            'O*NET-SOC Code': 'soc_code',
            'Example': 'example',
            'Commodity Title': 'category'
        })
        query = """
        UNWIND $batch as row
        MATCH (o:Occupation {onet_soc_code: row.soc_code})
        MERGE (t:Tool {name: row.example})
        ON CREATE SET t.category = row.category, t.taxonomy = 'O*NET'
        MERGE (o)-[:USES_TOOL]->(t)
        """
        self._execute_batch(query, df[['soc_code','example','category']].dropna(subset=['soc_code','example']))

    def _execute_batch(self, query, df):
        total = len(df)
        with self.driver.session(database="neo4j") as session:
            for i in range(0, total, 1000):
                batch = df.iloc[i:i+1000].to_dict('records')
                session.run(query, batch=batch)
                print(f"   [OK] {min(i+1000, total):,}/{total:,} traites", end="\r")
        print(f"\n[DONE] Batch termine ({total:,} lignes).")

if __name__ == "__main__":
    ingestor = OnetTechIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
