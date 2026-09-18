import os
import psycopg2
from neo4j import GraphDatabase
from dotenv import load_dotenv

def main():
    load_dotenv(".env")
    
    print("1. Récupération des correspondances (Crosswalks) dans Postgres...")
    pg_conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
    pg_cur = pg_conn.cursor()
    
    # On récupère uniquement les codes CNP à 5 chiffres et leurs équivalences O*NET
    pg_cur.execute("""
        SELECT noc_code, onet_soc_code
        FROM noc_onet_crosswalk
        WHERE LENGTH(noc_code) = 5
    """)
    mappings = pg_cur.fetchall()
    print(f"-> {len(mappings)} liens CNP <-> O*NET trouves.")
    
    print("2. Création des relations [:EQUIVALENT_TO] dans Neo4j...")
    neo4j_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "admin123"))
    
    def link_occupations(tx, noc_code, onet_code):
        query = """
        MATCH (cnp:Occupation {code: $cnp_code, taxonomy: 'CNP'})
        MATCH (onet:Occupation {code: $onet_code, taxonomy: 'O*NET'})
        MERGE (cnp)-[r:EQUIVALENT_TO]->(onet)
        RETURN count(r)
        """
        result = tx.run(query, cnp_code=f"CNP-{noc_code}", onet_code=onet_code)
        return result.single()[0]
    
    links_created = 0
    with neo4j_driver.session() as session:
        for i, (noc, onet) in enumerate(mappings):
            created = session.execute_write(link_occupations, noc, onet)
            links_created += created
            if (i+1) % 200 == 0:
                print(f"  -> {i+1} correspondances traitées...")
                
    print(f"\nTermine : {links_created} relations [:EQUIVALENT_TO] creees dans Neo4j !")
    
    pg_cur.close()
    pg_conn.close()
    neo4j_driver.close()

if __name__ == "__main__":
    main()
