# Trajektia 🚀

**Intelligence Carrière & Career Knowledge Graph (CKG)**

Plateforme souveraine d'orientation professionnelle, d'intelligence du marché du travail et de planification de carrière pour le Québec et le Canada.

---

## 🏛️ Architecture Globale

Trajektia repose sur une architecture découplée alliant graphe relationnel, base de données relationnelle enrichie et vitrine web haute performance :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SOURCES DE DONNÉES                            │
│  SIPeC / OaSIS 2025 • O*NET 28.2 • EDSC Salaires • MEQ La Relance       │
│  CNESST Lésions • Guide des Carrières GC 2016 • ESCO • Adzuna Live API  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Ingestion & Crosswalks
                                     ▼
┌────────────────────────────────────┬────────────────────────────────────┐
│      CAREER KNOWLEDGE GRAPH        │         DATA HUB POSTGRESQL        │
│          Neo4j (bolt)              │         Supabase / Directus        │
│  - 3 871 Métiers (O*NET, ESCO, CNP)│  - Tables encyclopédiques          │
│  - 35 117 Relations REQUIRES       │  - Profils RIASEC & Big Five       │
│  - 32 435 Relations Logiciels      │  - Formations MEQ (539 écoles)     │
│  - 26 388 Relations Outils         │  - Données SST CNESST (20 secteurs)│
│  - 2 378 Concordances (CNP↔O*NET)  │  - Exigences physiques & DPC       │
│  - 4 253 Concordances ESCO         │  - Recherche vectorielle pgvector  │
└────────────────────────────────────┴────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MOTEURS ANALYTIQUES & DÉCISIONNELS                   │
│  - Analytics Ergonomie & Réadaptation (`analytics/ergonomics.py`)       │
│  - Calibration Prediger & Indice ICP (`analytics/prediger_riasec_*.py`) │
│  - Service Sémantique & Explicabilité DPC (`analytics/dpc_service.py`)  │
│  - Moteur d'Appariement 11D Cosinus (`frontend-web/.../scoring-engine`) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VITRINE FRONTEND ASTRO                          │
│               Astro 5 + React + Tailwind (`frontend-web/`)              │
│  - Fiches Métiers 360° (`/metiers/[cnp_code]`)                          │
│  - Fiches Formations (`/formations/[code]`)                             │
│  - Explorateur & Recherche vectorielle sémantique                       │
│  - Suite d'Outils Interactifs (`/outils`) :                             │
│      * Test Psychométrique Big Five & RIASEC (110 items)                │
│      * Simulateur d'aide financière aux études (AFE)                    │
│      * Calculateur de rentabilité scolaire                              │
│      * Observatoire du marché du travail                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du Répertoire

```
trajektia/
├── analytics/                   ← Moteurs décisionnels, cliniques et psychométriques
│   ├── ergonomics.py            ← Moteur d'adéquation ergonomique & alertes CNESST
│   ├── prediger_riasec_calibrator.py ← Calibration cartésienne Prediger ↔ RIASEC
│   └── dpc_service.py           ← Service narratif DPC pour conseillers d'orientation
├── ckg/                         ← Career Knowledge Graph (Neo4j)
│   ├── ingestors/               ← Scripts d'ingestion (O*NET, SIPeC, salaires, ESCO)
│   ├── crosswalks/              ← Concordances CNP ↔ O*NET ↔ ESCO
│   ├── audit/                   ← Scripts d'audit et de validation du graphe
│   ├── MANUEL_METHODOLOGIQUE_CKG.md ← Manuel méthodologique scientifique (19 sections)
│   ├── PLAN_ACTION.md           ← Feuille de route et suivi d'avancement
│   └── REGISTRE_SOURCES_DONNEES.md ← Registre officiel des sources de données
├── database/                    ← Schémas SQL Supabase / PostgreSQL (V1 à V12)
│   ├── schema.sql à schema_v12_pgvector.sql
├── etl/                         ← Pipelines de synchronisation Supabase
│   ├── le_siphon.py             ← Pont Neo4j → Supabase
│   ├── meq_relance_ingestor.py  ← Écoles MEQ & données La Relance
│   ├── cnesst_supabase_ingestor.py ← Données SST Québec & lésions
│   └── physical_demands_dpc_ingestor.py ← Exigences physiques & DPC GC 2016
├── frontend-web/                ← Vitrine Astro 5 & Applications React
│   ├── src/
│   │   ├── components/
│   │   │   ├── PsychometricTest.tsx ← Composant interactif du test (110 questions)
│   │   │   ├── CareerCard.astro, JobAlertModal.astro, etc.
│   │   ├── data/
│   │   │   ├── questions-psychometriques.ts ← Banques d'items IPIP-50 & O*NET Mini-IP
│   │   │   └── outils.ts        ← Catalogue des outils interactifs
│   │   ├── utils/
│   │   │   └── scoring-engine.ts ← Moteur de scoring, inversions & similarité 11D
│   │   └── pages/
│   │       ├── metiers/[code].astro ← Fiche métier exhaustive 360°
│   │       ├── outils/index.astro   ← Hub des outils interactifs
│   │       └── outils/test-psychometrique.astro ← Page du test psychométrique
└── scripts/                     ← Utilitaires, tests Adzuna, pgvector
```

---

## 🧪 Module de Test Psychométrique (Nouveauté)

Accessible sur `/outils/test-psychometrique` :
- **Double inventaire scientifique validé** :
  - **Big Five (OCEAN)** : 50 énoncés IPIP-50 (Goldberg 1992) avec clés d'inversion.
  - **Intérêts RIASEC** : 60 activités concrètes O*NET Mini-IP (Rounds et al. 2010).
- **Moteur de calcul 100% côté client** :
  - Normalisation 0-100 par dimension.
  - Appariement par similarité cosinus dans un espace vectoriel à **11 dimensions**.
  - Recommandation instantanée du **Top 10 des métiers québécois** les plus adaptés.
  - Visualisations graphiques vectorielles : **Hexagone SVG RIASEC** et **Radar SVG Big Five**.
  - Respect strict de la Loi 25 : persistance locale sous `localStorage`, aucune donnée clinique transmise sans consentement.

---

## 🚀 Démarrage Rapide

### 1. Backend Python & CKG

```bash
# Copier et configurer l'environnement
cp .env.example .env

# Installer les dépendances Python
pip install -r requirements.txt

# Vérifier la configuration des sources de données
python ckg/ckg_config.py

# Tester les moteurs analytiques
python analytics/ergonomics.py
python analytics/prediger_riasec_calibrator.py
```

### 2. Frontend Astro Web

```bash
cd frontend-web

# Installer les dépendances Node
npm install

# Lancer le serveur de développement
npm run dev
# Vitrine accessible sur http://localhost:3000 (ou 3001 si occupé)
```

---

## 📚 Documentation de Référence

- **[Manuel Méthodologique CKG](file:///c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter/trajektia/ckg/MANUEL_METHODOLOGIQUE_CKG.md)** : Référence scientifique complète (19 sections, formules mathématiques, modèles cliniques Prediger, DPC, Big Five, RIASEC, recherche vectorielle).
- **[Plan d'Action CKG](file:///c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter/trajektia/ckg/PLAN_ACTION.md)** : Feuille de route détaillée et suivi de réalisation par phase.
- **[Registre des Sources de Données](file:///c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter/trajektia/ckg/REGISTRE_SOURCES_DONNEES.md)** : Catalogue exhaustif des 12+ référentiels officiels et calendrier de mise à jour.
