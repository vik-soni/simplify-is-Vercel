-- Agent 6 supplement: Dashboard team stats RPC
-- Returns per-domain contributor counts and conflict flags for the dashboard.

CREATE OR REPLACE FUNCTION get_domain_team_stats(p_org_id UUID)
RETURNS TABLE (
  domain_id TEXT,
  framework TEXT,
  contributor_count BIGINT,
  has_conflict BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    -- Extract domain prefix from control_id:
    --   ISO: 'A.5.1' → 'A.5', 'C.4.1' → 'C.4'
    --   NIST: 'ID.AM-1' → 'ID.AM', 'GV.OC-1' → 'GV.OC'
    CASE
      WHEN position('.' IN control_id) > 0 AND position('-' IN control_id) = 0
        THEN split_part(control_id, '.', 1) || '.' || split_part(control_id, '.', 2)
      WHEN position('-' IN control_id) > 0
        THEN split_part(control_id, '-', 1)
      ELSE control_id
    END AS domain_id,
    framework,
    COUNT(DISTINCT user_id) AS contributor_count,
    -- Conflict: 2+ distinct users answered the same control
    BOOL_OR(conflict_flag) AS has_conflict
  FROM (
    SELECT
      control_id,
      framework,
      user_id,
      COUNT(*) OVER (PARTITION BY org_id, framework, control_id) > 1 AS conflict_flag
    FROM team_responses
    WHERE org_id = p_org_id
  ) sub
  GROUP BY 1, 2;
$$;

GRANT EXECUTE ON FUNCTION get_domain_team_stats(UUID) TO authenticated;
