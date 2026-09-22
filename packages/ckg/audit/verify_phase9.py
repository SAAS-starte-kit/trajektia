from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

with driver.session(database="neo4j") as session:
    print("\n=== BILAN COMPLET DU GRAPHE UCKG ===\n")

    rel_types = [
        ("REQUIRES",          "SIPeC Competences"),
        ("OFFERS_WAGE",       "Salaires JobBank"),
        ("EQUIVALENT_TO",     "Crosswalks NOC/ONET/ESCO"),
        ("REQUIRES_SOFTWARE", "Tech IQ - Logiciels"),
        ("USES_TOOL",         "Tech IQ - Outils"),
        ("HAS_INTEREST",      "Psycho - Interets RIASEC"),
        ("REQUIRES_ABILITY",  "Psycho - Aptitudes"),
        ("ALIGNED_WITH_VALUE","Psycho - Valeurs travail"),
        ("EXHIBITS_STYLE",    "Psycho - Styles travail"),
    ]

    total = 0
    for rel, label in rel_types:
        r = session.run(f"MATCH ()-[r:{rel}]->() RETURN count(r) AS cnt")
        cnt = r.single()["cnt"]
        total += cnt
        print(f"  {label:<30} {cnt:>10,}")

    print(f"\n  {'TOTAL RELATIONS':<30} {total:>10,}")

    r = session.run("MATCH (o:Occupation) RETURN count(o) AS cnt")
    print(f"\n  Noeuds Occupation        : {r.single()['cnt']:>10,}")

    r = session.run("MATCH (n) RETURN count(n) AS cnt")
    print(f"  Noeuds totaux            : {r.single()['cnt']:>10,}")

driver.close()
print("\n=== Verification terminee ===")
