"""
Le Siphon — ETL Neo4j → PostgreSQL (Supabase)
==============================================
Extrait toute l'intelligence du graphe Neo4j local et la charge
dans le nouveau schéma PostgreSQL Trajektia sur Supabase.

Architecture :
    Neo4j local (source)
        → Occupations         → TABLE occupations
        → RIASEC/InterestProf → TABLE riasec_profiles
        → Abilities/Styles/   → TABLE competencies
          WorkValues/Skill       TABLE occupation_competencies
        → Tasks               → TABLE tasks + occupation_tasks
        → Tools               → TABLE tools + occupation_tools

Usage :
    cd trajektia/
    pip install -r requirements.txt
    python etl/le_siphon.py

Variables d'environnement requises (.env) :
    NEO4J_URI           bolt://localhost:7687
    NEO4J_USER          neo4j
    NEO4J_PASSWORD      ...
    SUPABASE_DB_URL     postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
"""

import os
import sys
import logging
from datetime import datetime, timezone
from typing import Optional

import psycopg2
import psycopg2.extras
from neo4j import GraphDatabase
from dotenv import load_dotenv
from tqdm import tqdm

# ── Configuration ──────────────────────────────────────────────────────────────

# Résoudre le chemin du .env depuis la racine du projet (trajektia/)
_HERE    = os.path.dirname(os.path.abspath(__file__))
_ROOT    = os.path.dirname(_HERE)   # trajektia/
_DOTENV  = os.path.join(_ROOT, ".env")
load_dotenv(_DOTENV, override=True)  # override=True → priorité au .env sur les vars shell

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("le_siphon")

NEO4J_URI      = os.getenv("NEO4J_URI",  "bolt://localhost:7687")
NEO4J_USER     = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

SOURCE_TAG   = "O*NET 28.2"
INGESTED_AT  = datetime.now(timezone.utc).isoformat()
BATCH_SIZE   = 200

if not NEO4J_PASSWORD:
    log.error("NEO4J_PASSWORD manquant dans le .env")
    sys.exit(1)
if not SUPABASE_DB_URL:
    log.error("SUPABASE_DB_URL manquant dans le .env — format: postgresql://postgres:[pwd]@db.[ref].supabase.co:5432/postgres")
    sys.exit(1)


# ── Connexions ─────────────────────────────────────────────────────────────────

