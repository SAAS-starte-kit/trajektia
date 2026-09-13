import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.graph.career_profile_service import CareerProfileService
from app.services.graph.database import Neo4jDatabase

async def verify_profile():
    print("🔍 Testing CareerProfileService aggregation...")
    
    noc_code = "21232" # Software Developer
    print(f"\n1. Fetching full profile for NOC {noc_code}...")
    
    try:
        profile = await CareerProfileService.get_full_profile(noc_code)
        
        if "error" in profile and not profile.get("is_demo"):
            print(f"  ❌ Error: {profile['error']}")
            return

        # Career DNA
        dna = profile.get("career_dna", {})
        print(f"  ✅ Neo4j DNA: {dna.get('title')} (Hub: {dna.get('hub_title')})")
        print(f"     O*NET Codes: {dna.get('onet_codes')}")
        print(f"     Programs: {len(dna.get('programs', []))} found")
        
        # ESCO
        esco = profile.get("esco", {})
        if "error" in esco:
            print(f"  ⚠️ ESCO API: {esco['error']}")
        else:
            print(f"  ✅ ESCO API: {len(esco.get('essentialSkills', []))} essential skills found")
            print(f"     Top Skill: {esco['essentialSkills'][0] if esco['essentialSkills'] else 'None'}")
            
        # Adzuna
        adzuna = profile.get("adzuna", {})
        if "error" in adzuna:
            print(f"  ⚠️ Adzuna API: {adzuna['error']}")
        else:
            count = adzuna.get('count', 0)
            print(f"  ✅ Adzuna API: {count} jobs found in {profile['metadata']['location']}")

        print("\n🎉 Verification Successful!")
        
    except Exception as e:
        print(f"  ❌ Exception during verification: {e}")
    finally:
        Neo4jDatabase.close()

if __name__ == "__main__":
    # Ensure .env is loaded (service handles it but we can do it here too)
    from dotenv import load_dotenv
    load_dotenv(backend_dir / ".env")
    
    asyncio.run(verify_profile())
