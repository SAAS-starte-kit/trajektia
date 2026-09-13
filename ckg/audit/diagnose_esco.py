import pandas as pd
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

# === 1. Contenu réel du fichier ESCO-ONET ===
print("=== esco_onet_mapping.csv ===")
df_raw = pd.read_csv("data/raw/crosswalks/esco_onet_mapping.csv", nrows=10)
print(f"Colonnes avec skiprows=0 : {list(df_raw.columns)}")

df_skip = pd.read_csv("data/raw/crosswalks/esco_onet_mapping.csv", skiprows=5, nrows=10)
print(f"Colonnes avec skiprows=5 : {list(df_skip.columns)}")
print(df_skip.head(3).to_string())

# === 2. Relations créées dans Neo4j ===
print("\n=== Neo4j — EQUIVALENT_TO relations ===")
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", os.getenv("NEO4J_PASSWORD")))
with driver.session() as s:
    r = s.run("MATCH ()-[r:EQUIVALENT_TO]->() RETURN count(r) AS cnt")
    print(f"  Total EQUIVALENT_TO : {r.single()['cnt']:,}")

    r = s.run("MATCH (:Occupation)-[r:EQUIVALENT_TO]->(:Occupation {taxonomy:'O*NET'}) RETURN count(r) AS cnt")
    print(f"  NOC -> O*NET          : {r.single()['cnt']:,}")

    r = s.run("MATCH (:Occupation)-[r:EQUIVALENT_TO]->(:Occupation {taxonomy:'ESCO'}) RETURN count(r) AS cnt")
    print(f"  O*NET -> ESCO         : {r.single()['cnt']:,}")

    # Combien d'Occupations ont un onet_soc_code?
    r = s.run("MATCH (o:Occupation) WHERE o.onet_soc_code IS NOT NULL RETURN count(o) AS cnt")
    print(f"\n  Occupations avec onet_soc_code : {r.single()['cnt']:,}")

driver.close()
