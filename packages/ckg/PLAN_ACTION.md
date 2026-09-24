# Plan d'action CKG â€” Trajektia Career Knowledge Graph
**RÃ©digÃ© le : 2026-09-12 | Statut : Actif**

---

## ðŸŽ¯ Objectif

ComplÃ©ter le Career Knowledge Graph (Neo4j) avec toutes les sources de donnÃ©es manquantes,
puis dÃ©clencher `le_siphon.py` pour alimenter Supabase/Directus afin d'exposer les fiches
mÃ©tiers et formations via la vitrine Astro.

---

## ðŸ�›ï¸� Architecture validÃ©e (rÃ¨gle d'or)

| DonnÃ©es | Destination | Justification |
|:---|:---|:---|
| IDs, titres courts, **relations** entre entitÃ©s | **Neo4j** | Moteur de passerelles et de calcul de parcours |
| Textes descriptifs, stats, salaires dÃ©taillÃ©s | **Supabase** (via Le Siphon) | Affichage rapide sur les fiches du site web |

---

## ðŸ“Š Ã‰tat actuel du graphe (2026-09-12 â€” vÃ©rifiÃ© en direct)

| Source | Statut | Relations | Taux |
|:---|:---|---:|---:|
| SIPeC 2025 / OaSIS (compÃ©tences CA) | Complet | 35 117 REQUIRES | 100% |
| O*NET PsychomÃ©trie (aptitudes, styles, valeurs) | Complet | 109 244 | ~34% mÃ©tiers couverts |
| O*NET Outils (USES_TOOL) | FAIT | 26 388 | 100% (sur mÃ©tiers liÃ©s) |
| O*NET Logiciels (REQUIRES_SOFTWARE) | FAIT | 32 435 | 100% (sur mÃ©tiers liÃ©s) |
| Salaires ESDC 2025 | Complet | prop. sur noeuds | 100% (3 361 mÃ©tiers) |
| Ingestion CNP 2021 | FAIT | 510 Noeuds | 100% (taxonomie CNP) |
| Crosswalk NOC vers O*NET | FAIT | 1 370 mappings | 911 arÃªtes EQUIVALENT_TO crÃ©Ã©es |
| Crosswalk O*NET vers ESCO | FAIT | 4 253 liens | Mapping complet |
| ESCO CompÃ©tences Vertes (Green Skills) | CadrÃ© | StratÃ©gie verte ciblÃ©e | PriorisÃ© post-B3 |
| Formations MEQ / Relance | FAIT (Supabase) | 964 liens, 539 Ã©tab., 220 prog. | 100% dans Supabase |
| O*NET Knowledge              | FAIT     | 6 566    | On a rajoutÃ© les connaissances requises via script. |
| O*NET Work Context           | FAIT     | 21 953   | On a rajoutÃ© les contextes de travail (Social/Environnement) |
| O*NET Job Zones              | FAIT (Supabase + Ingestor Neo4j) | 923 SOC + 5 Zones | 813 professions enrichies (18.4%), mÃ©tadonnÃ©es SVP et Ã©quivalences TEER. |
| SST / CNESST (DonnÃ©es QuÃ©bec) | FAIT | 3 698 liens, 20 secteurs, 7 risques (Supabase) + 1 496 HAS_RISK (Neo4j) | 100% |
| Exigences Physiques (EDSC GC 2016) | FAIT | 504 mÃ©tiers (Forces S1-S4, Postures B1-B4, Vision, OuÃ¯e) | 100% Supabase + Neo4j |
| DPCI DonnÃ©es-Personnes-Choses-IdÃ©es (GC 2016 / O*NET) | FAIT | 504 mÃ©tiers (Cotation DPCI, Pont RIASEC Prediger & Verbes d'action) | 100% Supabase + Frontend |
| Test PsychomÃ©trique (Big Five + RIASEC) | FAIT | 110 items (50 IPIP-50 + 60 Mini-IP), scoring 11D, UI Astro/React | 100% |
| Titres alternatifs TCC 2025 (Synonymes) | Ã€ FAIRE | Dictionnaire synonymes compÃ©tences FR/EN pour recherche | CadrÃ© |
| BLS ORS (Ergonomie US BLS) | PlanifiÃ© | Profils ergonomiques haute prÃ©cision (heures assis/debout, lbs) | CadrÃ© post-B5 |
| Job Bank (offres actives) | FAIT | 424 nÅ“uds MarketDemand (239 CNPs QC) | 100% |
| Career Ladders (CMC) | Demo | 19 liens | Demo seulement |
| Architecture Monorepo & Workspaces | FAIT (2026-09-22) | Découpage en `apps/frontend`, `apps/api`, `packages/ckg`, `packages/database`, `packages/data-pipeline` | 100% |
| Déploiement Vercel & Docker | FAIT (2026-09-22) | Dockerfiles isolés par app + Pipeline de déploiement Astro Vercel | 100% |

---

## PHASE A â€” ComplÃ©ter Neo4j (Le Graphe de Relations)

> Principe : Dans Neo4j, on ingÃ¨re UNIQUEMENT des noeuds lÃ©gers (IDs + titres courts)
> et des arÃªtes relationnelles. PAS de textes descriptifs longs ni de tableaux statistiques.

### A1 â€” CompÃ©tences logicielles O*NET [PRIORITÃ‰ 1 â€” BLOQUANT]

**Pourquoi :** 0 relation REQUIRES_SOFTWARE actuellement.
**Fichier source :** PrÃ©sent sur disque (Technology Skills.txt)
**Script :** `ckg/ingestors/onet_tech_ingestor.py`
**RÃ©sultat attendu :** ~42 000 relations REQUIRES_SOFTWARE sur 601 mÃ©tiers O*NET

```bash
python ckg/ingestors/onet_tech_ingestor.py
```

---

### A2 â€” Ingestion CNP et Crosswalk NOC -> O*NET [FAIT]

**Pourquoi :** Pour intÃ©grer les mÃ©tiers officiels canadiens dans le graphe et les relier aux compÃ©tences O*NET.
**Scripts :** `etl/ingest_cnp_to_neo4j.py` puis `etl/link_cnp_onet_neo4j.py`
**RÃ©sultat :** 510 nÅ“uds `Occupation` (CNP) ingÃ©rÃ©s. 911 relations `[:EQUIVALENT_TO]` crÃ©Ã©es entre CNP et O*NET existants.

```bash
python etl/ingest_cnp_to_neo4j.py
python etl/link_cnp_onet_neo4j.py
```

---

### A3 â€” Enrichir les noeuds ESCO (titres bilingues) [FAIT]

**Pourquoi :** 1 860 noeuds ESCO dans le graphe Ã©taient des coquilles vides (aucun titre).
**MÃ©thode :** API ESCO via `ckg/ingestors/esco_enricher.py` (Ã©vite les gros CSV).
**RÃ©sultat :** Noeuds ESCO avec title_fr et title_en.

---

### A4 â€” CompÃ©tences Vertes ESCO (Green Skills) [STRATÃ‰GIE CIBLÃ‰E]

**DÃ©cision stratÃ©gique :** Ingestion ciblÃ©e exclusive des **compÃ©tences Ã©cologiques / vertes (Green Skills)** d'ESCO plutÃ´t que les ~13 890 compÃ©tences gÃ©nÃ©riques.
**Pourquoi :**
1. **Ã‰vite l'explosion combinatoire du graphe** : 13 890 compÃ©tences crÃ©eraient plus de 200 000 arÃªtes dans Neo4j sans spÃ©cificitÃ© rÃ©gionale, dÃ©gradant les algorithmes de parcours.
2. **Forte valeur ajoutÃ©e QuÃ©bec & Canada** : AlignÃ© avec les prioritÃ©s de transition Ã©nergÃ©tique, dÃ©carbonation, Ã©cofiscalitÃ© et construction durable au QuÃ©bec.
3. **Filtre officiel ESCO** : Utilisation du marquage officiel `green skills` (transition Ã©cologique) de la Commission EuropÃ©enne.
**Statut :** CadrÃ© â€” PriorisÃ© post-B3.

---

### A5 â€” Offres d'emploi Job Bank (compteurs) [FAIT]

**Pourquoi :** Afficher "X offres actives au QuÃ©bec" sur chaque fiche mÃ©tier.
**Stockage NEO4J :** CrÃ©ation de nÅ“uds sÃ©parÃ©s `(:MarketDemand)` (ou `(:JobPosting)`) reliÃ©s au mÃ©tier `(:Occupation)` via la relation `[:HAS_DEMAND]`. Cela permet de ne pas brouiller les donnÃ©es structurelles CNP/O*NET avec des donnÃ©es temporelles/marchÃ©.
**Script :** `ckg/ingestors/jobbank_api_ingestor_global.py`

```bash
python ckg/ingestors/jobbank_api_ingestor_global.py
```

---

### A6 â€” Risques SST/CNESST dans le graphe [FAIT]

**Stockage NEO4J :** NÅ“uds `(:OccupationalHazard)` (7 catÃ©gories) et relations `[:HAS_RISK {risk_level: 'Ã‰levÃ©'}]` (1 496 relations crÃ©Ã©es).
**Stockage SUPABASE :** Stats dÃ©taillÃ©es par secteur et liens professions (Phase B4).
**Script exÃ©cutÃ© :** `trajektia/etl/cnesst_supabase_ingestor.py`

---

## PHASE B â€” Alimenter Supabase (L'EncyclopÃ©die)

> Principe : Textes, chiffres bruts et statistiques descriptives vont
> DIRECTEMENT dans Supabase â€” sans passer par Neo4j.

### B1 â€” Appliquer les schÃ©mas SQL sur Supabase [PRIORITÃ‰ 1 â€” BLOQUANT]

**Statut :** SchÃ©mas Ã©crits, instance Supabase vide.
**Dans Supabase SQL Editor, dans l'ordre :**

```
1. database/schema.sql    (V1 - occupations, compÃ©tences, RIASEC)
2. database/schema_v2.sql (V2 - OaSIS, hiÃ©rarchie CNP)
3. database/schema_v3.sql (V3 - Formations MEQ, donnÃ©es Relance)
```

---

### B2 â€” ExÃ©cuter Le Siphon (Neo4j -> Supabase) [FAIT]

**PrÃ©requis :** A1 + A2 complÃ©tÃ©s ET B1 appliquÃ©s.
**Script :** `etl/le_siphon.py`
**Ce qu'il transfÃ¨re :**
- occupations (3 361 mÃ©tiers + salaires + descriptions)
- riasec_profiles (profils psychomÃ©triques)
- competencies + occupation_competencies
- tasks + occupation_tasks
- tools + occupation_tools

```bash
python etl/le_siphon.py
```

---

### B3 â€” Formations MEQ + EnquÃªte Relance (directement dans Supabase) [FAIT]

**Tables cibles et rÃ©sultats vÃ©rifiÃ©s en base :**
- `cip_domains` : **25 domaines** CPE/CIP Canada avec statut d'admissibilitÃ© au PTPD (IRCC).
- `educational_institutions` : **539 Ã©tablissements** d'enseignement quÃ©bÃ©cois (UniversitÃ©s, CÃ©geps, CFP).
- `educational_programs` : **220 programmes** officiels (DEP, DEC, BAC, Doctorat) enrichis avec descriptions générales et objectifs du MES.
- `program_competencies` : **Devis ministériels structurés** (Niveaux 1 à 4 : Codes ministériels, énoncés, éléments de compétence et critères de performance).
- `program_institutions` : **390 offres de formation** localisées par établissement / région administrative.
- `occupation_programs` : **964 associations** métiers (CNP) ↔ formations (MEQ) avec voies directes officielles et voies alternatives.

**Scripts exécutés :** `packages/database/schema_v9_program_devis.sql` et `packages/data-pipeline/etl/meq_devis_ingestor.py` [FAIT]
**Sources ouvertes MEQ/MES intégrées :**
- Données ouvertes Données Québec : `relance_fp_2011_2019.csv`, `relance_fp_region_2013_2019.csv`
- Données géospatiales MEQ-MES : `es_universitaire.csv`, `es_collegial.csv`, `pps_public_ecole.csv`
- Devis ministériels MES / Ministère de l'Enseignement supérieur du Québec.

```bash
python packages/data-pipeline/etl/meq_devis_ingestor.py
```

### B4 â€” DonnÃ©es SST/CNESST (directement dans Supabase) [FAIT]

**Tables cibles et rÃ©sultats vÃ©rifiÃ©s en base :**
- `occupational_hazards` : **7 catÃ©gories majeures de risques** (TMS, SurditÃ©, Chutes, Machines, Psychosocial, Efforts excessifs, Substances).
- `cnesst_sector_stats` : **20 secteurs d'activitÃ© SCIAN** consolidÃ©s pour le QuÃ©bec (taux TMS, bruit, machines, stress, siÃ¨ges de lÃ©sions et genres d'accidents).
- `occupation_hazards` : **3 698 liaisons** reliant les mÃ©tiers CNP Ã  leurs facteurs de risque et prÃ©valences.
- Neo4j : **1 496 relations `[:HAS_RISK]`** crÃ©Ã©es pour les mÃ©tiers Ã  forte pÃ©nibilitÃ©.

