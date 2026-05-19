#!/usr/bin/env bash
# Round 2 feedback — deterministic setup only.
# Scaffolds files, runs migrations, stages branches. Does NOT edit existing TSX.
# Code edits (Phases 1-8) are done by Claude Code in a follow-up pass.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

info()  { printf '\033[0;34m[R2]\033[0m %s\n' "$*"; }
warn()  { printf '\033[0;33m[R2]\033[0m %s\n' "$*"; }
fail()  { printf '\033[0;31m[R2]\033[0m %s\n' "$*" >&2; exit 1; }

[ -f package.json ] || fail "run from repo root"
[ -d .git ]         || fail "not a git repo"

# ---------- 0.1 Branch ----------
BRANCH="feat/round2-ui-feedback"
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  info "creating branch $BRANCH"
  git checkout -b "$BRANCH"
else
  info "switching to existing $BRANCH"
  git checkout "$BRANCH"
fi

# ---------- 0.2 contact_submissions.email migration ----------
MIG="supabase/migrations/20260424000001_contact_submissions_email.sql"
if [ ! -f "$MIG" ]; then
  info "writing $MIG"
  cat >"$MIG" <<'SQL'
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
SQL
else
  info "migration $MIG already exists — skipping"
fi

# ---------- 0.3 OnboardingState provider scaffold ----------
PROVIDER="components/onboarding/OnboardingStateProvider.tsx"
if [ ! -f "$PROVIDER" ]; then
  info "scaffolding $PROVIDER"
  cat >"$PROVIDER" <<'TSX'
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface OnboardingState {
  agentName: string;
  organisation: {
    name: string;
    industry: string;
    countries: string[];
    workforceScale: "small" | "medium" | "large" | "enterprise" | "";
  };
  frameworks: string[];
}

const DEFAULT_STATE: OnboardingState = {
  agentName: "",
  organisation: { name: "", industry: "", countries: [], workforceScale: "" },
  frameworks: ["iso_27001_2022", "nist_csf_2_0"],
};

const STORAGE_KEY = "simplify-is.onboarding-state";

interface Ctx {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
}

const OnboardingStateContext = createContext<Ctx | null>(null);

export function OnboardingStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<OnboardingState>) });
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // non-fatal
    }
  }, [state]);

  const update = (patch: Partial<OnboardingState>): void =>
    setState((prev) => ({ ...prev, ...patch }));

  const reset = (): void => {
    setState(DEFAULT_STATE);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // non-fatal
    }
  };

  return (
    <OnboardingStateContext.Provider value={{ state, update, reset }}>
      {children}
    </OnboardingStateContext.Provider>
  );
}

export function useOnboardingState(): Ctx {
  const ctx = useContext(OnboardingStateContext);
  if (!ctx) throw new Error("useOnboardingState must be used inside OnboardingStateProvider");
  return ctx;
}
TSX
else
  info "$PROVIDER already exists — skipping"
fi

# ---------- 0.4 Handoff task list ----------
HANDOFF="docs/HANDOFF_11_ROUND2_BACKEND.md"
if [ ! -f "$HANDOFF" ]; then
  info "writing $HANDOFF"
  cat >"$HANDOFF" <<'MD'
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
MD
else
  info "$HANDOFF already exists — skipping"
fi

# ---------- 0.5 Push migration (optional) ----------
# CLI uses --linked (project must already be linked via `supabase link --project-ref <ref>`).
if [ "${SKIP_DB_PUSH:-0}" = "1" ]; then
  warn "SKIP_DB_PUSH=1 set — not running supabase db push"
else
  if command -v npx >/dev/null 2>&1 && [ -n "${SUPABASE_PROJECT_REF:-}" ]; then
    info "linking project $SUPABASE_PROJECT_REF"
    npx supabase link --project-ref "$SUPABASE_PROJECT_REF" 2>/dev/null || warn "link failed or already linked"
    info "running: npx supabase db push --linked --yes"
    npx supabase db push --linked --yes || warn "db push failed — push manually"
  else
    warn "push manually: supabase link --project-ref <ref> && supabase db push --linked"
  fi
fi

# ---------- 0.6 Commit scaffolding ----------
# Stage specific files only — avoids picking up unrelated untracked migrations.
git add "$MIG" components/onboarding/OnboardingStateProvider.tsx docs/HANDOFF_11_ROUND2_BACKEND.md 2>/dev/null || true
if ! git diff --cached --quiet; then
  info "committing scaffold"
  git commit -m "chore(round2): scaffold — contact_submissions.email migration, onboarding state provider, backend handoff"
else
  info "nothing to commit — scaffold already in place"
fi

info "done. next: run Claude Code against docs/UI_UX_FEEDBACK_REMEDIATION.md §ROUND 2, phase by phase."
