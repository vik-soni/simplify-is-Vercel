-- Agent 15: Threat Readiness + Tech Stack Discovery
-- Adds five tables to support:
--   1. Tech Stack Profile per organisation (organization_tech_stack)
--   2. Per-org admin customisations of generated threats (organization_threats)
--   3. 24h cache of generated Threat Readiness payload (threat_readiness_cache)
--   4. Cypher-led tech stack discovery sessions (tech_stack_discovery_sessions)
--   5. Discovery transcript messages (tech_stack_discovery_messages)
--
-- All RLS uses the existing is_org_member() / is_org_admin() helpers from
-- migration 20260410000001_agent6_multiuser.sql. updated_at triggers reuse
-- set_updated_at() from 20250320000001_simplify_schema.sql.

BEGIN;

-- ─────────────────────────────────────────────
-- 1. Tech Stack Discovery Sessions (multi-turn Cypher conversations)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tech_stack_discovery_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'recap_pending', 'finalized', 'abandoned')),
  turn_count INTEGER NOT NULL DEFAULT 0,
  recap_ready BOOLEAN NOT NULL DEFAULT false,
  finalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tsds_organization_id
  ON public.tech_stack_discovery_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_tsds_user_id
  ON public.tech_stack_discovery_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tsds_status
  ON public.tech_stack_discovery_sessions(status);

DROP TRIGGER IF EXISTS trg_tsds_updated_at ON public.tech_stack_discovery_sessions;
CREATE TRIGGER trg_tsds_updated_at
BEFORE UPDATE ON public.tech_stack_discovery_sessions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.tech_stack_discovery_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members access tech stack discovery sessions"
  ON public.tech_stack_discovery_sessions;
CREATE POLICY "Org members access tech stack discovery sessions"
  ON public.tech_stack_discovery_sessions
  FOR ALL
  USING (is_org_member(organization_id));

-- ─────────────────────────────────────────────
-- 2. Tech Stack Discovery Messages
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tech_stack_discovery_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.tech_stack_discovery_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tsdm_session_id
  ON public.tech_stack_discovery_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_tsdm_created_at
  ON public.tech_stack_discovery_messages(session_id, created_at);

ALTER TABLE public.tech_stack_discovery_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members access tech stack discovery messages"
  ON public.tech_stack_discovery_messages;
CREATE POLICY "Org members access tech stack discovery messages"
  ON public.tech_stack_discovery_messages
  FOR ALL
  USING (
    session_id IN (
      SELECT id FROM public.tech_stack_discovery_sessions
      WHERE is_org_member(organization_id)
    )
  );

-- ─────────────────────────────────────────────
-- 3. Organization Tech Stack Profile
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Group 1: Infrastructure
  cloud_providers JSONB NOT NULL DEFAULT '[]'::jsonb,
  databases JSONB NOT NULL DEFAULT '[]'::jsonb,
  data_storage JSONB NOT NULL DEFAULT '[]'::jsonb,
  backup_strategy TEXT NOT NULL DEFAULT '',

  -- Group 2: Integrations & Dependencies
  critical_third_party JSONB NOT NULL DEFAULT '[]'::jsonb,
  identity_system TEXT NOT NULL DEFAULT '',

  -- Group 3: Exposure & Data
  public_apis BOOLEAN NOT NULL DEFAULT false,
  public_apis_notes TEXT NOT NULL DEFAULT '',
  data_types JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Metadata
  discovery_transcript_id UUID REFERENCES public.tech_stack_discovery_sessions(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL CHECK (source IN ('cypher_discovery', 'manual_edit')),
  last_validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_org_tech_stack_org
  ON public.organization_tech_stack(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_tech_stack_source
  ON public.organization_tech_stack(source);

DROP TRIGGER IF EXISTS trg_org_tech_stack_updated_at ON public.organization_tech_stack;
CREATE TRIGGER trg_org_tech_stack_updated_at
BEFORE UPDATE ON public.organization_tech_stack
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.organization_tech_stack ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read tech stack" ON public.organization_tech_stack;
CREATE POLICY "Org members read tech stack"
  ON public.organization_tech_stack
  FOR SELECT
  USING (is_org_member(organization_id));

DROP POLICY IF EXISTS "Org admins write tech stack" ON public.organization_tech_stack;
CREATE POLICY "Org admins write tech stack"
  ON public.organization_tech_stack
  FOR INSERT
  WITH CHECK (is_org_admin(organization_id));

DROP POLICY IF EXISTS "Org admins update tech stack" ON public.organization_tech_stack;
CREATE POLICY "Org admins update tech stack"
  ON public.organization_tech_stack
  FOR UPDATE
  USING (is_org_admin(organization_id));

DROP POLICY IF EXISTS "Org admins delete tech stack" ON public.organization_tech_stack;
CREATE POLICY "Org admins delete tech stack"
  ON public.organization_tech_stack
  FOR DELETE
  USING (is_org_admin(organization_id));

-- ─────────────────────────────────────────────
-- 4. Organization Threats (admin customisations)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  threat_key TEXT NOT NULL,
  custom_headline TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  applicability TEXT NOT NULL DEFAULT 'applies'
    CHECK (applicability IN ('applies', 'does_not_apply', 'filtered_out')),
  edited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, threat_key)
);

CREATE INDEX IF NOT EXISTS idx_org_threats_organization_id
  ON public.organization_threats(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_threats_display_order
  ON public.organization_threats(organization_id, display_order);

DROP TRIGGER IF EXISTS trg_org_threats_updated_at ON public.organization_threats;
CREATE TRIGGER trg_org_threats_updated_at
BEFORE UPDATE ON public.organization_threats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.organization_threats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read org threats" ON public.organization_threats;
CREATE POLICY "Org members read org threats"
  ON public.organization_threats
  FOR SELECT
  USING (is_org_member(organization_id));

DROP POLICY IF EXISTS "Org admins write org threats" ON public.organization_threats;
CREATE POLICY "Org admins write org threats"
  ON public.organization_threats
  FOR INSERT
  WITH CHECK (is_org_admin(organization_id));

DROP POLICY IF EXISTS "Org admins update org threats" ON public.organization_threats;
CREATE POLICY "Org admins update org threats"
  ON public.organization_threats
  FOR UPDATE
  USING (is_org_admin(organization_id));

DROP POLICY IF EXISTS "Org admins delete org threats" ON public.organization_threats;
CREATE POLICY "Org admins delete org threats"
  ON public.organization_threats
  FOR DELETE
  USING (is_org_admin(organization_id));

-- ─────────────────────────────────────────────
-- 5. Threat Readiness Cache (24h, service-role-only writes)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.threat_readiness_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  generation_inputs_hash TEXT NOT NULL,
  UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_threat_cache_org
  ON public.threat_readiness_cache(organization_id);
CREATE INDEX IF NOT EXISTS idx_threat_cache_expires_at
  ON public.threat_readiness_cache(expires_at);

ALTER TABLE public.threat_readiness_cache ENABLE ROW LEVEL SECURITY;

-- Read: org members can read their own cache row.
DROP POLICY IF EXISTS "Org members read threat cache" ON public.threat_readiness_cache;
CREATE POLICY "Org members read threat cache"
  ON public.threat_readiness_cache
  FOR SELECT
  USING (is_org_member(organization_id));

-- No INSERT/UPDATE/DELETE policies — writes happen only via service role
-- (createAdminSupabaseClient bypasses RLS by design).

COMMIT;
