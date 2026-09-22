#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Moteur de Preuve Scientifique Hybride (Tâche G5)
Orchestre la recherche de preuves pour les affirmations manquantes.
Combine: OpenAlex API + GPT Researcher (Optionnel) + Ollama (ARA Rigor Reviewer)
"""

import os
import re
import sys
import json
import asyncio
import requests
from pathlib import Path
from typing import List, Dict

# Configuration UTF-8 pour Windows
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration Environnement local
os.environ["LLM_PROVIDER"] = "ollama"
os.environ["FAST_LLM"] = "ollama:deepseek-r1:8b"
os.environ["SMART_LLM"] = "ollama:deepseek-r1:8b"
os.environ["STRATEGIC_LLM"] = "ollama:deepseek-r1:8b"
os.environ["EMBEDDING"] = "ollama:nomic-embed-text:latest"
os.environ["OLLAMA_BASE_URL"] = "http://localhost:11434"
os.environ["RETRIEVER"] = "duckduckgo"

REPORT_PATH = Path("ckg/audit/rapport_audit_preuves_paperqa.md")
SKILL_PATH = Path(".agents/skills/ara-rigor-reviewer/SKILL.md")
REFERENCES_DIR = Path("ckg/references")

# Modèle pour l'évaluation de rigueur (ARA)
EVAL_MODEL = "deepseek-r1:8b"

def extract_missing_claims() -> List[Dict]:
    """Extrait les affirmations NON VÉRIFIÉ ou SOURCE ABSENTE du rapport d'audit."""
    if not REPORT_PATH.exists():
        print(f"❌ Rapport d'audit introuvable: {REPORT_PATH}")
        return []

    content = REPORT_PATH.read_text(encoding="utf-8")
    claims = []
    
    # Pattern pour extraire chaque bloc de claim
    # Format: ### ❌ claim_key \n ... **Affirmation:** texte ... **Résultat de l'audit:** statut
    blocks = content.split("### ")[1:]
    
    for block in blocks:
        if "NON VÉRIFIÉ" in block or "SOURCE ABSENTE" in block:
            try:
                # Extraire la clé
                header_line = block.split("\n")[0]
                claim_key = header_line.split(" ", 1)[1].strip()
                
                # Extraire l'affirmation
                affirmation_match = re.search(r"\*\*Affirmation:\*\* (.*?)(?:\n|$)", block)
                affirmation = affirmation_match.group(1).strip() if affirmation_match else ""
                
                if affirmation:
                    claims.append({
                        "key": claim_key,
                        "statement": affirmation
                    })
            except Exception as e:
                print(f"Erreur d'extraction pour un bloc: {e}")
                
    return claims

