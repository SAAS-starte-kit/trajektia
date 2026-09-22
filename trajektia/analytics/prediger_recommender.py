# ============================================================
# trajektia/analytics/prediger_recommender.py
# Moteur de Recommandation par Projection Cartésienne de Prediger (1982)
# Développé pour les Conseillers d'Orientation (c.o.) et Pros de la CNESST
# ============================================================

import math
from typing import Dict, List, Any, Tuple

class PredigerRecommender:
    """
    Implémente le modèle bi-axial de Dale J. Prediger (1982).
    Projette les profils RIASEC et DPC sur le plan cartésien :
      - Axe X : Choses / Personnes (Things / People)
      - Axe Y : Données / Idées (Data / Ideas)
    """

    @staticmethod
    def calculate_prediger_coordinates(riasec: Dict[str, float]) -> Tuple[float, float]:
        """
        Calcule les coordonnées cartésiennes (T/P, D/I) selon la formule officielle de Prediger :
          T/P = 2R + I - A - 2S - E + C
          D/I = 1.732 * (C + E - I - A)
        """
        r = riasec.get("Realiste", 0.0)
        i = riasec.get("Investigateur", 0.0)
        a = riasec.get("Artistique", 0.0)
        s = riasec.get("Social", 0.0)
        e = riasec.get("Entreprenant", 0.0)
        c = riasec.get("Conventionnel", 0.0)

        things_people = 2 * r + i - a - 2 * s - e + c
        data_ideas = 1.732 * (c + e - i - a)

        return (round(things_people, 2), round(data_ideas, 2))

    @staticmethod
    def euclidean_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
        """Calcule la distance euclidienne entre deux points du plan de Prediger."""
        dx = coord1[0] - coord2[0]
        dy = coord1[1] - coord2[1]
        return math.sqrt(dx * dx + dy * dy)

    @classmethod
    def recommend_careers(
        cls,
        user_riasec: Dict[str, float],
        occupations_list: List[Dict[str, Any]],
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Recommande les professions CNP ayant la plus faible distance cartésienne
        sur le plan de Prediger par rapport au profil du bénéficiaire.
        """
        user_coords = cls.calculate_prediger_coordinates(user_riasec)
        results = []

        for job in occupations_list:
            job_riasec = job.get("riasec", {})
            job_coords = cls.calculate_prediger_coordinates(job_riasec)
            dist = cls.euclidean_distance(user_coords, job_coords)

            # Score de proximité normalisé % (0 à 99)
            proximity_score = max(10, min(99, round(100 - (dist / 3.5))))

            explanation = cls.generate_clinical_explanation(user_coords, job_coords, job)

            results.append({
                "cnp": job.get("cnp"),
                "titre": job.get("titre"),
                "score_fit": proximity_score,
                "distance_prediger": round(dist, 2),
                "user_coords": user_coords,
                "job_coords": job_coords,
                "explication_co": explanation
            })

        results.sort(key=lambda x: x["distance_prediger"])
        return results[:top_n]

    @staticmethod
    def generate_clinical_explanation(
        user_coords: Tuple[float, float],
        job_coords: Tuple[float, float],
        job: Dict[str, Any]
    ) -> str:
        """Génère une explication clinique synthétique pour le conseiller d'orientation."""
        dx = job_coords[0] - user_coords[0]
        dy = job_coords[1] - user_coords[1]

        explications = []
        if abs(dx) < 15 and abs(dy) < 15:
            explications.append("Forte concordance bi-axiale : les exigences du poste épousent le penchant naturel du candidat.")
        else:
            if dx > 20:
                explications.append("Le poste exige une orientation vers les 'Choses' (manipulation/outils) supérieure à la zone de confort du candidat.")
            elif dx < -20:
                explications.append("Le poste implique un pôle 'Personnes' (relationnel/médiation) plus soutenu que l'inclination naturelle du candidat.")

            if dy > 20:
                explications.append("Le poste requiert une rigueur de traitement des 'Données' supérieure au profil initial.")
            elif dy < -20:
                explications.append("Le poste fait appel à une création d''Idées' et d'innovation plus prononcée.")

        return " ".join(explications)
