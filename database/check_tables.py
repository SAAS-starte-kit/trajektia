import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("SUPABASE_DB_URL")

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
tables = [r[0] for r in cur.fetchall()]
print(f"Tables actuelles dans Supabase: {', '.join(tables)}")

if 'tools' in tables and 'occupation_tools' in tables:
    print("OUI, les tables 'tools' et 'occupation_tools' existent bien !")
else:
    print("NON, il manque les tables.")
    
conn.close()
