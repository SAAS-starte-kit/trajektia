"""
apply_dpc_taxonomy.py
=====================
Applique le schéma V7 (ref_dpc_taxonomy et v_occupation_dpc_detailed)
sur la base de données PostgreSQL / Supabase de Trajektia.
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv("trajektia/.env")
load_dotenv(".env")

DB_URL = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")

def main():
    print("=" * 70)
    print("🚀 TRAJEKTIA — Migration Schéma V7 (Taxonomie DPC & Vue Enrichie)")
    print("=" * 70)

    if not DB_URL:
        print("❌ ERREUR: SUPABASE_DB_URL non trouvé dans les variables d'environnement.")
        sys.exit(1)

    # Déterminer le chemin du fichier SQL
    sql_path = "trajektia/database/schema_v7_dpc_taxonomy.sql"
    if not os.path.exists(sql_path):
        sql_path = "database/schema_v7_dpc_taxonomy.sql"
    if not os.path.exists(sql_path):
        print(f"❌ ERREUR: Fichier SQL introuvable: {sql_path}")
        sys.exit(1)

    print(f"📄 Lecture du fichier SQL: {sql_path}")
    with open(sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    print("🔌 Connexion à Supabase PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        print("⚡ Exécution du script SQL...")
        cur.execute(sql_content)
        conn.commit()
        print("✅ Schéma V7 appliqué avec succès !")

        # ── Vérification 1 : Volumétrie par catégorie ──
        cur.execute("""
            SELECT category, COUNT(*), MIN(level_number), MAX(level_number)
            FROM ref_dpc_taxonomy
            GROUP BY category
            ORDER BY category;
        """)
        cats = cur.fetchall()
        print("\n📊 Contrôle volumétrique de ref_dpc_taxonomy :")
        total = 0
        for cat, count, min_l, max_l in cats:
            total += count
            print(f"  • {cat:<8} : {count} échelons (niveaux {min_l} à {max_l})")
        print(f"  ➜ Total: {total} échelons enregistrés.")

        if total != 25:
            print(f"⚠️ AVERTISSEMENT : 25 échelons attendus, {total} trouvés.")
        else:
            print("  ✓ Concordance exacte avec les 25 échelons FJA / EDSC.")

        # ── Vérification 2 : Vue enrichie v_occupation_dpc_detailed ──
        print("\n🔎 Test d'interrogation de la vue enrichie (Échantillon de métiers) :")
        sample_cnps = ['21232', '31301', '72200', '41200', '72100']
        cur.execute("""
            SELECT 
                cnp_code, 
                occupation_title_fr, 
                dpc_summary,
                dpc_data_code || ' ' || dpc_data_verb_fr AS data_action,
                dpc_people_code || ' ' || dpc_people_verb_fr AS people_action,
                dpc_things_code || ' ' || dpc_things_verb_fr AS things_action,
                prediger_things_people,
                prediger_data_ideas
            FROM v_occupation_dpc_detailed
            WHERE cnp_code = ANY(%s);
        """, (sample_cnps,))

        rows = cur.fetchall()
        for r in rows:
            print(f"\n  [CNP {r[0]}] {r[1]}")
            print(f"    • Synthèse : {r[2]}")
            print(f"    • Données   : {r[3]}")
            print(f"    • Personnes : {r[4]}")
            print(f"    • Choses    : {r[5]}")
            print(f"    • Prediger  : {r[6]} | {r[7]}")

        print("\n" + "=" * 70)
        print("🎉 Migration Phase D1 validée et opérationnelle !")
        print("=" * 70)

    except Exception as e:
        conn.rollback()
        print(f"❌ ERREUR lors de l'application : {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
