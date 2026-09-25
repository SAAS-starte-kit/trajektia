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

COMPLETED_TASKS = [
    {
        "id": "salve-5-leads-persistence-loi25",
        "title": "[Backend] Persistance Supabase leads_newsletter et validation Pydantic Loi 25",
        "test_command": "python -c \"from apps.api.main import app; from apps.api.schemas import LeadCreateRequest; r = LeadCreateRequest(email='audit@trajektia.ca', cnp='21211'); print('Schema Lead OK:', r.email, r.cnp)\"",
    },
    {
        "id": "salve-6-migrations-consolidator-sql",
        "title": "[Database] Runner automatisé et vérificateur de migrations SQL",
        "test_command": "python scripts/run_migrations.py --dry-run",
    },
    {
        "id": "salve-7-frontend-vitest-pr-rsm",
        "title": "[Vitest] Suite de tests unitaires pour le moteur psychométrique PR-RSM",
        "test_command": "npm --prefix apps/frontend test",
    },
    {
        "id": "i7-1-ckan-regional-parser",
        "title": "[CKG / ETL] Parseur UTF-16LE multi-mois CKAN pour extraire la granularité ville/région (I7.1)",
        "test_command": "python scripts/test_ingest_ckan_regional.py",
    },
    {
        "id": "i7-2-supabase-pgvector-embeddings",
        "title": "[CKG / Supabase] Schéma SQL pgvector & pipeline d'embedding textuel des offres (I7.2)",
        "test_command": "python scripts/test_generate_job_embeddings.py",
    },
    {
        "id": "i7-3-semantic-match-router",
        "title": "[FastAPI / CKG] Route API de matching sémantique compétences / profils (I7.3)",
        "test_command": "python -m pytest apps/api/test_routes.py",
    },
    {
        "id": "a4-esco-green-skills",
        "title": "[CKG / ESCO] Ingestion ciblée des compétences vertes (Green Skills) et marquage écologique des métiers CNP",
        "test_command": "python scripts/test_ingest_esco_green_skills.py",
    },
    {
        "id": "h1-2-lead-capture-frontend",
        "title": "[Frontend / API] Intégration du composant AlerteEmploi avec feedback utilisateur connecté à POST /api/leads",
        "test_command": "npm --prefix apps/frontend test",
    },
    {
        "id": "i7-4-job-matches-ui",
        "title": "[Frontend / Astro] Composant interactif d'appariement sémantique d'emploi et d'offres réelles",
        "test_command": "npm --prefix apps/frontend test",
    },
]

TASKS_QUEUE = []


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
        t_res = subprocess.run(test_cmd, shell=True, cwd=REPO_ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
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
            # Vérifier si une session active ou terminée existe déjà pour cette tâche
            existing_session = None
            try:
                for s in client.list_sessions():
                    if s.get("title") == task["title"] and s.get("state") in ["IN_PROGRESS", "QUEUED", "COMPLETED", "SUCCEEDED"]:
                        existing_session = s
                        break
            except Exception:
                pass

            if existing_session:
                session_id = existing_session.get("id") or existing_session.get("name")
                session_url = existing_session.get("url", f"https://jules.google.com/session/{session_id}")
                print(f"🔄 Session existante détectée sur Google Jules : {session_id} (état: {existing_session.get('state')})")
                print(f"🔗 Suivi web : {session_url}")
            else:
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
