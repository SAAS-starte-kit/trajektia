---
name: generate-astro-content
description: Regénérer le site statique frontend suite à une mise à jour des données CKG.
---

# generate-astro-content

Ce skill gère le processus de construction des données et la compilation du site statique Astro pour Trajektia.

## Contexte
Astro nécessite un fichier de données local (`frontend-web/src/data/metiers.ts` ou équivalent JSON) pour générer l'ensemble de ses pages de carrières (les 700+ pages `[cnp].astro`). Ce workflow doit être exécuté chaque fois que la base Neo4j est mise à jour ou que des logiques de présentation frontend ont changé.

## Étapes du Workflow

1. **Extraction et Structuration des données :**
   - Placez-vous à la racine du projet et exécutez : `python scripts/generate_career_content.py`.
   - Ce script va requêter Neo4j, formater les données, et les placer dans le dossier accessible par Astro.
   - Vérifiez que le script se termine avec succès.

2. **Compilation du site statique (Build Astro) :**
   - Naviguez dans le répertoire frontend : `cd frontend-web`.
   - Exécutez la commande de vérification de type et de compilation : `npm run build`.
   - Surveillez les logs (notamment les erreurs TypeScript potentielles dans les fichiers `.astro` ou `.tsx`).

3. **Validation :**
   - Vérifiez que le dossier `frontend-web/dist` a bien été généré ou mis à jour.
   - Informez l'utilisateur que le build a réussi et que le nouveau contenu est prêt à être déployé ou testé localement.
