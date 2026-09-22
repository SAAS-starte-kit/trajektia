-- ============================================================
-- TRAJEKTIA — Schema V5 (Santé et Sécurité du Travail - CNESST)
-- Version    : 5.0.0
-- Date       : 2026-09-12
-- Description: Intégration des statistiques de lésions professionnelles,
--              facteurs de risques et pénibilité par secteur/profession
--              basées sur les données ouvertes de la CNESST (Données Québec).
-- Prérequis  : schema.sql (V1) appliqué (table occupations existante).
-- ============================================================

-- ============================================================
-- 1. Référentiel des risques et aléas professionnels
-- ============================================================
CREATE TABLE IF NOT EXISTS occupational_hazards (
    hazard_id           TEXT        PRIMARY KEY,            -- ex: 'TMS', 'SURDITE', 'CHUTE', 'MACHINE', 'PSY'
    name_fr             TEXT        NOT NULL,               -- Nom usuel du risque en français
    name_en             TEXT,                               -- Nom usuel en anglais
    category            TEXT        NOT NULL,               -- 'Ergonomique', 'Physique', 'Mécanique', 'Psychosocial', 'Chimique'
    description_fr      TEXT,                               -- Description détaillée de la nature du risque
    prevention_advice_fr TEXT,                              -- Conseils de prévention et bonnes pratiques ergonomiques
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE occupational_hazards IS
    'Référentiel normalisé des risques et aléas professionnels en milieu de travail (SST).';


-- ============================================================
-- 2. Statistiques macro par secteur d'activité (SCIAN)
-- Données consolidées de la CNESST pour le Québec
-- ============================================================
CREATE TABLE IF NOT EXISTS cnesst_sector_stats (
    sector_scian        TEXT        NOT NULL,               -- Secteur SCIAN (ex: 'CONSTRUCTION', 'SOINS DE SANTE')
    year                INTEGER     NOT NULL,               -- Année de référence statistique (ex: 2023)
    total_lesions       INTEGER     NOT NULL DEFAULT 0,     -- Nombre total de lésions indemnisées dans l'année
    pct_tms             NUMERIC(5,2),                       -- % de lésions attribuées aux TMS (troubles musculo-squelettiques)
    pct_machine         NUMERIC(5,2),                       -- % de lésions impliquant des machines/outils
    pct_surdite         NUMERIC(5,2),                       -- % de lésions de surdité professionnelle (bruit industriel)
    pct_psy             NUMERIC(5,2),                       -- % de lésions psychologiques (stress, violence, harcèlement)
    top_genre_accident  TEXT,                               -- Mécanisme d'accident le plus fréquent (ex: 'EFFORT EXCESSIF')
    top_siege_lesion    TEXT,                               -- Partie du corps la plus souvent touchée (ex: 'DOS')
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (sector_scian, year)
);

COMMENT ON TABLE cnesst_sector_stats IS
    'Indicateurs macro de santé et sécurité au travail agrégés par grand secteur SCIAN au Québec.';


-- ============================================================
-- 3. Liaison Métier (CNP) ↔ Facteur de Risque / Pénibilité
-- Relie chaque profession à son exposition aux risques SST
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_hazards (
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    hazard_id           TEXT        NOT NULL REFERENCES occupational_hazards(hazard_id) ON DELETE CASCADE,
    risk_level          TEXT        NOT NULL DEFAULT 'Moyen', -- 'Faible', 'Moyen', 'Élevé'
    sector_scian        TEXT,                               -- Secteur d'exercice prédominant
    prevalence_pct      NUMERIC(5,2),                       -- % d'incidence dans le secteur d'activité
    notes_fr            TEXT,                               -- Précisions sur les contextes d'exposition
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (occupation_cnp_code, hazard_id)
);

COMMENT ON TABLE occupation_hazards IS
    'Association entre professions (CNP) et facteurs de risques professionnels prédominants (CNESST).';


-- ============================================================
-- INDEX — Performance des requêtes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_occ_hazards_cnp ON occupation_hazards(occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_occ_hazards_hazard ON occupation_hazards(hazard_id);
CREATE INDEX IF NOT EXISTS idx_occ_hazards_level ON occupation_hazards(risk_level);
CREATE INDEX IF NOT EXISTS idx_cnesst_sector_year ON cnesst_sector_stats(year);


-- ============================================================
-- SÉCURITÉ — Row Level Security (RLS)
-- Lecture publique (données gouvernementales ouvertes)
-- ============================================================
ALTER TABLE occupational_hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cnesst_sector_stats   ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_hazards    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_occupational_hazards"
    ON occupational_hazards FOR SELECT USING (true);

CREATE POLICY "public_read_cnesst_sector_stats"
    ON cnesst_sector_stats FOR SELECT USING (true);

CREATE POLICY "public_read_occupation_hazards"
    ON occupation_hazards FOR SELECT USING (true);
