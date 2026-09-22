---
name: gitnexus-area-cluster-61
description: "Skill for the Cluster_61 area of trajektia. 5 symbols across 1 files."
---

# Cluster_61

5 symbols | 1 files | Cohesion: 67%

## When to Use

- Working with code in `frontend-web/`
- Understanding how buildJobVector, buildUserVector, getCareerMatches work
- Modifying cluster_61-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend-web/src/utils/scoring-engine.ts` | buildJobVector, buildUserVector, getCareerMatches, mapToMatch, getTopMatchingCareers |

## Entry Points

Start here when exploring this area:

- **`buildJobVector`** (Function) — `frontend-web/src/utils/scoring-engine.ts:316`
- **`buildUserVector`** (Function) — `frontend-web/src/utils/scoring-engine.ts:270`
- **`getCareerMatches`** (Function) — `frontend-web/src/utils/scoring-engine.ts:333`
- **`mapToMatch`** (Function) — `frontend-web/src/utils/scoring-engine.ts:356`
- **`getTopMatchingCareers`** (Function) — `frontend-web/src/utils/scoring-engine.ts:388`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `buildJobVector` | Function | `frontend-web/src/utils/scoring-engine.ts` | 316 |
| `buildUserVector` | Function | `frontend-web/src/utils/scoring-engine.ts` | 270 |
| `getCareerMatches` | Function | `frontend-web/src/utils/scoring-engine.ts` | 333 |
| `mapToMatch` | Function | `frontend-web/src/utils/scoring-engine.ts` | 356 |
| `getTopMatchingCareers` | Function | `frontend-web/src/utils/scoring-engine.ts` | 388 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HandleAnswer → BuildJobVector` | cross_community | 4 |
| `HandleAnswer → BuildUserVector` | cross_community | 4 |
| `HandleAnswer → MapToMatch` | cross_community | 4 |
| `PsychometricTest → PearsonCorrelation` | cross_community | 3 |
| `PsychometricTest → BuildJobVector` | cross_community | 3 |
| `PsychometricTest → BuildUserVector` | cross_community | 3 |
| `PsychometricTest → MapToMatch` | cross_community | 3 |
| `HandleAnswer → PearsonCorrelation` | cross_community | 3 |
| `HandleAnswer → BuildJobVector` | cross_community | 3 |
| `HandleAnswer → BuildUserVector` | cross_community | 3 |

## How to Explore

1. `context({name: "buildJobVector"})` — see callers and callees
2. `query({search_query: "cluster_61"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
