"""
SIPeC 2025 Completion Ingestor - 4 Missing Pillars
===================================================
Ingests the 4 missing SIPeC 2025 categories into Neo4j using UNWIND bulk operations:
  1. Personal Attributes (Attributs personnels)
  2. Work Environment (Milieu de travail / Work Context)
  3. Work Activities (Activites)
  4. Knowledge (Connaissances)

Source: Government of Canada Open Data (CKAN)
Dataset ID: 10ce43bd-fb58-4969-806b-4bffebc87bec

Usage:
    cd c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter
    python backend/scripts/sipec_completion_ingestor.py
"""

import os
import sys
import csv
import io
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

CKAN_API_BASE = "https://open.canada.ca/data/api/3/action"
CKAN_DATASET_ID = "10ce43bd-fb58-4969-806b-4bffebc87bec"
BATCH_SIZE = 500
SOURCE_TAG = "SIPeC 2025 (Government of Canada)"
INGESTED_AT = datetime.now(timezone.utc).isoformat()

# Neo4j
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


class SipecCompletionIngestor:
    """Ingests the 4 missing SIPeC 2025 pillars into Neo4j using UNWIND bulk ops."""

    # Mapping of SIPeC pillar names to Neo4j node labels and relation types
    PILLAR_CONFIG = {
        "personal_attribute": {
            "node_label": "PersonalAttribute",
            "rel_type": "HAS_ATTRIBUTE",
            "id_field": "element_id",
            "label_field": "label_fr",
        },
        "work_context": {
            "node_label": "WorkContext",
            "rel_type": "HAS_CONTEXT",
            "id_field": "element_id",
            "label_field": "label_fr",
        },
        "work_activity": {
            "node_label": "WorkActivity",
            "rel_type": "PERFORMS_ACTIVITY",
            "id_field": "element_id",
            "label_field": "label_fr",
        },
        "knowledge": {
            "node_label": "Knowledge",
            "rel_type": "REQUIRES_KNOWLEDGE",
            "id_field": "element_id",
            "label_field": "label_fr",
        },
    }

    def __init__(self):
        if not NEO4J_PASSWORD:
            raise EnvironmentError("[ERROR] NEO4J_PASSWORD manquant dans .env")
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        print(f"[OK] Connexion Neo4j etablie : {NEO4J_URI}")

    def close(self):
        self.driver.close()
        print("[OK] Connexion Neo4j fermee.")

    # ── Fetch resources from CKAN ─────────────────────────────────────────────

    def fetch_resources(self) -> List[Dict[str, Any]]:
        """Fetch all CSV resources from the SIPeC 2025 CKAN dataset."""
        url = f"{CKAN_API_BASE}/package_show"
        params = {"id": CKAN_DATASET_ID}
        try:
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            if not data.get("success"):
                logger.error("Failed to fetch dataset from CKAN.")
                return []
            resources = data["result"].get("resources", [])
            # Filter for CSV files with French content
            csv_resources = [
                r for r in resources
                if str(r.get("format", "")).upper() == "CSV"
                and ("-fr" in r.get("url", "").lower() or "sipec" in r.get("name", "").lower())
            ]
            print(f"[INFO] {len(csv_resources)} CSV resources trouves sur CKAN.")
            return csv_resources
        except Exception as e:
            logger.error(f"Error fetching CKAN resources: {e}")
            return []

    def download_csv(self, url: str) -> List[Dict[str, str]]:
        """Download and parse a CSV file from URL."""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            content = None
            for encoding in ['utf-8-sig', 'cp1252', 'latin1']:
                try:
                    content = response.content.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue
            if not content:
                content = response.text
            csv_file = io.StringIO(content)
            reader = csv.DictReader(csv_file)
            if reader.fieldnames:
                reader.fieldnames = [str(f).strip() for f in reader.fieldnames]
            return list(reader)
        except Exception as e:
            logger.error(f"Error downloading CSV {url}: {e}")
            return []

    # ── Create constraints ────────────────────────────────────────────────────

    def create_constraints(self):
        """Create Neo4j constraints for all pillar node types."""
        constraints = [
            "CREATE CONSTRAINT IF NOT EXISTS FOR (n:PersonalAttribute) REQUIRE n.id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (n:WorkContext) REQUIRE n.id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (n:WorkActivity) REQUIRE n.id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Knowledge) REQUIRE n.id IS UNIQUE",
        ]
        with self.driver.session(database="neo4j") as session:
            for constraint in constraints:
                session.run(constraint)
        print("[OK] Contraintes Neo4j creees.")

    # ── Bulk ingest a single pillar ───────────────────────────────────────────

    def ingest_pillar(self, pillar_name: str, data: List[Dict[str, Any]]):
        """
        Ingest a single pillar's data using UNWIND bulk operation.
        
        Expected data format:
        [
            {"noc_code": "11-1011", "element_id": "PA001", "label_fr": "Souci du detail", "importance": 4.0},
            ...
        ]
        """
        config = self.PILLAR_CONFIG.get(pillar_name)
        if not config:
            print(f"[WARN] Configuration inconnue pour le pilier '{pillar_name}'.")
            return 0

        node_label = config["node_label"]
        rel_type = config["rel_type"]
        id_field = config["id_field"]
        label_field = config["label_field"]

        if not data:
            print(f"[INFO] Aucune donnee pour le pilier '{pillar_name}'.")
            return 0

        print(f"[INFO] Ingestion de {len(data):,} enregistrements pour '{pillar_name}'...")

        query = f"""
        UNWIND $batch AS row
        MATCH (o:Occupation {{code: row.noc_code}})
        MERGE (n:{node_label} {{id: row.{id_field}}})
          ON CREATE SET n.{label_field} = row.{label_field},
                        n.taxonomy = $source_tag,
                        n.ingested_at = $ingested_at
          ON MATCH SET n.{label_field} = row.{label_field}
        MERGE (o)-[r:{rel_type}]->(n)
          SET r.importance = toFloat(row.importance),
              r.source = $source_tag,
              r.ingested_at = $ingested_at
        """

        total_ingested = 0
        with self.driver.session(database="neo4j") as session:
            for i in range(0, len(data), BATCH_SIZE):
                batch = data[i:i + BATCH_SIZE]
                result = session.run(
                    query,
                    batch=batch,
                    source_tag=SOURCE_TAG,
                    ingested_at=INGESTED_AT,
                )
                total_ingested += len(batch)
                pct = (total_ingested / len(data)) * 100
                print(f"   [PROGRESS] {total_ingested:,}/{len(data):,} ({pct:.0f}%)", end="\r")

        print(f"\n   [OK] {pillar_name}: {total_ingested:,} relations creees/mises a jour.")
        return total_ingested

    # ── Main execution ────────────────────────────────────────────────────────

    def run(self):
        """Main ingestion loop."""
        print("=" * 55)
        print("  SIPeC 2025 Completion Ingestor - 4 Piliers")
        print(f"  Source  : CKAN (open.canada.ca)")
        print(f"  Date    : {INGESTED_AT}")
        print("=" * 55)

        # 1. Create constraints
        self.create_constraints()

        # 2. Fetch resources
        resources = self.fetch_resources()
        if not resources:
            print("[WARN] Aucune ressource CKAN disponible.")
            return

        # 3. Print available resources for debugging
        print("\n[INFO] Ressources disponibles:")
        for res in resources:
            print(f"  - {res.get('name', 'N/A')} ({res.get('format', 'N/A')})")

        # 4. Try to find and ingest each pillar
        # The CKAN dataset typically has files named like:
        # - "sipec-personal-attributes-fr.csv"
        # - "sipec-work-context-fr.csv"
        # - "sipec-work-activities-fr.csv"
        # - "sipec-knowledge-fr.csv"

        pillar_keywords = {
            "personal_attribute": ["personal", "attribute", "attribut", "personnel"],
            "work_context": ["context", "contexte", "environment", "milieu"],
            "work_activity": ["activity", "activite", "work", "travail"],
            "knowledge": ["knowledge", "connaissance", "savoir"],
        }

        grand_total = 0
        for pillar_name, keywords in pillar_keywords.items():
            # Find matching resource
            matching_res = None
            for res in resources:
                name_lower = res.get("name", "").lower()
                url_lower = res.get("url", "").lower()
                if any(kw in name_lower or kw in url_lower for kw in keywords):
                    matching_res = res
                    break

            if not matching_res:
                print(f"[WARN] Aucune ressource trouvee pour '{pillar_name}'.")
                continue

            # Download and parse
            print(f"\n[INFO] Telechargement de '{matching_res.get('name', 'N/A')}'...")
            data = self.download_csv(matching_res["url"])
            if not data:
                print(f"[WARN] Aucune donnee parsee pour '{pillar_name}'.")
                continue

            # Normalize data for ingestion
            # Expected columns: noc_code, element_id, label_fr, importance
            normalized = self._normalize_data(pillar_name, data)
            if normalized:
                count = self.ingest_pillar(pillar_name, normalized)
                grand_total += count

        print(f"\n[DONE] SIPeC 2025 Completion terminee. Total: {grand_total:,} relations.")
        self._verify()

    def _normalize_data(self, pillar_name: str, raw_data: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Normalize raw CSV data into the expected format for ingestion.
        Handles various column name variations from CKAN.
        """
        normalized = []
        if not raw_data:
            return []

        # Get column mappings from first row
        first_row = raw_data[0]
        columns = list(first_row.keys())

        # Find NOC code column
        noc_col = None
        for col in columns:
            if any(kw in col.lower() for kw in ["noc", "cnp", "code"]):
                noc_col = col
                break

        # Find element ID column
        id_col = None
        for col in columns:
            if any(kw in col.lower() for kw in ["id", "element", "element_id"]):
                id_col = col
                break

        # Find label/description column
        label_col = None
        for col in columns:
            if any(kw in col.lower() for kw in ["label", "titre", "nom", "description", "fr"]):
                label_col = col
                break

        # Find importance/score column
        importance_col = None
        for col in columns:
            if any(kw in col.lower() for kw in ["importance", "score", "valeur", "level"]):
                importance_col = col
                break

        if not noc_col or not label_col:
            print(f"   [WARN] Colonnes non reconnues pour '{pillar_name}'.")
            print(f"   Colonnes disponibles: {columns}")
            return []

        for row in raw_data:
            noc_code = str(row.get(noc_col, "")).strip()
            if not noc_code:
                continue

            element_id = str(row.get(id_col, f"{pillar_name}_{len(normalized)}")).strip()
            label_fr = str(row.get(label_col, "")).strip()
            importance = row.get(importance_col, "0") if importance_col else "0"

            try:
                importance_val = float(importance)
            except (ValueError, TypeError):
                importance_val = 0.0

            normalized.append({
                "noc_code": noc_code,
                "element_id": element_id,
                "label_fr": label_fr,
                "importance": importance_val,
            })

        return normalized

    # ── Verification ──────────────────────────────────────────────────────────

    def _verify(self):
        """Display summary of SIPeC pillar relations in the graph."""
        print("\n" + "-" * 50)
        print("[INFO] Verification des piliers SIPeC dans Neo4j:")
        with self.driver.session(database="neo4j") as session:
            for pillar_name, config in self.PILLAR_CONFIG.items():
                rel_type = config["rel_type"]
                node_label = config["node_label"]
                # Count relations
                result = session.run(
                    f"MATCH ()-[r:{rel_type}]->() RETURN count(r) AS cnt"
                )
                rel_cnt = result.single()["cnt"]
                # Count nodes
                result2 = session.run(
                    f"MATCH (n:{node_label}) RETURN count(n) AS cnt"
                )
                node_cnt = result2.single()["cnt"]
                print(f"   [{pillar_name:20s}] => {rel_cnt:,} relations, {node_cnt:,} noeuds")
        print("-" * 50)


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    ingestor = SipecCompletionIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
