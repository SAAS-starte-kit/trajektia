import sys
import os
import pandas as pd
from pathlib import Path
from neo4j import GraphDatabase

# Ajouter ckg/ au sys.path
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, ONET_WORK_CONTEXT

class OnetWorkContextIngestor:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def run(self):
        file_path = ONET_WORK_CONTEXT
        if not os.path.exists(file_path):
            print(f"[ERROR] Fichier introuvable: {file_path}")
            return

        print(f"[INFO] Ingestion des contextes de travail depuis {file_path}...")
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        
        # Filtrer pour ne garder que la moyenne globale du contexte (CX)
        # On ignore les reponses par categories (CT) qui sont trop granulaires pour le graphe
        df_cx = df[df['Scale ID'] == 'CX'].copy()
        
        # On garde les relations moyennement fortes ou fortes (>= 3.0 sur 5.0)
        df_cx = df_cx[df_cx['Data Value'] >= 3.0]

        df_cx = df_cx.rename(columns={
            'O*NET-SOC Code': 'soc_code',
            'Element ID': 'element_id',
            'Element Name': 'element_name',
            'Data Value': 'frequency_score'
        })

        query = """
        UNWIND $batch as row
        MATCH (o:Occupation {onet_soc_code: row.soc_code})
        MERGE (w:WorkContext {element_id: row.element_id})
        ON CREATE SET w.name_en = row.element_name, w.taxonomy = 'O*NET 28.2'
        MERGE (o)-[r:HAS_CONTEXT]->(w)
        SET r.frequency = row.frequency_score
        """
        
        data = df_cx[['soc_code', 'element_id', 'element_name', 'frequency_score']].dropna().to_dict('records')
        total = len(data)
        
        with self.driver.session(database="neo4j") as session:
            for i in range(0, total, 1000):
                batch = data[i:i+1000]
                session.run(query, batch=batch)
                print(f"   [OK] {min(i+1000, total):,}/{total:,} relations traitees", end="\r")
        print(f"\n[DONE] Ingestion terminee ({total:,} relations crees).")

if __name__ == "__main__":
    ingestor = OnetWorkContextIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
