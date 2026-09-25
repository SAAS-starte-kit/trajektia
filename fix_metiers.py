import re

filepath = r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia\apps\frontend\src\data\metiers.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Using regex to find the formations block under "32104"
# We know it looks like:
# "formations": [
#   {
#     "type": "DEC",
#     "titre": "DEC technique en santé",
#     "duree": "3 ans (Cégep)",
#     "description": "Programme collégial technique combinant formation pratique en laboratoire, stages et préparation directe au rôle de Technologues en santé animale et techniciens vétérinaires.",
#     "lien_interne": "/dec-prealables"
#   },
#   {
#     "type": "DEP",
#     "titre": "DEP spécialisé du secteur santé",
#     "duree": "1 à 2 ans (CFP)",
#     "description": "Formation professionnelle diplômante reconnue par le Ministère de l'Éducation pour l'accès direct au marché du travail québécois.",
#     "lien_interne": "/dep"
#   }
# ]

pattern = re.compile(r'"formations":\s*\[\s*\{\s*"type":\s*"DEC",\s*"titre":\s*"DEC technique en santé"[\s\S]*?"lien_interne":\s*"/dep"\s*\}\s*\]')

replacement = """"formations": [
      {
        "type": "DEC",
        "titre": "145.A0 — Techniques de santé animale",
        "duree": "3 ans (Cégep)",
        "description": "Programme collégial technique combinant formation pratique en laboratoire, stages et préparation directe au rôle de Technologue en santé animale.",
        "lien_interne": "/programmes/145-a0-techniques-de-sante-animale"
      }
    ]"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated formations for CNP 32104 in metiers.ts using regex")
else:
    print("Regex pattern not found in metiers.ts")
