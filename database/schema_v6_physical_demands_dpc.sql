-- ============================================================
-- TRAJEKTIA — Schema V6 (Exigences Physiques, Ergonomie & DPC)
-- Version    : 6.0.0
-- Date       : 2026-09-13
-- Description: Intégration des exigences physiques de travail
--              (charges à soulever, postures, motricité, vision, ouïe)
--              et des fonctions Données-Personnes-Choses (DPC)
--              pour l'évaluation d'aptitude à l'emploi (c.o., réadaptation, CNESST).
-- Sources    : EDSC Guide sur les carrières (GC 2016) + StatCan CNP 2021.
-- Prérequis  : schema.sql (V1) appliqué (table occupations existante).
-- ============================================================

CREATE TABLE IF NOT EXISTS occupation_physical_demands (
    occupation_cnp_code             TEXT        PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    
    -- 1. Exigences physiques et de force (Charges à soulever)
    strength_code                   TEXT,                   -- 'S-1', 'S-2', 'S-3', 'S-4'
    strength_label_fr               TEXT,                   -- 'Limitée (< 5 kg)', 'Légère (jusqu''à 10 kg)', 'Moyenne (10 à 20 kg)', 'Lourde (> 20 kg)'
    max_weight_kg                   INTEGER,                -- 5, 10, 20, 50 (seuil maximal indicatif)
    
    -- 2. Postures corporelles de travail
    body_position_code              TEXT,                   -- 'B-1', 'B-2', 'B-3', 'B-4'
    body_position_label_fr          TEXT,                   -- 'Assis', 'Debout / Marche', 'Courbé / Accroupi / À genoux', 'Grimper'
    
    -- 3. Coordination motrice et dextérité
    limb_coordination_code          TEXT,                   -- 'L-0', 'L-1', 'L-2'
    limb_coordination_label_fr      TEXT,                   -- 'Non requise', 'Membres supérieurs', 'Coordination membres multiples'
    
    -- 4. Exigences sensorielles (Vision, Couleurs, Ouïe)
    vision_code                     TEXT,                   -- 'V-1', 'V-2', 'V-3'
    vision_label_fr                 TEXT,                   -- 'Normale', 'De près ou de loin', 'Champ visuel / Profondeur'
    colour_code                     TEXT,                   -- 'C-0', 'C-1', 'C-2'
    colour_label_fr                 TEXT,                   -- 'Non requise', 'Requise', 'Critique'
    hearing_code                    TEXT,                   -- 'H-1', 'H-2', 'H-3'
    hearing_label_fr                TEXT,                   -- 'Normale', 'Échange verbal / Sons', 'Audition critique'
    
    -- 5. Données, Personnes, Choses (DPC — Modèle fonctionnel Fine / EDSC)
    dpc_data                        TEXT,                   -- ex: 'Synthétiser - 0', 'Coordonner - 1', 'Analyser - 2'
    dpc_people                      TEXT,                   -- ex: 'Mentorat - 0', 'Négocier - 1', 'Instruire - 2'
    dpc_things                      TEXT,                   -- ex: 'Mise au point - 0', 'Travail de précision - 1'
    dpc_summary                     VARCHAR(20),            -- Synthèse: 'D-2 | P-2 | C-1'
    
    -- 6. Passerelle psychométrique RIASEC (Modèle bifactoriel de Prediger)
    prediger_things_people          TEXT,                   -- 'Choses (R)', 'Personnes (S)', 'Équilibré'
    prediger_data_ideas             TEXT,                   -- 'Données (C)', 'Idées (A/I)', 'Équilibré'
    
    source                          TEXT DEFAULT 'EDSC Career Handbook / StatCan CNP 2021',
    created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE occupation_physical_demands IS
    'Exigences physiques, contraintes ergonomiques (force, posture, sensoriel) et fonctions DPC pour chaque métier CNP 2021.';

-- Index pour requêtes rapides de filtrage d'aptitude / réadaptation
CREATE INDEX IF NOT EXISTS idx_phys_strength_code ON occupation_physical_demands (strength_code);
CREATE INDEX IF NOT EXISTS idx_phys_max_weight_kg ON occupation_physical_demands (max_weight_kg);
CREATE INDEX IF NOT EXISTS idx_phys_body_position ON occupation_physical_demands (body_position_code);
CREATE INDEX IF NOT EXISTS idx_phys_prediger_tp   ON occupation_physical_demands (prediger_things_people);
