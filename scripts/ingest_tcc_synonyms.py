#!/usr/bin/env python3
"""
Ingestion des synonymes TCC 2025 (Taxonomie des Compétences et Capacités - EDSC / Ouvert Canada)
vers la table Supabase competency_synonyms.

Ce script génère des synonymes bilingues (FR/EN) pour les compétences existantes
afin d'alimenter le moteur de recherche sémantique multilingue.

Sources de synonymes potentielles (à terme):
- TCC 2025 v1.0 - EDSC / Ouvert Canada
- O*NET Work Activities / Skills
- Terminologie gouvernementale FR/EN
"""
import os
import sys
from pathlib import Path
from typing import List, Tuple
import psycopg2
from psycopg2 import extras

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def load_env_file(filepath: Path) -> None:
    """Charge les variables d'environnement depuis un fichier .env."""
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


def generate_french_synonyms(name_fr: str) -> List[str]:
    """
    Génère des synonymes et variantes en français pour une compétence.
    Inclut: formes plurielles, variantes terminologiques, synonymes courants.
    """
    if not name_fr:
        return []

    synonyms = []
    name_lower = name_fr.lower().strip()

    # 1. Forme plurielle
    if name_lower.endswith('é'):
        pluriel = name_lower + 's'
    elif name_lower.endswith('e'):
        pluriel = name_lower + 's'
    elif name_lower.endswith('s'):
        pluriel = name_lower  # déjà pluriel
    elif name_lower.endswith('r'):
        pluriel = name_lower + 's'
    else:
        pluriel = name_lower + 's'
    synonyms.append(pluriel)

    # 2. Synonymes génériques par catégorie de compétences
    # Vérifier les patterns courants dans les noms de compétences
    if 'analys' in name_lower or 'analys' in name_lower:
        synonyms.extend(['étude', 'examen', 'évaluation', 'examination'])
    if 'conception' in name_lower or 'design' in name_lower:
        synonyms.extend(['création', 'élaboration', 'design', 'architecture'])
    if 'développement' in name_lower:
        synonyms.extend(['programmation', 'codage', 'implémentation', 'construction'])
    if 'gestion' in name_lower or 'management' in name_lower:
        synonyms.extend(['administration', 'pilotage', 'direction', 'encadrement'])
    if 'communication' in name_lower:
        synonyms.extend(['échange', 'transmission', 'diffusion', 'interaction'])
    if 'planification' in name_lower:
        synonyms.extend(['organisation', 'préparation', 'ordonnancement', 'calendarisation'])
    if 'évaluation' in name_lower or 'évaluation' in name_lower:
        synonyms.extend(['estimation', 'appréciation', 'mesure', 'jugement'])
    if 'formation' in name_lower or 'éducation' in name_lower:
        synonyms.extend(['instruction', 'pédagogie', 'transmission', 'apprentissage'])
    if 'rédaction' in name_lower or 'écriture' in name_lower:
        synonyms.extend(['composition', 'création de contenu', 'rédaction technique'])
    if 'négociation' in name_lower:
        synonyms.extend(['discussion', 'marchandage', 'transaction', 'accord'])
    if 'supervision' in name_lower or 'encadrement' in name_lower:
        synonyms.extend(['direction', 'pilotage', 'coordination', 'management'])
    if 'maintenance' in name_lower or 'entretien' in name_lower:
        synonyms.extend(['réparation', 'conservation', 'support', 'dépannage'])
    if 'sécurité' in name_lower:
        synonyms.extend(['protection', 'sauvegarde', 'confidentialité', 'sureté'])
    if 'optimisation' in name_lower:
        synonyms.extend(['amélioration', 'perfectionnement', 'efficience', 'rationalisation'])
    if 'résolution' in name_lower or 'troubleshooting' in name_lower:
        synonyms.extend(['dépannage', 'diagnostic', 'correction', 'remédiation'])

    # 3. Ajout de préfixes couramment utilisés
    prefixes = ['capacité de ', 'aptitude à ', 'compétence en ', 'maîtrise de ', 'savoir-faire en ']
    for prefix in prefixes:
        if not name_lower.startswith(prefix):
            synonyms.append(prefix + name_lower)

    # 4. Variantes avec verbes d'action
    action_prefixes = ['savoir ', 'être capable de ', 'être apte à ']
    for prefix in action_prefixes:
        synonyms.append(prefix + name_lower)

    # Dédupliquer et nettoyer
    seen = set()
    unique_synonyms = []
    for syn in synonyms:
        syn_clean = syn.strip()
        if syn_clean and syn_clean not in seen and len(syn_clean) > 2:
            seen.add(syn_clean)
            unique_synonyms.append(syn_clean)

    return unique_synonyms[:8]  # Limiter à 8 synonymes par compétence