**Source officielle :** CNESST via DonnÃ©es QuÃ©bec (`lesions-professionnelles` - 114 345 lÃ©sions de 2023)
**Script exÃ©cutÃ© :** `trajektia/etl/cnesst_supabase_ingestor.py`

```bash
python trajektia/etl/cnesst_supabase_ingestor.py
```

### B5 â€” Exigences Physiques & DPC (DonnÃ©es, Personnes, Choses) [FAIT]

**Pourquoi :** Indispensable pour les **Conseillers d'orientation (c.o.)**, **conseillers en rÃ©adaptation** et professionnels de la **CNESST/CSST** Ã©valuant l'aptitude Ã  l'emploi et les limitations fonctionnelles (port de charge, stations assis/debout, motricitÃ©, acuitÃ© visuelle/auditive).
**Sources officielles :** 
- EDSC Guide sur les carriÃ¨res 2016 (`guidesurlescarrieres-2016_fr_activitesphysiques.csv` et `guidesurlescarrieres-2016_fr_donneespersonneschoses.csv`)
- Concordance officielle Statistique Canada CNP 2016 v1.3 $\leftrightarrow$ CNP 2021 v1.0 (`statcan_noc_2016_2021_concordance.csv`)
**Tables cibles et rÃ©sultats vÃ©rifiÃ©s en base :**
- `occupation_physical_demands` : **504 mÃ©tiers** dotÃ©s de leurs profils ergonomiques complets (Force `S-1` Ã  `S-4`, Poids max kg, Posture `B-1` Ã  `B-4`, Coordination `L-0` Ã  `L-2`, Vue `V-1` Ã  `V-3`, Couleurs `C-0` Ã  `C-2`, OuÃ¯e `H-1` Ã  `H-3`, DPC DonnÃ©es, DPC Personnes, DPC Choses, RÃ©sumÃ© DPC et Axes de Prediger).
- Neo4j : **886 nÅ“uds `(:Occupation)`** enrichis de propriÃ©tÃ©s directes (`strength_code`, `max_weight_kg`, `body_position`, `dpc_summary`, `prediger_tp`).
**Script exÃ©cutÃ© :** `trajektia/etl/physical_demands_dpc_ingestor.py`

```bash
python trajektia/etl/physical_demands_dpc_ingestor.py
```

### B6 â€” Titres Alternatifs & Synonymes Bilingues de CompÃ©tences [TCC 2025] [FAIT]

**Pourquoi :** AmÃ©liorer la recherche sÃ©mantique et la dÃ©couverte de compÃ©tences dans le moteur d'orientation.
**Source officielle :** Taxonomie des compÃ©tences et capacitÃ©s (TCC 2025 v1.0 - EDSC / Ouvert Canada).
**Table cible Supabase :** `competency_synonyms` (1 028 synonymes ingÃ©rÃ©s avec gestion d'idempotence et batching).
**Script exÃ©cutÃ© :** `scripts/ingest_tcc_synonyms.py` [FAIT]

### B7 â€” Profils Ergonomiques BLS ORS (Haute PrÃ©cision RÃ©adaptation) [PLANIFIÃ‰]

**Pourquoi :** Fournir les pourcentages horaires prÃ©cis (temps assis, temps debout, frÃ©quence de levage) calibrÃ©s sur l'Occupational Requirements Survey (ORS) du Bureau of Labor Statistics (BLS) pour les bilans de rÃ©adaptation avancÃ©s.
**Liaison :** Via `noc_onet_crosswalk` $\rightarrow$ code SOC US.

---

## PHASE D â€” Moteur PsychomÃ©trique DPC & ModÃ¨le de Prediger (Pour Conseillers d'Orientation)

> **Objectif :** Transformer les cotations brutes DPC (DonnÃ©es, Personnes, Choses) et les profils RIASEC en un moteur d'orientation et de rÃ©orientation scientifique fondÃ© sur le modÃ¨le bi-axial de Dale J. Prediger (1982).

### D1 â€” Taxonomie, Verbes d'Action & Niveaux de ComplexitÃ© DPC [FAIT]
- **Objectif :** Formaliser la table de correspondance sÃ©mantique des 25 Ã©chelons DPC officiels du Guide des carriÃ¨res.
  - **DonnÃ©es (0 Ã  6)** : 0=SynthÃ©tiser, 1=Coordonner, 2=Analyser, 3=Compiler, 4=Calculer, 5=Copier, 6=Comparer.
  - **Personnes (0 Ã  8)** : 0=Conseiller/Mentorat, 1=NÃ©gocier, 2=Instruire, 3=Superviser, 4=Divertir, 5=Persuader, 6=Signaler/Ã‰changer, 7=Servir/Aider, 8=Recevoir des consignes / Non significatif.
  - **Choses (0 Ã  8)** : 0=RÃ©gler/Mise au point, 1=Travail de prÃ©cision, 2=Faire fonctionner/ContrÃ´ler, 3=Conduire/ManÅ“uvrer, 4=Manipuler/Actionner, 5=Assurer le fonctionnement/Alimenter, 6=Arranger/Surveiller, 7=Manier, 8=Non significatif.
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] CrÃ©er la table de rÃ©fÃ©rence `ref_dpc_taxonomy` et la vue `v_occupation_dpc_detailed` dans Supabase via `database/schema_v7_dpc_taxonomy.sql`. [FAIT]
  - [x] Renseigner les 25 dÃ©finitions opÃ©ratoires cliniques bilingues, complexitÃ©s (1 Ã  5), exemples concrets et pÃ´les de Prediger. [FAIT]
  - [x] DÃ©velopper le service d'explicabilitÃ© et de filtrage dynamique `trajektia/analytics/dpc_service.py` (`explain_occupation_dpc` et `filter_occupations_by_dpc`). [FAIT]

