# Data Transformation & CKG Logic Rules

Ces règles s'appliquent lors de la manipulation, la transformation ou l'ingestion des données pour le projet Trajektia (Career Knowledge Graph).

## 1. La Transformation POMP (Percent of Maximum Possible)
- Les données provenant du référentiel O*NET (notamment les scores RIASEC et autres échelles basées sur 7 points) sont transformées sur une échelle de 100 via la formule mathématique POMP.
- **La formule est :** `((Score_Brut - 1) / 6) * 100` (où 1 est le score minimum et 7 le score maximum sur l'échelle O*NET).
- **Conséquence de la formule :** Un score brut de 1.00 résulte en `0 %`. Cette valeur mathématique est correcte d'un point de vue statistique, mais elle doit être gérée de manière spécifique côté UI (voir la règle `frontend-pedagogy.md`).

## 2. Les Sources de Données (Domaines)
Trajektia consolide plusieurs types de données psychométriques et professionnelles. Il est crucial de ne pas les confondre :
- **O*NET (RIASEC)** : Modèle d'intérêts professionnels de Holland (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel).
- **Big Five / OCEAN** : Modèle de personnalité, généré à partir de passages ("crosswalks") basés sur les "O*NET Work Styles" (Ouverture, Conscienciosité, Extraversion, Agréabilité, Neuroticisme).
- **DPCI (Spécifique à Trajektia)** : Mesures d'effort ergonomique et autres métriques propriétaires de Trajektia.

## 3. Pipeline de Génération
- Les données structurées et combinées sont stockées dans la base Neo4j.
- Le fichier `scripts/generate_career_content.py` est chargé de lire les données depuis Neo4j et de générer les fichiers JSON ou TypeScript (ex: `frontend-web/src/data/metiers.ts`) qui seront ensuite consommés par Astro lors du "build" statique.
- Ne pas introduire de données directement dans le code source d'Astro sans passer par cette étape de génération, sauf pour des données statiques isolées.
