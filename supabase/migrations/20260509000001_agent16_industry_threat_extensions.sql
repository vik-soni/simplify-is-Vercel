-- Agent 16: Industry multipliers, mappings, threat refresh audit, clarifications,
-- optional control mapping rows, and organization_threats scoring columns.
-- Aligns with AGENT_16_THREAT_READINESS_TECHSTACK_DISCOVERY.md §3–4.

BEGIN;

-- ─────────────────────────────────────────────
-- 1. Industry tech multipliers (reference data)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.industry_tech_multipliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_name TEXT NOT NULL UNIQUE,
  hosting_single_cloud DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  hosting_multi_cloud DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  hosting_on_premise DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  database_managed DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  database_self_managed DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  api_public_facing DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  api_internal_only DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  backup_automated DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  backup_manual DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  monitoring_comprehensive DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  monitoring_basic DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  base_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  description TEXT,
  data_sensitivity_level TEXT,
  regulatory_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_industry_multipliers_name
  ON public.industry_tech_multipliers(industry_name);

ALTER TABLE public.industry_tech_multipliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read industry multipliers" ON public.industry_tech_multipliers;
CREATE POLICY "Authenticated read industry multipliers"
  ON public.industry_tech_multipliers
  FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO public.industry_tech_multipliers (
  industry_name,
  hosting_single_cloud, hosting_multi_cloud, hosting_on_premise,
  database_managed, database_self_managed,
  api_public_facing, api_internal_only,
  backup_automated, backup_manual,
  monitoring_comprehensive, monitoring_basic,
  base_multiplier,
  description, data_sensitivity_level, regulatory_context
) VALUES
('Financial Services (Banking, Insurance, Superannuation)', 1.30, 1.15, 1.40, 1.20, 1.50, 1.60, 1.10, 1.20, 1.70, 1.30, 1.40, 1.40, 'High-value targets; strict audit expectations', 'Critical', 'PCI-DSS, SOX, GLBA'),
('Healthcare', 1.40, 1.20, 1.35, 1.25, 1.35, 1.50, 1.10, 1.25, 1.80, 1.25, 1.60, 1.50, 'Patient data and availability sensitivity', 'Critical', 'HIPAA, HITECH'),
('Technology / Software', 1.20, 1.10, 1.25, 1.15, 1.30, 1.40, 1.05, 1.15, 1.30, 1.15, 1.25, 1.35, 1.00, 'SaaS / product engineering footprint', 'Medium-High', 'GDPR, CCPA'),
('SaaS / Professional Services', 1.10, 1.05, 1.20, 1.10, 1.25, 1.35, 1.05, 1.10, 1.25, 1.15, 1.20, 1.30, 0.95, 'Client data in multi-tenant or consulting contexts', 'Medium', 'GDPR, varies'),
('Government / Public Sector', 1.50, 1.25, 1.45, 1.20, 1.40, 1.70, 1.10, 1.25, 1.60, 1.30, 1.35, 1.45, 1.60, 'Sovereignty and disclosure risk', 'Critical', 'FedRAMP, FISMA, IRAP'),
('Manufacturing', 1.20, 1.08, 1.30, 1.15, 1.25, 1.10, 1.05, 1.12, 1.40, 1.12, 1.25, 1.35, 1.00, 'OT/IT convergence and continuity', 'Medium', 'ISO 27001, varies'),
('Retail / E-commerce', 1.10, 1.05, 1.20, 1.10, 1.25, 1.30, 1.05, 1.08, 1.20, 1.12, 1.15, 1.28, 1.00, 'Payment and PII exposure', 'Medium-High', 'PCI-DSS, GDPR'),
('Education', 1.00, 1.00, 1.15, 1.05, 1.15, 1.20, 1.00, 1.05, 1.30, 1.08, 1.10, 1.22, 0.90, 'Student / faculty records', 'Medium', 'FERPA'),
('Construction', 1.00, 1.00, 1.20, 1.05, 1.15, 1.10, 1.00, 1.05, 1.25, 1.10, 1.12, 1.22, 0.95, 'Project and subcontractor data', 'Medium', 'Varies'),
('Telecommunications', 1.55, 1.20, 1.45, 1.20, 1.35, 1.50, 1.10, 1.20, 1.75, 1.25, 1.40, 1.75, 1.65, 'Critical infrastructure adjacency', 'Critical', 'NIS2, local telecom rules'),
('Media / Entertainment', 1.10, 1.05, 1.20, 1.08, 1.18, 1.25, 1.05, 1.08, 1.22, 1.12, 1.15, 1.28, 1.00, 'Content rights and subscriber data', 'Medium-High', 'GDPR, CCPA'),
('Energy / Utilities', 1.60, 1.22, 1.50, 1.22, 1.38, 1.50, 1.10, 1.22, 1.85, 1.30, 1.35, 1.80, 1.70, 'Operational technology reliance', 'Critical', 'NERC CIP, NIS2'),
('Hospitality / Travel', 1.10, 1.05, 1.22, 1.08, 1.22, 1.28, 1.05, 1.08, 1.22, 1.15, 1.15, 1.30, 1.00, 'Guest PII and payment flows', 'Medium-High', 'PCI-DSS, GDPR'),
('Real Estate', 1.05, 1.00, 1.18, 1.06, 1.15, 1.15, 1.03, 1.06, 1.18, 1.10, 1.10, 1.22, 0.95, 'Tenant and transaction data', 'Medium', 'Varies'),
('Legal Services', 1.00, 1.00, 1.18, 1.06, 1.18, 1.12, 1.03, 1.06, 1.20, 1.10, 1.10, 1.22, 0.90, 'Privileged and confidential matter data', 'Medium', 'Professional conduct, GDPR')
ON CONFLICT (industry_name) DO NOTHING;

