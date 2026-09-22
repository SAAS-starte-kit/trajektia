# Rapport d'Audit des Preuves Scientifiques - PaperQA2 (Ollama)

**Date d'audit:** 2026-09-19
**Modèle LLM:** qwen3:8b
**Modèle d'embedding:** bge-m3

## Résumé Exécutif

Cet audit vérifie **12 affirmations scientifiques** fondatrices de Trajektia contre les documents locaux.

### Méthodologie

1. **Ingestion**: Documents PDF et Markdown depuis `ckg/references/`
2. **Vérification**: Requêtes Ollama locales avec exigence de citation verbatim
3. **Souveraineté**: 100% local - aucun appel aux API externes (OpenAI, Anthropic, etc.)

---


## Résultats Détaillés

### Statistiques Globales

| Statut | Nombre |
|:--------|--------:|
| ✅ VÉRIFIÉ | 12 |
| ⚠️ PARTIEL | 0 |
| ❌ NON VÉRIFIÉ | 0 |
| 🚫 SOURCE ABSENTE | 0 |
| 💥 ERREUR | 0 |

### ✅ bigfive_onet_workstyles

**Catégorie:** Psychométrie

**Affirmation:** Les descripteurs comportementaux O*NET (Work Styles) correspondent empiriquement aux facettes du modèle Big Five (OCEAN).

**Consensus attendu:** 94% - Consensus Établi

**Résultat de l'audit:** VÉRIFIÉ

**Source:** onet_workstyles_bigfive_anni_prediger.md

**Extrait:**

```
« Les descripteurs comportementaux O*NET (Work Styles) correspondent empiriquement aux facettes du modèle Big Five (OCEAN). »
```

---

### ✅ prediger_bifurcation_dpc

**Catégorie:** Orientation DPC

**Affirmation:** Le modèle bi-axial de Prediger (Données/Idées et Choses/Personnes) permet de relier les intérêts auto-déclarés (RIASEC) aux exigences fonctionnelles réelles des postes (DPC).

**Consensus attendu:** 91% - Validé empiriquement

**Résultat de l'audit:** VÉRIFIÉ

**Source:** onet_workstyles_bigfive_anni_prediger.md

**Extrait:**

```
« Le modèle bi-axial de Prediger (Données/Idées et Choses/Personnes) permet de relier les intérêts auto-déclarés (RIASEC) aux exigences fonctionnelles réelles des postes (DPC). »
```

---

### ✅ twa_satisfaction_reinforcers

**Catégorie:** Valeurs TWA

**Affirmation:** L'adéquation besoins-renforçateurs (Needs-Reinforcer Fit) de la Theory of Work Adjustment prédit significativement la persévérance et la rétention en emploi.

**Consensus attendu:** 89% - Forte Corrélation

**Résultat de l'audit:** VÉRIFIÉ

**Source:** twa_work_values_lecorff_dawis.md

**Extrait:**

```
« L'adéquation besoins-renforçateurs (Needs-Reinforcer Fit) de la Theory of Work Adjustment prédit significativement la persévérance et la rétention en emploi. »
```

---

### ✅ cnesst_ergonomic_lumbar

**Catégorie:** Ergonomie SST

**Affirmation:** Le port régulier de charges supérieures à 20 kg combiné à des postures en flexion rachidienne (B-3) multiplie la prévalence des troubles musculo-squelettiques (TMS) lombaires.

**Consensus attendu:** 98% - Consensus Établi

**Résultat de l'audit:** VÉRIFIÉ

**Source:** cnesst_sst_ergonomie_tms.md — Section "Données épidémiologiques et seuils biomécaniques"

**Extrait:**

```
« Le port régulier de charges supérieures à 20 kg combiné à des postures en flexion rachidienne (B-3) multiplie la prévalence des troubles musculo-squelettiques (TMS) lombaires. »
```

---

### ✅ burnout_resilience_stress_tolerance

**Catégorie:** Réadaptation CNESST

**Affirmation:** L'alignement entre la tolérance au stress et la charge émotionnelle du poste est un facteur critique pour prévenir les récidives lors du retour au travail post-burnout.

**Consensus attendu:** 95% - Consensus Établi

**Résultat de l'audit:** VÉRIFIÉ

**Source:** cnesst_sst_ergonomie_tms.md — section 2. Réadaptation Professionnelle et Retour au Travail Post-Burnout

**Extrait:**

```
« L'alignement entre la tolérance au stress et la charge émotionnelle du poste est un facteur critique pour prévenir les récidives lors du retour au travail post-burnout. »
```

---

### ✅ formula_pomp_standardization

**Catégorie:** Méthodes Mathématiques

**Affirmation:** La transformation POMP (Percent of Maximum Possible) permet de transposer linéairement des scores bruts sur une échelle 0-100 sans altérer la variance ni la forme des distributions sous-jacentes.

**Consensus attendu:** 100% - Standard Méthodologique

**Résultat de l'audit:** VÉRIFIÉ

**Source:** demonstrations_mathematiques_psychometrie.md

**Extrait:**

```
« La transformation POMP (Percent of Maximum Possible) permet de transposer linéairement des scores bruts sur une échelle 0-100 sans altérer la variance ni la forme des distributions sous-jacentes. »
```

