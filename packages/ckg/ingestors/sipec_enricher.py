import os
import pandas as pd
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Configuration
load_dotenv()
URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "admin123")

DATA_DIR = "data/raw/sipec"
BATCH_SIZE = 1000

class SipecEnricher:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.database = "neo4j"

    def close(self):
        self.driver.close()

    def create_constraints(self):
        """Crée des contraintes pour les nouveaux piliers."""
        queries = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (a:PersonalAttribute) REQUIRE a.label IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (ac:WorkActivity) REQUIRE ac.label IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (c:WorkContext) REQUIRE c.label IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Interest) REQUIRE i.label IS UNIQUE"
        ]
        with self.driver.session(database=self.database) as session:
            for q in queries:
                session.run(q)
        print("OK: Contraintes et index crées.")

    def normalize_noc(self, code):
        """Normalise le code NOC en flottant puis chaîne (ex: 00010.00 -> 10.0)."""
        try:
            return str(float(code))
        except:
            return str(code).strip()

    def load_matrix_pillar(self, csv_file, node_label, rel_type):
        """Charge un fichier SIPeC au format matrice (Piliers: Attributs, Activités, Contexte)."""
        path = os.path.join(DATA_DIR, csv_file)
        if not os.path.exists(path):
            print(f"Skipping: {csv_file} not found.")
            return

        print(f"Loading {node_label} from {csv_file}...")
        # SIPeC CSVs are semi-colon delimited, cp1252 encoding
        df = pd.read_csv(path, sep=';', encoding='cp1252')
        
        # Nettoyer le BOM (Byte Order Mark) s'il existe sur la 1ère colonne
        df.columns = [col.lstrip('\ufeff') for col in df.columns]
        
        # Identifier les colonnes fixes (les 2 premières sont Code et Étiquette)
        id_col = df.columns[0]
        label_col = df.columns[1]
        feature_cols = df.columns[2:]

        # Normaliser le code NOC
        df[id_col] = df[id_col].apply(self.normalize_noc)

        # "Melt" pour passer du format large au format long
        df_melted = df.melt(id_vars=[id_col, label_col], value_vars=feature_cols, 
                             var_name='feature_label', value_name='importance')
        
        # Filtrer l'importance > 0 pour éviter de polluer le graphe
        df_melted = df_melted[df_melted['importance'] > 0]

        query = f"""
        UNWIND $batch AS row
        MATCH (o:Occupation {{code: row.noc_code}})
        MERGE (f:{node_label} {{label: row.feature_label}})
        MERGE (o)-[r:{rel_type}]->(f)
        SET r.weight = toFloat(row.importance)
        """

        with self.driver.session(database=self.database) as session:
            for i in range(0, len(df_melted), BATCH_SIZE):
                batch = df_melted.iloc[i:i+BATCH_SIZE].rename(columns={
                    id_col: 'noc_code',
                    'feature_label': 'feature_label',
                    'importance': 'importance'
                }).to_dict('records')
                session.run(query, batch=batch)
        print(f"   OK: {len(df_melted)} relations {rel_type} injectées.")

    def load_interests(self):
        """Charge le pilier Intérêts Holland (format R1, R2, R3)."""
        csv_file = "interets_sipec_2025_v1.1_fr.csv"
        path = os.path.join(DATA_DIR, csv_file)
        if not os.path.exists(path):
            print(f"Skipping: {csv_file} not found.")
            return

        print(f"Loading Interests from {csv_file}...")
        df = pd.read_csv(path, sep=';', encoding='cp1252')
        # Nettoyer le BOM (Byte Order Mark) s'il existe sur la 1ère colonne
        df.columns = [col.lstrip('\ufeff') for col in df.columns]
        id_col = df.columns[0]
        
        # Holland mapping (R, I, A, S, E, C)
        holland_map = {
            'R': 'Réaliste', 'I': 'Investigateur', 'A': 'Artistique', 
            'S': 'Social', 'E': 'Entreprenant', 'C': 'Conventionnel'
        }

        with self.driver.session(database=self.database) as session:
            for _, row in df.iterrows():
                noc_code = self.normalize_noc(row[id_col])
                
                # On injecte les 3 intérêts s'ils existent
                for rank in [1, 2, 3]:
                    code = str(row.get(f'Code Holland - {rank}')).strip().upper()
                    if code in holland_map:
                        full_label = holland_map[code]
                        weight = 5.0 if rank == 1 else (4.0 if rank == 2 else 3.0)
                        
                        query = """
                        MATCH (o:Occupation {code: $noc_code})
                        MERGE (i:Interest {label: $label})
                        ON CREATE SET i.code = $code
                        MERGE (o)-[r:MATCHES_INTEREST]->(i)
                        SET r.rank = $rank, r.weight = $weight
                        """
                        session.run(query, noc_code=noc_code, label=full_label, code=code, rank=rank, weight=weight)
        print(f"   OK: Intérêts Holland injectés.")

if __name__ == "__main__":
    enricher = SipecEnricher()
    try:
        enricher.create_constraints()
        # Matrix pillars
        enricher.load_matrix_pillar("attributs-personnels_sipec_2025_v1.1_fr.csv", "PersonalAttribute", "HAS_ATTRIBUTE")
        enricher.load_matrix_pillar("activites-travail_sipec_2025_v1.1_fr.csv", "WorkActivity", "PERFORMS_ACTIVITY")
        enricher.load_matrix_pillar("context-travail_sipec_2025_v1.1_fr.csv", "WorkContext", "HAS_CONTEXT")
        # Rank pillar
        enricher.load_interests()
    finally:
        enricher.close()
