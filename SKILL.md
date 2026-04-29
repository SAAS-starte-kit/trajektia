# 🧭 CONTEXTE MAÎTRE ET GOUVERNANCE (Projet Trajektia)
**Destinataires :** Agents IA (Conductor, Jules) opérant dans Antigravity.
**Statut :** Architecture validée. Lecture obligatoire avant toute exécution de code.
**Dernière mise à jour :** 2026-04-29

---

## 🎯 1. MISSION ET VISION
Trajektia est le premier Graphe de Connaissances de Carrière (CKG) souverain au Québec. Il relie intelligemment les professions, les compétences gouvernementales (OaSIS, CNP), les programmes de formation et les institutions scolaires. Le projet obéit à des règles strictes de souveraineté des données (Loi 25 du Québec).

---

## 🏗️ 2. ARCHITECTURE LOGICIELLE (Le Stack Officiel)
L'architecture est découplée pour garantir la souveraineté clinique tout en simplifiant la gestion administrative.

* **Vitrine Frontend :** Astro 6.1 avec Cosmic Themes (Orion/Solstice) hébergé de façon performante. Source de vérité des données : Directus (SSOT).
* **Coffre-fort Souverain (Backend) :** Directus (CMS) + Supabase (Sécurité/RLS) + Neo4j/MemMachine (Graphe CKG). Hébergé sur un VPS OVH au Québec.
* **Guichet Unique & Facturation :** Brilliant Directories (BD). Gère TOUS les comptes utilisateurs (B2B et B2C) et les paiements (Stripe).
* **Orchestration & Synchronisation :** n8n (hébergé sur le VPS) assure le pont bidirectionnel entre BD et le coffre-fort local.

```
[Utilisateur]
     │ Inscription/Paiement
     ▼
[Brilliant Directories]  ──── Webhook ────►  [n8n sur VPS OVH]
     │                                              │
     │ Portail membre                    Génère User_ID anonyme
     │                                              │
     ▼                                              ▼
[Vitrine Astro 6.1]          [Supabase PostgreSQL local]  ←──  [Directus CMS]
  Cosmic Themes                   (données sensibles/cliniques)      │
     │                                              │                │
     │ API publique                      [Neo4j MemMachine]          │
     ▼                                   (Graphe CKG)               │
[FastAPI Stitcher]  ◄──────────────────────────────────────────────┘
     │                        
     │ API Cloud sécurisée
     ▼
[Chatbot RAG]  ──►  [Anthropic / OpenAI API]
```

---

## 🔐 3. RÈGLE D'OR DE SÉCURITÉ (Loi 25 & Pseudo-anonymisation)
* **INTERDICTION ABSOLUE** de stocker des données cliniques, des résultats d'orientation ou des historiques de chat sur Brilliant Directories (serveurs US).
* **Le Flux de Pseudo-anonymisation :**
    1. L'utilisateur (étudiant/parent) s'inscrit et paie sur Brilliant Directories.
    2. BD génère un `User_ID` unique.
    3. n8n intercepte la création de compte et pousse ce `User_ID` anonyme dans la base de données souveraine (Supabase/Directus sur OVH).
    4. Toutes les données sensibles et cliniques de l'utilisateur sont liées EXCLUSIVEMENT à ce `User_ID` sur le serveur québécois.

---

## 🤖 4. ÉCOSYSTÈME IA ET VIBE CODING

* **Environnement Local (Développement) :**
    * **Inférence :** Ollama (RTX 3090 locale) pour zéro coût d'API.
    * **GitNexus :** Gardien de l'architecture. **Obligation** d'utiliser l'outil `impact analysis` de GitNexus avant toute modification structurelle ou suppression de fichiers.
    * **MemMachine (Neo4j local) :** Mémoire de projet. Conductor doit y enregistrer chaque décision architecturale.
    * **HippoSync :** Utilisé pour basculer le contexte vers des modèles Cloud (Claude/Gemini) si l'inférence locale bloque sur un problème complexe.
    * **LeapReader :** Utilisé par l'humain pour injecter des données web (CNP/OaSIS) directement dans le graphe MemMachine.
* **Environnement de Production (Cloud) :**
    * Le Chatbot RAG public intégré à Astro utilisera EXCLUSIVEMENT une API Cloud sécurisée (ex: Anthropic/OpenAI). Aucune dépendance au serveur local RTX 3090.

---

## 🗄️ 5. ÉTAT DE LA BASE DE DONNÉES

### Instance de développement (transitoire)
* **Projet :** `Trajektia-Production`
* **Ref :** `gunnghbhxokolvdovnnm`
* **Région :** `ca-central-1` (AWS Canada — dev uniquement, pas de données cliniques)
* **Statut au 2026-04-28 :** Instance vide — schémas non encore appliqués

### Schémas disponibles
| Fichier | Version | Contenu | Statut |
|---|---|---|---|
| `database/schema.sql` | V1 | 10 tables de base, RLS, index | ✅ Créé |
| `database/schema_v2.sql` | V2 | Extensions CNP hiérarchie, OaSIS, appellations, exigences | ✅ Créé |
| `database/schema_v3.sql` | V3 | Éducation MEQ, CPE/CIP, Relance, admissibilité PTPD | ✅ Créé |

