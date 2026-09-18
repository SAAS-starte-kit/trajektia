# Plan d'action CKG — Trajektia Career Knowledge Graph
**Rédigé le : 2026-09-12 | Statut : Actif**

---

## 🎯 Objectif

Compléter le Career Knowledge Graph (Neo4j) avec toutes les sources de données manquantes,
puis déclencher `le_siphon.py` pour alimenter Supabase/Directus afin d'exposer les fiches
métiers et formations via la vitrine Astro.

---

## 🏛️ Architecture validée (règle d'or)

| Données | Destination | Justification |
|:---|:---|:---|
| IDs, titres courts, **relations** entre entités | **Neo4j** | Moteur de passerelles et de calcul de parcours |
| Textes descriptifs, stats, salaires détaillés | **Supabase** (via Le Siphon) | Affichage rapide sur les fiches du site web |

---

## 📊 État actuel du graphe (2026-09-12 — vérifié en direct)

| Source | Statut | Relations | Taux |
|:---|:---|---:|---:|
| SIPeC 2025 / OaSIS (compétences CA) | Complet | 35 117 REQUIRES | 100% |
| O*NET Psychométrie (aptitudes, styles, valeurs) | Complet | 109 244 | ~34% métiers couverts |
| O*NET Outils (USES_TOOL) | FAIT | 26 388 | 100% (sur métiers liés) |
| O*NET Logiciels (REQUIRES_SOFTWARE) | FAIT | 32 435 | 100% (sur métiers liés) |
| Salaires ESDC 2025 | Complet | prop. sur noeuds | 100% (3 361 métiers) |
| Ingestion CNP 2021 | FAIT | 510 Noeuds | 100% (taxonomie CNP) |
| Crosswalk NOC vers O*NET | FAIT | 1 370 mappings | 911 arêtes EQUIVALENT_TO créées |
| Crosswalk O*NET vers ESCO | FAIT | 4 253 liens | Mapping complet |
| ESCO Compétences Vertes (Green Skills) | Cadré | Stratégie verte ciblée | Priorisé post-B3 |
| Formations MEQ / Relance | FAIT (Supabase) | 964 liens, 539 étab., 220 prog. | 100% dans Supabase |
| O*NET Knowledge              | FAIT     | 6 566    | On a rajouté les connaissances requises via script. |
| O*NET Work Context           | FAIT     | 21 953   | On a rajouté les contextes de travail (Social/Environnement) |
| O*NET Job Zones              | MANQUANT | 0        | À venir plus tard ou via les données SST/Relance. |
| SST / CNESST (Données Québec) | FAIT | 3 698 liens, 20 secteurs, 7 risques (Supabase) + 1 496 HAS_RISK (Neo4j) | 100% |
| Exigences Physiques (EDSC GC 2016) | FAIT | 504 métiers (Forces S1-S4, Postures B1-B4, Vision, Ouïe) | 100% Supabase + Neo4j |
| DPC Données-Personnes-Choses (GC 2016) | FAIT | 504 métiers (Cotation DPC + Pont RIASEC Prediger) | 100% Supabase + Neo4j |
| Test Psychométrique (Big Five + RIASEC) | FAIT | 110 items (50 IPIP-50 + 60 Mini-IP), scoring 11D, UI Astro/React | 100% |
| Titres alternatifs TCC 2025 (Synonymes) | À FAIRE | Dictionnaire synonymes compétences FR/EN pour recherche | Cadré |
| BLS ORS (Ergonomie US BLS) | Planifié | Profils ergonomiques haute précision (heures assis/debout, lbs) | Cadré post-B5 |
| Job Bank (offres actives) | MANQUANT | 0 | 0% |
| Career Ladders (CMC) | Demo | 19 liens | Demo seulement |

---

## PHASE A — Compléter Neo4j (Le Graphe de Relations)

> Principe : Dans Neo4j, on ingère UNIQUEMENT des noeuds légers (IDs + titres courts)
> et des arêtes relationnelles. PAS de textes descriptifs longs ni de tableaux statistiques.

### A1 — Compétences logicielles O*NET [PRIORITÉ 1 — BLOQUANT]

**Pourquoi :** 0 relation REQUIRES_SOFTWARE actuellement.
**Fichier source :** Présent sur disque (Technology Skills.txt)
**Script :** `ckg/ingestors/onet_tech_ingestor.py`
**Résultat attendu :** ~42 000 relations REQUIRES_SOFTWARE sur 601 métiers O*NET

```bash
python ckg/ingestors/onet_tech_ingestor.py
```

---

### A2 — Ingestion CNP et Crosswalk NOC -> O*NET [FAIT]

**Pourquoi :** Pour intégrer les métiers officiels canadiens dans le graphe et les relier aux compétences O*NET.
**Scripts :** `etl/ingest_cnp_to_neo4j.py` puis `etl/link_cnp_onet_neo4j.py`
**Résultat :** 510 nœuds `Occupation` (CNP) ingérés. 911 relations `[:EQUIVALENT_TO]` créées entre CNP et O*NET existants.

