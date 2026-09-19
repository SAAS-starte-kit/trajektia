import json

file_path = 'c:\\Users\\Patrice.DESKTOP-I932PON\\Dev\\saas-ai-starter\\trajektia\\scripts\\generate_career_content.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the interfaces by using {{ and }}
fixed_interfaces = """
export interface OnetWorkStyle {{
  id: string;
  nom: string;
  description: string;
  score: number;
}}

export interface ExigencesPhysiques {{
  posture: string;
  vision: string;
  audition: string;
  levage: string;
  risques_cnesst?: string[];
}}

export interface OffreEmploi {{"""

# We need to replace the badly formatted one if it's there
bad_interface = """
export interface OnetWorkStyle {
  id: string;
  nom: string;
  description: string;
  score: number;
}

export interface ExigencesPhysiques {
  posture: string;
  vision: string;
  audition: string;
  levage: string;
  risques_cnesst?: string[];
}

export interface OffreEmploi {"""

content = content.replace(bad_interface, fixed_interfaces)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fix OK")
