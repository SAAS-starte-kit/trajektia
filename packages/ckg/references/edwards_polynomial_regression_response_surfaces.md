# Modélisation Non-Linéaire Personne-Poste — Edwards (1994, 2002)

**Auteurs :** Jeffrey R. Edwards & Mark E. Parry (1993) ; Jeffrey R. Edwards (1994, 2002)  
**Titre :** *On the use of polynomial regression equations as an alternative to difference scores in organizational research*  
**Revues :** Academy of Management Journal ; Organizational Behavior and Human Decision Processes  

---

## Fondements et Résultats Empiriques (PR-RSM)

L'évaluation de l'adéquation Personne-Poste via des scores de différence absolue $|X - Y|$ ou algébrique $(X - Y)$ souffre de limitations méthodologiques sévères : réduction artificielle de la variance, hypothèses implicites de contraintes non testées et incapacité à distinguer la sous-utilisation du surmenage.

> **Extrait de référence (Confirmation Verbatim) :**  
> « La régression polynomiale combinée à l'analyse des surfaces de réponse (PR-RSM) surpasse les scores de différence absolue en modélisant de manière asymétrique et non-linéaire la sous-utilisation des compétences versus la surcharge de travail. »

### Équation Polynomiale Quadratique Complète
$$Z = \beta_0 + \beta_1 X + \beta_2 Y + \beta_3 X^2 + \beta_4 XY + \beta_5 Y^2 + e$$

Où :
- $X$ représente les caractéristiques ou compétences de la personne (P),
- $Y$ représente les exigences ou caractéristiques du poste (E),
- $Z$ représente l'issue évaluée (satisfaction, performance, épuisement émotionnel).

### Analyse des Lignes de Congruence (LOC) et d'Incongruence (LOIC)
- **Ligne de Parfaite Congruence (LOC, $X = Y$) :** Permet d'évaluer si l'issue $Z$ augmente lorsque les compétences et les exigences s'élèvent conjointement ($a_1 = \beta_1 + \beta_2$).
- **Ligne d'Incongruence (LOIC, $X = -Y$) :** Révèle la courbure ($a_4 = \beta_3 - \beta_4 + \beta_5$) et l'asymétrie ($a_3 = \beta_1 - \beta_2$). La courbure négative significative ($a_4 < 0$) démontre que l'incongruence dégrade la satisfaction, tandis que $a_3 \neq 0$ prouve l'asymétrie entre la sous-charge ($X > Y$) et la surcharge ($X < Y$).
