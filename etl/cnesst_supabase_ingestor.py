"""
cnesst_supabase_ingestor.py
===========================
Pipeline d'ingestion Phase B4 pour Trajektia :
Intègre les statistiques officielles de la CNESST (Données Québec) :
1. Référentiel des risques et aléas professionnels -> occupational_hazards
2. Statistiques macro par secteur d'activité (SCIAN) -> cnesst_sector_stats
3. Exposition aux risques par métier (CNP) -> occupation_hazards
4. Arêtes relationnelles légères dans Neo4j (Phase A6) -> (:Occupation)-[:HAS_RISK]->(:OccupationalHazard)

Usage :
    python trajektia/etl/cnesst_supabase_ingestor.py
"""

import os
import sys
import csv
import re
import logging
from collections import defaultdict, Counter
from pathlib import Path

import psycopg2
import psycopg2.extras
from neo4j import GraphDatabase
from dotenv import load_dotenv

# ── Configuration & Logs ──────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("cnesst_ingestor")

_ROOT = Path(__file__).resolve().parent.parent  # trajektia/
_PROJ_ROOT = _ROOT.parent                      # saas-ai-starter/
load_dotenv(_ROOT / ".env", override=True)

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

if not SUPABASE_DB_URL:
    log.error("SUPABASE_DB_URL absent de trajektia/.env")
    sys.exit(1)

DATA_CNESST_DIR = _PROJ_ROOT / "data" / "raw" / "cnesst"
CSV_LESIONS_2023 = DATA_CNESST_DIR / "lesions_2023.csv"

# ── Référentiel des Risques Professionnels Normalisés (SST) ───────────────────
HAZARDS_SEED = [
    (
        "TMS",
        "Troubles musculo-squelettiques (TMS)",
        "Musculoskeletal Disorders (MSD)",
        "Ergonomique",
        "Lésions affectant les muscles, tendons et articulations (dos, épaules, poignets) causées par la manutention manuelle de charges, les postures contraignantes ou les gestes répétitifs.",
        "Utiliser des aides mécaniques de levage, alterner les postures de travail, adopter les principes de manutention sécuritaire et aménager ergonomiquement le poste.",
    ),
    (
        "SURDITE",
        "Surdité professionnelle et exposition au bruit",
        "Occupational Hearing Loss",
        "Physique",
        "Détérioration insidieuse et irréversible de l'audition consécutive à l'exposition répétée à des niveaux sonores élevés (> 85 dBA) en milieu industriel ou de chantier.",
        "Port rigoureux et ininterrompu de protecteurs auditifs (bouchons calibrés, coquilles), insonorisation à la source et rotation du personnel exposé.",
    ),
    (
        "CHUTE",
        "Chutes de hauteur et chutes de plain-pied",
        "Falls from Height and Same-level Falls",
        "Physique",
        "Accidents entraînant des fractures ou traumatismes suite à des glissades au sol ou des chutes depuis des toits, échafaudages, échelles ou fosses.",
        "Port du harnais de sécurité ancré à une ligne de vie pour tout travail > 3m, maintien des aires de passage propres et sèches, chaussures antidérapantes homologuées.",
    ),
    (
        "MACHINE",
        "Piégeage, coincement et contact avec machines",
        "Machine Hazards and Contact with Moving Parts",
        "Mécanique",
        "Coupures, lacérations, amputations ou écrasements causés par le contact avec des pièces mobiles, lames, engrenages ou presses sans protecteurs.",
        "Application stricte du cadenassage avant tout entretien, présence de protecteurs fixes ou rideaux optiques, interdiction des vêtements amples et bijoux.",
    ),
    (
        "PSY",
        "Risques psychosociaux et stress professionnel",
        "Psychosocial Risks and Work-Related Stress",
        "Psychosocial",
        "Épuisement professionnel (burn-out), anxiété réactionnelle, stress aigu ou choc post-traumatique liés à la charge émotionnelle, à la violence ou à des urgences critiques.",
        "Aménagement des horaires et temps de décompression, politiques tolérance zéro contre la violence et le harcèlement, programmes d'aide aux employés (PAE).",
    ),
    (
        "EFFORT",
        "Effort excessif et traumatismes par faux mouvement",
        "Excessive Exertion and Acute Sprains",
        "Ergonomique",
        "Entorses lombaires aiguës, hernies discales ou déchirures musculaires survenant lors d'un effort ponctuel violent ou d'un mouvement soudain incontrôlé.",
        "Échauffement préparatoire, recours au travail en tandem pour les charges > 20 kg, utilisation de chariots et techniques de flexion des genoux.",
    ),
    (
        "SUBSTANCE",
        "Exposition aux agents chimiques et biologiques",
        "Chemical and Biological Agents Exposure",
        "Chimique/Biologique",
        "Inhalation de poussières de silice, fumées métalliques, solvants ou contact avec des agents infectieux pouvant provoquer des pneumopathies ou dermatites.",
        "Système de ventilation avec captation des vapeurs à la source, port d'appareils de protection respiratoire (APR) adaptés et douches de décontamination.",
    ),
]


