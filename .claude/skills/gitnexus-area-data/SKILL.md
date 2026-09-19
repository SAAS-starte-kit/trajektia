---
name: gitnexus-area-data
description: "Skill for the Data area of trajektia. 4 symbols across 2 files."
---

# Data

4 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `frontend-web/`
- Understanding how LocalProgrammeRepository, LocalProgrammeDEPRepository, ProgrammeRepository work
- Modifying data-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend-web/src/data/programmes-dec-prealables.ts` | LocalProgrammeRepository, ProgrammeRepository |
| `frontend-web/src/data/programmes-dep-prealables.ts` | LocalProgrammeDEPRepository, ProgrammeDEPRepository |

## Entry Points

Start here when exploring this area:

- **`LocalProgrammeRepository`** (Class) — `frontend-web/src/data/programmes-dec-prealables.ts:1398`
- **`LocalProgrammeDEPRepository`** (Class) — `frontend-web/src/data/programmes-dep-prealables.ts:5645`
- **`ProgrammeRepository`** (Interface) — `frontend-web/src/data/programmes-dec-prealables.ts:1393`
- **`ProgrammeDEPRepository`** (Interface) — `frontend-web/src/data/programmes-dep-prealables.ts:5640`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `LocalProgrammeRepository` | Class | `frontend-web/src/data/programmes-dec-prealables.ts` | 1398 |
| `LocalProgrammeDEPRepository` | Class | `frontend-web/src/data/programmes-dep-prealables.ts` | 5645 |
| `ProgrammeRepository` | Interface | `frontend-web/src/data/programmes-dec-prealables.ts` | 1393 |
| `ProgrammeDEPRepository` | Interface | `frontend-web/src/data/programmes-dep-prealables.ts` | 5640 |

## How to Explore

1. `context({name: "LocalProgrammeRepository"})` — see callers and callees
2. `query({search_query: "data"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
