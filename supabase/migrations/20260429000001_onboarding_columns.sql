-- Round-2 onboarding persistence: extend organizations with onboarding state.
-- Required by /api/v1/onboarding/* endpoints (Steps 1-4 + complete).

BEGIN;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS countries JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS workforce_scale TEXT,
  ADD COLUMN IF NOT EXISTS selected_frameworks JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS consultant_name TEXT;

-- Constrain onboarding_step to a sane range (0..5 inclusive: 0 = not started,
-- 1..4 = in-flight, 5 = complete).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'organizations_onboarding_step_range'
  ) THEN
    ALTER TABLE organizations
      ADD CONSTRAINT organizations_onboarding_step_range
      CHECK (onboarding_step BETWEEN 0 AND 5);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_organizations_onboarding_step
  ON organizations (onboarding_step);

COMMIT;
