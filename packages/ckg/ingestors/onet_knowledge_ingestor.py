import sys
import os
import pandas as pd
from pathlib import Path
from neo4j import GraphDatabase

# Ajouter ckg/ au sys.path
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, ONET_KNOWLEDGE

class OnetKnowledgeIngestor:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def run(self):
        file_path = ONET_KNOWLEDGE
        if not os.path.exists(file_path):
            print(f"[ERROR] Fichier introuvable: {file_path}")
            return

        print(f"[INFO] Ingestion des connaissances depuis {file_path}...")
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        
        # Filtrer pour ne garder que Importance (IM)
        # On gardera l'intelligence complete dans Supabase, dans Neo4j on cree juste le lien essentiel
        df_im = df[df['Scale ID'] == 'IM'].copy()
        
        # Filtre optionnel : on ne lie dans le graphe que si Importance >= 3.0 (sur 5.0)
        # pour eviter de polluer le graphe avec des relations faibles.
        df_im = df_im[df_im['Data Value'] >= 3.0]

        df_im = df_im.rename(columns={
            'O*NET-SOC Code': 'soc_code',
            'Element ID': 'element_id',
            'Element Name': 'element_name',
            'Data Value': 'importance'
        })

        query = """
        UNWIND $batch as row
        MATCH (o:Occupation {onet_soc_code: row.soc_code})
        MERGE (k:Knowledge {element_id: row.element_id})
        ON CREATE SET k.name_en = row.element_name, k.taxonomy = 'O*NET 28.2'
        MERGE (o)-[r:REQUIRES_KNOWLEDGE]->(k)
        SET r.importance = row.importance
        """
        
        data = df_im[['soc_code', 'element_id', 'element_name', 'importance']].dropna().to_dict('records')
        total = len(data)
        
        with self.driver.session(database="neo4j") as session:
            for i in range(0, total, 1000):
                batch = data[i:i+1000]
                session.run(query, batch=batch)
                print(f"   [OK] {min(i+1000, total):,}/{total:,} relations traitees", end="\r")
        print(f"\n[DONE] Ingestion terminee ({total:,} relations crees).")

if __name__ == "__main__":
    ingestor = OnetKnowledgeIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
