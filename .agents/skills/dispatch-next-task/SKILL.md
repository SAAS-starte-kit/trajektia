---
name: dispatch-next-task
description: Identifier la prochaine tâche dans le plan d'action, sélectionner l'agent IA le plus adapté (Antigravity, Claude Code Router, Hermes, Google Jules) et lui router la mission.
---

# dispatch-next-task

Ce workflow permet d'orchestrer la suite du travail en agissant comme un dispatcheur de tâches multi-agents.

## Contexte
Le projet Trajektia utilise plusieurs outils et agents d'IA pour optimiser les coûts de tokens et tirer parti des forces de chaque modèle :
- **Antigravity (IDE)** : Architecture logicielle, coordination globale, intégration complexe multi-fichiers, frontend Astro/React, et diagnostics de fond.
- **Google Stitch (MCP)** : Idéation et génération rapide d'écrans UI, prototypage de maquettes bento/glassmorphism, création et mise à jour de Design Systems (`design.md`) à partir de prompts textuels.
- **Figma (MCP)** : Inspection de maquettes de production au pixel près, extraction directe des tokens (variables de couleurs, espacements Auto Layout, typographies) et synchronisation bidirectionnelle design $\leftrightarrow$ code Astro.
- **Gemini CLI** : Tâches nécessitant une très grande fenêtre de contexte (analyse massive de documents de référence, ingurgiter les manuels complets CKG/psychométriques), génération par batch à bas coût (via Flash), ou scripts d'automatisation exécutables hors de l'IDE.
- **Claude Code Router (CCR)** : Refactorisation ciblée de scripts backend Python, logique mathématique/algorithmique dense, génération de tests unitaires rapides.
- **Hermes Agent** : Notifications, communication asynchrone, messages de statut via Telegram/MCP.
- **Google Jules (Flotte Asynchrone Cloud — Quota : 100 sessions/jour)** : Agent de codage autonome principal pour tous les chantiers asynchrones de fond : rédaction et couverture de tests unitaires/E2E (Vitest, Playwright, Pytest), réconciliation de données lourdes (SQL ↔ Neo4j), refactorisation modulaire backend (FastAPI/Pydantic), migrations de base de données (Dbmate) et fiabilisation des flux ETL. Opère en sandbox cloud isolée sur GitHub sans impacter les tokens ni la disponibilité de l'IDE.

## Étapes du Workflow

### 1. Analyse du Plan d'Action ou Tâche Directe
- **Si une tâche explicite est fournie en argument** (ex: `/dispatch-next-task "tâche xyz"`) :
  - Si la tâche nécessite une évaluation, une clarification ou une inscription au plan d'action : déléguer ou renvoyer vers `/triage "..."`.
  - Si la tâche doit être expédiée immédiatement sans impacter le plan : passer directement à l'étape 2 (ou utiliser `/dispatch-now "..."`).
- **Si aucun argument n'est fourni** :
  - Ouvrir et lire le fichier `packages/ckg/PLAN_ACTION.md`.
  - Repérer la ou les prochaines tâches prioritaires ayant le statut **À faire** ou **En attente**.

### 2. Matrice Révisée de Priorité de Dispatch (Compte tenu du quota de 100 sessions/jour de Jules)

> **Règle d'or d'efficience (Inversion de Priorité)** : Avec 100 sessions gratuites par jour sur Google Jules, toute tâche autonome, de refactoring de fond, d'écriture de tests ou de tuyauterie backend/data **DOIT ÊTRE DÉLÉGUÉE EN PRIORITÉ À JULES**. Antigravity reste le planificateur/architecte et se concentre sur l'UI interactive, le design et la validation des PRs.

