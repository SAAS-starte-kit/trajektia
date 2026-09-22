import os
import asyncio
import sys
from dotenv import load_dotenv
from neo4j import GraphDatabase

# Add backend to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.onet_service import onet_service

load_dotenv()

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "admin123")

class OnetEnricher:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        self.database = "neo4j"

    def close(self):
        self.driver.close()

    async def enrich_occupation(self, tx, soc_code):
        """Enriches a single occupation with skills, tasks, tools, interests, and styles."""
        try:
            print(f"   -> Enriching O*NET Code: {soc_code}...")
            skills_data = await onet_service.get_skills(soc_code)
            tasks_data = await onet_service.get_tasks(soc_code)
            tools_data = await onet_service.get_tools_technology(soc_code)
            interests_data = await onet_service.get_interests(soc_code)
            styles_data = await onet_service.get_work_styles(soc_code)
            
            skills = [{"id": s.get("id"), "name": s.get("name")} for s in skills_data if s.get("name")]
            tasks = [{"id": t.get("id"), "statement": t.get("title")} for t in tasks_data if t.get("title")]
            
            # Tools logic: extract from 'example' list inside each 'category'
            tools = []
            for cat in tools_data:
                if isinstance(cat, dict) and "example" in cat:
                    for ex in cat["example"]:
                        if ex.get("title"):
                            tools.append({"name": ex.get("title")})
                            
            interests = [{"id": i.get("id"), "name": i.get("name")} for i in interests_data if i.get("name")]
            styles = [{"id": w.get("id"), "name": w.get("name")} for w in styles_data if w.get("name")]
            
            # Update Skills
            if skills:
                skill_query = """
                UNWIND $skills AS item
                MATCH (o:Occupation) WHERE o.onet_soc_code = $soc OR o.code = $soc
                MERGE (s:Skill {name: item.name})
                ON CREATE SET s.id = item.id, s.taxonomy = 'O*NET'
                MERGE (o)-[r:REQUIRES_SKILL]->(s)
                """
                tx.run(skill_query, skills=skills, soc=soc_code)
            
            # Update Tasks
            if tasks:
                task_query = """
                UNWIND $tasks AS item
                MATCH (o:Occupation) WHERE o.onet_soc_code = $soc OR o.code = $soc
                MERGE (t:Task {description: item.statement})
                ON CREATE SET t.id = item.id, t.taxonomy = 'O*NET'
                MERGE (o)-[r:PERFORMS_TASK]->(t)
                """
                tx.run(task_query, tasks=tasks, soc=soc_code)
                
            # Update Tools
            if tools:
                tool_query = """
                UNWIND $tools AS item
                MATCH (o:Occupation) WHERE o.onet_soc_code = $soc OR o.code = $soc
                MERGE (tl:Tool {name: item.name})
                ON CREATE SET tl.taxonomy = 'O*NET'
                MERGE (o)-[r:USES_TOOL]->(tl)
                """
                tx.run(tool_query, tools=tools, soc=soc_code)

            # Update Interests
            if interests:
                int_query = """
                UNWIND $interests AS item
                MATCH (o:Occupation) WHERE o.onet_soc_code = $soc OR o.code = $soc
                MERGE (i:Interest {name: item.name})
                ON CREATE SET i.id = item.id, i.taxonomy = 'O*NET'
                MERGE (o)-[r:MATCHES_INTEREST]->(i)
                """
                tx.run(int_query, interests=interests, soc=soc_code)

            # Update Work Styles
            if styles:
                style_query = """
                UNWIND $styles AS item
                MATCH (o:Occupation) WHERE o.onet_soc_code = $soc OR o.code = $soc
                MERGE (w:WorkStyle {name: item.name})
                ON CREATE SET w.id = item.id, w.taxonomy = 'O*NET'
                MERGE (o)-[r:REQUIRES_STYLE]->(w)
                """
                tx.run(style_query, styles=styles, soc=soc_code)
            
            print(f"      OK: {len(skills)} skills, {len(tasks)} tasks, {len(tools)} tools, {len(interests)} interests, {len(styles)} styles.")
            return len(skills), len(tasks), len(tools), len(interests), len(styles)
        except Exception as e:
            print(f"      [ERROR] Could not enrich {soc_code}: {e}")
            return 0, 0, 0, 0, 0

    async def run_enrichment(self, limit=9999):
        """Main loop for enrichment — full-scale, no artificial cap."""
        print(f"--- STARTING O*NET SKILLS ENRICHMENT (Full Scale: up to {limit} occupations) ---")
        
        with self.driver.session(database=self.database) as session:
            # 1. Find ALL occupations with O*NET codes (no artificial LIMIT)
            result = session.run(
                "MATCH (o:Occupation) WHERE o.onet_soc_code IS NOT NULL "
                "RETURN o.onet_soc_code as soc ORDER BY o.onet_soc_code"
            )
            soc_codes = [record["soc"] for record in result]
            
            if not soc_codes:
                print("   No O*NET codes found to enrich.")
                return

            print(f"   Found {len(soc_codes)} occupations to enrich.")
            
            total_skills = 0
            total_tasks = 0
            total_tools = 0
            total_interests = 0
            total_styles = 0
            
            for soc in soc_codes:
                s_count, t_count, tool_c, int_c, sty_c = await self.enrich_occupation(session, soc)
                total_skills += s_count
                total_tasks += t_count
                total_tools += tool_c
                total_interests += int_c
                total_styles += sty_c
                await asyncio.sleep(0.5)

            print(f"--- ENRICHMENT COMPLETE ---")
            print(f"   Total Skills mapped: {total_skills}")
            print(f"   Total Tasks mapped: {total_tasks}")
            print(f"   Total Tools mapped: {total_tools}")
            print(f"   Total Interests mapped: {total_interests}")
            print(f"   Total Work Styles mapped: {total_styles}")

async def main():
    enricher = OnetEnricher()
    try:
        # Full-scale: enrich all O*NET-linked occupations
        await enricher.run_enrichment()
    finally:
        enricher.close()

if __name__ == "__main__":
    asyncio.run(main())
