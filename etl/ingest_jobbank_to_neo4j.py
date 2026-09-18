import os
import pandas as pd
from neo4j import GraphDatabase
import urllib.request
import tempfile

def ingest_jobbank():
    print("Démarrage de l'ingestion du Guichet-Emplois (Job Bank)...")
    
    # URL of the open data CSV (French, April 2024 as an example)
    url = "https://open.canada.ca/data/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072/resource/85ccf8a0-9e96-45c2-b629-16bbf219cc45/download/job-bank-open-data-all-job-postings-fr-avril2024.csv"
    
    print(f"Téléchargement du fichier CSV depuis : {url}")
    # Download to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    try:
        urllib.request.urlretrieve(url, temp_file.name)
        print("Téléchargement terminé.")
        
        # Try reading with utf-16 first (0xff 0xfe BOM is common for MS Excel exports)
        try:
            df = pd.read_csv(temp_file.name, encoding='utf-16', sep='\t')
        except:
            try:
                df = pd.read_csv(temp_file.name, encoding='cp1252', sep=',')
            except:
                df = pd.read_csv(temp_file.name, encoding='latin1', sep=None, engine='python')
        
        print("Colonnes détectées :", df.columns.tolist())
        print(f"Nombre total d'offres : {len(df)}")
        
        # Trouver les colonnes exactes (elles varient parfois)
        col_cnp = 'Code CNP 2021' if 'Code CNP 2021' in df.columns else next((c for c in df.columns if 'CNP' in c.upper() or 'NOC' in c.upper()), None)
        col_title = "Appellation d'emploi" if "Appellation d'emploi" in df.columns else next((c for c in df.columns if 'TITRE' in c.upper() or 'TITLE' in c.upper() or 'APPELLATION' in c.upper()), None)
        col_prov = 'Provinces/Territoires' if 'Provinces/Territoires' in df.columns else next((c for c in df.columns if 'PROVINCE' in c.upper()), None)
        col_id = 'ID WIC Lieu emploi' if 'ID WIC Lieu emploi' in df.columns else next((c for c in df.columns if 'ID' in c.upper()), None)
        col_salary = 'Salaire Maximum' if 'Salaire Maximum' in df.columns else next((c for c in df.columns if 'SALAIRE' in c.upper() or 'SALARY' in c.upper()), None)
        
        if not col_cnp or not col_title:
            print("Erreur: Impossible de trouver les colonnes CNP ou Titre.")
            return
            
        print(f"Mapping trouvé: CNP={col_cnp}, Titre={col_title}, Prov={col_prov}, ID={col_id}")
        
        # Nettoyage et Filtrage (Québec)
        df = df.dropna(subset=[col_cnp])
        
        if col_prov:
            df_qc = df[df[col_prov].astype(str).str.contains('QC|Québec|Quebec', case=False, na=False)]
            print(f"Nombre d'offres au Québec : {len(df_qc)}")
        else:
            df_qc = df
            
        # Connexion Neo4j
        uri = "bolt://localhost:7687"
        auth = ("neo4j", "admin123")
        driver = GraphDatabase.driver(uri, auth=auth)
        
        print("Insertion dans Neo4j...")
        
        cypher_query = """
        UNWIND $batch AS row
        // Nettoyage du code CNP (ex: '21231' au lieu de '21231.0')
        WITH row, split(toString(row.cnp), '.')[0] AS clean_cnp
        
        // Match l'occupation canadienne existante (gère avec ou sans préfixe 'CNP-')
        MATCH (o:Occupation)
        WHERE o.code = clean_cnp OR o.code = 'CNP-' + clean_cnp
        
        // Créer l'offre d'emploi
        MERGE (j:JobPosting {id: toString(row.id)})
        SET j.title = row.title,
            j.salary = row.salary,
            j.source = 'Job Bank / Guichet-Emplois'
            
        // Créer la relation
        MERGE (j)-[:BELONGS_TO]->(o)
        """
        
        batch = []
        batch_size = 500
        count = 0
        
        with driver.session() as session:
            for index, row in df_qc.iterrows():
                # Prepare row data safely
                cnp_val = str(row[col_cnp]).strip()
                if not cnp_val or cnp_val == 'nan':
                    continue
                    
                job_id = str(row[col_id]) if col_id else f"JB-{index}"
                title = str(row[col_title])
                salary = str(row[col_salary]) if col_salary else "N/D"
                
                batch.append({
                    "id": job_id,
                    "cnp": cnp_val,
                    "title": title,
                    "salary": salary
                })
                
                if len(batch) >= batch_size:
                    session.run(cypher_query, batch=batch)
                    count += len(batch)
                    print(f"{count} offres traitées...")
                    batch = []
            
            # Insert remaining
            if batch:
                session.run(cypher_query, batch=batch)
                count += len(batch)
                
        print(f"Succès ! {count} offres d'emploi rattachées à la CNP dans Neo4j.")
        driver.close()
        
    except Exception as e:
        print(f"Erreur durant l'ingestion: {e}")
    finally:
        try:
            temp_file.close()
            if os.path.exists(temp_file.name):
                os.remove(temp_file.name)
        except Exception as e:
            print(f"Warning: could not delete temp file: {e}")

if __name__ == "__main__":
    ingest_jobbank()
