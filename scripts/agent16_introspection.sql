-- Agent 16 §3: Database introspection (run against your Supabase/Postgres instance).
-- Example: psql "$DATABASE_URL" -f scripts/agent16_introspection.sql

-- Assessment / control-related columns
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND (table_name LIKE '%assessment%' OR table_name LIKE '%response%' OR table_name LIKE '%control%')
ORDER BY table_name, ordinal_position;

-- Existing threat / risk tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (table_name LIKE '%threat%' OR table_name LIKE '%risk%');
