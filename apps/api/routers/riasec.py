from fastapi import APIRouter, HTTPException, Request
from apps.api.schemas import RiasecProfileResponse

router = APIRouter(tags=["RIASEC"])

@router.get("/api/riasec/{cnp_code}", response_model=RiasecProfileResponse)
async def get_riasec(request: Request, cnp_code: str):
    """
    Retourne le profil RIASEC complet d'une profession.
    Utilisé par le widget Radar RIASEC dans Brilliant Directories / Astro.
    """
    db_pool = request.app.state.db_pool
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
