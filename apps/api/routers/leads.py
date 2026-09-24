from fastapi import APIRouter
from apps.api.schemas import LeadCreateRequest, LeadResponse

router = APIRouter(tags=["Leads"])

@router.post("/api/leads", response_model=LeadResponse)
async def create_lead(request: LeadCreateRequest):
    """
    Capture d'un lead (ex: abonnement aux alertes pour un métier).
    """
    return {"status": "success", "message": "Lead capturé avec succès"}
