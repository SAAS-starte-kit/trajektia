import os
import re
import csv
import json
import statistics
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = PROJECT_ROOT.parent / "data"

WORK_VALUES_PATH = DATA_DIR / "raw" / "onet" / "db_28_2_text" / "db_28_2_text" / "Work Values.txt"
CROSSWALK_PATH = DATA_DIR / "raw" / "crosswalks" / "noc_onet_mapping.csv"
METIERS_PATH = PROJECT_ROOT / "frontend-web" / "src" / "data" / "metiers.ts"
OUTPUT_PATH = PROJECT_ROOT / "frontend-web" / "src" / "data" / "valeurs-travail-metiers.ts"

def run():
    # 1. Parse metiers.ts to get CNPs
    with open(METIERS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Regex: "cnp":\s*"(\d{5})",\s*\n\s*"feer"
    pattern = re.compile(r'"cnp":\s*"(\d{5})",\s*\n\s*"feer"')
    cnps = pattern.findall(content)
    target_cnps = set(cnps)
    print(f"Found {len(target_cnps)} target CNPs.")

    # 2. Parse Crosswalk
    noc_to_onets = {}
    with open(CROSSWALK_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            noc = row["noc"]
            onet = row["onet"]
            if len(noc) == 5:
                if noc not in noc_to_onets:
                    noc_to_onets[noc] = set()
                noc_to_onets[noc].add(onet)

    # 3. Parse Work Values
    onet_to_values = {}
    with open(WORK_VALUES_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            if row["Scale ID"] == "EX":
                onet = row["O*NET-SOC Code"]
                element_name = row["Element Name"]
                value = float(row["Data Value"])
                
                if onet not in onet_to_values:
                    onet_to_values[onet] = {}
                onet_to_values[onet][element_name] = value

    val_map = {
        "Achievement": "accomplissement",
        "Independence": "independance",
        "Recognition": "reconnaissance",
        "Relationships": "relations",
        "Support": "soutien",
        "Working Conditions": "conditions_travail"
    }

    tie_break_order = {
        "accomplissement": 0,
        "independance": 1,
        "reconnaissance": 2,
        "relations": 3,
        "soutien": 4,
        "conditions_travail": 5
    }

    profiles = {}

    for cnp in target_cnps:
        onets = noc_to_onets.get(cnp, set())
        valid_onets = [o for o in onets if o in onet_to_values]
        if not valid_onets:
            continue
        
        scores = {}
        for en_val, fr_val in val_map.items():
            vals = [onet_to_values[o][en_val] for o in valid_onets if en_val in onet_to_values[o]]
            if not vals:
                continue
            avg_val = sum(vals) / len(vals)
            norm_val = round((avg_val - 1) / 6 * 100)
            scores[fr_val] = norm_val
        
        if len(scores) != 6:
            raise ValueError(f"CNP {cnp} does not have exactly 6 scores")
        
        sorted_vals = sorted(
            scores.items(),
            key=lambda x: (x[1], -tie_break_order[x[0]]),
            reverse=True
        )
        
        def format_valeur_dominante(k):
            if k == "conditions_travail":
                return "Conditions_Travail"
            if k == "independance":
                return "Independance"
            return k.capitalize()

        valeurs_dominantes = [format_valeur_dominante(x[0]) for x in sorted_vals[:3]]

        stdev = statistics.stdev(scores.values())
        if stdev == 0:
            raise ValueError(f"CNP {cnp} has standard deviation 0")
        
        profiles[cnp] = {
            "scores": scores,
            "valeurs_dominantes": valeurs_dominantes,
            "source": "O*NET 28.2 Work Values"
        }

    print(f"Coverage: {len(profiles)} / {len(target_cnps)}")
    assert len(profiles) >= 303, f"Expected at least 303 covered, got {len(profiles)}"

    if "10010" in profiles:
        doms = profiles["10010"]["valeurs_dominantes"]
        assert "Conditions_Travail" in doms and "Independance" in doms, f"10010 failed manual verification: {doms}"
    if "31301" in profiles:
        doms = profiles["31301"]["valeurs_dominantes"]
        assert "Relations" in doms, f"31301 failed manual verification: {doms}"

    ts_content = f"""// ============================================================
// src/data/valeurs-travail-metiers.ts
// Profils TWA (Theory of Work Adjustment) des métiers
//
// Généré par scripts/generate_work_values.py
// Sources: O*NET 28.2 Work Values (https://www.onetcenter.org)
// Crosswalk: NOC to O*NET
// ============================================================

export interface ProfilValeursTravail {{
  scores: {{
    accomplissement: number;
    independance: number;
    reconnaissance: number;
    relations: number;
    soutien: number;
    conditions_travail: number;
  }};
  valeurs_dominantes: string[];
  source: string;
}}

export const VALEURS_TRAVAIL_PAR_CNP: Record<string, ProfilValeursTravail> = {json.dumps(profiles, indent=2, ensure_ascii=False)};
"""
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("Successfully generated valeurs-travail-metiers.ts")

if __name__ == "__main__":
    run()
