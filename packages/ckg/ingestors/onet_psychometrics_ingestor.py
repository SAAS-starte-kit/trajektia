"""
O*NET Psychometrics Ingestor — Phase 9
=======================================
Ingère les 4 dimensions psychométriques O*NET 28.2 dans Neo4j :
  - Interests      → (:InterestProfile)   via [:HAS_INTEREST]
  - Abilities      → (:Ability)           via [:REQUIRES_ABILITY]
  - Work Values    → (:WorkValue)         via [:ALIGNED_WITH_VALUE]
  - Work Styles    → (:WorkStyle)         via [:EXHIBITS_STYLE]

Lit directement depuis le ZIP sans extraction.
Pont SOC-NOC : propriété `onet_soc_code` sur les nœuds (:Occupation).
Conformité Loi 25 : source + ingested_at sur chaque relation.

Usage :
    cd c:/Users/Patrice.DESKTOP-I932PON/Dev/saas-ai-starter
    python backend/scripts/onet_psychometrics_ingestor.py
"""

import io
import os
import zipfile
from datetime import datetime, timezone

import pandas as pd
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..", "..")
ZIP_PATH = os.path.join(PROJECT_ROOT, "data", "raw", "onet", "onet_db_28_2.zip")
BATCH_SIZE = 500
SOURCE_TAG = "O*NET 28.2"
INGESTED_AT = datetime.now(timezone.utc).isoformat()

# Fichiers dans le ZIP et leurs métadonnées
DIMENSIONS = {
    "Interests.txt": {
        "node_label": "InterestProfile",
        "node_id_field": "Element Name",          # ex: "Realistic", "Investigative"
        "rel_type": "HAS_INTEREST",
        "scale_filter": "OI",                     # "Occupational Interest" score
        "score_field": "Data Value",
    },
    "Abilities.txt": {
        "node_label": "Ability",
        "node_id_field": "Element Name",           # ex: "Oral Comprehension"
        "rel_type": "REQUIRES_ABILITY",
        "scale_filter": "IM",                      # Importance score
        "score_field": "Data Value",
    },
    "Work Values.txt": {
        "node_label": "WorkValue",
        "node_id_field": "Element Name",           # ex: "Achievement", "Independence"
        "rel_type": "ALIGNED_WITH_VALUE",
        "scale_filter": "EX",                      # Extent score
        "score_field": "Data Value",
    },
    "Work Styles.txt": {
        "node_label": "WorkStyle",
        "node_id_field": "Element Name",           # ex: "Achievement/Effort", "Leadership"
        "rel_type": "EXHIBITS_STYLE",
        "scale_filter": "IM",                      # Importance score
        "score_field": "Data Value",
    },
}

# ─── Requêtes Cypher ──────────────────────────────────────────────────────────

def build_cypher(node_label: str, rel_type: str) -> str:
    """Génère la requête Cypher pour une dimension psychométrique."""
    return f"""
    UNWIND $batch AS row
    MATCH (o:Occupation {{onet_soc_code: row.soc_code}})
    MERGE (n:{node_label} {{name: row.element_name}})
      ON CREATE SET n.taxonomy = $source_tag
    MERGE (o)-[r:{rel_type}]->(n)
      SET r.score       = row.score,
          r.source      = $source_tag,
          r.ingested_at = $ingested_at
    """


# ─── Ingesteur Principal ──────────────────────────────────────────────────────

