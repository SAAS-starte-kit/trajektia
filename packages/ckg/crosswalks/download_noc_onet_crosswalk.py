"""
download_noc_onet_crosswalk.py — Download NOC 2021 <-> O*NET SOC crosswalk
==========================================================================
Downloads the official mapping from The Dais / TMU GitHub repository.
Source: https://github.com/thedaisTMU/NOC_ONet_Crosswalk

Usage:
  cd backend
  python scripts/download_noc_onet_crosswalk.py
"""
import sys
import os
import csv
from pathlib import Path
from urllib.request import urlopen, Request
import json

# Ajouter ckg/ au sys.path pour importer ckg_config
ckg_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(ckg_dir))
from ckg_config import DATA_CROSSWALK, CROSSWALK_NOC_ONET

RAW_DIR = DATA_CROSSWALK
OUTPUT_FILE = CROSSWALK_NOC_ONET

# Primary source: The Dais / TMU GitHub raw CSV
URLS = [
    "https://raw.githubusercontent.com/thedaisTMU/NOC_ONet_Crosswalk/refs/heads/main/NOC_ONet_Crosswalk.csv",
    "https://raw.githubusercontent.com/thedaisTMU/NOC_ONet_Crosswalk/main/NOC_ONet_Crosswalk.csv",
]

def download_with_fallback(urls):
    """Try each URL, return content from first success."""
    for url in urls:
        try:
            print(f"  Trying: {url}")
            req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urlopen(req, timeout=15) as resp:
                content = resp.read().decode('utf-8')
                # Validate: must have header row with 'noc' column
                first_line = content.split('\n')[0].strip()
                if 'noc' in first_line.lower() and len(content) > 100:
                    print(f"  Success from: {url}")
                    return content
                else:
                    print(f"  Invalid content (first line: {first_line[:80]})")
        except Exception as e:
            print(f"  Failed: {e}")
    return None

def main():
    print("=" * 60)
    print("NOC 2021 <-> O*NET SOC Crosswalk Downloader")
    print("=" * 60)

    RAW_DIR.mkdir(parents=True, exist_ok=True)

    # Check if existing file is valid
    if OUTPUT_FILE.exists():
        content = OUTPUT_FILE.read_text(encoding='utf-8')
        first_line = content.split('\n')[0].strip()
        if 'noc' in first_line.lower() and len(content) > 100:
            lines = content.strip().split('\n')
            print(f"\nExisting file looks valid: {len(lines)} lines (including header)")
            print(f"  Header: {first_line}")
            resp = input("Re-download anyway? (y/N): ").strip().lower()
            if resp != 'y':
                print("Keeping existing file. Done.")
                return

    print("\nDownloading crosswalk...")
    content = download_with_fallback(URLS)

    if not content:
        print("\nERROR: Could not download crosswalk from any source.")
        print("Please download manually from:")
        print("  https://github.com/thedaisTMU/NOC_ONet_Crosswalk")
        print("  Save as: data/raw/crosswalks/noc_onet_mapping.csv")
        sys.exit(1)

    # Write to file
    OUTPUT_FILE.write_text(content, encoding='utf-8')
    lines = content.strip().split('\n')
    print(f"\nSaved to: {OUTPUT_FILE}")
    print(f"  Rows: {len(lines) - 1} (excluding header)")
    print(f"  Header: {lines[0]}")

    # Quick validation
    reader = csv.DictReader(content.strip().split('\n'))
    rows = list(reader)
    print(f"  Parsed columns: {reader.fieldnames}")
    print(f"  Sample row: {rows[0] if rows else 'N/A'}")

    print("\nDone.")

if __name__ == "__main__":
    main()
