# Neo4j & Cypher Rules

Ces règles s'appliquent à toute requête Cypher et interaction avec la base de données graphique de Trajektia (Career Knowledge Graph).

## 1. Sécurité et Paramétrage
- Ne jamais injecter de chaînes de caractères brutes ("string interpolation") pour passer des variables dans une requête Cypher.
- **Règle absolue :** Toujours utiliser des requêtes paramétrées (ex: `MATCH (n:Occupation {id: $id})`) pour prévenir les injections et améliorer le cache des requêtes par le moteur Neo4j.

## 2. Typage et Schéma CKG
- Respecter le modèle de données de Trajektia. 
- Les entités principales incluent (mais ne sont pas limitées à) : `(:Occupation)`, `(:Skill)`, `(:Task)`, `(:Ability)`.
- Soyez attentifs aux relations directionnelles (ex: `(:Occupation)-[:REQUIRES]->(:Skill)`).
- Avant d'écrire une requête de mise à jour ou d'insertion de masse, vérifiez le schéma actuel ou consultez un sous-graphe existant.

## 3. Performance
- Évitez les scans complets de nœuds ou de relations (Full Graph Scans) sans clause `LIMIT` pendant les sessions de développement, à moins que cela ne soit explicitement nécessaire pour une agrégation (ex: un comptage ciblé de validations).
- Utilisez des index là où c'est pertinent (généralement sur l'attribut `id` ou `onetsoc_code` de l'entité `Occupation`).
