#!/usr/bin/env python3
"""
Market Snapshot Collector — ETL Mensuel pour l'Observatoire Temporel Trajektia
==============================================================================
Script Cron exécutable mensuellement pour consolider les offres du marché
(Guichet-Emplois et autres sources) dans les tables de snapshots et l'historique
de la demande de compétences.

Usage:
    python etl/market_snapshot_collector.py
    python etl/market_snapshot_collector.py --dry-run
    python etl/market_snapshot_collector.py --date 2026-08-01

Tables cibles:
    - trajektia_market_snapshots    : Séries temporelles mensuelles (salaires, volumes)
    - trajektia_skill_demand_history: Historique de la demande en compétences

Variables d'environnement (.env):
    SUPABASE_DB_URL    = postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
"""

import os
import sys
import argparse
import logging
from datetime import datetime, date
from typing import Optional

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# ── Configuration ──────────────────────────────────────────────────────────────

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)  # trajektia/
_DOTENV = os.path.join(_ROOT, ".env")
load_dotenv(_DOTENV, override=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("market_snapshot_collector")

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

BATCH_SIZE = 200

if not SUPABASE_DB_URL:
    log.error("SUPABASE_DB_URL manquant dans le .env")
    sys.exit(1)


# ── Classe Principale ────────────────────────────────────────────────────────

class MarketSnapshotCollector:
    """Collecteur de snapshots mensuels pour l'Observatoire Temporel Trajektia."""

    def __init__(self, snapshot_date: Optional[date] = None, dry_run: bool = False):
        """
        Initialise le collecteur.

        Args:
            snapshot_date: Date du snapshot (défaut: premier jour du mois courant)
            dry_run: Si True, n'applique pas les transactions
        """
        self.snapshot_date = snapshot_date or self._get_current_month_start()
        self.dry_run = dry_run
        self.stats = {
            "snapshots_created": 0,
            "skill_demand_records": 0,
            "live_postings_aggregated": 0,
        }

        log.info("=" * 60)
        log.info("  MARKET SNAPSHOT COLLECTOR — Trajektia")
        log.info("  Snapshot date: %s", self.snapshot_date)
        log.info("  Dry run: %s", self.dry_run)
        log.info("=" * 60)

        # Connexion PostgreSQL
        log.info("Connexion à Supabase...")
        self.pg = psycopg2.connect(SUPABASE_DB_URL)
        self.pg.autocommit = False
        psycopg2.extras.register_uuid()
        log.info("Connexion établie.")

    def close(self):
        """Ferme les connexions."""
        if hasattr(self, 'pg'):
            self.pg.close()

    def _get_current_month_start(self) -> date:
        """Retourne le premier jour du mois courant."""
        today = datetime.now()
        return today.replace(day=1).date()

    # ═══════════════════════════════════════════════════════════════════════
    # ÉTAPE 1: Agrégation des offres actives (trajektia_live_job_postings)
    # ═══════════════════════════════════════════════════════════════════════

    def _aggregate_live_postings(self) -> dict:
        """
        Agrège les offres actives par CNP pour le snapshot mensuel.
        Calcule les statistiques de salaire et de volume.
        """
        log.info("Étape 1: Agrégation des offres actives...")

        sql = """
            SELECT
                cnp_code,
                COUNT(*) AS postings_volume,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary_min) AS salary_min_median,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary_max) AS salary_max_median,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (salary_min + salary_max) / 2) AS salary_live_median,
                COUNT(CASE WHEN workplace_mode IN ('Télétravail', 'Hybride') THEN 1 END)::numeric /
                    NULLIF(COUNT(*), 0) * 100 AS remote_ratio_pct,
                array_agg(DISTINCT company_name) AS employers
            FROM trajektia_live_job_postings
            WHERE is_active = TRUE
              AND posted_at >= NOW() - INTERVAL '30 days'
            GROUP BY cnp_code
        """

        with self.pg.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

        aggregated = {}
        for row in rows:
            cnp_code = row[0]
            if not cnp_code:
                continue

            # Calculer les top employers (Top 5 par fréquence)
            employers = row[6] or []
            employer_counts = {}
            for emp in employers:
                if emp:
                    employer_counts[emp] = employer_counts.get(emp, 0) + 1
            top_employers = sorted(employer_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            top_employers_json = [{"name": name, "count": count} for name, count in top_employers]

            aggregated[cnp_code] = {
                "postings_volume": row[1] or 0,
                "salary_min_median": row[2],
                "salary_max_median": row[3],
                "salary_live_median": row[4],
                "remote_ratio_pct": row[5] or 0,
                "top_employers": top_employers_json,
            }

        self.stats["live_postings_aggregated"] = len(aggregated)
        log.info("  %d CNP agrégés depuis les offres actives.", len(aggregated))
        return aggregated

    # ═══════════════════════════════════════════════════════════════════════
    # ÉTAPE 2: Insertion dans trajektia_market_snapshots (UPSERT)
    # ═══════════════════════════════════════════════════════════════════════

    def _create_market_snapshots(self, aggregated_data: dict) -> int:
        """
        Insère/met à jour les snapshots mensuels avec UPSERT idempotent.
        Utilise COALESCE pour éviter d'écraser des données manuelles par des NULLs.
        """
        log.info("Étape 2: Création des market snapshots...")

        if not aggregated_data:
            log.warning("  Aucune donnée à insérer.")
            return 0

        snapshot_date_str = self.snapshot_date.isoformat()
        rows = []

        for cnp_code, data in aggregated_data.items():
            rows.append((
                cnp_code,
                snapshot_date_str,
                data["postings_volume"],
                data.get("salary_live_median"),
                data.get("salary_min_median"),
                data.get("salary_max_median"),
                None,  # statcan_official_median (non généré par ce script)
                None,  # delta_market_pct (calculé séparément)
                None,  # market_tension_index (calculé séparément)
                data.get("remote_ratio_pct"),
                psycopg2.extras.Json(data.get("top_employers", [])),
                psycopg2.extras.Json({}),  # metadata vide
            ))

        sql = """
            INSERT INTO trajektia_market_snapshots (
                cnp_code,
                snapshot_date,
                postings_volume,
                salary_live_median,
                salary_live_min,
                salary_live_max,
                statcan_official_median,
                delta_market_pct,
                market_tension_index,
                remote_ratio_pct,
                top_employers,
                metadata
            ) VALUES %s
            ON CONFLICT (cnp_code, snapshot_date) DO UPDATE SET
                postings_volume   = COALESCE(EXCLUDED.postings_volume, trajektia_market_snapshots.postings_volume),
                salary_live_median = COALESCE(EXCLUDED.salary_live_median, trajektia_market_snapshots.salary_live_median),
                salary_live_min   = COALESCE(EXCLUDED.salary_live_min, trajektia_market_snapshots.salary_live_min),
                salary_live_max   = COALESCE(EXCLUDED.salary_live_max, trajektia_market_snapshots.salary_live_max),
                remote_ratio_pct  = COALESCE(EXCLUDED.remote_ratio_pct, trajektia_market_snapshots.remote_ratio_pct),
                top_employers     = COALESCE(EXCLUDED.top_employers, trajektia_market_snapshots.top_employers),
                metadata          = EXCLUDED.metadata
        """

        with self.pg.cursor() as cur:
            psycopg2.extras.execute_values(cur, sql, rows, page_size=BATCH_SIZE)

        if not self.dry_run:
            self.pg.commit()
            log.info("  ✅ %d snapshots insérés/mis à jour.", len(rows))
        else:
            self.pg.rollback()
            log.info("  [DRY-RUN] %d snapshots would be inserted/updated.", len(rows))

        self.stats["snapshots_created"] = len(rows)
        return len(rows)

    # ═══════════════════════════════════════════════════════════════════════
    # ÉTAPE 3: Agrégation des compétences demandées
    # ═══════════════════════════════════════════════════════════════════════

    def _aggregate_skill_demand(self) -> dict:
        """
        Agrège les compétences demandées par CNP pour le mois en cours.
        Calcule le taux de pénétration marché pour chaque compétence.
        """
        log.info("Étape 3: Agrégation de la demande en compétences...")

        sql = """
            SELECT
                cnp_code,
                skill,
                COUNT(*) AS occurrences,
                COUNT(*)::numeric / NULLIF(MAX(total), 1) * 100 AS penetration_rate
            FROM (
                SELECT
                    cnp_code,
                    UNNEST(extracted_skills) AS skill,
                    COUNT(*) OVER (PARTITION BY cnp_code) AS total
                FROM trajektia_live_job_postings
                WHERE is_active = TRUE
                  AND extracted_skills IS NOT NULL
                  AND extracted_skills != '{}'
                  AND posted_at >= NOW() - INTERVAL '30 days'
            ) sub
            GROUP BY cnp_code, skill
            HAVING COUNT(*) >= 1
            ORDER BY cnp_code, occurrences DESC
        """

        with self.pg.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()

        # Regrouper par CNP
        skill_demand = {}
        for cnp_code, skill, occurrences, penetration in rows:
            if not cnp_code or not skill:
                continue
            if cnp_code not in skill_demand:
                skill_demand[cnp_code] = []
            skill_demand[cnp_code].append({
                "skill_name": skill,
                "occurrences_count": occurrences,
                "penetration_rate_pct": penetration or 0,
            })

        total_records = sum(len(v) for v in skill_demand.values())
        log.info("  %d enregistrements de compétences agrégés.", total_records)
        return skill_demand

    # ═══════════════════════════════════════════════════════════════════════
    # ÉTAPE 4: Insertion dans trajektia_skill_demand_history (UPSERT)
    # ═══════════════════════════════════════════════════════════════════════

    def _create_skill_demand_history(self, skill_demand: dict) -> int:
        """
        Insère/met à jour l'historique de demande en compétences.
        Utilise COALESCE pour l'idempotence.
        """
        log.info("Étape 4: Création de l'historique de demande en compétences...")

        if not skill_demand:
            log.warning("  Aucune donnée de compétences à insérer.")
            return 0

        snapshot_date_str = self.snapshot_date.isoformat()
        rows = []

        # Déterminer si une compétence est "émergente" (non présente dans la CNP officielle)
        # Pour simplifier: on marque comme émergent si penetration_rate > 50%
        for cnp_code, skills in skill_demand.items():
            for skill_data in skills:
                is_emerging = skill_data["penetration_rate_pct"] > 50
                rows.append((
                    cnp_code,
                    skill_data["skill_name"],
                    snapshot_date_str,
                    skill_data["occurrences_count"],
                    skill_data["penetration_rate_pct"],
                    is_emerging,
                    "stable",  # trend_momentum (à calculer avec des données historiques)
                ))

        sql = """
            INSERT INTO trajektia_skill_demand_history (
                cnp_code,
                skill_name,
                snapshot_date,
                occurrences_count,
                penetration_rate_pct,
                is_emerging,
                trend_momentum
            ) VALUES %s
            ON CONFLICT (cnp_code, skill_name, snapshot_date) DO UPDATE SET
                occurrences_count    = COALESCE(EXCLUDED.occurrences_count, trajektia_skill_demand_history.occurrences_count),
                penetration_rate_pct = COALESCE(EXCLUDED.penetration_rate_pct, trajektia_skill_demand_history.penetration_rate_pct),
                is_emerging         = COALESCE(EXCLUDED.is_emerging, trajektia_skill_demand_history.is_emerging),
                trend_momentum      = COALESCE(EXCLUDED.trend_momentum, trajektia_skill_demand_history.trend_momentum)
        """

        with self.pg.cursor() as cur:
            psycopg2.extras.execute_values(cur, sql, rows, page_size=BATCH_SIZE)

        if not self.dry_run:
            self.pg.commit()
            log.info("  ✅ %d enregistrements de compétences insérés/mis à jour.", len(rows))
        else:
            self.pg.rollback()
            log.info("  [DRY-RUN] %d skill demand records would be inserted/updated.", len(rows))

        self.stats["skill_demand_records"] = len(rows)
        return len(rows)

    # ═══════════════════════════════════════════════════════════════════════
    # ÉTAPE 5: Nettoyage des anciennes offres inactives
    # ═══════════════════════════════════════════════════════════════════════

    def _cleanup_expired_postings(self) -> int:
        """
        Marque comme inactives les offres expirées (plus de 30 jours).
        """
        log.info("Étape 5: Nettoyage des offres expirées...")

        sql = """
            UPDATE trajektia_live_job_postings
            SET is_active = FALSE
            WHERE is_active = TRUE
              AND expires_at < NOW()
        """

        with self.pg.cursor() as cur:
            cur.execute(sql)
            updated = cur.rowcount

        if not self.dry_run:
            self.pg.commit()
            log.info("  ✅ %d offres marquées comme inactives.", updated)
        else:
            self.pg.rollback()
            log.info("  [DRY-RUN] %d postings would be marked inactive.", updated)

        return updated

    # ═══════════════════════════════════════════════════════════════════════
    # RAPPORT FINAL
    # ═══════════════════════════════════════════════════════════════════════

    def report(self):
        """Affiche le rapport final."""
        log.info("\n%s", "=" * 60)
        log.info("  RAPPORT FINAL — MARKET SNAPSHOT COLLECTOR")
        log.info("=" * 60)
        log.info("  Snapshot date:       %s", self.snapshot_date)
        log.info("  Offres agrégées:     %d", self.stats["live_postings_aggregated"])
        log.info("  Snapshots créés:     %d", self.stats["snapshots_created"])
        log.info("  Compétences history: %d", self.stats["skill_demand_records"])
        log.info("  Mode:                %s", "DRY-RUN" if self.dry_run else "LIVE")
        log.info("=" * 60)

    # ═══════════════════════════════════════════════════════════════════════
    # POINT D'ENTRÉE
    # ═══════════════════════════════════════════════════════════════════════

    def run(self):
        """Exécute le pipeline complet de collecte."""
        try:
            # Étape 1: Agréger les offres actives
            aggregated_data = self._aggregate_live_postings()

            # Étape 2: Créer les market snapshots
            self._create_market_snapshots(aggregated_data)

            # Étape 3: Agréger les compétences
            skill_demand = self._aggregate_skill_demand()

            # Étape 4: Créer l'historique de compétences
            self._create_skill_demand_history(skill_demand)

            # Étape 5: Nettoyage
            self._cleanup_expired_postings()

            # Rapport final
            self.report()

            if self.dry_run:
                log.info("\n⚠️  Exécution en mode DRY-RUN — Aucune donnée n'a étécommitée.")
            else:
                log.info("\n✅ Collecte mensuelle terminée avec succès.")

        except Exception as e:
            log.exception("Erreur fatale: %s", e)
            self.pg.rollback()
            sys.exit(1)


# ── Main ───────────────────────────────────────────────────────────────────────

def parse_args():
    """Parse les arguments de ligne de commande."""
    parser = argparse.ArgumentParser(
        description="Market Snapshot Collector — ETL mensuel Trajektia"
    )
    parser.add_argument(
        "--date",
        type=str,
        help="Date du snapshot (format: YYYY-MM-DD, défaut: premier jour du mois courant)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Exécuter sans commiter les transactions",
    )
    return parser.parse_args()


def main():
    """Point d'entrée principal."""
    args = parse_args()

    # Parser la date si fournie
    snapshot_date = None
    if args.date:
        try:
            snapshot_date = datetime.strptime(args.date, "%Y-%m-%d").date()
        except ValueError:
            log.error("Format de date invalide: %s (utilisez YYYY-MM-DD)", args.date)
            sys.exit(1)

    # Créer et exécuter le collecteur
    collector = MarketSnapshotCollector(
        snapshot_date=snapshot_date,
        dry_run=args.dry_run,
    )

    try:
        collector.run()
    finally:
        collector.close()


if __name__ == "__main__":
    main()
