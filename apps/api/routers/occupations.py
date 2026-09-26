from fastapi import APIRouter, HTTPException, Request
from apps.api.schemas import OccupationFullProfileResponse, OccupationalPathwaysResponse, PathwayItem

router = APIRouter(tags=["Métiers"])

@router.get("/api/metier/{cnp_code}", response_model=OccupationFullProfileResponse)
async def get_metier(cnp_code: str, request: Request):
    """
    Retourne le profil complet d'une profession (fiche métier).
    Consomme la vue matérialisée mv_occupation_full_profile pour la performance.
    """
    db_pool = request.app.state.db_pool
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


@router.get("/api/occupations/{cnp_code}/pathways", response_model=OccupationalPathwaysResponse)
async def get_occupations_pathways(cnp_code: str, request: Request):
    """
    Retourne les voies de mobilité (bifurcations) possibles pour une profession.
    """
    db_pool = getattr(request.app.state, 'db_pool', None)
    
    if db_pool is None:
        # Mode hors ligne / test: retourner des données déterministes (mock)
        return {
            "source_cnp": cnp_code,
            "source_title_fr": f"Profession {cnp_code}",
            "pathways_count": 2,
            "pathways": [
                {
                    "target_cnp": "11111",
                    "target_title_fr": "Profession cible 1",
                    "transition_ease_score": 85.0,
                    "feer_diff": 0,
                    "rationale_fr": "Compétences transférables en administration et gestion.",
                    "shared_competencies_count": 15
                },
                {
                    "target_cnp": "22222",
                    "target_title_fr": "Profession cible 2",
                    "transition_ease_score": 78.0,
                    "feer_diff": 1,
                    "rationale_fr": "Nécessite une formation complémentaire courte (FEER +1).",
                    "shared_competencies_count": 8
                }
            ]
        }
    
    async with db_pool.acquire() as conn:
        # Obtenir les infos de la profession source
        source = await conn.fetchrow(
            """
            SELECT cnp_code, title_fr, major_group_code, teer_level
            FROM occupations
            WHERE cnp_code = $1
            """,
            cnp_code
        )
        
        if not source:
            raise HTTPException(status_code=404, detail=f"Profession introuvable : {cnp_code}")
            
        # Trouver des professions dans le même groupe principal avec une différence de FEER <= 1
        pathways_rows = await conn.fetch(
            """
            SELECT 
                cnp_code as target_cnp, 
                title_fr as target_title_fr,
                teer_level
            FROM occupations
            WHERE major_group_code = $1
            AND cnp_code != $2
            AND ABS(teer_level - $3) <= 1
            LIMIT 5
            """,
            source['major_group_code'], cnp_code, source['teer_level']
        )
        
        pathways = []
        for row in pathways_rows:
            feer_diff = row['teer_level'] - source['teer_level']
            # Score bidon pour l'exemple
            score = max(0.0, 100.0 - abs(feer_diff) * 20.0) 
            pathways.append({
                "target_cnp": row['target_cnp'],
                "target_title_fr": row['target_title_fr'],
                "transition_ease_score": float(score),
                "feer_diff": int(feer_diff),
                "rationale_fr": f"Transition possible dans le même domaine d'expertise (différence FEER: {feer_diff}).",
                "shared_competencies_count": 5
            })
            
        return {
            "source_cnp": source["cnp_code"],
            "source_title_fr": source["title_fr"],
            "pathways_count": len(pathways),
            "pathways": pathways
        }