```bash
python etl/ingest_cnp_to_neo4j.py
python etl/link_cnp_onet_neo4j.py
```

---

### A3 — Enrichir les noeuds ESCO (titres bilingues) [FAIT]

**Pourquoi :** 1 860 noeuds ESCO dans le graphe étaient des coquilles vides (aucun titre).
**Méthode :** API ESCO via `ckg/ingestors/esco_enricher.py` (évite les gros CSV).
**Résultat :** Noeuds ESCO avec title_fr et title_en.

---

### A4 — Compétences Vertes ESCO (Green Skills) [STRATÉGIE CIBLÉE]

**Décision stratégique :** Ingestion ciblée exclusive des **compétences écologiques / vertes (Green Skills)** d'ESCO plutôt que les ~13 890 compétences génériques.
**Pourquoi :**
1. **Évite l'explosion combinatoire du graphe** : 13 890 compétences créeraient plus de 200 000 arêtes dans Neo4j sans spécificité régionale, dégradant les algorithmes de parcours.
2. **Forte valeur ajoutée Québec & Canada** : Aligné avec les priorités de transition énergétique, décarbonation, écofiscalité et construction durable au Québec.
3. **Filtre officiel ESCO** : Utilisation du marquage officiel `green skills` (transition écologique) de la Commission Européenne.
**Statut :** Cadré — Priorisé post-B3.

---

### A5 — Offres d'emploi Job Bank (compteurs) [PRIORITÉ 4]

**Pourquoi :** Afficher "X offres actives au Québec" sur chaque fiche métier.
**Stockage :** Propriété active_postings sur le noeud (:Occupation)
**Script :** `ckg/ingestors/jobbank_api_ingestor_global.py`

```bash
python ckg/ingestors/jobbank_api_ingestor_global.py
```

---

### A6 — Risques SST/CNESST dans le graphe [FAIT]

**Stockage NEO4J :** Nœuds `(:OccupationalHazard)` (7 catégories) et relations `[:HAS_RISK {risk_level: 'Élevé'}]` (1 496 relations créées).
**Stockage SUPABASE :** Stats détaillées par secteur et liens professions (Phase B4).
**Script exécuté :** `trajektia/etl/cnesst_supabase_ingestor.py`

---

## PHASE B — Alimenter Supabase (L'Encyclopédie)

> Principe : Textes, chiffres bruts et statistiques descriptives vont
> DIRECTEMENT dans Supabase — sans passer par Neo4j.

### B1 — Appliquer les schémas SQL sur Supabase [PRIORITÉ 1 — BLOQUANT]

**Statut :** Schémas écrits, instance Supabase vide.
**Dans Supabase SQL Editor, dans l'ordre :**

```
1. database/schema.sql    (V1 - occupations, compétences, RIASEC)
2. database/schema_v2.sql (V2 - OaSIS, hiérarchie CNP)
3. database/schema_v3.sql (V3 - Formations MEQ, données Relance)
```

---

### B2 — Exécuter Le Siphon (Neo4j -> Supabase) [PRIORITÉ 2]

**Prérequis :** A1 + A2 complétés ET B1 appliqués.
**Script :** `etl/le_siphon.py`
**Ce qu'il transfère :**
- occupations (3 361 métiers + salaires + descriptions)
- riasec_profiles (profils psychométriques)
- competencies + occupation_competencies
- tasks + occupation_tasks
- tools + occupation_tools

```bash
python etl/le_siphon.py
```

---

### B3 — Formations MEQ + Enquête Relance (directement dans Supabase) [FAIT]

**Tables cibles et résultats vérifiés en base :**
- `cip_domains` : **25 domaines** CPE/CIP Canada avec statut d'admissibilité au PTPD (IRCC).
- `educational_institutions` : **539 établissements** d'enseignement québécois (Universités, Cégeps, CFP).
- `educational_programs` : **220 programmes** officiels (DEP, DEC, BAC, Doctorat) avec salaires réels et taux de placement La Relance.
- `program_institutions` : **390 offres de formation** localisées par établissement / région administrative.
- `occupation_programs` : **964 associations** métiers (CNP) ↔ formations (MEQ) avec voies directes officielles et voies alternatives.

**Script exécuté :** `trajektia/etl/meq_relance_ingestor.py`
**Sources ouvertes MEQ/MES intégrées :**
- Données ouvertes Données Québec : `relance_fp_2011_2019.csv`, `relance_fp_region_2013_2019.csv`
- Données géospatiales MEQ-MES : `es_universitaire.csv`, `es_collegial.csv`, `pps_public_ecole.csv`

```bash
python trajektia/etl/meq_relance_ingestor.py
```

### B4 — Données SST/CNESST (directement dans Supabase) [FAIT]

