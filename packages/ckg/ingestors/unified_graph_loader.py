from neo4j import GraphDatabase
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# --- Configuration ---
load_dotenv()
URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
# Note: Assurez-vous d'avoir NEO4J_PASSWORD dans votre .env
PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

PROCESSED_DIR = Path("data/processed")

class SipecGraphLoader:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.database = "neo4j" # Retour à la base par défaut

    def close(self):
        self.driver.close()

    def purge_database(self):
        """Vide l'intégralité du graphe pour repartir sur une base propre (Request by User)."""
        print(f"Purge de la base [{self.database}] (DETACH DELETE)...")
        with self.driver.session(database=self.database) as session:
            session.run("MATCH (n) DETACH DELETE n")
        print(f"Base {self.database} vidée.")

    def create_constraints(self):
        """Crée des index et contraintes d'unicité."""
        queries = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (o:Occupation) REQUIRE o.code IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.label IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (k:Knowledge) REQUIRE k.label IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Interest) REQUIRE i.label IS UNIQUE"
        ]
        with self.driver.session(database=self.database) as session:
            for q in queries:
                session.run(q)
        print("Contraintes et index créés.")

    def load_relations(self):
        """Injecte les 35 000+ relations via UNWIND."""
        file_path = PROCESSED_DIR / "sipec_relations.jsonl"
        if not file_path.exists():
            print("--- Fichier relations introuvable.")
            return

        print(f"Injection des relations dans [{self.database}] depuis {file_path}...")
        
        # Mapper les types aux labels Neo4j
        label_map = {
            "skills": "Skill",
            "knowledge": "Knowledge",
            "interests": "Interest"
        }

        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Batching par 1000
            for i in range(0, len(lines), 1000):
                batch = [json.loads(line) for line in lines[i:i+1000]]
                
                # Injection groupée par type de descripteur
                for d_type, neo_label in label_map.items():
                    sub_batch = [r for r in batch if r['descriptor_type'] == d_type]
                    if not sub_batch: continue
                    
                    query = f"""
                    UNWIND $batch AS row
                    MERGE (o:Occupation {{code: row.noc_code}})
                    ON CREATE SET o.title_fr = row.occupation_title
                    MERGE (d:{neo_label} {{label: row.descriptor_label}})
                    MERGE (o)-[r:REQUIRES]->(d)
                    SET r.weight = row.weight
                    """
                    with self.driver.session(database=self.database) as session:
                        session.run(query, batch=sub_batch)
                
                print(f"     {min(i+1000, len(lines))} relations injectées...")

    def load_narratives(self):
        """Ajoute les descriptions narratives aux occupations existantes."""
        file_path = PROCESSED_DIR / "sipec_narratives.jsonl"
        if not file_path.exists(): return

        print(f"Injection des descriptions narratives dans [{self.database}]...")
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                rec = json.loads(line)
                # On utilise 'Code SIPeC' et 'Description' (selon votre structure CSV)
                query = """
                MATCH (o:Occupation {code: $code})
                SET o.description_fr = $desc
                """
                # Ajustement dynamique des clés
                code = rec.get('Code SIPeC') or rec.get('Code OaSIS')
                desc = rec.get('Description') or rec.get('Fonction principale')
                
                if code and desc:
                    with self.driver.session(database=self.database) as session:
                        session.run(query, code=str(code), desc=desc)
        print("OK: Narratifs injectés.")

if __name__ == "__main__":
    loader = SipecGraphLoader()
    try:
        loader.purge_database()
        loader.create_constraints()
        loader.load_relations()
        loader.load_narratives()
        print("\n✨ Graphe SIPeC 2025 injecté avec succès !")
    finally:
        loader.close()
