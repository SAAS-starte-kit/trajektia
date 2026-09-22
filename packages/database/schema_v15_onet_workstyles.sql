-- ============================================================
-- Schema v15: O*NET Work Styles
-- Ingestion des 21 facettes des Work Styles O*NET
-- ============================================================

-- Table des Work Styles O*NET par métier
CREATE TABLE IF NOT EXISTS onet_work_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnp_code VARCHAR(10) NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    style_id VARCHAR(10) NOT NULL,  -- O*NET Work Style ID (ex: "1", "2", etc.)
    style_name_en VARCHAR(255) NOT NULL,
    style_name_fr VARCHAR(255),
    description_en TEXT,
    description_fr TEXT,
    score NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100),
    source VARCHAR(50) DEFAULT 'O*NET 28.2',
    ingested_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cnp_code, style_id)
);

-- Index pour requêtes efficaces
CREATE INDEX IF NOT EXISTS idx_onet_ws_cnp ON onet_work_styles (cnp_code);
CREATE INDEX IF NOT EXISTS idx_onet_ws_style ON onet_work_styles (style_id);

-- Commentaire
COMMENT ON TABLE onet_work_styles IS 'O*NET Work Styles (21 facets) per occupation - detailed personality/work style scores';
COMMENT ON COLUMN onet_work_styles.cnp_code IS 'CNP 2021 code (Canadian)';
COMMENT ON COLUMN onet_work_styles.style_id IS 'O*NET Work Style element ID';
COMMENT ON COLUMN onet_work_styles.score IS 'Importance score (0-100) from O*NET';

-- =============================================================================
-- Données de référence: les 21 Work Styles O*NET
-- =============================================================================

-- Insertion des definitions des 21 Work Styles (si pas déjà présents)
INSERT INTO onet_work_styles (cnp_code, style_id, style_name_en, style_name_fr, description_en, description_fr, score, source)
SELECT
    'XXXXX' AS cnp_code,  -- Placeholder, seront mis à jour par l'ingesteur
    ws.style_id,
    ws.style_name_en,
    ws.style_name_fr,
    ws.description_en,
    ws.description_fr,
    0 AS score,
    'O*NET 28.2' AS source
FROM (
    VALUES
        ('1', 'Achievement/Effort', 'Accomplissement/Effort', 'Establishing and maintaining personally challenging achievement goals and exerting effort toward mastering tasks.', 'Établir et maintenir des objectifs d''accomplissement personnels difficiles et déployer des efforts pour maîtriser les tâches.'),
        ('2', 'Adaptability/Flexibility', 'Adaptabilité/Flexibilité', 'Being open to change (positive or negative) and to considerable variety in the workplace.', 'Être ouvert au changement (positif ou négatif) et à une grande variété sur le lieu de travail.'),
        ('3', 'Analytical Thinking', 'Pensée Analytique', 'Analyzing information and using logic to address work-related issues and problems.', 'Analyser les informations et utiliser la logique pour résoudre les problèmes liés au travail.'),
        ('4', 'Attention to Detail', 'Attention aux Détails', 'Being careful about detail and thoroughness in completing work tasks.', 'Faire attention aux détails et à l''exhaustivité dans l''exécution des tâches.'),
        ('5', 'Cooperation', 'Cooperation', 'Being pleasant with others and displaying a good-natured, cooperative attitude.', 'Être agréable avec les autres et afficher une attitude cooperative et de bonne volonté.'),
        ('6', 'Dependability', 'Fiabilité', 'Being reliable, responsible, and dependable, and fulfilling obligations.', 'Être fiable, responsable et digne de confiance, et remplir ses obligations.'),
        ('7', 'Initiative', 'Initiative', 'Willingness to take on responsibilities and challenges.', 'Prendre des responsabilités et relever des défis.'),
        ('8', 'Innovation', 'Innovation', 'Being creative and alternative thinking to develop new ideas for and answers to work-related problems.', 'Être créatif et avoir une pensée alternative pour développer de nouvelles idées et réponses aux problèmes liés au travail.'),
        ('9', 'Integrity', 'Intégrité', 'Being honest and ethical in all aspects of work.', 'Être honnête et éthique dans tous les aspects du travail.'),
        ('10', 'Leadership', 'Leadership', 'Willingness to lead, take charge, and offer opinions and direction.', 'Être prêt à diriger, prendre les choses en main et offrir des opinions et des orientations.'),
        ('11', 'Mathematical Reasoning', 'Raisonnement Mathématique', 'Choosing the right mathematical methods or formulas to solve a problem.', 'Choisir les bonnes méthodes ou formules mathématiques pour résoudre un problème.'),
        ('12', 'Mechanical Reasoning', 'Raisonnement Mécanique', 'Generalizing and applying basic mechanical and physical principles to solve problems.', 'Généraliser et appliquer les principes mécaniques et physiques de base pour résoudre des problèmes.'),
        ('13', 'Organization', 'Organisation', 'Keeping track of how well people and things are doing in order to make improvements or take corrective action.', 'Surveiller comment les personnes et les choses progressent afin d''apporter des améliorations ou des mesures correctives.'),
        ('14', 'Persistence', 'Persévérance', 'Persistence in the face of obstacles.', 'Persévérer face aux obstacles.'),
        ('15', 'Planning and Organizing', 'Planification et Organisation', 'Developing and identifying appropriate goals, plans, and priorities for completing tasks and projects.', 'Développer et identifier les objectifs, plans et priorités appropriés pour accomplir les tâches et projets.'),
        ('16', 'Problem Sensitivity', 'Sensibilité aux Problèmes', 'The ability to tell when something is wrong or is likely to go wrong. It does not involve solving the problem, only recognizing there is a problem.', 'La capacité de reconnaître quand quelque chose ne va pas ou est susceptible de mal se passer. Cela ne consiste pas à résoudre le problème, mais à reconnaître qu''il existe.'),
        ('17', 'Reasoning', 'Raisonnement', 'Using logic and reasoning to identify the strengths and weaknesses of alternative solutions, conclusions or approaches to problems.', 'Utiliser la logique et le raisonnement pour identifier les forces et les faiblesses des solutions, conclusions ou approches alternatives aux problèmes.'),
        ('18', 'Risk Taking', 'Prise de Risque', 'Willingness to take risks and approach innovative new ideas.', 'Prendre des risques et aborder de nouvelles idées innovantes.'),
        ('19', 'Self-Control', 'Auto-Contrôle', 'Maintaining composure, keeping emotions in check, controlling anger, and avoiding aggressive behavior, even in very difficult situations.', 'Garder son sang-froid, contrôler ses émotions, maîtriser sa colère et éviter les comportements agressifs, même dans des situations très difficiles.'),
        ('20', 'Social Orientation', 'Orientation Sociale', 'Preferring to work with others rather than alone, and being personally connected with others on the job.', 'Préférer travailler avec les autres plutôt que seul, et être personnellemet connecté avec les autres au travail.'),
        ('21', 'Stress Tolerance', 'Tolérance au Stress', 'Accepting criticism and dealing calmly and effectively with high stress situations.', 'Accepter les critiques et gérer calmement et efficacement les situations de stress élevé.')
) AS ws(style_id, style_name_en, style_name_fr, description_en, description_fr)
ON CONFLICT (cnp_code, style_id) DO NOTHING;

-- Suppression des lignes placeholder
DELETE FROM onet_work_styles WHERE cnp_code = 'XXXXX';

-- =============================================================================
-- Fin du schema v15
-- =============================================================================