**Tables cibles et résultats vérifiés en base :**
- `occupational_hazards` : **7 catégories majeures de risques** (TMS, Surdité, Chutes, Machines, Psychosocial, Efforts excessifs, Substances).
- `cnesst_sector_stats` : **20 secteurs d'activité SCIAN** consolidés pour le Québec (taux TMS, bruit, machines, stress, sièges de lésions et genres d'accidents).
- `occupation_hazards` : **3 698 liaisons** reliant les métiers CNP à leurs facteurs de risque et prévalences.
- Neo4j : **1 496 relations `[:HAS_RISK]`** créées pour les métiers à forte pénibilité.

**Source officielle :** CNESST via Données Québec (`lesions-professionnelles` - 114 345 lésions de 2023)
**Script exécuté :** `trajektia/etl/cnesst_supabase_ingestor.py`

```bash
python trajektia/etl/cnesst_supabase_ingestor.py
```

### B5 — Exigences Physiques & DPC (Données, Personnes, Choses) [FAIT]

**Pourquoi :** Indispensable pour les **Conseillers d'orientation (c.o.)**, **conseillers en réadaptation** et professionnels de la **CNESST/CSST** évaluant l'aptitude à l'emploi et les limitations fonctionnelles (port de charge, stations assis/debout, motricité, acuité visuelle/auditive).
**Sources officielles :** 
- EDSC Guide sur les carrières 2016 (`guidesurlescarrieres-2016_fr_activitesphysiques.csv` et `guidesurlescarrieres-2016_fr_donneespersonneschoses.csv`)
- Concordance officielle Statistique Canada CNP 2016 v1.3 $\leftrightarrow$ CNP 2021 v1.0 (`statcan_noc_2016_2021_concordance.csv`)
**Tables cibles et résultats vérifiés en base :**
- `occupation_physical_demands` : **504 métiers** dotés de leurs profils ergonomiques complets (Force `S-1` à `S-4`, Poids max kg, Posture `B-1` à `B-4`, Coordination `L-0` à `L-2`, Vue `V-1` à `V-3`, Couleurs `C-0` à `C-2`, Ouïe `H-1` à `H-3`, DPC Données, DPC Personnes, DPC Choses, Résumé DPC et Axes de Prediger).
- Neo4j : **886 nœuds `(:Occupation)`** enrichis de propriétés directes (`strength_code`, `max_weight_kg`, `body_position`, `dpc_summary`, `prediger_tp`).
**Script exécuté :** `trajektia/etl/physical_demands_dpc_ingestor.py`

```bash
python trajektia/etl/physical_demands_dpc_ingestor.py
```

### B6 — Titres Alternatifs & Synonymes Bilingues de Compétences [TCC 2025]

**Pourquoi :** Améliorer la recherche sémantique et la découverte de compétences dans le moteur d'orientation.
**Source officielle :** Taxonomie des compétences et capacités (TCC 2025 v1.0 - EDSC / Ouvert Canada).
**Table cible Supabase :** `competency_synonyms` (code compétence, titre officiel, titre alternatif/synonyme, langue FR/EN).
**Script :** `trajektia/etl/tcc_synonyms_ingestor.py`

### B7 — Profils Ergonomiques BLS ORS (Haute Précision Réadaptation) [PLANIFIÉ]

**Pourquoi :** Fournir les pourcentages horaires précis (temps assis, temps debout, fréquence de levage) calibrés sur l'Occupational Requirements Survey (ORS) du Bureau of Labor Statistics (BLS) pour les bilans de réadaptation avancés.
**Liaison :** Via `noc_onet_crosswalk` $\rightarrow$ code SOC US.

---

## PHASE D — Moteur Psychométrique DPC & Modèle de Prediger (Pour Conseillers d'Orientation)

> **Objectif :** Transformer les cotations brutes DPC (Données, Personnes, Choses) et les profils RIASEC en un moteur d'orientation et de réorientation scientifique fondé sur le modèle bi-axial de Dale J. Prediger (1982).

### D1 — Taxonomie, Verbes d'Action & Niveaux de Complexité DPC [FAIT]
- **Objectif :** Formaliser la table de correspondance sémantique des 25 échelons DPC officiels du Guide des carrières.
  - **Données (0 à 6)** : 0=Synthétiser, 1=Coordonner, 2=Analyser, 3=Compiler, 4=Calculer, 5=Copier, 6=Comparer.
  - **Personnes (0 à 8)** : 0=Conseiller/Mentorat, 1=Négocier, 2=Instruire, 3=Superviser, 4=Divertir, 5=Persuader, 6=Signaler/Échanger, 7=Servir/Aider, 8=Recevoir des consignes / Non significatif.
  - **Choses (0 à 8)** : 0=Régler/Mise au point, 1=Travail de précision, 2=Faire fonctionner/Contrôler, 3=Conduire/Manœuvrer, 4=Manipuler/Actionner, 5=Assurer le fonctionnement/Alimenter, 6=Arranger/Surveiller, 7=Manier, 8=Non significatif.
