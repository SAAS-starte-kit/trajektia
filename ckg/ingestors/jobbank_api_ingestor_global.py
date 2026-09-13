import urllib.request
import json
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class JobBankGlobalIngestor:
    def __init__(self):
        self.resource_id = "9da94d63-b178-4a64-aeb3-b6a3bd721ad2"
        self.base_url = "https://open.canada.ca/data/fr/api/3/action/datastore_search"
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def fetch_all_wages(self, limit=1000):
        offset = 0
        total_injected = 0
        
        while True:
            url = f"{self.base_url}?resource_id={self.resource_id}&limit={limit}&offset={offset}"
            print(f"[INFO] Recuperation des records {offset} a {offset+limit}...")
            
            try:
                with urllib.request.urlopen(url) as response:
                    data = json.loads(response.read())
                    records = data['result']['records']
                    
                    if not records:
                        break
                        
                    self.inject_batch(records)
                    total_injected += len(records)
                    offset += limit
                    
                    if len(records) < limit:
                        break
            except Exception as e:
                print(f"[ERR] Erreur API: {e}")
                break
                
        print(f"[OK] Ingestion terminee. Total de relations salariales : {total_injected}")

    def inject_batch(self, records):
        query = """
        UNWIND $batch as row
        WITH row, toString(row.NOC_CNP_2021) as noc
        
        // 1. Gérer l'Occupation avec fallback (5-digit -> 3-digit -> 2-digit)
        OPTIONAL MATCH (o:Occupation)
        WHERE o.code IN [noc, substring(noc, 0, 3), substring(noc, 0, 2)]
        
        WITH row, o
        ORDER BY size(o.code) DESC
        WITH row, collect(o)[0] AS o
        WHERE o IS NOT NULL
        
        // 2. Créer la Province et la Région
        MERGE (p:Province {code: row.Prov_Code})
        ON CREATE SET p.name_en = row.Prov_EN, p.name_fr = row.PROV_FR
        
        MERGE (r:SalaryRegion {id: row.ER_Code_Code_RE})
        ON CREATE SET r.name_en = row.ER_Name_Nom_RE, r.name_fr = row.ER_Name_Nom_RE
        MERGE (r)-[:IN_PROVINCE]->(p)
        
        // 3. Créer la relation de Salaire
        MERGE (o)-[w:OFFERS_WAGE]->(r)
        SET w.median = toFloat(row.Median_Wage_Salaire_Median),
            w.low = toFloat(row.Low_Wage_Salaire_Minium),
            w.high = toFloat(row.High_Wage_Salaire_Maximal),
            w.type = row.Annual_Wage_Flag_Salaire_annuel,
            w.updated_at = row.Revision_Date_Date_revision,
            w.source = 'Job Bank Canada 2025'
        """
        with self.driver.session(database="neo4j") as session:
            session.run(query, batch=records)

if __name__ == "__main__":
    ingestor = JobBankGlobalIngestor()
    try:
        ingestor.fetch_all_wages()
    finally:
        ingestor.close()
