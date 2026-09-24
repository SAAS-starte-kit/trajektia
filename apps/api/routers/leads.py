from fastapi import APIRouter, Request, HTTPException
from apps.api.schemas import LeadCreateRequest, LeadResponse
import asyncpg

router = APIRouter(tags=["Leads"])

@router.post("/api/leads", response_model=LeadResponse)
async def create_lead(lead: LeadCreateRequest, request: Request):
    """
    Capture d'un lead (ex: abonnement aux alertes pour un métier).
    """
    db_pool = getattr(request.app.state, "db_pool", None)
    
    if db_pool:
        try:
            async with db_pool.acquire() as conn:
                result = await conn.fetchrow(
                    """
                    INSERT INTO leads_newsletter (email, cnp_code, source_url)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (email, cnp_code) DO NOTHING
                    RETURNING id;
                    """,
                    lead.email,
                    lead.cnp,
                    None
                )
                
                if result:
                    return {"status": "success", "message": "Lead capturé avec succès", "lead_id": result["id"]}
                else:
                    return {"status": "success", "message": "Lead capturé avec succès (déjà existant)"}
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erreur interne du serveur lors de l'enregistrement")
    else:
        return {"status": "success", "message": "Lead enregistré (mode simulation)"}
