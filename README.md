# Trajektia 🚀

**Intelligence Carrière — Hub & Spoke Architecture (Bento Bridge)**

Dépôt de production propre issu du pivot architectural depuis `saas-ai-starter` (archive R&D).

---

## Architecture

```
Neo4j local (archive)
    ↓ Le Siphon (ETL)
Supabase PostgreSQL  ←→  Directus Cloud (CMS)
    ↓
FastAPI Stitcher (Render / Railway)
    ↓
Brilliant Directories (Frontend)
```

## Structure

```
trajektia/
├── database/
│   ├── schema.sql          ← DDL complet Supabase (10 tables, RLS, index)
│   └── migrations/         ← Migrations futures
├── etl/
│   └── le_siphon.py        ← ETL Neo4j → PostgreSQL (données carrières)
├── ingestors/
│   └── oasis_ingestor.py   ← À DÉVELOPPER: OaSIS 2025 → PostgreSQL direct
├── api/
│   ├── main.py             ← FastAPI Stitcher (à développer)
│   └── routers/
├── .env.example
├── requirements.txt
└── README.md
```

## Démarrage rapide

```bash
# 1. Copier les variables d'environnement
cp .env.example .env
# Remplir: SUPABASE_DB_URL, NEO4J_PASSWORD, ONET_API_KEY...

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Appliquer le schéma sur Supabase (via Supabase Studio → SQL Editor)
#    Coller le contenu de database/schema.sql

# 4. Lancer Le Siphon (ETL Neo4j → Supabase)
python etl/le_siphon.py
```

## Données migrées (via Le Siphon)

| Source | Données | Table cible |
|---|---|---|
| SIPeC 2025 / NOC | 3 361 occupations, salaires | `occupations` |
| O\*NET 28.2 (ZIP) | 70 146 relations psychométriques | `competencies`, `occupation_competencies` |
| O\*NET 28.2 (API v2) | Skills, Tasks, Tools | `tasks`, `tools`, jonctions |
| O\*NET RIASEC | Profils RIASEC par métier | `riasec_profiles` |

## Prochaines étapes

- [ ] **Phase 5** — `ingestors/oasis_ingestor.py` : OaSIS 2025 → PostgreSQL direct
- [ ] **FastAPI Stitcher** — Endpoint `/api/metier/{cnp_code}` pour Brilliant Directories
- [ ] **Connexion Directus** — Introspection sur Supabase, webhooks Flow
- [ ] **Widgets BD** — Radar RIASEC en Vanilla JS + CDN Chart.js

## Référence archive

Le dépôt `saas-ai-starter` (gelé) contient :
- Pipeline OmniPrompt / HybridRAG
- Ingesteurs Neo4j (O\*NET, SIPeC, JobBank)
- Frontend React (Trajecto Explorer)
- Scripts de debug et POC
