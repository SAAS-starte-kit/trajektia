import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Request
from apps.api.schemas import SearchResponse, SemanticSearchResponse

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

router = APIRouter(tags=["Recherche"])

@router.get("/api/search", response_model=SearchResponse)
async def search_metiers(
    request: Request,
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
    db_pool = request.app.state.db_pool
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

@router.get("/api/semantic_search", response_model=SemanticSearchResponse)
@observe(name="trajektia-semantic-search", as_type="retriever")
async def semantic_search(
    request: Request,
    q: str = Query(..., min_length=5, description="Phrase descriptive (ex: 'Je veux travailler dehors')"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Moteur de recherche par IA Sémantique.
    Transforme la requête en vecteur 384d et effectue une recherche par distance cosinus (pgvector).
    """
    semantic_model = request.app.state.semantic_model
    has_ml = request.app.state.has_ml

    if not has_ml or not semantic_model:
        raise HTTPException(status_code=503, detail="Le moteur d'IA n'est pas disponible sur ce serveur.")
        
    # 1. Encodage vectoriel (dans un thread pool pour éviter de bloquer l'Event Loop)
    query_vector = await asyncio.to_thread(lambda: list(semantic_model.embed([q]))[0])
    vector_str = str(query_vector.tolist())
    
    # 2. Recherche vectorielle dans Supabase (pgvector <=>)
    db_pool = request.app.state.db_pool
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
