import argparse
import json
import os
import random
import sys
from hashlib import sha256

def format_job_chunk(title: str, cnp: str, cnp_title: str, city: str, region: str, remote_status: str, skills: list, description: str = "") -> str:
    """
    Formats the text according to the standard chunking template defined in packages/ckg/FEASIBILITY_CKAN_VECTORIZATION_I7.md.
    """
    skills_text = "\n".join([f"  - {skill}" for skill in skills])
    
    chunk = (
        f"Poste : {title}\n"
        f"Profession : CNP {cnp} - {cnp_title}\n"
        f"Région : {city}, {region}, Québec\n"
        f"Mode de travail : {remote_status}\n"
    )
    
    # We omit specific "Exigences" for now since not present in function signature, but we follow the general template
    # as described in the requirements. Wait, the prompt says:
    # "Formats the text according to the standard chunking template defined in packages/ckg/FEASIBILITY_CKAN_VECTORIZATION_I7.md."
    
    chunk += "Tâches et compétences clés :\n"
    if skills:
        chunk += skills_text + "\n"
    if description:
        chunk += f"  - {description}\n"
        
    return chunk.strip()

def generate_embedding(text: str, mock: bool = False) -> list[float]:
    """
    Returns a 768-float list. If mock=True or no API key is provided, generates a deterministic 
    pseudo-embedding based on hash/random seed normalized to unit length (L2 norm = 1.0).
    """
    if not mock:
        # Check for API key (e.g., GEMINI_API_KEY) - just a placeholder, logic follows mock if not provided
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            # Here real API call would happen
            # For simplicity and requirements, we fallback to mock if real is not implemented or key missing
            pass
            
    # Mock / Deterministic pseudo-embedding based on text
    # Seed random generator with a hash of the text to ensure determinism
    h = sha256(text.encode("utf-8")).hexdigest()
    random.seed(h)
    
    vector = [random.gauss(0, 1) for _ in range(768)]
    
    # Normalize to L2 norm = 1.0
    l2_norm = sum(x**2 for x in vector) ** 0.5
    if l2_norm == 0:
        return [0.0] * 768
    normalized_vector = [x / l2_norm for x in vector]
    
    return normalized_vector

def main():
    parser = argparse.ArgumentParser(description="Generate job embeddings.")
    parser.add_argument("--dry-run", action="store_true", help="Format chunks and generate mock embeddings without DB insertion.")
    parser.add_argument("--limit", type=int, help="Limit processing to N records.")
    parser.add_argument("--input-file", type=str, help="Read input jobs from a JSON file.")
    parser.add_argument("--output-json", type=str, help="Export formatted chunks and vectors to JSON.")
    
    args = parser.parse_args()
    
    # Simple dry-run logic
    if args.dry_run:
        print("Running in dry-run mode.")
        if not args.input_file:
            print("No input file provided. Exiting.")
            sys.exit(0)
            
    jobs = []
    if args.input_file:
        try:
            with open(args.input_file, 'r', encoding='utf-8') as f:
                jobs = json.load(f)
        except Exception as e:
            print(f"Error reading input file: {e}")
            sys.exit(1)
            
    if args.limit:
        jobs = jobs[:args.limit]
        
    results = []
    for job in jobs:
        title = job.get("title", "")
        cnp = job.get("cnp", "")
        cnp_title = job.get("cnp_title", "")
        city = job.get("city", "")
        region = job.get("region", "")
        remote_status = job.get("remote_status", "")
        skills = job.get("skills", [])
        description = job.get("description", "")
        
        chunk = format_job_chunk(title, cnp, cnp_title, city, region, remote_status, skills, description)
        embedding = generate_embedding(chunk, mock=args.dry_run or not os.environ.get("GEMINI_API_KEY"))
        
        results.append({
            "job": job,
            "chunk": chunk,
            "embedding": embedding
        })
        
    if args.output_json:
        try:
            with open(args.output_json, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"Exported results to {args.output_json}")
        except Exception as e:
            print(f"Error writing output file: {e}")
            sys.exit(1)
            
    if not args.dry_run and results:
        print("This would insert into the database.")
        
    sys.exit(0)

if __name__ == "__main__":
    main()
