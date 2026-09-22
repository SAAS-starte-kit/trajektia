import os
import psycopg2
from psycopg2.extras import RealDictCursor

# On tente d'importer la configuration globale si possible
try:
    import sys
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from packages.ckg.ckg_config import SUPABASE_DB_URL
except ImportError:
    SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")

def get_db_connection():
    if not SUPABASE_DB_URL:
        raise ValueError("SUPABASE_DB_URL n'est pas defini dans l'environnement.")
    return psycopg2.connect(SUPABASE_DB_URL, cursor_factory=RealDictCursor)

def evaluate_functional_compatibility(candidate_limitations: dict, target_noc: str) -> dict:
    """
    Évalue la compatibilité entre les limitations d'un candidat et les exigences ergonomiques d'un métier.
    
    :param candidate_limitations: Dictionnaire des limitations. Ex:
        {
            "max_weight_kg": 15,
            "lumbar_limitation": True,
            "vision_min_code": "V-1",
            "hearing_min_code": "H-1",
            "coordination_min_code": "L-0",
            "prior_lesion_hazard_id": "TMS"
        }
    :param target_noc: Code CNP à évaluer (ex: "31301")
    :return: Dictionnaire contenant le score et le détail du diagnostic.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Récupérer les exigences du métier
            cursor.execute("""
                SELECT 
                    strength_code, max_weight_kg, body_position_code, 
                    limb_coordination_code, vision_code, colour_code, hearing_code
                FROM occupation_physical_demands 
                WHERE occupation_cnp_code = %s
            """, (target_noc,))
            job_reqs = cursor.fetchone()

            if not job_reqs:
                return {"error": "Métier introuvable dans occupation_physical_demands."}

            # 2. Récupérer les risques sectoriels (Alerte récidive)
            alerts = []
            prior_lesion = candidate_limitations.get("prior_lesion_hazard_id")
            if prior_lesion:
                cursor.execute("""
                    SELECT risk_level, prevalence_pct 
                    FROM occupation_hazards 
                    WHERE occupation_cnp_code = %s AND hazard_id = %s
                """, (target_noc, prior_lesion))
                hazard_info = cursor.fetchone()
                
                if hazard_info:
                    if hazard_info["risk_level"] == "Élevé" or hazard_info["prevalence_pct"] > 30.0:
                        alerts.append(
                            f"ALERTE RÉCIDIVE : Le métier {target_noc} présente un risque {prior_lesion} "
                            f"de niveau {hazard_info['risk_level']} (Prévalence: {hazard_info['prevalence_pct']}%)."
                        )

            # --- ÉVALUATION ---
            fit_score = 100
            status = "ADAPTÉ"
            justifications = []

            # A. Filtre éliminatoire strict sur les charges (max_weight_kg)
            cand_max_weight = candidate_limitations.get("max_weight_kg")
            job_max_weight = job_reqs["max_weight_kg"]
            
            if cand_max_weight is not None and job_max_weight is not None:
                if cand_max_weight < job_max_weight:
                    status = "CONTRE_INDIQUÉ"
                    fit_score = 0
                    justifications.append(f"Capacité de levage ({cand_max_weight} kg) inférieure à l'exigence du métier ({job_max_weight} kg).")
            
            # B. Filtrage postural (incompatibilité rachis lombaire sur B-3/B-4)
            lumbar_lim = candidate_limitations.get("lumbar_limitation")
            job_posture = job_reqs["body_position_code"]
            
            if lumbar_lim and job_posture in ["B-3", "B-4"]:
                status = "CONTRE_INDIQUÉ"
                fit_score = 0
                justifications.append(f"Limitation lombaire incompatible avec la posture dominante du métier ({job_posture}).")
            
            # C. Pénalités pour inadéquations sensorielles/motrices (non éliminatoires par défaut, -15%)
            # On simplifie la comparaison ordinale en comparant le dernier caractère (ex: V-2 > V-1)
            def check_ordinal_limitation(cand_val, job_val, name):
                nonlocal fit_score, status
                if cand_val and job_val and cand_val < job_val:
                    if status != "CONTRE_INDIQUÉ":
                        fit_score -= 15
                        status = "ADAPTÉ AVEC RÉSERVES"
                    justifications.append(f"Capacité {name} ({cand_val}) potentiellement insuffisante pour l'exigence ({job_val}).")

            check_ordinal_limitation(candidate_limitations.get("vision_min_code"), job_reqs["vision_code"], "visuelle")
            check_ordinal_limitation(candidate_limitations.get("hearing_min_code"), job_reqs["hearing_code"], "auditive")
            check_ordinal_limitation(candidate_limitations.get("coordination_min_code"), job_reqs["limb_coordination_code"], "motrice")

            # Finalisation
            if status != "CONTRE_INDIQUÉ" and not justifications:
                justifications.append("Aucune incompatibilité ergonomique détectée.")

            return {
                "target_noc": target_noc,
                "status": status,
                "fit_score": max(0, fit_score),
                "justifications": justifications,
                "alerts": alerts,
                "job_requirements": job_reqs
            }

    finally:
        conn.close()

if __name__ == "__main__":
    # Test local / Dry run
    # Nécessite SUPABASE_DB_URL
    print("--- Test de l'évaluation ergonomique ---")
    
    candidate = {
        "max_weight_kg": 10,
        "lumbar_limitation": True,
        "vision_min_code": "V-1",
        "prior_lesion_hazard_id": "TMS"
    }
    
    # Test avec un métier lourd (ex: Électricien - devrait être B-4 ou S-3)
    # Remplacer "72200" par un code existant en base si différent
    try:
        res1 = evaluate_functional_compatibility(candidate, "72200")
        print("\nTest CNP 72200 (Électricien) :")
        print(res1)
        
        # Test avec un métier léger/assis (ex: 11202)
        res2 = evaluate_functional_compatibility(candidate, "11202") 
        print("\nTest CNP 11202 (Professionnels pub/marketing) :")
        print(res2)
    except Exception as e:
        print(f"Erreur de connexion DB ou exécution: {e}")
