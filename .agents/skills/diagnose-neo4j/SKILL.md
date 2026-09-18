---
name: diagnose-neo4j
description: Exécuter des diagnostics de santé sur la base de données Neo4j du CKG.
---

# diagnose-neo4j

Ce skill est un outil de dépannage rapide à utiliser en cas de problème suspecté avec la base de données Neo4j de Trajektia.

## Contexte
Si l'utilisateur signale des données manquantes dans l'interface, des temps de réponse très longs, ou des erreurs de connexion, l'agent doit suivre cette procédure de diagnostic standardisée.

## Étapes du Workflow

1. **Vérification de la santé du serveur :**
   - Exécutez le script : `python scratch/check_neo4j_health.py` pour valider que la base de données est accessible et que les identifiants `.env` sont corrects.

2. **Analyse de l'intégrité structurelle :**
   - Lancez `python scratch/verify_neo4j.py` (ou `check_schema_all.py`) pour obtenir un rapport sur les index, les contraintes, et vérifier s'il manque des contraintes uniques importantes.

3. **Validation des métriques d'occupation :**
   - Exécutez `python scratch/count_cnp.py` ou `test_dpc_neo4j.py` pour vérifier la présence des données spécifiques attendues (ex: les scores DPCI ou RIASEC pour une profession donnée).
   - Ce point permet de s'assurer qu'il ne s'agit pas d'une base de données partiellement remplie.

4. **Recommandations :**
   - Synthétisez les résultats dans une réponse claire à l'utilisateur.
   - Si des contraintes manquent, proposez un plan (Artifact) contenant les requêtes Cypher pour les créer.
   - Si la connexion échoue, vérifiez que le conteneur Docker (le cas échéant) ou le service local Neo4j est en cours d'exécution.
