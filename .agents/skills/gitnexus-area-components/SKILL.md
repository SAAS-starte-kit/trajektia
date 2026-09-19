---
name: gitnexus-area-components
description: "Skill for the Components area of trajektia. 69 symbols across 8 files."
---

# Components

69 symbols | 8 files | Cohesion: 89%

## When to Use

- Working with code in `frontend-web/`
- Understanding how computeMatches, handleAnswer, buildJobValuesVector work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend-web/src/components/PsychometricTest.tsx` | BigFiveRadar, points, getPoint, BigFiveScoresList, CareerMatchCard (+11) |
| `frontend-web/src/components/SatisfactionTest.tsx` | computeMatches, handleAnswer, RerankedMatchCard, ResultsPhase, SatisfactionMatchCard (+9) |
| `frontend-web/src/components/CalculateurDiplome.tsx` | getStatusColorConfig, handleGradeChange, handleNameChange, handleStatusChange, handleUnitsChange (+8) |
| `frontend-web/src/utils/satisfaction-engine.ts` | buildJobValuesVector, buildUserValuesVector, calculateSatisfactionScores, normalize, generateCommentaire (+6) |
| `frontend-web/src/utils/scoring-engine.ts` | pearsonCorrelation, getResultsFromLocalStorage, calculateScores, calculatePercentile, normalize (+2) |
| `frontend-web/src/components/SemanticSearchBar.tsx` | SearchIcon, SemanticSearchBar, getBarColor, SparklesIcon, Spinner |
| `frontend-web/src/components/ShareButton.tsx` | copyToClipboard, handleShare |
| `frontend-web/src/utils/diplomaCalculator.ts` | calculateDiplomaResults |

## Entry Points

Start here when exploring this area:

- **`computeMatches`** (Function) — `frontend-web/src/components/SatisfactionTest.tsx:88`
- **`handleAnswer`** (Function) — `frontend-web/src/components/SatisfactionTest.tsx:113`
- **`buildJobValuesVector`** (Function) — `frontend-web/src/utils/satisfaction-engine.ts:184`
- **`buildUserValuesVector`** (Function) — `frontend-web/src/utils/satisfaction-engine.ts:180`
- **`calculateSatisfactionScores`** (Function) — `frontend-web/src/utils/satisfaction-engine.ts:107`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `computeMatches` | Function | `frontend-web/src/components/SatisfactionTest.tsx` | 88 |
| `handleAnswer` | Function | `frontend-web/src/components/SatisfactionTest.tsx` | 113 |
| `buildJobValuesVector` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 184 |
| `buildUserValuesVector` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 180 |
| `calculateSatisfactionScores` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 107 |
| `normalize` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 139 |
| `getSatisfactionFit` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 190 |
| `rerankBySatisfaction` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 250 |
| `saveSatisfactionResults` | Function | `frontend-web/src/utils/satisfaction-engine.ts` | 307 |
| `pearsonCorrelation` | Function | `frontend-web/src/utils/scoring-engine.ts` | 245 |
| `getStatusColorConfig` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 121 |
| `handleGradeChange` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 65 |
| `handleNameChange` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 84 |
| `handleStatusChange` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 82 |
| `handleUnitsChange` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 83 |
| `removeCourse` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 92 |
| `renderCourseRow` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 131 |
| `CalculateurDiplome` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 40 |
| `ReqItem` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 301 |
| `addCourse` | Function | `frontend-web/src/components/CalculateurDiplome.tsx` | 86 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HandleAnswer → BuildUserValuesVector` | intra_community | 4 |
| `HandleAnswer → BuildJobValuesVector` | intra_community | 4 |
| `HandleAnswer → PearsonCorrelation` | intra_community | 4 |
| `HandleAnswer → BuildJobVector` | cross_community | 4 |
| `HandleAnswer → BuildUserVector` | cross_community | 4 |
| `HandleAnswer → MapToMatch` | cross_community | 4 |
| `CalculateurDiplome → GetStatusColorConfig` | cross_community | 3 |
| `CalculateurDiplome → HandleGradeChange` | cross_community | 3 |
| `CalculateurDiplome → HandleNameChange` | cross_community | 3 |
| `CalculateurDiplome → HandleUnitsChange` | cross_community | 3 |

## How to Explore

1. `context({name: "computeMatches"})` — see callers and callees
2. `query({search_query: "components"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
