#!/usr/bin/env python3
"""
Ingesteur des offres d'emploi Job Bank (Guichet-Emplois) vers Neo4j.

Objectif: Créer des nœuds MarketDemand séparés et les relier aux Occupations
via la relation [:HAS_DEMAND] pour afficher "X offres actives au Québec".

Source: Open Canada CKAN - Job Bank (Guichet-Emplois)
- API: https://open.canada.ca/data/fr/api/3/action/datastore_search
- Resource ID: ea639e28-c0fc-48bf-b5dd-b8899bd43072

A5 du PLAN_ACTION - Trajektia CKG
"""
import os
import sys
import json
import urllib.request
from datetime import datetime
from collections import defaultdict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class JobBankMarketDemandIngestor:
    """Ingesteur des données de marché du Guichet-Emplois vers Neo4j."""

    # Resource ID CKAN pour les offres d'emploi Job Bank
    JOBBANK_RESOURCE_ID = "08b47070-5389-49a9-b511-779616f287dd"
    CKAN_API_BASE = "https://open.canada.ca/data/fr/api/3/action/datastore_search"

    def __init__(self):
        # Configuration Neo4j via variables d'environnement
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD")

        if not self.password:
            print("[ERR] Variable NEO4J_PASSWORD manquante dans .env")
            sys.exit(1)

        # Import du driver Neo4j
        try:
            from neo4j import GraphDatabase
            self.driver = GraphDatabase.driver(
                self.uri,
                auth=(self.user, self.password),
                max_connection_lifetime=3600
            )
        except ImportError:
            print("[ERR] Package neo4j manquant: pip install neo4j")
            sys.exit(1)

        # Configuration d'ingestion
        self.batch_size = 500
        self.current_month = datetime.now().strftime("%Y-%m")

        # Statistiques
        self.stats = {
            "records_fetched": 0,
            "cnp_aggregated": 0,
            "demand_nodes_created": 0,
            "relationships_created": 0
        }

    def close(self):
        """Ferme la connexion Neo4j."""
        if hasattr(self, 'driver'):
            self.driver.close()

    def fetch_jobbank_data(self, limit=5000, offset=0):
        """
        Récupère les données du Guichet-Emplois depuis l'API CKAN.
        Retourne un générateur de records pour éviter la saturation mémoire.
        """
        total_fetched = 0

        while True:
            url = f"{self.CKAN_API_BASE}?resource_id={self.JOBBANK_RESOURCE_ID}&limit={limit}&offset={offset}"
            print(f"[INFO] Fetching records {offset} to {offset + limit}...")

            try:
                req = urllib.request.Request(
                    url,
                    headers={"User-Agent": "Trajektia-CKG-Ingestor/1.0"}
                )

                with urllib.request.urlopen(req, timeout=60) as response:
                    data = json.loads(response.read().decode("utf-8"))

                result = data.get("result", {})
                records = result.get("records", [])

                if not records:
                    break

                total_fetched += len(records)
                self.stats["records_fetched"] += len(records)

                yield records

                # Check if we reached the end
                if len(records) < limit:
                    break

                offset += limit

            except Exception as e:
                print(f"[ERR] API request failed: {e}")
                break

        print(f"[OK] Total records fetched from Job Bank: {total_fetched}")

    def aggregate_by_cnp(self, records):
        """
        Agrège les offres par code CNP pour obtenir le nombre d'offres actives.
        Filtre uniquement pour le Québec (QC).
        """
        cnp_counts = defaultdict(int)

        for record in records:
            # Chercher en priorité la colonne CNP 2021
            cnp = None
            for pref_key in ['NOC21 Code', 'NOC 2021', 'CNP21 Code', 'CNP 2021']:
                for k in record.keys():
                    if pref_key.upper() in k.upper():
                        val = record.get(k)
                        if val and str(val).strip().upper() != 'NA':
                            cval = str(val).split('.')[0].strip()
                            if cval.isdigit():
                                cnp = cval
                                break
                if cnp:
                    break
            
            # Fallback sur n'importe quel CNP/NOC si pas trouvé
            if not cnp:
                for key in record.keys():
                    key_upper = key.upper()
                    if 'CNP' in key_upper or 'NOC' in key_upper:
                        cnp_val = record.get(key)
                        if cnp_val and str(cnp_val).strip().upper() != 'NA':
                            clean_val = str(cnp_val).split('.')[0].strip()
                            if clean_val.isdigit():
                                cnp = clean_val
                                break

            if not cnp or not cnp.isdigit():
                continue

            # Normaliser: 4-digit -> 5-digit avec zéro prefix
            if len(cnp) == 4:
                cnp = '0' + cnp

            # Filtrer par province = Québec (QC)
            province = None
            for key in record.keys():
                if 'PROVINCE' in key.upper() or 'PROV' in key.upper():
                    province = str(record.get(key, '')).upper()
                    break

            # Si pas de colonne province, on compte quand même (données globales)
            # Pour le Québec, on filtre sur QC, QUEBEC, QUÉBEC ou QU
            if province and not any(p in province for p in ['QC', 'QUEBEC', 'QUÉBEC', 'QU\xc9BEC', 'QU\ufffdBEC', 'QUBEC', 'QU']):
                continue

            cnp_counts[cnp] += 1

        self.stats["cnp_aggregated"] = len(cnp_counts)
        return dict(cnp_counts)

    def inject_market_demand_batch(self, cnp_counts):
        """
        Insère les nœuds MarketDemand par batches UNWIND.
        Chaque Occupation reçoit un nœud MarketDemand avec le nombre d'offres actives.
        """
        # Préparer les données pour le batch
        batch_data = []
        for cnp, count in cnp_counts.items():
            batch_data.append({
                "cnp": cnp,
                "active_postings": count,
                "date": self.current_month,
                "source": "JobBank"
            })

        if not batch_data:
            print("[WARN] No data to insert")
            return

        # Requête Cypher paramétrée avec UNWIND
        query = """
        UNWIND $batch AS row

        // 1. Trouver l'Occupation par code CNP (avec fallback 5->3->2 digit)
        OPTIONAL MATCH (o:Occupation)
        WHERE o.code = 'CNP-' + row.cnp
           OR o.code = 'CNP-' + substring(row.cnp, 0, 3)
           OR o.code = 'CNP-' + substring(row.cnp, 0, 2)

        // Prendre le match le plus spécifique (5-digit > 3-digit > 2-digit)
        WITH row, o
        ORDER BY size(o.code) DESC
        WITH row, collect(o)[0] AS best_match

        // Créer le nœud MarketDemand seulement si on a trouvé une Occupation
        WITH row, best_match
        WHERE best_match IS NOT NULL

        // 2. Créer/Mise à jour du nœud MarketDemand (un par CNP par mois)
        MERGE (m:MarketDemand {
            source: row.source,
            cnp_code: row.cnp,
            date: row.date
        })
        SET m.active_postings = row.active_postings,
            m.updated_at = datetime()

        // 3. Créer la relation HAS_DEMAND vers l'Occupation
        MERGE (best_match)-[r:HAS_DEMAND]->(m)
        SET r.active_postings = row.active_postings,
            r.date = row.date

        RETURN best_match.code AS cnp, row.active_postings AS postings
        """

        # Exécuter par batches
        total_inserted = 0

        with self.driver.session(database="neo4j") as session:
            for i in range(0, len(batch_data), self.batch_size):
                batch = batch_data[i:i + self.batch_size]

                try:
                    result = session.run(query, batch=batch)

                    # Compter les insertions réussies
                    inserted = sum(1 for _ in result)
                    total_inserted += inserted

                    print(f"[INFO] Batch {i // self.batch_size + 1}: {inserted} demand nodes created")

                except Exception as e:
                    print(f"[ERR] Batch insert failed: {e}")
                    continue

        self.stats["demand_nodes_created"] += total_inserted
        self.stats["relationships_created"] += total_inserted

        print(f"[OK] Inserted {total_inserted} MarketDemand nodes with HAS_DEMAND relationships")

    def run(self):
        """Point d'entrée principal."""
        print("=" * 60)
        print("Job Bank Market Demand Ingestor - Trajektia CKG")
        print("=" * 60)
        print(f"[INFO] Neo4j URI: {self.uri}")
        print(f"[INFO] Current month: {self.current_month}")
        print()

        # Phase 1: Fetch et agrégation
        print("[PHASE 1] Fetching Job Bank data...")
        all_cnp_counts = defaultdict(int)

        for records in self.fetch_jobbank_data():
            cnp_counts = self.aggregate_by_cnp(records)
            for cnp, count in cnp_counts.items():
                all_cnp_counts[cnp] += count

        print(f"[OK] Aggregated {len(all_cnp_counts)} unique CNP codes")
        print()

        # Phase 2: Insertion dans Neo4j
        print("[PHASE 2] Inserting MarketDemand nodes into Neo4j...")
        self.inject_market_demand_batch(dict(all_cnp_counts))

        # Résumé
        print()
        print("=" * 60)
        print("INGESTION COMPLETE - STATISTICS")
        print("=" * 60)
        for key, value in self.stats.items():
            print(f"  {key}: {value}")
        print("=" * 60)

        return self.stats


