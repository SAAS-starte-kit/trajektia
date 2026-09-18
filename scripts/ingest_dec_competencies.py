#!/usr/bin/env python3
"""
Ingestion mockée des compétences brutes extraites des PDFs de programmes DEC (MEQ).
Ceci émule la sortie du modèle d'extraction Vision/LLM.
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

        # Émulation de la sortie d'un parseur PDF pour 3 programmes DEC
        mock_dec_data = [
            # Techniques de l'informatique (420.B0)
            ('420.B0', 'Analyser les caractéristiques d\'un système d\'information'),
            ('420.B0', 'Développer des modèles conceptuels en utilisant l\'approche orientée objet'),
            ('420.B0', 'Exploiter une base de données relationnelle'),
            ('420.B0', 'Programmer des algorithmes complexes'),
            
            # Soins infirmiers (180.A0)
            ('180.A0', 'Évaluer l\'état de santé d\'une personne'),
            ('180.A0', 'Intervenir en situation d\'urgence'),
            ('180.A0', 'Assurer le suivi des soins prodigués'),
            
            # Techniques de comptabilité et de gestion (410.B0)
            ('410.B0', 'Traiter des informations comptables'),
            ('410.B0', 'Analyser la situation financière d\'une entreprise'),
            ('410.B0', 'Participer à la gestion du personnel')
        ]
        
        inserted = 0
        for code, text in mock_dec_data:
            cursor.execute("""
                INSERT INTO program_competencies (program_code, meq_raw_text)
                VALUES (%s, %s);
            """, (code, text))
            inserted += cursor.rowcount
                
        print(f"Ingestion terminée : {inserted} compétences DEC brutes émulées ajoutées.")
        
    except Exception as e:
        print(f"Erreur SQL : {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
