import os
import psycopg2
import json

def main():
    env_path = ".env"
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                k, v = line.split('=', 1)
                os.environ[k.strip()] = v.strip()
    db_url = os.environ.get("SUPABASE_DB_URL")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    print("--- big_five_profiles ---")
    cursor.execute("SELECT * FROM big_five_profiles LIMIT 5;")
    for row in cursor.fetchall():
        print(row)
        
    print("--- noc_onet_crosswalk ---")
    cursor.execute("SELECT * FROM noc_onet_crosswalk LIMIT 5;")
    for row in cursor.fetchall():
        print(row)

if __name__ == "__main__":
    main()
