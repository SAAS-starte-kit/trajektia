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
| Crosswalk NOC vers O*NET | FAIT | 1 467 liens | Mapping complet |
| Crosswalk O*NET vers ESCO | FAIT | 4 253 liens | Mapping complet |
| ESCO Compétences Vertes (Green Skills) | Cadré | Stratégie verte ciblée | Priorisé post-B3 |
| Formations MEQ / Relance | FAIT (Supabase) | 964 liens, 539 étab., 220 prog. | 100% dans Supabase |
| O*NET Knowledge              | FAIT     | 6 566    | On a rajouté les connaissances requises via script. |
| O*NET Work Context           | FAIT     | 21 953   | On a rajouté les contextes de travail (Social/Environnement) |
| O*NET Job Zones              | MANQUANT | 0        | À venir plus tard ou via les données SST/Relance. |
| SST / CNESST (Données Québec) | FAIT | 3 698 liens, 20 secteurs, 7 risques (Supabase) + 1 496 HAS_RISK (Neo4j) | 100% |
| Exigences Physiques (EDSC GC 2016) | FAIT | 504 métiers (Forces S1-S4, Postures B1-B4, Vision, Ouïe) | 100% Supabase + Neo4j |
| DPC Données-Personnes-Choses (GC 2016) | FAIT | 504 métiers (Cotation DPC + Pont RIASEC Prediger) | 100% Supabase + Neo4j |
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

### A2 — Améliorer le crosswalk NOC -> O*NET [PRIORITÉ 2 — BLOQUANT]

**Pourquoi :** Seulement 34% des 900 métiers canadiens ont leur pont vers O*NET.
Sans ce pont, les 66% restants n'ont ni compétences logicielles, ni psychométrie, ni RIASEC.
**Scripts :** `ckg/crosswalks/download_noc_onet_crosswalk.py` puis `unified_crosswalk_loader.py`
**Résultat attendu :** >80% des métiers canadiens reliés à O*NET

```bash
python ckg/crosswalks/download_noc_onet_crosswalk.py
python ckg/crosswalks/unified_crosswalk_loader.py
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

### D1 — Taxonomie, Verbes d'Action & Niveaux de Complexité DPC
- **Objectif :** Formaliser la table de correspondance sémantique des 24 échelons DPC officiels du Guide des carrières.
  - **Données (0 à 6)** : 0=Synthétiser, 1=Coordonner, 2=Analyser, 3=Compiler, 4=Calculer, 5=Copier, 6=Comparer.
  - **Personnes (0 à 8)** : 0=Conseiller, 1=Négocier, 2=Instruire, 3=Superviser, 4=Divertir, 5=Persuader, 6=Signaler, 7=Servir, 8=Recevoir des instructions.
  - **Choses (0 à 7)** : 0=Régler, 1=Travail de précision, 2=Faire fonctionner/contrôler, 3=Conduire/manœuvrer, 4=Manipuler, 5=Alimenter/retirer, 6=Arranger/déplacer, 7=Manier.
- **Tâches à réaliser :**
  - [ ] Créer la table de référence `ref_dpc_taxonomy` dans Supabase (niveaux, verbes d'action officiels, définitions opératoires, exemples concrets).
  - [ ] Développer des fonctions d'agrégation et de filtres par seuil de complexité (ex: filtrer les métiers exigeant un niveau relationnel P <= 2 ou une manipulation technique C <= 2).

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

## 🗓️ Séquence Recommandée & Feuille de Route

```
RÉALISÉ (Fondations, Ingestion & Moteurs Analytiques)
───────────────────────────────────────────────────────────────────
[FAIT] A1  Logiciels O*NET (32 435 liens)
[FAIT] A2  Crosswalk NOC <-> O*NET (1 467 liens)
[FAIT] B3  Formations MEQ / La Relance (964 liaisons, 539 écoles, 220 prog.)
[FAIT] B4  SST / CNESST Québec (3 698 liens, 20 secteurs, 1 496 arêtes Neo4j)
[FAIT] B5  Exigences Physiques & DPC GC 2016 (504 métiers, 886 noeuds Neo4j)
[FAIT] A7  Axes de Prediger & Intégration psychométrique dans le schéma V6
[FAIT] D2  Calibration Psychométrique Prediger-RIASEC (prediger_riasec_calibrator.py)
[FAIT] E1  Moteur d'Adéquation Ergonomique & Réadaptation (ergonomics.py)
[FAIT] E2  Croisement Vigilance Post-Lésion & Récidive CNESST (ergonomics.py)

PROCHAINE ÉTAPE PRIORITAIRE — Synchronisation Pipeline & CMS (~30 min)
───────────────────────────────────────────────────────────────────
1. F1  Mise à jour de `le_siphon.py` (Export Ergo/DPC/Prediger/SST vers Directus/Supabase)
2. B6  Titres alternatifs & Synonymes TCC 2025 (Recherche sémantique)
3. A4  Compétences Vertes ESCO (Green Skills ciblées)

ÉTAPES SUIVANTES — Vitrine, Frontend Astro & Outils Cliniques
───────────────────────────────────────────────────────────────────
4. D1  Table de référence et taxonomie sémantique DPC (24 verbes d'action)
5. D3  Moteur de recommandation & explicabilité pour Conseillers d'Orientation (c.o.)
6. F2  Composants UI Fiches Métiers Astro (Badges Ergo, Jauge DPC, Radar Prediger)
7. F3  Simulateur Interactif de Réadaptation (Filtrage par limitations fonctionnelles)
8. A5  Compteurs d'offres actives Job Bank API
9. B7  Enrichissement BLS ORS (Profils horaires avancés)
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
