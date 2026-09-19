import os
import re
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv(".env")

def main():
    pg_conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
    pg_cur = pg_conn.cursor()

    filepath = "frontend-web/src/data/valeurs-travail-metiers.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"export const VALEURS_TRAVAIL_PAR_CNP.*=\s*({.*});?", content, re.DOTALL)
    if not match:
        print("Could not parse TS file.")
        return

    json_str = match.group(1).strip()
    if json_str.endswith(";"):
        json_str = json_str[:-1]
        
    json_str = re.sub(r",\s*}", "}", json_str)
    json_str = re.sub(r",\s*]", "]", json_str)

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return

    print(f"Parsed {len(data)} entries.")

    count = 0
    for cnp, profile in data.items():
        scores = profile.get("scores", {})
        valeurs = profile.get("valeurs_dominantes", [])
        source = profile.get("source", "")
        
        pg_cur.execute("""
            INSERT INTO onet_work_values (cnp_code, accomplissement, independance, reconnaissance, relations, soutien, conditions_travail, valeurs_dominantes, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (cnp_code) DO UPDATE SET
                accomplissement = EXCLUDED.accomplissement,
                independance = EXCLUDED.independance,
                reconnaissance = EXCLUDED.reconnaissance,
                relations = EXCLUDED.relations,
                soutien = EXCLUDED.soutien,
                conditions_travail = EXCLUDED.conditions_travail,
                valeurs_dominantes = EXCLUDED.valeurs_dominantes,
                source = EXCLUDED.source
        """, (
            cnp,
            scores.get("accomplissement"),
            scores.get("independance"),
            scores.get("reconnaissance"),
            scores.get("relations"),
            scores.get("soutien"),
            scores.get("conditions_travail"),
            valeurs,
            source
        ))
        count += 1

    pg_conn.commit()
    print(f"Successfully inserted {count} records into onet_work_values.")

    pg_cur.close()
    pg_conn.close()

if __name__ == "__main__":
    main()
