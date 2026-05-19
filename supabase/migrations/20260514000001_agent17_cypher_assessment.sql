-- Agent 17: Assessment + Cypher integration.
--
-- Reconciled against the actual simplify-is schema (see introspection in
-- scripts/agent17_assessment_cypher_introspection.sql):
--   * Existing assessment_sessions, assessment_questions, assessment_answers
--     stay authoritative. Subdomain is derived from control_id prefix
--     (e.g. 'GV.OC' from 'GV.OC-01') — there is no subdomain FK table.
--   * framework_id / domain_id / subdomain_key are VARCHAR identifiers, not
--     UUID foreign keys, matching the rest of the codebase.
--   * Existing domain_scores / framework_scores are kept for time-series
--     history; new maturity_scores tables hold current state with UNIQUE
--     keys for clean UPSERT.
--
-- Spec: agents/ AGENT_17_ASSESSMENT_CYPHER_INTEGRATION.md §1

-- ─────────────────────────────────────────────
-- 1. assessment_sessions — additive columns
-- ─────────────────────────────────────────────
ALTER TABLE public.assessment_sessions
  ADD COLUMN IF NOT EXISTS current_subdomain_key VARCHAR(50),
  ADD COLUMN IF NOT EXISTS auto_save_indicator JSONB DEFAULT '{}'::jsonb;

-- ─────────────────────────────────────────────
-- 2. assessment_answers — source tracking + numeric maturity
-- ─────────────────────────────────────────────
ALTER TABLE public.assessment_answers
  ADD COLUMN IF NOT EXISTS source VARCHAR(20)
    CHECK (source IN ('form', 'cypher')) DEFAULT 'form',
  ADD COLUMN IF NOT EXISTS cypher_extracted_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS maturity_value SMALLINT
    CHECK (maturity_value BETWEEN 1 AND 4);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_session
  ON public.assessment_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_source
  ON public.assessment_answers(source);

-- ─────────────────────────────────────────────
-- 3. subdomain_maturity_scores
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subdomain_maturity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  domain_id VARCHAR(50) NOT NULL,
  subdomain_key VARCHAR(50) NOT NULL,
  maturity_score DECIMAL(3,2),
  control_count INTEGER NOT NULL DEFAULT 0,
  answered_count INTEGER NOT NULL DEFAULT 0,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT subdomain_maturity_scores_uq UNIQUE (organization_id, framework_id, subdomain_key)
);

CREATE INDEX IF NOT EXISTS idx_subdomain_maturity_org
  ON public.subdomain_maturity_scores(organization_id, framework_id);
CREATE INDEX IF NOT EXISTS idx_subdomain_maturity_domain
  ON public.subdomain_maturity_scores(organization_id, framework_id, domain_id);

DROP TRIGGER IF EXISTS trg_subdomain_maturity_updated_at ON public.subdomain_maturity_scores;
CREATE TRIGGER trg_subdomain_maturity_updated_at
BEFORE UPDATE ON public.subdomain_maturity_scores
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.subdomain_maturity_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read subdomain scores" ON public.subdomain_maturity_scores;
CREATE POLICY "Org members read subdomain scores"
  ON public.subdomain_maturity_scores
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 4. domain_maturity_scores (current state, UNIQUE-keyed)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.domain_maturity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  domain_id VARCHAR(50) NOT NULL,
  maturity_score DECIMAL(3,2),
  control_count INTEGER NOT NULL DEFAULT 0,
  answered_count INTEGER NOT NULL DEFAULT 0,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT domain_maturity_scores_uq UNIQUE (organization_id, framework_id, domain_id)
);

CREATE INDEX IF NOT EXISTS idx_domain_maturity_org
  ON public.domain_maturity_scores(organization_id, framework_id);

DROP TRIGGER IF EXISTS trg_domain_maturity_updated_at ON public.domain_maturity_scores;
CREATE TRIGGER trg_domain_maturity_updated_at
BEFORE UPDATE ON public.domain_maturity_scores
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.domain_maturity_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read domain scores" ON public.domain_maturity_scores;
CREATE POLICY "Org members read domain scores"
  ON public.domain_maturity_scores
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 5. organization_maturity_scores
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_maturity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  maturity_score DECIMAL(3,2),
  total_controls INTEGER NOT NULL DEFAULT 0,
  answered_controls INTEGER NOT NULL DEFAULT 0,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT organization_maturity_scores_uq UNIQUE (organization_id, framework_id)
);

CREATE INDEX IF NOT EXISTS idx_organization_maturity_org
  ON public.organization_maturity_scores(organization_id);

DROP TRIGGER IF EXISTS trg_organization_maturity_updated_at ON public.organization_maturity_scores;
CREATE TRIGGER trg_organization_maturity_updated_at
BEFORE UPDATE ON public.organization_maturity_scores
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.organization_maturity_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read org scores" ON public.organization_maturity_scores;
CREATE POLICY "Org members read org scores"
  ON public.organization_maturity_scores
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 6. cypher_assessment_transcripts (user-private; admins must NOT read)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cypher_assessment_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  domain_id VARCHAR(50) NOT NULL,
  subdomain_key VARCHAR(50) NOT NULL,
  user_message TEXT,
  cypher_response TEXT,
  extracted_answers JSONB DEFAULT '[]'::jsonb,
  validated BOOLEAN NOT NULL DEFAULT FALSE,
  validation_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cypher_transcripts_session
  ON public.cypher_assessment_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_cypher_transcripts_subdomain
  ON public.cypher_assessment_transcripts(subdomain_key);
CREATE INDEX IF NOT EXISTS idx_cypher_transcripts_user
  ON public.cypher_assessment_transcripts(user_id);

ALTER TABLE public.cypher_assessment_transcripts ENABLE ROW LEVEL SECURITY;

-- Per spec §1: only the owning user can read; org admins must NOT see chat.
DROP POLICY IF EXISTS "Cypher transcripts user-only read" ON public.cypher_assessment_transcripts;
CREATE POLICY "Cypher transcripts user-only read"
  ON public.cypher_assessment_transcripts
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Cypher transcripts user-only insert" ON public.cypher_assessment_transcripts;
CREATE POLICY "Cypher transcripts user-only insert"
  ON public.cypher_assessment_transcripts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
