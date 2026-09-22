# Modélisation des Tensions Comportementales et Opportunités d'Épanouissement (TAT & PR-RSM)

Les données concernant les **tensions comportementales exactes** et les **opportunités d'épanouissement** proviennent du croisement entre un cadre théorique de psychologie organisationnelle (**la Trait Activation Theory**), deux bases de données psychométriques et taxonomiques précises (**l'IPIP-50** et **O*NET 30.1**), et une modélisation mathématique tridimensionnelle (**la Régression Polynomiale et Méthodologie des Surfaces de Réponse**) [1-3].

---

### 1. Le cadre théorique fondateur : La Trait Activation Theory (Tett & Burnett, 2003)

La conceptualisation des opportunités d'épanouissement et des tensions comportementales repose sur la **Théorie d'Activation des Traits** (*Trait Activation Theory* - TAT) développée par Robert P. Tett et Dawn D. Burnett (2003) [3, 4]. La TAT postule que les traits de personnalité sont latents et nécessitent des "déclencheurs" environnementaux pour s'exprimer sous forme de comportement au travail [3, 4].

La TAT catégorise les caractéristiques du poste en cinq types qui définissent l'adéquation Personne-Poste [4, 5] :
* **Les Exigences (*Demands*)** : Tâches requérant l'expression d'un trait (ex. : un poste de direction exige de l'Extraversion/Assertivité) [5, 6].
* **Les Distracteurs (*Distractors*)** : Éléments favorisant l'expression d'un trait qui nuit à la performance (ex. : un environnement social pour un employé très sociable dont le poste exige de la concentration solitaire) [5, 6].
* **Les Contraintes (*Constraints*)** : Éléments bloquant l'expression d'un trait lié à la performance (ex. : une bureaucratie stricte bridant l'Ouverture à l'expérience) [5, 6].
* **Les Libérateurs (*Releasers*)** : Éléments neutralisant une contrainte [5, 6].
* **Les Facilitateurs (*Facilitators*)** : Éléments amplifiant l'expression d'un trait pertinent [5, 6].

Dans Trajektia, les **"opportunités d'épanouissement"** correspondent aux situations où les exigences et facilitateurs du poste s'alignent avec les traits de l'usager [7, 8]. Les **"tensions comportementales"** émergent en présence de contraintes et de distracteurs majeurs [7, 8].

---

### 2. Le croisement des taxonomies : IPIP-50 (Individu) $\leftrightarrow$ O*NET 30.1 (Poste)

Pour opérationnaliser la TAT, le CKG confronte :
* Les facettes de personnalité de l'usager (via l'**IPIP-50**, mesurant le Big Five avec précision) [8, 9].
* Les exigences comportementales du poste (via les *Work Styles* d'**O*NET 30.1**) [8, 9].

*Par exemple* : Si la composante O*NET « Orientation Interpersonnelle » est élevée pour deux métiers, l'IPIP-50 permet de savoir si l'exigence du poste demande de l'**Assertivité/Dominance** (pour un vendeur) ou de la **Compassion/Altruisme** (pour un travailleur social) [9, 10]. Placer un individu fort en Compassion mais faible en Assertivité sur un poste de vente déclenchera des *distracteurs* et des *contraintes* selon la TAT : la pression d'imposer une vente sera perçue comme une violation de sa disposition naturelle à la bienveillance, générant une **tension comportementale aiguë** et un risque d'épuisement [9-11].

---

### 3. Modélisation via la Régression Polynomiale et Surfaces de Réponse (PR-RSM)

Il existe des données mathématiques et des résultats empiriques précis issus de la **Régression Polynomiale et des Surfaces de Réponse (PR-RSM)** pour analyser ces cas de prévention du burnout ou de réadaptation professionnelle [1-3]. Ces données incluent des résultats empiriques chiffrés et l'architecture algorithmique de l'adéquation Personne-Poste [1, 4, 5].

#### A. Données empiriques 1 : Étude de la satisfaction et confirmation des attentes ($N = 428$)

Modélisation de la satisfaction ($Z$) à partir des attentes initiales ($X$) et de l'expérience réelle ($Y$) [2, 3].
L'équation s'énonce : $Z = \beta_0 + \beta_1 X + \beta_2 Y + \beta_3 X^2 + \beta_4 XY + \beta_5 Y^2 + e$ [2, 3].
* Constante ($\beta_0$) = $4{,}693$
* Pente linéaire $X$ ($\beta_1$) = $0{,}055$ ($p < 0{,}05$)
* Pente linéaire $Y$ ($\beta_2$) = $0{,}533$ ($p < 0{,}0001$)
* Terme quadratique $X^2$ ($\beta_3$) = $-0{,}033$
* Terme d'interaction $XY$ ($\beta_4$) = $0{,}018$
* Terme quadratique $Y^2$ ($\beta_5$) = $0{,}046$

**Paramètres de surface :**
* Pente LOC ($a_1$) = $0{,}59$ ($p < 0{,}001$). L'alignement à un niveau élevé d'attentes et d'expérience augmente significativement la satisfaction.
* Pente LOIC ($a_3$) = $-0{,}48$ ($p < 0{,}001$). La satisfaction augmente lorsque l'écart s'oriente vers l'expérience ($Y > X$).

#### B. Données empiriques 2 : Modélisation psychologique dyadique ($n = 866$)

Évaluation de l'effet de la congruence entre l'agentivité perçue de soi ($X$) et du partenaire ($Y$) sur le bonheur ($Z$) (iSAHIB, Stanford) [1, 13, 14].
* Ajustement global : $R^2 = 0{,}079$ ($p < 0{,}001$) [1].
* $b_0 = 84{,}301$, $b_1 = -0{,}079$, $b_2 = -0{,}063$, $b_3 = -0{,}004$, $b_4 = 0{,}000$, $b_5 = -0{,}004$.
* Point stationnaire situé aux coordonnées centrées $X = -9{,}372$ et $Y = -7{,}96$, prédisant $Z = 84{,}92$.
* Pente LOC ($a_1$) = $-0{,}142$ ($p < 0{,}001$)
* Courbure LOIC ($a_4$) = $-0{,}009$ ($p < 0{,}001$, forme en U inversé)

#### C. Application au Career Knowledge Graph (CKG) de Trajektia

Dans Trajektia, ces équations polynomiales et tests de surface ($a_1$ à $a_4$) servent de matrice de calcul pour estimer l'adéquation Personne-Poste (*Person-Job Fit*) [4, 16, 17] :
* **Entrées** : $X$ correspond au score centré d'une facette IPIP-50 de l'usager, et $Y$ correspond au score d'exigence O*NET 30.1 du métier.
* **Sortie ($Z$)** : la valeur prédite quantifie la performance attendue, la satisfaction, ou le risque d'épuisement/strain (tensions comportementales).
* **Avantage** : Remplace les scores de différence absolue $|X - Y|$ qui masquent les contributions respectives de la personne et de l'environnement [18, 19].

*(Note : L'étude de Wild & Möhring (2026) sur $N=173$ en réadaptation mentionnait l'accord angulaire et la PR-RSM comme perspective [20, 21].)*
