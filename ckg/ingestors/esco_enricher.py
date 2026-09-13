import sys
import os
import ssl
import json
import urllib.request
import concurrent.futures
from pathlib import Path
from neo4j import GraphDatabase

# Ajouter ckg/ au sys.path
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))

from ckg_config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

# Disable SSL verification for API calls (Windows issue)
ctx = ssl._create_unverified_context()

class EscoEnricher:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def fetch_esco_title(self, uri, lang='fr'):
        """Fetch title from ESCO API for a given URI and language."""
        url = f"https://ec.europa.eu/esco/api/resource/concept?uri={uri}&language={lang}"
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        try:
            with urllib.request.urlopen(req, context=ctx) as resp:
                data = json.loads(resp.read())
                return data.get('title', '')
        except Exception as e:
            return None

    def process_uri(self, uri):
        """Fetch both FR and EN titles for a URI."""
        title_fr = self.fetch_esco_title(uri, 'fr')
        title_en = self.fetch_esco_title(uri, 'en')
        return uri, title_fr, title_en

    def run(self):
        print("[INFO] Récupération des URI ESCO depuis Neo4j...")
        
        # 1. Fetch all empty ESCO nodes
        with self.driver.session(database="neo4j") as session:
            result = session.run("MATCH (e:Occupation {taxonomy: 'ESCO'}) WHERE e.title_fr IS NULL RETURN e.uri AS uri")
            uris = [record["uri"] for record in result]
            
        total = len(uris)
        if total == 0:
            print("[INFO] Tous les noeuds ESCO ont déjà des titres.")
            return
            
        print(f"[INFO] {total} noeuds ESCO trouvés sans titre. Interrogation de l'API ESCO...")
        
        updates = []
        # 2. Fetch titles concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            future_to_uri = {executor.submit(self.process_uri, uri): uri for uri in uris}
            completed = 0
            for future in concurrent.futures.as_completed(future_to_uri):
                uri, fr, en = future.result()
                if fr or en:
                    updates.append({'uri': uri, 'title_fr': fr, 'title_en': en})
                completed += 1
                print(f"   [OK] Fetching API: {completed}/{total}", end="\r")
        
        print(f"\n[INFO] {len(updates)} titres récupérés. Mise à jour de Neo4j...")
        
        # 3. Update Neo4j in batches
        update_query = """
        UNWIND $batch as row
        MATCH (e:Occupation {uri: row.uri, taxonomy: 'ESCO'})
        SET e.title_fr = row.title_fr, e.title_en = row.title_en
        """
        
        with self.driver.session(database="neo4j") as session:
            for i in range(0, len(updates), 500):
                batch = updates[i:i+500]
                session.run(update_query, batch=batch)
                
        print(f"[DONE] {len(updates)} noeuds ESCO mis à jour avec succès.")

if __name__ == "__main__":
    enricher = EscoEnricher()
    try:
        enricher.run()
    finally:
        enricher.close()
