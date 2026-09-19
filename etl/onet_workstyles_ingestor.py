#!/usr/bin/env python3
"""
OnetWorkStylesIngestor — Ingestion des 21 Work Styles O*NET v30.x
=================================================================
Importe les données Work Styles depuis fichier Excel O*NET et les mappe aux codes CNP canadiens.

Usage:
    python etl/onet_workstyles_ingestor.py --file ../Work\ Styles.xlsx

Environment (depuis .env à la racine):
    SUPABASE_DB_URL=postgresql://postgres:[pwd]@db.[ref].supabase.co:5432/postgres
"""
import argparse
import logging
import os
import sys
from pathlib import Path
from typing import Optional

import pandas as pd
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# ── Configuration du logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("onet_workstyles_ingestor")

# ── Répertoires du projet ──────────────────────────────────────────────────────
PROJ_ROOT = Path(__file__).resolve().parent.parent  # trajektia/
DOTENV_PATH = PROJ_ROOT / ".env"

# Les 21 Work Styles O*NET v30.x avec leurs traductions françaises
WORK_STYLES_DEFINITIONS = {
    # Conscientious and Rule Oriented
    "Attention to Detail": ("1", "Attention aux Détails",
        "Being careful about detail and thoroughness in completing work tasks.",
        "Faire attention aux détails et à l'exhaustivité dans l'exécution des tâches."),
    "Cautiousness": ("2", "Prudence",
        "Being cautious and prudent rather than impulsive or risky in decision-making.",
        "Être prudent et avisé plutôt qu'impulsif ou risqué dans la prise de décision."),
    "Dependability": ("3", "Fiabilité",
        "Being reliable, responsible, and dependable, and fulfilling obligations.",
        "Être fiable, responsable et digne de confiance, et remplir ses obligations."),
    "Integrity": ("4", "Intégrité",
        "Being honest and ethical in all aspects of work.",
        "Être honnête et éthique dans tous les aspects du travail."),

    # Emotionally Resilient
    "Self-Control": ("5", "Auto-Contrôle",
        "Maintaining composure, keeping emotions in check, controlling anger, and avoiding aggressive behavior.",
        "Garder son sang-froid, contrôler ses émotions, maîtriser sa colère et éviter les comportements agressifs."),
    "Stress Tolerance": ("6", "Tolérance au Stress",
        "Accepting criticism and dealing calmly and effectively with high stress situations.",
        "Accepter les critiques et gérer calmement et efficacement les situations de stress élevé."),

    # Interpersonally Oriented
    "Cooperation": ("7", "Coopération",
        "Being pleasant with others and displaying a good-natured, cooperative attitude.",
        "Être agréable avec les autres et afficher une attitude coopérative et de bonne volonté."),
    "Empathy": ("8", "Empathie",
        "Being aware of others' reactions and understanding why they react as they do.",
        "Être conscient des réactions des autres et comprendre pourquoi ils réagissent comme ils le font."),
    "Humility": ("9", "Humilité",
        "Being modest and humble; not thinking that you are better than others.",
        "Être modeste et humble; ne pas penser que vous êtes meilleur que les autres."),
    "Optimism": ("10", "Optimisme",
        "Being upbeat, positive, and emotionally stable in difficult situations.",
        "Être positif, enthousiaste et émotionnellement stable dans les situations difficiles."),
    "Sincerity": ("11", "Sincérité",
        "Being frank, genuine, and without pretense in dealing with others.",
        "Être franc, authentique et sans dissimulation dans les relations avec les autres."),
    "Social Orientation": ("12", "Orientation Sociale",
        "Preferring to work with others rather than alone, and being personally connected with others.",
        "Préférer travailler avec les autres plutôt que seul et être personnellemet connecté avec les autres."),

    # Proactive and Growth Oriented
    "Achievement Orientation": ("13", "Orientation vers l'Accomplissement",
        "Setting challenging goals and exerting effort toward mastering tasks.",
        "Se fixer des objectifs ambitieux et déployer des efforts pour maîtriser les tâches."),
    "Adaptability": ("14", "Adaptabilité",
        "Being open to change (positive or negative) and to considerable variety in the workplace.",
        "Être ouvert au changement (positif ou négatif) et à une grande variété sur le lieu de travail."),
    "Initiative": ("15", "Initiative",
        "Willingness to take on responsibilities and challenges.",
        "Prendre des responsabilités et relever des défis."),
    "Innovation": ("16", "Innovation",
        "Being creative and alternative thinking to develop new ideas for and answers to work-related problems.",
        "Être créatif et avoir une pensée alternative pour développer de nouvelles idées et réponses aux problèmes."),
    "Intellectual Curiosity": ("17", "Curiosité Intellectuelle",
        "Having an interest in learning new things and expanding one's knowledge.",
        "S'intéresser à apprendre de nouvelles choses et à élargir ses connaissances."),
    "Leadership Orientation": ("18", "Leadership",
        "Willingness to lead, take charge, and offer opinions and direction.",
        "Être prêt à diriger, prendre les choses en main et offrir des opinions et des orientations."),
    "Perseverance": ("19", "Persévérance",
        "Persisting in the face of obstacles.",
        "Persévérer face aux obstacles."),
    "Self-Confidence": ("20", "Confiance en Soi",
        "Believing in one's own ability to succeed; having courage to take risks.",
        "Croire en sa propre capacité à réussir; avoir le courage de prendre des risques."),
    "Tolerance for Ambiguity": ("21", "Tolérance à l'Ambiguïté",
        "Being comfortable with uncertainty and open to change.",
        "Être à l'aise avec l'incertitude et ouvert au changement."),
}