### D2 â€” Moteur Bi-Axial de Prediger (Pont PsychomÃ©trique DPC <-> RIASEC) [FAIT]
- **Objectif :** Ã‰tablir le lien direct entre les intÃ©rÃªts professionnels auto-dÃ©clarÃ©s (RIASEC) et les exigences comportementales objectives du poste (DPC).
- **Formules mathÃ©matiques appliquÃ©es :**
  - Axe Choses/Personnes (T/P) : T/P = 2R + I - A - 2S - E + C
  - Axe DonnÃ©es/IdÃ©es (D/I) : D/I = 1.732 * (C + E - I - A)
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] DÃ©velopper le script de validation et rÃ©conciliation `trajektia/analytics/prediger_riasec_calibrator.py`. [FAIT]
  - [x] Calculer l'**Indice de CohÃ©rence PsychomÃ©trique (ICP)** mesurant la concordance entre l'hexagone RIASEC (OaSIS/O*NET) et la cotation empirique DPC (distance euclidienne sur le plan cartÃ©sien de Prediger). [FAIT]
  - [x] Identifier et documenter les "mÃ©tiers hybrides ou en tension psychomÃ©trique" (99.7% identifiÃ©s avec divergence empirique vs intÃ©rÃªts dÃ©clarÃ©s, rÃ©vÃ©lant la richesse clinique du modÃ¨le pour les conseillers d'orientation). [FAIT]

### D3 â€” Moteur de Recommandation & Aide Ã  la DÃ©cision pour c.o. [FAIT â€” 2026-09-22]
- **Objectif :** Fournir aux conseillers d'orientation (c.o.) un outil de recommandation multidimensionnel basÃ© sur la projection cartÃ©sienne de Prediger.
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] CrÃ©er l'algorithme de recommandation par projection cartÃ©sienne de Prediger dans `trajektia/analytics/prediger_recommender.py` (calcul de proximitÃ© euclidienne bi-axiale T/P et D/I avec les groupes CNP). [FAIT]
  - [x] GÃ©nÃ©rer des explications cliniques diffÃ©renciÃ©es pour les conseillers d'orientation (concordance vs Ã©carts sur les pÃ´les Choses/Personnes et DonnÃ©es/IdÃ©es). [FAIT]
  - [ ] IntÃ©grer les passerelles de bifurcations vers des professions voisines sur le plan de Prediger nÃ©cessitant moins de formation complÃ©mentaire.

### D4 â€” Module de Test PsychomÃ©trique Interactif (Big Five IPIP-50 + RIASEC Mini-IP) [FAIT]
- **Objectif :** Permettre l'auto-Ã©valuation scientifiquement validÃ©e des candidats et bÃ©nÃ©ficiaires directement depuis l'interface web, avec calcul instantanÃ© des scores et appariement professionnel.
- **Note d'alignement mÃ©thodologique & cadre lÃ©gal :** Ce module interactif grand public s'appuie sur la banque ouverte **IPIP-50** (Goldberg 1992, domaine public) et le **Mini-IP** (Rounds et al. 2010, domaine public) garantissant une passation libre de droits et sans restriction de licence commerciale (contrairement au BFI-2 restreint pour usage commercial par le Berkeley Personality Lab). Les profils mÃ©tiers s'articulent avec les **21 Work Styles d'O\*NET** validÃ©s empiriquement par les travaux rÃ©cents de KÃ¤tlin Anni et al. (*Journal of Applied Psychology*, 2024/2025, $N > 68\,000$) et Juchem et al. (*EJOP*, 2026), permettant une investigation clinique granulaire dans l'Espace Conseiller.
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] IntÃ©grer la banque de 110 items psychomÃ©triques standardisÃ©s dans `frontend-web/src/data/questions-psychometriques.ts` :
    - 50 items IPIP-50 (Goldberg 1992) pour les 5 facteurs OCEAN (Ouverture, ConscienciositÃ©, Extraversion, AgrÃ©abilitÃ©, NÃ©vrosisme) avec clÃ©s d'inversion.
    - 60 items O*NET Mini-IP (Rounds et al. 2010) pour les 6 intÃ©rÃªts RIASEC de Holland.
  - [x] Concevoir le moteur de scoring et d'appariement `frontend-web/src/utils/scoring-engine.ts` :
    - Gestion des items inversÃ©s ($S_i = 6 - x_i$).
    - Normalisation des scores bruts sur une Ã©chelle standardisÃ©e 0-100.
    - Algorithme d'appariement par similaritÃ© cosinus dans un espace vectoriel Ã  11 dimensions ($\vec{u} \in \mathbb{R}^{11} \leftrightarrow \vec{m} \in \mathbb{R}^{11}$).
    - DÃ©termination du code RIASEC dominant (2 Ã  3 lettres) et des traits de personnalitÃ© prÃ©dominants.
    - Top 10 des mÃ©tiers quÃ©bÃ©cois recommandÃ©s avec score d'affinitÃ© (%) et lien vers les fiches CNP.
    - Sauvegarde locale cÃ´tÃ© client dans le navigateur (clÃ© `localStorage` `trajektia_psychometric_results_v1`) sans transmission serveur par dÃ©faut, avec mÃ©canismes d'effacement et de consentement prÃ©vus conformÃ©ment Ã  la Loi 25.

### D5 â€” Algorithme de Cosinus CentrÃ© (Pearson r) & MÃ©tiers RÃ©els [FAIT]
- **Objectif :** Ã‰liminer le biais de translation oÃ¹ les profils factices plats obtiennent 99% et ne recommander que de vrais mÃ©tiers CNP quÃ©bÃ©cois.
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] Remplacer le cosinus brut par le **cosinus centrÃ©** ($r$ de Pearson) dans `scoring-engine.ts` :
    - Ã‰radication mathÃ©matique du biais des profils "plats" Ã  50 (variance nulle $\sigma_m = 0 \implies \text{score} = 0$).
    - Translation calibrÃ©e du coefficient $r \in [-1, 1]$ vers l'Ã©chelle grand public : $\text{score} = 0$ si $\sigma_m = 0$, sinon $\text{score} = \text{round}(\min(99, \max(10, 50 + r \cdot 48)))$.
  - [x] Remplacement des profils d'exemple par **301 mÃ©tiers quÃ©bÃ©cois rÃ©els** dans `frontend-web/src/data/metiers.ts` via le pipeline `scripts/generate_career_content.py` :
    - Profils RIASEC rÃ©els extraits d'O*NET 28.2 (normalisÃ©s sur Ã©chelle 1-7).
    - Traits Big Five rÃ©els calculÃ©s via le crosswalk officiel NOC2021-ONET26.
    - Salaires rÃ©els ESDC 2025 (bas, mÃ©dian, haut), niveaux FEER et libellÃ©s officiels en franÃ§ais.
  - [x] SÃ©curisation de la complÃ©tion Ã  110/110 questions dans `PsychometricTest.tsx` (ajout de l'Ã©tat `isProcessing` pour Ã©liminer le blocage sur l'item final).
  - [x] SÃ©curisation du build Astro SSG (`npm run build`) : typage TypeScript rendu rÃ©silient face aux champs optionnels (`relance_quebec`, etc.) et neutralisation des accÃ¨s non gardÃ©s.