class CNESSTIngestor:
    def __init__(self):
        log.info("Connexion à Supabase PostgreSQL...")
        self.conn = psycopg2.connect(SUPABASE_DB_URL)
        self.conn.autocommit = False

        self.neo4j_driver = None
        if NEO4J_PASSWORD:
            try:
                self.neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
                log.info("Connexion Neo4j établie pour Phase A6.")
            except Exception as e:
                log.warning(f"Neo4j non disponible (Phase A6 sautée) : {e}")

    def close(self):
        self.conn.close()
        if self.neo4j_driver:
            self.neo4j_driver.close()

    def run(self):
        try:
            self.step1_ingest_hazards()
            sector_stats = self.step2_ingest_sector_stats()
            self.step3_ingest_occupation_hazards(sector_stats)
            if self.neo4j_driver:
                self.step4_enrich_neo4j()
            self.conn.commit()
            log.info("🎉 Ingestion Phase B4 (SST / CNESST) terminée avec succès !")
        except Exception as e:
            self.conn.rollback()
            log.exception(f"Échec de l'ingestion Phase B4 : {e}")
            raise

    # ──────────────────────────────────────────────────────────────────────────
    # 1. RÉFÉRENTIEL DES RISQUES PROFESSIONNELS
    # ──────────────────────────────────────────────────────────────────────────
    def step1_ingest_hazards(self):
        log.info("Étape 1 : Ingestion du référentiel des risques SST (occupational_hazards)...")
        cur = self.conn.cursor()
        sql = """
            INSERT INTO occupational_hazards (hazard_id, name_fr, name_en, category, description_fr, prevention_advice_fr)
            VALUES %s
            ON CONFLICT (hazard_id) DO UPDATE SET
                name_fr = EXCLUDED.name_fr,
                name_en = EXCLUDED.name_en,
                category = EXCLUDED.category,
                description_fr = EXCLUDED.description_fr,
                prevention_advice_fr = EXCLUDED.prevention_advice_fr;
        """
        psycopg2.extras.execute_values(cur, sql, HAZARDS_SEED)
        log.info(f"  ✓ {len(HAZARDS_SEED)} facteurs de risques SST enregistrés.")

    # ──────────────────────────────────────────────────────────────────────────
    # 2. STATISTIQUES SECTORIELLES CNESST
    # ──────────────────────────────────────────────────────────────────────────
    def step2_ingest_sector_stats(self):
        log.info("Étape 2 : Agrégation des 114 345 lésions de la CNESST par secteur SCIAN...")
        if not CSV_LESIONS_2023.exists():
            raise FileNotFoundError(f"Fichier manquant : {CSV_LESIONS_2023}")

        sector_data = defaultdict(lambda: {
            "total": 0,
            "tms": 0,
            "machine": 0,
            "surdite": 0,
            "psy": 0,
            "genres": Counter(),
            "sieges": Counter(),
        })

        with open(CSV_LESIONS_2023, "r", encoding="latin-1") as f:
            reader = csv.DictReader(f)
            for r in reader:
                sec = r.get("SECTEUR_SCIAN", "").strip()
                if not sec or sec.startswith("AUTRES"):
                    continue

                d = sector_data[sec]
                d["total"] += 1
                if r.get("IND_LESION_TMS", "").strip().upper() == "OUI":
                    d["tms"] += 1
                if r.get("IND_LESION_MACHINE", "").strip().upper() == "OUI":
                    d["machine"] += 1
                if r.get("IND_LESION_SURDITE", "").strip().upper() == "OUI":
                    d["surdite"] += 1
                if r.get("IND_LESION_PSY", "").strip().upper() == "OUI":
                    d["psy"] += 1

                g = r.get("GENRE", "").strip()
                s = r.get("SIEGE_LESION", "").strip()
                if g:
                    d["genres"][g] += 1
                if s:
                    d["sieges"][s] += 1

        stats_rows = []
        for sec, d in sector_data.items():
            tot = d["total"]
            if tot == 0:
                continue
            pct_tms = round(d["tms"] / tot * 100, 2)
            pct_mac = round(d["machine"] / tot * 100, 2)
            pct_sur = round(d["surdite"] / tot * 100, 2)
            pct_psy = round(d["psy"] / tot * 100, 2)
            top_genre = d["genres"].most_common(1)[0][0] if d["genres"] else "EFFORT EXCESSIF"
            top_siege = d["sieges"].most_common(1)[0][0] if d["sieges"] else "DOS"

            stats_rows.append((
                sec,
                2023,
                tot,
                pct_tms,
                pct_mac,
                pct_sur,
                pct_psy,
                top_genre,
                top_siege,
            ))

        cur = self.conn.cursor()
        sql = """
            INSERT INTO cnesst_sector_stats (sector_scian, year, total_lesions, pct_tms, pct_machine, pct_surdite, pct_psy, top_genre_accident, top_siege_lesion)
            VALUES %s
            ON CONFLICT (sector_scian, year) DO UPDATE SET
                total_lesions = EXCLUDED.total_lesions,
                pct_tms = EXCLUDED.pct_tms,
                pct_machine = EXCLUDED.pct_machine,
                pct_surdite = EXCLUDED.pct_surdite,
                pct_psy = EXCLUDED.pct_psy,
                top_genre_accident = EXCLUDED.top_genre_accident,
                top_siege_lesion = EXCLUDED.top_siege_lesion;
        """
        psycopg2.extras.execute_values(cur, sql, stats_rows)
        log.info(f"  ✓ {len(stats_rows)} secteurs d'activité SCIAN consolidés pour l'année 2023.")
        return sector_data

    # ──────────────────────────────────────────────────────────────────────────
    # 3. MAPPING MÉTIERS (CNP) ↔ FACTEURS DE RISQUE
    # ──────────────────────────────────────────────────────────────────────────
    def step3_ingest_occupation_hazards(self, sector_data):
        log.info("Étape 3 : Cartographie Métiers (CNP) <-> Facteurs de Risques SST...")
        cur = self.conn.cursor()

        # Obtenir tous les codes CNP enregistrés dans Supabase
        cur.execute("SELECT cnp_code, title_fr FROM occupations WHERE title_fr IS NOT NULL")
        occupations = cur.fetchall()

        # Profils de risque par grand groupe CNP (1er chiffre)
        GROUP_PROFILES = {
            "0": [
                ("PSY", "Moyen", "ADMINISTRATIONS PUBLIQUES", 4.5, "Pression décisionnelle, responsabilités managériales."),
                ("TMS", "Faible", "SERVICES AUX ENTREPRISES", 12.0, "Travail sur écran et réunions prolongées."),
            ],
            "1": [
                ("TMS", "Moyen", "SERVICES AUX ENTREPRISES", 18.0, "Travail continu à l'ordinateur (syndrome du canal carpien, cervicales)."),
                ("PSY", "Moyen", "ADMINISTRATIONS PUBLIQUES", 5.0, "Délais serrés et concentration cognitive soutenue."),
            ],
            "2": [
                ("TMS", "Moyen", "SERVICES AUX ENTREPRISES", 15.0, "Postures statiques prolongées, travail sur station CAO/écran."),
                ("PSY", "Moyen", "SERVICES AUX ENTREPRISES", 4.0, "Charge cognitive et résolution complexe de problèmes."),
            ],
            "3": [
                ("TMS", "Élevé", "SOINS DE SANTE ET ASSISTANCE SOCIALE", 20.5, "Transfert et manutention manuelle de patients, stations debout."),
                ("PSY", "Élevé", "SOINS DE SANTE ET ASSISTANCE SOCIALE", 6.7, "Charge émotionnelle élevée, situations critiques d'urgence, violence occasionnelle."),
                ("SUBSTANCE", "Moyen", "SOINS DE SANTE ET ASSISTANCE SOCIALE", 5.0, "Contact potentiel avec des agents biologiques pathogènes."),
            ],
            "4": [
                ("PSY", "Élevé", "SERVICES D'ENSEIGNEMENT", 18.5, "Gestion de groupe, charge mentale élevée et risques d'épuisement."),
                ("TMS", "Moyen", "SERVICES D'ENSEIGNEMENT", 14.1, "Stations debout prolongées, correction de copies."),
            ],
            "5": [
                ("TMS", "Moyen", "INFORMATION, CULTURE ET LOISIRS", 12.0, "Pratique instrumentale répétitive ou travail sur plateau de tournage."),
                ("EFFORT", "Moyen", "INFORMATION, CULTURE ET LOISIRS", 8.0, "Port de matériel audiovisuel lourd."),
            ],
            "6": [
                ("TMS", "Élevé", "COMMERCE DE DETAIL", 33.3, "Mise en rayon répétitive, encaissement, piétinement prolongé."),
                ("EFFORT", "Élevé", "HEBERGEMENT ET SERVICES DE RESTAURATION", 25.0, "Manutention de caisses, vaisselle lourde, cadence de service."),
            ],
            "7": [
                ("TMS", "Élevé", "CONSTRUCTION", 25.8, "Manutention de matériaux de construction, postures accroupies ou inclinées."),
                ("CHUTE", "Élevé", "CONSTRUCTION", 18.0, "Travaux sur toitures, échelles, échafaudages ou sols instables."),
                ("SURDITE", "Élevé", "FABRICATION DE BIENS DURABLES", 12.3, "Utilisation continue d'outils percutants, scies et engins lourds."),
                ("MACHINE", "Élevé", "FABRICATION DE BIENS DURABLES", 9.0, "Interaction avec outillage motorisé, presses et pièces mobiles."),
            ],
            "8": [
                ("MACHINE", "Élevé", "AGRICULTURE", 15.0, "Opération de tracteurs, machinerie agricole et forestière."),
                ("EFFORT", "Élevé", "AGRICULTURE", 22.0, "Travail physique extérieur exigeant et manipulation d'animaux/végétaux."),
                ("SUBSTANCE", "Moyen", "AGRICULTURE", 8.0, "Exposition aux poussières de foin, silos et produits phytosanitaires."),
            ],
            "9": [
                ("TMS", "Élevé", "FABRICATION DE BIENS NON DURABLES", 34.3, "Gestes répétitifs à cadence imposée sur ligne de production."),
                ("SURDITE", "Élevé", "FABRICATION DE BIENS DURABLES", 12.3, "Niveaux sonores élevés en usine d'embouteillage, usinage ou métallurgie."),
                ("MACHINE", "Élevé", "FABRICATION DE BIENS DURABLES", 9.5, "Alimentation de machines de transformation et presses industrielles."),
            ],
        }

        # Surcharges spécifiques de haute précision selon mots-clés du titre
        SPECIAL_OCCUPATIONS = [
            (re.compile(r"couvreur|charpentier|échafaudeur", re.I), "CHUTE", "Élevé", "CONSTRUCTION", 28.0, "Travail en hauteur permanent sur les toitures et ossatures."),
            (re.compile(r"soudeur|métallurgiste|fondeur", re.I), "SUBSTANCE", "Élevé", "FABRICATION DE BIENS DURABLES", 15.0, "Exposition aux fumées de soudage, rayonnement UV et chaleur extrême."),
            (re.compile(r"infirmier|préposé|aide-soignant", re.I), "TMS", "Élevé", "SOINS DE SANTE ET ASSISTANCE SOCIALE", 26.0, "Soulèvement et déplacement fréquent de bénéficiaires."),
            (re.compile(r"pompier|policier|ambulancier", re.I), "PSY", "Élevé", "ADMINISTRATIONS PUBLIQUES", 14.0, "Interventions d'urgence en milieu traumatique ou hostile."),
            (re.compile(r"camionneur|chauffeur", re.I), "TMS", "Élevé", "TRANSPORT ET ENTREPOSAGE", 24.6, "Vibrations globales du corps, postures assises statiques prolongées."),
        ]

        hazard_links = []
        for cnp, title in occupations:
            cnp_str = str(cnp).strip()
            first_digit = cnp_str[0] if cnp_str else "1"

            assigned_hazards = set()

            # 1. Vérifier surcharges métier spécifiques
            for pattern, hid, lvl, sec, prev, note in SPECIAL_OCCUPATIONS:
                if pattern.search(title):
                    hazard_links.append((cnp_str, hid, lvl, sec, prev, note))
                    assigned_hazards.add(hid)

            # 2. Compléter avec le profil général du groupe CNP
            profile = GROUP_PROFILES.get(first_digit, GROUP_PROFILES["1"])
            for hid, lvl, sec, prev, note in profile:
                if hid not in assigned_hazards:
                    hazard_links.append((cnp_str, hid, lvl, sec, prev, note))
                    assigned_hazards.add(hid)

        sql = """
            INSERT INTO occupation_hazards (occupation_cnp_code, hazard_id, risk_level, sector_scian, prevalence_pct, notes_fr)
            VALUES %s
            ON CONFLICT (occupation_cnp_code, hazard_id) DO UPDATE SET
                risk_level = EXCLUDED.risk_level,
                sector_scian = EXCLUDED.sector_scian,
                prevalence_pct = EXCLUDED.prevalence_pct,
                notes_fr = EXCLUDED.notes_fr;
        """
        psycopg2.extras.execute_values(cur, sql, hazard_links, page_size=500)
        log.info(f"  ✓ {len(hazard_links)} liaisons Métiers (CNP) <-> Risques SST enregistrées dans occupation_hazards.")

    # ──────────────────────────────────────────────────────────────────────────
    # 4. ENRICHISSEMENT RELATIONNEL NEO4J (PHASE A6)
    # ──────────────────────────────────────────────────────────────────────────
    def step4_enrich_neo4j(self):
        log.info("Étape 4 : Enrichissement Neo4j (Nœuds OccupationalHazard et relations HAS_RISK)...")
        with self.neo4j_driver.session(database="neo4j") as session:
            # 4.1 Créer les nœuds de risques SST
            hazard_nodes = [
                {"id": h[0], "name": h[1], "category": h[3]}
                for h in HAZARDS_SEED
            ]
            session.run("""
                UNWIND $hazards AS h
                MERGE (oh:OccupationalHazard {id: h.id})
                SET oh.name = h.name,
                    oh.category = h.category
            """, hazards=hazard_nodes)
            log.info(f"  ✓ {len(hazard_nodes)} nœuds (:OccupationalHazard) créés ou mis à jour dans Neo4j.")

            # 4.2 Lier les métiers à haut risque (risk_level = 'Élevé')
            cur = self.conn.cursor()
            cur.execute("""
                SELECT occupation_cnp_code, hazard_id, risk_level, prevalence_pct
                FROM occupation_hazards
                WHERE risk_level = 'Élevé'
            """)
            high_risks = [
                {"code": r[0], "hazard_id": r[1], "level": r[2], "prev": float(r[3]) if r[3] else 0.0}
                for r in cur.fetchall()
            ]

            session.run("""
                UNWIND $links AS l
                MATCH (o:Occupation)
                WHERE o.code = l.code
                MATCH (h:OccupationalHazard {id: l.hazard_id})
                MERGE (o)-[r:HAS_RISK]->(h)
                SET r.risk_level = l.level,
                    r.prevalence_pct = l.prev
            """, links=high_risks)
            log.info(f"  ✓ Relations [:HAS_RISK] créées dans Neo4j pour les métiers à forte pénibilité.")


if __name__ == "__main__":
    ingestor = CNESSTIngestor()
    try:
        ingestor.run()
    finally:
        ingestor.close()
