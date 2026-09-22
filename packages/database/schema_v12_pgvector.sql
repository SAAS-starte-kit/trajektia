-- =====================================================================================
-- SCHEMA V12 : Intelligence Artificielle & Vectorisation (pgvector)
-- =====================================================================================

-- 1. Activer l'extension pgvector dans Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ajouter les colonnes de vecteurs sémantiques (384 dimensions pour all-MiniLM-L6-v2)

-- A. Vecteurs pour les professions (Basé sur la description et le titre)
ALTER TABLE occupations
ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Index HNSW (Hierarchical Navigable Small World) pour des recherches ultra-rapides
CREATE INDEX IF NOT EXISTS idx_occupations_embedding 
ON occupations USING hnsw (embedding vector_cosine_ops);

-- B. Vecteurs pour les compétences O*NET (Basé sur le nom)
ALTER TABLE competencies
ADD COLUMN IF NOT EXISTS embedding vector(384);

CREATE INDEX IF NOT EXISTS idx_competencies_embedding 
ON competencies USING hnsw (embedding vector_cosine_ops);

-- C. Vecteurs pour les compétences brutes du Cégep (Basé sur meq_raw_text)
ALTER TABLE program_competencies
ADD COLUMN IF NOT EXISTS embedding vector(384);

CREATE INDEX IF NOT EXISTS idx_program_competencies_embedding 
ON program_competencies USING hnsw (embedding vector_cosine_ops);
