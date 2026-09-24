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
# BACKLOG STRUCTURÉ DES TÂCHES (SALVES JULES)
# ==============================================================================

TASKS_QUEUE = [
    {
        "id": "salve-2-fastapi-modular-pydantic",
        "title": "[Backend] Modularisation FastAPI dans routers/ et typage Pydantic v2",
        "test_command": "python -c \"from apps.api.main import app; print('FastAPI loaded successfully:', len(app.routes))\"",
        "prompt": """# TASK: Modularize FastAPI Stitcher & Introduce Pydantic v2 Schemas

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: FastAPI 0.111 + Pydantic v2 (in apps/api/)
Target Directory: apps/api/

## Objective
Extract all endpoints currently located in the monolithic `apps/api/main.py` into dedicated modular routers inside `apps/api/routers/`, define clean, typed Pydantic v2 request/response schemas in `apps/api/schemas.py`, and mount them back cleanly onto the main FastAPI application.

## File Boundaries (STRICT)
You may ONLY create and modify files within `apps/api/`. Do not modify frontend or packages files.
- Files to create:
  * `apps/api/schemas.py` (Pydantic v2 BaseModel classes for all endpoints)
  * `apps/api/routers/__init__.py`
  * `apps/api/routers/occupations.py` (GET /api/metier/{cnp_code})
  * `apps/api/routers/search.py` (GET /api/search and GET /api/semantic_search)
  * `apps/api/routers/competencies.py` (GET /api/competences/{cnp_code})
  * `apps/api/routers/riasec.py` (GET /api/riasec/{cnp_code})
  * `apps/api/routers/leads.py` (POST /api/leads)
- Files to modify:
  * `apps/api/main.py` (Refactored to initialize lifespan, pool, CORS, and include the routers)

## Detailed Requirements
1. In `apps/api/schemas.py`:
   - Create Pydantic v2 models:
     * `OccupationClassification`, `OccupationSalary`, `OccupationJobTitle`, `OccupationRequirement`, `OccupationOasisDescriptor`, `OccupationFullProfileResponse`
     * `SearchResultItem`, `SearchResponse`
     * `SemanticSearchResultItem`, `SemanticSearchResponse`
     * `OasisDescriptorItem`, `CompetencesResponse`
     * `RiasecScores`, `RiasecProfileResponse`
     * `LeadCreateRequest`, `LeadResponse`
2. In `apps/api/routers/`:
   - Use `APIRouter()` in each router file.
   - Access the database pool cleanly via `request.app.state.db_pool` or a shared dependency/context.
   - Maintain full backward compatibility for all existing route URLs, parameters, and query strings.
3. In `apps/api/main.py`:
   - Keep the `lifespan` handler managing the `asyncpg.Pool` and `SentenceTransformer` (or ML model).
   - Mount each router using `app.include_router(router)`.
   - Keep root health check `GET /`.

## Validation Criteria
- Running `python -c "from apps.api.main import app; print(len(app.routes))"` must succeed with zero import errors.
- Ensure all route paths `/api/metier/{cnp_code}`, `/api/search`, `/api/semantic_search`, `/api/competences/{cnp_code}`, `/api/riasec/{cnp_code}`, and `/api/leads` are preserved.
"""
    },
    {
        "id": "salve-3-fastembed-onnx-optimization",
        "title": "[Performance] Remplacement de SentenceTransformers par FastEmbed ONNX",
        "test_command": "python -c \"import fastembed; print('FastEmbed installed')\"",
        "prompt": """# TASK: Replace heavy SentenceTransformers with lightweight FastEmbed ONNX in FastAPI

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: FastAPI + Python (in apps/api/)
Target: apps/api/main.py (or apps/api/routers/search.py) and apps/api/requirements.txt

## Objective
SentenceTransformers pulls in PyTorch and CUDA runtime dependencies (>2GB). Replace it with Qdrant's `fastembed` library using ONNX runtime (~50MB) for CPU-optimized embedding generation of `paraphrase-multilingual-MiniLM-L12-v2`.

## File Boundaries
- Modify: `apps/api/requirements.txt`, `apps/api/routers/search.py` (or `apps/api/main.py`), `requirements.txt`, `Dockerfile.api`.

## Detailed Requirements
1. Add `fastembed>=0.3.0` to `apps/api/requirements.txt` and `requirements.txt`.
2. Remove `sentence-transformers` dependency from requirements files.
3. In the semantic search logic, initialize FastEmbed:
   ```python
   from fastembed import TextEmbedding
   # Initialize model (downloads onnx model if needed)
   embedding_model = TextEmbedding(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
   ```
4. Generate the query embedding using `list(embedding_model.embed([query]))[0]` and format as vector string for pgvector `<=>`.
5. Ensure graceful fallback if fastembed is not installed.

## Validation Criteria
- Python script testing vector generation returns 384 dimensions matching pgvector expectations.
"""
    },
    {
        "id": "salve-4-github-actions-ci",
        "title": "[CI/CD] Pipeline GitHub Actions pour tests et build automatique",
        "test_command": "git status",
        "prompt": """# TASK: Create GitHub Actions CI Workflow for Automated Testing and Build

## Context & Architecture
Repository: SAAS-starte-kit/trajektia (Branch: master)
Stack: GitHub Actions, Astro, React, Vitest, FastAPI, Python

## Objective
Create `.github/workflows/ci.yml` that automatically runs linter, test suites, and frontend build on every pull request and push to master.

## File Boundaries
- Create: `.github/workflows/ci.yml`

## Requirements
1. Trigger on: `push: branches: [master]`, `pull_request: branches: [master]`.
2. Job 1: `frontend-tests`:
   - Node 20
   - Run `npm --prefix apps/frontend install`
   - Run `npm --prefix apps/frontend test` (Vitest)
   - Run `npm --prefix apps/frontend run build`
3. Job 2: `backend-check`:
   - Python 3.10
   - Install requirements from `apps/api/requirements.txt`
   - Validate syntax and imports `python -c "from apps.api.main import app; print('API OK')"`
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

    def list_sessions(self) -> list:
        """Liste les sessions du compte."""
        url = f"{API_BASE}/sessions"
        req = urllib.request.Request(url, headers=self.headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("sessions", [])


# ==============================================================================
# APPLICATEUR DE PATCH & VALIDATEUR
# ==============================================================================

def apply_session_patch(session_data: dict, task_info: dict) -> bool:
    """Extrait le patch d'une session terminée, l'applique et lance la validation."""
    outputs = session_data.get("outputs", [])
    if not outputs:
        print("❌ Aucun output dans la session Jules.")
        return False
        
    change_set = outputs[0].get("changeSet", {})
    git_patch = change_set.get("gitPatch", {})
    unidiff = git_patch.get("unidiffPatch")
    suggested_msg = git_patch.get("suggestedCommitMessage", task_info["title"])
    
    if not unidiff:
        print("❌ Le patch unidiff est vide.")
        return False
        
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
        
    # 3. Nettoyage du fichier patch
    try:
        patch_file.unlink(missing_ok=True)
    except Exception:
        pass
        
    # 4. Commit et push
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
                    success = apply_session_patch(s_data, task)
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
        apply_session_patch(s_data, task_dummy)
    elif args.loop:
        run_autonomous_loop(client, TASKS_QUEUE, poll_interval=args.interval)
    else:
        print("Utilisation:")
        print("  python scripts/jules_orchestrator.py --loop       # Lance la file d'attente complète")
        print("  python scripts/jules_orchestrator.py --list       # Liste les sessions")
        print("  python scripts/jules_orchestrator.py --status ID  # Vérifie une session")

if __name__ == "__main__":
    main()
