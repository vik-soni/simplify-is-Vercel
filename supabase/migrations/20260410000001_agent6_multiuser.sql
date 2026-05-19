-- Agent 6: Multi-User Account Management
-- Extends existing users table and adds collaboration tables

-- ─────────────────────────────────────────────
-- 1. Extend users table for multi-user org membership
-- ─────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'assessor', 'viewer')),
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Backfill: existing users (org owners) get linked to their org as admin
UPDATE users u
SET
  org_id = o.id,
  role = 'admin',
  status = 'active'
FROM organizations o
WHERE o.owner_user_id = u.id
  AND u.org_id IS NULL;

-- Index for org membership lookups
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_users_org_id_status ON users(org_id, status);

-- ─────────────────────────────────────────────
-- 2. domain_assignments table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_assignments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  framework     VARCHAR(20) NOT NULL CHECK (framework IN ('iso27001', 'nist_csf')),
  domain_id     VARCHAR(50) NOT NULL,  -- e.g. 'A.5', 'A.6', 'ID.AM'
  assigned_by   UUID NOT NULL REFERENCES users(id),
  assigned_at   TIMESTAMPTZ DEFAULT NOW(),
  due_date      DATE,
  status        VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (org_id, user_id, framework, domain_id)
);

CREATE INDEX IF NOT EXISTS idx_domain_assignments_org_id ON domain_assignments(org_id);
CREATE INDEX IF NOT EXISTS idx_domain_assignments_user_id ON domain_assignments(user_id);

DROP TRIGGER IF EXISTS trg_domain_assignments_updated_at ON domain_assignments;
CREATE TRIGGER trg_domain_assignments_updated_at
BEFORE UPDATE ON domain_assignments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- 3. team_responses table (multi-user control answers)
-- Separate from session-based control_responses which stores Cypher chat answers
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  framework       VARCHAR(20) NOT NULL CHECK (framework IN ('iso27001', 'nist_csf')),
  control_id      VARCHAR(100) NOT NULL,   -- e.g. 'A.5.1', 'ID.AM-1'
  user_id         UUID NOT NULL REFERENCES users(id),
  response_text   TEXT NOT NULL,
  evidence_types  JSONB DEFAULT '[]'::jsonb,
  version         INTEGER DEFAULT 1,
  is_final        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_responses_org_id ON team_responses(org_id);
CREATE INDEX IF NOT EXISTS idx_team_responses_control ON team_responses(org_id, framework, control_id);
CREATE INDEX IF NOT EXISTS idx_team_responses_user_id ON team_responses(user_id);

DROP TRIGGER IF EXISTS trg_team_responses_updated_at ON team_responses;
CREATE TRIGGER trg_team_responses_updated_at
BEFORE UPDATE ON team_responses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- 4. final_answers table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS final_answers (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  framework            VARCHAR(20) NOT NULL CHECK (framework IN ('iso27001', 'nist_csf')),
  control_id           VARCHAR(100) NOT NULL,
  selected_response_id UUID REFERENCES team_responses(id) ON DELETE SET NULL,
  custom_answer        TEXT,              -- admin typed their own
  edited_text          TEXT,             -- modified version of selected_response
  admin_id             UUID NOT NULL REFERENCES users(id),
  admin_note           TEXT,
  finalized_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (org_id, framework, control_id)
);

CREATE INDEX IF NOT EXISTS idx_final_answers_org_id ON final_answers(org_id);
CREATE INDEX IF NOT EXISTS idx_final_answers_control ON final_answers(org_id, framework, control_id);