---

### ✅ formula_pearson_centered_cosine

**Catégorie:** Méthodes Mathématiques

**Affirmation:** Le cosinus centré (équivalent à la corrélation de Pearson r) est l'unique métrique de similarité angulaire éliminant le biais de translation et neutralisant formellement les profils à variance nulle (σ = 0).

**Consensus attendu:** 100% - Démonstration Mathématique

**Résultat de l'audit:** VÉRIFIÉ

**Source:** demonstrations_mathematiques_psychometrie.md

**Extrait:**

```
« Le cosinus centré (équivalent à la corrélation de Pearson r) est l'unique métrique de similarité angulaire éliminant le biais de translation et neutralisant formellement les profils à variance nulle (σ = 0). »
```

---

### ✅ formula_prediger_trigonometric

**Catégorie:** Méthodes Mathématiques

**Affirmation:** Les équations de Prediger constituent la projection trigonométrique exacte des 6 sommets de l'hexagone de Holland (espacés de 60°) sur les axes orthogonaux Choses/Personnes et Données/Idées via les coefficients 2 et √3 ≈ 1.732.

**Consensus attendu:** 100% - Projection Trigonométrique Validée

**Résultat de l'audit:** VÉRIFIÉ

**Source:** demonstrations_mathematiques_psychometrie.md

**Extrait:**

```
« Les équations de Prediger constituent la projection trigonométrique exacte des 6 sommets de l'hexagone de Holland (espacés de 60°) sur les axes orthogonaux Choses/Personnes et Données/Idées via les coefficients 2 et √3 ≈ 1.732. »
```

---

### ✅ formula_reverse_scoring

**Catégorie:** Méthodes Mathématiques

**Affirmation:** L'inversion arithmétique S_i = (K + 1) - x_i sur les énoncés formulés négativement neutralise le biais de complaisance / d'acquiescement (acquiescence response set).

**Consensus attendu:** 100% - Standard Psychométrique

**Résultat de l'audit:** VÉRIFIÉ

**Source:** demonstrations_mathematiques_psychometrie.md

**Extrait:**

```
« L'inversion arithmétique S_i = (K + 1) - x_i sur les énoncés formulés négativement neutralise le biais de complaisance / d'acquiescement (acquiescence response set). »
```

---

### ✅ pr_rsm_edwards_polynomial_fit

**Catégorie:** Modélisation Non-Linéaire

**Affirmation:** La régression polynomiale combinée à l'analyse des surfaces de réponse (PR-RSM) surpasse les scores de différence absolue en modélisant de manière asymétrique et non-linéaire la sous-utilisation des compétences versus la surcharge de travail.

**Consensus attendu:** 96% - Standard Méthodologique Avancé

**Résultat de l'audit:** VÉRIFIÉ

**Source:** edwards_polynomial_regression_response_surfaces.md

**Extrait:**

```
« La régression polynomiale combinée à l'analyse des surfaces de réponse (PR-RSM) surpasse les scores de différence absolue en modélisant de manière asymétrique et non-linéaire la sous-utilisation des compétences versus la surcharge de travail. »
```

---

### ✅ angular_agreement_riasec_congruence

**Catégorie:** Psychométrie

**Affirmation:** L'accord angulaire (Angular Agreement) sur l'espace circomplexe de Holland évalue la similarité directionnelle sans biais d'amplitude et possède une validité de critère supérieure à la distance euclidienne pour prédire la persévérance.

**Consensus attendu:** 92% - Validé Empiriquement

**Résultat de l'audit:** VÉRIFIÉ

**Source:** etude_wild_mohring_2026_angular_agreement.md

**Extrait:**

```
« L'accord angulaire (Angular Agreement) sur l'espace circomplexe de Holland évalue la similarité directionnelle sans biais d'amplitude et possède une validité de critère supérieure à la distance euclidienne pour prédire la persévérance. »
```

---

### ✅ meta_analysis_bigfive_riasec_correlations

**Catégorie:** Psychométrie

**Affirmation:** Les méta-analyses confirment une convergence théorique et empirique robuste entre les 5 grands facteurs de personnalité (OCEAN) et les 6 intérêts RIASEC, notamment entre Ouverture et Artistique (r = .48) ainsi qu'Extraversion et Entreprenant (r = .41).

**Consensus attendu:** 97% - Consensus Établi

**Résultat de l'audit:** VÉRIFIÉ

**Source:** meta_analyses_bigfive_riasec_barrick_mount.md

**Extrait:**

```
« Les méta-analyses confirment une convergence théorique et empirique robuste entre les 5 grands facteurs de personnalité (OCEAN) et les 6 intérêts RIASEC, notamment entre Ouverture et Artistique (r = .48) ainsi qu'Extraversion et Entreprenant (r = .41). »
```

---

## Conclusion

Cet audit a été exécuté avec **100% de souveraineté locale**.
Aucune donnée n'a été transmise vers des services cloud externes.

Statut final: 12/12 affirmations vérifiées mot-à-mot.

---
*Rapport généré le 2026-09-19 par verify_evidence_paperqa.py*