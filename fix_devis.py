import json

filepath = r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia\apps\frontend\src\data\programmes-devis.json"

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

data["145.A0"] = {
    "code": "145.A0",
    "nom": "Techniques de santé animale",
    "type": "DEC technique (3 ans)",
    "description": "Ce programme forme des technologues capables d'assister les médecins vétérinaires dans leurs tâches cliniques et de recherche.",
    "objectives": "Maîtriser les soins aux animaux, l'assistance chirurgicale et les analyses de laboratoire.",
    "competencies": [],
    "cegeps_offreurs": []
}

data["410.A1"] = {
    "code": "410.A1",
    "nom": "Gestion des opérations et de la chaîne logistique",
    "type": "DEC technique (3 ans)",
    "description": "Ce programme prépare à coordonner et optimiser les flux de marchandises et d'informations dans la chaîne logistique.",
    "objectives": "Maîtriser la gestion des stocks, l'approvisionnement et le transport logistique.",
    "competencies": [],
    "cegeps_offreurs": []
}

data["200.C0"] = {
    "code": "200.C0",
    "nom": "Sciences informatiques et mathématiques",
    "type": "DEC préuniversitaire (2 ans)",
    "description": "Ce programme préuniversitaire intègre la programmation, les mathématiques et la physique pour préparer aux études universitaires en informatique et génie logiciel.",
    "objectives": "Développer une pensée algorithmique et maîtriser les fondements mathématiques de l'informatique.",
    "competencies": [],
    "cegeps_offreurs": []
}

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    
print("Successfully injected 145.A0, 410.A1, 200.C0 into programmes-devis.json")
