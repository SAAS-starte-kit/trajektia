import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("SUPABASE_DB_URL")

def apply_sql_file(conn, file_path):
    print(f"Application de {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    with conn.cursor() as cur:
        try:
            cur.execute(sql)
            conn.commit()
            print(f" [OK] {file_path} applique avec succes.")
        except Exception as e:
            conn.rollback()
            print(f" [ERREUR] Impossible d'appliquer {file_path}: {e}")

if __name__ == "__main__":
    if not DB_URL:
        print("Erreur: SUPABASE_DB_URL_DIRECT n'est pas defini dans .env")
        exit(1)
        
    print(f"Connexion a Supabase...")
    try:
        conn = psycopg2.connect(DB_URL)
        print("Connexion reussie.")
        
        apply_sql_file(conn, 'database/schema.sql')
        apply_sql_file(conn, 'database/schema_v2.sql')
        apply_sql_file(conn, 'database/schema_v3.sql')
        
        conn.close()
    except Exception as e:
        print(f"Erreur de connexion: {e}")
