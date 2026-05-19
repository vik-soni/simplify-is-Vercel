-- Agent 18 §1: Database introspection (run against Supabase/Postgres).
-- Example: psql "$DATABASE_URL" -f scripts/agent18_assessment_data_wiring_introspection.sql

\echo '========== Framework IDs in control_assessment_questions =========='
SELECT DISTINCT framework FROM control_assessment_questions ORDER BY framework;

\echo '========== assessment_answers columns =========='
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'assessment_answers'
ORDER BY ordinal_position;

\echo '========== assessment_sessions.current_subdomain_key =========='
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'assessment_sessions'
  AND column_name = 'current_subdomain_key';

\echo '========== control_mappings columns =========='
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'control_mappings'
ORDER BY ordinal_position;

\echo '========== scoring / consolidation tables =========='
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'subdomain_maturity_scores',
  'domain_maturity_scores',
  'organization_maturity_scores',
  'monthly_score_snapshots',
  'monthly_summary_cache',
  'consolidated_questions',
  'consolidated_question_detail_map'
)
ORDER BY table_name;