class LeSiphon:
    def __init__(self):
        log.info("Connexion Neo4j → %s", NEO4J_URI)
        self.neo4j = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        log.info("Connexion PostgreSQL (Supabase)...")
        self.pg = psycopg2.connect(SUPABASE_DB_URL)
        self.pg.autocommit = False
        psycopg2.extras.register_uuid()
        log.info("Connexions établies.")

    def close(self):
        self.neo4j.close()
        self.pg.close()

    def _neo4j_fetch(self, query: str, params: dict = None):
        with self.neo4j.session(database="neo4j") as session:
            return list(session.run(query, params or {}))

    # ── Utilitaires PG ────────────────────────────────────────────────────────

    def _pg_execute_batch(self, sql: str, rows: list, cur):
        """Execute batch upsert using execute_values for performance."""
        if not rows:
            return
        psycopg2.extras.execute_values(cur, sql, rows, page_size=BATCH_SIZE)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 1 — OCCUPATIONS
    # ══════════════════════════════════════════════════════════════════════════

    def extract_occupations(self):
        log.info("Extraction des Occupations depuis Neo4j (avec décompte Job Bank)...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)
            OPTIONAL MATCH (j:JobPosting)-[:BELONGS_TO]->(o)
            WITH o, count(j) AS active_postings
            RETURN
                o.code          AS cnp_code,
                o.onet_soc_code AS onet_soc_code,
                o.esco_uri      AS esco_uri,
                o.title_fr      AS title_fr,
                o.title_en      AS title_en,
                o.description_fr AS description_fr,
                o.description_en AS description_en,
                o.median_salary  AS median_salary,
                o.salary_source  AS salary_source,
                o.taxonomy       AS taxonomy,
                active_postings  AS active_postings
            ORDER BY o.code
        """)
        log.info("  %d occupations extraites.", len(records))
        return records

    def load_occupations(self, records):
        log.info("Chargement des occupations dans PostgreSQL...")
        # S'assurer que la colonne active_postings existe
        with self.pg.cursor() as cur:
            cur.execute("ALTER TABLE occupations ADD COLUMN IF NOT EXISTS active_postings INTEGER DEFAULT 0;")
        self.pg.commit()

        sql = """
            INSERT INTO occupations (
                cnp_code, onet_soc_code, esco_uri,
                title_fr, title_en, description_fr, description_en,
                median_salary, salary_source, taxonomy, active_postings,
                created_at, updated_at
            ) VALUES %s
            ON CONFLICT (cnp_code) DO UPDATE SET
                onet_soc_code   = EXCLUDED.onet_soc_code,
                esco_uri        = EXCLUDED.esco_uri,
                title_fr        = EXCLUDED.title_fr,
                title_en        = EXCLUDED.title_en,
                description_fr  = EXCLUDED.description_fr,
                description_en  = EXCLUDED.description_en,
                median_salary   = EXCLUDED.median_salary,
                salary_source   = EXCLUDED.salary_source,
                taxonomy        = EXCLUDED.taxonomy,
                active_postings = EXCLUDED.active_postings,
                updated_at      = NOW()
        """
        deduped = {}
        for r in records:
            cnp_raw = str(r["cnp_code"]).strip() if r["cnp_code"] else None
            if not cnp_raw:
                continue
            # Normaliser le code CNP (enlever d'éventuels suffixes .0 ou préfixes CNP-)
            cnp = cnp_raw.split(".")[0].replace("CNP-", "").strip()
            if not cnp:
                continue

            active_p = int(r.get("active_postings") or 0)
            if cnp in deduped:
                existing = deduped[cnp]
                # Fusionner intelligemment
                title_fr = r.get("title_fr") or existing[3]
                title_en = r.get("title_en") or existing[4]
                desc_fr = r.get("description_fr") or existing[5]
                desc_en = r.get("description_en") or existing[6]
                salary = float(r["median_salary"]) if r.get("median_salary") else existing[7]
                source = r.get("salary_source") or existing[8]
                tax = r.get("taxonomy") or existing[9]
                total_postings = max(active_p, existing[10])
                deduped[cnp] = (
                    cnp,
                    r.get("onet_soc_code") or existing[1],
                    r.get("esco_uri") or existing[2],
                    title_fr, title_en, desc_fr, desc_en,
                    salary, source, tax, total_postings,
                    INGESTED_AT, INGESTED_AT
                )
            else:
                deduped[cnp] = (
                    cnp,
                    r.get("onet_soc_code"),
                    r.get("esco_uri"),
                    r.get("title_fr"),
                    r.get("title_en"),
                    r.get("description_fr"),
                    r.get("description_en"),
                    float(r["median_salary"]) if r.get("median_salary") else None,
                    r.get("salary_source", "ESDC 2025 Official"),
                    r.get("taxonomy") or "SIPeC 2025",
                    active_p,
                    INGESTED_AT,
                    INGESTED_AT,
                )

        rows = list(deduped.values())
        with self.pg.cursor() as cur:
            self._pg_execute_batch(sql, rows, cur)
        self.pg.commit()
        log.info("  ✅ %d occupations chargées (après déduplication).", len(rows))
        return len(rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 2 — RIASEC PROFILES
    # ══════════════════════════════════════════════════════════════════════════

    def extract_riasec(self):
        """
        Construit les profils RIASEC depuis deux sources :
        1. HAS_INTEREST → InterestProfile (scores O*NET quantitatifs — Phase 9)
        2. MATCHES_INTEREST → Interest (codes RIASEC catégoriels — SIPeC)
        Priorité à la source O*NET (scores quantitatifs).
        """
        log.info("Extraction des profils RIASEC...")

        # Source O*NET (InterestProfile — scores précis)
        onet_riasec = self._neo4j_fetch("""
            MATCH (o:Occupation)-[r:HAS_INTEREST]->(ip:InterestProfile)
            RETURN
                o.code     AS cnp_code,
                ip.name    AS element_name,
                r.score    AS score
            ORDER BY o.code
        """)

        # Agréger par occupation : construire dict {cnp_code: {R:x, I:x, ...}}
        profiles = {}
        riasec_map = {
            "Realistic": "r", "Investigative": "i", "Artistic": "a",
            "Social": "s", "Enterprising": "e", "Conventional": "c",
        }
        for record in onet_riasec:
            cnp = str(record["cnp_code"]).strip()
            letter = riasec_map.get(record.get("element_name", ""))
            if not letter:
                continue
            if cnp not in profiles:
                profiles[cnp] = {"r": None, "i": None, "a": None, "s": None, "e": None, "c": None}
            try:
                profiles[cnp][letter] = float(record["score"])
            except (TypeError, ValueError):
                pass

        # Fallback : occupations avec MATCHES_INTEREST seulement (catégoriel)
        cat_riasec = self._neo4j_fetch("""
            MATCH (o:Occupation)-[:MATCHES_INTEREST]->(i:Interest)
            WHERE NOT (o)-[:HAS_INTEREST]->()
            RETURN o.code AS cnp_code, collect(i.name) AS interests
        """)
        for record in cat_riasec:
            cnp = str(record["cnp_code"]).strip()
            if cnp not in profiles:
                profiles[cnp] = {"r": None, "i": None, "a": None, "s": None, "e": None, "c": None}
            # Assign a nominal score (3.5 = "somewhat important") for categorical only
            for name in record.get("interests", []):
                letter = riasec_map.get(name, "")
                if letter and profiles[cnp][letter] is None:
                    profiles[cnp][letter] = 3.5   # nominal — marks as present

        log.info("  %d profils RIASEC construits.", len(profiles))
        return profiles

    def _compute_dominant(self, scores: dict) -> tuple[Optional[str], Optional[str]]:
        """Compute dominant RIASEC code (3 letters) and dominant letter."""
        pairs = [(k.upper(), v) for k, v in scores.items() if v is not None]
        pairs.sort(key=lambda x: x[1], reverse=True)
        if not pairs:
            return None, None
        dominant_code   = "".join([p[0] for p in pairs[:3]]) if len(pairs) >= 3 else None
        dominant_letter = pairs[0][0] if pairs else None
        return dominant_code, dominant_letter

    def load_riasec(self, profiles: dict):
        log.info("Chargement des profils RIASEC dans PostgreSQL...")
        sql = """
            INSERT INTO riasec_profiles (
                occupation_cnp_code,
                r_score, i_score, a_score, s_score, e_score, c_score,
                dominant_code, dominant_letter, source, ingested_at
            ) VALUES %s
            ON CONFLICT (occupation_cnp_code) DO UPDATE SET
                r_score         = EXCLUDED.r_score,
                i_score         = EXCLUDED.i_score,
                a_score         = EXCLUDED.a_score,
                s_score         = EXCLUDED.s_score,
                e_score         = EXCLUDED.e_score,
                c_score         = EXCLUDED.c_score,
                dominant_code   = EXCLUDED.dominant_code,
                dominant_letter = EXCLUDED.dominant_letter,
                ingested_at     = EXCLUDED.ingested_at
        """
        rows = []
        # Verify CNP codes exist in occupations table first
        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        for cnp, scores in profiles.items():
            if cnp not in valid_cnps:
                continue
            dominant_code, dominant_letter = self._compute_dominant(scores)
            rows.append((
                cnp,
                scores.get("r"), scores.get("i"), scores.get("a"),
                scores.get("s"), scores.get("e"), scores.get("c"),
                dominant_code, dominant_letter,
                SOURCE_TAG, INGESTED_AT,
            ))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(sql, rows, cur)
        self.pg.commit()

        # Also update denormalized fields on occupations
        with self.pg.cursor() as cur:
            cur.execute("""
                UPDATE occupations o
                SET
                    riasec_dominant = rp.dominant_code,
                    riasec_scores   = jsonb_build_object(
                        'R', rp.r_score, 'I', rp.i_score, 'A', rp.a_score,
                        'S', rp.s_score, 'E', rp.e_score, 'C', rp.c_score
                    )
                FROM riasec_profiles rp
                WHERE rp.occupation_cnp_code = o.cnp_code
            """)
        self.pg.commit()
        log.info("  ✅ %d profils RIASEC chargés + occupations mises à jour.", len(rows))
        return len(rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 3 — COMPÉTENCES O*NET (Abilities, WorkStyles, WorkValues, Skills)
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_competencies(self):
        """
        Extrait toutes les compétences O*NET depuis le graphe et les charge
        dans competencies + occupation_competencies.
        """
        dimensions = [
            {
                "rel":       "REQUIRES_ABILITY",
                "node":      "Ability",
                "category":  "ability",
                "scale_id":  "IM",
                "scale_lbl": "Importance",
            },
            {
                "rel":       "EXHIBITS_STYLE|REQUIRES_STYLE",
                "node":      "WorkStyle",
                "category":  "work_style",
                "scale_id":  "IM",
                "scale_lbl": "Importance",
            },
            {
                "rel":       "ALIGNED_WITH_VALUE",
                "node":      "WorkValue",
                "category":  "work_value",
                "scale_id":  "EX",
                "scale_lbl": "Extent",
            },
            {
                "rel":       "REQUIRES_SKILL",
                "node":      "Skill",
                "category":  "skill",
                "scale_id":  "IM",
                "scale_lbl": "Importance",
            },
            {
                "rel":       "HAS_INTEREST",
                "node":      "InterestProfile",
                "category":  "interest",
                "scale_id":  "OI",
                "scale_lbl": "Occupational Interest",
            },
        ]

        competency_cache = {}  # name+category → UUID (avoid duplicate inserts)
        total_junctions = 0

        for dim in dimensions:
            log.info("  Dimension [%s] → [%s]...", dim["rel"], dim["category"])

            records = self._neo4j_fetch(f"""
                MATCH (o:Occupation)-[r:{dim['rel']}]->(n:{dim['node']})
                RETURN
                    o.code  AS cnp_code,
                    n.name  AS name,
                    r.score AS score
                ORDER BY o.code
            """)

            if not records:
                log.info("    Aucune donnée pour %s.", dim["rel"])
                continue

            log.info("    %d relations trouvées.", len(records))

            # ── Insert competencies (upsert by name + category) ───────────
            unique_names = {str(r["name"]).strip() for r in records if r.get("name")}
            comp_sql = """
                INSERT INTO competencies (id, name_en, category, source, created_at)
                VALUES %s
                ON CONFLICT (name_en, category) DO NOTHING
            """
            import uuid as _uuid
            new_rows = []
            for name in unique_names:
                key = (name, dim["category"])
                if key not in competency_cache:
                    new_id = _uuid.uuid4()
                    competency_cache[key] = new_id
                    new_rows.append((str(new_id), name, dim["category"], SOURCE_TAG, INGESTED_AT))

            with self.pg.cursor() as cur:
                self._pg_execute_batch(comp_sql, new_rows, cur)
            self.pg.commit()

            # Fetch all IDs from DB (including those already there)
            with self.pg.cursor() as cur:
                cur.execute(
                    "SELECT id, name_en FROM competencies WHERE category = %s",
                    (dim["category"],)
                )
                for row in cur.fetchall():
                    key = (row[1], dim["category"])
                    competency_cache[key] = row[0]

            # ── Insert junction rows ──────────────────────────────────────
            with self.pg.cursor() as cur:
                cur.execute("SELECT cnp_code FROM occupations")
                valid_cnps = {row[0] for row in cur.fetchall()}

            junc_sql = """
                INSERT INTO occupation_competencies (
                    occupation_cnp_code, competency_id,
                    score, scale_id, scale_label,
                    source, ingested_at
                ) VALUES %s
                ON CONFLICT (occupation_cnp_code, competency_id, scale_id) DO UPDATE SET
                    score       = EXCLUDED.score,
                    ingested_at = EXCLUDED.ingested_at
            """
            junc_dict = {}
            skipped = 0
            for r in records:
                cnp  = str(r["cnp_code"]).strip() if r.get("cnp_code") else None
                name = str(r["name"]).strip()     if r.get("name")    else None
                if not cnp or not name or cnp not in valid_cnps:
                    skipped += 1
                    continue
                key = (name, dim["category"])
                comp_id = competency_cache.get(key)
                if not comp_id:
                    skipped += 1
                    continue
                try:
                    score = float(r["score"]) if r.get("score") is not None else None
                except (TypeError, ValueError):
                    score = None

                j_key = (cnp, str(comp_id), dim["scale_id"])
                if j_key in junc_dict and score is not None:
                    prev_score = junc_dict[j_key][2]
                    if prev_score is not None:
                        score = max(score, prev_score)

                junc_dict[j_key] = (
                    cnp, str(comp_id),
                    score, dim["scale_id"], dim["scale_lbl"],
                    SOURCE_TAG, INGESTED_AT,
                )

            junc_rows = list(junc_dict.values())
            with self.pg.cursor() as cur:
                self._pg_execute_batch(junc_sql, junc_rows, cur)
            self.pg.commit()
            total_junctions += len(junc_rows)
            log.info(
                "    ✅ %d compétences • %d jonctions insérées (%d ignorées/dédupliquées).",
                len(unique_names), len(junc_rows), skipped
            )

        log.info("Compétences — Total jonctions : %d", total_junctions)
        return total_junctions

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 4 — TASKS
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_tasks(self):
        log.info("Extraction et chargement des Tasks...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)-[:PERFORMS_TASK]->(t:Task)
            RETURN
                o.code          AS cnp_code,
                t.description   AS description_en,
                t.id            AS onet_task_id
            ORDER BY o.code
        """)
        log.info("  %d relations PERFORMS_TASK trouvées.", len(records))

        task_cache = {}  # description → UUID
        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        import uuid as _uuid

        # Upsert tasks
        unique_tasks = {}
        for r in records:
            desc = r.get("description_en", "").strip()
            if desc and desc not in unique_tasks:
                unique_tasks[desc] = r.get("onet_task_id")

        task_sql = """
            INSERT INTO tasks (id, description_en, onet_task_id, taxonomy, created_at)
            VALUES %s
            ON CONFLICT (onet_task_id) DO UPDATE SET description_en = EXCLUDED.description_en
        """
        task_rows = []
        for desc, task_id in unique_tasks.items():
            new_id = _uuid.uuid4()
            task_cache[desc] = new_id
            task_rows.append((str(new_id), desc, task_id, SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(task_sql, task_rows, cur)
        self.pg.commit()

        # Refresh cache from DB
        with self.pg.cursor() as cur:
            cur.execute("SELECT id, description_en FROM tasks")
            for row in cur.fetchall():
                task_cache[row[1]] = row[0]

        # Junction
        junc_sql = """
            INSERT INTO occupation_tasks (occupation_cnp_code, task_id, source, ingested_at)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, task_id) DO NOTHING
        """
        junc_rows = []
        for r in records:
            cnp  = str(r["cnp_code"]).strip() if r.get("cnp_code") else None
            desc = r.get("description_en", "").strip()
            if cnp not in valid_cnps or desc not in task_cache:
                continue
            junc_rows.append((cnp, str(task_cache[desc]), SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(junc_sql, junc_rows, cur)
        self.pg.commit()
        log.info("  ✅ %d tasks • %d jonctions.", len(unique_tasks), len(junc_rows))
        return len(junc_rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 5 — TOOLS
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_tools(self):
        log.info("Extraction et chargement des Tools...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)-[:USES_TOOL]->(t:Tool)
            RETURN o.code AS cnp_code, t.name AS name
            ORDER BY o.code
        """)
        log.info("  %d relations USES_TOOL trouvées.", len(records))

        import uuid as _uuid
        tool_cache = {}
        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        unique_tools = {r.get("name", "").strip() for r in records if r.get("name")}
        tool_sql = """
            INSERT INTO tools (id, name, taxonomy, created_at)
            VALUES %s
            ON CONFLICT (name) DO NOTHING
        """
        tool_rows = []
        for name in unique_tools:
            new_id = _uuid.uuid4()
            tool_cache[name] = new_id
            tool_rows.append((str(new_id), name, SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(tool_sql, tool_rows, cur)
        self.pg.commit()

        with self.pg.cursor() as cur:
            cur.execute("SELECT id, name FROM tools")
            for row in cur.fetchall():
                tool_cache[row[1]] = row[0]

        junc_sql = """
            INSERT INTO occupation_tools (occupation_cnp_code, tool_id, source, ingested_at)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, tool_id) DO NOTHING
        """
        junc_rows = []
        for r in records:
            cnp  = str(r["cnp_code"]).strip() if r.get("cnp_code") else None
            name = r.get("name", "").strip()
            if cnp not in valid_cnps or name not in tool_cache:
                continue
            junc_rows.append((cnp, str(tool_cache[name]), SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(junc_sql, junc_rows, cur)
        self.pg.commit()
        log.info("  ✅ %d outils • %d jonctions.", len(unique_tools), len(junc_rows))
        return len(junc_rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 6 — KNOWLEDGE
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_knowledge(self):
        log.info("Extraction et chargement des Connaissances (Knowledge)...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)-[r:REQUIRES_KNOWLEDGE]->(k:Knowledge)
            RETURN
                o.code          AS cnp_code,
                k.name_en       AS name_en,
                k.element_id    AS onet_element_id,
                r.importance    AS importance_score
            ORDER BY o.code
        """)
        log.info("  %d relations REQUIRES_KNOWLEDGE trouvées.", len(records))

        cache = {}
        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        import uuid as _uuid

        unique_items = {}
        for r in records:
            id_str = str(r.get("onet_element_id") or "").strip()
            if id_str and id_str not in unique_items:
                unique_items[id_str] = str(r.get("name_en") or "").strip()

        insert_sql = """
            INSERT INTO knowledge (id, onet_element_id, name_en, taxonomy, created_at)
            VALUES %s
            ON CONFLICT (onet_element_id) DO UPDATE SET name_en = EXCLUDED.name_en
        """
        rows = []
        for onet_id, name in unique_items.items():
            new_id = _uuid.uuid4()
            cache[onet_id] = new_id
            rows.append((str(new_id), onet_id, name, SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(insert_sql, rows, cur)
        self.pg.commit()

        with self.pg.cursor() as cur:
            cur.execute("SELECT id, onet_element_id FROM knowledge")
            for row in cur.fetchall():
                cache[row[1]] = row[0]

        junc_sql = """
            INSERT INTO occupation_knowledge (occupation_cnp_code, knowledge_id, importance_score, ingested_at)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, knowledge_id) DO UPDATE SET importance_score = EXCLUDED.importance_score
        """
        junc_dict = {}
        for r in records:
            cnp  = str(r.get("cnp_code") or "").strip()
            onet_id = str(r.get("onet_element_id") or "").strip()
            if not cnp or cnp not in valid_cnps or onet_id not in cache:
                continue
            
            try:
                imp = float(r["importance_score"]) if r.get("importance_score") is not None else None
            except (TypeError, ValueError):
                imp = None
                
            k_id = str(cache[onet_id])
            j_key = (cnp, k_id)
            if j_key in junc_dict and imp is not None:
                prev_imp = junc_dict[j_key][2]
                if prev_imp is not None:
                    imp = max(imp, prev_imp)
            junc_dict[j_key] = (cnp, k_id, imp, INGESTED_AT)

        junc_rows = list(junc_dict.values())
        with self.pg.cursor() as cur:
            self._pg_execute_batch(junc_sql, junc_rows, cur)
        self.pg.commit()
        log.info("  ✅ %d connaissances • %d jonctions.", len(unique_items), len(junc_rows))
        return len(junc_rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 7 — WORK CONTEXTS
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_work_contexts(self):
        log.info("Extraction et chargement des Contextes de travail (Work Contexts)...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)-[r:HAS_CONTEXT]->(w:WorkContext)
            RETURN
                o.code          AS cnp_code,
                w.name_en       AS name_en,
                w.element_id    AS onet_element_id,
                r.frequency     AS frequency_score
            ORDER BY o.code
        """)
        log.info("  %d relations HAS_CONTEXT trouvées.", len(records))

        cache = {}
        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        import uuid as _uuid

        unique_items = {}
        for r in records:
            id_str = str(r.get("onet_element_id") or "").strip()
            if id_str and id_str not in unique_items:
                unique_items[id_str] = str(r.get("name_en") or "").strip()

        insert_sql = """
            INSERT INTO work_contexts (id, onet_element_id, name_en, taxonomy, created_at)
            VALUES %s
            ON CONFLICT (onet_element_id) DO UPDATE SET name_en = EXCLUDED.name_en
        """
        rows = []
        for onet_id, name in unique_items.items():
            new_id = _uuid.uuid4()
            cache[onet_id] = new_id
            rows.append((str(new_id), onet_id, name, SOURCE_TAG, INGESTED_AT))

        with self.pg.cursor() as cur:
            self._pg_execute_batch(insert_sql, rows, cur)
        self.pg.commit()

        with self.pg.cursor() as cur:
            cur.execute("SELECT id, onet_element_id FROM work_contexts")
            for row in cur.fetchall():
                cache[row[1]] = row[0]

        junc_sql = """
            INSERT INTO occupation_work_contexts (occupation_cnp_code, context_id, frequency_score, ingested_at)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, context_id) DO UPDATE SET frequency_score = EXCLUDED.frequency_score
        """
        junc_dict = {}
        for r in records:
            cnp  = str(r.get("cnp_code") or "").strip()
            onet_id = str(r.get("onet_element_id") or "").strip()
            if not cnp or cnp not in valid_cnps or onet_id not in cache:
                continue
            
            try:
                freq = float(r["frequency_score"]) if r.get("frequency_score") is not None else None
            except (TypeError, ValueError):
                freq = None
                
            ctx_id = str(cache[onet_id])
            j_key = (cnp, ctx_id)
            if j_key in junc_dict and freq is not None:
                prev_freq = junc_dict[j_key][2]
                if prev_freq is not None:
                    freq = max(freq, prev_freq)
            junc_dict[j_key] = (cnp, ctx_id, freq, INGESTED_AT)

        junc_rows = list(junc_dict.values())
        with self.pg.cursor() as cur:
            self._pg_execute_batch(junc_sql, junc_rows, cur)
        self.pg.commit()
        log.info("  ✅ %d contextes • %d jonctions.", len(unique_items), len(junc_rows))
        return len(junc_rows)

    # ══════════════════════════════════════════════════════════════════════════
    # PHASE 8 — PHYSICAL DEMANDS, DPC & PREDIGER
    # ══════════════════════════════════════════════════════════════════════════

    def extract_and_load_physical_demands(self):
        log.info("Extraction et chargement des profils Ergonomiques & DPC...")
        records = self._neo4j_fetch("""
            MATCH (o:Occupation)
            WHERE o.dpc_summary IS NOT NULL OR o.strength_code IS NOT NULL
            RETURN
                o.code          AS raw_code,
                o.strength_code AS strength_code,
                o.max_weight_kg AS max_weight_kg,
                o.body_position AS body_position_code,
                o.dpc_summary   AS dpc_summary,
                o.prediger_tp   AS prediger_tp,
                o.prediger_di   AS prediger_di
            ORDER BY o.code
        """)
        log.info("  %d profils ergonomiques trouvés dans Neo4j.", len(records))

        with self.pg.cursor() as cur:
            cur.execute("SELECT cnp_code FROM occupations")
            valid_cnps = {row[0] for row in cur.fetchall()}

        sql = """
            INSERT INTO occupation_physical_demands (
                occupation_cnp_code, strength_code, max_weight_kg,
                body_position_code, dpc_summary,
                prediger_things_people, prediger_data_ideas,
                source, created_at, updated_at
            ) VALUES %s
            ON CONFLICT (occupation_cnp_code) DO UPDATE SET
                strength_code          = COALESCE(EXCLUDED.strength_code, occupation_physical_demands.strength_code),
                max_weight_kg          = COALESCE(EXCLUDED.max_weight_kg, occupation_physical_demands.max_weight_kg),
                body_position_code     = COALESCE(EXCLUDED.body_position_code, occupation_physical_demands.body_position_code),
                dpc_summary            = COALESCE(EXCLUDED.dpc_summary, occupation_physical_demands.dpc_summary),
                prediger_things_people = COALESCE(EXCLUDED.prediger_things_people, occupation_physical_demands.prediger_things_people),
                prediger_data_ideas    = COALESCE(EXCLUDED.prediger_data_ideas, occupation_physical_demands.prediger_data_ideas),
                updated_at             = NOW()
        """
        deduped = {}
        for r in records:
            cnp_raw = str(r["raw_code"]).strip() if r.get("raw_code") else ""
            cnp = cnp_raw.split(".")[0].replace("CNP-", "").strip()
            if not cnp or cnp not in valid_cnps:
                continue

            max_w = None
            if r.get("max_weight_kg") is not None:
                try:
                    max_w = int(r["max_weight_kg"])
                except (ValueError, TypeError):
                    max_w = None

            deduped[cnp] = (
                cnp,
                r.get("strength_code"),
                max_w,
                r.get("body_position_code"),
                r.get("dpc_summary"),
                r.get("prediger_tp"),
                r.get("prediger_di"),
                "EDSC Guide des Carrières / CKG",
                INGESTED_AT,
                INGESTED_AT
            )

        rows = list(deduped.values())
        with self.pg.cursor() as cur:
            self._pg_execute_batch(sql, rows, cur)
        self.pg.commit()
        log.info("  ✅ %d profils ergonomiques & DPC synchronisés.", len(rows))
        return len(rows)

    # ══════════════════════════════════════════════════════════════════════════
    # RAPPORT FINAL
    # ══════════════════════════════════════════════════════════════════════════

    def report(self):
        log.info("\n%s", "=" * 60)
        log.info("  RAPPORT FINAL — SUPABASE")
        log.info("=" * 60)
        tables = [
            "occupations", "riasec_profiles", "competencies",
            "occupation_competencies", "tasks", "occupation_tasks",
            "tools", "occupation_tools", "knowledge", "occupation_knowledge",
            "work_contexts", "occupation_work_contexts", "occupation_physical_demands"
        ]
        with self.pg.cursor() as cur:
            for table in tables:
                cur.execute(f"SELECT COUNT(*) FROM {table}")
                count = cur.fetchone()[0]
                log.info("  %-35s : %8d lignes", table, count)
        log.info("=" * 60)

    # ══════════════════════════════════════════════════════════════════════════
    # POINT D'ENTRÉE
    # ══════════════════════════════════════════════════════════════════════════

    def run(self):
        log.info("=" * 60)
        log.info("  LE SIPHON — ETL Neo4j → Supabase (Trajektia)")
        log.info("  %s", INGESTED_AT)
        log.info("=" * 60)

        # Phase 1 — Occupations
        occ_records = self.extract_occupations()
        self.load_occupations(occ_records)

        # Phase 2 — RIASEC
        riasec_profiles = self.extract_riasec()
        self.load_riasec(riasec_profiles)

        # Phase 3 — Compétences O*NET
        self.extract_and_load_competencies()

        # Phase 4 — Tasks
        self.extract_and_load_tasks()

        # Phase 5 — Tools
        self.extract_and_load_tools()

        # Phase 6 — Knowledge
        self.extract_and_load_knowledge()

        # Phase 7 — Work Contexts
        self.extract_and_load_work_contexts()

        # Phase 8 — Ergonomie & DPC
        self.extract_and_load_physical_demands()

        # Rapport
        self.report()
        log.info("\n✅ Le Siphon terminé avec succès.")


# ── Main ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    siphon = LeSiphon()
    try:
        siphon.run()
    except Exception as e:
        log.exception("Erreur fatale : %s", e)
        sys.exit(1)
    finally:
        siphon.close()
