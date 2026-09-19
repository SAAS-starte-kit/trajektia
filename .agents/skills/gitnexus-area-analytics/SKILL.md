---
name: gitnexus-area-analytics
description: "Skill for the Analytics area of trajektia. 10 symbols across 3 files."
---

# Analytics

10 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `analytics/`
- Understanding how explain_occupation_dpc, filter_occupations_by_dpc, get_db_connection work
- Modifying analytics-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `analytics/dpc_service.py` | explain_occupation_dpc, filter_occupations_by_dpc, get_db_connection, load_dpc_taxonomy |
| `analytics/ergonomics.py` | evaluate_functional_compatibility, check_ordinal_limitation, get_db_connection |
| `analytics/prediger_riasec_calibrator.py` | calculate_prediger_coordinates, extract_dpc_value, get_db_connection |

## Entry Points

Start here when exploring this area:

- **`explain_occupation_dpc`** (Function) — `analytics/dpc_service.py:59`
- **`filter_occupations_by_dpc`** (Function) — `analytics/dpc_service.py:154`
- **`get_db_connection`** (Function) — `analytics/dpc_service.py:30`
- **`load_dpc_taxonomy`** (Function) — `analytics/dpc_service.py:36`
- **`evaluate_functional_compatibility`** (Function) — `analytics/ergonomics.py:17`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `explain_occupation_dpc` | Function | `analytics/dpc_service.py` | 59 |
| `filter_occupations_by_dpc` | Function | `analytics/dpc_service.py` | 154 |
| `get_db_connection` | Function | `analytics/dpc_service.py` | 30 |
| `load_dpc_taxonomy` | Function | `analytics/dpc_service.py` | 36 |
| `evaluate_functional_compatibility` | Function | `analytics/ergonomics.py` | 17 |
| `check_ordinal_limitation` | Function | `analytics/ergonomics.py` | 93 |
| `get_db_connection` | Function | `analytics/ergonomics.py` | 12 |
| `calculate_prediger_coordinates` | Function | `analytics/prediger_riasec_calibrator.py` | 27 |
| `extract_dpc_value` | Function | `analytics/prediger_riasec_calibrator.py` | 18 |
| `get_db_connection` | Function | `analytics/prediger_riasec_calibrator.py` | 13 |

## How to Explore

1. `context({name: "explain_occupation_dpc"})` — see callers and callees
2. `query({search_query: "analytics"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
