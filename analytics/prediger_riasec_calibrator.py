import os
import json
import math
import psycopg2
from psycopg2.extras import RealDictCursor

try:
    import sys
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from ckg.ckg_config import SUPABASE_DB_URL
except ImportError:
    SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")

def get_db_connection():
    if not SUPABASE_DB_URL:
        raise ValueError("SUPABASE_DB_URL n'est pas defini dans l'environnement.")
    return psycopg2.connect(SUPABASE_DB_URL, cursor_factory=RealDictCursor)

def extract_dpc_value(dpc_str: str) -> int:
    """Extrait l'entier d'une chaîne DPC, ex: 'Synthétiser - 0' -> 0."""
    if not dpc_str:
        return None
    try:
        return int(dpc_str.split('-')[-1].strip())
    except (ValueError, IndexError):
        return None

def calculate_prediger_coordinates():
    conn = get_db_connection()
    results = []
    
    try:
        with conn.cursor() as cursor:
            # On joint les données RIASEC et DPC
            cursor.execute("""
                SELECT 
                    o.cnp_code, o.title_fr,
                    r.r_score, r.i_score, r.a_score, r.s_score, r.e_score, r.c_score,
                    p.dpc_data, p.dpc_people, p.dpc_things
                FROM occupations o
                JOIN riasec_profiles r ON o.cnp_code = r.occupation_cnp_code
                JOIN occupation_physical_demands p ON o.cnp_code = p.occupation_cnp_code
            """)
            rows = cursor.fetchall()

            for row in rows:
                # --- CALCUL RIASEC (Théorique) ---
                r, i, a, s, e, c = (
                    row['r_score'], row['i_score'], row['a_score'], 
                    row['s_score'], row['e_score'], row['c_score']
                )
                
                # S'il manque un score RIASEC, on passe (le profil est incomplet)
                if None in (r, i, a, s, e, c):
                    continue
                
                r, i, a, s, e, c = float(r), float(i), float(a), float(s), float(e), float(c)
                
                tp_riasec = 2 * r + i - a - 2 * s - e + c
                di_riasec = 1.732 * (c + e - i - a)

                # --- CALCUL DPC (Empirique) ---
                d_val = extract_dpc_value(row['dpc_data'])
                p_val = extract_dpc_value(row['dpc_people'])
                c_val = extract_dpc_value(row['dpc_things'])
                
                if None in (d_val, p_val, c_val):
                    continue
                
                # Conversion des valeurs discrètes DPC en coordonnées Prediger approchées
                # Échelles originales : D (0-6), P (0-8), C (0-7) (0 = max complexité)
                
                # Normalisation inversée sur 1 à 5 (comme le RIASEC)
                d_norm = 1 + ((6 - d_val) / 6.0) * 4
                p_norm = 1 + ((8 - p_val) / 8.0) * 4
                c_norm = 1 + ((7 - c_val) / 7.0) * 4
                
                # T/P empirique : pondération équivalente au RIASEC (facteur 2 pour Choses/Personnes)
                tp_dpc = 2 * c_norm - 2 * p_norm
                
                # D/I empirique : 
                # Le manuel spécifie que D<=1 => Idées (négatif), D>=2 => Données (positif)
                if d_val <= 1:
                    di_dpc = -8.0  # Idées fortes
                elif d_val <= 4:
                    di_dpc = 8.0   # Données fortes
                else:
                    di_dpc = 0.0   # Opérationnel standard

                # --- INDICE DE COHÉRENCE PSYCHOMÉTRIQUE (ICP) ---
                icp_delta = math.sqrt((tp_dpc - float(tp_riasec))**2 + (di_dpc - float(di_riasec))**2)
                
                # Classification
                if icp_delta <= 1.5:
                    concordance = "Forte concordance"
                elif icp_delta <= 3.0:
                    concordance = "Concordance modérée"
                else:
                    concordance = "Métier hybride / En tension"
                
                results.append({
                    "cnp_code": row["cnp_code"],
                    "title": row["title_fr"],
                    "riasec_coords": {"T/P": round(tp_riasec, 2), "D/I": round(di_riasec, 2)},
                    "dpc_coords": {"T/P": round(tp_dpc, 2), "D/I": round(di_dpc, 2)},
                    "icp_delta": round(icp_delta, 2),
                    "concordance": concordance
                })

    finally:
        conn.close()
        
    return results

if __name__ == "__main__":
    print("Calcul des calibrations psychométriques en cours...")
    try:
        results = calculate_prediger_coordinates()
        
        # Statistiques
        total = len(results)
        forte = sum(1 for r in results if r["concordance"] == "Forte concordance")
        moderee = sum(1 for r in results if r["concordance"] == "Concordance modérée")
        tension = sum(1 for r in results if r["concordance"] == "Métier hybride / En tension")
        
        print(f"\n--- RÉSULTATS DE CALIBRATION ({total} métiers analysés) ---")
        print(f"Forte concordance       : {forte} ({forte/total*100:.1f}%)" if total > 0 else "Aucun")
        print(f"Concordance modérée     : {moderee} ({moderee/total*100:.1f}%)" if total > 0 else "Aucun")
        print(f"Hybrides / En tension   : {tension} ({tension/total*100:.1f}%)" if total > 0 else "Aucun")
        
        # Affichage d'un échantillon (Top 3 de chaque catégorie si possible)
        print("\nÉchantillon de métiers en tension psychométrique (Delta > 3.0) :")
        tension_list = [r for r in results if r["concordance"] == "Métier hybride / En tension"]
        for r in tension_list[:5]:
            print(f"- {r['title']} (CNP {r['cnp_code']}) | ICP = {r['icp_delta']}")
            print(f"  RIASEC(T/P={r['riasec_coords']['T/P']}, D/I={r['riasec_coords']['D/I']})")
            print(f"  DPC   (T/P={r['dpc_coords']['T/P']}, D/I={r['dpc_coords']['D/I']})")
            
        # Sauvegarde JSON optionnelle
        output_path = os.path.join(os.path.dirname(__file__), 'prediger_results.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"\nRapport détaillé sauvegardé dans : {output_path}")

    except Exception as e:
        print(f"Erreur d'exécution : {e}")
