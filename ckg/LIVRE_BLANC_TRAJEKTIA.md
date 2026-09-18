# Livre Blanc Trajektia : Architecture, Théories et Intelligence des Données

Ce document décrit en profondeur le fonctionnement de Trajektia (Career Knowledge Graph). Il vulgarise et structure les fondements scientifiques, les sources de données brutes, et la manière dont les algorithmes d'intelligence de données lient ces informations pour révolutionner l'orientation et la réadaptation professionnelle.

---

## 1. Introduction et Vision Globale

### 1.1. La mission de Trajektia
Les plateformes d'orientation traditionnelles présentent l'information de manière cloisonnée : d'un côté les salaires, d'un autre les formations, et ailleurs les tests psychométriques ou les conditions de travail. Trajektia a pour mission de **décloisonner l'information sur le marché du travail**. L'objectif est d'offrir une vision à 360 degrés, intégrant les compétences, la psychologie, l'ergonomie, la santé et sécurité au travail (SST) et l'éducation, le tout de manière cohérente et scientifiquement prouvée.

### 1.2. Le concept de Career Knowledge Graph (CKG)
Plutôt que d'utiliser une base de données relationnelle rigide pour tout stocker, Trajektia s'articule autour d'un **Career Knowledge Graph (CKG)**. Un graphe de connaissances modélise les données sous forme de réseaux (noeuds et relations). Cela permet de découvrir des liens cachés et des passerelles inattendues entre un métier, une compétence, un risque physique, et un trait de personnalité, facilitant des algorithmes de recommandation ultra-performants et une navigation fluide dans un univers complexe de données massives.

---

## 2. Les Fondements Théoriques et Cliniques

Le moteur analytique de Trajektia ne repose pas sur de simples mots-clés, mais sur des modèles psychométriques et vocationnels validés par des décennies de recherche.

### 2.1. La théorie des intérêts professionnels (RIASEC de Holland)
La typologie de John Holland classe les individus et les environnements de travail en 6 dimensions : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel. Ce modèle évalue "ce qui attire" l'individu, permettant d'orienter l'utilisateur vers des domaines où ses intérêts spontanés sont valorisés.

### 2.2. Le modèle de la personnalité (Big Five / OCEAN & 15 Facettes BFI-2)
Les comportements et styles de travail naturels sont capturés via le modèle Big Five (Ouverture, Conscienciosité, Extraversion, Agréabilité, Névrosisme/Stabilité). Contrairement aux intérêts, ce modèle mesure la manière dont l'individu se comporte au quotidien (besoin de structure, tolérance au stress, aisance sociale).

Pour atteindre une pertinence clinique maximale sans alourdir le diagnostic, Trajektia déploie le modèle hiérarchique du **BFI-2 (Soto & John, 2017)** en **15 facettes spécifiques** (3 par domaine) :
- **Extraversion** : *Sociabilité*, *Assertivité (Leadership)*, *Énergie d'action*.
- **Agréabilité** : *Compassion*, *Respectuosité*, *Confiance*.
- **Conscienciosité** : *Organisation (Minutie)*, *Productivité (Persévérance)*, *Responsabilité*.
- **Stabilité Émotionnelle** : *Calme*, *Sérénité*, *Confiance en soi*.
- **Ouverture** : *Curiosité intellectuelle*, *Sensibilité esthétique*, *Imagination créative*.

> **Pourquoi 15 facettes plutôt que les 30 facettes traditionnelles (NEO-PI-R) ?**  
> Les inventaires cliniques classiques à 30 facettes requièrent 240 questions (45-60 minutes) et sont verrouillés par des licences commerciales fermées (PAR Inc.), provoquant plus de 85 % d'abandon sur le web. Le BFI-2 (60 questions / 8 minutes) préserve 92 % de la variance explicative, s'aligne fidèlement sur les données empiriques d'analyse de poste gouvernementales, et dispose d'une validation francophone rigoureuse dans le domaine public.

