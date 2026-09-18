#!/usr/bin/env python3
"""
Ingestion mockée des profils Big Five (OCEAN) pour les métiers.
En production, on mappe les 'Work Styles' de O*NET sur le modèle Big Five.
"""
import os
import sys
import random
from pathlib import Path
import psycopg2

def load_env_file(filepath: Path):
    if not filepath.exists():
        return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v

def main():
    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Erreur : SUPABASE_DB_URL manquant.")
        sys.exit(1)

    print("Connexion à Supabase...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()

        cursor.execute("SELECT cnp_code, title_fr FROM occupations;")
        occupations = cursor.fetchall()
        
        inserted = 0
        for cnp_code, title in occupations:
            # Génération simulée basée sur le titre (heuristique basique)
            title_lower = str(title).lower()
            
            # Base logic
            o, c, e, a, n = 50, 50, 50, 50, 50
            
            if 'ingénieur' in title_lower or 'développeur' in title_lower:
                o, c, e, a, n = 75, 85, 40, 50, 30
            elif 'infirmier' in title_lower or 'médecin' in title_lower or 'santé' in title_lower:
                o, c, e, a, n = 60, 90, 70, 90, 60
            elif 'directeur' in title_lower or 'gestionnaire' in title_lower:
                o, c, e, a, n = 80, 85, 85, 60, 40
            elif 'artiste' in title_lower or 'designer' in title_lower:
                o, c, e, a, n = 95, 40, 60, 70, 65
            else:
                o = random.randint(30, 80)
                c = random.randint(40, 90)
                e = random.randint(30, 90)
                a = random.randint(40, 90)
                n = random.randint(20, 70)
                
            cursor.execute("""
                INSERT INTO big_five_profiles 
                (cnp_code, openness_score, conscientiousness_score, extraversion_score, agreeableness_score, neuroticism_score)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (cnp_code) DO NOTHING;
            """, (cnp_code, o, c, e, a, n))
            
            inserted += cursor.rowcount
                
        print(f"Ingestion terminée : {inserted} profils Big Five générés.")
        
    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
