# Étude de Faisabilité Technique — Initiative I7
# Ingestion Textuelle du Corpus d'Offres d'Emploi 14M (CKAN) & Vectorisation Graph-RAG

---

## 1. Objectif Stratégique

L'initiative **I7** vise à transformer le corpus longitudinal des offres d'emploi (14 derniers mois) en un référentiel sémantique vectorisé au sein du **Career Knowledge Graph (CKG)** de Trajektia.

L'objectif est double :
1. **Alimenter le graphe de connaissances** avec des granularités régionales (villes, régions administratives québécoises, entreprises et dynamiques locales de recrutement).
2. **Activer le calcul de similarités vectorielles (Graph-RAG)** pour matcher instantanément les compétences réelles du marché avec les profils psychométriques (O*NET, RIASEC), identifier les signaux faibles de compétences émergentes (IA, outils modernes), et enrichir le moteur de passerelles de reconversion.

---

## 2. Audit & Analyse du Corpus CKAN (Guichet-Emplois Open Data)

L'inspection technique des flux de données ouverts du Gouvernement du Canada (`open.canada.ca`, package `ea639e28-c0fc-48bf-b5dd-b8899bd43072`) a révélé les spécificités suivantes :

### 2.1 Format & Encodage des Données
- **Encodage** : `UTF-16LE` avec BOM (`\xff\xfe`) et séparateur tabulation (`\t`).
- **Périodicité** : 88 ressources mensuelles archivées (couvrant plus de 24 mois glissants).
- **Nombre de colonnes** : 65 champs structurés par enregistrement.

### 2.2 Inventaire des Attributs Disponibles dans les Dumps Mensuels
| Catégorie | Colonnes Clés Identifiées | Valeur pour Trajektia |
| :--- | :--- | :--- |
| **Identification & Métier** | `Code CNP 2021`, `Code CNP21 nom`, `Appellation d'emploi`, `SCIAN` | Mappage 1:1 vers les 510 fiches métiers et secteurs CKG. |
| **Géographie Fine** | `Ville`, `Région économique`, `Provinces/Territoires`, `Code postal` | Analyse de la demande par région québécoise (Montréal, Capitale-Nationale, Estrie, etc.). |
| **Rémunération** | `Salaire par`, `Salaire Minimum`, `Salaire Maximum`, `Détail Rémunération` | Calcul des courbes de salaires réels et des distributions par feer/région. |
| **Modalités de Travail** | `Conditions d'emploi Virtuel`, `Conditions d'emploi Sur Appel`, `Quart`, `Jour/Soir/Nuit` | Alimentation du véritable ratio Télétravail & Hybride québécois. |
| **Exigences d'Accès** | `Éducation Niveau d'études`, `Niveau d'expérience` | Validation des prérequis et maillage avec les programmes DEC/DEP. |

### 2.3 Constat Critique sur les Descriptions Libres (Full-Text)
- Les dumps mensuels tabulaires de CKAN synthétisent les offres sous forme de métadonnées déclaratives (65 critères), mais ne contiennent pas le texte intégral brut du paragraphe descriptif.
- **Stratégie Hybride Recommandée** :
  1. **Socle Longitudinal (CKAN 14M)** : Fournit le volume exhaustif, les salaires historiques, les villes/régions et le statut de télétravail.
  2. **Corpus Textuel Détaillé (Adzuna + Job Bank API)** : Ingestion continue des descriptions complètes (200 à 2000 mots par offre) avec `scripts/ingest_adzuna_live.py` pour extraire les compétences textuelles fines et le contexte de mission.

---

## 3. Architecture Technique de Vectorisation Graph-RAG

