# Simplify IS

AI-driven security assessment SaaS. Users hold a structured, conversational
maturity review with **Cypher** (a Claude-powered consultant persona) focused
on ISO 27001:2022 and NIST CSF 2.0, with security and auditability as
first-class requirements.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Supabase** — Postgres + Auth + Storage
- **Anthropic Claude** (Sonnet for reasoning, Haiku for routing)
- **Stripe** (billing) + **Resend** (email)
- **Jest** (unit/integration) + **Playwright** (E2E)

## Architecture rules

1. Three layers: **API routes** → `/api/internal/*` **orchestration** → **Supabase**.
2. No direct Supabase calls from frontend components — always via an API route.
3. Every `/api/internal/*` call requires `x-orchestration-secret`.
4. All mutations go through `audit_log`.
5. RLS is on for every table; admin client (`createAdminSupabaseClient`)
   bypasses it and is server-only.

See `CLAUDE.md` for the authoritative architecture + agent workflow rules,
and `docs/SPEC.md` for the full product spec.

## Getting started

### Prerequisites

- Node 20+
- A Supabase project (URL + anon key + service role key)
- Anthropic API key
- Stripe test keys (optional, for billing flows)
- Resend API key (optional, for transactional email)

### Install and run

```bash
npm install
cp .env.example .env.local   # populate the values below
npm run dev                  # http://localhost:3000
```

### Required env vars

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
ORCHESTRATION_SECRET=...        # shared secret between API layer and /api/internal/*
RESEND_API_KEY=...              # optional
RESEND_FROM_EMAIL=...           # optional
STRIPE_SECRET_KEY=...           # optional
STRIPE_WEBHOOK_SECRET=...       # optional
VIK_ALERT_EMAIL=...             # where usage alerts land
E2E_BYPASS_TOKEN=...            # optional, for Playwright
```

### Optional env vars

```bash
# Dev-only: toggles the post-login mock data in lib/api/hooks/usePostLogin.ts.
# Default behaviour (unset or "true") = mocks on. Set to "false" once real
# API hooks land to switch callers over.
NEXT_PUBLIC_USE_MOCKS=true
```

## Scripts

```bash
npm run dev              # next dev
npm run build            # next build
npm run start            # next start
npm run lint             # next lint
npm test                 # jest --coverage (unit + integration)
npm run test:e2e         # playwright test
npm run security:audit   # node scripts/security/audit.mjs
```

## Project layout

```
app/              Next.js App Router (pages, layouts, API route handlers)
  api/            REST endpoints — the ONLY callers of Supabase from clients
  api/internal/   Orchestration handlers, gated by x-orchestration-secret
components/       React components (client + shared server)
  ui/             Design system primitives (Button, Card, Input, Modal, ...)
  onboarding/     Multi-step onboarding wizard (Step1..Step4, Initialisation)
  dashboard/      Dashboard screens (post-login experience)
  organisation/   Organisation settings screens (currently mock-backed)
lib/
  api/            API utility layer (client wrappers, auth guards, sanitize)
  auth/           Supabase auth context, MFA helpers, rate limiter, routing
  config/         Runtime env validation
  db/             Supabase client factories (browser, server, middleware, admin)
  email/          Resend sender + template renderers
  frameworks/     ISO 27001 + NIST CSF control catalogues (TypeScript)
  mock-data.ts    Mock data + USING_MOCKS feature flag
orchestration/    Claude orchestration engine (runs behind /api/internal/*)
  abstraction/    Claude prompt/response layer
  compliance/     Cadence engine (review due-dates)
  monitoring/     Usage limits + alerts
  rag/            RAG context builder
  scoring/        Maturity scoring engine
  session/        Session state machine
  handlers/       Request handlers wiring the above
types/            Shared TypeScript types (DB schema + API contracts)
tests/            Jest suites (api/, orchestration/, security/, e2e/)
scripts/          One-shot scripts (security audit, etc.)
middleware.ts     Security headers, rate limits, CORS, session refresh, RBAC
agents/           AI agent build briefs (spec + handoffs live in docs/)
docs/             Product spec (SPEC.md) + per-agent handoff reports
```

## Testing

```bash
npm test                              # all unit + integration suites, with coverage
npm test -- tests/orchestration       # just orchestration
npm run test:e2e                      # Playwright
npm run security:audit                # bespoke security audit script
```

CI runs lint + build + test on every push.

## Contributing notes

- Prefer editing existing files over creating new barrels.
- Do not add `index.ts` re-exports unless there are multiple real consumers.
- All API handlers must: authenticate, authorise (`assertOrgAdmin` /
  `assertOrgOwnership`), validate input with Zod, write to `audit_log`, and
  return the envelope shape in `lib/api/response.ts`.
- Orchestration functions must check `checkUsageLimit` before calling
  Claude, and call `incrementUsage` after.

## Where to read next

- `CLAUDE.md` — architecture rules + agent workflow (authoritative)
- `docs/SPEC.md` — full product spec
- `docs/HANDOFF_*.md` — per-agent completion reports
- `agents/*.md` — build briefs (one per agent)
