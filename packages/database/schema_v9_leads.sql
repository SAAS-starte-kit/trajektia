-- ============================================================================
-- TRAJEKTIA CKG — SCHÉMA V9 : LEAD CAPTURE (NEWSLETTER)
-- ============================================================================
-- Projet      : Trajektia CKG (Career Knowledge Graph)
-- Description : Stockage des courriels capturés sur les fiches métiers.
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads_newsletter (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    cnp_code    VARCHAR(10) REFERENCES occupations(cnp_code) ON DELETE SET NULL,
    source_url  TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, cnp_code)
);

CREATE INDEX IF NOT EXISTS idx_leads_newsletter_email ON leads_newsletter(email);
CREATE INDEX IF NOT EXISTS idx_leads_newsletter_cnp ON leads_newsletter(cnp_code);

-- Activation de RLS pour sécuriser la table (optionnel selon le besoin, par défaut on autorise l'insertion anonyme)
ALTER TABLE leads_newsletter ENABLE ROW LEVEL SECURITY;

-- Politique pour autoriser l'insertion depuis l'API anon
CREATE POLICY "Allow anonymous inserts" ON leads_newsletter
FOR INSERT
WITH CHECK (true);

-- Politique pour autoriser la lecture uniquement par les rôles authentifiés (service_role ou admin)
CREATE POLICY "Allow authenticated read" ON leads_newsletter
FOR SELECT
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
