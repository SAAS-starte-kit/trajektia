---
name: gitnexus-area-scripts
description: "Skill for the Scripts area of trajektia. 42 symbols across 15 files."
---

# Scripts

42 symbols | 15 files | Cohesion: 100%

## When to Use

- Working with code in `scripts/`
- Understanding how enrich_with_openalex, escape_ts, export_typescript work
- Modifying scripts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scripts/seed_scientific_evidence.py` | enrich_with_openalex, escape_ts, export_typescript, fetch_openalex_data, get_evidence_data (+3) |
| `scripts/ingest_tcc_synonyms.py` | fetch_competencies, generate_english_synonyms, generate_french_synonyms, insert_synonyms_batch, load_env_file (+1) |
| `scripts/generate_career_content.py` | generate_typescript_content, get_db_careers, cvt, main |
| `scripts/apply_sql.py` | load_env_file, main |
| `scripts/calculate_live_salary_index.py` | load_env_file, main |
| `scripts/generate_embeddings.py` | load_env_file, main |
| `scripts/generate_work_values.py` | run, format_valeur_dominante |
| `scripts/ingest_adzuna_live.py` | load_env_file, main |
| `scripts/ingest_big_five.py` | load_env_file, main |
| `scripts/ingest_bls_ors.py` | load_env_file, main |

## Entry Points

Start here when exploring this area:

- **`enrich_with_openalex`** (Function) — `scripts/seed_scientific_evidence.py:307`
- **`escape_ts`** (Function) — `scripts/seed_scientific_evidence.py:391`
- **`export_typescript`** (Function) — `scripts/seed_scientific_evidence.py:396`
- **`fetch_openalex_data`** (Function) — `scripts/seed_scientific_evidence.py:44`
- **`get_evidence_data`** (Function) — `scripts/seed_scientific_evidence.py:74`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `enrich_with_openalex` | Function | `scripts/seed_scientific_evidence.py` | 307 |
| `escape_ts` | Function | `scripts/seed_scientific_evidence.py` | 391 |
| `export_typescript` | Function | `scripts/seed_scientific_evidence.py` | 396 |
| `fetch_openalex_data` | Function | `scripts/seed_scientific_evidence.py` | 44 |
| `get_evidence_data` | Function | `scripts/seed_scientific_evidence.py` | 74 |
| `load_env_file` | Function | `scripts/seed_scientific_evidence.py` | 29 |
| `main` | Function | `scripts/seed_scientific_evidence.py` | 474 |
| `seed_database` | Function | `scripts/seed_scientific_evidence.py` | 331 |
| `fetch_competencies` | Function | `scripts/ingest_tcc_synonyms.py` | 193 |
| `generate_english_synonyms` | Function | `scripts/ingest_tcc_synonyms.py` | 119 |
| `generate_french_synonyms` | Function | `scripts/ingest_tcc_synonyms.py` | 39 |
| `insert_synonyms_batch` | Function | `scripts/ingest_tcc_synonyms.py` | 204 |
| `load_env_file` | Function | `scripts/ingest_tcc_synonyms.py` | 24 |
| `main` | Function | `scripts/ingest_tcc_synonyms.py` | 230 |
| `generate_typescript_content` | Function | `scripts/generate_career_content.py` | 848 |
| `get_db_careers` | Function | `scripts/generate_career_content.py` | 1022 |
| `cvt` | Function | `scripts/generate_career_content.py` | 1065 |
| `main` | Function | `scripts/generate_career_content.py` | 1122 |
| `load_env_file` | Function | `scripts/apply_sql.py` | 5 |
| `main` | Function | `scripts/apply_sql.py` | 18 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → Cvt` | intra_community | 3 |
| `Main → Fetch_openalex_data` | intra_community | 3 |

## How to Explore

1. `context({name: "enrich_with_openalex"})` — see callers and callees
2. `query({search_query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
