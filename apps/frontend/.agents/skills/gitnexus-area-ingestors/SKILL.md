---
name: gitnexus-area-ingestors
description: "Skill for the Ingestors area of trajektia. 57 symbols across 10 files."
---

# Ingestors

57 symbols | 10 files | Cohesion: 88%

## When to Use

- Working with code in `ckg/`
- Understanding how count_relationships, phase_relationships, phase_validate work
- Modifying ingestors-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `ckg/ingestors/seed_ckg_neo4j.py` | _get_node_desc, _get_node_title, _resolve_label_and_prop, count_relationships, phase_relationships (+15) |
| `ckg/ingestors/sipec_completion_ingestor.py` | _normalize_data, _verify, create_constraints, download_csv, fetch_resources (+2) |
| `ckg/ingestors/career_ladders_ingestor.py` | _run_demo_mode, fetch_ladders, get_onet_codes, ingest_ladders, run (+1) |
| `ckg/ingestors/onet_psychometrics_ingestor.py` | build_cypher, _ingest_dimension, _read_from_zip, _verify, run |
| `ckg/ingestors/enrich_onet_skills.py` | main, close, enrich_occupation, run_enrichment |
| `ckg/ingestors/jobbank_api_ingestor_global.py` | aggregate_by_cnp, fetch_jobbank_data, inject_market_demand_batch, run |
| `ckg/ingestors/onet_tech_ingestor.py` | _execute_batch, ingest_tech_skills, ingest_tools, run |
| `ckg/ingestors/official_wages_ingestor.py` | add_to_map, ingest_wages, normalize_noc |
| `ckg/ingestors/esco_enricher.py` | fetch_esco_title, process_uri |
| `ckg/ingestors/sipec_enricher.py` | load_interests, normalize_noc |

## Entry Points

Start here when exploring this area:

- **`count_relationships`** (Function) — `ckg/ingestors/seed_ckg_neo4j.py:112`
- **`phase_relationships`** (Function) — `ckg/ingestors/seed_ckg_neo4j.py:434`
- **`phase_validate`** (Function) — `ckg/ingestors/seed_ckg_neo4j.py:637`
- **`build_cypher`** (Function) — `ckg/ingestors/onet_psychometrics_ingestor.py:72`
- **`count_nodes`** (Function) — `ckg/ingestors/seed_ckg_neo4j.py:106`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `count_relationships` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 112 |
| `phase_relationships` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 434 |
| `phase_validate` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 637 |
| `build_cypher` | Function | `ckg/ingestors/onet_psychometrics_ingestor.py` | 72 |
| `count_nodes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 106 |
| `phase_hub_nodes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 156 |
| `phase_international_nodes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 308 |
| `phase_market_and_sources` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 386 |
| `phase_program_nodes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 355 |
| `load_json` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 90 |
| `main` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 717 |
| `phase_clear` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 120 |
| `phase_create_indexes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 129 |
| `phase_seed_feature_flags` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 593 |
| `main` | Function | `ckg/ingestors/enrich_onet_skills.py` | 149 |
| `phase_occupation_nodes` | Function | `ckg/ingestors/seed_ckg_neo4j.py` | 184 |
| `add_to_map` | Function | `ckg/ingestors/official_wages_ingestor.py` | 59 |
| `create_constraints` | Method | `ckg/ingestors/sipec_completion_ingestor.py` | 140 |
| `download_csv` | Method | `ckg/ingestors/sipec_completion_ingestor.py` | 115 |
| `fetch_resources` | Method | `ckg/ingestors/sipec_completion_ingestor.py` | 91 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → Enrich_occupation` | intra_community | 3 |
| `Main → Count_nodes` | cross_community | 3 |
| `Run → Verify` | intra_community | 3 |
| `Ingest_wages → Normalize_noc` | intra_community | 3 |
| `Run → Build_cypher` | intra_community | 3 |
| `Run → _read_from_zip` | intra_community | 3 |
| `Run → _execute_batch` | intra_community | 3 |

## How to Explore

1. `context({name: "count_relationships"})` — see callers and callees
2. `query({search_query: "ingestors"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
