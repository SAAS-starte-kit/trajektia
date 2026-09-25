import unittest
import os
import math
import sys

# Add the parent directory to the Python path to allow running with `python scripts/test_generate_job_embeddings.py`
# Since we are running the test from the root usually, let's make it flexible.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.generate_job_embeddings import format_job_chunk, generate_embedding

class TestGenerateJobEmbeddings(unittest.TestCase):
    def test_format_job_chunk(self):
        title = "Développeur Backend"
        cnp = "21232"
        cnp_title = "Développeurs/développeuses de logiciels"
        city = "Montréal"
        region = "Montréal"
        remote_status = "Télétravail"
        skills = ["Python", "PostgreSQL", "API"]
        description = "Maintenance et développement."
        
        chunk = format_job_chunk(title, cnp, cnp_title, city, region, remote_status, skills, description)
        
        self.assertIn("Développeur Backend", chunk)
        self.assertIn("21232", chunk)
        self.assertIn("Montréal", chunk)
        self.assertIn("Python", chunk)
        self.assertIn("PostgreSQL", chunk)
        self.assertIn("API", chunk)
        self.assertIn("Maintenance et développement.", chunk)

    def test_generate_mock_embedding(self):
        text = "This is a test job description."
        embedding = generate_embedding(text, mock=True)
        
        self.assertEqual(len(embedding), 768)
        
        # Verify L2 norm is approximately 1.0
        l2_norm = math.sqrt(sum(x**2 for x in embedding))
        self.assertAlmostEqual(l2_norm, 1.0, places=5)
        
        # Verify determinism
        embedding2 = generate_embedding(text, mock=True)
        self.assertEqual(embedding, embedding2)

    def test_sql_schema_syntax(self):
        # Make the path robust regardless of where the test is run from
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        schema_path = os.path.join(base_dir, "packages/database/schema_v16_job_postings_vectors.sql")
        
        self.assertTrue(os.path.exists(schema_path), f"Schema file not found at {schema_path}")
        
        with open(schema_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        self.assertIn("CREATE EXTENSION IF NOT EXISTS vector;", content)
        self.assertIn("vector(768)", content)
        self.assertIn("job_postings_vectors", content)

if __name__ == '__main__':
    unittest.main()
