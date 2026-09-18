import os
import sys
import psycopg2
from pathlib import Path

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
    
    db_url = os.environ.get("SUPABASE_DB_URL") or os.environ.get("SUPABASE_DB_URL_DIRECT")
    if not db_url:
        print("Erreur: SUPABASE_DB_URL introuvable.")
        sys.exit(1)
        
    sql_file = base_dir / "database" / "schema_v12_pgvector.sql"
    with open(sql_file, "r", encoding="utf-8") as f:
        sql = f.read()
        
    print(f"Connexion à {db_url.split('@')[1]}...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        print(f"Exécution de {sql_file.name}...")
        cursor.execute(sql)
        print("Succès !")
    except Exception as e:
        print(f"Erreur SQL : {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
