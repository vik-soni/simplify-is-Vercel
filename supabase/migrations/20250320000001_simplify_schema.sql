-- Simplify IS schema migration
-- NOTE: Existing tables are not recreated:
-- ft_iso_controls, ft_nist_controls, control_mappings, domains, top_risks, controls

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  agent_name VARCHAR(100) DEFAULT 'Cypher',
  subscription_tier VARCHAR(50) DEFAULT 'mvp_monthly',
  subscription_status VARCHAR(50) DEFAULT 'active',
  claude_api_calls_this_month INTEGER DEFAULT 0,
  claude_api_calls_reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  timezone VARCHAR(100) DEFAULT 'Australia/Sydney',
  notification_preferences JSONB DEFAULT '{"reassessment_email": true, "system_recovery_email": true}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb
);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  size VARCHAR(50),
  country VARCHAR(100) DEFAULT 'Australia',
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  frameworks_active TEXT[] DEFAULT ARRAY['ISO27001', 'NIST_CSF'],
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  framework_id VARCHAR(50) NOT NULL,
  session_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  phase VARCHAR(50) DEFAULT 'discovery',
  domain_ref_id VARCHAR(100),
  current_question_index INTEGER DEFAULT 0,
  scope_confirmed BOOLEAN DEFAULT FALSE,
  scope_data JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  session_timeout_minutes INTEGER DEFAULT 15,
  session_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS control_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  control_id VARCHAR(100) NOT NULL,
  domain_ref_id VARCHAR(100),
  domain_id VARCHAR(100) NOT NULL,
  framework_id VARCHAR(50) NOT NULL,
  user_response TEXT NOT NULL,
  answer_type VARCHAR(50) DEFAULT 'baseline',
  maturity_score DECIMAL(3,1),
  confidence_level VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'answered',
  na_justification TEXT,
  requirements_met BOOLEAN DEFAULT FALSE,
  user_validated BOOLEAN DEFAULT FALSE,
  clarification_rounds INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  previous_response_id UUID REFERENCES control_responses(id),
  revision_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS extracted_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id),
  organization_id UUID REFERENCES organizations(id),
  response_id UUID REFERENCES control_responses(id),
  conversation_snippet TEXT,
  signal_description TEXT NOT NULL,
  mapped_control_ids TEXT[] NOT NULL,
  frameworks_affected TEXT[] NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  user_validation_status VARCHAR(50) DEFAULT 'pending',
  confidence_score DECIMAL(3,2) DEFAULT 0.50,
  date_mentioned TIMESTAMPTZ,
  date_of_implementation TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  session_id UUID REFERENCES assessment_sessions(id),
  framework_id VARCHAR(50) NOT NULL,
  domain_id VARCHAR(100) NOT NULL,
  domain_name VARCHAR(255) NOT NULL,
  maturity_score DECIMAL(4,2) NOT NULL,
  previous_score DECIMAL(4,2),
  score_delta DECIMAL(4,2),
  change_reason TEXT,
  contributing_controls TEXT[],
  scored_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS framework_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  session_id UUID REFERENCES assessment_sessions(id),
  framework_id VARCHAR(50) NOT NULL,
  overall_maturity_score DECIMAL(4,2),
  previous_score DECIMAL(4,2),
  score_delta DECIMAL(4,2),
  domains_completed INTEGER DEFAULT 0,
  domains_total INTEGER,
  scored_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) DEFAULT 'conversation',
  extracted_signal_ids UUID[],
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS compliance_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  control_id VARCHAR(100) NOT NULL,
  framework_id VARCHAR(50) NOT NULL,
  review_frequency_days INTEGER,
  review_due_date TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  last_reviewed_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'current',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_metadata_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id VARCHAR(100) NOT NULL,
  control_id VARCHAR(100) NOT NULL,
  framework_id VARCHAR(50) NOT NULL,
  relevance_score DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  risk_id VARCHAR(100) NOT NULL,
  custom_risk_name VARCHAR(255),
  custom_risk_description TEXT,
  custom_control_ids TEXT[],
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claude_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  session_id UUID REFERENCES assessment_sessions(id),
  call_type VARCHAR(100),
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL(8,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action VARCHAR(10) NOT NULL,
  user_id UUID,
  org_id UUID,
  changed_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_owner_user_id ON organizations(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_organization_id ON assessment_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_domain_ref_id ON assessment_sessions(domain_ref_id);
CREATE INDEX IF NOT EXISTS idx_control_responses_session_id ON control_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_control_responses_organization_id ON control_responses(organization_id);
CREATE INDEX IF NOT EXISTS idx_control_responses_user_id ON control_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_control_responses_domain_ref_id ON control_responses(domain_ref_id);
CREATE INDEX IF NOT EXISTS idx_extracted_signals_session_id ON extracted_signals(session_id);
CREATE INDEX IF NOT EXISTS idx_extracted_signals_organization_id ON extracted_signals(organization_id);
CREATE INDEX IF NOT EXISTS idx_domain_scores_organization_id ON domain_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_framework_scores_organization_id ON framework_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_transcripts_session_id ON chat_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_transcripts_organization_id ON chat_transcripts(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_tracker_organization_id ON compliance_tracker(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_risks_organization_id ON organization_risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_claude_api_usage_user_id ON claude_api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_claude_api_usage_organization_id ON claude_api_usage(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_org_id ON audit_log(org_id);
CREATE INDEX IF NOT EXISTS idx_session_metadata_log_organization_id ON session_metadata_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_session_metadata_log_session_id ON session_metadata_log(session_id);
CREATE INDEX IF NOT EXISTS idx_risk_control_mappings_risk_id ON risk_control_mappings(risk_id);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON organizations;
CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_assessment_sessions_updated_at ON assessment_sessions;
CREATE TRIGGER trg_assessment_sessions_updated_at
BEFORE UPDATE ON assessment_sessions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_control_responses_updated_at ON control_responses;
CREATE TRIGGER trg_control_responses_updated_at
BEFORE UPDATE ON control_responses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_extracted_signals_updated_at ON extracted_signals;
CREATE TRIGGER trg_extracted_signals_updated_at
BEFORE UPDATE ON extracted_signals
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_compliance_tracker_updated_at ON compliance_tracker;
CREATE TRIGGER trg_compliance_tracker_updated_at
BEFORE UPDATE ON compliance_tracker
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metadata_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own user row" ON users
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Users access own org data" ON organizations
  FOR ALL USING (owner_user_id = auth.uid());

CREATE POLICY "Users access own org sessions" ON assessment_sessions
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org control responses" ON control_responses
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org extracted signals" ON extracted_signals
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org domain scores" ON domain_scores
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org framework scores" ON framework_scores
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org transcripts" ON chat_transcripts
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org compliance records" ON compliance_tracker
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org risks" ON organization_risks
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org api usage" ON claude_api_usage
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org session metadata" ON session_metadata_log
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Users access own org audit logs" ON audit_log
  FOR SELECT USING (
    org_id IN (
      SELECT id FROM organizations WHERE owner_user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_record_id UUID;
  target_org_id UUID;
  target_user_id UUID;
  payload JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_record_id := OLD.id;
    target_org_id := COALESCE(OLD.organization_id, OLD.org_id);
    target_user_id := OLD.user_id;
    payload := to_jsonb(OLD);
  ELSE
    target_record_id := NEW.id;
    target_org_id := COALESCE(NEW.organization_id, NEW.org_id);
    target_user_id := NEW.user_id;
    payload := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_log (table_name, record_id, action, user_id, org_id, changed_data)
  VALUES (TG_TABLE_NAME, target_record_id, TG_OP, target_user_id, target_org_id, payload);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_organizations ON organizations;
CREATE TRIGGER audit_organizations
AFTER INSERT OR UPDATE OR DELETE ON organizations
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_assessment_sessions ON assessment_sessions;
CREATE TRIGGER audit_assessment_sessions
AFTER INSERT OR UPDATE OR DELETE ON assessment_sessions
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_control_responses ON control_responses;
CREATE TRIGGER audit_control_responses
AFTER INSERT OR UPDATE OR DELETE ON control_responses
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_extracted_signals ON extracted_signals;
CREATE TRIGGER audit_extracted_signals
AFTER INSERT OR UPDATE OR DELETE ON extracted_signals
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_domain_scores ON domain_scores;
CREATE TRIGGER audit_domain_scores
AFTER INSERT OR UPDATE OR DELETE ON domain_scores
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_framework_scores ON framework_scores;
CREATE TRIGGER audit_framework_scores
AFTER INSERT OR UPDATE OR DELETE ON framework_scores
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_chat_transcripts ON chat_transcripts;
CREATE TRIGGER audit_chat_transcripts
AFTER INSERT OR UPDATE OR DELETE ON chat_transcripts
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_compliance_tracker ON compliance_tracker;
CREATE TRIGGER audit_compliance_tracker
AFTER INSERT OR UPDATE OR DELETE ON compliance_tracker
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_organization_risks ON organization_risks;
CREATE TRIGGER audit_organization_risks
AFTER INSERT OR UPDATE OR DELETE ON organization_risks
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

DROP TRIGGER IF EXISTS audit_claude_api_usage ON claude_api_usage;
CREATE TRIGGER audit_claude_api_usage
AFTER INSERT OR UPDATE OR DELETE ON claude_api_usage
FOR EACH ROW EXECUTE FUNCTION write_audit_log();