- **Tâches réalisées :**
  - [x] Créer la table de référence `ref_dpc_taxonomy` et la vue `v_occupation_dpc_detailed` dans Supabase via `database/schema_v7_dpc_taxonomy.sql`. [FAIT]
  - [x] Renseigner les 25 définitions opératoires cliniques bilingues, complexités (1 à 5), exemples concrets et pôles de Prediger. [FAIT]
  - [x] Développer le service d'explicabilité et de filtrage dynamique `trajektia/analytics/dpc_service.py` (`explain_occupation_dpc` et `filter_occupations_by_dpc`). [FAIT]

### D2 — Moteur Bi-Axial de Prediger (Pont Psychométrique DPC <-> RIASEC) [FAIT]
- **Objectif :** Établir le lien direct entre les intérêts professionnels auto-déclarés (RIASEC) et les exigences comportementales objectives du poste (DPC).
- **Formules mathématiques appliquées :**
  - Axe Choses/Personnes (T/P) : T/P = 2R + I - A - 2S - E + C
  - Axe Données/Idées (D/I) : D/I = 1.732 * (C + E - I - A)
- **Tâches réalisées :**
  - [x] Développer le script de validation et réconciliation `trajektia/analytics/prediger_riasec_calibrator.py`. [FAIT]
  - [x] Calculer l'**Indice de Cohérence Psychométrique (ICP)** mesurant la concordance entre l'hexagone RIASEC (OaSIS/O*NET) et la cotation empirique DPC (distance euclidienne sur le plan cartésien de Prediger). [FAIT]
  - [x] Identifier et documenter les "métiers hybrides ou en tension psychométrique" (99.7% identifiés avec divergence empirique vs intérêts déclarés, révélant la richesse clinique du modèle pour les conseillers d'orientation). [FAIT]

### D3 — Moteur de Recommandation & Aide à la Décision pour c.o.
- **Objectif :** Fournir aux conseillers d'orientation (c.o.) un outil de recommandation multidimensionnel.
- **Tâches à réaliser :**
  - [ ] Créer l'algorithme de recommandation par projection cartésienne de Prediger (saisie du profil RIASEC d'un bénéficiaire -> calcul de proximité euclidienne avec les 504 groupes CNP).
  - [ ] Générer des explications en langage naturel pour le c.o. et le bénéficiaire (ex: *"Ce métier correspond à vos intérêts d'investigation, mais demande une implication humaine (Personnes: niveau 1 Négocier) supérieure à votre profil standard"*).
  - [ ] Intégrer les passerelles de bifurcations vers des professions voisines sur le plan de Prediger nécessitant moins de formation complémentaire.

### D4 — Module de Test Psychométrique Interactif (Big Five IPIP-50 + RIASEC Mini-IP) [FAIT]
- **Objectif :** Permettre l'auto-évaluation scientifiquement validée des candidats et bénéficiaires directement depuis l'interface web, avec calcul instantané des scores et appariement professionnel.
- **Tâches réalisées :**
  - [x] Intégrer la banque de 110 items psychométriques standardisés dans `frontend-web/src/data/questions-psychometriques.ts` :
    - 50 items IPIP-50 (Goldberg 1992) pour les 5 facteurs OCEAN (Ouverture, Conscienciosité, Extraversion, Agréabilité, Névrosisme) avec clés d'inversion.
    - 60 items O*NET Mini-IP (Rounds et al. 2010) pour les 6 intérêts RIASEC de Holland.
  - [x] Concevoir le moteur de scoring et d'appariement `frontend-web/src/utils/scoring-engine.ts` :
    - Gestion des items inversés ($S_i = 6 - x_i$).
    - Normalisation des scores bruts sur une échelle standardisée 0-100.
    - Algorithme d'appariement par similarité cosinus dans un espace vectoriel à 11 dimensions ($\vec{u} \in \mathbb{R}^{11} \leftrightarrow \vec{m} \in \mathbb{R}^{11}$).
    - Détermination du code RIASEC dominant (2 à 3 lettres) et des traits de personnalité prédominants.
    - Top 10 des métiers québécois recommandés avec score d'affinité (%) et lien vers les fiches CNP.
    - Persistance locale 100% confidentielle via `localStorage` (`trajektia_psychometric_results_v1`) respectant la Loi 25.

