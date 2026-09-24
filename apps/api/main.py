"""
TRAJEKTIA — FastAPI Stitcher
Version  : 1.0.0
Date     : 2026-04-28

API publique pour alimenter :
  - La vitrine Astro 6.1 (fiches métier, recherche)
  - Les widgets Brilliant Directories (RIASEC radar)

Endpoints :
  GET /api/metier/{cnp_code}          — Profil complet d'une profession
  GET /api/search?q=&teer=&riasec=    — Recherche full-text
  GET /api/competences/{cnp_code}     — Descripteurs OaSIS par profession
  GET /api/riasec/{cnp_code}          — Profil RIASEC
  GET /                               — Health check
"""

import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os
import json
import asyncio
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv

# Import routers
from apps.api.routers import (
    occupations_router,
    search_router,
    competencies_router,
    riasec_router,
    leads_router
)

# Charger .env depuis la racine du projet
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

# ML dependencies (Chargement conditionnel pour éviter un crash si manquant)
try:
    from fastembed import TextEmbedding
    HAS_ML = True
except ImportError:
    HAS_ML = False
    print("⚠️ Attention: fastembed non installé. La recherche sémantique sera désactivée.")

# Langfuse Observability
try:
    from langfuse import observe
    HAS_LANGFUSE = True
except ImportError:
    HAS_LANGFUSE = False
    def observe(*args, **kwargs):
        def decorator(func):
            return func
        return decorator

# ── Configuration ─────────────────────────────────────────────
DATABASE_URL = os.environ.get("SUPABASE_DB_URL", "")
CORS_ORIGINS = json.loads(os.environ.get("CORS_ORIGINS", '["http://localhost:3000"]'))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie : initialise le pool DB au démarrage."""
    db_pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=30,
        statement_cache_size=0,
    )
    print("✅ Pool PostgreSQL initialisé")
    
    # Store pool in app.state
    app.state.db_pool = db_pool
    
    # Chargement du modèle IA local
    if HAS_ML:
        print("🧠 Chargement du modèle d'Intelligence Artificielle en mémoire (MiniLM)...")
        # On exécute le chargement dans un thread séparé pour ne pas bloquer la boucle asynchrone
        app.state.semantic_model = await asyncio.to_thread(TextEmbedding, model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        app.state.has_ml = True
        print("✅ Modèle d'Intelligence Artificielle chargé et prêt")
    else:
        app.state.semantic_model = None
        app.state.has_ml = False
    
    yield
    await db_pool.close()
    print("🔒 Pool PostgreSQL fermé")


# ── Application FastAPI ───────────────────────────────────────
app = FastAPI(
    title="Trajektia API",
    description="API publique du Graphe de Connaissances de Carrière (CKG) québécois.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ── Health check ──────────────────────────────────────────────
@app.get("/", tags=["Système"])
async def health_check():
    """Vérification de l'état de l'API."""
    return {"status": "ok", "service": "Trajektia API", "version": "1.0.0"}

# ── Routers ───────────────────────────────────────────────────
app.include_router(occupations_router)
app.include_router(search_router)
app.include_router(competencies_router)
app.include_router(riasec_router)
app.include_router(leads_router)
