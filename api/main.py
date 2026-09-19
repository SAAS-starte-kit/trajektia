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

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os
import json
import asyncio
from typing import Optional
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv

# Charger .env depuis la racine du projet
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

# ML dependencies (Chargement conditionnel pour éviter un crash si manquant)
try:
    from sentence_transformers import SentenceTransformer
    HAS_ML = True
except ImportError:
    HAS_ML = False
    print("⚠️ Attention: sentence-transformers non installé. La recherche sémantique sera désactivée.")

# ── Configuration ─────────────────────────────────────────────
DATABASE_URL = os.environ.get("SUPABASE_DB_URL", "")
CORS_ORIGINS = json.loads(os.environ.get("CORS_ORIGINS", '["http://localhost:3000"]'))

# ── Pool de connexions PostgreSQL ─────────────────────────────
db_pool: asyncpg.Pool | None = None
semantic_model = None  # Instance globale du modèle IA


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie : initialise le pool DB au démarrage."""
    global db_pool
    db_pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=30,
        statement_cache_size=0,
    )
    print("✅ Pool PostgreSQL initialisé")
    
    # Chargement du modèle IA local
    global semantic_model
    if HAS_ML:
        print("🧠 Chargement du modèle d'Intelligence Artificielle en mémoire (MiniLM)...")
        # On exécute le chargement dans un thread séparé pour ne pas bloquer la boucle asynchrone
        semantic_model = await asyncio.to_thread(SentenceTransformer, 'paraphrase-multilingual-MiniLM-L12-v2')
        print("✅ Modèle d'Intelligence Artificielle chargé et prêt")
    
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


# ── GET /api/metier/{cnp_code} ────────────────────────────────
@app.get("/api/metier/{cnp_code}", tags=["Métiers"])
async def get_metier(cnp_code: str):
    """
    Retourne le profil complet d'une profession (fiche métier).
    Consomme la vue matérialisée mv_occupation_full_profile pour la performance.
    """
    async with db_pool.acquire() as conn:
        # Profil principal depuis la vue matérialisée
        row = await conn.fetchrow(
            """
            SELECT
                o.cnp_code,
                o.title_fr,
                o.title_en,
                o.description_fr,
                o.description_en,
                o.teer_level,
                o.broad_category_code,
                o.broad_category_name_fr,
                o.major_group_code,
                o.major_group_name_fr,
                o.minor_group_code,
                o.minor_group_name_fr,
                o.median_salary,
                o.salary_source,
                o.riasec_dominant,
                o.riasec_scores,
                o.oasis_mapped,
                o.noc_5digit_code
            FROM occupations o
            WHERE o.cnp_code = $1
            """,
            cnp_code,
        )

        if not row:
            raise HTTPException(status_code=404, detail=f"Profession introuvable : {cnp_code}")

        # Appellations d'emploi
        job_titles = await conn.fetch(
            """
            SELECT title, language, label_type
            FROM occupation_job_titles
            WHERE occupation_cnp_code = $1
            ORDER BY label_type, language
            """,
            cnp_code,
        )

        # Exigences d'emploi
        requirements = await conn.fetch(
            """
            SELECT requirement_type, requirement_text_fr, requirement_text_en,
                   education_level_code, is_regulated, regulating_body_fr, display_order
            FROM occupation_requirements
            WHERE occupation_cnp_code = $1
            ORDER BY display_order NULLS LAST
            """,
            cnp_code,
        )

        # Top 10 compétences OaSIS par importance
        competences = await conn.fetch(
            """
            SELECT
                od.oasis_code,
                od.name_fr,
                od.name_en,
                od.category_code,
                od.subcategory_name_fr,
                oo.importance_score,
                oo.importance_label_fr,
                oo.level_score,
                oo.level_label_fr,
                oo.is_core_competency
            FROM occupation_oasis oo
            JOIN oasis_descriptors od ON od.oasis_code = oo.oasis_code
            WHERE oo.occupation_cnp_code = $1
            ORDER BY oo.importance_score DESC NULLS LAST
            LIMIT 10
            """,
            cnp_code,
        )

        return {
            "cnp_code": row["cnp_code"],
            "titre_fr": row["title_fr"],
            "titre_en": row["title_en"],
            "description_fr": row["description_fr"],
            "description_en": row["description_en"],
            "classification": {
                "teer_niveau": row["teer_level"],
                "grand_groupe_code": row["broad_category_code"],
                "grand_groupe_fr": row["broad_category_name_fr"],
                "groupe_principal_code": row["major_group_code"],
                "groupe_principal_fr": row["major_group_name_fr"],
                "sous_groupe_code": row["minor_group_code"],
                "sous_groupe_fr": row["minor_group_name_fr"],
                "cnp_5_chiffres": row["noc_5digit_code"],
            },
            "salaire": {
                "mediane": float(row["median_salary"]) if row["median_salary"] else None,
                "source": row["salary_source"],
                "devise": "CAD",
            },
            "riasec": {
                "code_dominant": row["riasec_dominant"],
                "scores": row["riasec_scores"],
            },
            "appellations": [dict(t) for t in job_titles],
            "exigences": [dict(r) for r in requirements],
            "competences_oasis": [dict(c) for c in competences],
            "oasis_complet": row["oasis_mapped"],
        }


# ── GET /api/search ───────────────────────────────────────────
@app.get("/api/search", tags=["Recherche"])
async def search_metiers(
    q: str = Query(..., min_length=2, description="Terme de recherche (FR ou EN)"),
    teer: Optional[int] = Query(None, ge=0, le=5, description="Niveau TEER (0-5)"),
    riasec: Optional[str] = Query(None, description="Code RIASEC dominant (ex: R, I, RIA)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """
    Recherche full-text sur les titres et appellations de professions.
    Filtres optionnels : niveau TEER, code RIASEC dominant.
    """
    async with db_pool.acquire() as conn:
        conditions = ["(title_fr ILIKE $1 OR title_en ILIKE $1)"]
        params = [f"%{q}%"]
        idx = 2

        if teer is not None:
            conditions.append(f"teer_level = ${idx}")
            params.append(teer)
            idx += 1

        if riasec:
            conditions.append(f"riasec_dominant ILIKE ${idx}")
            params.append(f"%{riasec.upper()}%")
            idx += 1

        where_clause = " AND ".join(conditions)
        params.extend([limit, offset])

        rows = await conn.fetch(
            f"""
            SELECT
                cnp_code, title_fr, title_en, teer_level,
                broad_category_name_fr, major_group_name_fr,
                riasec_dominant, median_salary
            FROM occupations
            WHERE {where_clause}
            ORDER BY
                CASE WHEN title_fr ILIKE $1 THEN 0 ELSE 1 END,
                title_fr
            LIMIT ${idx} OFFSET ${idx + 1}
            """,
            *params,
        )

        return {
            "query": q,
            "filtres": {"teer": teer, "riasec": riasec},
            "resultats": [dict(r) for r in rows],
            "pagination": {"limit": limit, "offset": offset},
        }


# ── GET /api/semantic_search ──────────────────────────────────
@app.get("/api/semantic_search", tags=["Recherche"])
async def semantic_search(
    q: str = Query(..., min_length=5, description="Phrase descriptive (ex: 'Je veux travailler dehors')"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Moteur de recherche par IA Sémantique.
    Transforme la requête en vecteur 384d et effectue une recherche par distance cosinus (pgvector).
    """
    if not HAS_ML or not semantic_model:
        raise HTTPException(status_code=503, detail="Le moteur d'IA n'est pas disponible sur ce serveur.")
        
    # 1. Encodage vectoriel (dans un thread pool pour éviter de bloquer l'Event Loop)
    query_vector = await asyncio.to_thread(semantic_model.encode, q)
    vector_str = str(query_vector.tolist())
    
    # 2. Recherche vectorielle dans Supabase (pgvector <=>)
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                cnp_code,
                title_fr,
                title_en,
                median_salary,
                teer_level,
                broad_category_name_fr,
                riasec_dominant,
                1 - (embedding <=> $1::vector) AS semantic_score
            FROM occupations
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> $1::vector
            LIMIT $2
            """,
            vector_str,
            limit
        )
        
        return {
            "query": q,
            "ia_model": "paraphrase-multilingual-MiniLM-L12-v2",
            "resultats": [dict(r) for r in rows]
        }


# ── GET /api/competences/{cnp_code} ──────────────────────────
@app.get("/api/competences/{cnp_code}", tags=["Compétences"])
async def get_competences(
    cnp_code: str,
    categorie: Optional[str] = Query(None, description="Catégorie OaSIS (F, A, G, B, C, J, K)"),
):
    """
    Retourne tous les descripteurs OaSIS d'une profession, optionnellement filtrés par catégorie.
    Catégories : F=Compétences, A=Habiletés, G=Connaissances, B=Attributs, C=Intérêts, J=Contexte, K=Activités
    """
    async with db_pool.acquire() as conn:
        # Vérifier que la profession existe
        exists = await conn.fetchval(
            "SELECT 1 FROM occupations WHERE cnp_code = $1", cnp_code
        )
        if not exists:
            raise HTTPException(status_code=404, detail=f"Profession introuvable : {cnp_code}")

        cat_filter = "AND od.category_code = $2" if categorie else ""
        params = [cnp_code] + ([categorie.upper()] if categorie else [])

        rows = await conn.fetch(
            f"""
            SELECT
                od.category_code,
                od.category_name_fr,
                od.subcategory_name_fr,
                od.oasis_code,
                od.name_fr,
                od.name_en,
                oo.importance_score,
                oo.importance_label_fr,
                oo.level_score,
                oo.level_label_fr,
                oo.frequency_score,
                oo.frequency_label_fr,
                oo.is_core_competency,
                oo.display_rank
            FROM occupation_oasis oo
            JOIN oasis_descriptors od ON od.oasis_code = oo.oasis_code
            WHERE oo.occupation_cnp_code = $1 {cat_filter}
            ORDER BY od.category_code, oo.importance_score DESC NULLS LAST
            """,
            *params,
        )

        return {
            "cnp_code": cnp_code,
            "categorie_filtre": categorie,
            "total": len(rows),
            "descripteurs": [dict(r) for r in rows],
        }


# ── GET /api/riasec/{cnp_code} ────────────────────────────────
@app.get("/api/riasec/{cnp_code}", tags=["RIASEC"])
async def get_riasec(cnp_code: str):
    """
    Retourne le profil RIASEC complet d'une profession.
    Utilisé par le widget Radar RIASEC dans Brilliant Directories / Astro.
    """
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT
                rp.r_score, rp.i_score, rp.a_score,
                rp.s_score, rp.e_score, rp.c_score,
                rp.dominant_code, rp.dominant_letter,
                o.title_fr
            FROM riasec_profiles rp
            JOIN occupations o ON o.cnp_code = rp.occupation_cnp_code
            WHERE rp.occupation_cnp_code = $1
            """,
            cnp_code,
        )

        if not row:
            raise HTTPException(status_code=404, detail=f"Profil RIASEC introuvable : {cnp_code}")

        return {
            "cnp_code": cnp_code,
            "titre_fr": row["title_fr"],
            "scores": {
                "R": float(row["r_score"]) if row["r_score"] else None,
                "I": float(row["i_score"]) if row["i_score"] else None,
                "A": float(row["a_score"]) if row["a_score"] else None,
                "S": float(row["s_score"]) if row["s_score"] else None,
                "E": float(row["e_score"]) if row["e_score"] else None,
                "C": float(row["c_score"]) if row["c_score"] else None,
            },
            "code_dominant": row["dominant_code"],
            "lettre_dominante": row["dominant_letter"],
        }


# ── POST /api/leads ───────────────────────────────────────────
@app.post("/api/leads", tags=["Leads"])
async def create_lead(request: dict):
    """
    Capture d'un lead (ex: abonnement aux alertes pour un métier).
    """
    return {"status": "success", "message": "Lead capturé avec succès"}
