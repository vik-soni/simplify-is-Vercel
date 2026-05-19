# Handoff 11 — Round 2 Backend Tasks

Queued for the next agent. See `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` §28.8.

## 1. Durable onboarding state
- Add columns on `organizations`: `onboarding_step INT`, `onboarding_completed_at TIMESTAMPTZ`, `industry TEXT`, `countries JSONB`, `workforce_scale TEXT`, `selected_frameworks JSONB`.
- Add staged fields on `users` if signup metadata not already mirrored: `organisation_name_staged TEXT`, `job_title TEXT`.
- Every onboarding step POST writes through; every step GET reads through.

## 2. /api/v1/onboarding/* endpoints
- `POST /api/v1/onboarding/consultant-name` → writes `users.agent_name`.
- `POST /api/v1/onboarding/organisation` → writes `organizations.*` (create-or-update by owner).
- `POST /api/v1/onboarding/frameworks` → writes `organizations.selected_frameworks`.
- `POST /api/v1/onboarding/complete` → sets `organizations.onboarding_completed_at`.
- `GET  /api/v1/onboarding/state` → returns staged values for hydrate-on-mount.

## 3. POST /api/v1/assessment/answer
- Persist a single answer to `assessment_answers`.
- Return `{ ok: true, nextQuestionId }` computed by index (scoring comes later).

## 4. Signup → onboarding bridge
- Ensure `SignupForm.tsx` `organisation_name` + `full_name` land somewhere Step 2 can read (prefer `auth.users.raw_user_meta_data`, expose via `/api/v1/onboarding/state`).

## 5. contact_submissions.email
- Migration already shipped: `supabase/migrations/20260424000001_contact_submissions_email.sql`.
- Ensure `/api/v1/contact` zod schema requires `email: z.string().email().max(320)` and persists it.
