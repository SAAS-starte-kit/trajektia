---
name: dispatch-task-now
description: Qualifier et router immédiatement une tâche ad-hoc sans consulter le plan d'action (PLAN_ACTION.md), en identifiant l'agent ou l'outil le plus adapté (Stitch, Figma, CCR, Gemini CLI, Hermes, Jules, Antigravity) et en lançant l'exécution en mode direct zéro intermédiaire.
---

# dispatch-task-now

Ce workflow permet de qualifier et d'expédier instantanément une tâche ad-hoc ou urgente vers l'agent ou l'outil d'IA le plus adapté, **sans consulter ni modifier préalablement le plan d'action (`PLAN_ACTION.md`)**.

## Utilisation
```bash
/dispatch-task-now "description ou instruction de la tâche à accomplir"
```
*(Fonctionne également sous la variante `/dispatch-now "..."` ou si l'utilisateur invoque directement une directive de dispatch immédiat).*

> **Distinction avec `/triage`** : Si la tâche nécessite une évaluation préalable, des questions d'éclaircissement ou une inscription dans `packages/ckg/PLAN_ACTION.md`, utiliser plutôt `/triage "..."` (ou `/eval "..."`).

---

## Matrice de Qualification Rapide des Agents (Règle d'or : 100 sessions/jour Jules Full-Stack)

| Domaine / Nature de la tâche | Agent / Outil cible | Mécanisme d'exécution direct |
| :--- | :--- | :--- |
| **Suites de tests, refactorisation backend, ETL, schémas Supabase & code UI basé sur Stitch** | **Google Jules (Priorité 1 Asynchrone Full-Stack)** | Inscription directe via l'API REST Jules (`https://jules.googleapis.com/v1alpha/sessions`). Jules dispose de **Stitch MCP** (prototypage UI direct) et **Supabase MCP** (inspection live, types TS, SQL). |
| **Idéation visuelle immédiate dans l'IDE, génération interactive de maquettes** | **Google Stitch (MCP dans Antigravity)** | Outils `mcp_StitchMCP_*` (`generate_screen_from_text`, `edit_screens`, `create_project`). |
| **Alignement maquettes Figma existantes, extraction de tokens/variables** | **Figma (MCP)** | Inspection et extraction directe des tokens Auto Layout / CSS. |
| **Intégration Astro/React interactive, refontes structurelles du site, coordination multi-fichiers, revue de PR** | **Antigravity (IDE)** | Prise en charge directe dans l'IDE avec le modèle adéquat (voir ci-dessous). |
| **Refactorisation chirurgicale locale ultra-rapide (Python pur, algorithmique immédiate)** | **Claude Code Router (CCR)** | Transmission directe via binaire `ccr` ou API locale `http://localhost:3458`. |
| **Analyse documentaire massive, cross-référencement de manuels volumineux, batch à faible coût** | **Gemini CLI** | Invocation en ligne de commande Gemini avec grand contexte. |
| **Notifications Telegram, communication asynchrone, alertes d'état** | **Hermes Agent (MCP)** | Outil `mcp_hermes_messages_send` ou canaux configurés. |

---

## Étapes du Workflow

### 1. Extraction et Analyse Immédiate
- Récupérer l'énoncé de la tâche transmis dans l'argument ou le prompt (ex: `"réalise cette tâche xyz"`).
- Ne **PAS** ouvrir `packages/ckg/PLAN_ACTION.md` (gain de temps et économie de tokens).
- Isoler l'objectif principal, les entrées requises et les livrables attendus.

### 2. Sélection de l'Agent et Recommandation de Modèle
- Identifier l'agent le plus efficient selon la matrice ci-dessus.
- **Règle de priorisation Jules (100 sessions/jour)** : Si la tâche concerne la rédaction de tests, un refactoring de fond ou de la validation de données/schémas, l'expédier directement à Jules.
- **Si Antigravity prend en charge la tâche :**
  - *Intégration UI courante, composants Astro/Tailwind, modifications simples* $\rightarrow$ Conserver **Gemini 3.8 Flash** ou **Gemini 3.6 Flash** pour une vitesse maximale et un coût minime ($0.075 / 1M In).
  - *Refactorisation architecturale complexe, bugs subtils, raisonnement abstrait profond* $\rightarrow$ Suggérer à l'utilisateur de basculer sur **Gemini 3.1 Pro** ou **Claude 3.7 Sonnet**.
- Délimiter le périmètre strict de fichiers (context window minimal) pour ne pas charger de contexte inutile.

### 3. Exécution Directe (Zéro Intermédiaire)
- **Si la tâche est pour Google Jules** :
  - Formater le prompt selon les standards `jules-skills` (Objectif atomique, File boundaries stricts, Assertions chiffrées déterministes, Commandes de tests exactes, Format de PR).
  - *Intégration MCP* : Si la mission nécessite de l'UI ou des données, instruire expressément Jules d'utiliser ses outils **Stitch MCP** (`generate_screen_from_text`, `get_screen`) ou **Supabase MCP** (`list_tables`, `generate_typescript_types`, `execute_sql`).
  - Envoyer directement la requête à l'API REST `https://jules.googleapis.com/v1alpha/sessions` avec la clé API et la source `sources/github/SAAS-starte-kit/trajektia`.
  - Retourner l'URL de la session créée pour suivi.
- **Si l'outil ou l'agent dispose d'un connecteur MCP ou d'une CLI locale (Stitch, Hermes, CCR, Neo4j, Supabase)** :
  - **Déclencher l'action immédiatement** sans solliciter de confirmation redondante pour le copier-coller.
- **Si la tâche est traitée par Antigravity lui-même** :
  - Procéder directement aux vérifications de graphe (GitNexus `impact` si code touché), modifications et tests.

### 4. Restitution du Résultat
- Présenter de manière concise ce qui a été fait ou transmis.
- Rappeler l'agent sollicité et le statut d'exécution.
- Clôturer obligatoirement avec le format standardisé Trajektia (`response-summary-format.md`).
