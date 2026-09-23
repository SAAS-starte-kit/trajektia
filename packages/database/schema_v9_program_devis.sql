-- ============================================================
-- TRAJEKTIA — Schema V9 (Devis Ministériels & Compétences Détaillées MEQ/MES)
-- Version    : 9.0.0
-- Date       : 2026-09-22
-- Description: Ajoute la prise en charge des devis d'études complets du MES (DEC/DEP):
--              - Description générale des programmes
--              - Grille des compétences ministérielles (Codes 016K, etc.)
--              - Éléments de compétence (savoir-faire)
--              - Critères de performance et verbes d'action
-- ============================================================

-- 1. Ajout des champs descriptifs généraux sur educational_programs
ALTER TABLE educational_programs 
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS objectives_fr TEXT,
ADD COLUMN IF NOT EXISTS admission_requirements_fr TEXT;

COMMENT ON COLUMN educational_programs.description_fr IS 'Présentation et résumé d''orientation générale du programme d''études.';
COMMENT ON COLUMN educational_programs.objectives_fr IS 'Objectifs généraux de formation définis par le Ministère (MES/MEQ).';
COMMENT ON COLUMN educational_programs.admission_requirements_fr IS 'Conditions particulières et préalables d''admission au programme.';

-- 2. Enrichissement de la table program_competencies pour les devis ministériels
ALTER TABLE program_competencies
ADD COLUMN IF NOT EXISTS competency_code TEXT,
ADD COLUMN IF NOT EXISTS statement_fr TEXT,
ADD COLUMN IF NOT EXISTS competency_type TEXT DEFAULT 'specific',
ADD COLUMN IF NOT EXISTS context_fr TEXT,
ADD COLUMN IF NOT EXISTS elements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS performance_criteria JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hours_allocated INTEGER,
ADD COLUMN IF NOT EXISTS credits NUMERIC(4,2);

CREATE INDEX IF NOT EXISTS idx_program_competencies_program ON program_competencies(program_code);
CREATE INDEX IF NOT EXISTS idx_program_competencies_code ON program_competencies(competency_code);

COMMENT ON TABLE program_competencies IS
    'Compétences ministérielles détaillées issues des devis d''études du Ministère de l''Enseignement supérieur (MES). '
    'Intègre les 4 niveaux de finesse : Code, Énoncé, Éléments de compétence (savoir-faire) et Critères de performance.';
