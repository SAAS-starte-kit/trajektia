# Mémoire Persistante du Projet - AGENTS.md
> Ce fichier contient les directives stratégiques, les choix d'architecture et les règles métier non négociables du projet. Il est automatiquement injecté dans chaque session de l'agent.

---

## 1. Identité et Vision du Projet
* **Nom officiel :** Préalables DEC et DEP (Trajektia).
* **Objectif :** Guider les élèves du secondaire et adultes du Québec dans le choix de leurs programmes d'études collégiales (DEC) et professionnelles (DEP), la validation de leurs préalables scolaires, et la compréhension de l'Aide financière aux études (AFE).
* **Terminologie obligatoire :** Utiliser la dénomination **« Trajektia »** (ne pas utiliser *Accessible FMS* ni *Passerelle FMS*).

---

## 2. Règles Métier & Garde-fous Absolus

### A. Aide Financière aux Études (AFE)
* ⚠️ **AUCUN CALCUL LOCAL NI EMBARQUÉ (Règle d'or) :** 
  Ne JAMAIS recréer de moteur de calcul, de simulateur interne ou d'iframe de simulation sur le site. Les barèmes de l'AFE sont complexes, indexés chaque année et légalement sensibles.
* **Rôle du site :** Guide pédagogique d'accompagnement (explication des prêts vs bourses, statut d'autonomie, calendrier des versements, pièges des abandons de cours).
* **Redirection officielle systématique :** Toutes les actions d'estimation doivent rediriger clairement l'étudiant vers le portail officiel du gouvernement du Québec :
  * Portail d'information : `https://www.quebec.ca/education/aide-financiere-aux-etudes/prets-bourses-temps-plein/calcul/simulateur-calcul`
  * Formulaire direct : `https://prod.education.gouv.qc.ca/pls/afep01/C01050102_PKG.INIT_PRC`

### B. Établissements (Cégeps & CFP) et Programmes
* **Relation bidirectionnelle :** Les programmes sont reliés aux établissements qui les offrent, et chaque établissement affiche les programmes qu'il dispense.
* **Taxonomie officielle québécoise :** Respecter les codes ministériels (`420.B0`, `5347`, etc.), les préalables du secondaire (CST 4e/5e, TS 4e/5e, SN 4e/5e, Chimie 5e, Physique 5e) et les trois services régionaux d'admission (SRAM, SRACQ, SRASL).
* **Positionnement Brilliant Directories (BD) :** Si BD est utilisé, c'est **strictement comme base de données Headless (API/MCP)**. L'interface publique de BD ne doit jamais remplacer le frontend Astro.

---

## 3. Charte Graphique & UI (Design System)
* **Police d'écriture :** `Poppins` (Google Fonts) pour l'ensemble du site.
* **Palette de couleurs :**
  * `brand-dark` : `#0F172A` (Slate foncé / En-têtes et contrastes forts)
  * `brand-blue` : `#6366F1` (Indigo/Violet technologique / Boutons primaires et liens)
  * `brand-yellow` : `#FBBF24` (Jaune énergique / Accents, badges et surbrillances)
  * `brand-bg` : `#F8FAFC` (Fond neutre moderne)
* **Composants :** Cartes modernes type Bento Grid, arrondis `rounded-2xl` ou `rounded-3xl`, bordures légères `border-slate-200`, contrastes stricts WCAG AA.

---

## 4. Normes Techniques (Astro + React)
* **Génération Statique (SSG) prioritaire :** Conserver des performances de chargement ultra-rapides (Core Web Vitals 100/100).
* **Îlots interactifs :** Utiliser `@astrojs/react` avec hydratation différée (`client:idle` ou `client:visible`).
* **Icônes :** Importer exclusivement depuis `lucide-react`.
* **Animations :** Utiliser `motion/react` avec modération et accessibilité.

---

## 5. Pistes d'Évolution UI/UX futures (Inspirations Google Stitch - ⚠️ À VALIDER)
*Ces concepts ont été retenus suite à l'analyse de prototypes Google Stitch, mais restent à valider avant d'être implémentés dans le code de production :*

1. **Le "Profil Étudiant Global" :** Intégrer un sélecteur de profil global (ex: "Sec 5, Math TS") qui adapte toutes les pages, filtres et recommandations du site dynamiquement, réduisant les clics et ultra-personnalisant l'expérience.
2. **Barre de Recherche Sémantique (Agent IA) :** Utiliser une interface de recherche en langage naturel couplée au futur graphe Neo4j (ex: *"Quels DEP avec Math CST 4 ?"*) en lieu et place des filtres complexes traditionnels.
3. **Cartes Bento avec Micro-Simulateurs :** Tirer parti des îlots interactifs (Island Architecture) pour inclure des mini-outils directement dans les cartes de la page d'accueil (ex: slider de revenu AFE) offrant un aperçu des résultats avant de changer de page.
4. **Typographie "Éditoriale Institutionnelle" :** Déployer une police avec empattement (Serif) pour les guides, mémoires et pages académiques (ex: explication de la Cote R) afin de contraster avec l'aspect applicatif du site et d'asseoir son autorité institutionnelle.
