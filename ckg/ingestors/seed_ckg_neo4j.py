"""
seed_ckg_neo4j.py — Career Knowledge Graph (CKG) Data Foundation
================================================================
Chantier 1 / Phase de Stabilisation CKG

This script parses the legacy JSON data files from _legacy_ckg and populates
Neo4j with a rich graph schema (7 node types, 4 relationship types).

Architecture Rules:
  - All Cypher mutations use MERGE for idempotence (safe to re-run)
  - programs_mapping.json (~16K entries) is inserted in configurable batches
  - Feature flags for CKG are seeded into the SQL database (SQLAlchemy)

Usage:
  # Neo4j must be running (docker-compose up neo4j)
  cd backend
  python scripts/seed_ckg_neo4j.py [--batch-size 100] [--skip-programs] [--clear]

Flags:
  --batch-size N   Number of program nodes per Cypher batch (default: 100)
  --skip-programs  Skip the large programs_mapping.json import
  --clear          DANGEROUS: wipe all Neo4j data before seeding
  --seed-flags     Also seed the CKG feature flags into the SQL database
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List

from neo4j import GraphDatabase

# ─── Configuration ────────────────────────────────────────────────────────────

# Load .env from backend/ directory (python-dotenv)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass  # dotenv not installed — rely on OS env vars

# Resolve paths relative to the project root
SCRIPT_DIR = Path(__file__).resolve().parent  # backend/scripts/
PROJECT_ROOT = SCRIPT_DIR.parent.parent       # saas-ai-starter/
LEGACY_DATA_DIR = PROJECT_ROOT / "_legacy_ckg" / "CkG--main" / "CkG--main" / "src" / "data"

NEO4J_URI = os.environ.get("NEO4J_URI") or "bolt://localhost:7687"
# Credentials must match docker-compose.yml — use `or` so empty strings
# from .env fall through to the default (dotenv loads "" which overrides get()'s default)
NEO4J_USER = os.environ.get("NEO4J_USER") or "neo4j"
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD") or "admin123"

DEFAULT_BATCH_SIZE = 100

# ─── CKG Feature Flags (Cascading Granularity) ───────────────────────────────

CKG_FEATURE_FLAGS = [
    {
        "name": "enable_market_intel",
        "description": "Master flag: Enables the entire CKG / Market Intelligence module. "
                       "When disabled, all CKG routes, UI panels, and graph features are hidden.",
    },
    {
        "name": "enable_market_intel.career_profile",
        "description": "Sub-flag: Enables the Career Profile API (ESCO, O*NET, SIPEC data). "
                       "Requires enable_market_intel to be active.",
    },
    {
        "name": "enable_market_intel.graph_viewer",
        "description": "Sub-flag: Enables the interactive D3.js Career Knowledge Graph viewer. "
                       "Requires enable_market_intel to be active.",
    },
    {
        "name": "enable_market_intel.job_search",
        "description": "Sub-flag: Enables live job search via Adzuna API integration. "
                       "Requires enable_market_intel to be active.",
    },
    {
        "name": "enable_market_intel.skills_enrichment",
        "description": "Sub-flag: Enables the multi-source skills chips (CNP/SIPEC/ONET/ESCO) "
                       "on occupation detail pages. Requires enable_market_intel to be active.",
    },
]


# ─── Helper Functions ─────────────────────────────────────────────────────────

def load_json(filename: str) -> Any:
    """Load a JSON file from the legacy data directory."""
    filepath = LEGACY_DATA_DIR / filename
    if not filepath.exists():
        print(f"  ⚠ File not found: {filepath}")
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def run_cypher(session, query: str, params: Dict[str, Any] = None) -> List[Any]:
    """Execute a Cypher query and return results."""
    result = session.run(query, params or {})
    return [record.data() for record in result]


def count_nodes(session, label: str) -> int:
    """Count nodes of a given label."""
    result = session.run(f"MATCH (n:{label}) RETURN count(n) AS cnt")
    return result.single()["cnt"]


def count_relationships(session, rel_type: str) -> int:
    """Count relationships of a given type."""
    result = session.run(f"MATCH ()-[r:{rel_type}]->() RETURN count(r) AS cnt")
    return result.single()["cnt"]


# ─── Phase 0: Clear (Optional) ───────────────────────────────────────────────

def phase_clear(session):
    """Wipe all data from Neo4j. Use with caution."""
    print("\n🗑️  PHASE 0: Clearing all Neo4j data...")
    session.run("MATCH (n) DETACH DELETE n")
    print("  ✅ All data cleared.")


# ─── Phase 1: Index Creation ─────────────────────────────────────────────────

def phase_create_indexes(session):
    """Create indexes for fast lookups. Neo4j uses CREATE INDEX ON."""
    print("\n📇 PHASE 1: Creating indexes...")

    indexes = [
        ("Occupation", "noc_code"),
        ("HubOccupation", "hub_id"),
        ("OnetOccupation", "onet_code"),
        ("EscoOccupation", "esco_code"),
        ("Program", "code"),
        ("Program", "cip_code"),
        ("Skill", "name"),
        ("MarketStat", "stat_id"),
        ("DataSource", "name"),
    ]

    for label, prop in indexes:
        try:
            session.run(f"CREATE INDEX ON :{label}({prop})")
            print(f"  ✅ Index on :{label}({prop})")
        except Exception:
            # Index may already exist — Neo4j throws on duplicates
            print(f"  ⏭️  Index on :{label}({prop}) — already exists")


# ─── Phase 2: Hub Occupation Nodes ───────────────────────────────────────────

def phase_hub_nodes(session, career_graph: Dict):
    """Create HubOccupation nodes from career_graph.json."""
    print("\n🏛️  PHASE 2: Creating HubOccupation nodes...")

    hubs = [n for n in career_graph.get("nodes", []) if n.get("type") == "HUB"]
    for hub in hubs:
        session.run(
            """
            MERGE (h:HubOccupation {hub_id: $hub_id})
            SET h.name        = $title,
                h.title       = $title,
                h.titre       = $title,
                h.description = $description
            """,
            {
                "hub_id": hub["id"],
                "title": hub.get("title", ""),
                "description": hub.get("description", ""),
            },
        )

    count = count_nodes(session, "HubOccupation")
    print(f"  ✅ {count} HubOccupation nodes (expected {len(hubs)})")
    return count


# ─── Phase 3: Occupation Nodes (from jobs.json) ──────────────────────────────

def phase_occupation_nodes(session, jobs: List[Dict], career_graph: Dict):
    """Create Occupation nodes from jobs.json, enriched with career_graph metadata."""
    print("\n👔 PHASE 3: Creating Occupation nodes...")

    # Build a lookup for FEER levels from career_graph
    feer_lookup = {}
    for node in career_graph.get("nodes", []):
        if node.get("type") == "CNP" and node.get("metadata", {}).get("feer") is not None:
            feer_lookup[node["id"]] = node["metadata"]["feer"]

    for job in jobs:
        noc = job.get("noc", "")
        feer = feer_lookup.get(noc, _infer_feer_from_skill_level(job.get("skillLevel", "")))
        is_stem = _is_stem_sector(job.get("sector", ""))

        session.run(
            """
            MERGE (o:Occupation {noc_code: $noc_code})
            SET o.name          = $title,
                o.title         = $title,
                o.titre         = $title,
                o.sector        = $sector,
                o.secteur       = $sector,
                o.skill_level   = $skill_level,
                o.niveau_de_competence = $skill_level,
                o.description   = $description,
                o.salary_range  = $salary,
                o.fourchette_de_salaire = $salary,
                o.outlook       = $outlook,
                o.perspective   = $outlook,
                o.feer_level    = $feer,
                o.niveau_feer   = $feer,
                o.is_stem       = $is_stem,
                o.riasec_dominant = $riasec
            """,
            {
                "noc_code": noc,
                "title": job.get("title", ""),
                "sector": job.get("sector", ""),
                "skill_level": job.get("skillLevel", ""),
                "description": job.get("description", ""),
                "salary": job.get("salary", ""),
                "outlook": job.get("outlook", ""),
                "feer": feer,
                "is_stem": is_stem,
                "riasec": _infer_riasec(job.get("sector", "")),
            },
        )

    # Also create CNP nodes from career_graph that may not be in jobs.json
    cnp_nodes = [n for n in career_graph.get("nodes", []) if n.get("type") == "CNP"]
    for cnp in cnp_nodes:
        session.run(
            """
            MERGE (o:Occupation {noc_code: $noc_code})
            ON CREATE SET
                o.name          = $title,
                o.title         = $title,
                o.titre         = $title,
                o.feer_level    = $feer,
                o.niveau_feer   = $feer,
                o.description   = $description
            """,
            {
                "noc_code": cnp["id"],
                "title": cnp.get("title", ""),
                "feer": cnp.get("metadata", {}).get("feer", 0),
                "description": cnp.get("description", ""),
            },
        )

    count = count_nodes(session, "Occupation")
    print(f"  ✅ {count} Occupation nodes")
    return count


def _infer_feer_from_skill_level(skill_level: str) -> int:
    """Map Quebec skill level strings to FEER numeric levels."""
    sl = skill_level.lower()
    if "doctorat" in sl:
        return 1
    if "maîtrise" in sl or "maitrise" in sl:
        return 1
    if "universitaire" in sl:
        return 1
    if "collégial" in sl or "collegial" in sl:
        return 2
    if "dep" in sl or "professionnel" in sl:
        return 3
    if "secondaire" in sl:
        return 4
    return 0


def _is_stem_sector(sector: str) -> bool:
    """Determine if a sector qualifies as STEM."""
    stem_keywords = [
        "technolog", "informati", "génie", "genie", "science",
        "ingénier", "ingenier", "cyber", "données", "donnees",
    ]
    lower = sector.lower()
    return any(kw in lower for kw in stem_keywords)


def _infer_riasec(sector: str) -> str:
    """Simple RIASEC inference from sector name."""
    lower = sector.lower()
    if any(k in lower for k in ["technolog", "informati", "science", "cyber", "données"]):
        return "I"  # Investigative
    if any(k in lower for k in ["santé", "sante", "social", "éducation", "education"]):
        return "S"  # Social
    if any(k in lower for k in ["construction", "fabricat", "industri", "mécan"]):
        return "R"  # Realistic
    if any(k in lower for k in ["art", "design", "communic", "culture"]):
        return "A"  # Artistic
    if any(k in lower for k in ["affaire", "finance", "commerce", "immobili", "gestion"]):
        return "E"  # Enterprising
    if any(k in lower for k in ["admin", "droit", "juridiq"]):
        return "C"  # Conventional
    return "C"


# ─── Phase 4: O*NET and ESCO Occupation Nodes ────────────────────────────────

def phase_international_nodes(session, career_graph: Dict):
    """Create OnetOccupation and EscoOccupation nodes."""
    print("\n🌐 PHASE 4: Creating O*NET and ESCO nodes...")

    onet_nodes = [n for n in career_graph.get("nodes", []) if n.get("type") == "ONET"]
    for node in onet_nodes:
        session.run(
            """
            MERGE (o:OnetOccupation {onet_code: $code})
            SET o.title = $title
            """,
            {"code": node["id"], "title": node.get("title", "")},
        )

    esco_nodes = [n for n in career_graph.get("nodes", []) if n.get("type") == "ESCO"]
    for node in esco_nodes:
        session.run(
            """
            MERGE (e:EscoOccupation {esco_code: $code})
            SET e.title = $title
            """,
            {"code": node["id"], "title": node.get("title", "")},
        )

    onet_count = count_nodes(session, "OnetOccupation")
    esco_count = count_nodes(session, "EscoOccupation")
    print(f"  ✅ {onet_count} OnetOccupation nodes, {esco_count} EscoOccupation nodes")

    # Also create Program nodes from QUEBEC_PROGRAM entries in career_graph
    qc_programs = [n for n in career_graph.get("nodes", []) if n.get("type") == "QUEBEC_PROGRAM"]
    for prog in qc_programs:
        session.run(
            """
            MERGE (p:Program {code: $code})
            ON CREATE SET p.name = $title,
                          p.type = 'collegial'
            """,
            {"code": prog["id"], "title": prog.get("title", "")},
        )
    if qc_programs:
        print(f"  ✅ {len(qc_programs)} QUEBEC_PROGRAM nodes merged into Program label")

    return onet_count, esco_count


# ─── Phase 5: Program Nodes (Batch Insert) ───────────────────────────────────

def phase_program_nodes(session, programs: List[Dict], batch_size: int):
    """Create Program nodes from programs_mapping.json in batches."""
    print(f"\n🎓 PHASE 5: Creating Program nodes (batch_size={batch_size})...")

    # Also add programs from career_graph.json (QUEBEC_PROGRAM type)
    total = len(programs)
    batches = [programs[i : i + batch_size] for i in range(0, total, batch_size)]

    for batch_idx, batch in enumerate(batches):
        # Use UNWIND for efficient batch insert
        session.run(
            """
            UNWIND $programs AS p
            MERGE (prog:Program {code: p.code, type: p.type})
            SET prog.name     = p.name,
                prog.cip_code = p.cip
            """,
            {"programs": batch},
        )

        if (batch_idx + 1) % 10 == 0 or batch_idx == len(batches) - 1:
            progress = min((batch_idx + 1) * batch_size, total)
            print(f"  📦 Batch {batch_idx + 1}/{len(batches)} — {progress}/{total} programs")

    count = count_nodes(session, "Program")
    print(f"  ✅ {count} Program nodes total")
    return count


# ─── Phase 6: Market Stats and Data Sources ──────────────────────────────────

def phase_market_and_sources(session, career_graph: Dict, sources: List[Dict]):
    """Create MarketStat and DataSource nodes."""
    print("\n📊 PHASE 6: Creating MarketStat and DataSource nodes...")

    # Market stats from career_graph
    stats = [n for n in career_graph.get("nodes", []) if n.get("type") == "MARKET_STAT"]
    for stat in stats:
        session.run(
            """
            MERGE (s:MarketStat {stat_id: $stat_id})
            SET s.title       = $title,
                s.description = $description
            """,
            {
                "stat_id": stat["id"],
                "title": stat.get("title", ""),
                "description": stat.get("description", ""),
            },
        )

    # Data sources
    if sources:
        for src in sources:
            session.run(
                """
                MERGE (ds:DataSource {name: $name})
                SET ds.organization = $org,
                    ds.type         = $type,
                    ds.url          = $url,
                    ds.theme        = $theme
                """,
                {
                    "name": src.get("name", ""),
                    "org": src.get("organization", ""),
                    "type": src.get("type", ""),
                    "url": src.get("url", ""),
                    "theme": src.get("theme", ""),
                },
            )

    stat_count = count_nodes(session, "MarketStat")
    source_count = count_nodes(session, "DataSource")
    print(f"  ✅ {stat_count} MarketStat nodes, {source_count} DataSource nodes")
    return stat_count, source_count


# ─── Phase 7: Relationships (Crosswalks) ─────────────────────────────────────

def phase_relationships(session, career_graph: Dict, cip_onet: Dict, programs: List[Dict]):
    """Create all relationships from crosswalks."""
    print("\n🔗 PHASE 7: Creating relationships...")

    crosswalks = career_graph.get("crosswalks", [])

    # Build node type lookup from career_graph
    node_types = {}
    for n in career_graph.get("nodes", []):
        node_types[n["id"]] = n.get("type", "")

    belongs_to = 0
    leads_to = 0
    requires = 0
    describes = 0

    for cw in crosswalks:
        src_id = cw["sourceId"]
        tgt_id = cw["targetId"]
        rel = cw.get("relationship", "related")
        src_type = node_types.get(src_id, "")
        tgt_type = node_types.get(tgt_id, "")

        if rel == "belongs_to":
            # Source -> HUB: Can be CNP, ONET, or ESCO
            src_label, src_prop = _resolve_label_and_prop(src_type, src_id)
            if src_label:
                session.run(
                    f"""
                    MATCH (s:{src_label} {{{src_prop}: $src_id}})
                    MATCH (h:HubOccupation {{hub_id: $tgt_id}})
                    MERGE (s)-[:BELONGS_TO]->(h)
                    """,
                    {"src_id": src_id, "tgt_id": tgt_id},
                )
                belongs_to += 1

        elif rel == "leads_to":
            # Program -> Occupation
            session.run(
                """
                MATCH (p:Program {code: $src_id})
                MATCH (o:Occupation {noc_code: $tgt_id})
                MERGE (p)-[:LEADS_TO]->(o)
                """,
                {"src_id": src_id, "tgt_id": tgt_id},
            )
            leads_to += 1

        elif rel == "requires":
            # JobPosting -> Occupation (we store as MarketStat for now)
            session.run(
                """
                MATCH (o:Occupation {noc_code: $tgt_id})
                MERGE (j:JobPosting {posting_id: $src_id})
                ON CREATE SET j.title = $title, j.description = $desc
                MERGE (j)-[:TARGETS]->(o)
                """,
                {
                    "src_id": src_id,
                    "tgt_id": tgt_id,
                    "title": _get_node_title(career_graph, src_id),
                    "desc": _get_node_desc(career_graph, src_id),
                },
            )
            requires += 1

        elif rel == "describes":
            # MarketStat -> target (Program or HubOccupation)
            if tgt_type == "HUB":
                session.run(
                    """
                    MATCH (s:MarketStat {stat_id: $src_id})
                    MATCH (h:HubOccupation {hub_id: $tgt_id})
                    MERGE (s)-[:DESCRIBES]->(h)
                    """,
                    {"src_id": src_id, "tgt_id": tgt_id},
                )
            else:
                session.run(
                    """
                    MATCH (s:MarketStat {stat_id: $src_id})
                    MATCH (p:Program {code: $tgt_id})
                    MERGE (s)-[:DESCRIBES]->(p)
                    """,
                    {"src_id": src_id, "tgt_id": tgt_id},
                )
            describes += 1

    print(f"  ✅ Crosswalks: {belongs_to} BELONGS_TO, {leads_to} LEADS_TO, "
          f"{requires} TARGETS, {describes} DESCRIBES")

    # ── CIP→O*NET relationships (from cip_onet_mapping.json) ──
    if cip_onet:
        cip_links = 0
        for cip_code, onet_list in cip_onet.items():
            for onet_entry in onet_list:
                onet_code = onet_entry.get("onet_code", "")
                onet_title = onet_entry.get("title", "")

                # Ensure O*NET node exists
                session.run(
                    """
                    MERGE (o:OnetOccupation {onet_code: $onet_code})
                    ON CREATE SET o.title = $title
                    """,
                    {"onet_code": onet_code, "title": onet_title},
                )

                # Link programs with this CIP code to the O*NET occupation
                session.run(
                    """
                    MATCH (p:Program {cip_code: $cip_code})
                    MATCH (o:OnetOccupation {onet_code: $onet_code})
                    MERGE (p)-[:HAS_CIP_LINK {cip_code: $cip_code}]->(o)
                    """,
                    {"cip_code": cip_code, "onet_code": onet_code},
                )
                cip_links += 1

        print(f"  ✅ CIP→O*NET: {cip_links} HAS_CIP_LINK relationships")

    # ── Formation relationships from jobs.json ──
    formation_links = 0
    # We already have programs and occupations; link formations if Program nodes exist
    # This is handled by the LEADS_TO from career_graph crosswalks

    # Final relationship counts
    for rel_type in ["BELONGS_TO", "LEADS_TO", "TARGETS", "DESCRIBES", "HAS_CIP_LINK"]:
        cnt = count_relationships(session, rel_type)
        print(f"  📈 Total {rel_type}: {cnt}")


def _resolve_label_and_prop(node_type: str, node_id: str):
    """Resolve Neo4j label and property name from legacy type."""
    mapping = {
        "CNP": ("Occupation", "noc_code"),
        "ONET": ("OnetOccupation", "onet_code"),
        "ESCO": ("EscoOccupation", "esco_code"),
    }
    return mapping.get(node_type, (None, None))


def _get_node_title(career_graph: Dict, node_id: str) -> str:
    for n in career_graph.get("nodes", []):
        if n["id"] == node_id:
            return n.get("title", "")
    return ""


def _get_node_desc(career_graph: Dict, node_id: str) -> str:
    for n in career_graph.get("nodes", []):
        if n["id"] == node_id:
            return n.get("description", "")
    return ""


# ─── Phase 8: Feature Flags Seeding (SQL) ────────────────────────────────────

def phase_seed_feature_flags():
    """Seed CKG feature flags into the SQL database via SQLAlchemy."""
    print("\n🚩 PHASE 8: Seeding CKG feature flags into SQL database...")

    try:
        # Import the app's database machinery
        sys.path.insert(0, str(SCRIPT_DIR.parent))  # Add backend/ to path
        from app.core.db import SessionLocal
        from app.models.feature_flag import FeatureFlag

        db = SessionLocal()
        try:
            created = 0
            skipped = 0
            for flag_def in CKG_FEATURE_FLAGS:
                existing = db.query(FeatureFlag).filter(
                    FeatureFlag.name == flag_def["name"]
                ).first()

                if existing:
                    skipped += 1
                    print(f"  ⏭️  Flag '{flag_def['name']}' already exists")
                else:
                    new_flag = FeatureFlag(
                        name=flag_def["name"],
                        description=flag_def["description"],
                        is_active=True,  # Active globally, gated by plan assignment
                    )
                    db.add(new_flag)
                    created += 1
                    print(f"  ✅ Created flag '{flag_def['name']}'")

            db.commit()
            print(f"\n  📊 Feature flags: {created} created, {skipped} skipped (pre-existing)")
        finally:
            db.close()

    except Exception as e:
        print(f"  ⚠ Could not seed feature flags (SQL DB may not be available): {e}")
        print("  💡 You can run this later with: python scripts/seed_ckg_neo4j.py --seed-flags")


# ─── Phase 9: Validation ─────────────────────────────────────────────────────

def phase_validate(session):
    """Run validation queries and print a summary report."""
    print("\n" + "=" * 60)
    print("✅ VALIDATION REPORT")
    print("=" * 60)

    labels = [
        "HubOccupation", "Occupation", "OnetOccupation",
        "EscoOccupation", "Program", "MarketStat",
        "DataSource", "JobPosting",
    ]

    total_nodes = 0
    for label in labels:
        cnt = count_nodes(session, label)
        total_nodes += cnt
        print(f"  {label:25s}: {cnt:>6}")

    print(f"  {'─' * 33}")
    print(f"  {'TOTAL NODES':25s}: {total_nodes:>6}")

    print()
    rel_types = ["BELONGS_TO", "LEADS_TO", "TARGETS", "DESCRIBES", "HAS_CIP_LINK"]
    total_rels = 0
    for rel in rel_types:
        cnt = count_relationships(session, rel)
        total_rels += cnt
        print(f"  {rel:25s}: {cnt:>6}")

    print(f"  {'─' * 33}")
    print(f"  {'TOTAL RELATIONSHIPS':25s}: {total_rels:>6}")

    # Integrity check: Occupations with no HUB connection
    # Neo4j supports OPTIONAL MATCH + null check for this pattern
    result = session.run("""
        MATCH (o:Occupation)
        OPTIONAL MATCH (o)-[:BELONGS_TO]->(h:HubOccupation)
        WITH o, h
        WHERE h IS NULL
        RETURN count(o) AS orphans
    """)
    orphans = result.single()["orphans"]
    if orphans > 0:
        print(f"\n  ⚠ {orphans} Occupation nodes have no BELONGS_TO link to a HubOccupation.")
        print("    Expected — these need HUB crosswalk entries in future data enrichment.")
    else:
        print(f"\n  🎯 All Occupation nodes are connected to a HubOccupation.")

    # Sample Career DNA traversal test
    print("\n📋 Sample Career DNA Traversal (NOC 21232):")
    result = session.run("""
        MATCH (o:Occupation {noc_code: '21232'})
        OPTIONAL MATCH (o)-[:BELONGS_TO]->(h:HubOccupation)
        OPTIONAL MATCH (p:Program)-[:LEADS_TO]->(o)
        OPTIONAL MATCH (onet:OnetOccupation)-[:BELONGS_TO]->(h)
        RETURN o.title       AS occupation,
               h.title       AS hub,
               p.name        AS program,
               onet.onet_code AS onet_code
        LIMIT 3
    """)
    records = list(result)
    if records:
        r0 = records[0]
        print(f"  Occupation : {r0['occupation']}")
        print(f"  Hub        : {r0['hub']}")
        programs_found = [r["program"] for r in records if r["program"]]
        onet_found = list({r["onet_code"] for r in records if r["onet_code"]})
        print(f"  Programs   : {programs_found[:3]}")
        print(f"  O*NET codes: {onet_found}")
    else:
        print("  ⚠ NOC 21232 not found — check data integrity.")

    print("\n" + "=" * 60)
    print("🏁 Seed complete.")
    print("=" * 60)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Seed CKG data into Neo4j")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE,
                        help="Batch size for program inserts (default: 100)")
    parser.add_argument("--skip-programs", action="store_true",
                        help="Skip importing programs_mapping.json")
    parser.add_argument("--clear", action="store_true",
                        help="Clear all Neo4j data before seeding")
    parser.add_argument("--seed-flags", action="store_true",
                        help="Also seed CKG feature flags into the SQL database")
    args = parser.parse_args()

    # ── Verify data directory exists ──
    if not LEGACY_DATA_DIR.exists():
        print(f"❌ Legacy data directory not found: {LEGACY_DATA_DIR}")
        print("   Make sure _legacy_ckg/CkG--main/CkG--main/src/data/ exists at the project root.")
        sys.exit(1)

    # ── Load JSON data ──
    print("📂 Loading legacy JSON data files...")
    career_graph = load_json("career_graph.json")
    jobs = load_json("jobs.json")
    programs = load_json("programs_mapping.json") if not args.skip_programs else []
    cip_onet = load_json("cip_onet_mapping.json")
    sources = load_json("sources.json")

    if not career_graph or not jobs:
        print("❌ Critical data files (career_graph.json, jobs.json) could not be loaded.")
        sys.exit(1)

    print(f"  ✅ career_graph.json : {len(career_graph.get('nodes', []))} nodes, "
          f"{len(career_graph.get('crosswalks', []))} crosswalks")
    print(f"  ✅ jobs.json         : {len(jobs)} occupations")
    if programs:
        print(f"  ✅ programs_mapping  : {len(programs)} programs")
    if cip_onet:
        print(f"  ✅ cip_onet_mapping  : {len(cip_onet)} CIP codes")
    if sources:
        print(f"  ✅ sources.json      : {len(sources)} data sources")

    # ── Connect to Neo4j ──
    print(f"\n🔌 Connecting to Neo4j at {NEO4J_URI}...")
    try:
        auth = (NEO4J_USER, NEO4J_PASSWORD) if NEO4J_USER else None
        driver = GraphDatabase.driver(NEO4J_URI, auth=auth)
        driver.verify_connectivity()
        print("  ✅ Connected successfully.")
    except Exception as e:
        print(f"  ❌ Could not connect to Neo4j: {e}")
        print("  💡 Make sure Neo4j is running: docker-compose up neo4j")
        sys.exit(1)

    start_time = time.time()

    with driver.session() as session:
        if args.clear:
            phase_clear(session)

        phase_create_indexes(session)
        phase_hub_nodes(session, career_graph)
        phase_occupation_nodes(session, jobs, career_graph)
        phase_international_nodes(session, career_graph)

        if programs:
            # Deduplicate programs (some codes appear multiple times with different names)
            seen = set()
            unique_programs = []
            for p in programs:
                key = (p.get("code", ""), p.get("type", ""))
                if key not in seen and p.get("code"):
                    seen.add(key)
                    unique_programs.append(p)
            print(f"\n  📊 Deduplicated: {len(programs)} → {len(unique_programs)} unique programs")
            phase_program_nodes(session, unique_programs, args.batch_size)

        phase_market_and_sources(session, career_graph, sources or [])
        phase_relationships(session, career_graph, cip_onet or {}, programs or [])
        phase_validate(session)

    driver.close()

    elapsed = time.time() - start_time
    print(f"\n⏱️  Total execution time: {elapsed:.1f}s")

    # ── Feature Flags (SQL) ──
    if args.seed_flags:
        phase_seed_feature_flags()

    print("\n🎉 Done! Your Neo4j CKG is ready.")
    print("   Next: Run the backend and test GET /api/v1/occupations/21232")


if __name__ == "__main__":
    main()
