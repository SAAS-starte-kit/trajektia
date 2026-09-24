from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# ── Occupation Full Profile ─────────────────────────────────────
class OccupationClassification(BaseModel):
    teer_niveau: int
    grand_groupe_code: str
    grand_groupe_fr: str
    groupe_principal_code: str
    groupe_principal_fr: str
    sous_groupe_code: str
    sous_groupe_fr: str
    cnp_5_chiffres: str

class OccupationSalary(BaseModel):
    mediane: Optional[float] = None
    source: Optional[str] = None
    devise: str = "CAD"

class RiasecScores(BaseModel):
    R: Optional[float] = None
    I: Optional[float] = None
    A: Optional[float] = None
    S: Optional[float] = None
    E: Optional[float] = None
    C: Optional[float] = None

class OccupationRiasec(BaseModel):
    code_dominant: Optional[str] = None
    scores: Optional[Dict[str, float]] = None

class OccupationJobTitle(BaseModel):
    title: str
    language: str
    label_type: str

class OccupationRequirement(BaseModel):
    requirement_type: str
    requirement_text_fr: Optional[str] = None
    requirement_text_en: Optional[str] = None
    education_level_code: Optional[int] = None
    is_regulated: Optional[bool] = None
    regulating_body_fr: Optional[str] = None
    display_order: Optional[int] = None

class OccupationOasisDescriptor(BaseModel):
    oasis_code: str
    name_fr: str
    name_en: str
    category_code: str
    subcategory_name_fr: Optional[str] = None
    importance_score: Optional[float] = None
    importance_label_fr: Optional[str] = None
    level_score: Optional[float] = None
    level_label_fr: Optional[str] = None
    is_core_competency: Optional[bool] = None

class OccupationFullProfileResponse(BaseModel):
    cnp_code: str
    titre_fr: str
    titre_en: str
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    classification: OccupationClassification
    salaire: OccupationSalary
    riasec: OccupationRiasec
    appellations: List[OccupationJobTitle]
    exigences: List[OccupationRequirement]
    competences_oasis: List[OccupationOasisDescriptor]
    oasis_complet: Optional[Any] = None

# ── Search ────────────────────────────────────────────────────
class SearchFiltres(BaseModel):
    teer: Optional[int] = None
    riasec: Optional[str] = None

class SearchPagination(BaseModel):
    limit: int
    offset: int

class SearchResultItem(BaseModel):
    cnp_code: str
    title_fr: str
    title_en: str
    teer_level: int
    broad_category_name_fr: str
    major_group_name_fr: str
    riasec_dominant: Optional[str] = None
    median_salary: Optional[float] = None

class SearchResponse(BaseModel):
    query: str
    filtres: SearchFiltres
    resultats: List[SearchResultItem]
    pagination: SearchPagination

# ── Semantic Search ───────────────────────────────────────────
class SemanticSearchResultItem(BaseModel):
    cnp_code: str
    title_fr: str
    title_en: str
    median_salary: Optional[float] = None
    teer_level: int
    broad_category_name_fr: str
    riasec_dominant: Optional[str] = None
    semantic_score: float

class SemanticSearchResponse(BaseModel):
    query: str
    ia_model: str
    resultats: List[SemanticSearchResultItem]

# ── Competences ───────────────────────────────────────────────
class OasisDescriptorItem(BaseModel):
    category_code: str
    category_name_fr: str
    subcategory_name_fr: Optional[str] = None
    oasis_code: str
    name_fr: str
    name_en: str
    importance_score: Optional[float] = None
    importance_label_fr: Optional[str] = None
    level_score: Optional[float] = None
    level_label_fr: Optional[str] = None
    frequency_score: Optional[float] = None
    frequency_label_fr: Optional[str] = None
    is_core_competency: Optional[bool] = None
    display_rank: Optional[int] = None

class CompetencesResponse(BaseModel):
    cnp_code: str
    categorie_filtre: Optional[str] = None
    total: int
    descripteurs: List[OasisDescriptorItem]

# ── RIASEC ────────────────────────────────────────────────────
class RiasecProfileResponse(BaseModel):
    cnp_code: str
    titre_fr: str
    scores: RiasecScores
    code_dominant: Optional[str] = None
    lettre_dominante: Optional[str] = None

# ── Leads ─────────────────────────────────────────────────────
import re
from pydantic import field_validator

class LeadCreateRequest(BaseModel):
    email: str = Field(..., description="Courriel valide du candidat")
    cnp: Optional[str] = Field(None, max_length=10, description="Code CNP associé à l'alerte")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        v = v.strip().lower()
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(pattern, v):
            raise ValueError("Format de courriel invalide")
        return v

class LeadResponse(BaseModel):
    status: str
    message: str
    lead_id: Optional[int] = None
