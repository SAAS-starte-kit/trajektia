#!/usr/bin/env python3
"""
ingest_crosswalks.py — Trajektia Phase 2 ETL
=============================================
Downloads, cleans and ingests two international career-taxonomy crosswalks
into the Supabase PostgreSQL instance.

Crosswalk 1 — Canada ↔ USA  : NOC 2021 ↔ O*NET 26
  Source : https://github.com/thedaisTMU/NOC_ONet_Crosswalk
  File   : noc2021_onet26.csv
  Columns: noc, noc_title, onet, onet_title
  Target : noc_onet_crosswalk

Crosswalk 2 — USA ↔ Europe  : O*NET 2019 ↔ ESCO v1.1.0
  Source : https://esco.ec.europa.eu/en/use-esco/other-crosswalks
  File   : ONET_(Occupations)_0_updated.csv
  Columns: O*NET Id, O*NET Title, O*NET Description,
           ESCO or ISCO URI, ESCO or ISCO Title, ESCO or ISCO Description,
           Type of Match
  Target : onet_esco_crosswalk

Usage:
  python etl/ingest_crosswalks.py [--dry-run] [--crosswalk noc|esco|all]

Environment variables (loaded from .env):
  SUPABASE_DB_URL         PostgreSQL connection URL (direct, not pooled)
  SUPABASE_SERVICE_KEY    Supabase service_role key (fallback via REST)
  SUPABASE_URL            Supabase project URL (for REST fallback)
"""

import argparse
import csv
import io
import logging
import os
import sys
import time
from typing import Generator

import psycopg2
import psycopg2.extras
import requests
from dotenv import load_dotenv

# ──────────────────────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────────────────────

NOC_ONET_URL = (
    "https://raw.githubusercontent.com/thedaisTMU/"
    "NOC_ONet_Crosswalk/master/noc2021_onet26.csv"
)

ONET_ESCO_URL = (
    "https://esco.ec.europa.eu/system/files/2023-08/"
    "ONET_%28Occupations%29_0_updated.csv"
)

# Number of rows to upsert per batch
BATCH_SIZE = 500

# Accepted values for ESCO match_type (mirrors the DB enum)
VALID_MATCH_TYPES = {
    "exactMatch",
    "closeMatch",
    "broadMatch",
    "narrowMatch",
    "exactISCO",
}

# ──────────────────────────────────────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ingest_crosswalks")


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def load_env() -> dict:
    """Load .env from the trajektia root and return relevant keys."""
    # Walk up from this file to find .env
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)          # trajektia/
    dotenv_path = os.path.join(root, ".env")
    load_dotenv(dotenv_path, override=True)

    # Note: Supabase's direct host (db.*.supabase.co:5432) may not resolve from
    # some network environments. The PgBouncer pooler (port 6543) in session mode
    # is compatible with psycopg2.extras.execute_batch.
    url = os.getenv("SUPABASE_DB_URL") or os.getenv("SUPABASE_DB_URL_DIRECT") or os.getenv("DATABASE_URL")
    if not url:
        log.error("No DB URL found. Set SUPABASE_DB_URL in .env")
        sys.exit(1)
    log.info("DB : %s", url.split("@")[-1])   # log host only, never credentials

    return {
        "db_url": url,
        "supabase_url": os.getenv("SUPABASE_URL", ""),
        "service_key": os.getenv("SUPABASE_SERVICE_KEY", ""),
    }


def get_connection(db_url: str):
    """Return a psycopg2 connection with autocommit disabled."""
    conn = psycopg2.connect(db_url)
    conn.autocommit = False
    return conn


def fetch_csv_bytes(url: str, timeout: int = 60) -> bytes:
    """Download a CSV file and return its raw bytes."""
    log.info("Downloading: %s", url)
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    log.info("  → %d bytes received", len(resp.content))
    return resp.content


def batched(iterable, n: int) -> Generator:
    """Yield successive n-sized batches from an iterable."""
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == n:
            yield batch
            batch = []
    if batch:
        yield batch


def upsert_batch(cur, table: str, columns: list[str], rows: list[tuple],
                 conflict_cols: list[str], update_cols: list[str]) -> int:
    """Execute a single ON CONFLICT DO UPDATE upsert for a batch of rows."""
    if not rows:
        return 0

    col_list = ", ".join(columns)
    placeholders = ", ".join(["%s"] * len(columns))
    update_set = ", ".join(
        f"{c} = EXCLUDED.{c}" for c in update_cols
    )
    conflict = ", ".join(conflict_cols)

    sql = (
        f"INSERT INTO {table} ({col_list}) "
        f"VALUES ({placeholders}) "
        f"ON CONFLICT ({conflict}) DO UPDATE SET {update_set}"
    )

    psycopg2.extras.execute_batch(cur, sql, rows, page_size=BATCH_SIZE)
    return len(rows)


