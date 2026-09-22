"""Re-run uniquement la partie ESCO du crosswalk (NOC-ONET deja fait)."""
import sys
sys.path.insert(0, ".")
from backend.scripts.unified_crosswalk_loader import UnifiedCrosswalkLoader

loader = UnifiedCrosswalkLoader()
try:
    loader.load_esco_onet("data/raw/crosswalks/esco_onet_mapping.csv")
finally:
    loader.close()
