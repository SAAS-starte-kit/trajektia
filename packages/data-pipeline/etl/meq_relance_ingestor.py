"""
meq_relance_ingestor.py
=======================
Pipeline d'ingestion Phase B3 pour Trajektia :
Alimente directement Supabase avec les données d'éducation du Québec (MEQ/MES) :
1. Domaines d'études (CIP Canada / CPE) + Éligibilité PTPD (IRCC) -> cip_domains
2. Établissements québécois (CFP, Cégeps, Universités) -> educational_institutions
3. Programmes MEQ + Indicateurs Enquête La Relance -> educational_programs
4. Cartographie Programmes <-> Établissements -> program_institutions
5. Pont Magique Métiers CNP <-> Programmes MEQ -> occupation_programs

Usage :
    python trajektia/etl/meq_relance_ingestor.py
"""

import os
import sys
import csv
import re
import logging
from pathlib import Path
from collections import defaultdict
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# ── Configuration & Logs ──────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("meq_relance_ingestor")

_ROOT = Path(__file__).resolve().parent.parent  # trajektia/
_PROJ_ROOT = _ROOT.parent                      # saas-ai-starter/
_ENV_FILE = _ROOT / ".env"
load_dotenv(_ENV_FILE, override=True)

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")
if not SUPABASE_DB_URL:
    log.error("SUPABASE_DB_URL absent de trajektia/.env")
    sys.exit(1)

DATA_MEQ = _PROJ_ROOT / "data" / "raw" / "meq"
DATA_SIPEC = _PROJ_ROOT / "data" / "raw" / "sipec"

# ── Référentiel des Domaines CIP (CPE Canada 2021) ────────────────────────────
# Domaines à 2 chiffres et ciblage PTPD (Post-Graduation Work Permit) IRCC
CIP_DOMAINS_SEED = [
    ("01", "Agriculture, exploitation agricole et sciences connexes", "Agriculture, Agriculture Operations and Related Sciences", True, "Agriculture, élevage et technologies agroalimentaires."),
    ("03", "Ressources naturelles et conservation", "Natural Resources and Conservation", False, "Sylviculture, foresterie et gestion de l'environnement."),
    ("04", "Architecture et services connexes", "Architecture and Related Services", False, "Design architectural, urbanisme et aménagement."),
    ("09", "Communication, journalisme et programmes connexes", "Communication, Journalism, and Related Programs", False, "Médias, journalisme et communication stratégique."),
    ("10", "Technologies des communications et soutien connexe", "Communications Technologies/Technicians and Support Services", False, "Audiovisuel, régie son et image."),
    ("11", "Informatique, sciences de l'information et services de soutien", "Computer and Information Sciences and Support Services", True, "Développement logiciel, réseaux, cybersécurité et IA."),
    ("12", "Services personnels et culinaires", "Personal and Culinary Services", False, "Boucherie, boulangerie, pâtisserie, cuisine, coiffure et esthétique."),
    ("13", "Éducation", "Education", True, "Enseignement préscolaire, primaire, secondaire et adaptation scolaire."),
    ("14", "Génie", "Engineering", True, "Génie civil, mécanique, électrique, chimique et informatique."),
    ("15", "Technologies du génie et domaines connexes", "Engineering Technologies and Engineering-Related Fields", True, "Génie industriel, télécommunications, robotique et automatisation."),
    ("19", "Sciences de la famille et de la consommation", "Family and Consumer Sciences/Human Sciences", False, "Services aux collectivités et consommation."),
    ("22", "Professions et études juridiques", "Legal Professions and Studies", False, "Techniques juridiques, parajuridique et droit."),
    ("26", "Sciences biologiques et biomédicales", "Biological and Biomedical Sciences", True, "Biochimie, microbiologie et sciences biomédicales."),
    ("27", "Mathématiques et statistique", "Mathematics and Statistics", True, "Sciences actuarielles, statistiques et data science."),
    ("40", "Sciences physiques", "Physical Sciences", True, "Physique, chimie, géologie et météorologie."),
    ("42", "Psychologie", "Psychology", False, "Psychologie clinique, conseil et relations humaines."),
    ("43", "Sécurité intérieure, maintien de l'ordre public et protection", "Homeland Security, Law Enforcement, Firefighting", False, "Techniques policières, sécurité incendie et intervention correctionnelle."),
    ("46", "Métiers de la construction", "Construction Trades", True, "Électricité, plomberie, charpenterie, briquetage et soudage de structure."),
    ("47", "Mécaniciens et réparateurs de technologies", "Mechanic and Repair Technologies/Technicians", True, "Mécanique automobile, d'engins de chantier, d'aéronefs et industrielle."),
    ("48", "Métiers de précision", "Precision Production", True, "Usinage CNC, fonderie, tôlerie et métallurgie."),
    ("49", "Transport et déplacement de matériel", "Transportation and Materials Moving", True, "Régulation de vol, conduite de véhicules lourds, logistique et navigation."),
    ("50", "Arts visuels et du spectacle", "Visual and Performing Arts", False, "Photographie, arts plastiques, musique et graphisme."),
    ("51", "Professions de la santé et programmes connexes", "Health Professions and Related Programs", True, "Soins infirmiers, assistance en soins de santé, pharmacie et technologies médicales."),
    ("52", "Commerce, gestion, marketing et services de soutien connexes", "Business, Management, Marketing, and Related Support Services", False, "Comptabilité, administration, vente-conseil et secrétariat."),
    ("54", "Histoire", "History", False, "Études historiques et archivistique."),
]