### D6 â€” Moteur de Commentaires Explicatifs Cliniques & MÃ©tiers Miroirs [FAIT]
- **Objectif :** Fournir des explications personnalisÃ©es, positives et bienveillantes pour chaque recommandation, et exposer les mÃ©tiers Ã  l'opposÃ© selon les rÃ¨gles de l'OCCOQ.
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] **GÃ©nÃ©rateur de narratifs cliniques personnalisÃ©s** dans `scoring-engine.ts` (`generateMatchExplanation`) :
    - Identification dynamique des convergences dominantes (traits RIASEC et OCEAN partagÃ©s).
    - Commentaires positifs valorisant les forces spontanÃ©es de l'utilisateur pour le Top 10.
  - [x] **Section Miroir Â« MÃ©tiers demandant un effort d'adaptation particulier Â»** (Bottom 5, $r < 0$) :
    - Respect strict de la dÃ©ontologie clinique (OCCOQ) : bannissement de tout vocabulaire disqualifiant (*Â« mÃ©tiers dÃ©conseillÃ©s Â»*, *Â« impossibles Â»*).
    - Explications axÃ©es sur le coÃ»t Ã©nergÃ©tique, la dissonance avec les penchants naturels et les stratÃ©gies d'adaptation requises.
  - [x] **IntÃ©gration UI dans `PsychometricTest.tsx`** :
    - Section accordÃ©on rÃ©tractable stylisÃ©e avec badge ambre/violet.
    - Cartes miroirs prÃ©sentant les Ã©carts dimensionnels majeurs et le narratif d'adaptation.

### D7 â€” Module Optionnel de Satisfaction & Valeurs de Travail (TWA) [FAIT]
- **Objectif :** Mesurer les leviers d'Ã©panouissement durable au travail (Theory of Work Adjustment de Dawis & Lofquist), en complÃ©ment de l'inventaire des intÃ©rÃªts (RIASEC).
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] IntÃ©grer les 21 Ã©noncÃ©s de l'O*NET Work Importance Locator (WIL) dans `frontend-web/src/data/questions-satisfaction.ts`.
  - [x] Relier aux profils de valeurs de travail des 301 mÃ©tiers quÃ©bÃ©cois via la table CKG `Work Values.txt` (6 valeurs : Accomplissement, IndÃ©pendance, Reconnaissance, Relations, Soutien, Conditions de travail).
  - [x] Concevoir le scoring de congruence des besoins-renforÃ§ateurs (*Needs-Reinforcer Fit*).
  - [x] Proposer ce test comme Ã‰tape 2 facultative d'approfondissement dans `/outils` et sur la page de rÃ©sultats psychomÃ©triques.

### D8 â€” ModÃ©lisation Non-LinÃ©aire de l'AdÃ©quation (TAT & PR-RSM) [AssignÃ© Ã  : Antigravity / CCR â€” 2026-09-21]
- **Objectif :** OpÃ©rationnaliser la **ThÃ©orie d'Activation des Traits (TAT)** de Tett & Burnett (2003) pour modÃ©liser les **opportunitÃ©s d'Ã©panouissement** et les **tensions comportementales**. DÃ©passer les limites des scores de diffÃ©rence absolue $|X - Y|$ en intÃ©grant la rÃ©gression polynomiale quadratique (PR-RSM) pour diagnostiquer finement l'adÃ©quation Personne-Poste (IPIP-50 vs O*NET 30.1).
- **Formule mathÃ©matique :**
  $$Z = \beta_0 + \beta_1 X + \beta_2 Y + \beta_3 X^2 + \beta_4 XY + \beta_5 Y^2 + e$$
  - *Ligne de Congruence (LOC, $X = Y$)* : Pente $a_1 = \beta_1 + \beta_2$, Courbure $a_2 = \beta_3 + \beta_4 + \beta_5$.
  - *Ligne d'Incongruence (LOIC, $X = -Y$)* : Pente $a_3 = \beta_1 - \beta_2$, Courbure $a_4 = \beta_3 - \beta_4 + \beta_5$.
- **DonnÃ©es empiriques intÃ©grÃ©es :**
  - Ã‰tude satisfaction et attentes ($N=428$) : Pente LOC $a_1 = +0{,}59$ ($p < 0{,}001$), Pente LOIC $a_3 = -0{,}48$ ($p < 0{,}001$).
  - Ã‰tude dyadique de Stanford ($n=866$, iSAHIB) : $R^2 = 0{,}079$, courbure LOIC $a_4 = -0{,}009$ ($p < 0{,}001$, forme en U inversÃ©).
- **TÃ¢ches Ã  rÃ©aliser :**
  - [x] Intégrer les fonctions d'évaluation de surface PR-RSM dans `frontend-web/src/utils/satisfaction-engine.ts`. [FAIT par CCR - 2026-09-21]
  - [x] Implémenter le moteur de diagnostic TAT : qualifier les **opportunités d'épanouissement** (exigences alignées) et les **tensions comportementales** (distracteurs/contraintes). [FAIT par CCR - 2026-09-21]
  - [x] Générer des explications cliniques différenciées : distinguer le risque d'ennui/désengagement ($X > Y$) du risque d'épuisement/burnout par tension comportementale ($X < Y$). [FAIT par CCR - 2026-09-21]

### D9 â€” Accord Angulaire (Angular Agreement) & Validation CroisÃ©e RIASEC / Big Five [FAIT par CCR - 2026-09-21]
- **Objectif :** Optimiser l'appariement RIASEC par similaritÃ© angulaire directionnelle et modÃ©liser la cohÃ©rence croisÃ©e Big Five $\leftrightarrow$ RIASEC (Barrick & Mount 2003/2005) dans `scoring-engine.ts`.
- **Formule de l'Accord Angulaire (Wild & MÃ¶hring, 2026) :**
  $$\text{Angular Agreement} = \cos(\theta) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
  - Insensible aux biais d'amplitude globale, validitÃ© de critÃ¨re dÃ©montrÃ©e ($r = .18, p < .05$ vs $r = -.08$ pour la distance euclidienne).
- **Algorithmes Graph Data Science (Neo4j GDS) :**
  - *Node Similarity (Jaccard / Cosine)* : calcul du recouvrement de compÃ©tences pour identifier les mÃ©tiers voisins Ã  moindre distance d'apprentissage.
  - *Algorithme de Louvain* : dÃ©tection des macro-clusters de mÃ©tiers.
  - *K plus courts chemins de Yen* : calcul de parcours de requalification Ã©tape par Ã©tape.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] ComplÃ©ter l'indice d'appariement RIASEC dans `scoring-engine.ts` par le score d'accord angulaire normalisÃ© en pourcentage (0-100%).
  - [ ] IntÃ©grer la matrice mÃ©ta-analytique Big Five $\leftrightarrow$ RIASEC (Barrick & Mount 2003/2005) pour valider la cohÃ©rence croisÃ©e du profil usager.
  - [ ] DÃ©ployer les requÃªtes Cypher GDS pour les passerelles de reconversion dans l'Espace Conseiller.

---

## PHASE E â€” Ã‰valuation Ergonomique, Aptitude au Travail & RÃ©adaptation (CSST / CNESST)

> **Objectif :** Permettre aux conseillers en rÃ©adaptation, ergothÃ©rapeutes et professionnels de la CNESST d'Ã©valuer la compatibilitÃ© entre les limitations fonctionnelles (LFT/LFP) d'un travailleur et les exigences physiques rÃ©elles d'un emploi.

### E1 â€” Moteur d'AdÃ©quation Ergonomique (Job-Person Ergonomic Fit) [FAIT]
- **Objectif :** CrÃ©er l'algorithme d'adÃ©quation candidat-emploi avec filtres mÃ©dicaux stricts et scoring de tolÃ©rance (0 Ã  100%).
- **Dimensions d'analyse et rÃ¨gles de sÃ©curitÃ© :**
  1. **CapacitÃ© de levage et d'effort (Force)** :
     - Seuil maximal admissible par le travailleur : S-1 (<= 5 kg), S-2 (<= 10 kg), S-3 (<= 20 kg), S-4 (> 20 kg).
     - *RÃ¨gle Ã©liminatoire absolue :* Si Force_mÃ©tier > CapacitÃ©_candidat, le mÃ©tier est exclu ou marquÃ© "Contre-indiquÃ©".
  2. **TolÃ©rance posturale & rachidienne** :
     - Stations : B-1 (assis prÃ©dominant), B-2 (debout / marche continue), B-3 (postures contraignantes : flexion, torsion lombaire, accroupissement), B-4 (travail en hauteur / grimper / Ã©chelles).
     - *Filtrage spÃ©cifique rachis :* Exclusion des postures B-3 pour les travailleurs avec limitations lombaires permanentes.
  3. **Aptitudes sensorielles et motrices** :
     - DextÃ©ritÃ© et coordination motrice (L-0, L-1, L-2).
     - Vision binoculaire et de dÃ©tail (V-1, V-2, V-3) et discrimination des couleurs (C-0, C-1, C-2).
     - AcuitÃ© auditive et environnement bruyant (H-1, H-2, H-3).
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] ImplÃ©menter le moteur d'Ã©valuation ergonomique `trajektia/analytics/ergonomics.py` avec la fonction `evaluate_candidate_fit(candidate_profile, cnp_code)`. [FAIT]
  - [x] DÃ©velopper l'algorithme de scoring d'adÃ©quation pondÃ©rÃ© (Fit Score 0-100%). [FAIT]
  - [x] GÃ©nÃ©rer le diagnostic automatisÃ© d'aptitude au travail avec justifications cliniques et prÃ©ventions pour versement au dossier mÃ©dical / professionnel. [FAIT]

