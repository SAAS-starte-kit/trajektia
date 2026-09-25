-- Migration v16: Job Postings Vectors for Semantic Matching (I7.2)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS job_postings_vectors (
    id BIGSERIAL PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    cnp_code VARCHAR(10) NOT NULL,
    job_title TEXT NOT NULL,
    city TEXT,
    region TEXT,
    content_chunk TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_postings_vectors_cnp_idx ON job_postings_vectors (cnp_code);
CREATE INDEX IF NOT EXISTS job_postings_vectors_embedding_idx ON job_postings_vectors USING hnsw (embedding vector_cosine_ops);