### Tables cibles (après application V1+V2+V3)
- `occupations` — 3 361 professions (SIPeC 2025 / CNP)
- `competencies`, `occupation_competencies` — O*NET psychométrique
- `tasks`, `tools` — O*NET Skills/Tasks
- `riasec_profiles` — Profils RIASEC par métier
- `oasis_descriptors`, `occupation_oasis` — Descripteurs OaSIS 2025
- `cnp_hierarchy` — Hiérarchie TEER complète
- `occupation_job_titles` — Appellations d'emploi (recherche full-text)
- `occupation_requirements` — Exigences et certifications
- `oasis_work_environments` — Milieux de travail
- `cip_domains` — Domaines CPE/CIP + admissibilité PTPD *(V3)*
- `educational_programs` — Programmes MEQ + données Relance *(V3)*
- `educational_institutions` — CFP, Cégeps, Universités QC *(V3)*
- `program_institutions` — Liaison Programme ↔ Établissement *(V3)*
- `occupation_programs` — **Pivot CNP ↔ MEQ (cœur Phase 3)** *(V3)*

---

## 🚀 6. PLAN D'ACTION (Phases de Déploiement)

**PHASE 0 : Stabilisation & Gouvernance** *(En cours)*
* ✅ `.env` exclu de Git
* ✅ Instance Supabase dev vide — prête pour le schéma
* ✅ `SKILL.md` créé (ce fichier)
* 🔄 Application des schémas SQL sur instance dev
* ⏳ Décisions architecture en attente (voir questions ouvertes)

**PHASE 1 : Infrastructure Souveraine VPS OVH**
* Création du `docker-compose.yml` de production (Supabase local + Directus + Neo4j + n8n + Traefik)
* Déploiement sur VPS OVH Québec (Ubuntu 22.04)
* Sauvegardes automatisées (cron quotidien → OVH Object Storage)

**PHASE 2 : Guichet et Pont (BD + n8n)**
* Configuration Brilliant Directories comme portail d'authentification unique
* Workflows n8n : interception webhooks BD → `User_ID` pseudo-anonyme → Supabase/Directus

**PHASE 3 : Le Graphe CKG (Neo4j MemMachine)**
* ✅ `schema_v3.sql` créé — chaîne CNP → MEQ → CPE → PTPD + Relance
* Réactivation Neo4j local comme mémoire active CKG
* Schéma graphe : Profession → Compétence → Programme → Institution
* Pipeline LeapReader pour injection CNP/OaSIS

**PHASE 4 : FastAPI Stitcher**
* Endpoints `/api/metier/{cnp_code}`, `/api/search`, `/api/competences`, `/api/programmes`
* Déploiement Railway/Render ou VPS

**PHASE 5 : Vitrine Astro 6.1**
* Cosmic Themes (Orion ou Solstice)
* Pages : accueil, fiche métier, fiche école, explorateur
* Chatbot RAG (API Cloud uniquement)
* **AUCUN code d'auth dans Astro — BD s'en charge**

**PHASE 6 : Mise en Production**
* Tests de charge, audit sécurité, déploiement, DNS

---

## ⚠️ 7. DIRECTIVES STRICTES POUR LES AGENTS (Conductor & Jules)
1. **Aucune hallucination architecturale :** Se référer exclusivement à ce document.
2. **Pas de code inutile :** Ne pas coder d'authentification ou de portail membre dans Astro. BD s'en charge.
3. **Vérification constante :** Jules doit soumettre ses propositions à l'analyse de GitNexus avant toute modification structurelle.
4. **Souveraineté absolue :** Zéro donnée clinique hors VPS OVH. L'instance Supabase cloud est dev uniquement.
5. **Chatbot RAG :** API Cloud uniquement en production. Jamais de dépendance au serveur local RTX 3090.

---

## 🧠 8. INSTINCTS CONDUCTOR (Synergie MemMachine & ECC)
**ORDRE EXPLICITE :** En tant que Conductor (Agent IA), tu es connecté à MemMachine via le Model Context Protocol (MCP). Tu DOIS appliquer ces instincts en continu :
* **Recherche de contexte (Avant la tâche) :** Utilise `memory_find` pour interroger la base de connaissances avant d'écrire du code. Cela te donne le contexte chirurgical exact sans charger des fichiers inutiles, réduisant ainsi les hallucinations et la consommation de tokens.
* **Traçabilité (Pendant et Après la tâche) :** À chaque fois qu'une décision architecturale est prise ou qu'une fonctionnalité est complétée, utilise `memory_store` et `memory_modify` pour l'enregistrer dans le graphe Neo4j.
* **Mémoire à long terme :** MemMachine est la "bibliothèque" officielle de Trajektia. Tu dois t'assurer qu'elle reflète toujours l'évolution des idées et du code.

---

## ❓ 9. QUESTIONS OUVERTES (en attente réponse humain)

| # | Question | Impact |
|---|---|---|
| Q1 | Instance Supabase cloud acceptable comme dev permanent ou migration VPS immédiate ? | Loi 25 |
| Q2 | Directus Cloud (`directus.app`) → migrer vers VPS maintenant ? | Loi 25 |
| Q3 | Domaine BD Trajektia officiel ? (bonjourpsy.ca = test ?) | Phase 2 |
| Q4 | FastAPI : API publique pour Astro ou API interne BD uniquement ? | Phase 4 |
| Q5 | Cosmic Themes : Orion ou Solstice ? | Phase 5 |
| Q6 | Chatbot RAG : Anthropic Claude ou OpenAI GPT ? | Phase 5 |
