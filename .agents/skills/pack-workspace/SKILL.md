---
name: pack-workspace
description: Compacter et comprimer automatiquement un workspace ou sous-dossier avec Repomix pour réduire l'empreinte de tokens de 50 à 70%.
---

# pack-workspace

Ce skill permet de générer un condensé optimisé et structuré d'un répertoire complet avant une analyse globale ou une passation de contexte à un sous-agent.

## Procédure Automatique

1. **Identification de la Cible :**
   - Identifier le sous-dossier à analyser (ex: `apps/frontend`, `apps/api`, `packages/ckg`).

2. **Exécution de la Compression Repomix :**
   ```powershell
   npx repomix <chemin_dossier> --remove-comments --remove-empty-lines --compress --output tmp/repomix-context.xml
   ```

3. **Ingestion & Traitement :**
   - L'agent lit le fichier `tmp/repomix-context.xml` en 1 seule étape au lieu de multiples requêtes `view_file`.

4. **Nettoyage :**
   - Supprimer le fichier `tmp/repomix-context.xml` après l'exécution.
