import asyncio
from neo4j import AsyncGraphDatabase
import litellm
import os
import sys

# Append backend dir to path to import app.core.config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from dotenv import load_dotenv
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '../.env')))

os.environ["OPENROUTER_API_KEY"] = os.getenv("OPENROUTER_API_KEY", "")

async def translate_batch(descriptions):
    if not descriptions:
        return []
    
    tasks = []
    for desc in descriptions:
        sys_msg = "You are an expert bilingual career counselor. Translate this description into professional, easy-to-understand French (B2 level). Remove jargon."
        tasks.append(
            litellm.acompletion(
                model="openrouter/openai/gpt-4o-mini",
                messages=[
                    {"role": "system", "content": sys_msg},
                    {"role": "user", "content": f"Description: {desc}"}
                ]
            )
        )
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    translations = []
    for res in results:
        if isinstance(res, Exception):
            print("Translation error:", str(res)[:100])
            translations.append(None)
        else:
            translations.append(res.choices[0].message.content.strip())
            
    return translations

async def main():
    driver = AsyncGraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "admin123"))
    
    async with driver.session() as session:
        result = await session.run("MATCH (o:Occupation) WHERE o.description_fr IS NULL AND o.description_en IS NOT NULL RETURN o.code as code, o.description_en as desc_en")
        records = await result.data()
        
    print(f"[{len(records)}] records to translate...")
    
    BATCH_SIZE = 15
    
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i:i+BATCH_SIZE]
        codes = [r['code'] for r in batch]
        descs = [r['desc_en'] for r in batch]
        
        print(f"Translating batch {i//BATCH_SIZE + 1}...")
        try:
            translations = await translate_batch(descs)
            
            # Save back to Neo4j
            async with driver.session() as session:
                for code, trans in zip(codes, translations):
                    if trans:
                        await session.run("MATCH (o:Occupation {code: $code}) SET o.description_fr = $trans", code=code, trans=trans)
            
            print(f"Translated and saved {len(batch)} records.")
        except Exception as e:
            print(f"Batch failed: {e}")
            
    await driver.close()
    print("ALL DONE!")

if __name__ == "__main__":
    asyncio.run(main())