class OnetPsychometricsIngestor:
    def __init__(self):
        uri      = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user     = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD")
        if not password:
            raise EnvironmentError("[ERROR] NEO4J_PASSWORD manquant dans .env")
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        print(f"[OK] Connexion Neo4j etablie : {uri}")

    def close(self):
        self.driver.close()

    # ── Lecture ZIP ──────────────────────────────────────────────────────────

    def _read_from_zip(self, filename: str) -> pd.DataFrame:
        """Lit un fichier TSV directement depuis le ZIP."""
        with zipfile.ZipFile(ZIP_PATH, "r") as z:
            # Le fichier peut être à la racine ou dans un sous-dossier
            matches = [n for n in z.namelist() if n.endswith(filename)]
            if not matches:
                raise FileNotFoundError(f"[ERROR] '{filename}' introuvable dans {ZIP_PATH}")
            with z.open(matches[0]) as f:
                return pd.read_csv(io.TextIOWrapper(f, encoding="utf-8"), sep="\t")

    # ── Traitement d'une dimension ────────────────────────────────────────────

    def _ingest_dimension(self, filename: str, config: dict) -> int:
        """Ingère une dimension psychométrique complète."""
        print(f"\n[INFO] Lecture de '{filename}'...")
        df = self._read_from_zip(filename)

        print(f"   Colonnes : {list(df.columns)}")
        print(f"   Total lignes brutes : {len(df):,}")

        # Filtrer sur le Scale ID pertinent (ex: 'IM' pour Importance)
        scale = config.get("scale_filter")
        if scale and "Scale ID" in df.columns:
            df = df[df["Scale ID"] == scale].copy()
            print(f"   Après filtre Scale='{scale}' : {len(df):,} lignes")

        # Supprimer les lignes recommandées à masquer
        if "Recommend Suppress" in df.columns:
            df = df[df["Recommend Suppress"] != "Y"].copy()

        # Renommer pour un accès uniforme
        df = df.rename(columns={
            "O*NET-SOC Code": "soc_code",
            config["node_id_field"]: "element_name",
            config["score_field"]: "score",
        })

        # Nettoyer : supprimer les lignes sans code SOC ou sans nom d'élément
        df = df.dropna(subset=["soc_code", "element_name", "score"])
        df["score"] = pd.to_numeric(df["score"], errors="coerce")
        df = df.dropna(subset=["score"])

        print(f"   Lignes valides à ingérer : {len(df):,}")

        # Construire la requête Cypher
        query = build_cypher(config["node_label"], config["rel_type"])
        total_ingested = 0

        with self.driver.session(database="neo4j") as session:
            for i in range(0, len(df), BATCH_SIZE):
                batch_df = df.iloc[i : i + BATCH_SIZE]
                batch = batch_df[["soc_code", "element_name", "score"]].to_dict("records")

                session.run(
                    query,
                    batch=batch,
                    source_tag=SOURCE_TAG,
                    ingested_at=INGESTED_AT,
                )
                total_ingested += len(batch)
                pct = (total_ingested / len(df)) * 100
                print(f"   [PROGRESS] {total_ingested:,}/{len(df):,} relations ({pct:.0f}%)", end="\r")

        print(f"\n   [OK] {config['rel_type']} : {total_ingested:,} relations creees/mises a jour.")
        return total_ingested

    # ── Vérification post-ingestion ────────────────────────────────────────────

    def _verify(self):
        """Affiche un résumé des relations psychométriques dans le graphe."""
        print("\n" + "-" * 50)
        print("[INFO] Verification dans Neo4j :")
        rel_types = [cfg["rel_type"] for cfg in DIMENSIONS.values()]
        query = """
        UNWIND $rel_types AS rel_type
        CALL {
            WITH rel_type
            CALL apoc.cypher.run(
                'MATCH ()-[r:`' + rel_type + '`]->() RETURN count(r) as cnt',
                {}
            ) YIELD value
            RETURN rel_type, value.cnt AS count
        }
        RETURN rel_type, count
        ORDER BY count DESC
        """
        # Fallback sans APOC : requêtes individuelles
        with self.driver.session(database="neo4j") as session:
            for rel_type in rel_types:
                result = session.run(
                    f"MATCH ()-[r:{rel_type}]->() RETURN count(r) AS cnt"
                )
                cnt = result.single()["cnt"]
                print(f"   [{rel_type:25s}] → {cnt:,} relations")
        print("-" * 50)

    # ── Point d'entrée ────────────────────────────────────────────────────────

    def run(self):
        """Ingère les 4 dimensions psychométriques en séquence."""
        print("=" * 55)
        print("  O*NET Psychometrics Ingestor — Phase 9")
        print(f"  Source  : {ZIP_PATH}")
        print(f"  Date    : {INGESTED_AT}")
        print("=" * 55)

        if not os.path.exists(ZIP_PATH):
            raise FileNotFoundError(f"[ERROR] ZIP introuvable : {ZIP_PATH}")

        grand_total = 0
        for filename, config in DIMENSIONS.items():
            grand_total += self._ingest_dimension(filename, config)

        print(f"\n[DONE] Phase 9 terminee. Total relations psychometriques : {grand_total:,}")
        self._verify()


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    ingestor = OnetPsychometricsIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
        print("\n[DONE] Connexion Neo4j fermee.")
