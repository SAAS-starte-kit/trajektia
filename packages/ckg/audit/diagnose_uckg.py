import json
import pandas as pd
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

# === 1. SIPeC JSONL - format des codes ===
print("=== 1. SIPeC Relations JSONL (5 premiers) ===")
with open("data/processed/sipec_relations.jsonl") as f:
    for i, line in enumerate(f):
        if i >= 5:
            break
        d = json.loads(line)
        print(f"  noc_code={repr(d.get('noc_code'))}  type={repr(d.get('descriptor_type'))}  label={repr(str(d.get('descriptor_label', ''))[:25])}")

# === 2. Crosswalk NOC-ONET ===
print("\n=== 2. noc_onet_mapping.csv (colonnes + 3 lignes) ===")
df_x = pd.read_csv("data/raw/crosswalks/noc_onet_mapping.csv")
print(f"  Colonnes: {list(df_x.columns)}")
print(df_x.head(3).to_string())

# === 3. Neo4j - codes reels des Occupation nodes ===
print("\n=== 3. Neo4j - sample codes Occupation ===")
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)
with driver.session(database="neo4j") as s:
    r = s.run("MATCH (o:Occupation) RETURN o.code AS code, o.title_fr AS title LIMIT 10")
    for rec in r:
        print(f"  code={repr(rec['code'])}  title={repr(str(rec['title'] or '')[:30])}")
driver.close()
