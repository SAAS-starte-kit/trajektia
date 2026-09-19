-- =====================================================================================
-- SCHEMA V14 : Indice de Mutation Trajektia™ & Embeddings des Offres
-- =====================================================================================

-- 1. Ajouter la colonne d'embedding aux offres d'emploi (384 dimensions)
ALTER TABLE trajektia_live_job_postings
ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 2. Index HNSW pour les offres
CREATE INDEX IF NOT EXISTS idx_live_jobs_embedding 
ON trajektia_live_job_postings USING hnsw (embedding vector_cosine_ops);

-- 3. Ajouter les colonnes pour l'Indice de Mutation (IDS) dans les snapshots mensuels
ALTER TABLE trajektia_market_snapshots
ADD COLUMN IF NOT EXISTS mutation_index NUMERIC(4, 2),
ADD COLUMN IF NOT EXISTS mutation_status VARCHAR(50);