# ──────────────────────────────────────────────────────────────────────────────
# Crosswalk 1 : NOC ↔ O*NET
# ──────────────────────────────────────────────────────────────────────────────

def parse_noc_onet(raw: bytes) -> list[tuple]:
    """
    Parse noc2021_onet26.csv.
    Columns: noc, noc_title, onet, onet_title
    Returns list of (noc_code, noc_title, onet_soc_code, onet_title) tuples.
    """
    text = raw.decode("utf-8-sig")          # strip BOM if present
    reader = csv.DictReader(io.StringIO(text))

    rows = []
    skipped = 0
    for i, row in enumerate(reader, start=2):
        noc = (row.get("noc") or "").strip()
        onet = (row.get("onet") or "").strip()

        if not noc or not onet:
            skipped += 1
            continue

        rows.append((
            noc,
            (row.get("noc_title") or "").strip() or None,
            onet,
            (row.get("onet_title") or "").strip() or None,
        ))

    log.info("NOC↔O*NET parse: %d valid rows, %d skipped", len(rows), skipped)
    return rows


def ingest_noc_onet(conn, rows: list[tuple], dry_run: bool) -> None:
    """Upsert NOC↔O*NET crosswalk rows into noc_onet_crosswalk."""
    table = "noc_onet_crosswalk"
    columns = ["noc_code", "noc_title", "onet_soc_code", "onet_title"]
    conflict_cols = ["noc_code", "onet_soc_code"]
    update_cols = ["noc_title", "onet_title"]

    total = 0
    if dry_run:
        for batch in batched(rows, BATCH_SIZE):
            log.info("[DRY-RUN] Would upsert %d rows into %s", len(batch), table)
            total += len(batch)
        log.info("✓ noc_onet_crosswalk — %d rows validated (dry-run)", total)
        return

    with conn.cursor() as cur:
        for batch in batched(rows, BATCH_SIZE):
            total += upsert_batch(cur, table, columns, batch, conflict_cols, update_cols)
        conn.commit()

    log.info("✓ noc_onet_crosswalk — %d rows upserted", total)


# ──────────────────────────────────────────────────────────────────────────────
# Crosswalk 2 : O*NET ↔ ESCO
# ──────────────────────────────────────────────────────────────────────────────

def parse_onet_esco(raw: bytes) -> list[tuple]:
    """
    Parse ONET_(Occupations)_0_updated.csv.

    The file contains a 19-line metadata header before the actual CSV header row:
        O*NET Id,O*NET Title,O*NET Description,ESCO or ISCO URI,
        ESCO or ISCO Title,ESCO or ISCO Description,Type of Match

    Returns list of tuples:
        (onet_soc_code, onet_title, onet_description,
         esco_uri, esco_title, esco_description, match_type)
    """
    text = raw.decode("utf-8-sig")
    lines = text.splitlines()

    # Find the real header row (starts with "O*NET Id")
    header_line = None
    for idx, line in enumerate(lines):
        if line.strip().startswith("O*NET Id") or "O*NET Id" in line:
            header_line = idx
            break

    if header_line is None:
        log.error("Could not locate header row in O*NET↔ESCO CSV. Aborting.")
        sys.exit(1)

    log.info("ESCO CSV real header found at line %d", header_line + 1)

    # Re-parse from that row onward
    data_text = "\n".join(lines[header_line:])
    reader = csv.DictReader(io.StringIO(data_text))

    rows = []
    skipped = 0
    match_type_errors = 0

    for row in reader:
        onet_id   = (row.get("O*NET Id") or "").strip()
        esco_uri  = (row.get("ESCO or ISCO URI") or "").strip()

        # Both PKs must be present
        if not onet_id or not esco_uri:
            skipped += 1
            continue

        # Normalise match type
        raw_match = (row.get("Type of Match") or "").strip()
        match_type = raw_match if raw_match in VALID_MATCH_TYPES else None
        if raw_match and match_type is None:
            match_type_errors += 1
            log.debug("Unknown match type '%s' — stored as NULL", raw_match)

        rows.append((
            onet_id,
            (row.get("O*NET Title") or "").strip() or None,
            (row.get("O*NET Description") or "").strip() or None,
            esco_uri,
            (row.get("ESCO or ISCO Title") or "").strip() or None,
            (row.get("ESCO or ISCO Description") or "").strip() or None,
            match_type,
        ))

    log.info(
        "O*NET↔ESCO parse: %d valid rows, %d skipped, %d unknown match types",
        len(rows), skipped, match_type_errors,
    )
    return rows