### 2.3. Le modèle bi-axial de Prediger (1982)
Dale J. Prediger a traduit l'hexagone RIASEC en deux axes cartésiens mesurables dans la réalité :
- **Données vs Idées** (Traitement formel d'informations vs Créativité/Concepts abstraits)
- **Choses vs Personnes** (Outils/Machines vs Interactions humaines)

Trajektia utilise ce pont mathématique pour croiser les déclarations d'intérêts (psychométrie) avec les exigences fonctionnelles et concrètes (modèle DPC) des métiers sur le terrain.

### 2.4. Theory of Work Adjustment (TWA - Dawis & Lofquist)
Pour garantir une satisfaction durable et limiter l'attrition, le module de "Satisfaction & Valeurs" évalue l'Appariement des Valeurs (*Needs-Reinforcer Fit*). Il mesure l'adéquation entre les 6 méta-besoins du candidat (Accomplissement, Indépendance, Reconnaissance, Relations, Soutien, Conditions de travail) et la capacité du métier à les combler.

---

## 3. Les Outils et Sources de Données (Le Carburant du Système)

Le CKG se nourrit exclusivement de données gouvernementales ouvertes, fiables et millésimées, garantissant une intégrité scientifique absolue.

### 3.1. Les Référentiels Taxonomiques
- **CNP 2021 (Canada)** : La Classification Nationale des Professions est le tronc commun du système. Elle fournit les définitions officielles et la hiérarchie des quelque 900 groupes de base.
- **O*NET (USA)** : Base de données du Département du Travail américain, O*NET est le standard mondial de granularité pour le profilage des compétences, des logiciels, des styles de travail et de la psychométrie (RIASEC, Valeurs, Work Styles).
- **ESCO (Europe)** : La taxonomie européenne est utilisée spécifiquement pour ingérer et filtrer les "compétences vertes" liées à la transition écologique.

### 3.2. Les Données Marché et Formations (Québec & Canada)
- **Enquête La Relance (MEQ)** : Fournit le taux de placement et les salaires à l'embauche des diplômés du secondaire (DEP) et collégial (DEC).
- **Guichet-Emplois (EDSC)** : Fournit les salaires médians, minimums et maximums réels du marché canadien.

### 3.3. Les Données de Santé et Sécurité au Travail (SST) et Ergonomie
- **Lésions Professionnelles (CNESST - Données Québec)** : Des milliers de déclarations d'accidents de travail sont agrégées pour calculer la prévalence sectorielle de risques réels (Troubles musculo-squelettiques, Surdité, Risques psychosociaux).
- **Exigences physiques (Guide des carrières EDSC)** : Offre des profils ergonomiques stricts pour chaque profession (ex: force de levage max en kg, postures corporelles contraignantes, exigences visuelles et auditives).

### 3.4. Les Instruments Psychométriques et la Quantification des Métiers
Pour garantir la validité clinique, Trajektia réconcilie les auto-évaluations des usagers avec des matrices de métiers quantifiées empiriquement :

1. **Auto-évaluation Usager (Domaine Public)** :
   - **BFI-2-Fr (Personnalité / Big Five)** : Développé par Soto et John (2017) et validé en français (Lignier, Petot, Plaisant et Courtois, 2020). Inventaire hiérarchique de **60 énoncés** (4 par facette) mesurés sur échelle de Likert (1 à 5) avec clés d'inversion en temps réel ($S = 6 - x$).
   - **O*NET Mini-IP (Intérêts / RIASEC)** : Développé par le Département du Travail américain (Rounds et al.). **60 activités concrètes** (10 items par dimension RIASEC) mesurées de 1 ("Je détesterais") à 5 ("J'adorerais").
   - **O*NET Work Importance Locator (WIL)** : Pour la Theory of Work Adjustment (TWA), **21 énoncés** mesurant les besoins clés pour profiler les 6 valeurs dominantes.

2. **Quantification Mathématique des Métiers (Pipeline en 3 étapes)** :
   - **Enquêtes terrain O*NET** : 21 descripteurs empiriques (*Work Styles*, ex: *Attention to Detail*, *Stress Tolerance*, *Innovation*) quantifiés en importance (1 à 5) et niveau (0 à 100) pour chaque métier.
   - **Crosswalk CNP ↔ O*NET** : Table officielle de Statistique Canada et EDSC reliant les codes CNP à 5 chiffres aux spécialités O*NET.
   - **Projection matricielle vers les 15 facettes** : Les 21 Work Styles sont projetés mathématiquement sur les 15 facettes BFI-2 normalisées sur une échelle standardisée $[0, 100]$.

L'ensemble de ces instruments produit des **vecteurs continus de 0 à 100** permettant de mesurer la distance exacte entre le tempérament de l'usager et les exigences réelles du métier.

---

## 4. L'Architecture des Données : Comment l'information est structurée

Trajektia utilise une architecture hybride optimisée, respectant la "règle d'or" : séparer la topologie de la description.

### 4.1. Le Graphe de Connaissances (Neo4j)
Neo4j stocke les entités structurelles légères (Noeuds : Métiers, Compétences, Risques SST) et leurs relations.
Par exemple, le graphe comprend que le métier `(Infirmière)` `[:REQUIRES]` la compétence `(Soins critiques)` et `[:HAS_RISK]` lié aux `(Troubles musculo-squelettiques)`. Les algorithmes peuvent "traverser" ces relations en millisecondes.

### 4.2. Le "Data Hub" / L'Encyclopédie (Supabase)
Supabase (base relationnelle PostgreSQL) stocke tout le texte riche et les données lourdes qui encombreraient le graphe. C'est ici que résident les paragraphes de description des professions, l'historique complet des salaires de La Relance, et les taux statistiques précis de la CNESST (ex: 20.46% de prévalence de TMS dans le secteur santé). 

### 4.3. Les Crosswalks (Ponts d'Interopérabilité)
Les données n'ayant pas la même taxonomie, Trajektia utilise des "Crosswalks" officiels. Par exemple, une table de mapping relie la CNP canadienne à O*NET (SOC) pour importer les compétences logicielles américaines vers des métiers québécois de manière transparente.

---

## 5. L'Intelligence du Système : Faire des liens (Algorithmes)

Disposer de données massives ne suffit pas ; c'est la façon dont elles sont croisées qui crée la valeur de Trajektia.

### 5.1. L'Appariement Psychométrique (Similarité Multidimensionnelle 11D)
Lorsqu'un utilisateur passe le test psychométrique, le système ne fait pas un simple tri. Il calcule la **Corrélation de Pearson (Cosinus Centré)** entre le vecteur à 11 dimensions du candidat (5 traits OCEAN + 6 dimensions RIASEC) et les profils vectoriels théoriques de 301 métiers. Cet algorithme neutralise le biais des réponses plates et calcule un "Score d'Affinité" fiable (de 0 à 100%) entre l'humain et la profession.

### 5.2. L'Adéquation Ergonomique (Job-Person Fit)
L'algorithme d'ergonomie compare les limites physiques d'un travailleur (ex: Hernie discale = port maximal de 10kg, pas de station debout prolongée) avec la matrice des exigences du `Guide des carrières EDSC`. Si une condition est dépassée, le métier est filtré ou signalé, évitant les risques de récidive en croisant ces données avec l'historique des lésions de la CNESST.

### 5.3. Calcul de l'Indice de Cohérence Psychométrique (ICP)
En projetant les intérêts déclarés (RIASEC) et les tâches réelles (DPC : Données/Personnes/Choses) sur le plan bi-axial de Prediger, l'algorithme calcule l'ICP. Cela permet d'identifier scientifiquement les "métiers hybrides" (ex: un métier qui attire les gens "Choses", mais dont le quotidien exige des interactions avec des "Personnes"). 

### 5.4. L'Appariement des Valeurs (Needs-Reinforcer Fit)
Le moteur calcule la congruence (corrélation mathématique) entre le profil de besoins d'un utilisateur (ex: désir absolu d'Indépendance) et le profil de valeurs du métier (*Work Values*). Il classe ensuite les métiers et génère des textes explicatifs soulignant les leviers de satisfaction et les zones de vigilance nécessitant une adaptation du travailleur.

