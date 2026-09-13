import requests
import os
import json
from pathlib import Path

# --- Configuration ---
DATASET_ID = "10ce43bd-fb58-4969-806b-4bffebc87bec"
API_BASE = "https://open.canada.ca/data/api/3/action"
OUTPUT_DIR = Path("data/raw/sipec")

def setup_environment():
    """Crée les dossiers nécessaires s'ils n'existent pas."""
    print(f"📁 Initialisation du répertoire: {OUTPUT_DIR}")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def fetch_resources():
    """Récupère la liste des ressources du dataset via l'API package_show."""
    print(f"📡 Connexion à l'API Canada pour le dataset: {DATASET_ID}...")
    try:
        resp = requests.get(f"{API_BASE}/package_show", params={"id": DATASET_ID}, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("success"):
            print("❌ Erreur API: Le dataset est introuvable.")
            return []
        
        resources = data["result"]["resources"]
        print(f"✅ {len(resources)} ressources totales identifiées.")
        return resources
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return []

def download_resource(resource):
    """Télécharge une ressource SIPeC (FR) ou OaSIS (EN)."""
    fmt = resource.get("format", "").upper()
    url = resource.get("url", "")
    
    if fmt != "CSV":
        return False
    
    # Déterminer la langue
    is_fr = "sipec" in url or "-fr" in url
    is_en = "oasis" in url or "-en" in url
    lang_tag = "fr" if is_fr else "en" if is_en else None

    if not lang_tag:
        return False

    # Extraire et nettoyer le nom du fichier
    filename_raw = url.split("/download/")[-1].split("?")[0]
    
    # On force un nom structuré pour l'ingestion future
    # Exemple: competences_sipec_2025_v1.1_fr.csv
    name_clean = filename_raw.replace(".csv", "")
    filename = f"{name_clean}_{lang_tag}.csv"

    target_path = OUTPUT_DIR / filename
    
    print(f"⬇️ [{lang_tag.upper()}] Téléchargement: {filename}...")
    try:
        dl = requests.get(url, stream=True, timeout=30)
        dl.raise_for_status()
        with open(target_path, "wb") as f:
            for chunk in dl.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ Prêt.")
        return True
    except Exception as e:
        print(f"⚠️ Échec: {e}")
        return False

def main():
    setup_environment()
    resources = fetch_resources()
    
    if not resources:
        return

    count = 0
    for r in resources:
        if download_resource(r):
            count += 1
            
    print(f"\n✨ Opération terminée : {count} fichiers récupérés (Bilingue).")
    print(f"🚀 Dossier destination : {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
