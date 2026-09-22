# Trajektia — Vitrine Web & Outils Interactifs 🌐

Vitrine web haute performance et suite d'outils d'orientation professionnelle pour la plateforme **Trajektia**, propulsée par **Astro 5**, **React** et **Tailwind CSS**.

---

## 🛠️ Stack Technologique

- **Framework Web :** [Astro 5](https://astro.build/) (rendu statique ultra-rapide, Islands Architecture)
- **Composants Interactifs :** [React 18](https://react.dev/) (`client:load`, `client:visible`)
- **Styling :** [Tailwind CSS](https://tailwindcss.com/) avec typographie moderne Google Fonts (*Poppins*, *Inter*)
- **Visualisations Graphiques :** SVG vectoriels dynamiques (Radars à 5 axes, Hexagones RIASEC à 6 axes, jauges de progression)
- **Typage :** TypeScript strict

---

## 🧭 Pages & Fonctionnalités Clés

| Route | Type | Description |
|:---|:---|:---|
| `/` | Astro | Page d'accueil, recherche sémantique, métriques clés et métiers en vedette |
| `/metiers` | Astro | Répertoire exhaustif des professions de la CNP 2021 |
| `/metiers/[code]` | Astro + React | Fiche métier 360° (salaires officiels ESDC, cotes DPC & Prediger, compétences OaSIS/O\*NET, formations MEQ La Relance, risques SST CNESST, offres d'emploi en direct Adzuna) |
| `/formations` | Astro | Répertoire des formations professionnelles, collégiales et universitaires du Québec |
| `/formations/[code]` | Astro | Fiche formation avec taux de placement, salaires d'insertion et établissements |
| `/outils` | Astro | Hub central des outils interactifs d'orientation et de simulation |
| `/outils/test-psychometrique` | Astro + React | **Test Psychométrique Interactif** (Big Five & RIASEC — 110 items standardisés) |
| `/outils/simulateur-afe` | Astro + React | Simulateur d'aide financière aux études (Aide financière aux études du Québec) |
| `/outils/calculateur-rentabilite` | Astro + React | Calculateur de rentabilité et retour sur investissement (ROI) des études |

---

## 🧪 Module de Test Psychométrique (`/outils/test-psychometrique`)

Le module permet aux étudiants et personnes en reconversion d'évaluer scientifiquement leur profil :
- **Banque de 110 items standardisés** (`src/data/questions-psychometriques.ts`) :
  - **IPIP-50 (Goldberg, 1992)** : 50 énoncés évaluant les 5 facteurs de personnalité OCEAN (Ouverture, Conscienciosité, Extraversion, Agréabilité, Névrosisme) avec gestion rigoureuse des inversions de polarité.
  - **O*NET Mini-IP (Rounds et al., 2010)** : 60 activités concrètes évaluant les 6 dimensions RIASEC de Holland.
- **Moteur de calcul client-side** (`src/utils/scoring-engine.ts`) :
  - Étalonnage des scores bruts sur une échelle normalisée 0–100.
  - Algorithme d'appariement par **similarité cosinus dans un espace vectoriel à 11 dimensions**.
  - Recommandation instantanée du **Top 10 des métiers québécois** les plus concordants.
  - **Visualisations SVG natives** : Hexagone RIASEC et Radar OCEAN Big Five.
  - **Souveraineté des données (Loi 25)** : Données persistées exclusivement en local (`localStorage`).

---

## 🚀 Installation & Développement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement local
npm run dev

# 3. Construire le bundle de production
npm run build

# 4. Prévisualiser le build de production
npm run preview
```

Par défaut, le serveur de développement démarre sur `http://localhost:3000` (ou `http://localhost:3001` si le port 3000 est déjà alloué).
