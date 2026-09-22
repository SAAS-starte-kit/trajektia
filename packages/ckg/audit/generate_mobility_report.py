import pandas as pd
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

class MobilityReporter:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def get_comparison(self, noc_code):
        query = """
        MATCH (o:Occupation {code: $code})-[w:OFFERS_WAGE]->(r:SalaryRegion)-[:IN_PROVINCE]->(p:Province)
        RETURN o.title_fr as métier, 
               p.name_fr as province, 
               r.name_fr as région, 
               w.median as median, 
               w.low as low, 
               w.high as high
        ORDER BY w.median DESC
        """
        with self.driver.session(database="neo4j") as session:
            result = session.run(query, code=str(noc_code))
            return pd.DataFrame([dict(record) for record in result])

if __name__ == "__main__":
    reporter = MobilityReporter()
    try:
        # Analyse pour Développeur Logiciel
        print("📊 Analyse: Développeur Logiciel (NOC 21232)")
        df = reporter.get_comparison("21232")
        if not df.empty:
            print(df.head(10).to_string(index=False))
            df.to_csv("data/processed/mobility_dev_report.csv", index=False)
    finally:
        reporter.close()
