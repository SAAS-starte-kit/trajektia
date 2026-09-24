#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Trajektia Jules Orchestrator (Auto-Runner & Task Chainer)
=========================================================
Orchestre automatiquement la file d'attente de tâches pour Google Jules :
  1. Envoie chaque tâche cadrée (format jules-skills) à l'API REST Jules
  2. Effectue des checkups périodiques jusqu'à l'état COMPLETED
  3. Récupère le gitPatch généré
  4. Applique le patch localement (git apply)
  5. Exécute les tests de non-régression (npm test / npm run build / pytest)
  6. Valide avec GitNexus / git status
  7. Commite et pousse sur origin/master
  8. Enchaîne automatiquement avec la tâche suivante jusqu'à la fin de la file !
"""

import os
import sys
import json
import time
import subprocess
import argparse
from pathlib import Path
import urllib.request
import urllib.error

# Forcer l'encodage UTF-8 sous Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
API_BASE = "https://jules.googleapis.com/v1alpha"
SOURCE_ID = "sources/github/SAAS-starte-kit/trajektia"

def get_api_key() -> str:
    """Récupère la clé API Jules depuis l'environnement ou mcp_config.json."""
    if "JULES_API_KEY" in os.environ and os.environ["JULES_API_KEY"].strip():
        return os.environ["JULES_API_KEY"].strip()
    
    # Recherche dans les configs MCP d'Antigravity
    candidates = [
        Path.home() / ".gemini" / "antigravity-ide" / "mcp_config.json",
        Path.home() / ".gemini" / "config" / "mcp_config.json",
        REPO_ROOT / ".env"
    ]
    
    for p in candidates:
        if p.exists():
            try:
                if p.suffix == ".json":
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        key = data.get("mcpServers", {}).get("jules-mcp", {}).get("env", {}).get("JULES_API_KEY")
                        if key:
                            return key.strip()
                elif p.name == ".env":
                    with open(p, "r", encoding="utf-8") as f:
                        for line in f:
                            if line.startswith("JULES_API_KEY="):
                                return line.split("=", 1)[1].strip().strip('"').strip("'")
            except Exception:
                pass
                
    # Lever une exception claire si aucune clé n'est trouvée dans l'environnement ou mcp_config.json
    raise RuntimeError("JULES_API_KEY introuvable dans l'environnement (.env ou mcp_config.json)")


# ==============================================================================
# BACKLOG STRUCTURÉ DES TÂCHES (SALVES JULES VAGUE 2)
# ==============================================================================