def generate_english_synonyms(name_en: str) -> List[str]:
    """
    Génère des synonymes et variantes en anglais pour une compétence.
    """
    if not name_en:
        return []

    synonyms = []
    name_lower = name_en.lower().strip()

    # 1. Forme plurielle
    if name_lower.endswith('y'):
        pluriel = name_lower[:-1] + 'ies'
    elif name_lower.endswith(('s', 'x', 'z', 'ch', 'sh')):
        pluriel = name_lower + 'es'
    else:
        pluriel = name_lower + 's'
    synonyms.append(pluriel)

    # 2. Synonymes par patterns courants
    if 'analysis' in name_lower or 'analyzing' in name_lower:
        synonyms.extend(['study', 'examination', 'assessment', 'evaluation', 'review'])
    if 'design' in name_lower or 'designing' in name_lower:
        synonyms.extend(['creation', 'development', 'planning', 'architecture', 'layout'])
    if 'development' in name_lower or 'developing' in name_lower:
        synonyms.extend(['programming', 'coding', 'implementation', 'building', 'construction'])
    if 'management' in name_lower or 'managing' in name_lower:
        synonyms.extend(['administration', 'oversight', 'direction', 'control', 'leadership'])
    if 'communication' in name_lower:
        synonyms.extend(['exchange', 'transmission', 'sharing', 'interaction'])
    if 'planning' in name_lower or 'plan' in name_lower:
        synonyms.extend(['organization', 'preparation', 'scheduling', 'coordination'])
    if 'evaluation' in name_lower or 'assessing' in name_lower:
        synonyms.extend(['assessment', 'estimation', 'measurement', 'appraisal', 'judgment'])
    if 'training' in name_lower or 'teaching' in name_lower:
        synonyms.extend(['education', 'instruction', 'coaching', 'mentoring'])
    if 'writing' in name_lower or 'writing' in name_lower:
        synonyms.extend(['composition', 'authoring', 'drafting', 'content creation'])
    if 'negotiation' in name_lower:
        synonyms.extend(['discussion', 'bargaining', 'deal-making', 'agreement'])
    if 'supervision' in name_lower or 'supervising' in name_lower:
        synonyms.extend(['oversight', 'direction', 'coordination', 'leadership'])
    if 'maintenance' in name_lower or 'maintaining' in name_lower:
        synonyms.extend(['repair', 'upkeep', 'support', 'troubleshooting'])
    if 'security' in name_lower:
        synonyms.extend(['protection', 'safety', 'safeguarding', 'confidentiality'])
    if 'optimization' in name_lower or 'optimizing' in name_lower:
        synonyms.extend(['improvement', 'enhancement', 'efficiency', 'refinement'])
    if 'problem solving' in name_lower or 'troubleshooting' in name_lower:
        synonyms.extend(['diagnosis', 'correction', 'remediation', 'debugging'])

    # 3. Ajout de préfixes
    prefixes = ['ability to ', 'skill in ', 'proficiency in ', 'expertise in ', 'capability of ']
    for prefix in prefixes:
        if not name_lower.startswith(prefix):
            synonyms.append(prefix + name_lower)

    # 4. Variantes avec verbes
    action_prefixes = ['know how to ', 'be able to ', 'be capable of ']
    for prefix in action_prefixes:
        synonyms.append(prefix + name_lower)

    # Dédupliquer
    seen = set()
    unique_synonyms = []
    for syn in synonyms:
        syn_clean = syn.strip()
        if syn_clean and syn_clean not in seen and len(syn_clean) > 2:
            seen.add(syn_clean)
            unique_synonyms.append(syn_clean)

    return unique_synonyms[:8]


def fetch_competencies(cursor) -> List[Tuple]:
    """Récupère toutes les compétences existantes avec leurs noms bilingues."""
    cursor.execute("""
        SELECT id, name_fr, name_en
        FROM competencies
        WHERE name_fr IS NOT NULL OR name_en IS NOT NULL
        ORDER BY name_en;
    """)
    return cursor.fetchall()