def search_openalex(query: str) -> List[Dict]:
    """Cherche des articles académiques sur OpenAlex (100% gratuit)."""
    print(f"   Recherche OpenAlex pour: {query}")
    url = "https://api.openalex.org/works"
    params = {
        "search": query,
        "per-page": 3,
        "sort": "cited_by_count:desc" # Priorité aux papiers très cités
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        if response.status_code == 200:
            results = response.json().get("results", [])
            # Si aucun résultat avec la requête complète, tenter avec les 3 premiers mots-clés essentiels
            if not results and len(query.split()) > 3:
                fallback_query = " ".join(query.split()[:4])
                print(f"   OpenAlex retry avec requête resserrée : {fallback_query}")
                params["search"] = fallback_query
                response = requests.get(url, params=params, timeout=15)
                if response.status_code == 200:
                    results = response.json().get("results", [])

            papers = []
            for r in results:
                abstract = ""
                if r.get("abstract_inverted_index"):
                    idx = r["abstract_inverted_index"]
                    words = sorted(
                        [(word, pos) for word, positions in idx.items() for pos in positions],
                        key=lambda x: x[1]
                    )
                    abstract = " ".join([w[0] for w in words])
                
                papers.append({
                    "title": r.get("title", "Sans Titre"),
                    "doi": r.get("doi", ""),
                    "publication_year": r.get("publication_year", ""),
                    "cited_by_count": r.get("cited_by_count", 0),
                    "abstract": abstract
                })
            return papers
    except Exception as e:
        print(f"   ⚠️ Erreur OpenAlex: {e}")
    return []

async def run_gpt_researcher(query: str) -> str:
    """Lance une recherche profonde sur le web avec GPT Researcher."""
    try:
        import sys, pkgutil, importlib, langchain_classic
        for _, modname, _ in pkgutil.walk_packages(langchain_classic.__path__, langchain_classic.__name__ + '.'):
            if not modname.startswith('langchain_classic.tests'):
                short = modname.replace('langchain_classic.', 'langchain.')
                try:
                    sys.modules[short] = importlib.import_module(modname)
                except Exception:
                    pass

        from gpt_researcher import GPTResearcher
        print(f"   Recherche GPT-Researcher lancée pour: {query}")
        researcher = GPTResearcher(query=query, report_type="research_report")
        await researcher.conduct_research()
        report = await researcher.write_report()
        return report
    except ImportError as e:
        print(f"   ⚠️ gpt-researcher non disponible: {e}. Recherche web ignorée.")
        return ""
    except Exception as e:
        print(f"   ⚠️ Information GPT Researcher: {e}.")
        return ""

def evaluate_rigor_with_ollama(claim_statement: str, evidence_text: str) -> Dict:
    """Évalue la preuve scientifique avec Ollama + ARA Rigor Reviewer Skill."""
    
    if not SKILL_PATH.exists():
        print(f"❌ Skill ARA introuvable: {SKILL_PATH}")
        return {"score": "Reject", "justification": "Skill ARA manquant"}
        
    system_prompt = SKILL_PATH.read_text(encoding="utf-8")
    
    # Nous forçons la sortie en un format simple pour parser la décision
    instruction = f"""
Voici une affirmation scientifique que nous voulons prouver:
"{claim_statement}"

Voici l'évidence trouvée (abstract ou rapport):
---
{evidence_text}
---

Applique tes règles d'évaluation épistémique (ARA Rigor Reviewer) et donne ton verdict final de façon STRICTE.
Ton message DOIT se terminer par une des balises suivantes:
[VERDICT: STRONG ACCEPT] (Si la preuve est rigoureuse, mathématiquement/empiriquement solide et correspond parfaitement)
[VERDICT: ACCEPT] (Si la preuve est valide mais nécessite plus de contexte)
[VERDICT: REJECT] (Si la preuve est faible, biaisée, ou ne correspond pas à l'affirmation)

Justifie d'abord ton évaluation en quelques lignes, puis donne le verdict.
"""
    
    payload = {
        "model": EVAL_MODEL,
        "prompt": instruction,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_ctx": 8192
        }
    }
    
    try:
        response = requests.post(
            f"{os.environ['OLLAMA_BASE_URL']}/api/generate",
            json=payload,
            timeout=120
        )
        if response.status_code == 200:
            result_text = response.json().get("response", "")
            
            score = "Reject"
            if "[VERDICT: STRONG ACCEPT]" in result_text.upper():
                score = "Strong Accept"
            elif "[VERDICT: ACCEPT]" in result_text.upper():
                score = "Accept"
                
            return {"score": score, "justification": result_text}
    except Exception as e:
        print(f"   ⚠️ Erreur Ollama: {e}")
        
    return {"score": "Error", "justification": "Erreur d'API"}

def create_evidence_file(claim_key: str, paper: Dict, evaluation: Dict):
    """Crée un fichier Markdown de preuve dans ckg/references/"""
    safe_title = "".join([c if c.isalnum() else "_" for c in paper['title']]).lower()[:50]
    filename = REFERENCES_DIR / f"auto_evidence_{claim_key}_{safe_title}.md"
    
    content = f"""# {paper['title']}

**DOI**: {paper['doi']}
**Année**: {paper['publication_year']}
**Citations**: {paper['cited_by_count']}
**Sujet Appuyé**: `{claim_key}`

## Évaluation ARA Rigor Reviewer
**Score**: {evaluation['score']}

```text
{evaluation['justification'][:1500]}...
```

## Abstract
{paper['abstract']}

> **Note**: Cette preuve a été trouvée et évaluée automatiquement par le Moteur de Preuve G5.
"""
    filename.write_text(content, encoding="utf-8")
    print(f"   ✅ Fichier de preuve créé: {filename.name}")

