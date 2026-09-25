import argparse
import csv
import io
import json
import re
from typing import List, Dict, Any

# Curated taxonomy of green transition domains
GREEN_DOMAINS = [
    "Énergie renouvelable & Réseaux intelligents",
    "Économie circulaire & Gestion des matières",
    "Bâtiment durable & Efficacité énergétique",
    "Conformité environnementale & Bilan carbone",
    "Mobilité durable & Véhicules électriques"
]

def _categorize_green_skill(skill_label: str, green_category: str) -> str | None:
    """Categorize a skill into one of the curated green domains based on heuristics."""
    text_to_search = f"{skill_label} {green_category}".lower()
    
    # Simple heuristics mapping keywords to domains
    if any(k in text_to_search for k in ["renewable", "solar", "wind", "grid", "renouvelable", "solaire", "éolien", "réseau"]):
        return GREEN_DOMAINS[0]
    elif any(k in text_to_search for k in ["circular", "waste", "recycling", "circulaire", "déchet", "recyclage", "matière"]):
        return GREEN_DOMAINS[1]
    elif any(k in text_to_search for k in ["construction", "building", "efficiency", "bâtiment", "efficacité énergétique"]):
        return GREEN_DOMAINS[2]
    elif any(k in text_to_search for k in ["compliance", "esg", "carbon", "environment", "conformité", "carbone", "environnementale"]):
        return GREEN_DOMAINS[3]
    elif any(k in text_to_search for k in ["transport", "mobility", "vehicle", "mobilité", "véhicule électrique"]):
        return GREEN_DOMAINS[4]
    
    # If explicitly green but doesn't strictly match our keywords, map to environmental compliance by default
    if "green" in text_to_search or "vert" in text_to_search or green_category.lower() == "green":
        return GREEN_DOMAINS[3]
        
    return None

def extract_green_skills_from_dataset(raw_content: str) -> List[Dict[str, Any]]:
    """
    Parses skill records (label_fr, label_en, uri, green_category).
    Filters skills matching green criteria.
    """
    green_skills = []
    
    # Handle CSV or JSON-like inputs for testing flexibility
    try:
        # Try treating it as JSON
        data = json.loads(raw_content)
        if isinstance(data, list):
            records = data
        else:
            records = [data]
    except json.JSONDecodeError:
        # Fall back to CSV parsing
        f = io.StringIO(raw_content)
        reader = csv.DictReader(f)
        try:
            records = list(reader)
        except csv.Error:
            records = []
            
    for row in records:
        # Normalize keys (handling different possible input formats)
        label_fr = row.get("label_fr", "")
        label_en = row.get("label_en", "")
        uri = row.get("uri", "")
        green_cat = row.get("green_category", "")
        
        # In a real dataset, we might look for 'isGreenSkill' or similar,
        # but the prompt implies filtering based on our domains.
        domain = _categorize_green_skill(f"{label_en} {label_fr}", green_cat)
        
        if domain:
            green_skills.append({
                "label_fr": label_fr,
                "label_en": label_en,
                "uri": uri,
                "green_category": green_cat,
                "domain": domain
            })
            
    return green_skills

def map_green_skills_to_noc(skills: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Maps green competencies to relevant CNP occupations based on keywords/ESCO crosswalk.
    Heuristics for engineering, construction, and environmental CNPs.
    """
    # Simplified mapping heuristics for CNP (NOC 2021)
    # 212 - Natural and applied science related occupations (engineering)
    # 211 - Natural and applied sciences (environmental)
    # 22 - Technical occupations in natural and applied sciences
    # 7 - Trades, transport and equipment operators (construction)
    
    noc_mapping = {
        "212": [], # Engineering
        "211": [], # Environmental Sciences
        "72": [],  # Construction Trades
        "73": [],  # Transport
    }
    
    for skill in skills:
        domain = skill["domain"]
        
        if domain == GREEN_DOMAINS[0]: # Renewable Energy
            noc_mapping["212"].append(skill)
            noc_mapping["72"].append(skill)
        elif domain == GREEN_DOMAINS[1]: # Circular Economy
            noc_mapping["211"].append(skill)
        elif domain == GREEN_DOMAINS[2]: # Sustainable Construction
            noc_mapping["72"].append(skill)
            noc_mapping["212"].append(skill)
        elif domain == GREEN_DOMAINS[3]: # Environmental Compliance
            noc_mapping["211"].append(skill)
        elif domain == GREEN_DOMAINS[4]: # Clean Transportation
            noc_mapping["73"].append(skill)
            noc_mapping["212"].append(skill)
            
    return noc_mapping

def main():
    parser = argparse.ArgumentParser(description="Ingest Targeted ESCO Green Skills and Map to NOC")
    parser.add_argument("--dry-run", action="store_true", help="Generates summary statistics to stdout")
    parser.add_argument("--output-json", type=str, help="Exports structured green skills and CNP mappings to JSON")
    parser.add_argument("--input", type=str, required=True, help="Path to input data file (CSV or JSON) for processing")
    
    args = parser.parse_args()
    
    with open(args.input, "r", encoding="utf-8") as f:
        raw_content = f.read()

    green_skills = extract_green_skills_from_dataset(raw_content)
    noc_mapping = map_green_skills_to_noc(green_skills)
    
    if args.dry_run:
        print(f"Total Green Skills Found: {len(green_skills)}")
        for noc, mapped_skills in noc_mapping.items():
            print(f"NOC Prefix {noc}: {len(mapped_skills)} skills mapped")
            
    if args.output_json:
        output_data = {
            "green_skills_count": len(green_skills),
            "green_skills": green_skills,
            "noc_mapping": noc_mapping
        }
        with open(args.output_json, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Successfully exported data to {args.output_json}")

if __name__ == "__main__":
    main()
