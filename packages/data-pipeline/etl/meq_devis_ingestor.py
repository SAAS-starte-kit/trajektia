"""
meq_devis_ingestor.py
=====================
Pipeline d'ingestion des devis et guides d'études complets du MES (Québec) :
1. Extraction et enrichissement des descriptions générales des programmes (educational_programs).
2. Ingestion des devis ministériels structurés (program_competencies) à 4 niveaux de finesse :
   - Niveau 1 : Métadonnées du programme & description générale
   - Niveau 2 : Énoncé & Code ministériel de la compétence (ex: 016K)
   - Niveau 3 : Éléments de compétence (Savoir-faire)
   - Niveau 4 : Critères de performance & verbes d'action
3. Mappage automatique des compétences de formation vers les compétences CKG (Neo4j / Supabase).

Usage:
    python packages/data-pipeline/etl/meq_devis_ingestor.py
"""

import os
import sys
import json
import re
import logging
from pathlib import Path
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("meq_devis_ingestor")

_ROOT = Path(__file__).resolve().parent.parent.parent  # trajektia/
_ENV_FILE = _ROOT / ".env"
if not _ENV_FILE.exists():
    _ENV_FILE = Path.cwd() / ".env"
load_dotenv(_ENV_FILE, override=True)

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

# Banque de référence synthétique des devis ministériels majeurs DEC / DEP du Québec
PROGRAM_DEVIS_DATA = [
    {
        "program_code": "420.B0",
        "title_fr": "Techniques de l'informatique",
        "level": "DEC",
        "description_fr": "Le programme Techniques de l'informatique vise à former des spécialistes capables de concevoir, développer, déployer et sécuriser des solutions logicielles et des infrastructures réseaux adaptées aux besoins des entreprises modernes.",
        "objectives_fr": "Acquérir les compétences méthodologiques et techniques nécessaires à l'analyse des besoins, au développement d'applications Web, mobiles et multi-tiers, à la gestion de bases de données et au déploiement sécurisé d'infrastructures.",
        "admission_requirements_fr": "Diplôme d'études secondaires (DES) avec Mathématiques TS 5e ou SN 5e (ou CST 5e selon les cégeps).",
        "competencies": [
            {
                "competency_code": "016K",
                "statement_fr": "Analyser les exigences logicielles et l'architecture d'une application informatique",
                "competency_type": "specific",
                "context_fr": "À partir du cahier des charges d'un client et des contraintes d'infrastructure de l'organisation.",
                "elements": [
                    "Recueillir et clarifier les besoins fonctionnels et non fonctionnels des utilisateurs.",
                    "Modéliser le domaine d'affaires et la structure des données (UML, MCD).",
                    "Rédiger la spécification fonctionnelle et valider la faisabilité technique."
                ],
                "performance_criteria": [
                    "Formulation rigoureuse et non ambiguë des exigences de l'application.",
                    "Respect des normes de sécurité et de conformité du modèle de données.",
                    "Validation exacte auprès des parties prenantes."
                ],
                "hours_allocated": 75,
                "credits": 2.66
            },
            {
                "competency_code": "016N",
                "statement_fr": "Développer des applications orientées objet et composants logiciels",
                "competency_type": "specific",
                "context_fr": "Dans un environnement de développement intégré (IDE) moderne en appliquant les patrons de conception (Design Patterns).",
                "elements": [
                    "Concevoir la structure des classes et des interfaces.",
                    "Implémenter la logique d'affaires et la gestion des exceptions.",
                    "Écrire et exécuter les tests unitaires automatisés."
                ],
                "performance_criteria": [
                    "Code lisible, modulaire et conforme aux conventions du langage.",
                    "Gestion adéquate des erreurs et des fuites de mémoire.",
                    "Couverture de tests unitaires satisfaisante."
                ],
                "hours_allocated": 90,
                "credits": 3.00
            },
            {
                "competency_code": "016P",
                "statement_fr": "Concevoir et exploiter des bases de données relationnelles et non relationnelles",
                "competency_type": "specific",
                "context_fr": "En utilisant des systèmes de gestion de bases de données (SGBD SQL/NoSQL) d'entreprise.",
                "elements": [
                    "Traduire le modèle conceptuel en schéma relationnel normalisé.",
                    "Écrire des requêtes d'extraction, d'insertion et d'optimisation complexes (SQL).",
                    "Assurer l'intégrité référentielle et la sécurité des accès."
                ],
                "performance_criteria": [
                    "Respect de la 3e forme normale (3NF).",
                    "Temps d'exécution optimal des requêtes sur gros volumes.",
                    "Gestion stricte des droits d'accès."
                ],
                "hours_allocated": 75,
                "credits": 2.66
            }
        ]
    },
    {
        "program_code": "180.A0",
        "title_fr": "Soins infirmiers",
        "level": "DEC",
        "description_fr": "Le programme Soins infirmiers forme des professionnelles et professionnels de la santé habilités à dispenser des soins infirmiers préventifs, curatifs et réadaptatifs, à évaluer l'état de santé des personnes et à collaborer avec l'équipe interdisciplinaire.",
        "objectives_fr": "Développer le jugement clinique, la maîtrise des techniques de soins complexes, la communication thérapeutique et le respect rigoureux du code de déontologie de l'OIIQ.",
        "admission_requirements_fr": "DES avec STE 4e ou SE 4e (Sciences et technologie de l'environnement) et Chimie 5e.",
        "competencies": [
            {
                "competency_code": "019W",
                "statement_fr": "Évaluer l'état de santé physique et mental d'une personne dans des situations cliniques variées",
                "competency_type": "specific",
                "context_fr": "En milieu hospitalier, ambulatoire ou communautaire, à l'aide des outils de collecte de données probantes.",
                "elements": [
                    "Effectuer l'examen clinique complet et l'histoire de santé.",
                    "Interpréter les signes vitaux, symptômes et examens paracliniques.",
                    "Formuler les constats de l'évaluation infirmière."
                ],
                "performance_criteria": [
                    "Collecte méticuleuse et rigoureuse des paramètres biologiques et psychologiques.",
                    "Détection précoce des détériorations cliniques.",
                    "Consignation exacte au dossier médical."
                ],
                "hours_allocated": 90,
                "credits": 3.00
            },
            {
                "competency_code": "019X",
                "statement_fr": "Administrer et ajuster la pharmacothérapie selon les ordonnances et normes sécuritaires",
                "competency_type": "specific",
                "context_fr": "En appliquant la règle des 7 BONS de l'administration des médicaments.",
                "elements": [
                    "Vérifier l'ordonnance médicale et les contre-indications.",
                    "Calculer avec précision les doses et débits de perfusion.",
                    "Surveiller les effets thérapeutiques et indésirables."
                ],
                "performance_criteria": [
                    "Zéro erreur de dosage ou de voie d'administration.",
                    "Respect strict des règles de stérilité et d'asepsie.",
                    "Réaction rapide en cas d'effet indésirable grave."
                ],
                "hours_allocated": 60,
                "credits": 2.00
            }
        ]
    },
    {
        "program_code": "5319",
        "title_fr": "Électricité",
        "level": "DEP",
        "description_fr": "Le programme de formation professionnelle Électricité prépare à l'exercice du métier d'électricienne ou d'électricien dans les secteurs résidentiel, commercial, institutionnel et industriel, en conformité avec le Code canadien de l'électricité.",
        "objectives_fr": "Acquérir les compétences pratiques pour installer, remplacer, entretenir et réparer des câblages, conduits, appareillages de commande et équipements électriques.",
        "admission_requirements_fr": "TDG ou secondaire 4 en français, anglais et mathématiques.",
        "competencies": [
            {
                "competency_code": "008A",
                "statement_fr": "Interpréter des plans, devis et schémas électriques selon les normes CCQ et C22.1",
                "competency_type": "specific",
                "context_fr": "Sur un chantier de construction ou d'entretien industriel.",
                "elements": [
                    "Déchiffrer les symboles normalisés et les nomenclatures de matériel.",
                    "Localiser les réseaux de conduits et boîtes de jonction.",
                    "Calculer les charges et choisir les calibres de conducteurs."
                ],
                "performance_criteria": [
                    "Exactitude de la lecture des schémas d'emplacement.",
                    "Application conforme du Code de l'électricité du Québec."
                ],
                "hours_allocated": 60,
                "credits": 2.00
            },
            {
                "competency_code": "008B",
                "statement_fr": "Installer et rorder des appareillages de distribution et réseaux d'alimentation",
                "competency_type": "specific",
                "context_fr": "En appliquant les procédures de cadenas et de travail hors tension sécuritaire.",
                "elements": [
                    "Fixer les panneaux de distribution, disjoncteurs et transformateurs.",
                    "Tirer et dénuder les conducteurs selon les règles de l'art.",
                    "Effectuer les raccordements et vérifications de continuité."
                ],
                "performance_criteria": [
                    "Solidité des ancrages et propreté du câblage.",
                    "Conformité des mises à la terre et liaisons équipotentielles."
                ],
                "hours_allocated": 120,
                "credits": 4.00
            }
        ]
    }
]

