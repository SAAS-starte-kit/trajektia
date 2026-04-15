-- ============================================================
-- TRAJEKTIA — Schema V2 (Additive Migration)
-- Version  : 2.0.0
-- Date     : 2026-04-14
-- Scope    : ADDITIVE — ne supprime rien de schema.sql V1.
--            Applique uniquement des ALTER TABLE et CREATE TABLE.
-- Couverture:
--   • CNP 2021 : Hiérarchie TEER, Appellations d'emploi,
--                Exclusions, Exigences d'emploi
--   • Legacy   : Concordance 2016↔2021, DPT / RIASEC-CA / Physique
--   • OaSIS    : Milieux de travail, Échelles de niveaux,
--                Table de liaison occupation_oasis (scores complets)
-- ============================================================


-- ============================================================
-- SECTION 1 — ENRICHISSEMENT DE LA TABLE occupations
--             (colonnes manquantes pour la classification CNP)
-- ============================================================

-- Catégorie professionnelle large (ex : 0, 1, 2 ... 9)
ALTER TABLE occupations
    ADD COLUMN IF NOT EXISTS broad_category_code    TEXT,        -- '0','1',...,'9'
    ADD COLUMN IF NOT EXISTS broad_category_name_fr TEXT,        -- 'Gestion'
    ADD COLUMN IF NOT EXISTS broad_category_name_en TEXT,        -- 'Management'

    -- Groupe principal (2 chiffres, ex : '11')
    ADD COLUMN IF NOT EXISTS major_group_code       TEXT,
    ADD COLUMN IF NOT EXISTS major_group_name_fr    TEXT,
    ADD COLUMN IF NOT EXISTS major_group_name_en    TEXT,

    -- Sous-groupe (3 chiffres, ex : '111')
    ADD COLUMN IF NOT EXISTS minor_group_code       TEXT,
    ADD COLUMN IF NOT EXISTS minor_group_name_fr    TEXT,
    ADD COLUMN IF NOT EXISTS minor_group_name_en    TEXT,

    -- TEER — Degré de Formation, Études, Expérience et Responsabilités
    ADD COLUMN IF NOT EXISTS teer_level             SMALLINT,   -- 0 à 5
    ADD COLUMN IF NOT EXISTS teer_description_fr    TEXT,
    ADD COLUMN IF NOT EXISTS teer_description_en    TEXT,

    -- CNP 5 chiffres officiel (ex : '11100')  — distinct du cnp_code SIPeC
    ADD COLUMN IF NOT EXISTS noc_5digit_code        TEXT;

CREATE INDEX IF NOT EXISTS idx_occ_broad_cat  ON occupations (broad_category_code);
CREATE INDEX IF NOT EXISTS idx_occ_major_grp  ON occupations (major_group_code);
CREATE INDEX IF NOT EXISTS idx_occ_teer       ON occupations (teer_level);
CREATE INDEX IF NOT EXISTS idx_occ_noc5       ON occupations (noc_5digit_code);

COMMENT ON COLUMN occupations.teer_level          IS 'TEER 0-5 : Formation, Études, Expérience, Responsabilités (CNP 2021).';
COMMENT ON COLUMN occupations.broad_category_code IS 'Grand groupe CNP 2021 (1 chiffre).';
COMMENT ON COLUMN occupations.major_group_code    IS 'Groupe principal CNP 2021 (2 chiffres).';
COMMENT ON COLUMN occupations.minor_group_code    IS 'Sous-groupe CNP 2021 (3 chiffres).';


