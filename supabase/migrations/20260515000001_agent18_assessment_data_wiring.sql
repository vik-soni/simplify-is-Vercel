-- Agent 18: Assessment data wiring — consolidated questions, time-series answers,
-- monthly snapshots, chat_transcripts user-private RLS.
-- Reconciled against live schema (control_assessment_questions.framework uses
-- NIST_CSF_2.0, ISO_27001_2022, etc.; assessment_answers uses org_id).

-- ─────────────────────────────────────────────
-- 1. assessment_answers — time-series + audit (append-only)
-- ─────────────────────────────────────────────
ALTER TABLE public.assessment_answers
  DROP CONSTRAINT IF EXISTS assessment_answers_user_question_uq;

ALTER TABLE public.assessment_answers
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS domain_id TEXT,
  ADD COLUMN IF NOT EXISTS subdomain_key TEXT,
  ADD COLUMN IF NOT EXISTS answer_value INT CHECK (answer_value BETWEEN 1 AND 4),
  ADD COLUMN IF NOT EXISTS source VARCHAR(20) CHECK (source IN ('form', 'cypher')) DEFAULT 'form',
  ADD COLUMN IF NOT EXISTS cypher_extracted_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS maturity_value SMALLINT CHECK (maturity_value BETWEEN 1 AND 4),
  ADD COLUMN IF NOT EXISTS propagated_from_control_id TEXT,
  ADD COLUMN IF NOT EXISTS propagated_from_framework TEXT,
  ADD COLUMN IF NOT EXISTS propagation_strength TEXT,
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE SET NULL;

UPDATE public.assessment_answers
SET organization_id = org_id
WHERE organization_id IS NULL AND org_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_aa_org_control_submitted
  ON public.assessment_answers(organization_id, control_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_aa_org_framework_submitted
  ON public.assessment_answers(organization_id, framework_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_aa_org_subdomain
  ON public.assessment_answers(organization_id, subdomain_key);
CREATE INDEX IF NOT EXISTS idx_aa_source
  ON public.assessment_answers(source);

-- ─────────────────────────────────────────────
-- 2. assessment_sessions — subdomain cursor
-- ─────────────────────────────────────────────
ALTER TABLE public.assessment_sessions
  ADD COLUMN IF NOT EXISTS current_subdomain_key TEXT;

-- ─────────────────────────────────────────────
-- 3. consolidated_questions + detail map
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consolidated_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework TEXT NOT NULL,
  control_id TEXT NOT NULL,
  consolidated_prompt TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('single_select', 'slider', 'drag_drop', 'multi_select', 'segmented')) DEFAULT 'single_select',
  maturity_levels JSONB NOT NULL,
  generation_source TEXT,
  generation_notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(framework, control_id)
);

CREATE INDEX IF NOT EXISTS idx_cq_framework_control
  ON public.consolidated_questions(framework, control_id);

DROP TRIGGER IF EXISTS trg_consolidated_questions_updated_at ON public.consolidated_questions;
CREATE TRIGGER trg_consolidated_questions_updated_at
BEFORE UPDATE ON public.consolidated_questions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.consolidated_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read consolidated questions" ON public.consolidated_questions;
CREATE POLICY "Authenticated read consolidated questions"
  ON public.consolidated_questions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.consolidated_question_detail_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consolidated_question_id UUID NOT NULL REFERENCES public.consolidated_questions(id) ON DELETE CASCADE,
  detail_question_id UUID NOT NULL REFERENCES public.control_assessment_questions(id) ON DELETE CASCADE,
  required_maturity_level INT NOT NULL CHECK (required_maturity_level BETWEEN 1 AND 4),
  implied_positive_answer_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(consolidated_question_id, detail_question_id)
);

CREATE INDEX IF NOT EXISTS idx_cqdm_consolidated
  ON public.consolidated_question_detail_map(consolidated_question_id);
CREATE INDEX IF NOT EXISTS idx_cqdm_detail
  ON public.consolidated_question_detail_map(detail_question_id);

ALTER TABLE public.consolidated_question_detail_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read consolidated detail map" ON public.consolidated_question_detail_map;
CREATE POLICY "Authenticated read consolidated detail map"
  ON public.consolidated_question_detail_map
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 4. monthly_score_snapshots + monthly_summary_cache
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.monthly_score_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL,
  snapshot_month DATE NOT NULL,
  organization_score DECIMAL(3,2),
  domain_scores JSONB,
  subdomain_scores JSONB,
  controls_answered_count INT,
  controls_total_count INT,
  controls_changed_this_month JSONB,
  no_activity_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, framework_id, snapshot_month)
);

CREATE INDEX IF NOT EXISTS idx_mss_org_framework_month
  ON public.monthly_score_snapshots(organization_id, framework_id, snapshot_month DESC);

ALTER TABLE public.monthly_score_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read monthly snapshots" ON public.monthly_score_snapshots;
CREATE POLICY "Org members read monthly snapshots"
  ON public.monthly_score_snapshots
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS public.monthly_summary_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL,
  summary_month DATE NOT NULL,
  domain_summaries JSONB,
  overall_narrative TEXT,
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'flat')),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, framework_id, summary_month)
);

CREATE INDEX IF NOT EXISTS idx_msc_org_framework_month
  ON public.monthly_summary_cache(organization_id, framework_id, summary_month DESC);

ALTER TABLE public.monthly_summary_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read monthly summaries" ON public.monthly_summary_cache;
CREATE POLICY "Org members read monthly summaries"
  ON public.monthly_summary_cache
  FOR SELECT
  USING (
    organization_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 5. chat_transcripts — user-private (Agent 18 §2.7)
-- ─────────────────────────────────────────────
ALTER TABLE public.chat_transcripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members access transcripts" ON public.chat_transcripts;
DROP POLICY IF EXISTS "Users access own org transcripts" ON public.chat_transcripts;
DROP POLICY IF EXISTS "chat_transcripts_user_private" ON public.chat_transcripts;

CREATE POLICY "chat_transcripts_user_private" ON public.chat_transcripts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