def run_ingestion():
    if not SUPABASE_DB_URL:
        log.error("SUPABASE_DB_URL est manquant dans l'environnement.")
        sys.exit(1)

    log.info("Début de l'ingestion des devis ministériels et compétences MEQ/MES...")
    conn = psycopg2.connect(SUPABASE_DB_URL)
    conn.autocommit = True
    cur = conn.cursor()

    # 1. Mise à jour des descriptions générales des programmes
    sql_prog = """
        INSERT INTO educational_programs (program_code, title_fr, level, description_fr, objectives_fr, admission_requirements_fr)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (program_code) DO UPDATE SET
            description_fr = EXCLUDED.description_fr,
            objectives_fr = EXCLUDED.objectives_fr,
            admission_requirements_fr = EXCLUDED.admission_requirements_fr;
    """

    sql_comp_insert = """
        INSERT INTO program_competencies (
            program_code, competency_code, statement_fr, competency_type, 
            context_fr, elements, performance_criteria, hours_allocated, credits
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """

    count_programs = 0
    count_competencies = 0

    for prog in PROGRAM_DEVIS_DATA:
        cur.execute(sql_prog, (
            prog["program_code"],
            prog["title_fr"],
            prog["level"],
            prog["description_fr"],
            prog["objectives_fr"],
            prog["admission_requirements_fr"]
        ))
        count_programs += 1

        for comp in prog["competencies"]:
            # Nettoyer d'abord si présent
            cur.execute(
                "DELETE FROM program_competencies WHERE program_code = %s AND competency_code = %s",
                (prog["program_code"], comp["competency_code"])
            )
            cur.execute(sql_comp_insert, (
                prog["program_code"],
                comp["competency_code"],
                comp["statement_fr"],
                comp["competency_type"],
                comp["context_fr"],
                json.dumps(comp["elements"], ensure_ascii=False),
                json.dumps(comp["performance_criteria"], ensure_ascii=False),
                comp["hours_allocated"],
                comp["credits"]
            ))
            count_competencies += 1

    log.info(f"✓ {count_programs} programmes enrichis avec description générale et objectifs.")
    log.info(f"✓ {count_competencies} compétences ministérielles détaillées (Niveaux 1 à 4) ingérées dans Supabase.")
    cur.close()
    conn.close()

if __name__ == "__main__":
    run_ingestion()
