-- Round 2: add email column to contact_submissions so replies can actually be sent.
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.contact_submissions
  SET email = 'unknown@placeholder.invalid'
  WHERE email IS NULL;

ALTER TABLE public.contact_submissions
  ALTER COLUMN email SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
  ON public.contact_submissions (email);
