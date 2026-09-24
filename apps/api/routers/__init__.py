from apps.api.routers.occupations import router as occupations_router
from apps.api.routers.search import router as search_router
from apps.api.routers.competencies import router as competencies_router
from apps.api.routers.riasec import router as riasec_router
from apps.api.routers.leads import router as leads_router

__all__ = [
    "occupations_router",
    "search_router",
    "competencies_router",
    "riasec_router",
    "leads_router",
]
