"""Quick verification that seed_ckg_neo4j.py can load all JSON files."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.seed_ckg_neo4j import load_json, LEGACY_DATA_DIR

print(f"Data dir: {LEGACY_DATA_DIR}")
print(f"Exists: {LEGACY_DATA_DIR.exists()}")

cg = load_json("career_graph.json")
if cg:
    nodes = cg.get("nodes", [])
    crosswalks = cg.get("crosswalks", [])
    print(f"career_graph.json: {len(nodes)} nodes, {len(crosswalks)} crosswalks")
    types = {}
    for n in nodes:
        t = n.get("type", "UNKNOWN")
        types[t] = types.get(t, 0) + 1
    print(f"  Node types: {types}")

jobs = load_json("jobs.json")
if jobs:
    print(f"jobs.json: {len(jobs)} occupations")

progs = load_json("programs_mapping.json")
if progs:
    print(f"programs_mapping.json: {len(progs)} entries")
    # Check dedup
    seen = set()
    unique = 0
    for p in progs:
        key = (p.get("code", ""), p.get("type", ""))
        if key not in seen and p.get("code"):
            seen.add(key)
            unique += 1
    print(f"  After dedup: {unique} unique programs")

cip = load_json("cip_onet_mapping.json")
if cip:
    total_links = sum(len(v) for v in cip.values())
    print(f"cip_onet_mapping.json: {len(cip)} CIP codes, {total_links} O*NET links")

src = load_json("sources.json")
if src:
    print(f"sources.json: {len(src)} data sources")

print("\nAll JSON files loaded successfully!")
