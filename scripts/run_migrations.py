import argparse
import hashlib
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

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

def get_version(filename):
    if filename == "schema.sql":
        return 1
    m = re.search(r'v(\d+)', filename)
    if m:
        return int(m.group(1))
    return 999

def calculate_checksum(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def discover_migrations(db_dir: Path):
    if not db_dir.exists():
        print(f"Error: Directory {db_dir} does not exist.")
        sys.exit(1)
        
    files = [f for f in db_dir.iterdir() if f.is_file() and f.suffix == ".sql"]
    files.sort(key=lambda x: get_version(x.name))
    return files

def get_db_url():
    url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL") or os.environ.get("SUPABASE_DB_URL_DIRECT")
    return url

def main():
    parser = argparse.ArgumentParser(description="Automated SQL Migrations Runner and Schema Verifier")
    parser.add_argument("--dry-run", action="store_true", help="List discovered migration files without executing")
    parser.add_argument("--apply", action="store_true", help="Connect to DB and apply pending migrations")
    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        parser.print_help()
        sys.exit(1)

    base_dir = Path(__file__).resolve().parent.parent
    db_dir = base_dir / "packages" / "database"
    
    if args.apply:
        load_env_file(base_dir / ".env")

    migrations = discover_migrations(db_dir)

    if args.dry_run:
        print(f"Found {len(migrations)} migration files:")
        for idx, f in enumerate(migrations):
            checksum = calculate_checksum(f)
            print(f"  {idx + 1:02d}. {f.name} (Checksum: {checksum[:8]}...)")
        sys.exit(0)

    if args.apply:
        db_url = get_db_url()
        if not db_url:
            print("Error: Database URL not found. Set DATABASE_URL or SUPABASE_DB_URL.")
            sys.exit(1)
            
        try:
            conn = psycopg2.connect(db_url)
            conn.autocommit = False
            
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS _migrations_history (
                        id SERIAL PRIMARY KEY,
                        filename TEXT UNIQUE NOT NULL,
                        applied_at TIMESTAMPTZ DEFAULT NOW(),
                        checksum TEXT
                    );
                """)
                conn.commit()
                
                cur.execute("SELECT filename, checksum FROM _migrations_history;")
                applied_migrations = {row[0]: row[1] for row in cur.fetchall()}
                
                for f in migrations:
                    checksum = calculate_checksum(f)
                    
                    if f.name in applied_migrations:
                        # Verify checksum
                        if applied_migrations[f.name] != checksum:
                            print(f"Error: Checksum mismatch for {f.name}!")
                            print(f"  Expected: {applied_migrations[f.name]}")
                            print(f"  Actual:   {checksum}")
                            sys.exit(1)
                        print(f"Skipping {f.name} (already applied)")
                        continue
                        
                    print(f"Applying {f.name}...")
                    try:
                        with open(f, "r", encoding="utf-8") as sql_file:
                            sql = sql_file.read()
                        cur.execute(sql)
                        cur.execute(
                            "INSERT INTO _migrations_history (filename, checksum) VALUES (%s, %s)",
                            (f.name, checksum)
                        )
                        conn.commit()
                        print(f"Successfully applied {f.name}")
                    except Exception as e:
                        conn.rollback()
                        print(f"Error applying {f.name}: {e}")
                        sys.exit(1)
                        
            conn.close()
            print("All migrations applied successfully.")
        except Exception as e:
            print(f"Database connection error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
