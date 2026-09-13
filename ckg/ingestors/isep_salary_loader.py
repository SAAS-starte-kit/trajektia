import pandas as pd
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

class IsepSalaryLoader:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def run(self, excel_path):
        print(f"🚀 Lecture des salaires depuis {excel_path}...")
        # L'onglet est supposé s'appeler 'Salaires' d'après nos scans précédents
        try:
            df = pd.read_excel(excel_path, sheet_name='Salaires')
        except Exception as e:
            print(f"❌ Erreur lors de la lecture de l'onglet 'Salaires': {e}")
            return

        with self.driver.session(database="neo4j") as session:
            session.execute_write(self._inject_salaries, df)
        print("✅ Injection des données économiques terminée.")

    @staticmethod
    def _inject_salaries(tx, df):
        # On suppose que les colonnes sont 'NOC', 'Salaire_Médian', 'Perspectives'
        # On nettoie le code NOC (format 5 chiffres)
        query = """
        UNWIND $batch as row
        MATCH (n:Occupation {code: toString(row.code_noc)})
        SET n.salary_median = toFloat(row.salaire_median),
            n.salary_hourly = toFloat(row.salaire_horaire),
            n.outlook = row.perspectives,
            n.location = 'Québec'
        """
        # On filtre les colonnes pertinentes et on renomme pour le batch
        # Ajustement dynamique des noms de colonnes basé sur l'échantillon réel
        batch_data = []
        for _, r in df.iterrows():
            batch_data.append({
                'code_noc': str(r.get('Code NOC', r.get('NOC', ''))).strip(),
                'salaire_median': r.get('Salaire annuel médian', r.get('Salaire Médian', 0)),
                'salaire_horaire': r.get('Salaire horaire médian', 0),
                'perspectives': str(r.get('Perspectives', 'Non disponible'))
            })

        for i in range(0, len(batch_data), 500):
            batch = batch_data[i:i+500]
            tx.run(query, batch=batch)

if __name__ == "__main__":
    loader = IsepSalaryLoader()
    try:
        loader.run("docs/Rapports/tableau_ISEP_v5-4.xlsx")
    finally:
        loader.close()
