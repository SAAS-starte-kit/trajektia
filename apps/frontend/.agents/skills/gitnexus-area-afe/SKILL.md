---
name: gitnexus-area-afe
description: "Skill for the Afe area of trajektia. 12 symbols across 3 files."
---

# Afe

12 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `frontend-web/`
- Understanding how Presentation, handleKeyDown, nextSlide work
- Modifying afe-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `frontend-web/src/components/afe/Presentation.tsx` | CheckSquare, Plus, Presentation, handleKeyDown, nextSlide (+2) |
| `frontend-web/src/components/afe/pptxGenerator.ts` | generatePresentationPPTX, addFooter, addHeader |
| `frontend-web/src/components/afe/App.tsx` | App, PresentationMode |

## Entry Points

Start here when exploring this area:

- **`Presentation`** (Function) — `frontend-web/src/components/afe/Presentation.tsx:43`
- **`handleKeyDown`** (Function) — `frontend-web/src/components/afe/Presentation.tsx:446`
- **`nextSlide`** (Function) — `frontend-web/src/components/afe/Presentation.tsx:442`
- **`prevSlide`** (Function) — `frontend-web/src/components/afe/Presentation.tsx:443`
- **`generatePresentationPPTX`** (Function) — `frontend-web/src/components/afe/pptxGenerator.ts:22`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `Presentation` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 43 |
| `handleKeyDown` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 446 |
| `nextSlide` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 442 |
| `prevSlide` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 443 |
| `generatePresentationPPTX` | Function | `frontend-web/src/components/afe/pptxGenerator.ts` | 22 |
| `addFooter` | Function | `frontend-web/src/components/afe/pptxGenerator.ts` | 29 |
| `addHeader` | Function | `frontend-web/src/components/afe/pptxGenerator.ts` | 43 |
| `App` | Function | `frontend-web/src/components/afe/App.tsx` | 71 |
| `CheckSquare` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 544 |
| `Plus` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 537 |
| `Slide` | Function | `frontend-web/src/components/afe/Presentation.tsx` | 25 |
| `PresentationMode` | Function | `frontend-web/src/components/afe/App.tsx` | 9 |

## How to Explore

1. `context({name: "Presentation"})` — see callers and callees
2. `query({search_query: "afe"})` — find related execution flows
3. Read key files listed above for implementation details
4. `explain({target: "<file or symbol>"})` — persisted taint findings (source→sink data flows), when indexed with `--pdg`
