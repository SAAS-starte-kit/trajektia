import os
import psycopg2
from neo4j import GraphDatabase
from dotenv import load_dotenv

def main():
    # Charge les variables d'environnement (où se trouve SUPABASE_DB_URL)
    load_dotenv(".env")
    
    print("1. Connexion à Postgres (Supabase)...")
    pg_conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
    pg_cur = pg_conn.cursor()
    
    # Récupérer les 510 métiers (groupes de base = 5 chiffres)
    pg_cur.execute("""
        SELECT cnp_code, title_fr, title_en, teer_level
        FROM occupations
        WHERE LENGTH(cnp_code) = 5 AND cnp_code ~ '^[0-9]+$'
    """)
    occupations = pg_cur.fetchall()
    print(f"-> {len(occupations)} métiers CNP 2021 trouvés dans Postgres.")
    
    print("2. Connexion à Neo4j...")
    # Utilisation des identifiants locaux vus dans mcp_config.json
    neo4j_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "admin123"))
    
    def ingest_occupation(tx, occ):
        cnp_code, title_fr, title_en, teer_level = occ
        
        # Le code dans Neo4j sera préfixé par "CNP-" pour le distinguer des codes O*NET ou ESCO.
        # ex: "CNP-11100"
        # On utilise MERGE sur "code" puisque nous avons une contrainte d'unicité dessus.
        query = """
        MERGE (o:Occupation {code: $code})
        SET o.taxonomy = 'CNP',
            o.title_fr = $title_fr,
            o.title_en = $title_en,
            o.teer_level = $teer_level,
            o.evidence_class = 'documented'
        RETURN o
        """
        
        tx.run(query, 
               code=f"CNP-{cnp_code}",
               title_fr=title_fr,
               title_en=title_en,
               teer_level=teer_level)
    
    print("3. Ingestion en cours dans Neo4j...")
    with neo4j_driver.session() as session:
        for i, occ in enumerate(occupations):
            session.execute_write(ingest_occupation, occ)
            if (i+1) % 100 == 0:
                print(f"  -> {i+1} métiers ingérés...")
                
    print(f"\n✅ Terminé : {len(occupations)} nœuds (:Occupation {{taxonomy: 'CNP'}}) sont maintenant dans le graphe Neo4j !")
    
    pg_cur.close()
    pg_conn.close()
    neo4j_driver.close()

if __name__ == "__main__":
    main()
