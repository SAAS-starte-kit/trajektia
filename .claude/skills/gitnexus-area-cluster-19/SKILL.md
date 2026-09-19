---
name: gitnexus-area-cluster-19
description: "Skill for the Cluster_19 area of trajektia. 4 symbols across 1 files."
---

# Cluster_19

4 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `ckg/`
- Understanding how download_resource, fetch_resources, main work
- Modifying cluster_19-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `ckg/utils/sipec_data_manager.py` | download_resource, fetch_resources, main, setup_environment |

## Entry Points

Start here when exploring this area:

- **`download_resource`** (Function) — `ckg/utils/sipec_data_manager.py:33`
- **`fetch_resources`** (Function) — `ckg/utils/sipec_data_manager.py:15`
- **`main`** (Function) — `ckg/utils/sipec_data_manager.py:72`
- **`setup_environment`** (Function) — `ckg/utils/sipec_data_manager.py:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `download_resource` | Function | `ckg/utils/sipec_data_manager.py` | 33 |
| `fetch_resources` | Function | `ckg/utils/sipec_data_manager.py` | 15 |
| `main` | Function | `ckg/utils/sipec_data_manager.py` | 72 |
| `setup_environment` | Function | `ckg/utils/sipec_data_manager.py` | 10 |

## How to Explore

1. `context({name: "download_resource"})` — see callers and callees
2. `query({search_query: "cluster_19"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
