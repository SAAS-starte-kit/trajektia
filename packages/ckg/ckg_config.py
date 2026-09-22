"""
ckg_config.py
=============
Configuration partagée pour tous les scripts du Career Knowledge Graph (CKG).
Import depuis n'importe quel script CKG :
    from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, DATA_RAW

Usage:
    cd trajektia/
    python ckg/ingestors/onet_tech_ingestor.py
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── Résoudre les chemins depuis la racine du projet trajektia/ ─────────────────
_CKG_DIR    = Path(__file__).resolve().parent          # trajektia/ckg/
_TRAJ_ROOT  = _CKG_DIR.parent                          # trajektia/
_PROJ_ROOT  = _TRAJ_ROOT.parent                        # saas-ai-starter/
_DOTENV     = _TRAJ_ROOT / ".env"

load_dotenv(_DOTENV, override=True)

# ── Connexion Neo4j ────────────────────────────────────────────────────────────
NEO4J_URI      = os.getenv("NEO4J_URI",      "bolt://localhost:7687")
NEO4J_USER     = os.getenv("NEO4J_USER",     "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

# ── Connexion Supabase / PostgreSQL ───────────────────────────────────────────
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")

# ── Chemins des données sources ───────────────────────────────────────────────
DATA_RAW       = _PROJ_ROOT / "data" / "raw"
DATA_ONET      = DATA_RAW / "onet" / "db_28_2_text" / "db_28_2_text"
DATA_SIPEC     = DATA_RAW / "sipec"
DATA_CROSSWALK = DATA_RAW / "crosswalks"

# Fichiers O*NET
ONET_TECH_SKILLS   = DATA_ONET / "Technology Skills.txt"
ONET_TOOLS_USED    = DATA_ONET / "Tools Used.txt"
ONET_SKILLS        = DATA_ONET / "Skills.txt"
ONET_ABILITIES     = DATA_ONET / "Abilities.txt"
ONET_KNOWLEDGE     = DATA_ONET / "Knowledge.txt"
ONET_WORK_STYLES   = DATA_ONET / "Work Styles.txt"
ONET_WORK_VALUES   = DATA_ONET / "Work Values.txt"
ONET_INTERESTS     = DATA_ONET / "Interests.txt"
ONET_WORK_CONTEXT  = DATA_ONET / "Work Context.txt"
ONET_WORK_ACTIVITY = DATA_ONET / "Work Activities.txt"
ONET_TASK_STMTS    = DATA_ONET / "Task Statements.txt"
ONET_JOB_ZONES     = DATA_ONET / "Job Zones.txt"
ONET_JOB_ZONE_REF  = DATA_ONET / "Job Zone Reference.txt"
ONET_OCC_DATA      = DATA_ONET / "Occupation Data.txt"

# Fichiers Crosswalks
CROSSWALK_NOC_ONET = DATA_CROSSWALK / "noc_onet_mapping.csv"
CROSSWALK_ESCO_ONET = DATA_CROSSWALK / "esco_onet_mapping.csv"

# Données salaires
WAGES_CSV = DATA_RAW / "wages_2025.csv"

# ── Vérification rapide au démarrage ──────────────────────────────────────────
if __name__ == "__main__":
    print("=== CKG Config ===")
    print(f"Neo4j URI      : {NEO4J_URI}")
    print(f"Neo4j User     : {NEO4J_USER}")
    print(f"Password set   : {'[OK]' if NEO4J_PASSWORD else '[MANQUANT]'}")
    print(f"Supabase URL   : {'[OK] defini' if SUPABASE_DB_URL else '[MANQUANT]'}")
    print()
    print("=== Fichiers de donnees ===")
    files = {
        "O*NET Technology Skills": ONET_TECH_SKILLS,
        "O*NET Tools Used":        ONET_TOOLS_USED,
        "O*NET Skills":            ONET_SKILLS,
        "O*NET Knowledge":         ONET_KNOWLEDGE,
        "O*NET Work Context":      ONET_WORK_CONTEXT,
        "O*NET Job Zones":         ONET_JOB_ZONES,
        "O*NET Job Zone Reference": ONET_JOB_ZONE_REF,
        "O*NET Occupation Data":   ONET_OCC_DATA,
        "Crosswalk NOC-O*NET":     CROSSWALK_NOC_ONET,
        "Crosswalk ESCO-O*NET":    CROSSWALK_ESCO_ONET,
        "Salaires ESDC 2025":      WAGES_CSV,
    }
    for label, path in files.items():
        status = "[OK]" if path.exists() else "[MANQUANT]"
        print(f"  {status}  {label}: {path.name}")