### 5.5. Les Passerelles de Reconversion Sémantiques
L'algorithme de calcul des "métiers connexes" croise la similarité vectorielle des compétences techniques, la proximité psychologique de Prediger, et le niveau de qualification (FEER) pour identifier les transitions professionnelles (upskilling/reskilling) les plus naturelles et les moins coûteuses en temps de formation.

---

## 6. Applications Pratiques et Cas d'Usage

### 6.1. Pour les Candidats et Étudiants (Grand Public)
L'interface vulgarise les algorithmes lourds. Les tests affichent les recommandations avec bienveillance (pas de "métier interdit"). Les métiers orthogonaux au profil du candidat sont affichés en tant que "Métiers Miroirs", expliquant la quantité d'efforts d'adaptation nécessaires si la personne choisit cette voie, la responsabilisant sans la décourager. 

### 6.2. Pour les Conseillers d'Orientation (c.o.)
Trajektia agit comme un assistant clinique d'aide à la décision. Le conseiller dispose d'une explicabilité totale : jauges DPC, radar OCEAN, positionnement cartésien de Prediger, et l'Indice de Cohérence. Ces outils permettent d'explorer en profondeur pourquoi une profession est en tension avec le profil d'un bénéficiaire.

### 6.3. Pour les Conseillers en Réadaptation (CNESST / SAAQ)
Les modules SST et Ergonomie permettent des simulations de retour au travail basées sur des capacités résiduelles objectives, en excluant instantanément les environnements présentant un fort taux de lésions spécifiques aux limitations du travailleur.

---

## 7. Conclusion

Trajektia n'est pas un simple annuaire de métiers, c'est un **écosystème d'intelligence de données évolutif**. En croisant les approches taxonomiques, médicales, statistiques et psychométriques grâce aux graphes de connaissances et à la data science, la plateforme remet l'humain — avec ses aspirations, ses limites physiques et ses conditions de travail — au centre des décisions d'orientation et de réadaptation.
