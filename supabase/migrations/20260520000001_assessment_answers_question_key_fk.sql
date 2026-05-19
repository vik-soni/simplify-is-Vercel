-- Consolidated assessment keys (e.g. NIST_CSF_2.0:GV.OC-01) are not rows in
-- legacy assessment_questions. Drop the FK so Agent 17/18 append-only answers work.

ALTER TABLE public.assessment_answers
  DROP CONSTRAINT IF EXISTS assessment_answers_question_key_fkey;