-- ─────────────────────────────────────────────
-- 2. Unknown / free-text industry → canonical mapping
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.industry_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_provided_industry TEXT NOT NULL UNIQUE,
  mapped_to_industry TEXT NOT NULL REFERENCES public.industry_tech_multipliers(industry_name) ON UPDATE CASCADE ON DELETE RESTRICT,
  confidence_score DECIMAL(3, 2),
  mapping_rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_industry_mappings_user_industry
  ON public.industry_mappings(user_provided_industry);

ALTER TABLE public.industry_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read industry mappings" ON public.industry_mappings;
CREATE POLICY "Authenticated read industry mappings"
  ON public.industry_mappings
  FOR SELECT
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- 3. Threat refresh audit log
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.threat_refresh_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  refresh_type TEXT NOT NULL CHECK (refresh_type IN ('manual', 'automatic')),
  assessment_completion_pct INT,
  threats_added INT NOT NULL DEFAULT 0,
  threats_updated INT NOT NULL DEFAULT 0,
  threats_removed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threat_refresh_log_org
  ON public.threat_refresh_log(organization_id, created_at DESC);

ALTER TABLE public.threat_refresh_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read threat refresh log" ON public.threat_refresh_log;
CREATE POLICY "Org members read threat refresh log"
  ON public.threat_refresh_log
  FOR SELECT
  USING (is_org_member(organization_id));

-- ─────────────────────────────────────────────
-- 4. Threat clarifications (per threat_key)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.threat_clarifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  threat_key TEXT NOT NULL,
  assumption_text TEXT,
  user_response TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  skipped BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, threat_key)
);

CREATE INDEX IF NOT EXISTS idx_threat_clarifications_org
  ON public.threat_clarifications(organization_id);

DROP TRIGGER IF EXISTS trg_threat_clarifications_updated_at ON public.threat_clarifications;
CREATE TRIGGER trg_threat_clarifications_updated_at
BEFORE UPDATE ON public.threat_clarifications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.threat_clarifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members access threat clarifications" ON public.threat_clarifications;
CREATE POLICY "Org members access threat clarifications"
  ON public.threat_clarifications
  FOR ALL
  USING (is_org_member(organization_id))
  WITH CHECK (is_org_member(organization_id));

-- ─────────────────────────────────────────────
-- 5. Threat ↔ control impact rows (no legacy controls(id) FK)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.threat_control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  threat_key TEXT NOT NULL,
  control_framework TEXT NOT NULL,
  control_domain_id TEXT NOT NULL,
  impact_on_threat DECIMAL(3, 1),
  threat_severity_level TEXT CHECK (threat_severity_level IS NULL OR threat_severity_level IN ('HIGH', 'MEDIUM', 'LOWER')),
  control_improvement_impact DECIMAL(3, 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, threat_key, control_framework, control_domain_id)
);

CREATE INDEX IF NOT EXISTS idx_threat_control_mappings_org_threat
  ON public.threat_control_mappings(organization_id, threat_key);

ALTER TABLE public.threat_control_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read threat control mappings" ON public.threat_control_mappings;
CREATE POLICY "Org members read threat control mappings"
  ON public.threat_control_mappings
  FOR SELECT
  USING (is_org_member(organization_id));

-- Writes via service role / future batch jobs (no INSERT policy for members).

-- ─────────────────────────────────────────────
-- 6. Extend organization_threats for Agent 16 UX
-- ─────────────────────────────────────────────
ALTER TABLE public.organization_threats
  ADD COLUMN IF NOT EXISTS user_severity_bucket TEXT
    CHECK (user_severity_bucket IS NULL OR user_severity_bucket IN ('high', 'medium', 'lower', 'does_not_apply'));

ALTER TABLE public.organization_threats
  ADD COLUMN IF NOT EXISTS system_generated_score DECIMAL(4, 1);

ALTER TABLE public.organization_threats
  ADD COLUMN IF NOT EXISTS verified_status TEXT
    CHECK (verified_status IS NULL OR verified_status IN ('verified', 'pending_clarification'));

ALTER TABLE public.organization_threats
  ADD COLUMN IF NOT EXISTS assumptions_json JSONB;

COMMIT;
