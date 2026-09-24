from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Request
from apps.api.schemas import CompetencesResponse

router = APIRouter(tags=["Compétences"])

@router.get("/api/competences/{cnp_code}", response_model=CompetencesResponse)
async def get_competences(
    request: Request,
    cnp_code: str,
    categorie: Optional[str] = Query(None, description="Catégorie OaSIS (F, A, G, B, C, J, K)"),
):
    """
    Retourne tous les descripteurs OaSIS d'une profession, optionnellement filtrés par catégorie.
    Catégories : F=Compétences, A=Habiletés, G=Connaissances, B=Attributs, C=Intérêts, J=Contexte, K=Activités
    """
    db_pool = request.app.state.db_pool
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
