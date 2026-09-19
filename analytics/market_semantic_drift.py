#!/usr/bin/env python3
"""
Market Semantic Drift — Calcul de l'Indice de Mutation Trajektia™ (IDS)
==============================================================================
Ce script analytique calcule l'écart vectoriel entre le référentiel officiel CNP
et la réalité du marché de l'emploi (offres actives).

Usage:
    python trajektia/analytics/market_semantic_drift.py
"""

import os
import sys
import numpy as np
import psycopg2
from pathlib import Path
from scipy.spatial.distance import cosine

from dotenv import load_dotenv

# Configuration chemins
_HERE = Path(__file__).resolve().parent
_ROOT = _HERE.parent
sys.path.append(str(_ROOT))

load_dotenv(_ROOT / ".env")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Erreur: Le module 'sentence-transformers' n'est pas installé.")
    sys.exit(1)

def main():
    if not SUPABASE_DB_URL:
        print("Erreur: SUPABASE_DB_URL manquant.")
        sys.exit(1)

    print("Chargement du modèle d'IA local (paraphrase-multilingual-MiniLM-L12-v2)...")
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

    print("Connexion à Supabase...")
    try:
        conn = psycopg2.connect(SUPABASE_DB_URL)
        conn.autocommit = True
        cursor = conn.cursor()

        # ---------------------------------------------------------
        # 1. Vectorisation des nouvelles offres d'emploi
        # ---------------------------------------------------------
        print("\n--- 1. Vectorisation des offres d'emploi ---")
        cursor.execute("""
            SELECT id, title, description_snippet, extracted_skills
            FROM trajektia_live_job_postings
            WHERE embedding IS NULL;
        """)
        jobs = cursor.fetchall()
        
        if jobs:
            print(f"Vectorisation de {len(jobs)} nouvelles offres...")
            for job_id, title, desc, skills in jobs:
                text_parts = [title]
                if desc: text_parts.append(desc)
                if skills: text_parts.append(", ".join(skills))
                full_text = " - ".join(text_parts)
                
                vec = model.encode(full_text).tolist()
                cursor.execute(
                    "UPDATE trajektia_live_job_postings SET embedding = %s WHERE id = %s",
                    (vec, job_id)
                )
            print("Vectorisation des offres terminée.")
        else:
            print("Aucune nouvelle offre à vectoriser.")

        # ---------------------------------------------------------
        # 2. Calcul de l'Indice de Dérive Sémantique (IDS)
        # ---------------------------------------------------------
        print("\n--- 2. Calcul de l'Indice de Mutation Trajektia™ ---")
        cursor.execute("""
            SELECT DISTINCT cnp_code 
            FROM trajektia_live_job_postings 
            WHERE embedding IS NOT NULL;
        """)
        cnps_with_jobs = [r[0] for r in cursor.fetchall()]

        for cnp in cnps_with_jobs:
            cursor.execute("SELECT embedding FROM occupations WHERE cnp_code = %s AND embedding IS NOT NULL;", (cnp,))
            res_cnp = cursor.fetchone()
            if not res_cnp or not res_cnp[0]:
                print(f"Skipping CNP {cnp}: Pas de vecteur canonique.")
                continue
            
            v_cnp = np.array(eval(res_cnp[0])) if isinstance(res_cnp[0], str) else np.array(res_cnp[0])

            cursor.execute("SELECT embedding FROM trajektia_live_job_postings WHERE cnp_code = %s AND embedding IS NOT NULL;", (cnp,))
            market_vectors_raw = cursor.fetchall()
            
            market_vectors = []
            for (v_raw,) in market_vectors_raw:
                if isinstance(v_raw, str):
                    market_vectors.append(np.array(eval(v_raw)))
                else:
                    market_vectors.append(np.array(v_raw))

            if not market_vectors:
                continue
                
            centroid = np.mean(market_vectors, axis=0)

            # ids_score = 1 - cosine_similarity. scipy.spatial.distance.cosine returns 1 - cosine_similarity
            ids_score = cosine(v_cnp, centroid)
            
            if ids_score < 0.15:
                status = "Stable"
            elif ids_score < 0.35:
                status = "Transition modérée"
            else:
                status = "Mutation critique"
                
            cursor.execute("""
                UPDATE trajektia_market_snapshots 
                SET mutation_index = %s, mutation_status = %s
                WHERE cnp_code = %s
            """, (float(ids_score), status, cnp))
            
            print(f"CNP {cnp}: IDS = {ids_score:.3f} ({status}) - {len(market_vectors)} offres")

        print("\nCalculs d'Indice de Mutation terminés avec succès !")

    except Exception as e:
        print(f"Erreur SQL ou Analytique : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
