import os
import pandas as pd
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Configuration
load_dotenv()
URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "admin123")

WAGE_CSV_PATH = "data/raw/wages_2025.csv"

class OfficialWagesIngestor:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.database = "neo4j"

    def close(self):
        self.driver.close()

    def normalize_noc(self, noc_string):
        """Converts NOC_00010 to 10.0 to match graph format."""
        try:
            code = str(noc_string).replace("NOC_", "").strip()
            return str(float(code))
        except:
            return str(noc_string).strip()

    def ingest_wages(self):
        if not os.path.exists(WAGE_CSV_PATH):
            print(f"[ERROR] {WAGE_CSV_PATH} introuvable.")
            return

        print(f"--- D\u00e9marrage de l'ingestion des salaires officiels 2025 ---")
        
        # 1. Load data
        df = pd.read_csv(WAGE_CSV_PATH, encoding='cp1252', low_memory=False)
        
        # Robust column naming by mapping known labels or positions
        # The first column is NOC_CNP despite BOM
        col_map = {
            df.columns[0]: 'NOC_CNP',
            'Median_Wage_Salaire_Median': 'median',
            'Annual_Wage_Flag_Salaire_annuel': 'is_annual'
        }
        df = df.rename(columns=col_map)
        
        print(f"   [1] Jeu de donn\u00e9es charg\u00e9 ({len(df):,} lignes).")

        # 2. Extract Provincial QC (ER24) and National (ER00)
        qc_prov = df[(df['prov'] == 'QC') & (df['ER_Code_Code_RE'] == 'ER24')].copy()
        nat_avg = df[(df['prov'] == 'NAT') & (df['ER_Code_Code_RE'] == 'ER00')].copy()

        print(f"   [2] Extraction : {len(qc_prov)} lignes Qu\u00e9bec, {len(nat_avg)} lignes Nationales.")

        # 3. Mapping logic (Priority: QC > NAT)
        wage_map = {}

        def add_to_map(subset, priority_label):
            added = 0
            for _, row in subset.iterrows():
                noc_code = self.normalize_noc(row['NOC_CNP'])
                median = row['median']
                is_annual = row['is_annual']
                
                try:
                    median_val = float(median)
                    if not pd.isna(median_val):
                        # Convert hourly to annual
                        if is_annual == 0:
                            median_val = median_val * 2080
                        
                        if noc_code not in wage_map:
                            wage_map[noc_code] = round(median_val)
                            added += 1
                except:
                    continue
            print(f"       -> {added} salaires ajout\u00e9s via {priority_label}")

        add_to_map(qc_prov, "Qu\u00e9bec (Provincial)")
        add_to_map(nat_avg, "National (Canada)")

        # 4. Update Neo4j
        print(f"   [3] Mise \u00e0 jour Neo4j ({len(wage_map)} entr\u00e9es)...")

        query = """
        UNWIND $batch AS row
        MATCH (o:Occupation {code: row.noc_code})
        SET o.median_salary = toFloat(row.salary),
            o.salary_source = 'ESDC 2025 Official'
        """

        batch = [{"noc_code": k, "salary": v} for k, v in wage_map.items()]

        with self.driver.session(database=self.database) as session:
            for i in range(0, len(batch), 1000):
                sub_batch = batch[i:i+1000]
                session.run(query, batch=sub_batch)
        
        print(f"   [4] OK: Salaires mis \u00e0 jour avec succ\u00e8s.")

if __name__ == "__main__":
    ingestor = OfficialWagesIngestor()
    try:
        ingestor.ingest_wages()
    finally:
        ingestor.close()
