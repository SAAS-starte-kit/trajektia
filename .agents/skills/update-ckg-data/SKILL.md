---
name: update-ckg-data
description: Automatiser le pipeline ETL pour mettre à jour le graphe de connaissances avec les données O*NET.
---

# update-ckg-data

Ce skill permet de mettre à jour la base de données Neo4j avec de nouvelles données extraites et transformées via le script ETL `le_siphon.py`.

## Contexte
Lorsque de nouvelles données O*NET ou ESCD sont disponibles, il est nécessaire de les injecter proprement dans la base de données Neo4j (le Career Knowledge Graph de Trajektia). Ce processus peut prendre du temps et nécessite des vérifications d'intégrité après coup.

## Étapes du Workflow

1. **Vérification de l'environnement :**
   - Assurez-vous que l'environnement Python virtuel est actif (`.venv/Scripts/activate` sous Windows) et que Neo4j tourne (`check_neo4j_health.py`).

2. **Exécution du script d'ingestion :**
   - Exécutez le script principal d'ingestion : `python etl/le_siphon.py`.
   - Utilisez l'outil `run_command` et surveillez la sortie standard. Ce script peut prendre plusieurs minutes.

3. **Vérification de l'intégrité (Post-Ingestion) :**
   - Après la complétion du script d'ingestion, exécutez `python scratch/check_schema_all.py` (ou script équivalent) pour vérifier que le schéma Neo4j est cohérent.
   - Exécutez `python scratch/check_counts.py` pour valider le nombre total de nœuds importés (ex: nombre de `Occupation`, `Skill`, etc.).

4. **Rapport à l'utilisateur :**
   - Présentez un résumé des données ingérées et signalez toute anomalie (ex: relations orphelines, erreurs de contrainte) à l'utilisateur sous forme d'un Artifact (ex: `ingestion_report.md`).
