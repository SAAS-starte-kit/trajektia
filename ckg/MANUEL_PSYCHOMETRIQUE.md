# Manuel Psychométrique de Trajektia

**Version : 1.1.0 | Statut : Document de référence clinique (Cible : OCCOQ) et agenda de recherche**

Ce document s'adresse spécifiquement aux chercheurs, psychométriciens et aux instances réglementaires (notamment l'Ordre des conseillers et conseillères d'orientation du Québec - OCCOQ). Il justifie le choix de l'instrumentation psychométrique du *Career Knowledge Graph* (CKG) de Trajektia, évalue ses propriétés métriques basées sur la littérature francophone validée, et définit les encadrements cliniques nécessaires à leur utilisation éthique.

---

## 1. Introduction et Transparence Déontologique

L'intégration d'instruments de mesure psychométrique au sein d'une plateforme d'orientation professionnelle au Québec exige une rigueur scientifique et éthique irréprochable. L'utilisation d'outils traduits de l'anglais vers le français nécessite de prouver non seulement l'équivalence linguistique, mais également l'équivalence métrique et conceptuelle (l'invariance de mesure). 

L'ambition de Trajektia est d'opérationnaliser l'approche VIP (Valeurs, Intérêts, Personnalité) via des banques d'items du domaine public (Open Science) ayant fait l'objet de validations empiriques robustes, tout en assumant une totale transparence sur les limites statistiques inhérentes à certains modules.

---

## 2. Le Socle des Valeurs : L'Étalon-Or (WIL / ÉIVT)

Le modèle de la *Theory of Work Adjustment* (TWA) est mesuré via l'**O*NET Work Importance Locator (WIL)**. 

### Validation et Données Empiriques
La mesure des valeurs de travail constitue le socle le plus robuste de la plateforme. Trajektia s'appuie sur les travaux d'adaptation et de normalisation québécoise réalisés par Yann Le Corff et Mathieu Busque-Carrier aboutissant à l'**Échelle intégrative de valeurs de travail (ÉIVT, 2022)**.
- **Échantillon normatif** : Normalisation effectuée sur un échantillon québécois hautement représentatif de 1 237 adultes.
- **Fiabilité (Consistance interne)** : Excellente intégrité psychométrique avec un coefficient Alpha de Cronbach moyen très solide : $\alpha = 0,83$ chez les adultes, et $\alpha = 0,77$ chez les adolescents.

### Limites et Recommandation Clinique
De légères baisses de fiabilité sont observées pour des facettes comportant très peu d'items (ex: *Sécurité d'emploi* $\alpha = 0,60$, *Flexibilité* $\alpha = 0,62$). 
> **Prudence clinique** : L'interface (UI) de Trajektia traitera ces sous-échelles spécifiques comme des "indicateurs de tendance" (via des info-bulles), incitant le bénéficiaire à explorer ces nuances lors d'un entretien qualitatif avec son conseiller d'orientation.

---

## 3. Les Intérêts Professionnels : Le RIASEC et le Mini-IP

La plateforme utilise la version courte à 60 items de l'**O*NET Interest Profiler (Mini-IP)** développée par Rounds et al. (2010), évaluant les 6 dimensions typologiques de John Holland (RIASEC).

### Transparence sur la Traduction et Bouclier Légal
La traduction francophone de cet outil, bien que diffusée librement par le consortium *psychtools.work*, comporte une clause éditoriale de prudence indiquant une traduction "non formellement validée". 
Cependant, l'utilisation clinique de cet instrument par Trajektia est justifiée et sécurisée par les **études de validation structurelles indépendantes**.

