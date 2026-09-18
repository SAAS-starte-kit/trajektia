#!/usr/bin/env python3
"""
Test de connexion à l'API Adzuna (Canada / Québec) pour Trajektia.
Usage:
    python scripts/test_adzuna.py
"""
import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

# Fix Windows console UTF-8 encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

def load_env_file(filepath: Path):
    if not filepath.exists():
        return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v

def main():
    # Charger les .env
    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")
    load_env_file(base_dir.parent / ".env")

    app_id = os.environ.get("ADZUNA_APP_ID")
    app_key = os.environ.get("ADZUNA_APP_KEY")

    print("\n🔍 Vérification des identifiants Adzuna API...")
    print(f"   ADZUNA_APP_ID : {'✅ Présent (' + app_id[:3] + '***)' if app_id else '❌ Manquant'}")
    print(f"   ADZUNA_APP_KEY: {'✅ Présent (' + app_key[:3] + '***)' if app_key else '❌ Manquant'}")

    if not app_id or not app_key:
        print("\n⚠️  Action requise :")
        print("   1. Rendez-vous sur https://developer.adzuna.com/")
        print("   2. Créez un compte gratuit (Free Developer Account)")
        print("   3. Copiez votre App ID et App Key dans le fichier :")
        print(f"      {base_dir / '.env'}")
        print("\n   Exemple :")
        print("   ADZUNA_APP_ID=a1b2c3d4")
        print("   ADZUNA_APP_KEY=9f8e7d6c5b4a3f2e1d0c9b8a")
        print("\n   Puis relancez cette commande : python scripts/test_adzuna.py")
        sys.exit(0)

    # Test d'appel réel vers l'API Adzuna Canada
    query = "Développeur de logiciels"
    location = "Québec"
    country = "ca"
    page = 1
    
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/{page}"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": query,
        "where": location,
        "results_per_page": 5,
        "content-type": "application/json"
    }

    full_url = f"{url}?{urllib.parse.urlencode(params)}"
    print(f"\n📡 Interrogation de l'API Adzuna Canada ({query} à {location})...")

    try:
        req = urllib.request.Request(
            full_url,
            headers={"User-Agent": "Trajektia-JobFetcher/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        count = data.get("count", 0)
        results = data.get("results", [])
        mean_salary = data.get("mean", None)

        print(f"\n🎉 Connexion réussie !")
        print(f"   Offres trouvées au Québec : {count}")
        if mean_salary:
            print(f"   Salaire moyen estimé      : {mean_salary:,.0f} $ CAD")
        print(f"   Exemples d'offres récupérées ({len(results)}) :")
        
        for idx, job in enumerate(results[:3], 1):
            title = job.get("title", "Sans titre")
            company = job.get("company", {}).get("display_name", "Entreprise confidentielle")
            place = job.get("location", {}).get("display_name", location)
            salary_min = job.get("salary_min")
            salary_max = job.get("salary_max")
            url_job = job.get("redirect_url", "")
            
            sal_str = ""
            if salary_min and salary_max:
                sal_str = f" | {salary_min:,.0f} $ - {salary_max:,.0f} $"
            elif salary_min:
                sal_str = f" | À partir de {salary_min:,.0f} $"

            print(f"   [{idx}] {title} @ {company} ({place}){sal_str}")
            print(f"       Lien: {url_job[:70]}...")

    except urllib.error.HTTPError as e:
        print(f"\n❌ Erreur HTTP Adzuna ({e.code}) : {e.read().decode('utf-8', errors='ignore')}")
    except Exception as e:
        print(f"\n❌ Erreur de connexion : {e}")

if __name__ == "__main__":
    main()
