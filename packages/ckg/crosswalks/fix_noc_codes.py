"""
fix_noc_codes.py — Normalize NOC codes from float-string to integer string
==========================================================================
Corrects codes like '10010.0' -> '10010' in Neo4j Occupation nodes.

Usage:
  cd backend
  python scripts/fix_noc_codes.py
"""
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "admin123")

print(f"Connecting to Neo4j at {NEO4J_URI}...")
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

with driver.session() as session:
    # Step 1: Find all constraints on Occupation.code
    print("\n[Step 1] Checking constraints...")
    constraints_query = """
    SHOW CONSTRAINTS YIELD name, type, entityType, labelsOrTypes, properties
    WHERE 'Occupation' IN labelsOrTypes AND 'code' IN properties
    RETURN name, type
    """
    result = session.run(constraints_query)
    constraints = list(result)
    constraint_names = [r['name'] for r in constraints]
    print(f"  Found constraints on Occupation.code: {constraint_names}")

    # Step 2: Drop constraints temporarily
    for cname in constraint_names:
        print(f"  Dropping constraint: {cname}")
        session.run(f"DROP CONSTRAINT {cname}")

    # Step 3: Normalize codes
    print("\n[Step 2] Normalizing NOC codes...")
    normalize_query = """
    MATCH (o:Occupation)
    WHERE o.code CONTAINS '.'
    SET o.code = split(o.code, '.')[0]
    RETURN count(o) AS corriges
    """
    result = session.run(normalize_query)
    record = result.single()
    count = record['corriges']
    print(f"  NOC codes corrected: {count}")

    # Step 4: Remove duplicates
    print("\n[Step 3] Removing duplicate nodes...")
    dedup_query = """
    MATCH (o:Occupation)
    WITH o.code AS code, collect(o) AS nodes
    WHERE size(nodes) > 1
    UNWIND nodes[1..] AS to_delete
    DETACH DELETE to_delete
    RETURN count(to_delete) AS deleted
    """
    result = session.run(dedup_query)
    record = result.single()
    print(f"  Duplicate nodes removed: {record['deleted']}")

    # Step 5: Recreate constraints
    print("\n[Step 4] Recreating uniqueness constraint...")
    try:
        session.run("CREATE CONSTRAINT occupation_code_unique FOR (o:Occupation) REQUIRE o.code IS UNIQUE")
        print("  Constraint recreated.")
    except Exception as e:
        print(f"  Note: {e}")

    # Step 6: Verify
    print("\n[Step 5] Verification...")
    verify_query = "MATCH (o:Occupation) WHERE o.code CONTAINS '.' RETURN count(o) AS remaining"
    result = session.run(verify_query)
    record = result.single()
    print(f"  Remaining decimal codes: {record['remaining']}")

    total_query = "MATCH (o:Occupation) RETURN count(o) AS total"
    result = session.run(total_query)
    record = result.single()
    print(f"  Total Occupation nodes: {record['total']}")

driver.close()
print("\nDone.")
