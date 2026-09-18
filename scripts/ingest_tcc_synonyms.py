#!/usr/bin/env python3
"""
Ingestion mockée des synonymes TCC 2025 vers Supabase.
En production, ce script lirait le référentiel TCC d'EDSC.
"""
import os
import sys
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

        # On prend les 20 premières compétences pour générer des synonymes
        cursor.execute("SELECT id, name_fr, name_en FROM competencies LIMIT 20;")
        competencies = cursor.fetchall()
        
        inserted = 0
        for comp_id, name_fr, name_en in competencies:
            # Génération de faux synonymes pour la démo
            synonyms = []
            if name_fr:
                synonyms.append((comp_id, f"Synonyme FR 1 de {name_fr[:10]}", "fr"))
                synonyms.append((comp_id, f"Alternative à {name_fr[:10]}", "fr"))
            if name_en:
                synonyms.append((comp_id, f"EN Synonym for {name_en[:10]}", "en"))
                
            for comp_id, syn_title, lang in synonyms:
                cursor.execute("""
                    INSERT INTO competency_synonyms (competency_id, synonym_title, language)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (competency_id, synonym_title, language) DO NOTHING;
                """, (comp_id, syn_title, lang))
                inserted += cursor.rowcount
                
        print(f"Ingestion terminée : {inserted} synonymes TCC 2025 ajoutés.")
        
    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
