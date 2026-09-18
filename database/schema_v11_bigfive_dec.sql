-- =====================================================================================
-- SCHEMA V11 : Moteur Psychométrique Big Five & Fondations Extraction DEC
-- =====================================================================================

-- 1. Moteur Psychométrique : Le Modèle OCEAN (Big Five)
CREATE TABLE IF NOT EXISTS big_five_profiles (
    cnp_code VARCHAR(10) PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    openness_score NUMERIC(5, 2) NOT NULL CHECK (openness_score BETWEEN 0 AND 100),
    conscientiousness_score NUMERIC(5, 2) NOT NULL CHECK (conscientiousness_score BETWEEN 0 AND 100),
    extraversion_score NUMERIC(5, 2) NOT NULL CHECK (extraversion_score BETWEEN 0 AND 100),
    agreeableness_score NUMERIC(5, 2) NOT NULL CHECK (agreeableness_score BETWEEN 0 AND 100),
    neuroticism_score NUMERIC(5, 2) NOT NULL CHECK (neuroticism_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fondations Extraction DEC : Compétences brutes des guides MEQ
CREATE TABLE IF NOT EXISTS program_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_code VARCHAR(50) NOT NULL, -- Correspond au code MEQ (ex: 410.D0)
    meq_raw_text TEXT NOT NULL,
    mapped_competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    similarity_score NUMERIC(5, 2), -- Score de confiance de l'IA (0-100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_program_competencies_code ON program_competencies (program_code);
