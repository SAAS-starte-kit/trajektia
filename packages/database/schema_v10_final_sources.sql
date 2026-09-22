-- =====================================================================================
-- SCHEMA V10 : Finalisation des sources de données (TCC 2025, BLS ORS, LAD, ISQ)
-- =====================================================================================

-- 1. TCC 2025 : Synonymes de compétences (Recherche Sémantique)
CREATE TABLE IF NOT EXISTS competency_synonyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    synonym_title VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (competency_id, synonym_title, language)
);
CREATE INDEX IF NOT EXISTS idx_competency_synonyms_title ON competency_synonyms (synonym_title);

-- 2. BLS ORS : Profils Ergonomiques de Haute Précision (Réadaptation)
CREATE TABLE IF NOT EXISTS bls_ors_profiles (
    cnp_code VARCHAR(10) PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    soc_code VARCHAR(15), -- Code SOC américain pour référence
    sitting_duration_pct NUMERIC(5, 2),  -- % de la journée
    standing_duration_pct NUMERIC(5, 2), -- % de la journée
    lifting_freq VARCHAR(50),            -- Rare, Occasionnel, Fréquent, Constant
    max_lift_kg NUMERIC(6, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LAD (StatCan) : Trajectoires longitudinales salariales (Croissance 5, 10, 15 ans)
CREATE TABLE IF NOT EXISTS statcan_lad_trajectories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnp_code VARCHAR(10) NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    years_post_grad INTEGER NOT NULL, -- ex: 1, 5, 10, 15
    median_income NUMERIC(10, 2) NOT NULL,
    retention_rate_pct NUMERIC(5, 2), -- % de rétention dans la profession
    snapshot_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (cnp_code, years_post_grad, snapshot_year)
);

-- 4. ISQ : Ligne de base des revenus par démographie au Québec
CREATE TABLE IF NOT EXISTS isq_income_baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_group VARCHAR(50) NOT NULL, -- ex: '15-24', '25-34', '35-44', '45-54', '55-64', '65+'
    gender VARCHAR(20) NOT NULL,    -- ex: 'Hommes', 'Femmes', 'Tous'
    median_income_quebec NUMERIC(10, 2) NOT NULL,
    snapshot_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (age_group, gender, snapshot_year)
);