### E2 â€” Croisement DonnÃ©es LÃ©sions CNESST & Risque de RÃ©cidive [FAIT]
- **Objectif :** Relier l'analyse ergonomique d'un mÃ©tier avec les statistiques rÃ©elles des lÃ©sions professionnelles CNESST (base 114 345 lÃ©sions).
- **TÃ¢ches rÃ©alisÃ©es :**
  - [x] Calculer un indicateur de vigilance post-lÃ©sion : alerte automatique si un travailleur avec antÃ©cÃ©dent de lÃ©sion spÃ©cifique (ex: TMS Ã©paule/dos) vise un mÃ©tier dans un secteur oÃ¹ ce type de lÃ©sion reprÃ©sente >= 25% des rÃ©clamations (interrogation directe de la table `occupation_hazards` via `prevalence_pct`). [FAIT dans ergonomics.py]
  - [x] IntÃ©grer les mesures prÃ©ventives recommandÃ©es par l'INSPQ et la CNESST pour le groupe professionnel concernÃ©. [FAIT]

### E3 â€” IntÃ©gration des Profils Horaires BLS ORS (Haute PrÃ©cision) [Phase B7]
- **Objectif :** Pour les dossiers d'expertise mÃ©dico-lÃ©gale ou de rÃ©adaptation lourde nÃ©cessitant une ventilation horaire prÃ©cise.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Ingestion du dataset ORS (Occupational Requirements Survey) du Bureau of Labor Statistics US via crosswalk SOC-O*NET-CNP.
  - [ ] Rapprochement des pourcentages horaires : % moyen assis, % debout, frÃ©quence des mouvements rÃ©pÃ©titifs, poussÃ©e/traction en kg.

---

## PHASE F â€” Exposition Vitrine, Fiches MÃ©tiers & Outils MÃ©tiers (Astro / Directus)

