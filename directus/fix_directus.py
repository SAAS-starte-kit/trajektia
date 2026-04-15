"""
fix_directus.py — Correctif automatisé via l'API Directus
  1. Configure toutes les collections (retire les triangles oranges)
  2. Limite le keyword search aux colonnes textuelles uniquement
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8055"
EMAIL    = "admin@trajektia.ca"
PASSWORD = "DirectusTrajektiaAdmin2026!"

# ── Collections à configurer + colonnes de recherche autorisées ─────────────
COLLECTIONS = {
    "occupations": {
        "search_fields": ["cnp_code", "title_en", "title_fr"],
        "icon": "work",
        "note": "Professions CNP 2021 — données gouvernementales canadiennes",
    },
    "occupation_job_titles": {
        "search_fields": ["title", "occupation_cnp_code"],
        "icon": "badge",
        "note": "Titres d'emploi alternatifs par profession CNP",
    },
    "occupation_oasis": {
        "search_fields": ["occupation_cnp_code", "oasis_code"],
        "icon": "psychology",
        "note": "Crosswalk CNP 2021 ↔ OaSIS (SIPeC Canada)",
    },
    "occupation_legacy_dpt": {
        "search_fields": ["occupation_cnp_code", "dpt_code", "dpt_title_en", "dpt_title_fr"],
        "icon": "history_edu",
        "note": "Manuel des professions 2016 — RIASEC & aptitudes",
    },
    "oasis_descriptors": {
        "search_fields": ["oasis_code", "name_en", "name_fr", "category_code"],
        "icon": "category",
        "note": "Descripteurs OaSIS 2025",
    },
    "occupation_requirements": {
        "search_fields": ["occupation_cnp_code", "requirement_type", "requirement_text"],
        "icon": "checklist",
        "note": "Exigences d'emploi par profession",
    },
    "occupation_exclusions": {
        "search_fields": ["occupation_cnp_code", "exclusion_text"],
        "icon": "block",
        "note": "Exclusions de professions CNP",
    },
    "cnp_concordance_2016_2021": {
        "search_fields": ["cnp_2016_code", "cnp_2021_code", "cnp_2016_title_en", "cnp_2021_title_en"],
        "icon": "swap_horiz",
        "note": "Table de concordance CNP 2016 ↔ CNP 2021",
    },
    "cnp_hierarchy": {
        "search_fields": ["code", "name_fr", "name_en", "description_fr", "description_en"],
        "icon": "account_tree",
        "note": "Hiérarchie structurelle de la CNP 2021 (5 niveaux)",
    },
    "oasis_work_environments": {
        "search_fields": ["oasis_code", "name_fr", "name_en"],
        "icon": "business",
        "note": "Référentiel des milieux de travail OaSIS",
    },
    "occupation_work_environments": {
        "search_fields": ["occupation_cnp_code", "oasis_code"],
        "icon": "link",
        "note": "Liaison Occupations ↔ Milieux de travail OaSIS",
    },
}

sess = requests.Session()
sess.headers.update({"Content-Type": "application/json"})


def log(msg, ok=True):
    icon = "[OK]" if ok else "[ERR]"
    print(f"  {icon}  {msg}")


def authenticate():
    r = sess.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
    if r.status_code != 200:
        print(f"❌ Auth failed: {r.status_code} {r.text}")
        sys.exit(1)
    token = r.json()["data"]["access_token"]
    sess.headers.update({"Authorization": f"Bearer {token}"})
    print("[OK] Authentifie sur Directus\n")


def list_existing_collections():
    r = sess.get(f"{BASE_URL}/collections")
    if r.status_code == 200:
        return {c["collection"] for c in r.json().get("data", [])}
    return set()


def configure_collection(name, info, existing):
    """Créer la collection dans Directus si elle n'existe pas encore (retire triangle orange)."""
    payload = {
        "collection": name,
        "meta": {
            "icon":       info.get("icon", "table_chart"),
            "note":       info.get("note", ""),
            "hidden":     False,
            "singleton":  False,
        },
        "schema": {},   # Indique à Directus que la table existe déjà en DB
    }

    if name in existing:
        # Mise à jour des métadonnées uniquement
        r = sess.patch(f"{BASE_URL}/collections/{name}", json={"meta": payload["meta"]})
        if r.status_code in (200, 204):
            log(f"{name} — métadonnées mises à jour")
        else:
            log(f"{name} — PATCH méta échoué ({r.status_code}): {r.text[:200]}", ok=False)
    else:
        # Création (configure la collection non gérée)
        r = sess.post(f"{BASE_URL}/collections", json=payload)
        if r.status_code in (200, 204):
            log(f"{name} — configurée (triangle orange retiré)")
        else:
            log(f"{name} — création échouée ({r.status_code}): {r.text[:200]}", ok=False)


def get_fields(collection):
    r = sess.get(f"{BASE_URL}/fields/{collection}")
    if r.status_code == 200:
        return [f["field"] for f in r.json().get("data", [])]
    return []


def set_search_fields(collection, desired_fields):
    """Mettre à jour chaque champ : search=True si dans la liste, sinon False."""
    actual_fields = get_fields(collection)
    if not actual_fields:
        log(f"{collection} — aucun champ trouvé, skip", ok=False)
        return

    # Active la recherche sur les champs textuels désirés (s'ils existent)
    enabled = [f for f in desired_fields if f in actual_fields]
    disabled = [f for f in actual_fields if f not in desired_fields]

    errors = 0

    for field in enabled:
        r = sess.patch(
            f"{BASE_URL}/fields/{collection}/{field}",
            json={"meta": {"search": True}},
        )
        if r.status_code not in (200, 204):
            # Certains champs système n'ont pas de méta modifiable — on ignore silencieusement
            pass

    for field in disabled:
        r = sess.patch(
            f"{BASE_URL}/fields/{collection}/{field}",
            json={"meta": {"search": False}},
        )
        # Ignore les erreurs sur les champs système

    log(f"{collection} — recherche limitée à: {enabled}")


def verify_search(collection, query):
    """Teste une recherche pour vérifier l'absence de crash 500."""
    r = sess.get(f"{BASE_URL}/items/{collection}", params={"search": query, "limit": 5})
    if r.status_code == 200:
        count = len(r.json().get("data", []))
        log(f"Recherche '{query}' dans {collection} -> {count} resultat(s) OK")
    else:
        log(f"Recherche '{query}' dans {collection} -> HTTP {r.status_code}: {r.text[:150]}", ok=False)


# ══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print(" DIRECTUS FIX - Collections & Keyword Search")
    print("=" * 60 + "\n")

    authenticate()

    existing = list_existing_collections()
    print(f"> {len(existing)} collection(s) deja connues de Directus\n")

    print("--- Phase 1 : Configuration des collections ---------------")
    for name, info in COLLECTIONS.items():
        configure_collection(name, info, existing)

    print("\n--- Phase 2 : Limitation du keyword search ----------------")
    for name, info in COLLECTIONS.items():
        set_search_fields(name, info["search_fields"])

    print("\n--- Phase 3 : Verification recherche ----------------------")
    verify_search("occupations",          "41321")
    verify_search("occupation_job_titles", "infirmier")

    print("\n" + "=" * 60)
    print(" TERMINE - rechargez Directus (F5) pour voir les corrections.")
    print("=" * 60 + "\n")