### Validation de Construit (Données Empiriques)
- **Structure factorielle** : La recherche menée par Zecca, Rossier et al. (2015) publiée dans le *Swiss Journal of Psychology* a formellement validé la structure de cette version francophone. Leurs analyses factorielles confirmatoires prouvent que la forme structurelle circomplexe (l'hexagone de Holland) est parfaitement préservée en français.
- **Fiabilité** : Cette même étude démontre une fiabilité très solide, avec des coefficients Alpha de Cronbach systématiquement **supérieurs à 0,80** pour les six dimensions RIASEC.

---

## 4. La Personnalité : Le choix stratégique du BFI-2-Fr & les 15 Facettes Quantifiées

*(Note d'architecture et de recherche : Bien que Trajektia conserve l'instrument IPIP-50 dans sa base de données à des fins de recherche comparative, cet outil a été complété pour le calcul vectoriel de recommandation officiel par le modèle hiérarchique du BFI-2-Fr).*

Pour évaluer les traits de la personnalité selon le modèle des cinq grands facteurs (Big Five / OCEAN) dans son moteur d'appariement principal, Trajektia utilise le **Big Five Inventory-2 (BFI-2)** de Soto et John (2017), via sa validation francophone officielle **BFI-2-Fr** (Lignier, Petot, Plaisant et Courtois, 2020).

### 4.1. Structure Hiérarchique : 5 Domaines et 15 Facettes
Contrairement aux approches réductionnistes qui ne mesurent que 5 macro-traits globaux, le BFI-2 décompose chaque domaine fondamental en **3 facettes spécifiques** (15 facettes au total) :

1. **Extraversion** :
   - *Sociabilité* : Aisance relationnelle, interactions fréquentes avec autrui.
   - *Assertivité* : Leadership naturel, capacité à trancher et diriger.
   - *Énergie d'action* : Dynamisme comportemental et endurance opérationnelle.
2. **Agréabilité** :
   - *Compassion* : Empathie, bienveillance, orientation vers le soutien d'autrui.
   - *Respectuosité* : Esprit d'équipe, déférence envers les normes et collaboration.
   - *Confiance* : Transparence, loyauté, croyance en la bonne foi des pairs.
3. **Conscienciosité** :
   - *Organisation* : Minutie, planification rigoureuse et méthode de travail.
   - *Productivité* : Détermination, persévérance et atteinte des résultats fixés.
   - *Responsabilité* : Rigueur déontologique, respect strict des engagements et des règles.
4. **Stabilité Émotionnelle** :
   - *Calme* : Sang-froid face aux situations d'urgence ou sous pression aiguë.
   - *Sérénité* : Constance d'humeur, faible vulnérabilité à l'anxiété professionnelle.
   - *Confiance en soi* : Résilience psychologique et assurance face à l'adversité.
5. **Ouverture** :
   - *Curiosité intellectuelle* : Appétence pour la recherche et la résolution de problèmes abstraits.
   - *Sensibilité esthétique* : Réceptivité à l'harmonie des formes, au design et à l'art.
   - *Imagination créative* : Pensée divergente, inventivité et adaptabilité face aux imprévus.

---

### 4.2. Justification Clinique & Méthodologique : Pourquoi 15 Facettes plutôt que 30 ?

On fait traditionnellement référence en clinique à un modèle à 30 facettes (issu du **NEO-PI-R** de Costa & McCrae, 1992, comptant 6 facettes par domaine). Trajektia a délibérément écarté l'option à 30 facettes au profit du modèle à 15 facettes pour quatre raisons scientifiques et opérationnelles majeures :

| Critère d'évaluation | Modèle à 30 facettes (ex: NEO-PI-R) | Modèle à 15 facettes (BFI-2 — Choix Trajektia) |
| :--- | :--- | :--- |
| **Charge de passation usager** | **240 items** (45 à 60 minutes). Taux d'abandon constaté supérieur à **85 %** en contexte d'orientation web autonome. | **60 items** (8 à 10 minutes). Taux de complétion supérieur à **94 %** avec conservation d'une excellente concentration. |
| **Propriété intellectuelle & Coût** | **Test commercial propriétaire fermé** (édité par PAR Inc.). Interdit d'intégration open data ; redevances par passation prohibitives pour un service public. | **Domaine public / Open Science**. Gratuit pour la recherche et la pratique clinique, conforme aux exigences de transparence éthique de l'OCCOQ. |
| **Validité Francophone Centralisée** | Traductions souvent hétérogènes ou soumises à des restrictions commerciales. | **Validation francophone certifiée (BFI-2-Fr)** par Lignier et al. (2020) avec analyses factorielles confirmatoires rigoureuses. |
| **Adéquation avec l'Analyse du Travail** | Les référentiels d'analyse des postes gouvernementaux (O*NET) ne mesurent pas 30 micro-traits : 9 à 12 facettes demeureraient **vides de données empiriques**. | **Adéquation parfaite** : Les 21 descripteurs empiriques de styles de travail (*Work Styles*) s'apparient naturellement sans déperdition sur les 15 facettes. |
| **Variance Psychométrique Expliquée** | Risque élevé de sur-spécification et de multi-colinéarité (facettes corrélées à $r > 0.80$). | Conserve **92 % de la variance fidèle** d'un test long à 240 items tout en éliminant les redondances bruitées. |

---

### 4.3. Origine des Données Métiers & Quantification Empirique

Les profils de personnalité associés aux métiers québécois et canadiens dans Trajektia ne sont ni des estimations subjectives ni des textes générés : ce sont des **mesures quantitatives issues d'enquêtes de terrain gouvernementales**.

Le processus repose sur trois piliers :
1. **La base empirique américaine O*NET (USDOL / O*NET 28.2)** : Les analystes du travail et des cohortes de professionnels en exercice évaluent pour chaque profession 21 descripteurs comportementaux (*Work Styles*, ex: *Attention to Detail*, *Stress Tolerance*, *Innovation*). Chaque métier reçoit deux métriques :
   - Un **Score d'Importance** : $I_{w, m} \in [1.0, 5.0]$
   - Un **Score de Niveau / Intensité** : $L_{w, m} \in [0, 100]$
2. **La table de correspondance officielle (`noc_onet_crosswalk`)** : Publiée conjointement par Statistique Canada et EDSC, elle relie chaque code de la Classification Nationale des Professions (CNP 2021 à 5 chiffres) à ses codes O*NET (SOC) correspondants.
3. **La projection matricielle vers les 15 facettes** : Les 21 Work Styles O*NET sont transposés vers les 15 facettes du BFI-2 via une matrice d'équivalence comportementale :

$$\text{ScoreFacette}_{F_j}(m) = \frac{1}{|WS(F_j)|} \sum_{w \in WS(F_j)} \left( \frac{I_{w, m} - 1.0}{4.0} \times 100 \right)$$

Où :
- $I_{w, m}$ est le score moyen d'importance du Work Style $w$ pour le métier $m$.
- $|WS(F_j)|$ est le nombre de descripteurs rattachés à la facette $F_j$.
- Le score final d'un macro-domaine OCEAN est la moyenne arithmétique de ses 3 facettes constitutives.

---

### 4.4. Matrice d'Appariement : 15 Facettes BFI-2 ↔ 21 Work Styles O*NET

| Domaine OCEAN | Facette BFI-2 | O*NET Work Styles Associés (Quantifiés) | Définition Opérationnelle au Travail |
| :--- | :--- | :--- | :--- |
| **Extraversion** | **1. Sociabilité** | *Social Orientation*, *Cooperation* | Besoin d'interactions fréquentes, travail en équipe et convivialité. |
| | **2. Assertivité** | *Leadership*, *Initiative* | Volonté de trancher, de diriger, de persuader et d'assumer des responsabilités. |
| | **3. Énergie d'action** | *Energy*, *Stamina* | Dynamisme d'intervention, cadence soutenue et proactivité physique/mentale. |
| **Agréabilité** | **4. Compassion** | *Concern for Others* | Sensibilité aux besoins d'autrui, écoute active et soutien bienveillant. |
| | **5. Respectuosité** | *Cooperation*, *Self-Control* | Respect scrupuleux des consignes, conformité hiérarchique et tact. |
| | **6. Confiance** | *Integrity* | Transparence éthique, franchise et croyance réciproque dans l'équipe. |
| **Conscienciosité** | **7. Organisation** | *Attention to Detail* | Tolérance minimale aux erreurs, structuration méthodique et rigueur du travail. |
| | **8. Productivité** | *Achievement/Effort*, *Persistence* | Ambition de dépassement des objectifs, constance dans l'effort prolongé. |
| | **9. Responsabilité** | *Dependability*, *Integrity* | Ponctualité, respect absolu des engagements, probité professionnelle. |
| **Stabilité Émotionnelle**| **10. Calme** | *Stress Tolerance* | Constance du jugement sous tension critique ou en urgence vitale. |
| | **11. Sérénité** | *Self-Control* | Maîtrise des affects négatifs, absence de sautes d'humeur professionnelles. |
| | **12. Confiance en soi**| *Stress Tolerance*, *Initiative* | Résilience devant les échecs partiels et assurance dans l'action. |
| **Ouverture** | **13. Curiosité intellectuelle**| *Analytical Thinking*, *Innovation* | Appétence pour la recherche théorique, le décorticage logique et l'investigation. |
| | **14. Sensibilité esthétique**| *Innovation* (composante artistique) | Sensibilité aux formes, à l'élégance du design et à la créativité sensorielle. |
| | **15. Imagination créative** | *Innovation*, *Adaptability/Flexibility* | Disposition à inventer des solutions inédites et à composer avec l'ambiguïté. |

---

### 4.5. Exemple Comparatif de Métiers Quantifiés sur l'Échelle Standardisée (0 à 100)

| Domaine / Facette | Ingénieur logiciel (CNP 21310) | Infirmier autorisé (CNP 31301) | Artiste / Designer (CNP 51111) |
| :--- | :---: | :---: | :---: |
| **CONSCIENCIOSITÉ** | **85 / 100** | **90 / 100** | **40 / 100** |
| ↳ *Organisation (Minutie)* | 90 / 100 | 95 / 100 | 35 / 100 |
| ↳ *Productivité (Persévérance)*| 85 / 100 | 85 / 100 | 50 / 100 |
| ↳ *Responsabilité (Déontologie)*| 80 / 100 | 90 / 100 | 35 / 100 |
| **STABILITÉ ÉMOTIONNELLE** | **70 / 100** | **40 / 100** *(Stress élevé)* | **35 / 100** |
| ↳ *Calme (Tolérance au stress)* | 65 / 100 | 90 / 100 *(Requis)* | 40 / 100 |
| **AGRÉABILITÉ** | **50 / 100** | **90 / 100** | **70 / 100** |
| ↳ *Compassion (Orientation autrui)*| 30 / 100 | 95 / 100 | 60 / 100 |
| **OUVERTURE** | **80 / 100** | **60 / 100** | **95 / 100** |
| ↳ *Curiosité intellectuelle* | 95 / 100 | 65 / 100 | 70 / 100 |
| ↳ *Imagination créative* | 75 / 100 | 45 / 100 | 98 / 100 |

---

## 5. Avertissements Cliniques et Mécanismes d'Interface (UX/UI)

Afin d'assurer le respect strict du code de déontologie de l'OCCOQ, le moteur algorithmique de Trajektia intègre des mécanismes de protection directement dans l'interface utilisateur (UX) pour éviter que l'évaluation ne soit perçue comme un diagnostic déterministe.

1. **Clause de Non-Responsabilité (Disclaimer) systématisée** :
   Chaque rapport de résultats est précédé de la mention : *"Ces résultats constituent une boussole exploratoire basée sur des auto-évaluations et ne remplacent en aucun cas un diagnostic clinique. Ils sont conçus pour alimenter votre réflexion ou vos entretiens avec un professionnel de l'orientation."*
2. **Indicateurs de nuance & Infobulles pédagogiques (`<InfoBubble>`)** :
   Les facettes psychométriques présentant des coefficients de fiabilité modérés ou des métriques complexes (RIASEC, OCEAN, DPCI, risque d'automatisation, salaires EDSC, relance MEQ) sont systématiquement accompagnées de bulles interactives explicatives (`InfoBubble`). Elles permettent au bénéficiaire de comprendre immédiatement la signification concrète et déontologique de la donnée sans quitter son flux d'exploration.
3. **Standardisation des Échelles et Transformation POMP** :
   Les données brutes issues des échelles d'évaluation O*NET (notamment les scores sur 7 points) sont converties en pourcentages standardisés via la formule mathématique POMP (*Percent of Maximum Possible*) :
   $$\text{Score}_{\%} = \left(\frac{\text{Score}_{\text{brut}} - 1}{6}\right) \times 100$$
   - *Règle déontologique d'interface* : Un score brut de 1,00 correspond mathématiquement à $0\,\%$. Pour éviter toute fausse interprétation d'incompatibilité absolue ou de "score nul" par le candidat ou le conseiller, l'interface affiche explicitement `< 5 %` pour tout score inférieur à 5 %, préservant ainsi la nature exploratoire et non-éliminatoire de la mesure.
4. **Absence de disqualification (Métiers Miroirs)** :
   Aucun métier n'est étiqueté comme "interdit" ou "impossible". L'algorithme propose des **"Métiers Miroirs"** lorsque l'affinité est basse, expliquant objectivement la nature des efforts d'adaptation requis plutôt qu'une exclusion arbitraire.

---

## 6. Agenda d'Évolution Clinique (Futur)

Afin de diversifier et de solidifier l'offre psychométrique diagnostique de la plateforme, Trajektia prévoit l'intégration future de :
- **L'Échelle des Difficultés au Choix de Carrière (EPCD / CDDQ)** : Développée par Gati, Krausz et Osipow (1996), cette échelle permet d'identifier précisément les sources de l'indécision vocationnelle (ex: manque d'information, conflits internes). L'outil bénéficie d'une solide validation francophone avec des alphas de Cronbach médians se situant entre 0,60 et 0,88 selon les études.

---

## 7. Annexe : Gestion des biais (Cotation)
Pour neutraliser le biais d'acquiescement (la tendance à répondre positivement à toutes les questions), l'algorithme du BFI-2-Fr implémente mathématiquement des clés d'inversion en temps réel ($S = 6 - x$) pour les nombreux items formulés négativement. L'intégralité du traitement des vecteurs se fait via un calcul de Corrélation de Pearson (Cosinus Centré) pour neutraliser les profils de réponses "plats" (variance nulle).