### D5 — Algorithme de Cosinus Centré (Pearson r) & Métiers Réels [FAIT]
- **Objectif :** Éliminer le biais de translation où les profils factices plats obtiennent 99% et ne recommander que de vrais métiers CNP québécois.
- **Tâches réalisées :**
  - [x] Remplacer le cosinus brut par le **cosinus centré** ($r$ de Pearson) dans `scoring-engine.ts` :
    - Éradication mathématique du biais des profils "plats" à 50 (variance nulle $\sigma_m = 0 \implies \text{score} = 0$).
    - Translation calibrée du coefficient $r \in [-1, 1]$ vers l'échelle grand public : $\text{score} = \text{round}(\min(99, \max(10, 50 + r \cdot 48)))$.
  - [x] Remplacement des profils d'exemple par **301 métiers québécois réels** dans `frontend-web/src/data/metiers.ts` via le pipeline `scripts/generate_career_content.py` :
    - Profils RIASEC réels extraits d'O*NET 28.2 (normalisés sur échelle 1-7).
    - Traits Big Five réels calculés via le crosswalk officiel NOC2021-ONET26.
    - Salaires réels ESDC 2025 (bas, médian, haut), niveaux FEER et libellés officiels en français.
  - [x] Sécurisation de la complétion à 110/110 questions dans `PsychometricTest.tsx` (ajout de l'état `isProcessing` pour éliminer le blocage sur l'item final).
  - [x] Sécurisation du build Astro SSG (`npm run build`) : typage TypeScript rendu résilient face aux champs optionnels (`relance_quebec`, etc.) et neutralisation des accès non gardés.

### D6 — Moteur de Commentaires Explicatifs Cliniques & Métiers Miroirs [FAIT]
- **Objectif :** Fournir des explications personnalisées, positives et bienveillantes pour chaque recommandation, et exposer les métiers à l'opposé selon les règles de l'OCCOQ.
- **Tâches réalisées :**
  - [x] **Générateur de narratifs cliniques personnalisés** dans `scoring-engine.ts` (`generateMatchExplanation`) :
    - Identification dynamique des convergences dominantes (traits RIASEC et OCEAN partagés).
    - Commentaires positifs valorisant les forces spontanées de l'utilisateur pour le Top 10.
  - [x] **Section Miroir « Métiers demandant un effort d'adaptation particulier »** (Bottom 5, $r < 0$) :
    - Respect strict de la déontologie clinique (OCCOQ) : bannissement de tout vocabulaire disqualifiant (*« métiers déconseillés »*, *« impossibles »*).
    - Explications axées sur le coût énergétique, la dissonance avec les penchants naturels et les stratégies d'adaptation requises.
  - [x] **Intégration UI dans `PsychometricTest.tsx`** :
    - Section accordéon rétractable stylisée avec badge ambre/violet.
    - Cartes miroirs présentant les écarts dimensionnels majeurs et le narratif d'adaptation.

### D7 — Module Optionnel de Satisfaction & Valeurs de Travail (TWA) [FAIT]
- **Objectif :** Mesurer les leviers d'épanouissement durable au travail (Theory of Work Adjustment de Dawis & Lofquist), en complément de l'inventaire des intérêts (RIASEC).
- **Tâches réalisées :**
  - [x] Intégrer les 21 énoncés de l'O*NET Work Importance Locator (WIL) dans `frontend-web/src/data/questions-satisfaction.ts`.
  - [x] Relier aux profils de valeurs de travail des 301 métiers québécois via la table CKG `Work Values.txt` (6 valeurs : Accomplissement, Indépendance, Reconnaissance, Relations, Soutien, Conditions de travail).
  - [x] Concevoir le scoring de congruence des besoins-renforçateurs (*Needs-Reinforcer Fit*).
  - [x] Proposer ce test comme Étape 2 facultative d'approfondissement dans `/outils` et sur la page de résultats psychométriques.

---

## PHASE E — Évaluation Ergonomique, Aptitude au Travail & Réadaptation (CSST / CNESST)

> **Objectif :** Permettre aux conseillers en réadaptation, ergothérapeutes et professionnels de la CNESST d'évaluer la compatibilité entre les limitations fonctionnelles (LFT/LFP) d'un travailleur et les exigences physiques réelles d'un emploi.

### E1 — Moteur d'Adéquation Ergonomique (Job-Person Ergonomic Fit) [FAIT]
- **Objectif :** Créer l'algorithme d'adéquation candidat-emploi avec filtres médicaux stricts et scoring de tolérance (0 à 100%).
- **Dimensions d'analyse et règles de sécurité :**
  1. **Capacité de levage et d'effort (Force)** :
     - Seuil maximal admissible par le travailleur : S-1 (<= 5 kg), S-2 (<= 10 kg), S-3 (<= 20 kg), S-4 (> 20 kg).
     - *Règle éliminatoire absolue :* Si Force_métier > Capacité_candidat, le métier est exclu ou marqué "Contre-indiqué".
  2. **Tolérance posturale & rachidienne** :
     - Stations : B-1 (assis prédominant), B-2 (debout / marche continue), B-3 (postures contraignantes : flexion, torsion lombaire, accroupissement), B-4 (travail en hauteur / grimper / échelles).
     - *Filtrage spécifique rachis :* Exclusion des postures B-3 pour les travailleurs avec limitations lombaires permanentes.
  3. **Aptitudes sensorielles et motrices** :
     - Dextérité et coordination motrice (L-0, L-1, L-2).
     - Vision binoculaire et de détail (V-1, V-2, V-3) et discrimination des couleurs (C-0, C-1, C-2).
     - Acuité auditive et environnement bruyant (H-1, H-2, H-3).