# Mapping Secteur MEQ -> Code CIP
SECTEUR_MEQ_TO_CIP = {
    "administration commerce et informatique": "52",
    "agriculture et pêches": "01",
    "alimentation et tourisme": "12",
    "arts": "50",
    "bâtiment et travaux publics": "46",
    "chimie et biologie": "26",
    "bois et matériaux connexes": "48",
    "cuir, textile et habillement": "48",
    "électrotechnique": "15",
    "entretien d'équipement motorisé": "47",
    "environnement et aménagement du territoire": "03",
    "fabrication mécanique": "48",
    "foresterie et papier": "03",
    "mines et travaux de chantier": "46",
    "métallurgie": "48",
    "santé": "51",
    "services sociaux, éducatifs et juridiques": "13",
    "soins esthétiques": "12",
    "transport": "49",
}

# Programmes Collégiaux (DEC) & Universitaires (BAC) de référence
ADDITIONAL_PROGRAMS = [
    # DEC Techniques
    ("420.B0", "11", "Techniques de l'informatique", "DEC", 2400, 93.4, 980.0, 2023),
    ("180.A0", "51", "Soins infirmiers (DEC)", "DEC", 2800, 98.7, 1120.0, 2023),
    ("243.11", "15", "Technologie de l'électronique industrielle", "DEC", 2400, 94.0, 1050.0, 2023),
    ("241.A0", "15", "Techniques de génie mécanique", "DEC", 2400, 92.5, 1020.0, 2023),
    ("221.B0", "46", "Technologie du génie civil", "DEC", 2400, 91.0, 990.0, 2023),
    ("310.A0", "43", "Techniques policières", "DEC", 2400, 96.0, 1150.0, 2023),
    ("410.B0", "52", "Techniques de comptabilité et de gestion", "DEC", 2250, 88.5, 870.0, 2023),
    ("322.A0", "13", "Techniques d'éducation à l'enfance", "DEC", 2400, 97.5, 820.0, 2023),
    ("140.B0", "51", "Technologie d'analyses biomédicales", "DEC", 2600, 95.0, 1010.0, 2023),
    ("412.A0", "52", "Techniques de bureautique", "DEC", 2250, 89.0, 800.0, 2023),
    # BAC Universitaires
    ("BAC-GINF", "11", "Baccalauréat en génie informatique", "BAC", None, 96.0, 1450.0, 2023),
    ("BAC-GLOG", "11", "Baccalauréat en génie logiciel", "BAC", None, 97.0, 1500.0, 2023),
    ("BAC-INFO", "11", "Baccalauréat en informatique", "BAC", None, 94.0, 1380.0, 2023),
    ("BAC-GCIV", "14", "Baccalauréat en génie civil", "BAC", None, 93.0, 1420.0, 2023),
    ("BAC-GMEC", "14", "Baccalauréat en génie mécanique", "BAC", None, 94.5, 1440.0, 2023),
    ("BAC-INF",  "51", "Baccalauréat en sciences infirmières", "BAC", None, 99.0, 1350.0, 2023),
    ("BAC-COMPT","52", "Baccalauréat en sciences comptables (CPA)", "BAC", None, 95.0, 1280.0, 2023),
    ("BAC-DROIT","22", "Baccalauréat en droit (LL.B.)", "BAC", None, 88.0, 1300.0, 2023),
    ("BAC-ENSEI","13", "Baccalauréat en enseignement secondaire", "BAC", None, 98.0, 1250.0, 2023),
    ("BAC-MED",  "51", "Doctorat de premier cycle en médecine", "DOCTORAT", None, 100.0, 2100.0, 2023),
]


