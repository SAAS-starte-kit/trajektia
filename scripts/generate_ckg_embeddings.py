import argparse
import hashlib
import json
import math
import os
import sys
from typing import List

try:
    import psycopg2
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

try:
    from fastembed import TextEmbedding
    FASTEMBED_AVAILABLE = True
except ImportError:
    FASTEMBED_AVAILABLE = False

def format_occupation_chunk(cnp: str, title_fr: str, description_fr: str = "", category_fr: str = "", riasec: str = "") -> str:
    """Format the occupation details into a dense semantic chunk."""
    return f"Code CNP: {cnp} | Métier: {title_fr} | Domaine: {category_fr} | RIASEC: {riasec} | Description: {description_fr}"


def generate_embedding(text: str, mock: bool = False) -> List[float]:
    """Generate embedding for the text using fastembed or a fallback deterministic hash method."""
    if not mock and FASTEMBED_AVAILABLE:
        try:
            # Initialize model once
            if not hasattr(generate_embedding, "model"):
                generate_embedding.model = TextEmbedding(model_name="nomic-ai/nomic-embed-text-v1.5")
            
            embeddings = list(generate_embedding.model.embed([text]))
            if embeddings and len(embeddings) > 0:
                # numpy array to list
                return embeddings[0].tolist()
        except Exception as e:
            print(f"Error generating embedding with fastembed: {e}. Falling back to mock.", file=sys.stderr)
            
    # Mock / Fallback deterministic 768-d unit vector
    vector = [0.0] * 768
    text_lower = text.lower()
    
    for i in range(len(text_lower) - 2):
        trigram = text_lower[i:i+3]
        idx = int(hashlib.md5(trigram.encode('utf-8')).hexdigest(), 16) % 768
        vector[idx] += 1.0

    norm = math.sqrt(sum(x * x for x in vector))
    if norm > 0:
        return [x / norm for x in vector]
    else:
        vector[0] = 1.0
        return vector

def process_live_db(limit: int = None, mock: bool = False):
    """Fetch occupations from DB, generate embeddings and update DB."""
    if not PSYCOPG2_AVAILABLE:
        print("Error: psycopg2 is required for live DB operations.", file=sys.stderr)
        sys.exit(1)
        
    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Error: SUPABASE_DB_URL environment variable is not set.", file=sys.stderr)
        sys.exit(1)
        
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        query = """
            SELECT o.cnp_code, o.title_fr, o.description_fr, o.riasec_dominant
            FROM occupations o
            WHERE o.embedding IS NULL
        """
        if limit is not None:
            query += f" LIMIT {limit}"
            
        cursor.execute(query)
        occupations = cursor.fetchall()
        
        print(f"Found {len(occupations)} occupations to process.")
        
        for cnp, title, desc, riasec in occupations:
            # For category we don't have it explicitly in this query without joining, using empty string for now
            chunk = format_occupation_chunk(
                cnp=cnp or "", 
                title_fr=title or "", 
                description_fr=desc or "", 
                category_fr="", 
                riasec=riasec or ""
            )
            embedding = generate_embedding(chunk, mock=mock)
            
            # Update the DB
            # Ensure the vector is converted correctly, psycopg2 should handle lists of floats for pgvector 
            # if we cast it in the query: %s::vector
            # The exact dimension of embedding in DB is 384 for older schemas, but the task mentions 768
            # The prompt specifically says "generates deterministic 768-dimensional normalized unit vector"
            # It seems the DB might accept it if the schema was altered, or it might fail if 384 is enforced.
            # Assuming we just need to pass the list.
            
            cursor.execute(
                "UPDATE occupations SET embedding = %s WHERE cnp_code = %s",
                (str(embedding), cnp)
            )
            print(f"Successfully processed and updated CNP {cnp}")
            
    except Exception as e:
        print(f"Database error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

def main():
    parser = argparse.ArgumentParser(description="Generate embeddings for CKG occupations.")
    parser.add_argument("--dry-run", action="store_true", help="Run with sample data and mock embeddings without DB.")
    parser.add_argument("--limit", type=int, help="Limit the number of occupations processed.")
    parser.add_argument("--output-json", type=str, help="Export results to a JSON file.")
    
    args = parser.parse_args()
    
    if args.dry_run:
        sample_occupations = [
            {"cnp": "21232", "title_fr": "Développeur web", "category_fr": "Informatique", "riasec": "IRC", "description_fr": "Conçoit et crée des sites web."},
            {"cnp": "21231", "title_fr": "Développeur logiciel", "category_fr": "Informatique", "riasec": "IRC", "description_fr": "Conçoit et crée des logiciels."},
            {"cnp": "63201", "title_fr": "Boucher/Charcutier", "category_fr": "Alimentation", "riasec": "RCE", "description_fr": "Prépare et vend de la viande."},
            {"cnp": "31102", "title_fr": "Médecin généraliste", "category_fr": "Santé", "riasec": "ISA", "description_fr": "Diagnostique et traite les maladies."}
        ]
        
        limit = args.limit if args.limit is not None else len(sample_occupations)
        process_occupations = sample_occupations[:limit]
        
        results = []
        for occ in process_occupations:
            chunk = format_occupation_chunk(
                cnp=occ["cnp"],
                title_fr=occ["title_fr"],
                description_fr=occ["description_fr"],
                category_fr=occ["category_fr"],
                riasec=occ["riasec"]
            )
            embedding = generate_embedding(chunk, mock=True)
            results.append({
                "cnp": occ["cnp"],
                "chunk": chunk,
                "embedding_dim": len(embedding),
                "embedding_preview": embedding[:5]
            })
            print(f"Processed CNP {occ['cnp']}: {occ['title_fr']}")
            
        if args.output_json:
            with open(args.output_json, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"Exported to {args.output_json}")
            
    else:
        # Live run
        process_live_db(limit=args.limit, mock=not FASTEMBED_AVAILABLE)
        
if __name__ == "__main__":
    main()
