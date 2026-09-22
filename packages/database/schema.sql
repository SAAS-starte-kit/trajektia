-- ============================================================
-- TRAJEKTIA — Supabase PostgreSQL Schema DDL
-- Version  : 1.0.0
-- Date     : 2026-04-14
-- Design   : "Graph-Ready" + OaSIS-ready
--            • Official codes as PKs (no sequential IDs for occupations)
--            • Enriched junction tables with score/weight columns
--            • OaSIS tables pre-built for Phase 5 direct ingestion
--            • RLS enabled — public read / service_role write
-- ============================================================

-- -------------------------------------------------------------
-- EXTENSIONS
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Full-text search on FR/EN titles

-- -------------------------------------------------------------
-- ENUM TYPES
-- -------------------------------------------------------------
CREATE TYPE competency_category AS ENUM (
    'ability',            -- O*NET Abilities  / OaSIS A
    'personal_attribute', -- O*NET WorkStyles (partially) / OaSIS B
    'interest',           -- RIASEC           / OaSIS C
    'skill',              -- O*NET Skills     / OaSIS F
    'knowledge',          -- O*NET Knowledge  / OaSIS G
    'work_context',       -- O*NET WorkContext / OaSIS J
    'work_activity',      -- O*NET WorkActivity / OaSIS K
    'work_style',         -- O*NET WorkStyle
    'work_value'          -- O*NET WorkValue
);

