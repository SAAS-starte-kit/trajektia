-- ============================================================
-- TRAJEKTIA — Schema V7 (Taxonomie de Référence DPC & Explicabilité c.o.)
-- Version    : 7.0.0
-- Date       : 2026-09-13
-- Description: Table de référence canonique des 25 fonctions
--              Données, Personnes, Choses (DPC / Functional Job Analysis)
--              définies par Sidney Fine et le Guide sur les carrières (EDSC).
--              Inclut définitions cliniques bilingues, complexités,
--              pôles de Prediger et vue d'enrichissement détaillée.
-- ============================================================

-- 1. Table de Référence DPC
CREATE TABLE IF NOT EXISTS ref_dpc_taxonomy (
    dpc_code             VARCHAR(10) PRIMARY KEY, -- 'D-0' à 'D-6', 'P-0' à 'P-8', 'C-0' à 'C-8'
    category             VARCHAR(10) NOT NULL CHECK (category IN ('DATA', 'PEOPLE', 'THINGS')),
    level_number         SMALLINT NOT NULL CHECK (level_number BETWEEN 0 AND 8),
    verb_fr              TEXT NOT NULL,
    verb_en              TEXT NOT NULL,
    definition_fr        TEXT NOT NULL,
    definition_en        TEXT NOT NULL,
    complexity_weight    SMALLINT NOT NULL CHECK (complexity_weight BETWEEN 1 AND 5),
    prediger_pole        VARCHAR(20) NOT NULL, -- 'Idées', 'Données', 'Personnes', 'Choses', 'Neutre'
    concrete_examples_fr TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ref_dpc_taxonomy IS 
    'Table de référence officielle des 25 niveaux et verbes d''action Données-Personnes-Choses (FJA / Guide des carrières EDSC).';

-- Index pour filtres rapides par catégorie et niveau
CREATE INDEX IF NOT EXISTS idx_ref_dpc_cat_lvl ON ref_dpc_taxonomy (category, level_number);
CREATE INDEX IF NOT EXISTS idx_ref_dpc_pole ON ref_dpc_taxonomy (prediger_pole);

-- 2. Insertion des 25 modalités officielles (Upsert idempotent)
INSERT INTO ref_dpc_taxonomy (
    dpc_code, category, level_number, verb_fr, verb_en,
    definition_fr, definition_en, complexity_weight, prediger_pole, concrete_examples_fr
) VALUES
-- ─── DONNÉES (DATA : 0 à 6) ──────────────────────────────────────────────────
(
    'D-0', 'DATA', 0, 'Synthétiser', 'Synthesizing',
    'Intégrer des analyses pour déterminer des objectifs, des plans, des politiques ou des conceptions d''ensemble.',
    'Integrating analyses of data to determine facts and/or develop knowledge concepts or interpretations.',
    5, 'Idées',
    'Élaborer une stratégie d''entreprise, concevoir une architecture logicielle ou un cadre de recherche scientifique.'
),
(
    'D-1', 'DATA', 1, 'Coordonner', 'Coordinating',
    'Déterminer le temps, le lieu et l''ordre d''une opération ou d''une activité pour assurer l''exécution efficace des tâches.',
    'Determining time, place, and sequence of operations or actions for their execution.',
    5, 'Idées',
    'Planifier des opérations de chantiers, superviser le déploiement d''un plan logistique ou hospitalier.'
),
(
    'D-2', 'DATA', 2, 'Analyser', 'Analyzing',
    'Examiner et évaluer des données ou des informations pour déterminer des relations, des causes ou des solutions techniques.',
    'Examining and evaluating data to identify key facts and discover underlying principles.',
    4, 'Données',
    'Diagnostiquer une panne complexe, évaluer des bilans financiers, interpréter des données cliniques.'
),
(
    'D-3', 'DATA', 3, 'Compiler / Rassembler', 'Compiling',
    'Recueillir, classer, trier et enregistrer des informations sur des données, des personnes ou des choses.',
    'Gathering, collating, or classifying information about data, people, or things.',
    3, 'Données',
    'Tenir des inventaires, préparer des rapports statistiques réguliers, colliger des dossiers médicaux.'
),
(
    'D-4', 'DATA', 4, 'Calculer', 'Computing',
    'Effectuer des calculs arithmétiques, comptables ou statistiques selon des formules établies.',
    'Performing arithmetic operations and calculations according to established formulas.',
    3, 'Données',
    'Calculer des paies, établir des devis et factures, mesurer des tolérances géométriques.'
),
(
    'D-5', 'DATA', 5, 'Copier', 'Copying',
    'Transcrire, entrer, copier ou reproduire des données selon des consignes strictes sans interprétation.',
    'Transcribing, entering, or posting data following standard procedures.',
    2, 'Données',
    'Saisie de données au kilomètre, retranscription de formulaires, archivage de documents.'
),
(
    'D-6', 'DATA', 6, 'Comparer', 'Comparing',
    'Juger des caractéristiques immédiatement observables de données ou d''objets (contrôle de conformité simple).',
    'Judging the readily observable functional, structural, or compositional characteristics.',
    1, 'Neutre',
    'Vérifier la concordance d''un code-barres, trier des documents selon un ordre alphabétique.'
),

-- ─── PERSONNES (PEOPLE : 0 à 8) ──────────────────────────────────────────────
(
    'P-0', 'PEOPLE', 0, 'Conseiller / Mentorat', 'Mentoring / Consulting',
    'Aider des individus à résoudre des problèmes personnels, professionnels ou de santé par le conseil clinique, l''orientation ou la thérapie.',
    'Dealing with individuals in terms of their total personality to advise, counsel, and/or guide them toward solving problems.',
    5, 'Personnes',
    'Conseil d''orientation (c.o.), psychothérapie, consultation en réadaptation, coaching de direction.'
),
(
    'P-1', 'PEOPLE', 1, 'Négocier', 'Negotiating',
    'Échanger des idées, des informations et des points de vue pour parvenir à un accord commercial, juridique, social ou politique.',
    'Exchanging ideas, information, and opinions with others to formulate policies, programs, and/or reach joint decisions.',
    5, 'Personnes',
    'Négociation de conventions collectives, médiation juridique, conclusion de partenariats d''affaires majeurs.'
),
(
    'P-2', 'PEOPLE', 2, 'Instruire', 'Instructing',
    'Enseigner, former ou transmettre des connaissances théoriques et pratiques à des étudiants, stagiaires ou bénéficiaires.',
    'Teaching subject matter to others, or training others through explanation, demonstration, and supervised practice.',
    4, 'Personnes',
    'Enseignement secondaire, collégial ou universitaire, formation professionnelle d''adultes.'
),
(
    'P-3', 'PEOPLE', 3, 'Superviser', 'Supervising',
    'Déterminer ou interpréter des procédures de travail, assigner des tâches, maintenir l''harmonie et évaluer le rendement.',
    'Determining or interpreting work procedures for a group of workers, assigning specific duties, and maintaining harmony.',
    4, 'Personnes',
    'Chef d''équipe de chantier, gestionnaire d''unité hospitalière, responsable d''équipe de service.'
),
(
    'P-4', 'PEOPLE', 4, 'Divertir', 'Diverting',
    'Amuser, divertir, jouer la comédie ou performer artistiquement devant un public.',
    'Amusing others, usually through the medium of stage, screen, television, or radio.',
    3, 'Personnes',
    'Comédiens, humoristes, animateurs d''émissions, musiciens de scène.'
),
(
    'P-5', 'PEOPLE', 5, 'Persuader', 'Persuading',
    'Influencer d''autres personnes en faveur d''un produit, d''un service, d''une idée ou d''une décision.',
    'Influencing others in favor of a product, service, or point of view by talking or demonstration.',
    3, 'Personnes',
    'Représentant commercial B2B, courtier immobilier, agent de souscription d''assurance.'
),
(
    'P-6', 'PEOPLE', 6, 'Signaler / Échanger', 'Speaking - Signaling',
    'Communiquer verbalement des informations opérationnelles, des directives de routine ou des signaux de coordination.',
    'Talking with and/or signaling people to convey or exchange information, including giving assignments or directions.',
    2, 'Personnes',
    'Répartiteur de transport d''urgence, agent d''accueil et d''orientation, commis aux renseignements.'
),
(
    'P-7', 'PEOPLE', 7, 'Servir / Aider', 'Serving - Assisting',
    'Répondre aux besoins immédiats de confort, de soins personnels ou d''aide matérielle de personnes.',
    'Attending to the needs, requests, or comfort of other people, or assisting individuals in physical tasks.',
    2, 'Personnes',
    'Préposé aux bénéficiaires (PAB), auxiliaire familial, serveur en établissement hôtelier.'
),
(
    'P-8', 'PEOPLE', 8, 'Recevoir des consignes / Non significatif', 'Taking Instructions / Not Significant',
    'Exécuter des tâches en recevant des instructions directes avec une interaction relationnelle minime.',
    'Attending to work assignments and instructions with little or no interpersonal interaction.',
    1, 'Neutre',
    'Opérateur sur ligne d''usinage continue, archiviste, gardien de nuit.'
),

-- ─── CHOSES (THINGS : 0 à 8) ─────────────────────────────────────────────────
(
    'C-0', 'THINGS', 0, 'Régler / Mise au point', 'Setting Up',
    'Ajuster, installer, calibrer et régler des machines, outils, instruments ou dispositifs complexes pour préparer la production ou les tests.',
    'Adjusting machines or equipment by replacing or altering tools, jigs, fixtures, and attachments to prepare them for operation.',
    5, 'Choses',
    'Machiniste CNC de précision, mécanicien industriel spécialisé, technicien en instrumentation.'
),
(
    'C-1', 'THINGS', 1, 'Travail de précision', 'Precision Working',
    'Utiliser des outils manuels ou des instruments pour atteindre des normes rigoureuses de forme, de dimension ou de tolérance.',
    'Using body members and/or tools or work aids to work, move, guide, or place objects or materials with high precision.',
    5, 'Choses',
    'Chirurgien, horloger, prothésiste dentaire, électricien d''appareillage sensible.'
),
(
    'C-2', 'THINGS', 2, 'Faire fonctionner / Contrôler', 'Operating - Controlling',
    'Démarrer, arrêter, contrôler et ajuster des machines ou équipements stationnaires complexes.',
    'Starting, stopping, controlling, and adjusting the progress of machines or equipment designed to fabricate or process materials.',
    4, 'Choses',
    'Opérateur de centrale hydroélectrique, technicien en imagerie médicale, opérateur de raffinerie.'
),
(
    'C-3', 'THINGS', 3, 'Conduire / Manœuvrer', 'Driving - Operating',
    'Conduire ou manœuvrer des véhicules ou engins mobiles lourds (camions, grues, trains, autobus, engins de chantier).',
    'Starting, stopping, and driving vehicles or moving materials using mechanical equipment.',
    4, 'Choses',
    'Conducteur de camion lourd (classe 1), grutier certifié, opérateur de machinerie forestière.'
),
(
    'C-4', 'THINGS', 4, 'Manipuler / Actionner', 'Manipulating',
    'Travailler avec des outils manuels ou de l''équipement simple nécessitant une habileté physique ou une force modérée.',
    'Using body members, tools, or special devices to work, move, guide, or place objects or materials according to predetermined standards.',
    3, 'Choses',
    'Menuisier généraliste, poseur de revêtements, installateur de câblage résidentiel.'
),
(
    'C-5', 'THINGS', 5, 'Assurer le fonctionnement / Alimenter', 'Feeding - Offbearing',
    'Insérer, alimenter, décharger ou retirer des matériaux dans/de machines automatiques en fonctionnement.',
    'Inserting, throwing, dumping, or placing materials into or removing them from machines or equipment.',
    2, 'Choses',
    'Alimentateur de presse d''imprimerie, opérateur d''ensachage automatique.'
),
(
    'C-6', 'THINGS', 6, 'Arranger / Surveiller', 'Tending',
    'Surveiller le fonctionnement simple de machines et ajuster les commandes de base (température, débit, arrêt d''urgence).',
    'Starting, stopping, and observing the functioning of machines and equipment.',
    2, 'Choses',
    'Opérateur de scierie automatisée, surveillant de trieuse de minerai.'
),
(
    'C-7', 'THINGS', 7, 'Manier / Manutention', 'Handling',
    'Charger, décharger, empiler ou déplacer manuellement des matériaux ou objets simples sans outillage complexe.',
    'Using body members, hand tools, or work aids to work, move, or carry objects or materials.',
    1, 'Choses',
    'Journalier d''entrepôt, trieur de matières recyclables, débardeur.'
),
(
    'C-8', 'THINGS', 8, 'Non significatif', 'Not Significant',
    'Activités professionnelles sans exigence matérielle, outillage ou manipulation mécanique significative (activités intellectuelles ou relationnelles pures).',
    'No significant involvement with materials, tools, or equipment.',
    1, 'Neutre',
    'Avocat, conseiller d''orientation, actuaire, développeur de logiciels, analyste financier.'
)
ON CONFLICT (dpc_code) DO UPDATE SET
    verb_fr = EXCLUDED.verb_fr,
    verb_en = EXCLUDED.verb_en,
    definition_fr = EXCLUDED.definition_fr,
    definition_en = EXCLUDED.definition_en,
    complexity_weight = EXCLUDED.complexity_weight,
    prediger_pole = EXCLUDED.prediger_pole,
    concrete_examples_fr = EXCLUDED.concrete_examples_fr;

-- 3. Vue SQL enrichie pour fiches métiers & affichage complet c.o.
CREATE OR REPLACE VIEW v_occupation_dpc_detailed AS
SELECT
    o.cnp_code,
    o.title_fr AS occupation_title_fr,
    o.title_en AS occupation_title_en,
    p.strength_code,
    p.strength_label_fr,
    p.max_weight_kg,
    p.body_position_code,
    p.body_position_label_fr,
    p.limb_coordination_code,
    p.limb_coordination_label_fr,
    p.vision_code,
    p.vision_label_fr,
    p.colour_code,
    p.colour_label_fr,
    p.hearing_code,
    p.hearing_label_fr,
    
    -- Codes DPC bruts
    p.dpc_summary,
    
    -- Données (DATA)
    'D-' || COALESCE(NULLIF(regexp_replace(p.dpc_data, '[^0-9]', '', 'g'), ''), '6') AS dpc_data_code,
    d.verb_fr AS dpc_data_verb_fr,
    d.verb_en AS dpc_data_verb_en,
    d.definition_fr AS dpc_data_definition_fr,
    d.complexity_weight AS dpc_data_complexity,
    
    -- Personnes (PEOPLE)
    'P-' || COALESCE(NULLIF(regexp_replace(p.dpc_people, '[^0-9]', '', 'g'), ''), '8') AS dpc_people_code,
    pe.verb_fr AS dpc_people_verb_fr,
    pe.verb_en AS dpc_people_verb_en,
    pe.definition_fr AS dpc_people_definition_fr,
    pe.complexity_weight AS dpc_people_complexity,
    
    -- Choses (THINGS)
    'C-' || COALESCE(NULLIF(regexp_replace(p.dpc_things, '[^0-9]', '', 'g'), ''), '8') AS dpc_things_code,
    t.verb_fr AS dpc_things_verb_fr,
    t.verb_en AS dpc_things_verb_en,
    t.definition_fr AS dpc_things_definition_fr,
    t.complexity_weight AS dpc_things_complexity,
    
    -- Axes de Prediger
    p.prediger_things_people,
    p.prediger_data_ideas

FROM occupations o
JOIN occupation_physical_demands p ON o.cnp_code = p.occupation_cnp_code
LEFT JOIN ref_dpc_taxonomy d ON d.dpc_code = ('D-' || COALESCE(NULLIF(regexp_replace(p.dpc_data, '[^0-9]', '', 'g'), ''), '6'))
LEFT JOIN ref_dpc_taxonomy pe ON pe.dpc_code = ('P-' || COALESCE(NULLIF(regexp_replace(p.dpc_people, '[^0-9]', '', 'g'), ''), '8'))
LEFT JOIN ref_dpc_taxonomy t ON t.dpc_code = ('C-' || COALESCE(NULLIF(regexp_replace(p.dpc_things, '[^0-9]', '', 'g'), ''), '8'));

COMMENT ON VIEW v_occupation_dpc_detailed IS 
    'Vue consolidée combinant les profils physiques, cotes DPC et définitions taxonomiques bilingues pour les 504 métiers de la CNP.';
