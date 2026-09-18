"""
dpc_service.py
==============
Service d'Explicabilité Clinique & de Filtrage par Seuils DPC (Phase D1)
Career Knowledge Graph — Trajektia

Ce module est destiné aux Conseillers d'Orientation (c.o.), intervenants
en réadaptation et interfaces bénéficiaires. Il traduit les cotations
Données-Personnes-Choses (Guide des carrières EDSC / FJA de Sidney Fine)
en diagnostics clairs et permet de filtrer l'univers des 504 métiers de la CNP.
"""

import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv("trajektia/.env")
load_dotenv(".env")

DB_URL = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")

# Cache mémoire pour éviter les allers-retours répétés
_TAXONOMY_CACHE = {}


def get_db_connection():
    if not DB_URL:
        raise ValueError("SUPABASE_DB_URL manquant dans l'environnement.")
    return psycopg2.connect(DB_URL)


def load_dpc_taxonomy(force_reload=False) -> dict:
    """Charge la table de référence DPC complète en mémoire."""
    global _TAXONOMY_CACHE
    if _TAXONOMY_CACHE and not force_reload:
        return _TAXONOMY_CACHE

    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT dpc_code, category, level_number, verb_fr, verb_en,
                       definition_fr, definition_en, complexity_weight,
                       prediger_pole, concrete_examples_fr
                FROM ref_dpc_taxonomy
                ORDER BY category, level_number;
            """)
            rows = cur.fetchall()
            _TAXONOMY_CACHE = {r["dpc_code"]: dict(r) for r in rows}
            return _TAXONOMY_CACHE
    finally:
        conn.close()


def explain_occupation_dpc(cnp_code: str) -> dict:
    """
    Génère une explication clinique et pédagogique complète des exigences DPC
    d'un métier pour un conseiller d'orientation (c.o.) et son bénéficiaire.
    """
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    cnp_code, occupation_title_fr, occupation_title_en,
                    strength_code, strength_label_fr, max_weight_kg,
                    body_position_label_fr,
                    dpc_summary,
                    dpc_data_code, dpc_data_verb_fr, dpc_data_definition_fr, dpc_data_complexity,
                    dpc_people_code, dpc_people_verb_fr, dpc_people_definition_fr, dpc_people_complexity,
                    dpc_things_code, dpc_things_verb_fr, dpc_things_definition_fr, dpc_things_complexity,
                    prediger_things_people, prediger_data_ideas
                FROM v_occupation_dpc_detailed
                WHERE cnp_code = %s;
            """, (cnp_code,))
            row = cur.fetchone()

        if not row:
            return {
                "cnp_code": cnp_code,
                "found": False,
                "message": f"Métier CNP {cnp_code} introuvable dans la base physique/DPC."
            }

        # Construction de l'explication clinique structurée
        data_narrative = (
            f"Au plan intellectuel et analytique, le métier exige principalement de "
            f"« {row['dpc_data_verb_fr']} » (niveau {row['dpc_data_code']}). "
            f"{row['dpc_data_definition_fr']}"
        )

        people_narrative = (
            f"Au plan relationnel et humain, l'intensité d'interaction se situe à "
            f"« {row['dpc_people_verb_fr']} » (niveau {row['dpc_people_code']}). "
            f"{row['dpc_people_definition_fr']}"
        )

        things_narrative = (
            f"Au plan technique et matériel, l'intervention physique s'articule autour de "
            f"« {row['dpc_things_verb_fr']} » (niveau {row['dpc_things_code']}). "
            f"{row['dpc_things_definition_fr']}"
        )

        prediger_summary = (
            f"Sur le plan cartésien de Prediger, ce profil s'oriente vers la polarité "
            f"« {row['prediger_things_people']} » et « {row['prediger_data_ideas']} »."
        )

        return {
            "cnp_code": row["cnp_code"],
            "found": True,
            "title_fr": row["occupation_title_fr"],
            "title_en": row["occupation_title_en"],
            "dpc_summary": row["dpc_summary"],
            "dimensions": {
                "data": {
                    "code": row["dpc_data_code"],
                    "verb_fr": row["dpc_data_verb_fr"],
                    "complexity_weight": row["dpc_data_complexity"],
                    "narrative": data_narrative
                },
                "people": {
                    "code": row["dpc_people_code"],
                    "verb_fr": row["dpc_people_verb_fr"],
                    "complexity_weight": row["dpc_people_complexity"],
                    "narrative": people_narrative
                },
                "things": {
                    "code": row["dpc_things_code"],
                    "verb_fr": row["dpc_things_verb_fr"],
                    "complexity_weight": row["dpc_things_complexity"],
                    "narrative": things_narrative
                }
            },
            "prediger": {
                "things_people": row["prediger_things_people"],
                "data_ideas": row["prediger_data_ideas"],
                "narrative": prediger_summary
            },
            "physical_summary": {
                "strength": row["strength_label_fr"],
                "max_weight_kg": row["max_weight_kg"],
                "position": row["body_position_label_fr"]
            }
        }
    finally:
        conn.close()


