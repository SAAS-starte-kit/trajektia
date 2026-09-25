import unittest
import json
import subprocess
import sys
import os
import tempfile

# Ensure the root directory is in the path to import from scripts
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.ingest_esco_green_skills import (
    extract_green_skills_from_dataset,
    map_green_skills_to_noc,
    GREEN_DOMAINS
)

class TestIngestEscoGreenSkills(unittest.TestCase):

    def setUp(self):
        self.sample_data = json.dumps([
            {"label_en": "install solar panels", "label_fr": "installer des panneaux solaires", "uri": "esco:1", "green_category": "green"},
            {"label_en": "manage waste", "label_fr": "gérer les déchets", "uri": "esco:2", "green_category": "green"},
            {"label_en": "build sustainable walls", "label_fr": "construire des murs durables", "uri": "esco:3", "green_category": "green"},
            {"label_en": "audit environmental compliance", "label_fr": "auditer la conformité environnementale", "uri": "esco:4", "green_category": "green"},
            {"label_en": "repair electric vehicles", "label_fr": "réparer des véhicules électriques", "uri": "esco:5", "green_category": "green"},
            {"label_en": "serve coffee", "label_fr": "servir du café", "uri": "esco:6", "green_category": "none"},
            {"label_en": "generic green task", "label_fr": "tâche verte", "uri": "esco:7", "green_category": "green"}
        ])

    def test_green_skills_filtering(self):
        """Verifies that non-green skills are excluded and green skills are accurately categorized."""
        skills = extract_green_skills_from_dataset(self.sample_data)
        
        # 7 items total, 1 is non-green ("serve coffee")
        self.assertEqual(len(skills), 6)
        
        # Check specific categorizations
        solar_skill = next((s for s in skills if s["uri"] == "esco:1"), None)
        self.assertIsNotNone(solar_skill)
        self.assertEqual(solar_skill["domain"], "Énergie renouvelable & Réseaux intelligents")
        
        waste_skill = next((s for s in skills if s["uri"] == "esco:2"), None)
        self.assertIsNotNone(waste_skill)
        self.assertEqual(waste_skill["domain"], "Économie circulaire & Gestion des matières")

        generic_green = next((s for s in skills if s["uri"] == "esco:7"), None)
        self.assertIsNotNone(generic_green)
        self.assertEqual(generic_green["domain"], "Conformité environnementale & Bilan carbone") # Default for green matching
        
        # Ensure non-green skill is excluded
        coffee_skill = next((s for s in skills if s["uri"] == "esco:6"), None)
        self.assertIsNone(coffee_skill)

    def test_noc_mapping_heuristics(self):
        """Asserts that engineering, construction, and environmental CNP codes receive appropriate green tags."""
        skills = extract_green_skills_from_dataset(self.sample_data)
        noc_mapping = map_green_skills_to_noc(skills)
        
        # Renewable energy mapped to 212 and 72
        # Circular economy mapped to 211
        # Sustainable construction mapped to 72 and 212
        # Environmental compliance mapped to 211
        # Clean transportation mapped to 73 and 212
        
        self.assertTrue(len(noc_mapping["212"]) > 0, "Engineering (212) should have mapped skills")
        self.assertTrue(len(noc_mapping["211"]) > 0, "Environmental Sciences (211) should have mapped skills")
        self.assertTrue(len(noc_mapping["72"]) > 0, "Construction Trades (72) should have mapped skills")
        self.assertTrue(len(noc_mapping["73"]) > 0, "Transport (73) should have mapped skills")

        # Specific check: Solar panel install (Renewable Energy) should be in 212 and 72
        solar_in_212 = any(s["uri"] == "esco:1" for s in noc_mapping["212"])
        solar_in_72 = any(s["uri"] == "esco:1" for s in noc_mapping["72"])
        self.assertTrue(solar_in_212)
        self.assertTrue(solar_in_72)

    def test_cli_dry_run(self):
        """Verifies script executes cleanly with --dry-run."""
        script_path = os.path.join(os.path.dirname(__file__), "ingest_esco_green_skills.py")
        
        with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp_input:
            temp_input.write(self.sample_data)
            temp_input_path = temp_input.name
            
        try:
            result = subprocess.run(
                [sys.executable, script_path, "--dry-run", "--input", temp_input_path],
                capture_output=True,
                text=True
            )
            
            self.assertEqual(result.returncode, 0, f"Script failed with output: {result.stderr}")
            self.assertIn("Total Green Skills Found: 6", result.stdout)
            self.assertIn("NOC Prefix 212:", result.stdout)
        finally:
            os.remove(temp_input_path)

if __name__ == '__main__':
    unittest.main()
