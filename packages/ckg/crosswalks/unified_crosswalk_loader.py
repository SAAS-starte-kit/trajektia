import sys
import os
from pathlib import Path
import pandas as pd
from neo4j import GraphDatabase

ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, CROSSWALK_NOC_ONET, CROSSWALK_ESCO_ONET

class UnifiedCrosswalkLoader:
    def __init__(self):
        self.uri = NEO4J_URI
        self.user = NEO4J_USER
        self.password = NEO4J_PASSWORD
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def load_noc_onet(self, csv_path):
        """Mapping Canada (NOC 2021) -> USA (O*NET SOC 26 - Source: The Dais/TMU)"""
        print(f"[INFO] Chargement NOC-ONet depuis {csv_path}...")
        df = pd.read_csv(csv_path)
        # Renommer les colonnes The Dais vers nos noms internes
        df = df.rename(columns={
            'noc': 'noc2021_code',
            'noc_title': 'noc_title',
            'onet': 'onet26_code',
            'onet_title': 'onet26_title'
        })
        df['noc2021_code'] = df['noc2021_code'].astype(str)
        df['onet26_code']  = df['onet26_code'].astype(str).str.strip()
        print(f"[INFO] {len(df):,} paires NOC-ONet trouvees.")
        with self.driver.session(database="neo4j") as session:
            session.execute_write(self._create_noc_onet_relations, df)
        print("[OK] Mapping NOC-ONet termine.")

    def load_esco_onet(self, csv_path):
        """Mapping O*NET SOC -> ESCO URI (Source: ESCO Secretariat v1.1.0 Sep-22)"""
        print(f"[INFO] Chargement ESCO-ONet depuis {csv_path}...")
        # Les 16 premieres lignes sont des metadonnees (auteur, version, etc.)
        # Les vraies colonnes commencent a la ligne 17
        df = pd.read_csv(csv_path, skiprows=16, encoding='utf-8-sig')
        df = df.rename(columns={
            'O*NET Id': 'onet_soc_code',
            'ESCO or ISCO URI': 'esco_uri'
        })
        df = df[['onet_soc_code', 'esco_uri']].dropna()
        # O*NET Id in ESCO CSV is like '11-1011.00' but Neo4j nodes have '11-1011'
        # Strip the '.00' suffix to match existing O*NET nodes
        df['onet_soc_code'] = df['onet_soc_code'].astype(str).str.replace(r'\.0+$', '', regex=True)
        print(f"[INFO] {len(df):,} paires O*NET-ESCO trouvees.")
        with self.driver.session(database="neo4j") as session:
            session.execute_write(self._create_esco_onet_relations, df)
        print("[OK] Mapping ESCO-ONet termine.")

    @staticmethod
    def _create_noc_onet_relations(tx, df):
        query = """
        UNWIND $batch as row
        MATCH (n:Occupation {code: toString(row.noc2021_code)})
        SET n.onet_soc_code = row.onet26_code
        MERGE (s:Occupation {code: row.onet26_code})
        ON CREATE SET s.title_en = row.onet26_title, s.taxonomy = 'O*NET'
        MERGE (n)-[:EQUIVALENT_TO {source: 'The Dais', confidence: 1.0}]->(s)
        """
        # Batch par 1000 pour la performance
        for i in range(0, len(df), 1000):
            batch = df.iloc[i:i+1000].to_dict('records')
            tx.run(query, batch=batch)

    @staticmethod
    def _create_esco_onet_relations(tx, df):
        query = """
        UNWIND $batch as row
        MATCH (s:Occupation {code: row.onet_soc_code})
        SET s.esco_uri = row.esco_uri
        MERGE (e:Occupation {uri: row.esco_uri})
        ON CREATE SET e.taxonomy = 'ESCO'
        MERGE (s)-[:EQUIVALENT_TO {source: 'EU-O*NET Crosswalk', confidence: 1.0}]->(e)
        """
        for i in range(0, len(df), 1000):
            batch = df.iloc[i:i+1000].to_dict('records')
            tx.run(query, batch=batch)

if __name__ == "__main__":
    loader = UnifiedCrosswalkLoader()
    try:
        # 1. Canada <-> USA
        loader.load_noc_onet(CROSSWALK_NOC_ONET)
        # 2. USA <-> Europe
        loader.load_esco_onet(CROSSWALK_ESCO_ONET)
    finally:
        loader.close()