-- ============================================================
-- SECTION 2 — HIÉRARCHIE CNP 2021
--             Nœuds intermédiaires (grand-groupe → sous-groupe)
-- ============================================================
CREATE TABLE IF NOT EXISTS cnp_hierarchy (
    code                TEXT        PRIMARY KEY,  -- '1','11','111','11100'
    level               SMALLINT    NOT NULL,     -- 1=broad,2=major,3=minor,4=unit(5-digit)
    parent_code         TEXT        REFERENCES cnp_hierarchy(code) ON DELETE SET NULL,

    name_fr             TEXT        NOT NULL,
    name_en             TEXT,
    teer_level          SMALLINT,                 -- NULL pour les niveaux >1
    description_fr      TEXT,
    description_en      TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cnph_level  ON cnp_hierarchy (level);
CREATE INDEX IF NOT EXISTS idx_cnph_parent ON cnp_hierarchy (parent_code);

COMMENT ON TABLE cnp_hierarchy IS 'Hiérarchie complète CNP 2021 : grands groupes, groupes principaux, sous-groupes et groupes de base (5 chiffres).';


-- ============================================================
-- SECTION 3 — APPELLATIONS D'EMPLOI  (Synonymes / Étiquettes)
--             Source : fichier "Appellations d'emploi" du jeu CNP 2021
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_job_titles (
    id                  BIGSERIAL   PRIMARY KEY,
    occupation_cnp_code TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Appellation officielle ou synonyme
    title               TEXT        NOT NULL,
    language            CHAR(2)     NOT NULL DEFAULT 'fr',  -- 'fr' | 'en'

    -- Type d'étiquette
    label_type          TEXT        NOT NULL DEFAULT 'synonym',
    -- 'main_title'    : Titre principal de la profession
    -- 'synonym'       : Appellation d'emploi équivalente
    -- 'lead_statement': Énoncé principal (description courte)
    -- 'former_title'  : Ancien titre (héritage CNP 2016)

    -- Source du fichier gouvernemental
    source_file         TEXT,                -- nom du fichier CSV d'origine
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobtit_occ      ON occupation_job_titles (occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_jobtit_lang     ON occupation_job_titles (language);
CREATE INDEX IF NOT EXISTS idx_jobtit_type     ON occupation_job_titles (label_type);
CREATE INDEX IF NOT EXISTS idx_jobtit_title    ON occupation_job_titles USING gin (title gin_trgm_ops);

COMMENT ON TABLE occupation_job_titles IS 'Appellations d'emploi (synonymes, titres alternatifs) par profession — CNP 2021. Crucial pour la recherche plein-texte multilingue.';


-- ============================================================
-- SECTION 4 — EXCLUSIONS
--             Source : fichier "Exclusions" du jeu CNP 2021
--             Crucial pour la désambiguïsation inter-professions
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_exclusions (
    id                      BIGSERIAL   PRIMARY KEY,
    occupation_cnp_code     TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Code CNP de la profession exclue (peut ne pas être dans occupations si hors périmètre)
    excluded_cnp_code       TEXT,
    excluded_occupation_fr  TEXT,
    excluded_occupation_en  TEXT,

    -- Note explicative de l'exclusion
    exclusion_note_fr       TEXT,
    exclusion_note_en       TEXT,

    source_file             TEXT,
    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_excl_occ      ON occupation_exclusions (occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_excl_excluded ON occupation_exclusions (excluded_cnp_code);

COMMENT ON TABLE occupation_exclusions IS 'Liste des exclusions par profession CNP 2021. Permet la désambiguïsation entre professions similaires.';


-- ============================================================
-- SECTION 5 — EXIGENCES D'EMPLOI
--             Source : fichier "Exigences d'emploi" du jeu CNP 2021
--             Couvre : scolarité, certifications, accès réglementé
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_requirements (
    id                      BIGSERIAL   PRIMARY KEY,
    occupation_cnp_code     TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Type d'exigence
    requirement_type        TEXT        NOT NULL,
    -- 'education'        : Niveau de scolarité (ex: baccalauréat)
    -- 'certification'    : Titre professionnel (ex: CPA, ing.)
    -- 'licence'          : Permis obligatoire
    -- 'regulated_access' : Accès réglementé à la profession
    -- 'experience'       : Expérience requise
    -- 'language'         : Exigence linguistique
    -- 'other'            : Autre condition

    -- Contenu bilingue
    requirement_text_fr     TEXT        NOT NULL,
    requirement_text_en     TEXT,

    -- Niveau de scolarité normalisé (pour filtrage rapide)
    education_level_code    TEXT,
    -- 'no_formal'     : Aucune exigence formelle
    -- 'secondary'     : Diplôme d'études secondaires
    -- 'post_secondary': Formation post-secondaire non universitaire
    -- 'college'       : Diplôme collégial / AEC / DEC
    -- 'bachelor'      : Baccalauréat
    -- 'graduate'      : Maîtrise ou doctorat
    -- 'professional'  : Doctorat professionnel (droit, médecine)

    -- Profession réglementée ?
    is_regulated            BOOLEAN     DEFAULT FALSE,
    regulating_body_fr      TEXT,
    regulating_body_en      TEXT,

    -- Ordre / séquence d'affichage
    display_order           SMALLINT,

    source_file             TEXT,
    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_req_occ     ON occupation_requirements (occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_req_type    ON occupation_requirements (requirement_type);
CREATE INDEX IF NOT EXISTS idx_req_edu     ON occupation_requirements (education_level_code);
CREATE INDEX IF NOT EXISTS idx_req_reg     ON occupation_requirements (is_regulated);

COMMENT ON TABLE occupation_requirements IS 'Exigences d'emploi par profession CNP 2021 : scolarité, certifications, accès réglementé, permis.';


-- ============================================================
-- SECTION 6 — CONCORDANCE CNP 2016 ↔ 2021  (Pont Legacy)
--             Source : table de concordance officielle ESDC
-- ============================================================
CREATE TABLE IF NOT EXISTS cnp_concordance_2016_2021 (
    id                  BIGSERIAL   PRIMARY KEY,

    cnp_2016_code       TEXT        NOT NULL,   -- 4 chiffres (ex: '1111')
    cnp_2016_title_fr   TEXT,
    cnp_2016_title_en   TEXT,

    cnp_2021_code       TEXT        NOT NULL,   -- 5 chiffres (ex: '11100')
    cnp_2021_title_fr   TEXT,
    cnp_2021_title_en   TEXT,

    -- Nature de la correspondance
    correspondence_type TEXT,
    -- 'exact'    : Correspondance exacte 1:1
    -- 'split'    : Un code 2016 → plusieurs 2021
    -- 'merge'    : Plusieurs codes 2016 → un 2021
    -- 'new'      : Nouvelle profession (sans équivalent 2016)
    -- 'abolished': Profession supprimée

    correspondence_note_fr TEXT,
    correspondence_note_en TEXT,

    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conc_2016 ON cnp_concordance_2016_2021 (cnp_2016_code);
CREATE INDEX IF NOT EXISTS idx_conc_2021 ON cnp_concordance_2016_2021 (cnp_2021_code);

COMMENT ON TABLE cnp_concordance_2016_2021 IS 'Table de concordance officielle CNP 2016 ↔ 2021. Utilisée pour rapatrier données legacy (DPT, RIASEC-CA, physique).';


-- ============================================================
-- SECTION 7 — DONNÉES LEGACY DPT / Manuel des professions 2016
--             Codes DPT, Intérêts RIASEC canadiens,
--             Exigences physiques → mappés aux codes CNP 2021
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_legacy_dpt (
    occupation_cnp_code     TEXT        PRIMARY KEY REFERENCES occupations(cnp_code) ON DELETE CASCADE,

    -- Codes DPT (Dictionnaire des professions types)
    dpt_code                TEXT,        -- Code DPT officiel
    dpt_title_fr            TEXT,
    dpt_title_en            TEXT,

    -- Intérêts RIASEC canadiens (système d'intérêts professionnels d'ESDC)
    -- Distincts des scores O*NET — issus du Manuel des professions 2016
    riasec_ca_code          TEXT,        -- ex: 'RIA', 'CSE'
    riasec_ca_score_r       NUMERIC(4,2),
    riasec_ca_score_i       NUMERIC(4,2),
    riasec_ca_score_a       NUMERIC(4,2),
    riasec_ca_score_s       NUMERIC(4,2),
    riasec_ca_score_e       NUMERIC(4,2),
    riasec_ca_score_c       NUMERIC(4,2),

    -- Exigences physiques (Manuel des professions 2016)
    -- Stockées en JSONB pour flexibilité maximale
    -- Exemple : {"force": "légère", "posture": "debout prolongé",
    --            "vision": "normale", "coordination": "fine"}
    physical_requirements   JSONB,

    -- Conditions de travail (legacy)
    work_conditions_fr      TEXT,
    work_conditions_en      TEXT,

    -- Provenance
    source_cnp_2016_code    TEXT,       -- Code CNP 2016 d'origine avant concordance
    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dpt_code    ON occupation_legacy_dpt (dpt_code);
CREATE INDEX IF NOT EXISTS idx_dpt_riasec  ON occupation_legacy_dpt (riasec_ca_code);

COMMENT ON TABLE occupation_legacy_dpt IS 'Données patrimoniales : codes DPT, intérêts RIASEC canadiens et exigences physiques issus du Manuel des professions (CNP 2016), rapatriés via la concordance 2016↔2021.';


-- ============================================================
-- SECTION 8 — MILIEUX / LIEUX DE TRAVAIL (OaSIS J / SIPeC)
--             Source : fichier "Milieux de travail" du SIPeC
--             Environnement physique ET social de la profession
-- ============================================================
CREATE TABLE IF NOT EXISTS oasis_work_environments (
    oasis_code              TEXT        PRIMARY KEY,  -- ex: 'J.01.a.01'

    -- Hiérarchie OaSIS (catégorie J = Contexte de travail)
    category_code           TEXT        NOT NULL DEFAULT 'J',
    subcategory_code        TEXT,       -- ex: 'J.01'
    subcategory_name_fr     TEXT,
    subcategory_name_en     TEXT,
    group_code              TEXT,       -- ex: 'J.01.a'
    group_name_fr           TEXT,
    group_name_en           TEXT,

    -- Type d'environnement
    environment_type        TEXT        NOT NULL DEFAULT 'physical',
    -- 'physical' : Environnement physique (bruit, chaleur, extérieur...)
    -- 'social'   : Environnement social (contact public, équipe, supervision...)
    -- 'hazard'   : Risques et dangers
    -- 'schedule' : Horaires et organisation du travail

    -- Contenu bilingue
    name_fr                 TEXT        NOT NULL,
    name_en                 TEXT,
    description_fr          TEXT,
    description_en          TEXT,

    -- Échelle de mesure associée (ex: fréquence, intensité)
    scale_type              TEXT,       -- 'frequency', 'intensity', 'proportion'

    version                 TEXT        NOT NULL DEFAULT '2025.0',
    is_active               BOOLEAN     DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wenv_cat    ON oasis_work_environments (category_code);
CREATE INDEX IF NOT EXISTS idx_wenv_subcat ON oasis_work_environments (subcategory_code);
CREATE INDEX IF NOT EXISTS idx_wenv_type   ON oasis_work_environments (environment_type);

COMMENT ON TABLE oasis_work_environments IS 'Milieux et lieux de travail OaSIS (catégorie J) — environnements physique et social. Alimenté depuis les fichiers SIPeC 2025.';


-- ============================================================
-- SECTION 9 — JUNCTION : OCCUPATION ↔ MILIEU DE TRAVAIL
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_work_environments (
    occupation_cnp_code     TEXT        NOT NULL REFERENCES occupations(cnp_code) ON DELETE CASCADE,
    oasis_code              TEXT        NOT NULL REFERENCES oasis_work_environments(oasis_code) ON DELETE CASCADE,

    -- Score / valeur officielle ESDC
    score                   NUMERIC(5, 3),  -- Valeur brute (ex: 4.250)
    scale_id                TEXT,           -- Identifiant de l'échelle (ex: 'FR', 'IM', 'LV')
    scale_label             TEXT,           -- Libellé humain (ex: 'Fréquence', 'Importance')
    level_label_fr          TEXT,           -- Libellé du niveau (ex: 'Souvent', 'Toujours')
    level_label_en          TEXT,

    source                  TEXT        NOT NULL DEFAULT 'SIPeC 2025',
    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (occupation_cnp_code, oasis_code, scale_id)
);

CREATE INDEX IF NOT EXISTS idx_wenv_junc_occ   ON occupation_work_environments (occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_wenv_junc_code  ON occupation_work_environments (oasis_code);
CREATE INDEX IF NOT EXISTS idx_wenv_junc_score ON occupation_work_environments (score DESC);

COMMENT ON TABLE occupation_work_environments IS 'Scores officiels des milieux de travail par profession (SIPeC 2025). FK vers oasis_work_environments.';


-- ============================================================
-- SECTION 10 — ÉCHELLES DE NIVEAUX OaSIS
--              Source : fichier "Correspondances" / Guide OaSIS
--              Mapping correct des niveaux pour TOUTES les catégories
-- ============================================================
CREATE TABLE IF NOT EXISTS oasis_scale_labels (
    id                      BIGSERIAL   PRIMARY KEY,

    -- Identifiant de l'échelle
    scale_id                TEXT        NOT NULL,   -- ex: 'IM','LV','FR','CO','EX'
    scale_name_fr           TEXT,                   -- 'Importance'
    scale_name_en           TEXT,                   -- 'Importance'

    -- Valeur numérique du niveau
    level_value             NUMERIC(5, 2) NOT NULL, -- ex: 1.00, 2.00, … 7.00

    -- Libellé bilingue du niveau
    level_label_fr          TEXT        NOT NULL,   -- 'Pas du tout important'
    level_label_en          TEXT,                   -- 'Not Important'

    -- Applicabilité : catégorie(s) OaSIS concernée(s)
    -- NULL = s'applique à toutes les catégories
    applicable_category     TEXT,   -- 'F','A','G','B','C','J','K' ou NULL

    -- Version du guide
    guide_version           TEXT    NOT NULL DEFAULT '2025 v4.0',

    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (scale_id, level_value, applicable_category)
);

CREATE INDEX IF NOT EXISTS idx_scale_id   ON oasis_scale_labels (scale_id);
CREATE INDEX IF NOT EXISTS idx_scale_cat  ON oasis_scale_labels (applicable_category);

COMMENT ON TABLE oasis_scale_labels IS 'Correspondances des échelles de niveaux OaSIS (Importance, Complexité, Fréquence, etc.) — issues du Guide OaSIS 2025 v4.0. Indispensable pour afficher des libellés corrects dans l''UI.';


-- ============================================================
-- SECTION 11 — TABLE DE LIAISON PRINCIPALE : occupation_oasis
--              Remplace / complète occupation_competencies
--              pour les données OaSIS-natives (non-O*NET)
--              Couvre : F(Compétences), A(Habiletés), B(Attributs),
--                       G(Connaissances), C(Intérêts), J(Contexte),
--                       K(Activités)
-- ============================================================
CREATE TABLE IF NOT EXISTS occupation_oasis (
    occupation_cnp_code     TEXT        NOT NULL REFERENCES occupations(cnp_code)      ON DELETE CASCADE,
    oasis_code              TEXT        NOT NULL REFERENCES oasis_descriptors(oasis_code) ON DELETE CASCADE,

    -- ---- Scores officiels ESDC ----
    -- Importance (IM) — obligatoire pour toutes les catégories
    importance_score        NUMERIC(5, 3),   -- 1.000 à 7.000
    importance_label_fr     TEXT,            -- ex: 'Extrêmement important'
    importance_label_en     TEXT,

    -- Niveau de complexité / proficiency (LV) — Compétences (F) et Habiletés (A)
    level_score             NUMERIC(5, 3),
    level_label_fr          TEXT,
    level_label_en          TEXT,

    -- Fréquence (FR) — Contexte de travail (J)
    frequency_score         NUMERIC(5, 3),
    frequency_label_fr      TEXT,
    frequency_label_en      TEXT,

    -- Étendue (EX) — Habiletés (A) ou Attributs (B)
    extent_score            NUMERIC(5, 3),
    extent_label_fr         TEXT,
    extent_label_en         TEXT,

    -- Confiance (applicable à certains descripteurs)
    confidence_score        NUMERIC(5, 3),

    -- ---- Métadonnées de pondération ----
    -- Indique si ce descripteur est dans les "Compétences principales"
    is_core_competency      BOOLEAN     DEFAULT FALSE,

    -- Rang / ordre pour l'affichage (calculé à l'ingestion)
    display_rank            SMALLINT,

    -- ---- Provenance ----
    source_file             TEXT,           -- nom du fichier CSV source
    source                  TEXT        NOT NULL DEFAULT 'SIPeC 2025',
    ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (occupation_cnp_code, oasis_code)
);

CREATE INDEX IF NOT EXISTS idx_occ_oasis_occ      ON occupation_oasis (occupation_cnp_code);
CREATE INDEX IF NOT EXISTS idx_occ_oasis_desc     ON occupation_oasis (oasis_code);
CREATE INDEX IF NOT EXISTS idx_occ_oasis_imp      ON occupation_oasis (importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_occ_oasis_level    ON occupation_oasis (level_score DESC);
CREATE INDEX IF NOT EXISTS idx_occ_oasis_core     ON occupation_oasis (is_core_competency);

COMMENT ON TABLE occupation_oasis IS 'Table de liaison principale OaSIS — scores officiels ESDC pour les 7 catégories (F,A,B,G,C,J,K). Chaque ligne est un profil de compétence OaSIS pour une profession SIPeC 2025.';


-- ============================================================
-- SECTION 12 — ENRICHISSEMENT DE oasis_descriptors
--              Colonnes manquantes pour la gestion des échelles
-- ============================================================
ALTER TABLE oasis_descriptors
    ADD COLUMN IF NOT EXISTS scale_ids          TEXT[],     -- Échelles applicables ['IM','LV']
    ADD COLUMN IF NOT EXISTS source_dataset     TEXT,       -- 'SIPeC 2025 v1.0'
    ADD COLUMN IF NOT EXISTS source_file        TEXT;       -- 'skills_oasis_2025_v1.1.csv'


-- ============================================================
-- SECTION 13 — RLS pour les nouvelles tables
-- ============================================================
ALTER TABLE cnp_hierarchy                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_job_titles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_exclusions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_requirements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cnp_concordance_2016_2021     ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_legacy_dpt         ENABLE ROW LEVEL SECURITY;
ALTER TABLE oasis_work_environments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_work_environments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE oasis_scale_labels            ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupation_oasis              ENABLE ROW LEVEL SECURITY;

-- Lecture publique (anon + authenticated)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'cnp_hierarchy',
        'occupation_job_titles',
        'occupation_exclusions',
        'occupation_requirements',
        'cnp_concordance_2016_2021',
        'occupation_legacy_dpt',
        'oasis_work_environments',
        'occupation_work_environments',
        'oasis_scale_labels',
        'occupation_oasis'
    ] LOOP
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "public_read_%s" ON %I FOR SELECT TO anon, authenticated USING (true)',
            t, t
        );
    END LOOP;
END $$;

-- Écriture service_role uniquement
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'cnp_hierarchy',
        'occupation_job_titles',
        'occupation_exclusions',
        'occupation_requirements',
        'cnp_concordance_2016_2021',
        'occupation_legacy_dpt',
        'oasis_work_environments',
        'occupation_work_environments',
        'oasis_scale_labels',
        'occupation_oasis'
    ] LOOP
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "service_write_%s" ON %I FOR ALL TO service_role USING (true)',
            t, t
        );
    END LOOP;
END $$;


-- ============================================================
-- SECTION 14 — VUE MATÉRIALISÉE : profil enrichi par profession
--              Accélère les requêtes API sur le profil complet
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_occupation_full_profile AS
SELECT
    o.cnp_code,
    o.title_fr,
    o.title_en,
    o.description_fr,
    o.description_en,
    o.teer_level,
    o.broad_category_code,
    o.broad_category_name_fr,
    o.major_group_code,
    o.major_group_name_fr,
    o.median_salary,
    o.riasec_dominant,

    -- Nombre d'appellations d'emploi
    (SELECT COUNT(*) FROM occupation_job_titles jt
     WHERE jt.occupation_cnp_code = o.cnp_code) AS job_titles_count,

    -- Est-ce une profession réglementée ?
    (SELECT bool_or(is_regulated) FROM occupation_requirements req
     WHERE req.occupation_cnp_code = o.cnp_code) AS is_regulated_profession,

    -- Nombre de compétences OaSIS mappées
    (SELECT COUNT(*) FROM occupation_oasis oa
     WHERE oa.occupation_cnp_code = o.cnp_code) AS oasis_descriptors_count,

    -- Top 3 compétences OaSIS par importance
    (SELECT json_agg(sub ORDER BY sub.importance_score DESC) FROM (
        SELECT ad.name_fr, oa2.importance_score, ad.category_code
        FROM occupation_oasis oa2
        JOIN oasis_descriptors ad ON ad.oasis_code = oa2.oasis_code
        WHERE oa2.occupation_cnp_code = o.cnp_code
        ORDER BY oa2.importance_score DESC NULLS LAST
        LIMIT 3
    ) sub) AS top_competencies,

    o.oasis_mapped,
    o.updated_at

FROM occupations o;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_occ_profile_pk ON mv_occupation_full_profile (cnp_code);
CREATE INDEX        IF NOT EXISTS idx_mv_occ_profile_teer ON mv_occupation_full_profile (teer_level);

COMMENT ON MATERIALIZED VIEW mv_occupation_full_profile IS 'Vue matérialisée du profil complet par profession. Rafraîchir avec : REFRESH MATERIALIZED VIEW CONCURRENTLY mv_occupation_full_profile;';


-- ============================================================
-- SECTION 15 — COMMENTAIRES FINAUX
-- ============================================================
COMMENT ON TABLE cnp_hierarchy              IS 'Hiérarchie CNP 2021 : grands groupes (1 chiffre) → groupes principaux (2) → sous-groupes (3) → groupes de base (5 chiffres / TEER).';
COMMENT ON TABLE occupation_job_titles      IS 'Appellations d'emploi (synonymes) par profession — moteur de recherche plein-texte FR/EN.';
COMMENT ON TABLE occupation_exclusions      IS 'Exclusions officielles CNP 2021 — désambiguïsation inter-professions similaires.';
COMMENT ON TABLE occupation_requirements    IS 'Exigences d'emploi : scolarité, certifications, permis, accès réglementé.';
COMMENT ON TABLE cnp_concordance_2016_2021  IS 'Concordance officielle CNP 2016 ↔ 2021 (pont legacy).';
COMMENT ON TABLE occupation_legacy_dpt      IS 'Données patrimoniales : codes DPT, RIASEC canadiens, exigences physiques (CNP 2016).';
COMMENT ON TABLE oasis_work_environments    IS 'Milieux/lieux de travail OaSIS (catégorie J, physique + social).';
COMMENT ON TABLE occupation_work_environments IS 'Scores des milieux de travail par profession (SIPeC 2025).';
COMMENT ON TABLE oasis_scale_labels         IS 'Correspondances des échelles de niveaux OaSIS (Guide 2025 v4.0) — libellés FR/EN corrects.';
COMMENT ON TABLE occupation_oasis           IS 'Liaison principale occupation ↔ descripteurs OaSIS avec scores complets (IM, LV, FR, EX).';

-- ============================================================
-- FIN DU SCRIPT
-- schema_v2.sql — TRAJEKTIA — 2026-04-14
-- ============================================================