> **Objectif :** Restituer ces dimensions de maniÃ¨re lisible, percutante et adaptÃ©e Ã  chaque public (Grand public, Candidats en reconversion, Conseillers d'orientation, Professionnels de la rÃ©adaptation).

### F1 â€” Mise Ã  Jour du Pipeline de Synchronisation (`le_siphon.py`) [FAIT]
- [x] Mettre Ã  jour `etl/le_siphon.py` pour synchroniser la table `occupation_physical_demands` et les champs ergonomiques / DPC / Prediger vers Supabase / Directus (Phase 8 `extract_and_load_physical_demands`). [FAIT]
- [x] Securiser le pipeline contre l'Ã©crasement par NULL via des clauses `COALESCE` SQL lors des UPSERT sur conflit. [FAIT]

### F2 â€” Conception UI des Blocs Fiches MÃ©tiers (Astro) `[FAIT]`
- [x] **Bloc Ergonomie & SantÃ© au travail** :
  - *Affichage Grand Public :* Badges synthÃ©tiques et iconographie claire (ex: "Travail sÃ©dentaire", "Charges lÃ©gÃ¨res <= 5 kg", "DextÃ©ritÃ© fine requise").
  - *Mode Pro / RÃ©adaptation (Toggle) :* Matrice ergonomique complÃ¨te (cotes S, B, L, V, C, H), charge maximale en kg, facteurs de risques sectoriels CNESST et alertes TMS.
- [x] **Bloc Profil Psychométrique & Triade DPC** :
  - Graphique cartésien interactif du Modèle de Prediger (Axes Données/Idées et Choses/Personnes) avec point de positionnement du métier.
  - Jauge tripartite interactive DPC (Données, Personnes, Choses) avec explicitation du verbe d'action de référence.
  - Radar RIASEC enrichi (6 dimensions).
  - *Finesse des Facettes (Mode Conseiller) :* Dépliage des 21 descripteurs comportementaux O*NET (*Work Styles*), découplage managérial vs relationnel et pensée logique vs créativité, indicateurs de variance intra-trait et filtres de résilience (stress/maîtrise de soi).

### F2.1 — Harmonisation Sémantique DPCI & Déduplication des Work Styles O*NET (Astro & ETL) [FAIT — 2026-09-23]
- **Objectif :** Éliminer les redondances dans les données O*NET et sublimer l'expérience utilisateur des fiches métiers en remplaçant les scores numériques abstraits par des verbes d'action fonctionnels.
- **Tâches réalisées :**
  - [x] **Déduplication ETL (`scripts/generate_career_content.py`)** : Agréger par `style_id` et moyenner les scores des 21 Work Styles (`AVG(score) GROUP BY ws.style_id`) pour éliminer les doublons causés par les correspondances multiples CNP $\leftrightarrow$ US-SOC (résolution validée : max 21 facettes par métier, 0 doublon sur les 395 blocs).
  - [x] **Pôle « Idées » DPCI** : Intégrer formellement le pôle « Idées » calculé à partir de la moyenne des scores RIASEC Investigateur et Artistique $(I+A)/2$ et des cotes EDSC $D \le 1$ (Synthétiser / Coordonner).
  - [x] **Ergonomie Sémantique DPCI (Grand Public)** : Remplacement des chiffres 1 à 5 de la boîte DPC par des verbes d'action concrets (*Concevoir & Modéliser*, *Analyser & Structurer*, *Coordonner & Conseiller*, *Ajuster avec précision*). Cotes chiffrées et coordonnées cartésiennes de Prediger réservées au Mode Pro.
  - [x] **Work Styles Dominants vs. Exhaustivité (Astro)** :
    - *Grand Public :* Affichage des **3 à 4 Work Styles dominants** du métier avec badges d'affinité et définitions courtes d'application terrain.
    - *Mode Pro :* Affichage de la matrice des **21 facettes O*NET 30.1** regroupées sous les 4 macro-dimensions d'ordre supérieur (Orientation Proactive & Croissance, Dimension Interpersonnelle & Sociale, Conscienciosité & Rigueur Opérationnelle, Résilience & Régulation Émotionnelle) pour prévenir l'erreur écologique.

### F2.2 — Vulgarisation Ergonomique, Top 5 O*NET & Découplage Éthique Grand Public [FAIT — 2026-09-23]
- **Objectif :** Réduire la charge mentale, éliminer l'anxiété scolaire liée aux pourcentages et offrir une lisibilité optimale du profil psychométrique pour le grand public tout en préservant la précision pour les professionnels.
- **Tâches réalisées :**
  - [x] **Top 5 des Facettes Dominantes (Norme O\*NET)** : Standardisation sur les 5 facettes à plus forte saillance d'importance relative pour le grand public.
  - [x] **Suppression des pourcentages chiffrés (Grand Public)** : Retrait des notes sur 100 de la vue publique pour prévenir le biais de sélection et la confusion avec une note d'admissibilité scolaire.
  - [x] **Système Iconographique Permanent (21 Facettes O\*NET)** : Intégration d'un dictionnaire d'icônes dédiées et pérennes (ex: 🧩 *Pensée Analytique*, 🔍 *Attention aux Détails*, 💡 *Innovation*, 🔄 *Adaptabilité*, ⚡ *Initiative*, 🤝 *Coopération*).
  - [x] **Suppression des Cotes 1/5 à 5/5 en DPCI (Grand Public)** : Remplacement des scores numériques par des badges d'intensité qualitatifs (*Cœur du métier*, *Complémentaire*, *Ponctuel*) et focus direct sur les verbes d'action. Cotes 1/5 à 5/5 maintenues exclusivement en Mode Pro.
  - [x] **Vulgarisation des Titres & Réduction du Jargon** :
    - *Boussole d'activité* : « 🧭 Votre Boussole d'Activité au Quotidien » au lieu de *Projection Bi-Axiale de Prediger (DPCI)*.
    - *Missions quotidiennes* : « 🛠️ Le Cœur de vos Activités Quotidiennes » au lieu de *Matrice DPCI*.
    - *Aptitudes clés* : « 🌟 Vos 5 Forces au Travail (Styles O\*NET) ».
  - [x] **Découplage Éthique Big Five (OCEAN)** :
    - *Mode Public :* Traduction en « Climat Comportemental & Ambiance de Travail » avec 5 postures bienveillantes (*Curiosité, Rigueur, Collaboration, Entraide, Sérénité*) sans note chiffrée.
    - *Mode Pro :* Conservation des percentiles et scores normés pour les conseillers d'orientation.
  - [x] **Complétion 21 Facettes O\*NET pour Développeur (CNP 21232)** : Ingestion des 21 Work Styles avec IDs officiels 1 à 21 dans `metiers.ts` et `generate_career_content.py` et partitionnement strict sans doublon dans les 4 macro-dimensions.


### F3 â€” Simulateur Interactif d'Aptitude, RÃ©adaptation & Finesse Clinique (Espace Conseiller)
- [ ] Interface dÃ©diÃ©e pour les c.o., professionnels OCCOQ et conseillers en rÃ©adaptation CNESST :
  - Formulaire de saisie des limitations fonctionnelles d'un travailleur (poids max tolÃ©rÃ©, postures contre-indiquÃ©es, vision, audition).
  - Filtrage dynamique instantanÃ© du catalogue des mÃ©tiers de la CNP quÃ©bÃ©coise.
  - **Grille d'investigation psychomÃ©trique granulaire (21 Work Styles O\*NET)** :
    - DÃ©pliage hiÃ©rarchique des sous-facettes comportementales (attention au dÃ©tail, intÃ©gritÃ©, initiative, etc.).
    - Filtre de rÃ©silience post-burnout / rÃ©adaptation : identification de mÃ©tiers Ã  charge Ã©motionnelle et stress modÃ©rÃ©s.
    - Analyse de la variance intra-trait pour valoriser les profils composites.
    - Pontage direct avec les verbes d'action DPC.
  - Module d'exportation de rapport d'Ã©valuation ergonomique, psychomÃ©trique et d'orientation (PDF / Fiche clinique synthÃ©tique).

### F4 â€” Interface Interactive du Test PsychomÃ©trique & Visualisations SVG [FAIT]
- [x] **Composant interactif React** (`frontend-web/src/components/PsychometricTest.tsx`) :
  - Ã‰cran d'accueil prÃ©sentant les objectifs scientifiques (Big Five & RIASEC), durÃ©e estimÃ©e (10-15 min) et garantie de confidentialitÃ©.
  - Interface de passation progressive en 11 sections de 10 questions avec barre de complÃ©tion et compteur de progression.
  - Navigation dynamique prÃ©cÃ©dente/suivante, validation des rÃ©ponses, sauvegarde instantanÃ©e de l'Ã©tat.
  - Ã‰cran de rÃ©sultats complet avec restitution graphique :
    - **Hexagone SVG RIASEC** : modÃ©lisation dynamique des 6 pÃ´les de Holland avec polygones concentriques et axe interactif.
    - **Radar SVG Big Five** : toile d'araignÃ©e Ã  5 dimensions OCEAN avec scores normalisÃ©s.
    - **Top 10 des mÃ©tiers recommandÃ©s** : cartes de mÃ©tiers avec pourcentage d'affinitÃ©, badges de correspondance et liens directs vers `/metiers/{cnp_code}`.
    - Bouton de rÃ©initialisation pour repasser le test Ã  volontÃ©.
- [x] **Page Astro dÃ©diÃ©e** (`frontend-web/src/pages/outils/test-psychometrique.astro`) :
  - Layout propre, balises SEO optimisÃ©es, fil d'Ariane (*Accueil > Outils > Test psychomÃ©trique*).
  - IntÃ©gration du composant React avec hydratation `client:load`.
- [x] **Catalogue des Outils** (`frontend-web/src/data/outils.ts`) :
  - Outil rÃ©fÃ©rencÃ© et marquÃ© "disponible" dans la grille de la page `/outils`.

---

## PHASE G â€” VÃ©rification, Validation Clinique & Audit

### G1 â€” Validation Clinique & DÃ©ontologique avec Conseillers d'Orientation
- [ ] RÃ©vision par des professionnels de l'orientation (c.o.) et de l'ergonomie pour valider les libellÃ©s et les rÃ¨gles d'interprÃ©tation.
- [ ] VÃ©rification de conformitÃ© avec les directives de l'Ordre des conseillers et conseillÃ¨res d'orientation du QuÃ©bec (OCCOQ).

### G2 â€” Audit technique & IntÃ©gritÃ© du Graphe
```bash
# VÃ©rification globale des tables et liaisons
python ckg/audit/verify_ckg_data.py
python ckg/audit/verify_phase9.py
python scratch/verify_physical_db.py
```

### G3 â€” Moteur de Preuve Scientifique Souverain & Audit Bibliographique Local [FAIT / OPÃ‰RATIONNEL â€” 2026-09-19]
> **Objectif :** Remplacer les APIs propriÃ©taires et payantes (Consensus, Scite) par une chaÃ®ne de vÃ©rification souveraine locale (Zero-Hallucination Evidence Engine), garantissant une conformitÃ© stricte avec la Loi 25 du QuÃ©bec et les standards dÃ©ontologiques de l'OCCOQ.

- **Architecture 4-Tiers intÃ©grÃ©e :**
  1. *Niveau 1 (Topologie & Domaine)* : Neo4j (`(:Occupation)`, `(:Competency)`, `[:REQUIRES_STYLE]`, `[:HAS_RISK]`).
  2. *Niveau 2 (DonnÃ©es Relationnelles & Vecteurs)* : Supabase (PostgreSQL, `pgvector`, table `scientific_evidence` Ã  12 piliers empiriques).
  3. *Niveau 3 (Code Intelligence & TraÃ§abilitÃ©)* : GitNexus (PDG, call graph reliant les formules mathÃ©matiques PR-RSM / Accord Angulaire au code source).
  4. *Niveau 4 (Preuves Documentaires DÃ©terministes)* : Zotero (coffre SQLite/PDFs local) + `zotero-mcp` + `PaperQA2` (citations exactes Ã  la page/paragraphe).
- **TÃ¢ches rÃ©alisÃ©es & feuille de route :**
  - [x] **DÃ©velopper le script de vÃ©rification d'Ã©vidence** `scripts/verify_evidence_paperqa.py` adossÃ© Ã  l'infÃ©rence locale Ollama (`qwen3:8b`) et aux embeddings 1024D (`bge-m3`), 100 % local, zÃ©ro hallucination. [FAIT]
  - [x] **Auditer les 12 assertions empiriques** de `scientific_evidence` contre les documents sources de `ckg/references/` et gÃ©nÃ©rer le rapport formel `ckg/audit/rapport_audit_preuves_paperqa.md`. [FAIT]
  - [x] **DÃ©poser dans `ckg/references/` les monographies et synthÃ¨ses sources complÃ¨tes** (articles CNESST TMS lombaires, dÃ©monstrations POMP, mÃ©ta-analyses Barrick & Mount, Wild & MÃ¶hring 2026, Edwards 2002) et convertir **100 % des statuts en âœ… VÃ‰RIFIÃ‰ (12/12)** avec citations verbatim. [FAIT - 2026-09-19]
  - [x] **Scanner de documentation & Injection automatisÃ©e de citations** `scripts/scan_and_cite_documentation.py` : Analyse regex/AST des 5 documents majeurs de `ckg/`, dÃ©tection des formules/concepts, injection automatique de bibliographies auditÃ©es dÃ©terministes. [FAIT - 2026-09-20]
  - [x] **G5 â€” Workflow d'Acquisition & Screening AutomatisÃ© de Preuves Manquantes (Pipeline Hybride)** : RequÃªtage automatique de l'API OpenAlex (REST CC0), extraction de mots-clÃ©s bilingues par LLM local (`deepseek-r1:8b`), screening des abstracts et Ã©valuation Ã©pistÃ©mique ARA Seal Level 2 (Skill `ara-rigor-reviewer`) pour rejet sans compromis des faux positifs / hallucinations d'Ã©vidence, gÃ©nÃ©ration automatique des rapports d'audit. (`scripts/g5_hybrid_evidence_pipeline.py`). [FAIT - 2026-09-20]
  - [ ] **G6 â€” Ingestion de MÃ©thodologies & Guides SpÃ©cialisÃ©s via Skill_Seekers** : Conversion automatisÃ©e des monographies d'ergonomie et guides de pratique (CNESST, IRSST, EDSC, OCCOQ) en Skills d'agents autonomes structurÃ©s avec CLI `skill-seekers`. [Ã€ FAIRE]
  - [ ] Installer et configurer `zotero-mcp` dans `mcp_config.json` connectÃ© Ã  la bibliothÃ¨que Zotero locale.
  - [ ] Connecter OpenAlex (API gratuite / OpenAlex MCP) pour actualiser le graphe mondial de citations et mÃ©tadonnÃ©es bibliographiques ouvertes.

---


## PHASE H â€” StratÃ©gie Emploi, Babillard Hybride & ModÃ¨le Ã‰conomique Recruteurs

> **Objectif :** RÃ©soudre le problÃ¨me du dÃ©marrage Ã  froid (*cold-start*) par l'agrÃ©gation initiale, capturer des leads qualifiÃ©s et dÃ©ployer un babillard d'offres propriÃ©taire monÃ©tisable B2B.

### H1 â€” Ã‰tape 1 : L'AgrÃ©gation Multi-Sources & Live MarchÃ© (Acquisition & SEO)
- [x] AgrÃ©ger les offres d'emploi rÃ©elles du QuÃ©bec pour alimenter les fiches mÃ©tiers dÃ¨s le lancement. [FAIT]
  - [x] **Job Bank / Guichet-Emplois (Open Canada)** : PRIORITÃ‰ 1 (Tier 1). Ingestion de l'archive officielle de 88 mois en Open Data CKAN (`job-bank-open-data-all-job-postings-fr-*.csv` avec codes CNP 2021) et/ou API. Garantit une liaison CNP native parfaite pour nos calculs vectoriels.
  - [ ] **Adzuna API Canada** : ClÃ©s configurÃ©es dans `.env`. UtilisÃ© comme complÃ©ment pour densifier la couverture privÃ©e.
  - [ ] **Jooble API & Talent.com** : Connexion aux flux partenaires complÃ©mentaires pour densifier la couverture rÃ©gionale des PME quÃ©bÃ©coises.
  - [ ] **Endpoints ATS Directs** : Indexation des carriÃ¨res des grandes entreprises quÃ©bÃ©coises (Greenhouse, Lever, SmartRecruiters).
- [x] Calculer l'**Indice Salarial Trajektia Liveâ„¢** : mÃ©diane mobile rÃ©elle et Ã©cart % vs StatCan. [FAIT]
- [x] DÃ©ployer le module de **Lead Capture (Abonnement courriel)** sur les fiches mÃ©tiers pour constituer la base d'abonnÃ©s qualifiÃ©s. [FAIT]
- [ ] Connecter le formulaire d'inscription courriel Ã  une table Supabase `leads_newsletter` ou service d'automatisation (Resend / Loops).

### H2 â€” Ã‰tape 2 : Le Babillard PropriÃ©taire Â« Trajektia Recrutement Â» (MonÃ©tisation B2B)
- [ ] **Espace Recruteurs Partenaires** :
  - Formulaire de dÃ©pÃ´t d'offres direct par les employeurs du QuÃ©bec.
  - Enrichissement automatique de l'annonce par le CKG : tag RIASEC de l'offre et niveau d'effort physique DPC.
  - **Ciblage ultra-prÃ©cis par filiÃ¨re** : l'offre s'affiche directement sur la page du DEC ou DEP quÃ©bÃ©cois correspondant pour cibler les futurs finissants.
- [ ] **ModÃ¨le Freemium d'AmorÃ§age Partenaires** :
  - GratuitÃ© offerte aux 30 Ã  50 premiÃ¨res entreprises pionniÃ¨res quÃ©bÃ©coises pour densifier le rÃ©seau exclusif.
- [ ] **MonÃ©tisation Directe & Revenus RÃ©currents** :
  - Vente d'annonces vedettes sponsorisÃ©es (250 $ - 450 $ / annonce avec badge or Â« Recruteur Partenaire Trajektia Â»).
  - Forfaits d'abonnements mensuels / annuels pour PME et grands employeurs quÃ©bÃ©cois.
  - AccÃ¨s aux statistiques de consultation et mÃ©triques d'intÃ©rÃªt des diplÃ´mÃ©s.

### H3 â€” Ã‰tape 3 : Observatoire Temporel & SÃ©ries Temporelles (Time-Series & Courbes de Tendances)
- [x] DÃ©finir le schÃ©ma SQL des sÃ©ries temporelles : [`database/schema_v8_market_snapshots.sql`](database/schema_v8_market_snapshots.sql). [FAIT]
  - `trajektia_live_job_postings` : Table de cache avec TTL de 30 jours pour l'affichage UI immÃ©diat.
  - `trajektia_market_snapshots` : InstantanÃ©s mensuels pour archiver salaires rÃ©els, volumes et tensions.
  - `trajektia_skill_demand_history` : Historique de pÃ©nÃ©tration des compÃ©tences Ã©mergentes.
  - `v_trajektia_career_trends_12m` : Vue calculant les pentes de croissance sur 12 mois.
- [x] DÃ©velopper le script Cron d'ingestion mensuelle (`etl/market_snapshot_collector.py`) agrÃ©geant Adzuna et Guichet-Emplois. [FAIT]
- [x] Intégrer les graphiques de tendances (courbe salariale 12 mois et momentum de recrutement) sur les fiches métiers Astro. [FAIT — 2026-09-23]
  - Ingestion de 14 mois d'archives Guichet-Emplois CKAN (730 555 offres réelles analysées, 6 798 snapshots dans `trajektia_market_snapshots`).
  - Vue dérivée `v_trajektia_career_trends_12m` alimentée et calculant la croissance salariale et de la demande à 12 mois.
  - Composant Astro natif `<TendancesSalariales>` avec graphique SVG interactif (courbe, dégradé, barres de volume, badges de momentum).

### H4 â€” Ã‰tape 4 : Branding & PropriÃ©tÃ© Intellectuelle des MÃ©triques Trajektiaâ„¢
- [x] Consigner au [Manuel MÃ©thodologique CKG](ckg/MANUEL_METHODOLOGIQUE_CKG.md) la nomenclature officielle :
  - **Indice Salarial Trajektia Liveâ„¢** *(Trajektia RealWage)*
  - **Indice de VolatilitÃ© Salariale Trajektiaâ„¢**
  - **Radar CompÃ©tences Trajektiaâ„¢** & **Taux de PÃ©nÃ©tration MarchÃ© Trajektiaâ„¢**
  - **CompÃ©tences Ã‰mergentes Trajektiaâ„¢**
  - **Indice de Tension MarchÃ© Trajektiaâ„¢**
  - **Score d'AffinitÃ© Trajektiaâ„¢**
  - **Profil DPC Trajektiaâ„¢**
- [ ] Afficher les badges de propriÃ©tÃ© intellectuelle et les infobulles mÃ©thodologiques sur le frontend Astro.

---

## PHASE I â€” Data Science Vectorielle & Intelligence SÃ©mantique (5 Moteurs IA)

> **Objectif :** Transformer les taxonomies textuelles et le flux d'offres d'emploi en vecteurs sÃ©mantiques continus (Embeddings 1024D) pour dÃ©bloquer des capacitÃ©s de recherche cognitive et d'appariement multidimensionnel.

### I1 â€” Socle d'Embedding & SchÃ©ma Vectoriel Supabase (pgvector)
- **Objectif :** DÃ©ployer l'infrastructure HNSW sur Supabase pour la similaritÃ© cosinus.
- **ModÃ¨le SÃ©lectionnÃ© :** `BAAI/bge-m3` (Souverain/Local, 1024D, 8192 tokens) avec `Cohere Embed Multilingual` (API Cloud Canada) en solution de repli gÃ©rÃ©e.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Ajouter les colonnes `vector(1024)` aux tables `occupations` et `trajektia_live_job_postings`.
  - [ ] CrÃ©er les index HNSW (distance cosinus).
  - [ ] Script d'infÃ©rence batch `generate_ckg_embeddings.py`.

### I2 â€” Moteur de DÃ©rive SÃ©mantique (Indice de Mutation Trajektiaâ„¢)
- **Objectif :** Comparer le vecteur canonique CNP 2021 d'un mÃ©tier avec le centroÃ¯de vectoriel des offres Job Bank rÃ©centes pour dÃ©tecter les obsolescences.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Script analytique `market_semantic_drift.py`.
  - [ ] Mise en place de seuils d'alerte ($\text{IDS} \ge 0.35$).

### I3 â€” Moteur de TransfÃ©rabilitÃ© & Jumeaux SÃ©mantiques
- **Objectif :** Identifier des carriÃ¨res alternatives pertinentes pour les travailleurs accidentÃ©s (CNESST) en franchissant les frontiÃ¨res sectorielles (ex. mÃ©canicien aÃ©ronef $\to$ technicien Ã©olienne).
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Matrice globale de SimilaritÃ© SÃ©mantique de CompÃ©tences (SSC).
  - [ ] Interface conseiller "Explorer les jumeaux sÃ©mantiques".

### I4 â€” DÃ©tecteur d'Inflation de Titres (Title Inflation)
- **Objectif :** DÃ©bruiter le marchÃ© du travail en rÃ©-assignant les offres aux titres pompeux Ã  leurs vÃ©ritables catÃ©gories CNP via la similaritÃ© des descriptions.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Filtre k-NN dans le pipeline ETL `le_siphon.py` pour valider la catÃ©gorie CNP des annonces Adzuna/Jooble.

### I5 â€” Matching Bidirectionnel CV â†” MarchÃ© CachÃ© (ConformitÃ© Loi 25)
- **Objectif :** Permettre aux candidats d'importer leur CV et de se voir recommander instantanÃ©ment des offres d'emploi basÃ©es sur la proximitÃ© sÃ©mantique de leurs compÃ©tences rÃ©elles.
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Module d'ingestion de CV (extraction texte).
  - [ ] Endpoint d'infÃ©rence en-mÃ©moire garantissant aucune conservation nominative des CV (conformitÃ© Loi 25).

### I6 â€” Moteur de Recherche Vocationnel en Langage Naturel (RAG Hybride)
- **Objectif :** Permettre une recherche grand public sous forme de requÃªtes libres (ex: *"Travailler dehors sans stress avec les mains"*).
- **TÃ¢ches Ã  rÃ©aliser :**
  - [ ] Extraction des entitÃ©s (filtres DPC, FEER, conditions de travail).
  - [ ] Recherche hybride Supabase (Dense vectoriel + Sparse lexical).

### I7 — Ingestion Textuelle Complète des Offres d'Emploi 14M (CKAN) & Vectorisation Graph-RAG
- **Objectif :** Évaluer et implémenter l'ingestion du contenu granulaire (tâches, compétences mentionnées, ville, région administrative, prérequis linguistiques, fourchettes salariales réelles) issu des dizaines de milliers d'annonces du flux 14 mois Guichet-Emplois / Job Bank CKAN.
- **Bénéfices CKG & RAG :**
  - Alimenter Neo4j avec des nœuds `:JobPosting` et relations vers `:Occupation` et `:Skill`.
  - Calculer des embeddings vectoriels denses (BGE-M3 / OpenAI text-embedding-3) sur les descriptions textuelles réelles du marché du travail québécois.
  - Déduire empiriquement la proximité sémantique réelle entre métiers pour les passerelles de reconversion, la tension par sous-région et les compétences émergentes.
- **Tâches à réaliser :**
  - [ ] Analyser le schéma brut et la disponibilité des champs textuels (tâches, compétences, descriptions complètes) dans les dumps CSV CKAN mensuels.
  - [ ] Définir la table Supabase `job_postings_historical_corpus` et le modèle Neo4j associé.
  - [ ] Établir un pipeline de vectorisation par lots (chunking, extraction d'entités ESCO/OaSIS, génération d'embeddings).
  - [ ] Tester le calcul de similarité cosinus vectorielle entre offres réelles et fiches métiers CNP pour valider l'impact sur les passerelles de reconversion.

---

## ðŸ—“ï¸� SÃ©quence RecommandÃ©e & Feuille de Route

```
RÃ‰ALISÃ‰ (Fondations, Ingestion, Moteurs & Taxonomie DPC)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
[FAIT] A2  Ingestion des mÃ©tiers CNP 2021 (510 nÅ“uds) et Mapping O*NET (911 arÃªtes EQUIVALENT_TO)
[FAIT] A1  Logiciels O*NET (32 435 liens)
[FAIT] B3  Formations MEQ / La Relance (964 liaisons, 539 Ã©coles, 220 prog.)
[FAIT] B4  SST / CNESST QuÃ©bec (3 698 liens, 20 secteurs, 1 496 arÃªtes Neo4j)
[FAIT] B5  Exigences Physiques & DPC GC 2016 (504 mÃ©tiers, 886 noeuds Neo4j)
[FAIT] A7  Axes de Prediger & IntÃ©gration psychomÃ©trique dans le schÃ©ma V6
[FAIT] D1  Table Taxonomie DPC & 25 verbes bilingues (ref_dpc_taxonomy + dpc_service.py)
[FAIT] D2  Calibration PsychomÃ©trique Prediger-RIASEC (prediger_riasec_calibrator.py)
[FAIT] E1  Moteur d'AdÃ©quation Ergonomique & RÃ©adaptation (ergonomics.py)
[FAIT] E2  Croisement Vigilance Post-LÃ©sion & RÃ©cidive CNESST (ergonomics.py)
[FAIT] A4  CompÃ©tences Vertes ESCO intÃ©grÃ©es aux fiches mÃ©tiers et au CKG
[FAIT] F2  Composants UI Fiches MÃ©tiers Astro (Salaires, Jauges DPC, RIASEC Prediger, Relance, Offres temps rÃ©el)
[FAIT] A5  Module Offres d'emploi actives et alertes marchÃ© intÃ©grÃ©es
[FAIT] D4  Module Test PsychomÃ©trique (110 questions, IPIP-50 + O*NET Mini-IP, Scoring 11D Cosinus)
[FAIT] F4  Interface Test PsychomÃ©trique React/Astro (/outils/test-psychometrique, SVG Hexagone & Radar)
[FAIT] D5  Cosinus CentrÃ© (Pearson r), 301 MÃ©tiers RÃ©els Supabase & Fix ComplÃ©tion 110/110
[FAIT] D6  Commentaires Narratifs Cliniques Positifs & Section Miroir AccordÃ©on OCCOQ
[FAIT] D7  Module de Satisfaction & Valeurs de Travail (TWA / O*NET WIL 21 items)
[FAIT] F5  Infobulles PÃ©dagogiques interactives (<InfoBubble>) & RÃ¨gle POMP < 5% (Fiches [cnp].astro)
[FAIT] G1  Framework Customizations Agent (.agents/rules & .agents/skills) & Orchestration Multi-Agents (dispatch-next-task)
[FAIT] F1  Mise Ã  jour de `le_siphon.py` (Phase 8 Export Ergo/DPC/Prediger/SST vers Directus/Supabase avec COALESCE)
[FAIT] B6  Titres alternatifs & Synonymes TCC 2025 (`scripts/ingest_tcc_synonyms.py`, 1 028 synonymes en base)
[FAIT] A5  Ingestion Job Bank / Guichet-Emplois dans Neo4j (`ckg/ingestors/jobbank_api_ingestor_global.py`, 424 nÅ“uds :MarketDemand, 239 CNPs QC)
[FAIT] B2  Siphon des donnÃ©es MarketDemand vers Supabase (`etl/le_siphon.py` - Phase 9 extract_and_load_market_demand)
[FAIT] H3  Script Cron d'ingestion mensuelle des offres d'emploi (`etl/market_snapshot_collector.py`)
[FAIT] G3  Moteur de Preuve Scientifique Souverain & Audit DÃ©terministe (`scripts/verify_evidence_paperqa.py`)
[FAIT] G3b Audit DÃ©terministe 100% VÃ‰RIFIÃ‰ (12/12) via Ollama qwen3:8b & bge-m3 contre les monographies de `ckg/references/` (rapport `ckg/audit/rapport_audit_preuves_paperqa.md`)
[FAIT] G4  Scanner de Documentation & Injection DÃ©terministe de Citations (`scripts/scan_and_cite_documentation.py`)
[FAIT] D8  Moteur d'Adéquation Personne-Poste (TAT & PR-RSM) implémenté dans le frontend (pr-rsm-engine.ts)
[FAIT] B3b Ingestion des Devis Ministériels MES & Compétences 4 Niveaux (`schema_v9_program_devis.sql`, `meq_devis_ingestor.py`)
[FAIT] P1/P2 Recherche Multicritère Avancée & Dictionnaire Synonymes TCC 2025 (`synonymes_tcc.ts`, `index.astro`)
[FAIT] P3  Interconnexion Formations MEQ / MES, 539 Établissements & Admissibilité PTPD (`[cnp].astro`)
[FAIT] P4  Validation Build Statique SSG (910 pages HTML générées sans erreur dans `dist/` + Sitemap XML)
[FAIT] F2.1 Harmonisation Sémantique DPCI & Déduplication des Work Styles O*NET (Astro & ETL)
[FAIT] H3   Observatoire Temporel & Tendances Salariales 12 Mois Trajektia Live™ (6 798 snapshots, 730k offres, composant SVG interactif `TendancesSalariales.astro`)

[FAIT] T1  Ergonomie SVG & Tooltip Instantané sans jitter (`TendancesSalariales.astro`)
[FAIT] T2  Maillage Cliquable Passerelles de Reconversion (`[cnp].astro` - liens vers `/metiers/[cnp]`)
[FAIT] T3  Contextualisation Métier des 4-6 Work Styles O*NET Dominants (> 75%) pour le Grand Public (`ProfilPsychometrique.astro`)
[FAIT] T4  Déplafonnement Ingestion Adzuna (retrait du LIMIT 5, rate-limit, options CLI) & Fallback Multi-Portails Guichet-Emplois/Jobillico
[FAIT] T5  Calibration Réaliste du Télétravail (FEER & Secteur d'activité, suppression du 0.0%)
[FAIT] T6  Maillage Bidirectionnel CKG Formations ↔ Métiers (964 relations `occupation_programs` -> 510 fiches `metiers.ts` & fiches DEC/DEP)
[FAIT] I7  R&D & Étude de Faisabilité Ingestion Textuelle 14M Offres CKAN & Vectorisation Graph-RAG (`FEASIBILITY_CKAN_VECTORIZATION_I7.md`)

PROCHAINE ÉTAPE PRIORITAIRE — Sprint Ingestion Régionale CKAN & Index Vectoriel Neo4j
────────────────────────────────────────────────────────────────────────
1. [À FAIRE] I7.1 Développement du parseur UTF-16LE multi-mois CKAN pour extraire la granularité ville/région
2. [À FAIRE] I7.2 Pipeline d'embedding textuel (`text-embedding-004`) et stockage HNSW dans Supabase `pgvector`
3. [À FAIRE] I7.3 Indexation vectorielle Neo4j et route API de matching sémantique compétences / profils
```


---

## ðŸš€ Commandes de dÃ©marrage rapide

```bash
# Toujours depuis le dossier trajektia/

# 1. VÃ©rifier la config et les fichiers sources
python ckg/ckg_config.py

# 2. VÃ©rifier les donnÃ©es physiques et DPC en base
python scratch/verify_physical_db.py

# 3. Synchroniser Neo4j -> Supabase (Le Siphon)
python etl/le_siphon.py
```
