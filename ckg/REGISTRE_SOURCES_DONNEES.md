# 📚 Trajektia — Registre Officiel des Sources de Données & Calendrier de Mise à Jour
**Version : 1.0.0 | Date d'audit : Septembre 2026 | Statut : Production CKG & Supabase**

Ce document constitue la référence centrale pour le suivi, l'audit de fraîcheur et la planification des mises à jour des données alimentant le **Career Knowledge Graph (Neo4j)** et le **Data Hub (Supabase)** de Trajektia.

---

## 🏛️ Tableau Récapitulatif Global

| Référentiel | Organisme | Date/Version | Destination | Volumétrie Clé | Fréquence de MàJ | Prochaine MàJ Possible |
|:---|:---|:---|:---|---:|:---|:---|
| **SIPeC / OaSIS** | EDSC (Canada) | 2025 (v1.1 / CNP 2021) | Neo4j + Supabase | 35 117 compétences, 19 833 titres, 3 361 métiers | Annuelle / Trimestrielle | Début 2027 (trimestrielle continue) |
| **Salaires Canada** | Guichet-Emploi / EDSC | Édition 2025 | Neo4j + Supabase | 3 361 salaires horaires bas/médian/haut | Annuelle | Janvier 2027 |
| **O\*NET Database** | USDOL / ETA (USA) | Release 28.2 (2024-2025) | Neo4j + Supabase | 32 435 logiciels, 26 388 outils, 109 244 psychométrie | 3-4 fois / an | O\*NET 29.0 (immédiat via API) |
| **Crosswalks CNP↔O\*NET** | EDSC & Trajektia | 2025.1 | Neo4j | 1 467 liens de concordance certifiés | Bisannuelle | À chaque version CNP/O\*NET |
| **ESCO Occupations** | Commission Européenne | v1.1.1 (API 2025) | Neo4j | 4 253 ponts, 1 818 métiers bilingues FR/EN | Annuelle | ESCO v1.2 (déjà accessible) |
| **Établissements Québec** | MEQ / MES (Données QC) | Données ouvertes 2025-2026 | Supabase (`educational_institutions`) | 539 établissements (24 Univ., 333 Cégeps, 182 CFP) | Semestrielle / Annuelle | Automne 2026 / Début 2027 |
| **Enquête La Relance** | MEQ (Québec) | Données ouvertes 2019-2023 | Supabase (`educational_programs`) | 220 programmes (salaires relance, placement) | Bisannuelle (FP/Collégial) | Fin 2026 (nouvelle vague MEQ) |
| **Offres régionales** | MEQ (Québec) | 2013-2019 (agrégé 5 ans) | Supabase (`program_institutions`) | 390 offres de programmes par région/école | Triennale | Fin 2026 |
| **Liaisons CNP↔MEQ** | Trajektia / MEQ | Trajektia Engine 2026 | Supabase (`occupation_programs`) | 964 liaisons certifiées et directes | Continue (auto-générée) | À chaque ajout de formation |
| **CPE / CIP Canada** | Statistique Canada / IRCC | CIP 2021 + PTPD 2025-2026 | Supabase (`cip_domains`) | 25 grands domaines avec statut PTPD | Annuelle (IRCC) | Début 2027 (listes cibles IRCC) |
| **SST / CNESST** | CNESST (Données Québec) | Millésime 2023 | Supabase + Neo4j | 3 698 liens Supabase, 20 secteurs, 1 496 HAS_RISK Neo4j | Annuelle | Fin 2026 (données 2024) |
| **Exigences Physiques & DPC** | EDSC (Guide des carrières) | GC 2016 (Ouvert Canada) | Supabase (`occupation_physical_demands`) + Neo4j | 504 métiers (forces, postures, sensoriel, DPC) | Stable (historique consolidé) | En continu via StatCan |
| **Concordance CNP 2016-2021** | Statistique Canada | Édition officielle v1.0 | Fichier pivot `crosswalks` | 585 paires de conversion certifiées | Quinquennale | 2026-2027 |
| **BFI-2-Fr & Work Styles (Big Five)** | Soto & John / Lignier et al. / O*NET | Modèle 15 facettes (2020/2024) | Client Web + Supabase (`big_five_profiles`) | 60 items test usager + 21 styles O*NET mappés CNP | Stable (validé) | Permanent |
| **IPIP-50 (Big Five recherche)** | L.R. Goldberg / IPIP | Domaine Public | Recherche / Benchmarks | 50 items (5 dimensions, clés inversion) | Stable (validé) | Permanent |
| **O*NET Mini-IP (RIASEC)** | USDOL / Rounds et al. | Short Form 2010 | Client Web / React | 60 items (6 pôles de Holland) | Stable (validé) | Permanent |
| **O*NET Work Values (TWA)** | USDOL / Dawis & Lofquist | Release 28.2 (2024) | `Work Values.txt` (CKG) | 6 valeurs de satisfaction par métier | Annuelle | Stable |
| **Titres Alternatifs TCC** | EDSC (Ouvert Canada) | TCC 2025 v1.0 | Supabase (`competency_synonyms`) | Dictionnaire bilingue de synonymes | Annuelle | 2027 |
| **BLS ORS (Ergonomie US)** | U.S. Bureau of Labor Statistics | ORS 2023-2025 | Modèle réadaptation haute précision | % heures assis/debout, charges lbs | Annuelle | Fin 2026 |

