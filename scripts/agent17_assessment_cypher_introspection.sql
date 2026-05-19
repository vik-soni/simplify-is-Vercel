-- Agent 17: Assessment + Cypher integration — schema introspection.
-- Run against your Supabase/Postgres (read-only information_schema queries).
-- Example:
--   cd simplify-is && psql "$DATABASE_URL" -f scripts/agent17_assessment_cypher_introspection.sql
--
-- Reconcile output with agents/ AGENT_17_ASSESSMENT_CYPHER_INTEGRATION.md §1;
-- existing simplify-is already has assessment_sessions, control_responses,
-- domain_scores, framework_scores (see 20250320000001_simplify_schema.sql) and
-- assessment_questions / assessment_answers (20260428000001_assessment_questions.sql).

\echo '========== 1) Columns: assessment / question / response / control / domain / framework / maturity / score =========='
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND (table_name LIKE '%assessment%'
  OR table_name LIKE '%question%'
  OR table_name LIKE '%response%'
  OR table_name LIKE '%control%'
  OR table_name LIKE '%domain%'
  OR table_name LIKE '%subdomain%'
  OR table_name LIKE '%framework%'
  OR table_name LIKE '%maturity%'
  OR table_name LIKE '%score%')
ORDER BY table_name, ordinal_position;

\echo '========== 2) Foreign keys (assessment / question / response) =========='
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND (
  tc.table_name LIKE '%assessment%'
  OR tc.table_name LIKE '%question%'
  OR tc.table_name LIKE '%response%'
);

\echo '========== 3) Tables: answer / option / maturity =========='
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
  table_name LIKE '%answer%'
  OR table_name LIKE '%option%'
  OR table_name LIKE '%maturity%'
)
ORDER BY table_name;