DROP TRIGGER IF EXISTS trg_final_answers_updated_at ON final_answers;
CREATE TRIGGER trg_final_answers_updated_at
BEFORE UPDATE ON final_answers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────
-- 5. org_audit_trail table
-- Granular action log for multi-user collaboration (distinct from generic audit_log)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS org_audit_trail (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  framework       VARCHAR(20) CHECK (framework IN ('iso27001', 'nist_csf')),
  control_id      VARCHAR(100),
  action          VARCHAR(50) NOT NULL CHECK (action IN (
    'answer_submitted', 'answer_edited',
    'final_selected', 'final_edited', 'final_custom',
    'user_invited', 'user_role_changed', 'user_deactivated',
    'domain_assigned', 'domain_unassigned'
  )),
  performed_by    UUID NOT NULL REFERENCES users(id),
  response_id     UUID REFERENCES team_responses(id) ON DELETE SET NULL,
  final_answer_id UUID REFERENCES final_answers(id) ON DELETE SET NULL,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_audit_trail_org_id ON org_audit_trail(org_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_trail_control ON org_audit_trail(org_id, framework, control_id);
CREATE INDEX IF NOT EXISTS idx_org_audit_trail_performed_by ON org_audit_trail(performed_by);
CREATE INDEX IF NOT EXISTS idx_org_audit_trail_created_at ON org_audit_trail(created_at);

-- ─────────────────────────────────────────────
-- 6. Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE domain_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_audit_trail ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is a member of an org
CREATE OR REPLACE FUNCTION is_org_member(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND org_id = p_org_id
      AND status = 'active'
  )
  OR EXISTS (
    SELECT 1 FROM organizations
    WHERE id = p_org_id
      AND owner_user_id = auth.uid()
  );
$$;

-- Helper function: check if current user is an admin of an org
CREATE OR REPLACE FUNCTION is_org_admin(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND org_id = p_org_id
      AND role = 'admin'
      AND status = 'active'
  )
  OR EXISTS (
    SELECT 1 FROM organizations
    WHERE id = p_org_id
      AND owner_user_id = auth.uid()
  );
$$;

-- domain_assignments: all org members can view, only admins via API (RLS allows members)
CREATE POLICY "Org members access domain assignments" ON domain_assignments
  FOR ALL USING (is_org_member(org_id));

-- team_responses: org members can view
CREATE POLICY "Org members access team responses" ON team_responses
  FOR ALL USING (is_org_member(org_id));

-- final_answers: all org members can view
CREATE POLICY "Org members view final answers" ON final_answers
  FOR SELECT USING (is_org_member(org_id));

-- final_answers: only admins can write
CREATE POLICY "Org admins write final answers" ON final_answers
  FOR INSERT WITH CHECK (is_org_admin(org_id));

CREATE POLICY "Org admins update final answers" ON final_answers
  FOR UPDATE USING (is_org_admin(org_id));

-- audit trail: only admins can view
CREATE POLICY "Org admins view audit trail" ON org_audit_trail
  FOR SELECT USING (is_org_admin(org_id));

-- audit trail: service role inserts (API writes via admin client, no RLS needed for INSERT)
CREATE POLICY "Service role insert audit trail" ON org_audit_trail
  FOR INSERT WITH CHECK (is_org_member(org_id));

-- Update users RLS: org members can view other members in same org
DROP POLICY IF EXISTS "Users access own user row" ON users;
CREATE POLICY "Users access own row or org members" ON users
  FOR SELECT USING (
    id = auth.uid()
    OR (
      org_id IS NOT NULL
      AND org_id IN (
        SELECT org_id FROM users WHERE id = auth.uid() AND org_id IS NOT NULL
      )
    )
  );

-- Users can only update their own row
CREATE POLICY "Users update own row" ON users
  FOR UPDATE USING (id = auth.uid());

-- Users can only insert their own row (handled by trigger)
CREATE POLICY "Users insert own row" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Update org RLS: org members can view their org
DROP POLICY IF EXISTS "Users access own org data" ON organizations;
CREATE POLICY "Org members access org data" ON organizations
  FOR SELECT USING (
    owner_user_id = auth.uid()
    OR id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND org_id IS NOT NULL AND status = 'active'
    )
  );

CREATE POLICY "Org owner updates org" ON organizations
  FOR UPDATE USING (owner_user_id = auth.uid());

CREATE POLICY "Org owner deletes org" ON organizations
  FOR DELETE USING (owner_user_id = auth.uid());

-- Update existing table policies to allow all org members (not just owner)
DROP POLICY IF EXISTS "Users access own org sessions" ON assessment_sessions;
CREATE POLICY "Org members access sessions" ON assessment_sessions
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org control responses" ON control_responses;
CREATE POLICY "Org members access control responses" ON control_responses
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org extracted signals" ON extracted_signals;
CREATE POLICY "Org members access extracted signals" ON extracted_signals
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org domain scores" ON domain_scores;
CREATE POLICY "Org members access domain scores" ON domain_scores
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org framework scores" ON framework_scores;
CREATE POLICY "Org members access framework scores" ON framework_scores
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org transcripts" ON chat_transcripts;
CREATE POLICY "Org members access transcripts" ON chat_transcripts
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org compliance records" ON compliance_tracker;
CREATE POLICY "Org members access compliance records" ON compliance_tracker
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org risks" ON organization_risks;
CREATE POLICY "Org members access org risks" ON organization_risks
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org api usage" ON claude_api_usage;
CREATE POLICY "Org members access api usage" ON claude_api_usage
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users access own org session metadata" ON session_metadata_log;
CREATE POLICY "Org members access session metadata" ON session_metadata_log
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
    OR organization_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND status = 'active'
    )
  );
