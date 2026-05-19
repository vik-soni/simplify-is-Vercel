-- Contact form: subject categorisation (Feedback 08 May §18)
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS subject_detail TEXT;

COMMENT ON COLUMN public.contact_submissions.subject IS 'High-level reason: pricing, product_capability, security, privacy, partnership, support, other';
COMMENT ON COLUMN public.contact_submissions.subject_detail IS 'Free text when subject = other or extra context';
