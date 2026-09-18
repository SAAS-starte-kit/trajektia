# 🛡️ Trajektia — Méthodologie d'Évaluation des Risques Professionnels & Santé-Sécurité (SST / CNESST)
**Version : 1.0.0 | Date de rédaction : Septembre 2026 | Statut : Document de référence scientifique et produit**

---

## 🎯 1. Contexte et Philosophie d'Orientation Éclairée

### Pourquoi intégrer la santé et la sécurité au travail dans Trajektia ?
Traditionnellement, les plateformes d'orientation professionnelle se limitent aux salaires, aux compétences et aux débouchés scolaires. Elles ignorent un pan fondamental de la vie active : **l'impact physique, ergonomique et mental des métiers**.

Trajektia adopte une démarche d'**orientation éclairée et responsable** :
- Permettre aux jeunes, aux personnes en reconversion et aux chercheurs d'emploi de connaître la réalité du terrain avant de s'engager.
- Mettre en valeur la **prévention ergonomique** dès le choix de carrière plutôt que de découvrir la pénibilité une fois en poste.
- Guider les personnes ayant des restrictions médicales préexistantes (ex: hernie discale, acouphènes, intolérance au stress aigu) vers des environnements compatibles.

---

## 📊 2. Source des Données Brutes (Données Ouvertes du Québec)