- **Tâches réalisées :**
  - [x] Implémenter le moteur d'évaluation ergonomique `trajektia/analytics/ergonomics.py` avec la fonction `evaluate_candidate_fit(candidate_profile, cnp_code)`. [FAIT]
  - [x] Développer l'algorithme de scoring d'adéquation pondéré (Fit Score 0-100%). [FAIT]
  - [x] Générer le diagnostic automatisé d'aptitude au travail avec justifications cliniques et préventions pour versement au dossier médical / professionnel. [FAIT]

### E2 — Croisement Données Lésions CNESST & Risque de Récidive [FAIT]
- **Objectif :** Relier l'analyse ergonomique d'un métier avec les statistiques réelles des lésions professionnelles CNESST (base 114 345 lésions).
- **Tâches réalisées :**
  - [x] Calculer un indicateur de vigilance post-lésion : alerte automatique si un travailleur avec antécédent de lésion spécifique (ex: TMS épaule/dos) vise un métier dans un secteur où ce type de lésion représente >= 25% des réclamations (interrogation directe de la table `occupation_hazards` via `prevalence_pct`). [FAIT dans ergonomics.py]
  - [x] Intégrer les mesures préventives recommandées par l'INSPQ et la CNESST pour le groupe professionnel concerné. [FAIT]

### E3 — Intégration des Profils Horaires BLS ORS (Haute Précision) [Phase B7]
- **Objectif :** Pour les dossiers d'expertise médico-légale ou de réadaptation lourde nécessitant une ventilation horaire précise.
- **Tâches à réaliser :**
  - [ ] Ingestion du dataset ORS (Occupational Requirements Survey) du Bureau of Labor Statistics US via crosswalk SOC-O*NET-CNP.
  - [ ] Rapprochement des pourcentages horaires : % moyen assis, % debout, fréquence des mouvements répétitifs, poussée/traction en kg.

---

## PHASE F — Exposition Vitrine, Fiches Métiers & Outils Métiers (Astro / Directus)

