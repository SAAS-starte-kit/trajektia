# 🧠 Trajektia CKG — Mémoire Active d'État & Avancement
<!-- Règle de contexte persistant auto-chargée par l'environnement Antigravity -->
**Dernière mise à jour :** 2026-09-21 | **Statut Projet :** Phase B & G (Ingestion & Rigueur Psychométrique)

---

## 🏛️ 1. Architecture & Règles Fixées (Inviolables)
- **Pipeline de preuves scientifiques G5 (Hybride) :**
  - **Étape 1 (Chasseur) :** `gpt-researcher` local (Ollama deepseek-r1 / OpenAlex / Web).
  - **Étape 2 (Juge de Rigueur) :** `ara-rigor-reviewer` (Audit épistémique ARA Seal Level 2, 6 dimensions).
  - *Ne jamais remplacer GPT Researcher par Autoresearch dans ce pipeline.*
- **Modélisation Psychométrique & Carrière :**
  - **Cadre :** Trait Activation Theory (TAT - Tett & Burnett, 2003).
  - **Calcul :** Régression Polynomiale & Méthodologie des Surfaces de Réponse (PR-RSM) pour quantifier les **tensions comportementales** et **opportunités d'épanouissement** (croisement IPIP-50 / O*NET 30.1 Work Styles).
  - Les citations ont été consolidées dans `ckg/references/TAT_PR_RSM_REFERENCE.md` et injectées dans les manuels.

---

## 📊 2. État des Données & Bases
- **Supabase (PostgreSQL Production) :**
  - **Statut :** En ligne & actif (`aws-1-ca-central-1.pooler.supabase.com:6543`).
  - **O*NET Job Zones :** **FAIT** (`job_zones_reference` 5 zones FR/EN + SVP/TEER, `onet_job_zones` 923 SOC, `occupations.job_zone` 813 métiers enrichis).
  - **Salaires / Métiers :** 4 421 occupations, salaires ESDC 2025 intégrés.
- **Neo4j (CKG Local) :**
  - **Statut :** Instance locale / Docker actuellement éteinte.
  - **Ingestors prêts :** `ckg/ingestors/onet_job_zones_ingestor.py` prêt pour synchronisation dès le démarrage du conteneur.

---

## 🎯 3. Prochaines Priorités du Plan d'Action (`ckg/PLAN_ACTION.md`)
1. **Titres alternatifs TCC 2025 (Synonymes) :** Enrichissement du dictionnaire de synonymes FR/EN pour optimiser le moteur de recherche sémantique.
2. **Synchronisation Neo4j (CKG) :** Démarrer Docker pour exécuter les ingestors en attente (`onet_job_zones_ingestor.py`).
3. **Vitrine Frontend Astro 6.1 :** Projection des scores PR-RSM (tensions/épanouissement) dans les fiches métiers et le simulateur d'orientation.
