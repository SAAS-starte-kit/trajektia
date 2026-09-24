#!/usr/bin/env python3
"""
Test de la recherche sémantique via l'espace vectoriel (pgvector).
Prend une phrase en français et trouve les métiers les plus proches.
"""
import os
import sys
from pathlib import Path
import psycopg2

try:
    from fastembed import TextEmbedding
except ImportError:
    print("Erreur: Le module 'fastembed' n'est pas installé.")
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
    if len(sys.argv) < 2:
        print("Usage: python scripts/test_semantic_search.py \"Votre phrase de recherche ici\"")
        print("Exemple: python scripts/test_semantic_search.py \"Je veux travailler dehors avec des animaux\"")
        sys.exit(1)

    query = sys.argv[1]
    print(f"\n[Recherche sémantique] pour : '{query}'\n")

    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Erreur : SUPABASE_DB_URL manquant.")
        sys.exit(1)

    print("Chargement du modèle d'IA local...")
    model = TextEmbedding(model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
    
    # Transformation de la requête texte en vecteur
    query_vector = list(model.embed([query]))[0].tolist()

    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Recherche de métiers par proximité cosinus (opérateur <=>)
        # Plus la valeur est petite, plus c'est proche (0 = identique)
        sql = """
            SELECT cnp_code, title_fr, 
                   1 - (embedding <=> %s::vector) AS similarity_score
            FROM occupations 
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> %s::vector
            LIMIT 5;
        """
        
        cursor.execute(sql, (query_vector, query_vector))
        results = cursor.fetchall()

        print("\n--- Top 5 Métiers les plus pertinents (Score sémantique) ---\n")
        for cnp, title, score in results:
            # Formatage du score en pourcentage
            score_pct = round(float(score) * 100, 1)
            print(f"- {title} (CNP {cnp}) -> Match: {score_pct}%")
            
        print("\nNote: Si les résultats semblent étranges, c'est parce que nous n'avons vectorisé que 50 métiers pour la démo !")

    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