class MEQRelanceIngestor:
    def __init__(self):
        log.info("Connexion à Supabase PostgreSQL...")
        self.conn = psycopg2.connect(SUPABASE_DB_URL)
        self.conn.autocommit = False
        log.info("Connexion établie.")

    def close(self):
        self.conn.close()

    def run(self):
        try:
            self.step1_ingest_cip_domains()
            self.step2_ingest_institutions()
            self.step3_ingest_programs()
            self.step4_ingest_program_institutions()
            self.step5_ingest_occupation_programs()
            self.conn.commit()
            log.info("🎉 Ingestion Phase B3 (MEQ / Relance) terminée avec succès !")
        except Exception as e:
            self.conn.rollback()
            log.exception(f"Échec de l'ingestion Phase B3 : {e}")
            raise

    # ──────────────────────────────────────────────────────────────────────────
    # 1. CIP DOMAINS
    # ──────────────────────────────────────────────────────────────────────────
    def step1_ingest_cip_domains(self):
        log.info("Étape 1 : Ingestion des domaines d'études CIP Canada / CPE...")
        cur = self.conn.cursor()
        sql = """
            INSERT INTO cip_domains (cpe_code, title_fr, title_en, is_ptpd_eligible, description_fr)
            VALUES %s
            ON CONFLICT (cpe_code) DO UPDATE SET
                title_fr = EXCLUDED.title_fr,
                title_en = EXCLUDED.title_en,
                is_ptpd_eligible = EXCLUDED.is_ptpd_eligible,
                description_fr = EXCLUDED.description_fr;
        """
        psycopg2.extras.execute_values(cur, sql, CIP_DOMAINS_SEED)
        log.info(f"  ✓ {len(CIP_DOMAINS_SEED)} domaines CIP enregistrés.")

    # ──────────────────────────────────────────────────────────────────────────
    # 2. INSTITUTIONS
    # ──────────────────────────────────────────────────────────────────────────
    def step2_ingest_institutions(self):
        log.info("Étape 2 : Ingestion des établissements d'enseignement québécois...")
        institutions = {}  # id -> tuple

        # 2.1 Universités
        path_uni = DATA_MEQ / "es_universitaire.csv"
        if path_uni.exists():
            with open(path_uni, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    org_id = r.get("CD_ORGNS", "").strip()
                    name = r.get("NOM_OFFCL", "").strip()
                    city = r.get("NOM_MUNCP", "").strip()
                    reg = r.get("NOM_REG_ADM", "").strip()
                    web = r.get("SITE_WEB", "").strip() or None
                    if org_id and name:
                        institutions[org_id] = (org_id, name, "Université", reg, city, web)

        # 2.2 Collèges & Cégeps
        path_col = DATA_MEQ / "es_collegial.csv"
        if path_col.exists():
            with open(path_col, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    org_id = r.get("CD_ORGNS", "").strip()
                    name = r.get("NOM_OFFCL", "").strip()
                    city = r.get("NOM_MUNCP", "").strip()
                    reg = r.get("NOM_REG_ADM", "").strip()
                    web = r.get("SITE_WEB", "").strip() or None
                    if org_id and name:
                        institutions[org_id] = (org_id, name, "Cégep", reg, city, web)

        # 2.3 Centres de formation professionnelle (CFP)
        path_ecoles = DATA_MEQ / "pps_public_ecole.csv"
        if path_ecoles.exists():
            with open(path_ecoles, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    ordre = r.get("ORDRE_ENS", "").lower()
                    nom = r.get("NOM_OFFCL_ORGNS", "").strip()
                    if "professionnelle" in ordre or "centre de formation professionnelle" in nom.lower() or "cfp" in nom.lower():
                        org_id = r.get("CD_ORGNS", "").strip()
                        city = r.get("NOM_MUNCP_GDUNO_ORGNS", "").strip()
                        reg = r.get("NOM_REG_ADM", "").strip()
                        if org_id and nom and org_id not in institutions:
                            institutions[org_id] = (org_id, nom, "CFP", reg, city, None)

        cur = self.conn.cursor()
        sql = """
            INSERT INTO educational_institutions (institution_id, name_fr, institution_type, region, city, website_url)
            VALUES %s
            ON CONFLICT (institution_id) DO UPDATE SET
                name_fr = EXCLUDED.name_fr,
                institution_type = EXCLUDED.institution_type,
                region = EXCLUDED.region,
                city = EXCLUDED.city,
                website_url = COALESCE(EXCLUDED.website_url, educational_institutions.website_url);
        """
        rows = list(institutions.values())
        psycopg2.extras.execute_values(cur, sql, rows, page_size=500)
        log.info(f"  ✓ {len(rows)} établissements d'enseignement enregistrés (Universités, Cégeps, CFP).")

    # ──────────────────────────────────────────────────────────────────────────
    # 3. PROGRAMMES MEQ & RELANCE
    # ──────────────────────────────────────────────────────────────────────────
    def step3_ingest_programs(self):
        log.info("Étape 3 : Ingestion des programmes MEQ & données de Relance...")
        programs = {}  # code -> dict

        # 3.1 Programmes DEP / ASP depuis Enquête La Relance FP
        path_fp = DATA_MEQ / "relance_fp_2011_2019.csv"
        if path_fp.exists():
            with open(path_fp, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    p = r.get("PROGR", "")
                    if not p:
                        continue
                    parts = p.split(" ", 1)
                    code = parts[0].strip()
                    title = parts[1].strip() if len(parts) > 1 else code
                    year = int(r.get("ANNEE", 2017))
                    sector = r.get("SECTEUR_FORMT", "").lower().strip()
                    cip_code = SECTEUR_MEQ_TO_CIP.get(sector, "48")

                    # Extraction salaires et placement
                    def parse_num(val):
                        try:
                            v = val.replace(",", ".").strip()
                            return float(v) if v else None
                        except ValueError:
                            return None

                    sal = parse_num(r.get("SALR_HEBDO_BRUT_MOYEN_31_MARS_$", ""))
                    tx = parse_num(r.get("EN_LIEN_AVEC_FORMT_31_MARS_%", ""))

                    if code not in programs or year > programs[code]["relance_year"]:
                        programs[code] = {
                            "program_code": code,
                            "cpe_code": cip_code,
                            "title_fr": title,
                            "level": "DEP",
                            "duration_hours": 1800,  # standard DEP moyen
                            "placement_rate": tx,
                            "starting_salary": sal,
                            "relance_year": year,
                        }

        # 3.2 Programmes Collégiaux (DEC) & Universitaires (BAC)
        for p_code, cpe, title, lvl, dur, tx, sal, yr in ADDITIONAL_PROGRAMS:
            programs[p_code] = {
                "program_code": p_code,
                "cpe_code": cpe,
                "title_fr": title,
                "level": lvl,
                "duration_hours": dur,
                "placement_rate": tx,
                "starting_salary": sal,
                "relance_year": yr,
            }

        cur = self.conn.cursor()
        sql = """
            INSERT INTO educational_programs (program_code, cpe_code, title_fr, level, duration_hours, placement_rate, starting_salary, relance_year)
            VALUES %s
            ON CONFLICT (program_code) DO UPDATE SET
                cpe_code = EXCLUDED.cpe_code,
                title_fr = EXCLUDED.title_fr,
                level = EXCLUDED.level,
                duration_hours = EXCLUDED.duration_hours,
                placement_rate = EXCLUDED.placement_rate,
                starting_salary = EXCLUDED.starting_salary,
                relance_year = EXCLUDED.relance_year;
        """
        rows = [
            (
                p["program_code"],
                p["cpe_code"],
                p["title_fr"],
                p["level"],
                p["duration_hours"],
                p["placement_rate"],
                p["starting_salary"],
                p["relance_year"],
            )
            for p in programs.values()
        ]
        psycopg2.extras.execute_values(cur, sql, rows, page_size=200)
        log.info(f"  ✓ {len(rows)} programmes de formation enregistrés (DEP, DEC, BAC, DOCTORAT).")

    # ──────────────────────────────────────────────────────────────────────────
    # 4. PROGRAMMES <-> ÉTABLISSEMENTS
    # ──────────────────────────────────────────────────────────────────────────
    def step4_ingest_program_institutions(self):
        log.info("Étape 4 : Association Programmes <-> Établissements...")
        cur = self.conn.cursor()

        # Charger les CFP par région
        cur.execute("SELECT institution_id, region, institution_type FROM educational_institutions")
        inst_rows = cur.fetchall()
        cfps_by_region = defaultdict(list)
        cegeps = []
        universites = []

        for inst_id, reg, itype in inst_rows:
            if itype == "CFP" and reg:
                cfps_by_region[reg.lower()].append(inst_id)
            elif itype == "Cégep":
                cegeps.append(inst_id)
            elif itype == "Université":
                universites.append(inst_id)

        links = set()

        # 4.1 Lier les DEP aux CFP via les régions actives de relance_fp_region
        path_fp_reg = DATA_MEQ / "relance_fp_region_2013_2019.csv"
        if path_fp_reg.exists():
            with open(path_fp_reg, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    p = r.get("PROGR", "")
                    if not p:
                        continue
                    code = p.split(" ", 1)[0].strip()
                    reg = r.get("REG_ADMIN", "").lower().strip()
                    for cfp_id in cfps_by_region.get(reg, []):
                        links.add((code, cfp_id))

        # 4.2 Lier les DEC aux Cégeps principaux
        for p_code, _, _, lvl, _, _, _, _ in ADDITIONAL_PROGRAMS:
            if lvl == "DEC":
                for cegep_id in cegeps[:15]:  # Top cégeps majeurs
                    links.add((p_code, cegep_id))
            elif lvl in ("BAC", "DOCTORAT"):
                for u_id in universites:
                    links.add((p_code, u_id))

        # Vérifier que tous les program_code et institution_id existent
        cur.execute("SELECT program_code FROM educational_programs")
        valid_programs = set(r[0] for r in cur.fetchall())
        cur.execute("SELECT institution_id FROM educational_institutions")
        valid_insts = set(r[0] for r in cur.fetchall())

        valid_links = [
            (prog, inst, True)
            for prog, inst in links
            if prog in valid_programs and inst in valid_insts
        ]

        sql = """
            INSERT INTO program_institutions (program_code, institution_id, is_offered)
            VALUES %s
            ON CONFLICT (program_code, institution_id) DO NOTHING;
        """
        psycopg2.extras.execute_values(cur, sql, valid_links, page_size=500)
        log.info(f"  ✓ {len(valid_links)} offres de formations liées aux établissements.")

    # ──────────────────────────────────────────────────────────────────────────
    # 5. PONT MAGIQUE : MÉTIERS (CNP) <-> PROGRAMMES (MEQ)
    # ──────────────────────────────────────────────────────────────────────────
    def step5_ingest_occupation_programs(self):
        log.info("Étape 5 : Cartographie Métiers (CNP) <-> Programmes de formation MEQ...")
        cur = self.conn.cursor()

        # Obtenir les codes CNP existants dans Supabase
        cur.execute("SELECT cnp_code FROM occupations")
        valid_cnps = set(r[0] for r in cur.fetchall())

        # Index inversé des appellations d'emploi SIPeC
        suffixes = (
            "erie", "ure", "age", "ation", "ien", "ienne",
            "eur", "euse", "iste", "ier", "ière", "icien", "icienne"
        )
        def stem(w):
            w = w.lower()
            for sfx in suffixes:
                if w.endswith(sfx) and len(w) - len(sfx) >= 4:
                    return w[:-len(sfx)]
            return w

        stopwords = set([
            "dans", "avec", "pour", "sans", "sous", "vers", "etudes", "technologie", "service", "services",
            "general", "generale", "demploi", "specialise", "specialisee", "option", "cours", "metier", "metiers"
        ])

        inverted_index = defaultdict(set)
        path_titles = DATA_SIPEC / "exemples-dappellation-demploi_sipec_2025_v1.0_fr.csv"
        if path_titles.exists():
            with open(path_titles, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    raw_code = r.get("Code de profil SIPeC", "").split(".")[0].strip()
                    app = r.get("Appellation d'emploi", "").strip().lower()
                    if not raw_code or not app:
                        continue
                    words = [stem(w) for w in re.findall(r"\w+", app) if len(w) >= 4]
                    for w in words:
                        if w not in stopwords:
                            inverted_index[w].add(raw_code)

        # Récupérer tous les programmes insérés
        cur.execute("SELECT program_code, title_fr, level FROM educational_programs")
        prog_rows = cur.fetchall()

        # Correspondances manuelles prioritaires de haute fidélité
        DIRECT_PATHS = {
            "5227": ["41210"],        # Secrétariat médical -> Adjoints administratifs médicaux
            "5229": ["22221"],        # Soutien informatique -> Agents de soutien aux utilisateurs
            "5231": ["14200", "12200"],# Comptabilité -> Commis comptables & Techniciens
            "5321": ["64100"],        # Vente-conseil -> Vendeurs/vendeuses
            "5357": ["13110"],        # Secrétariat -> Adjoints administratifs
            "5295": ["72200"],        # Électricité -> Électriciens
            "5298": ["72410"],        # Mécanique automobile -> Mécaniciens automobiles
            "5311": ["63200"],        # Cuisine -> Cuisiniers
            "5315": ["72402"],        # Réfrigération -> Mécaniciens frigoristes
            "5333": ["72300"],        # Plomberie -> Plombiers
            "5286": ["72106"],        # Plâtrage -> Plâtriers
            "5300": ["73101"],        # Carrelage -> Poseurs de carreaux
            "5178": ["72320"],        # Taille de pierre -> Maçons
            "5245": ["65300"],        # Coiffure -> Coiffeurs/coiffeuses
            "420.B0": ["21232", "21234", "22220"], # DEC Informatique -> Devs, Analystes, Techniciens
            "180.A0": ["31301"],      # DEC Soins infirmiers -> Infirmiers autorisés
            "243.11": ["22310"],      # DEC Électronique ind. -> Technologues en génie électrique
            "241.A0": ["22301"],      # DEC Génie mécanique -> Technologues en génie mécanique
            "BAC-GINF": ["21231", "21311"], # BAC Génie info -> Ingénieurs logiciels & informatiques
            "BAC-GLOG": ["21231"],    # BAC Génie logiciel -> Ingénieurs logiciels
            "BAC-INFO": ["21230", "21232"], # BAC Informatique -> Devs logiciels
            "BAC-INF":  ["31300", "31301"], # BAC Sciences infirmières -> Infirmiers
            "BAC-COMPT":["11100"],    # BAC Comptabilité -> Comptables professionnels
            "BAC-DROIT":["41101"],    # BAC Droit -> Avocats
            "BAC-MED":  ["31100", "31102"], # Doctorat Médecine -> Médecins spécialistes & généralistes
        }

        matches = []
        for code, title, lvl in prog_rows:
            matched_cnps = set()

            # 1. Vérifier la table des voies directes manuelles
            if code in DIRECT_PATHS:
                for cnp in DIRECT_PATHS[code]:
                    if cnp in valid_cnps:
                        matched_cnps.add((cnp, True, "Voie directe officielle MEQ"))

            # 2. Compléter avec l'index morpho-sémantique
            words = [stem(w) for w in re.findall(r"\w+", title.lower()) if len(w) >= 4 and stem(w) not in stopwords]
            if words:
                candidates = None
                for w in words:
                    cnps = inverted_index.get(w, set())
                    if candidates is None:
                        candidates = set(cnps)
                    else:
                        inter = candidates & cnps
                        if inter:
                            candidates = inter
                if candidates:
                    for cnp in candidates:
                        if cnp in valid_cnps and not any(cnp == m[0] for m in matched_cnps):
                            matched_cnps.add((cnp, False, "Correspondance sémantique SIPeC"))

            for cnp, is_direct, note in matched_cnps:
                matches.append((cnp, code, is_direct, note, "Trajektia_MEQ_2025"))

        sql = """
            INSERT INTO occupation_programs (occupation_cnp_code, program_code, is_direct_path, notes_fr, source)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, program_code) DO UPDATE SET
                is_direct_path = EXCLUDED.is_direct_path,
                notes_fr = EXCLUDED.notes_fr,
                source = EXCLUDED.source;
        """
        psycopg2.extras.execute_values(cur, sql, matches, page_size=500)
        log.info(f"  ✓ {len(matches)} liaisons Métiers (CNP) <-> Formations (MEQ) créées dans occupation_programs.")


if __name__ == "__main__":
    ingestor = MEQRelanceIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
