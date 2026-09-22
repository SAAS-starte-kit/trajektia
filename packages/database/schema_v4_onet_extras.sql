-- ============================================================
-- TRAJEKTIA — SCHEMA V4
-- Ajout des domaines O*NET : Knowledge & Work Context
-- ============================================================

-- 1. KNOWLEDGE (Connaissances théoriques)
CREATE TABLE IF NOT EXISTS knowledge (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    onet_element_id     TEXT        UNIQUE NOT NULL,
    name_en             TEXT        NOT NULL,
    name_fr             TEXT,       
    description_en      TEXT,
    description_fr      TEXT,       
    taxonomy            TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS occupation_knowledge (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    knowledge_id        UUID        NOT NULL REFERENCES knowledge(id)         ON DELETE CASCADE,
    importance_score    NUMERIC(5, 3),
    level_score         NUMERIC(5, 3),
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (occupation_cnp_code, knowledge_id)
);

CREATE INDEX IF NOT EXISTS idx_occ_know_occ ON occupation_knowledge (occupation_cnp_code);

-- 2. WORK CONTEXTS (Contextes de travail)
CREATE TABLE IF NOT EXISTS work_contexts (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    onet_element_id     TEXT        UNIQUE NOT NULL,
    name_en             TEXT        NOT NULL,
    name_fr             TEXT,       
    description_en      TEXT,
    description_fr      TEXT,       
    taxonomy            TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS occupation_work_contexts (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    context_id          UUID        NOT NULL REFERENCES work_contexts(id)       ON DELETE CASCADE,
    frequency_score     NUMERIC(5, 3), -- Scale CX (Average)
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (occupation_cnp_code, context_id)
);

CREATE INDEX IF NOT EXISTS idx_occ_wc_occ ON occupation_work_contexts (occupation_cnp_code);
