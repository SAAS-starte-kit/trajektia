-- ============================================================
-- TRAJEKTIA — Schema V3 (Éducation, CPE et Relance)
-- Version    : 3.0.0
-- Date       : 2026-04-28
-- Description: Matérialise la méthodologie d'association en 5 étapes :
--              CNP → Programme (MEQ) → Domaine d'études (CPE)
--              → Admissibilité PTPD + Données Relance
-- Prérequis  : schema.sql (V1) et schema_v2.sql (V2) doivent être appliqués.
--              La table `occupations` avec la colonne `cnp_code` doit exister.
-- ============================================================

-- ============================================================
-- 1. Domaines d'études (CPE / CIP Canada)
-- Le pont statistique entre les programmes MEQ et l'admissibilité PTPD.
-- CPE = Classification des programmes d'enseignement (équivalent canadien du CIP)
-- ============================================================
CREATE TABLE IF NOT EXISTS cip_domains (
    cpe_code            TEXT        PRIMARY KEY,            -- ex: '11.0101'
    title_fr            TEXT        NOT NULL,               -- Titre officiel en français
    title_en            TEXT,                               -- Titre officiel en anglais
    is_ptpd_eligible    BOOLEAN     DEFAULT FALSE,          -- Admissibilité au Permis de Travail Postdiplôme
    description_fr      TEXT,                               -- Description du domaine
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cip_domains IS
    'Domaines d''études selon la Classification des programmes d''enseignement (CPE/CIP Canada). '
    'Sert de pont statistique pour déterminer l''admissibilité au PTPD.';

COMMENT ON COLUMN cip_domains.cpe_code IS 'Code CPE à 2 ou 6 chiffres (ex: ''11'' ou ''11.0101'').';
COMMENT ON COLUMN cip_domains.is_ptpd_eligible IS
    'TRUE si les diplômés de ce domaine sont admissibles au Permis de Travail Postdiplôme (PTPD) selon IRCC.';


-- ============================================================
-- 2. Programmes de formation du Québec (MEQ/MES)
-- Source : Ministère de l''Éducation du Québec et Ministère de l''Enseignement supérieur.
-- Inclut les données de l''Enquête Relance pour la valeur marché du diplôme.
-- ============================================================
CREATE TABLE IF NOT EXISTS educational_programs (
    program_code        TEXT        PRIMARY KEY,            -- Code MEQ officiel (ex: '5319' pour DEP Électricité)
    cpe_code            TEXT        REFERENCES cip_domains(cpe_code) ON DELETE SET NULL,
    title_fr            TEXT        NOT NULL,               -- Titre du programme en français
    level               TEXT        NOT NULL,               -- 'DEP', 'DEC', 'BAC', 'MAITRISE', 'DOCTORAT', etc.
    duration_hours      INTEGER,                            -- Durée totale en heures (DEP/DEC)

    -- Données de l'Enquête Relance (MEQ/MES)
    -- Source : https://www.quebec.ca/education/universite/enquete-relance
    placement_rate      NUMERIC(5,2),                       -- Taux de placement en emploi (ex: 95.50 pour 95.5%)
    starting_salary     NUMERIC(10,2),                      -- Salaire hebdomadaire moyen à la diplomation (en $CAD)
    relance_year        INTEGER,                            -- Année de l'enquête Relance (ex: 2024)

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE educational_programs IS
    'Programmes de formation officiels du Québec (MEQ/MES). '
    'Couvre DEP (formation professionnelle), DEC (collégial) et BAC/cycles supérieurs (universitaire). '
    'Les données Relance permettent d''évaluer la valeur marché du diplôme.';

COMMENT ON COLUMN educational_programs.program_code IS 'Code numérique du programme selon le MEQ (ex: ''5319'').';
COMMENT ON COLUMN educational_programs.level IS 'Niveau de formation : DEP, ASP, AEC, DEC, BAC, MAITRISE, DOCTORAT.';
COMMENT ON COLUMN educational_programs.placement_rate IS
    'Taux de placement (%) selon l''Enquête Relance. Représente le % de diplômés en emploi lié à la formation.';
COMMENT ON COLUMN educational_programs.starting_salary IS
    'Salaire hebdomadaire moyen (en $CAD) à l''emploi, mesuré par l''Enquête Relance.';


-- ============================================================
-- 3. Établissements d'enseignement
-- CFP (centres de formation professionnelle), Cégeps, Universités du Québec.
-- ============================================================
CREATE TABLE IF NOT EXISTS educational_institutions (
    institution_id      TEXT        PRIMARY KEY,            -- Code interne ou code officiel de l'établissement
    name_fr             TEXT        NOT NULL,               -- Nom officiel en français
    institution_type    TEXT,                               -- 'CFP', 'Cégep', 'Université', 'École de métiers'
    region              TEXT,                               -- Région administrative du Québec (ex: '06 - Montréal')
    city                TEXT,                               -- Ville (pour affichage)
    website_url         TEXT,                               -- Site web officiel
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE educational_institutions IS
    'Établissements d''enseignement du Québec : CFP (DEP), Cégeps (DEC) et Universités (BAC+). '
    'Identifiés par leur code officiel MEQ/MES ou un identifiant interne stable.';

COMMENT ON COLUMN educational_institutions.institution_type IS
    'Type d''établissement : CFP (Centre de formation professionnelle), Cégep, Université, École de métiers.';
COMMENT ON COLUMN educational_institutions.region IS
    'Région administrative du Québec selon le découpage gouvernemental (01 à 17).';


-- ============================================================
-- 4. Liaison : Programme ↔ Établissement (offre de formation)
-- Un programme peut être offert dans plusieurs établissements et vice-versa.
-- ============================================================
CREATE TABLE IF NOT EXISTS program_institutions (
    program_code        TEXT        NOT NULL REFERENCES educational_programs(program_code) ON DELETE CASCADE,
    institution_id      TEXT        NOT NULL REFERENCES educational_institutions(institution_id) ON DELETE CASCADE,
    url_program         TEXT,                               -- Lien direct vers la page du programme dans l'école
    is_offered          BOOLEAN     DEFAULT TRUE,           -- FALSE si le programme est suspendu dans cet établissement
    admission_date      DATE,                               -- Prochaine date d'admission (si disponible)
    PRIMARY KEY (program_code, institution_id)
);

COMMENT ON TABLE program_institutions IS
    'Table de liaison entre les programmes MEQ et les établissements qui les offrent. '
    'Permet de répondre à : "Où puis-je étudier ce programme au Québec ?"';


-- ============================================================
-- 5. Liaison Magique : Métier (CNP) ↔ Programme de formation (MEQ)
-- C'est le cœur de la méthodologie d'association Trajektia.
-- Chaîne : CNP → Programme (MEQ) → CPE → Admissibilité PTPD + Relance
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_programs (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    program_code        TEXT        NOT NULL REFERENCES educational_programs(program_code) ON DELETE CASCADE,
    is_direct_path      BOOLEAN     DEFAULT TRUE,           -- TRUE = voie principale recommandée; FALSE = voie alternative
    notes_fr            TEXT,                               -- Notes sur la correspondance (ex: "Avec expérience complémentaire")
    source              TEXT,                               -- Source de l'association (ex: 'MEQ', 'CNP-2021', 'Trajektia')
    PRIMARY KEY (occupation_cnp_code, program_code)
);

COMMENT ON TABLE occupation_programs IS
    'Table pivot centrale reliant chaque profession (CNP) à ses programmes de formation recommandés (MEQ). '
    'C''est la matérialisation de la méthodologie d''association en 5 étapes de Trajektia.';

COMMENT ON COLUMN occupation_programs.is_direct_path IS
    'TRUE = voie de formation principale et directe vers le métier. '
    'FALSE = voie alternative ou complémentaire (ex: reconversion, spécialisation).';


-- ============================================================
-- INDEX — Performance des requêtes fréquentes
-- ============================================================

-- Recherche de tous les programmes d'un domaine CPE
CREATE INDEX IF NOT EXISTS idx_edu_prog_cpe_code
    ON educational_programs(cpe_code);

-- Recherche de tous les programmes admissibles au PTPD
CREATE INDEX IF NOT EXISTS idx_cip_ptpd
    ON cip_domains(is_ptpd_eligible)
    WHERE is_ptpd_eligible = TRUE;

-- Recherche de toutes les formations pour un métier CNP donné
CREATE INDEX IF NOT EXISTS idx_occ_prog_cnp
    ON occupation_programs(occupation_cnp_code);

-- Recherche de tous les métiers accessibles par un programme donné
CREATE INDEX IF NOT EXISTS idx_occ_prog_prog
    ON occupation_programs(program_code);

-- Recherche des établissements par région
CREATE INDEX IF NOT EXISTS idx_inst_region
    ON educational_institutions(region);

-- Recherche des programmes par niveau (DEP, DEC, BAC…)
CREATE INDEX IF NOT EXISTS idx_edu_prog_level
    ON educational_programs(level);


-- ============================================================
-- SÉCURITÉ — Row Level Security (RLS)
-- Toutes les tables sont en lecture publique (données gouvernementales non-sensibles).
-- Les écritures se font exclusivement via les pipelines ETL authentifiés.
-- ============================================================

ALTER TABLE cip_domains               ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_programs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_institutions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_institutions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_programs       ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (données gouvernementales ouvertes)
CREATE POLICY "public_read_cip_domains"
    ON cip_domains FOR SELECT USING (true);

CREATE POLICY "public_read_educational_programs"
    ON educational_programs FOR SELECT USING (true);

CREATE POLICY "public_read_educational_institutions"
    ON educational_institutions FOR SELECT USING (true);

CREATE POLICY "public_read_program_institutions"
    ON program_institutions FOR SELECT USING (true);

CREATE POLICY "public_read_occupation_programs"
    ON occupation_programs FOR SELECT USING (true);


-- ============================================================
-- FIN DU SCHÉMA V3
-- Prochaine étape : Appliquer sur Supabase, puis passer à la Phase 5
-- (Composants Astro 6.1 : fiche métier, explorateur, chatbot RAG)
-- ============================================================
