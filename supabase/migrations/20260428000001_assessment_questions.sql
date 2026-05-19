-- Round 2 Phase 11: Assessment question catalogue + answer persistence
--
-- Adds two new tables (do not touch existing pre-seeded reference tables —
-- ft_iso_controls, ft_nist_controls, domains, top_risks). Seeds a starter set
-- of 18 questions (6 per domain × 3 NIST CSF 2.0 starter domains: GV, ID, PR)
-- so the assessment flow can drive a real walk-through end-to-end.
--
-- Tables created:
--   public.assessment_questions  — catalogue of canonical questions
--   public.assessment_answers    — per-user / per-org persisted answers
--
-- See:
--   docs/SOURCE_OF_TRUTH.md §5.2.c
--   docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md §28.6 / §28.8
--   docs/HANDOFF_11_ROUND2_BACKEND.md §3

-- ─────────────────────────────────────────────
-- 1. assessment_questions  (seeded reference catalogue)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_key    VARCHAR(64) NOT NULL UNIQUE,             -- natural key, e.g. 'NIST_CSF_2_0:GV.OC-01:Q1'
  framework_id    VARCHAR(50) NOT NULL,                    -- ISO27001 | NIST_CSF | NIST_CSF_2_0 | …
  domain_id       VARCHAR(50) NOT NULL,                    -- e.g. 'GV', 'ID', 'PR' (NIST function)
  domain_name     VARCHAR(120) NOT NULL,                   -- human label, e.g. 'Govern'
  control_id      VARCHAR(64) NOT NULL,                    -- e.g. 'GV.OC-01'
  control_name    VARCHAR(255) NOT NULL,                   -- human label
  position        INTEGER NOT NULL,                        -- 1-based ordering inside (framework, domain)
  prompt          TEXT NOT NULL,                           -- the question itself
  answer_options  JSONB NOT NULL DEFAULT '[]'::jsonb,      -- canonical likert / multiple-choice options
  allows_freeform BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT assessment_questions_position_uq UNIQUE (framework_id, domain_id, position)
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_framework
  ON public.assessment_questions(framework_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_framework_domain
  ON public.assessment_questions(framework_id, domain_id, position);

DROP TRIGGER IF EXISTS trg_assessment_questions_updated_at ON public.assessment_questions;
CREATE TRIGGER trg_assessment_questions_updated_at
BEFORE UPDATE ON public.assessment_questions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

-- Catalogue: every authenticated user can read; only service role can write.
DROP POLICY IF EXISTS "Authenticated users read questions" ON public.assessment_questions;
CREATE POLICY "Authenticated users read questions"
  ON public.assessment_questions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- 2. assessment_answers  (per-user persistence)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id          UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  question_key    VARCHAR(64) NOT NULL REFERENCES public.assessment_questions(question_key) ON DELETE RESTRICT,
  framework_id    VARCHAR(50) NOT NULL,
  domain_id       VARCHAR(50) NOT NULL,
  control_id      VARCHAR(64) NOT NULL,
  selected_option TEXT,                          -- one of assessment_questions.answer_options, when selected from canon
  freeform_answer TEXT,                          -- when the user types their own answer
  status          VARCHAR(32) NOT NULL DEFAULT 'answered'
                  CHECK (status IN ('answered', 'skipped', 'flagged')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT assessment_answers_user_question_uq UNIQUE (user_id, question_key)
);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_user
  ON public.assessment_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_org
  ON public.assessment_answers(org_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_user_framework
  ON public.assessment_answers(user_id, framework_id);

DROP TRIGGER IF EXISTS trg_assessment_answers_updated_at ON public.assessment_answers;
CREATE TRIGGER trg_assessment_answers_updated_at
BEFORE UPDATE ON public.assessment_answers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own answers" ON public.assessment_answers;
CREATE POLICY "Users read own answers"
  ON public.assessment_answers
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users insert own answers" ON public.assessment_answers;
CREATE POLICY "Users insert own answers"
  ON public.assessment_answers
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own answers" ON public.assessment_answers;
CREATE POLICY "Users update own answers"
  ON public.assessment_answers
  FOR UPDATE
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────
-- 3. Seed: 6 questions × 3 starter NIST CSF 2.0 domains (GV, ID, PR)
-- ─────────────────────────────────────────────
-- Canonical maturity ladder, used for every starter question. The /api will
-- expose these verbatim; the UI may also accept a freeform answer.
WITH canonical_options AS (
  SELECT '[
    "Yes, formally documented and reviewed in the last 12 months",
    "Yes, but not reviewed recently",
    "Informal practices only",
    "Planned but not in place",
    "No"
  ]'::jsonb AS opts
)
INSERT INTO public.assessment_questions
  (question_key, framework_id, domain_id, domain_name, control_id, control_name, position, prompt, answer_options)
SELECT q.question_key, q.framework_id, q.domain_id, q.domain_name, q.control_id, q.control_name, q.position, q.prompt, c.opts
FROM canonical_options c, (VALUES
  -- ── Govern (GV) ──
  ('NIST_CSF_2_0:GV.OC-01:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.OC-01',
   'Organisational Mission Understood',
   1,
   'Has your leadership team documented the organisational mission and how cybersecurity supports it?'),
  ('NIST_CSF_2_0:GV.OC-02:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.OC-02',
   'Internal and External Stakeholders Understood',
   2,
   'Have you identified the internal and external stakeholders whose expectations shape your cybersecurity programme?'),
  ('NIST_CSF_2_0:GV.RM-01:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.RM-01',
   'Risk Management Objectives',
   3,
   'Are cybersecurity risk objectives established, agreed by leadership, and communicated to staff?'),
  ('NIST_CSF_2_0:GV.RR-01:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.RR-01',
   'Roles, Responsibilities, and Authorities',
   4,
   'Are cybersecurity roles, responsibilities, and authorities clearly defined and assigned across the organisation?'),
  ('NIST_CSF_2_0:GV.PO-01:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.PO-01',
   'Policy Established and Communicated',
   5,
   'Is there a documented information security policy that has been approved by leadership and communicated to all staff?'),
  ('NIST_CSF_2_0:GV.OV-01:Q1', 'NIST_CSF_2_0', 'GV', 'Govern', 'GV.OV-01',
   'Cybersecurity Strategy Outcomes Reviewed',
   6,
   'Does leadership review the outcomes of your cybersecurity strategy at least annually and adjust as needed?'),

  -- ── Identify (ID) ──
  ('NIST_CSF_2_0:ID.AM-01:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.AM-01',
   'Hardware Inventory Maintained',
   1,
   'Do you maintain an up-to-date inventory of the hardware assets used by your organisation?'),
  ('NIST_CSF_2_0:ID.AM-02:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.AM-02',
   'Software Inventory Maintained',
   2,
   'Do you maintain an up-to-date inventory of software platforms and applications used by your organisation?'),
  ('NIST_CSF_2_0:ID.AM-05:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.AM-05',
   'Resources Prioritised by Criticality',
   3,
   'Have you prioritised your assets based on their classification, criticality, and business value?'),
  ('NIST_CSF_2_0:ID.RA-01:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.RA-01',
   'Asset Vulnerabilities Identified',
   4,
   'Do you regularly identify and document vulnerabilities affecting your assets (for example via vulnerability scanning)?'),
  ('NIST_CSF_2_0:ID.RA-05:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.RA-05',
   'Risks Prioritised',
   5,
   'Are identified cybersecurity risks prioritised using a documented method (e.g. likelihood × impact) and tracked over time?'),
  ('NIST_CSF_2_0:ID.SC-01:Q1', 'NIST_CSF_2_0', 'ID', 'Identify', 'ID.SC-01',
   'Supply Chain Risk Management Process',
   6,
   'Is there a documented process for assessing and managing cybersecurity risks introduced by your suppliers and third parties?'),

  -- ── Protect (PR) ──
  ('NIST_CSF_2_0:PR.AA-01:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.AA-01',
   'Identities and Credentials Managed',
   1,
   'Are identities and credentials for users, services, and devices issued, managed, and revoked through a defined process?'),
  ('NIST_CSF_2_0:PR.AA-03:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.AA-03',
   'Multi-Factor Authentication Used',
   2,
   'Is multi-factor authentication (MFA) enforced for privileged accounts and remote access?'),
  ('NIST_CSF_2_0:PR.AT-01:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.AT-01',
   'Personnel Trained',
   3,
   'Do all personnel receive cybersecurity awareness training, with role-specific training where appropriate?'),
  ('NIST_CSF_2_0:PR.DS-01:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.DS-01',
   'Data-at-Rest Protected',
   4,
   'Is data at rest encrypted on production systems containing sensitive information?'),
  ('NIST_CSF_2_0:PR.DS-02:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.DS-02',
   'Data-in-Transit Protected',
   5,
   'Is data in transit between systems and external parties protected using current TLS or equivalent controls?'),
  ('NIST_CSF_2_0:PR.IR-01:Q1', 'NIST_CSF_2_0', 'PR', 'Protect', 'PR.IR-01',
   'Network Integrity Protected',
   6,
   'Are network boundaries protected using firewalls, segmentation, and monitoring of inbound and outbound traffic?')
) AS q(question_key, framework_id, domain_id, domain_name, control_id, control_name, position, prompt)
ON CONFLICT (question_key) DO NOTHING;