Toutes les statistiques de base sont issues du portail officiel **Données Québec** :
- **Organisme émetteur :** Commission des normes, de l'équité, de la santé et de la sécurité du travail (CNESST).
- **Jeu de données :** *Lésions professionnelles* (ensemble des accidents du travail et maladies professionnelles indemnisés au Québec).
- **Millésime utilisé :** Année complète 2023.
- **Volumétrie :** **114 345 dossiers individuels réels** de lésions acceptées.
- **Licence :** Creative Commons avec attribution (CC-BY 4.0 - Gouvernement du Québec).
- **URL source :** [https://www.donneesquebec.ca/recherche/dataset/lesions-professionnelles](https://www.donneesquebec.ca/recherche/dataset/lesions-professionnelles)

### Les indicateurs officiels de la CNESST exploités :
Chaque ligne du fichier source correspond à un accident indemnisé comportant :
1. `SECTEUR_SCIAN` : L'industrie d'appartenance de l'employeur (selon la classification SCIAN 2022).
2. `IND_LESION_TMS` (`OUI` / vide) : Trouble musculo-squelettique (ergonomie, charges, répétition).
3. `IND_LESION_SURDITE` (`OUI` / vide) : Surdité professionnelle (exposition au bruit continu).
4. `IND_LESION_MACHINE` (`OUI` / vide) : Accident impliquant un équipement mécanique ou une machine.
5. `IND_LESION_PSY` (`OUI` / vide) : Lésion psychologique (harcèlement, agression, stress aigu, burn-out).
6. `GENRE` : Mécanisme précis de l'accident (ex: `EFFORT EXCESSIF`, `CHUTE D'UNE HAUTEUR`, `VOIES DE FAIT`).
7. `SIEGE_LESION` : Partie du corps atteinte (ex: `DOS, COLONNE VERTEBRALE`, `SYSTEMES CORPORELS`, `OREILLE(S)`).

---

## 📐 3. Formules Mathématiques & Calculs Statistiques

Pour chaque secteur industriel québécois, Trajektia calcule la **fréquence relative d'incidence** selon la formule épidémiologique standard :

$$\text{Prévalence du Risque } X \text{ dans le Secteur } S = \left( \frac{\text{Nombre de lésions de type } X \text{ dans le secteur } S}{\text{Nombre total de lésions enregistrées dans le secteur } S} \right) \times 100$$

### Données réelles consolidées par le moteur Trajektia (Données 2023) :

| Grand Secteur SCIAN | Lésions Totales | TMS (%) | Surdité (%) | Machines (%) | Psychosocial (%) | Mécanisme Dominant (`GENRE`) | Siège Corporel Dominant |
|:---|---:|:---:|:---:|:---:|:---:|:---|:---|
| **Soins de santé et assistance sociale** | 34 944 | **20.46%** | 0.08% | 1.08% | **6.73%** | Exposition substances / Efforts | Systèmes corporels / Dos |
| **Fabrication de biens durables** (usinage, métal) | 10 547 | **28.48%** | **12.34%** | **8.97%** | 0.74% | Effort excessif / Frappé | Dos / Oreilles / Doigts |
| **Construction** | 9 590 | **25.78%** | **8.51%** | **6.48%** | 0.67% | Effort excessif / Chutes (**18.0%**) | Dos / Genoux |
| **Fabrication de biens non durables** (agro, bois) | 7 540 | **34.34%** | **10.25%** | **9.55%** | 0.82% | Effort excessif / Coincement | Dos / Doigts |
| **Commerce de détail** | 7 266 | **33.32%** | 2.55% | 4.50% | 2.17% | Effort excessif / Chute plain-pied | Dos / Chevilles |
| **Services d'enseignement** | 5 803 | 14.08% | 2.22% | 1.22% | **18.52%** | Voies de fait / Stress / Chute | Tête / Systèmes corporels |
| **Transport et entreposage** | 5 739 | **24.57%** | 5.21% | 3.01% | **6.92%** | Effort excessif / Chute du véhicule | Dos / Épaules |
| **Administrations publiques** | 5 155 | 18.23% | 4.40% | 2.13% | **13.89%** | Stress aigu / Choc traumatique | Systèmes corporels |

---

## 🌉 4. La Passerelle : Du Secteur (SCIAN) à la Profession (CNP)

### Le défi méthodologique :
Les déclarations d'accidents de la CNESST identifient l'**entreprise** par son code d'industrie (SCIAN), mais ne mentionnent pas le titre de poste individuel (CNP) pour des raisons de confidentialité des dossiers médicaux.

### La solution Trajektia en deux niveaux :

```
             ┌─────────────────────────────────────────────────────────┐
             │       Profession Canadienne : Code CNP à 5 chiffres     │
             └───────────────────────────┬─────────────────────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
       [NIVEAU 1 : GROUPE MAJEUR]                 [NIVEAU 2 : SURCHARGE MÉTIER]
       Attribution selon le 1er chiffre           Règles de haute précision pour
       de la CNP vers le secteur SCIAN            les professions spécifiques :
       ex: 3xxxx -> Santé                         - Couvreur/Charpentier -> Chute 28%
       ex: 4xxxx -> Éducation                     - Pompier/Policier -> Psy 14%
       ex: 7xxxx -> Construction/Usinage          - Soudeur -> Fumées/Substances 15%
```

1. **Niveau 1 — Rattachement structurel par grand groupe CNP :**
   - `CNP 3xxxx` *(Santé)* $\rightarrow$ Secteur « Soins de santé et assistance sociale »
   - `CNP 4xxxx` *(Éducation, droit)* $\rightarrow$ Secteur « Services d'enseignement » et « Administrations publiques »
   - `CNP 7xxxx` *(Métiers et machinerie)* $\rightarrow$ Secteurs « Construction » et « Fabrication »
   - `CNP 8xxxx` *(Ressources naturelles, agriculture)* $\rightarrow$ Secteur « Agriculture » et « Forêt »
   - `CNP 9xxxx` *(Opérateurs industriels)* $\rightarrow$ Secteur « Fabrication »

2. **Niveau 2 — Surcharges de haute fidélité par mot-clé métier :**
   Pour les métiers ayant des facteurs de risque atypiques par rapport à leur grand secteur, une règle de granularité fine est appliquée :
   - *Couvreurs, monteurs de charpentes, échafaudeurs* : Le risque **Chutes de hauteur** est surclassé à `Élevé` (prévalence de 28%).
   - *Soudeurs, métallurgistes* : Le risque **Exposition aux fumées et rayonnement** est surclassé à `Élevé` (prévalence de 15%).
   - *Policiers, ambulanciers, pompiers* : Le risque **Stress traumatique (PSY)** est surclassé à `Élevé` (prévalence de 14%).
   - *Camionneurs et conducteurs* : Le risque **Vibrations et postures statiques (TMS)** est surclassé à `Élevé` (prévalence de 24.6%).

---

## ⚖️ 5. Grille Objective d'Évaluation du Niveau de Risque

Pour éviter toute subjectivité, le qualificatif (`Élevé`, `Moyen`, `Faible`) est déterminé selon le **facteur de sur-exposition par rapport à la moyenne générale du Québec** :

$$\text{Facteur de Sur-exposition} = \frac{\text{Taux du secteur}}{\text{Moyenne provinciale tous secteurs}}$$

| Facteur de Risque | Moyenne Provinciale QC | Seuil « Risque Élevé » | Seuil « Risque Moyen » | Justification Statistique |
|:---|:---:|:---:|:---:|:---|
| **Risques Psychosociaux (PSY)** | **2.1%** | **> 5.0%** | 2.0% à 5.0% | En enseignement (18.5%), le taux est **près de 9 fois supérieur** à la moyenne provinciale. En santé (6.7%), il est plus de **3 fois supérieur**. |
| **Surdité / Bruit (SURDITE)** | **1.5%** | **> 6.0%** | 2.0% à 6.0% | En fabrication/usinage (12.3%), le risque de dommage auditif est **8 fois supérieur** à la moyenne. |
| **Machines / Outillage (MACHINE)** | **3.0%** | **> 6.0%** | 2.5% à 6.0% | En métallurgie et usinage (9.0%), le risque de happement et coupure est **3 fois supérieur**. |
| **Chutes (CHUTE)** | **8.0%** | **> 15.0%** | 8.0% à 15.0% | Dans la construction (18.0%), les chutes constituent la 1ère cause de traumatismes graves. |
| **TMS (Troubles musculaires)** | **21.0%** | **> 20.0%** | 10.0% à 20.0% | Présent transversalement mais particulièrement aigu en fabrication (34.3%), commerce (33.3%) et santé (20.5%). |

---

## 🛡️ 6. Conseils de Prévention et Formulation Positive

L'objectif de Trajektia n'est jamais de dramatiser ni de décourager l'accès à une profession, mais d'outiller le candidat. C'est pourquoi chaque risque est systématiquement assorti :
1. De sa **cause concrète** identifiée dans les données de la CNESST (ex: *manutention manuelle de patients*, *travaux sur échelles*, *bruit continu des tours CNC*).
2. D'un **conseil de prévention homologué** issu des guides de la CNESST et de l'IRSST (Institut de recherche Robert-Sauvé en santé et en sécurité du travail) :
   - *Utilisation d'équipements mécaniques (lève-personnes, ponts roulants)*.
   - *Application rigoureuse du cadenassage*.
   - *Port d'EPI certifiés (coquilles antibruit, harnais ancré, chaussures antidérapantes)*.
   - *Gestion des temps de pause et décompression*.

---

## 📝 7. Modèles de Textes Prêts à l'Emploi pour le Site Web

Ces textes peuvent être réutilisés directement sur l'interface utilisateur pour répondre aux questions des visiteurs :

### Format Court (Info-bulle / Tooltip UI)
> **D'où viennent ces indicateurs de risques ?**
> Ces données sont calculées par Trajektia à partir des **114 345 lésions professionnelles réelles indemnisées par la CNESST au Québec en 2023**. Les pourcentages indiquent la proportion de ce risque dans les accidents déclarés pour ce secteur d'activité, et le niveau (*Élevé / Moyen / Faible*) reflète la sur-exposition du métier par rapport à la moyenne provinciale québécoise.

### Format Moyen (Encadré « Méthodologie » sur la Fiche Métier)
> **Comprendre le profil santé et sécurité de ce métier**
> Dans le cadre de sa mission d'orientation transparente, Trajektia croise les fiches métiers (CNP) avec la base de données ouverte des accidents du travail de la CNESST.
> - **Le pourcentage** représente la part réelle de ces accidents constatée par les inspecteurs de la CNESST dans cette industrie au Québec.
> - **La mention [Élevé]** signale que les travailleurs de cette discipline sont significativement plus exposés à ce facteur que l'ensemble des travailleurs québécois.
> - **La prévention :** La quasi-totalité de ces risques peut être éliminée ou maîtrisée grâce aux équipements de protection (EPI), à l'aménagement ergonomique des postes et aux procédures de sécurité enseignées dans les programmes de formation québécois.

### Format Complet (Page Méthodologie / Documentation Publique)
> Vous pouvez copier-coller l'intégralité des sections 2, 3 et 5 de ce document pour alimenter la page de transparence méthodologique de la plateforme Astro/Directus.

---

## ♿ 8. Passerelle Ergonomie & Réadaptation Professionnelle (Évaluation d'Aptitude CNESST / c.o.)

### 8.1 Le modèle bifocal Trajektia en réadaptation
Pour les **conseillers d'orientation (c.o.)**, les **conseillers en réadaptation** et les **médecins-conseils de la CNESST/CSST**, l'évaluation de l'aptitude à l'emploi requiert deux regards complémentaires :
1. **Le volet rétrospectif (Risques Lésionnels CNESST)** : Quelle est l'accidentologie constatée dans l'industrie (accidents, TMS, chutes, surdité) ?
2. **Le volet prospectif intrinsèque (Exigences Physiques EDSC GC 2016)** : Quelles sont les contraintes physiques minimales incontournables du métier (charges à soulever, postures, motricité, sens) ?

```
┌───────────────────────────────────────────────┐
│     DOSSIER DU CANDIDAT / TRAVAILLEUR LÉSÉ    │
│  Limitations fonctionnelles médicales (LFT/P) │
│  ex: Port de charge <= 10 kg, pas de torsion  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│         MOTEUR D'ADÉQUATION TRAJEKTIA         │
│                                               │
│  [FILTRE 1 : EXCLUSION MÉDICALE STRICTE]     │
│  Si Force requise (S-3, S-4) > Capacité       │
│  → Métier DISQUALIFIÉ                         │
│                                               │
│  [FILTRE 2 : COMPATIBILITÉ POSTURALE]        │
│  Si restriction rachis et Posture = B-3/B-4   │
│  → Alerte "Postures contraignantes"           │
│                                               │
│  [FILTRE 3 : VIGILANCE RÉCIDIVE CNESST]       │
│  Si antécédent TMS dos et Taux TMS ind. > 25% │
│  → Alerte "Secteur à risque de récidive élevé"│
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│  DIAGNOSTIC D'APTITUDE / EMPLOIS CONVENABLES  │
│  • Emplois immédiatement convenables          │
│  • Emplois convenables avec adaptation poste │
│  • Emplois contre-indiqués                    │
└───────────────────────────────────────────────┘
```

### 8.2 Matrice des critères d'adéquation fonctionnelle (GC 2016)

| Dimension | Cotation officielle | Seuil / Plafond admissible | Impact réadaptation / CNESST |
|:---|:---:|:---|:---|
| **Effort / Levage** | `S-1` (< 5 kg)<br>`S-2` (5 à 10 kg)<br>`S-3` (10 à 20 kg)<br>`S-4` (> 20 kg) | Plafond strict défini par le médecin traitant ou l'ergothérapeute. | Élimination directe si le travailleur ne peut excéder 10 kg et que le métier est coté `S-3` ou `S-4`. |
| **Posture corporelle** | `B-1` (Assis)<br>`B-2` (Debout/marche)<br>`B-3` (Courbé/accroupi)<br>`B-4` (Grimper) | Capacité de station assise ou debout alternée. | Contre-indication formelle pour hernies discales non consolidées sur `B-3`. |
| **Coordination motrice** | `L-0` (Non requise)<br>`L-1` (Membres sup.)<br>`L-2` (Membres multiples) | Atteinte membre supérieur / syndrome du canal carpien. | Adaptation ou exclusion des métiers exigeant une motricité fine continue `L-1`/`L-2`. |
| **Vision & Audition** | `V-1` à `V-3`<br>`H-1` à `H-3` | Déficits sensoriels consécutifs à un accident de travail. | Orientation vers des environnements de travail adaptés et sécurisés. |

### 8.3 Rapprochement avec le modèle DPC et Prediger
Pour compléter le bilan, le modèle **Données, Personnes, Choses (DPC)** et la projection sur les **axes de Prediger** permettent d'orienter le travailleur vers des métiers qui respectent à la fois ses capacités physiques réduites et ses intérêts vocationnels profonds, maximisant les chances de succès d'une réaffectation durable.

### 8.4 Implémentation du Moteur Opérationnel (`trajektia/analytics/ergonomics.py`)

Le moteur d'évaluation d'aptitude est programmé dans `trajektia/analytics/ergonomics.py`. Il est interrogeable en direct ou via API backend :

```python
from trajektia.analytics.ergonomics import evaluate_candidate_fit

# Exemple : Travailleur lésé suite à une hernie discale L5-S1
candidate_profile = {
    "max_weight_kg": 10,                 # Seuil strict : max 10 kg
    "spine_restriction": True,           # Restriction rachidienne formelle
    "limb_coordination_max": "L-1",      # Motricité standard
    "vision_min": "V-1",
    "colour_discrimination": False,
    "hearing_min": "H-1",
    "medical_antecedents": ["TMS"]       # Antécédent de lésion musculo-squelettique
}

# Évaluation sur un métier de manutention ou de santé
result = evaluate_candidate_fit(candidate_profile, "72200")
```

**Structure de la décision générée :**
- **`fit_score` (0-100%) :** Score de compatibilité biomécanique prenant en compte les écarts de charge et de posture.
- **`status` :**
  - `Parfaitement compatible` (Score $\ge 85\%$)
  - `Compatible avec adaptations mineures` ($60\% \le \text{Score} < 85\%$)
  - `Contre-indiqué` (Score $< 60\%$ ou disqualification médicale stricte)
- **`reasons` :** Liste explicite des causes d'exclusion ou de pénalités (ex: *"Charge requise (20 kg) excède la capacité tolérée (10 kg)"*).
- **`cnesst_alerts` :** Détection automatique d'un risque élevé de récidive si la prévalence sectorielle de la lésion antérieure est $\ge 25\%$ (données réelles `occupation_hazards`).
- **`recommended_preventions` :** Conseils de prévention et équipements d'assistance homologués CNESST / IRSST.

---

## 🧠 7. Pont Méthodologique : Risques SST, Santé Mentale & Profils Psychométriques

Trajektia croise l'analyse des risques SST avec les profils psychométriques issus du test d'orientation :

1. **Risques Psychosociaux & Stabilité Émotionnelle (Big Five — Névrosisme)** :
   - Les secteurs à fort taux de lésions psychologiques (Enseignement : 18.52%, Administrations publiques : 13.89%, Soins de santé : 6.73%) requièrent une résilience émotionnelle élevée et une bonne maîtrise du stress aigu.
   - Les commentaires narratifs de restitution soulignent avec bienveillance si un métier à fort stress relationnel demande une stratégie proactive de préservation du bien-être pour les personnes ayant une sensibilité émotionnelle vive.

2. **Exigences Physiques & Intérêts Réalistes (RIASEC — Pôle R)** :
   - Les métiers à fort taux de TMS (Fabrication non durable : 34.34%, Commerce : 33.32%, Métallurgie : 28.48%, Construction : 25.78%) s'adressent à des profils à forte dominante Réaliste (R).
   - L'algorithme d'orientation valorise l'adéquation ergonomique préventive pour éviter que l'enthousiasme vocationnel ne conduise à des lésions d'usure précoce.


