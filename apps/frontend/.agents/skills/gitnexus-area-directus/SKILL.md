---
name: gitnexus-area-directus
description: "Skill for the Directus area of trajektia. 5 symbols across 1 files."
---

# Directus

5 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `directus/`
- Understanding how configure_collection, get_fields, log work
- Modifying directus-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `directus/fix_directus.py` | configure_collection, get_fields, log, set_search_fields, verify_search |

## Entry Points

Start here when exploring this area:

- **`configure_collection`** (Function) — `directus/fix_directus.py:98`
- **`get_fields`** (Function) — `directus/fix_directus.py:127`
- **`log`** (Function) — `directus/fix_directus.py:76`
- **`set_search_fields`** (Function) — `directus/fix_directus.py:134`
- **`verify_search`** (Function) — `directus/fix_directus.py:166`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `configure_collection` | Function | `directus/fix_directus.py` | 98 |
| `get_fields` | Function | `directus/fix_directus.py` | 127 |
| `log` | Function | `directus/fix_directus.py` | 76 |
| `set_search_fields` | Function | `directus/fix_directus.py` | 134 |
| `verify_search` | Function | `directus/fix_directus.py` | 166 |

## How to Explore

1. `context({name: "configure_collection"})` — see callers and callees
2. `query({search_query: "directus"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