def load_env() -> Optional[str]:
    """Charge les variables d'environnement."""
    load_dotenv(DOTENV_PATH, override=True)
    db_url = os.getenv("SUPABASE_DB_URL") or os.getenv("SUPABASE_DB_URL_DIRECT")
    if not db_url:
        log.error("SUPABASE_DB_URL manquant dans .env")
        return None
    return db_url


def ensure_table_exists(conn):
    """Crée la table onet_work_styles."""
    cur = conn.cursor()
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'onet_work_styles'
        );
    """)
    exists = cur.fetchone()[0]

    if not exists:
        log.info("Creation de la table onet_work_styles...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS onet_work_styles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                cnp_code VARCHAR(10),
                soc_code VARCHAR(15),
                style_id VARCHAR(10) NOT NULL,
                style_name_en VARCHAR(255) NOT NULL,
                style_name_fr VARCHAR(255),
                description_en TEXT,
                description_fr TEXT,
                score NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100),
                wi_score NUMERIC(6, 2),
                dr_rank NUMERIC(3, 2),
                source VARCHAR(50) DEFAULT 'O*NET 30.x',
                ingested_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(cnp_code, style_id)
            );
            CREATE INDEX IF NOT EXISTS idx_onet_ws_cnp ON onet_work_styles (cnp_code);
            CREATE INDEX IF NOT EXISTS idx_onet_ws_soc ON onet_work_styles (soc_code);
            CREATE INDEX IF NOT EXISTS idx_onet_ws_style ON onet_work_styles (style_id);
        """)
    else:
        # Add new columns if they don't exist
        try:
            cur.execute("ALTER TABLE onet_work_styles ADD COLUMN IF NOT EXISTS soc_code VARCHAR(15)")
            cur.execute("ALTER TABLE onet_work_styles ADD COLUMN IF NOT EXISTS wi_score NUMERIC(6, 2)")
            cur.execute("ALTER TABLE onet_work_styles ADD COLUMN IF NOT EXISTS dr_rank NUMERIC(3, 2)")
            conn.commit()
        except:
            pass
    conn.commit()


def get_cnp_from_soc(cur, soc_code: str) -> Optional[str]:
    """Convertit un code SOC O*NET en code CNP canadien."""
    # Essayer avec le crosswalk
    cur.execute("""
        SELECT noc_code FROM noc_onet_crosswalk
        WHERE onet_soc_code = %s OR onet_soc_code LIKE %s
        LIMIT 1
    """, (soc_code, soc_code + '%'))
    result = cur.fetchone()
    if result:
        return result[0]

    # Essayer directement dans occupations
    cur.execute("""
        SELECT cnp_code FROM occupations
        WHERE onet_soc_code = %s OR onet_soc_code LIKE %s
        LIMIT 1
    """, (soc_code, soc_code + '%'))
    result = cur.fetchone()
    if result:
        return result[0]

    return None