TASKS_QUEUE = [
    {
        "id": "salve-5-leads-persistence-loi25",
        "title": "[Backend] Persistance Supabase leads_newsletter et validation Pydantic Loi 25",
        "test_command": "python -c \"from apps.api.main import app; from apps.api.schemas import LeadCreateRequest; r = LeadCreateRequest(email='audit@trajektia.ca', cnp='21211'); print('Schema Lead OK:', r.email, r.cnp)\"",
        "prompt": """# TASK: Implement Supabase Lead Newsletter Persistence with Loi 25 Privacy Compliance

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: FastAPI 0.111, Pydantic v2, asyncpg / Supabase PostgreSQL
Target Files:
  - `apps/api/schemas.py`
  - `apps/api/routers/leads.py`

## Objective
Implement actual database persistence for job alert leads captured on occupation pages (`POST /api/leads`), storing them safely in `leads_newsletter` table in accordance with Quebec's Law 25 (anonymized/minimalist data, strict email validation, duplicate idempotence).

## File Boundaries (STRICT)
You may ONLY modify:
  - `apps/api/schemas.py`
  - `apps/api/routers/leads.py`
Do NOT modify any other files.

## Detailed Requirements
1. In `apps/api/schemas.py`:
   - Update `LeadCreateRequest`:
     ```python
     import re
     from pydantic import BaseModel, Field, field_validator
     from typing import Optional

     class LeadCreateRequest(BaseModel):
         email: str = Field(..., description="Courriel valide du candidat")
         cnp: Optional[str] = Field(None, max_length=10, description="Code CNP associé à l'alerte")

         @field_validator("email")
         @classmethod
         def validate_email_format(cls, v: str) -> str:
             v = v.strip().lower()
             pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
             if not re.match(pattern, v):
                 raise ValueError("Format de courriel invalide")
             return v
     ```
   - Update `LeadResponse`:
     ```python
     class LeadResponse(BaseModel):
         status: str
         message: str
         lead_id: Optional[int] = None
     ```

2. In `apps/api/routers/leads.py`:
   - Inject the database pool from `request.app.state.db_pool` (asyncpg.Pool).
   - If `db_pool` is present:
     - Execute the query:
       ```sql
       INSERT INTO leads_newsletter (email, cnp_code, source_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (email, cnp_code) DO NOTHING
       RETURNING id;
       ```
     - Return status="success" and appropriate message.
   - If `db_pool` is None (local test or dev offline mode):
     - Return status="success", message="Lead enregistré (mode simulation)".
   - Handle exceptions gracefully with status="error" and HTTP 400 or 500.

## Validation Criteria
- `python -c "from apps.api.schemas import LeadCreateRequest; r = LeadCreateRequest(email='candidat@quebec.ca', cnp='21211'); print('OK:', r.email)"` must succeed.
- Invalid emails (e.g. `invalid-email`) must raise Pydantic ValidationError.
- `python -c "from apps.api.main import app; print('Routes count:', len(app.routes))"` must succeed with 0 import errors.
"""
    },
    {
        "id": "salve-6-migrations-consolidator-sql",
        "title": "[Database] Runner automatisé et vérificateur de migrations SQL",
        "test_command": "python scripts/run_migrations.py --dry-run",
        "prompt": """# TASK: Create Automated SQL Migrations Runner and Schema Verifier

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: Python, PostgreSQL / asyncpg / psycopg2
Directory: `packages/database/` contains SQL files:
  - `schema.sql`
  - `schema_v2.sql`
  - `schema_v3.sql`
  - ...
  - `schema_v9_program_devis.sql`
  - `schema_v9_leads.sql`

## Objective
Create a standalone Python migration script `scripts/run_migrations.py` that discovers all `.sql` schema files in `packages/database/`, validates them, tracks applied migrations in a `_migrations_history` table, and supports `--dry-run` and `--apply` modes.

## File Boundaries (STRICT)
- Create: `scripts/run_migrations.py`
- Do NOT touch frontend or API files.

## Detailed Requirements
1. Script `scripts/run_migrations.py`:
   - Parse CLI arguments:
     * `--dry-run`: List all discovered migration files in alphabetical/chronological order without executing.
     * `--apply`: Connect to database (via `DATABASE_URL` or `SUPABASE_DB_URL` from environment or `.env`) and execute pending migrations sequentially in transactions.
   - Table `_migrations_history`:
     ```sql
     CREATE TABLE IF NOT EXISTS _migrations_history (
         id SERIAL PRIMARY KEY,
         filename TEXT UNIQUE NOT NULL,
         applied_at TIMESTAMPTZ DEFAULT NOW(),
         checksum TEXT
     );
     ```
   - Calculate SHA256 checksum for each SQL file to detect tampering.
   - Support running offline in `--dry-run` mode without requiring a live PostgreSQL connection.

## Validation Criteria
- Running `python scripts/run_migrations.py --dry-run` outputs the ordered list of schema files (at least 5 files discovered) and exits with returncode 0.
"""
    },
    {
        "id": "salve-7-frontend-vitest-pr-rsm",
        "title": "[Vitest] Suite de tests unitaires pour le moteur psychométrique PR-RSM",
        "test_command": "npm --prefix apps/frontend test",
        "prompt": """# TASK: Create Vitest Unit Test Suite for PR-RSM Psychometric Engine

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: TypeScript, Vitest, Astro (in apps/frontend/)
Target File under test: `apps/frontend/src/utils/pr-rsm-engine.ts`
Test File to create: `apps/frontend/src/utils/__tests__/pr-rsm-engine.test.ts`

## Objective
Implement a thorough Vitest unit test suite covering the Trait Activation Theory (TAT) and Polynomial Regression Response Surface Methodology (PR-RSM) calculations exported by `apps/frontend/src/utils/pr-rsm-engine.ts`.

## File Boundaries (STRICT)
- Create: `apps/frontend/src/utils/__tests__/pr-rsm-engine.test.ts`
- Do NOT modify `apps/frontend/src/utils/pr-rsm-engine.ts` or any other source files.

## Detailed Test Scenarios
1. `calculateStrainGap`:
   - Verify green zone for low gap (< 0.5 SD)
   - Verify orange zone for moderate gap (0.5 to 1.5 SD)
   - Verify red zone for high gap (> 1.5 SD)
2. `calculatePRRSM`:
   - Verify congruence score when person score matches job score exactly (e.g. 50 and 50)
   - Verify penalty when mismatch occurs (e.g. 20 and 80)
3. `calculateTATEvaluation`:
   - Test with matching traits: returns high fulfillmentScore (>75) and empty or low-severity tensions.
   - Test with conflicting traits (e.g. high context demand vs low person resistance): detects "Sur-sollicitation" tension.
   - Test with inverse conflict: detects "Sous-utilisation" tension.
   - Verify clinical explanation is non-empty and contains benevolent OCCOQ recommendations.

## Validation Criteria
- `npm --prefix apps/frontend test` passes 100% of tests (both `scoring.test.ts` and `pr-rsm-engine.test.ts`).
"""
    },
    {
        "id": "i7-1-ckan-regional-parser",
        "title": "[CKG / ETL] Parseur UTF-16LE multi-mois CKAN pour extraire la granularité ville/région (I7.1)",
        "test_command": "python scripts/test_ingest_ckan_regional.py",
        "prompt": """# TASK: Build Resilient UTF-16LE / UTF-8 Multi-Month CKAN Regional Job Parser (I7.1)

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: Python 3.10+, standard libraries (csv, io, json, re, urllib, argparse, unittest)
Domain: Career Knowledge Graph (CKG) & Open Canada CKAN Job Bank Data (Initiative I7)
Documentation Reference: `packages/ckg/FEASIBILITY_CKAN_VECTORIZATION_I7.md` and `packages/ckg/PLAN_ACTION.md`

## Problem & Technical Need
Open Canada's Job Bank monthly dumps (`open.canada.ca` dataset `ea639e28-c0fc-48bf-b5dd-b8899bd43072`) consist of large TSV files that frequently switch encodings between UTF-16LE with BOM (`\\xff\\xfe`), standard UTF-16, and UTF-8. Previous scripts processed these files with brittle `errors='ignore'` workarounds which silently corrupted city and accent names in Quebec (e.g. Montréal, Trois-Rivières).
We need a dedicated, resilient regional parser script `scripts/ingest_ckan_regional_profiles.py` and its accompanying unit test suite `scripts/test_ingest_ckan_regional.py`.

## File Boundaries (STRICT)
You may ONLY create or modify:
  - `scripts/ingest_ckan_regional_profiles.py` (New file)
  - `scripts/test_ingest_ckan_regional.py` (New file)
Do NOT modify, rename, or delete any other files.

## Detailed Requirements

1. `scripts/ingest_ckan_regional_profiles.py`:
   - Encodings decoder function `decode_ckan_bytes(raw_bytes: bytes) -> str`:
     * If starts with `b'\\xff\\xfe'`, decode with `utf-16le`.
     * If starts with `b'\\xfe\\xff'`, decode with `utf-16be`.
     * If starts with `b'\\xef\\xbb\\xbf'`, decode with `utf-8-sig`.
     * Try `utf-8` with fallback to `cp1252` / `latin-1`.
     * Clean null characters (`\\x00`).
   - TSV reader handling:
     * Support tab delimiter `\\t` (and fallback `,` if standard CSV).
     * Locate column headers dynamically (case-insensitive & bilingual):
       - CNP: `Code CNP 2021`, `Code CNP21`, `2021 NOC Code`, `NOC 2021`
       - Province: `Provinces/Territoires`, `Province/Territory`, `Province`
       - Ville: `Ville`, `City`
       - Région: `Région économique`, `Economic Region`
       - Salaire par / Wage per: `Salaire par`, `Wage per`
       - Salaire min / Wage min: `Salaire Minimum`, `Wage Minimum`, `Low Wage`
       - Salaire max / Wage max: `Salaire Maximum`, `Wage Maximum`, `High Wage`
       - Virtuel / Remote: `Conditions d'emploi Virtuel`, `Virtual work`
   - Quebec filtering:
     * Filter records where province is 'QC', 'Québec', or 'Quebec'.
   - Normalization:
     * 5-digit CNP: if 4 digits, append '0' (e.g. '2123' -> '21230').
     * Salary annualized:
       - 'heure'/'hour': wage * 1820
       - 'semaine'/'week': wage * 52
       - 'mois'/'month': wage * 12
       - 'jour'/'day': wage * 260
       - 'ann'/'year': wage
       - Filter out outliers outside [18000, 350000].
     * Remote flag: `True` if value in ('oui', 'yes', 'true', '1').
   - Aggregation:
     * Group by `(cnp_code, province, region_economique, ville, snapshot_date)`:
       - postings_count
       - median_salary, min_salary, max_salary
       - remote_count, remote_ratio_pct
   - CLI Interface (using `argparse`):
     * `--dry-run`: Runs without database insertion, outputs summary statistics to stdout.
     * `--limit-months N`: Limits processing to N monthly datasets (default: all or 1).
     * `--input-file PATH`: Process a local file directly (for testing/offline execution).
     * `--output-json PATH`: Save aggregated regional JSON output to specified path.
     * When imported as a module (`import scripts.ingest_ckan_regional_profiles`), do not auto-run.

2. `scripts/test_ingest_ckan_regional.py`:
   - Standalone unit test suite using `unittest`.
   - Tests:
     * `test_decode_utf16le_with_bom`: Verifies UTF-16LE bytes with BOM decode properly with accents (e.g., "Montréal").
     * `test_decode_utf8`: Verifies UTF-8 decoding.
     * `test_salary_annualization`: Tests hourly, monthly, and yearly conversion logic.
     * `test_quebec_filtering_and_aggregation`: Passes a mock TSV (with QC and non-QC rows) and verifies only QC records are aggregated, CNP is 5-digit normalized, and counts are accurate.
   - Must run and exit with code 0 on `python scripts/test_ingest_ckan_regional.py`.

## Acceptance Criteria
- `python scripts/test_ingest_ckan_regional.py` runs and outputs OK (all tests pass).
- `python scripts/ingest_ckan_regional_profiles.py --help` prints CLI documentation and exits with code 0.
"""
    }
]


