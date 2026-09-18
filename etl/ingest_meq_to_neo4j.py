import os
import psycopg2
from neo4j import GraphDatabase
from dotenv import load_dotenv

def main():
    load_dotenv(".env")
    
    print("1. Connexion à PostgreSQL (Supabase)...")
    try:
        pg_conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
        pg_cur = pg_conn.cursor()
    except Exception as e:
        print(f"Erreur de connexion à Postgres: {e}")
        return
        
    # Extraction des programmes
    print("2. Extraction des programmes d'études (MEQ)...")
    pg_cur.execute("""
        SELECT program_code, title_fr, level, placement_rate, starting_salary
        FROM educational_programs
    """)
    programs = pg_cur.fetchall()
    print(f"  -> {len(programs)} programmes trouvés.")
    
    # Extraction des liaisons CNP <-> Programmes
    print("3. Extraction des relations Métier <-> Formation...")
    pg_cur.execute("""
        SELECT occupation_cnp_code, program_code, is_direct_path
        FROM occupation_programs
    """)
    relations = pg_cur.fetchall()
    print(f"  -> {len(relations)} liaisons trouvées.")
    
    print("\n4. Connexion à Neo4j...")
    try:
        neo4j_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "admin123"))
    except Exception as e:
        print(f"Erreur de connexion à Neo4j: {e}")
        return

    # Ingestion des Noeuds Program
    print("5. Ingestion des noeuds (:Program) dans Neo4j...")
    
    def upsert_programs(tx, batch):
        query = """
        UNWIND $batch AS p
        MERGE (prog:Program {code: p.program_code})
        SET prog.title_fr = p.title_fr,
            prog.level = p.level,
            prog.placement_rate = p.placement_rate,
            prog.starting_salary = p.starting_salary,
            prog.taxonomy = 'MEQ'
        """
        tx.run(query, batch=batch)
        
    with neo4j_driver.session() as session:
        batch = []
        for p in programs:
            batch.append({
                "program_code": p[0],
                "title_fr": p[1],
                "level": p[2],
                "placement_rate": float(p[3]) if p[3] is not None else None,
                "starting_salary": float(p[4]) if p[4] is not None else None
            })
            if len(batch) >= 100:
                session.execute_write(upsert_programs, batch)
                batch = []
        if batch:
            session.execute_write(upsert_programs, batch)
            
    # Ingestion des Relations
    print("6. Création des relations [:REQUIRES_PROGRAM]...")
    
    def upsert_relations(tx, batch):
        query = """
        UNWIND $batch AS r
        MATCH (occ:Occupation {code: 'CNP-' + r.cnp_code, taxonomy: 'CNP'})
        MATCH (prog:Program {code: r.program_code})
        MERGE (occ)-[rel:REQUIRES_PROGRAM]->(prog)
        SET rel.is_direct_path = r.is_direct_path
        """
        tx.run(query, batch=batch)
        
    with neo4j_driver.session() as session:
        batch = []
        for r in relations:
            batch.append({
                "cnp_code": str(r[0]),
                "program_code": r[1],
                "is_direct_path": r[2]
            })
            if len(batch) >= 100:
                session.execute_write(upsert_relations, batch)
                batch = []
        if batch:
            session.execute_write(upsert_relations, batch)
            
    print("\nMission accomplie ! Les programmes et leurs liaisons ont ete integres au CKG Neo4j.")
    
    pg_cur.close()
    pg_conn.close()
    neo4j_driver.close()

if __name__ == "__main__":
    main()
