---
name: update-documentation
description: Mettre à jour la documentation (Manuel Psychométrique, Méthodologie, Plan d'Action, etc.) suite à des changements dans le code ou le modèle de données.
---

# update-documentation

Ce skill définit la procédure standard pour maintenir à jour la documentation principale du projet Trajektia, située dans le dossier `ckg/`.

## Contexte
Trajektia est un projet scientifique et technique complexe. La documentation doit refléter les changements apportés au code, au schéma de la base de données (Neo4j), ou aux transformations psychométriques (ex: formule POMP). Les fichiers concernés sont principalement :
- `ckg/MANUEL_PSYCHOMETRIQUE.md` : Pour les aspects liés aux modèles psychologiques (RIASEC, Big Five, etc.).
- `ckg/MANUEL_METHODOLOGIQUE_CKG.md` : Pour la structure du graphe de connaissances, les relations et l'ingestion des données.
- `ckg/PLAN_ACTION.md` : Pour suivre l'avancement des tâches et les prochaines étapes.
- `ckg/LIVRE_BLANC_TRAJEKTIA.md` : Pour la vision d'ensemble du produit.

## Étapes du Workflow

1. **Analyse des changements :**
   - Demandez à l'utilisateur quels sont les derniers changements effectués (ou consultez les derniers commits / modifications de schéma, par ex. `database/schema_v11_bigfive_dec.sql`).
   - Identifiez quel(s) document(s) doivent être mis à jour.

2. **Recherche et Localisation :**
   - Lisez le contenu actuel du ou des fichiers concernés dans le dossier `ckg/` avec l'outil `view_file`.
   - Repérez les sections qui sont devenues obsolètes ou qui manquent d'informations suite aux nouvelles fonctionnalités.

3. **Mise à jour de la documentation :**
   - Utilisez l'outil `replace_file_content` ou `multi_replace_file_content` pour modifier les documents.
   - **Important :** Conservez le ton professionnel, académique et technique des documents. Ne supprimez pas de contexte historique sans raison valable.
   - Si une nouvelle formule mathématique a été introduite (ex: ajustement POMP), documentez-la explicitement dans le `MANUEL_PSYCHOMETRIQUE.md` et/ou le `MANUEL_METHODOLOGIQUE_CKG.md`.

4. **Validation et Plan d'Action :**
   - Si la mise à jour correspond à une tâche terminée, mettez à jour le statut de la tâche dans `ckg/PLAN_ACTION.md` (passer de "En cours" à "Terminé").
   - Fournissez un résumé des modifications à l'utilisateur (Artifact "Walkthrough") afin qu'il puisse vérifier que la documentation reflète parfaitement la réalité du système.