def verify_connection():
    """Vérifie la connexion à Neo4j."""
    try:
        from neo4j import GraphDatabase

        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD")

        if not password:
            return False, "NEO4J_PASSWORD not set in .env"

        driver = GraphDatabase.driver(uri, auth=(user, password))

        with driver.session(database="neo4j") as session:
            result = session.run("RETURN 1 AS test")
            result.single()

        driver.close()
        return True, "Connection OK"

    except Exception as e:
        return False, str(e)


if __name__ == "__main__":
    # Vérifier la connexion Neo4j
    print("Vérification de la connexion Neo4j...")
    connected, msg = verify_connection()

    if not connected:
        print(f"[ERR] Neo4j connection failed: {msg}")
        sys.exit(1)

    print(f"[OK] {msg}")
    print()

    # Exécuter l'ingestion
    ingestor = JobBankMarketDemandIngestor()

    try:
        stats = ingestor.run()

        if stats["demand_nodes_created"] > 0:
            print(f"\n[SUCCESS] {stats['demand_nodes_created']} occupations linked to market demand data")
        else:
            print("\n[WARNING] No data was inserted. Check if Job Bank API is accessible.")

    except KeyboardInterrupt:
        print("\n[INFO] Ingestion interrupted by user")
    except Exception as e:
        print(f"\n[ERR] Ingestion failed: {e}")
        sys.exit(1)
    finally:
        ingestor.close()
