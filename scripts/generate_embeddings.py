#!/usr/bin/env python3
"""
Générateur d'embeddings (Vecteurs) en local avec sentence-transformers.
Transforme les descriptions et titres en vecteurs de 384 dimensions.
"""
import os
import sys
import psycopg2
from pathlib import Path

# On gère l'import ici pour pouvoir afficher un message d'erreur clair
try:
    from fastembed import TextEmbedding
except ImportError:
    print("Erreur: Le module 'fastembed' n'est pas installé.")
    print("Veuillez lancer: pip install fastembed")
    sys.exit(1)

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

    print("Chargement du modèle d'IA local (paraphrase-multilingual-MiniLM-L12-v2)...")
    # Ce modèle est petit, rapide et excellent pour le français/anglais (384 dimensions)
    model = TextEmbedding(model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

    print("Connexion à Supabase...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # --- 1. Vectorisation des Compétences du Cégep ---
        print("-> Vectorisation des compétences DEC...")
        cursor.execute("SELECT id, meq_raw_text FROM program_competencies WHERE embedding IS NULL;")
        dec_comps = cursor.fetchall()
        for cid, text in dec_comps:
            vec = list(model.embed([text]))[0].tolist()
            cursor.execute("UPDATE program_competencies SET embedding = %s WHERE id = %s", (vec, cid))
        print(f"   {len(dec_comps)} compétences DEC vectorisées.")

        # --- 2. Vectorisation des Compétences O*NET ---
        print("-> Vectorisation de 50 compétences O*NET (Mock rapide)...")
        # On limite à 50 pour que le test soit rapide (en prod, on enlèverait LIMIT)
        cursor.execute("SELECT id, name_fr FROM competencies WHERE name_fr IS NOT NULL AND embedding IS NULL LIMIT 50;")
        onet_comps = cursor.fetchall()
        for cid, text in onet_comps:
            vec = list(model.embed([text]))[0].tolist()
            cursor.execute("UPDATE competencies SET embedding = %s WHERE id = %s", (vec, cid))
        print(f"   {len(onet_comps)} compétences O*NET vectorisées.")

        # --- 3. Vectorisation des Métiers ---
        print("-> Vectorisation de 50 professions (Mock rapide)...")
        # On prend le titre + la description pour le vecteur
        cursor.execute("SELECT cnp_code, title_fr, description_fr FROM occupations WHERE title_fr IS NOT NULL AND embedding IS NULL LIMIT 50;")
        occupations = cursor.fetchall()
        for cnp, title, desc in occupations:
            full_text = f"{title}. {desc if desc else ''}"
            vec = list(model.embed([full_text]))[0].tolist()
            cursor.execute("UPDATE occupations SET embedding = %s WHERE cnp_code = %s", (vec, cnp))
        print(f"   {len(occupations)} professions vectorisées.")

        print("Génération des embeddings terminée avec succès !")

    except Exception as e:
        print(f"Erreur SQL ou IA : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
