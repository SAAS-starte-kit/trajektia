import math
import unittest
from generate_ckg_embeddings import format_occupation_chunk, generate_embedding

class TestGenerateCKGEmbeddings(unittest.TestCase):
    
    def test_format_occupation_chunk(self):
        chunk = format_occupation_chunk(
            cnp="21232",
            title_fr="Développeur web",
            description_fr="Conçoit et crée des sites web.",
            category_fr="Informatique",
            riasec="IRC"
        )
        self.assertIn("Code CNP: 21232", chunk)
        self.assertIn("Métier: Développeur web", chunk)
        self.assertIn("Domaine: Informatique", chunk)
        self.assertIn("RIASEC: IRC", chunk)
        self.assertIn("Description: Conçoit et crée des sites web.", chunk)
        
    def test_embedding_dimension_and_norm(self):
        chunk = format_occupation_chunk(
            cnp="21232", 
            title_fr="Développeur web"
        )
        embedding = generate_embedding(chunk, mock=True)
        
        self.assertEqual(len(embedding), 768, "Embedding dimension should be 768")
        
        # Calculate L2 norm
        norm = math.sqrt(sum(x * x for x in embedding))
        self.assertAlmostEqual(norm, 1.0, places=5, msg="Embedding should be a unit vector (L2 norm ~ 1.0)")
        
    def test_cosine_similarity_relevance(self):
        # Correctly passing keyword arguments to avoid positional mismatch
        dev_web = format_occupation_chunk(
            cnp="21232", 
            title_fr="Développeur web", 
            description_fr="Conçoit des sites web.", 
            category_fr="Informatique", 
            riasec="IRC"
        )
        dev_log = format_occupation_chunk(
            cnp="21231", 
            title_fr="Développeur logiciel", 
            description_fr="Conçoit des logiciels.", 
            category_fr="Informatique", 
            riasec="IRC"
        )
        boucher = format_occupation_chunk(
            cnp="63201", 
            title_fr="Boucher/Charcutier", 
            description_fr="Prépare de la viande.", 
            category_fr="Alimentation", 
            riasec="RCE"
        )
        
        v_dev_web = generate_embedding(dev_web, mock=True)
        v_dev_log = generate_embedding(dev_log, mock=True)
        v_boucher = generate_embedding(boucher, mock=True)
        
        def cosine_similarity(v1, v2):
            return sum(a*b for a, b in zip(v1, v2))
            
        sim_tech = cosine_similarity(v_dev_web, v_dev_log)
        sim_diff = cosine_similarity(v_dev_web, v_boucher)
        
        self.assertGreater(sim_tech, sim_diff, "Similarity between tech jobs should be greater than between a tech job and a butcher.")

if __name__ == '__main__':
    unittest.main()