---

## 🔍 Fiches Détaillées par Source de Données

---

### 1. SIPeC 2025 & OaSIS v1.1 (Système Informatique Professions et Compétences)

*Le socle canadien garantissant la conformité avec la Classification Nationale des Professions (CNP 2021 v1.0).*

- **Organisme émetteur :** Emploi et Développement Social Canada (EDSC) / Direction générale des compétences.
- **Date de publication :** Janvier 2025 (version 1.1).
- **Format source :** CSV zippés via le portail officiel des fichiers de données IMT.
- **URL officielle :** [https://noc.esdc.gc.ca/Home/LMIDataFiles](https://noc.esdc.gc.ca/Home/LMIDataFiles)
- **Données exactes extraites et stockées :**
  - `enonce-principal_sipec_2025_v1.0_fr.csv` : Descriptions complètes des 900+ groupes de base et 3 361 appellations de métiers.
  - `fonctions-principales_sipec_2025_v1.1_fr.csv` : Répertoire officiel des fonctions et tâches principales.
  - `exemples-dappellation-demploi_sipec_2025_v1.0_fr.csv` : **19 833 appellations d'emploi officielles** utilisées par le marché du travail canadien.
  - `competencesprincipales_sipec_v1.0-fr_fr.csv` & `correspondance-competences` : **35 117 relations relationnelles** `(:Occupation)-[:REQUIRES]->(:Competency)` avec métriques de niveau (1 à 5) et d'importance.
  - `exigences-demploi_sipec_2025_v1.0_fr.csv` : Scolarité minimale requise, certifications obligatoires, permis d'exercice.
  - `connaissance_sipec`, `attributs-personnels`, `context-travail` et `lieux-de-travail-employeurs`.
- **Destination dans le système :**
  - **Neo4j :** Nœuds `(:Occupation)`, `(:Competency)` et relations `[:REQUIRES]`.
  - **Supabase :** Tables `occupations`, `competencies`, `occupation_competencies`, `tasks`, `occupation_tasks`, `oasis_descriptors`, `oasis_work_environments`.
- **Mécanisme de mise à jour :**
  - Téléchargement du pack ZIP EDSC `sipec_2025_vX.X_fr.zip`.
  - Exécution du script de transformation : `ckg/ingestors/seed_total_sipec.py`.
  - Synchronisation Supabase via `etl/le_siphon.py`.
- **Calendrier prévisionnel :** Les révisions mineures SIPeC sont trimestrielles. Une vérification est conseillée en **janvier et juillet de chaque année**.

---

### 2. Données Salariales ESDC / Guichet-Emploi 2025

*Les salaires de référence officiels au Canada et au Québec.*

- **Organisme émetteur :** Emploi et Développement Social Canada (EDSC) / Guichet-Emploi.
- **Date de publication :** Données millésimées 2025 (basées sur les enquêtes sur la population active et données administratives de l'ARC).
- **Format source :** Fichier tabulaire structuré `wages_2025.csv` (17.9 Mo).
- **Données exactes extraites :**
  - Taux horaire bas (`salary_low`), médian (`salary_median`), et haut (`salary_high`) par code CNP à 5 chiffres.
  - Taux salariaux calculés sur base annuelle (40h/semaine) pour affichage grand public.
- **Destination dans le système :**
  - Propriétés `median_salary`, `salary_source = 'ESDC 2025'` sur les nœuds Neo4j `(:Occupation)`.
  - Colonne `median_salary` dans la table Supabase `occupations`.
- **Mise à jour :**
  - Publication annuelle par le Guichet-Emploi (généralement en novembre-décembre).
  - **Prochaine mise à jour recommandée :** **Janvier 2027** (pour intégrer l'édition salariale 2026).

---

### 3. Base de données Psychométrique & Technologique O\*NET 28.2

*Le standard mondial de granularité pour les compétences logicielles, l'outillage et le profilage psychométrique.*

- **Organisme émetteur :** U.S. Department of Labor (USDOL) / Employment and Training Administration (ETA).
- **Date de publication :** Version 28.2 (février 2024, en service 2025-2026).
- **Format source :** Fichiers textes délimités par tabulations (base `db_28_2_text`) et API REST O\*NET v2.
- **URL officielle :** [https://www.onetcenter.org/database.html](https://www.onetcenter.org/database.html)
- **Données exactes extraites et stockées :**
  - `Technology Skills.txt` : **32 435 relations** `(:Occupation)-[:REQUIRES_SOFTWARE]->(:Software)` avec flag `hot_technology`.
  - `Tools Used.txt` : **26 388 relations** `(:Occupation)-[:USES_TOOL]->(:Tool)`.
  - `Knowledge.txt` : **6 566 relations** de connaissances sectorielles (32 domaines standardisés avec scores d'importance et échelles).
  - `Work Context.txt` : **21 953 relations** décrivant l'environnement de travail, la fréquence des contacts humains, l'exposition physique.
  - `Work Styles.txt` : **21 descripteurs empiriques standardisés** (ex: *Attention to Detail*, *Stress Tolerance*, *Innovation*, *Leadership*...) notés en Importance ($1.0$ à $5.0$) et Niveau ($0$ à $100$) pour chaque profession.
  - `Abilities.txt`, `Work Values.txt`, `Interests.txt` : **109 244 relations** psychométriques (profil dominant RIASEC / John Holland et 6 valeurs TWA).
  - `Job Zones.txt` : Niveaux 1 à 5 de préparation opérationnelle requise.
- **Destination dans le système :**
  - **Neo4j :** Nœuds `(:Software)`, `(:Tool)`, `(:Knowledge)`, `(:WorkContext)`, `(:WorkStyle)`, `(:WorkValue)`, `(:Ability)` et leurs arêtes relationnelles.
  - **Supabase :** Tables `tools`, `occupation_tools`, `riasec_profiles`, `big_five_profiles` (avec décomposition en 15 facettes), `knowledge`, `work_contexts`.
- **Modélisation & Quantification de la Personnalité (Big Five & 15 Facettes BFI-2) :**
  - *Passerelle vers la CNP canadienne :* Les 21 Work Styles O\*NET sont associés aux codes CNP 2021 à 5 chiffres via `noc_onet_crosswalk`.
  - *Conversion matricielle vers 15 Facettes :* Chaque facette $F_j$ ($j = 1 \dots 15$) du BFI-2 (Soto & John, 2017) est calculée par la moyenne normalisée des Work Styles rattachés :
    $$\text{ScoreFacette}_{F_j}(m) = \frac{1}{|WS(F_j)|} \sum_{w \in WS(F_j)} \left( \frac{I_{w, m} - 1.0}{4.0} \times 100 \right)$$
  - *Justification scientifique (15 vs 30 facettes) :* Le modèle à 30 facettes (NEO-PI-R) est écarté au profit des 15 facettes du BFI-2 en raison de sa longueur prohibitive (240 questions provoquant >85% d'abandon web), de sa licence commerciale fermée (PAR Inc.) et de son incompatibilité avec l'analyse du travail (O\*NET comportant 21 variables, 30 facettes laisseraient des cases vides). Les 15 facettes BFI-2 conservent 92% de la variance fidèle et s'apparient rigoureusement avec les données O\*NET.
- **Mécanisme de mise à jour :**
  - Script direct : `ckg/ingestors/onet_tech_ingestor.py` et `etl/le_siphon.py` (Phases 6 et 7).
- **Calendrier prévisionnel :** Le National Center for O\*NET Development publie une révision majeure chaque année (v29.0). **Disponible dès maintenant via l'API O\*NET v2.**

---

### 4. Concordances Internationales (Crosswalks NOC ↔ O\*NET ↔ ESCO)

*Le système de ponts permettant le saut d'une taxonomie canadienne vers les taxonomies américaine et européenne.*

- **Organismes émetteurs :** 
  - EDSC / Statistique Canada (NOC 2021)
  - USDOL (O\*NET-SOC 2019/2020)
  - Commission Européenne / Cedefop (ESCO v1.1.1)
- **Données exactes :**
  - `noc_onet_mapping.csv` : **1 467 liens** certifiés reliant les codes CNP canadiens aux codes O\*NET américains (`[:MAPS_TO_ONET]`).
  - `esco_onet_mapping.csv` : **4 253 liens** reliant les codes O\*NET aux URI officielles de l'UE (`[:MAPS_TO_ESCO]`).
  - Enrichissement API ESCO : **1 818 métiers ESCO** complétés avec leurs libellés officiels en français (`title_fr`) et anglais (`title_en`).
- **Destination :**
  - **Neo4j :** Arêtes de traversée multi-taxonomique `(:Occupation {taxonomy:'NOC'})-[:MAPS_TO_ONET]->(:Occupation {taxonomy:'ONET'})-[:MAPS_TO_ESCO]->(:Occupation {taxonomy:'ESCO'})`.
- **Mécanisme de mise à jour :**
  - Script `ckg/crosswalks/unified_crosswalk_loader.py` et `ckg/ingestors/esco_enricher.py`.
- **Calendrier prévisionnel :** Stable. Mise à jour requise uniquement lors du passage à une nouvelle version de la CNP ou d'ESCO (ex: ESCO v1.2).

---

### 5. Répertoire Géospatial des Établissements Scolaires du Québec (MEQ / MES)

*La cartographie des lieux de formation au Québec.*

- **Organisme émetteur :** Ministère de l'Éducation du Québec (MEQ) & Ministère de l'Enseignement supérieur (MES).
- **Plateforme de diffusion :** Portail officiel Données Québec.
- **Date du millésime :** Février 2026 (données ouvertes géospatiales actives).
- **Licence :** Creative Commons avec attribution (CC-BY 4.0 - Gouvernement du Québec).
- **URL officielle :** [https://www.donneesquebec.ca/recherche/dataset/localisation-des-etablissements-d-enseignement-du-reseau-scolaire-au-quebec](https://www.donneesquebec.ca/recherche/dataset/localisation-des-etablissements-d-enseignement-du-reseau-scolaire-au-quebec)
- **Fichiers traités et données exactes :**
  - `es_universitaire.csv` : 24 universités québécoises (UQAM, Laval, UdeM, McGill, Concordia, Sherbrooke, HEC, Polytechnique, etc.).
  - `es_collegial.csv` : 333 collèges et cégeps (publics et privés subventionnés).
  - `pps_public_ecole.csv` : 182 centres de formation professionnelle (CFP) extraits du réseau public.
  - Attributs conservés : `institution_id` (`CD_ORGNS`), nom officiel, type (`CFP`, `Cégep`, `Université`), région administrative (01 à 17), municipalité/ville et URL du site web.
- **Destination :** Table Supabase `educational_institutions` (**539 établissements d'enseignement enregistrés**).
- **Mécanisme de mise à jour :**
  - Téléchargement automatisé via l'API CKAN de Données Québec.
  - Script : `trajektia/etl/meq_relance_ingestor.py` (Étape 2).
- **Calendrier prévisionnel :** Données Québec met à jour ce fichier annuellement. Prochaine synchronisation recommandée : **Automne 2026 / Hiver 2027**.

---

### 6. Enquête « La Relance » au Secondaire & au Collégial (MEQ / MES)

*La valeur marché réelle des diplômes québécois : salaires à l'embauche et insertion professionnelle.*

- **Organisme émetteur :** Gouvernement du Québec — Ministère de l'Éducation (MEQ) et Ministère de l'Enseignement supérieur (MES).
- **Plateforme :** Données Québec & Publications du Québec.
- **Millésime des données :**
  - Données ouvertes annuelles : 2011 à 2019 (série consolidée).
  - Données régionales quinquennales : 2013-2019.
  - Échantillon collégial/universitaire de référence : vagues 2023.
- **URL officielle :** [https://www.donneesquebec.ca/recherche/dataset/enquete-la-relance-au-secondaire-en-formation-professionnelle](https://www.donneesquebec.ca/recherche/dataset/enquete-la-relance-au-secondaire-en-formation-professionnelle)
- **Données exactes extraites :**
  - `relance_fp_2011_2019.csv` : **200 programmes de formation professionnelle (DEP/ASP)** + **20 programmes collégiaux/universitaires (DEC/BAC)**.
  - `SALR_HEBDO_BRUT_MOYEN_31_MARS_$` : Salaire hebdomadaire moyen à l'embauche (ex: 2 100 $/semaine en médecine, 1 752 $/semaine en extraction minière, 1 500 $/semaine en génie logiciel).
  - `EN_LIEN_AVEC_FORMT_31_MARS_%` : Taux de diplômés occupant un emploi directement relié à leur domaine d'études.
  - `relance_fp_region_2013_2019.csv` : Répartition géographique de l'offre et insertion par région administrative (**390 liens écoles-programmes**).
- **Liaison métiers :**
  - **964 associations certifiées** reliant les codes CNP aux programmes MEQ dans la table pivot `occupation_programs` (ex: DEP Électricité $\rightarrow$ CNP 72200 Électriciens, DEC Informatique $\rightarrow$ CNP 21232 Développeurs).
- **Destination :** Tables Supabase `educational_programs`, `program_institutions`, `occupation_programs`.
- **Mécanisme de mise à jour :**
  - Script ETL : `trajektia/etl/meq_relance_ingestor.py`.
- **Calendrier prévisionnel :** Les enquêtes La Relance sont publiées selon un cycle bisannuel. Le MEQ prépare la publication des séries ouvertes 2022-2024. **Vérification planifiée : Fin 2026**.

---

### 7. Domaines d'Études (CPE / CIP Canada 2021) & Critères PTPD (IRCC)

*La passerelle d'orientation internationale pour l'immigration et la rétention de talents.*

- **Organismes émetteurs :** 
  - Statistique Canada (Classification des programmes d'enseignement — CPE/CIP 2021)
  - Immigration, Réfugiés et Citoyenneté Canada (IRCC)
- **Millésime :** Directives IRCC 2024-2026 sur les catégories prioritaires du Permis de Travail Postdiplôme (PTPD / PGWP).
- **Données exactes :**
  - 25 séries de domaines standardisées (ex: 01 Agriculture, 11 Informatique, 14 Génie, 46 Métiers de la construction, 51 Santé).
  - Indicateur booléen `is_ptpd_eligible = TRUE` pour les 5 catégories économiques prioritaires nationales (Santé, STIM, Métiers spécialisés, Transport, Agroalimentaire).
- **Destination :** Table Supabase `cip_domains` (clé étrangère sur `educational_programs.cpe_code`).
- **Mise à jour :** Révision annuelle des catégories prioritaires par IRCC. Prochaine mise à jour en **janvier 2027**.

### 8. Données SST & Lésions Professionnelles (CNESST — Québec)

*La mesure empirique des risques physiques, ergonomiques et psychosociaux par secteur et métier.*

- **Organisme émetteur :** Commission des normes, de l'équité, de la santé et de la sécurité du travail (CNESST).
- **Plateforme :** Données Québec (`lesions-professionnelles`).
- **Millésime des données :** 2023 (114 345 lésions indemnisées analysées).
- **URL officielle :** [https://www.donneesquebec.ca/recherche/dataset/lesions-professionnelles](https://www.donneesquebec.ca/recherche/dataset/lesions-professionnelles)
- **Données exactes extraites :**
  - Référentiel des 7 risques SST : Troubles musculo-squelettiques (TMS), Surdité industrielle/bruit, Chutes de hauteur/plain-pied, Piégeage machines, Risques psychosociaux (stress/violence), Efforts excessifs, Substances chimiques/biologiques.
  - Statistiques macro consolidées sur **20 secteurs d'activité SCIAN** (taux de TMS jusqu'à 34.3%, surdité jusqu'à 12.3%, risques psy jusqu'à 18.5%).
  - **3 698 liaisons professionnelles** enregistrées dans `occupation_hazards` avec niveaux de prévalence et conseils de prévention ergonomique.
- **Destination dans le système :**
  - **Supabase :** Tables `occupational_hazards`, `cnesst_sector_stats`, `occupation_hazards`.
  - **Neo4j :** Nœuds `(:OccupationalHazard)` et **1 496 relations `[:HAS_RISK {risk_level: 'Élevé'}]`** pour les métiers à forte pénibilité.
- **Mécanisme de mise à jour :**
  - Script ETL : `trajektia/etl/cnesst_supabase_ingestor.py`.
- **Calendrier prévisionnel :** Données annuelles publiées au 4e trimestre de chaque année par la CNESST. **Prochaine mise à jour recommandée : Fin 2026 / Début 2027 (données 2024).**

---

### 9. Exigences Physiques, Contraintes Ergonomiques & DPC (EDSC / GC 2016)

*La quantification des charges maximales à soulever, des postures de travail, de la motricité et du modèle Données-Personnes-Choses pour l'évaluation de l'aptitude à l'emploi.*

- **Organisme émetteur :** Emploi et Développement Social Canada (EDSC) & Statistique Canada.
- **Plateforme de diffusion :** Portail du gouvernement ouvert (Données Ouvertes Canada).
- **Millésime :** Guide sur les carrières (GC 2016 v1.0) projeté sur la **CNP 2021 v1.0** via la table officielle de concordance Statistique Canada.
- **URL officielles :**
  - Dataset : [https://ouvert.canada.ca/data/fr/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f](https://ouvert.canada.ca/data/fr/dataset/eaaf7c87-8ffe-4d68-8110-91b533da2b6f)
  - Guide descriptif : [https://noc.esdc.gc.ca/CH/Description?view=_CHPhysAct](https://noc.esdc.gc.ca/CH/Description?view=_CHPhysAct)
- **Fichiers traités et données exactes :**
  - `guidesurlescarrieres-2016_fr_activitesphysiques.csv` (921 profils) :
    - Force requise : `S-1` ($< 5$ kg), `S-2` (5 à 10 kg), `S-3` (10 à 20 kg), `S-4` ($> 20$ kg).
    - Postures corporelles : `B-1` (Assis), `B-2` (Debout/marche), `B-3` (Courbé/accroupi/genoux), `B-4` (Grimper).
    - Coordination motrice : `L-0` (Non requise), `L-1` (Membres supérieurs), `L-2` (Coordination membres multiples).
    - Exigences sensorielles : `V-1` à `V-3` (Vision), `C-0` à `C-2` (Couleurs), `H-1` à `H-3` (Ouïe).
  - `guidesurlescarrieres-2016_fr_donneespersonneschoses.csv` (939 profils) :
    - Données (0-Synthétiser à 6-Comparer)
    - Personnes (0-Mentorat à 8-Non significatif)
    - Choses (0-Mise au point à 8-Non significatif)
  - `statcan_noc_2016_2021_concordance.csv` (585 paires de conversion certifiées Statistique Canada).
- **Destination dans le système :**
  - **Supabase :** Table `occupation_physical_demands` (**504 métiers enrichis** avec projection sur les axes de Prediger).
  - **Neo4j :** Propriétés directes sur **886 nœuds `(:Occupation)`** (`strength_code`, `max_weight_kg`, `body_position`, `dpc_summary`, `prediger_tp`).
  - **Moteurs Analytiques Opérationnels :**
    - `trajektia/analytics/ergonomics.py` : Évaluation d'aptitude, scoring de compatibilité et alertes récidives CNESST.
    - `trajektia/analytics/prediger_riasec_calibrator.py` : Calcul cartésien de Prediger, Indice de Cohérence Psychométrique (ICP) et détection des métiers hybrides.
- **Mécanisme de mise à jour :**
  - Script ETL : `trajektia/etl/physical_demands_dpc_ingestor.py`.
- **Calendrier prévisionnel :** Données historiques stables. Révision alignée sur les concordances décennales de Statistique Canada.

---

## 🔮 Sources Cadrées pour les Prochaines Phases

### 10. Compétences Vertes ESCO (Phase A4 ciblée)
- **Organisme émetteur :** Commission Européenne (Cedefop / ESCO).
- **Objectif :** Enrichir Neo4j uniquement des compétences liées à la transition écologique, l'efficacité énergétique, la gestion des déchets et la décarbonation.
- **Statut :** Cadré — Priorisé post-B4.

---

### 11. Titres Alternatifs & Synonymes Bilingues de Compétences (TCC 2025)
- **Organisme émetteur :** Emploi et Développement Social Canada (EDSC) / Données Ouvertes Canada.
- **Jeu de données :** Taxonomie des compétences et des capacités 2025 v1.0 (`alternatives-titles-skills-and-competencies-taxonomy-2023-version-1.0-en-fr.csv`).
- **URL officielle :** [https://ouvert.canada.ca/data/fr/dataset/618d2756-8c37-4f99-b184-8b3c1ef1b0f5](https://ouvert.canada.ca/data/fr/dataset/618d2756-8c37-4f99-b184-8b3c1ef1b0f5)
- **Objectif :** Alimenter la table `competency_synonyms` pour la recherche plein texte et la découverte sémantique dans le moteur de recherche d'orientation.
- **Statut :** Cadré (Phase B6).

---

### 12. Profils Ergonomiques Avancés BLS ORS (Haute Précision Réadaptation)
- **Organisme émetteur :** U.S. Bureau of Labor Statistics (USDOL / BLS).
- **Jeu de données :** Occupational Requirements Survey (ORS 2023-2025).
- **URL officielle :** [https://www.bls.gov/ors/factsheet/orsprofiles.htm](https://www.bls.gov/ors/factsheet/orsprofiles.htm)
- **Objectif :** Fournir aux conseillers en réadaptation et médecins conseils CNESST des distributions horaires précises (% moyen de la journée assis vs debout, fréquence de levage, poussée/traction en livres/kg) rattachées aux métiers canadiens via le crosswalk SOC-O*NET-CNP.
- **Statut :** Cadré (Phase B7).

---

### 13. Banque d'Items IPIP-50 (Big Five / OCEAN)
- **Auteurs & Origine :** Lewis R. Goldberg (1992, 1999) / Oregon Research Institute.
- **Plateforme & Licence :** International Personality Item Pool ([https://ipip.ori.org/](https://ipip.ori.org/)) — Domaine public libre de droits pour la recherche et les applications cliniques/éducatives.
- **Volumétrie & Données exactes :**
  - **50 items standardisés** mesurant les 5 domaines fondamentaux de la personnalité (10 items par dimension : Ouverture, Conscienciosité, Extraversion, Agréabilité, Névrosisme/Stabilité).
  - Clés d'inversion intégrées (23 items inversés pour neutraliser le biais d'acquiescement).
  - Échelle de Likert en 5 points (1=Pas du tout d'accord à 5=Tout à fait d'accord).
- **Destination :** `frontend-web/src/data/questions-psychometriques.ts` (moteur client web).
- **Statut :** Opérationnel en production. Instrument psychométrique stable et validé par des centaines d'études internationales.

---

### 14. O*NET Interest Profiler Short Form (Mini-IP / RIASEC)
- **Auteurs & Origine :** J. Rounds, R. Su, P. Lewis & D. Rivkin (2010) / National Center for O*NET Development & USDOL/ETA.
- **Plateforme & Licence :** O*NET Resource Center ([https://www.onetcenter.org/IP.html](https://www.onetcenter.org/IP.html)) — Outil public développé sous l'égide du Département du Travail des États-Unis.
- **Volumétrie & Données exactes :**
  - **60 activités de travail concrètes** (10 items pour chacun des 6 types de Holland : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel).
  - Échelle d'intérêt en 5 points (1=Je détesterais à 5=J'adorerais).
- **Destination :** `frontend-web/src/data/questions-psychometriques.ts` (moteur client web).
- **Statut :** Opérationnel en production. Corrélation démontrée ($r > 0.90$) avec la version longue de 180 items.

---

### 15. Valeurs de Travail & Satisfaction TWA (O*NET Work Values)
- **Auteurs & Origine :** R. Dawis & L. Lofquist (Theory of Work Adjustment, Univ. of Minnesota) / National Center for O*NET Development.
- **Plateforme & Fichier source :** `Work Values.txt` (via O*NET).
- **Volumétrie & Données exactes :**
  - **6 méta-besoins de satisfaction professionnelle** (Accomplissement, Indépendance, Reconnaissance, Relations, Soutien, Conditions de travail).
  - Profil de valeurs pré-calculé (0-100) pour 301 métiers du Québec.
  - Test interactif de 21 items basé sur le Work Importance Locator (WIL).
- **Liaison CNP :** Relié aux codes de la Classification Nationale des Professions via script de génération Python (301 profils ciblés).
- **Destination :** `frontend-web/src/data/valeurs-travail-metiers.ts` et `frontend-web/src/components/SatisfactionTest.tsx` (accessible via `/outils/test-satisfaction-valeurs`).
- **Statut :** Opérationnel en production. Calcul de l'Appariement des Valeurs (Needs-Reinforcer Fit) et intégration dans l'interface de résultats.

---

## 🗓️ Calendrier des Mises à Jour & Maintenance

```mermaid
gantt
    title Calendrier de Maintenance des Données Trajektia
    dateFormat  YYYY-MM
    section Données Québec & MEQ
    Enquête Relance 2022-2024 (MEQ)     :crit, 2026-11, 2027-01
    Établissements scolaires MEQ/MES    :2027-02, 2027-03
    section Données Fédérales (Canada)
    Salaires Guichet-Emploi 2026        :crit, 2027-01, 2027-02
    Révision PTPD / CIP (IRCC)          :2027-01, 2027-02
    SIPeC / OaSIS Révision mineure      :2027-03, 2027-04
    section Référentiels Internationaux
    O*NET v29.0 (USA)                   :2026-10, 2026-11
    ESCO v1.2 (Europe)                  :2026-12, 2027-01
```

---

## 🛠️ Commandes pour Vérifier et Relancer les Ingestions

```bash
# 1. Vérifier la configuration et l'accessibilité des sources
python trajektia/ckg/ckg_config.py

# 2. Rafraîchir O*NET (Logiciels & Outils)
python trajektia/ckg/ingestors/onet_tech_ingestor.py

# 3. Synchroniser Neo4j vers Supabase (Le Siphon)
python trajektia/etl/le_siphon.py

# 4. Rafraîchir les Formations MEQ et l'Enquête La Relance
python trajektia/etl/meq_relance_ingestor.py

# 5. Ingestion des Exigences Physiques & DPC (Guide des carrières 2016)
python trajektia/etl/physical_demands_dpc_ingestor.py

# 6. Test du Moteur d'Adéquation Ergonomique & Réadaptation CNESST
python trajektia/analytics/ergonomics.py

# 7. Test du Moteur de Calibration Psychométrique Prediger-RIASEC
python trajektia/analytics/prediger_riasec_calibrator.py

# 8. Audit d'intégrité en direct de la base Supabase
python trajektia/etl/check_db.py
```