def ingest_onet_esco(conn, rows: list[tuple], dry_run: bool) -> None:
    """Upsert O*NET↔ESCO crosswalk rows into onet_esco_crosswalk."""
    table = "onet_esco_crosswalk"
    columns = [
        "onet_soc_code", "onet_title", "onet_description",
        "esco_uri", "esco_title", "esco_description", "match_type",
    ]
    conflict_cols = ["onet_soc_code", "esco_uri"]
    update_cols = [
        "onet_title", "onet_description",
        "esco_title", "esco_description", "match_type",
    ]

    total = 0
    if dry_run:
        for batch in batched(rows, BATCH_SIZE):
            log.info("[DRY-RUN] Would upsert %d rows into %s", len(batch), table)
            total += len(batch)
        log.info("✓ onet_esco_crosswalk — %d rows validated (dry-run)", total)
        return

    with conn.cursor() as cur:
        for batch in batched(rows, BATCH_SIZE):
            total += upsert_batch(cur, table, columns, batch, conflict_cols, update_cols)
        conn.commit()

    log.info("✓ onet_esco_crosswalk — %d rows upserted", total)


# ──────────────────────────────────────────────────────────────────────────────
# Validation queries
# ──────────────────────────────────────────────────────────────────────────────

def print_stats(conn) -> None:
    """Print row counts and a sample from each crosswalk table."""
    with conn.cursor() as cur:
        # Counts
        for table in ("noc_onet_crosswalk", "onet_esco_crosswalk", "v_noc_onet_esco"):
            try:
                cur.execute(f"SELECT COUNT(*) FROM {table}")
                count = cur.fetchone()[0]
                log.info("  %-30s : %d rows", table, count)
            except Exception as exc:
                log.warning("  Could not count %s : %s", table, exc)
                conn.rollback()

        # Match-type distribution
        try:
            cur.execute("""
                SELECT match_type::text, COUNT(*) AS n
                FROM onet_esco_crosswalk
                GROUP BY match_type
                ORDER BY n DESC
            """)
            log.info("  O*NET↔ESCO match_type distribution:")
            for mt, n in cur.fetchall():
                log.info("    %-14s : %d", mt or "NULL", n)
        except Exception as exc:
            log.warning("  match_type stats unavailable: %s", exc)
            conn.rollback()

        # Sample triple crosswalk
        try:
            cur.execute("""
                SELECT noc_code, noc_title, onet_soc_code, esco_title, onet_esco_match_type
                FROM v_noc_onet_esco
                WHERE esco_uri IS NOT NULL
                LIMIT 5
            """)
            rows = cur.fetchall()
            if rows:
                log.info("  Triple crosswalk sample (NOC ↔ O*NET ↔ ESCO):")
                for r in rows:
                    log.info(
                        "    NOC %-8s | O*NET %-12s | ESCO: %s [%s]",
                        r[0], r[2], r[3] or "—", r[4] or "?"
                    )
        except Exception as exc:
            log.warning("  Sample query failed: %s", exc)
            conn.rollback()


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def build_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Ingest NOC↔O*NET and O*NET↔ESCO crosswalks into Supabase."
    )
    p.add_argument(
        "--crosswalk", choices=["noc", "esco", "all"], default="all",
        help="Which crosswalk(s) to ingest (default: all)"
    )
    p.add_argument(
        "--dry-run", action="store_true",
        help="Parse and validate without writing to the database"
    )
    return p.parse_args()


def main() -> None:
    args = build_args()
    env  = load_env()

    if args.dry_run:
        log.info("═══ DRY-RUN mode — no data will be written to the database ═══")

    t0 = time.perf_counter()

    # ── Crosswalk 1: NOC ↔ O*NET ────────────────────────────────────────────
    if args.crosswalk in ("noc", "all"):
        log.info("── [1/2] NOC 2021 ↔ O*NET 26 ──────────────────────────────")
        raw_noc = fetch_csv_bytes(NOC_ONET_URL)
        noc_rows = parse_noc_onet(raw_noc)

        if not args.dry_run:
            conn = get_connection(env["db_url"])
            try:
                ingest_noc_onet(conn, noc_rows, dry_run=False)
            finally:
                conn.close()
        else:
            ingest_noc_onet(None, noc_rows, dry_run=True)

    # ── Crosswalk 2: O*NET ↔ ESCO ───────────────────────────────────────────
    if args.crosswalk in ("esco", "all"):
        log.info("── [2/2] O*NET 2019 ↔ ESCO v1.1 ───────────────────────────")
        raw_esco = fetch_csv_bytes(ONET_ESCO_URL)
        esco_rows = parse_onet_esco(raw_esco)

        if not args.dry_run:
            conn = get_connection(env["db_url"])
            try:
                ingest_onet_esco(conn, esco_rows, dry_run=False)
            finally:
                conn.close()
        else:
            ingest_onet_esco(None, esco_rows, dry_run=True)

    # ── Validation stats ─────────────────────────────────────────────────────
    if not args.dry_run:
        log.info("── Validation ──────────────────────────────────────────────")
        conn = get_connection(env["db_url"])
        try:
            print_stats(conn)
        finally:
            conn.close()

    elapsed = time.perf_counter() - t0
    log.info("═══ Done in %.1f s ═════════════════════════════════════════════", elapsed)


if __name__ == "__main__":
    main()
