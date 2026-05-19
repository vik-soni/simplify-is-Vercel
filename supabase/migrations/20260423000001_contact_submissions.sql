-- Marketing-site contact form submissions
-- Backs the public ContactUsModal + POST /api/v1/contact route.
-- Inserts only happen via the service-role API route; RLS denies anon/auth direct access.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  submitter_ip TEXT,
  submitter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions(created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- No anon / authenticated policies — service-role bypasses RLS for inserts via the API route.
-- Explicit deny-by-omission: no SELECT/INSERT/UPDATE/DELETE policies for non-service roles.
