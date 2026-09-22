-- ============================================================================
-- TRAJEKTIA CKG — SCHÉMA V8 : OBSERVATOIRE TEMPOREL & DONNÉES VOLATILES DU MARCHÉ
-- ============================================================================
-- Projet      : Trajektia CKG (Career Knowledge Graph)
-- Description : Stockage des séries temporelles (time-series), historique des salaires,
--               pénétration des compétences émergentes et indicateurs propriétaires Trajektia™.
-- Auteur      : Équipe CKG / Antigravity AI
-- Date        : Septembre 2026
-- Dépendances : schema.sql (occupations), schema_v2.sql (competencies)
-- ============================================================================

-- 1. Table des Offres d'Emploi en Direct (Cache Éphémère / TTL)
CREATE TABLE IF NOT EXISTS trajektia_live_job_postings (
    id                      BIGSERIAL PRIMARY KEY,
    source                  TEXT NOT NULL,                    -- 'adzuna', 'jobbank', 'jooble', 'greenhouse', 'trajektia_direct'
    external_id             TEXT UNIQUE,                      -- ID unique de la source
    cnp_code                VARCHAR(10) NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    title                   TEXT NOT NULL,
    company_name            TEXT,
    location_city           TEXT,
    location_region         TEXT DEFAULT 'Québec',
    salary_min              NUMERIC(10, 2),
    salary_max              NUMERIC(10, 2),
    salary_type             VARCHAR(20) DEFAULT 'annual',     -- 'annual', 'hourly', 'monthly'
    currency                VARCHAR(5) DEFAULT 'CAD',
    contract_type           TEXT,                             -- 'Temps plein', 'Temps partiel', 'Permanent', 'Contractuel'
    workplace_mode          TEXT,                             -- 'Présentiel', 'Hybride', 'Télétravail'
    description_snippet     TEXT,
    extracted_skills        TEXT[],                           -- Compétences détectées par NLP/NER
    apply_url               TEXT NOT NULL,
    posted_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at              TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_jobs_cnp ON trajektia_live_job_postings(cnp_code);
CREATE INDEX IF NOT EXISTS idx_live_jobs_expires ON trajektia_live_job_postings(expires_at);
CREATE INDEX IF NOT EXISTS idx_live_jobs_active ON trajektia_live_job_postings(is_active);

-- 2. Table des Snapshots Mensuels / Séries Temporelles (Historique Salaires & Volume)
CREATE TABLE IF NOT EXISTS trajektia_market_snapshots (
    id                      BIGSERIAL PRIMARY KEY,
    cnp_code                VARCHAR(10) NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    snapshot_date           DATE NOT NULL,                    -- Ex: 2026-09-01
    postings_volume         INTEGER NOT NULL DEFAULT 0,       -- Nombre total d'offres réelles observées
    salary_live_median      NUMERIC(10, 2),                   -- Indice Salarial Trajektia Live™
    salary_live_min         NUMERIC(10, 2),
    salary_live_max         NUMERIC(10, 2),
    statcan_official_median NUMERIC(10, 2),                   -- Médiane officielle StatCan pour comparaison
    delta_market_pct        NUMERIC(6, 2),                    -- Écart % (Marché réel vs StatCan)
    market_tension_index    NUMERIC(4, 2),                    -- Indice de Tension Marché Trajektia™ (1.00 à 10.00)
    remote_ratio_pct        NUMERIC(5, 2),                    -- % d'offres en télétravail/hybride
    top_employers           JSONB DEFAULT '[]'::jsonb,        -- [{"name": "DRW", "count": 12}, ...]
    metadata                JSONB DEFAULT '{}'::jsonb,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cnp_code, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_market_snapshots_cnp_date ON trajektia_market_snapshots(cnp_code, snapshot_date);

-- 3. Table d'Historique de la Demande en Compétences (Pénétration Marché dans le temps)
CREATE TABLE IF NOT EXISTS trajektia_skill_demand_history (
    id                      BIGSERIAL PRIMARY KEY,
    cnp_code                VARCHAR(10) NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    skill_name              TEXT NOT NULL,                    -- Ex: 'Docker', 'Kubernetes', 'Prompt Engineering'
    snapshot_date           DATE NOT NULL,                    -- Ex: 2026-09-01
    occurrences_count       INTEGER NOT NULL DEFAULT 0,       -- Nombre de fois mentionné
    penetration_rate_pct    NUMERIC(5, 2) NOT NULL,           -- Taux de Pénétration Marché Trajektia™ (ex: 65.2 %)
    is_emerging             BOOLEAN DEFAULT FALSE,            -- Absent de la CNP 2021 mais surreprésenté
    trend_momentum          TEXT DEFAULT 'stable',            -- 'hausse_rapide', 'hausse', 'stable', 'baisse'
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cnp_code, skill_name, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_skill_demand_cnp ON trajektia_skill_demand_history(cnp_code, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_skill_demand_name ON trajektia_skill_demand_history(skill_name);

-- 4. Vue Analytique des Tendances Métiers sur 12 Mois
CREATE OR REPLACE VIEW v_trajektia_career_trends_12m AS
WITH latest AS (
    SELECT DISTINCT ON (cnp_code)
        cnp_code,
        snapshot_date,
        salary_live_median,
        postings_volume,
        market_tension_index
    FROM trajektia_market_snapshots
    ORDER BY cnp_code, snapshot_date DESC
),
past_12m AS (
    SELECT DISTINCT ON (cnp_code)
        cnp_code,
        snapshot_date,
        salary_live_median,
        postings_volume
    FROM trajektia_market_snapshots
    WHERE snapshot_date <= (CURRENT_DATE - INTERVAL '11 months')
    ORDER BY cnp_code, snapshot_date DESC
)
SELECT 
    l.cnp_code,
    l.snapshot_date AS latest_date,
    l.salary_live_median AS current_salary_live,
    p.salary_live_median AS past_12m_salary_live,
    ROUND(((l.salary_live_median - p.salary_live_median) / NULLIF(p.salary_live_median, 0) * 100), 2) AS salary_growth_12m_pct,
    l.postings_volume AS current_openings_volume,
    p.postings_volume AS past_12m_openings_volume,
    ROUND(((l.postings_volume - p.postings_volume)::numeric / NULLIF(p.postings_volume, 0)::numeric * 100), 2) AS demand_growth_12m_pct,
    l.market_tension_index AS current_tension_index
FROM latest l
LEFT JOIN past_12m p ON l.cnp_code = p.cnp_code;

COMMENT ON TABLE trajektia_live_job_postings IS 'Cache éphémère (TTL 30 jours) des offres actives pour l''affichage UI';
COMMENT ON TABLE trajektia_market_snapshots IS 'Séries temporelles mensuelles pour les courbes de salaires réels et volumes d''embauche';
COMMENT ON TABLE trajektia_skill_demand_history IS 'Historique du Taux de Pénétration Marché des compétences émergentes';
COMMENT ON VIEW v_trajektia_career_trends_12m IS 'Vue dérivée calculant la dynamique annuelle des salaires et de la demande';