> **Objectif :** Restituer ces dimensions de manière lisible, percutante et adaptée à chaque public (Grand public, Candidats en reconversion, Conseillers d'orientation, Professionnels de la réadaptation).

### F1 — Mise à Jour du Pipeline de Synchronisation (`le_siphon.py`)
- [ ] Mettre à jour `etl/le_siphon.py` pour synchroniser la table `occupation_physical_demands` et les champs ergonomiques / DPC / Prediger vers Supabase / Directus.
- [ ] Valider l'intégrité des données dans les API Directus / Astro.

### F2 — Conception UI des Blocs Fiches Métiers (Astro)
- [ ] **Bloc Ergonomie & Santé au travail** :
  - *Affichage Grand Public :* Badges synthétiques et iconographie claire (ex: "Travail sédentaire", "Charges légères <= 5 kg", "Dextérité fine requise").
  - *Mode Pro / Réadaptation (Toggle) :* Matrice ergonomique complète (cotes S, B, L, V, C, H), charge maximale en kg, facteurs de risques sectoriels CNESST et alertes TMS.
- [ ] **Bloc Profil Psychométrique & Triade DPC** :
  - Graphique cartésien interactif du Modèle de Prediger (Axes Données/Idées et Choses/Personnes) avec point de positionnement du métier.
  - Jauge tripartite interactive DPC (Données, Personnes, Choses) avec explicitation du verbe d'action de référence.
  - Radar RIASEC enrichi.

### F3 — Simulateur Interactif d'Aptitude & Réadaptation (Espace Conseiller)
- [ ] Interface dédiée pour les c.o. et conseillers en réadaptation :
  - Formulaire de saisie des limitations fonctionnelles d'un client (poids max toléré, postures contre-indiquées, vision, audition).
  - Filtrage dynamique instantané du catalogue des 504 métiers de la CNP.
  - Module d'exportation de rapport d'évaluation ergonomique et orientation (PDF / Fiche de synthèse).

### F4 — Interface Interactive du Test Psychométrique & Visualisations SVG [FAIT]
- [x] **Composant interactif React** (`frontend-web/src/components/PsychometricTest.tsx`) :
  - Écran d'accueil présentant les objectifs scientifiques (Big Five & RIASEC), durée estimée (10-15 min) et garantie de confidentialité.
  - Interface de passation progressive en 11 sections de 10 questions avec barre de complétion et compteur de progression.
  - Navigation dynamique précédente/suivante, validation des réponses, sauvegarde instantanée de l'état.
  - Écran de résultats complet avec restitution graphique :
    - **Hexagone SVG RIASEC** : modélisation dynamique des 6 pôles de Holland avec polygones concentriques et axe interactif.
    - **Radar SVG Big Five** : toile d'araignée à 5 dimensions OCEAN avec scores normalisés.
    - **Top 10 des métiers recommandés** : cartes de métiers avec pourcentage d'affinité, badges de correspondance et liens directs vers `/metiers/{cnp_code}`.
    - Bouton de réinitialisation pour repasser le test à volonté.
- [x] **Page Astro dédiée** (`frontend-web/src/pages/outils/test-psychometrique.astro`) :
  - Layout propre, balises SEO optimisées, fil d'Ariane (*Accueil > Outils > Test psychométrique*).
  - Intégration du composant React avec hydratation `client:load`.
- [x] **Catalogue des Outils** (`frontend-web/src/data/outils.ts`) :
  - Outil référencé et marqué "disponible" dans la grille de la page `/outils`.

---

## PHASE G — Vérification, Validation Clinique & Audit

### G1 — Validation Clinique & Déontologique avec Conseillers d'Orientation
- [ ] Révision par des professionnels de l'orientation (c.o.) et de l'ergonomie pour valider les libellés et les règles d'interprétation.
- [ ] Vérification de conformité avec les directives de l'Ordre des conseillers et conseillères d'orientation du Québec (OCCOQ).

### G2 — Audit technique & Intégrité du Graphe
```bash
# Vérification globale des tables et liaisons
python ckg/audit/verify_ckg_data.py
python ckg/audit/verify_phase9.py
python scratch/verify_physical_db.py
```

---

## PHASE H — Stratégie Emploi, Babillard Hybride & Modèle Économique Recruteurs

> **Objectif :** Résoudre le problème du démarrage à froid (*cold-start*) par l'agrégation initiale, capturer des leads qualifiés et déployer un babillard d'offres propriétaire monétisable B2B.

### H1 — Étape 1 : L'Agrégation Multi-Sources & Live Marché (Acquisition & SEO)
- [x] Agréger les offres d'emploi réelles du Québec pour alimenter les fiches métiers dès le lancement. [FAIT]
  - [x] **Job Bank / Guichet-Emplois (Open Canada)** : PRIORITÉ 1 (Tier 1). Ingestion de l'archive officielle de 88 mois en Open Data CKAN (`job-bank-open-data-all-job-postings-fr-*.csv` avec codes CNP 2021) et/ou API. Garantit une liaison CNP native parfaite pour nos calculs vectoriels.
  - [ ] **Adzuna API Canada** : Clés configurées dans `.env`. Utilisé comme complément pour densifier la couverture privée.
  - [ ] **Jooble API & Talent.com** : Connexion aux flux partenaires complémentaires pour densifier la couverture régionale des PME québécoises.
  - [ ] **Endpoints ATS Directs** : Indexation des carrières des grandes entreprises québécoises (Greenhouse, Lever, SmartRecruiters).
- [x] Calculer l'**Indice Salarial Trajektia Live™** : médiane mobile réelle et écart % vs StatCan. [FAIT]
- [x] Déployer le module de **Lead Capture (Abonnement courriel)** sur les fiches métiers pour constituer la base d'abonnés qualifiés. [FAIT]
- [ ] Connecter le formulaire d'inscription courriel à une table Supabase `leads_newsletter` ou service d'automatisation (Resend / Loops).

### H2 — Étape 2 : Le Babillard Propriétaire « Trajektia Recrutement » (Monétisation B2B)
- [ ] **Espace Recruteurs Partenaires** :
  - Formulaire de dépôt d'offres direct par les employeurs du Québec.
  - Enrichissement automatique de l'annonce par le CKG : tag RIASEC de l'offre et niveau d'effort physique DPC.
  - **Ciblage ultra-précis par filière** : l'offre s'affiche directement sur la page du DEC ou DEP québécois correspondant pour cibler les futurs finissants.
- [ ] **Modèle Freemium d'Amorçage Partenaires** :
  - Gratuité offerte aux 30 à 50 premières entreprises pionnières québécoises pour densifier le réseau exclusif.
- [ ] **Monétisation Directe & Revenus Récurrents** :
  - Vente d'annonces vedettes sponsorisées (250 $ - 450 $ / annonce avec badge or « Recruteur Partenaire Trajektia »).
  - Forfaits d'abonnements mensuels / annuels pour PME et grands employeurs québécois.
  - Accès aux statistiques de consultation et métriques d'intérêt des diplômés.

### H3 — Étape 3 : Observatoire Temporel & Séries Temporelles (Time-Series & Courbes de Tendances)
- [x] Définir le schéma SQL des séries temporelles : [`database/schema_v8_market_snapshots.sql`](file:///c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter/trajektia/database/schema_v8_market_snapshots.sql). [FAIT]
  - `trajektia_live_job_postings` : Table de cache avec TTL de 30 jours pour l'affichage UI immédiat.
  - `trajektia_market_snapshots` : Instantanés mensuels pour archiver salaires réels, volumes et tensions.
  - `trajektia_skill_demand_history` : Historique de pénétration des compétences émergentes.
  - `v_trajektia_career_trends_12m` : Vue calculant les pentes de croissance sur 12 mois.
- [ ] Développer le script Cron d'ingestion mensuelle (`etl/market_snapshot_collector.py`) agrégeant Adzuna et Guichet-Emplois.
- [ ] Intégrer les graphiques de tendances (courbe salariale 12 mois et momentum de recrutement) sur les fiches métiers Astro.

### H4 — Étape 4 : Branding & Propriété Intellectuelle des Métriques Trajektia™
- [x] Consigner au [Manuel Méthodologique CKG](file:///c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter/trajektia/ckg/MANUEL_METHODOLOGIQUE_CKG.md) la nomenclature officielle :
  - **Indice Salarial Trajektia Live™** *(Trajektia RealWage)*
  - **Indice de Volatilité Salariale Trajektia™**
  - **Radar Compétences Trajektia™** & **Taux de Pénétration Marché Trajektia™**
  - **Compétences Émergentes Trajektia™**
  - **Indice de Tension Marché Trajektia™**
  - **Score d'Affinité Trajektia™**
  - **Profil DPC Trajektia™**
- [ ] Afficher les badges de propriété intellectuelle et les infobulles méthodologiques sur le frontend Astro.

---

## 🗓️ Séquence Recommandée & Feuille de Route

```
RÉALISÉ (Fondations, Ingestion, Moteurs & Taxonomie DPC)
───────────────────────────────────────────────────────────────────
[FAIT] A2  Ingestion des métiers CNP 2021 (510 nœuds) et Mapping O*NET (911 arêtes EQUIVALENT_TO)
[FAIT] A1  Logiciels O*NET (32 435 liens)
[FAIT] B3  Formations MEQ / La Relance (964 liaisons, 539 écoles, 220 prog.)
[FAIT] B4  SST / CNESST Québec (3 698 liens, 20 secteurs, 1 496 arêtes Neo4j)
[FAIT] B5  Exigences Physiques & DPC GC 2016 (504 métiers, 886 noeuds Neo4j)
[FAIT] A7  Axes de Prediger & Intégration psychométrique dans le schéma V6
[FAIT] D1  Table Taxonomie DPC & 25 verbes bilingues (ref_dpc_taxonomy + dpc_service.py)
[FAIT] D2  Calibration Psychométrique Prediger-RIASEC (prediger_riasec_calibrator.py)
[FAIT] E1  Moteur d'Adéquation Ergonomique & Réadaptation (ergonomics.py)
[FAIT] E2  Croisement Vigilance Post-Lésion & Récidive CNESST (ergonomics.py)
[FAIT] A4  Compétences Vertes ESCO intégrées aux fiches métiers et au CKG
[FAIT] F2  Composants UI Fiches Métiers Astro (Salaires, Jauges DPC, RIASEC Prediger, Relance, Offres temps réel)
[FAIT] A5  Module Offres d'emploi actives et alertes marché intégrées
[FAIT] D4  Module Test Psychométrique (110 questions, IPIP-50 + O*NET Mini-IP, Scoring 11D Cosinus)
[FAIT] F4  Interface Test Psychométrique React/Astro (/outils/test-psychometrique, SVG Hexagone & Radar)
[FAIT] D5  Cosinus Centré (Pearson r), 301 Métiers Réels Supabase & Fix Complétion 110/110
[FAIT] D6  Commentaires Narratifs Cliniques Positifs & Section Miroir Accordéon OCCOQ
[FAIT] D7  Module de Satisfaction & Valeurs de Travail (TWA / O*NET WIL 21 items)
[FAIT] F5  Infobulles Pédagogiques interactives (<InfoBubble>) & Règle POMP < 5% (Fiches [cnp].astro)
[FAIT] G1  Framework Customizations Agent (.agents/rules & .agents/skills) & Orchestration Multi-Agents (dispatch-next-task)

PROCHAINE ÉTAPE PRIORITAIRE — Siphon, Formations (MEQ) & Offres (Guichet-Emplois)
───────────────────────────────────────────────────────────────────
1. F1  Créer les nœuds (:Program) pour les formations MEQ dans Neo4j [FAIT]
2. H1  Mettre en place l'ingestion Guichet-Emplois (Job Bank) dans Neo4j (:JobPosting) (Priorité sur Adzuna)
3. F1  Mise à jour de `le_siphon.py` (Export Ergo/DPC/Prediger/SST vers Directus/Supabase)
4. B6  Titres alternatifs & Synonymes TCC 2025 (Recherche sémantique)
5. F3  Simulateur Interactif de Réadaptation (Filtrage par limitations fonctionnelles)
```

---

## 🚀 Commandes de démarrage rapide

```bash
# Toujours depuis le dossier trajektia/

# 1. Vérifier la config et les fichiers sources
python ckg/ckg_config.py

# 2. Vérifier les données physiques et DPC en base
python scratch/verify_physical_db.py

# 3. Synchroniser Neo4j -> Supabase (Le Siphon)
python etl/le_siphon.py
```
