# 🕸️ Trajektia — Career Knowledge Graph (CKG)

**Workspace dédié à l'enrichissement du graphe Neo4j.**

Ce dossier est le point d'entrée unique pour tous les travaux sur le graphe de connaissances de carrière.
Il ne contient que les scripts d'ingestion Neo4j, les crosswalks et les utilitaires d'audit.

---

## 🏗️ Architecture de données

```
Neo4j (CKG — ce dossier)
│   Rôle : Graphe relationnel léger — moteur de passerelles
│   Stocke : IDs, titres courts, relations entre entités
│
│   (:Occupation)-[:REQUIRES]->(:Skill)
│   (:Occupation)-[:USES_TOOL]->(:Tool)
│   (:Occupation)-[:EQUIVALENT_TO]->(:Occupation {taxonomy:'ESCO'})
│   (:Occupation)-[:ADVANCES_TO]->(:Occupation)
│
└── Le Siphon (ETL) → Supabase (PostgreSQL / Directus)
        Rôle : Encyclopédie — descriptions, stats, salaires
        Stocke : textes complets, taux de placement, coûts
```

---

## 📁 Structure du dossier

```
ckg/
├── ingestors/           → Scripts d'ingestion de données dans Neo4j
│   ├── seed_ckg_neo4j.py          Pipeline complet SIPeC + O*NET
│   ├── unified_graph_loader.py    SIPeC 2025 (compétences canadiennes)
│   ├── sipec_completion_ingestor.py  Complétion des données SIPeC
│   ├── onet_psychometrics_ingestor.py  Aptitudes, styles, valeurs O*NET
│   ├── onet_tech_ingestor.py      Logiciels & outils O*NET ✅ Complété (32k relations)
│   ├── official_wages_ingestor.py Salaires ESDC 2025 ✅ Complété
│   ├── jobbank_api_ingestor_global.py  Offres actives Job Bank
│   └── esco_enricher.py           Enrichissement bilingue ESCO via API
│
├── crosswalks/          → Scripts de correspondance entre taxonomies
│   ├── unified_crosswalk_loader.py  NOC ↔ O*NET ↔ ESCO ✅ Complété (1 467 liens NOC-ONET)
│   └── download_noc_onet_crosswalk.py  Téléchargement du mapping officiel
│
├── audit/               → Scripts de vérification et diagnostic
│   ├── verify_ckg_data.py         Validation complète du graphe
│   ├── verify_phase9.py           Vérification Phase 9 (psychométrie)
│   └── verify_career_profile.py   Vérification profils de carrière
│
trajektia/analytics/     → Moteurs décisionnels, cliniques et psychométriques
│   ├── ergonomics.py              Moteur d'adéquation ergonomique, limitations & alertes récidive CNESST
│   ├── prediger_riasec_calibrator.py Moteur de calibration psychométrique DPC ↔ RIASEC & ICP
│   └── dpc_service.py             Service d'explicabilité narrative DPC & filtres de complexité pour c.o.
│
trajektia/etl/           → Pipelines Supabase & intégrations provinciales
│   ├── cnesst_supabase_ingestor.py  Ingestion SST Québec (114k lésions, 20 secteurs)
│   ├── meq_relance_ingestor.py      Formations MEQ & Données La Relance (539 écoles, 220 prog)
│   ├── physical_demands_dpc_ingestor.py  Exigences physiques S/B/L/V/C/H & DPC (504 métiers)
│   └── le_siphon.py                 Synchronisation Neo4j → Supabase / Directus
```

---

## 🚦 État actuel du système (Septembre 2026 — Vérifié en direct)

