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
- **Google Jules / Spécialistes Data** : Analyse exploratoire de données, data science, validation des métriques et réconciliation des schémas SQL/Neo4j.

## Étapes du Workflow

### 1. Analyse du Plan d'Action
- Ouvrir et lire le fichier `packages/ckg/PLAN_ACTION.md`.
- Repérer la ou les prochaines tâches prioritaires ayant le statut **À faire** ou **En attente**.

### 2. Qualification et Attribution de la Tâche
- Déterminer quel agent ou outil est le plus qualifié selon les critères suivants :
  - *Prototypage UI rapide, création de nouveaux concepts d'écrans ou de Design System textuel* $\rightarrow$ **Google Stitch (MCP)**
  - *Alignement fidèle sur des maquettes graphiques existantes, extraction de tokens et variables Figma* $\rightarrow$ **Figma (MCP)**
  - *Intégration de code frontend (`apps/frontend`), refontes structurelles du site* $\rightarrow$ **Antigravity**
  - *Analyse documentaire massive, cross-référencement de manuels volumineux, batch à faible coût* $\rightarrow$ **Gemini CLI**
  - *Script Python pur (`apps/api`, `packages/data-pipeline`, `packages/ckg`)* $\rightarrow$ **Claude Code Router**
  - *Notification, suivi externe ou message vers Telegram* $\rightarrow$ **Hermes**
  - *Exploration de données, requêtes analytiques lourdes* $\rightarrow$ **Google Jules**
- Définir le contexte minimal nécessaire (fichiers cibles, contraintes, format attendu) pour économiser un maximum de tokens.

### 3. Préparation et Envoi Direct (Mode Zéro Intermédiaire - Sans passer par l'utilisateur)
- **Routage Automatique Immédiat** :
  - *Prototypage / Design UI* $\rightarrow$ Invoquer directement l'outil **StitchMCP** (`generate_screen_from_text`, `edit_screens`, etc.).
  - *Refactoring / Python / Algorithmique* $\rightarrow$ Transmettre directement la requête à **Claude Code Router (CCR)** via le binaire `ccr` ou l'endpoint local `http://localhost:3458`.
  - *Dev Asynchrone / GitHub / Longue tâche* $\rightarrow$ Lancer la mission directement sur **Google Jules** en arrière-plan.
  - *Notification & Communication* $\rightarrow$ Invoquer directement l'outil **Hermes** (`messages_send`).
- **Règle absolue** : Ne JAMAIS demander à l'utilisateur de copier-coller une consigne ou un prompt si l'agent destinataire est accessible programmatiquement. Transmettre et lancer la tâche immédiatement en tâche de fond.

### 4. Suivi et Fusion Automatique des Résultats
- Dès que l'agent destinataire (Stitch, CCR, Jules) termine son travail :
  - Récupérer automatiquement le code, l'écran ou le rapport généré.
  - Exécuter les tests de vérification.
  - Mettre à jour `packages/ckg/PLAN_ACTION.md` et présenter la synthèse finale à l'utilisateur.