| Domaine / Nature de la tâche | Agent Cible Prioritaire | Justification & Mécanisme |
| :--- | :--- | :--- |
| **Suites de tests (Vitest, Pytest, Playwright), refactorisation modulaire, typage Pydantic, tuyauterie ETL, migrations SQL Dbmate** | **Google Jules (Priorité 1)** | Exécution autonome asynchrone dans le cloud via l'API REST Jules (`https://jules.googleapis.com/v1alpha/sessions`). Zéro coût de tokens dans l'IDE, parallélisme total. |
| **Prototypage UI, nouveaux concepts d'écrans, Design System textuel** | **Google Stitch (MCP)** | Outils `mcp_StitchMCP_*` (`generate_screen_from_text`, `edit_screens`, `create_project`). |
| **Alignement maquettes Figma existantes, extraction de tokens/variables** | **Figma (MCP)** | Inspection et extraction directe des tokens Auto Layout / CSS. |
| **Intégration UI interactive, composants Astro/React fins, coordination multi-fichiers, revue de PR** | **Antigravity (IDE)** | Prise en charge directe dans l'IDE avec le modèle adéquat (Gemini 3.8 Flash pour l'UI, Pro/Sonnet si complexité conceptuelle). |
| **Analyse documentaire massive, cross-référencement de manuels volumineux, batch à faible coût** | **Gemini CLI** | Invocation en ligne de commande Gemini avec grand contexte (1M+ tokens). |
| **Refactorisation chirurgicale locale ultra-rapide (Python pur, algorithmique immédiate)** | **Claude Code Router (CCR)** | Transmission directe via binaire `ccr` ou API locale `http://localhost:3458`. |
| **Notifications Telegram, communication asynchrone, alertes d'état** | **Hermes Agent (MCP)** | Outil `mcp_hermes_messages_send` ou canaux configurés. |

---

### 3. Protocole Spécifique de Dispatch vers Google Jules

#### A. Standards de Formatage de Prompt (Best Practices Jules-Skills & Google Dev)
Chaque prompt soumis à Jules doit être **autonome, déterministe et strictement borné** :
1. **Objectif Atomique** : Une seule responsabilité claire par session (ex: « Installer Vitest et tester le scoring psychométrique »).
2. **Bornes de Fichiers Strictes (*File Boundaries*)** :
   - Déclarer explicitement la liste des `Files to modify`, `New files`, et `Test files`.
   - Inclure la clause : *« You may ONLY modify the files listed above. Do NOT modify, rename, or delete files outside your boundary. »*
3. **Assertions Chiffrées Déterministes** : Fournir les vecteurs étalons scientifiques (issus de `MANUEL_PSYCHOMETRIQUE.md` ou `MANUEL_METHODOLOGIQUE_CKG.md`).
4. **Commandes de Validation Exactes** : Définir les commandes de test que Jules doit exécuter pour s'auto-valider (ex: `npm --prefix apps/frontend test`, `npm run build`, `pytest`).
5. **Format du Livrable** : Branche git propre (`jules/<feature-name>`) et Pull Request documentée avec le rapport d'exécution des tests.

#### B. Déclenchement Automatique Immédiat (API REST Jules)
Exécuter directement l'appel API en PowerShell / REST sans solliciter de copier-coller de l'utilisateur :
```powershell
# Utiliser la variable d'environnement ou la clé configurée dans mcp_config.json
$apiKey = $env:JULES_API_KEY # ou extrait de mcp_config.json
$body = @{
    prompt = $julesPrompt
    title = $taskTitle
    sourceContext = @{
        source = "sources/github/SAAS-starte-kit/trajektia"
        githubRepoContext = @{
            startingBranch = "master"
        }
    }
} | ConvertTo-Json -Depth 5

$session = Invoke-RestMethod -Uri "https://jules.googleapis.com/v1alpha/sessions" -Headers @{
    "X-Goog-Api-Key" = $apiKey
    "Content-Type" = "application/json"
} -Method Post -Body $body
```

---

### 4. Suivi, Boucle Autonome (/goal) et Fusion Continue
- **Mode Ponctuel** :
  - Surveiller le statut de la session (`state: IN_PROGRESS` -> `COMPLETED`).
  - Vérifier l'impact via GitNexus (`gitnexus impact` ou `detect-changes`).
  - Appliquer le patch et fusionner sur `origin/master`.
- **Mode Boucle Continue / Autonomous Goal Runner (`python scripts/jules_orchestrator.py --loop`)** :
  - L'orchestrateur prend en charge l'ensemble de la file d'attente séquencée (`TASKS_QUEUE`).
  - Crée chaque session Jules, effectue un checkup périodique toutes les 25-30s.
  - Alerte la console (bip terminal `\a`) et met à jour `.fleet/orchestrator_state.json` dès qu'une tâche est terminée.
  - Valide automatiquement avec la commande de test spécifiée (Vitest, Python, build).
  - Passe un check de graphe GitNexus, commite et pousse sur `origin/master`.
  - Enchaîne immédiatement sur la tâche suivante jusqu'à complétion totale du backlog.