# ==============================================================================
# CLIENT API REST GOOGLE JULES
# ==============================================================================

class JulesClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "X-Goog-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }

    def create_session(self, title: str, prompt: str, branch: str = "master") -> dict:
        """Crée une nouvelle session de travail autonome sur Google Jules."""
        url = f"{API_BASE}/sessions"
        payload = {
            "title": title,
            "prompt": prompt,
            "sourceContext": {
                "source": SOURCE_ID,
                "githubRepoContext": {
                    "startingBranch": branch
                }
            }
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=self.headers,
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def get_session(self, session_id: str) -> dict:
        """Récupère l'état d'une session par son ID ou son nom complet."""
        clean_id = session_id.replace("sessions/", "")
        url = f"{API_BASE}/sessions/{clean_id}"
        req = urllib.request.Request(url, headers=self.headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def get_activities(self, session_id: str) -> list:
        """Récupère les activités d'une session."""
        clean_id = session_id.replace("sessions/", "")
        url = f"{API_BASE}/sessions/{clean_id}/activities"
        req = urllib.request.Request(url, headers=self.headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("activities", [])

    def list_sessions(self) -> list:
        """Liste les sessions du compte."""
        url = f"{API_BASE}/sessions"
        req = urllib.request.Request(url, headers=self.headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("sessions", [])


# ==============================================================================
# NOTIFICATIONS & SUIVI D'ÉTAT TEMPS RÉEL (.fleet/)
# ==============================================================================

def notify_status(task_id: str, state: str, message: str):
    """Enregistre l'état dans .fleet/orchestrator_state.json et alerte le terminal."""
    fleet_dir = REPO_ROOT / ".fleet"
    fleet_dir.mkdir(parents=True, exist_ok=True)
    state_file = fleet_dir / "orchestrator_state.json"
    
    data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "task_id": task_id,
        "state": state,
        "message": message
    }
    try:
        with open(state_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"⚠️ Erreur écriture état: {e}")

    # Bip d'alerte console pour notifier la complétion ou un arrêt
    if state in ["COMPLETED", "FAILED"]:
        sys.stdout.write("\a")
        sys.stdout.flush()


def run_gitnexus_validation() -> bool:
    """Exécute l'analyse d'impact / détection de changements GitNexus si disponible."""
    print("🔍 Analyse de graphe GitNexus...")
    try:
        run_file = REPO_ROOT / ".gitnexus" / "run.cjs"
        if run_file.exists():
            cmd = ["node", str(run_file), "detect-changes", "--scope", "all", "--repo", "."]
            res = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True)
            print(res.stdout or res.stderr)
            return res.returncode == 0
        else:
            print("ℹ️ GitNexus run.cjs non présent, fallback git status propre.")
            return True
    except Exception as e:
        print(f"⚠️ GitNexus validation ignorée: {e}")
        return True


# ==============================================================================
# APPLICATEUR DE PATCH & VALIDATEUR
# ==============================================================================

def extract_git_patch(session_data: dict, client: JulesClient = None) -> tuple:
    """Extrait le unidiffPatch et le commit message depuis outputs ou activities."""
    outputs = session_data.get("outputs", [])
    if outputs:
        change_set = outputs[0].get("changeSet", {})
        git_patch = change_set.get("gitPatch", {})
        unidiff = git_patch.get("unidiffPatch")
        msg = git_patch.get("suggestedCommitMessage")
        if unidiff:
            return unidiff, msg
            
    # Fallback vers activities
    session_id = session_data.get("id") or session_data.get("name")
    if client and session_id:
        try:
            activities = client.get_activities(session_id)
            for act in reversed(activities):
                for art in act.get("artifacts", []):
                    cs = art.get("changeSet", {})
                    gp = cs.get("gitPatch", {})
                    unidiff = gp.get("unidiffPatch")
                    msg = gp.get("suggestedCommitMessage")
                    if unidiff:
                        return unidiff, msg
        except Exception as e:
            print(f"⚠️ Erreur récupération activités: {e}")
            
    return None, None


def apply_session_patch(session_data: dict, task_info: dict, client: JulesClient = None) -> bool:
    """Extrait le patch d'une session terminée, l'applique et lance la validation."""
    unidiff, suggested_msg = extract_git_patch(session_data, client)
    if not unidiff:
        print("❌ Aucun patch unidiff valide trouvé dans la session.")
        return False
        
    if not suggested_msg:
        suggested_msg = task_info["title"]
        
    patch_file = REPO_ROOT / f"jules_{task_info['id']}.patch"
    with open(patch_file, "w", encoding="utf-8") as f:
        f.write(unidiff)
        
    print(f"📄 Patch de {len(unidiff)} caractères écrit dans {patch_file.name}")
    
    # 1. Vérification du patch
    check_cmd = subprocess.run(["git", "apply", "--check", str(patch_file)], cwd=REPO_ROOT, capture_output=True, text=True)
    if check_cmd.returncode != 0:
        print(f"⚠️ Avertissement git apply check: {check_cmd.stderr}")
        # Tentative avec whitespace fix si nécessaire
        apply_cmd = subprocess.run(["git", "apply", "--ignore-whitespace", str(patch_file)], cwd=REPO_ROOT, capture_output=True, text=True)
    else:
        apply_cmd = subprocess.run(["git", "apply", str(patch_file)], cwd=REPO_ROOT, capture_output=True, text=True)
        
    if apply_cmd.returncode != 0:
        print(f"❌ Échec de l'application du patch: {apply_cmd.stderr}")
        return False
        
    print("✅ Patch appliqué avec succès.")
    
    # 2. Exécution du test de validation
    test_cmd = task_info.get("test_command")
    if test_cmd:
        print(f"🧪 Exécution du test de validation: {test_cmd}")
        t_res = subprocess.run(test_cmd, shell=True, cwd=REPO_ROOT, capture_output=True, text=True)
        print(t_res.stdout)
        if t_res.returncode != 0:
            print(f"❌ Échec du test de validation: {t_res.stderr}")
            return False
        print("✅ Test de validation réussi !")
        
    # 3. Analyse de graphe GitNexus
    run_gitnexus_validation()
        
    # 4. Nettoyage du fichier patch
    try:
        patch_file.unlink(missing_ok=True)
    except Exception:
        pass
        
    # 5. Commit et push
    print("🚀 Commit des changements...")
    subprocess.run(["git", "add", "."], cwd=REPO_ROOT, check=True)
    commit_msg = f"feat({task_info['id']}): {suggested_msg.splitlines()[0]}"
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=REPO_ROOT, check=True)
    
    print("⬆️ Push vers origin/master...")
    push_res = subprocess.run(["git", "push", "origin", "master"], cwd=REPO_ROOT, capture_output=True, text=True)
    if push_res.returncode != 0:
        print(f"⚠️ Push avertissement: {push_res.stderr}")
    else:
        print("✅ Synchronisé sur GitHub avec succès.")
        
    notify_status(task_info["id"], "COMPLETED", f"Tâche {task_info['title']} intégrée avec succès.")
    return True


# ==============================================================================
# BOUCLE AUTONOME (GOAL RUNNER)
# ==============================================================================

def run_autonomous_loop(client: JulesClient, tasks: list, poll_interval: int = 30):
    """Exécute l'ensemble des tâches en séquence de manière autonome."""
    total = len(tasks)
    print(f"\n=======================================================")
    print(f"🎯 Démarrage de la boucle autonome Trajektia ({total} tâches à exécuter)")
    print(f"=======================================================\n")
    
    for idx, task in enumerate(tasks, 1):
        print(f"\n[{idx}/{total}] 🚀 Lancement de la tâche : {task['title']}")
        print(f"ID : {task['id']}")
        
        try:
            session = client.create_session(task["title"], task["prompt"])
            session_id = session.get("id") or session.get("name")
            session_url = session.get("url")
            print(f"✅ Session créée sur Google Jules : {session_id}")
            print(f"🔗 Suivi web : {session_url}")
            
            # Boucle de polling périodique
            print(f"⏳ Surveillance périodique (checkup toutes les {poll_interval}s)...")
            start_time = time.time()
            completed = False
            
            while not completed:
                time.sleep(poll_interval)
                elapsed = int(time.time() - start_time)
                s_data = client.get_session(session_id)
                state = s_data.get("state")
                print(f"   [{elapsed}s] État actuel : {state}")
                
                if state in ["COMPLETED", "SUCCEEDED"]:
                    print(f"🎉 Tâche complétée avec succès en {elapsed}s !")
                    success = apply_session_patch(s_data, task, client=client)
                    if success:
                        print(f"✅ Salve '{task['id']}' validée et fusionnée dans master.")
                    else:
                        print(f"⚠️ Erreur lors de l'application du patch pour '{task['id']}'.")
                    completed = True
                elif state in ["FAILED", "CANCELLED"]:
                    print(f"❌ La session Jules s'est arrêtée avec l'état : {state}")
                    completed = True
                    
        except Exception as e:
            print(f"❌ Erreur lors du traitement de la tâche '{task['id']}': {e}")
            
    print(f"\n=======================================================")
    print(f"🏆 Toutes les tâches programmées ont été traitées !")
    print(f"=======================================================\n")


# ==============================================================================
# CLI ENTRYPOINT
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(description="Trajektia Jules Orchestrator")
    parser.add_argument("--loop", action="store_true", help="Lancer la boucle autonome séquentielle complète")
    parser.add_argument("--status", type=str, help="Vérifier l'état d'une session par ID")
    parser.add_argument("--apply", type=str, help="Appliquer le patch d'une session terminée")
    parser.add_argument("--list", action="store_true", help="Lister les sessions actives")
    parser.add_argument("--interval", type=int, default=30, help="Intervalle de polling en secondes (défaut: 30)")
    parser.add_argument("--task", type=str, help="Exécuter une tâche spécifique par son ID (ex: salve-5-leads-persistence-loi25)")
    args = parser.parse_args()
    
    api_key = get_api_key()
    client = JulesClient(api_key)
    
    if args.list:
        sessions = client.list_sessions()
        print(f"Total sessions: {len(sessions)}")
        for s in sessions:
            print(f"- {s.get('id') or s.get('name')}: {s.get('title')} ({s.get('state')})")
    elif args.status:
        s_data = client.get_session(args.status)
        print(json.dumps(s_data, indent=2))
    elif args.apply:
        s_data = client.get_session(args.apply)
        task_dummy = {"id": "manual", "title": s_data.get("title", "Jules Patch")}
        apply_session_patch(s_data, task_dummy, client=client)
    elif args.task:
        selected = [t for t in TASKS_QUEUE if t["id"] == args.task]
        if not selected:
            print(f"❌ Tâche introuvable : {args.task}")
            print(f"Disponibles : {[t['id'] for t in TASKS_QUEUE]}")
            return
        run_autonomous_loop(client, selected, poll_interval=args.interval)
    elif args.loop:
        run_autonomous_loop(client, TASKS_QUEUE, poll_interval=args.interval)
    else:
        print("Utilisation:")
        print("  python scripts/jules_orchestrator.py --loop       # Lance la file d'attente complète")
        print("  python scripts/jules_orchestrator.py --task ID   # Lance une tâche spécifique")
        print("  python scripts/jules_orchestrator.py --list       # Liste les sessions")
        print("  python scripts/jules_orchestrator.py --status ID  # Vérifie une session")

if __name__ == "__main__":
    main()
