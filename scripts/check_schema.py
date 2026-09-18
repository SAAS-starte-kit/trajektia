import os
import psycopg2

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
    
    # Check tables
    for table in ['occupations', 'cnp_hierarchy', 'riasec_profiles', 'noc_onet_crosswalk', 'big_five_profiles']:
        cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}';")
        print(f"--- {table} ---")
        for row in cursor.fetchall():
            print(row)

if __name__ == "__main__":
    main()
