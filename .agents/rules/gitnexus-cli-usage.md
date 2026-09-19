# Règle d'utilisation de GitNexus CLI

## Contexte
En raison d'un décalage de version de la base de données KùzuDB sous-jacente au graphe GitNexus (erreur fréquente : `Trying to read a database file with a different version. Database file version: 42, Current build storage version: 40`), l'installation globale de GitNexus (`npm i -g gitnexus`) ou les scripts locaux obsolètes échouent souvent lors de la lecture du graphe.

## Règle Absolue
**Ne JAMAIS utiliser la commande globale `gitnexus` ou `node .gitnexus/run.cjs` si une erreur KùzuDB 42/40 se produit.**

Pour toute opération d'analyse, d'impact ou de détection de changements, vous **DEVEZ** forcer l'utilisation de la version la plus récente via npx en mode non-interactif :

```bash
npx --yes gitnexus@latest <commande>
```

**Exemples corrects :**
- `npx --yes gitnexus@latest detect-changes --scope all --repo .`
- `npx --yes gitnexus@latest analyze`
- `npx --yes gitnexus@latest wiki`

Cette règle garantit que le client GitNexus possède toujours le binaire KùzuDB aligné avec la version de la base d'indexation locale.