def insert_from_excel(db_url: str, excel_path: str):
    """Importe les données depuis un fichier Excel O*NET."""
    log.info(f"Import depuis Excel: {excel_path}")

    # Charger le fichier Excel
    df = pd.read_excel(excel_path, engine='openpyxl')
    log.info(f"Charge {len(df)} lignes depuis Excel")

    # Pivot: avoir WI et DR comme colonnes séparées
    df_pivot = df.pivot_table(
        index=['O*NET-SOC Code', 'Element Name'],
        columns='Scale ID',
        values='Data Value',
        aggfunc='first'
    ).reset_index()

    # Renommer les colonnes
    df_pivot.columns.name = None
    df_pivot = df_pivot.rename(columns={'O*NET-SOC Code': 'soc_code', 'Element Name': 'element_name'})

    log.info(f"After pivot: {len(df_pivot)} rows")

    # Se connecter à la DB
    conn = psycopg2.connect(db_url, connect_timeout=30)
    conn.set_session(autocommit=True)
    cur = conn.cursor()

    # Supprimer les anciennes données
    cur.execute("DELETE FROM onet_work_styles")
    log.info("Donnees existantes supprimees")

    # Préparer l'insertion
    insert_query = """
        INSERT INTO onet_work_styles
            (cnp_code, soc_code, style_id, style_name_en, style_name_fr, description_en, description_fr, score, wi_score, dr_rank, source)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    total = 0
    skipped = 0

    for _, row in df_pivot.iterrows():
        soc_code = row['soc_code']
        element_name = row['element_name']

        # Vérifier si c'est un Work Style connu
        if element_name not in WORK_STYLES_DEFINITIONS:
            skipped += 1
            continue

        style_id, name_fr, desc_en, desc_fr = WORK_STYLES_DEFINITIONS[element_name]

        # Convertir SOC en CNP
        cnp_code = get_cnp_from_soc(cur, soc_code)

        # Score: convertir WI (-3 à +3) en 0-100
        wi = row.get('WI')
        score = round((wi + 3) / 6 * 100, 1) if pd.notna(wi) else None

        # DR rank
        dr = row.get('DR')
        dr_rank = round(float(dr), 2) if pd.notna(dr) else None

        try:
            cur.execute(insert_query, (
                cnp_code,
                soc_code,
                style_id,
                element_name,  # name_en
                name_fr,
                desc_en,
                desc_fr,
                score,
                wi,
                dr_rank,
                "O*NET 30.x"
            ))
            total += 1

            if total % 5000 == 0:
                log.info(f"  Progression: {total}/{len(df_pivot)}")
        except Exception as e:
            log.debug(f"Erreur insertion: {e}")

    log.info(f"Import termine: {total} lignes inserees, {skipped} ignorees")

    # Statistiques
    cur.execute("SELECT COUNT(DISTINCT cnp_code) FROM onet_work_styles WHERE cnp_code IS NOT NULL")
    cnp_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(DISTINCT soc_code) FROM onet_work_styles")
    soc_count = cur.fetchone()[0]
    log.info(f"CNP codes: {cnp_count}, SOC codes: {soc_count}")

    cur.close()
    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Ingestion des Work Styles O*NET")
    parser.add_argument("--file", type=str, required=True, help="Chemin vers fichier Excel O*NET Work Styles")
    args = parser.parse_args()

    db_url = load_env()
    if not db_url:
        log.error("Configuration manquante. Arret.")
        sys.exit(1)

    log.info("=" * 60)
    log.info("O*NET Work Styles Ingestor (v30.x)")
    log.info("=" * 60)

    try:
        # Se connecter pour créer la table
        conn = psycopg2.connect(db_url, connect_timeout=30)
        ensure_table_exists(conn)
        conn.close()

        # Importer les données
        insert_from_excel(db_url, args.file)

        log.info("Operation terminee avec succes")

    except Exception as e:
        log.error(f"Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
