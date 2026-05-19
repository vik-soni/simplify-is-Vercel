# Simplify IS — Claude Code Configuration

## Project Overview
Simplify IS is an AI-driven security assessment SaaS where users interact with Cypher to run structured, conversational security maturity assessments. The product is optimized for ISO 27001:2022 and NIST CSF 2.0 from day one, with security and auditability as first-class requirements.

## Stack Summary
- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Claude API (RAG architecture)

## Architecture Rules (NEVER VIOLATE)
1. Three-layer architecture: API Layer → /api/internal/ Orchestration → Supabase
2. No direct Supabase calls from frontend components — always go through API routes
3. No direct Claude API calls from /api/v1/ routes — always through /api/internal/ orchestration
4. SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, ORCHESTRATION_SECRET: NEVER in any NEXT_PUBLIC_ variable
5. All SQL: parameterized queries only — never string interpolation
6. TypeScript strict — no 'any' types
7. All env vars imported from /lib/config/env.ts only — never from process.env directly
8. All Supabase calls go through /lib/db/ abstractions
9. All auth calls go through /lib/auth/ abstractions
10. Error handling on every async function — no unhandled promise rejections
11. ISO 27001:2022 ONLY — never reference 2013 control IDs
12. NIST CSF 2.0 ONLY — use GV/ID/PR/DE/RS/RC prefixes only
13. Existing Supabase tables (ft_iso_controls, ft_nist_controls, domains, top_risks): DO NOT recreate
14. Primary model: claude-sonnet-4-20250514
15. RAG resolver model: claude-haiku-4-5-20251001
16. All Claude calls: 3 retries with exponential backoff, token logging to claude_api_usage table
17. JWT validation on every /api/v1/* route — no exceptions
18. RLS policies must exist on ALL data tables
19. /api/internal/* returns 403 without valid ORCHESTRATION_SECRET header
20. Rate limiting: 100 req/min per user, 1000 req/hour per user

## File Structure Reference
```
simplify-is/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── onboarding/
│   ├── dashboard/
│   ├── assessment/
│   ├── billing/
│   └── api/
│       ├── v1/
│       └── internal/
├── orchestration/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── config/
│   └── frameworks/
├── components/
├── types/
├── styles/
└── supabase/migrations/
```

## Required Environment Variables Before Running
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ANTHROPIC_API_KEY`
- `ORCHESTRATION_SECRET`
- `VIK_ALERT_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Optional Phase 7:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `PDF_STORAGE_BUCKET`

## Run Commands
- Dev server: `npm run dev`
- Migrations: `npx supabase db push --project-ref [ref]`
- Unit tests: `npm test`
- E2E tests: `npx playwright test`

## Non-Negotiables
1. World-class product quality, no shortcuts.
2. Security first in every layer and every decision.