-- ============================================================
-- 1. OCCUPATIONS (Core)
-- ============================================================
CREATE TABLE occupations (
    -- Primary Key: official NOC/SIPeC code (e.g. "1001.0", "21230.0")
    cnp_code            TEXT        PRIMARY KEY,

    -- International crosswalks
    onet_soc_code       TEXT,
    esco_uri            TEXT,
    noc_2021_code       TEXT,         -- 5-digit NOC 2021 when available

    -- Classification
    taxonomy            TEXT        NOT NULL DEFAULT 'SIPeC 2025',

    -- Bilingual content
    title_fr            TEXT,
    title_en            TEXT,
    description_fr      TEXT,
    description_en      TEXT,

    -- Salary (ESDC official 2025)
    median_salary       NUMERIC(12, 2),
    salary_source       TEXT        DEFAULT 'ESDC 2025 Official',

    -- RIASEC (denormalized for fast API response — full detail in riasec_profiles)
    riasec_dominant     TEXT,         -- e.g. 'RIA'
    riasec_scores       JSONB,        -- {"R":4.2,"I":3.8,"A":2.1,"S":1.9,"E":2.5,"C":1.6}

    -- OaSIS linkage status
    oasis_mapped        BOOLEAN     DEFAULT FALSE,

    -- Audit
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_occ_onet_soc    ON occupations (onet_soc_code);
CREATE INDEX idx_occ_riasec      ON occupations (riasec_dominant);
CREATE INDEX idx_occ_taxonomy    ON occupations (taxonomy);
CREATE INDEX idx_occ_salary      ON occupations (median_salary DESC);
CREATE INDEX idx_occ_title_fr    ON occupations USING gin (title_fr gin_trgm_ops);
CREATE INDEX idx_occ_title_en    ON occupations USING gin (title_en gin_trgm_ops);

-- ============================================================
-- 2. OaSIS TAXONOMY (Phase 5 target — pre-built)
-- Hierarchy: Category → SubCategory → SubSubCategory → Descriptor
-- Example:   A        → A.01        → A.01.a          → A.01.a.01
-- ============================================================
CREATE TABLE oasis_descriptors (
    -- Official OaSIS code — the permanent stable identifier from ESDC
    oasis_code          TEXT        PRIMARY KEY,  -- e.g. 'A.01.a.01'

    -- Hierarchy decomposition
    category_code       TEXT        NOT NULL,     -- 'A','B','C','F','G','J','K'
    category_name_en    TEXT,                     -- 'Abilities'
    category_name_fr    TEXT,                     -- 'Aptitudes'
    subcategory_code    TEXT,                     -- 'A.01'
    subcategory_name_en TEXT,
    subcategory_name_fr TEXT,
    group_code          TEXT,                     -- 'A.01.a'
    group_name_en       TEXT,
    group_name_fr       TEXT,

    -- Descriptor content
    name_en             TEXT        NOT NULL,
    name_fr             TEXT,
    description_en      TEXT,
    description_fr      TEXT,

    -- Classification mapping
    competency_category competency_category,

    -- Version
    version             TEXT        NOT NULL DEFAULT '2025.0',
    is_active           BOOLEAN     DEFAULT TRUE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oasis_cat      ON oasis_descriptors (category_code);
CREATE INDEX idx_oasis_subcat   ON oasis_descriptors (subcategory_code);
CREATE INDEX idx_oasis_type     ON oasis_descriptors (competency_category);
CREATE INDEX idx_oasis_version  ON oasis_descriptors (version);

-- ============================================================
-- 3. COMPETENCIES (O*NET Elements unified)
-- Covers: Skills, Abilities, WorkStyles, WorkValues, Interests
-- ============================================================
CREATE TABLE competencies (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Cross-referencing
    onet_element_id     TEXT        UNIQUE,      -- O*NET Element ID (e.g. '2.C.7.a')
    oasis_code          TEXT        REFERENCES oasis_descriptors(oasis_code) ON DELETE SET NULL,

    -- Classification
    category            competency_category NOT NULL,
    source              TEXT        NOT NULL DEFAULT 'O*NET 28.2',

    -- Bilingual content
    name_en             TEXT        NOT NULL,
    name_fr             TEXT,
    description_en      TEXT,
    description_fr      TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_comp_name_cat  ON competencies (name_en, category);
CREATE INDEX idx_comp_oasis            ON competencies (oasis_code);
CREATE INDEX idx_comp_category         ON competencies (category);

-- ============================================================
-- 4. JUNCTION: OCCUPATION ↔ COMPETENCY (Enriched with scores)
-- ============================================================
CREATE TABLE occupation_competencies (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code)  ON DELETE CASCADE,
    competency_id       UUID        NOT NULL REFERENCES competencies(id)         ON DELETE CASCADE,

    -- O*NET scoring
    score               NUMERIC(5, 3),          -- 1.000 to 7.000
    scale_id            TEXT,                   -- 'IM' Importance / 'OI' Occupational Interest / 'EX' Extent
    scale_label         TEXT,                   -- Human-readable scale name

    -- OaSIS enrichment (nullable — populated at Phase 5)
    oasis_code          TEXT        REFERENCES oasis_descriptors(oasis_code) ON DELETE SET NULL,
    oasis_proficiency   TEXT,                   -- OaSIS proficiency level label when available

    -- Provenance
    source              TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (occupation_cnp_code, competency_id, scale_id)
);

CREATE INDEX idx_occ_comp_occupation ON occupation_competencies (occupation_cnp_code);
CREATE INDEX idx_occ_comp_competency ON occupation_competencies (competency_id);
CREATE INDEX idx_occ_comp_score      ON occupation_competencies (score DESC);
CREATE INDEX idx_occ_comp_scale      ON occupation_competencies (scale_id);

-- ============================================================
-- 5. RIASEC PROFILES (One row per occupation — fast querying)
-- ============================================================
CREATE TABLE riasec_profiles (
    occupation_cnp_code TEXT        PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Individual RIASEC scores (O*NET OI scale, 1.000–5.000)
    r_score             NUMERIC(5, 3),   -- Realistic
    i_score             NUMERIC(5, 3),   -- Investigative
    a_score             NUMERIC(5, 3),   -- Artistic
    s_score             NUMERIC(5, 3),   -- Social
    e_score             NUMERIC(5, 3),   -- Enterprising
    c_score             NUMERIC(5, 3),   -- Conventional

    -- Derived (computed on ingest)
    dominant_code       TEXT,            -- Top 3 letters e.g. 'RIA'
    dominant_letter     TEXT,            -- Top 1 letter  e.g. 'R'

    -- OaSIS C.01.a.xx codes (populated at Phase 5)
    oasis_interest_codes TEXT[],         -- ['C.01.a.01', 'C.01.a.02', ...]

    source              TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_riasec_dominant ON riasec_profiles (dominant_code);
CREATE INDEX idx_riasec_letter   ON riasec_profiles (dominant_letter);
CREATE INDEX idx_riasec_r        ON riasec_profiles (r_score DESC);
CREATE INDEX idx_riasec_i        ON riasec_profiles (i_score DESC);

-- ============================================================
-- 6. TASKS (O*NET)
-- ============================================================
CREATE TABLE tasks (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    onet_task_id        TEXT        UNIQUE,

    description_en      TEXT        NOT NULL,
    description_fr      TEXT,               -- AI-translated in Phase 2

    taxonomy            TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. JUNCTION: OCCUPATION ↔ TASK
-- ============================================================
CREATE TABLE occupation_tasks (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    task_id             UUID        NOT NULL REFERENCES tasks(id)               ON DELETE CASCADE,

    importance_score    NUMERIC(5, 3),
    relevance_score     NUMERIC(5, 3),
    source              TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (occupation_cnp_code, task_id)
);

CREATE INDEX idx_occ_task_occ ON occupation_tasks (occupation_cnp_code);

-- ============================================================
-- 8. TOOLS & TECHNOLOGY (O*NET)
-- ============================================================
CREATE TABLE tools (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT        NOT NULL UNIQUE,
    category            TEXT,
    taxonomy            TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. JUNCTION: OCCUPATION ↔ TOOL
-- ============================================================
CREATE TABLE occupation_tools (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    tool_id             UUID        NOT NULL REFERENCES tools(id)               ON DELETE CASCADE,

    source              TEXT        NOT NULL DEFAULT 'O*NET 28.2',
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (occupation_cnp_code, tool_id)
);

CREATE INDEX idx_occ_tool_occ ON occupation_tools (occupation_cnp_code);

-- ============================================================
-- 10. ORCHESTRATION METADATA (Directus / BD sync state)
-- ============================================================
CREATE TABLE occupation_metadata (
    occupation_cnp_code TEXT        PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Publishing state
    directus_id         TEXT,               -- Directus item UUID once published
    bd_member_id        TEXT,               -- Brilliant Directories member ID
    published_at        TIMESTAMPTZ,
    last_synced_at      TIMESTAMPTZ,
    sync_status         TEXT        DEFAULT 'pending', -- 'pending'|'synced'|'error'
    sync_error          TEXT,

    -- AI-generated content cache (Phase 2 — "Invisible Conductor")
    ai_summary_fr       TEXT,
    ai_summary_en       TEXT,
    ai_generated_at     TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS — auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_occupations_updated_at
    BEFORE UPDATE ON occupations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_occupation_metadata_updated_at
    BEFORE UPDATE ON occupation_metadata
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- Career data is public read / service_role only for writes
-- ============================================================
ALTER TABLE occupations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE oasis_descriptors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_competencies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE riasec_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_tools         ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_metadata      ENABLE ROW LEVEL SECURITY;

-- Public read
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'occupations','oasis_descriptors','competencies',
        'occupation_competencies','riasec_profiles',
        'tasks','occupation_tasks','tools','occupation_tools'
    ] LOOP
        EXECUTE format(
            'CREATE POLICY "public_read_%s" ON %I FOR SELECT TO anon, authenticated USING (true)',
            t, t
        );
    END LOOP;
END $$;

-- Service role full access
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'occupations','oasis_descriptors','competencies',
        'occupation_competencies','riasec_profiles',
        'tasks','occupation_tasks','tools','occupation_tools',
        'occupation_metadata'
    ] LOOP
        EXECUTE format(
            'CREATE POLICY "service_write_%s" ON %I FOR ALL TO service_role USING (true)',
            t, t
        );
    END LOOP;
END $$;

-- ============================================================
-- COMMENTS (documentation in DB)
-- ============================================================
COMMENT ON TABLE occupations             IS 'Core occupation records (NOC/SIPeC 2025). PK = cnp_code (official code).';
COMMENT ON TABLE oasis_descriptors       IS 'OaSIS SCT 2025 taxonomy. Populated at Phase 5 via oasis_ingestor.py.';
COMMENT ON TABLE competencies            IS 'Unified O*NET competency elements (Skills, Abilities, WorkStyles, WorkValues, Interests).';
COMMENT ON TABLE occupation_competencies IS 'Enriched junction: occupation ↔ competency with O*NET scores and OaSIS codes.';
COMMENT ON TABLE riasec_profiles         IS 'Denormalized RIASEC scores per occupation for fast recommendation queries.';
COMMENT ON TABLE tasks                   IS 'O*NET task statements per occupation.';
COMMENT ON TABLE tools                   IS 'O*NET tools and technology items.';
COMMENT ON TABLE occupation_metadata     IS 'Orchestration state: Directus/BD sync, AI cache, publishing status.';
