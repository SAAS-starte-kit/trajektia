---
name: gitnexus-area-etl
description: "Skill for the Etl area of trajektia. 104 symbols across 8 files."
---

# Etl

104 symbols | 8 files | Cohesion: 90%

## When to Use

- Working with code in `etl/`
- Understanding how norm, read_csv, step1_oasis_descriptors work
- Modifying etl-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `etl/le_siphon_v2.py` | _ingest_legacy_dpt, _map_oasis_category, parse_oasis_guide, parse_oasis_scores, _safe_float (+25) |
| `etl/le_siphon.py` | _compute_dominant, _neo4j_fetch, _pg_execute_batch, extract_and_load_competencies, extract_and_load_knowledge (+10) |
| `etl/patch_oasis_v4.py` | _infer_level_int, _parent_code_cnp, _parse_guide, _process_wide_file, norm (+10) |
| `etl/patch_v3.py` | _extract_label, _extract_score, _norm_ch_code, download_csv, load_cached (+9) |
| `etl/ingest_crosswalks.py` | build_args, fetch_csv_bytes, get_connection, load_env, main (+7) |
| `etl/meq_relance_ingestor.py` | parse_num, stem, run, step1_ingest_cip_domains, step2_ingest_institutions (+3) |
| `etl/physical_demands_dpc_ingestor.py` | compute_prediger_axes, download_or_load, parse_dpc_number, run_pipeline, find_col |
| `etl/cnesst_supabase_ingestor.py` | run, step1_ingest_hazards, step2_ingest_sector_stats, step3_ingest_occupation_hazards, step4_enrich_neo4j |

## Entry Points

Start here when exploring this area:

- **`norm`** (Function) — `etl/patch_oasis_v4.py:424`
- **`read_csv`** (Function) — `etl/patch_oasis_v4.py:159`
- **`step1_oasis_descriptors`** (Function) — `etl/patch_oasis_v4.py:185`
- **`step2_occupation_oasis`** (Function) — `etl/patch_oasis_v4.py:317`
- **`norm`** (Function) — `etl/patch_oasis_v4.py:348`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `norm` | Function | `etl/patch_oasis_v4.py` | 424 |
| `read_csv` | Function | `etl/patch_oasis_v4.py` | 159 |
| `step1_oasis_descriptors` | Function | `etl/patch_oasis_v4.py` | 185 |
| `step2_occupation_oasis` | Function | `etl/patch_oasis_v4.py` | 317 |
| `norm` | Function | `etl/patch_oasis_v4.py` | 348 |
| `step3_cnp_hierarchy` | Function | `etl/patch_oasis_v4.py` | 492 |
| `step4_work_environments` | Function | `etl/patch_oasis_v4.py` | 648 |
| `truncate` | Function | `etl/patch_oasis_v4.py` | 118 |
| `upsert` | Function | `etl/patch_oasis_v4.py` | 84 |
| `parse_oasis_guide` | Function | `etl/le_siphon_v2.py` | 415 |
| `parse_oasis_scores` | Function | `etl/le_siphon_v2.py` | 493 |
| `parse_oasis_work_environments` | Function | `etl/le_siphon_v2.py` | 586 |
| `phase3_upsert_taxonomy` | Function | `etl/le_siphon_v2.py` | 807 |
| `phase5_upsert_oasis_profiles` | Function | `etl/le_siphon_v2.py` | 960 |
| `read_csv_flexible` | Function | `etl/le_siphon_v2.py` | 207 |
| `upsert_chunks` | Function | `etl/le_siphon_v2.py` | 240 |
| `cache_path` | Function | `etl/le_siphon_v2.py` | 178 |
| `classify_file` | Function | `etl/le_siphon_v2.py` | 232 |
| `count_table` | Function | `etl/le_siphon_v2.py` | 286 |
| `download_file` | Function | `etl/le_siphon_v2.py` | 183 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → Cache_path` | intra_community | 4 |
| `_ingest_legacy_dpt → Col_find` | cross_community | 3 |
| `_ingest_legacy_dpt → _sf` | cross_community | 3 |
| `Main → Classify_file` | intra_community | 3 |
| `Phase3_upsert_taxonomy → _map_oasis_category` | intra_community | 3 |
| `Phase3_upsert_taxonomy → _safe_float` | intra_community | 3 |
| `Phase3_upsert_taxonomy → _sf` | intra_community | 3 |
| `Step2_occupation_oasis → Norm` | intra_community | 3 |
| `Step2_occupation_oasis → Read_csv` | intra_community | 3 |
| `Run → _neo4j_fetch` | intra_community | 3 |

## How to Explore

1. `context({name: "norm"})` — see callers and callees
2. `query({search_query: "etl"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