def filter_occupations_by_dpc(
    min_data_complexity: int = 1,
    max_data_complexity: int = 5,
    min_people_complexity: int = 1,
    max_people_complexity: int = 5,
    min_things_complexity: int = 1,
    max_things_complexity: int = 5,
    prediger_tp: str = None,
    prediger_di: str = None,
    limit: int = 20
) -> list:
    """
    Filtre les métiers selon des fourchettes de complexité (1 à 5)
    sur chacune des 3 dimensions DPC et selon les polarités de Prediger.
    
    Utile pour :
    - Écarter les métiers relationnels intenses (max_people_complexity = 2).
    - Rechercher des métiers d'analyse de haut niveau (min_data_complexity = 4).
    - Cibler les métiers manuels de précision (min_things_complexity = 4).
    """
    query = """
        SELECT 
            cnp_code, occupation_title_fr, dpc_summary,
            dpc_data_code || ' ' || dpc_data_verb_fr AS data_verb,
            dpc_data_complexity,
            dpc_people_code || ' ' || dpc_people_verb_fr AS people_verb,
            dpc_people_complexity,
            dpc_things_code || ' ' || dpc_things_verb_fr AS things_verb,
            dpc_things_complexity,
            prediger_things_people, prediger_data_ideas,
            strength_label_fr
        FROM v_occupation_dpc_detailed
        WHERE dpc_data_complexity BETWEEN %s AND %s
          AND dpc_people_complexity BETWEEN %s AND %s
          AND dpc_things_complexity BETWEEN %s AND %s
    """
    params = [
        min_data_complexity, max_data_complexity,
        min_people_complexity, max_people_complexity,
        min_things_complexity, max_things_complexity
    ]

    if prediger_tp:
        query += " AND prediger_things_people ILIKE %s"
        params.append(f"%{prediger_tp}%")

    if prediger_di:
        query += " AND prediger_data_ideas ILIKE %s"
        params.append(f"%{prediger_di}%")

    query += " ORDER BY cnp_code LIMIT %s;"
    params.append(limit)

    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()


if __name__ == "__main__":
    print("=" * 70)
    print("🧪 TEST DU SERVICE DPC (Explicabilité & Filtres c.o.)")
    print("=" * 70)

    # 1. Test du chargement de la taxonomie
    taxo = load_dpc_taxonomy()
    print(f"\n1. Taxonomie chargée : {len(taxo)} échelons en mémoire.")

    # 2. Test d'explicabilité sur 2 profils contrastés
    test_cnps = ["21232", "31301"] # Développeur vs Infirmier
    for cnp in test_cnps:
        print(f"\n2. Explicabilité clinique pour CNP {cnp} :")
        exp = explain_occupation_dpc(cnp)
        print(f"   Titre : {exp['title_fr']} ({exp['dpc_summary']})")
        print(f"   • Données   : {exp['dimensions']['data']['narrative']}")
        print(f"   • Personnes : {exp['dimensions']['people']['narrative']}")
        print(f"   • Choses    : {exp['dimensions']['things']['narrative']}")
        print(f"   • Prediger  : {exp['prediger']['narrative']}")

    # 3. Test de filtrage : Profil recherche & conception (Haute complexité Données, Faible relationnel)
    print("\n3. Filtrage : Métiers à forte composante analytique (Data >= 4) et faible pression relationnelle (People <= 2) :")
    results = filter_occupations_by_dpc(min_data_complexity=4, max_people_complexity=2, limit=5)
    for r in results:
        print(f"   • [{r['cnp_code']}] {r['occupation_title_fr']}")
        print(f"     -> Données: {r['data_verb']} | Personnes: {r['people_verb']} | Choses: {r['things_verb']}")

    print("\n✅ Service DPC validé avec succès.")
