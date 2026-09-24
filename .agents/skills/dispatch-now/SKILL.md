---
name: dispatch-now
description: Alias court pour dispatch-task-now. Qualifier et router immédiatement une tâche ad-hoc sans consulter PLAN_ACTION.md.
---

# dispatch-now (Alias de dispatch-task-now)

Consulter les instructions complètes dans [dispatch-task-now](../dispatch-task-now/SKILL.md).

## Utilisation
```bash
/dispatch-now "instruction ou tâche immédiate"
```

Ce workflow prend en charge directement la tâche spécifiée sans ouvrir ni lire `packages/ckg/PLAN_ACTION.md`, qualifie le meilleur agent (Stitch, Figma, CCR, Gemini CLI, Hermes, Jules, Antigravity) et exécute ou achemine l'action en mode direct zéro intermédiaire.

*(Pour une tâche nécessitant analyse d'impact, clarification ou mise à jour du plan d'action, privilégier `/triage "..."`).*
