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

## Matrice de Qualification Rapide des Agents

Lorsqu'une tâche immédiate est soumise, évaluer son domaine technique et router vers la cible optimale selon la matrice suivante :

| Domaine / Nature de la tâche | Agent / Outil cible | Mécanisme d'exécution direct |
| :--- | :--- | :--- |
| **Prototypage UI, nouveaux concepts d'écrans, Design System textuel** | **Google Stitch (MCP)** | Outils `mcp_StitchMCP_*` (`generate_screen_from_text`, `edit_screens`, `create_project`) |
| **Alignement maquettes Figma existantes, extraction de tokens/variables** | **Figma (MCP)** | Inspection et extraction directe des tokens Auto Layout / CSS |
| **Scripts Python pur, refactorisation backend, algorithmique dense, tests unitaires** | **Claude Code Router (CCR)** | Transmission directe via binaire `ccr` ou API locale `http://localhost:3458` |
| **Analyse documentaire massive, cross-référencement de manuels volumineux, batch à faible coût** | **Gemini CLI** | Invocation en ligne de commande Gemini avec grand contexte |
| **Notifications Telegram, communication asynchrone, alertes d'état** | **Hermes Agent (MCP)** | Outil `mcp_hermes_messages_send` ou canaux configurés |
| **Exploration data lourde, réconciliation SQL / Neo4j, requêtes complexes** | **Google Jules / MCPs Directs** | `mcp_neo4j_*` / `mcp_supabase-mcp-server_*` ou tâche Google Jules |
| **Intégration Astro/React, refontes structurelles du site, coordination multi-fichiers** | **Antigravity (IDE)** | Prise en charge directe dans l'IDE avec le modèle adéquat (voir ci-dessous) |

---

## Étapes du Workflow

### 1. Extraction et Analyse Immédiate
- Récupérer l'énoncé de la tâche transmis dans l'argument ou le prompt (ex: `"réalise cette tâche xyz"`).
- Ne **PAS** ouvrir `packages/ckg/PLAN_ACTION.md` (gain de temps et économie de tokens).
- Isoler l'objectif principal, les entrées requises et les livrables attendus.

### 2. Sélection de l'Agent et Recommandation de Modèle
- Identifier l'agent le plus efficient selon la matrice ci-dessus.
- **Si Antigravity prend en charge la tâche :**
  - *Intégration UI courante, composants Astro/Tailwind, modifications simples* $\rightarrow$ Conserver **Gemini 3.8 Flash** ou **Gemini 3.6 Flash** pour une vitesse maximale et un coût minime ($0.075 / 1M In).
  - *Refactorisation architecturale complexe, bugs subtils, raisonnement abstrait profond* $\rightarrow$ Suggérer à l'utilisateur de basculer sur **Gemini 3.1 Pro** ou **Claude 3.7 Sonnet**.
- Délimiter le périmètre strict de fichiers (context window minimal) pour ne pas charger de contexte inutile.

### 3. Exécution Directe (Zéro Intermédiaire)
- Si l'outil ou l'agent dispose d'un connecteur MCP ou d'une CLI locale (Stitch, Hermes, CCR, Neo4j, Supabase) :
  - **Déclencher l'action immédiatement** sans solliciter de confirmation redondante pour le copier-coller.
- Si la tâche est traitée par Antigravity lui-même :
  - Procéder directement aux vérifications de graphe (GitNexus `impact` si code touché), modifications et tests.

### 4. Restitution du Résultat
- Présenter de manière concise ce qui a été fait ou transmis.
- Rappeler l'agent sollicité et le statut d'exécution.
- Clôturer obligatoirement avec le format standardisé Trajektia (`response-summary-format.md`).
