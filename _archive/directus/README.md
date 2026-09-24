# Archive : Configuration et Scripts Directus (Scénario B)

**Date d'archivage :** 2026-09-24  
**Motif :** Décision d'architecture et de simplification (Scénario B) validée lors de l'audit technique et de la session `/grill-me`.

---

## 1. Contexte et Justification

* **Statut réel dans Trajektia :** Directus n'était pas intégré dans le chemin de données du site public Astro (les fiches métiers sont générées en SSG via `generate_career_content.py` ➔ `metiers.ts`, et les requêtes dynamiques passent par FastAPI/pgvector).
* **Risque d'écrasement évité :** La source de vérité est le graphe Neo4j. Toute édition manuelle dans Directus risquait d'être écrasée lors du prochain passage de l'ETL `le_siphon.py`.
* **Économie de ressources :** Retrait d'un conteneur permanent (~512 Mo de RAM) sur le VPS OVH Québec, suppression des labels Traefik du sous-domaine `cms.trajektia.ca`, et élimination des mots de passe en clair.
* **Alternative active :** Visualisation des tables directement via l'interface web de **Supabase Studio** et gestion des mises à jour pilotée en langage naturel avec **Google Antigravity**.

---

## 2. Contenu de cette archive

| Fichier | Description |
| :--- | :--- |
| `docker-compose.yml` | Définition du conteneur Directus 11.x connecté à PostgreSQL (Supabase) via le port 8055. |
| `fix_directus.py` | Script Python configurant les métadonnées des collections CKG, les filtres de recherche et les relations. |
| `.env.example` | Modèle des variables d'environnement requises pour faire tourner le conteneur Directus en local. |

---

## 3. Procédure de restauration (si besoin futur)

Si le projet décide un jour de réintroduire Directus (par exemple pour donner un accès avec formulaires éditoriaux dédiés à des rédacteurs tiers) :

1. Déplacer ou copier ces fichiers à la racine dans un dossier `directus/` :
   ```bash
   cp -r _archive/directus directus
   ```
2. Configurer le fichier `directus/.env` à partir de `directus/.env.example` avec des mots de passe forts.
3. Démarrer le conteneur localement :
   ```bash
   cd directus
   docker compose up -d
   ```
4. Exécuter le script de configuration des collections :
   ```bash
   python fix_directus.py
   ```
5. Accéder à l'interface d'administration sur `http://localhost:8055`.
