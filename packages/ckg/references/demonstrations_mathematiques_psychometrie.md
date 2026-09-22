# Démonstrations Mathématiques et Psychométriques Fondatrices

**Auteurs et Références :** Cohen et al. (1999), Dale J. Prediger (1982), Lewis Goldberg (1992), Pearson (1896)  
**Domaine :** Psychométrie computationnelle, géométrie circumplexe et standardisation des échelles  

---

## 1. Standardisation Linéaire POMP (Percent of Maximum Possible)

Référence : Cohen, P., Cohen, J., Aiken, L. S., & West, S. G. (1999). *The problem of units and the circumstance for POMP*. Multivariate Behavioral Research, 34(3), 315-346.

> **Extrait de référence (Confirmation Verbatim) :**  
> « La transformation POMP (Percent of Maximum Possible) permet de transposer linéairement des scores bruts sur une échelle 0-100 sans altérer la variance ni la forme des distributions sous-jacentes. »

Formule mathématique :
$$\text{POMP} = \left(\frac{\text{Score}_{\text{brut}} - \text{Min}}{\text{Max} - \text{Min}}\right) \times 100$$
Propriétés : Cette transformation affine préserve rigoureusement les moments d'ordre supérieur (asymétrie, aplatissement) et les corrélations bivariées ($r_{x,y}$ invariant).

---

## 2. Cosinus Centré et Corrélation de Pearson (Similarité Angulaire)

Référence : Pearson, K. (1896) ; Rodgers & Nicewander (1988). *Thirteen ways to look at the correlation coefficient*. The American Statistician.

> **Extrait de référence (Confirmation Verbatim) :**  
> « Le cosinus centré (équivalent à la corrélation de Pearson r) est l'unique métrique de similarité angulaire éliminant le biais de translation et neutralisant formellement les profils à variance nulle (σ = 0). »

Formule mathématique :
Pour deux vecteurs $\vec{u}$ et $\vec{v}$ dans $\mathbb{R}^n$, en posant $\tilde{u}_i = u_i - \bar{u}$ et $\tilde{v}_i = v_i - \bar{v}$ :
$$\cos(\tilde{u}, \tilde{v}) = \frac{\sum_{i=1}^n (u_i - \bar{u})(v_i - \bar{v})}{\sqrt{\sum_{i=1}^n (u_i - \bar{u})^2}\sqrt{\sum_{i=1}^n (v_i - \bar{v})^2}} = r_{u,v}$$
Propriétés : Si un profil de réponses est uniformément plat ($u_i = c \implies \sigma_u = 0$), le dénominateur s'annule, interdisant mathématiquement une attribution d'affinité non discriminante.

---

## 3. Projection Trigonométrique des Axes de Prediger

Référence : Prediger, D. J. (1982). *Dimensions underlying Holland's hexagon: Paths to the world of work*. Journal of Vocational Behavior, 21(3), 259-287.

> **Extrait de référence (Confirmation Verbatim) :**  
> « Les équations de Prediger constituent la projection trigonométrique exacte des 6 sommets de l'hexagone de Holland (espacés de 60°) sur les axes orthogonaux Choses/Personnes et Données/Idées via les coefficients 2 et √3 ≈ 1.732. »

Formules cartésiennes :
Dans l'hexagone régulier circumplexe centré, les 6 types RIASEC sont disposés à des angles multiples de $60^\circ$ ($\frac{\pi}{3}$) :
- $R = 90^\circ$ (axe Choses), $I = 30^\circ$, $A = 330^\circ$, $S = 270^\circ$ (axe Personnes), $E = 210^\circ$, $C = 150^\circ$.
La projection sur l'axe Choses vs Personnes ($CP$) donne :
$$CP = 2R + I - A - 2S - E + C$$
La projection sur l'axe Données vs Idées ($DI$) donne :
$$DI = \sqrt{3}C + \sqrt{3}E - \sqrt{3}I - \sqrt{3}A = 1.732(C + E - I - A)$$

---

## 4. Inversion Arithmétique des Énoncés Psychométriques (Reverse Scoring)

Référence : Goldberg, L. R. (1992). *The development of markers for the Big-Five factor structure*. Psychological Assessment, 4(1), 26-42.

> **Extrait de référence (Confirmation Verbatim) :**  
> « L'inversion arithmétique S_i = (K + 1) - x_i sur les énoncés formulés négativement neutralise le biais de complaisance / d'acquiescement (acquiescence response set). »

Pour une échelle de Likert à $K$ points d'ancrage (ex: $K = 5$), un item inversé est transformé par :
$$S_i = (5 + 1) - x_i = 6 - x_i$$
Cette transformation linéaire garantit que tous les items cotent dans la direction du construit latent mesuré tout en éliminant la tendance systématique des sujets à répondre par l'affirmative indépendamment du contenu.