def insert_synonyms_batch(cursor, synonyms_data: List[Tuple]) -> int:
    """
    Insère les synonymes par lot avec idempotence.
    Retourne le nombre d'insertions réelles (hors conflits).
    """
    if not synonyms_data:
        return 0

    query = """
        INSERT INTO competency_synonyms (competency_id, synonym_title, language)
        VALUES %s
        ON CONFLICT (competency_id, synonym_title, language) DO NOTHING;
    """

    # Exécution par lots de 1000 pour la performance
    batch_size = 1000
    total_inserted = 0

    for i in range(0, len(synonyms_data), batch_size):
        batch = synonyms_data[i:i + batch_size]
        extras.execute_values(cursor, query, batch, page_size=batch_size)
        total_inserted += len(batch)

    return total_inserted


def main():
    """Point d'entrée principal."""
    base_dir = Path(__file__).resolve().parent.parent
    load_env_file(base_dir / ".env")

    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        print("Erreur : SUPABASE_DB_URL manquant dans les variables d'environnement.")
        sys.exit(1)

    print("=" * 60)
    print("INGESTION DES SYNONYMES TCC 2025")
    print("Taxonomie des Compétences et Capacités - EDSC / Ouvert Canada")
    print("=" * 60)

    try:
        print("\n[1/4] Connexion à Supabase...")
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        print("       ✓ Connexion établie")

        # Vérifier que la table existe
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'competency_synonyms'
            );
        """)
        if not cursor.fetchone()[0]:
            print("Erreur : La table 'competency_synonyms' n'existe pas.")
            print("         Exécutez d'abord le schéma database/schema_v10_final_sources.sql")
            sys.exit(1)

        print("\n[2/4] Récupération des compétences existantes...")
        competencies = fetch_competencies(cursor)
        print(f"       ✓ {len(competencies)} compétences récupérées")

        print("\n[3/4] Génération des synonymes bilingues...")
        synonyms_data = []
        stats = {'fr': 0, 'en': 0, 'competencies_with_synonyms': 0}

        for comp_id, name_fr, name_en in competencies:
            comp_has_synonyms = False

            # Générer synonymes français
            if name_fr:
                fr_synonyms = generate_french_synonyms(name_fr)
                for syn in fr_synonyms:
                    synonyms_data.append((comp_id, syn, 'fr'))
                    stats['fr'] += 1
                    comp_has_synonyms = True

            # Générer synonymes anglais
            if name_en:
                en_synonyms = generate_english_synonyms(name_en)
                for syn in en_synonyms:
                    synonyms_data.append((comp_id, syn, 'en'))
                    stats['en'] += 1
                    comp_has_synonyms = True

            if comp_has_synonyms:
                stats['competencies_with_synonyms'] += 1

        print(f"       ✓ {len(synonyms_data)} synonymes générés")
        print(f"         - Français: {stats['fr']}")
        print(f"         - Anglais:  {stats['en']}")
        print(f"         - Compétences avec synonymes: {stats['competencies_with_synonyms']}")

        # Vérifier les doublons existants avant insertion
        cursor.execute("SELECT COUNT(*) FROM competency_synonyms;")
        existing_count = cursor.fetchone()[0]
        print(f"       - Synonymes existants: {existing_count}")

        print("\n[4/4] Insertion des synonymes dans la base...")
        # Insérer par lots
        inserted = insert_synonyms_batch(cursor, synonyms_data)

        # Vérifier le total après insertion
        cursor.execute("SELECT COUNT(*) FROM competency_synonyms;")
        final_count = cursor.fetchone()[0]

        print(f"       ✓ Insertion terminée")

        # Calcul du taux de couverture
        coverage_rate = (stats['competencies_with_synonyms'] / len(competencies) * 100) if competencies else 0

        print("\n" + "=" * 60)
        print("RAPPORT D'INGESTION TCC 2025")
        print("=" * 60)
        print(f"Compétences traitées:          {len(competencies)}")
        print(f"Compétences avec synonymes:   {stats['competencies_with_synonyms']}")
        print(f"Taux de couverture:           {coverage_rate:.1f}%")
        print(f"Synonymnes FR insérés:        {stats['fr']}")
        print(f"Synonymnes EN insérés:        {stats['en']}")
        print(f"Total synonymes en base:      {final_count}")
        print("=" * 60)
        print("✓ Ingestion TCC 2025 terminée avec succès!")

    except psycopg2.Error as e:
        print(f"\nErreur SQL: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\nErreur: {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()


if __name__ == "__main__":
    main()