| Source / Module | Statut | Relations / Volumétrie | Notes |
|:---|:---|---:|:---|
| **SIPeC 2025 / OaSIS** (Canada) | ✅ Complet | 35 117 `REQUIRES` | 900 métiers canadiens (codes `.0`) |
| **O*NET Psychométrie** | ✅ Complet | 109 244 total | Aptitudes, styles, valeurs, RIASEC |
| **O*NET Outils** (`USES_TOOL`) | ✅ Complet | 26 388 | Outils physiques et équipement |
| **O*NET Logiciels** (`REQUIRES_SOFTWARE`) | ✅ Complet | 32 435 | Compétences logicielles et tech |
| **Salaires ESDC 2025** | ✅ Complet | Prop. sur nœuds | 3 361 métiers avec `median_salary` |
| **Crosswalk NOC ↔ O*NET** | ✅ Complet | 1 467 liens | Concordance certifiée |
| **Crosswalk O*NET ↔ ESCO** | ✅ Complet | 4 253 liens | 1 818 métiers ESCO enrichis FR/EN |
| **Formations MEQ / La Relance** | ✅ Complet | 964 liens, 539 écoles | Salaires et taux de placement réels |
| **SST / CNESST Québec** | ✅ Complet | 3 698 liens Supabase | 114 345 lésions, 1 496 `HAS_RISK` Neo4j |
| **Exigences Physiques & DPC** | ✅ Complet | 504 métiers | Forces S1-S4, Postures B1-B4, DPC |
| **Taxonomie DPC Officielle (D1)** | ✅ Complet | 25 échelons en base | `ref_dpc_taxonomy` + vue enrichie `v_occupation_dpc_detailed` |
| **Service Explicabilité c.o. (D1)** | ✅ Opérationnel | `analytics/dpc_service.py` | Narratives bilingues + filtres seuils |
| **Moteur Ergonomique (E1/E2)** | ✅ Opérationnel | `analytics/ergonomics.py` | Adéquation limitations + vigilance CNESST |
| **Moteur Prediger-RIASEC (D2)** | ✅ Opérationnel | `analytics/prediger_riasec_calibrator.py` | Indice ICP, détection métiers hybrides |
| **Test Psychométrique (Big Five + RIASEC)** | ✅ Complet | 110 items (IPIP-50 + Mini-IP) | Scoring 11D cosinus centré ($r$ Pearson), Astro/React, Radars SVG |
| **Matching Métiers Réels & Miroir (D5/D6)** | ✅ Complet | 301 métiers réels branchés | Biais des profils plats éradiqué, narratifs positifs, miroir OCCOQ |
| **Le Siphon (Neo4j → Supabase)** | ✅ Complet | 8 phases d'export | Synchronisation Occupations, Compétences, Outils, RIASEC, SST & Exigences Physiques / DPC / Prediger (`occupation_physical_demands`) |
| **Module Satisfaction TWA (D7)** | 🟡 Cadré | O*NET WIL (21 items) + Work Values | Étape 2 approfondissement (Theory of Work Adjustment) |
| **Titres Alternatifs TCC 2025** | ✅ Complet | 1 028 synonymes | Ingestion via `scripts/ingest_tcc_synonyms.py` vers `competency_synonyms` |
| **Compétences Vertes ESCO** | 🟡 Cadré | Filtre `isGreenSkill` | Stratégie verte ciblée (Phase A4) |
| **Job Bank** (offres actives) | 🔴 Planifié | 0 | Script API à lancer (Phase A5) |

---

## 🎯 Prochaines actions prioritaires

### Action 1 — Composants UI Fiches Métiers Astro (Phase F2) [IMMÉDIAT]
Conception du Bloc Ergonomie (toggle Pro/Grand public) et du Graphique cartésien de Prediger dans `frontend-web/src/pages/metiers/[cnp].astro` (prototypage Google Stitch + Astro).

### Action 2 — Ingestion des Offres Guichet-Emplois (Job Bank - Phase H1)
Ingestion de l'archive officielle Guichet-Emplois (Open Data CKAN) pour lier les offres réelles du marché aux codes CNP 2021 dans Neo4j (`:JobPosting`).

---

## 🔧 Prérequis

- **Neo4j** démarré sur `bolt://localhost:7687` (projet `CKG`)
- Variables d'environnement dans `trajektia/.env` :
  ```
  NEO4J_URI=bolt://localhost:7687
  NEO4J_USER=neo4j
  NEO4J_PASSWORD=...
  ```
- Données sources dans `../data/raw/onet/` et `../data/raw/sipec/`