```
                 +---------------------------------------------+
                 | Flux CKAN (14M) + Adzuna Live (Descriptions)|
                 +---------------------------------------------+
                                        |
                                        v
                 +---------------------------------------------+
                 |      Pipeline d'Extraction & Nettoyage      |
                 |  - Extraction entités : Titre, Tâches, Outils|
                 |  - Normalisation ESCO / O*NET               |
                 +---------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|        Supabase PostgreSQL      |           |          Neo4j CKG Graphe       |
|    - Table job_postings_vectors |           | - Nœuds: JobPosting, Skill, City|
|    - Extension pgvector (HNSW)  |           | - Relations: REQUIRES, LOCATED  |
|    - Modèle: text-embedding-004 |           | - Index Vectoriel Cosine        |
+---------------------------------+           +---------------------------------+
                 \                                             /
                  \                                           /
                   v                                         v
                 +---------------------------------------------+
                 |       Moteur de Requête Sémantique          |
                 |  - Recherche d'emploi contextuelle          |
                 |  - Passerelles de compétences vectorisées   |
                 |  - Détection de compétences émergentes      |
                 +---------------------------------------------+
```

### 3.1 Schéma Neo4j pour les Postings & Compétences
```cypher
// Création du schéma de graphe
CREATE CONSTRAINT unique_job_posting IF NOT EXISTS
FOR (j:JobPosting) REQUIRE j.external_id IS UNIQUE;

// Index vectoriel sur les descriptions d'offres
CREATE VECTOR INDEX job_posting_embeddings IF NOT EXISTS
FOR (j:JobPosting) ON (j.embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 768,
    `vector.similarity_function`: 'cosine'
  }
};

// Relations de graphe
(:JobPosting)-[:POSTED_FOR_OCCUPATION]->(:Occupation {cnp_code: $cnp})
(:JobPosting)-[:REQUIRES_SKILL {frequency: $freq}]->(:Skill)
(:JobPosting)-[:LOCATED_IN]->(:City)-[:IN_REGION]->(:EconomicRegion)
```

### 3.2 Modèle d'Embedding & Stratégie de Chunking
- **Modèle sélectionné** : `text-embedding-004` (Google GenAI) via l'API Gemini ou `bge-m3` en inférence locale pour le support trilingue FR-EN-Tech.
- **Dimensions** : 768 dimensions (normalisées L2).
- **Template de Chunking Contextuel** :
  ```text
  Poste : [Titre de l'emploi]
  Profession : CNP [CNP] - [Titre officiel]
  Région : [Ville], [Région économique], Québec
  Mode de travail : [Télétravail / Hybride / Présentiel]
  Exigences : [Niveau d'études], [Expérience]
  Tâches et compétences clés :
  - [Compétence 1]
  - [Compétence 2]
  - [Description de la mission]
  ```

---

## 4. Estimation de la Volumétrie et des Coûts

| Étape | Volume Estimé | Modèle / Outil | Coût Estimé |
| :--- | :--- | :--- | :--- |
| **Ingestion CKAN 14 Mois** | ~120 000 offres QC | Script Python local / Supabase DB | $0.00 (Open Data) |
| **Ingestion Descriptions Adzuna** | ~15 000 offres actives | Script `ingest_adzuna_live.py` | Inclus quota gratuit API |
| **Vectorisation Embeddings** | ~15 000 chunks complets (~6M tokens) | Google `text-embedding-004` ($0.025 / 1M tokens) | **~$0.15 USD** |
| **Stockage Graphe & Vectoriel** | 15k nœuds, 60k arêtes | Neo4j Aura / Supabase pgvector | Inclus dans l'infrastructure actuelle |

---

## 5. Feuille de Route d'Implémentation (Sprints CKG)

1. **Jalon 1 (Complété)** :
   - Inscription formelle de l'initiative I7 dans `packages/ckg/PLAN_ACTION.md`.
   - Levée du verrou `LIMIT 5` et ajout du rate-limiting dans `scripts/ingest_adzuna_live.py`.
2. **Jalon 2 (Sprint Data & Embeddings)** :
   - Écriture du script `scripts/ingest_ckan_regional_profiles.py` extrayant les distributions salariales et compétences par ville/région québécoise depuis les 14 dumps TSV UTF-16LE.
   - Création de la table `trajektia_job_embeddings` sous Supabase (`pgvector`).
3. **Jalon 3 (Sprint Graph-RAG)** :
   - Ingestion des nœuds et des embeddings dans Neo4j (`cypher_tat_pr_rsm_schema.cypher`).
   - Exposition d'une route API de recherche sémantique `/api/v1/jobs/semantic-match`.
