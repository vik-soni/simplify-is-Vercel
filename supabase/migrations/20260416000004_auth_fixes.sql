-- Migration: auth_fixes
-- Fixes:
--   1. Enable RLS on auth_rate_limits (required by CLAUDE.md for all data tables)
--   2. Drop and recreate action CHECK constraint to include 'signup'

-- 1. Enable RLS on auth_rate_limits
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Deny all access by default — service role bypasses RLS and is the only caller
CREATE POLICY "auth_rate_limits_deny_all"
  ON public.auth_rate_limits
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- 2. Add 'signup' to the action CHECK constraint
-- Drop the existing constraint (name may vary; use the standard generated name)
ALTER TABLE public.auth_rate_limits
  DROP CONSTRAINT IF EXISTS auth_rate_limits_action_check;

ALTER TABLE public.auth_rate_limits
  ADD CONSTRAINT auth_rate_limits_action_check
  CHECK (action IN ('login', 'mfa', 'resend', 'reset', 'signup'));