def extract_keywords_with_ollama(statement: str) -> str:
    """Utilise Ollama pour traduire l'affirmation en mots-clés de recherche académique en anglais."""
    prompt = f"Extract 3 to 5 core academic keywords in English from this statement to use in a literature search. Return ONLY the keywords separated by spaces, no punctuation, no explanations. Statement: {statement}"
    payload = {
        "model": EVAL_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.1, "num_ctx": 2048}
    }
    try:
        response = requests.post(f"{os.environ['OLLAMA_BASE_URL']}/api/generate", json=payload, timeout=30)
        if response.status_code == 200:
            kw = response.json().get("response", "").strip().replace('"', '').replace(',', ' ').replace('\n', ' ')
            print(f"   Mots-clés générés: {kw}")
            return kw
    except Exception as e:
        print(f"   ⚠️ Erreur extraction mots-clés: {e}")
    return statement

async def main():
    import argparse
    parser = argparse.ArgumentParser(description="Moteur de Preuve Scientifique Hybride (G5)")
    parser.add_argument("--claim-key", type=str, help="Clé d'identification de l'affirmation")
    parser.add_argument("--statement", type=str, help="Texte de l'affirmation scientifique")
    parser.add_argument("--force-researcher", action="store_true", help="Forcer l'appel à GPT Researcher")
    args = parser.parse_args()

    print("=" * 60)
    print("🔬 Moteur de Preuve Scientifique Hybride (G5)")
    print("============================================================")
    
    if args.claim_key and args.statement:
        claims = [{"key": args.claim_key, "statement": args.statement}]
    else:
        claims = extract_missing_claims()
        print(f"🔍 Affirmations manquantes identifiées : {len(claims)}")
    
    if not claims:
        print("Toutes les affirmations semblent déjà vérifiées.")
        return
        
    for claim in claims:
        print(f"\nTraitement de l'affirmation [{claim['key']}]")
        print(f"Texte: {claim['statement'][:100]}...")
        
        query = extract_keywords_with_ollama(claim['statement'])
        best_evidence = None
        evidence_eval = None
        
        # 1. Recherche via OpenAlex
        if not args.force_researcher:
            papers = search_openalex(query)
            for p in papers:
                if not p['abstract']:
                    continue
                    
                print(f"   → Évaluation du papier: {p['title'][:60]}...")
                eval_result = evaluate_rigor_with_ollama(claim['statement'], p['abstract'])
                print(f"   → Verdict: {eval_result['score']}")
                
                if eval_result['score'] in ["Strong Accept", "Accept"]:
                    best_evidence = p
                    evidence_eval = eval_result
                    break
                    
        # 2. GPT Researcher (Chasseur autonome)
        if not best_evidence:
            print("   Lancement du Chasseur GPT Researcher pour recherche approfondie...")
            report = await run_gpt_researcher(query)
            if report:
                print(f"   Rapport GPT Researcher obtenu ({len(report)} caractères).")
                print("   → Évaluation du rapport par le Juge (ARA Rigor Reviewer via Ollama)...")
                eval_result = evaluate_rigor_with_ollama(claim['statement'], report)
                print(f"   → Verdict: {eval_result['score']}")
                if eval_result['score'] in ["Strong Accept", "Accept"]:
                    best_evidence = {
                        "title": f"Preuve Empirique Approfondie - {claim['key']}",
                        "doi": "Recherche Hybride Web / OpenAlex",
                        "publication_year": "2024-2026",
                        "cited_by_count": "Synthèse",
                        "abstract": report
                    }
                    evidence_eval = eval_result
                    
        # 3. Création du fichier si valide
        if best_evidence:
            create_evidence_file(claim['key'], best_evidence, evidence_eval)
        else:
            print(f"   ❌ Échec: Impossible de trouver une preuve rigoureuse pour [{claim['key']}].")

if __name__ == "__main__":
    # Vérification que le dossier de sortie existe
    REFERENCES_DIR.mkdir(parents=True, exist_ok=True)
    asyncio.run(main())
