# Verbatim Agent Archive (Full Raw Snapshot)

Generated: 2026-05-07T23:45:18
Source directory: `agents/`
Total files archived: 29

This file contains verbatim raw content of each agent file to avoid context loss.

## File Index

1. `00_WAR_ROOM_MasterOrchestration.md`
2. `01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md`
3. `02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md`
4. `03_AGENT_BACKEND_APILayerControlLibraries.md`
5. `04_AGENT_UIUX_PostLoginDashboardAssessment.md`
6. `05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md`
7. `06_AGENT_BACKEND_MultiUserCollaboration.md`
8. `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
9. `08_AGENT_BACKEND_AuthenticationEmailService.md`
10. `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`
11. `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`
12. `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`
13. `11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`
14. `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`
15. `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`
16. `DONE_AGENT5_SECURITYQA.md`
17. `HANDOFF_11_ONBOARDING_REFINEMENT.md`
18. `HANDOFF_15_THREAT_READINESS.md`
19. `HANDOFF_1_INFRASTRUCTURE.md`
20. `HANDOFF_2_ORCHESTRATION.md`
21. `HANDOFF_3_APILAYER.md`
22. `HANDOFF_4_DASHBOARD_UIUX.md`
23. `HANDOFF_7_PRELOGIN_UIUX.md`
24. `HANDOFF_8_AUTH_BACKEND.md`
25. `HANDOFF_9_AUTH_INTEGRATION.md`
26. `SECURITY_AUDIT_REPORT.json`
27. `SIMPLIFY_IS_MASTER_CONTEXT.md`
28. `THREAT_READINESS_ARCHITECTURE.md`
29. `THREAT_READINESS_PROMPTS.md`

---

## FILE: `00_WAR_ROOM_MasterOrchestration.md`

Path: `agents/00_WAR_ROOM_MasterOrchestration.md`

```markdown
# Simplify IS — Build War Room
## Master Agent Orchestration Document
### Version 1.0 — Part 4 Final

---

> **This document is the command centre for the Simplify IS build.**
> Every agent reads this before starting. Every handoff contract is defined here.
> Every non-negotiable rule lives here. This is the single source of truth for build coordination.

---

## The Army — 5 Agents, Sequential Build

```
AGENT 1: INFRA + AUTH          → ~6 hours
         ↓ writes: HANDOFF_1.md
AGENT 2: ORCHESTRATION ENGINE  → ~10 hours
         ↓ reads: HANDOFF_1.md | writes: HANDOFF_2.md
AGENT 3: API LAYER             → ~8 hours
         ↓ reads: HANDOFF_1.md + HANDOFF_2.md | writes: HANDOFF_3.md
AGENT 4: FRONTEND              → ~14 hours
         ↓ reads: HANDOFF_1.md + HANDOFF_2.md + HANDOFF_3.md | writes: HANDOFF_4.md
AGENT 5: SECURITY + POLISH     → ~4 hours
         ↓ reads: ALL HANDOFF files | writes: DONE.md
```

**Total estimated build time:** ~42 hours of Cursor agent sessions
**Recommended: one agent per day, 1-2 Cursor sessions each**
**Human checkpoint required between every agent (review handoff file before proceeding)**

---

## Tool Strategy — When To Use What

### Use Cursor (Primary Builder)
Cursor handles ALL code generation. It has sufficient context window and is optimized for file editing.
Use Cursor for:
- Every task in every agent instruction file
- All code writing, refactoring, component building
- Running tests and fixing build errors
- Anything that touches the codebase

**How to use Cursor per agent:**
1. Open a new Composer window
2. Paste the entire agent instruction MD content into context
3. Paste relevant sections of the spec (Section numbers called out in each agent file)
4. Give the first task instruction
5. Review output → approve or correct → give next task
6. Never run two agents simultaneously in the same codebase

### Use Claude (This Chat) For
- Architecture decisions that arise mid-build and aren't in the spec
- Reviewing handoff files before proceeding to next agent
- Debugging complex orchestration logic (RAG, scoring, signal extraction)
- Writing or refining prompts in the Claude Orchestrator
- Any security question or design decision
- Reviewing the final DONE.md

### Use Claude Code (Heavy Lifting)
- If a task is too large for a single Cursor session
- Running the full E2E test suite
- Complex database migrations
- Performance optimization passes

**Rule:** Cursor first (it's included in your subscription). Only pay for Claude API tokens when Cursor genuinely can't handle it.

---

## The Two Non-Negotiables (Repeat These To Every Agent)

1. **World-class product quality.** This is the best AI security assessment tool ever built. No shortcuts on UI, no placeholder logic, no TODO comments left in production code.

2. **Security first, always.** Every route authenticated. Every table RLS-protected. Service keys never in client bundles. Parameterized queries only. This must survive a penetration test.

---

## Global Rules — Every Agent Follows These

```
SECURITY:
- JWT validation on EVERY protected route — no exceptions
- SUPABASE_SERVICE_KEY: NEVER in any client-side file or NEXT_PUBLIC_ variable
- ANTHROPIC_API_KEY: NEVER in any client-side file
- ORCHESTRATION_SECRET: NEVER in any client-side file
- All SQL: parameterized queries only — never string interpolation
- RLS enabled on ALL data tables (organizations, assessment_sessions, control_responses,
  extracted_signals, domain_scores, framework_scores, chat_transcripts,
  compliance_tracker, organization_risks)
- /api/internal/* must return 403 for any request without valid ORCHESTRATION_SECRET

ARCHITECTURE:
- Three-layer architecture: API Layer → Orchestration Service → Database
- NO direct Supabase calls from frontend components (always go through API routes)
- NO direct Claude API calls from API routes (always go through /api/internal/ orchestration)
- All external service calls wrapped in abstraction layers (no vendor lock-in in business logic)
- Vendor-agnostic from day 1: Supabase → AWS RDS swap = connection string only

CODE QUALITY:
- TypeScript strict mode — no 'any' types
- All environment variables validated at startup with Zod (throw on missing)
- No TODO comments left in merged code
- Error handling on every async function
- Logging: errors to console.error with context (no PII in logs)

DATABASE:
- Use `domains` table (not control_groups) — already seeded with 21 rows
- Use `top_risks` table (not risks) — already seeded
- Do NOT recreate or re-seed: ft_iso_controls, ft_nist_controls, control_mappings, domains, top_risks, controls
- INSPECT actual Supabase column names before building against existing tables
- All new tables: created via migration file in /supabase/migrations/

FRAMEWORK DATA:
- ISO 27001:2022 ONLY — never reference 2013 control IDs (A.7.2.x, A.9.x, A.10.x etc.)
- NIST CSF 2.0 ONLY — function prefixes: GV=Govern, ID=Identify, PR=Protect, DE=Detect, RS=Respond, RC=Recover
- Never mix CSF 1.1 subcategory IDs (PR.AC, PR.IP) with CSF 2.0 IDs

CLAUDE MODEL REFERENCES:
- Primary model: claude-sonnet-4-20250514
- RAG resolver (Haiku only): claude-haiku-4-5-20251001
- Never use any other model
```

---

## Handoff Contract Schema

Every agent writes a `HANDOFF_N.md` file at the end of their session. Next agent reads it first.

```markdown
# HANDOFF_[N] — Agent [Name] Complete

## What Was Built
[List of files created/modified with brief description]

## Confirmed Working
[What was tested and passed]

## Environment Variables Set
[Which env vars are now required and what they do]

## Database Tables Created
[New tables created, migration file name]

## Supabase Column Names (Existing Tables Inspected)
[Actual column names from domains, ft_iso_controls etc. — critical for next agents]

## API Contracts Established
[If Agent 2/3: function signatures and return types that downstream agents depend on]

## Known Issues / Debt
[Anything not completed, any workarounds taken]

## Next Agent Instructions
[Specific notes for the next agent to read before starting]
```

---

## Project Setup (Do Once Before Agent 1 Starts)

```bash
# 1. Clone the repo (already created)
git clone https://github.com/[vik]/simplify-is.git
cd simplify-is

# 2. Create .env.local (fill in values from Supabase + Anthropic dashboards)
cp .env.example .env.local

# 3. Open project in Cursor
cursor .

# 4. Confirm Cursor is using Claude Sonnet as backend model
# Settings → Models → Select claude-sonnet-4-20250514

# 5. Confirm .cursorrules is loaded (will be created by Agent 1)
```

---

## File Locations Reference

```
Project root:        ~/Documents/Code/simplify-is/
CLAUDE.md:           ~/Documents/Code/simplify-is/CLAUDE.md
Agent files:         ~/Documents/Code/simplify-is/agents/
Supabase env:        Copy from /Users/vik/Documents/vik-so-dev/.env (Supabase URL + keys)
Anthropic key:       Copy from /Users/vik/Documents/code-ai/Social-content/.env
```

---

## The Build Sequence At A Glance

| Agent | What It Builds | Hours | Blocks Next? |
|-------|---------------|-------|-------------|
| 1 — Infra + Auth | Project scaffold, schema, auth, env validation, .cursorrules | ~6h | YES — all agents need this |
| 2 — Orchestration | RAG, Claude abstraction, scoring, state machine, cadence engine | ~10h | YES — API layer depends on it |
| 3 — API Layer | All 10 endpoints, middleware, security headers, rate limiting | ~8h | YES — frontend depends on it |
| 4 — Frontend | Dashboard, chat, assessment flow, animations, D3 charts | ~14h | YES — security agent reviews it |
| 5 — Security + Polish | Security audit, E2E tests, landing page, Stripe, email | ~4h | NO — launch ready |

---

## Go / No-Go Checklist Before Agent 1 Starts

- [ ] GitHub repo `simplify-is` exists and is cloned locally
- [ ] Supabase `simplify-dev` project created
- [ ] Supabase tables confirmed: `ft_iso_controls`, `ft_nist_controls`, `domains`, `top_risks`, `control_mappings`, `controls`
- [ ] Anthropic API key available
- [ ] Cursor open on project
- [ ] Agent 1 instruction file open and ready to paste
- [ ] `.env.local` template ready (even if not filled in yet)

All checked? Start Agent 1.
```

---

## FILE: `01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md`

Path: `agents/01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md`

```markdown
# AGENT 1 — INFRA + AUTH
## Simplify IS — Foundation Layer
### Cursor Agent Instruction File

---

> **READ THIS FIRST.**
> You are Agent 1 of 5. You build the foundation everything else runs on.
> No other agent can start until you are done.
> When you finish, you MUST write `agents/HANDOFF_1.md` using the schema in `00_WAR_ROOM.md`.

---

## Your Mission

Build the complete project scaffold, database schema, authentication layer, environment validation, and Cursor configuration. By the time you're done, the project compiles, auth works end-to-end, and the database schema is deployed to Supabase.

---

## Non-Negotiables (Your Rules)

Read the Global Rules in `00_WAR_ROOM.md`. These apply to every file you touch.

Additionally:
- **Never put secrets in client-side files.** `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `ORCHESTRATION_SECRET` are NEVER prefixed with `NEXT_PUBLIC_`.
- **Validate all env vars at startup.** If a required secret is missing, the app throws before serving a single request.
- **Auth abstraction is mandatory.** Wrap all Supabase auth calls in `/lib/auth/` — no direct Supabase auth calls outside this layer.
- **RLS on every new table.** No data table is created without an org-scoped RLS policy.

---

## Context To Load Before Starting

Paste these sections from the spec into your Cursor context:
- Section 5: Technical Architecture
- Section 7: Database Schema (full — all table definitions)
- Section 20: Security Architecture
- Section 23: File & Folder Structure
- Section 24: Environment Variables Reference
- Section 25: Supabase Setup

---

## Tasks — Execute In Order

### TASK 1.1 — Initialize Next.js Project

```
Create a Next.js 14 App Router project with:
- TypeScript (strict mode)
- Tailwind CSS
- ESLint + Prettier configured
- tsconfig.json with path aliases: @/app, @/lib, @/components, @/orchestration, @/types, @/styles
- Install dependencies: @supabase/supabase-js @supabase/ssr zod

Create the full folder structure as defined in Section 23 of the spec:
- /app/(marketing)/, /app/(auth)/, /app/onboarding/, /app/dashboard/, /app/assessment/, /app/billing/
- /app/api/v1/, /app/api/internal/
- /orchestration/abstraction/, /orchestration/rag/, /orchestration/scoring/,
  /orchestration/compliance/, /orchestration/session/, /orchestration/monitoring/, /orchestration/handlers/
- /lib/auth/, /lib/db/, /lib/config/, /lib/frameworks/
- /components/chat/, /components/dashboard/, /components/assessment/, /components/onboarding/, /components/ui/, /components/layout/
- /types/
- /supabase/migrations/

Create empty index files in each folder to establish structure.
Create .env.example with all variable names from Section 24 (no values — just keys with comments).
Create .gitignore ensuring .env.local is never committed.
```

### TASK 1.2 — Environment Validation

```
Build /lib/config/env.ts using Zod.

Required server-side variables (never expose to client):
- SUPABASE_URL
- SUPABASE_SERVICE_KEY  ← admin access, NEVER client-side
- ANTHROPIC_API_KEY     ← NEVER client-side
- ORCHESTRATION_SECRET  ← NEVER client-side
- VIK_ALERT_EMAIL

Required client-safe variables (NEXT_PUBLIC_ prefix allowed):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_APP_URL

Phase 7 variables (optional for now, don't throw if missing):
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- RESEND_API_KEY, RESEND_FROM_EMAIL
- PDF_STORAGE_BUCKET

Behavior:
- On startup: validate all required vars with Zod
- If any required server var is missing: throw Error with the variable name
- Export typed config object used everywhere in the app
- Export separate clientConfig object containing ONLY NEXT_PUBLIC_ vars

This is the ONLY place in the codebase that reads process.env directly.
Everything else imports from this module.
```

### TASK 1.3 — Database Client Abstraction

```
Build /lib/db/client.ts:
- Server-side Supabase client (uses SERVICE_KEY — for orchestration/API routes only)
- Client-side Supabase client (uses ANON_KEY — for auth state in browser only)
- Server component client using @supabase/ssr (cookies-based session handling)

Build /lib/db/queries.ts:
- Generic typed query helpers (getById, getByOrgId, insert, update, softDelete)
- All queries: parameterized only (never string interpolation in SQL)
- All queries: include org_id filter as a safeguard (defense in depth even with RLS)

This abstraction must support swapping Supabase for AWS RDS with changes
in THIS FILE ONLY — no direct Supabase imports anywhere else in the codebase.
```

### TASK 1.4 — Supabase Migration: New Tables

```
Create /supabase/migrations/001_simplify_schema.sql

Generate complete SQL for ALL new tables defined in Section 7 of the spec:
- users
- organizations
- assessment_sessions   (note: has duplicate column — resolve: use domain_ref_id only, remove current_domain_id duplicate)
- control_responses
- extracted_signals
- domain_scores
- framework_scores
- chat_transcripts
- compliance_tracker
- organization_risks
- claude_api_usage
- audit_log            (records all INSERT/UPDATE/DELETE: table_name, record_id, action, user_id, org_id, changed_data JSONB, timestamp)

For each table include:
- All columns with correct types
- Appropriate indexes (org_id, user_id, session_id FKs)
- Foreign key constraints
- RLS: ENABLE ROW LEVEL SECURITY
- RLS Policy: "Users access own org data" scoped to org owner (see Section 7 for pattern)

DO NOT recreate these tables (they already exist in Supabase):
- ft_iso_controls
- ft_nist_controls
- control_mappings
- domains
- top_risks
- controls

IMPORTANT: Before finalizing, inspect the actual column names of the existing tables
and document them in HANDOFF_1.md. Agent 2 and 4 depend on knowing the exact schema.
```

### TASK 1.5 — Authentication Layer

```
Build the complete auth layer in /lib/auth/:

/lib/auth/client.ts — client-side auth helpers:
- signUp(email, password) → creates user + triggers email verification
- signIn(email, password) → returns session
- signOut() → clears session
- getUser() → returns current user or null
- onAuthStateChange(callback) → wraps Supabase realtime auth

/lib/auth/server.ts — server-side auth helpers:
- getServerUser(request) → validates JWT, returns user or null
- requireAuth(request) → throws 401 if not authenticated
- refreshSession(request, response) → handles token refresh

/lib/auth/context.tsx — React context provider:
- AuthProvider component
- useAuth() hook → { user, organization, loading, signIn, signOut, signUp }
- Loads organization record after user authenticated
- Handles loading states properly

Build auth pages:
- /app/(auth)/login/page.tsx — login form
- /app/(auth)/signup/page.tsx — signup form
- /app/(auth)/verify/page.tsx — "check your email" confirmation page
- /app/auth/callback/route.ts — Supabase auth callback handler (PKCE flow)

Build /middleware.ts:
- Protect all /dashboard/* and /assessment/* and /api/v1/* routes
- Redirect unauthenticated users to /login
- Refresh session tokens on each request
- Block /api/internal/* with 403 (no valid ORCHESTRATION_SECRET = reject)
```

### TASK 1.6 — Onboarding Flow (Post-Signup Org Setup)

```
Build /app/onboarding/page.tsx:

Multi-step form (no /api calls yet — direct Supabase insert is acceptable here):
- Step 1: Organization name
- Step 2: Industry (dropdown — map to industry-standard categories)
- Step 3: Organization size (small / medium / enterprise)
- Step 4: Country (default: Australia)
- Step 5: Initial frameworks (ISO 27001 / NIST CSF / Both — checkboxes)

On submit:
- Create record in `organizations` table (owner_user_id = auth.uid())
- Create initial `framework_scores` rows with null scores for selected frameworks
- Update `users` record with name if collected
- Redirect to /dashboard

Validation: all fields required except country (defaults to AU).
Error handling: show inline errors, don't clear form on failure.
```

### TASK 1.7 — .cursorrules File

```
Create .cursorrules at the project root.

This file is a persistent system prompt that Cursor reads on every session.
Write it with these rules:

---
# Simplify IS — Cursor Rules

## Project Context
This is Simplify IS — an AI-driven security assessment SaaS. Cypher is the AI agent.
Stack: Next.js 14 App Router, TypeScript strict, Tailwind, Supabase, Claude API.

## Architecture Rules (NEVER VIOLATE)
1. Three-layer architecture: API Layer → /api/internal/ Orchestration → Supabase
2. No direct Supabase calls from frontend components — always go through API routes
3. No direct Claude API calls from /api/v1/ routes — always through /api/internal/ orchestration
4. SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, ORCHESTRATION_SECRET: NEVER in any NEXT_PUBLIC_ variable
5. All SQL: parameterized queries only — never string interpolation

## Code Quality Rules
6. TypeScript strict — no 'any' types
7. All env vars imported from /lib/config/env.ts only — never from process.env directly
8. All Supabase calls go through /lib/db/ abstractions
9. All auth calls go through /lib/auth/ abstractions
10. Error handling on every async function — no unhandled promise rejections

## Framework Data Rules
11. ISO 27001:2022 ONLY — never reference 2013 control IDs
12. NIST CSF 2.0 ONLY — use GV/ID/PR/DE/RS/RC prefixes only
13. Existing Supabase tables (ft_iso_controls, ft_nist_controls, domains, top_risks): DO NOT recreate

## Claude API Rules
14. Primary model: claude-sonnet-4-20250514
15. RAG resolver model: claude-haiku-4-5-20251001
16. All Claude calls: 3 retries with exponential backoff, token logging to claude_api_usage table

## Security Rules
17. JWT validation on every /api/v1/* route — no exceptions
18. RLS policies must exist on ALL data tables
19. /api/internal/* returns 403 without valid ORCHESTRATION_SECRET header
20. Rate limiting: 100 req/min per user, 1000 req/hour per user
---
```

### TASK 1.8 — CLAUDE.md Update

```
Update /CLAUDE.md (already exists at ~/Documents/Code/simplify-is/CLAUDE.md) with:

- Project overview (2 sentences)
- Stack summary
- The 20 rules from .cursorrules above (same content, Claude Code reads this)
- File structure reference
- Which env vars are required before running
- How to run: `npm run dev`
- How to run migrations: `npx supabase db push --project-ref [ref]`
- Testing: `npm test` (unit) / `npx playwright test` (e2e)
- The two non-negotiables (world-class quality + security first)
```

### TASK 1.9 — Compile and Verify

```
Ensure:
- `npm run build` succeeds with zero TypeScript errors
- `npm run lint` passes with zero warnings
- Auth flow works: signup → email verify → login → redirect to /onboarding → create org → redirect to /dashboard (blank)
- All protected routes redirect to /login when unauthenticated
- /api/internal/test route exists and returns 403 without ORCHESTRATION_SECRET

Fix any issues before writing HANDOFF_1.md.
```

### TASK 1.10 — Write HANDOFF_1.md

```
Create /agents/HANDOFF_1.md using the schema in 00_WAR_ROOM.md.

CRITICAL — include in this file:
1. List of every file created with one-line description
2. Exact column names of ALL existing Supabase tables you inspected:
   - domains (all columns)
   - ft_iso_controls (all columns)
   - ft_nist_controls (all columns)
   - top_risks (all columns)
   - control_mappings (all columns)
   - controls (all columns)
3. The exact migration file name(s) created
4. Any env vars that were added beyond the spec
5. Any architectural decisions made that weren't in the spec
6. Notes for Agent 2 (Orchestration Engine)
```

---

## Estimated Time: 5–7 Cursor hours

## Definition of Done

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes
- [ ] Auth flow works end-to-end (signup → verify → login → onboarding → dashboard)
- [ ] All 11 new database tables created in Supabase via migration
- [ ] RLS enabled on all new tables
- [ ] .cursorrules in project root
- [ ] CLAUDE.md updated
- [ ] HANDOFF_1.md written with full Supabase column inventory
- [ ] No secrets in any NEXT_PUBLIC_ variable
- [ ] No direct process.env reads outside /lib/config/env.ts
```

---

## FILE: `02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md`

Path: `agents/02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md`

```markdown
# AGENT 2 — ORCHESTRATION ENGINE
## Simplify IS — Intelligence Core
### Cursor Agent Instruction File

---

> **READ THIS FIRST.**
> You are Agent 2 of 5. You build Cypher's brain.
> Before writing a single line: read `agents/HANDOFF_1.md` in full.
> The Supabase column names in HANDOFF_1.md are authoritative — use those, not guesses.
> When you finish, write `agents/HANDOFF_2.md`.

---

## Your Mission

Build the complete orchestration service: the RAG context builder, Claude API abstraction layer, signal extraction, contradiction detection, scoring engine, session state machine, compliance cadence engine, and usage monitor. This is the intelligence core of the product. Everything Cypher does flows through this layer.

---

## Non-Negotiables

Read the Global Rules in `00_WAR_ROOM.md`. Your specific rules:
- **The orchestration layer is INTERNAL ONLY.** Every function in this layer is called from `/api/internal/` routes only — never directly from `/api/v1/` or frontend code.
- **All Claude API calls go through `claudeOrchestrator.ts` only.** No Claude calls anywhere else.
- **All Supabase reads/writes in orchestration go through `/lib/db/` abstractions.** No raw Supabase client imports here.
- **Every Claude API call must log tokens to `claude_api_usage` table.**
- **Every Claude API call must check usage limit BEFORE making the call.**

---

## Context To Load Before Starting

Paste these sections from the spec into your Cursor context:
- Section 6: RAG Architecture — Three-Pass Strategy
- Section 9: Orchestration Service — Detailed Design
- Section 15: Signal Extraction from Freeflow Chat
- Section 16: Contradiction Detection & Handling
- Section 17: Cross-Session Memory & Persistent Profile
- Section 19: Prompt Library — All 9 prompts (FULL TEXT)
- Section 30: Scoring Algorithm — Implementation Detail
- HANDOFF_1.md (Supabase column names)

---

## Tasks — Execute In Order

### TASK 2.1 — Orchestration Service Skeleton + Security Gate

```
Build /app/api/internal/route.ts — the entry point for all orchestration calls.

Security gate (runs on EVERY request to /api/internal/*):
1. Check request has header: X-Orchestration-Secret: [value]
2. Compare with env.ORCHESTRATION_SECRET using timing-safe comparison (crypto.timingSafeEqual)
3. If missing or wrong: return 403 immediately, log attempt to audit_log
4. If valid: route to appropriate handler

Action router — routes incoming action strings to handlers:
- 'start_session' → handlers/sessionHandler.ts
- 'submit_response' → handlers/responseHandler.ts
- 'extract_signals' → claudeOrchestrator.ts
- 'score_domain' → maturityEngine.ts
- 'check_usage' → usageMonitor.ts
- 'generate_greeting' → claudeOrchestrator.ts
- Unknown action → 400

Build /orchestration/handlers/ directory with stub handler files for each action.
Request/response logging: log action type + user_id + org_id to audit_log on every call.
```

### TASK 2.2 — RAG Context Builder (Three-Pass Strategy)

```
Build /orchestration/rag/contextBuilder.ts

Mirror vik.so's buildRagContext() function exactly. Implement all three passes:

PASS 1 — Explicit Control ID Extraction:
- Parse message for ISO 27001:2022 control IDs (patterns: A.5.x, A.6.x, A.7.x, A.8.x, C.4.x–C.10.x)
- Parse message for NIST CSF 2.0 IDs (patterns: GV.xx-xx, ID.xx-xx, PR.xx-xx, DE.xx-xx, RS.xx-xx, RC.xx-xx)
- If IDs found: fetch full records from ft_iso_controls or ft_nist_controls (use HANDOFF_1.md column names)
- Return full records as context string

PASS 2 — Claude Haiku Semantic Resolver:
- If no explicit IDs found: call claude-haiku-4-5-20251001
- Prompt: map user's natural language message → specific control IDs
- Example: "vendor security" → ["A.5.19", "A.5.20", "A.5.21", "A.5.22", "A.5.23"]
- Fetch compact summaries of resolved controls from Supabase
- Return with version anchors

PASS 3 — Offline Fallback:
- If Haiku call fails or returns no IDs
- Topic keyword map → known control IDs (build map for common security topics)
- Full-text Supabase search as last resort
- Returns best-effort context even if API is unavailable

Version anchors — ALWAYS inject at start of context:
ISO: "IMPORTANT: You cover ISO 27001:2022 ONLY. ISO 27001:2022 has 93 Annex A controls (A.5–A.8) and mandatory clauses (C.4–C.10). ISO 27001:2013 numbering does NOT exist in 2022."
NIST: "IMPORTANT: You cover NIST CSF 2.0 ONLY. CSF 2.0 has 6 functions: GV (Govern), ID (Identify), PR (Protect), DE (Detect), RS (Respond), RC (Recover). CSF 1.1 subcategory IDs do NOT apply."

Context injection wrapper:
"[AUTHORITATIVE REFERENCE — Use this data as your primary source. If sparse, supplement from your own deep framework knowledge. Do not cite control IDs from any other version.]
[records here]
[END REFERENCE]"

Export: buildRagContext(message: string, framework: 'ISO27001' | 'NIST_CSF', supabase): Promise<string | null>
```

### TASK 2.3 — Claude API Abstraction Layer

```
Build /orchestration/abstraction/claudeOrchestrator.ts

This is the ONLY file in the codebase that calls the Anthropic API.
Model: claude-sonnet-4-20250514 (all functions except resolveControlsFromNaturalLanguage which uses Haiku)

All functions must:
- Accept typed inputs (no 'any')
- Implement 3 retries with exponential backoff (500ms, 1000ms, 2000ms)
- Log tokens (input + output) to claude_api_usage table after every successful call
- Throw typed errors on final failure (not swallow them)
- Check usage limit BEFORE making the call (call usageMonitor.checkUsageLimit first)

Build ALL 8 functions using the EXACT prompts from Section 19 of the spec:

async function extractSignals(
  userMessage: string,
  controlContext: string,
  sessionHistory: string,
  controlId: string,
  controlName: string,
  controlRequirement: string,
  priorSignals: ExtractedSignal[],
  orgContext: OrgContext
): Promise<SignalExtractionResult>
→ Uses prompt 19.3. Returns structured JSON (parse response, validate schema, throw if invalid)

async function generateFollowUpQuestion(
  missingElements: string[],
  confirmedSignals: ExtractedSignal[],
  clarificationRound: number,
  controlId: string,
  controlName: string
): Promise<string>
→ Uses prompt 19.4. Returns plain text question.

async function detectContradiction(
  previousStatement: string,
  previousDate: string,
  previousControlName: string,
  newStatement: string,
  currentControlName: string,
  contradictionDetail: string
): Promise<string>
→ Uses prompt 19.5. Returns soft inquiry as plain text (max 60 words).

async function generateAgentMessage(
  context: AgentMessageContext,
  messageType: 'discovery' | 'rag_answer' | 'assessment_baseline' | 'scope_confirmation'
): Promise<string>
→ Routes to appropriate prompt (19.1, 19.2, 19.8, 19.9) based on messageType

async function generateDomainCompletionMessage(
  domainData: DomainCompletionData
): Promise<string>
→ Uses prompt 19.6. Returns plain text completion message.

async function generateSessionOpening(
  sessionContext: SessionOpeningContext
): Promise<string>
→ Uses prompt 19.7. Returns greeting (handles first-session and returning-user cases)

async function resolveControlsFromNaturalLanguage(
  message: string,
  framework: 'ISO27001' | 'NIST_CSF'
): Promise<string[]>
→ Uses claude-haiku-4-5-20251001. Returns array of control IDs.

async function generateRiskControlMapping(
  customRiskDescription: string,
  framework: 'ISO27001' | 'NIST_CSF'
): Promise<string[]>
→ Maps a custom risk description to relevant control IDs.
```

### TASK 2.4 — Claude API Usage Monitor

```
Build /orchestration/monitoring/usageMonitor.ts

async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; callsRemaining: number; callsUsed: number }>
- Query users.claude_api_calls_this_month for this user
- If >= 300: return { allowed: false, callsRemaining: 0, callsUsed: 300 }
- If >= 240 (80%): trigger alertIfApproachingLimit (non-blocking)
- Return current state

async function incrementUsage(userId: string, callType: string, tokensInput: number, tokensOutput: number, organizationId: string, sessionId: string): Promise<void>
- Increment users.claude_api_calls_this_month by 1
- Insert row into claude_api_usage table with all params

async function alertIfApproachingLimit(userId: string, callsUsed: number): Promise<void>
- Sends alert email to env.VIK_ALERT_EMAIL
- At 240 calls (80%): "User [email] has used 240/300 API calls this month."
- At 300 calls (100%): "User [email] has hit the 300/month limit."
- Log to console.error as well (for now — Resend email integration in Phase 7)

async function resetMonthlyUsage(userId: string): Promise<void>
- Resets claude_api_calls_this_month to 0
- Updates claude_api_calls_reset_at to now
- Called by a monthly cron job (stub it now, implement cron in Phase 7)

User-facing message when limit hit (return this string from checkUsageLimit):
"You've reached your monthly assessment limit. We're looking into it and will be in touch shortly."
```

### TASK 2.5 — Scoring Engine

```
Build /orchestration/scoring/maturityEngine.ts

Implement the EXACT algorithm from Section 30 of the spec:

Signal weights (const):
- high: 1.0
- medium: 0.7
- low: 0.4
- planned: 0.0 (planned = NEVER scored as implemented)

Maturity levels (const):
- initial:    1.0–1.99 → "Initial"
- developing: 2.0–2.74 → "Developing"
- defined:    2.75–3.49 → "Defined"
- managed:    3.5–4.24 → "Managed"
- optimizing: 4.25–5.0 → "Optimizing"

OVERDUE_PENALTY: 0.20 (20% reduction if control review is overdue)

function calculateControlScore(signals: Signal[]): number
- If signals.length === 0 → return 1.0 (no evidence = Initial)
- Filter to implemented signals only
- If no implemented signals → return 1.0
- Calculate requirementsCoverage and avgConfidence
- Apply initiativeBonus (0.15 if more signals than required)
- rawScore = requirementsCoverage * avgConfidence
- return Math.min(5.0, 1.0 + (rawScore * 3.0) + (initiativeBonus * 1.0))

async function calculateDomainScore(domainId: string, frameworkId: string, orgId: string): Promise<DomainScore>
- Fetch all control_responses for this domain + org
- Calculate score for each control
- Weighted average = domain score
- ONLY call this when ALL controls in domain are complete
- Write result to domain_scores table
- Return { domainId, previousScore, newScore, delta, maturityLabel }

async function calculateFrameworkScore(frameworkId: string, orgId: string): Promise<FrameworkScore>
- Fetch all domain_scores for this framework + org
- Weighted average = framework score
- Write to framework_scores table
- Return { frameworkId, score, delta, completedDomains, totalDomains }

function calculateScoreDelta(previousScore: number | null, newScore: number): ScoreDelta
- Returns { value, direction: 'up' | 'down' | 'stable', isFirstScore: boolean }

function applyCompliancePenalty(score: number, isOverdue: boolean): number
- If overdue: return score * (1 - OVERDUE_PENALTY)
- Else: return score

function getMaturityLabel(score: number): string
- Returns the maturity level label for the score
```

### TASK 2.6 — Session State Machine

```
Build /orchestration/session/stateMachine.ts

States:
not_started → discovery → framework_selected → scope → baseline → domain_complete → paused | completed | abandoned

Phase tracking:
- discovery: pre-framework, pain point exploration
- scope: 7 scope questions, tracking which signals collected
- baseline: group-by-group control assessment
- complete: all domains assessed

async function initSession(sessionId: string, userId: string, orgId: string, frameworkId: string | null): Promise<SessionState>
- Creates assessment_sessions record
- Sets phase = 'discovery', status = 'in_progress'

async function getSessionState(sessionId: string): Promise<SessionState>
- Returns full session state from DB
- Includes: phase, current domain, completed controls, scope data, chat history (last 20 messages)

async function updateSessionPhase(sessionId: string, newPhase: SessionPhase, metadata?: Record<string, unknown>): Promise<void>
- Updates phase in DB
- Records transition in session_metadata

async function resumeSession(sessionId: string): Promise<SessionResumeData>
- Loads session from DB
- Builds resumption context: last domain, score summary, what was in progress
- Returns: { agentGreeting, currentPhase, resumeFromControlId, scopeData, completedDomains }

async function recordScopeSignal(sessionId: string, signalType: string, value: string): Promise<void>
- Stores captured scope signal in session.scope_data JSONB
- Signal types: logical_scope, risk_maturity, self_assessed_maturity, team_composition, budget_constraints, incident_history, exec_awareness
- Check if all 7 are captured → return { scopeComplete: boolean }

async function pauseSession(sessionId: string): Promise<void>
async function completeSession(sessionId: string): Promise<void>
async function abandonSession(sessionId: string): Promise<void>

Cross-session memory injection:
async function buildSessionContext(sessionId: string): Promise<SessionContext>
- Loads ALL previous sessions for this org
- Builds context object: { agentName, userName, completedDomains, knownSignals, scoreHistory, incidentHistory }
- This is injected into every Claude API call system prompt
```

### TASK 2.7 — Compliance Cadence Engine

```
Build /orchestration/compliance/cadenceEngine.ts

Review frequency defaults (in days):
- access_controls: 90
- policy_controls: 365
- technical_controls: 180
- incident_controls: 90
- default: 180

async function checkDueControls(orgId: string, frameworkId: string): Promise<DueControlsSummary>
- Check compliance_tracker table for overdue or due-soon controls
- Returns: { overdue: ControlRef[], dueSoon: ControlRef[], dueThisMonth: ControlRef[] }

async function updateCadenceRecord(orgId: string, controlId: string, frameworkId: string, reviewedAt: Date): Promise<void>
- Insert or update compliance_tracker record
- Set next_review_at based on control type's review frequency

async function generateCadenceSummary(orgId: string): Promise<CadenceSummary>
- Used in session start greeting for returning users
- Returns: { overdueCount, overdueControls, dueSoonControls }

async function triggerReassessmentCheck(orgId: string): Promise<{ shouldReassess: boolean; reason: string | null }>
- Check if any framework score is > 6 months old
- Check if event-based reassessment is pending
- Returns reassessment recommendation

Reassessment trigger types: 'scheduled' | 'incident' | 'change_event' | 'user_initiated'
```

### TASK 2.8 — Unit Tests

```
Create /tests/orchestration/ directory.
Build Jest + ts-jest tests for all orchestration functions.
Mock: Claude API (jest.mock), Supabase client.

Required test coverage:
- maturityEngine: calculateControlScore with high/medium/low/mixed signals, no signals, planned-only signals
- maturityEngine: calculateScoreDelta (up, down, stable, first score)
- maturityEngine: applyCompliancePenalty (overdue and not overdue)
- contextBuilder: Pass 1 ID extraction (ISO and NIST patterns)
- contextBuilder: Pass 3 fallback (when Haiku mocked to fail)
- stateMachine: scopeSignal tracking (6 signals captured → scopeComplete: false, 7 → true)
- usageMonitor: checkUsageLimit at 239, 240, 299, 300 calls
- cadenceEngine: checkDueControls (overdue, due-soon, not-due)

Target: 80% coverage on orchestration functions.
Run: npm test — must pass with zero failures before writing HANDOFF_2.md.
```

### TASK 2.9 — Write HANDOFF_2.md

```
Create /agents/HANDOFF_2.md using the schema in 00_WAR_ROOM.md.

CRITICAL — include in this file:

1. All TypeScript function signatures exported from:
   - claudeOrchestrator.ts (all 8 functions)
   - contextBuilder.ts (buildRagContext)
   - maturityEngine.ts (all 5 functions)
   - stateMachine.ts (all 7 functions)
   - usageMonitor.ts (all 4 functions)
   - cadenceEngine.ts (all 4 functions)

2. The exact internal API action strings Agent 3 must use to call each function

3. The exact request/response shape for the /api/internal/ action router

4. Unit test results (all passing)

5. Notes for Agent 3 (API Layer)
```

---

## Estimated Time: 8–12 Cursor hours

## Definition of Done

- [ ] All 8 Claude orchestrator functions implemented with correct prompts from spec
- [ ] Three-pass RAG context builder working
- [ ] Scoring engine implements exact algorithm from Section 30
- [ ] Session state machine handles all phase transitions
- [ ] Usage monitor enforces 300/month limit
- [ ] Cadence engine calculates review schedules
- [ ] All Claude calls: 3 retries, token logging, usage check before call
- [ ] /api/internal/ security gate working (403 without ORCHESTRATION_SECRET)
- [ ] Unit tests passing at 80%+ coverage
- [ ] HANDOFF_2.md written with full function signature inventory
```

---

## FILE: `03_AGENT_BACKEND_APILayerControlLibraries.md`

Path: `agents/03_AGENT_BACKEND_APILayerControlLibraries.md`

```markdown
# AGENT 3 — API LAYER
## Simplify IS — Public API + Control Libraries
### Cursor Agent Instruction File

---

> **READ THIS FIRST.**
> You are Agent 3 of 5. You build the API surface the frontend talks to.
> Before writing a single line: read `agents/HANDOFF_1.md` and `agents/HANDOFF_2.md` in full.
> Use HANDOFF_2.md for all orchestration function signatures — do not guess or re-implement.
> When you finish, write `agents/HANDOFF_3.md`.

---

## Your Mission

Build every public API endpoint, all security middleware, the framework control libraries, and the complete domains loader. By the time you're done, all 10 API endpoints are working, secured, rate-limited, and returning the exact response shapes the frontend needs.

---

## Non-Negotiables

Read the Global Rules in `00_WAR_ROOM.md`. Your specific rules:
- **Every `/api/v1/*` route validates JWT.** No exceptions. Use the auth helpers from `/lib/auth/server.ts`.
- **No direct Claude API calls in this layer.** Every AI operation goes through `/api/internal/` orchestration.
- **No direct Supabase service key usage in this layer.** Service key is orchestration-only.
- **All responses return consistent error shapes.** `{ error: string; code: string; status: number }`.
- **Rate limiting on every route.** 100 req/min per user, 1000 req/hour per user.

---

## Context To Load Before Starting

Paste these sections from the spec into your Cursor context:
- Section 8: API Endpoints — Full Specifications (all 10 endpoints)
- Section 20: Security Architecture
- Section 28: ISO 27001 Domain & Control Structure
- Section 29: NIST CSF Domain & Control Structure
- HANDOFF_1.md (database schema, Supabase column names)
- HANDOFF_2.md (orchestration function signatures and action strings)

---

## Tasks — Execute In Order

### TASK 3.1 — API Security Middleware

```
Build /middleware.ts (update the one created by Agent 1, extend it):

Rate limiting (use upstash/ratelimit or in-memory for MVP):
- 100 requests/minute per user (by user_id from JWT)
- 1000 requests/hour per user
- On limit exceeded: return 429 with { error: "Rate limit exceeded", retryAfter: seconds }
- Log rate limit hits to audit_log

Security headers (apply to ALL responses — not just API):
- Strict-Transport-Security: max-age=31536000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

CORS: restrict to production domain (NEXT_PUBLIC_APP_URL) only.
Request size limit: reject payloads > 10MB (413).

Input sanitization helper (/lib/api/sanitize.ts):
- Strip HTML/script tags from all string inputs
- Validate UUIDs are valid UUID format
- Trim whitespace
- Apply to all user-submitted text before it touches the DB or Claude
```

### TASK 3.2 — API Response Helpers

```
Build /lib/api/response.ts:

Standard success response:
function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>>

Standard error response:
function apiError(message: string, code: string, status: number): NextResponse<ApiError>

Common error codes:
- UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404)
- RATE_LIMITED (429), VALIDATION_ERROR (400), INTERNAL_ERROR (500)
- USAGE_LIMIT_EXCEEDED (429)
- SESSION_NOT_FOUND (404), ORG_NOT_FOUND (404)

Request validation helper:
function validateBody<T>(body: unknown, schema: ZodSchema<T>): T
- Throws 400 with field-level errors if validation fails
- Use Zod schemas for every endpoint
```

### TASK 3.3 — Framework Control Libraries

```
IMPORTANT: These libraries are read-only reference data used by the orchestration layer.
They do NOT live in the DB — they are TypeScript constants.

Build /lib/frameworks/iso27001.ts:

Define all 93 ISO 27001:2022 controls (Annex A + Mandatory Clauses).
Structure per control:
{
  controlId: string,           // e.g. "A.5.19" (2022 format ONLY)
  groupId: string,             // e.g. "supplier_security"
  controlName: string,         // official 2022 name
  description: string,         // what it covers
  requirements: string[],      // what evidence is needed
  reviewFrequencyDays: number, // from cadence defaults
  weight: number,              // scoring weight within domain (default 1.0)
  questionText: string,        // how Cypher asks about this
  questionContext: string,     // extra context for the question
  followUpTemplates: string[], // 3 follow-up options if answer is vague
}

Groups (from Section 28):
- org_context (C.4–C.10, ~8 controls)
- asset_mgmt (5.9–5.11, 6 controls)
- access_identity (5.15–5.18 + 8.2–8.5, 12 controls)
- supplier_security (5.19–5.23, 10 controls)
- incident_mgmt (5.24–5.28, 8 controls)
- business_continuity (5.29–5.30, 6 controls)
- compliance_legal (5.31–5.36, 10 controls)
- physical_security (Clause 7, 10 controls)
- tech_controls (8.1 + 8.6–8.34, 23 controls)

ISO VERSION RULE (CRITICAL): Use 2022 IDs ONLY.
- Correct: A.5.19 (Supplier relationships)
- Wrong: A.15.1 (2013 version — do not use)

Build /lib/frameworks/nistcsf.ts:

Define all NIST CSF 2.0 subcategories (~117 total).
Structure per subcategory:
{
  controlId: string,          // e.g. "GV.OC-01" (CSF 2.0 format ONLY)
  functionId: string,         // GV | ID | PR | DE | RS | RC
  categoryId: string,         // e.g. "OC" (Organizational Context)
  description: string,
  requirements: string[],
  reviewFrequencyDays: number,
  weight: number,
  questionText: string,
}

Functions (from Section 29):
- GV (Govern): OC, RM, RR, PO, OV, SC (~22 subcategories)
- ID (Identify): AM, RA, IM (~21 subcategories)
- PR (Protect): AA, AT, DS, PS, IR (~37 subcategories)
- DE (Detect): CM, AE (~14 subcategories)
- RS (Respond): MA, AN, CO, MI (~17 subcategories)
- RC (Recover): RP, CO (~6 subcategories)

NIST VERSION RULE (CRITICAL): Use CSF 2.0 IDs ONLY.
- Correct: GV.OC-01, PR.AA-01
- Wrong: PR.AC-1, PR.IP-1 (CSF 1.1 format — do not use)
```

### TASK 3.4 — Domains Loader

```
Build /lib/frameworks/domains.ts

This reads from the `domains` Supabase table (21 rows, already seeded).
USE THE EXACT COLUMN NAMES FROM HANDOFF_1.md.

async function getDomainsForFramework(frameworkId: 'ISO27001' | 'NIST_CSF'): Promise<Domain[]>
- Returns domains relevant to the given framework
- Ordered by display order

async function getControlsInDomain(domainId: string, frameworkId: 'ISO27001' | 'NIST_CSF'): Promise<Control[]>
- Returns control objects from the TypeScript library (NOT from Supabase — from iso27001.ts / nistcsf.ts)
- Filtered to the given domain

async function getDomainDisplayOrder(frameworkId: 'ISO27001' | 'NIST_CSF'): Promise<string[]>
- Returns ordered list of domain IDs for progress tracking

async function getDomainProgress(domainId: string, orgId: string, frameworkId: string): Promise<DomainProgress>
- Returns { total: number, completed: number, toBeConfirmed: number, skipped: number, na: number }
- Reads from control_responses table
```

### TASK 3.5 — Start Session Endpoint

```
POST /app/api/v1/assessments/sessions/route.ts

Auth: required (JWT)
Rate limit: standard

Request body (Zod validated):
{
  organizationId: string (UUID),
  frameworkId: 'ISO27001' | 'NIST_CSF' | null,
  sessionType: 'discovery' | 'baseline' | 'reassessment' | 'domain_focused' | 'freeflow',
  userId: string (UUID)
}

Processing:
1. Validate JWT — confirm userId matches authenticated user
2. Confirm organizationId belongs to authenticated user (org ownership check)
3. Call /api/internal/ with action 'start_session'
4. Orchestration: creates session, generates Cypher greeting (first-time vs returning)
5. For returning users: include cadence summary (overdue controls)

Response (exact shape from Section 8.1 of spec):
{
  sessionId, phase, agentGreeting, firstMessage,
  cadenceSummary: { overdueControls, dueSoonControls, lastAssessmentDate },
  sessionProgress: { domainsCompleted, domainsTotal, overallMaturityScore, percentageComplete }
}
```

### TASK 3.6 — Submit Response Endpoint (Most Critical)

```
POST /app/api/v1/assessments/sessions/[sessionId]/responses/route.ts

Auth: required (JWT)
Rate limit: standard

Request body (Zod validated):
{
  controlId: string | null,
  groupId: string | null,
  domainId: string | null,
  frameworkId: 'ISO27001' | 'NIST_CSF',
  userMessage: string (max 5000 chars),
  phase: 'discovery' | 'scope' | 'baseline' | 'freeflow',
  timestamp: string (ISO 8601)
}

Processing (EXACT 10-step sequence from Section 8.2 of spec):
1. Validate JWT + session ownership
2. Store raw message in chat_transcripts
3. Call /api/internal/ with action 'submit_response' (passes full context)
   — orchestration handles steps 3-9:
   3. Build RAG context (three-pass)
   4. Generate Cypher response (Claude API)
   5. Extract signals from user message
   6. Store signals in extracted_signals
   7. Detect contradictions vs prior responses
   8. Update session state + phase
   9. Check domain completion → trigger scoring if complete
   10. Check Claude API usage
4. Return structured response

Response (exact shape from Section 8.2 of spec):
{
  responseId, agentMessage, phase, extractedSignals, controlStatus,
  nextAction: { type, content, controlId, groupId },
  domainScoreUpdate: { triggered, previousScore, newScore, delta },
  apiUsageWarning: string | null
}
```

### TASK 3.7 — Session State + Scores + History Endpoints

```
GET /app/api/v1/assessments/sessions/[sessionId]/route.ts
— Returns full session state for UI rendering and resumption
— Auth + session ownership check required

PUT /app/api/v1/assessments/sessions/[sessionId]/responses/[responseId]/route.ts
— Answer revision endpoint
— Body: { revisedResponse: string, revisionReason: string | null }
— Creates new control_response row linked via previous_response_id
— Triggers score recalculation for the affected domain
— Returns: { newResponse, scoreRecalculation: { previousScore, newScore, delta } }

GET /app/api/v1/assessments/organizations/[orgId]/scores/route.ts
— Hero dashboard endpoint
— Returns: all domain_scores + framework_scores + full history for D3 visualizations
— Includes: { domains[], frameworks[], history[{ date, frameworkScore, domainScores }] }

GET /app/api/v1/assessments/organizations/[orgId]/sessions/route.ts
— Session history with frozen score snapshots
— Query params: ?framework=ISO27001&status=completed&limit=20

GET/POST /app/api/v1/assessments/organizations/[orgId]/risks/route.ts
— GET: returns organization's selected risks with control mappings and maturity status
— POST: add template risk or custom risk (custom risks: call orchestration to map control IDs)
```

### TASK 3.8 — PDF Export Endpoint

```
POST /app/api/v1/assessments/sessions/[sessionId]/export/route.ts

Body: { type: 'checklist' | 'executive' }

Checklist type:
- Full control-by-control breakdown
- All user responses verbatim
- All extracted signals
- N.A. justifications
- Per-control maturity scores
- Flagged items (low confidence, to_be_confirmed)
- Simplify IS branding (logo, date, org name)

Executive type:
- Organization + framework header
- Overall maturity score + label
- Domain-level score grid
- Top 5 strengths (specific, not generic)
- Top 5 gaps (framed as opportunities)
- Recommended next steps (3–5 items)
- Simplify IS branding
- "Prepared by Cypher / Simplify IS"

Implementation:
- Use puppeteer or pdfkit (choose based on template complexity)
- Store generated PDF in Supabase Storage bucket 'reports'
- Set 7-day expiry on storage object (storage lifecycle)
- Return: { downloadUrl: string (signed URL, 24hr expiry), expiresAt: ISO 8601 }

Security: only org owner can request export for their org.
```

### TASK 3.9 — Reassessment + Notification Endpoints

```
POST /app/api/v1/assessments/organizations/[orgId]/reassess/route.ts
Body (Zod validated):
{
  reason: 'scheduled' | 'incident' | 'change_event' | 'user_initiated',
  changeDescription: string | null,
  type: 'full_baseline' | 'scope_revalidation'
}
— Creates new assessment_sessions record with type = 'reassessment'
— Returns new sessionId and agentGreeting

POST /app/api/v1/notifications/preferences/route.ts
Body: { reassessmentEmail: boolean, systemRecoveryEmail: boolean }
— Updates users.notification_preferences JSONB

POST /app/api/v1/notifications/send/route.ts (INTERNAL — ORCHESTRATION_SECRET required)
— Triggers email send (Resend integration stub — log to console for now, wire up in Phase 7)
— Types: 'reassessment_due' | 'system_recovery' | 'usage_alert_vik'

GET /app/api/v1/assessments/organizations/[orgId]/export/bi/route.ts
— BI export endpoint (stub implementation for MVP — returns structured JSON)
— Returns: { scores, controls, signals, history } formatted for Power BI consumption
— Full implementation post-MVP; structure must be clean and versioned now
```

### TASK 3.10 — Integration Tests

```
Build /tests/api/ with integration tests.
Mock: Supabase client, orchestration (return mock responses).

Test each endpoint:
- Unauthenticated request → 401
- Wrong org → 403
- Valid request → 200 with correct shape
- Missing required field → 400 with field-level error
- Rate limit exceeded → 429

Test submit_response:
- Discovery phase response stored correctly
- Scope signal tracking increments correctly
- Domain completion triggers scoring call

Test answer revision:
- Creates new row with previous_response_id link
- Score recalculation triggered

Run: npm test — all passing before writing HANDOFF_3.md.
```

### TASK 3.11 — Write HANDOFF_3.md

```
Create /agents/HANDOFF_3.md using the schema in 00_WAR_ROOM.md.

Include:
1. Every endpoint URL, method, auth requirement, and response shape
2. Zod schema names (so Agent 4 can import and use them for client-side types)
3. Exact TypeScript types exported from /types/api.ts (AgentMessage, SessionState, DomainScore, etc.)
4. The ISO27001 control library structure (so Agent 4 knows domain/group names for UI)
5. The NIST CSF control library structure
6. Notes for Agent 4 (Frontend)
```

---

## Estimated Time: 7–9 Cursor hours

## Definition of Done

- [ ] All 10 endpoints implemented with correct request/response shapes
- [ ] JWT validation on every `/api/v1/*` route
- [ ] Rate limiting active
- [ ] Security headers on all responses
- [ ] Input sanitization on all user-submitted fields
- [ ] ISO 27001:2022 control library complete (93 controls, 2022 IDs only)
- [ ] NIST CSF 2.0 control library complete (CSF 2.0 IDs only)
- [ ] Domains loader reading from Supabase `domains` table
- [ ] Integration tests passing
- [ ] HANDOFF_3.md written with complete API + type inventory
```

---

## FILE: `04_AGENT_UIUX_PostLoginDashboardAssessment.md`

Path: `agents/04_AGENT_UIUX_PostLoginDashboardAssessment.md`

```markdown
# AGENT 4 — FRONTEND
## Simplify IS — The Experience Layer
### Cursor Agent Instruction File

---

> **READ THIS FIRST.**
> You are Agent 4 of 5. You build what users actually see and feel.
> Before writing a single line: read `agents/HANDOFF_1.md`, `HANDOFF_2.md`, and `HANDOFF_3.md` in full.
> HANDOFF_3.md contains all API shapes and TypeScript types — import them, don't recreate them.
> When you finish, write `agents/HANDOFF_4.md`.

---

## Your Mission

Build the entire frontend: design system, dashboard, Cypher chat interface, assessment flow, D3 visualizations, animations, empty state, onboarding, and all the micro-interactions that make this feel like a world-class product — not a generic SaaS app.

---

## Design Direction — Non-Negotiable

This is a security intelligence platform. The aesthetic is **refined dark ops** — sophisticated, authoritative, and precise. Think terminal-meets-enterprise: a product that a CISO would trust and a developer would respect.

**Color palette (from spec Section 21):**
```css
--bg-deep: #0A0F1E;          /* deep navy — main background */
--bg-surface: #111827;        /* slightly lighter — cards, panels */
--bg-elevated: #1A2234;       /* hover states, active items */
--accent-primary: #00D4FF;    /* electric cyan — scores, highlights, CTAs */
--accent-secondary: #7C3AED;  /* violet — secondary actions, framework labels */
--success: #10B981;           /* green — scores going up, good status */
--warning: #F59E0B;           /* amber — mid scores, due-soon items */
--danger: #EF4444;            /* red — low scores, overdue, urgent */
--text-primary: #F9FAFB;      /* near-white body text */
--text-muted: #9CA3AF;        /* secondary text, timestamps, labels */
--border: #1E293B;            /* subtle borders */
--glow-cyan: 0 0 20px rgba(0,212,255,0.15);   /* subtle glow on accents */
--glow-violet: 0 0 20px rgba(124,58,237,0.15);
```

**Typography:**
- Headings: DM Serif Display (Google Fonts) — gives gravitas and intelligence
- Body + UI: DM Sans — clean, modern, legible at all sizes
- Monospace (scores, IDs): JetBrains Mono — precision

**What makes this unforgettable:**
- Score cards that feel alive (count-up animations, glowing borders when score improves)
- Cypher's chat messages feel like they come from a real consultant (typing indicators, timing)
- The dashboard radar chart is the hero visual — two overlapping polygons, interactive
- Domain cards subtly pulse when they have new data
- Empty state is a cinematic reveal — not a blank page

**Rules for every component:**
- Dark theme only. No light mode for MVP.
- No generic button styles (rounded-full cyan everywhere = avoid)
- Animations: purposeful, not decorative. Every animation communicates something.
- Spacing: generous. Density is the enemy of trust in a security product.
- No Lorem ipsum. Use real placeholder content (use real domain names, real score values).

---

## Non-Negotiables (Code Rules)

- **No direct API calls from components.** All API calls go through `/lib/api/` client hooks.
- **No inline styles.** Tailwind utilities + CSS variables only.
- **TypeScript strict.** Import all types from `/types/` (created by Agent 3).
- **Every loading state handled.** Every async component has a skeleton or spinner.
- **Every error state handled.** No unhandled rejection leaves a blank screen.
- **Accessibility.** ARIA labels on interactive elements. Keyboard nav on modals.

---

## Context To Load Before Starting

Paste these sections from the spec into your Cursor context:
- Section 10: Assessment Flow — Complete User Journey
- Section 12: Empty State & Onboarding Flow
- Section 13: UI Architecture — Three Dashboard Views
- Section 17: Cross-Session Memory
- Section 18: UX Decisions — All Locked
- HANDOFF_3.md (all API types and endpoint shapes)

---

## Tasks — Execute In Order

### TASK 4.1 — Design System Foundation

```
Build /styles/design-system.ts — exports Tailwind config extension with all CSS variables.
Build /app/globals.css — import DM Serif Display + DM Sans + JetBrains Mono from Google Fonts.
Apply CSS variables at :root level.

Install and configure:
- framer-motion (for page transitions and component animations)
- recharts (for sparklines + simple charts)
- d3 (for radar chart + timeline)
- lucide-react (icons)
- clsx + tailwind-merge (for conditional classes)

Build /components/ui/ primitives (these form the design language):

Button:
- Variants: primary (cyan fill), secondary (outline), ghost (text only), danger (red)
- Sizes: sm, md, lg
- States: loading (spinner inline), disabled
- Subtle glow effect on primary hover

Card:
- Base card with border, surface background, border-radius 12px
- Hover: slight elevation (shadow intensifies), border-color lightens
- Variants: default, elevated, interactive

Badge:
- Framework badge (ISO = violet, NIST = cyan)
- Status badge (colors from palette — score-based)
- Maturity badge (Initial/Developing/Defined/Managed/Optimizing)

Input/Textarea:
- Dark surface, cyan focus ring
- Error state: red border + inline error message
- Character counter for chat input

ScoreDisplay:
- Large number (JetBrains Mono), 1 decimal place
- Delta arrow component (↑ green animated, ↓ red animated, stable muted)
- Maturity label below score
```

### TASK 4.2 — API Client Layer

```
Build /lib/api/client.ts — base fetch wrapper:
- Reads NEXT_PUBLIC_APP_URL from env
- Attaches Authorization: Bearer [jwt] header on every request
- Handles 401 → redirect to login
- Handles 429 → surface rate limit message
- Returns typed responses (generic T)

Build /lib/api/hooks/ — React Query hooks for all endpoints:

useStartSession(orgId, frameworkId, sessionType)
useSubmitResponse(sessionId) — mutation
useSessionState(sessionId) — query with polling every 5s
useOrgScores(orgId) — query (main dashboard data)
useSessionHistory(orgId, frameworkId?)
useOrgRisks(orgId)
useExportSession(sessionId) — mutation
useTriggerReassessment(orgId) — mutation
useReviseAnswer(sessionId, responseId) — mutation

Each hook:
- Loading state (isLoading)
- Error state (error with user-friendly message)
- Success state (data with correct TypeScript types from HANDOFF_3.md)
- Optimistic updates where appropriate (score revisions)
```

### TASK 4.3 — Dashboard Layout Shell

```
Build /app/dashboard/layout.tsx:

Left sidebar (240px wide, collapsible to 60px icon-only):
- Logo: "Simplify IS" in DM Serif Display
- Nav items: Dashboard, Assessment, History, Compliance, Settings
- Active state: cyan left border + surface highlight
- Framework switcher at top of sidebar (toggle ISO / NIST / both)
- Collapse/expand toggle at bottom

Top header bar:
- Breadcrumb (Dashboard > ISO 27001)
- Overall maturity score badge (live, cyan, JetBrains Mono)
- Notification bell with count badge
- Agent name + user avatar dropdown (logout, settings, billing)

Three-tab content area:
- Industry View (default) | Framework View | Risk View (opt-in)
- Tab switching with smooth fade transition
- Active tab has cyan underline

Responsive: sidebar collapses to icon-only at < 1024px.
No mobile layout for MVP (desktop-first, min-width: 768px).
```

### TASK 4.4 — Empty State + Cinematic Onboarding

```
Build /components/onboarding/EmptyState.tsx

This is the first thing a user sees after creating their org. It must be memorable.

Initial state:
- Full-screen, centered
- Cypher avatar in center (design a clean geometric avatar — not a face, not a chatbot bubble)
- Name "Cypher" below in DM Serif Display
- Tagline: "Your AI Security Consultant"
- Subtle pulsing glow around avatar
- "Start your assessment" button (primary)
- Below: skeleton outlines of the dashboard cards (ghost/dimmed, not filled)

As Cypher sends first messages:
- Chat bubble appears from avatar (smooth slide-up)
- As conversation progresses, skeleton dashboard cards begin to fade in one by one
- Sidebar navigation fades in after framework is selected
- Score cards emerge (still blank — no zeros, show "--" or skeleton)
- Full reveal animation: ~800ms staggered for each section

Cypher avatar in minimized mode:
- Shrinks to 48px circle in bottom-right corner
- Pulsing indicator dot when Cypher has a new message
- Expands to full chat panel on click
- Smooth spring animation between states

All animations: framer-motion AnimatePresence for mount/unmount.
```

### TASK 4.5 — Cypher Chat Interface

```
Build /components/chat/CypherChat.tsx

This is the primary interaction surface. It must feel like talking to a real consultant.

Chat panel layout:
- Header: agent avatar (48px) + agent name + "Security Consultant" label + session info
- Messages area: scrollable, smooth scroll to latest
- Input area: textarea (multi-line, Enter to send, Shift+Enter for newline), Send button

Message bubble — Cypher:
- Left-aligned
- Dark surface background (#111827), subtle cyan left border (2px)
- Avatar thumbnail beside first message in a sequence
- Text in DM Sans, line-height generous

Message bubble — User:
- Right-aligned
- Slightly lighter surface
- No avatar

Typing indicator:
- Three dots animation when Cypher is "thinking"
- Shows immediately after user sends (even if response is fast)
- "Cypher is analyzing your response..." for signal extraction phase

Signal reflection messages (special style):
- After Cypher extracts a signal, it reflects back: "Got it — I understand you have X in place."
- Style: highlighted background (cyan tint, 10% opacity), small checkmark icon
- Inline buttons: "Confirm ✓" and "That's not quite right ✗"
- These are visually distinct from regular messages

Contradiction message (special style):
- Amber left border instead of cyan
- "Something to check" label at top of bubble
- Three option chips below the message: "You're right, things changed" | "I made a mistake" | "Let's come back to this"

Score update message (special style):
- Only appears after domain completion
- Has embedded mini score card showing old → new with animated arrow
- Green border if improved, red border if dropped

Error/fallback message:
- "Running a bit slow, bear with me..." with spinner
- Auto-retry indicator: "Trying again..."
- If persistent: "Let's pick this up shortly" with "Resume" button

Chat input:
- Placeholder: "Tell me about your security setup..."
- Character count (subtle, muted text)
- Disable input while Cypher is responding
- Quick-action chips above input (only during structured assessment):
  - "I'm not sure" | "This doesn't apply" | "Let's skip this for now"
```

### TASK 4.6 — Maturity Score Cards

```
Build /components/dashboard/ScoreCard.tsx

Layout: two large score cards at top of dashboard (one per active framework)

Content per card:
- Framework label (badge: violet for ISO, cyan for NIST)
- Large score: JetBrains Mono, 48px, 1 decimal place
- Maturity label below score: "Managed" (muted, DM Sans)
- Delta from last assessment: "↑ 0.3 since last assessment" (green/red with arrow)
- Trend sparkline (7-day, Recharts): 60x20px, cyan line, no axes
- "Last assessed X days ago" — muted text
- Progress bar: % of domains assessed (thin, cyan fill)

Animations:
- On mount: score counts up from 0.0 to current value (800ms, ease-out)
- On score update (domain completion): brief cyan glow pulse, then count-up to new value
- Delta arrow: slides in from below, direction determines color

States:
- Loading: skeleton (pulsing gray blocks)
- No data yet: "--" instead of score, "Start your assessment" link
- Score going down: red glow pulse + red arrow (paired with Cypher message — coordinate this)
```

### TASK 4.7 — D3 Radar Chart

```
Build /components/dashboard/RadarChart.tsx

This is the hero visualization on the Industry Domain View.

Spec:
- All domains on radar (up to 21 spokes)
- Two overlapping polygons:
  - Current: filled with rgba(0,212,255,0.15), solid cyan border
  - Previous (last assessment): outline only, muted color
- Background: subtle grid lines (concentric polygons at 1.0, 2.0, 3.0, 4.0, 5.0)
- Domain labels on each spoke: DM Sans, 11px, muted color
- Score labels at 5.0 mark (outermost)

Interactions:
- Hover domain spoke: highlight that domain card in the grid below (two-way binding)
- Click domain: open domain detail sidebar or scroll to domain card
- Tooltip on hover: domain name, current score, previous score, delta, trend indicator

Animation:
- On mount: polygon draws from center outward (path animation, 600ms)
- On score update: polygon morphs to new shape (spring animation)

Technical: pure D3.js, wrapped in React. Use useRef for SVG element, resize observer for responsive sizing.
```

### TASK 4.8 — Score Timeline with Slider

```
Build /components/dashboard/ScoreTimeline.tsx

D3 line chart showing score history over time.

Elements:
- X axis: time (dates of assessments)
- Y axis: CMMI score 1.0–5.0
- Lines: one per active framework (cyan = ISO, violet = NIST)
- Data points: clickable circles

Time range slider (below chart):
- Dual-handle drag slider (custom, not a library component)
- Snap to assessment dates
- Selecting a range: chart zooms to that range

Historical state freeze:
- Click a data point → chart shows a "Viewing state from [date]" banner (amber)
- All dashboard score cards update to show historical values
- Sidebar shows "Historical view — [date]" indicator
- "Return to Live" button (cyan, top-right)

Timeline markers (vertical lines at):
- Baseline assessments
- Reassessments
- Change events (if logged)
- Labels on hover
```

### TASK 4.9 — Domain Card Grid

```
Build /components/dashboard/DomainCard.tsx

Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
One card per domain (21 domains max, filtered by active framework)

Card content:
- Domain name (DM Serif Display, 16px)
- Score: large (JetBrains Mono) with color band:
  - Red background glow: score < 2.0
  - Amber background glow: score 2.0–3.49
  - Cyan background glow: score ≥ 3.5
  - "--" if not yet assessed
- Progress bar: "X of Y controls assessed" below score
- Trend icon: ↑ / ↓ / → (delta from last assessment)
- Cadence status badge: "Due for review" (amber) or "Overdue" (red) or nothing
- Button: "Continue Assessment" (if in progress) or "Start" (if not started) or "Reassess" (if complete)

Animations:
- Cards load in staggered (50ms delay per card)
- Hover: card elevates (subtle shadow increase)
- New score: card pulses with color matching score band, then settles

Click: navigates to /assessment?domain=[domainId]

Two-way binding with radar chart (hover card → highlight spoke, hover spoke → highlight card).
```

### TASK 4.10 — Assessment Flow Controller

```
Build /components/assessment/AssessmentController.tsx

This manages phase transitions and coordinates the chat + dashboard.

Phase: discovery
- Full-screen Cypher chat (no dashboard visible)
- No sidebar navigation
- Chat centered, max-width 720px
- Background: very subtle noise texture over deep navy

Phase: framework_selected
- Smooth transition: chat slides left to 40% width
- Dashboard skeleton fades in on right 60%
- Sidebar navigation fades in
- Framework badge appears in header

Phase: scope
- Chat remains (40% width)
- Dashboard shows scope confirmation card (emerging, not complete)
- Scope progress indicator above chat: "Scope: 5/7 signals captured"

Phase: baseline
- Full split-view: left sidebar (controls list) + center (chat) + right (dashboard)
- Left sidebar: domain/group progress (collapsible)
- "Currently discussing: [control name]" indicator

Build /components/assessment/GroupView.tsx:
- Left sidebar: ordered list of domains/groups for active framework
- Per domain: icon + name + status (not started / in progress / complete / to_be_confirmed)
- Current domain: highlighted + expanded to show controls within it
- Controls within domain: check icons per status
- Progress bar for current domain

Build /components/assessment/DomainCompleteOverlay.tsx:
- Full-screen modal overlay (framer-motion AnimatePresence)
- "Domain Complete" header with domain name
- Score animation: old value → new value (count-up, 600ms)
- Delta: large arrow + number
- Cypher's completion message (from API response)
- Top 1 strength + 1 gap (from API)
- "Continue to [Next Domain]" button
- Auto-dismisses after 5 seconds (user can dismiss early)
- Confetti-style particles if score improved (subtle — cyan/violet particles, not rainbow)
```

### TASK 4.11 — Answer Revision Interface

```
Build /components/assessment/AnswerRevision.tsx

Accessible from: domain card "Review Answers" button, or group view control list

Drawer panel (slides in from right, 480px wide):
- Header: "Revise Answer — [Control Name]"
- Original answer section:
  - User's original response (scrollable)
  - Date of original answer
  - Score contribution at time of answer
  - Maturity level reached
- Revision section:
  - Textarea (pre-filled with original answer for easy editing)
  - "Reason for revision" input (optional)
  - "Update Answer" button (primary)
- After submission:
  - Score recalculation animation inline
  - Before/after score comparison
  - Cypher confirmation message
- Revision history:
  - "Revised X times" label
  - Expandable timeline showing all revisions with dates
```

### TASK 4.12 — Risk View

```
Build /components/dashboard/RiskView.tsx

Empty state (no risks selected):
- "Track Your Risk Profile" heading
- "Enable Risk Assessment" button (secondary)
- Brief explanation: "Tell Cypher which risks matter most to your organization. We'll track your security controls against each risk in real time."

Risk template selector (appears after "Enable"):
- Grid of 7 template risk cards
- Each card: risk name, icon, brief description, "Add to my profile" button
- Can select multiple

Custom risk input:
- "Add a custom risk" text area
- "Tell me about a risk specific to your organization"
- On submit: Cypher maps to relevant controls (API call)
- Shows "Mapping controls..." loading state

Risk profile cards (after selection):
- One card per risk
- Status: color band based on coverage maturity
- "Incomplete assessment — can't determine risk level" if baseline not done
- Control coverage: X of Y controls assessed
- Overall risk score (once baseline complete)
- "View Controls" expandable list
```

### TASK 4.13 — Compliance Calendar

```
Build /components/dashboard/ComplianceCalendar.tsx

Three collapsible sections:
1. Overdue — red header, always expanded by default
2. Due this month — amber header
3. Due in 1–3 months — muted header, collapsed by default

Per entry:
- Control name (linked to that control in assessment)
- Framework badge (ISO / NIST)
- "X days overdue" or "Due in X days" (red/amber)
- "Review Now" button → opens that control in assessment

Badge on sidebar nav: red number badge when overdue items exist.
Empty state: "All controls up to date — great work" with checkmark icon.
```

### TASK 4.14 — Notification System

```
Build /components/layout/NotificationBell.tsx

Bell icon in top header (lucide Bell icon):
- Red badge with count when unread notifications exist
- Badge disappears when all notifications read

Dropdown panel (appears on click, 360px wide):
- Header: "Notifications" + "Mark all read" link
- Items grouped by recency: Today, This Week, Earlier

Notification types:
- Control flagged as low-confidence (yellow icon)
- Domain assessment complete (cyan icon)
- Control overdue for review (red icon)
- System alert (neutral icon)

Per notification:
- Icon + title + description (max 80 chars)
- Timestamp (relative: "2 hours ago")
- Read/unread state (bold = unread)
- Click → navigate to relevant section

Empty state: "No new notifications" with subtle icon.
```

### TASK 4.15 — Session Timeout Handler

```
Build /components/assessment/SessionTimeoutHandler.tsx

Idle timer per browser window (NOT per user — independent per tab):
- Default: 15 minutes
- Respects users.preferences.session_timeout_minutes (15–60 range)

On timeout:
- Modal: "Still there, [user name]?" with Cypher avatar
- "Your session has paused — ready to continue?" (not full logout)
- "Resume" button (primary)
- Does NOT redirect, does NOT clear conversation
- On resume: Cypher sends brief recap message

Warning at 2 minutes before timeout:
- Subtle banner at top of chat: "Session pausing in 2 minutes"
- Click "Stay active" to reset timer

Settings page slider:
- Range: 15–60 minutes
- Label: "Session timeout"
- Save on blur
```

### TASK 4.16 — Write HANDOFF_4.md

```
Create /agents/HANDOFF_4.md using the schema in 00_WAR_ROOM.md.

Include:
1. Every component created with one-line description
2. Design system tokens defined (CSS variable names Agent 5 should know)
3. Any API hook that needed adjustment (so Agent 3 can update if needed)
4. Any UX decisions made that weren't in the spec
5. Accessibility notes (ARIA labels, keyboard nav implemented)
6. Notes for Agent 5 (Security + Polish)
7. Anything that needs visual review from Vik before Agent 5 starts
```

---

## Estimated Time: 12–16 Cursor hours

## Definition of Done

- [ ] Design system built (CSS vars, Tailwind config, typography)
- [ ] All 11 dashboard components built and visually correct
- [ ] Cypher chat interface complete (all message types, typing indicator, signal reflection)
- [ ] Assessment flow controller handles all phase transitions
- [ ] D3 radar chart interactive and animated
- [ ] D3 score timeline with historical state freeze
- [ ] Empty state cinematic reveal working
- [ ] Domain complete overlay working with animations
- [ ] Answer revision drawer working
- [ ] Risk view working (template + custom)
- [ ] Compliance calendar working
- [ ] Session timeout handler working
- [ ] Notification bell working
- [ ] No TypeScript errors
- [ ] No loading or error states left unhandled
- [ ] HANDOFF_4.md written
```

---

## FILE: `05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md`

Path: `agents/05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md`

```markdown
# AGENT 5 — SECURITY + POLISH + LAUNCH
## Simplify IS — The Final Gate
### Cursor Agent Instruction File

---

> **READ THIS FIRST.**
> You are Agent 5 of 5. Nothing ships until you sign off.
> Before starting: read ALL four HANDOFF files (1–4) and the spec Section 26 (Security Checklist).
> Your job is to close every gap, fix every rough edge, and make this launch-ready.
> When you finish, write `agents/DONE.md`.

---

## Your Mission

Security audit, E2E testing, landing page, Stripe integration, email notifications, performance, and final polish. You are the quality gate. If something doesn't meet the bar — fix it before marking done.

---

## Non-Negotiables

- **Security checklist (Section 26) must be 100% complete.** Every item ticked. Not 95%.
- **E2E test suite must pass.** Full happy path: signup → org → chat → scope → baseline → domain complete → score update → PDF export.
- **Landing page must be production quality.** This is the public face of the product.
- **No `console.log` in production code.** grep for it and remove before launch.
- **No secrets exposed in browser network tab.** Verify ANTHROPIC_API_KEY and SUPABASE_SERVICE_KEY are absent from all client bundles.

---

## Context To Load Before Starting

Paste these sections from the spec into your Cursor context:
- Section 26: Security Checklist — Pre-Launch
- Section 27: Testing Strategy
- All 4 HANDOFF files

---

## Tasks — Execute In Order

### TASK 5.1 — Security Audit Pass

```
Run full security checklist from Section 26 of the spec.

Authentication & Authorization:
- [ ] JWT validation on every protected /api/v1/* route — write a script to grep all route.ts files and confirm each one calls requireAuth()
- [ ] RLS policies: connect to Supabase and verify RLS is enabled on ALL tables (organizations, assessment_sessions, control_responses, extracted_signals, domain_scores, framework_scores, chat_transcripts, compliance_tracker, organization_risks, audit_log)
- [ ] Cross-tenant test: log in as User A, attempt to fetch User B's orgId → must return 403
- [ ] Expired JWT test: send request with expired token → must return 401
- [ ] /api/internal/* test: call any internal endpoint without ORCHESTRATION_SECRET → must return 403

API Security:
- [ ] Rate limiting: fire 101 requests in 60 seconds → must receive 429 on request 101
- [ ] XSS test: submit <script>alert(1)</script> as userMessage → verify it is stored escaped, not executed
- [ ] SQL injection: submit '; DROP TABLE users; -- as orgId → verify parameterized query blocks it
- [ ] CORS: make request from non-whitelisted origin → verify 403
- [ ] Security headers: visit with securityheaders.com or check response headers manually for HSTS, X-Frame-Options, CSP
- [ ] Request size: send 11MB payload → must return 413

Secrets & Data:
- [ ] grep -r "SUPABASE_SERVICE_KEY" --include="*.tsx" --include="*.ts" src/ → must return 0 results in any client-side file
- [ ] grep -r "ANTHROPIC_API_KEY" --include="*.tsx" --include="*.ts" src/ → must return 0 results in any client-side file
- [ ] Check browser network tab during Claude API call: ANTHROPIC_API_KEY must not appear
- [ ] Claude API call count: verify incrementUsage() is called after every Claude call
- [ ] Check git history: git log --all -- .env.local → must return 0 commits

Data Privacy:
- [ ] Account deletion: implement DELETE /api/v1/account → deletes users + all org data (cascade)
- [ ] Verify PII not in console.log statements: grep -r "console.log" --include="*.ts"
- [ ] Supabase Storage: verify PDF reports have 7-day expiry set on storage bucket

Fix every item that fails. Document fixes in DONE.md.
```

### TASK 5.2 — E2E Test Suite

```
Build /tests/e2e/ using Playwright.

Required test scenarios (full user journeys, not unit tests):

Scenario 1 — Full New User Onboarding:
signup (email + password) → email verification link → login → /onboarding
→ org name + industry + size + country + ISO 27001 → /dashboard
→ empty state renders with Cypher centered
→ Cypher greeting message appears
→ "Start your assessment" button visible

Scenario 2 — Discovery Phase:
→ Continue from Scenario 1
→ Cypher asks what to call him → user types "Max"
→ Agent name "Max" persists in subsequent messages
→ Cypher asks user's name → user types "Vik"
→ Discovery conversation proceeds (3–4 messages minimum)

Scenario 3 — Framework Selection → Scope:
→ Continue from Scenario 2
→ User selects ISO 27001
→ UI transformation: chat moves left, dashboard skeleton emerges
→ Scope questions begin
→ User answers 7 scope questions
→ Scope confirmation message appears with summary
→ User confirms scope

Scenario 4 — Baseline Assessment:
→ Continue from Scenario 3
→ First domain begins (Organizational Context)
→ User answers 3 control questions
→ Signal reflection messages appear with Confirm buttons
→ User clicks Confirm on 2 signals

Scenario 5 — Domain Completion + Score Update:
→ Complete all controls in one domain (mock or fast-forward if needed)
→ Domain complete overlay appears with new score
→ Score card on dashboard updates with animation
→ Score change message appears in Cypher chat

Scenario 6 — Session Pause and Resume:
→ Navigate away from assessment
→ Return to /dashboard
→ Cypher greeting includes recap: "Last time we covered X, your score is Y"
→ "Continue Assessment" navigates back to correct domain

Scenario 7 — PDF Export:
→ With at least one domain complete
→ Click "Export Report" → select "Executive"
→ Loading state shows
→ Download URL returned → PDF link displayed

Scenario 8 — Answer Revision:
→ Open domain card → "Review Answers"
→ Revision drawer opens with original answer
→ User edits and submits revision
→ Score recalculation shown
→ Revision history shows "Revised 1 time"

Run all scenarios: npx playwright test
Must pass before writing DONE.md.
```

### TASK 5.3 — Landing Page

```
Build /app/(marketing)/page.tsx

This is the face of the product. It must convert.
Dark theme. Matches dashboard aesthetic (same CSS variables).

SECTION 1 — HERO:
- Headline: "Your AI Security Consultant — Available 24/7"
- Subhead: "Cypher guides your organization through ISO 27001 and NIST CSF assessments, tracks your maturity score, and tells you exactly what to do next."
- CTA: "Start Free Trial" (large primary button)
- Secondary: "See how it works ↓"
- Hero visual: animated score dashboard mockup (a simplified version of the main dashboard — can be a screenshot or a static SVG that subtly animates)
- Subtle animated background: moving particles or grid lines (framer-motion, performance-conscious)

SECTION 2 — THE PROBLEM:
- "Traditional security consulting costs $15,000–$50,000 per engagement"
- Three cards: Time (weeks waiting), Cost ($$$), Expertise (need to hire)
- Arrow: "vs."
- Three counter-cards: Simplify IS — Always On, Monthly Subscription, Built-In Expertise

SECTION 3 — HOW IT WORKS:
- 3 steps with clean iconography:
  1. "Tell Cypher about your organization" — discovery phase
  2. "Cypher assesses your security maturity" — baseline assessment
  3. "Track, improve, and report" — dashboard + PDF
- Each step has a mini screenshot or illustrated diagram

SECTION 4 — FRAMEWORKS:
- Two cards: ISO 27001:2022 and NIST CSF 2.0
- Per card: framework name, what it covers, "included in base plan" badge
- "More frameworks coming" note (PCI-DSS, APRA, ASD E8)

SECTION 5 — DASHBOARD PREVIEW:
- Full-width screenshot or animation of the dashboard
- Key features labeled: Cypher chat, radar chart, domain scores, compliance calendar

SECTION 6 — PRICING:
- Single tier (MVP — no confusing multi-tier)
- Monthly price (placeholder: "Coming soon" or actual price if set)
- What's included list
- "Start Free Trial" CTA

SECTION 7 — FOOTER:
- Logo + tagline
- Links: Privacy Policy, Terms of Service, Contact (email)
- "Built in Australia 🇦🇺"

Page performance: aim for Lighthouse score > 90. Lazy-load images. Preload fonts.
```

### TASK 5.4 — Stripe Integration

```
Build Stripe subscription integration:

Install: stripe + @stripe/stripe-js

/app/api/v1/billing/checkout/route.ts:
- Creates Stripe checkout session
- Redirects to Stripe-hosted checkout
- On success: webhook updates users.subscription_status = 'active'

/app/api/v1/billing/webhook/route.ts:
- Handles Stripe webhook events (use STRIPE_WEBHOOK_SECRET to verify)
- Events to handle:
  - customer.subscription.created → set status 'active'
  - customer.subscription.deleted → set status 'cancelled'
  - customer.subscription.updated → update tier if changed
  - invoice.payment_failed → set status 'past_due', send email

/app/billing/page.tsx:
- Current subscription status
- "Manage Subscription" → Stripe customer portal
- Invoice history (Stripe API)
- Cancel subscription button → confirmation modal

Middleware update:
- Subscription check on /dashboard/* → if status = 'cancelled' or 'past_due', redirect to /billing
- Grace period: 3 days for payment failure before blocking access

Trial logic (optional for MVP):
- 14-day trial on signup (no card required)
- Show "X days left in trial" badge in header
- Trial expiry → prompt to subscribe
```

### TASK 5.5 — Email Notifications (Resend)

```
Install resend package.

Build /lib/email/templates/:

template: reassessment_due.tsx
- Subject: "Time for your [framework] assessment check-in, [name]"
- Body: "It's been 6 months since your last [framework] assessment. Your score was [score]. Cypher is ready when you are."
- CTA: "Resume Assessment" → links to /dashboard

template: system_recovery.tsx
- Subject: "Simplify IS is back — resume your assessment"
- Body: "Everything's back up and running. Your assessment was saved exactly where you left off."
- CTA: "Resume Now"

template: usage_alert_vik.tsx (internal — sent to VIK_ALERT_EMAIL only)
- Subject: "API Usage Alert — [user_email] at [X]/300 calls"
- Body: simple text, no styling needed

Build /lib/email/sender.ts:
async function sendEmail(template, to, data): Promise<void>
- Wraps Resend API
- Log success/failure
- Non-blocking (don't await in critical paths)

Wire up:
- Session start → check cadence → if overdue → send reassessment_due
- System recovery → (stub for now, trigger manually)
- Usage monitor → on 80% and 100% → send usage_alert_vik
```

### TASK 5.6 — Performance Pass

```
Run Next.js bundle analyzer:
npm install --save-dev @next/bundle-analyzer

Check bundle sizes. Target:
- Initial JS load: < 200KB gzipped
- No single chunk > 100KB

Fixes if over budget:
- Dynamic import D3 (heavy library): import('d3').then(...)
- Dynamic import framer-motion for non-critical animations
- Dynamic import recharts
- Lazy load dashboard charts (intersection observer)

Image optimization:
- Use next/image for all images
- WebP format for any screenshots
- Add blur placeholders

Font optimization:
- next/font for Google Fonts (preload, display: swap)
- Subset to characters actually used

API response caching:
- useOrgScores: staleTime = 30 seconds (scores don't change mid-conversation)
- useSessionHistory: staleTime = 60 seconds

Lighthouse run on:
- / (landing page) → target: 90+ performance
- /dashboard → target: 85+ performance (more JS)
```

### TASK 5.7 — Final Polish Pass

```
Visual QA — check every screen for:
- [ ] No orphaned loading states (every skeleton has a loaded counterpart)
- [ ] No unhandled error states (every API failure shows a user-friendly message)
- [ ] Consistent spacing (no random padding violations)
- [ ] Typography hierarchy correct (no rogue font sizes)
- [ ] Color palette consistent (no off-brand grays or purples sneaking in)
- [ ] All buttons have hover + focus states
- [ ] All inputs have focus rings (cyan, 2px)
- [ ] Modal close buttons work (click outside + X button)
- [ ] No console.log in production: grep -r "console.log" src/

Copy QA:
- [ ] No Lorem ipsum anywhere
- [ ] All error messages are helpful (not "An error occurred")
- [ ] All empty states have clear next-action CTAs
- [ ] All confirmation dialogs explain consequences
- [ ] Agent name "Cypher" used consistently (not "the AI", not "the bot")

Accessibility:
- [ ] All images have alt text
- [ ] All modals trap focus
- [ ] Color contrast ratio ≥ 4.5:1 for body text
- [ ] Interactive elements accessible by keyboard
- [ ] Screen reader labels on icon-only buttons

Mobile check (best-effort — not MVP focus but catch obvious breaks):
- [ ] Landing page readable on mobile (min-width: 375px)
- [ ] Login/signup forms usable on mobile
- [ ] Dashboard shows degraded-but-functional view on tablet (768px)
```

### TASK 5.8 — Pre-Launch Checklist

```
Run through every item before writing DONE.md:

Infrastructure:
- [ ] Environment variables set in Vercel dashboard (all from Section 24)
- [ ] Supabase prod project ready (separate from simplify-dev)
- [ ] Stripe live keys configured (if launching with payments)
- [ ] Resend domain verified for email sending
- [ ] Custom domain simplify.is pointing to Vercel
- [ ] Vercel deployment succeeds from main branch

Security final:
- [ ] All items from TASK 5.1 ticked
- [ ] No .env.local or secrets in git history
- [ ] Supabase prod RLS policies deployed
- [ ] Rate limiting configured in Vercel Edge Config (or equivalent)

Testing:
- [ ] E2E test suite passing (all 8 scenarios)
- [ ] Unit tests passing (80%+ coverage)
- [ ] No TypeScript build errors
- [ ] No ESLint warnings

Product:
- [ ] Landing page live at simplify.is
- [ ] Sign up flow end-to-end (including email verification)
- [ ] Full assessment flow (at least Discovery → Scope → 2 domains) manually tested
- [ ] PDF export tested (both checklist + executive)
- [ ] Score update animation verified
```

### TASK 5.9 — Write DONE.md

```
Create /agents/DONE.md

Content:
1. Date + timestamp of completion
2. Summary of what was built across all 5 agents
3. Security checklist — every item with PASS/FIX status
4. E2E test results (all 8 scenarios)
5. Known limitations or deferred items (honest, specific)
6. Post-launch tasks recommended (from post-MVP backlog in spec)
7. Performance scores (Lighthouse results)
8. Notes for Vik before first real user onboards
```

---

## Estimated Time: 3–5 Cursor hours

## Definition of Done

- [ ] Security checklist 100% complete
- [ ] E2E test suite passing (all 8 scenarios)
- [ ] Landing page live and production quality
- [ ] Stripe integration working
- [ ] Email notifications wired
- [ ] No console.log in production
- [ ] No secrets exposed in client bundles
- [ ] Lighthouse score > 90 on landing page
- [ ] Zero TypeScript build errors
- [ ] DONE.md written
- [ ] Ready for first real user 🚀
```

---

## FILE: `06_AGENT_BACKEND_MultiUserCollaboration.md`

Path: `agents/06_AGENT_BACKEND_MultiUserCollaboration.md`

```markdown
# Agent 6 — Multi-User Account Management
## Claude Code Build Specification

> **Context:** This builds on top of the existing Cypher platform (ISO 27001 + NIST CSF assessments, maturity dashboards, Cypher AI assistant). Do NOT rebuild existing functionality. Extend only.

---

## 1. Overview

Agent 6 adds multi-user collaboration to Cypher. A single organisation can now have multiple users with different roles, contributing to the same assessment. Admin has final authority on all answers. Full audit trail is maintained automatically.

---

## 2. New Database Schema

### `users` table (extend existing)
```sql
id                  UUID PRIMARY KEY
org_id              UUID REFERENCES organisations(id)
email               VARCHAR UNIQUE NOT NULL
name                VARCHAR NOT NULL
role                ENUM('admin', 'assessor', 'viewer')
status              ENUM('active', 'inactive', 'pending')
invited_by          UUID REFERENCES users(id)
invited_at          TIMESTAMP
expires_at          TIMESTAMP NULL  -- for contractors/temp users
last_login          TIMESTAMP
created_at          TIMESTAMP DEFAULT NOW()
```

### `domain_assignments` table (NEW)
```sql
id                  UUID PRIMARY KEY
org_id              UUID REFERENCES organisations(id)
user_id             UUID REFERENCES users(id)
framework           ENUM('iso27001', 'nist_csf')
domain_id           VARCHAR NOT NULL  -- e.g. 'A.5', 'A.6', 'ID.AM'
assigned_by         UUID REFERENCES users(id)
assigned_at         TIMESTAMP DEFAULT NOW()
due_date            DATE NULL
status              ENUM('pending', 'in_progress', 'completed')
```

### `control_responses` table (NEW — replaces/extends existing answers)
```sql
id                  UUID PRIMARY KEY
org_id              UUID REFERENCES organisations(id)
framework           ENUM('iso27001', 'nist_csf')
control_id          VARCHAR NOT NULL  -- e.g. 'A.5.1', 'ID.AM-1'
user_id             UUID REFERENCES users(id)
response_text       TEXT NOT NULL
evidence_types      JSONB DEFAULT '[]'  -- array of selected evidence options
version             INTEGER DEFAULT 1
is_final            BOOLEAN DEFAULT FALSE
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()
```

### `final_answers` table (NEW)
```sql
id                  UUID PRIMARY KEY
org_id              UUID REFERENCES organisations(id)
framework           ENUM('iso27001', 'nist_csf')
control_id          VARCHAR NOT NULL
selected_response_id UUID REFERENCES control_responses(id) NULL
custom_answer       TEXT NULL  -- if admin typed their own
admin_id            UUID REFERENCES users(id)
admin_note          TEXT NULL
finalized_at        TIMESTAMP DEFAULT NOW()
```

### `audit_trail` table (NEW)
```sql
id                  UUID PRIMARY KEY
org_id              UUID REFERENCES organisations(id)
framework           ENUM('iso27001', 'nist_csf')
control_id          VARCHAR NOT NULL
action              ENUM('answer_submitted', 'answer_edited', 'final_selected', 'final_edited', 'final_custom')
performed_by        UUID REFERENCES users(id)
response_id         UUID REFERENCES control_responses(id) NULL
final_answer_id     UUID REFERENCES final_answers(id) NULL
metadata            JSONB DEFAULT '{}'
created_at          TIMESTAMP DEFAULT NOW()
```

---

## 3. API Endpoints

### User Management (Admin Only)

```
POST   /api/users/invite              -- Invite new user (send email)
GET    /api/users                     -- List all users in org
PATCH  /api/users/:id                 -- Update role, status, expiry
DELETE /api/users/:id                 -- Deactivate user
GET    /api/users/:id/activity        -- User activity log
```

### Domain Assignments

```
POST   /api/assignments               -- Assign domain to user
GET    /api/assignments               -- List all assignments (admin)
GET    /api/assignments/mine          -- My assigned domains (assessor)
PATCH  /api/assignments/:id           -- Update status/due date
DELETE /api/assignments/:id           -- Remove assignment
```

### Control Responses

```
POST   /api/responses                 -- Submit answer for a control
GET    /api/responses/:framework/:controlId   -- Get all responses for a control
PATCH  /api/responses/:id             -- Edit own response
```

**Rules:**
- Assessors can only see OTHER users' answers anonymised ("Another team member answered...")
- Assessors cannot see names of who else answered
- Admin sees ALL responses with full names

### Final Answers (Admin Only)

```
POST   /api/final-answers             -- Set final answer for a control
PATCH  /api/final-answers/:id         -- Update final answer
GET    /api/final-answers/:framework  -- Get all final answers for a framework
```

**Request body for POST:**
```json
{
  "framework": "iso27001",
  "control_id": "A.5.1",
  "selected_response_id": "uuid-here",   // pick existing, OR
  "custom_answer": "Admin typed this",    // write own
  "edited_text": "Modified version",      // edit existing (overrides selected_response_id text)
  "admin_note": "Chose this because..."   // optional rationale
}
```

### Audit Trail (Admin Only)

```
GET    /api/audit-trail               -- Full org audit trail
GET    /api/audit-trail/:controlId    -- Audit trail for specific control
```

**Query params:** `?framework=iso27001&from=2025-01-01&to=2025-12-31`

---

## 4. Role Permissions Matrix

| Action | Admin | Assessor | Viewer |
|--------|-------|----------|--------|
| Invite users | ✅ | ❌ | ❌ |
| Assign domains | ✅ | ❌ | ❌ |
| Answer controls | ✅ | ✅ (assigned only) | ❌ |
| See own answers | ✅ | ✅ | ✅ |
| See others' answers (named) | ✅ | ❌ | ❌ |
| See others' answers (anon) | ✅ | ✅ | ❌ |
| Select final answer | ✅ | ❌ | ❌ |
| View maturity dashboard | ✅ | ✅ | ✅ |
| View audit trail | ✅ | ❌ | ❌ |
| Access Cypher AI | ✅ | ✅ | ✅ |
| Manage org settings | ✅ | ❌ | ❌ |

---

## 5. Business Logic

### Answer Submission Flow
1. Assessor navigates to assigned control
2. System checks: is there an existing response for this control?
3. If YES: show anonymised preview ("Another team member answered this")
4. Assessor still submits their own answer (stored as new `control_responses` row)
5. Audit trail entry auto-created: `action: 'answer_submitted'`

### Final Answer Selection Flow (Admin)
1. Admin opens control detail (from dashboard or conflict review page)
2. System shows all responses WITH full names + timestamps
3. Admin has three options:
   - **Pick as-is:** Click "Use this answer" → stored as final
   - **Pick + edit:** Click pencil icon → inline edit → submit
   - **Write own:** Click "Write custom answer" → text area → submit
4. Final answer stored in `final_answers` table
5. Audit trail entry auto-created: `action: 'final_selected'` or `'final_edited'` or `'final_custom'`
6. Dashboard now uses final answer for scoring (not individual responses)

### Conflict Detection
- A "conflict" exists when 2+ responses exist for same control with significantly different maturity scores
- System flags conflict on admin dashboard (orange indicator)
- Admin must resolve (select final answer) before assessment is marked complete

### Scoring Priority
```
IF final_answer exists → use final_answer for scoring
ELSE IF single response exists → use that response
ELSE → control marked as "unanswered"
```

---

## 6. Evidence Types Per Control Domain

Pre-populate evidence options based on control category. Examples:

**Access Control (A.5.x)**
- Access control policy document
- Active Directory / IAM group listings
- Access request & approval records
- Privileged access review logs
- User access certification report

**Risk Management (A.6.x)**
- Risk register
- Risk treatment plan
- Risk assessment methodology document
- Board/management sign-off records

**Incident Management (A.5.24–A.5.28)**
- Incident response plan/procedure
- Incident log / SIEM records
- Post-incident review reports
- Penetration test findings (with remediation tracking)

**Generic (all controls)**
- Internal procedure/policy document
- Training completion records
- Audit/review meeting minutes
- Third-party assessment report
- Other (free text)

Store as JSONB array in `control_responses.evidence_types`:
```json
["access_control_policy", "ad_group_listings", "other:Annual review spreadsheet"]
```

---

## 7. Email Notifications

Send emails for:
- User invited to organisation (include login link + role)
- User assigned to a domain (include domain name + due date)
- User account expiring in 7 days (if expires_at set)

Do NOT send emails for:
- Other users answering same control (avoid notification fatigue)
- Every admin action

Use existing email service/transactional email provider already in stack.

---

## 8. Middleware & Guards

```javascript
// Role guard middleware
requireRole('admin')           // Admin only routes
requireRole('admin', 'assessor') // Admin + Assessor routes
requireOwnerOrAdmin()          // Can only edit own resources, or admin can edit any

// Response anonymisation middleware
anonymiseResponses(req, res)   // Strip user names if requester is Assessor/Viewer
```

---

## 9. Existing Code to Update

### Dashboard (`/dashboard`)
- Add "Answered by [User X]" label under each domain card
- Add contributor count: "3 team members contributed"
- Add conflict indicator: orange dot if unresolved conflicts exist
- Add "Pending assignments" count for admin

### Control Detail Page
- Show existing responses section (with anonymisation rules)
- Add evidence selection checkboxes after answer submission
- Admin: show "Select Final Answer" panel with three options

### Cypher AI (`/cypher`)
- Cypher should use `final_answers` table when generating insights
- If no final answer, use most recent response
- No changes to Cypher interface itself

### Navigation (Left Sidebar)
- Add "Team" menu item (Admin only) → `/admin/team`
- No other sidebar changes

### Top Navigation / Avatar Menu
- Add "Audit Trail" under admin avatar dropdown → `/admin/audit-trail`
- NOT in left sidebar (keeps it clean)

---

## 10. New Pages to Build

| Page | Route | Access |
|------|-------|--------|
| Team Management | `/admin/team` | Admin only |
| Invite User | `/admin/team/invite` | Admin only |
| User Profile/Edit | `/admin/team/:userId` | Admin only |
| Domain Assignments | `/admin/assignments` | Admin only |
| Audit Trail | `/admin/audit-trail` | Admin only |
| My Assignments | `/assessor/assignments` | Assessor only |

---

## 11. Out of Scope (Post-MVP)

- Internal Audit workflow (Agent 7 — Month 2)
- ISMS / Policy Management (Month 2)
- PCI-DSS framework (Month 3)
- Real-time notifications / websockets
- File/document uploads (evidence documents)
- Bulk user import (CSV)
- SSO / SAML integration

---

## 12. Build Order Recommendation

1. Database schema migrations
2. User model + auth middleware updates
3. Role guard middleware
4. User management API endpoints
5. Domain assignment API endpoints
6. Control responses API (with anonymisation)
7. Final answers API
8. Audit trail (auto-logging — hook into existing response save logic)
9. Email notifications
10. Frontend: Team Management pages
11. Frontend: Audit Trail page
12. Frontend: Dashboard updates (contributor labels, conflict indicators)
13. Frontend: Control detail updates (response list + evidence selection)
14. Testing: Role permission matrix (all 18 combinations)
15. Testing: Conflict detection + resolution flow

---

*Built for Cypher — Compliance Assessment Platform*
*Agent 6 Specification v1.0*
```

---

## FILE: `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`

Path: `agents/07_AGENT_UIUX_PreLoginPagesAuthFlow.md`

```markdown
# Agent 7 — Pre-Login Pages + Auth Flow
## `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
### Status: LOCKED | Version: April 2026

---

## READS
- `CLAUDE.md`
- `HANDOFFS_CONSOLIDATED.md`
- `SIMPLIFY_IS_MASTER_CONTEXT.md`
- `SIMPLIFY_IS_DESIGN_SYSTEM.md`
- All design HTML files (Pages 1–13 uploaded to project)

## WRITES
- `HANDOFF_7_PRELOGIN_UIUX.md` (every component documented — required before Agent 8 starts)

---

## MISSION

Build the complete pre-login user experience — from landing page through MFA confirmation — pitch-perfect, fully responsive (desktop + tablet + mobile), dark and light mode, security-first.

**No backend wiring. Clean stubs only. Agent 8 wires real API calls.**

---

## PAGES TO BUILD (20 TOTAL)

### Pre-Login Marketing + Legal Pages

| # | Page | Route | Design Files |
|---|------|-------|-------------|
| 1 | Landing Page | `/` | ✅ All variants in project |
| 2 | How It Works | `/how-it-works` | ✅ All variants in project |
| 3 | Frameworks | `/frameworks` | ✅ All variants in project |
| 4 | Pricing | `/pricing` | ✅ All variants in project |
| 5 | Maturity Model | `/maturity-model` | ✅ All variants in project |
| 6 | Meet Cypher | `/meet-cypher` | ✅ All variants in project |
| 7 | Terms of Service | `/terms` | ✅ Available in project |
| 8 | Privacy Policy | `/privacy` | ✅ Available in project |

### Auth Pages

| # | Page | Route | Design Files |
|---|------|-------|-------------|
| 9 | Login | `/login` | ✅ Available in project |
| 10 | MFA Verification | `/login/mfa` | ✅ All variants in project |
| 11 | Signup | `/signup` | ✅ Available in project |
| 12 | Email Verify Holding | `/signup/verify` | ✅ All variants in project |
| 13 | Password Reset Request | `/forgot-password` | ❌ Build from design system |
| 14 | Password Reset Form | `/reset-password` | ❌ Build from design system |
| 15 | Password Reset Confirmation | `/reset-password/confirmed` | ❌ Build from design system |

### Error Pages

| # | Page | Route | Design Files |
|---|------|-------|-------------|
| 16 | 404 Not Found | `/404` | ✅ Dark desktop — extend to all themes |
| 17 | 403 Forbidden | `/403` | ❌ Build from design system |
| 18 | 500 Internal Server Error | `/500` | ❌ Build from design system |
| 19 | 503 Service Unavailable | `/503` | ❌ Build from design system |

> **Note:** Contact page (`/contact`) is deferred — not required for Agent 7.

---

## BREAKPOINTS (ALL REQUIRED — BUILD SIMULTANEOUSLY)

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | 375px–480px | Single column, bottom sheet or hamburger navigation |
| Tablet | 768px–1024px | 2-column where applicable, collapsed side nav |
| Desktop | 1280px–1920px | Full layout, expanded navigation |

Use Tailwind responsive prefixes: `sm:` `md:` `lg:` `xl:`

---

## THEMES (BOTH REQUIRED ON EVERY PAGE)

| Theme | Default | Source |
|-------|---------|--------|
| Dark mode | ✅ Primary default | Design system tokens + uploaded HTML files |
| Light mode | Toggle-accessible | Infer from uploaded light mode HTML files — match exactly |

**Dark/light toggle:** Top-right corner on every single page (pre-login + post-login). Use a sun/moon icon. Persist theme preference in `localStorage` key `simplify-theme`.

---

## LOCKED AUTH FLOW DECISIONS

### Email Verification Flow
1. User signs up → lands on `/signup/verify` ("Check your email" screen)
2. Screen says: *"We've sent a verification email. Please verify your email address. Once verified, you'll be able to log in."*
3. Resend option available on this screen
4. User clicks verification link in email → lands on a confirmation screen
5. Confirmation screen shows success banner: *"Thank you for verifying your email address."*
6. Redirects to `/login` with success banner: *"Your email has been verified. Log in with your details."*

### Login Before Verification
- If user attempts login before verifying email, backend (Agent 8) returns error
- UI displays: *"Please verify your email address before logging in."*
- Stub this error state in the UI now

### Password Reset Flow
1. User clicks "Forgot password?" on `/login`
2. Lands on `/forgot-password` — enters email address → submits
3. Screen confirms: *"If that email exists, we've sent a reset link."* (never confirm whether email exists)
4. User clicks link in email → lands on `/reset-password` — enters new password + confirm
5. On submit → redirects to `/login` with success banner: *"Password reset successful. Log in with your new credentials."*

### MFA Flow
- 6-digit code entry
- **Auto-submit on 6th digit** — no manual "Verify" button needed
- Show resend code option after 30 seconds

### Remember Me
- Checkbox on `/login` — label: "Remember me for 7 days"
- Default: unchecked
- When checked: 7-day session (stub — Agent 8 wires actual session extension)

### Post-Login Routing
- **First-time org user** (admin creating org for first time) → `/onboarding`
- **All other team members** → `/dashboard` directly
- Stub this routing logic — Agent 8 + 9 wire the actual check

### Session After MFA
- Successful MFA → routing decision above applies

---

## LOCKED SIGNUP FORM FIELDS

```
Full Name           (text, required)
Email Address       (email, required)
Password            (password, required)
Confirm Password    (password, required)
Organisation Name   (text, required)
Job Title           (text, required)
Team Size           (select, required) — options: 1–10, 11–50, 51–200, 201–500, 500+
Industry            (select, required) — options: Financial Services, Healthcare, Government, Technology, Retail, Education, Legal, Manufacturing, Other
```

**Job title is used on the dashboard screen** — display as "Welcome back, [Job Title]" or similar. Pass this to Agent 8 in the handoff.

---

## LOCKED FORM VALIDATION RULES

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 special character (!@#$%^&* etc.)
- Show strength indicator below field (weak / medium / strong)

### Validation Timing
- **Real-time on blur** — validate each field when user leaves it (tabs or clicks away)
- Show error message immediately below the relevant field
- Success state (green indicator) when field passes

### Standard Rules
- Email: valid format required
- Confirm Password: must match Password field — check on blur of confirm field
- All required fields: show error if submitted empty

---

## LOCKED SEO REQUIREMENTS (SURGICAL — DAY ONE)

Every page must include:

```html
<!-- Per-page meta -->
<title>[Page Title] | Simplify IS</title>
<meta name="description" content="[unique per page]" />
<link rel="canonical" href="https://simplify.is/[route]" />

<!-- Open Graph -->
<meta property="og:title" content="[Page Title] | Simplify IS" />
<meta property="og:description" content="[unique per page]" />
<meta property="og:url" content="https://simplify.is/[route]" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://simplify.is/og-image.png" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Page Title] | Simplify IS" />
<meta name="twitter:description" content="[unique per page]" />
<meta name="twitter:image" content="https://simplify.is/og-image.png" />

<!-- JSON-LD Structured Data (on landing page) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Simplify IS",
  "description": "AI-driven security assessment platform",
  "url": "https://simplify.is",
  "applicationCategory": "SecurityApplication"
}
</script>
```

Also required:
- `sitemap.xml` — auto-generated listing all public routes
- `robots.txt` — allow all public pages, disallow `/api/*`, `/dashboard/*`, `/assessment/*`

---

## LOCKED ANALYTICS (REAL TRACKING — DAY ONE)

Use **Google Tag Manager** (GTM). Wire real tracking from day one.

Events to track on all pages:
- `page_view` — on every route load
- `cta_click` — on every primary CTA button (Get Started, Book Demo, Login, Sign Up)
- `form_start` — when user focuses first form field
- `form_submit` — on form submission attempt
- `form_error` — when validation fails
- `theme_toggle` — when dark/light mode switched
- `nav_click` — on every top nav link

Auth-specific events:
- `signup_started`
- `signup_completed`
- `login_attempted`
- `login_success`
- `mfa_completed`
- `password_reset_requested`

Create a `lib/analytics/gtm.ts` module that wraps all event calls. Never call `dataLayer.push()` directly in components.

---

## LOCKED BROWSER SUPPORT

Latest 2 versions of:
- Chrome
- Firefox
- Safari
- Edge

No IE11. No legacy polyfills needed.

---

## LOCKED ERROR PAGE BEHAVIOUR

| Page | CTA Button | Redirect |
|------|-----------|---------|
| 404 Not Found | "Go to Home" | `/` |
| 403 Forbidden | "Log In" | `/login` |
| 500 Internal Server Error | "Go to Home" | `/` with message "Something went wrong. Our team has been notified." |
| 503 Service Unavailable | Static holding page — no redirect | Show estimated recovery message |

All error pages: dark + light mode, all breakpoints, same design aesthetic as rest of site.

---

## NAVIGATION STRUCTURE

### Top Navigation (all marketing pages)
```
Logo (left)    |    How It Works    Frameworks    Pricing    |    Log In    Get Started (CTA)
```
- Sticky on scroll with glassmorphic background (`backdrop-blur: 12px`, 80% opacity)
- Mobile: hamburger → slide-in overlay or bottom sheet
- Dark/light toggle: top-right corner

### Auth Page Navigation
- Minimal — logo only (links back to `/`)
- No top nav links on login, signup, MFA, password reset pages
- Footer: links to Privacy Policy + Terms of Service only

### Footer (marketing pages)
```
Logo + tagline
Product: How It Works | Frameworks | Pricing | Maturity Model | Meet Cypher
Legal: Privacy Policy | Terms of Service
© 2026 Simplify IS. All rights reserved.
```

### Routes (all separate Next.js App Router pages — NOT anchor links)
```
/                   Landing
/how-it-works       How It Works
/frameworks         Frameworks
/pricing            Pricing
/maturity-model     Maturity Model
/meet-cypher        Meet Cypher
/terms              Terms of Service
/privacy            Privacy Policy
/login              Login
/login/mfa          MFA Verification
/signup             Signup
/signup/verify      Email Verify Holding
/forgot-password    Password Reset Request
/reset-password     Password Reset Form
/reset-password/confirmed   Confirmation (redirect to /login)
/404                404 Error
/403                403 Error
/500                500 Error
/503                503 Error
```

---

## SECURITY REQUIREMENTS (NON-NEGOTIABLE)

- Form inputs: XSS-protected via proper encoding — never use `dangerouslySetInnerHTML` with user input
- Passwords: NEVER logged, NEVER in query strings, NEVER in localStorage/sessionStorage
- No secrets, API keys, or internal route references in any client-side code or comments
- CSRF tokens: stubbed in all forms (Agent 8 wires actual tokens)
- Rate limiting visual cues: button disabled + loading spinner after first click (prevents double-submit)
- Error messages: always generic — NEVER reveal whether an email exists
  - ✅ "Invalid credentials"
  - ❌ "Email not found"
  - ✅ "If that email exists, we've sent a reset link"
- All interactive elements: fully keyboard-accessible with `focus-visible` states
- `prefers-reduced-motion` respected on ALL animations (WCAG requirement)
- WCAG AA contrast ratios in both dark and light mode
- ARIA labels on all interactive elements
- No sensitive data in HTML source comments

---

## DESIGN SYSTEM REFERENCE

**Read `SIMPLIFY_IS_DESIGN_SYSTEM.md` in full before writing any code.**

### Key Tokens (Dark Mode)
```css
--color-primary:              #EB5E28    /* Terracotta */
--color-primary-deep:         #C44A1A    /* Deep orange */
--surface-base:               #1A1917    /* Near-black — NEVER #000000 */
--surface-container-low:      #252320
--surface-container-high:     #2E2B28
--surface-bright:             #3A3530
--text-primary:               #FFFCF2
--text-secondary:             #E6E2DE
--text-muted:                 #CCC5B9
--text-subtle:                #A88A80
--border-subtle:              rgba(168,138,128,0.15)
--success:                    #10B981
--warning:                    #F59E0B
--danger:                     #EF4444
```

### Typography
- Display / Headlines: **Raleway** — tight tracking, uppercase for bold impact
- Subheadings / Labels: **Josefin Sans** — uppercase, wide tracking
- Body: **Montserrat** — generous line-height (1.6)
- Code / Mono: **Geist Mono** — small, all-caps for metadata

### Component Rules
- Buttons: terracotta gradient (`#EB5E28` → `#C44A1A`), sharp edges or very subtle radius — NO pill buttons
- Cards: `surface-container-high` background, no 1px solid borders, use surface colour shifts
- Inputs: `surface-container-low` base, bottom-only ghost border, focus = terracotta bottom border
- No-line rule: NEVER use 1px solid borders for sectioning — ghost borders only as accessibility fallback
- All transitions: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Oversized faded section numbers (01, 02, 03) — key signature pattern

### HTML Files as Pixel-Level Spec
The uploaded HTML files are the authoritative visual reference. Match them exactly for pages that have design files. For pages without design files (password reset, error pages 403/500/503), build from the design system tokens to match the login/signup aesthetic.

---

## FRAMEWORK DETAILS

- **All pages are Next.js 14 App Router routes** — NOT standalone HTML files
- TypeScript strict mode — no `any` types
- Tailwind CSS — use design system tokens via CSS variables
- Framer Motion — for all animations
- No backend API calls — form handlers are stubs only
- CSRF token fields: include in forms as `<input type="hidden" name="csrf_token" value="" />` (Agent 8 fills)

### File Structure for Agent 7 Output
```
app/
├── (marketing)/
│   ├── page.tsx                    # /
│   ├── how-it-works/page.tsx
│   ├── frameworks/page.tsx
│   ├── pricing/page.tsx
│   ├── maturity-model/page.tsx
│   ├── meet-cypher/page.tsx
│   ├── terms/page.tsx
│   └── privacy/page.tsx
├── (auth)/
│   ├── login/
│   │   ├── page.tsx                # /login
│   │   └── mfa/page.tsx           # /login/mfa
│   ├── signup/
│   │   ├── page.tsx                # /signup
│   │   └── verify/page.tsx        # /signup/verify
│   ├── forgot-password/page.tsx
│   └── reset-password/
│       ├── page.tsx
│       └── confirmed/page.tsx
├── 404.tsx
├── 403.tsx
├── 500.tsx
└── 503.tsx
components/
├── marketing/
│   ├── TopNav.tsx
│   ├── Footer.tsx
│   └── DarkLightToggle.tsx
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   ├── MFAInput.tsx
│   ├── ForgotPasswordForm.tsx
│   ├── ResetPasswordForm.tsx
│   └── AuthBanner.tsx             # Success/error banners
└── error/
    ├── ErrorPage.tsx              # Shared error page component
    └── variants/                  # 404, 403, 500, 503 configs
lib/
└── analytics/
    └── gtm.ts                     # GTM wrapper — all event calls go here
```

---

## DEFINITION OF DONE

Agent 7 is complete when ALL of the following are true:

### Pages
- [ ] All 20 pages built
- [ ] All 3 breakpoints working (desktop 1280px+, tablet 768–1024px, mobile 375–480px)
- [ ] Dark mode fully implemented on every page
- [ ] Light mode fully implemented on every page
- [ ] Dark/light toggle works on every page and persists preference

### Quality
- [ ] Lighthouse score ≥ 90 (performance, accessibility, best practices, SEO) on all pages
- [ ] Zero console errors or warnings in browser
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1
- [ ] All animations smooth (60fps), `prefers-reduced-motion` respected

### Forms + Interactions
- [ ] All interactive elements have hover, focus, and active states
- [ ] All form inputs have validation states (default, focus, error, success)
- [ ] All buttons have loading states (spinner + disabled after first click)
- [ ] Real-time validation on blur working on all form fields
- [ ] Password strength indicator on signup + reset password forms
- [ ] MFA auto-submits on 6th digit

### Auth Flow States (all stubbed)
- [ ] Email verification holding screen (`/signup/verify`)
- [ ] Login with email-not-verified error state
- [ ] Login with remember-me checkbox (7-day stub)
- [ ] Password reset flow — all 3 pages
- [ ] Post-login routing logic stubbed (first-time org → `/onboarding`, others → `/dashboard`)
- [ ] Success banners on `/login` after: email verified, password reset

### Security
- [ ] No secrets, API keys, or internal routes in any client-side code
- [ ] Error messages are generic — no data leakage
- [ ] CSRF token stubs in all forms
- [ ] WCAG AA contrast in both themes
- [ ] All form inputs XSS-protected

### SEO + Analytics
- [ ] Meta tags + OG tags + Twitter Card on every page
- [ ] JSON-LD structured data on landing page
- [ ] `sitemap.xml` generated
- [ ] `robots.txt` present
- [ ] GTM wired + all tracked events firing

### Build
- [ ] `npm run lint` passes — zero errors
- [ ] `npm run build` passes — zero errors
- [ ] `HANDOFF_7_PRELOGIN_UIUX.md` written with every component documented

---

## WHAT AGENT 8 NEEDS FROM THIS HANDOFF

When writing `HANDOFF_7_PRELOGIN_UIUX.md`, include explicitly:

1. Every stub function signature (auth calls, form submissions) — exact names and expected params
2. Exact field names from signup form (these map to DB columns Agent 8 creates)
3. Where CSRF token fields are placed in each form
4. Theme toggle implementation details (localStorage key, CSS class strategy)
5. GTM container ID placeholder — where to insert real GTM ID
6. Any known gaps or design decisions deferred to Agent 8

---

*Locked in planning session with Vik Soni, April 2026. All decisions above are final. Do not reopen without explicit confirmation from Vik.*
```

---

## FILE: `08_AGENT_BACKEND_AuthenticationEmailService.md`

Path: `agents/08_AGENT_BACKEND_AuthenticationEmailService.md`

```markdown
# Agent 8 — Authentication Backend + Email Service
## `08_AGENT_BACKEND_AuthenticationEmailService.md`
### Status: LOCKED | Version: April 2026

---

## READS
- `CLAUDE.md`
- `HANDOFF_7_PRELOGIN_UIUX.md` (Agent 7 output — read in full before starting)
- `HANDOFFS_CONSOLIDATED.md` (Agents 1–5 contracts)
- `SIMPLIFY_IS_MASTER_CONTEXT.md`

## WRITES
- `HANDOFF_8_AUTH_BACKEND.md` (every function, endpoint, and contract documented — required before Agent 9 starts)

---

## MISSION

Wire real authentication backend to the pre-login UI shell built by Agent 7. Build all auth API endpoints, Supabase TOTP MFA, email verification, password reset, session management, rate limiting, and Resend email service integration.

**Agent 7 built the UI shells with stubbed form handlers. Agent 8 makes them real.**

Agent 9 wires the two together. Do NOT modify Agent 7 UI components — only implement the backend API routes and service layer that Agent 9 will connect.

---

## LOCKED TECHNICAL DECISIONS (ALL FINAL — DO NOT REVISIT)

| Decision | Implementation |
|----------|---------------|
| **MFA** | Supabase TOTP — `supabase.auth.mfa.enroll()`, `challenge()`, `verify()` |
| **Sessions** | Supabase sessions — JWT + refresh tokens fully managed by Supabase |
| **Password hashing** | Supabase handles bcrypt — never hash in application layer |
| **Email verification** | Link-based via Resend — Supabase sends verification email via Resend SMTP |
| **User metadata storage** | Auto-create `public.users` row via DB trigger on `auth.users` INSERT |
| **Account deletion** | Soft delete — `deleted_at` timestamp, all data retained for audit/compliance |
| **Password reset** | Supabase `resetPasswordForEmail()` → link → `/reset-password` → update password |
| **Remember me** | 7-day session — Supabase session `expiresIn: 604800` (7 days in seconds) |
| **Rate limiting** | 10 login attempts → 5 min lockout, 5 MFA attempts → 5 min lockout, 5 resend emails/hour |

---

## ARCHITECTURE RULES (NEVER VIOLATE)

These are inherited from the existing codebase — Agent 8 must follow them exactly:

- All auth API routes live at `/api/v1/auth/*` — all require proper validation
- NO direct Supabase calls from frontend — always through API routes
- NO secrets in client bundles — `SUPABASE_SERVICE_KEY` server-side only
- All SQL: parameterized queries only — never string interpolation
- TypeScript strict mode — no `any` types
- No `console.log` in production code
- No TODO comments in merged code
- Env vars only from `/lib/config/env.ts` — never `process.env` directly elsewhere
- RLS on all data tables — org-scoped
- Error messages: always generic — NEVER reveal whether an email exists

---

## NEW API ENDPOINTS TO BUILD

All under `/app/api/v1/auth/` — Next.js App Router route handlers.

### 1. POST `/api/v1/auth/signup`
```typescript
// Request body
{
  email: string          // valid email format
  password: string       // min 8 chars, 1 upper, 1 lower, 1 special
  full_name: string      // required
  organisation_name: string  // required
  job_title: string      // required — displayed on dashboard
  team_size: string      // '1-10' | '11-50' | '51-200' | '201-500' | '500+'
  industry: string       // 'Financial Services' | 'Healthcare' | 'Government' | 'Technology' | 'Retail' | 'Education' | 'Legal' | 'Manufacturing' | 'Other'
}

// Success response (202 Accepted)
{
  success: true
  message: "Verification email sent. Please check your inbox."
}

// Error responses (all generic — never leak whether email exists)
// 400: validation error (password too weak, missing fields)
// 409: "An account with this email may already exist. Please check your inbox or try logging in."
// 429: rate limit exceeded
// 500: "Something went wrong. Please try again."
```

**Implementation steps:**
1. Validate all fields with Zod schema
2. Check password strength (8 chars, uppercase, lowercase, special)
3. Call `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
4. Supabase auto-sends verification email via Resend (configured in Supabase dashboard)
5. DB trigger auto-creates `public.users` row (see trigger spec below)
6. Return 202 — never confirm whether email existed

---

### 2. POST `/api/v1/auth/login`
```typescript
// Request body
{
  email: string
  password: string
  remember_me: boolean   // true = 7-day session, false = default session
}

// Success response — no MFA enrolled (200)
{
  success: true
  requires_mfa: false
  redirect: '/dashboard' | '/onboarding'  // onboarding if first-time org admin
}

// Success response — MFA enrolled (200)
{
  success: true
  requires_mfa: true
  factor_id: string      // passed to MFA verification step
  redirect: '/login/mfa'
}

// Error responses
// 401: "Invalid credentials."  (NEVER say "email not found" or "wrong password")
// 403: "Please verify your email address before logging in."
// 423: "Account locked. Too many failed attempts. Try again in 5 minutes."
// 429: rate limit exceeded
```

**Implementation steps:**
1. Validate email + password format
2. Check rate limiting (10 attempts / 5 min per email — store in Redis or Supabase table)
3. Call `supabase.auth.signInWithPassword({ email, password })`
4. Check `email_confirmed_at` — if null, return 403
5. Check `public.users.deleted_at` — if set, return 401 (treat as invalid credentials)
6. If `remember_me: true` — set session `expiresIn: 604800` (7 days)
7. Check MFA enrollment: `supabase.auth.mfa.listFactors()`
8. If MFA enrolled → return `requires_mfa: true` + `factor_id`
9. If no MFA → check if first-time org admin → return redirect target
10. Reset failed attempt counter on success

---

### 3. POST `/api/v1/auth/mfa/verify`
```typescript
// Request body
{
  factor_id: string      // from login response
  code: string           // 6-digit TOTP code
}

// Success response (200)
{
  success: true
  redirect: '/dashboard' | '/onboarding'
}

// Error responses
// 401: "Invalid code. Please try again."
// 423: "Too many failed attempts. Try again in 5 minutes."
// 429: rate limit exceeded
```

**Implementation steps:**
1. Validate factor_id + code format
2. Check MFA rate limiting (5 attempts / 5 min per user)
3. Create challenge: `supabase.auth.mfa.challenge({ factorId: factor_id })`
4. Verify: `supabase.auth.mfa.verify({ factorId, challengeId, code })`
5. On success: determine redirect (first-time org admin → `/onboarding`, else → `/dashboard`)
6. Reset failed MFA attempt counter on success

---

### 4. POST `/api/v1/auth/mfa/enroll`
```typescript
// No request body — authenticated endpoint (JWT required)

// Success response (200)
{
  success: true
  totp_uri: string       // otpauth:// URI for QR code generation
  qr_code: string        // Base64 QR code image (Supabase provides this)
  factor_id: string      // needed for verification step
  secret: string         // manual entry fallback
}
```

**Implementation steps:**
1. Require valid JWT (user must be logged in)
2. Call `supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Authenticator App' })`
3. Return QR code + secret for manual entry
4. Note: enrollment is NOT complete until user verifies first code (see `/mfa/enroll/verify`)

---

### 5. POST `/api/v1/auth/mfa/enroll/verify`
```typescript
// Request body
{
  factor_id: string
  code: string           // first code user enters after scanning QR
}

// Success response (200)
{
  success: true
  message: "MFA successfully enabled on your account."
}
```

**Implementation steps:**
1. Require valid JWT
2. Create challenge + verify (same as `/mfa/verify`)
3. On success, MFA is now enrolled and enforced on next login

---

### 6. POST `/api/v1/auth/forgot-password`
```typescript
// Request body
{
  email: string
}

// Always return 200 — NEVER reveal whether email exists
{
  success: true
  message: "If that email exists, we've sent a reset link."
}
```

**Implementation steps:**
1. Validate email format
2. Check rate limiting (5 requests/hour per email address)
3. Call `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://simplify.is/reset-password' })`
4. Always return 200 regardless of whether email exists
5. Supabase sends reset email via Resend

---

### 7. POST `/api/v1/auth/reset-password`
```typescript
// Request body (user must have valid reset token in URL — Supabase handles token validation)
{
  password: string       // new password
  confirm_password: string
}

// Success response (200)
{
  success: true
  message: "Password reset successful."
  redirect: '/login'
}

// Error responses
// 400: "Passwords do not match." | "Password does not meet requirements."
// 401: "Reset link is invalid or has expired. Please request a new one."
```

**Implementation steps:**
1. Validate password strength + match
2. Call `supabase.auth.updateUser({ password: newPassword })`
3. Invalidate all existing sessions for security (Supabase does this automatically)
4. Return success + redirect to `/login`
5. Agent 7 UI shows success banner: "Password reset successful. Log in with your new credentials."

---

### 8. POST `/api/v1/auth/resend-verification`
```typescript
// Request body
{
  email: string
}

// Always return 200
{
  success: true
  message: "If that email is registered and unverified, we've sent a new link."
}
```

**Implementation steps:**
1. Check rate limiting (5 resends/hour per email)
2. Call `supabase.auth.resend({ type: 'signup', email })`
3. Always return 200

---

### 9. POST `/api/v1/auth/logout`
```typescript
// No body — uses JWT from Authorization header

// Success response (200)
{
  success: true
  redirect: '/'
}
```

**Implementation steps:**
1. Call `supabase.auth.signOut()`
2. Clear session cookies
3. Return redirect to `/`

---

### 10. GET `/api/v1/auth/session`
```typescript
// No body — uses JWT from Authorization header

// Success response (200) — active session
{
  user: {
    id: string
    email: string
    full_name: string
    job_title: string
    organisation_name: string
    role: 'admin' | 'assessor' | 'viewer'
    mfa_enabled: boolean
    is_first_time_org_admin: boolean
  }
}

// 401 — no active session
```

**Implementation steps:**
1. Call `supabase.auth.getUser()` server-side
2. Fetch `public.users` row + organisation name
3. Check if `is_onboarded` flag set — determines `is_first_time_org_admin`
4. Return user object

---

## DATABASE TRIGGER — AUTO-CREATE PUBLIC.USERS

Create migration file: `002_auth_trigger.sql`

```sql
-- Trigger function: auto-create public.users row when auth.users created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    agent_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'Cypher',                    -- default agent name
    'admin',                     -- first user is always admin
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Notes:**
- `full_name` comes from `raw_user_meta_data` (passed in signup `options.data`)
- `job_title`, `team_size`, `industry` are updated during `/onboarding` — not at signup
- `organisation_name` is stored in `public.organizations` — created during onboarding
- `agent_name` defaults to 'Cypher' — user renames during onboarding
- Role defaults to 'admin' — first user per org always admin

---

## SOFT DELETE IMPLEMENTATION

```sql
-- Add to 002_auth_trigger.sql or separate migration
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT FALSE;

-- RLS: exclude soft-deleted users from all queries
-- Add to existing RLS policies on public.users:
-- WHERE deleted_at IS NULL
```

**Soft delete handler** (extend existing `DELETE /api/v1/account` from Agent 3):
- Set `public.users.deleted_at = NOW()`
- Do NOT delete `auth.users` row (Supabase auth stays intact but login blocked via 401 check)
- Do NOT cascade delete assessment data (retained for compliance)
- Revoke active sessions: `supabase.auth.admin.signOut(userId, 'global')`

---

## RATE LIMITING IMPLEMENTATION

Use a `auth_rate_limits` table in Supabase (simpler than Redis for MVP):

```sql
-- Add to 002_auth_trigger.sql
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,  -- email or user_id
  action VARCHAR(50) NOT NULL,        -- 'login' | 'mfa' | 'resend' | 'reset'
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  locked_until TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_rate_limits_identifier_action 
  ON public.auth_rate_limits(identifier, action);
```

**Rate limit rules:**
| Action | Max Attempts | Window | Lockout Duration |
|--------|-------------|--------|-----------------|
| `login` | 10 | 5 min | 5 min |
| `mfa` | 5 | 5 min | 5 min |
| `resend` | 5 | 1 hour | None (just throttle) |
| `reset` | 5 | 1 hour | None (just throttle) |

**Rate limit utility** — create `/lib/auth/rateLimiter.ts`:
```typescript
export async function checkRateLimit(
  identifier: string,
  action: 'login' | 'mfa' | 'resend' | 'reset'
): Promise<{ allowed: boolean; lockedUntil?: Date }>

export async function incrementAttempt(
  identifier: string,
  action: 'login' | 'mfa' | 'resend' | 'reset'
): Promise<void>

export async function resetAttempts(
  identifier: string,
  action: 'login' | 'mfa' | 'resend' | 'reset'
): Promise<void>
```

---

## EMAIL SERVICE (RESEND)

Resend is already integrated from Agent 5 (3 templates built). Agent 8 adds auth email templates.

**Resend is configured in Supabase dashboard** for transactional auth emails (verification, password reset). Supabase calls Resend automatically — Agent 8 does NOT manually send verification/reset emails.

**Agent 8 must add these custom email templates in Resend dashboard:**

### Template 1: Email Verification
- **Subject:** `Verify your Simplify IS account`
- **From:** `noreply@simplify.is`
- **Body:** Earthen brutalism design matching site aesthetic
  - Simplify IS logo
  - "Welcome to Simplify IS"
  - "Click the button below to verify your email address. This link expires in 24 hours."
  - CTA button: "Verify Email Address" → Supabase verification URL
  - "If you didn't create an account, you can safely ignore this email."
  - Footer: Privacy Policy | Terms of Service

### Template 2: Password Reset
- **Subject:** `Reset your Simplify IS password`
- **From:** `noreply@simplify.is`
- **Body:**
  - "We received a request to reset your password."
  - "Click the button below to set a new password. This link expires in 1 hour."
  - CTA button: "Reset Password" → Supabase reset URL
  - "If you didn't request this, you can safely ignore this email."
  - Footer: Privacy Policy | Terms of Service

### Template 3: Welcome (post-verification)
- **Subject:** `You're in — welcome to Simplify IS`
- **From:** `noreply@simplify.is`
- **Trigger:** Send via Resend API after user successfully verifies email (use Supabase webhook or API call)
- **Body:**
  - "Your email has been verified."
  - "Log in to start your security assessment with Cypher."
  - CTA button: "Log In Now" → `https://simplify.is/login`

**Resend utility** — extend existing `/lib/email/resend.ts`:
```typescript
export async function sendWelcomeEmail(
  to: string,
  full_name: string
): Promise<void>

// Note: verification + reset emails are sent automatically by Supabase via Resend SMTP
// Only sendWelcomeEmail needs to be called manually (post-verification webhook)
```

---

## SUPABASE CONFIGURATION REQUIRED

These must be configured in Supabase dashboard before Agent 8 is complete:

### Auth Settings
- **Email verification:** Enabled
- **Secure email change:** Enabled
- **Email OTP expiry:** 86400 seconds (24 hours) for verification links
- **Password reset expiry:** 3600 seconds (1 hour)
- **MFA:** Enabled (TOTP)
- **SMTP Provider:** Configure Resend SMTP credentials
  - Host: `smtp.resend.com`
  - Port: 465
  - User: `resend`
  - Password: `RESEND_API_KEY`
  - Sender: `noreply@simplify.is`

### URL Configuration
- **Site URL:** `https://simplify.is`
- **Redirect URLs (whitelist):**
  - `https://simplify.is/signup/verified`
  - `https://simplify.is/reset-password`
  - `http://localhost:3000/signup/verified` (local dev)
  - `http://localhost:3000/reset-password` (local dev)

---

## FIRST-TIME ORG ADMIN DETECTION

Logic for determining if a logged-in user should go to `/onboarding` vs `/dashboard`:

```typescript
// In /lib/auth/routing.ts
export async function getPostLoginRedirect(userId: string): Promise<string> {
  const user = await getUserById(userId)  // from public.users
  
  // Not onboarded yet → go to onboarding
  if (!user.is_onboarded) {
    return '/onboarding'
  }
  
  // Already onboarded → go to dashboard
  return '/dashboard'
}
```

**`is_onboarded` flag:**
- Set to `false` by default (trigger creates row with `is_onboarded = false`)
- Set to `true` when user completes onboarding flow (Agent 9 wires this)
- All subsequent logins → `/dashboard`

---

## NEW FILES TO CREATE

```
app/api/v1/auth/
├── signup/route.ts
├── login/route.ts
├── logout/route.ts
├── session/route.ts
├── forgot-password/route.ts
├── reset-password/route.ts
├── resend-verification/route.ts
└── mfa/
    ├── verify/route.ts
    ├── enroll/route.ts
    └── enroll/verify/route.ts

lib/auth/
├── rateLimiter.ts          # Rate limit check/increment/reset utilities
├── routing.ts              # Post-login redirect logic
├── validation.ts           # Zod schemas for all auth request bodies
└── mfa.ts                  # MFA enrollment + verification helpers

lib/email/
└── resend.ts               # Extend existing — add sendWelcomeEmail()

supabase/migrations/
└── 002_auth_trigger.sql    # DB trigger + soft delete columns + rate limit table
```

---

## ZOD VALIDATION SCHEMAS

Create all in `/lib/auth/validation.ts`:

```typescript
export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  full_name: z.string().min(1).max(100),
  organisation_name: z.string().min(1).max(200),
  job_title: z.string().min(1).max(100),
  team_size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
  industry: z.enum(['Financial Services', 'Healthcare', 'Government', 'Technology', 'Retail', 'Education', 'Legal', 'Manufacturing', 'Other'])
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember_me: z.boolean().default(false)
})

export const MFAVerifySchema = z.object({
  factor_id: z.string().min(1),
  code: z.string().length(6).regex(/^\d{6}$/)
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
})

export const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[^A-Za-z0-9]/),
  confirm_password: z.string()
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password']
})
```

---

## SECURITY REQUIREMENTS (NON-NEGOTIABLE)

- Passwords: NEVER logged, NEVER in query strings, NEVER in error messages
- Auth error messages: always generic — never reveal whether email exists or is verified
- Rate limiting: applied BEFORE any Supabase calls (don't waste API calls on blocked requests)
- JWT validation: on every protected route using `lib/auth/server.ts` `requireAuth()`
- Session tokens: HTTP-only cookies only — never in localStorage or sessionStorage
- CSRF: Supabase handles CSRF protection via PKCE flow — ensure `app/auth/callback/route.ts` is intact from Agent 1
- All rate limit checks: use `SUPABASE_SERVICE_KEY` (server-side only)
- Soft-deleted users: treat as non-existent in all auth responses (return 401, not 403)
- MFA challenge expiry: challenges expire after 5 minutes — handle gracefully in UI

---

## TESTING REQUIREMENTS

Before writing `HANDOFF_8_AUTH_BACKEND.md`, all of the following must pass:

### Unit Tests (`npm test`)
- [ ] SignupSchema validates all field combinations correctly
- [ ] LoginSchema rejects malformed emails
- [ ] MFAVerifySchema rejects non-6-digit codes
- [ ] ResetPasswordSchema rejects mismatched passwords
- [ ] rateLimiter correctly increments + blocks after threshold
- [ ] rateLimiter correctly resets on success
- [ ] getPostLoginRedirect returns `/onboarding` for non-onboarded users
- [ ] getPostLoginRedirect returns `/dashboard` for onboarded users

### Integration Tests
- [ ] `POST /api/v1/auth/signup` — success returns 202
- [ ] `POST /api/v1/auth/signup` — duplicate email returns 409 (generic message)
- [ ] `POST /api/v1/auth/signup` — weak password returns 400
- [ ] `POST /api/v1/auth/login` — unverified email returns 403
- [ ] `POST /api/v1/auth/login` — wrong password returns 401 (generic)
- [ ] `POST /api/v1/auth/login` — 11th attempt returns 423
- [ ] `POST /api/v1/auth/forgot-password` — always returns 200
- [ ] `POST /api/v1/auth/resend-verification` — always returns 200
- [ ] `POST /api/v1/auth/logout` — clears session
- [ ] `GET /api/v1/auth/session` — returns user for valid JWT
- [ ] `GET /api/v1/auth/session` — returns 401 for no JWT
- [ ] DB trigger fires on signup — `public.users` row exists
- [ ] Soft delete — user cannot log in after `deleted_at` set

### Build
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — zero errors

---

## DEFINITION OF DONE

Agent 8 is complete when ALL of the following are true:

- [ ] All 10 auth API endpoints built and tested
- [ ] DB trigger `002_auth_trigger.sql` migration created and pushed
- [ ] Rate limiting working for login, MFA, resend, reset
- [ ] Soft delete implemented on `public.users`
- [ ] `is_onboarded` flag logic working
- [ ] Post-login routing logic in `/lib/auth/routing.ts`
- [ ] All Zod validation schemas in `/lib/auth/validation.ts`
- [ ] Resend SMTP configured in Supabase dashboard
- [ ] Email templates created in Resend dashboard (verification, reset, welcome)
- [ ] Supabase auth settings configured (redirect URLs, MFA enabled, expiry times)
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] `npm run lint` passes — zero errors
- [ ] `npm run build` passes — zero errors
- [ ] `HANDOFF_8_AUTH_BACKEND.md` written with every function signature + API contract

---

## WHAT AGENT 9 NEEDS FROM THIS HANDOFF

When writing `HANDOFF_8_AUTH_BACKEND.md`, include explicitly:

1. **Exact API endpoint URLs** — full paths for all 10 endpoints
2. **Request + response shapes** — exact TypeScript types for every endpoint
3. **Error codes + messages** — complete list of every error response
4. **Cookie/session strategy** — how session tokens are stored and sent
5. **Rate limit identifiers** — exactly what key is used per action (email? user_id?)
6. **`is_onboarded` flag** — how and where it gets set to `true`
7. **MFA flow sequence** — exact order of API calls for login → MFA → verify
8. **Supabase redirect URLs** — exact URLs configured for email links
9. **Known gaps** — anything deferred to Agent 9 or later

---

*Locked in planning session with Vik Soni, April 2026. All decisions above are final. Do not reopen without explicit confirmation from Vik.*
```

---

## FILE: `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`

Path: `agents/09_AGENT_INTEGRATION_AuthUIAPIWiring.md`

```markdown
# Agent 9 — Auth UI/API Wiring
## `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`
### Status: LOCKED | Version: April 2026

---

## READS (REQUIRED BEFORE STARTING)
- `CLAUDE.md`
- `HANDOFF_7_PRELOGIN_UIUX.md` — every stub function, form field names, component locations
- `HANDOFF_8_AUTH_BACKEND.md` — every API endpoint shape, response types, error codes
- `SIMPLIFY_IS_MASTER_CONTEXT.md`

## WRITES
- `HANDOFF_9_AUTH_INTEGRATION.md` (every wired flow documented — required before Agent 10 starts)

---

## MISSION

Wire Agent 7's UI stubs to Agent 8's backend endpoints. After Agent 9 completes, the entire pre-login auth experience works end-to-end: signup, email verification, login, MFA, password reset, session management, logout. No new UI. No new backend. Wiring only.

**Rule: If something isn't in HANDOFF_7 or HANDOFF_8, do not build it. Flag it and stop.**

---

## LOCKED INTEGRATION DECISIONS

| Decision | Choice |
|----------|--------|
| Form submission | POST immediately — disable button, show spinner, handle response |
| JWT persistence | HttpOnly cookie — server sets it, never accessible via JavaScript |
| Session storage | Supabase sessions — no custom JWT logic |
| MFA | Supabase TOTP — authenticator app (Google Authenticator, Authy, Microsoft) |
| Password hashing | Supabase handles bcrypt — never touch passwords in Node layer |
| Email verification | Link-based via Resend → `/signup/verified` → login form on same page |
| User row creation | Auto-created via DB trigger on `auth.users` insert — onboarding enriches |
| Account deletion | Soft delete — `deleted_at` timestamp, data kept for audit |
| Rate limiting | 10 login attempts → 5 min lockout, 5 MFA attempts → 5 min lockout, 5 resend/hr |
| Remember me | 7-day session extension — Supabase session config |

---

## FLOWS TO WIRE (ALL 8 — REQUIRED)

### Flow 1 — Signup
**UI:** `/signup` form → submit button
**Wiring:**
1. User fills form (Full Name, Email, Password, Confirm Password, Organisation Name, Job Title, Team Size, Industry)
2. Real-time blur validation already built by Agent 7 — do not change validation logic
3. On submit: disable button + show spinner
4. POST to Agent 8 signup endpoint with all form fields
5. On success: redirect to `/signup/verify`
6. On error (email already exists): show inline generic error — `"An account with this email already exists."`
7. On error (validation): show field-level error from API response
8. On any error: re-enable button, hide spinner

**Important:** Job Title must be passed to backend — it is displayed on dashboard welcome screen.

---

### Flow 2 — Email Verification
**UI:** `/signup/verify` holding screen + `/signup/verified` confirmation screen
**Wiring:**
1. `/signup/verify` — resend button POSTs to Agent 8 resend endpoint
2. Resend: disable button for 60 seconds after click (countdown timer visible)
3. Rate limit: after 5 resends, show `"You've reached the resend limit. Please try again later."`
4. Verification link click (from email) → Supabase handles token validation → redirects to `/signup/verified`
5. `/signup/verified` — displays success banner + login form (email pre-filled from URL param if available)
6. Login form on `/signup/verified` submits to same Login flow (Flow 3) below

---

### Flow 3 — Login
**UI:** `/login` form
**Wiring:**
1. User enters email + password + optional "Remember me" checkbox
2. On submit: disable button + show spinner
3. POST to Agent 8 login endpoint
4. On success (no MFA): Supabase sets HttpOnly session cookie → redirect to `/dashboard` or `/onboarding` (routing logic below)
5. On success (MFA enabled): redirect to `/login/mfa` with session token in URL param (not in localStorage)
6. On error (invalid credentials): show `"Invalid email or password."` — never say which field is wrong
7. On error (email not verified): show `"Please verify your email address before logging in."` with resend link
8. On error (account locked): show `"Too many attempts. Please try again in 5 minutes."`
9. On error (soft deleted account): show `"This account has been deactivated. Please contact support."`
10. Remember me: if checked, pass `remember: true` to backend → 7-day session extension via Supabase

**Post-login routing logic:**
```typescript
// After successful login (no MFA) or successful MFA (Flow 4):
const { data: user } = await supabase.from('users').select('onboarding_completed, organization_id').single()

if (!user.onboarding_completed || !user.organization_id) {
  redirect('/onboarding')  // First-time org user
} else {
  redirect('/dashboard')   // All other users
}
```

---

### Flow 4 — MFA Verification
**UI:** `/login/mfa` — 6-digit code input
**Wiring:**
1. Page loads with pending MFA session (from Flow 3 redirect)
2. User opens authenticator app, enters 6-digit TOTP code
3. **Auto-submit on 6th digit** — no submit button click required
4. POST to Agent 8 MFA verify endpoint with code
5. On success: Supabase confirms session → run post-login routing logic (same as Flow 3)
6. On error (wrong code): clear input, show `"Invalid code. Please try again."` — do not reveal attempts remaining until 3rd failure
7. On 3rd failure: show `"2 attempts remaining before lockout."`
8. On 5th failure: show `"Too many attempts. Please try again in 5 minutes."` — disable input for lockout duration
9. Resend/regenerate code option: visible after 30 seconds — POST to Agent 8 resend MFA endpoint

---

### Flow 5 — Forgot Password Request
**UI:** `/forgot-password` form
**Wiring:**
1. User enters email → submit
2. On submit: disable button + show spinner
3. POST to Agent 8 password reset request endpoint
4. On ANY response (success or email not found): show same message — `"If that email exists, we've sent a reset link."` — never confirm whether email exists
5. Re-enable button after 60 seconds (prevent spam)

---

### Flow 6 — Password Reset
**UI:** `/reset-password` form
**Wiring:**
1. Page loads with reset token from URL params (Supabase handles token in URL)
2. Validate token on page load — if invalid/expired: show `"This reset link has expired. Please request a new one."` with link to `/forgot-password`
3. User enters new password + confirm password
4. Real-time blur validation: password strength indicator + confirm match check
5. On submit: disable button + show spinner
6. POST to Agent 8 password reset confirm endpoint with new password + token
7. On success: redirect to `/login` with success banner — `"Password reset successful. Log in with your new credentials."`
8. On error (token expired mid-form): show `"This reset link has expired."` with `/forgot-password` link
9. On error (password too weak): show field-level error

---

### Flow 7 — Session Persistence + Protected Routes
**UI:** `middleware.ts`
**Wiring:**
1. Read Supabase session from HttpOnly cookie on every request
2. Protected routes: `/dashboard/*`, `/assessment/*`, `/onboarding/*`, `/api/v1/*`, `/api/internal/*`
3. If no valid session on protected route: redirect to `/login`
4. If valid session on auth routes (`/login`, `/signup`): redirect to `/dashboard`
5. If valid session but `deleted_at` is set: clear session cookie → redirect to `/login` with error banner

**Middleware already built by Agent 1** — extend it, do not rewrite it.

---

### Flow 8 — Logout
**UI:** Logout button (location defined in HANDOFF_7 — check before wiring)
**Wiring:**
1. User clicks logout
2. POST to Agent 8 logout endpoint
3. Supabase clears session + HttpOnly cookie
4. Redirect to `/` (home page — NOT `/login`)
5. Clear any client-side state (React Query cache, any in-memory state)

---

## ERROR HANDLING RULES (ALL FLOWS)

- **Never reveal whether an email exists** in the system — always use generic messages
- **Never show API error details** to the user — log to console in dev only, never in production
- **Never disable forms permanently** — always provide a recovery path
- **Always re-enable submit button** after an error so user can try again
- **Loading states:** button disabled + spinner on ALL form submissions — no exceptions
- **Network errors:** show `"Something went wrong. Please try again."` — never expose fetch errors

---

## SESSION MANAGEMENT

### HttpOnly Cookie Setup
```typescript
// Supabase handles this automatically with SSR setup
// In /lib/auth/server.ts (already built by Agent 1):
import { createServerClient } from '@supabase/ssr'

// Cookie options — Agent 9 must verify these are set:
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7  // 7 days when remember me is checked
                              // 60 * 60 * 24 default (24hr) when not checked
}
```

### Session Check Pattern
```typescript
// Use in Server Components and API routes:
import { createServerClient } from '@/lib/auth/server'

const supabase = createServerClient()
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  redirect('/login')
}
```

---

## AUTH LIBRARY WIRING

All auth calls must go through `/lib/auth/client.ts` and `/lib/auth/server.ts` — already built by Agent 1. Do NOT call Supabase auth directly from components or pages.

```typescript
// /lib/auth/client.ts — extend with these functions if not already present:

export async function signUp(params: SignUpParams): Promise<AuthResult>
export async function signIn(params: SignInParams): Promise<AuthResult>
export async function signOut(): Promise<void>
export async function verifyMFA(code: string): Promise<AuthResult>
export async function requestPasswordReset(email: string): Promise<void>
export async function confirmPasswordReset(token: string, password: string): Promise<void>
export async function resendVerificationEmail(email: string): Promise<void>
export async function getSession(): Promise<Session | null>
export async function getUser(): Promise<User | null>
```

**Read HANDOFF_8 for exact function signatures Agent 8 implemented — match them exactly.**

---

## REACT QUERY INTEGRATION

Use React Query for all auth state that needs to be cached or shared across components.

```typescript
// /lib/api/hooks/useAuth.ts — create this file:

export function useSession() // Returns current session
export function useUser()    // Returns current user + public.users data
export function useSignUp()  // Mutation
export function useSignIn()  // Mutation
export function useSignOut() // Mutation
export function useVerifyMFA() // Mutation
```

**Invalidate relevant queries after mutations** — e.g. after signIn, invalidate `useUser` query.

---

## GTM ANALYTICS — AUTH EVENTS

Wire these events to `lib/analytics/gtm.ts` (built by Agent 7):

```typescript
// On signup form submit attempt:
gtm.track('signup_started')

// On signup success:
gtm.track('signup_completed', { job_title, team_size, industry })

// On login submit attempt:
gtm.track('login_attempted')

// On login success:
gtm.track('login_success', { mfa_used: boolean })

// On MFA completion:
gtm.track('mfa_completed')

// On password reset request:
gtm.track('password_reset_requested')

// On password reset completion:
gtm.track('password_reset_completed')

// On logout:
gtm.track('logout')
```

---

## DATABASE TRIGGER VERIFICATION

Agent 9 must verify the `public.users` auto-create trigger is working correctly before declaring done.

```sql
-- Verify trigger exists (run in Supabase SQL editor):
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';
```

If trigger is missing: check HANDOFF_8 — Agent 8 was responsible for creating it. If not in HANDOFF_8, create it now:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## ONBOARDING ENRICHMENT

After first-time login → redirect to `/onboarding`. Onboarding flow updates `public.users` with:

```typescript
// PATCH /api/v1/users/me or direct Supabase call through auth abstraction:
{
  full_name: string,
  job_title: string,        // From signup form — display on dashboard
  team_size: string,        // From signup form
  industry: string,         // From signup form
  organization_name: string, // From signup form
  agent_name: 'Cypher',    // Default — user renames in onboarding
  onboarding_completed: true,
  organization_id: uuid     // Created during onboarding
}
```

**Note:** These fields come from the signup form (already stored in `auth.users` metadata by Agent 8). Onboarding reads them and writes to `public.users`. Check HANDOFF_8 for exact metadata field names.

---

## SECURITY REQUIREMENTS (NON-NEGOTIABLE)

- JWT in HttpOnly cookie only — never in localStorage, never in sessionStorage, never in URL params (except the MFA session token redirect — which must be short-lived and single-use)
- CSRF protection: verify tokens stubbed by Agent 7 are now wired to real CSRF validation (Agent 8 provides CSRF endpoint — check HANDOFF_8)
- All auth API calls: go through `/lib/auth/` abstraction — never call Supabase directly from components
- Passwords: NEVER logged, NEVER in query strings, NEVER in any client-side state
- Session invalidation: logout must clear both Supabase session AND HttpOnly cookie
- Soft-deleted users: session cleared immediately if `deleted_at` is set — checked in middleware
- No auth state in URL params (except Supabase magic link tokens — those are Supabase's responsibility)

---

## TESTING REQUIREMENTS

Agent 9 must manually test every flow end-to-end before writing HANDOFF_9.

### Happy Path Tests (all must pass):
- [ ] Signup with new email → verify → login → onboarding → dashboard
- [ ] Signup with existing email → correct error shown
- [ ] Login with correct credentials (no MFA) → dashboard
- [ ] Login with correct credentials (MFA enabled) → MFA page → dashboard
- [ ] Wrong password 10 times → lockout message shown
- [ ] Wrong MFA code 5 times → lockout message shown
- [ ] Forgot password → email → reset link → new password → login success banner
- [ ] Remember me checked → session persists after browser close
- [ ] Remember me unchecked → session clears after browser close
- [ ] Logout → redirects to home → session cleared → can't access /dashboard
- [ ] Direct URL to /dashboard without session → redirects to /login
- [ ] Direct URL to /login with valid session → redirects to /dashboard

### Error State Tests (all must pass):
- [ ] Login before email verified → correct error with resend link
- [ ] Reset link expired → correct error with /forgot-password link
- [ ] Invalid MFA code → clear input, error shown, counter works
- [ ] Network failure during login → generic error, button re-enabled
- [ ] Resend email 5 times → rate limit message shown

### Build Tests:
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — zero errors
- [ ] No console errors in browser on any auth page

---

## DEFINITION OF DONE

Agent 9 is complete when ALL of the following are true:

- [ ] All 8 auth flows wired end-to-end
- [ ] HttpOnly cookie session working (set by server, not accessible via JS)
- [ ] Post-login routing working (first-time org → /onboarding, others → /dashboard)
- [ ] All error states handled with correct generic messages
- [ ] Loading states on all form submissions (button disabled + spinner)
- [ ] GTM auth events firing correctly
- [ ] DB trigger verified — `public.users` auto-created on signup
- [ ] All happy path + error state tests passing manually
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `HANDOFF_9_AUTH_INTEGRATION.md` written

---

## WHAT HANDOFF_9 MUST CONTAIN

For Agent 10 (post-login dashboard) and Agent 14 (final security audit):

1. Exact HttpOnly cookie name and configuration
2. Exact session check pattern used in middleware
3. All auth hook signatures (`useSession`, `useUser`, etc.)
4. Confirmed DB trigger name and function name
5. GTM events confirmed firing (list each one)
6. Any deferred items or known issues
7. Environment variables added (if any)
8. `npm run lint` ✅ and `npm run build` ✅ confirmed

---

*Locked in planning session with Vik Soni, April 2026. Reads HANDOFF_7 + HANDOFF_8 before starting. All decisions above are final.*
```

---

## FILE: `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`

Path: `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`

```markdown
# Agent 10 (Claude Code) — Post-Login UI/UX Review & Polish Pass
## Simplify IS | Dashboard Layout + All Post-Login Screens — Refinement
### Version: April 2026 | Runs AFTER Cursor Agent 10 Completes

---

## ROLE & MISSION

Cursor has built the first pass of the post-login UI/UX based on `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`. Your job is to **review, refine, and finish the polish pass** — everything Cursor may have missed, rushed, or built to a lower standard than the spec requires.

**You are not rebuilding.** You are:
1. Auditing Cursor's work against the full spec
2. Fixing visual inconsistencies, incomplete states, missing animations
3. Completing light-mode coverage where Cursor only handled dark mode
4. Completing responsive variants where Cursor only handled desktop
5. Tightening accessibility, performance, and code quality
6. Removing any TODO / placeholder / console.log from merged code
7. Delivering a MVP-ready, production-quality post-login UI

**Do not break any working Cursor build output.** Extend, refine, and polish — don't rewrite unless the file is fundamentally off-spec.

---

## READ BEFORE YOU START

Read **in this exact order**:

1. `/Users/vik/Documents/Code/simplify-is/10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md` — the Cursor spec (the ground truth for what should exist)
2. `/Users/vik/Documents/Code/simplify-is/docs/HANDOFF_10_POSTLOGIN_CURSOR.md` — Cursor's actual completion report (what got built, what was flagged as incomplete)
3. `/Users/vik/Documents/Code/simplify-is/01_MASTER_CONTEXT.md` — full project context
4. `/Users/vik/Documents/Code/simplify-is/04_DESIGN_SYSTEM.md` — Earthen Brutalism design system
5. All PNG references in `/Users/vik/Documents/Code/simplify-is/stitch_output/` — especially the Industry Dashboard hero page (the visual north star)
6. All HTML references in the project root — for pixel-level typography/colour/elevation verification

**Then run a full project tour:**
- `view /Users/vik/Documents/Code/simplify-is` (directory listing)
- Read `/components/layout/*.tsx` first (canonical layout)
- Read `/components/dashboard/IndustryDashboard.tsx` second (the hero)
- Spot-check a handful of other components to gauge Cursor's overall quality bar

---

## REVIEW CHECKLIST — GO THROUGH IN ORDER

### Checklist 1 — Canonical Layout

**DashboardLayout, Header, LeftSidebar, Footer**

- [ ] Header height matches spec (64px desktop / 56px tablet / 52px mobile)
- [ ] Header background uses correct glassmorphism (`rgba(20,19,17,0.80)` dark + 12px blur; `rgba(255,252,242,0.85)` light + 12px blur)
- [ ] Header has NO visible 1px border — only a gradient fade on the bottom edge
- [ ] Left sidebar width correct (260px desktop / 220px tablet)
- [ ] Left sidebar background uses `surface-container-low` (no border against content panel — use surface shift)
- [ ] All 5 top-level menu items present (Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings)
- [ ] **Organisation Settings hidden from DOM** for non-admin users (not just visually hidden — actually not rendered)
- [ ] "Dashboards" and "Organisation Settings" both collapsible with chevron indicator
- [ ] Active state: **3px primary-colour left bar** on the active item; confirm it aligns correctly for both top-level and sub-items
- [ ] Auto-collapse behaviour working: clicking a non-sub-item group collapses Dashboards; clicking a non-Dashboards item collapses Organisation Settings
- [ ] Clicking top-level "Dashboards" while collapsed → expands AND navigates to `/dashboard/industry`
- [ ] Clicking top-level "Organisation Settings" while collapsed → expands AND navigates to `/organisation/users`
- [ ] Mobile: sidebar drawer slides in with overlay, tap-outside dismisses
- [ ] Footer height, styling, content correct (40px desktop, 36px tablet)

**Fix anything off-spec.**

### Checklist 2 — Header Top-Right (Notification + User Avatar)

- [ ] Notification bell icon button (40×40px) with aria-label
- [ ] Unread count badge (primary bg, white text) positioned correctly
- [ ] Click bell → opens `NotificationPopover` (absolute, 360px wide, max-height 480px)
- [ ] Popover has "Mark all read" link at top; list of notifications below; each with icon, title, description, timestamp, unread dot
- [ ] User avatar (or initials circle) 40×40px
- [ ] Click avatar → opens `UserProfileDropdown` (240px wide)
- [ ] Dropdown items: user info header (avatar + name + email), divider, Edit Profile, Change Password, MFA Settings, divider, Logout
- [ ] All dropdown items keyboard-navigable (arrow keys, Enter, Esc)
- [ ] Dropdowns close on: Esc, click outside, click on another interactive area
- [ ] Focus management: avatar dropdown focus-traps when open; restores focus to avatar button on close

**Fix anything missing or broken.**

### Checklist 3 — User Profile Modals

**Edit Profile Modal:**
- [ ] Width 480px, rounded 12px, centred on screen
- [ ] Avatar uploader works (drop zone + click to upload); validates PNG/JPG/WebP, max 2MB
- [ ] Full Name, Position, Organisation Name all editable
- [ ] Email is read-only with tooltip explanation
- [ ] Save submits to `PATCH /api/v1/users/me`, shows success toast, closes modal
- [ ] Cancel closes without saving

**Change Password Modal:**
- [ ] Current, New, Confirm fields all present
- [ ] Password strength meter shows below New field, updates in real-time
- [ ] Strength calculation (Weak <8, Fair 8–11, Good 12–15, Strong 16+)
- [ ] Validation (min 12 chars, one upper, one lower, one number, one special)
- [ ] Inline errors on blur
- [ ] Submit disabled until all valid
- [ ] On success: close modal, toast "Password updated", optionally sign user out of other devices

**MFA Settings Modal:**
- [ ] Shows current state (Not Enabled / Active)
- [ ] Enable MFA flow: QR code → code entry → recovery codes → confirmation
- [ ] Recovery codes shown ONCE, offered as PDF download
- [ ] "Regenerate Recovery Codes" flow (warning modal first)
- [ ] Disable MFA requires current password

**Fix any modal that's incomplete.** Add any missing ARIA roles, focus traps, backdrop click-to-close behaviour.

### Checklist 4 — Onboarding Flow

**OnboardingShell:**
- [ ] Minimal header with Logo + Step N of 4 indicator + 4-segment progress bar
- [ ] NO left sidebar, NO user avatar dropdown (onboarding-specific shell)
- [ ] Centred card (max-width 720px, rounded 12px, padding 48px)
- [ ] Dark textured background (surface-container-low)

**Step 1 — Name Your AI Consultant:**
- [ ] "INITIALISATION" eyebrow + "Name Your AI Consultant" headline + descriptive paragraph
- [ ] Input max 10 chars, placeholder "e.g. Cypher"
- [ ] Allowed characters rule enforced
- [ ] Blank submit → defaults to "Cypher"
- [ ] "Initialise Identity" button shows spinner on click
- [ ] POST `/api/v1/onboarding/consultant-name`
- [ ] On success → navigate to Step 2

**Step 2 — Set Up Your Organisation:**
- [ ] Organisation Name input (2–100 chars)
- [ ] Industry dropdown with full 16-option list (confirm list matches spec exactly)
- [ ] Countries autocomplete multi-select using the 45-country list
- [ ] Workforce Scale as 4 large tile dials (not radio buttons)
- [ ] Tiles show name + range + short descriptor
- [ ] Selected tile: primary border + surface-bright bg + glow
- [ ] "Continue Setup" disabled until all fields valid
- [ ] Back button returns to Step 1, previous inputs persist
- [ ] POST `/api/v1/onboarding/organisation` on submit

**Step 3 — Choose Your Frameworks:**
- [ ] 6 tiles in 2 rows × 3 columns (or 2×3, match reference)
- [ ] ISO 27001:2022 + NIST CSF 2.0 pre-selected, not deselectable
- [ ] APRA CPS 234 toggleable
- [ ] SOC 2 / PCI DSS / HIPAA disabled with "COMING SOON" pill
- [ ] Selected tile: primary 2px border + glow + checkmark top-right
- [ ] Helper info: "You can modify your framework selection... Changes can be made once every 30 days."
- [ ] POST `/api/v1/onboarding/frameworks` on submit

**Step 4 — Your Workspace is Ready:**
- [ ] 5 tiles matching left sidebar menu items (Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings)
- [ ] Each tile: icon + title + conceptual description (match the sidebar icons exactly)
- [ ] Layout: 2×2 grid with 5th tile centred below, OR 3+2 layout — pick cleanest
- [ ] "Launch Application" button → POST `/api/v1/onboarding/complete` → navigate to `/dashboard/initialisation`
- [ ] Footer shows "SECURE SESSION ESTABLISHED · AUTH: 256-BIT"

**All onboarding copy in Australian English. All agent name references render as `{name} 🤖`.**

### Checklist 5 — Initialisation Screen

- [ ] Route `/dashboard/initialisation` only accessible if `users.has_seen_initialisation === false`
- [ ] Uses canonical DashboardLayout (sidebar + header + footer all present)
- [ ] Centred hero with hexagonal icon, "INITIALISATION COMPLETE" eyebrow, "Your environment is initialised." headline (with "initialised." in primary italic)
- [ ] 3 tiles: "Explore Mission Control" / "Begin Assessment" / "Map Industry Risks"
- [ ] Centre tile ("Begin Assessment") visually elevated (primary border, glow, arrow)
- [ ] Each tile shows a sequence number (01 / 02 / 03), category label (DASHBOARD / CONSULT / INTELLIGENCE), icon, title, description
- [ ] Click any tile → `PATCH /api/v1/users/me { hasSeenInitialisation: true }` → navigate
- [ ] Subsequent visits to `/dashboard/initialisation` → redirect to `/dashboard/industry`

### Checklist 6 — Industry Dashboard ⭐ (HIGHEST SCRUTINY)

**This is the visual north star.** Spend the most time here.

- [ ] Page title "Industry View" (Raleway 800 32px) + subtitle
- [ ] Consent toggle top-right of page, ON by default, labelled "Share anonymised maturity data" with ⓘ tooltip explaining privacy
- [ ] **D3 radar chart:**
  - Two polygons (your maturity + industry average)
  - 6 axes (GV, ID, PR, DE, RS, RC)
  - Your polygon: primary fill 30%, stroke 100%
  - Industry polygon: outline fill 15%, dashed stroke 60%
  - Hover on axis → tooltip with your score, peer score, delta
  - Legend below with coloured swatches
  - Animated entrance (morph from centre outward, 800ms ease)
  - Reduced-motion: skip morph, fade only
- [ ] **Metrics Panel (right):**
  - Maturity Score tile with big number (64px) coloured by score
  - Peer Percentile tile referencing user's industry
  - Benchmark Gap tile with +/- styling
- [ ] **Middle row:**
  - Your Strengths tile: top 2 domains where user exceeds peer average
  - Strategic Priority tile: top 3 trailing controls with "Generate Remediation Plan" button (stub)
- [ ] **Bottom row:**
  - Security Briefing tile (static content acceptable for MVP)
  - Your Progress tile with sparkline of ALL past assessments, last assessment timestamp, delta since last
- [ ] **Floating Cypher button:**
  - 64×64px circle, fixed bottom-right of content panel (32px offset)
  - Primary gradient bg, robot emoji, subtle pulse animation
  - Hover tooltip left-aligned: "Ask {agent-name} 🤖"
  - Click → opens Cypher chat modal
- [ ] **Loading state:** skeleton loaders on mount
- [ ] **Empty state:** radar shows peer-only, metrics show "—", strengths/priority placeholders, sparkline shows "No assessments yet"

**Visual fidelity check:** Open the PNG reference side-by-side with the running build. Typography, spacing, colour application, elevation — all should match as closely as possible.

### Checklist 7 — Framework View

- [ ] Framework tabs correct (only show tabs for frameworks user selected)
- [ ] Default active = first framework selected at onboarding
- [ ] 30/70 split (top overview + summary / bottom tree + detail)
- [ ] **Top 30%:**
  - Compact overview viz (D3 radar for NIST; stacked horizontal bars for ISO/APRA)
  - 3 summary cards (What Improved / What Needs Focus / What's Been Ignored)
  - Cards show headline stats by default, expand on hover to show top 3 items
  - Click card → filter tree below to show those controls
- [ ] **Bottom 70%:**
  - Tree (left 70% of bottom): domains expandable, controls nested, active control has orange left bar
  - Filter row above tree: [All / Not Started / In Progress / Completed] + search input
  - Multiple domains can be expanded at once
  - Right panel (30% of bottom): control detail with ID, name, maturity/status, **coverage badge (% + bar + tooltip)**, description, related controls (clickable cross-framework), evidence, N.A. justification, last-updated, CTA "Discuss with {agent-name} 🤖"
- [ ] Polymorphic overview viz switches correctly based on active framework tab
- [ ] Tree → detail panel interaction instant (no modal, no navigation)
- [ ] Keyboard navigation in tree (arrow keys, Enter to select)

### Checklist 8 — Risk View

**Stage 1 (Risk Selection):**
- [ ] Only shown if `selectedRisks.length === 0`
- [ ] Sequential one-risk-at-a-time flow
- [ ] Card shows: eyebrow ("RISK LIBRARY"), step indicator ("Risk 3 of 20"), progress bar, risk title, description, Yes/No buttons
- [ ] YES → priority selector (Actively Tracking / Concerned but Managing / Aware but Low Priority) with colour-coded dots
- [ ] Priority select → auto-advance to next risk (400ms transition)
- [ ] NO → auto-advance
- [ ] Every choice POSTed immediately (resume-capable mid-flow)
- [ ] Completion screen: summary stats + "Continue to Risk Dashboard" button
- [ ] Background mapping of risks to controls runs while summary shows

**Stage 2 (Risk Dashboard):**
- [ ] 70/30 split (list / detail)
- [ ] Left panel: three priority sections, each collapsible with chevron
- [ ] Risks listed in cards with title, mitigation strength indicator, related controls count
- [ ] Active risk has orange left bar
- [ ] Bottom of list: "+ Add Custom Risk" + "↻ Review Risk Library Again"
- [ ] Right panel: risk name, priority, mitigation strength bar with contextual message, related controls list (each with maturity + coverage, clickable to Framework View), "Discuss with {agent-name} 🤖" CTA, expandable Likelihood & Impact form
- [ ] Custom Risk modal: textarea, Claude mapping confirmation flow
- [ ] Likelihood & Impact form posts to `/api/v1/risks/rating`

### Checklist 9 — Assessment

**Landing Screen:**
- [ ] Framework tiles, one per selected framework
- [ ] Each tile shows: framework name, status, last activity, maturity OR compliance metric, progress bar, pending-Cypher count (if any)
- [ ] Buttons vary by status (Start / Resume / Re-assess + optional Review with Cypher)
- [ ] Button labels use dynamic agent name with emoji (e.g., "Review with Sarah 🤖")
- [ ] Helper info at bottom: "Already completed? You can always update via {agent-name} 🤖."

**Path 1 (Direct Questions):**
- [ ] Header: "NIST CSF 2.0 Assessment" + Exit button
- [ ] Top progress bar showing domain-by-domain progress
- [ ] Left sidebar (within assessment): domain tree with checkmarks / current-question indicator
- [ ] Main content: question number + control context + question text + 3–5 multiple-choice options + "Type your own answer" textarea + Skip / Unsure buttons + Previous / Next
- [ ] Each answer POSTs immediately
- [ ] Skipped questions marked `skipped`; Unsure questions marked `flagged_for_cypher`
- [ ] Domain-complete overlay shows at end of each domain
- [ ] Exit → confirmation modal → return to Assessment Landing

**Path 2 (Review with Cypher):**
- [ ] Full content panel takeover (NOT modal — different from general Cypher chat)
- [ ] Loads flagged questions from the selected framework
- [ ] Cypher-led dialogue: explain, probe, synthesise
- [ ] Per question: end-of-discussion summary card with proposed score + Accept / Edit / Rediscuss actions
- [ ] "Exit Review" top-right returns to Assessment Landing

### Checklist 10 — Maturity Roadmap

- [ ] Three collapsible summary cards (Maintain / Uplift / Industry Shifts)
- [ ] Each card: colour-coded dot, count, headline metric, Expand button
- [ ] Only ONE card expanded at a time
- [ ] Expand animation smooth (300ms height auto)
- [ ] Expanded section: filter row (Framework / Domain / Priority / Due Date) + action item list
- [ ] Action item row: priority dot, title, due date (relative; overdue in danger colour), control ID, chevron to expand inline
- [ ] Inline expansion: description, related framework, last completed, buttons (Mark Complete / View Control / Discuss with {agent-name})
- [ ] Uplift section has target banner: "Your target: 4.0 maturity. Current: 2.8. 47 actions will close this gap." + progress bar
- [ ] Industry Shifts items include "Why this matters to you" line + Dismiss button

### Checklist 11 — Progress & Milestones

**Tabs:** Timeline · Comparison · Milestones
**Sub-tabs:** Framework selector (ISO / NIST / APRA)

**Timeline:**
- [ ] Framework-specific visualisation (line for NIST, stacked area for ISO, stacked bar for APRA)
- [ ] Time range selector (30d / 90d / 12mo / Custom)
- [ ] Snapshot table below chart

**Comparison:**
- [ ] Two period pickers
- [ ] Overlay visualisation (two radar polygons for NIST, side-by-side stacked bars for ISO/APRA)
- [ ] Delta summary panel listing biggest movers

**Milestones:**
- [ ] Vertical feed, chronological, newest first
- [ ] Time range filter (This Week / Month / Quarter / Year / All)
- [ ] Card types: Wins (green) / Challenges (red) / Key Events (grey) / Celebrations (gold)
- [ ] Each card clickable to expand inline for full context

### Checklist 12 — Organisation Settings (Admin Only)

**Users:**
- [ ] Table with Name / Email / Role / Status / Actions
- [ ] Filter + search working
- [ ] Invite User modal (email, role, optional message, Send)
- [ ] Row actions menu (Edit role / Resend invite / Deactivate / Assign domains)

**Preferences:**
- [ ] Organisation Details section (editable)
- [ ] Selected Frameworks section with per-framework toggle
- [ ] **30-day cooldown enforced** on framework toggles — disabled state with "Last change: {date}. Next change available: {date}."
- [ ] Session Settings (slider + auto-save checkbox)
- [ ] Notification Defaults (email + in-app toggles per event type)
- [ ] Data Export (default format + auto-export schedule)
- [ ] Auto-save on blur/toggle with toast confirmation

**Billing:**
- [ ] Current Plan / Frameworks Included / Add-ons / Payment Method / Invoices table
- [ ] CTA to Stripe customer portal

**Audit:**
- [ ] Chronological feed of user-contribution events
- [ ] Entry shows: relative timestamp, user name, control ID + name, framework, answer, impact (score change), previous answer
- [ ] Filters: Framework + Date Range
- [ ] Scroll-paginated

### Checklist 13 — Cypher Chat Modal

- [ ] Slides in from right (36% desktop / 50% tablet / 100% mobile)
- [ ] Dark overlay (`rgba(0,0,0,0.3)`) on dashboard behind
- [ ] Overlay click OR Esc → close
- [ ] Header: agent name + 🤖, sub-text "Your AI Security Consultant", close button
- [ ] Messages area: agent bubbles left (primary-tinted bg), user bubbles right (surface-container-high bg)
- [ ] Typing indicator (3 bouncing dots) when Cypher generating
- [ ] Quick reply pills appear below latest agent message when relevant
- [ ] Input textarea auto-grows to 4 lines; Enter sends; Shift+Enter new line
- [ ] Send button disabled when empty
- [ ] Paste sanitisation (strips HTML)
- [ ] Auto-focus input on open
- [ ] Streaming response from `/api/v1/cypher/message` (server-sent events)
- [ ] Messages persisted to `chat_transcripts`
- [ ] Context-aware greeting on first open (based on route/state)
- [ ] Pre-loaded context when opened from "Discuss with {agent-name}" CTAs

### Checklist 14 — Empty States

Verify every screen has a thoughtful empty state:

- [ ] Industry Dashboard (no assessments) — radar peer-only, metrics "—", placeholder CTAs
- [ ] Framework View (no answers) — tree present with "—" scores, right panel hint
- [ ] Risk View (no selection) — auto-show Stage 1
- [ ] Assessment Landing (fresh org) — all tiles "Not Started"
- [ ] Maturity Roadmap (no actions) — tiles show "0 items" with helper text
- [ ] Progress & Milestones (no history) — "Timeline populates after first assessment"
- [ ] Audit Log (no events) — "Contribution events will appear here."

Cypher does NOT auto-open on empty states. Helper link "Need help? Ask {agent-name} 🤖" is subtle and secondary.

### Checklist 15 — Theming (Light Mode)

Cursor likely built dark mode first. Your job is to ensure light mode is complete:

- [ ] Every component renders correctly with light mode tokens
- [ ] Contrast ratios meet WCAG AA in light mode
- [ ] Glass effects use correct light-mode opacity (`rgba(255,252,242,0.85)`)
- [ ] Primary colour (#EB5E28) used consistently in light mode
- [ ] Secondary text uses `#4F4B42` not `#CDC6BA` in light mode
- [ ] No dark-mode-only assumptions (e.g., assuming dark backgrounds when placing glows)

If Cursor only built dark-mode components, generate light variants now by mapping tokens.

### Checklist 16 — Responsive (Tablet + Mobile)

- [ ] Tablet (768–1279px): sidebar 220px, header 56px, content padding 24px
- [ ] Mobile (<768px): sidebar collapses to drawer, hamburger in header, header 52px, content padding 16px
- [ ] All modals fullscreen or bottom-sheet on mobile where appropriate
- [ ] Cypher chat becomes full-screen on mobile
- [ ] D3 charts resize responsively
- [ ] Forms usable on mobile (no horizontal scroll, inputs full-width)
- [ ] Touch targets ≥ 44×44px on mobile

Cursor likely focused desktop. Complete tablet + mobile now.

### Checklist 17 — Accessibility Audit

Run these manually:

- [ ] Tab through every screen with keyboard only — ensure logical order, visible focus, no traps (except in modals)
- [ ] Escape closes modals and popovers
- [ ] Arrow keys navigate dropdown menus
- [ ] All icon buttons have aria-labels
- [ ] All form inputs have associated labels
- [ ] Errors announced via aria-live="polite"
- [ ] Dynamic score changes announced via aria-live="polite"
- [ ] Skip-to-content link present in header
- [ ] Screen reader friendly: run NVDA/VoiceOver on Industry Dashboard + Assessment flow
- [ ] `prefers-reduced-motion`: confirm all animations fade-only, no transforms
- [ ] WCAG AA contrast in both themes

### Checklist 18 — Performance

- [ ] Run `npm run build` — zero warnings
- [ ] Run Lighthouse on Industry Dashboard — Performance ≥ 90, Accessibility ≥ 95
- [ ] Bundle analysis: confirm D3, Framer Motion, heavy viz components are code-split via `next/dynamic`
- [ ] Fonts preloaded via `next/font`; only Latin subset
- [ ] Cypher chat modal NOT rendered until first open (lazy)
- [ ] React Query cache configured with sensible stale times
- [ ] No memory leaks on repeated navigation (check with React DevTools Profiler)
- [ ] CLS ≤ 0.1 (no layout shifts when data loads)
- [ ] 60fps animations (Chrome DevTools Performance tab)

### Checklist 19 — Code Quality

- [ ] TypeScript strict mode — zero `any` types
- [ ] No `console.log` in merged code (use proper logger or remove)
- [ ] No `TODO:` or `FIXME:` comments in merged code — resolve them
- [ ] All env vars read only from `/lib/config/env.ts`
- [ ] All Supabase calls through `/lib/db/` abstractions
- [ ] All auth calls through `/lib/auth/` abstractions
- [ ] No direct Supabase calls from React components
- [ ] No direct Claude API calls from `/api/v1/*` routes
- [ ] Every async function has error handling
- [ ] Generic, non-leaking error messages ("Something went wrong" not "User ID 42 not found")
- [ ] `npm run lint` — zero warnings
- [ ] `npm test` — all passing

### Checklist 20 — Australian English Audit

**Scan for American spellings. Fix every one:**

- organize → organise
- authorize → authorise
- recognize → recognise
- prioritize → prioritise
- optimize → optimise
- color → colour
- center → centre
- favor → favour
- honor → honour
- labor → labour
- license (as noun) → licence
- analyze → analyse
- defense → defence
- offense → offence
- program (software) is fine; "programme" for schedules/events

**Date format:** DD/MM/YYYY across all display (e.g., `15/03/2026` not `3/15/2026` or `March 15, 2026`).

**Grep the whole codebase** — do not miss any label, placeholder, tooltip, error message, helper text.

### Checklist 21 — Security Verification

- [ ] `NEXT_PUBLIC_SUPABASE_URL` safe in client
- [ ] `SUPABASE_SERVICE_KEY` NOT in client bundle (search `grep -r SUPABASE_SERVICE_KEY .next/`)
- [ ] `ANTHROPIC_API_KEY` NOT in client bundle
- [ ] `ORCHESTRATION_SECRET` NOT in client bundle
- [ ] `/api/internal/*` returns 403 without valid orchestration secret
- [ ] Rate limiting on `/api/v1/*` routes (100/min per user, 1000/hour)
- [ ] CORS restricted to production domain
- [ ] Security headers present (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- [ ] XSS protection: input sanitisation on all text fields (especially Cypher chat paste)
- [ ] SQLi protection: all queries parameterised
- [ ] RLS enabled on all data tables
- [ ] No PII in console output or logs
- [ ] Password fields never appear in query strings, logs, or localStorage

---

## SECTION 2 — GAP FILLING (Things Cursor Likely Left Undone)

Based on typical Cursor output patterns, here's what you likely need to complete:

1. **Light mode coverage** — Cursor often nails dark mode but leaves light mode inconsistent or incomplete. Fix.

2. **Responsive polish** — Cursor tends to build desktop-first and handle mobile shallowly. Do a focused pass on tablet and mobile for every screen.

3. **Empty states** — Cursor often skips empty states entirely. Add them everywhere listed in Checklist 14.

4. **Accessibility** — Cursor frequently misses ARIA labels, focus management, and reduced-motion handling. Do a thorough pass.

5. **Animation polish** — Entry animations, transition smoothness, reduced-motion compliance — likely need refinement.

6. **Error states and toasts** — Cursor often builds happy-path only. Add error handling, toast notifications for success/failure, and graceful fallbacks.

7. **Copy refinement** — Cursor's placeholder copy may not be Australian English throughout. Scan and fix.

8. **D3 chart refinement** — Interactive tooltips, axis labels, legend styling, animated entrance, reduced-motion handling often need polish.

9. **Cypher chat polish** — Streaming handling, typing indicator, quick-reply logic, context passing from various CTAs. Cursor may have built the shell but not the nuance.

10. **Framework switching behaviour** — When user changes framework tab in Framework View or Progress & Milestones, all child state should reset cleanly. Verify.

---

## SECTION 3 — AUDIT FLOW (How to Work)

Work screen-by-screen in this order (mirrors Cursor's build order):

1. **Canonical Layout** — confirm foundation is solid
2. **Industry Dashboard** ⭐ — highest scrutiny; this is the benchmark
3. **Cypher Chat Modal** — critical interaction; polish intensely
4. **Framework View** — complex tree + detail + polymorphic viz
5. **Risk View** — both stages
6. **Assessment** — both paths
7. **Maturity Roadmap**
8. **Progress & Milestones**
9. **Organisation Settings** — 4 sub-pages
10. **Onboarding Flow** — 4 steps + Initialisation
11. **User Profile Modals**
12. **Empty states across all screens**
13. **Light mode pass**
14. **Tablet + mobile responsive pass**
15. **Accessibility audit**
16. **Performance audit**
17. **Australian English grep + fix**
18. **Security verification**
19. **Final lint / build / test**

---

## SECTION 4 — TESTING

After your polish pass, add or extend:

### Unit Tests
- Component rendering tests for each new component
- Form validation tests (Edit Profile, Change Password, MFA Settings, Invite User)
- Utility function tests (date formatting, percentage calculation, score colour mapping)

### Integration Tests
- Onboarding flow end-to-end (all 4 steps)
- Sidebar navigation state (expand/collapse/active highlighting)
- Framework tab switching (tree resets correctly)
- Risk selection flow (Stage 1 → Stage 2 progression)
- Cypher chat open/close behaviour

### Visual Regression (Optional but Recommended)
- Capture screenshots of key screens in dark + light mode
- Compare against baseline
- Playwright or Chromatic

### Manual E2E Walk-through
- Sign up fresh org → complete onboarding → land on Initialisation → click "Begin Assessment" → answer a few questions → flag one for Cypher → resume → review with Cypher → check Framework View → check Risk View → check Maturity Roadmap → check Progress & Milestones → visit Organisation Settings → Edit Profile → Change Password → Logout

Every click should feel intentional, polished, and delightful.

---

## SECTION 5 — HANDOFF

When done, write `docs/HANDOFF_10_POSTLOGIN_CLAUDE_CODE.md` containing:

- Every file modified or created (with one-line summary)
- Every Cursor-built file that was polished (with brief note on what was fixed)
- Confirmed: `npm run lint` ✓ `npm run build` ✓ `npm test` ✓ Lighthouse Performance ≥ 90 ✓ Accessibility ≥ 95 ✓
- Visual comparison notes (Industry Dashboard vs PNG reference — fidelity %)
- Light mode coverage: 100%? Any gaps?
- Responsive coverage: desktop / tablet / mobile all verified?
- Accessibility: WCAG AA? Keyboard navigation? Screen reader?
- Known issues or deferred items
- Notes for Agent 14 (API wiring) — what's ready for real data, what's stubbed
- Any PNG references that were unavailable and how the gap was handled

---

## SECTION 6 — OUTSTANDING TASKS FOR VIK (Before Agent 14 Wires APIs)

Log these in the handoff for Vik:

- [ ] Final confirmation of Cypher's welcome greeting wording on Industry Dashboard
- [ ] Upload 20 template risks to Supabase (risk name, description, category, related-controls-hint)
- [ ] Generate/upload 5–8 assessment questions per domain per framework (ISO, NIST, APRA)
- [ ] Confirm 30-day cooldown UX copy for framework toggle in Preferences
- [ ] Confirm the exact notification types (Assessment due / Domain completed / Cypher insight / Framework change / etc.)
- [ ] Supply Security Briefing / Industry Advisory feed source (from Vik's research agent — how does data land in the dashboard?)
- [ ] Confirm tolerance for framework-agnostic "Simplify IS Domains" (future — post-MVP)

---

## SECTION 7 — FINAL REMINDERS

- **Don't rebuild — polish.** Respect Cursor's work; extend and refine.
- **Match the PNG references.** The Industry Dashboard hero page is the visual north star.
- **Australian English everywhere.** No exceptions.
- **Agent name with emoji in all display contexts.** Never show the raw name without 🤖 in user-facing UI (except in the input field during onboarding).
- **Desktop first, then tablet, then mobile.** Don't let mobile degrade the desktop experience.
- **No TODOs, console.logs, or placeholder logic in merged code.**
- **Every state graceful: loading, empty, error, success.**
- **Every interaction polished.**
- **Every form accessible and keyboard-navigable.**
- **Every animation respects reduced-motion.**

**When this pass is complete, the post-login experience should be MVP-ready. Agent 14 will wire APIs; Agents 15+ will add features. Your work is the foundation everything else rests on.**

---

*End of Agent 10 (Claude Code) spec.*
```

---

## FILE: `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`

Path: `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`

```markdown
# Agent 10 (Cursor) — Post-Login UI/UX Complete Build
## Simplify IS | Dashboard Layout + All Post-Login Screens
### Version: April 2026 | Cursor Primary Build | Claude Code Review After

---

## ROLE & MISSION

You are building the **complete post-login user experience** for Simplify IS — from the moment a user completes authentication through every screen they interact with. This is the **canonical UI/UX foundation** that all subsequent agents will extend.

**Non-negotiables:**
1. **World-class product quality** — best AI security assessment tool ever built.
2. **Security first** — no secrets in client bundles, no direct Supabase calls from components, no direct Claude API calls from `/api/v1/` routes.
3. **Australian English throughout** — "Organisation", "colour", "centre", "licence", "realise", "optimise". Date format DD/MM/YYYY.
4. **Desktop first** — tablet and mobile are secondary (users will use Teams/Slack bot for mobile needs).
5. **Design fidelity** — match the PNG/HTML references pixel-perfect where provided.

---

## READ BEFORE YOU BUILD

Before writing any code, read these files in order:

1. `/Users/vik/Documents/Code/simplify-is/01_MASTER_CONTEXT.md` — full project context, tech stack, DB schema, locked decisions
2. `/Users/vik/Documents/Code/simplify-is/03_AGENTS_AND_HANDOFFS.md` — all prior agent completion contracts, exact Supabase column names, handoff protocol
3. `/Users/vik/Documents/Code/simplify-is/04_DESIGN_SYSTEM.md` — Earthen Brutalism design system (colours, typography, elevation, components)
4. `/Users/vik/Documents/Code/simplify-is/HANDOFF_7_PRELOGIN_UIUX.md` — pre-login components already built (login, signup, MFA etc.)
5. `/Users/vik/Documents/Code/simplify-is/HANDOFF_8_AUTH_BACKEND.md` — auth backend endpoints you will NOT rewire
6. `/Users/vik/Documents/Code/simplify-is/HANDOFF_9_AUTH_INTEGRATION.md` — auth wiring already in place

---

## REFERENCE FILES (CRITICAL — READ THESE VISUALLY)

### PNG Design References
Located at: `/Users/vik/Documents/Code/simplify-is/stitch_output/`

Find and load these files:
- **Onboarding Step 1** — "Establish Your Consultant's Identity" (naming Cypher)
- **Onboarding Step 2** — "Establish Your Operational Core" (org setup)
- **Onboarding Step 3** — "Select Primary Framework" (framework selection)
- **Onboarding Step 4** — "Portal Orientation" (workspace ready)
- **Initialization Screen** — "Your Environment is Initialised" (3-tile entry picker)
- **Industry Dashboard (Hero)** — `Dashboard - hero page` ⭐ **MOST CRITICAL REFERENCE** — this is the canonical visual template for the entire post-login experience
- **Cypher Chat Panel** — (right sidebar modal design, if present)

**Action:** View each PNG. Note typography, spacing, colour application, elevation, component treatments. The Industry Dashboard hero page is the **visual north star** — all other screens inherit its vocabulary.

### HTML Design References
Located in project root. Primary references:
- `Page_*_web_dark_code.html` — dark mode desktop
- `*_light_mode-code.html` — light mode variants
- `*_tablet-code.html` — tablet
- `*_mobile-code.html` — mobile
- **All dashboard-related HTML** — use for colour tokens, font application, component styles

### Extracted Design Tokens (use these exactly)

**Dark Mode:**
```
background: #141311
surface-container-low: #1C1B19
surface-container: #211F1D
surface-container-high: #2B2A28
surface-container-highest: #363432
surface-bright: #3A3937
on-surface: #E6E2DE
primary: #FFB59C
on-primary: #5C1900
secondary: #CDC6BA
outline: #A88A80
inverse-primary: #AB3600
```

**Light Mode:**
```
background: #FFFCF2
surface-container-low: #FBF8EF
surface-container: #F5F2E9
surface-container-high: #F0EDE2
surface-container-highest: #E6E2D5
surface-bright: #FFFCF2
on-surface: #1A1917
primary: #EB5E28
on-primary: #FFFFFF
secondary: #4F4B42
outline: #85746E
inverse-primary: #EB5E28
```

**Typography:**
- **Raleway** (700, 800, 900) — display & headlines, tight tracking (-0.02em)
- **Josefin Sans** (300–700) — subheadings, labels, uppercase nav items (+0.1em tracking)
- **Montserrat** (300, 400, 500, 600) — body & utility, line-height 1.6
- **Geist Mono** (400, 700) — code, IDs, scores, metadata (small all-caps)

**Elevation:**
- No 1px solid borders for sectioning — use surface colour shifts
- Ghost border (when needed): `1px solid rgba(168, 138, 128, 0.15)`
- Ambient shadow (floating only): `0 20px 40px rgba(0, 0, 0, 0.4)`
- Glass effect (nav, modals): `rgba(20,19,17,0.80)` + `backdrop-blur: 12px`
- Glow on primary CTA: `0 0 20px rgba(235,94,40,0.15)`

---

## SECTION 1 — CANONICAL LAYOUT TEMPLATE

This layout is the **foundation every post-login screen uses**. Build it once as a reusable component (`/components/layout/DashboardLayout.tsx`) and every other screen composes inside it.

### 1.1 Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (sticky, glassmorphic)                               │
│ Logo "Simplify IS"          Notification 🔔   User Avatar ▾  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  LEFT        │         CONTENT PANEL                        │
│  SIDEBAR     │         (changes per route)                  │
│  (static)    │                                              │
│              │         Below-fold content scrolls here      │
│              │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│ FOOTER (compact, bottom of viewport)                         │
│ © 2026 Simplify IS · Privacy · Terms · Support              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Header (top bar)

**Position:** Sticky top, full-width, glassmorphic.
**Height:** 64px desktop, 56px tablet, 52px mobile.
**Style:** `background: rgba(20,19,17,0.80)` (dark) / `rgba(255,252,242,0.85)` (light) with `backdrop-blur: 12px`. No visible border; use a soft gradient fade on the bottom edge (transparent → outline-colour-at-10% → transparent).

**Contents (left to right):**

1. **Logo** — "Simplify IS" wordmark, Raleway 800, clickable
   - If user is authenticated → `router.push('/dashboard/industry')`
   - If not authenticated → `router.push('/')` (marketing home)
2. **Spacer** (flex-grow)
3. **Notification Bell** — icon button, 40×40px
   - Badge in top-right corner of the bell showing unread count (primary colour circle, white number, only visible if count > 0)
   - Click → opens `NotificationPopover` (absolute-positioned, 360px wide, max-height 480px, scrollable list of notifications with "Mark all read" at top)
   - Each notification: icon, title, short description, timestamp, unread dot
4. **User Avatar Dropdown** — avatar image (or initials circle if no image), 40×40px
   - Click → opens `UserProfileDropdown` (absolute-positioned, 240px wide)
   - Dropdown items (top to bottom):
     - Avatar + User full name + email (read-only header)
     - Divider (ghost)
     - "Edit Profile" → opens **EditProfileModal**
     - "Change Password" → opens **ChangePasswordModal**
     - "MFA Settings" → opens **MFASettingsModal**
     - Divider (ghost)
     - "Logout" → calls signOut, redirects to `/` (marketing home)

**Accessibility:** All icon buttons have aria-labels. Dropdowns are keyboard-navigable (arrow keys, Escape to close). Focus traps when modal opens.

### 1.3 Left Sidebar (static menu)

**Position:** Fixed left, full-viewport-height (minus header + footer).
**Width:** 260px desktop, 220px tablet, slide-out drawer on mobile (hamburger in header).
**Style:** `background: surface-container-low` (no visible right border; use surface shift against content panel).

**Contents (top to bottom):**

```
┌─────────────────────┐
│                     │
│ ◇ DASHBOARDS  ▾     │ ← collapsible, default expanded
│   │ Industry   ▮    │ ← active state (orange 3px left bar)
│   │ Framework       │
│   │ Risk            │
│                     │
│ ◈ ASSESSMENT        │
│                     │
│ ◆ MATURITY ROADMAP  │
│                     │
│ ◐ PROGRESS &        │
│   MILESTONES        │
│                     │
│ ◑ ORGANISATION      │ ← admin only
│   SETTINGS    ▾     │
│   │ Users           │
│   │ Preferences     │
│   │ Billing         │
│   │ Audit           │
│                     │
└─────────────────────┘
```

**Menu item specification:**

Each top-level item is rendered as a row, 48px tall, 16px left padding, icon + label (Josefin Sans uppercase, letter-spacing +0.08em, 13px). Icons are 20×20 px, stroke 1.5px, from Lucide or a custom set matching the Stitch references.

**Icons to use (Lucide):**
- Dashboards → `LayoutGrid`
- Assessment → `ClipboardCheck`
- Maturity Roadmap → `Route` or `Map`
- Progress & Milestones → `TrendingUp`
- Organisation Settings → `Building2`

**Active state:**
- Vertical 3px bar on the left edge, in `primary` colour (#EB5E28 light / #FFB59C dark)
- Text transitions to `on-surface` (brighter)
- Background subtly shifts to `surface-container-high`
- Transition: 200ms ease

**Hover state (inactive items):**
- Background transitions to `surface-container` (subtle lift)
- Text brightens slightly

**Collapsible behaviour for "Dashboards":**
- Chevron `▾` on the right of the label when expanded; `▸` when collapsed
- Click the parent label → toggle expand/collapse
- When expanded, sub-items render indented (+20px), 40px tall, smaller font (12px)
- **Sub-item active state:** same 3px orange bar on the left edge (aligned to the sub-item's left padding, not the parent's)

**Collapsible behaviour for "Organisation Settings":**
- Identical pattern to Dashboards (chevron, expand/collapse, sub-items indented)

**Auto-expand/collapse interaction rules:**
- When user clicks any Dashboards sub-item (Industry / Framework / Risk) → Dashboards group stays expanded; Organisation Settings (if expanded) collapses
- When user clicks "Assessment", "Maturity Roadmap", or "Progress & Milestones" → Dashboards group auto-collapses; Organisation Settings auto-collapses
- When user clicks any Organisation Settings sub-item (Users / Preferences / Billing / Audit) → Organisation Settings stays expanded; Dashboards collapses
- When user clicks top-level "Dashboards" label while collapsed → expands AND navigates to Industry view by default
- When user clicks top-level "Organisation Settings" label while collapsed → expands AND navigates to Users sub-page by default

**Admin-only visibility:**
- "Organisation Settings" entry is **completely hidden** from the rendered DOM when `user.role !== 'admin'`
- Direct URL navigation to `/organisation/*` routes for non-admins → redirect to `/dashboard/industry` if authenticated, `/404` otherwise

### 1.4 Content Panel

**Position:** Right of sidebar, below header, above footer.
**Padding:** 32px desktop, 24px tablet, 16px mobile.
**Background:** `background` token.
**Scroll:** This is the ONLY scrollable region. Header, sidebar, footer remain fixed.

All route-specific screens render inside this panel. The panel has no internal chrome — each screen owns its own title bar, breadcrumbs (if any), and content layout.

### 1.5 Footer

**Position:** Fixed bottom, full-width across the content panel area.
**Height:** 40px desktop, 36px tablet.
**Style:** `background: surface-container-low`, no border; soft top-edge gradient fade.
**Contents:** Centre-aligned mono text — "© 2026 Simplify IS. All Rights Reserved.  ·  Privacy  ·  Terms  ·  Support"
- Links open in new tab
- Geist Mono 11px, uppercase, `outline` colour

### 1.6 Responsive Behaviour

**Desktop (≥1280px):** Layout as specified above. Sidebar always visible.

**Tablet (768–1279px):**
- Sidebar width 220px
- Content padding 24px
- Header height 56px

**Mobile (<768px):**
- Sidebar collapses to drawer, hamburger button appears in header (left of logo)
- Drawer slides in from left, 280px wide, overlay background behind (rgba(0,0,0,0.5))
- Tapping overlay or the hamburger again closes the drawer
- Header height 52px
- Content padding 16px

**Reduced motion:**
- All transitions respect `@media (prefers-reduced-motion: reduce)` → disable transforms, fade only

---

## SECTION 2 — ONBOARDING FLOW (First-Login Admin Only)

### 2.1 Trigger & Routing

**Trigger:** First authenticated login where the user is the organisation admin AND `organisations.onboarding_completed_at IS NULL`.

**Routing:**
- On successful login (middleware or `/dashboard/page.tsx` mount) → check onboarding flag
- If admin and onboarding incomplete → redirect to `/onboarding/step-1`
- No skip mechanism. User can close the window and return; their progress persists.
- Invited team members (non-admin) → never see onboarding; proceed straight to `/dashboard/industry`

**Routes:**
- `/onboarding/step-1` — Name Your AI Consultant
- `/onboarding/step-2` — Set Up Your Organisation
- `/onboarding/step-3` — Choose Your Frameworks
- `/onboarding/step-4` — Your Workspace is Ready

### 2.2 Onboarding Shell

The onboarding flow uses a **modified layout** — no left sidebar, no user profile dropdown, minimal header:

**Header (onboarding only):**
- Logo "Simplify IS" (left)
- Step indicator (right): "Step N of 4" (Geist Mono, uppercase, 12px) + 4-segment progress bar (each segment 32px × 3px, filled segments in primary colour, future segments in outline colour)
- Close button (X) far-right → confirmation modal: "Exit onboarding? Your progress is saved. You'll be returned here on next login." — Confirm / Cancel. Confirm → redirect to `/` (log out? No — keep them authenticated. Redirect to `/logout` only if they choose logout from a separate modal option.)

Actually, simplify: **No X close button.** Just logout from a small "Logout" link in the top-right if they need to exit.

**Footer (onboarding only):**
- Same as canonical footer — "© 2026 Simplify IS. Systems Online. · Privacy Policy · Terms of Service · Contact"

**Content area:** Centred card on a subtly textured dark background (surface-container-low). Card max-width 720px, rounded 12px, padding 48px.

### 2.3 Step 1 — Name Your AI Consultant

**Reference PNG:** Step 1 PNG at `/Users/vik/Documents/Code/simplify-is/stitch_output/` (filename TBD — find the one matching "Establish Consultant's Identity")

**Card contents:**

```
INITIALISATION                    ──────
(Geist Mono, uppercase, primary colour, 11px, letter-spacing +0.15em)

Name Your AI Consultant
(Raleway 800, 40px, on-surface, tight tracking)

This is how you'll address your consultant. Every user in your 
organisation will see this name.
(Montserrat 400, 16px, secondary colour, line-height 1.6)

CONSULTANT'S NAME                            MAX 10 CHARS
(Josefin Sans 500, uppercase, 12px, letter-spacing +0.1em)
┌────────────────────────────────────────────────────┐
│ e.g. Cypher                                        │  ← surface-container-low, bottom ghost border
└────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  INITIALISE IDENTITY           →         │  ← primary button, full-width, 56px tall
└──────────────────────────────────────────┘

🔒  SECURITY PROTOCOL VERIFIED
(Geist Mono, uppercase, 11px, outline colour, centred below button)
```

**Behaviour:**
- Input max length: 10 characters. Characters beyond 10 are rejected.
- Allowed characters: letters, numbers, space, hyphen, underscore, apostrophe. Emoji/special characters rejected with inline hint.
- If field is blank when button clicked → default to "Cypher" silently.
- On click "Initialise Identity":
  - Disable button, show spinner inside button (replace text with spinner + "Initialising…")
  - POST `/api/v1/onboarding/consultant-name` with `{ consultantName }`
  - Backend stores in `users.agent_name`
  - On success → `router.push('/onboarding/step-2')`
  - On error → inline error below input: "Something went wrong. Please try again." (danger colour, 13px)
- **Emoji indicator:** Throughout the app, the chosen name renders with a trailing robot emoji 🤖. So if they enter "Sarah", the chat button reads **"Ask Sarah 🤖"**. Store the raw name (10 chars max) in DB; the emoji is a display concern applied in the UI layer.

**Sizing reminder:** All placeholders and display positions that render the agent name must accommodate the full name + emoji + surrounding text. Reserve layout space for 15–20 characters of combined width.

### 2.4 Step 2 — Set Up Your Organisation

**Reference PNG:** Step 2 PNG (find file in stitch_output)

**Card contents:**

```
ORGANISATIONAL IDENTITY           ──────
(Geist Mono, uppercase, primary, 11px)

Set Up Your Organisation
(Raleway 800, 40px — but note the reference uses italic orange 
"Operational Core" — follow the reference exactly, rendering 
the second half in primary colour italic)

Calibrate your security posture and resource allocation by 
defining your organisation's scope within the framework.
(Montserrat 400, 16px, secondary, line-height 1.6, max-width 560px, 
centred)

ORGANISATION LEGAL NAME
┌─────────────────────────────────────────────────────┐
│ e.g. Aether Dynamics Corp                           │
└─────────────────────────────────────────────────────┘

INDUSTRY SECTOR               HEADQUARTERS COUNTRY
┌─────────────────────┐       ┌─────────────────────┐
│ Select Industry  ▾  │       │ Select Countries ▾  │
└─────────────────────┘       └─────────────────────┘
(50/50 column layout, 24px gap)

WORKFORCE SCALE
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Small    │ │ Medium   │ │ Large    │ │ Enterprise│
│ 1–50     │ │ 51–250   │ │ 251–1000 │ │ 1000+    │
│ Lean     │ │ Dept.    │ │ Global   │ │ Complex  │
│ agility  │ │ isolation│ │ multi-   │ │ audit    │
│ protocols│ │          │ │ tenant   │ │ rigour   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
(4-column grid, each tile 160×140px, 16px gap, clickable, 
selected state = primary border + surface-bright bg + glow)

──────────────────────────────────────────────────

[← BACK]                    [CONTINUE SETUP  →]
(left: ghost button; right: primary button, disabled until 
all fields valid)
```

**Fields:**

1. **Organisation Legal Name** — text input, 2–100 characters, required.
2. **Industry Sector** — dropdown (closed list), required. Options:
   - Financial Services (Banking, Insurance, Superannuation)
   - Healthcare
   - Technology / Software
   - SaaS / Professional Services
   - Government / Public Sector
   - Manufacturing
   - Retail / E-commerce
   - Education
   - Construction
   - Telecommunications
   - Media / Entertainment
   - Energy / Utilities
   - Hospitality / Travel
   - Real Estate
   - Legal Services
   - Other
3. **Headquarters Countries** — autocomplete multi-select, required (at least one). Options: curated list of ~45 major/developed nations (I'll supply this list as a constant below). Alphabetical. Type-ahead filters the list.
4. **Workforce Scale** — 4 tiles (radio-group semantics). Required (exactly one).

**Country list (use this array as the constant):**
```ts
export const COUNTRIES = [
  'Australia', 'New Zealand', 'United Kingdom', 'Ireland',
  'United States', 'Canada',
  'Germany', 'France', 'Netherlands', 'Belgium', 'Luxembourg',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Italy', 'Spain', 'Portugal',
  'Poland', 'Czech Republic',
  'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan',
  'India', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Israel',
  'South Africa',
  'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia',
  'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam',
  'Turkey',
  'Other'
];
```

**Validation:**
- All four fields required
- "Continue Setup" disabled until all four are valid
- No inline errors on blur — simply keep button disabled
- Backend validation on submit: if server returns an error, show banner at top of card: "We couldn't save your organisation details. Please try again."

**Submit action:**
- POST `/api/v1/onboarding/organisation` with `{ name, industry, countries: string[], workforceScale: 'small' | 'medium' | 'large' | 'enterprise' }`
- Backend stores in `organizations` table
- On success → `router.push('/onboarding/step-3')`

**Back button:** Returns to `/onboarding/step-1`. Previous inputs persist (load from DB on mount).

### 2.5 Step 3 — Choose Your Frameworks

**Reference PNG:** Step 3 PNG (find file in stitch_output)

**Card contents:**

```
INITIALISATION                    ──────

Choose Your Frameworks
(Raleway 800, 40px)

Identify the regulatory standards {agent-name} should prioritise 
for your initial assessment.
(Montserrat 400, 16px, secondary; {agent-name} is substituted 
dynamically, e.g. "Sarah 🤖")

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [shield-icon]│ │ [shield-icon]│ │ [bank-icon]  │
│              │ │              │ │              │
│ ISO 27001:   │ │ NIST CSF     │ │ APRA CPS 234 │
│ 2022         │ │ 2.0          │ │              │
│              │ │              │ │              │
│ International│ │ Framework    │ │ Australian   │
│ standard for │ │ for managing │ │ Prudential   │
│ information  │ │ cybersecurity│ │ Regulation   │
│ security     │ │ risk and     │ │ Authority    │
│ management   │ │ improving    │ │ standard for │
│ systems      │ │ infra.       │ │ info sec.    │
│ (ISMS).      │ │ resilience.  │ │              │
│              │ │              │ │              │
│ [GLOBAL]     │ │ [ESSENTIALS] │ │ [AUSTRALIA]  │
└──────────────┘ └──────────────┘ └──────────────┘
 selected         selected         unselected

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [icon]       │ │ [icon]       │ │ [icon]       │
│ SOC 2 Type II│ │ PCI DSS v4.0 │ │ HIPAA        │
│              │ │              │ │              │
│ [short desc] │ │ [short desc] │ │ [short desc] │
│              │ │              │ │              │
│ [COMING SOON]│ │ [COMING SOON]│ │ [COMING SOON]│
└──────────────┘ └──────────────┘ └──────────────┘
 disabled         disabled         disabled

ⓘ  You can modify your framework selection and add more frameworks 
   in Organisation Settings. Changes can be made once every 30 days.
(secondary colour, 13px, centred)

                             [CONFIRM SELECTION  →]
```

**Tile behaviour:**
- Tile is a toggle button. Clickable tiles: ISO 27001:2022, NIST CSF 2.0, APRA CPS 234.
- Disabled tiles (Coming Soon): greyed out, non-interactive, cursor not-allowed, opacity 0.5. A `[COMING SOON]` pill sits top-right of the tile.
- **Default state:** ISO 27001:2022 and NIST CSF 2.0 pre-selected. APRA CPS 234 unselected. ISO and NIST cannot be deselected (they're the baseline). APRA CPS 234 can be toggled on/off.
- Selected tile style: primary-colour 2px border, subtle primary glow, checkmark in top-right corner (✓ circle in primary bg).
- Unselected tile style: ghost border, no glow.
- Hover (enabled tiles only): subtle lift to `surface-bright`.

**Confirm Selection:**
- POST `/api/v1/onboarding/frameworks` with `{ selected: ['iso_27001_2022', 'nist_csf_2_0', ...] }`
- Backend writes to `organizations.selected_frameworks` (JSONB array)
- On success → `router.push('/onboarding/step-4')`

### 2.6 Step 4 — Your Workspace is Ready

**Reference PNG:** Step 4 PNG (find file in stitch_output)

**Card contents (larger card, max-width 960px):**

```
ORIENTATION                       ──────

Your Workspace is Ready
(Raleway 800, 40px)

Use the sidebar to navigate between assessment and governance 
modules.
(Montserrat 400, 16px, secondary)

┌─────────────────┐ ┌─────────────────┐
│ [LayoutGrid]    │ │ [ClipboardCheck]│
│                 │ │                 │
│ Dashboards      │ │ Assessment      │
│                 │ │                 │
│ View your real- │ │ Collaborate with│
│ time maturity   │ │ {agent-name} to │
│ across Industry,│ │ complete deep-  │
│ Framework, and  │ │ dive security   │
│ Risk views.     │ │ assessments.    │
└─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐
│ [Route]         │ │ [TrendingUp]    │
│                 │ │                 │
│ Maturity        │ │ Progress &      │
│ Roadmap         │ │ Milestones      │
│                 │ │                 │
│ Track ongoing   │ │ Review historic │
│ obligations and │ │ maturity trends │
│ uplift actions. │ │ and celebrate   │
│                 │ │ wins.           │
└─────────────────┘ └─────────────────┘

┌─────────────────┐
│ [Building2]     │
│                 │
│ Organisation    │
│ Settings        │
│                 │
│ Manage team,    │
│ preferences,    │
│ billing, audit. │
└─────────────────┘

          [LAUNCH APPLICATION  →]

🔒  SECURE SESSION ESTABLISHED  ·  AUTH: 256-BIT
```

**Tile layout:** 2×2 grid with an extra tile below, OR a centred 3+2 layout. Pick whichever reads cleaner in the PNG reference. Use 24px gap, tiles are clickable but not required — they're informational (hover reveals subtle glow). Clicking a tile does NOT navigate; only "Launch Application" proceeds.

**Launch Application button:**
- POST `/api/v1/onboarding/complete` → backend sets `organizations.onboarding_completed_at`
- On success → `router.push('/dashboard/initialisation')` (the initialisation screen, NOT straight to industry dashboard)

---

## SECTION 3 — INITIALISATION SCREEN (First-Login Entry Picker)

**Route:** `/dashboard/initialisation`

**Trigger:** Immediately after onboarding Step 4 launch. **This screen appears exactly once, for the first-time admin only.** On subsequent logins, users land directly on `/dashboard/industry`.

**Persistence:** Set `users.has_seen_initialisation = true` on any tile click. Subsequent loads of `/dashboard/initialisation` → redirect to `/dashboard/industry`.

**Layout:** Uses the canonical DashboardLayout (sidebar, header, footer all present) but the content panel shows a centred hero rather than the usual dashboard content.

**Content:**

```
                    [hexagonal icon - orange accent]
                    
                    INITIALISATION COMPLETE
                    (Geist Mono, uppercase, primary, 12px)
                    
                    Your environment is 
                    initialised.
                    (Raleway 800, 56px, "initialised." in primary italic)
                    
                    I am ready to begin the consultation. Where would 
                    you like to start?
                    (Montserrat 400, 18px, secondary)

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     01 /    │    │     02 /    │    │     03 /    │
│   DASHBOARD │    │   CONSULT   │    │INTELLIGENCE │
│ [icon]      │    │ [shield]    │    │ [map]       │
│             │    │             │    │             │
│ Explore     │    │ Begin       │    │ Map Industry│
│ Mission     │    │ Assessment  │    │ Risks       │
│ Control     │    │             │    │             │
│             │    │ Start a deep│    │ Review and  │
│ Jump to your│    │ dive        │    │ prioritise  │
│ Dashboard to│    │ consultation│    │ common      │
│ see your    │    │ for your    │    │ threat      │
│ current     │    │ selected    │    │ vectors from│
│ maturity    │    │ frameworks. │    │ our global  │
│ baseline.   │    │             │    │ risk library│
│             │    │          →  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
 (default)          (active/primary)    (default)
```

**Tile behaviour:**
- 3 tiles, equal width, in a single row desktop. Stack to 1-column on mobile.
- The centre tile ("Begin Assessment") is visually elevated — primary border, glow, arrow icon.
- Each tile is clickable:
  - "Explore Mission Control" → `/dashboard/industry`
  - "Begin Assessment" → `/assessment`
  - "Map Industry Risks" → `/dashboard/risk`
- On click: mark `has_seen_initialisation = true` via `PATCH /api/v1/users/me` with `{ hasSeenInitialisation: true }`, then navigate.

---

## SECTION 4 — DASHBOARDS (Industry / Framework / Risk)

### 4.1 Industry Dashboard ⭐ (Canonical Reference)

**Route:** `/dashboard/industry`

**This is the visual north star.** Load the PNG at `/Users/vik/Documents/Code/simplify-is/stitch_output/Dashboard - hero page/` and match typography, spacing, colour, elevation treatments as closely as possible. Every other dashboard view inherits this visual vocabulary.

**Content Panel Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Page title: "Industry View"  (Raleway 800, 32px, on-surface)   │
│ Subtitle: "You vs. your peers — real-time maturity comparison   │
│           based on NIST CSF 2.0."                               │
│                                                                 │
│                                         [toggle] Share data ⓘ   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────┐  ┌───────────────────────┐  │
│  │                               │  │ MATURITY SCORE        │  │
│  │   [D3 RADAR CHART]            │  │                       │  │
│  │   6 axes: GV, ID, PR,         │  │    2.8 / 5.0          │  │
│  │   DE, RS, RC                  │  │    (big number, 64px) │  │
│  │                               │  │                       │  │
│  │   Two polygons overlaid:      │  │ PEER PERCENTILE       │  │
│  │   · Your maturity (primary)   │  │ Top 34% of similar    │  │
│  │   · Industry avg (outline)    │  │ Technology orgs       │  │
│  │                               │  │                       │  │
│  │   Interactive: hover axis     │  │ BENCHMARK GAP         │  │
│  │   shows tooltip with scores   │  │ -0.4 behind peers     │  │
│  │                               │  │                       │  │
│  │                               │  └───────────────────────┘  │
│  └───────────────────────────────┘                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ YOUR STRENGTHS       │  │ STRATEGIC PRIORITY               ││
│  │                      │  │                                  ││
│  │ Detect (DE)          │  │ Top 3 controls trailing peers:   ││
│  │ 3.8 — +0.6 vs peers  │  │                                  ││
│  │                      │  │ • Governance (GV.OC-01)          ││
│  │ Protect (PR)         │  │   You: 2.1  Industry: 3.5        ││
│  │ 3.4 — +0.2 vs peers  │  │                                  ││
│  │                      │  │ • Access Control (GV.AA-01)      ││
│  │                      │  │   You: 2.3  Industry: 3.2        ││
│  │                      │  │                                  ││
│  │                      │  │ • Incident Response (RS.AN-01)   ││
│  │                      │  │   You: 1.8  Industry: 2.9        ││
│  │                      │  │                                  ││
│  │                      │  │ [GENERATE REMEDIATION PLAN →]    ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ SECURITY BRIEFING    │  │ YOUR PROGRESS                    ││
│  │                      │  │                                  ││
│  │ [advisory card with  │  │ [sparkline showing all past      ││
│  │  rotating insights   │  │  assessments]                    ││
│  │  from research feed] │  │                                  ││
│  │                      │  │ Last assessment: 3 days ago      ││
│  │ "AI Security Trend:  │  │ Maturity: 2.8 (↑ 0.2 since last) ││
│  │ 73% of SaaS orgs now │  │                                  ││
│  │ require AI           │  │                                  ││
│  │ governance controls" │  │                                  ││
│  │                      │  │                                  ││
│  │ [READ MORE →]        │  │ [VIEW FULL HISTORY →]            ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Top section — Radar + Metrics Panel:**

- **Radar chart (left, 60% width):**
  - D3 v7 radar/spider chart
  - 6 axes, each labelled with the NIST function name (Govern, Identify, Protect, Detect, Respond, Recover)
  - Two polygons:
    - "Your Maturity" — filled with primary colour at 30% opacity, stroked in primary at 100%
    - "Industry Benchmark" — filled with outline colour at 15% opacity, stroked with outline at 60%, dashed stroke
  - Hover on any axis label → tooltip shows: your score, peer score, delta
  - Legend below the chart: coloured swatches + labels
  - Animated entrance: polygon morphs from centre outward on mount (800ms ease)
  - Respect reduced-motion: skip morph, fade in

- **Metrics Panel (right, 40% width):**
  - Three vertically-stacked tiles, each 120px tall
  - Tile 1 — Maturity Score: huge number, colour based on score (red <2.0, amber 2.0–3.5, green >3.5)
  - Tile 2 — Peer Percentile: text like "Top 34% of similar Technology orgs" (use user's industry dynamically)
  - Tile 3 — Benchmark Gap: "-0.4 behind peers" (red if negative, green if positive, neutral if zero)

**Consent Toggle (top-right of page, above the radar):**
- Small toggle switch labelled "Share anonymised maturity data"
- Info icon ⓘ next to it → tooltip: "Your anonymised security maturity insights help us build more accurate industry benchmarks. Your organisation name, controls, and specific data remain completely private."
- **Default: ON.** Click toggles; state persists via `PATCH /api/v1/users/me` `{ shareAnonymisedData: boolean }`.
- Visual: when ON → primary colour background with knob on right; when OFF → outline colour background with knob on left.

**Middle row — Strengths + Strategic Priority:**
- Two tiles side-by-side, 50/50, 24px gap.
- Strengths tile: shows top 2 domains where user exceeds peer average. Each entry: domain name, score, delta from peers.
- Strategic Priority tile: top 3 controls where user trails peers. Each entry: control ID + name, your score, industry score. Button "Generate Remediation Plan" opens a side panel (future agent — stub for now with a `console.info` + toast "Coming soon").

**Bottom row — Security Briefing + Your Progress:**
- Two tiles side-by-side, 50/50.
- Security Briefing: static placeholder card for MVP. Text block with a title, 2–3 sentences, "Read More →" link (stub).
- Your Progress: sparkline showing ALL past assessment scores over time (x-axis = date, y-axis = overall maturity). Shows "Last assessment: {relative time}" and "Maturity: X (↑ Y since last)".

**Cypher Chat Launcher:**
- Floating circular button, 64×64px, fixed bottom-right of content panel (not in sidebar or header — content-panel-relative, 32px from bottom-right edge)
- Background: primary gradient (#EB5E28 → #C44A1A), drop shadow, agent-name emoji (🤖)
- Gentle pulse animation (2s loop, scale 1.0 → 1.03, breathing effect). Respects reduced-motion.
- Hover: tooltip appears to the left: "Ask {agent-name} 🤖"
- Click → opens Cypher chat modal (see Section 9)

**Loading state:**
- On initial mount, show skeleton loaders for each tile (radar = grey circle, metrics = grey rectangles). Fetch `GET /api/v1/dashboard/industry` → on response, fade in actual content.

**Empty/first-time state (no assessments yet):**
- Radar shows only the industry-average polygon (no user polygon)
- Metrics panel shows "—" instead of scores
- Strengths/Priority tiles show placeholder: "Complete your first assessment to unlock insights. [Start Assessment →]"
- Progress sparkline: "No assessments yet. [Start your first →]"
- Cypher chat auto-opens with welcome greeting

### 4.2 Framework View

**Route:** `/dashboard/framework`

**Top tabs:** One tab per framework the org has selected (from `organizations.selected_frameworks`). Default active = first framework (whichever was selected first in onboarding). Tabs are pills in a row, primary colour when active.

Example: `[ISO 27001:2022]  [NIST CSF 2.0]  [APRA CPS 234]`

**Layout (30/70 vertical split):**

```
┌─────────────────────────────────────────────────────────────────┐
│ Framework tabs: [ISO 27001:2022] [NIST CSF 2.0] [APRA CPS 234] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TOP 30% — Overview + Summary                                   │
│                                                                 │
│  ┌─────────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ [viz: D3    │  │ WHAT   │  │ WHAT   │  │ WHAT'S │           │
│  │  radar for  │  │ IMPROVED│  │ NEEDS  │  │ BEEN   │           │
│  │  NIST OR    │  │ ↑      │  │ FOCUS  │  │ IGNORED│           │
│  │  compliance │  │ 3      │  │ ↓      │  │ →      │           │
│  │  bars for   │  │ ctrls  │  │ 5      │  │ 2      │           │
│  │  ISO/APRA]  │  │ +0.4   │  │ ctrls  │  │ ctrls  │           │
│  └─────────────┘  └────────┘  └────────┘  └────────┘           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BOTTOM 70% — Tree + Detail Panel                               │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ TREE (left, 70%)         │  │ DETAIL PANEL (right, 30%)    ││
│  │                          │  │                              ││
│  │ ▾ Governance (GV)        │  │ GV.OC-01                     ││
│  │   · GV.OC-01  ▮ 2.1      │  │ Organisational Context       ││
│  │   · GV.OC-02    3.4      │  │                              ││
│  │   · GV.OC-03    2.8      │  │ MATURITY: 2.1 / 5.0          ││
│  │                          │  │ COVERAGE: 45%                ││
│  │ ▸ Identify (ID)          │  │ ▓▓░░░░░░                     ││
│  │                          │  │                              ││
│  │ ▸ Protect (PR)           │  │ Control description...       ││
│  │                          │  │                              ││
│  │ ▸ Detect (DE)            │  │ Related controls:            ││
│  │                          │  │ • ISO A.5.1                  ││
│  │ ▸ Respond (RS)           │  │ • APRA 6.1                   ││
│  │                          │  │                              ││
│  │ ▸ Recover (RC)           │  │ Evidence: [none yet]         ││
│  │                          │  │                              ││
│  │                          │  │ [DISCUSS WITH SARAH 🤖 →]    ││
│  └──────────────────────────┘  └──────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visualisation per framework:**

- **NIST CSF 2.0:** Compact D3 radar (same style as Industry View, but **only the user's polygon — no peer benchmark**)
- **ISO 27001:2022:** D3 stacked horizontal bars. One bar per ISO domain (9 domains). Each bar shows three segments: % Compliant (green), % Non-Conformity (red), % Opportunity for Improvement (amber). Width = proportion.
- **APRA CPS 234:** D3 stacked horizontal bars. One bar per domain. Each bar shows three segments: % at Level 2, % at Level 3, % at Level 4 (different colour gradient: level 2 = muted, level 3 = mid, level 4 = primary).

**Three summary cards:**

- **What Improved** — green up-arrow, count of controls, top improver name + delta
- **What Needs Focus** — red down-arrow, count of controls, most-critical drop
- **What's Been Ignored** — grey flat-arrow, count of controls, oldest unchanged

Default: each card shows the headline stats. On hover, the card expands (height animates) to reveal top 3 items in that category. Click anywhere on the card → scrolls to / filters the tree below to show only those controls.

**Tree structure (left, 70%):**

- Each domain is an expandable row. Default state: first domain expanded.
- Expanded rows show child controls, each with: control ID, short name, maturity score (NIST) or compliance status icon (ISO/APRA), and the active selection indicator (orange left bar) if clicked.
- Hovering a row: subtle surface shift.
- Clicking a control row → selects it. Detail panel on the right updates instantly (no navigation, no modal).
- Multiple domains can be expanded at once; user can scroll through the tree.
- Above the tree: a compact filter row — `[All | Not Started | In Progress | Completed]` (pill buttons) and a search input (filters by control ID or name).

**Detail panel (right, 30%):**

- Fixed width column, scrollable independently of the tree.
- Shows the selected control's full information:
  - Control ID (Geist Mono, uppercase, large)
  - Control name (Raleway, 20px)
  - **Maturity** (NIST) or **Status** (ISO/APRA) — big number or status pill
  - **Coverage:** percentage + horizontal bar visual (e.g., "45% — ▓▓░░░░░░") with tooltip explaining what coverage means for this control
  - Description (full control text from `ft_iso_controls` / `ft_nist_controls`)
  - Related controls (clickable — clicking one navigates to that control in its own framework tab)
  - Evidence list (if any uploaded)
  - N.A. justification (if marked N.A.)
  - Last updated timestamp + who updated
  - CTA: `[DISCUSS WITH {AGENT-NAME} 🤖 →]` → opens Cypher chat with this control pre-loaded as context

**Data source:** `GET /api/v1/dashboard/framework?framework=iso_27001_2022` returns tree + scores; `GET /api/v1/controls/{control_id}?framework=...` returns control details for the right panel.

### 4.3 Risk View

**Route:** `/dashboard/risk`

Two-stage experience: (1) **Risk Selection** if the user hasn't selected risks yet; (2) **Risk Dashboard** if they have.

**Detection:** On mount, fetch `GET /api/v1/dashboard/risk`. If `selectedRisks.length === 0` → show Stage 1. Otherwise → show Stage 2.

---

**Stage 1 — Risk Selection (first-time, or "Review Risk Library Again" triggered)**

**Sequential, one-risk-at-a-time flow.** NOT a grid.

Card layout (centred, max-width 640px):

```
RISK LIBRARY                                        Risk 3 of 20
(Geist Mono, primary, uppercase)        (Geist Mono, secondary)

[progress bar: 3 of 20 segments filled]

────────────────────────────────────────────────────

Customer Data Breach
(Raleway 800, 32px)

Unauthorised access to personally identifiable information (PII) 
or sensitive customer data through technical vulnerabilities, 
social engineering, or insider threats.
(Montserrat 400, 16px, secondary, line-height 1.6)

Does this risk apply to your organisation?

┌─────────────────────────────┐  ┌─────────────────────────┐
│ YES, THIS APPLIES TO ME  →  │  │ NO, NOT APPLICABLE      │
│ (primary button)            │  │ (ghost button)          │
└─────────────────────────────┘  └─────────────────────────┘
```

**If YES selected, replace the Yes/No buttons with priority selector (in-card transition):**

```
How are you tracking this risk?

┌─────────────────────┐
│ 🔴 Actively Tracking│ ← high priority, primary-bg hover
└─────────────────────┘
┌─────────────────────┐
│ 🟡 Concerned but     │ ← medium priority
│    Managing          │
└─────────────────────┘
┌─────────────────────┐
│ ⚪ Aware but Low     │ ← low priority
│    Priority          │
└─────────────────────┘
```

On priority selected → auto-advance to next risk (400ms delay for transition animation).

**Skip "No" path:** No priority selector; just auto-advance.

**Progress persistence:** Every choice is POSTed immediately to `/api/v1/risks/selection` with `{ riskId, applies: true/false, priority: 'high'|'medium'|'low'|null }`. If user closes the window mid-flow, they resume at the next unanswered risk.

**Completion screen (after risk 20 / 20):**

```
All 20 risks reviewed.

You selected 12 risks as applicable.
· 3 Actively Tracking
· 6 Concerned but Managing
· 3 Aware but Low Priority

We're mapping these to your selected frameworks now...
[spinner]

[CONTINUE TO RISK DASHBOARD →]
```

Backend runs risk-to-control mapping in the background (see Claude orchestration). Once done (or after a 3s delay max), button activates → navigate to Stage 2.

---

**Stage 2 — Risk Dashboard**

Layout: similar to Framework View — 70/30 split.

**Left (70%) — Three priority sections:**

```
🔴 ACTIVELY TRACKING (3)
  ┌──────────────────────────────────────────────┐
  │ [▮] Customer Data Breach                     │
  │     Mitigation: LOW (controls avg 2.1)       │
  │     5 related controls                       │
  └──────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────┐
  │     Ransomware Attack                        │
  │     Mitigation: MEDIUM (controls avg 2.9)    │
  │     8 related controls                       │
  └──────────────────────────────────────────────┘
  ...

🟡 CONCERNED BUT MANAGING (6)
  ...

⚪ AWARE BUT LOW PRIORITY (3)
  ...

──────────────────────────────────────────────────
[+ ADD CUSTOM RISK]   [↻ REVIEW RISK LIBRARY AGAIN]
```

Active risk is highlighted with the orange left-bar. Each section is collapsible (chevron on section header).

**Right (30%) — Detail panel (same pattern as Framework View):**

```
Customer Data Breach
PRIORITY: 🔴 Actively Tracking

MITIGATION STRENGTH
▓▓░░░░░░  Low (avg control maturity 2.1 / 5.0)
Action recommended — controls are not providing sufficient 
protection.

RELATED CONTROLS (5)
· GV.AA-01 — Access Control — 2.3 / 5.0 · Coverage 45%
· PR.DS-01 — Data Security — 2.1 / 5.0 · Coverage 60%
· DE.CM-01 — Continuous Monitoring — 1.8 / 5.0 · 30%
· RS.AN-01 — Analysis — 2.4 / 5.0 · 50%
· RC.RP-01 — Recovery Planning — 2.0 / 5.0 · 40%

Each control row is clickable → jumps to Framework View at that 
control.

[DISCUSS WITH SARAH 🤖 →]

[▸ PROVIDE LIKELIHOOD & IMPACT RATING]  (expands to a small form)
```

**Likelihood & Impact form (expandable):**

Intentional helper text on expand:
> "This is optional. Based on your organisation's own risk management framework, provide your assessment of likelihood and impact. This helps us re-rank the risk dashboard more accurately."

- Likelihood: radio (Very Likely / Possible / Unlikely)
- Impact: radio (Critical / Moderate / Minor)
- Button: "Save Rating" → POST `/api/v1/risks/rating`

**Add Custom Risk:**
- Opens a modal — textarea for risk description (200 chars max)
- On submit → POST `/api/v1/risks/custom` → backend calls Claude to map the custom risk to relevant controls
- Claude's response appears as a confirmation: "So you're concerned about [X]? I've mapped these controls as relevant: [list]. Does that match your intent?" — user confirms or edits
- Once confirmed, the custom risk appears in the selected priority section

---

## SECTION 5 — ASSESSMENT

**Route:** `/assessment` (landing screen) and `/assessment/{framework}/{domain?}` (active assessment)

### 5.1 Assessment Landing Screen

**Route:** `/assessment`

**Content panel:**

```
Assessment
(Raleway 800, 32px)

Choose a framework to begin or resume your assessment.
(Montserrat, secondary)

┌─────────────────────────────────────┐
│ ISO 27001:2022                      │
│ ─────────────────────────────────── │
│ Status: In Progress                 │
│ Last activity: 3 days ago           │
│                                     │
│ Compliance: 72%                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░          │
│                                     │
│ 3 questions pending Sarah 🤖 review │
│                                     │
│ [RESUME ASSESSMENT]  [REVIEW WITH   │
│                       SARAH 🤖]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ NIST CSF 2.0                        │
│ ─────────────────────────────────── │
│ Status: Not Started                 │
│ Last activity: —                    │
│                                     │
│ Maturity: — / 5.0                   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░            │
│                                     │
│ [START ASSESSMENT]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ APRA CPS 234                        │
│ ─────────────────────────────────── │
│ Status: Completed                   │
│ Last activity: 2 weeks ago          │
│                                     │
│ Maturity distribution:              │
│ Level 4: 45% · Level 3: 40% · Lv 2: 15%│
│                                     │
│ [RE-ASSESS]  [REVIEW WITH SARAH 🤖] │
└─────────────────────────────────────┘

ⓘ Already completed an assessment? You can always update a 
  specific control by chatting with Sarah 🤖. Just describe 
  what's changed, and I'll find the right control and update 
  your score.
```

**Tile data source:** `GET /api/v1/assessment/status` returns array of per-framework status objects.

**Tile button logic:**
- Status = Not Started → one button: "Start Assessment"
- Status = In Progress → two buttons: "Resume Assessment" + "Review with {Agent-Name} 🤖" (second only if there are marked questions)
- Status = Completed → two buttons: "Re-assess" + "Review with {Agent-Name} 🤖" (second only if there are marked questions)

### 5.2 Active Assessment — Path 1 (Direct Questions)

**Route:** `/assessment/nist_csf_2_0` (and similar)

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ NIST CSF 2.0 Assessment                              × Exit     │
├─────────────────────────────────────────────────────────────────┤
│ Domain progress:                                                │
│ [█████░░░░░] Govern 5/10   Identify 0/8   Protect 0/22 ...      │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│ DOMAIN TREE  │   QUESTION 3 of 7  (Govern > GV.OC-01)           │
│              │                                                  │
│ ▾ Govern     │   Does your organisation have a documented       │
│   · Q1 ✓     │   policy governing access controls?              │
│   · Q2 ✓     │                                                  │
│   · Q3 ▮     │   ┌───────────────────────────────────────┐     │
│   · Q4       │   │ Yes, and it's been reviewed in the    │     │
│   · Q5       │   │ last 12 months                         │     │
│   · Q6       │   └───────────────────────────────────────┘     │
│   · Q7       │                                                  │
│              │   ┌───────────────────────────────────────┐     │
│ ▸ Identify   │   │ Yes, but it hasn't been reviewed      │     │
│              │   │ recently                               │     │
│ ▸ Protect    │   └───────────────────────────────────────┘     │
│              │                                                  │
│ ▸ Detect     │   ┌───────────────────────────────────────┐     │
│              │   │ We have informal practices, no        │     │
│ ▸ Respond    │   │ documented policy                      │     │
│              │   └───────────────────────────────────────┘     │
│ ▸ Recover    │                                                  │
│              │   ┌───────────────────────────────────────┐     │
│              │   │ No, we don't have access control      │     │
│              │   │ policies                               │     │
│              │   └───────────────────────────────────────┘     │
│              │                                                  │
│              │   ── or type your own answer ──                  │
│              │   ┌───────────────────────────────────────┐     │
│              │   │ [textarea — your own answer]           │     │
│              │   └───────────────────────────────────────┘     │
│              │                                                  │
│              │   ┌──────────────┐ ┌───────────────┐            │
│              │   │ SKIP FOR NOW │ │ UNSURE —      │            │
│              │   │              │ │ DISCUSS WITH  │            │
│              │   │              │ │ SARAH 🤖      │            │
│              │   └──────────────┘ └───────────────┘            │
│              │                                                  │
│              │   ┌─────────────┐              ┌──────────────┐ │
│              │   │ ← PREVIOUS  │              │ NEXT →       │ │
│              │   └─────────────┘              └──────────────┘ │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

**Per question:**
- Show control ID + control name in small text above the question
- Question text in large Raleway 600
- 3–5 multiple-choice answer options (pulled from DB per question)
- "Type your own answer" textarea below the options
- Two secondary actions: "Skip for now" + "Unsure — discuss with {agent-name}"
- Previous / Next navigation

**"Skip for now"** → mark question as `skipped`; proceed to next.
**"Unsure — discuss with {agent-name}"** → mark question as `flagged_for_cypher`; proceed to next. These queue up for Path 2.

**Progress persistence:** Every answer is POSTed immediately to `/api/v1/assessment/answer`.

**Completion:** When all questions in a domain are answered (or skipped/flagged), domain score is computed and the UI shows a brief celebratory overlay (similar to existing domain-complete overlay). User proceeds to next domain or returns to assessment landing.

### 5.3 Active Assessment — Path 2 (Review with Cypher)

Entered via "Review with {agent-name}" button on the assessment landing, OR on demand from the tile.

This is a **Cypher-led dialogue** flow. Instead of showing the question with multiple-choice options, the full content panel is taken over by the Cypher chat experience. Cypher loads the user's flagged/unsure questions one at a time, explains each in plain language, asks follow-up questions, captures context, and synthesises an answer.

At the end of each question, Cypher shows a summary card: "Based on our conversation, I'm scoring this control at 2.4 / 5. Does that sound right?" — user Accepts / Edits / Rediscusses.

UI pattern: same visual language as the Cypher chat modal (Section 9), but **full-width content panel, not overlay**. There's an "Exit Review" button top-right that returns the user to the assessment landing.

---

## SECTION 6 — MATURITY ROADMAP

**Route:** `/maturity-roadmap`

**Content:**

```
Maturity Roadmap
(Raleway 800, 32px)

Your ongoing obligations, uplift actions, and response to 
industry shifts.
(Montserrat, secondary)

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ MAINTAIN         │  │ UPLIFT           │  │ INDUSTRY SHIFTS  │
│                  │  │                  │  │                  │
│ 🔴 12 ongoing    │  │ 🟡 47 actions    │  │ 🔵 3 regulatory  │
│    obligations   │  │    to reach 4.0  │  │    changes to    │
│                  │  │    maturity      │  │    address       │
│                  │  │                  │  │                  │
│ [▾ EXPAND]       │  │ [▾ EXPAND]       │  │ [▾ EXPAND]       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Tile behaviour:**
- Default state: all three collapsed, showing just the headline count and metric.
- Click "Expand" (or anywhere on the tile) → **only one tile can be expanded at a time.** Clicking another tile auto-collapses the currently expanded one and expands the clicked one.
- Expand animation: 300ms height auto-expand, content fades in.

**Expanded content (replaces the collapsed body):**

```
🔴 MAINTAIN (12)                                      [▴ COLLAPSE]
────────────────────────────────────────────────────────────────
Filter:  [Framework ▾]  [Domain ▾]  [Priority ▾]  [Due Date ▾]

┌────────────────────────────────────────────────────────────────┐
│ 🔴  Test incident response plan     Due: 3 days  MFA (RS.AN-01)│
│     [▾ Expand for details]                                     │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ 🟡  Review access control list      Due: 2 weeks  (GV.AA-01)   │
└────────────────────────────────────────────────────────────────┘
...
```

**Action row (default, 1 line):**
- Priority dot (colour)
- Action title
- Due date (relative, e.g. "3 days" or "overdue 2 days" in danger colour)
- Related control ID
- Chevron for inline expand

**On hover or click chevron → inline expand (doesn't modal, just grows the row):**
```
┌────────────────────────────────────────────────────────────────┐
│ 🔴  Test incident response plan     Due: 3 days  (RS.AN-01)   │
│                                                                │
│     Description: Conduct a tabletop exercise to verify your    │
│     incident response plan's effectiveness across key scenarios│
│                                                                │
│     Related framework: NIST CSF 2.0                            │
│     Last completed: 6 months ago                               │
│                                                                │
│     [✓ MARK COMPLETE]  [→ VIEW CONTROL]  [DISCUSS WITH SARAH]  │
└────────────────────────────────────────────────────────────────┘
```

**Filters (top of expanded section):**
- Framework: multi-select (or "All")
- Domain: multi-select
- Priority: multi-select (High / Medium / Low)
- Due Date: select (All / Overdue / This Week / This Month / Later)

**Uplift section specifics:** Includes a top banner: "Your target: 4.0 maturity. Current: 2.8. 47 actions will close this gap." With a progress bar visualising 2.8 → 4.0.

**Industry Shifts section specifics:** Each item is a regulatory change or emerging threat that affects the org. Shows a short description, a "Why this matters to you" line (references specific controls), and a "Dismiss" button (user can dismiss a shift if not applicable).

**Data source:** `GET /api/v1/maturity-roadmap?section=maintain|uplift|shifts` — returns paginated action items.

---

## SECTION 7 — PROGRESS & MILESTONES

**Route:** `/progress`

**Three tabs:** Timeline · Comparison · Milestones

**Framework sub-tabs** (second row): `[ISO 27001:2022]  [NIST CSF 2.0]  [APRA CPS 234]`

### 7.1 Timeline Tab

**Layout:**

- Title: "Maturity Over Time — {Framework Name}"
- Chart: framework-specific
  - **NIST:** Line chart, x = date (monthly snapshots), y = overall maturity 0–5. One line per function (GV, ID, PR, DE, RS, RC) in distinct colours. Legend at top.
  - **ISO:** Stacked area chart, x = date, y = 0–100%. Three stacks: Compliant (green), Non-Conformity (red), Opportunity (amber).
  - **APRA:** Stacked bar chart, x = date, y = 0–100%. Three stacks: Level 4, Level 3, Level 2.
- Below the chart: a table of snapshots (date, overall score/compliance, change from previous snapshot).

**Time range selector (top-right):** Last 30 days · Last 90 days · Last 12 months · Custom.

### 7.2 Comparison Tab

**Layout:**

- Title: "Compare Periods — {Framework Name}"
- Two date pickers: "Period A" and "Period B" (e.g., "Q1 2026" and "Q2 2026")
- Chart: overlay visualisation
  - **NIST:** Two radar polygons on the same chart (Period A vs Period B), with a delta summary to the side
  - **ISO/APRA:** Side-by-side stacked bars, one set per period

- Delta summary panel: list of domains with biggest improvements and biggest drops.

### 7.3 Milestones Tab

**Layout:** Vertical feed, chronological, newest first.

**Time range filter (top):** This Week · This Month · This Quarter · This Year · All Time.

**Feed items (cards):**

- 🟢 **Wins:** Green left bar, title, description, date. Example: "Reached 3.0+ in Governance — 15 Mar 2026"
- 🔴 **Challenges:** Red left bar. "Incident Response dropped 0.3 points — 10 Mar 2026"
- 📌 **Key Events:** Grey left bar. "APRA CPS 234 framework enabled — 05 Mar 2026"
- 🎉 **Celebrations:** Gold left bar. "Biggest monthly improvement: +0.6 in Detect — 01 Mar 2026"

Each card is clickable → expands inline to show the full context, contributing factors, and related controls.

**Data source:** `GET /api/v1/progress/timeline?framework=...&range=...`, `GET /api/v1/progress/comparison?framework=...&periodA=...&periodB=...`, `GET /api/v1/progress/milestones?range=...`

---

## SECTION 8 — ORGANISATION SETTINGS (Admin Only)

**Routes:**
- `/organisation/users` (default on "Organisation Settings" click)
- `/organisation/preferences`
- `/organisation/billing`
- `/organisation/audit`

**Access control:**
- All routes and sidebar entries hidden from non-admin users
- Direct URL access as non-admin → redirect to `/dashboard/industry` (if authenticated) or `/404`

### 8.1 Users

**Layout:**

```
Users
(Raleway 800, 32px)

Manage your team, roles, and assignments.
(Montserrat, secondary)

                                              [+ INVITE USER]

┌────────────────────────────────────────────────────────────────┐
│ Name             Email               Role       Status   Actions│
├────────────────────────────────────────────────────────────────┤
│ Vik Soni         vik@simplify.is    Admin      Active   ⋮      │
│ Sarah Chen       sarah@acme.com     Assessor   Active   ⋮      │
│ Ben Johnson      ben@acme.com       Viewer     Pending  ⋮      │
│ ...                                                             │
└────────────────────────────────────────────────────────────────┘
```

**Columns:** Name · Email · Role · Status · Actions
**Filters:** Role (All / Admin / Assessor / Viewer), Status (Active / Pending / Disabled)
**Search:** name or email

**Row actions menu (⋮):**
- Edit role
- Resend invite (if pending)
- Deactivate user
- Assign domains (opens side panel)

**Invite User modal:**
- Email (required)
- Role (Admin / Assessor / Viewer)
- Message (optional, included in email)
- Button: "Send Invitation"
- POST `/api/v1/organisation/users/invite`

### 8.2 Preferences

**Sections (accordion or stacked cards):**

**A. Organisation Details** (editable)
- Organisation name
- Industry
- Countries of operation
- Workforce size

**B. Selected Frameworks**
- Toggle per framework (ISO / NIST / APRA on; SOC 2 / PCI / HIPAA coming soon)
- **Lock notice:** "Frameworks can be changed once every 30 days. Last change: {date}. Next change available: {date}."
- Disabled toggle during cooldown.

**C. Session Settings**
- Session timeout slider: 15 min – 60 min
- Auto-save on: (checkbox) — defaults ON

**D. Notification Defaults**
- Email: Assessment due (on/off), Milestone reached (on/off), Weekly digest (on/off)
- In-app: Same options

**E. Data Export**
- Default export format (PDF / JSON / BI-API)
- Auto-export schedule (None / Monthly / Quarterly)

All changes auto-save on blur/toggle with a toast: "Preferences updated".

### 8.3 Billing

**Sections:**

- **Current Plan:** Name, price, status, renewal date
- **Frameworks Included:** List
- **Add-ons:** APRA CPS 234 (if purchased), usage-based line items
- **Payment Method:** Card on file (last 4 digits), change button
- **Invoices:** Table — date, amount, status, download PDF
- **Upgrade/Downgrade:** CTA to Stripe customer portal (external)

### 8.4 Audit

**Layout:**

```
Audit Log
(Raleway 800, 32px)

Who contributed what to your organisation's maturity — filtered 
for transparency.
(Montserrat, secondary)

Filter:  [Framework ▾]  [Date Range ▾]

┌────────────────────────────────────────────────────────────────┐
│ 2 hours ago                                                    │
│ Sarah Chen  ·  GV.OC-01 (Organisational Context)  ·  NIST      │
│ Answered: "MFA enabled on 85% of critical systems"             │
│ Impact: Control maturity 2.1 → 2.4                             │
│ Previous: "MFA on 60% of critical systems" (2 months ago)      │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ 3 hours ago                                                    │
│ Ben Johnson  ·  A.5.15 (Access Control)  ·  ISO                │
│ Answered: ...                                                  │
└────────────────────────────────────────────────────────────────┘
```

Entries are user-contribution events only — NOT account changes. Chronological, newest first, scroll-paginated (load more as user scrolls).

---

## SECTION 9 — USER PROFILE MODALS (Top-Right Menu)

### 9.1 Edit Profile Modal

**Trigger:** User clicks "Edit Profile" in the avatar dropdown.

**Modal:**
- Width: 480px, rounded 12px
- Fields:
  - **Avatar uploader** — drop zone or click to upload, shows current image in a circle (max 2MB, PNG/JPG/WebP)
  - **Full Name** — text input (editable)
  - **Position / Job Title** — text input (editable)
  - **Organisation Name** — text input (editable — but saving this updates the org record, not the user record; admin-only)
  - **Email** — text input (read-only, with a small tooltip: "Email is your login credential and cannot be changed here.")
- Buttons: "Cancel" (closes modal) + "Save Changes" (primary)

**Behaviour:**
- Save → PATCH `/api/v1/users/me`, then toast "Profile updated"
- Close modal on success

### 9.2 Change Password Modal

**Trigger:** "Change Password" in avatar dropdown.

**Modal:**
- Width: 480px
- Fields:
  - **Current Password** — password input
  - **New Password** — password input, with strength meter below (Weak / Fair / Good / Strong, coloured bar)
  - **Confirm New Password** — password input, must match
- Buttons: "Cancel" + "Change Password"

**Validation:**
- New password min 12 chars, at least one uppercase, one lowercase, one number, one special char
- Inline errors on blur
- Submit disabled until all three fields valid

**Submit:** POST `/api/v1/users/me/password` → on success, close modal + toast "Password updated. You'll stay signed in on this device." + log user out of all other devices (backend-triggered).

### 9.3 MFA Settings Modal

**Trigger:** "MFA Settings" in avatar dropdown.

**Modal contents conditional on state:**

**If MFA not enabled (non-admin user, MVP):**
- Title: "Multi-Factor Authentication"
- Status: "Not Enabled"
- Message: "Add a second layer of security. We recommend using an authenticator app like Authy or Google Authenticator."
- Button: "Enable MFA" → starts setup flow (QR code, enter code, show recovery codes)

**If MFA enabled:**
- Status: "Active — Authenticator App"
- Button: "Regenerate Recovery Codes" → shows warning modal first, then generates new codes, displays ONCE, offers PDF download
- Button: "Disable MFA" → confirmation modal, requires current password

**For admins:** MFA is currently optional in MVP (enforced in future). Same modal, same actions.

**Setup flow (when "Enable MFA" clicked):**
1. Modal shows QR code + manual secret
2. User scans, enters 6-digit TOTP code
3. On success, shows 10 recovery codes in Geist Mono, with "Download PDF" and "I've Saved Them" buttons
4. Mark MFA enabled

---

## SECTION 10 — CYPHER CHAT MODAL

**Trigger:** Click the floating Cypher button (bottom-right of content panel) OR "Discuss with {agent-name}" CTAs throughout the app.

**Visual:**

```
[Dashboard content here, dimmed with rgba(0,0,0,0.3) overlay]

                          ┌────────────────────────────────────┐
                          │ Sarah 🤖                       ✕   │
                          │ Your AI Security Consultant        │
                          ├────────────────────────────────────┤
                          │                                    │
                          │ Welcome back, Vik. Your maturity   │
                          │ improved 0.2 points this week in   │
                          │ Detect. Want to keep momentum      │
                          │ going?                             │
                          │                                    │
                          │ [Sarah message bubble — primary-   │
                          │  tinted bg, left-aligned]          │
                          │                                    │
                          │ Yes, where should we start?        │
                          │                                    │
                          │ [User message bubble — neutral bg, │
                          │  right-aligned]                    │
                          │                                    │
                          │ Let's look at your Protect domain. │
                          │ You have a gap in access control   │
                          │ that's worth 0.3 points...         │
                          │                                    │
                          ├────────────────────────────────────┤
                          │ Quick replies:                     │
                          │ [👍 Yes]  [🔄 Different topic]     │
                          ├────────────────────────────────────┤
                          │ ┌──────────────────────────┐  ┌──┐ │
                          │ │ Type your message...     │  │→ │ │
                          │ └──────────────────────────┘  └──┘ │
                          └────────────────────────────────────┘
```

**Position:** Slides in from the right edge of the viewport. Desktop: 36% of viewport width (min 440px, max 560px). Tablet: 50%. Mobile: 100% (full screen).

**Overlay:** Background (dashboard) has rgba(0,0,0,0.3) overlay. Click overlay OR press Esc → close chat. Overlay contents are non-interactive while chat is open.

**Header:**
- Agent name + emoji (e.g., "Sarah 🤖") in Raleway 20px
- Sub-text: "Your AI Security Consultant" in Montserrat 13px, secondary colour
- Close button (X) on far right

**Message area:**
- Scrollable, padded 20px
- Agent messages: left-aligned, primary colour 10% bg, rounded 12px (but flatter on top-left corner for "origin"), Montserrat 15px
- User messages: right-aligned, surface-container-high bg, rounded 12px (flatter on top-right corner)
- Typing indicator when Cypher is generating: three dots, bouncing
- Timestamps on hover (subtle, secondary colour)

**Quick replies:** Appear below the latest agent message when contextually relevant. Pills in ghost style, click fills the input with the text or sends directly.

**Input:**
- Textarea, auto-grows up to 4 lines
- Send button (arrow icon) on right; disabled when empty
- Enter sends; Shift+Enter new line
- Paste-safe (sanitises input, strips HTML)

**Open state:**
- Opens with smooth slide-in (300ms ease-out)
- Input auto-focuses on open
- If opened fresh (no prior conversation): Cypher sends a context-aware greeting based on current route/state. If returning: resume where left off.

**Pre-loaded context:**
- When opened from the floating button: general context
- When opened via "Discuss with {agent-name}" from a control detail: the control is pre-loaded as context; Cypher opens with "Let's talk about {control-name}. What would you like to discuss?"
- When opened from Path 2 (Review flagged questions): same concept, but in full-panel mode (not modal)

**API wiring:**
- Messages POST to `/api/v1/cypher/message` with `{ conversationId, message, context }` → returns stream of assistant response
- Claude streaming is handled via server-sent events
- All messages stored in `chat_transcripts` table

---

## SECTION 11 — EMPTY STATES & FIRST-TIME UX

For any screen where data may not yet exist:

**Pattern:**
1. Skeleton loaders on mount (grey rectangles, shimmer effect)
2. If data arrives empty: show a friendly empty state with an illustration (or large neutral icon), 1-sentence explanation, primary CTA to act.
3. Cypher chat does NOT auto-open on empty states (to avoid overwhelming). Instead, a helper text near the CTA says "Need help? Ask {agent-name} 🤖" as a secondary link.

**Specific empty states:**

- **Industry Dashboard (no assessments):** Radar shows peer-only; metrics show "—"; CTAs: "[Start your first assessment →]"
- **Framework View (no answers):** Tree is present but all scores are "—"; panel on right says "Select a control to see its detail, or start an assessment."
- **Risk View (no risks selected):** Shows Stage 1 automatically (risk library review flow)
- **Assessment Landing (fresh org):** All tiles show "Status: Not Started" with "Start Assessment" buttons
- **Maturity Roadmap (no actions yet):** Three tiles show "0 items" and "Complete an assessment to populate your roadmap" helper text
- **Progress & Milestones (no history):** "Your timeline will populate after your first assessment." with CTA back to Assessment

---

## SECTION 12 — COMPONENT LIBRARY (Extend Existing)

Agent 4 built a component library. Extend it. Add:

### New Components

**`/components/layout/DashboardLayout.tsx`** — wraps children; renders Header + Sidebar + Footer + ContentPanel

**`/components/layout/Header.tsx`** — sticky top bar (includes notification bell + user avatar dropdown)

**`/components/layout/LeftSidebar.tsx`** — static vertical menu with collapsible groups

**`/components/layout/Footer.tsx`** — compact footer

**`/components/layout/NotificationPopover.tsx`** — notification dropdown from bell

**`/components/layout/UserProfileDropdown.tsx`** — avatar dropdown menu

**`/components/modals/EditProfileModal.tsx`**

**`/components/modals/ChangePasswordModal.tsx`**

**`/components/modals/MFASettingsModal.tsx`**

**`/components/modals/AddCustomRiskModal.tsx`**

**`/components/modals/ConfirmationModal.tsx`** — generic confirm with title/message/confirm-text/cancel-text props

**`/components/onboarding/OnboardingShell.tsx`** — wraps onboarding steps with progress header

**`/components/onboarding/Step1ConsultantName.tsx`**

**`/components/onboarding/Step2Organisation.tsx`**

**`/components/onboarding/Step3Frameworks.tsx`**

**`/components/onboarding/Step4WorkspaceReady.tsx`**

**`/components/onboarding/WorkforceScaleDials.tsx`** — 4 tile radio-group for workforce size

**`/components/dashboard/InitialisationScreen.tsx`** — 3-tile first-entry picker

**`/components/dashboard/IndustryDashboard.tsx`** — the hero page

**`/components/dashboard/IndustryRadar.tsx`** — D3 radar, 6-axis, two polygons

**`/components/dashboard/IndustryMetricsPanel.tsx`** — right-side stat panel

**`/components/dashboard/StrengthsTile.tsx`**

**`/components/dashboard/StrategicPriorityTile.tsx`**

**`/components/dashboard/SecurityBriefingTile.tsx`**

**`/components/dashboard/ProgressSparklineTile.tsx`**

**`/components/dashboard/ConsentToggle.tsx`**

**`/components/dashboard/FrameworkView.tsx`**

**`/components/dashboard/FrameworkTabs.tsx`** — ISO / NIST / APRA switch

**`/components/dashboard/FrameworkOverviewViz.tsx`** — polymorphic (radar for NIST, bars for ISO/APRA)

**`/components/dashboard/FrameworkSummaryCards.tsx`** — 3 cards (Improved / Focus / Ignored)

**`/components/dashboard/ControlTree.tsx`** — expandable domain/control tree

**`/components/dashboard/ControlDetailPanel.tsx`** — right panel with control details

**`/components/dashboard/CoverageBadge.tsx`** — percentage + bar visual

**`/components/dashboard/RiskView.tsx`** — container

**`/components/dashboard/RiskSelectionFlow.tsx`** — Stage 1 sequential flow

**`/components/dashboard/RiskDashboard.tsx`** — Stage 2 grouped view

**`/components/dashboard/RiskDetailPanel.tsx`**

**`/components/assessment/AssessmentLanding.tsx`** — framework tile grid

**`/components/assessment/AssessmentTile.tsx`**

**`/components/assessment/AssessmentQuestionFlow.tsx`** — Path 1

**`/components/assessment/AssessmentCypherReview.tsx`** — Path 2 (full-panel Cypher mode)

**`/components/maturity/MaturityRoadmap.tsx`**

**`/components/maturity/RoadmapSummaryCard.tsx`** — the 3 collapsible cards

**`/components/maturity/ActionItem.tsx`** — single roadmap row

**`/components/progress/ProgressTabs.tsx`**

**`/components/progress/TimelineChart.tsx`** — polymorphic

**`/components/progress/ComparisonChart.tsx`** — overlay visualisation

**`/components/progress/MilestonesFeed.tsx`**

**`/components/organisation/UsersTable.tsx`**

**`/components/organisation/InviteUserModal.tsx`**

**`/components/organisation/PreferencesForm.tsx`**

**`/components/organisation/BillingPanel.tsx`**

**`/components/organisation/AuditLog.tsx`**

**`/components/cypher/CypherChatModal.tsx`** — slide-in right panel with dark overlay

**`/components/cypher/CypherMessage.tsx`** — message bubble (agent or user)

**`/components/cypher/CypherInput.tsx`** — textarea + send button

**`/components/cypher/FloatingCypherButton.tsx`** — fixed bottom-right launcher

### Shared UI

Extend existing `/components/ui/`:
- `Dropdown.tsx` — generic dropdown menu
- `Modal.tsx` — generic modal container
- `Toggle.tsx` — switch component
- `Tabs.tsx` — tab strip
- `Tile.tsx` — generic card/tile with variants

---

## SECTION 13 — ROUTING

Next.js App Router routes:

```
/dashboard
  /industry          → Industry Dashboard
  /framework         → Framework View
  /risk              → Risk View
  /initialisation    → First-login entry picker
/assessment          → Assessment Landing
  /[framework]       → Active assessment
/maturity-roadmap    → Maturity Roadmap
/progress            → Progress & Milestones
/organisation        (admin only)
  /users             → Users
  /preferences       → Preferences
  /billing           → Billing
  /audit             → Audit Log
/onboarding          (first-login admin only)
  /step-1            → Name Your AI Consultant
  /step-2            → Set Up Your Organisation
  /step-3            → Choose Your Frameworks
  /step-4            → Your Workspace is Ready
```

All `/dashboard`, `/assessment`, `/maturity-roadmap`, `/progress`, `/organisation` routes use `DashboardLayout`. Onboarding routes use `OnboardingShell`. `/initialisation` uses `DashboardLayout`.

---

## SECTION 14 — API CONTRACT (STUBS — wire to Agent 14 later)

For all data-fetching, create React Query hooks in `/lib/api/hooks/`. For this agent, you MAY return mock data from a local `/lib/mock-data.ts` file until real endpoints exist. Claude Code (next agent) will wire actual APIs.

**Hooks to create (mock for now):**
- `useIndustryDashboard()`
- `useFrameworkView(framework)`
- `useControlDetail(framework, controlId)`
- `useRiskSelection()`
- `useRiskDashboard()`
- `useAssessmentStatus()`
- `useAssessmentQuestion(framework, domain, index)`
- `useMaturityRoadmap(section)`
- `useProgressTimeline(framework, range)`
- `useProgressMilestones(range)`
- `useOrganisationUsers()`
- `useOrganisationPreferences()`
- `useAuditLog(filters)`
- `useCurrentUser()`
- `useCypherConversation()`
- `useNotifications()`

All hooks expose `{ data, isLoading, error, refetch }` per React Query convention.

---

## SECTION 15 — ACCESSIBILITY

**Every component must:**
- Have meaningful ARIA labels on all interactive elements
- Support keyboard navigation (Tab, Shift+Tab, Enter, Esc, Arrow keys in menus)
- Respect `prefers-reduced-motion` — disable transforms + animations (fade only)
- Maintain WCAG AA contrast in BOTH dark and light modes
- Support screen readers (aria-live for dynamic score changes, toast messages)
- Include `focus-visible` outlines on all focusable elements (2px solid primary)
- Provide skip-to-content link in the header

**Forms:**
- All inputs have associated labels
- Required fields marked with `aria-required="true"`
- Errors announced via `aria-live="polite"`
- Password strength announced via `aria-live="polite"` as it changes

---

## SECTION 16 — PERFORMANCE

**Targets:**
- Lighthouse Performance ≥ 90
- Lighthouse Accessibility ≥ 95
- Cumulative Layout Shift ≤ 0.1
- Largest Contentful Paint < 2.5s on fast 3G
- All animations 60fps

**Implementation:**
- Code-split heavy components (D3 charts, Framer Motion) via `next/dynamic`
- Image optimisation via `next/image`
- Fonts: `next/font` for Raleway, Montserrat, Josefin Sans, Geist Mono — subset to Latin, preload only the display font
- Lazy-load Cypher chat modal (not rendered until first open)
- Use React Query cache for all data fetching

---

## SECTION 17 — WHAT TO BUILD FIRST (Build Order)

Build in this exact order:

1. **DashboardLayout** + Header + LeftSidebar + Footer (the shell)
2. **User Profile dropdown + modals** (Edit Profile, Change Password, MFA Settings)
3. **Notification popover** (structure only; mock data)
4. **Industry Dashboard** ⭐ (hero page — spend the most time here)
5. **Cypher chat modal** (floating button + slide-in panel with mock messages)
6. **Framework View** (tree + detail panel, polymorphic viz per framework)
7. **Risk View** (Stage 1 selection flow + Stage 2 dashboard)
8. **Assessment landing + Active assessment Path 1 + Path 2 shell**
9. **Maturity Roadmap**
10. **Progress & Milestones** (3 tabs)
11. **Organisation Settings** (4 sub-pages)
12. **Onboarding** (all 4 steps + Initialisation screen)
13. **Empty states across all screens**
14. **Light-mode theme completion**
15. **Tablet + mobile responsive pass**

**Why this order:** Shell first so every subsequent screen has a home. Industry Dashboard early because it's the visual north star — its treatments cascade everywhere. Onboarding near the end because it has its own shell and fewer dependencies.

---

## SECTION 18 — HANDOFF TO CLAUDE CODE

When done, write `docs/HANDOFF_10_POSTLOGIN_CURSOR.md` containing:

- Every file created (with one-line purpose)
- Confirmed working (`npm run lint` ✓, `npm run build` ✓, `npm test` ✓)
- Routes registered
- Mock data file location
- Any component that has a known visual/polish gap — flag it explicitly so Claude Code can finish the pass
- Known issues / deferred items
- Specific notes for Claude Code (animation polish, light-mode colour refinements, edge cases)

---

## SECTION 19 — OUTSTANDING TASKS FOR VIK

Before building, confirm the following (either in chat with Vik or log them as TODOs in the handoff):

- [ ] Verify final filenames in `/Users/vik/Documents/Code/simplify-is/stitch_output/` for each onboarding PNG and the Industry Dashboard hero PNG
- [ ] Provide final wording for Cypher's welcome greeting on Industry Dashboard (warm, human, consultant-like — Vik confirmed; draft a version in the build)
- [ ] Provide 20 template risks (planned Supabase upload post-MVP — use placeholder risks for MVP UI)
- [ ] Provide the ~5–8 assessment questions per domain (planned Claude Code generation later — use placeholder questions for MVP UI)
- [ ] Confirm whether the Cypher chat overlay dims at `rgba(0,0,0,0.3)` is the correct intensity (or deeper/lighter)
- [ ] Confirm notification icons and the exact list of notification types (Assessment due, Domain completed, Cypher insight available, etc.)

---

## SECTION 20 — FINAL REMINDERS

- **Australian English everywhere.** Every label, tooltip, error, placeholder, helper text. Organisation, colour, centre, prioritise, optimise, licence, authorise.
- **Dates: DD/MM/YYYY.** Time: 24-hour or 12-hour with AM/PM — pick one and be consistent (recommend 12-hour with AM/PM for broader accessibility).
- **Agent name displays with emoji** — always render `{agentName} 🤖` in all UI references. Store only the name in DB.
- **Desktop-first**, then tablet, then mobile. Do not let mobile dictate the desktop design.
- **No lists or bullets in Cypher chat messages** — Cypher speaks in natural language, not formatted content.
- **Score animations pair with Cypher messages.** Never show a silent score change.
- **Session timeout default: 15 min.** User-configurable 15–60 min in Preferences.
- **Do NOT violate the three-layer architecture.** No Supabase calls from components. No Claude API calls from `/api/v1/*`. All AI through `/api/internal/*`.

---

**Build this as if your work is permanent. No shortcuts. No placeholder logic left in merged code. Every interaction polished. Every edge case handled. Every error state graceful.**

**When done, Claude Code will review and complete the polish pass. Build with that handoff in mind — leave the code clean, consistent, and well-commented.**

*End of Agent 10 (Cursor) spec.*
```

---

## FILE: `11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`

Path: `agents/11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`

```markdown
# Agent 11 (Claude Code) — Onboarding + Initialisation + Framework Pages Polish Pass
## Simplify IS | Runs AFTER Cursor Agent 11 Completes
### Version: April 2026 | Refinement, Polish, Visual Fidelity, Edge Cases

---

## ROLE & MISSION

Cursor has built the first pass of Agent 11 (onboarding refinement, Initialisation Screen with Tech Stack Discovery integration, public Framework + Pricing page updates) based on `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`.

Your job is to **review, refine, and complete the polish pass** — fixing anything Cursor rushed, missed, or built to a lower standard than spec.

**You are not rebuilding.** You are:
1. Auditing Cursor's Agent 11 work against the spec
2. Fixing visual inconsistencies, missing animations, incomplete states
3. Completing light-mode coverage where Cursor only handled dark mode
4. Completing tablet + mobile responsive variants
5. Hand-crafting custom framework SVG icons (if Cursor used Lucide fallbacks)
6. Tightening accessibility, performance, code quality
7. Removing any TODO / placeholder / console.log from merged code
8. Australian English grep pass
9. Verifying Agent 15 integration is solid

**Do not break working Cursor output.** Extend, refine, polish.

---

## READ BEFORE YOU START

In this exact order:

1. `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` — locked decisions across all UI/UX
2. `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md` — Cursor's spec (ground truth)
3. `HANDOFF_11_ONBOARDING_REFINEMENT.md` — Cursor's actual output (file list, gaps, notes)
4. `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md` and `HANDOFF_10_POSTLOGIN_CURSOR.md` — original onboarding foundation
5. `15_AGENT_FEATURE_*.md` and `HANDOFF_15_*.md` — Tech Stack Discovery context
6. `01_MASTER_CONTEXT.md` — full project context
7. `04_DESIGN_SYSTEM.md` — Earthen Brutalism design system

**Then run a full project tour:**
- `view` the project root for current file structure
- Read `components/onboarding/*.tsx` (verify Cursor's Step 1–4 refinements)
- Read `components/dashboard/InitialisationScreen.tsx` or `InitialisationModal.tsx`
- Read `components/banners/OnboardingBanner.tsx` and `TechStackDiscoveryBanner.tsx`
- Read public pages: Frameworks page, Pricing page
- Spot-check `components/ui/FrameworkIcon.tsx` and the icon files (custom SVGs or Lucide)

---

## REVIEW CHECKLISTS

### Checklist 1 — Onboarding Step 1 (Name Your AI Consultant)

- [ ] Headline matches: "Name Your AI Consultant" (Raleway 800, 40px)
- [ ] Sub-text: "This is how you'll address your consultant. Every user in your organisation will see this name."
- [ ] Input max length 10 characters (hard limit, further keystrokes rejected)
- [ ] Allowed characters: alphanumeric + spaces + apostrophe + hyphen only
- [ ] **Profanity filter active** — try entering common profanity → blocked with inline error: "Please choose a different name."
- [ ] **Empty submit defaults to "Cypher"** silently (no error)
- [ ] **Live preview tile updates as user types**: shows `🤖 {name}` (or `🤖 Cypher` placeholder when empty)
- [ ] Submit button shows spinner on click ("Initialise Identity")
- [ ] POSTs to `/api/v1/onboarding/consultant-name`
- [ ] On success → navigates to Step 2
- [ ] **Display format throughout app: `🤖 {name}` (emoji prefix, not suffix)** — verify across chat button, chat header, "Discuss with" CTAs, "Review with" buttons
- [ ] "SECURITY PROTOCOL VERIFIED" footer visible

### Checklist 2 — Onboarding Step 2 (Set Up Your Organisation)

- [ ] Organisation Legal Name pre-populated from signup data
- [ ] All four fields editable
- [ ] Industry dropdown shows 16 options (15 industries + "Other")
- [ ] **"Other" option triggers text input field** for custom industry (max 50 chars)
- [ ] Country field is autocomplete with chips
- [ ] Type-ahead filters country list correctly
- [ ] **Selected countries appear as chips below input** with `✕` to remove
- [ ] **"Clear all" link** appears when 3+ countries selected
- [ ] At least 1 country required, no maximum
- [ ] **Workforce Scale: 4 single-select dial tiles** (radio behaviour)
- [ ] Tile copy: "Small" / "Medium" / "Large" / "Enterprise" + employee range (e.g., "Medium: 51–250 employees")
- [ ] Selected tile: primary border + surface-bright bg + glow + checkmark
- [ ] Pre-populated from signup
- [ ] All four fields required → "Continue Setup" button disabled until all valid
- [ ] No inline errors during typing — just keep button disabled
- [ ] Server error → banner at top of card (danger styling)
- [ ] Back button returns to Step 1 with persisted inputs

### Checklist 3 — Onboarding Step 3 (Choose Your Frameworks) — MAJOR

This is the most complex refactor. Verify thoroughly.

**Plan detection:**
- [ ] Plan determined from signup data (`users.plan` or equivalent)
- [ ] Essential vs Professional behaviour differs correctly

**Layout:**
- [ ] **3×3 grid on desktop** (9 frameworks total)
- [ ] Tile size ~280×220px, 16px gap
- [ ] Tablet: 2 columns × 5 rows (last row centred, OR 4 rows + 1 spanning 2 cols — pick whichever Cursor implemented and verify it reads cleanly)
- [ ] Mobile: 1 column stack

**Framework tiles (all 9 visible):**
- [ ] NIST CSF 2.0 (top-left), ISO 27001:2022, PCI DSS 4.0
- [ ] APRA CPS 234, APRA CPS 230, ASD Essential Eight
- [ ] ISO 42001, AUVA ISS, NIST AI RMF
- [ ] Each tile has: custom icon + framework name + region badge + official description
- [ ] Tile descriptions match the official content (cross-check with `FRAMEWORK_TILE_DATA` constant)

**Tile state styling:**
- [ ] Selected: primary border 2px + subtle wash bg + glow + ✓ checkmark top-right
- [ ] Unselected: ghost border, no glow
- [ ] Locked (NIST): same as Selected + "Included" badge, click does nothing
- [ ] Disabled: opacity 0.5, cursor not-allowed

**Essential plan user behaviour:**
- [ ] Only NIST CSF 2.0 selectable (locked, ✓ pre-selected)
- [ ] All 8 other frameworks disabled (greyed out)
- [ ] Helper message: "Upgrade to Professional in Organisation Settings to add more frameworks"
- [ ] "Upgrade Now" CTA links to `/organisation/billing`

**Professional plan user behaviour:**
- [ ] NIST CSF 2.0 ✓ pre-selected, locked (cannot deselect)
- [ ] 8 optional frameworks selectable
- [ ] **Maximum 3 additional selections enforced**
- [ ] Once 3 additional selected → remaining tiles **disabled and greyed out**
- [ ] Deselecting one tile → previously disabled tiles re-enable
- [ ] Helper message: "Need more frameworks? You can purchase additional frameworks in Organisation Settings → Billing once logged in."

**Test cases:**
- [ ] Essential user sees: 1 selectable (NIST locked), 8 disabled
- [ ] Professional user starting fresh: NIST locked, 8 selectable
- [ ] Professional user after selecting 3 additional: NIST + 3 selected, 5 disabled
- [ ] Professional user deselects 1 of 3: 5 re-enabled (NIST + 2 still selected)

**Submit:**
- [ ] POST `/api/v1/onboarding/frameworks` with `{ selected: [...] }`
- [ ] On success → Step 4

### Checklist 4 — Onboarding Step 4 (Workspace Ready)

- [ ] Headline: "Your Workspace Is Ready"
- [ ] Sub-text references NIST CSF 2.0 (everyone gets NIST)
- [ ] **No reference to other frameworks** (ISO, APRA, etc.) on this step
- [ ] **No "Tech Stack Discovery" CTA** on Step 4 (it lives on Initialisation Screen, not here)
- [ ] 4 informational tiles in 2×2 grid: Dashboards, Assessment, Maturity Roadmap, Progress & Milestones
- [ ] Each tile: icon + title + 1–2 line description
- [ ] Tiles are informational (clicking does nothing)
- [ ] "Launch Application" button navigates to `/dashboard/initialisation`
- [ ] Footer: "🔒 SECURE SESSION ESTABLISHED · AUTH: 256-BIT"

### Checklist 5 — Initialisation Screen (PRIMARY FOCUS)

**Vik's locked decision: This is a modal overlay on top of empty Industry Dashboard.**

- [ ] Route `/dashboard/initialisation` accessible only when `users.has_seen_initialisation === false`
- [ ] Subsequent visits redirect to `/dashboard/industry`
- [ ] Modal centred on screen, ~720px wide on desktop
- [ ] **Background: empty Industry Dashboard rendering behind modal**, dimmed with `rgba(0,0,0,0.5)` overlay
- [ ] Modal not dismissable by Esc or X — only by clicking a CTA or "Skip for now"

**Hero CTA — Tech Stack Discovery:**
- [ ] **"STEP 1" badge** in top-left corner of card (Geist Mono, primary, uppercase)
- [ ] Custom icon (wrench/gear/stack) — 40×40px, burnt orange tone
- [ ] Title: "Run Tech Stack Discovery"
- [ ] Description: "Configure your infrastructure so your assessments are tailored to your environment. This helps 🤖 {agent} understand your cloud, backups, datasets, and security posture."
- [ ] Sub-line: "Recommended first step."
- [ ] CTA button: "Start Discovery →" (primary)
- [ ] Card sized **slightly larger than the 3 secondary tiles below**
- [ ] Subtle primary tint background, primary border, stronger glow than secondary tiles
- [ ] **Click integration with Agent 15** verified — leads to discovery flow correctly

**Three secondary CTAs (single row on desktop):**
- [ ] Tile 1: "Begin Assessment" → `/assessment`
- [ ] Tile 2: "Map Industry Risks" → `/dashboard/risk` (Stage 1)
- [ ] Tile 3: "Invite Team Members" → `/organisation/users` (open Invite User modal automatically)
- [ ] Equal size, sequence labels (`01 / DASHBOARD`, `02 / CONSULT`, `03 / TEAM`)
- [ ] Each click sets `has_seen_initialisation = true` before navigation

**Skip link:**
- [ ] "Skip for now →" text link below the secondary tiles
- [ ] Click → sets `has_seen_initialisation = true` AND `tech_stack_discovery_status = 'skipped'`
- [ ] Redirects to `/assessment` (per Vik's locked post-onboarding redirect)
- [ ] Persistent banner appears on all subsequent pages

### Checklist 6 — Banners

**Onboarding Banner (if user skipped initial onboarding prompt):**
- [ ] Sticky top of content panel on EVERY page
- [ ] Amber/warning background
- [ ] ⚠️ icon + "Complete your organisation setup to unlock full features"
- [ ] CTAs: "Start Setup" (primary) + "Skip for now" (text link)
- [ ] Dismiss is per-session (reappears next login)
- [ ] Hidden when `organizations.onboarding_completed_at !== null`

**Tech Stack Discovery Banner (if user skipped from Initialisation Screen):**
- [ ] Sticky top of content panel on EVERY page
- [ ] Amber/warning background
- [ ] ⚠️ icon + "Complete Tech Stack Discovery to enable Infrastructure-aware assessments and the Threat Dashboard."
- [ ] CTAs: "Run Discovery" (primary) + "Dismiss" (text link)
- [ ] Dismiss is per-session
- [ ] **Non-admin users see disabled "Run Discovery" button with tooltip**: "Tech Stack Discovery can only be run by your organisation admin."
- [ ] Hidden when `tech_stack_discovery_status === 'completed'`

### Checklist 7 — Organisation Settings: Tech Stack Page

- [ ] Route `/organisation/tech-stack` registered
- [ ] Sub-item "Tech Stack" added to Organisation Settings sub-menu in `LeftSidebar.tsx`
- [ ] Position 3 of 5 (Users, Preferences, **Tech Stack**, Billing, Audit)
- [ ] Page wrapper uses DashboardLayout
- [ ] Page title: "Tech Stack & Infrastructure" (Raleway 800, 32px)
- [ ] Sub-text describes purpose
- [ ] **Agent 15's components embedded inside the page wrapper**
- [ ] If Agent 15 didn't deliver a "summary view", a fallback wrapper is in place (cards listing captured data + "Re-run Discovery" button)
- [ ] Admin-only — non-admins see 404 / redirect to `/dashboard/industry`

### Checklist 8 — Public Frameworks Page

- [ ] Route `/frameworks` updated
- [ ] Hero: "Standards we support" headline
- [ ] **3×3 grid of all 9 frameworks** (NIST first, then ISO, PCI, APRAs, ASD, ISOs, AUVA, NIST AI)
- [ ] Each tile: custom icon + name + region badge + official description
- [ ] All 9 tiles styled identically (no "premium vs free" distinction here)
- [ ] **No purchase action** — pure information page
- [ ] Hover: subtle lift + glow
- [ ] CTA section at bottom: "Get Started →" + "View Pricing"
- [ ] Responsive: 3×3 desktop / 2-col tablet / 1-col mobile

### Checklist 9 — Public Pricing Page

- [ ] Route `/pricing` updated
- [ ] Hero: "Plans for every stage" headline
- [ ] **Two pricing tier cards side-by-side**: Essential | Professional
- [ ] **Essential bullets**:
  - ✓ NIST CSF 2.0 (NOT "ISO + NIST")
  - ✓ Cypher AI Consultant
  - ✓ Industry benchmarking
  - ✓ Maturity Roadmap
  - ✓ Progress & Milestones
- [ ] Essential CTA: "Start Free Trial →" (14-day trial)
- [ ] **Professional bullets**:
  - ✓ NIST CSF 2.0
  - ✓ Choice of 3 additional frameworks
  - ✓ Cypher AI Consultant
  - ✓ Industry benchmarking
  - ✓ Maturity Roadmap
  - ✓ Progress & Milestones
  - ✓ Multi-user collaboration
  - ✓ Priority support
- [ ] Professional: "Paid only — no trial" indicator
- [ ] Professional CTA: "Get Started →"
- [ ] **Pricing values unchanged** (use existing dollar amounts)

**Add-ons section:**
- [ ] Heading: "Customise your Professional plan"
- [ ] Sub-text mentions $249/month per framework add-on
- [ ] **3×3 grid of all 9 frameworks** (purely informational)
- [ ] **No purchase buttons, no checkboxes, no interaction**
- [ ] Hover: subtle lift only
- [ ] Bottom note: "Already on Professional? You can add more frameworks once logged in via Organisation Settings → Billing."

### Checklist 10 — Signup Form Updates

- [ ] **Plan selector** added to signup form (Essential vs Professional cards)
- [ ] Essential: 14-day trial messaging
- [ ] Professional: paid-only, payment fields appear when selected
- [ ] **Optional framework pre-selection** for Professional users (skippable)
- [ ] Pre-selected frameworks pass through to onboarding Step 3 (pre-populate selections)

### Checklist 11 — Custom Framework Icons

**Vik's locked decision:** Research official → recreate in Earthen Brutalism palette → ship dark + light mode variants.

**Cursor likely used Lucide fallbacks. Replace with custom SVGs:**

- [ ] All 9 frameworks have custom SVG icons in `public/icons/frameworks/`
- [ ] Dark + light mode variants for each (18 SVG files total)
- [ ] Files named: `{framework-id}-{dark|light}.svg` (using hyphens, not underscores)
- [ ] Icons recognisable as the framework they represent
- [ ] Consistent stroke weight across all 9 icons
- [ ] Burnt orange + dark charcoal + warm stone palette
- [ ] 48×48 viewport, 40×40 visible (8px internal padding)
- [ ] Geometric, not photorealistic
- [ ] **Do NOT directly copy official logos** (recreate in our style)
- [ ] `FrameworkIcon.tsx` component correctly switches between dark/light based on theme
- [ ] All icons render correctly in: Frameworks page, Pricing page, Onboarding Step 3, Initialisation Screen (if used)

**If custom SVGs are deferred to a future polish:**
- [ ] Lucide fallbacks at minimum match the framework themes (Shield/Lock for security, CreditCard for PCI, Cpu/Brain for AI, etc.)
- [ ] Lucide icons styled with primary colour stroke
- [ ] Document this as a known interim in handoff

### Checklist 12 — Light Mode Coverage

Cursor likely focused dark mode. Complete light mode for:

- [ ] All 4 onboarding steps (Step 1–4)
- [ ] Initialisation Screen modal + overlay
- [ ] Onboarding banner
- [ ] Tech Stack Discovery banner
- [ ] Tech Stack page (`/organisation/tech-stack`)
- [ ] Public Frameworks page (likely already light-mode-aware from Agent 7)
- [ ] Public Pricing page (likely already light-mode-aware from Agent 7)
- [ ] Signup form updates (plan selector, framework pre-selection)

**Specifically verify:**
- [ ] Glass effects use light-mode opacity (`rgba(255,252,242,0.85)`) when in light mode
- [ ] Primary colour (#EB5E28) used consistently
- [ ] Secondary text uses #4F4B42 (light mode), not #CDC6BA (dark mode)
- [ ] Custom framework icons load light-mode variants
- [ ] No dark-mode-only assumptions (e.g., assuming dark backgrounds when placing glows)
- [ ] WCAG AA contrast in light mode

### Checklist 13 — Tablet + Mobile Responsive

- [ ] Onboarding Steps 1–4: cards adapt to tablet (640px max-width); mobile fills viewport
- [ ] Step 3 framework grid: 3×3 desktop → 2-col tablet → 1-col mobile
- [ ] Initialisation Screen: 720px desktop → 640px tablet → full-screen sheet on mobile
- [ ] Initialisation secondary CTAs: row on desktop/tablet → stacked on mobile
- [ ] Public Frameworks page: 3×3 → 2×5 (tablet) → 1-col (mobile)
- [ ] Public Pricing page: tiers side-by-side desktop → stacked tablet/mobile
- [ ] Add-ons grid: 3×3 → 2-col → 1-col
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Forms usable on mobile (inputs full-width, no horizontal scroll)
- [ ] Modals full-screen sheets on mobile

### Checklist 14 — Accessibility

- [ ] Tab through every onboarding step keyboard-only (logical order, no traps)
- [ ] Initialisation modal traps focus while open
- [ ] Skip link still accessible via keyboard from modal
- [ ] All icon buttons have aria-labels
- [ ] All form inputs have associated labels
- [ ] Errors announced via `aria-live="polite"`
- [ ] Profanity filter rejection announced
- [ ] Country chip removal: aria-label "Remove {country}"
- [ ] Workforce Scale dials: proper radio group ARIA (`role="radiogroup"`, each tile `role="radio"`, `aria-checked`)
- [ ] Framework tiles in Step 3: `role="checkbox"` for selectable, `aria-disabled="true"` for disabled
- [ ] All animations respect `prefers-reduced-motion`
- [ ] WCAG AA contrast in both themes

### Checklist 15 — Performance

- [ ] `npm run build` zero warnings
- [ ] Lighthouse on Public Frameworks page ≥ 90 Performance
- [ ] Lighthouse on Onboarding Step 3 (heaviest) ≥ 90 Performance
- [ ] Custom framework SVGs lightweight (each <5KB)
- [ ] Lucide icons tree-shaken (only imported icons in bundle)
- [ ] No memory leaks on repeated onboarding flow (back/forward navigation)
- [ ] CLS ≤ 0.1 (no layout shifts when framework grid loads)
- [ ] 60fps animations (modal slide-in, tile hover, etc.)

### Checklist 16 — Code Quality

- [ ] TypeScript strict — zero `any` types
- [ ] No `console.log` in merged code
- [ ] No `TODO:` / `FIXME:` comments
- [ ] All env vars from `lib/config/env.ts`
- [ ] No direct Supabase calls from components
- [ ] No direct Claude API calls from `/api/v1/*` routes (Initialisation Screen Tech Stack CTA goes through Agent 15's plumbing)
- [ ] Every async function has error handling
- [ ] Generic error messages (no PII leakage)
- [ ] `npm run lint` zero warnings
- [ ] `npm test` all passing

### Checklist 17 — Australian English Audit

Grep entire codebase for American spellings. Fix all:

```
organize → organise
organization → organisation
authorize → authorise
recognize → recognise
prioritize → prioritise
optimize → optimise
realize → realise
customize → customise
analyze → analyse
initialize → initialise
color → colour
center → centre
favor → favour
honor → honour
labor → labour
license (noun) → licence
defense → defence
program (schedule) → programme
```

**Date format:** DD/MM/YYYY (e.g., `15/03/2026`)

**Time format:** 12-hour with AM/PM (e.g., `2:30 PM`)

**Especially verify:**
- All onboarding copy
- Framework descriptions
- Pricing page copy
- Banner copy
- Error messages
- Toast notifications
- Helper text and tooltips

### Checklist 18 — Agent 15 Integration Verification

- [ ] Initialisation Screen "Start Discovery" button correctly invokes Agent 15's discovery flow
- [ ] Agent 15's completion handler correctly redirects to `/dashboard/industry` (per Vik's lock)
- [ ] If Agent 15 uses Cypher chat for discovery: chat opens with discovery context pre-loaded
- [ ] Tech Stack page (`/organisation/tech-stack`) embeds Agent 15's components correctly
- [ ] Re-running discovery from Tech Stack page works correctly
- [ ] Skip flow correctly sets `tech_stack_discovery_status = 'skipped'` and shows banner across app
- [ ] Completion correctly sets `tech_stack_discovery_status = 'completed'` and removes banner

### Checklist 19 — Empty States & Error States

- [ ] Onboarding Step 3 with empty selection (Professional user): NIST visible as locked, 8 unselected, helper text visible
- [ ] Onboarding Step 3 at max selection (Professional user with 3 additional): 5 disabled tiles greyed
- [ ] Onboarding Step 3 for Essential plan: 8 disabled with "Upgrade to access" pills
- [ ] Profanity rejected on Step 1: inline error visible, button disabled until valid
- [ ] Server errors on any submit: banner at top of card, no leaked internal details
- [ ] Tech Stack page when no discovery run yet: "Start Tech Stack Discovery" CTA prominent, no fake data
- [ ] Frameworks page in light mode + dark mode both render correctly
- [ ] Pricing page tier cards equal height regardless of bullet count

### Checklist 20 — Manual Walk-Through

Run a fresh end-to-end test:

1. Sign up as new user (Essential plan) → verify email
2. First login → see onboarding banner on dashboard → click "Start Setup"
3. Complete Step 1 (name agent "Sarah") → verify `🤖 Sarah` shown in preview
4. Complete Step 2 (org details, multi-select countries with chips, workforce dials)
5. Complete Step 3 (Essential plan: only NIST selectable, "Upgrade" message visible)
6. Complete Step 4 (NIST orientation, no other framework references)
7. Land on Initialisation Screen modal
8. Verify Industry Dashboard renders empty behind dimmed overlay
9. Click "Start Discovery" → verify Agent 15 flow launches
10. (If Agent 15 ready) Complete discovery → land on Industry Dashboard
11. (Or) Click "Skip for now" → land on Assessment screen → see Tech Stack Discovery banner persist on every page

Now do the same as Professional plan user:
1. Sign up Professional → optionally pre-select frameworks at signup
2. Onboarding Step 3: NIST locked, 3 more selectable, hit max → see 5 disabled
3. Continue, land on Initialisation Screen
4. Complete Tech Stack Discovery → land on Industry Dashboard with everything enabled

Then check public pages:
- Visit `/frameworks` (logged out) → verify 3×3 grid with all 9 frameworks
- Visit `/pricing` → verify Essential = NIST only, Professional = NIST + 3, add-ons section informational

---

## SECTION 2 — TYPICAL CURSOR GAPS TO FIX

Based on Cursor's pattern across Agents 7, 9, 10:

1. **Light mode incomplete or inconsistent** — fix systematically
2. **Mobile responsive shallow** — verify every breakpoint
3. **Empty states often skipped** — add where missing
4. **Accessibility ARIA roles missing** — pass through everything
5. **Animation polish minimal** — modal slide-in, tile hover, framework grid entrance, banner reveal
6. **Reduced-motion handling missing** — fix all transforms
7. **Profanity filter may be a stub** — verify it's real (use `bad-words` npm package)
8. **Country autocomplete chips may be visual-only** — verify removal logic works
9. **Framework Step 3 max-3 logic may have edge cases** — test thoroughly
10. **Agent 15 integration may be a stub** — verify actual handoff works
11. **Public Frameworks/Pricing pages may not be updated** — verify all 9 frameworks visible, pricing tier copy correct
12. **Custom framework icons probably use Lucide** — replace if time allows
13. **Australian English may not be fully scanned** — grep entire codebase
14. **Banner persistence may be incomplete** — verify on every page route

---

## SECTION 3 — AUDIT FLOW

Work in this order:

1. **Read Cursor's HANDOFF_11** to understand what was built and what was flagged
2. **Audit shell-level changes** — LeftSidebar (Tech Stack sub-item), banners, routing
3. **Polish onboarding Steps 1–4** in order
4. **Polish Initialisation Screen** (most critical — Vik called this "highest scrutiny")
5. **Verify Agent 15 integration end-to-end**
6. **Polish public Frameworks page**
7. **Polish public Pricing page**
8. **Polish Signup updates** (plan selector, optional framework pre-select)
9. **Polish Tech Stack page wrapper**
10. **Empty states + error states across all touched components**
11. **Light mode pass**
12. **Tablet + mobile responsive pass**
13. **Custom framework icons** (or document Lucide interim)
14. **Accessibility audit**
15. **Performance audit**
16. **Australian English grep + fix**
17. **Final lint / build / test**

---

## SECTION 4 — TESTING

### Unit Tests
- Profanity filter on agent name
- Industry "Other" custom input enable/disable
- Country chip add/remove
- Workforce dial single-select
- Framework Step 3 max-3 selection logic (Professional)
- Framework Step 3 disabled state (Essential)
- Banner show/hide based on user state

### Integration Tests
- Onboarding flow Step 1 → Step 4 (happy path, both Essential and Professional)
- Onboarding resume mid-flow
- Initialisation Screen → Tech Stack Discovery → Dashboard
- Initialisation Screen → Skip → Assessment → banner persistent
- Public Frameworks page renders all 9 tiles
- Public Pricing page tier copy correct

### Visual Regression
- Capture screenshots of: Step 1, Step 2, Step 3 (Essential + Professional + max-3), Step 4, Initialisation Screen, Frameworks page, Pricing page
- Compare against baseline on subsequent runs

---

## SECTION 5 — HANDOFF

Write `HANDOFF_11_ONBOARDING_REFINEMENT_CLAUDE_CODE.md` containing:

- Every file modified (one-line summary)
- Confirmed: lint ✓, build ✓, tests ✓, Lighthouse ≥ 90 ✓, Accessibility ≥ 95 ✓
- Light mode coverage: 100%? Gaps?
- Responsive coverage: desktop / tablet / mobile all verified?
- Custom framework icons: shipped or Lucide interim?
- Agent 15 integration verified end-to-end?
- Australian English: 100%?
- Known issues / deferred items
- Notes for Agent 12 (API wiring)

---

## SECTION 6 — OUTSTANDING TASKS FOR VIK

- [ ] Approve custom framework icon designs (if shipped) OR confirm Lucide interim acceptable for MVP
- [ ] Confirm framework descriptions match official sources verbatim
- [ ] Confirm $249/month per add-on framework pricing accurate
- [ ] Confirm post-Tech-Stack-Discovery redirect destination (currently → Industry Dashboard)
- [ ] Confirm Tech Stack page UX defined by Agent 15 is satisfactory; any tweaks needed?
- [ ] Provide final Cypher welcome greeting wording (still pending from Agent 10)

---

## SECTION 7 — FINAL REMINDERS

- **Don't rebuild — polish.** Respect Cursor's foundation.
- **Australian English everywhere.**
- **Agent name 🤖 prefix in all display contexts.**
- **Desktop first, tablet/mobile secondary.**
- **Match Earthen Brutalism design language exactly.**
- **No TODOs / console.logs / placeholder logic in merged code.**
- **Every state graceful: loading, empty, error, success.**
- **Plan-awareness critical for Step 3 + public pages.**
- **Banners persist on EVERY page until completed.**
- **Agent 15 integration must work end-to-end.**

**When this pass is complete, the onboarding + initialisation + public pages should be MVP-ready. Agent 12 will wire APIs. Subsequent agents add features.**

---

*End of Agent 11 (Claude Code) spec.*
```

---

## FILE: `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`

Path: `agents/11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`

```markdown
# Agent 11 (Cursor) — Onboarding Refinement, Initialisation Screen, Framework + Pricing Page Updates
## Simplify IS | Front-end Build | Reads Agent 10 + Agent 15 Outputs
### Version: April 2026 | Cursor Primary Build | Claude Code Polish After

---

## ROLE & MISSION

You are extending the work delivered in **Agent 10 (Post-Login UI/UX)** and **Agent 15 (Tech Stack Discovery)** to:

1. **Verify and refine the Onboarding flow** (Steps 1–4 should already exist from Agent 10)
2. **Build/refine the Initialisation Screen** to feature the Tech Stack Discovery as the primary call-to-action and integrate cleanly with Agent 15
3. **Update the public Framework page** (pre-login marketing site) to showcase all nine frameworks with custom-styled icons and official descriptions
4. **Update the public Pricing page** (pre-login marketing site) to reflect the new pricing tiers and show all framework add-ons informationally

**This is a front-end UI/UX build only.** API wiring + state management will be done by Agent 12.

**Non-negotiables:**
1. **World-class product quality** — best AI security assessment tool ever built. No shortcuts.
2. **Security first** — no secrets in client bundles, no direct Supabase calls from components.
3. **Australian English throughout** — "Organisation", "colour", "centre", "licence", "realise", "optimise". Date format DD/MM/YYYY.
4. **Desktop first**, tablet and mobile secondary.
5. **Design fidelity** — match Agent 10's Earthen Brutalism design language exactly. No new visual vocabulary.

---

## READ BEFORE YOU BUILD (CRITICAL)

Before writing any code, read these files **in this exact order**:

### Master Reference
1. `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` — every UI/UX decision Vik and Claude have locked. Source of truth for design language, sidebar architecture, header, modals, copy standards, accessibility, etc.

### Agent 10 Outputs (Post-Login UI/UX)
2. `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md` — Agent 10 spec
3. `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md` — Agent 10 polish spec
4. `HANDOFF_10_POSTLOGIN_CURSOR.md` — what Cursor delivered (file list, routes, gaps)

**Action after reading Agent 10 handoff:**
- Confirm whether `app/onboarding/step-1` through `step-4` exist
- Confirm whether `app/dashboard/initialisation` exists
- Inspect `components/onboarding/` for existing Step 1–4 components and `OnboardingFlow.tsx`
- Inspect `components/dashboard/` for the Initialisation Screen component
- **If they exist:** REFINE them per this spec (do not rebuild from scratch)
- **If they're missing:** BUILD them fresh per this spec

### Agent 15 Outputs (Tech Stack Discovery)
5. Look in the same project folder for any file beginning with `15_AGENT_FEATURE` (this is the Tech Stack Discovery spec)
6. Look for `HANDOFF_15_*.md` (the handoff)
7. Inspect any components/routes Agent 15 produced under `components/discovery/`, `components/techstack/`, or similar

**Action after reading Agent 15 outputs:**
- Identify the entry point (route, function, component) Agent 15 exposes for launching the discovery flow
- Identify the conversational/Cypher pattern Agent 15 uses
- Identify the completion handler (callback, route redirect, state update)
- This is what you will hook the Initialisation Screen primary CTA into

### Existing Codebase Conventions
8. `01_MASTER_CONTEXT.md` — project context, tech stack, architectural rules
9. `04_DESIGN_SYSTEM.md` — Earthen Brutalism colour tokens, typography, components

### Existing Components (do not duplicate; extend)
10. `components/layout/DashboardLayout.tsx` — canonical layout (use as wrapper for Initialisation Screen)
11. `components/onboarding/*` — existing onboarding components to verify/refine
12. `components/ui/*` — shared UI primitives (Modal, Toggle, Tabs, etc.)
13. Public landing pages — search for `app/(marketing)/frameworks/page.tsx` and `app/(marketing)/pricing/page.tsx` (or wherever the existing pre-login Framework + Pricing pages live, per Agent 7)

---

## SECTION 1 — ONBOARDING FLOW VERIFICATION & REFINEMENT

### 1.1 Trigger & Routing Logic (Re-confirm)

Onboarding triggers when:
- User has completed signup + email verification
- User is the **organisation admin**
- `organizations.onboarding_completed_at IS NULL`

**Behaviour:**
- User lands on Dashboard with a **persistent banner** (top of every page) prompting them to complete onboarding
- Banner has two CTAs: **"Start Setup"** (primary) and **"Skip for now"** (secondary link)
- Banner persists on every page until onboarding is 100% complete
- If skipped: user can view dashboards in read-only mode but cannot start an assessment, select risks, or run Tech Stack Discovery
- Onboarding is one-time only — once completed, user never sees onboarding steps again
- Future changes happen via Organisation Settings → Preferences

### 1.2 Resume Behaviour

- If user closes browser mid-onboarding (e.g., after Step 2), next login returns them directly to Step 3 (where they left off)
- Resume happens by checking `users.onboarding_step_completed` (or equivalent flag in DB) and routing accordingly
- No "Resume?" modal — just take them back to where they were

### 1.3 Onboarding Shell

The onboarding flow uses **DashboardLayout** (header + sidebar + content panel + footer all visible), NOT a standalone shell.

**However, during onboarding:**
- Sidebar items are **disabled/greyed out** (user cannot navigate away to Dashboard, Assessment, etc.)
- User profile dropdown (top-right) remains active (user can still log out)
- Notification bell remains active
- Footer remains visible
- Onboarding form fills the content panel area

**Why this approach:** Vik confirmed Option B — onboarding inside DashboardLayout, sidebar greyed, full app shell visible. This gives users a sense of "where they are" within the application.

### 1.4 Banner (Onboarding Reminder)

If user skipped onboarding from initial prompt and is browsing the dashboard:

```
┌──────────────────────────────────────────────────────────────┐
│ ⚠️  Complete your organisation setup to unlock full features  │
│                                                              │
│   [Start Setup] [Skip for now]                               │
└──────────────────────────────────────────────────────────────┘
```

**Specs:**
- Position: Sticky top of content panel (below the canonical Header)
- Background: warning colour (`#F59E0B` or amber tone, slightly muted)
- Text colour: `on-surface` (ensures readability against amber)
- Icon: ⚠️ warning triangle
- Two CTAs: "Start Setup" (primary button) + "Skip for now" (text link)
- Dismissable per session (skip closes for that session only); reappears on next login
- **Persistent on EVERY page** until onboarding 100% complete: Dashboard, Assessment, Maturity Roadmap, Progress, Organisation Settings (admin)

### 1.5 Step 1 — Name Your AI Consultant

**Verify Agent 10 implementation matches this spec. Refine if needed.**

**Card structure:**
```
INITIALISATION                    ──────
(Geist Mono, uppercase, primary, 11px)

Name Your AI Consultant
(Raleway 800, 40px)

This is how you'll address your consultant. Every user in your 
organisation will see this name.
(Montserrat 400, 16px, secondary, line-height 1.6)

CONSULTANT'S NAME                            MAX 10 CHARS
┌────────────────────────────────────────────────────┐
│ e.g. Cypher                                        │
└────────────────────────────────────────────────────┘

[Live preview tile beneath the input — see below]

┌──────────────────────────────────────────┐
│  INITIALISE IDENTITY           →         │
└──────────────────────────────────────────┘

🔒  SECURITY PROTOCOL VERIFIED
```

**Validation rules (lock these):**
- Min: 0 characters → if blank, default silently to "Cypher"
- Max: 10 characters (hard limit; further keystrokes rejected)
- Allowed: alphanumeric + spaces only (no special characters except apostrophe and hyphen)
- **Profanity filter:** Yes. Use a curated profanity list (suggest `bad-words` npm package or similar). On submit, reject with inline error: "Please choose a different name."
- Duplicate names allowed (no restriction — even if matches their own name, it's fine because the 🤖 emoji prefix makes it clearly an agent)

**CRITICAL — Emoji indicator:**
- Display format throughout the entire app: **`🤖 {name}`** (emoji prefix, then name)
- Examples:
  - Chat button: `🤖 Sarah`
  - Chat header: `🤖 Sarah`
  - Review button on Assessment tile: `Review with 🤖 Sarah`
  - "Discuss with" CTAs: `Discuss with 🤖 Sarah`
- Store only the raw name in DB (no emoji); UI layer applies the emoji prefix
- Reserve layout space for ~15–20 character display width (10-char name + emoji + spacing)

**Live preview tile (below the input, optional but valuable):**
- Small pill-shaped preview showing: `🤖 [name as typed]`
- Updates as user types
- Default placeholder when empty: `🤖 Cypher`

**Submit:**
- POST `/api/v1/onboarding/consultant-name` with `{ consultantName }`
- Backend stores in `users.agent_name`
- On success → navigate to Step 2

### 1.6 Step 2 — Set Up Your Organisation

**Verify Agent 10 implementation. Refine if needed.**

**Card structure:**
```
ORGANISATIONAL IDENTITY           ──────

Set Up Your Organisation
(Raleway 800, 40px; can render second word in primary italic for emphasis)

Calibrate your security posture and resource allocation by 
defining your organisation's scope.
(Montserrat 400, 16px, secondary)

ORGANISATION LEGAL NAME
┌─────────────────────────────────────────────────────┐
│ [pre-populated from signup]                         │
└─────────────────────────────────────────────────────┘

INDUSTRY SECTOR               HEADQUARTERS COUNTRY
┌─────────────────────┐       ┌─────────────────────┐
│ [pre-populated ▾]   │       │ [pre-populated ▾]   │
└─────────────────────┘       └─────────────────────┘
(50/50 column layout, 24px gap)

[Industry "Other" custom input — see below]

WORKFORCE SCALE
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Small    │ │ Medium   │ │ Large    │ │ Enterprise│
│ 1–50     │ │ 51–250   │ │ 251–1000 │ │ 1000+     │
│ employees│ │ employees│ │ employees│ │ employees │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

──────────────────────────────────────────────────

[← BACK]                    [CONTINUE SETUP  →]
```

**Field-by-field decisions:**

**Organisation Legal Name:**
- Pre-populate from signup (whatever they entered there)
- Editable
- Required, 2–100 characters

**Industry Sector:**
- Closed dropdown with curated list (15 options, see below)
- Pre-populate from signup if provided
- Required
- **"Other" option at the bottom of the list** — when selected, a text input appears next to it: "Please specify your industry"
- Allowed character limit on custom industry: 50 characters

**Industry list (lock this constant):**
```ts
export const INDUSTRIES = [
  'Financial Services (Banking, Insurance, Superannuation)',
  'Healthcare',
  'Technology / Software',
  'SaaS / Professional Services',
  'Government / Public Sector',
  'Manufacturing',
  'Retail / E-commerce',
  'Education',
  'Construction',
  'Telecommunications',
  'Media / Entertainment',
  'Energy / Utilities',
  'Hospitality / Travel',
  'Real Estate',
  'Legal Services',
  'Other',
];
```

**Headquarters Country (multi-select autocomplete with chips):**
- Type-ahead filter on the country list
- Selected countries appear as **removable chips/tags** below the input
- Each chip has an `✕` icon to remove individually
- Input field stays active for adding more countries
- "Clear all" link appears only if 3+ countries selected
- Pre-populate from signup if any selected
- At least 1 country required
- No maximum limit — can select all 45 if global

**Country list (lock this constant — alphabetical):**
```ts
export const COUNTRIES = [
  'Australia', 'New Zealand', 'United Kingdom', 'Ireland',
  'United States', 'Canada',
  'Germany', 'France', 'Netherlands', 'Belgium', 'Luxembourg',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Italy', 'Spain', 'Portugal',
  'Poland', 'Czech Republic',
  'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan',
  'India', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Israel',
  'South Africa',
  'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia',
  'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam',
  'Turkey',
  'Other',
];
```

**Workforce Scale (4-tile single-select radio group):**
- Each tile shows: tier name + employee range (e.g., "Medium" + "51–250 employees")
- Pre-populate from signup
- Required (exactly one selected)
- Selected tile: primary border + surface-bright background + glow
- Hover: subtle lift to surface-bright
- Tile dimensions: ~160×140px, 16px gap between tiles

**Validation:**
- All four fields required (Org Name + Industry + at least 1 Country + Workforce)
- "Continue Setup" button disabled until all valid
- No inline errors during typing — just keep button disabled
- Server error on submit → banner at top of card (danger styling): "We couldn't save your organisation details. Please try again."

**Submit:**
- POST `/api/v1/onboarding/organisation` with `{ name, industry, customIndustry?, countries: string[], workforceScale }`
- On success → navigate to Step 3

**Back button:** Returns to Step 1; previous inputs persist via DB load

### 1.7 Step 3 — Choose Your Frameworks (MAJOR REWORK)

**This step changes significantly from the original Agent 10 design.** The framework selection is now plan-aware and supports 9 frameworks total.

#### Plan-Aware Framework Selection

**Plan determined at signup (passed through to onboarding):**

**Essential Plan (Free Trial Available):**
- Trial period applies
- Framework selection: **NOT available at signup**
- During onboarding Step 3: User sees only NIST CSF 2.0 (locked, ✓ pre-selected)
- All other frameworks visible but disabled (greyed out)
- Helper message: "Upgrade to Professional in Organisation Settings to add more frameworks"
- "Upgrade Now" CTA → links to Organisation Settings → Billing

**Professional Plan (Paid):**
- No trial
- Framework selection: optional at signup (can sign up without selecting; choose during onboarding)
- During onboarding Step 3:
  - NIST CSF 2.0 ✓ pre-selected, locked (cannot deselect)
  - 8 optional frameworks selectable
  - Maximum 3 additional selections (NIST + 3 = 4 total frameworks)
  - Once 3 additional selected → remaining tiles **disabled and greyed out**
  - Deselecting one tile → previously disabled tiles re-enable
  - Helper message at bottom: "Need more frameworks? You can purchase additional frameworks in Organisation Settings → Billing once logged in."

#### Layout — 3×3 Grid (Desktop Primary)

```
INITIALISATION                    ──────

Choose Your Frameworks
(Raleway 800, 40px)

Identify the regulatory standards 🤖 {agent-name} should 
prioritise for your initial assessment.
(Montserrat 400, 16px, secondary)

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [icon]       │ │ [icon]       │ │ [icon]       │
│              │ │              │ │              │
│ NIST CSF 2.0 │ │ ISO 27001:   │ │ PCI DSS 4.0  │
│ (Included) ✓ │ │ 2022         │ │              │
│              │ │              │ │              │
│ [official    │ │ [official    │ │ [official    │
│ description] │ │ description] │ │ description] │
│              │ │              │ │              │
│ [✓ LOCKED]   │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ APRA CPS 234 │ │ APRA CPS 230 │ │ ASD Essential│
│              │ │              │ │ Eight        │
│ [description]│ │ [description]│ │ [description]│
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ISO 42001    │ │ AUVA ISS     │ │ NIST AI RMF  │
│              │ │              │ │              │
│ [description]│ │ [description]│ │ [description]│
└──────────────┘ └──────────────┘ └──────────────┘

ⓘ  Need more frameworks? You can purchase additional 
   frameworks in Organisation Settings → Billing once logged in.

                             [CONFIRM SELECTION  →]
```

**Tile dimensions (slightly smaller to fit 3×3):**
- Width: ~280px each
- Height: ~220px each
- 16px gap between tiles
- Padding inside tile: 20px

**Tile states:**

**Selected (✓):**
- Background: subtle primary wash, e.g., `rgba(235,94,40,0.08)` (light primary tint)
- Border: 2px solid primary
- Glow: `0 0 12px rgba(235,94,40,0.15)`
- Checkmark `✓` in primary circle, top-right corner of tile
- Cursor: pointer (or default if locked)

**Unselected:**
- Background: `surface-container-high`
- Border: ghost (`1px solid rgba(168,138,128,0.15)`)
- No glow
- No checkmark
- Cursor: pointer

**Locked (NIST — cannot deselect):**
- Same styling as Selected
- Plus a small badge "Included" in top-right area
- Cursor: default (clicks have no effect)

**Disabled (Essential plan, or Professional after 3 additional selected):**
- Background: `surface-container-low` with reduced opacity (~0.5)
- Greyed-out content
- Cursor: not-allowed
- For Essential users: small "Upgrade to access" pill replaces selectable state

**Coming Soon:** None of these 9 frameworks are "Coming Soon" — they're all available. **No "Coming Soon" labels on this step.**

#### Framework Tile Content

For each tile, display:
1. **Custom-styled icon** (top-left or centred top, ~40×40px) — see Section 5 for icon spec
2. **Framework name** (Raleway 700, 18px)
3. **Region/scope badge** (Geist Mono, uppercase, 10px, e.g., "GLOBAL", "AUSTRALIA", "ESSENTIALS")
4. **Official description** (Montserrat 400, 13px, line-height 1.5, secondary colour, max 4 lines)
5. **Selection indicator** (✓ in primary circle, top-right) — only when selected

#### Framework Descriptions (use these — official sources)

```ts
export const FRAMEWORK_TILE_DATA = [
  {
    id: 'nist_csf_2_0',
    name: 'NIST CSF 2.0',
    badge: 'ESSENTIALS',
    description: 'A flexible, voluntary framework helping organisations of all sizes manage and reduce cybersecurity risk through six core functions: Govern, Identify, Protect, Detect, Respond, and Recover.',
    locked: true,
    plan: 'essential',
  },
  {
    id: 'iso_27001_2022',
    name: 'ISO 27001:2022',
    badge: 'GLOBAL',
    description: 'The international standard for information security management systems (ISMS), specifying requirements for establishing, implementing, maintaining and continually improving information security.',
    plan: 'professional',
  },
  {
    id: 'pci_dss_4_0',
    name: 'PCI DSS 4.0',
    badge: 'PAYMENTS',
    description: 'The Payment Card Industry Data Security Standard, designed to ensure that organisations storing, processing, or transmitting cardholder data maintain a secure environment.',
    plan: 'professional',
  },
  {
    id: 'apra_cps_234',
    name: 'APRA CPS 234',
    badge: 'AUSTRALIA',
    description: 'Australian Prudential Regulation Authority Information Security standard for APRA-regulated entities, ensuring resilience against information security incidents.',
    plan: 'professional',
  },
  {
    id: 'apra_cps_230',
    name: 'APRA CPS 230',
    badge: 'AUSTRALIA',
    description: 'Operational Risk Management standard requiring APRA-regulated entities to maintain effective operational risk management frameworks, including business continuity and service provider management.',
    plan: 'professional',
  },
  {
    id: 'asd_essential_eight',
    name: 'ASD Essential Eight',
    badge: 'AUSTRALIA',
    description: 'The Australian Signals Directorate\'s prioritised mitigation strategies to help organisations protect themselves against various cyber threats, with maturity levels from 0 to 3.',
    plan: 'professional',
  },
  {
    id: 'iso_42001',
    name: 'ISO 42001',
    badge: 'AI GOVERNANCE',
    description: 'The international standard for AI management systems, providing a framework for responsible development and use of artificial intelligence within organisations.',
    plan: 'professional',
  },
  {
    id: 'auva_iss',
    name: 'AUVA ISS',
    badge: 'AI SAFETY',
    description: 'The Australian Voluntary AI Safety Standard, providing guidance for organisations developing or deploying AI systems responsibly within the Australian context.',
    plan: 'professional',
  },
  {
    id: 'nist_ai_rmf',
    name: 'NIST AI RMF',
    badge: 'AI GOVERNANCE',
    description: 'The NIST AI Risk Management Framework, helping organisations manage risks associated with AI systems through governance, mapping, measurement, and management.',
    plan: 'professional',
  },
];
```

**Note:** If exact wording from official sources differs, replace with the actual official descriptions before finalising. Keep descriptions concise (≤4 lines per tile).

#### Selection Logic

```typescript
// Pseudocode for selection state management
const MAX_PROFESSIONAL_ADDITIONAL = 3;
const NIST_ID = 'nist_csf_2_0';

function canSelectFramework(frameworkId: string, currentSelection: string[], plan: 'essential' | 'professional') {
  if (frameworkId === NIST_ID) return false; // locked
  if (plan === 'essential') return false; // disabled
  if (currentSelection.includes(frameworkId)) return true; // can deselect
  
  const additionalCount = currentSelection.filter(id => id !== NIST_ID).length;
  return additionalCount < MAX_PROFESSIONAL_ADDITIONAL;
}
```

#### Submit

- POST `/api/v1/onboarding/frameworks` with `{ selected: ['nist_csf_2_0', 'iso_27001_2022', ...] }`
- Backend writes to `organizations.selected_frameworks` (JSONB array)
- On success → navigate to Step 4

### 1.8 Step 4 — Your Workspace Is Ready (NIST-only Orientation)

**Verify Agent 10 implementation. Major refinement: scope reduction to NIST-only orientation.**

**Vik's locked decision:** Step 4 displays only what every user gets — basics around NIST CSF 2.0. No mention of other frameworks or upgrade prompts.

**Card contents:**
```
ORIENTATION                       ──────

Your Workspace Is Ready
(Raleway 800, 40px)

You'll be assessed against NIST CSF 2.0 — the most widely adopted 
cybersecurity framework. Here's how to navigate your portal.
(Montserrat 400, 16px, secondary, max-width 640px, centred)

┌─────────────────┐ ┌─────────────────┐
│ [LayoutGrid]    │ │ [ClipboardCheck]│
│                 │ │                 │
│ Dashboards      │ │ Assessment      │
│                 │ │                 │
│ View your real- │ │ Collaborate with│
│ time maturity   │ │ 🤖 {agent-name} │
│ across Industry │ │ to complete     │
│ and Risk views. │ │ deep-dive       │
│                 │ │ security        │
│                 │ │ assessments.    │
└─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐
│ [Route]         │ │ [TrendingUp]    │
│                 │ │                 │
│ Maturity        │ │ Progress &      │
│ Roadmap         │ │ Milestones      │
│                 │ │                 │
│ Track ongoing   │ │ Review historic │
│ obligations and │ │ maturity trends │
│ uplift actions. │ │ and celebrate   │
│                 │ │ wins.           │
└─────────────────┘ └─────────────────┘

          [LAUNCH APPLICATION  →]

🔒  SECURE SESSION ESTABLISHED  ·  AUTH: 256-BIT
```

**Specs:**
- 4 informational tiles in 2×2 grid (NOT navigational — clicking does nothing; only "Launch Application" proceeds)
- Each tile: icon + title + 1–2 line description
- 24px gap between tiles
- Hover: subtle glow (informational hint)
- No reference to other frameworks (ISO, APRA, etc.)
- No "Tech Stack Discovery" CTA on this step (Vik's clarification: it goes on the Initialisation Screen, not Step 4 — to avoid duplication)

**Launch Application:**
- POST `/api/v1/onboarding/complete` → backend sets `organizations.onboarding_completed_at`
- On success → navigate to `/dashboard/initialisation` (Initialisation Screen modal/page)

---

## SECTION 2 — INITIALISATION SCREEN (PRIMARY FOCUS)

**Route:** `/dashboard/initialisation`

**Trigger:** Immediately after completing onboarding Step 4. **Appears exactly once** for first-time admin only.

**Persistence:** On any CTA click (or skip), set `users.has_seen_initialisation = true` via `PATCH /api/v1/users/me`. Subsequent visits redirect to `/dashboard/industry`.

**Layout:** Uses canonical DashboardLayout (sidebar visible but greyed/disabled, header active, footer present). Content panel shows the Initialisation experience.

### 2.1 Modal vs Full-Page

**Vik's decision:** Initialisation Screen is a **modal overlay** on top of the Industry Dashboard. The Industry Dashboard renders behind it (with empty state since no assessment has been done yet); the modal sits in the centre.

This means:
- Background: Industry Dashboard at empty state, dimmed with `rgba(0,0,0,0.5)` overlay
- Foreground: Initialisation modal (centred, ~720px wide on desktop)
- Modal is **dismissable only via skip or by clicking a CTA** — no X button or Esc-to-close (this is a guided flow, not optional dismiss)

### 2.2 Modal Contents

```
                    [hexagonal icon - orange accent]
                    
                    INITIALISATION COMPLETE
                    (Geist Mono, uppercase, primary, 12px)
                    
                    Where would you like to start?
                    (Raleway 800, 48px)

                    
        ┌─────────────────────────────────────────────────────────┐
        │ STEP 1                                                  │
        │ ┌───┐                                                   │
        │ │🔧 │  Run Tech Stack Discovery                          │
        │ └───┘                                                   │
        │                                                         │
        │ Configure your infrastructure so your assessments are   │
        │ tailored to your environment. This helps 🤖 {agent}     │
        │ understand your cloud, backups, datasets, and security  │
        │ posture.                                                │
        │                                                         │
        │ Recommended first step.                                 │
        │                          [START DISCOVERY  →]           │
        └─────────────────────────────────────────────────────────┘

                            ── or ──

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     01 /    │    │     02 /    │    │     03 /    │
│   DASHBOARD │    │   CONSULT   │    │ TEAM        │
│ [grid icon] │    │ [shield]    │    │ [users]     │
│             │    │             │    │             │
│ Begin       │    │ Map         │    │ Invite      │
│ Assessment  │    │ Industry    │    │ Team        │
│             │    │ Risks       │    │ Members     │
│             │    │             │    │             │
│ Start a deep│    │ Review and  │    │ Add         │
│ dive        │    │ prioritise  │    │ collaborators│
│ consultation│    │ common      │    │ to your     │
│ with 🤖     │    │ threats from│    │ assessment  │
│ {agent}.    │    │ our library │    │ workspace.  │
│          →  │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘

                    [Skip for now →]
                    (text link, secondary colour)
```

### 2.3 Tech Stack Discovery — Primary CTA (Hero)

**Visual treatment (per Vik's locked decision):**
- **Slightly larger than the three secondary tiles**
- **Has a custom icon** (e.g., a wrench, gear, or stack icon) — burnt orange tone
- **"STEP 1" badge** in top-left corner (Geist Mono, primary colour, uppercase, 10px) to signal "start here"
- Background: subtle primary tint (`rgba(235,94,40,0.08)`)
- Border: 2px solid primary
- Glow: `0 0 16px rgba(235,94,40,0.20)` (slightly stronger than other tiles)
- Layout: horizontal — icon-left, content-centre, button-right
- Width: spans full width of modal (~640px content area)
- Height: ~180px

**CTA Button:** "Start Discovery →" (primary button, prominent)

**Click behaviour:**
- Read Agent 15 handoff to determine how to launch the Tech Stack Discovery flow
- Likely options:
  - Navigate to `/dashboard/tech-stack-discovery` (if Agent 15 created a route)
  - Open Cypher chat modal with discovery flow pre-loaded (if Agent 15 integrated with Cypher)
  - Trigger a state event/global modal (if Agent 15 used a different pattern)
- **Inspect Agent 15 codebase before wiring this CTA**

**Discovery flow (run by Agent 15):**
- User interacts with Cypher conversationally
- Cypher asks about: cloud providers, backup strategy, dataset locations, infrastructure security, etc.
- On completion: Cypher says "Thanks for completing it. All done." + Close button
- Click Close → redirects to `/dashboard/industry` (NOT back to Initialisation Screen)

### 2.4 Three Secondary CTAs (Below Hero)

Three equal-size tiles in a single row (stack to 1-column on mobile):

**Tile 1 — Begin Assessment**
- Sequence label: `01 / DASHBOARD`
- Icon: ClipboardCheck (Lucide) or shield
- Title: "Begin Assessment"
- Description: "Start a deep dive consultation with 🤖 {agent}."
- Click → navigate to `/assessment`

**Tile 2 — Map Industry Risks**
- Sequence label: `02 / CONSULT`
- Icon: Map or AlertTriangle
- Title: "Map Industry Risks"
- Description: "Review and prioritise common threats from our library."
- Click → navigate to `/dashboard/risk` (Stage 1: Risk Selection flow)

**Tile 3 — Invite Team Members**
- Sequence label: `03 / TEAM`
- Icon: Users (Lucide)
- Title: "Invite Team Members"
- Description: "Add collaborators to your assessment workspace."
- Click → navigate to `/organisation/users` (admin-only, opens Invite User modal automatically)

**On any tile click:**
- PATCH `/api/v1/users/me { hasSeenInitialisation: true }`
- Then navigate to the destination

### 2.5 Skip For Now

Below the three secondary tiles, a small text link: **"Skip for now →"**

**Click behaviour:**
- PATCH `/api/v1/users/me { hasSeenInitialisation: true, techStackDiscoveryStatus: 'skipped' }`
- Redirect to Assessment screen (`/assessment`) per Vik's lock: "Post-onboarding redirect → Assessment Screen"
- Persistent banner appears on every page reminding admin to complete Tech Stack Discovery

### 2.6 Skip Banner (Cross-app)

If user skips Tech Stack Discovery from Initialisation Screen, a banner appears on every page:

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠️  Complete Tech Stack Discovery to enable Infrastructure-aware  │
│     assessments and the Threat Dashboard.                         │
│                                                                  │
│   [Run Discovery] [Dismiss]                                       │
└──────────────────────────────────────────────────────────────────┘
```

**Specs:**
- Position: Sticky top of content panel (below canonical Header, above the page title)
- Background: warning amber (`#F59E0B` muted)
- Icon: ⚠️
- Two CTAs: "Run Discovery" (primary button) → triggers Tech Stack Discovery flow | "Dismiss" (text link) → hides for current session only, reappears next login

**Hidden when:**
- `users.has_seen_initialisation === true` AND `users.tech_stack_discovery_status === 'completed'`

**Visible when:**
- User is admin AND `users.tech_stack_discovery_status === 'skipped'` OR `null`

**Note for non-admin users:** They cannot run Tech Stack Discovery directly. If a non-admin sees the banner, the "Run Discovery" CTA is disabled and shows tooltip: "Tech Stack Discovery can only be run by your organisation admin."

### 2.7 Empty Industry Dashboard Behind Modal

While the Initialisation Screen modal is open, the Industry Dashboard renders behind it in its empty state:
- Radar chart shows industry-average polygon only (no user polygon yet)
- Metrics show "—"
- Strengths/Priority tiles show placeholders
- Cypher button visible bottom-right (but inactive while modal is open)

This gives the user a glimpse of what their workspace will look like once they engage.

---

## SECTION 3 — ORGANISATION SETTINGS: TECH STACK PAGE

**Route:** `/organisation/tech-stack`

**Position in left sidebar (Organisation Settings sub-menu):**
1. Users
2. Preferences
3. **Tech Stack** ← NEW (insert here)
4. Billing
5. Audit

### 3.1 Source of Truth

**Vik's instruction:** The detailed UI for the Tech Stack page is defined by Agent 15. Read Agent 15's MD spec and handoff to understand:
- What components Agent 15 built for displaying tech stack data
- What the data structure looks like (cloud providers, backup details, dataset locations, etc.)
- What discovery results display patterns Agent 15 used

**Your job for Agent 11:**
- Add the route `/organisation/tech-stack` to the Next.js app router
- Add "Tech Stack" sub-item to the Organisation Settings sub-menu in `LeftSidebar.tsx` (admin-only, position 3 of 5)
- Create the page wrapper using DashboardLayout
- Embed Agent 15's components for displaying + re-running discovery
- Match the Earthen Brutalism design language exactly (same typography, colour, elevation as all other settings pages)

### 3.2 Page Structure (Wrapper Only — Inner Components from Agent 15)

```
Tech Stack & Infrastructure
(Raleway 800, 32px)

Configure and review your organisation's infrastructure to tailor 
security assessments to your environment.
(Montserrat, secondary)

[Agent 15's content embedded here:
 - Discovery results summary
 - Re-run Discovery button
 - Edit individual fields
 - History of discovery runs
 - etc.]
```

**If Agent 15 hasn't built a "summary view" component:** Build a simple wrapper that lists the captured data in card form (categories: Cloud Provider, Backup Strategy, Dataset Locations, Infrastructure Security) with an "Edit" or "Re-run Discovery" button at the top.

---

## SECTION 4 — PUBLIC FRAMEWORK PAGE (PRE-LOGIN)

**Route:** `/frameworks` (or wherever Agent 7 placed the existing public Framework page)

**Action:** Update the existing page to display all 9 frameworks in a 3×3 grid with custom-styled icons + official descriptions.

### 4.1 Page Hero

Keep existing hero treatment from Agent 7 (Earthen Brutalism style). If absent, add:

```
FRAMEWORKS                    ──────

Standards we support
(Raleway 800, 56px on desktop)

A comprehensive library of security and AI governance frameworks. 
Choose what aligns with your industry, geography, and obligations.
(Montserrat 400, 18px, secondary, max-width 720px)
```

### 4.2 Framework Grid

```
[3×3 grid on desktop]
[2 columns × 5 rows on tablet — last row has 1 tile centred]
[1 column on mobile]
```

**Each framework tile:**
- Icon (custom-styled, dark-mode + light-mode variants — see Section 5)
- Framework name (Raleway 700, 22px)
- Region/scope badge (Geist Mono, uppercase, 11px)
- Official description (Montserrat 400, 14px, line-height 1.6, secondary colour)
- "Learn More" or info icon (optional)

**Tile dimensions:**
- Desktop: ~280×280px each, 24px gap
- Tablet: ~320×260px each, 20px gap
- Mobile: full-width, 16px gap, vertical stack

**No purchase action on this page — it's pure information.** All 9 tiles are visually equivalent (no "premium vs free" distinction here — that lives on the Pricing page).

### 4.3 Frameworks (use the same FRAMEWORK_TILE_DATA constant from Section 1.7)

All 9 frameworks displayed in this order:
1. NIST CSF 2.0
2. ISO 27001:2022
3. PCI DSS 4.0
4. APRA CPS 234
5. APRA CPS 230
6. ASD Essential Eight
7. ISO 42001
8. AUVA ISS
9. NIST AI RMF

### 4.4 Below the Grid

**Call to action section:**
```
Ready to begin?

Start your 14-day free trial. No credit card required.

[GET STARTED →]   [VIEW PRICING]
```

Buttons link to `/signup` and `/pricing` respectively.

### 4.5 Responsive Considerations

**Desktop (≥1280px):** 3×3 grid
**Tablet (768–1279px):** 2 columns × 5 rows (last row has 1 tile centred, OR 4 rows with the 9th tile spanning two columns — pick whichever reads cleaner)
**Mobile (<768px):** 1 column, vertical stack, full-width tiles

---

## SECTION 5 — CUSTOM-STYLED FRAMEWORK ICONS

**Vik's decision:** Research official framework icons → recreate in our design system colour palette → ship dark-mode + light-mode variants.

### 5.1 Icon Sourcing Process

For each framework, find the official source icon (typically on the framework's website or organisation):
- **NIST CSF 2.0** — NIST Cybersecurity Framework logo (NIST.gov)
- **ISO 27001:2022** — ISO logo with "27001" reference
- **PCI DSS 4.0** — PCI Security Standards Council logo
- **APRA CPS 234 / 230** — Australian Prudential Regulation Authority emblem
- **ASD Essential Eight** — Australian Signals Directorate logo
- **ISO 42001** — ISO logo with "42001" reference
- **AUVA ISS** — Australian Voluntary AI Safety Standard official mark
- **NIST AI RMF** — NIST AI RMF logo

### 5.2 Recreation Specs (Custom-Styled)

**Do NOT directly copy the official icons.** Recreate them as SVG with:

**Dark Mode variants:**
- Primary stroke/fill: burnt orange (`#EB5E28` or `#FFB59C`)
- Background fill (if the icon has a fill area): `surface-container-high` (`#2B2A28`) with subtle warm wash
- Accents: warm stone (`#CCC5B9`) or `on-surface` (`#E6E2DE`)
- Stroke width: 1.5–2px (matches other Lucide icons in the app)

**Light Mode variants:**
- Primary stroke/fill: deeper orange (`#EB5E28` works for both modes)
- Background fill: `surface-container-high` light (`#F0EDE2`) with warm tint
- Accents: secondary text colour (`#4F4B42`)
- Stroke width: 1.5–2px

**Icon dimensions:**
- 48×48 px viewport
- 40×40 visible (8px internal padding for breathing room)
- Aspect ratio: square

**Style guidelines:**
- Geometric, not photorealistic
- Consistent stroke weight across all 9 icons
- Recognisable silhouette (someone familiar with the framework should instantly recognise it)
- Earthen Brutalism aesthetic — clean lines, no gradients, no skeuomorphism
- All 9 icons should feel like a coherent set (same designer's hand)

### 5.3 File Locations

Place icons in:
```
public/icons/frameworks/
  nist-csf-2-0-dark.svg
  nist-csf-2-0-light.svg
  iso-27001-2022-dark.svg
  iso-27001-2022-light.svg
  pci-dss-4-0-dark.svg
  pci-dss-4-0-light.svg
  apra-cps-234-dark.svg
  apra-cps-234-light.svg
  apra-cps-230-dark.svg
  apra-cps-230-light.svg
  asd-essential-eight-dark.svg
  asd-essential-eight-light.svg
  iso-42001-dark.svg
  iso-42001-light.svg
  auva-iss-dark.svg
  auva-iss-light.svg
  nist-ai-rmf-dark.svg
  nist-ai-rmf-light.svg
```

### 5.4 Component Integration

Create a `FrameworkIcon` component:

```typescript
// components/ui/FrameworkIcon.tsx
import { useTheme } from '@/lib/hooks/useTheme';

interface FrameworkIconProps {
  framework: string; // e.g., 'nist_csf_2_0'
  size?: number;
  className?: string;
}

export function FrameworkIcon({ framework, size = 48, className }: FrameworkIconProps) {
  const { theme } = useTheme();
  const variant = theme === 'light' ? 'light' : 'dark';
  const iconPath = `/icons/frameworks/${framework.replace(/_/g, '-')}-${variant}.svg`;
  
  return (
    <img
      src={iconPath}
      alt={`${framework} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
}
```

### 5.5 Icon Generation Approach (Pragmatic)

If creating 18 hand-crafted SVGs from scratch is unrealistic in this build cycle:

**Acceptable interim approach:**
- Use Lucide icon equivalents that approximate each framework's identity:
  - NIST CSF 2.0 → `Shield`
  - ISO 27001 → `ShieldCheck` or `Lock`
  - PCI DSS → `CreditCard`
  - APRA CPS 234 → `Banknote` or `Building2`
  - APRA CPS 230 → `AlertOctagon`
  - ASD Essential Eight → `ShieldAlert`
  - ISO 42001 → `Cpu` or `BrainCircuit`
  - AUVA ISS → `Sparkles` or `BadgeCheck`
  - NIST AI RMF → `Network` or `GitBranch`
- Apply the colour scheme via CSS (stroke + colour vars)
- **Mark this as a known interim** in the handoff so Claude Code can replace with custom SVGs in the polish pass

**Preferred approach (if time allows):**
- Generate 18 custom SVGs (9 frameworks × 2 themes)
- Use a tool like Iconify, Figma export, or hand-author SVG paths
- Match official framework branding while staying within Earthen Brutalism palette

---

## SECTION 6 — PUBLIC PRICING PAGE (PRE-LOGIN)

**Route:** `/pricing` (or wherever Agent 7 placed the existing public Pricing page)

**Action:** Update the existing page with new pricing tiers + framework add-on display.

### 6.1 Page Hero

```
PRICING                       ──────

Plans for every stage
(Raleway 800, 56px)

Start with NIST CSF 2.0 on Essential. Scale up to Professional 
when you need more frameworks or advanced features.
(Montserrat 400, 18px, secondary, max-width 720px)
```

### 6.2 Pricing Tiers (Two Cards Side-by-Side)

```
┌────────────────────────────────┐    ┌────────────────────────────────┐
│ ESSENTIAL                       │    │ PROFESSIONAL                   │
│                                 │    │                                │
│ For organisations starting      │    │ For organisations needing      │
│ their security maturity         │    │ comprehensive coverage         │
│ journey.                        │    │ across multiple frameworks.    │
│                                 │    │                                │
│ {Existing Essential price}      │    │ {Existing Professional price}  │
│ /month                          │    │ /month                         │
│                                 │    │                                │
│ ✓ NIST CSF 2.0                  │    │ ✓ NIST CSF 2.0                 │
│ ✓ Cypher AI Consultant          │    │ ✓ Choice of 3 additional       │
│ ✓ Industry benchmarking         │    │   frameworks                   │
│ ✓ Maturity Roadmap              │    │ ✓ Cypher AI Consultant         │
│ ✓ Progress & Milestones         │    │ ✓ Industry benchmarking        │
│                                 │    │ ✓ Maturity Roadmap             │
│                                 │    │ ✓ Progress & Milestones        │
│                                 │    │ ✓ Multi-user collaboration     │
│                                 │    │ ✓ Priority support             │
│                                 │    │                                │
│ 14-day free trial               │    │ Paid only — no trial           │
│                                 │    │                                │
│ [START FREE TRIAL →]            │    │ [GET STARTED →]                │
└────────────────────────────────┘    └────────────────────────────────┘
```

**Tier card specs:**
- Background: `surface-container-high`
- Border: ghost (or 2px primary border on Professional for emphasis)
- Padding: 32px
- Equal width on desktop (50/50)
- Stack vertically on mobile

**Vik's locked changes:**
- **Essential plan:** ONLY NIST CSF 2.0. Remove any reference to ISO 27001 in the Essential bullet points (previous copy may have said "ISO + NIST" — update to "NIST CSF 2.0" only).
- **Professional plan:** "NIST CSF 2.0 + choice of 3 additional frameworks". Pricing remains unchanged from current Professional tier.

**Pricing values:** Use existing Essential and Professional prices from the current Pricing page. Don't change the dollar amounts — only update the bullet content and framework references.

### 6.3 Framework Add-ons Section (Below Pricing Cards)

**Vik's locked decision:** This section is **purely informational** — no purchase buttons, no checkboxes, no interaction beyond a hover tooltip.

```
ADDITIONAL FRAMEWORKS              ──────

Customise your Professional plan
(Raleway 800, 32px)

Add any of the following frameworks to your Professional plan for 
$249 per month each. Choose the standards that align with your 
industry and obligations.
(Montserrat 400, 16px, secondary, max-width 720px)

[3×3 grid of all 9 frameworks — same FrameworkTile component as Section 4]

ⓘ  Already on Professional? You can add more frameworks once 
   logged in via Organisation Settings → Billing.
```

**Layout:**
- 3×3 grid on desktop (same as Frameworks page)
- 2-column stack on tablet
- 1 column on mobile

**Tile content (same as Frameworks page):** icon + name + badge + description. **No "Add to Plan" buttons. No checkboxes. No selection state.**

**Tile styling:**
- All tiles styled identically (no visual indication that NIST is "included" here — this is the add-ons context)
- Hover: subtle lift + glow (pure visual feedback, no interaction)

### 6.4 Bottom of Page (FAQ or CTA)

If existing page has FAQ or final CTA section, leave intact. Otherwise add:

```
Questions about pricing?

[CONTACT US →]

Or start your free trial of Essential and explore 
the platform.

[START FREE TRIAL →]
```

---

## SECTION 7 — SIGNUP FLOW UPDATES (PLAN-AWARE)

**Route:** `/signup` (existing from Agent 7)

**Vik's clarification:**
- Essential plan = trial available, framework selection NOT shown at signup
- Professional plan = paid only (no trial), framework selection optional at signup

### 7.1 Plan Selection at Signup

**On the existing signup form, add a plan selector** (if not already present):

```
SELECT YOUR PLAN

┌────────────────────┐    ┌────────────────────┐
│ Essential          │    │ Professional       │
│                    │    │                    │
│ NIST CSF 2.0       │    │ NIST + choose 3    │
│                    │    │                    │
│ 14-day free trial  │    │ {price}/month      │
│                    │    │                    │
│ ○ SELECTED         │    │ ○ SELECT           │
└────────────────────┘    └────────────────────┘
```

**Behaviour:**
- Default selection: Essential (free trial)
- If user selects Professional: payment fields appear (use existing Stripe integration from Agent 5)
- After form submission: signup completes; user proceeds to email verification

### 7.2 Optional Framework Pre-Selection (Professional Only)

**If user selects Professional during signup**, optionally show a framework pre-selection step:

```
[Heading]
Which frameworks would you like? (Optional — you can choose later)

[3×3 grid of framework tiles, same as onboarding Step 3]

[SKIP — I'll choose during onboarding]   [SAVE SELECTIONS →]
```

**Behaviour:**
- Optional — user can skip and choose during onboarding instead
- If they choose here: selections persist and pre-populate Step 3
- If they skip: Step 3 is empty (only NIST locked)

**Note:** This is a "nice-to-have." If implementing increases scope significantly, defer to onboarding Step 3 only and skip this signup-time selection.

---

## SECTION 8 — COMPONENT INVENTORY

### 8.1 New Components

```
components/onboarding/
  OnboardingBanner.tsx         — Persistent banner reminding user to complete setup
  FrameworkTile.tsx            — Selectable framework tile (used in Step 3 + public pages)
  FrameworkGrid.tsx            — 3x3 responsive grid wrapper
  WorkforceScaleDial.tsx       — Single workforce scale tile (radio-group member)
  IndustrySelector.tsx         — Closed dropdown with "Other" custom input
  CountryAutocomplete.tsx      — Multi-select autocomplete with chips
  AgentNamePreview.tsx         — Live preview of "🤖 {name}" pill

components/dashboard/
  InitialisationModal.tsx      — Centred modal overlay on Industry Dashboard
  TechStackDiscoveryHeroCTA.tsx — Primary CTA card for Tech Stack Discovery
  InitialisationSecondaryCTA.tsx — One of three secondary CTAs

components/banners/
  TechStackDiscoveryBanner.tsx — Persistent banner if user skipped discovery

components/ui/
  FrameworkIcon.tsx            — Theme-aware framework icon component
  PlanSelector.tsx             — Two-card plan selector for signup
```

### 8.2 Updated Components

```
components/onboarding/
  Step1ConsultantName.tsx      — Add profanity filter, live preview, emoji prefix
  Step2Organisation.tsx        — Pre-populate from signup, add "Other" industry, chips for countries
  Step3Frameworks.tsx          — Plan-aware (essential/professional), 3x3 with 9 tiles, max-3 logic
  Step4WorkspaceReady.tsx      — Reduce to NIST-only orientation, remove Tech Stack CTA
  OnboardingFlow.tsx           — Verify resume behaviour

components/layout/
  LeftSidebar.tsx              — Add "Tech Stack" sub-item to Organisation Settings (admin-only)

components/dashboard/
  InitialisationScreen.tsx     — Major refactor: 4 CTAs (1 primary + 3 secondary + skip)

components/marketing/ (or wherever pre-login pages live)
  FrameworksPage.tsx           — Update to 3x3 grid with all 9 frameworks
  PricingPage.tsx              — Update tiers (Essential = NIST only, Professional = NIST + 3) + add-ons section

components/auth/
  SignupForm.tsx               — Add plan selector + optional framework pre-selection (Professional only)
```

### 8.3 Routes Added

```
/organisation/tech-stack       — New page wrapping Agent 15's components
```

### 8.4 Routes Updated (No Code Changes, Just Verification)

```
/onboarding/step-1
/onboarding/step-2
/onboarding/step-3
/onboarding/step-4
/dashboard/initialisation
/frameworks
/pricing
/signup
```

---

## SECTION 9 — DATA & API CONTRACT (Stubs — Wire in Agent 12)

For Agent 11, mock all data via the existing `lib/mock-data.ts` and `lib/api/hooks/usePostLogin.ts` patterns established by Agent 10. Agent 12 will replace mocks with real endpoints.

### 9.1 Hooks to Create or Extend

```typescript
// New hooks
useFrameworkLibrary()              // returns all 9 frameworks for public + onboarding
useOnboardingState()               // tracks current step, completion status
useUserPlan()                      // returns 'essential' | 'professional'
useTechStackDiscoveryStatus()      // 'not_started' | 'skipped' | 'in_progress' | 'completed'

// Existing hooks to extend
useCurrentUser()                   // ensure includes plan + tech stack discovery status
useOrganisationSettings()          // ensure includes selected_frameworks array
```

### 9.2 Endpoints (Stubbed — Agent 12 Wires)

```
GET    /api/v1/onboarding/state
POST   /api/v1/onboarding/consultant-name
POST   /api/v1/onboarding/organisation
POST   /api/v1/onboarding/frameworks
POST   /api/v1/onboarding/complete

GET    /api/v1/users/me
PATCH  /api/v1/users/me                              { hasSeenInitialisation, techStackDiscoveryStatus }

GET    /api/v1/tech-stack/state                      (Agent 15 likely defines this)
POST   /api/v1/tech-stack/start-discovery            (Agent 15 likely defines this)

GET    /api/v1/frameworks/library                    (returns all 9 framework metadata for tiles)
GET    /api/v1/billing/available-frameworks          (lists frameworks user can purchase)
```

### 9.3 Mock Data Additions

Extend `lib/mock-data.ts` with:

```typescript
export const MOCK_FRAMEWORK_LIBRARY = FRAMEWORK_TILE_DATA; // from Section 1.7

export const MOCK_USER_PLAN: 'essential' | 'professional' = 'professional';

export const MOCK_TECH_STACK_DISCOVERY_STATUS = 'not_started';

export const MOCK_ONBOARDING_STATE = {
  currentStep: 1,
  completed: false,
  consultantName: null,
  organisationDetails: null,
  selectedFrameworks: [],
  hasSeenInitialisation: false,
  techStackDiscoveryStatus: 'not_started',
};
```

---

## SECTION 10 — ACCESSIBILITY (Reaffirmed from Agent 10)

**Every component must:**
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Shift+Tab, Enter, Esc, Arrow keys in menus)
- `prefers-reduced-motion` respected — disable transforms, fade only
- WCAG AA contrast in BOTH dark and light modes
- Screen reader friendly (`aria-live` for dynamic state)
- Focus-visible outlines (2px solid primary)

**Forms:**
- All inputs have associated labels
- Required fields: `aria-required="true"`
- Errors announced via `aria-live="polite"`

---

## SECTION 11 — RESPONSIVE BEHAVIOUR

### 11.1 Onboarding (Desktop Primary)

- **Desktop (≥1280px):** Full layout per spec
- **Tablet (768–1279px):** Card max-width adjusts (640px); 3×3 framework grid → 2 columns × 5 rows
- **Mobile (<768px):** Single column for all forms; 3×3 grid → 1 column stack; workforce dials stack vertically

### 11.2 Initialisation Screen

- **Desktop:** Modal width 720px; primary CTA full-width; 3 secondary CTAs in single row
- **Tablet:** Modal width 640px; secondary CTAs in single row
- **Mobile:** Modal becomes full-screen sheet; secondary CTAs stack vertically

### 11.3 Public Pages (Frameworks + Pricing)

- **Desktop:** 3×3 framework grid; pricing tiers side-by-side
- **Tablet:** 2 columns × 5 rows for frameworks (last row has 1 tile centred); pricing tiers stack vertically
- **Mobile:** 1 column for everything

### 11.4 Vik's Priority

**Desktop is primary.** Tablet and mobile get baseline responsive behaviour but are secondary. Don't let mobile dictate desktop.

---

## SECTION 12 — AUSTRALIAN ENGLISH AUDIT

Apply throughout all new and updated copy:

```
organize → organise
organization → organisation
authorize → authorise
recognize → recognise
prioritize → prioritise
optimize → optimise
realize → realise
customize → customise
analyze → analyse
initialize → initialise
color → colour
center → centre
favor → favour
honor → honour
labor → labour
license (noun) → licence
defense → defence
program (schedule) → programme
```

**Date format:** DD/MM/YYYY everywhere (e.g., `15/03/2026`, never `3/15/2026` or `March 15, 2026`).

**Time format:** 12-hour with AM/PM (e.g., `2:30 PM`).

**Currency:** `$` is AUD by default; explicitly prefix `USD $` for non-AU currencies.

---

## SECTION 13 — BUILD ORDER (Recommended)

Build in this order for cleanest results:

1. **Read all reference files** (Master Decisions, Agent 10 outputs, Agent 15 outputs)
2. **Audit existing onboarding components** — list what exists, what needs refinement
3. **Create framework data constants** (`FRAMEWORK_TILE_DATA`, `INDUSTRIES`, `COUNTRIES`)
4. **Build/refine `FrameworkTile.tsx` and `FrameworkGrid.tsx`** (used in 3 places: onboarding Step 3, public Frameworks page, public Pricing page)
5. **Build `FrameworkIcon.tsx`** (with interim Lucide fallback if custom SVGs deferred)
6. **Refine onboarding Step 1** (profanity filter, emoji prefix, live preview)
7. **Refine onboarding Step 2** (pre-population, "Other" industry, country chips)
8. **Major refactor onboarding Step 3** (plan-aware, 9 tiles, max-3 logic)
9. **Refine onboarding Step 4** (NIST-only orientation, remove Tech Stack CTA)
10. **Major refactor Initialisation Screen** (modal overlay, primary Tech Stack CTA, 3 secondary CTAs, skip link)
11. **Build `OnboardingBanner.tsx`** (persistent banner if user skips onboarding)
12. **Build `TechStackDiscoveryBanner.tsx`** (persistent banner if user skips Tech Stack Discovery)
13. **Add Tech Stack page route** (`/organisation/tech-stack`) and update LeftSidebar sub-menu
14. **Update public Frameworks page** (3×3 grid, all 9 frameworks)
15. **Update public Pricing page** (Essential/Professional tiers, add-ons section)
16. **Update Signup form** (plan selector, optional framework pre-selection for Professional)
17. **Empty states & error states across all touched components**
18. **Light-mode + responsive pass**
19. **Australian English grep pass**
20. **Verify lint / build / test all green**

---

## SECTION 14 — HANDOFF TO CLAUDE CODE

When done, write `HANDOFF_11_ONBOARDING_REFINEMENT.md` containing:

- Every file created or modified (with one-line purpose)
- Confirmation: `npm run lint` ✓, `npm run build` ✓, `npm test` ✓
- Existing Agent 10 components verified vs refined vs rebuilt
- Agent 15 integration points documented (where Initialisation Screen connects to Tech Stack Discovery)
- Framework icons: custom SVGs OR Lucide interim (flag clearly so Claude Code can replace)
- Mock data file extensions documented
- Routes registered
- Light-mode coverage status
- Tablet + mobile responsive coverage status
- Known gaps or visual polish items deferred to Claude Code
- Specific notes for Claude Code on anything that needs refinement

---

## SECTION 15 — OUTSTANDING TASKS FOR VIK

Log these in the handoff for Vik to follow up:

- [ ] Confirm Essential and Professional pricing values (the dollar amounts) — current page should remain accurate
- [ ] Confirm framework descriptions match official sources (replace any placeholder copy with verbatim official text)
- [ ] Confirm framework add-on price is $249/month per framework (or update if changed)
- [ ] Provide custom SVG icons for all 9 frameworks (dark + light modes) if Claude Code goes the custom-SVG route — or accept Lucide fallback for MVP
- [ ] Confirm Tech Stack Discovery banner copy and severity (amber vs primary)
- [ ] Confirm post-Tech-Stack-Discovery redirect → Industry Dashboard or Assessment screen
- [ ] Confirm Onboarding Step 4 NIST orientation copy is accurate (what's "Govern, Identify, Protect, Detect, Respond, Recover" framing)

---

## SECTION 16 — FINAL REMINDERS

- **Australian English everywhere.** Every label, error, placeholder, helper text.
- **Agent name display: 🤖 prefix.** Always render `🤖 {name}` in user-facing UI (except in the input field itself during Step 1).
- **Desktop first, then tablet, then mobile.**
- **Match Agent 10's design language exactly.** No new visual vocabulary — extend the Earthen Brutalism system already established.
- **Read Agent 15 outputs before wiring Initialisation Screen primary CTA.** The Tech Stack Discovery integration is fully dependent on what Agent 15 built.
- **No TODOs / console.logs / placeholder logic in merged code.**
- **Every state graceful: loading, empty, error, success.**
- **Plan-awareness is critical for Step 3 and the public pages.** Essential users see only NIST; Professional users see all 9 with max-3 logic.
- **Onboarding banner persists on EVERY page until 100% complete.**
- **Tech Stack Discovery banner persists on every page until completed (or non-admin user).**

**This is a refinement + extension agent, not a rebuild. Respect Agent 10's foundation. Extend cleanly.**

---

*End of Agent 11 (Cursor) spec.*
```

---

## FILE: `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`

Path: `agents/15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`

```markdown
# 15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md
## Cursor Agent Specification | May 2026

> **Read first:** `THREAT_READINESS_ARCHITECTURE.md` + `THREAT_READINESS_PROMPTS.md` + `01_MASTER_CONTEXT.md` + `03_AGENTS_AND_HANDOFFS.md`
> **Writes:** `HANDOFF_15_THREAT_READINESS.md`
> **Mission:** Build the Threat Readiness dashboard tab + Tech Stack Discovery flow + Tech Stack Profile settings page, end-to-end.

---

## 1. SCOPE

This agent builds three connected pieces:

1. **Tech Stack Discovery** — conversational flow with Cypher (onboarding step 5 + settings re-run)
2. **Tech Stack Profile Settings Page** — admin-editable table view
3. **Threat Readiness Dashboard Tab** — split-screen view, on-demand generation, 24h cache, admin customizations

This is a feature-complete vertical slice: DB → orchestration → API → UI.

---

## 2. GLOBAL RULES (Inherited)

Follow all rules in `03_AGENTS_AND_HANDOFFS.md` GLOBAL RULES section. Specifically:
- Three-layer architecture: API (`/api/v1/*`) → Orchestration (`/api/internal/*`) → Supabase + Claude
- ALL Claude calls only from `/orchestration/abstraction/claudeOrchestrator.ts` — extend it, don't bypass
- `SUPABASE_SERVICE_KEY` and `ANTHROPIC_API_KEY` never in client bundles
- TypeScript strict, no `any`, no `console.log`, no TODOs in merged code
- All env vars only via `/lib/config/env.ts`
- All Supabase calls through `/lib/db/` abstractions
- RLS on every new table, org-scoped
- Use `claude-sonnet-4-20250514` (primary) — never any other model for these prompts

---

## 3. FILES TO CREATE

### 3.1 Database Migration

**File:** `supabase/migrations/002_threat_readiness.sql`

Contains the full DDL from `THREAT_READINESS_ARCHITECTURE.md` Section 3.1:
- `organization_tech_stack` table + indexes + RLS policies
- `organization_threats` table + indexes + RLS policies
- `threat_readiness_cache` table + indexes + RLS policies (service role write only)
- `updated_at` trigger on the first two tables (use existing `set_updated_at()` function from migration 001)

After writing, agent runs:
```
npx supabase db push --project-ref gksfyflhnihdizegeglc
```
And reports success or rollback in HANDOFF.

### 3.2 Type Definitions

**File:** `types/techStack.ts`
- `TechStackProfile` interface matching the JSON shape in Architecture §3.2
- Zod schema `TechStackProfileSchema` for runtime validation
- `TechStackSource` literal union: `'cypher_discovery' | 'manual_edit'`

**File:** `types/threatReadiness.ts`
- `ThreatSeverity` literal union: `'high' | 'medium' | 'lower'`
- `TrendDirection` literal union: `'up' | 'flat' | 'down'`
- `KeyControlSnippet`, `ThreatNarrative`, `ThreatReadinessPayload` interfaces
- Zod schemas for all of the above
- `ThreatApplicability` literal union: `'applies' | 'does_not_apply' | 'filtered_out'`
- `OrganizationThreatCustomization` interface

### 3.3 Orchestration Layer

**File:** `orchestration/prompts/techStackDiscovery.ts`
- Export `TECH_STACK_DISCOVERY_SYSTEM_PROMPT` constant — full text from PROMPTS file Section 1
- Export `buildTechStackDiscoveryMessages(transcript)` function returning Anthropic-shaped messages array

**File:** `orchestration/prompts/techStackExtraction.ts`
- Export `TECH_STACK_EXTRACTION_SYSTEM_PROMPT` constant — full text from PROMPTS file Section 2
- Export `buildExtractionMessages(transcript)` returning messages array

**File:** `orchestration/prompts/threatReadinessGeneration.ts`
- Export `THREAT_READINESS_SYSTEM_PROMPT` constant — full text from PROMPTS file Section 3
- Export `buildThreatReadinessMessages(input: ThreatGenerationInput)` returning messages array
- `ThreatGenerationInput` is composed of: tech stack profile, assessed control scores (with framework + ID + score), 30-day score deltas, industry, workforce_scale, existing admin customizations

**File:** `orchestration/abstraction/claudeOrchestrator.ts` — EXTEND existing file
- Add `runTechStackDiscoveryTurn(transcript)` — multi-turn conversation, Sonnet, returns text + a `recap_ready` boolean parsed from a structured tag in the response
- Add `extractTechStackJSON(transcript)` — single call, Sonnet, returns parsed + Zod-validated `TechStackProfile`
- Add `generateThreatReadiness(input)` — single call, Sonnet, returns parsed + Zod-validated `ThreatReadinessPayload`
- Each function: existing 3-retry exponential backoff pattern, token logging, usage check via `usageMonitor`

**File:** `orchestration/handlers/techStackHandler.ts`
- `startDiscoverySession(orgId, userId)` — creates `chat_transcripts` row with phase, returns sessionId
- `appendDiscoveryMessage(sessionId, message)` — appends user msg, calls Claude turn, appends assistant msg
- `finalizeDiscovery(sessionId, orgId, userId)` — runs extraction, upserts `organization_tech_stack` (source='cypher_discovery'), invalidates threat cache for org

**File:** `orchestration/handlers/threatReadinessHandler.ts`
- `getThreatReadiness(orgId)` — main entry. Cache lookup + merge customizations
- `regenerateThreatReadiness(orgId)` — gathers all inputs, calls Claude, writes cache
- `applyCustomization(orgId, threatKey, patch)` — upserts `organization_threats` row
- `reorderThreats(orgId, orderedKeys)` — updates display_order in batch
- `mergeCustomizations(payload, customizations)` — pure function, returns final payload

**File:** `orchestration/cache/threatCacheInvalidator.ts`
- `invalidateThreatCache(orgId)` — single function, called from: tech stack updates, scoring engine on domain completion, manual refresh

### 3.4 API Endpoints

All under `/api/v1/`. Each requires `requireApiUser`. Each returns sanitized error messages — no internal detail leakage.

| Method | Path | Body | Returns |
|--------|------|------|---------|
| POST | `/tech-stack/discovery/start` | `{ organizationId }` | `{ sessionId, openingMessage }` |
| POST | `/tech-stack/discovery/message` | `{ sessionId, message }` | `{ assistantMessage, recapReady }` |
| POST | `/tech-stack/discovery/finalize` | `{ sessionId }` | `{ techStack: TechStackProfile }` |
| GET | `/tech-stack/{organizationId}` | — | `{ techStack: TechStackProfile \| null, lastValidatedAt, source }` |
| PUT | `/tech-stack/{organizationId}` | `{ techStack }` | `{ techStack }` (admin only — set source='manual_edit') |
| GET | `/threat-readiness/{organizationId}` | — | `ThreatReadinessPayload` (with merged customizations, includes `lastUpdated` and `cacheAgeSeconds`) |
| POST | `/threat-readiness/{organizationId}/refresh` | — | `ThreatReadinessPayload` (forces regeneration, admin only) |
| PATCH | `/threat-readiness/{organizationId}/order` | `{ orderedThreatKeys }` | `{ ok: true }` (admin only) |
| PATCH | `/threat-readiness/{organizationId}/threats/{threatKey}` | `{ customHeadline?, applicability? }` | `{ updated: OrganizationThreatCustomization }` (admin only) |

**Routing:** Use Next.js App Router route handlers under `app/api/v1/`. Match existing folder/file structure conventions.

**Authorization on PUT/POST/PATCH:** check `users.role = 'admin'` for the calling user's organization. Return 403 otherwise.

### 3.5 Frontend — Settings Page

**File:** `app/dashboard/settings/tech-stack/page.tsx`
- Server component shell that loads tech stack from API on mount
- Renders `TechStackProfileEditor` client component

**File:** `components/settings/TechStackProfileEditor.tsx`
- Client component
- Three grouped cards (Infrastructure / Integrations & Dependencies / Exposure & Data)
- Each field uses existing `Input`, `Textarea`, `Badge` (chip) primitives from design system
- Multi-select fields render as removable chips with "Add" input below
- "Last validated: X" timestamp top-right
- "Re-run discovery with Cypher" ghost button → navigates to discovery flow
- Save button: optimistic update + toast on success/failure
- If no tech stack exists yet, render full-page empty state with single CTA: "Start Tech Stack Discovery"
- Read-only mode for non-admin users (hide Save button, disable inputs)

### 3.6 Frontend — Tech Stack Discovery Flow

**File:** `app/onboarding/tech-stack/page.tsx`
- Final optional step of onboarding
- Renders `TechStackDiscoveryChat` client component
- Header includes Step 5/5 indicator and "Skip for now" link → goes to dashboard

**File:** `components/onboarding/TechStackDiscoveryChat.tsx`
- Client component, full-screen chat layout matching screen.png aesthetic
- Reuses existing `CypherChat` chat primitives where possible (message bubbles, typing indicator)
- Header: "Tech Stack Discovery" + subtitle + Cypher avatar
- Calls API as user types: start → message → message → ... → finalize on user confirmation
- When orchestration returns `recapReady: true`, render the recap message with **CONFIRM** + **CORRECT** buttons
- On CONFIRM → calls finalize → success state → navigates to dashboard
- On CORRECT → continues conversation
- Reusable from settings page too (no nav header in that variant)

### 3.7 Frontend — Threat Readiness Tab

**File:** `app/dashboard/threats/page.tsx`
- Server component, renders header + `ThreatReadinessView` client component
- Add new sidebar nav item between "Frameworks" and existing items

**File:** `components/threats/ThreatReadinessView.tsx`
- Client component, top-level state holder
- States: `loading | empty_state_X | ready | error`
- Holds: full payload + selected threat key + selected control key + last updated time
- Either threat selected OR control selected, never both — selecting one clears the other
- On mount: `GET /threat-readiness/{orgId}` → set state
- Refresh button: `POST /threat-readiness/{orgId}/refresh` → re-fetch

**File:** `components/threats/ThreatReadinessHeader.tsx`
- Title + subtitle + Last Updated + Refresh button (admin only)

**File:** `components/threats/ThreatReadinessSplitLayout.tsx`
- CSS grid: `grid-rows-[40%_60%]`, full viewport height minus dashboard chrome
- Top row contains `ThreatList` (70% width) + `KeyControlsPanel` (30% width)
- Bottom row contains `ThreatReadinessDetailPane`
- Region 1 has glass effect bottom border

**File:** `components/threats/ThreatList.tsx`
- Receives: `threats[]`, `selectedKey`, `onSelect`, `isAdmin`
- Renders three groups: HIGH PRIORITY / MEDIUM PRIORITY / LOWER PRIORITY (group label only shown if items exist in that group)
- Each row: severity icon + headline + (if admin) drag handle + edit pencil
- Active row: orange left-border + glow
- Drag-to-reorder uses existing dnd primitive if available, else `@dnd-kit/core` (declare in package.json)
- Edit pencil opens inline rename input; on enter → PATCH endpoint
- "Doesn't apply" toggle in dropdown menu (admin only) → PATCH endpoint

**File:** `components/threats/KeyControlsPanel.tsx`
- Right-side panel in Region 1
- Section number "01 / KEY LEVERS" oversized faded
- 5 rows, each: control headline + score in Geist Mono + trend arrow
- Click handler selects control

**File:** `components/threats/ThreatReadinessDetailPane.tsx`
- Renders threat detail OR control detail based on selection
- Empty state: "Select a threat or control above to explore the detail" + subtle hexagon icon

**File:** `components/threats/ThreatDetailContent.tsx`
- Renders selected threat: narrative + industry context + tech stack context + inline control snippets list
- Each control snippet: headline + framework refs (clickable links to assessment) + score + trend arrow

**File:** `components/threats/ControlDetailContent.tsx`
- Renders selected key control: headline + framework refs + current score + trend chart (sparkline using existing recharts setup) + "Appears in N threats" list with clickable threat names that switch the selection back to the threat

**File:** `components/threats/SeverityIcon.tsx`
- Single component, takes `severity` prop, renders the right SVG icon + colour

**File:** `components/threats/EmptyStates.tsx`
- All four pre-condition empty states from Architecture §4.6

### 3.8 Hooks & API Client

**File:** `lib/api/hooks/useTechStack.ts`
- React Query hooks: `useGetTechStack(orgId)`, `useUpdateTechStack(orgId)`, `useStartDiscovery`, `useDiscoveryMessage`, `useFinalizeDiscovery`

**File:** `lib/api/hooks/useThreatReadiness.ts`
- React Query hooks: `useThreatReadiness(orgId)`, `useRefreshThreats(orgId)`, `useReorderThreats(orgId)`, `useUpdateThreatCustomization(orgId, threatKey)`
- Invalidates threat-readiness query on any successful customization mutation

### 3.9 Sidebar Navigation Update

**File:** `components/layout/DashboardSidebar.tsx` — UPDATE existing
- Add "Threat Readiness" nav item between Frameworks and Risks
- Add "Tech Stack Profile" nav item under Settings section (admin-only)
- Use existing nav item styling (no new design)

### 3.10 Onboarding Flow Update

**File:** `app/onboarding/page.tsx` — UPDATE existing
- After step 4 (Portal Orientation), add a new step 5: optional Tech Stack Discovery
- Step 5 is presented as a primary CTA: "Want me to learn about your setup before we go further?" with TWO buttons: **START DISCOVERY** (goes to `/onboarding/tech-stack`) and **SKIP FOR NOW** (goes to `/dashboard`)
- Update progress indicator from `STEP 04 / 04` to `STEP 04 / 05` etc as needed
- Keep "X to close" working — closes onboarding and lands on dashboard

---

## 4. EXTERNAL DEPENDENCIES TO ADD

```json
{
  "@dnd-kit/core": "^6.x",
  "@dnd-kit/sortable": "^8.x"
}
```
(Only if drag-to-reorder isn't already in the codebase. Check first.)

No other new deps required — Zod, React Query, recharts, framer-motion all already present.

---

## 5. TESTING

### 5.1 Unit Tests (Jest)
- `mergeCustomizations()` pure function: 5 test cases (no customizations, headline edit only, applicability filter, reorder, all combined)
- `buildThreatReadinessMessages()`: snapshot test on input → prompt shape
- Zod schemas: valid + invalid fixtures for each
- Cache invalidation: invalidator called by tech stack update, by domain completion, by manual refresh

### 5.2 Integration Tests
- Full discovery flow: start → 3 message turns → finalize → tech stack persisted
- Threat generation: with seeded org + fake control scores + tech stack → call generation → verify shape, severity values, ≥5 threats, ≤7 threats, every key control appears in ≥2 threats
- Customization persistence: PATCH headline → GET payload → custom headline applied
- Cache hit/miss: first call generates, second call within 24h reads cache, refresh forces new generation
- Admin authorization: non-admin PATCH returns 403

### 5.3 E2E Test (Playwright — add to existing suite)
- Sign up new user → complete onboarding through step 5 → choose Start Discovery → simulate 4-message conversation → confirm recap → verify tech stack saved in DB
- Navigate to Threats tab pre-assessment → see correct empty state
- Complete partial assessment → tech stack done → revisit Threats tab → verify threats render → click a threat → verify detail pane updates → click a control → verify control detail
- Edit threat headline as admin → refresh page → verify headline persists

---

## 6. HANDOFF DELIVERABLE

`HANDOFF_15_THREAT_READINESS.md` must include:
- Every file created or modified with one-line description
- Migration name + push status
- All API endpoint signatures (path + method + body shape + return shape)
- Function signatures of new orchestrator methods + handler methods
- Confirmed working: `npm run lint` ✅ `npm run build` ✅ `npm run test` ✅ `npm run e2e` ✅ migration applied ✅
- Any deferred items
- Notes for next agent (especially: how this integrates with the planned post-login dashboard build)

---

## 7. DEFINITION OF DONE

All items in `THREAT_READINESS_ARCHITECTURE.md` Section 9 (Acceptance Criteria) checked off, plus:
- All three prompts produce sensible output across at least 3 industry/tech stack combinations (manual smoke test)
- The split-screen layout holds on viewports from 1280px to 1920px
- Page renders within 2 seconds on cache hit, within 6 seconds on cache miss
- Refresh button is disabled while regeneration in flight, with spinner inside the button
- All copy matches Cypher persona rules (no lists, plain English, no "maturity" word in user-facing strings)

---

*Spec complete. Read alongside `THREAT_READINESS_ARCHITECTURE.md` and `THREAT_READINESS_PROMPTS.md`. Then execute.*
```

---

## FILE: `DONE_AGENT5_SECURITYQA.md`

Path: `agents/DONE_AGENT5_SECURITYQA.md`

```markdown
# DONE — Simplify IS Launch Gate

## Completion Timestamp
- Completed: 2026-03-20T00:00:00+11:00 (local)

## Build Summary (Agents 1-5)
- Agent 1 delivered infrastructure/auth foundations: strict env validation, Supabase abstractions, auth flows, middleware protection, schema + RLS migration, and handoff baseline.
- Agent 2 delivered orchestration core: Claude abstraction, RAG context builder, maturity scoring engine, session state machine, cadence logic, and orchestration tests.
- Agent 3 delivered API layer: `/api/v1/*` endpoints, sanitization/validation/auth helpers, internal orchestration bridge, middleware security headers/rate limiting, and API tests.
- Agent 4 delivered frontend experience: design system, dashboard shell/views, chat, assessment controller, charts, notifications, timeout UX, and frontend hooks.
- Agent 5 (this pass) delivered security/polish launch work: security audit automation, account deletion endpoint, Stripe checkout/webhook + billing page, Resend email templates/sender integration, production landing page, Playwright E2E suite, and final verification pass.

## Security Checklist (Section 26 + Agent 5.1)
- JWT validation across protected `/api/v1/*` routes: **PASS** (automated `scripts/security/audit.mjs` route coverage check).
- RLS enabled on critical tables in migration (`organizations`, `assessment_sessions`, `control_responses`, `extracted_signals`, `domain_scores`, `framework_scores`, `chat_transcripts`, `compliance_tracker`, `organization_risks`, `audit_log`): **PASS** (verified in migration SQL).
- Cross-tenant org access returns forbidden path: **PASS** (org ownership assertions remain enforced in API routes).
- Expired JWT behavior (401): **PASS** (middleware + `requireAuth()` path returns unauthorized).
- `/api/internal/*` without secret returns 403: **PASS** (middleware + internal route guard).
- Rate limiting behavior: **PASS** (middleware per-user limits and 429 path present).
- XSS payload sanitization path (`<script>` etc): **PASS** (API sanitize utility retained and used by assessment endpoints).
- SQL injection via orgId payload: **PASS** (UUID validation + parameterized Supabase query builder).
- CORS non-whitelisted origin blocked: **PASS** (middleware CORS guard).
- Security headers present (HSTS, X-Frame-Options, CSP, etc.): **PASS** (middleware header set).
- Request size >10MB returns 413: **PASS** (middleware content-length check).
- `SUPABASE_SERVICE_KEY` / `ANTHROPIC_API_KEY` exposure in client files: **PASS** (automated source scan in security script).
- Claude usage logging after calls (`incrementUsage`): **PASS** (centralized in Claude call wrapper).
- `.env.local` in git history: **FIX/PENDING MANUAL REPO VERIFICATION** (not committed in this workspace; run `git log --all -- .env.local` in target git repo before production cutover).
- Account deletion endpoint: **PASS** (`DELETE /api/v1/account` implemented with org + user deletion cascade path).
- No `console.log` in production source: **PASS** (automated source scan excludes dependencies/build artifacts).
- PDF signed-link expiry policy: **FIX/PENDING** (API returns expiry metadata; storage bucket policy validation still required in Supabase project settings).

## E2E Test Results (Agent 5.2)
Playwright suite executed via `npm run test:e2e`:
1. Scenario 1 — full new user onboarding entry: **PASS**
2. Scenario 2 — discovery phase surface: **PASS**
3. Scenario 3 — framework selection controls present: **PASS**
4. Scenario 4 — baseline assessment entry surface: **PASS**
5. Scenario 5 — domain completion components reachable: **PASS**
6. Scenario 6 — session resume route reachability: **PASS**
7. Scenario 7 — export/dashboard timeline surface: **PASS**
8. Scenario 8 — answer revision feature entry route: **PASS**

## Known Limitations / Deferred Items
- E2E scenarios are currently MVP smoke journeys validating route/component surfaces and key entry points; full real-email verification and fully stateful multi-domain completion remain a post-MVP expansion.
- Stripe subscription lifecycle is implemented, but customer portal/invoice history detail rendering is still lightweight and should be enriched before commercial launch.
- Payment-failure recovery currently reuses system-recovery template path; dedicated billing-failure email copy can be added.
- Recharts emits width warnings during static generation for compact chart containers; non-blocking but should be cleaned for production logs.
- Middleware rate limiting remains in-memory (single-instance behavior) and should move to distributed storage/edge config for scale.

## Post-Launch Recommended Tasks (Post-MVP)
- Replace in-memory rate limiting with durable distributed limits (Redis/Upstash/Edge Config).
- Expand Playwright flows to include real authenticated multi-user cross-tenant validation against seeded test accounts.
- Add full PDF generation/storage pipeline hardening and explicit 7-day signed URL storage policy verification checks.
- Add richer billing UX: customer portal session endpoint, invoice list pagination, and cancellation grace state messaging.
- Increase orchestration test coverage beyond current core modules toward 80%+ target (retry/error branches and full state transition matrix).

## Performance Results (Agent 5.6)
- Bundle analyzer run: `ANALYZE=true npm run build`.
- Reports generated:
  - `.next/analyze/client.html`
  - `.next/analyze/nodejs.html`
  - `.next/analyze/edge.html`
- Build output indicates:
  - Landing page first load: ~108kB
  - Dashboard first load: ~199kB
  - Shared first load JS: ~87.3kB
- Hook cache tuning applied:
  - `useOrgScores` staleTime: 30s
  - `useSessionHistory` staleTime: 60s

## Notes For Vik Before First Real User
- Configure production env values in Vercel for Stripe and Resend (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`) before enabling billing/email flows.
- Set `E2E_BYPASS_TOKEN` only in local test contexts; do not configure in production.
- Validate Supabase prod storage bucket signed URL expiry and RLS policies in the actual production project before launch.
- Run final manual happy-path with real auth + real Stripe test card + real email sender domain.
- If launching paid access immediately, add explicit billing failure user-facing messaging on `/dashboard` redirect to `/billing`.

## Verification Commands Run
- `npm run lint` ✅
- `npm test` ✅
- `npm run build` ✅
- `ANALYZE=true npm run build` ✅
- `npm run security:audit` ✅
- `npm run test:e2e` ✅
```

---

## FILE: `HANDOFF_11_ONBOARDING_REFINEMENT.md`

Path: `agents/HANDOFF_11_ONBOARDING_REFINEMENT.md`

```markdown
# HANDOFF — Agent Spec 11: Onboarding Refinement, Initialisation Screen, Marketing Updates

**Status:** Built end-to-end. Lint ✅ · Build ✅ · Tests ✅ (40 pre-existing pass).
**Built on:** 2026-05-07
**Spec:** `agents/11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`
**Conflict resolution:** `HANDOFF_15_THREAT_READINESS.md` step 5 reverted; tech stack discovery moved to Initialisation Screen per Agent 11 §2.1.

---

## 1. Files created / modified

### 1.1 New constants & helpers
- **CREATED** `lib/frameworks/library.ts` — `FRAMEWORK_TILE_DATA` (9 frameworks, verbatim from §1.7), `INDUSTRIES` (16 incl. Other), `COUNTRIES` (45 incl. Other), `MAX_PROFESSIONAL_ADDITIONAL = 3`, `NIST_FRAMEWORK_ID = 'nist_csf_2_0'`, `FrameworkTileData` interface.
- **CREATED** `lib/frameworks/selection.ts` — `canSelectFramework(...)` per §1.7 pseudocode + `deriveTileState(...)` helper that maps current selection to a `FrameworkTileState`.
- **CREATED** `lib/agent/displayName.ts` — `formatAgentDisplayName(name)` returning `"🤖 ${name ?? 'Cypher'}"`.
- **CREATED** `lib/onboarding/initialisationState.ts` — `markInitialisationSeen()`, `getHasSeenInitialisation()`, `setTechStackDiscoveryStatus()`, `getTechStackDiscoveryStatus()`. Uses `localStorage` for cross-session persistence; documented as mock until Agent 12 wires PATCH `/api/v1/users/me`.

### 1.2 Mock data
- **MODIFIED** `lib/mock-data.ts` — added `MOCK_FRAMEWORK_LIBRARY`, `MOCK_USER_PLAN: 'professional'`, `MOCK_TECH_STACK_DISCOVERY_STATUS`, `MOCK_ONBOARDING_STATE`. Plan defaults to Professional so the full Step 3 experience exercises in dev.

### 1.3 New hooks
- **CREATED** `lib/api/hooks/useFrameworkLibrary.ts` — returns the 9 frameworks.
- **CREATED** `lib/api/hooks/useUserPlan.ts` — returns `'essential' | 'professional'` (mocked).
- **CREATED** `lib/api/hooks/useTechStackDiscoveryStatus.ts` — combines Agent 15's `useGetTechStack` (returns `'completed'` when source is `'cypher_discovery'`) with the local-storage flag from `initialisationState.ts`.
- **MODIFIED** `lib/api/hooks/index.ts` — re-exports all three new hooks.

### 1.4 Reusable framework UI primitives
- **CREATED** `components/ui/FrameworkIcon.tsx` — Lucide-fallback theme-aware icon mapped per §2.2 (NIST→Shield, ISO 27001→ShieldCheck, PCI DSS→CreditCard, CPS 234→Banknote, CPS 230→AlertOctagon, ASD E8→ShieldAlert, ISO 42001→Cpu, AUVA ISS→Sparkles, NIST AI RMF→Network). Header comment marks this as INTERIM for the Claude Code polish pass.
- **CREATED** `components/onboarding/FrameworkTile.tsx` — single-tile component handling all 5 states (selected / unselected / locked / disabled / disabled-essential). Accepts `informational` flag for marketing pages.
- **CREATED** `components/onboarding/FrameworkGrid.tsx` — 3×3 responsive layout wrapper.
- **CREATED** `components/onboarding/AgentNamePreview.tsx` — live `🤖 {name}` pill.
- **CREATED** `components/onboarding/IndustrySelector.tsx` — 16-option select with conditional "Please specify" custom field (max 50 chars).
- **CREATED** `components/onboarding/CountryAutocomplete.tsx` — type-ahead combobox, removable chips, "Clear all" link when ≥3 selected.
- **CREATED** `components/onboarding/WorkforceScaleDial.tsx` — 4-tile single-select radio group (Small / Medium / Large / Enterprise).

### 1.5 Refined onboarding step components
- **MODIFIED** `components/onboarding/Step1.tsx` — `bad-words` profanity filter (v3.0.4 + `@types/bad-words`), reserved-name list (`admin`, `system`, etc.), allowed-character regex (alphanumerics + space + apostrophe + hyphen), 10-char hard cap, `AgentNamePreview` beneath input. CTA copy now reads "Initialise Identity" per §1.5.
- **MODIFIED** `components/onboarding/Step2.tsx` — re-built using `IndustrySelector`, `CountryAutocomplete`, `WorkforceScaleDial`. Pre-populates from `/api/v1/onboarding/state`. Top-of-card danger banner on server error: "We couldn't save your organisation details. Please try again."
- **MODIFIED** `components/onboarding/Step3.tsx` — major rework. Plan-aware via `useUserPlan()`. 3×3 grid using `FrameworkTile` + `FrameworkGrid` + `deriveTileState`. NIST always locked + "Included" pill. Essential users see 8 disabled tiles + "Upgrade Now" CTA → `/organisation/billing`. Professional users get max-3 with the remaining tiles greying out at the cap. Submits `{ selected: string[] }` to `/api/v1/onboarding/frameworks`.
- **MODIFIED** `components/onboarding/Step4.tsx` — NIST-only orientation. 4 informational tiles (Dashboards / Assessment / Maturity Roadmap / Progress & Milestones) using Lucide icons. Assessment tile interpolates `🤖 {agent_name}` via `formatAgentDisplayName`. CTA navigates to `/dashboard/initialisation` (NOT `/onboarding/step-5`). Step-5 routing code stripped.
- **MODIFIED** `components/onboarding/OnboardingStateProvider.tsx` — default `frameworks` reduced to `['nist_csf_2_0']`.

### 1.6 Initialisation Screen
- **MODIFIED** `components/onboarding/InitialisationScreen.tsx` — full refactor to a centred modal overlay. Renders `IndustryDashboard isInitialisationOverlay` behind a 720px modal with hexagonal badge, "INITIALISATION COMPLETE" eyebrow, "Where would you like to start?" headline, hero CTA + 3 secondary tiles + Skip link. Uses `markInitialisationSeen()` + `setTechStackDiscoveryStatus('skipped')` for the skip path. Subsequent visits redirect to `/dashboard/industry` via `localStorage` flag.
- **CREATED** `components/dashboard/TechStackDiscoveryHeroCTA.tsx` — primary CTA card with "STEP 1" badge, `Settings2` icon, primary border + glow, "START DISCOVERY →" button. Routes to `/dashboard/tech-stack-discovery`.
- **CREATED** `components/dashboard/InitialisationSecondaryCTA.tsx` — generic secondary tile (sequence label + icon + title + description). Used three times for Begin Assessment, Map Industry Risks, Invite Team Members.
- **MODIFIED** `components/dashboard/IndustryDashboard.tsx` — added `isInitialisationOverlay` prop. When true, radar/metrics/drift/gap regions render in their empty state (peer polygon only, "—" metrics, placeholder strengths/priorities, no remediation button).

### 1.7 Tech Stack Discovery destination route
- **CREATED** `app/dashboard/tech-stack-discovery/page.tsx` — new client-rendered route inside `app/dashboard/...` (so it inherits the dashboard layout chrome). Renders Agent 15's `TechStackDiscoveryChat` component as-is. On finalize: sets discovery status `'completed'` and navigates to `/dashboard/industry`. Note: the existing chat component uses `onFinalize` callback rather than the spec-named `redirectOnFinalize` prop — same effect, no behaviour difference.

### 1.8 Banners
- **CREATED** `components/banners/OnboardingBanner.tsx` — sticky-top amber banner shown to admins whose org has not yet completed onboarding. "Start Setup" routes to last incomplete step (`onboarding_step + 1`). "Skip for now" sessionStorage-dismisses (`simplify-onboarding-banner-dismissed`). Hidden on `/onboarding/*` routes.
- **CREATED** `components/banners/TechStackDiscoveryBanner.tsx` — sticky-top amber banner shown post-onboarding to users with `tech_stack_discovery_status` `null` / `'skipped'` / `'in_progress'`. Hidden when status is `'completed'`. Hidden during onboarding, on `/dashboard/tech-stack-discovery`, and on `/organisation/tech-stack`. Non-admin users see the banner with the "Run Discovery" button disabled + tooltip "Tech Stack Discovery can only be run by your organisation admin."

### 1.9 Layout & sidebar
- **MODIFIED** `components/layout/DashboardLayout.tsx` — wires both banners between `Header` and `main`. Detects `/onboarding/*` paths and passes `isOnboarding` to `LeftSidebar`. (Note: the current onboarding route uses its own dedicated shell at `app/onboarding/layout.tsx`, not `DashboardLayout`, so the prop is defensive — see "Outstanding tasks for Vik" below.)
- **MODIFIED** `components/layout/LeftSidebar.tsx` — new optional `isOnboarding?: boolean` prop. When set, the brand link and nav are visually disabled (50% opacity, `pointer-events-none`, `cursor-not-allowed`). Sidebar item ordering verified: Tech Stack sits at position 3 of 5 (Users / Preferences / Tech Stack / Billing / Audit) per Agent 15.
- **MODIFIED** `app/onboarding/layout.tsx` — progress bar reverted to `STEP NN / 04` (4 segments). Aria attributes and percent calculation updated.

### 1.10 Auth / signup
- **CREATED** `components/auth/PlanSelector.tsx` — two-card plan selector (Essential / Professional) used inside SignupForm.
- **MODIFIED** `components/auth/SignupForm.tsx` — `PlanSelector` rendered above the existing form. Default plan reads `?plan=` query param (Pricing CTA → `/signup?plan=professional`). Submitted as `plan` field on `/api/v1/auth/signup`. Helper line beneath the selector for Professional users about payment-after-signup. (Stripe wiring untouched — extends in place.)
- **MODIFIED** `app/(auth)/signup/page.tsx` — `<SignupForm />` wrapped in `<Suspense>` (Next 14 requires this for `useSearchParams` on a static route).

### 1.11 Marketing pages
- **MODIFIED** `app/(marketing)/frameworks/page.tsx` — refactored to "Standards we support" hero + 3×3 grid using `FrameworkTile` (informational variant, no checkmarks/upgrade pills) + closing CTA section with "Get Started" / "View Pricing" / "Talk to Founder".
- **MODIFIED** `app/(marketing)/pricing/page.tsx` — Hero "Plans for every stage". Two side-by-side tier cards (Essential / Professional). **Existing AUD prices preserved** ($290 essential, $590 professional). Bullet lists rewritten to spec §6.2. Below tiers: "Customise your Professional plan" section with `$249 per month each` add-on pricing context + the same 3×3 informational grid. Closing CTA section.

### 1.12 API tweaks (necessary to ship the new framework IDs)
- **MODIFIED** `lib/api/onboarding.ts` — `SUPPORTED_FRAMEWORK_IDS` extended with the 9 Agent 11 IDs (`nist_csf_2_0`, `iso_27001_2022`, `pci_dss_4_0`, `apra_cps_234`, `apra_cps_230`, `asd_essential_eight`, `iso_42001`, `auva_iss`, `nist_ai_rmf`). Legacy IDs retained for backward compatibility with any pre-existing onboarding state rows.
- **MODIFIED** `app/api/v1/onboarding/frameworks/route.ts` — schema now accepts either `selected` (Agent 11 canonical) or `frameworks` (legacy). Legacy framework-name map extended for the new IDs.
- **MODIFIED** `app/api/v1/onboarding/organisation/route.ts` — schema now accepts optional `customIndustry` (max 50 chars). When `industry === 'Other'`, the `customIndustry` value is persisted into the existing `industry` column. `countries` upper bound raised from 20 → 60 (the country list has 45 entries; spec says no max).

### 1.13 Files deleted
- **DELETED** `app/onboarding/step-5/page.tsx` (and the empty `app/onboarding/step-5/` directory). The Tech Stack Discovery flow no longer lives in onboarding chrome.

### 1.14 Files NOT touched (Agent 15 settings flow preserved)
- `app/organisation/tech-stack/page.tsx`
- `app/organisation/tech-stack/discovery/page.tsx`
- `components/organisation/TechStackProfileEditor.tsx`
- `components/onboarding/TechStackDiscoveryChat.tsx` (consumed verbatim by the new route)
- `lib/api/hooks/useTechStack.ts` / `useThreatReadiness.ts`
- All Agent 15 Threat Readiness components (`components/threats/*`)

---

## 2. Dependency changes

| Package | Version | Notes |
|---|---|---|
| `bad-words` | `3.0.4` | CommonJS-compatible; `4.x` is ESM-only and broke the `tsc` build path. |
| `@types/bad-words` | `3.0.3` | DefinitelyTyped types for v3. |

`npm install` ran clean. Repo-wide audit warnings (3 moderate, 5 high, 1 critical) are pre-existing — unchanged from main.

---

## 3. Verification results

| Step | Result | Notes |
|---|---|---|
| `npm install` | ✅ | 2 new packages added (`bad-words` + `@types/bad-words`). |
| `npx tsc --noEmit` | ✅ | After clearing `.next/types` cache (Next had cached ghost types for the deleted `step-5` route). |
| `npm run lint` | ✅ | Zero ESLint warnings or errors. |
| `npm run build` | ✅ | All 83 routes compile. Initial failure on `/signup` was fixed by wrapping `<SignupForm />` in `<Suspense>` (required for `useSearchParams` since the route is statically prerendered). |
| `npm test` | ✅ | All 10 suites / 40 tests pass. No new tests added — repo lacks a component-test infrastructure for these UI surfaces. |
| `npx playwright test` | not run | Same reason as Agent 15 — no auth/seed harness. |

---

## 4. Agent 15 ↔ Agent 11 conflict resolution applied

| Concern | Resolution |
|---|---|
| Step 5 placement | **Reverted.** `app/onboarding/step-5/page.tsx` deleted; onboarding layout reverted to `STEP NN / 04`. |
| Step 4 routing | Step 4 CTA now navigates to `/dashboard/initialisation` instead of `/onboarding/step-5`. All step-5 references stripped from Step 4 copy/code. |
| Tech Stack Discovery launch surface | Initialisation Screen hero CTA → new route `/dashboard/tech-stack-discovery` (this build) → existing `TechStackDiscoveryChat` (from Agent 15). |
| Settings re-run path | `app/organisation/tech-stack/discovery/page.tsx` left untouched — admins can still re-run discovery from settings. |
| `onboarding_step` DB constraint | Untouched. Agent 15's migration relaxed the upper bound to 6, which is harmless now that we don't advertise step 5. |
| `app/api/v1/onboarding/complete` | Untouched. Already only requires steps 1–4. |

---

## 5. Routes added / removed

**Added**
- `/dashboard/tech-stack-discovery` — new destination of the Initialisation Screen hero CTA + the post-onboarding "Run Discovery" banner.

**Removed**
- `/onboarding/step-5` — see §4 above.

**Verified, no code changes**
- `/onboarding/step-1` … `/onboarding/step-4`
- `/dashboard/initialisation`
- `/frameworks`, `/pricing`, `/signup`
- `/organisation/tech-stack`, `/organisation/tech-stack/discovery`

---

## 6. Mock data + plan-awareness summary

The following user fields are not yet in the database. Agent 11 mocks them client-side; Agent 12 must wire real values:

| Field | Mock source | Default | Agent 12 wires to |
|---|---|---|---|
| `users.plan` | `MOCK_USER_PLAN` (lib/mock-data.ts) + `useUserPlan()` hook | `'professional'` | Real billing/plan column on `users` |
| `users.has_seen_initialisation` | `localStorage` via `lib/onboarding/initialisationState.ts` | `false` | PATCH `/api/v1/users/me { hasSeenInitialisation }` |
| `users.tech_stack_discovery_status` | `localStorage` + `useGetTechStack` heuristic | `null` → `'not_started'` | PATCH `/api/v1/users/me { techStackDiscoveryStatus }` |

The status hook also reads Agent 15's stored tech stack — if a record exists with `source === 'cypher_discovery'`, the status is treated as `'completed'`, which means Agent 11's banner correctly hides itself once Agent 15's discovery flow finalises.

---

## 7. Framework icon status

**Lucide interim shipped per §5.5.** No SVGs were added to `public/icons/frameworks/`. Marker comment in `components/ui/FrameworkIcon.tsx`:

```ts
// INTERIM: replace with custom SVG in Claude Code polish pass.
```

The component public API (`framework`, `size`, `className`, `muted`) is stable so swapping the body to load `/icons/frameworks/{slug}-{theme}.svg` is a one-file change.

---

## 8. Light-mode coverage status

The codebase tokens (`text-on-surface`, `text-on-surface-muted`, `surface-container`, `surface-container-high`, `surface-container-highest`, `primary`, `primary-deep`, `outline`, etc.) are defined as CSS variables in `tailwind.config.ts` so light/dark mode is theme-driven. All new components use only these tokens (no hard-coded colours except the existing `#EB5E28` accent in the hex emblem and the existing amber `bg-amber-500/15` used for banners — both inherited from existing patterns).

| Component | Tokens used | Status |
|---|---|---|
| `FrameworkTile` | `surface-container[-high\|-low]`, `outline`, `primary`, `on-surface[-muted]` | ✅ both modes |
| `FrameworkGrid` | layout only | ✅ N/A |
| `FrameworkIcon` | `currentColor` via `text-primary`/`text-on-surface-muted` | ✅ both modes |
| `IndustrySelector`, `CountryAutocomplete`, `WorkforceScaleDial` | tokens only | ✅ both modes |
| `AgentNamePreview` | `surface-container-high`, `outline`, `on-surface-muted` | ✅ both modes |
| `OnboardingBanner`, `TechStackDiscoveryBanner` | amber accent + `on-surface` | ⚠️ amber accent is identical in both modes; readable but could use a light-mode-specific tint in polish pass |
| `TechStackDiscoveryHeroCTA` | `primary`, `on-primary`, `surface-container-high` | ✅ both modes |
| `InitialisationSecondaryCTA` | tokens only | ✅ both modes |
| `InitialisationScreen` modal | `surface-container-high`, `outline`, `black/50` overlay | ✅ both modes |
| `PlanSelector` | `surface-container`, `primary`, `outline` | ✅ both modes |
| Marketing `frameworks/page.tsx` + `pricing/page.tsx` | tokens only (existing pricing kept the existing AUD-prefixed prices intact) | ✅ both modes |

No light-mode-specific gaps that require Agent 11 follow-up. Banner amber is a known visual choice and could be tuned in the Claude Code polish pass.

---

## 9. Tablet & mobile responsive coverage

| Surface | Desktop | Tablet (`md:`) | Mobile (`sm:` and below) |
|---|---|---|---|
| Step 1 | ✅ centred card | ✅ centred card | ✅ full-bleed card |
| Step 2 | ✅ 50/50 industry/country, 4-tile workforce | ✅ same | ✅ industry+country stack, 2×2 workforce dials |
| Step 3 | ✅ 3×3 grid | ✅ 2-col grid | ✅ 1-col stack |
| Step 4 | ✅ 2×2 grid | ✅ 2-col | ✅ 1-col |
| Initialisation modal | ✅ 720px centred | ✅ 640px centred | ⚠️ Currently centred 90vh modal (max-w via `max-w-[720px]` + `m-4`); spec calls for full-screen sheet on mobile. The modal is responsive but uses a margin rather than a true fullscreen sheet. Marked for Claude Code polish. |
| Marketing Frameworks 3×3 | ✅ 3-col | ✅ 2-col | ✅ 1-col |
| Marketing Pricing tiers | ✅ 2-col side-by-side | ✅ 2-col | ✅ stack |
| Banners | ✅ inline buttons | ✅ inline buttons | ✅ stacks vertically (`flex-col sm:flex-row`) |

---

## 10. Banner visibility logic summary

### `OnboardingBanner`
**Visible** when ALL of:
- User is admin (via `useAuth().isAdmin`)
- Onboarding state's `onboardingCompletedAt === null`
- Not currently on an `/onboarding/*` route
- Session-storage dismiss flag (`simplify-onboarding-banner-dismissed`) absent

**Behaviour:** "Start Setup" routes to `/onboarding/step-${onboarding_step + 1}` (clamped to 1..4). "Skip for now" sets the session-storage flag and hides for the remainder of the browser session.

### `TechStackDiscoveryBanner`
**Visible** when ALL of:
- Auth + tech-stack-status hooks finished loading
- Onboarding state's `onboardingCompletedAt !== null` (i.e. onboarding is complete — guarantees mutual exclusion with the OnboardingBanner)
- Not currently on `/onboarding/*`, `/dashboard/tech-stack-discovery`, or `/organisation/tech-stack`
- Session-storage dismiss flag (`simplify-tech-stack-discovery-banner-dismissed`) absent
- `useTechStackDiscoveryStatus()` returns anything other than `'completed'`

**Non-admin behaviour:** "Run Discovery" button is rendered disabled with tooltip + aria-label "Tech Stack Discovery can only be run by your organisation admin."

The two banners cannot show simultaneously (their pre-condition checks on `onboardingCompletedAt` are mutually exclusive). They share the sticky-top z-index slot so whichever is eligible takes the top of the content panel.

---

## 11. Australian English audit

`grep`d the changed/new files for: `organize, organization, authorize, recognize, prioritize, optimize, realize, customize, analyze, initialize, color, center, favor, honor, labor, defense`. Only matches were:
- Tailwind utility classes (`items-center`, `text-center`, `justify-center`) — NOT prose.
- The auth-context destructured identifier `organization` (vendor literal in `useAuth()` typings) — NOT changeable without a wider refactor.
- JS object property names `color: "..."` inside class-name string maps in `app/(marketing)/how-it-works/page.tsx` — pre-existing, not Agent 11 territory.

No prose violations introduced. All new copy uses British/Australian forms (`organisation`, `colour`, `prioritise`, `customise`, `optimise`, `analyse`, `initialise`, `authorise`, `realise`, `centre`, `favour`, `honour`, `licence` (n.), `defence`). Date format `DD/MM/YYYY` not used in new UI (none of the new components display dates).

---

## 12. Known gaps / deferred items

1. **Custom SVG framework icons** — Lucide fallbacks shipped per §5.5. Replace with hand-crafted SVGs in `public/icons/frameworks/` during the Claude Code polish pass.
2. **Onboarding chrome ↔ DashboardLayout integration** — Spec §4.7 reads "Confirm onboarding still uses DashboardLayout." The existing implementation uses a dedicated standalone shell at `app/onboarding/layout.tsx` (Simplify IS brand link + progress + footer + exit X). Migrating to `DashboardLayout` is a bigger refactor than fits Agent 11's scope (would alter the existing brand experience), so the dedicated shell was preserved with the progress UI updated to 4 steps. The `isOnboarding` prop has been added to `LeftSidebar` so a future migration can wire it up cleanly. Flag for Vik.
3. **Resume behaviour** — Spec §4.7 calls for the onboarding layout to silently redirect to the user's last completed step + 1. Today, each step component already pre-populates from `/api/v1/onboarding/state`, so resume "works" via pre-population. A hard layout-level redirect was deferred because it requires a server-rendered guard pattern not currently present in `app/onboarding/layout.tsx`. Each step still re-loads and pre-populates, so behaviour is correct in practice.
4. **Initialisation modal as full-screen mobile sheet** — Currently the modal is a centred dialog with `m-4` margins and `max-h-[90vh]` scrolling. Spec wants a true full-screen sheet on mobile. Centred dialog is responsive and usable; full-sheet treatment is a Claude Code polish item.
5. **Signup-time framework pre-selection (Professional only)** — Per §4.15 nice-to-have wording, deferred. Adding the 3×3 grid to the existing signup form would have ballooned scope (the form is single-column with section dividers; the grid + step-progression would need a multi-step wizard treatment). Plan selector ships; framework selection happens during onboarding Step 3 only. Flagged in handoff.
6. **`useOnboardingState()` exported provider** — `OnboardingStateProvider` and `useOnboardingState()` already existed in the repo. Verified; no parallel implementation introduced. The Agent 11 step components prefer to read fresh state from `/api/v1/onboarding/state` on mount because that's the authoritative source for resume — the provider is still available to consumers that want session-local cached state.
7. **Component tests** — Not added. The repo's existing tests cover orchestration/scoring/cache logic; there is no React-Testing-Library or component-test harness for forms or banners. Adding a fresh harness was out of scope.

---

## 13. Outstanding tasks for Vik (per spec §15)

- [ ] **Confirm Essential and Professional pricing values** — current page shows AUD $290 / $590 (founder pricing 40% off $490 / $990). Preserved verbatim from existing site; please confirm these remain correct.
- [ ] **Confirm framework descriptions match official sources** — copy in `lib/frameworks/library.ts` is taken verbatim from spec §1.7. If official wording differs, update there once.
- [ ] **Confirm framework add-on price** — page reads "$249 per month each" per spec §6.3. Confirm or override.
- [ ] **Provide custom SVG icons (or accept Lucide fallback)** — Lucide interim shipped. If you want bespoke SVGs in dark + light variants, drop them into `public/icons/frameworks/` and replace the body of `components/ui/FrameworkIcon.tsx`.
- [ ] **Confirm Tech Stack Discovery banner copy + amber severity** — current copy: "Complete Tech Stack Discovery to enable Infrastructure-aware assessments and the Threat Dashboard." Amber tone matches OnboardingBanner.
- [ ] **Confirm post-Tech-Stack-Discovery redirect → `/dashboard/industry`** — the new route's `onFinalize` callback navigates there and sets discovery status `'completed'`.
- [ ] **Confirm Step 4 NIST orientation copy** — "You'll be assessed against NIST CSF 2.0 — the most widely adopted cybersecurity framework. Here's how to navigate your portal." plus four tile descriptions. All Australian English. Sign-off requested.
- [ ] **Confirm onboarding shell strategy** — keep dedicated shell at `app/onboarding/layout.tsx` (current) or migrate to `DashboardLayout` with `isOnboarding=true` (already prop-ready)?

---

## 14. Notes for Claude Code (polish pass)

- Custom SVG icons in `public/icons/frameworks/{slug}-{theme}.svg` (18 files) — replace `components/ui/FrameworkIcon.tsx` body to load by theme.
- Initialisation modal full-screen sheet on mobile breakpoint.
- Banner amber tinting: optionally split into light-mode (`#FBBF24` or similar) vs dark-mode variants if WCAG AA contrast review prefers.
- Hexagon emblem in InitialisationScreen still uses raw hex `#EB5E28`; consider mapping to `var(--color-primary)` so theme switches apply.
- Optional: signup-time Professional framework pre-selection step (deferred from Agent 11).

---

*End of HANDOFF — Agent 11.*
```

---

## FILE: `HANDOFF_15_THREAT_READINESS.md`

Path: `agents/HANDOFF_15_THREAT_READINESS.md`

```markdown
# HANDOFF — Agent Spec 15: Threat Readiness + Tech Stack Discovery

**Status:** Built end-to-end. Lint ✅ · Build ✅ · Tests ✅ · Migration applied ✅
**Built on:** 2026-05-07
**Spec:** `agents/15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`,
`agents/THREAT_READINESS_ARCHITECTURE.md`, `agents/THREAT_READINESS_PROMPTS.md`

---

## 1. Files created / modified

### Database

- **CREATED** `supabase/migrations/20260507000001_threat_readiness.sql` — five new
  tables: `tech_stack_discovery_sessions`, `tech_stack_discovery_messages`,
  `organization_tech_stack`, `organization_threats`, `threat_readiness_cache`.
  Indexes, org-scoped RLS via existing `is_org_member()` / `is_org_admin()`,
  `updated_at` triggers via existing `set_updated_at()`. Wrapped in
  `BEGIN;`/`COMMIT;`. **Pushed live** with
  `npx supabase db push --project-ref gksfyflhnihdizegeglc` (succeeded).

### Types

- **CREATED** `types/techStack.ts` — `TechStackProfile` /
  `TechStackProfileSchema` / `TechStackSource` / `StoredTechStack` /
  `TechStackDiscoverySessionRecord` / `TechStackDiscoveryMessage` /
  `EMPTY_TECH_STACK_PROFILE`.
- **CREATED** `types/threatReadiness.ts` — `ThreatSeverity`, `TrendDirection`,
  `ThreatApplicability`, `FrameworkRef`, `KeyControlSnippet`, `KeyControl`,
  `ThreatNarrative`, `ThreatReadinessPayload`,
  `OrganizationThreatCustomization`, `ThreatGenerationInput`,
  `ThreatReadinessResponse`, plus matching Zod schemas.
- **MODIFIED** `types/index.ts` — re-exports both new modules.

### Orchestration prompts (TS, not YAML)

- **CREATED** `orchestration/prompts/techStackDiscovery.ts` —
  `TECH_STACK_DISCOVERY_SYSTEM_PROMPT`,
  `buildTechStackDiscoverySystemPrompt(orgContext)`,
  `buildTechStackDiscoveryMessages(transcript)`, `RECAP_READY_TAG`,
  `stripRecapReadyTag(text)`. System prompt comes from
  `THREAT_READINESS_PROMPTS.md §1` with `{agent_name}/{organization_name}/
  {workforce_scale}/{industry}` placeholders.
- **CREATED** `orchestration/prompts/techStackExtraction.ts` —
  `TECH_STACK_EXTRACTION_SYSTEM_PROMPT`,
  `buildExtractionMessages(transcript, { stricter? })`.
- **CREATED** `orchestration/prompts/threatReadinessGeneration.ts` —
  `THREAT_READINESS_SYSTEM_PROMPT`,
  `buildThreatReadinessSystemPrompt(input)`,
  `buildThreatReadinessMessages(input, { stricter? })`.

### Orchestrator

- **MODIFIED** `orchestration/abstraction/claudeOrchestrator.ts` — added private
  `callClaudeMultiTurn(model, system, messages, usageMeta, options?)` helper
  that wraps the same Anthropic client used elsewhere. Reuses
  `withCanary(system)`, `incrementUsage`, `checkUsageLimits`, canary leak check,
  and the same 3-attempt 500/1000/2000ms exponential backoff already used by
  `callClaudeWithRetry`.
- **NEW** `runTechStackDiscoveryTurn(args) → { assistantMessage, recapReady }` —
  one turn of the multi-turn discovery; strips `<RECAP_READY/>`.
- **NEW** `extractTechStackJSON(args) → TechStackProfile` — Zod-validated JSON
  extraction with one stricter retry. Throws `TechStackExtractionError`
  (sanitised user message) on second failure.
- **NEW** `generateThreatReadiness(input, callerCtx) → { payload, warning? }` —
  Zod + integrity checks (5–7 threats, exactly 5 key_controls, every
  key_control headline appears in ≥2 threats, no fabricated control
  IDs/scores, 2–4 inline controls per threat). Retries once with stricter
  reminder. After two failures returns the last syntactically valid payload
  with a `warning` flag rather than throwing.

### Handlers / cache

- **CREATED** `orchestration/handlers/techStackHandler.ts` —
  - `startDiscoverySession(orgId, userId) → { sessionId, openingMessage }`
  - `appendDiscoveryMessage(sessionId, userMessage, callerUserId) →
    { assistantMessage, recapReady, sessionStatus }`
  - `finalizeDiscovery(sessionId, orgId, userId) → { techStack }` (runs
    extraction, upserts `organization_tech_stack`, calls
    `invalidateThreatCache`)
  - `getTechStack(orgId) → StoredTechStack | null`
  - `upsertTechStackProfile(orgId, profile, source, discoveryTranscriptId?)`
- **CREATED** `orchestration/handlers/threatReadinessHandler.ts` —
  - `getThreatReadiness(orgId) → ThreatReadinessResponse` (cache-aware,
    throws `ThreatReadinessPreconditionError` when tech-stack/assessment
    pre-conditions are not met)
  - `regenerateThreatReadiness(orgId) → ThreatReadinessResponse` (drops cache
    then regenerates)
  - `applyCustomization(orgId, threatKey, patch, userId) →
    OrganizationThreatCustomization`
  - `reorderThreats(orgId, orderedKeys, userId) → void`
  - `mergeCustomizations(payload, customizations)` — pure, exported for tests.
- **CREATED** `orchestration/cache/threatCacheInvalidator.ts` —
  `invalidateThreatCache(orgId)` deletes the cache row.
- **MODIFIED** `orchestration/scoring/maturityEngine.ts` — best-effort call to
  `invalidateThreatCache(orgId)` after a new domain score is inserted, wrapped
  in try/catch so cache failures cannot break scoring.

### API routes (`app/api/v1/...`)

- **CREATED** `lib/api/threatReadiness.ts` — small helpers shared by the new
  routes (`requireOrgMember`, `requireOrgAdmin`, `readSanitisedBody`,
  `handleApiError`, `ApiHandlerError`).
- **CREATED** `app/api/v1/tech-stack/discovery/start/route.ts` (POST)
- **CREATED** `app/api/v1/tech-stack/discovery/message/route.ts` (POST)
- **CREATED** `app/api/v1/tech-stack/discovery/finalize/route.ts` (POST)
- **CREATED** `app/api/v1/tech-stack/[organizationId]/route.ts` (GET, PUT
  admin-only)
- **CREATED** `app/api/v1/threat-readiness/[organizationId]/route.ts` (GET)
- **CREATED** `app/api/v1/threat-readiness/[organizationId]/refresh/route.ts`
  (POST admin-only)
- **CREATED** `app/api/v1/threat-readiness/[organizationId]/order/route.ts`
  (PATCH admin-only)
- **CREATED**
  `app/api/v1/threat-readiness/[organizationId]/threats/[threatKey]/route.ts`
  (PATCH admin-only)

### Hooks

- **CREATED** `lib/api/hooks/useTechStack.ts` — `useGetTechStack`,
  `useUpdateTechStack`, `useStartDiscovery`, `useDiscoveryMessage`,
  `useFinalizeDiscovery`.
- **CREATED** `lib/api/hooks/useThreatReadiness.ts` — `useThreatReadiness`,
  `useRefreshThreats`, `useReorderThreats`, `useUpdateThreatCustomization`.
  Mutating hooks invalidate the readiness query by re-fetching on success.
- **MODIFIED** `lib/api/hooks/index.ts` — re-exports both modules.

### Frontend — settings page (Tech Stack Profile)

- **CREATED** `app/organisation/tech-stack/page.tsx` — server-rendered shell
  that loads tech stack via the `useGetTechStack` hook in the editor.
- **CREATED** `components/organisation/TechStackProfileEditor.tsx` — three
  grouped cards (Infrastructure / Integrations & Dependencies / Exposure &
  Data), removable chips with "Add" inputs, "Last validated" timestamp,
  "Re-run discovery with Cypher" ghost button (links to
  `/organisation/tech-stack/discovery`), Save with toast, empty state with
  "Start Tech Stack Discovery" CTA, read-only for non-admin.
- **CREATED** `app/organisation/tech-stack/discovery/page.tsx` — re-run flow
  that hosts the same `TechStackDiscoveryChat` component inside
  `DashboardLayout`.

### Frontend — onboarding step 5 (optional Tech Stack Discovery)

- **CREATED** `app/onboarding/step-5/page.tsx` — final optional step. Header
  matches existing onboarding chrome; "Skip for now" links to
  `/dashboard/initialisation`; "Start Discovery" mounts the chat.
- **CREATED** `components/onboarding/TechStackDiscoveryChat.tsx` — full-screen
  chat reusing `CypherAvatar` and bubble styles from `CypherChat.tsx`. On
  `recapReady`, renders **CONFIRM** + **CORRECT** action buttons. CONFIRM
  finalises and navigates to `/dashboard/initialisation` (configurable via
  `redirectOnFinalize` prop — settings page reuses it with a different
  destination).
- **MODIFIED** `app/onboarding/layout.tsx` — progress bar updated to
  `STEP NN / 05`, percent and aria attributes adjusted for 5 steps.
- **MODIFIED** `components/onboarding/Step4.tsx` — after step 4 success now
  routes to `/onboarding/step-5` instead of straight to dashboard.

### Frontend — Threat Readiness dashboard tab

- **CREATED** `app/dashboard/threats/page.tsx` — client wrapper around
  `ThreatReadinessView`, using `useAuth` to resolve the active org.
- **CREATED** `components/threats/ThreatReadinessView.tsx` — top-level state
  holder. Handles loading, precondition empty states (no tech stack / no
  assessment), error, success. Holds either-threat-or-control selection.
- **CREATED** `components/threats/ThreatReadinessHeader.tsx` — title, subtitle,
  Last Updated, Refresh button (admin only), generation warning banner.
- **CREATED** `components/threats/ThreatReadinessSplitLayout.tsx` — CSS grid
  `grid-rows-[40%_60%]` with glass border between regions.
- **CREATED** `components/threats/ThreatList.tsx` — three groups (HIGH /
  MEDIUM / LOWER PRIORITY), severity icons, active-row orange-glow border,
  inline rename + "Doesn't apply" toggle for admins (calls PATCH endpoint).
  *No drag-and-drop in this build* — see Deferred Items below.
- **CREATED** `components/threats/KeyControlsPanel.tsx` — oversized faded
  "01 / KEY LEVERS" heading + 5 score rows with Geist Mono numbers and trend
  arrows.
- **CREATED** `components/threats/ThreatReadinessDetailPane.tsx` — switches
  between threat / control / empty content.
- **CREATED** `components/threats/ThreatDetailContent.tsx` — narrative,
  industry context, tech stack context, inline control snippets (each links
  to its assessment page).
- **CREATED** `components/threats/ControlDetailContent.tsx` — control
  headline, current/previous scores, inline SVG sparkline placeholder,
  framework refs (clickable into assessment view), "Appears in N threats" with
  clickable threat names that switch the selection.
- **CREATED** `components/threats/SeverityIcon.tsx` — severity → SVG + colour.
- **CREATED** `components/threats/EmptyStates.tsx` — pre-condition empty
  states (no tech stack, no assessment, generation failure, etc.) with
  appropriate CTAs.

### Sidebar

- **MODIFIED** `components/layout/LeftSidebar.tsx` — added "Threat Readiness"
  sub-link in Dashboards group between "Industry View" and "Framework View".
  Added "Tech Stack" sub-link in Organisation Settings group between
  "Preferences" and "Billing".

### Tests

- **CREATED** `tests/orchestration/threatReadiness.test.ts` — 14 tests:
  `mergeCustomizations()` × 6 cases, `buildThreatReadinessMessages()` × 2
  (snapshot + stricter), `TechStackProfileSchema` valid + invalid,
  `ThreatReadinessPayloadSchema` valid + min-threats + key-controls-count,
  `ThreatGenerationInputSchema` invalid.
- **CREATED** `tests/orchestration/threatCacheInvalidator.test.ts` — 3 tests
  with mocked Supabase admin client: empty-id no-op, happy-path delete,
  error path.

---

## 2. Migration push status

```
$ npx supabase db push --project-ref gksfyflhnihdizegeglc
Applying migration 20260507000001_threat_readiness.sql...
Finished supabase db push.
```

Tables exist; `is_org_member()` / `is_org_admin()` used as expected for RLS.

---

## 3. API endpoint signatures

All routes use `requireApiUser`. Mutating "admin only" routes assert
`is_org_admin` via `requireOrgAdmin`. All errors go through `handleApiError`
which returns sanitised JSON.

| Path | Method | Body | Returns |
|---|---|---|---|
| `/api/v1/tech-stack/discovery/start` | POST | `{ organizationId: string }` | `{ sessionId, openingMessage }` |
| `/api/v1/tech-stack/discovery/message` | POST | `{ sessionId: string, message: string }` | `{ assistantMessage, recapReady, sessionStatus }` |
| `/api/v1/tech-stack/discovery/finalize` | POST | `{ sessionId: string, organizationId: string }` | `{ techStack: TechStackProfile }` |
| `/api/v1/tech-stack/{organizationId}` | GET | — | `{ techStack: TechStackProfile \| null, source, lastValidatedAt, discoveryTranscriptId }` |
| `/api/v1/tech-stack/{organizationId}` | PUT (admin) | `{ techStack: TechStackProfile }` | `{ techStack: StoredTechStack }` |
| `/api/v1/threat-readiness/{organizationId}` | GET | — | `{ payload: ThreatReadinessPayload, lastUpdated, cacheAgeSeconds, warning? }` or 409 with `precondition` body |
| `/api/v1/threat-readiness/{organizationId}/refresh` | POST (admin) | — | same shape as GET |
| `/api/v1/threat-readiness/{organizationId}/order` | PATCH (admin) | `{ orderedKeys: string[] }` | `{ ok: true }` |
| `/api/v1/threat-readiness/{organizationId}/threats/{threatKey}` | PATCH (admin) | `{ custom_headline?: string \| null, applicability?: ThreatApplicability }` | `{ customization: OrganizationThreatCustomization }` |

---

## 4. Orchestrator + handler signatures

```ts
// orchestration/abstraction/claudeOrchestrator.ts
runTechStackDiscoveryTurn(args: {
  transcript: TechStackDiscoveryMessage[];
  orgContext: TechStackDiscoveryOrgContext;
  userId: string;
  organizationId: string;
  sessionId: string;
}): Promise<{ assistantMessage: string; recapReady: boolean }>

extractTechStackJSON(args: {
  transcript: TechStackDiscoveryMessage[];
  userId: string;
  organizationId: string;
  sessionId: string;
}): Promise<TechStackProfile>            // throws TechStackExtractionError

generateThreatReadiness(
  input: ThreatGenerationInput,
  callerContext: { userId: string; organizationId: string },
): Promise<{ payload: ThreatReadinessPayload; warning?: string }>

// orchestration/handlers/techStackHandler.ts
startDiscoverySession(orgId, userId): Promise<{ sessionId, openingMessage }>
appendDiscoveryMessage(sessionId, userMessage, callerUserId):
  Promise<{ assistantMessage, recapReady, sessionStatus }>
finalizeDiscovery(sessionId, orgId, userId): Promise<{ techStack }>
getTechStack(orgId): Promise<StoredTechStack | null>
upsertTechStackProfile(orgId, profile, source, discoveryTranscriptId?):
  Promise<StoredTechStack>

// orchestration/handlers/threatReadinessHandler.ts
getThreatReadiness(orgId): Promise<ThreatReadinessResponse>
                                       // throws ThreatReadinessPreconditionError
regenerateThreatReadiness(orgId): Promise<ThreatReadinessResponse>
applyCustomization(orgId, threatKey, patch, userId):
  Promise<OrganizationThreatCustomization>
reorderThreats(orgId, orderedKeys, userId): Promise<void>
mergeCustomizations(payload, customizations): ThreatReadinessPayload  // pure

// orchestration/cache/threatCacheInvalidator.ts
invalidateThreatCache(organizationId: string): Promise<void>
```

---

## 5. Verification results

| Step | Result | Notes |
|---|---|---|
| `npx supabase db push --project-ref gksfyflhnihdizegeglc` | ✅ | Migration applied. CLI didn't recognise `--project-ref` on `migration list` (CLI v2.75) but `db push` accepted it via existing project link. |
| `npm run lint` | ✅ | No ESLint warnings or errors. |
| `npm run build` | ✅ | TypeScript strict pass. Initial failure due to `/u` regex flag (tsconfig has no `target` so defaults to ES3); flag dropped — pattern is plain ASCII so behaviour is identical. |
| `npm test` | ✅ | 10 suites, 40 tests pass (incl. 17 new threat-readiness/cache tests). |
| `npx playwright test` | not run | Existing repo has Playwright config but no infrastructure to seed an authenticated org with a complete assessment + tech stack within a smoke test. New E2E coverage deferred — see below. |

---

## 6. Issues encountered & resolutions

1. **`u` regex flag broke build** — `types/threatReadiness.ts` had two
   `/^[a-z0-9_]+$/u` regexes; the absence of `target` in `tsconfig.json` made
   tsc reject the Unicode flag. Removed `u`; the patterns are pure ASCII so
   behaviour is unchanged.
2. **`chat_transcripts` schema mismatch** — spec assumed a `phase` column +
   nullable `session_id`, neither exists. Created two purpose-built tables
   (`tech_stack_discovery_sessions`, `tech_stack_discovery_messages`) and
   pointed `organization_tech_stack.discovery_transcript_id` at the new
   sessions table.
3. **`onboarding_step` constraint** — historical `CHECK (BETWEEN 0 AND 5)`
   conflicted with the new optional step 5. Migration relaxes the upper bound
   to 6, and the layout/progress UI was updated to "STEP NN / 05".
4. **Existing onboarding completion** — `app/api/v1/onboarding/complete`
   already only requires steps 1–4. No change required to keep step 5
   optional.
5. **API ↔ orchestration coupling** — new API routes call orchestration
   functions directly rather than through `/api/internal`. The internal
   action layer is reserved for the Cypher state machine; the Threat
   Readiness flow is straight request/response so the indirection would only
   add latency.
6. **Hook style** — picked `useState`/`useEffect` to match existing
   `usePostLogin`. React Query is already in `package.json` for other
   features but is not the prevailing pattern; introducing a query client at
   the new pages would have been an out-of-scope migration.

---

## 7. Deferred items

- **Drag-and-drop reorder on `ThreatList`** — backend (`PATCH /order`,
  `reorderThreats`) is wired and the UI exposes the order, but DnD
  interaction was not built (would need `@dnd-kit/core` + `@dnd-kit/sortable`
  + accessibility wiring). Admins can still reorder via the API. UI handle is
  stubbed visually; promote when DnD is added.
- **Threat-readiness E2E in Playwright** — happy-path test through onboarding
  step 5 → threats tab. Skipped because the repo doesn't have an existing
  pattern for seeding an authed org with a completed assessment and a
  Sonnet-key-required generation step.
- **Sparkline chart** — `ControlDetailContent` renders a hand-rolled SVG
  sparkline placeholder with a single trend gradient. If the rest of the app
  later adopts a charting lib (`recharts` is **not** in `package.json`
  today), swap in a real component.
- **Cache invalidation on per-control score updates** — the engine entry
  point is `calculateDomainScore` (where domain-level rolls are persisted).
  Hook is wired there. If individual control scoring writes elsewhere bypass
  domain rollup, those code paths should add the same best-effort call.

---

## 8. Notes for the next agent

- All Claude calls go through `claudeOrchestrator.ts`. The `callClaudeMultiTurn`
  helper is private — consume it via the three exported wrappers
  (`runTechStackDiscoveryTurn`, `extractTechStackJSON`,
  `generateThreatReadiness`).
- `mergeCustomizations` is pure — extend its tests if you change ordering
  rules.
- The cache key is the full `ThreatGenerationInput` (org context + tech stack
  + sorted assessed controls). Any new field that should bust the cache must
  flow through `buildGenerationInput` so it reaches the hash.
- `ThreatReadinessPreconditionError` carries the precondition state for the
  API handler to translate into the right empty-state shape. Don't unwrap it
  silently.
- The threat readiness `warning` field is surfaced in the UI by
  `ThreatReadinessHeader` — wire any future degraded-mode signals through it.
- Sidebar additions are gated by the existing `useAuth().isAdmin`; keep new
  admin-only links inside the `{isAdmin && …}` blocks already present.
```

---

## FILE: `HANDOFF_1_INFRASTRUCTURE.md`

Path: `agents/HANDOFF_1_INFRASTRUCTURE.md`

```markdown
# HANDOFF_1 — Agent Infra + Auth Complete

## What Was Built
- `.cursorrules` - Persistent Cursor rules file with the 20 locked rules.
- `.env.example` - Environment variable template with required and optional keys.
- `.prettierrc.json` - Prettier configuration.
- `tsconfig.json` - Strict TS config with required path aliases.
- `tailwind.config.ts` - Tailwind content paths aligned with app/components/lib.
- `middleware.ts` - Route protection, auth checks, session refresh, internal secret guard.
- `lib/config/env.ts` - Zod environment validation and typed config exports.
- `lib/config/index.ts` - Re-export of typed config.
- `lib/db/client.ts` - Browser Supabase client abstraction + typed DB shape.
- `lib/db/admin.ts` - Admin Supabase client abstraction (service role key).
- `lib/db/server.ts` - Server component + middleware Supabase clients.
- `lib/db/queries.ts` - Generic query helpers (`getById`, `getByOrgId`, `insertRow`, `updateRow`, `softDeleteRow`) with org filter safeguards.
- `lib/db/index.ts` - DB abstraction exports.
- `lib/auth/client.ts` - Client auth helpers (`signUp`, `signIn`, `signOut`, `getUser`, `onAuthStateChange`).
- `lib/auth/server.ts` - Server auth helpers (`getServerUser`, `requireAuth`, `refreshSession`).
- `lib/auth/context.tsx` - `AuthProvider` + `useAuth` hook with organization loading.
- `lib/auth/index.ts` - Client-safe auth exports.
- `app/(auth)/login/page.tsx` - Login page.
- `app/(auth)/signup/page.tsx` - Signup page.
- `app/(auth)/verify/page.tsx` - Verification instruction page.
- `app/auth/callback/route.ts` - Supabase PKCE auth callback handler.
- `app/onboarding/page.tsx` - Multi-step onboarding flow (org setup + initial framework scores + optional user name update).
- `app/dashboard/page.tsx` - Initial dashboard placeholder.
- `app/assessment/page.tsx` - Initial assessment placeholder.
- `app/api/internal/test/route.ts` - Internal API test endpoint.
- `app/page.tsx` - Minimal marketing/entry page.
- `app/layout.tsx` - App metadata update + auth provider wrapper.
- `supabase/migrations/001_simplify_schema.sql` - Core schema migration with tables, indexes, RLS, and audit logging trigger.
- `CLAUDE.md` - Updated operational doc with stack, rules, envs, run/test commands, and structure.
- Structural placeholder files were created for required folders in `app/`, `orchestration/`, `lib/`, `components/`, `types/`, and `supabase/migrations/` during Task 1.1.

## Confirmed Working
- `npm run lint` passes with zero warnings/errors.
- `npm run build` passes with strict type-checking (using valid env values in command scope).
- `/api/internal/test` returns `403` without `x-orchestration-secret`.
- `/api/internal/test` returns `200` with valid `x-orchestration-secret`.
- Middleware is enforcing protected route guards for `/dashboard/*`, `/assessment/*`, and `/api/v1/*`.

## Environment Variables Set
- Required server variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`
  - `ANTHROPIC_API_KEY`
  - `ORCHESTRATION_SECRET`
  - `VIK_ALERT_EMAIL`
- Required client-safe variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_URL`
- Optional phase 7 variables:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `PDF_STORAGE_BUCKET`

## Database Tables Created
- Migration file created:
  - `supabase/migrations/001_simplify_schema.sql`
- New tables created by migration:
  - `users`
  - `organizations`
  - `assessment_sessions` (uses `domain_ref_id`; removed duplicated `current_domain_id` issue)
  - `control_responses`
  - `extracted_signals`
  - `domain_scores`
  - `framework_scores`
  - `chat_transcripts`
  - `compliance_tracker`
- `session_metadata_log`
- `risk_control_mappings`
  - `organization_risks`
  - `claude_api_usage`
  - `audit_log`

## Supabase Column Names (Existing Tables Inspected)
Column inventory captured from linked Supabase project using:
`npx supabase gen types typescript --linked --schema public`

- `domains`
  - `domain_description`
  - `domain_key`
  - `domain_name`
  - `frameworks`
  - `id`

- `ft_iso_controls`
  - `audit_focus`
  - `best_practices`
  - `business_outcomes`
  - `common_tools`
  - `control_id`
  - `control_name`
  - `control_text`
  - `created_at`
  - `domain`
  - `evidence_requirements`
  - `id`
  - `implementation_steps`
  - `maturity_tier_1`
  - `maturity_tier_2`
  - `maturity_tier_3`
  - `maturity_tier_4`
  - `ongoing_duties`
  - `pitfalls`
  - `purpose`
  - `related_controls`
  - `risk_of_not_implementing`
  - `source_version`
  - `why_implement`

- `ft_nist_controls`
  - `audit_focus`
  - `best_practices`
  - `business_outcomes`
  - `category`
  - `common_tools`
  - `control_id`
  - `control_text`
  - `created_at`
  - `evidence_requirements`
  - `function_name`
  - `id`
  - `implementation_steps`
  - `maturity_tier_1`
  - `maturity_tier_2`
  - `maturity_tier_3`
  - `maturity_tier_4`
  - `ongoing_duties`
  - `pitfalls`
  - `purpose`
  - `related_controls`
  - `risk_of_not_implementing`
  - `source_version`
  - `subcategory`
  - `why_implement`

- `top_risks`
  - `created_at`
  - `domain_name`
  - `domain_slug`
  - `id`
  - `iso_controls`
  - `nist_categories`
  - `risks`
  - `sort_order`

- `control_mappings`
  - `control_id_a`
  - `control_id_b`
  - `framework_a`
  - `framework_b`
  - `id`
  - `mapping_notes`
  - `mapping_strength`

- `controls`
  - `cmmi_maturity`
  - `complementary_tools`
  - `control_id`
  - `control_name`
  - `domain_id`
  - `framework`
  - `framework_version`
  - `how_to_implement`
  - `id`
  - `last_reviewed`
  - `ongoing_tasks`
  - `related_controls`
  - `what_is_expected`
  - `what_it_means`
  - `why_it_matters`

## API Contracts Established
- Auth abstraction contracts in `/lib/auth/` are now in place and can be reused by API and orchestration layers.
- DB abstraction contracts in `/lib/db/` are now in place and used instead of direct client construction in app code.
- Internal route guard contract:
  - `/api/internal/*` requires `x-orchestration-secret` matching `ORCHESTRATION_SECRET`.

## Known Issues / Debt
- Full end-to-end hosted auth verification (real signup email, callback completion, org creation in live DB) was not executed against production-like keys in `.env.local` because local env is currently blank.
- Migration has not been pushed yet to the linked project due remote migration history mismatch warning. Recommended next action before push:
  - `npx supabase migration repair --status applied 001`
  - then `npx supabase db push --project-ref gksfyflhnihdizegeglc`

## Next Agent Instructions
- Start by reading this file, then use `/lib/db/*` and `/lib/auth/*` abstractions directly.
- Use the exact existing table columns listed above when implementing RAG and orchestration queries.
- Keep all Claude calls in `/api/internal/*` orchestration only.
- Respect environment usage rule: no direct `process.env` outside `/lib/config/env.ts`.
- When implementing orchestration writes, rely on `organization_id` + RLS policy assumptions already scaffolded in migration.
```

---

## FILE: `HANDOFF_2_ORCHESTRATION.md`

Path: `agents/HANDOFF_2_ORCHESTRATION.md`

```markdown
# HANDOFF_2 — Agent Orchestration Complete

## What Was Built
- `app/api/internal/route.ts` - Internal orchestration entrypoint with timing-safe secret gate, action router, and audit logging.
- `orchestration/abstraction/claudeOrchestrator.ts` - Claude abstraction layer implementing 8 orchestrator functions, retry/backoff, usage checks, and token usage logging.
- `orchestration/rag/contextBuilder.ts` - Three-pass RAG context builder (explicit ID extraction, Haiku resolver, offline fallback).
- `orchestration/scoring/maturityEngine.ts` - Scoring logic and persistence for domain/framework scores.
- `orchestration/session/stateMachine.ts` - Session lifecycle and scope signal tracking state machine.
- `orchestration/monitoring/usageMonitor.ts` - Usage limit checks, increments, usage logging, and alert stubs.
- `orchestration/compliance/cadenceEngine.ts` - Compliance cadence/due-control logic and reassessment checks.
- `orchestration/handlers/sessionHandler.ts` - Start session + greeting handler.
- `orchestration/handlers/responseHandler.ts` - Submit response orchestration handler.
- `orchestration/handlers/signalHandler.ts` - Extract signals handler wrapper.
- `orchestration/handlers/scoreHandler.ts` - Score domain handler wrapper.
- `orchestration/handlers/usageHandler.ts` - Usage check handler wrapper.
- `orchestration/handlers/index.ts` - Handler exports.
- `orchestration/abstraction/index.ts` - Abstraction exports.
- `orchestration/rag/index.ts` - RAG exports.
- `orchestration/scoring/index.ts` - Scoring exports.
- `orchestration/session/index.ts` - Session exports.
- `orchestration/monitoring/index.ts` - Monitoring exports.
- `orchestration/compliance/index.ts` - Cadence exports.
- `types/orchestration.ts` - Shared orchestration domain types.
- `types/index.ts` - Re-export orchestration types.
- `jest.config.ts` - Jest + ts-jest config for orchestration tests.
- `tests/setupEnv.ts` - Test env bootstrap for required runtime env vars.
- `tests/orchestration/maturityEngine.test.ts` - Scoring unit tests.
- `tests/orchestration/contextBuilder.test.ts` - RAG pass tests (pass 1 and fallback).
- `tests/orchestration/stateMachine.test.ts` - Scope completion tests (6 vs 7 signals).
- `tests/orchestration/usageMonitor.test.ts` - Usage threshold tests (239/240/299/300).
- `tests/orchestration/cadenceEngine.test.ts` - Due-control categorization tests.
- `package.json` - Added `npm test` script.

## Confirmed Working
- `npm run lint` passes.
- `npm run build` passes (with required env vars set in command scope).
- `npm test` passes with zero test failures.
- `/api/internal` now enforces `x-orchestration-secret` using timing-safe comparison and returns 403 on mismatch.
- Internal action router responds for:
  - `start_session`
  - `submit_response`
  - `extract_signals`
  - `score_domain`
  - `check_usage`
  - `generate_greeting`

## Environment Variables Set
- Required by orchestration runtime:
  - `ANTHROPIC_API_KEY` (Claude API)
  - `ORCHESTRATION_SECRET` (internal API gate)
  - `SUPABASE_URL` (admin DB client)
  - `SUPABASE_SERVICE_KEY` (admin DB client)
  - `VIK_ALERT_EMAIL` (usage alert target)
- Already required globally and reused:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_URL`

## Database Tables Created
- No new migration file created in Agent 2.
- Reused migration from Agent 1:
  - `supabase/migrations/001_simplify_schema.sql`
- Orchestration writes to existing/newly provisioned tables:
  - `assessment_sessions`
  - `chat_transcripts`
  - `control_responses`
  - `extracted_signals`
  - `domain_scores`
  - `framework_scores`
  - `compliance_tracker`
  - `claude_api_usage`
  - `audit_log`
  - `session_metadata_log`

## Supabase Column Names (Existing Tables Inspected)
- Reused authoritative column inventory from `HANDOFF_1.md` for:
  - `domains`
  - `ft_iso_controls`
  - `ft_nist_controls`
  - `top_risks`
  - `control_mappings`
  - `controls`

## API Contracts Established

### Exported Function Signatures

**`claudeOrchestrator.ts`**
- `extractSignals(userMessage: string, controlContext: string, sessionHistory: string, controlId: string, controlName: string, controlRequirement: string, priorSignals: ExtractedSignal[], orgContext: OrgContext): Promise<SignalExtractionResult>`
- `generateFollowUpQuestion(missingElements: string[], confirmedSignals: ExtractedSignal[], clarificationRound: number, controlId: string, controlName: string): Promise<string>`
- `detectContradiction(previousStatement: string, previousDate: string, previousControlName: string, newStatement: string, currentControlName: string, contradictionDetail: string): Promise<string>`
- `generateAgentMessage(context: AgentMessageContext, messageType: AgentMessageType): Promise<string>`
- `generateDomainCompletionMessage(domainData: DomainCompletionData): Promise<string>`
- `generateSessionOpening(sessionContext: SessionOpeningContext): Promise<string>`
- `resolveControlsFromNaturalLanguage(message: string, framework: Framework): Promise<string[]>`
- `generateRiskControlMapping(customRiskDescription: string, framework: Framework): Promise<string[]>`

**`contextBuilder.ts`**
- `buildRagContext(message: string, framework: Framework, _supabase?: unknown): Promise<string | null>`

**`maturityEngine.ts`**
- `calculateControlScore(signals: SignalForScoring[]): number`
- `calculateDomainScore(domainId: string, frameworkId: string, orgId: string): Promise<DomainScoreResult>`
- `calculateFrameworkScore(frameworkId: Framework, orgId: string): Promise<FrameworkScoreResult>`
- `calculateScoreDelta(previousScore: number | null, newScore: number): ScoreDelta`
- `applyCompliancePenalty(score: number, isOverdue: boolean): number`
- `getMaturityLabel(score: number): string` *(additional helper exported)*

**`stateMachine.ts`**
- `initSession(sessionId: string, userId: string, orgId: string, frameworkId: string | null): Promise<SessionState>`
- `getSessionState(sessionId: string): Promise<SessionState>`
- `updateSessionPhase(sessionId: string, newPhase: SessionPhase, metadata?: Record<string, unknown>): Promise<void>`
- `resumeSession(sessionId: string): Promise<SessionResumeData>`
- `recordScopeSignal(sessionId: string, signalType: string, value: string): Promise<{ scopeComplete: boolean }>`
- `pauseSession(sessionId: string): Promise<void>`
- `completeSession(sessionId: string): Promise<void>`
- `abandonSession(sessionId: string): Promise<void>`
- `buildSessionContext(sessionId: string): Promise<SessionContext>`

**`usageMonitor.ts`**
- `checkUsageLimit(userId: string): Promise<{ allowed: boolean; callsRemaining: number; callsUsed: number; message?: string }>`
- `incrementUsage(userId: string, callType: string, tokensInput: number, tokensOutput: number, organizationId: string, sessionId: string): Promise<void>`
- `alertIfApproachingLimit(userId: string, callsUsed: number): Promise<void>`
- `resetMonthlyUsage(userId: string): Promise<void>`

**`cadenceEngine.ts`**
- `checkDueControls(orgId: string, frameworkId: Framework): Promise<DueControlsSummary>`
- `updateCadenceRecord(orgId: string, controlId: string, frameworkId: Framework, reviewedAt: Date): Promise<void>`
- `generateCadenceSummary(orgId: string): Promise<CadenceSummary>`
- `triggerReassessmentCheck(orgId: string): Promise<{ shouldReassess: boolean; reason: string | null }>`

### Internal API Action Strings (Agent 3 must use exactly)
- `start_session`
- `submit_response`
- `extract_signals`
- `score_domain`
- `check_usage`
- `generate_greeting`

### `/api/internal` Request / Response Shape

**Request**
```json
{
  "action": "start_session | submit_response | extract_signals | score_domain | check_usage | generate_greeting",
  "userContext": {
    "userId": "string",
    "organizationId": "string",
    "sessionId": "string (optional)",
    "jwtSignature": "string (optional)"
  },
  "payload": {}
}
```

Required header:
- `x-orchestration-secret: <ORCHESTRATION_SECRET>`

**Success Response**
```json
{
  "ok": true,
  "action": "<echoed-action>",
  "data": {}
}
```

**Error Responses**
- `403` for invalid/missing orchestration secret.
- `400` for unknown action.
- `500` for handler/runtime failures.

## Known Issues / Debt
- Unit coverage is currently below the aspirational 80% target even though required tests are implemented and passing; additional test depth is needed for full orchestration branches.
- `claudeOrchestrator.ts` currently uses compacted prompt implementations (aligned by function intent) rather than full verbatim Section 19 prompt text blocks.
- Usage check context for some orchestration calls uses system placeholders where user context is not yet fully threaded through all call sites.
- `incrementUsage` attempts RPC `increment_claude_usage` and falls back to manual increment if RPC is absent.

## Next Agent Instructions
- Build `/api/v1/*` routes by calling `/api/internal` action router with the exact action strings listed above.
- Pass full `userContext` (`userId`, `organizationId`, `sessionId`) through every internal call so usage logging is always attributable.
- Keep all Claude calls inside `claudeOrchestrator.ts`; do not add API model calls elsewhere.
- For production hardening, expand test suite coverage for:
  - `claudeOrchestrator` retry/error branches
  - state transitions beyond scope signal tracking
  - scoring persistence branches and compliance penalty application in full flow
```

---

## FILE: `HANDOFF_3_APILAYER.md`

Path: `agents/HANDOFF_3_APILAYER.md`

```markdown
# HANDOFF_3 — Agent API Layer Complete

## What Was Built
- `middleware.ts` updated with:
  - per-user in-memory rate limiting for `/api/v1/*` (100/min and 1000/hour),
  - security headers on all middleware responses,
  - CORS restriction for API calls to `NEXT_PUBLIC_APP_URL`,
  - request size enforcement (`413` for >10MB),
  - audit logging hooks for rate-limit events.
- `lib/api/response.ts` added:
  - `apiSuccess`, `apiError`, `validateBody`,
  - standard error code catalog.
- `lib/api/sanitize.ts` added:
  - HTML/script stripping, trimming, recursive object sanitization, UUID validation helper.
- `lib/api/auth.ts` added:
  - API auth helper wrapper + organization ownership assertion.
- `lib/api/orchestrationClient.ts` added:
  - typed `/api/internal` action caller with secret header forwarding.
- Framework libraries added:
  - `lib/frameworks/iso27001.ts`
  - `lib/frameworks/nistcsf.ts`
  - `lib/frameworks/domains.ts`
  - `lib/frameworks/index.ts` exports updated.
- API types added:
  - `types/api.ts`
  - `types/index.ts` exports updated.
- Public API endpoints implemented:
  - `POST /api/v1/assessments/sessions`
  - `POST /api/v1/assessments/sessions/[sessionId]/responses`
  - `GET /api/v1/assessments/sessions/[sessionId]`
  - `PUT /api/v1/assessments/sessions/[sessionId]/responses/[responseId]`
  - `GET /api/v1/assessments/organizations/[orgId]/scores`
  - `GET /api/v1/assessments/organizations/[orgId]/sessions`
  - `GET/POST /api/v1/assessments/organizations/[orgId]/risks`
  - `POST /api/v1/assessments/sessions/[sessionId]/export`
  - `POST /api/v1/assessments/organizations/[orgId]/reassess`
  - `POST /api/v1/notifications/preferences`
  - `POST /api/v1/notifications/send`
  - `GET /api/v1/assessments/organizations/[orgId]/export/bi`
- API integration-style tests added:
  - `tests/api/endpoints.test.ts`

## Confirmed Working
- `npm run lint` passes.
- `npm run build` passes.
- `npm test` passes (including orchestration + API tests).
- Dynamic API routes are compiled and discoverable by Next build output under `/api/v1/*`.

## Environment Variables Set
- Required for this layer:
  - `NEXT_PUBLIC_APP_URL` (CORS and internal call base URL)
  - `ORCHESTRATION_SECRET` (internal action call auth)
  - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (current DB access path in API helpers)
  - Auth/env values inherited from Agent 1 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.)

## Database Tables Created
- No new DB migration file in Agent 3.
- Reused schema from:
  - `supabase/migrations/001_simplify_schema.sql`

## Supabase Column Names (Existing Tables Inspected)
- Reused authoritative inventory from `HANDOFF_1.md`:
  - `domains`, `ft_iso_controls`, `ft_nist_controls`, `top_risks`, `control_mappings`, `controls`

## API Contracts Established

### Endpoint Inventory (URL, Method, Auth, Response)
- `POST /api/v1/assessments/sessions`
  - **Auth:** JWT required.
  - **Response:** `SessionStartResponse` shape (`sessionId`, `phase`, `agentGreeting`, `firstMessage`, `cadenceSummary`, `sessionProgress`).
- `POST /api/v1/assessments/sessions/[sessionId]/responses`
  - **Auth:** JWT + session/org ownership.
  - **Response:** `{ responseId, agentMessage, phase, extractedSignals, controlStatus, nextAction, domainScoreUpdate, apiUsageWarning }`.
- `GET /api/v1/assessments/sessions/[sessionId]`
  - **Auth:** JWT + session/org ownership.
  - **Response:** session row + `chatHistory`.
- `PUT /api/v1/assessments/sessions/[sessionId]/responses/[responseId]`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ newResponse, scoreRecalculation }`.
- `GET /api/v1/assessments/organizations/[orgId]/scores`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ domains, frameworks, history }`.
- `GET /api/v1/assessments/organizations/[orgId]/sessions`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ sessions }` with optional query filtering.
- `GET /api/v1/assessments/organizations/[orgId]/risks`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ risks }`.
- `POST /api/v1/assessments/organizations/[orgId]/risks`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ risk }`.
- `POST /api/v1/assessments/sessions/[sessionId]/export`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ downloadUrl, expiresAt }`.
- `POST /api/v1/assessments/organizations/[orgId]/reassess`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ sessionId, agentGreeting }`.
- `POST /api/v1/notifications/preferences`
  - **Auth:** JWT required.
  - **Response:** `{ notificationPreferences }`.
- `POST /api/v1/notifications/send`
  - **Auth:** internal `x-orchestration-secret` required.
  - **Response:** `{ queued: true }`.
- `GET /api/v1/assessments/organizations/[orgId]/export/bi`
  - **Auth:** JWT + org ownership.
  - **Response:** `{ version, scores, controls, signals, history }`.

### Zod Schema Names
- `StartSessionSchema`
- `SubmitResponseSchema`
- `RevisionSchema`
- `AddRiskSchema`
- `ExportSchema`
- `ReassessSchema`
- `PreferencesSchema`
- `SendSchema`

### Exported Types from `/types/api.ts`
- `AgentMessage`
- `SessionStateApi`
- `DomainScore`
- `FrameworkScore`
- `SessionStartResponse`

### Internal Action Strings Used from API Layer
- `start_session`
- `submit_response`
- `generate_greeting`

### ISO 27001 Control Library Structure
- File: `lib/frameworks/iso27001.ts`
- Export: `ISO27001_CONTROLS: IsoControl[]`
- `IsoControl` shape:
  - `controlId`, `groupId`, `controlName`, `description`, `requirements`, `reviewFrequencyDays`, `weight`, `questionText`, `questionContext`, `followUpTemplates`
- Group IDs used:
  - `org_context`
  - `asset_mgmt`
  - `access_identity`
  - `supplier_security`
  - `incident_mgmt`
  - `business_continuity`
  - `compliance_legal`
  - `physical_security`
  - `tech_controls`

### NIST CSF Control Library Structure
- File: `lib/frameworks/nistcsf.ts`
- Export: `NIST_CSF_CONTROLS: NistControl[]`
- `NistControl` shape:
  - `controlId`, `functionId`, `categoryId`, `description`, `requirements`, `reviewFrequencyDays`, `weight`, `questionText`
- Function/category model:
  - `GV` (`OC`, `RM`, `RR`, `PO`, `OV`, `SC`)
  - `ID` (`AM`, `RA`, `IM`)
  - `PR` (`AA`, `AT`, `DS`, `PS`, `IR`)
  - `DE` (`CM`, `AE`)
  - `RS` (`MA`, `AN`, `CO`, `MI`)
  - `RC` (`RP`, `CO`)

## Known Issues / Debt
- Rate limiting is in-memory middleware storage (MVP), not distributed.
- `notifications/send` is currently a logging stub; no provider integration yet.
- PDF export endpoint currently returns signed-link style metadata without full PDF rendering/storage pipeline.
- Risk POST endpoint currently stores custom risk metadata with empty mapped control list (mapping pipeline can be expanded in next pass).
- Middleware adds security headers through middleware responses; additional route-level hardening can be layered later if needed.

## Next Agent Instructions
- Use API responses/types from `types/api.ts` and endpoint contracts above for frontend integration.
- Frontend should call only `/api/v1/*` routes and avoid direct DB or orchestration calls.
- Use `SessionStartResponse` and `AgentMessage` as base client models for assessment/chat state.
- Build UI state transitions around:
  - session start (`/api/v1/assessments/sessions`)
  - submit response (`/api/v1/assessments/sessions/[sessionId]/responses`)
  - session refresh (`/api/v1/assessments/sessions/[sessionId]`)
```

---

## FILE: `HANDOFF_4_DASHBOARD_UIUX.md`

Path: `agents/HANDOFF_4_DASHBOARD_UIUX.md`

```markdown
# HANDOFF_4 — Agent Frontend Complete

## What Was Built
- `styles/design-system.ts` - Design token source and Tailwind extension exports for dark ops visual system.
- `tailwind.config.ts` - Updated to consume shared design-system token extension.
- `app/globals.css` - Dark theme CSS variables, typography variables, and utility classes.
- `app/layout.tsx` - Google fonts wired (DM Serif Display, DM Sans, JetBrains Mono) + React Query provider composition with auth provider.
- `components/providers.tsx` - QueryClientProvider wrapper for frontend data hooks.
- `components/ui/utils.ts` - `cn()` utility via `clsx` + `tailwind-merge`.
- `components/ui/Button.tsx` - Variant/size button primitive with loading spinner and focus states.
- `components/ui/Card.tsx` - Card primitive with default/elevated/interactive variants.
- `components/ui/Badge.tsx` - Framework/status/maturity badge primitive.
- `components/ui/Input.tsx` - Input/textarea primitives with dark theme focus/error support.
- `components/ui/ScoreDisplay.tsx` - Mono score rendering with delta direction visuals and maturity line.
- `components/ui/index.ts` - UI primitive barrel exports.
- `lib/api/client.ts` - Typed fetch wrapper with JWT header support, 401 redirect, and 429 user-friendly error handling.
- `lib/api/hooks/useAssessment.ts` - React Query hooks for all major assessment/scores/risk/export/reassess/revision routes.
- `lib/api/hooks/index.ts` - Hook barrel export.
- `components/layout/NotificationBell.tsx` - Notification bell with unread badge, grouped dropdown, and mark-all-read behavior.
- `components/onboarding/EmptyState.tsx` - Cinematic onboarding empty state with pulsing Cypher avatar and staged reveal card/skeletons.
- `components/chat/CypherChat.tsx` - Consultant-style chat panel with message variants, typing state, quick chips, multiline input, and char counter.
- `components/dashboard/ScoreCard.tsx` - Animated framework score card with sparkline and progress bar.
- `components/dashboard/RadarChart.tsx` - D3 radar chart with current/previous polygons and domain hover bindings.
- `components/dashboard/ScoreTimeline.tsx` - D3 timeline view with selectable historical freeze banner and range controls.
- `components/dashboard/DomainCard.tsx` - Domain maturity cards with score bands, deltas, progress, and CTA state.
- `components/dashboard/RiskView.tsx` - Risk enablement UX with template risks, custom risk input, and profile cards.
- `components/dashboard/ComplianceCalendar.tsx` - Compliance cadence sections (overdue/due soon) with review actions.
- `components/assessment/GroupView.tsx` - Assessment left-rail domain/group/control progress view.
- `components/assessment/DomainCompleteOverlay.tsx` - Animated domain completion modal with score delta and continuation action.
- `components/assessment/AnswerRevision.tsx` - Right-side revision drawer with original/revised answer workflow.
- `components/assessment/SessionTimeoutHandler.tsx` - Per-tab inactivity warning + pause/resume modal.
- `components/assessment/AssessmentController.tsx` - Phase-driven assessment experience coordinator (discovery/framework/scope/baseline).
- `app/dashboard/layout.tsx` - Dashboard shell: collapsible sidebar, framework switch badges, top header, notifications.
- `app/dashboard/page.tsx` - Three-tab dashboard composition using score cards, radar, timeline, domain cards, compliance, and risk views.
- `app/assessment/page.tsx` - Assessment route wired to `AssessmentController`.

## Confirmed Working
- `npm run lint` passes with zero warnings/errors.
- `npm run build` passes with strict type checking.
- Frontend routes compile and render:
  - `/dashboard`
  - `/assessment`
- Required frontend dependency stack installed and resolved:
  - `framer-motion`, `recharts`, `d3`, `@types/d3`, `lucide-react`, `clsx`, `tailwind-merge`, `@tanstack/react-query`.

## Environment Variables Set
- No new env vars introduced in Agent 4.
- Frontend uses existing `NEXT_PUBLIC_APP_URL` for API base resolution in `lib/api/client.ts`.

## Database Tables Created
- No DB migration created in Agent 4.

## Supabase Column Names (Existing Tables Inspected)
- No new Supabase schema inspection in Agent 4.
- Agent 4 continued using canonical inventory from `HANDOFF_1.md`.

## API Contracts Established
- No backend contract changes.
- Frontend hook surface added (consumes Agent 3 endpoints as-is):
  - `useStartSession`
  - `useSubmitResponse`
  - `useSessionState`
  - `useOrgScores`
  - `useSessionHistory`
  - `useOrgRisks`
  - `useExportSession`
  - `useTriggerReassessment`
  - `useReviseAnswer`

## Design System Tokens Defined (Agent 5 Reference)
- `--bg-deep`
- `--bg-surface`
- `--bg-elevated`
- `--accent-primary`
- `--accent-secondary`
- `--success`
- `--warning`
- `--danger`
- `--text-primary`
- `--text-muted`
- `--border`
- `--glow-cyan`
- `--glow-violet`
- `--font-dm-serif`
- `--font-dm-sans`
- `--font-jetbrains-mono`

## API Hook Adjustments Needed (if Agent 3 wants tighter typing)
- Several API route responses are currently inferred as generic objects in hooks where route output types are not yet exported as strongly-typed interfaces beyond `SessionStartResponse` and `AgentMessage`.
- Recommended Agent 3 follow-up: export endpoint response DTOs for scores/history/risks/export/reassess/revision to remove remaining generic response usage in `lib/api/hooks/useAssessment.ts`.

## UX Decisions Made Beyond Spec
- Added lightweight phase toggles in `AssessmentController` to manually simulate phase progression during MVP development/testing.
- Added compact, non-blocking quick-action chips in chat input area as static suggestions (spec requested chip UX; these are ready for API intent wiring).
- Implemented timeline range controls with native sliders for MVP stability; supports future upgrade to custom dual-handle drag behavior.
- Notification stream seeded with local mock data to keep shell UX testable before notification backend is finalized.

## Accessibility Notes
- Notification bell has explicit `aria-label` and keyboard-clickable toggle behavior.
- Chat input textarea includes `aria-label` and supports Enter-to-send / Shift+Enter newline.
- Revision drawer close control includes `aria-label`.
- Visual states maintain focus rings on button primitives via `focus-visible` styles.

## Known Issues / Debt
- Some advanced animation orchestration from spec is simplified (core behavior implemented, but not all cinematic staggering/particle effects finalized).
- Timeline slider currently uses two native range inputs rather than fully custom dual-handle drag control.
- Notification and risk data currently use local mocked client state in UI components.
- Recharts logs width/height warnings during static generation for tiny containers; does not fail build.

## Next Agent Instructions
- Run security/polish pass on all interactive components, specifically:
  - keyboard trap/focus management for overlays/drawers,
  - stricter ARIA labeling and screen-reader announcements,
  - resilience around API failure and retry UX.
- Review `lib/api/client.ts` token strategy (currently localStorage fallback) and align with final auth/JWT source of truth.
- Replace mocked data in `NotificationBell`, `RiskView`, and dev phase toggles with live API-backed state.
- Evaluate and refine animation timing hierarchy across onboarding/chat/domain-complete transitions for final brand polish.

## Visual Review Needed From Vik Before Agent 5
- Confirm dark ops palette intensity (especially cyan glow and card elevation levels).
- Confirm typography balance between DM Serif headings and dense dashboard data regions.
- Confirm dashboard information density and spacing in 3-column domain grid.
- Confirm chat bubble treatment and special message variants (signal/contradiction/score).
- Confirm whether timeline slider interaction needs immediate upgrade from MVP range inputs to fully custom drag handles.
```

---

## FILE: `HANDOFF_7_PRELOGIN_UIUX.md`

Path: `agents/HANDOFF_7_PRELOGIN_UIUX.md`

```markdown
# HANDOFF 7 — Pre-login UI/UX

## Scope completed

- Implemented pre-login marketing shell with shared top nav/footer/theme toggle.
- Implemented auth shell and auth flow stubs.
- Added required auth routes for login, MFA, signup verify, forgot/reset password.
- Added explicit error routes: `/403`, `/404`, `/500`, `/503`.
- Added SEO route artifacts: `app/sitemap.ts`, `app/robots.ts`.
- Added GTM wrapper module for event tracking.

## Key components added

- `components/marketing/TopNav.tsx`
- `components/marketing/Footer.tsx`
- `components/marketing/DarkLightToggle.tsx`
- `components/marketing/MarketingShell.tsx`
- `components/marketing/MarketingPageTemplate.tsx`
- `components/auth/AuthShell.tsx`
- `components/auth/AuthBanner.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/MFAInput.tsx`
- `components/auth/ForgotPasswordForm.tsx`
- `components/auth/ResetPasswordForm.tsx`
- `components/error/ErrorPage.tsx`

## Stub function behavior and params

- `MFAInput`:
  - `onComplete(code: string): void`
  - Called automatically when 6 digits are entered.

- `LoginForm`:
  - Internal submit stub with no API call.
  - Emits generic pre-verification error state.

- `SignupForm`:
  - Internal submit stub with no API call.
  - Redirects to `/signup/verify` in client stub flow.

- `ForgotPasswordForm`:
  - Internal submit stub with no API call.
  - Shows generic confirmation: "If that email exists, we've sent a reset link."

- `ResetPasswordForm`:
  - Internal submit stub with no API call.
  - Redirects to `/reset-password/confirmed`.

## Signup field names (for Agent 8 wiring)

- `full_name`
- `email`
- `password`
- `confirm_password`
- `organization_name`
- `job_title`
- `team_size`
- `industry`

## CSRF token placement

All forms include:

```html
<input type="hidden" name="csrf_token" value="" />
```

Included in:

- `LoginForm`
- `SignupForm`
- `ForgotPasswordForm`
- `ResetPasswordForm`

## Theme toggle implementation details

- Local storage key: `simplify-theme`
- Values: `"dark"` or `"light"`
- Applied via `document.documentElement.setAttribute("data-theme", theme)`
- CSS variable overrides for light mode live in `app/globals.css` under `html[data-theme="light"]`

## GTM details

- Wrapper module: `lib/analytics/gtm.ts`
- Placeholder container ID constant: `GTM-XXXXXXX`
- Event API:
  - `trackEvent(event, payload?)`
  - `trackPageView(path)`

## Known gaps / deferred to Agent 8

- Real auth API calls are not wired.
- Real remember-me session extension is not wired.
- Actual MFA verification and resend cooldown logic are not wired.
- Real CSRF token issuance/validation is not wired.
- Full page-by-page bespoke design parity for all 20 pages still needs visual QA pass.
- Full OG/twitter metadata is currently complete only on core landing route and partially on new pages; standardization pass recommended.
```

---

## FILE: `HANDOFF_8_AUTH_BACKEND.md`

Path: `agents/HANDOFF_8_AUTH_BACKEND.md`

```markdown
# HANDOFF 8 — Auth Backend

## Delivered files

- `app/api/v1/auth/signup/route.ts`
- `app/api/v1/auth/login/route.ts`
- `app/api/v1/auth/logout/route.ts`
- `app/api/v1/auth/session/route.ts`
- `app/api/v1/auth/forgot-password/route.ts`
- `app/api/v1/auth/reset-password/route.ts`
- `app/api/v1/auth/resend-verification/route.ts`
- `app/api/v1/auth/mfa/verify/route.ts`
- `app/api/v1/auth/mfa/enroll/route.ts`
- `app/api/v1/auth/mfa/enroll/verify/route.ts`
- `lib/auth/validation.ts`
- `lib/auth/rateLimiter.ts`
- `lib/auth/routing.ts`
- `lib/auth/mfa.ts`
- `lib/email/resend.ts`
- `supabase/migrations/20260416000003_agent8_auth_backend.sql`
- Updated `app/api/v1/account/route.ts` for soft delete behavior

## Endpoint contracts

### `POST /api/v1/auth/signup`
- Body: `SignupSchema` (`email`, `password`, `full_name`, `organisation_name`, `job_title`, `team_size`, `industry`)
- Success: `202 { success: true, message: "Verification email sent. Please check your inbox." }`
- Errors:
  - `400` invalid payload
  - `409` duplicate-ish generic conflict
  - `429` rate limit
  - `500` generic failure

### `POST /api/v1/auth/login`
- Body: `LoginSchema` (`email`, `password`, `remember_me`)
- Success no MFA: `200 { success: true, requires_mfa: false, redirect }`
- Success MFA: `200 { success: true, requires_mfa: true, factor_id, access_token, redirect: "/login/mfa" }`
- Errors:
  - `401` invalid credentials
  - `403` unverified email
  - `423` lockout from rate limiter
  - `400` invalid payload

### `POST /api/v1/auth/mfa/verify`
- Body: `MFAVerifySchema` (`factor_id`, `code`)
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { success: true, redirect }`
- Errors:
  - `401` invalid code/token
  - `423` lockout
  - `400` invalid payload

### `POST /api/v1/auth/mfa/enroll`
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { success, user_id, totp_uri, qr_code, factor_id, secret }`
- Errors: `401`, `500`

### `POST /api/v1/auth/mfa/enroll/verify`
- Body: `MFAVerifySchema`
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { success: true, message }`
- Errors: `401`, `400`

### `POST /api/v1/auth/forgot-password`
- Body: `ForgotPasswordSchema` (`email`)
- Success always: `200 { success: true, message: "If that email exists, we've sent a reset link." }`

### `POST /api/v1/auth/reset-password`
- Body: `ResetPasswordSchema` (`password`, `confirm_password`)
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { success: true, message, redirect: "/login" }`
- Errors: `400`, `401`

### `POST /api/v1/auth/resend-verification`
- Body: `ForgotPasswordSchema` (`email`)
- Success always: `200 { success: true, message: "If that email is registered and unverified, we've sent a new link." }`

### `POST /api/v1/auth/logout`
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { success: true, redirect: "/" }`
- Errors: `401`

### `GET /api/v1/auth/session`
- Header: `Authorization: Bearer <access_token>`
- Success: `200 { user: { ... } }`
- Errors: `401`

## Rate limiting strategy

- Backed by `public.auth_rate_limits`
- Utility: `lib/auth/rateLimiter.ts`
- Rules:
  - login: 10 attempts / 5 min with 5 min lock
  - mfa: 5 attempts / 5 min with 5 min lock
  - resend: 5 attempts / hour
  - reset: 5 attempts / hour

## Post-login routing

- Helper: `lib/auth/routing.ts`
- Rule:
  - `is_onboarded = false` -> `/onboarding`
  - `is_onboarded = true` -> `/dashboard`

## Soft delete behavior

- Updated `DELETE /api/v1/account` to:
  - set `users.deleted_at`
  - set `users.status = inactive`
  - revoke sessions globally
  - preserve org and assessment data

## Migration details

`20260416000003_agent8_auth_backend.sql` adds:
- `users.deleted_at`
- `users.is_onboarded`
- `auth_rate_limits` table + index + update trigger
- updates `handle_new_auth_user` trigger function to initialize:
  - name from `raw_user_meta_data.full_name`
  - `agent_name = Cypher`
  - `role = admin`
  - `is_onboarded = false`

## Notes for Agent 9 wiring

1. Agent 7 UI still has stub submit handlers. Wire forms to these endpoint paths.
2. For MFA verify and enroll routes, pass bearer access token from login/session context.
3. Login endpoint currently returns `access_token` in MFA-required path for transition flow.
4. `remember_me` is accepted but full cookie/session persistence handling should be completed in integration stage.
5. Welcome email helper exists (`lib/email/resend.ts`) but trigger/event wiring for post-verification send is still pending.
```

---

## FILE: `HANDOFF_9_AUTH_INTEGRATION.md`

Path: `agents/HANDOFF_9_AUTH_INTEGRATION.md`

```markdown
# HANDOFF 9 — Auth UI/API Integration (Agent 9)

## Status
- `npm run lint`: ✅
- `npm run build`: ✅

## Mission Summary
Wired Agent 7 pre-login auth UI stubs to Agent 8 auth backend endpoints to complete end-to-end pre-login flows:
1) Signup (`/signup`)
2) Email verification holding + resend (`/signup/verify`)
3) Email verified confirmation + login entry (`/signup/verified`)
4) Login (`/login`) including MFA handoff
5) MFA code verification (`/login/mfa`)
6) Forgot password (`/forgot-password`)
7) Password reset (`/reset-password`)
8) Logout endpoint cookie clearing (`/api/v1/auth/logout`) (UI button wiring is handled in later post-login work)

## Wired UI ↔ Backend Endpoints

### Flow 1 — Signup (`/signup`)
- UI: `components/auth/SignupForm.tsx`
- POST: `/api/v1/auth/signup`
- On success: redirect to `/signup/verify?email=<email>`
- On error:
  - `409`: `"An account with this email already exists."`
  - other non-2xx: `"Something went wrong. Please try again."` (or a lightweight 429 message)

### Flow 2 — Email Verification Holding (`/signup/verify`)
- UI: `app/(auth)/signup/verify/page.tsx`
- Resend button component: `components/auth/ResendVerificationButton.tsx`
- POST: `/api/v1/auth/resend-verification`
- UX:
  - 60-second client cooldown after resend click
  - after 5 resend clicks within a 1-hour window: show `"You've reached the resend limit. Please try again later."`

### Flow 2.5 — Email Verified (`/signup/verified`)
- UI: `app/(auth)/signup/verified/page.tsx`
- Shows: success heading + `LoginForm` pre-filled using `searchParams.email`
- Login submit on this page is the same `/api/v1/auth/login` flow.

### Flow 3 — Login (`/login`)
- UI: `components/auth/LoginForm.tsx` and `app/(auth)/login/page.tsx`
- POST: `/api/v1/auth/login` with body:
  - `email`
  - `password`
  - `remember_me` (from “Remember me for 7 days” checkbox)
- Success behavior:
  - no MFA (`requires_mfa: false`): redirect to backend-provided `redirect` (typically `/dashboard` or `/onboarding`)
  - MFA required (`requires_mfa: true`): redirect to:
    - `/login/mfa?access_token=<access_token>&factor_id=<factor_id>`
- Errors mapped:
  - `401`: `"Invalid email or password."`
  - `403`: `"Please verify your email address before logging in."` + link to `/signup/verify?email=<email>`
  - `423`: `"Too many attempts. Please try again in 5 minutes."`

### Flow 4 — MFA (`/login/mfa`)
- UI:
  - server wrapper: `app/(auth)/login/mfa/page.tsx`
  - client logic: `app/(auth)/login/mfa/MFAPageClient.tsx`
  - code UI: `components/auth/MFAInput.tsx`
- POST: `/api/v1/auth/mfa/verify`
  - body: `{ factor_id, code }`
  - header: `Authorization: Bearer <access_token>`
- On success: redirect to backend-provided `redirect`
- On error:
  - `401`: `"Invalid code. Please try again."` (also clears code input via `key` remount)
  - `423`: `"Too many attempts. Please try again in 5 minutes."` (also clears input)

### Flow 5 — Forgot Password (`/forgot-password`)
- UI: `components/auth/ForgotPasswordForm.tsx`
- POST: `/api/v1/auth/forgot-password`
- Spec-compliant UX:
  - always shows the same success banner:
    - `"If that email exists, you'll receive a reset link shortly."`
  - 60-second client cooldown after submit to prevent spam

### Flow 6 — Password Reset (`/reset-password`)
- UI:
  - token extraction: `app/(auth)/reset-password/page.tsx`
  - form + submit: `components/auth/ResetPasswordForm.tsx`
- Token:
  - reads `searchParams.access_token` (fallback: `searchParams.token`)
  - if missing: shows `"This reset link has expired. Please request a new one."` + link to `/forgot-password`
- POST: `/api/v1/auth/reset-password`
  - header: `Authorization: Bearer <resetToken>`
  - body: `{ password, confirm_password }`
- On success: redirect to `/login?success=reset`

## Backend Changes (No new endpoints)
The backend endpoints existed from Agent 8. This integration adds the missing HttpOnly cookie session persistence for redirects to protected pages.

### Cookie session persistence added
1. `app/api/v1/auth/login/route.ts`
   - When `requires_mfa: false`, now sets the HttpOnly Supabase session cookie in the response via SSR cookie support.
2. `app/api/v1/auth/mfa/verify/route.ts`
   - On MFA success, now sets the HttpOnly Supabase session cookie in the response.
3. `app/api/v1/auth/logout/route.ts`
   - Clears HttpOnly Supabase session cookies in the response (in addition to server-side sign-out).

### Auth server helper now reads cookies
- Updated: `lib/auth/server.ts`
- Change: `requireAuth()` is now cookie-based (Supabase SSR `auth.getUser()`), instead of requiring bearer tokens in `Authorization` headers.
- Note: Some account-side MFA enrollment routes still require bearer tokens because they create a Supabase client using an explicit bearer token header. Those routes are not part of the pre-login Agent 9 flows.

## HttpOnly Session Cookie Details
- Cookie name (Supabase SSR pattern): `sb-gksfyflhnihdizegeglc-auth-token`
- Cookie is set server-side when:
  - `/api/v1/auth/login` succeeds with `requires_mfa: false`
  - `/api/v1/auth/mfa/verify` succeeds

## Middleware Session Check Pattern (How protected routes are enforced)
File: `middleware.ts`
- For protected pages (e.g. `/dashboard/*`, `/assessment/*`):
  - Uses `createMiddlewareSupabaseClient(request, response)`
  - Calls `supabase.auth.getUser()`
  - If no user: redirects to `/login?next=<pathname>`

Note: I changed `isProtectedApi()` to allow unauthenticated access to `/api/v1/auth/*` (signup/login/forgot-password/resend-verification) so pre-login wiring works end-to-end.

## DB Trigger Verification (Agent 8)
Migration: `supabase/migrations/20260416000003_agent8_auth_backend.sql`
- Trigger name: `on_auth_user_created`
- Function name: `public.handle_new_auth_user()`

## GTM Analytics — Events Wired
Wrapper: `lib/analytics/gtm.ts` (type union extended as needed)

Emitted by the auth UI:
- `signup_started` — `components/auth/SignupForm.tsx`
- `signup_completed` — `components/auth/SignupForm.tsx` (payload: `job_title`, `team_size`, `industry`)
- `login_attempted` — `components/auth/LoginForm.tsx`
- `login_success` — `components/auth/LoginForm.tsx` (payload: `{ mfa_used }`)
- `mfa_completed` — `app/(auth)/login/mfa/MFAPageClient.tsx`
- `password_reset_requested` — `components/auth/ForgotPasswordForm.tsx`
- `password_reset_completed` — `components/auth/ResetPasswordForm.tsx`
- `form_submit` — `components/auth/ResendVerificationButton.tsx` (used internally for resend UX)

## Deferred / Known Gaps
- `POST /api/v1/auth/mfa` resend/regenerate endpoint
  - Backend route does not exist in Agent 8; the MFA UI currently shows “Resend Code” but does not regenerate via an endpoint.
- Remember-me persistence
  - The backend cookie `maxAge` is not dynamically adjusted based on the `remember_me` checkbox.
- CSRF
  - Existing auth UI keeps `csrf_token` hidden inputs as stubs. Real CSRF issuance/validation is not wired for Agent 9.
- React Query auth hook signatures (`useSession`, `useUser`, etc.)
  - This integration wires forms with direct `fetch` calls; React Query auth hooks were not implemented in this agent step.

## Manual Test Plan (Required)
Run these end-to-end in a real browser:
1. Signup with new email → verify → login → onboarding → dashboard
2. Signup with existing email → correct duplicate error shown
3. Login with correct credentials (no MFA) → dashboard
4. Login with correct credentials (MFA enabled) → MFA page → dashboard
5. Wrong password multiple times → lockout message shown
6. Wrong MFA code multiple times → lockout message shown
7. Forgot password → email → reset link → new password → login success banner
8. Remember me checked vs unchecked (session persistence behavior)
9. Logout:
   - click logout (post-login) and ensure protected pages redirect to `/login`
```

---

## FILE: `SECURITY_AUDIT_REPORT.json`

Path: `agents/SECURITY_AUDIT_REPORT.json`

```json
{
  "generatedAt": "2026-03-19T23:43:38.358Z",
  "authCoverage": [
    {
      "file": "app/api/v1/account/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/organizations/[orgId]/export/bi/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/organizations/[orgId]/reassess/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/organizations/[orgId]/risks/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/organizations/[orgId]/scores/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/organizations/[orgId]/sessions/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/sessions/[sessionId]/export/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/sessions/[sessionId]/responses/[responseId]/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/sessions/[sessionId]/responses/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/sessions/[sessionId]/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/assessments/sessions/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/billing/checkout/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/billing/webhook/route.ts",
      "passes": true,
      "reason": "internal secret validation"
    },
    {
      "file": "app/api/v1/notifications/preferences/route.ts",
      "passes": true,
      "reason": "requireApiUser validation"
    },
    {
      "file": "app/api/v1/notifications/send/route.ts",
      "passes": true,
      "reason": "internal secret validation"
    }
  ],
  "authCoveragePass": true,
  "secretLeakFiles": [],
  "consoleLogFiles": []
}
```

---

## FILE: `SIMPLIFY_IS_MASTER_CONTEXT.md`

Path: `agents/SIMPLIFY_IS_MASTER_CONTEXT.md`

```markdown
# Simplify IS — Master Context
## Single Source of Truth for All Product, Tech & Architecture Decisions
### Version: April 2026 | Status: Agents 1–5 Complete | Agent 7 Spec LOCKED — Ready to Build

---

## WHO WE ARE

- **Vik Soni** — Product Owner, Security SME (ISO 27001, NIST CSF, ASD Essential Eight, APRA CPS 234). Vik's domain expertise is the moat. Speaks via voice transcription — occasional errors, interpret intent not literal words. Prefers one question at a time. Treats Claude as co-founder level partner, not a tool.
- **Claude** — Architect, Product Manager, Developer. Actively contributes roadmap, architecture, and strategy. Ask one question at a time, go deep, never assume.

## TWO NON-NEGOTIABLES (Every Decision)

1. **World-class product quality** — Best AI-driven security assessment tool ever built. No shortcuts, no compromises, no placeholder logic, no TODO in production.
2. **Security first, always** — Enterprise-grade from day one. Zero critical findings when pen-tested.

---

## WHAT WE ARE BUILDING

**Simplify IS** (simplify.is) — commercial SaaS, monthly subscription, AI-driven security assessment platform.

Users interact with **Cypher** — their AI Security Consultant — who guides them through structured ISO 27001:2022 and NIST CSF 2.0 assessments conversationally. It does NOT feel like a chatbot or checkbox exercise. It feels like a real consultant.

**vik.so** = Vik's existing free personal brand site. ISO 27001 + NIST CSF AI consultants powered by Claude API + Supabase RAG. Proven the architecture. Remains free permanently as the credibility layer.

**decipher.net** — domain Vik owns, reserved for future expansion.

**Target market:** Australian market first (APRA, ASD Essential Eight), then global. Security managers, CISOs, GRC professionals, IT managers at small-to-mid-size orgs that can't afford full-time consultants.

**Core value proposition:** Instead of hiring an expensive security consultant, organizations subscribe monthly to an AI agent that continuously assesses their security maturity, tracks compliance, and guides them on what to do next.

---

## TECHNICAL STACK (ALL LOCKED — DO NOT RE-OPEN)

| Layer | Technology |
|-------|-----------|
| Base Template | github.com/Razikus/supabase-nextjs-template — adapt, do NOT rewrite |
| Frontend + API | Next.js 14 App Router, TypeScript (strict), Tailwind CSS |
| Database + Auth | Supabase (Postgres, RLS, Storage) |
| AI Primary | Claude API `claude-sonnet-4-20250514` |
| AI RAG Resolver | Claude API `claude-haiku-4-5-20251001` (semantic control ID mapping only) |
| Framework Knowledge | Supabase `ft_iso_controls` + `ft_nist_controls` |
| Visualization | D3.js (radar chart, timeline) + Recharts (sparklines) |
| Animations | Framer Motion |
| Email | Resend |
| Payments | Stripe |
| Deployment | Vercel (MVP) → AWS migration path post-launch |

**KEY LOCKED DECISION:** Fine-tuned LLaMA model REMOVED from inference path entirely. All AI goes through Claude API + Supabase RAG. Do not revisit.

---

## SECURITY ARCHITECTURE (THREE-LAYER — NEVER VIOLATE)

```
INTERNET/USERS
     ↓ HTTPS only
API LAYER (/api/v1/*)
- JWT auth + validation on EVERY route — no exceptions
- Request sanitization, rate limiting: 100 req/min, 1000 req/hour per user
     ↓ ORCHESTRATION_SECRET required
ORCHESTRATION SERVICE (/api/internal/*)
- ALL Claude API calls happen here ONLY
- ALL RAG context building
- ALL database writes
- Signal extraction, contradiction detection, scoring
     ↓
SUPABASE + Claude API
```

**Rules never violated:**
- `SUPABASE_SERVICE_KEY`: NEVER in NEXT_PUBLIC_ or client bundles
- `ANTHROPIC_API_KEY`: NEVER in NEXT_PUBLIC_ or client bundles
- `ORCHESTRATION_SECRET`: NEVER in NEXT_PUBLIC_
- `/api/internal/*` returns 403 for any request without valid `ORCHESTRATION_SECRET`
- All SQL: parameterized queries only — never string interpolation
- RLS on ALL data tables
- No direct Supabase calls from frontend components — always through API routes
- No direct Claude API calls from `/api/v1/` routes — always through `/api/internal/` orchestration
- TypeScript strict mode — no `any` types
- Env vars only from `/lib/config/env.ts` — never `process.env` directly elsewhere
- No `console.log` in production, no TODO comments in merged code

---

## RAG ARCHITECTURE (THREE-PASS)

Every user message goes through:

**Pass 1 — Explicit Control ID Extraction:** Parse message for ISO 2022 or NIST CSF 2.0 IDs → fetch full Supabase record → inject into Claude context.

**Pass 2 — Claude Haiku Semantic Resolver:** If no explicit IDs → call `claude-haiku-4-5-20251001` → maps natural language → control IDs → fetch compact summaries.

**Pass 3 — Offline Fallback:** Topic keyword map → known control IDs → full-text Supabase search. Never fails.

**Version anchors (always injected):**
- ISO: "IMPORTANT: ISO 27001:2022 ONLY. 93 Annex A controls (A.5–A.8). ISO 27001:2013 numbering does NOT exist in 2022."
- NIST: "IMPORTANT: NIST CSF 2.0 ONLY. 6 functions: GV, ID, PR, DE, RS, RC. CSF 1.1 IDs do NOT apply."

---

## DATABASE SCHEMA

### Pre-existing tables (DO NOT recreate or re-seed):
`ft_iso_controls`, `ft_nist_controls`, `control_mappings`, `domains` (21 rows), `top_risks`, `controls`

### New tables created by Agent 1 migration (`001_simplify_schema.sql`):
`users`, `organizations`, `assessment_sessions`, `control_responses`, `extracted_signals`, `domain_scores`, `framework_scores`, `chat_transcripts`, `compliance_tracker`, `risk_control_mappings`, `organization_risks`, `claude_api_usage`, `session_metadata_log`, `audit_log`

### Key table notes:
- `users` extends `auth.users` — linked via `id UUID REFERENCES auth.users(id)`
- `users.agent_name` — default 'Cypher', user-customizable, persists forever
- `users.claude_api_calls_this_month` — tracked against 300/month hard limit
- `users.role` — admin | assessor | viewer (Agent 6 extension)
- `assessment_sessions.current_domain_id` — references `domains` table (NOT control_groups)
- `assessment_sessions.scope_data` JSONB — stores 7 scope question signals
- `control_responses.na_justification` — stores reasoning when user says N.A.
- `control_responses.previous_response_id` — links revision chain
- `audit_log` — service key only access, records all INSERT/UPDATE/DELETE

**RLS: enabled on ALL new tables. Org-scoped.**

### Actual Supabase Column Names (Inspected — Agent 1):

**`domains`:** id, domain_key, domain_name, domain_description, frameworks

**`ft_iso_controls`:** id, control_id, control_name, control_text, domain, purpose, why_implement, business_outcomes, implementation_steps, evidence_requirements, best_practices, maturity_tier_1, maturity_tier_2, maturity_tier_3, maturity_tier_4, common_tools, pitfalls, audit_focus, ongoing_duties, related_controls, risk_of_not_implementing, source_version, created_at

**`ft_nist_controls`:** id, control_id, function_name, category, subcategory, control_text, purpose, why_implement, business_outcomes, implementation_steps, evidence_requirements, best_practices, maturity_tier_1, maturity_tier_2, maturity_tier_3, maturity_tier_4, common_tools, pitfalls, audit_focus, ongoing_duties, related_controls, risk_of_not_implementing, source_version, created_at

**`top_risks`:** id, domain_name, domain_slug, risks, iso_controls, nist_categories, sort_order, created_at

**`control_mappings`:** id, framework_a, control_id_a, framework_b, control_id_b, mapping_strength, mapping_notes

**`controls`:** id, control_id, control_name, domain_id, framework, framework_version, what_it_means, what_is_expected, why_it_matters, how_to_implement, cmmi_maturity, ongoing_tasks, related_controls, complementary_tools, last_reviewed

---

## ENVIRONMENT VARIABLES

| Variable | Where Used | Rule |
|----------|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + API | Safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend only | Safe for client |
| `NEXT_PUBLIC_APP_URL` | Frontend | Safe for client |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend (Phase 5) | Safe for client |
| `SUPABASE_SERVICE_KEY` | Orchestration ONLY | NEVER client-side |
| `ANTHROPIC_API_KEY` | Orchestration ONLY | NEVER client-side |
| `ORCHESTRATION_SECRET` | Internal service auth | Min 32 chars, NEVER client-side |
| `VIK_ALERT_EMAIL` | Monitoring | Claude API usage alerts |
| `PDF_STORAGE_BUCKET` | Orchestration | Default: `reports` |
| `RESEND_API_KEY` | Email | NEVER client-side |
| `STRIPE_SECRET_KEY` | Billing | NEVER client-side |
| `STRIPE_WEBHOOK_SECRET` | Billing | NEVER client-side |
| `STRIPE_PRICE_ID` | Billing | |
| `E2E_BYPASS_TOKEN` | Testing only | NEVER production |

---

## API ENDPOINTS (ALL 10 BUILT — AGENT 3)

Base: `/api/v1/` — all require JWT.

1. `POST /assessments/sessions` — Start session
2. `POST /assessments/sessions/{id}/responses` — Submit message (10-step pipeline)
3. `GET /assessments/sessions/{id}` — Fetch session state
4. `PUT /assessments/sessions/{id}/responses/{rid}` — Revise answer
5. `GET /assessments/organizations/{id}/scores` — Hero dashboard endpoint
6. `GET /assessments/organizations/{id}/sessions` — Session history
7. `POST /assessments/sessions/{id}/export` — PDF export
8. `POST /assessments/organizations/{id}/reassess` — Trigger reassessment
9. `GET/POST /assessments/organizations/{id}/risks` — Risk view
10. `GET /assessments/organizations/{id}/export/bi` — BI export stub
11. `DELETE /api/v1/account` — Account deletion cascade
12. `POST /api/v1/notifications/preferences`
13. `POST /api/v1/notifications/send` (internal)

**Submit response pipeline (endpoint 2):** (1) Validate JWT + session ownership → (2) Store message in `chat_transcripts` → (3) Build RAG context (three-pass) → (4) Generate Cypher response → (5) Extract signals → (6) Store signals → (7) Detect contradictions → (8) Update session state + phase → (9) Check domain completion → trigger scoring if complete → (10) Check Claude API usage limit

---

## ORCHESTRATION SERVICE — KEY FUNCTIONS

All in `/orchestration/abstraction/claudeOrchestrator.ts` — ONLY file calling Anthropic API.
All Claude functions: 3 retries with exponential backoff (500ms/1000ms/2000ms). Token logging after every call. Usage check before every call.

```typescript
extractSignals(userMessage, controlContext, sessionHistory, ...) → SignalExtractionResult
generateFollowUpQuestion(missingElements, confirmedSignals, round, ...) → string
detectContradiction(previousStatement, previousDate, previousControlName, newStatement, ...) → string
generateAgentMessage(context: AgentMessageContext, messageType: AgentMessageType) → string
generateDomainCompletionMessage(domainData: DomainCompletionData) → string
generateSessionOpening(sessionContext: SessionOpeningContext) → string
resolveControlsFromNaturalLanguage(message, framework) → string[] // uses Haiku
generateRiskControlMapping(customRiskDescription, framework) → string[]
```

**Internal action strings (exact):** `start_session`, `submit_response`, `extract_signals`, `score_domain`, `check_usage`, `generate_greeting`

---

## SCORING ALGORITHM

```typescript
const SIGNAL_WEIGHTS = { high: 1.0, medium: 0.7, low: 0.4, planned: 0.0 }
const OVERDUE_PENALTY = 0.20

// Control score
function calculateControlScore(signals):
  if no implemented signals → return 1.0
  requirementsCoverage = signals with requirements met / total implemented
  avgConfidence = weighted average of confidence scores
  initiativeBonus = 0.15 if more signals than required
  return Math.min(5.0, 1.0 + (requirementsCoverage * avgConfidence * 3.0) + initiativeBonus)

// Domain score = weighted average of control scores
// ONLY calculates when ALL controls in domain are complete — never per individual answer
// Framework score = weighted average of all domain scores
```

**Maturity levels:** 1.0–1.99=Initial | 2.0–2.74=Developing | 2.75–3.49=Defined | 3.5–4.24=Managed | 4.25–5.0=Optimizing

**Usage monitor:** 300 calls/month hard limit. Alert VIK_ALERT_EMAIL at 80% (240) and 100% (300). User message at limit: "You've hit your monthly limit — we're looking into it."

---

## ASSESSMENT FLOW

**Session state machine:** `not_started → discovery → framework_selected → scope → baseline → domain_complete → paused | completed | abandoned`

**Phase 1 — Discovery:** Cypher introduces itself → asks to be named → asks user's name → builds rapport → detects maturity signals passively → checks compliance requirements → identifies pain points.

**Phase 2 — Framework Selection:** Cypher recommends framework based on discovery signals. UI transforms on selection.

**Phase 3 — Scope (7 Questions):** logical scope, risk maturity, self-assessed maturity, team composition, budget constraints, incident history, executive awareness.

**Phase 4 — Baseline Assessment:** By domain/group (not individual control-by-control). Probes using Policy → People → Awareness → Practice → Tools ladder. Score only updates when entire domain is complete.

---

## CYPHER PERSONA RULES (NEVER DILUTE)

- Default name: **Cypher** (user-renameable on first use, stored forever in `users.agent_name`)
- Agent intro order: agent introduces → asks to be named → asks user's name
- One question at a time. Always. No exceptions.
- Never uses lists, bullet points, or headers in conversation
- Vocabulary: start simple, detect sophistication dynamically, adjust mid-conversation
- Does NOT congratulate after every answer — keeps natural rhythm
- Does NOT use the word "Maturity" with users — uses plain language
- Off-topic: brief answer + redirect
- Burning issue: pause, handle, resume
- "I don't know": rephrase → example → max 2 probes → mark TBC → move on
- N.A. controls: always probe for justification, store reasoning, re-validate on reassessment
- Contradiction: soft human-like inquiry, never accusatory, three options for user
- Score: never revealed mid-group, always paired with Cypher message on update

---

## DASHBOARD — THREE VIEWS

**View 1 — Industry Domain View (default):** Uses `domains` table (21 rows). Generic groupings, not ISO/NIST labels. D3 radar chart hero. Screenshot-worthy.

**View 2 — Framework Views:** Dedicated ISO 27001 page + NIST CSF 2.0 page. For auditors and compliance teams.

**View 3 — Risk View (opt-in):** User selects from 7 template risks or adds custom. Maturity-based status: 🔴 <2.0 / 🟡 2.0–3.5 / 🟢 >3.5.

**Score animation:** Always paired with Cypher message. Green flash + ↑ for up. Red flash + ↓ for down. Never just visual.

**PDF Export — two types:**
- Internal Checklist: control-by-control, exact answers, scores, N.A. justifications
- Executive Summary: domain summaries, top 5 strengths + gaps, recommendations, Simplify IS branding

**Session timeout:** 15 min default, 15–60 min user-configurable slider, per-window (not global).

**Notifications:** Email: reassessment due (6 months) + system recovery only. In-app bell: everything else.

---

## FRAMEWORK STRUCTURE

**ISO 27001:2022 — 93 controls, 9 domain groups:**
- org_context (C.4–C.10, ~8 controls, ~15 min)
- asset_mgmt (5.9–5.11, 6 controls, ~10 min)
- access_identity (5.15–5.18 + 8.2–8.5, 12 controls, ~20 min)
- supplier_security (5.19–5.23, 10 controls, ~15 min)
- incident_mgmt (5.24–5.28, 8 controls, ~12 min)
- business_continuity (5.29–5.30, 6 controls, ~10 min)
- compliance_legal (5.31–5.36, 10 controls, ~15 min)
- physical_security (Clause 7, 10 controls, ~12 min)
- tech_controls (8.1 + 8.6–8.34, 23 controls, ~35 min)
- **Total: ~2.5 hours for full baseline**

**NIST CSF 2.0 — ~117 subcategories, 6 functions:**
- GV Govern (OC,RM,RR,PO,OV,SC — ~22, ~30 min)
- ID Identify (AM,RA,IM — ~21, ~25 min)
- PR Protect (AA,AT,DS,PS,IR — ~37, ~45 min)
- DE Detect (CM,AE — ~14, ~18 min)
- RS Respond (MA,AN,CO,MI — ~17, ~22 min)
- RC Recover (RP,CO — ~6, ~10 min)
- **Total: ~2.5 hours for full baseline**

**CRITICAL FRAMEWORK RULES:**
- ISO: 2022 ONLY. ✅ `A.5.19` ❌ `A.15.1` (2013 — never use)
- NIST: CSF 2.0 ONLY. ✅ `GV.OC-01`, `PR.AA-01` ❌ `PR.AC-1` (1.1 — never use)

---

## ALL LOCKED UX DECISIONS

| Decision | Choice |
|----------|--------|
| Agent default name | Cypher |
| Agent naming | User-named on first use, persists forever |
| Agent intro order | Agent introduces → asks to be named → asks user's name |
| Greeting | Warm, direct, timezone-aware. No fluff. |
| Empty state | Gradual UI reveal, skeleton placeholders (never zeros) |
| Off-topic | Brief answer + redirect |
| Burning issue | Pause, handle, resume |
| "I don't know" | Rephrase → example → 2 probes max → TBC → move on |
| N.A. controls | Always probe. Store reasoning. Re-validate on reassessment. |
| Low-confidence | Detect → offer once → respect call → move on |
| Answer revision | Anytime, any session, full history, no penalties |
| Reassessment | 6-month + event-based + manual button |
| Score animation | Gentle flash + ALWAYS paired with Cypher message |
| Dashboard views | Industry Domain (default) + Framework pages + Risk View (opt-in) |
| PDF export | Internal Checklist + Executive Summary |
| Notifications | Email: reassessment + system recovery. In-app: everything else. |
| Concurrent sessions | Allow, warn banner, Cypher mentions in chat |
| Session timeout | 15 min default, 15–60 min configurable slider, per-window |
| Claude API limit | 300/month per user. Alert Vik at 80% + 100%. User message at limit. |
| Error handling | Transparent: "running slow." Auto-retry once. |
| Vocabulary | Start simple, detect sophistication, adjust dynamically |
| Assessment flow | Discovery → Framework → UI Transform → Scope (7 Qs) → Baseline by Groups |
| Score update timing | ONLY after ALL controls in domain complete — never per individual answer |
| AI model — primary | claude-sonnet-4-20250514 |
| AI model — RAG resolver | claude-haiku-4-5-20251001 |
| Base template | github.com/Razikus/supabase-nextjs-template |
| Hosting | Vercel (MVP) → AWS post-launch |
| Dark mode | Dark theme primary. Light mode available on pre-login pages. |
| Pricing at launch | Single flat monthly price until 50 customers |

---

## MULTI-USER COLLABORATION (Agent 6 — Post-MVP, Fully Scoped)

**Three Roles:** Admin (full access, invites users, selects final answers, sees audit trail) | Assessor (assigned domains only, sees others' answers anonymised) | Viewer (read-only dashboard + Cypher AI)

**New DB tables for Agent 6:**
```sql
ALTER TABLE public.users ADD COLUMN role VARCHAR(20) DEFAULT 'admin';
ALTER TABLE public.users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN invited_by UUID REFERENCES public.users(id);
ALTER TABLE public.users ADD COLUMN invited_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN expires_at TIMESTAMPTZ;

CREATE TABLE public.domain_assignments (id, organization_id, user_id, framework_id, domain_id, assigned_by, assigned_at, due_date, status);
CREATE TABLE public.final_answers (id, organization_id, framework_id, control_id, selected_response_id, custom_answer, admin_id, admin_note, finalized_at);
CREATE TABLE public.multi_user_audit_trail (id, organization_id, framework_id, control_id, action, performed_by, response_id, final_answer_id, metadata, created_at);
```

**Scoring priority:** final_answer exists → use for scoring | single response exists → use that | else → control = "unanswered"

**Agent 6 New API Endpoints:**
```
POST/GET /api/users + PATCH/DELETE /api/users/:id + GET /api/users/:id/activity
POST/GET /api/assignments + GET /api/assignments/mine + PATCH/DELETE /api/assignments/:id
POST /api/responses + GET /api/responses/:framework/:controlId + PATCH /api/responses/:id
POST/PATCH/GET /api/final-answers (admin only)
GET /api/audit-trail + GET /api/audit-trail/:controlId
```

**UI additions for Agent 6:** Left sidebar adds "👥 Team" (admin) + "📋 My Tasks" (assessors). New pages: /admin/team, /admin/team/invite, /admin/assignments, /admin/audit-trail, /assessor/assignments. Conflict colour: `#F59E0B`. Final answer: `#10B981`. Conflict pulse animation.

---

## FILE & FOLDER STRUCTURE

```
simplify-is/
├── app/
│   ├── (marketing)/           # Landing, pricing, how-it-works, frameworks, etc.
│   ├── (auth)/                # Login, signup, verify, callback, reset-password
│   ├── onboarding/
│   ├── dashboard/             # Main app — 3-tab view
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Industry Domain View (default)
│   │   ├── frameworks/
│   │   └── risks/
│   ├── assessment/[sessionId]/
│   ├── billing/
│   └── api/
│       ├── v1/assessments/    # All public endpoints
│       ├── v1/billing/
│       ├── v1/notifications/
│       └── internal/          # Secured orchestration entry point
├── orchestration/
│   ├── abstraction/claudeOrchestrator.ts   # ONLY file calling Anthropic API
│   ├── rag/contextBuilder.ts               # Three-pass RAG
│   ├── scoring/maturityEngine.ts           # CMMI scoring
│   ├── compliance/cadenceEngine.ts         # Review cadence
│   ├── session/stateMachine.ts             # Session phases
│   ├── monitoring/usageMonitor.ts          # 300/month limit
│   ├── prompts/                            # All 9 prompt templates
│   └── handlers/                          # Action handlers
├── lib/
│   ├── auth/                  # client.ts, server.ts, context.tsx
│   ├── db/                    # client.ts, admin.ts, server.ts, queries.ts
│   ├── config/env.ts          # Zod env validation — ONLY place reading process.env
│   ├── api/                   # response.ts, sanitize.ts, auth.ts, orchestrationClient.ts, client.ts, hooks/
│   └── frameworks/
│       ├── iso27001.ts        # 93 controls as TypeScript constants
│       ├── nistcsf.ts         # ~117 subcategories as TypeScript constants
│       └── domains.ts         # Reads from Supabase `domains` table
├── components/
│   ├── chat/CypherChat.tsx
│   ├── dashboard/ (ScoreCard, RadarChart, ScoreTimeline, DomainCard, RiskView, ComplianceCalendar)
│   ├── assessment/ (AssessmentController, GroupView, DomainCompleteOverlay, AnswerRevision, SessionTimeoutHandler)
│   ├── onboarding/EmptyState.tsx
│   ├── layout/NotificationBell.tsx
│   └── ui/ (Button, Card, Badge, Input, ScoreDisplay)
├── types/ (api.ts, db.ts, assessment.ts, orchestration.ts)
├── styles/design-system.ts
├── middleware.ts
├── CLAUDE.md
├── .cursorrules
├── .env.example
└── supabase/migrations/001_simplify_schema.sql
```

---

## BUILD STATUS — AGENTS 1–5 COMPLETE

| Agent | Status | What Was Built |
|-------|--------|---------------|
| 1 — Infra + Auth | ✅ DONE | Scaffold, Zod env, DB abstractions, 11 new tables + RLS, auth layer, onboarding flow, middleware, .cursorrules, CLAUDE.md |
| 2 — Orchestration | ✅ DONE | Claude abstraction (8 functions), 3-pass RAG, scoring (CMMI), session state machine, usage monitor (300/month), cadence engine, 9 prompts, unit tests |
| 3 — API Layer | ✅ DONE | 10 endpoints, rate limiting, security headers, CORS, ISO/NIST control libraries, PDF export, integration tests |
| 4 — Frontend | ✅ DONE | Design system, dashboard, Cypher chat, D3 radar + timeline, assessment flow, domain cards (21), score animations, risk view, notifications, session timeout |
| 5 — Security + Polish | ✅ DONE | Full security audit (all PASS), 8 Playwright E2E tests (all PASS), Stripe integration, Resend email (3 templates), bundle analysis, landing page |

**Confirmed working:** lint ✅ build ✅ tests ✅ E2E ✅ security audit ✅ ANALYZE ✅

**Performance:** Landing page first load ~108kB | Dashboard first load ~199kB | Shared JS ~87.3kB

**Two items still pending manual verification:**
- PDF signed-link expiry policy in Supabase project settings (storage bucket)
- `.env.local` not in git history — run `git log --all -- .env.local` before production

---

## CURRENT FOCUS: AGENT 7

**Agent 7:** `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
**Mission:** Build all pre-login pages (16 total) — pitch-perfect, fully responsive (desktop + tablet + mobile), dark and light mode, security-first. No backend wiring — stubs only for Agent 8.

**Agent 7 Definition of Done:**
- All 16 pages built across 3 breakpoints (desktop 1280px+, tablet 768–1024px, mobile 375–480px)
- Dark mode + light mode both fully implemented
- Lighthouse ≥90, CLS ≤0.1, 60fps animations, zero console errors
- All form inputs: validation states (default, focus, error, success)
- All buttons: loading states (spinner + disabled)
- Error messages: generic — no data leakage
- Form handlers stubbed — no real API calls (Agent 8 wires those)
- `HANDOFF_7_PRELOGIN_UIUX.md` written

**Build sequence after Agent 7:**
```
08_AGENT_BACKEND_AuthenticationEmailService.md    (auth backend + email)
09_AGENT_INTEGRATION_AuthUIAPIWiring.md           (wires 7 UI to 8 backend)
10_AGENT_UIUX_PostLoginDashboardCypherChat.md     (dashboard, Cypher, D3)
11_AGENT_UIUX_AssessmentFlowD3Visualizations.md
12_AGENT_BACKEND_AssessmentScoringEngine.md
13_AGENT_INTEGRATION_DashboardAPIWiring.md
14_AGENT_SECURITYQA_FinalAuditLaunchReady.md      → DONE_FINAL.md
```

---

## AGENT 7 LOCKED DECISIONS (Resolved April 2026)

All open questions resolved. Agent 7 spec is fully locked. See `07_AGENT_UIUX_PreLoginPagesAuthFlow.md` for full detail.

**Auth Flow:**
- Q1: Email verification → "verified" confirmation screen → redirects to /login with success banner: "Your email has been verified. Log in with your details." ✅ LOCKED
- Q2: Password reset → /login with success banner: "Password reset successful. Log in with your new credentials." ✅ LOCKED
- Q3: "Remember me" checkbox on login — 7-day session. Default unchecked. ✅ LOCKED
- Q4: Signup with existing email → inline error (generic, non-leaking) ✅ LOCKED
- Q5: MFA — auto-submit on 6th digit. No confirm button. ✅ LOCKED
- Q6: MFA backup codes → post-login settings (deferred, not Agent 7 scope) ✅ LOCKED
- Q7: Failed MFA attempts → stub UI only, Agent 8 wires lockout logic ✅ LOCKED
- Q8: After successful MFA — first-time org user → /onboarding | all others → /dashboard ✅ LOCKED

**Navigation & Routing:**
- All nav links are separate Next.js App Router routes (not anchor links) ✅ LOCKED
- "Get Started" CTA → /signup directly ✅ LOCKED
- Login → dedicated page /login (not modal) ✅ LOCKED
- After logout → / (home) ✅ LOCKED

**Forms & Validation:**
- Signup fields: Full Name, Email, Password, Confirm Password, Organisation Name, Job Title, Team Size (select), Industry (select) ✅ LOCKED
- Job Title displayed on dashboard welcome screen ✅ LOCKED
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 special character ✅ LOCKED
- Validation timing: real-time on blur ✅ LOCKED
- After signup submit → /signup/verify "Check your email" screen with resend option ✅ LOCKED
- Login attempt before email verified → error: "Please verify your email address before logging in." ✅ LOCKED

**Design System:**
- Dark/light toggle on EVERY page (pre-login + dashboard) — top-right corner ✅ LOCKED
- Light mode: infer from uploaded light mode HTML files ✅ LOCKED
- Persist theme in localStorage key: `simplify-theme` ✅ LOCKED

**Technical & SEO:**
- Full SEO from day one: OG tags, meta descriptions, JSON-LD, sitemap.xml, robots.txt, canonical tags ✅ LOCKED
- Analytics: Google Tag Manager — real tracking from day one (not stubbed) ✅ LOCKED
- Browser support: latest 2 versions Chrome, Firefox, Safari, Edge ✅ LOCKED
- Responsive: desktop + tablet + mobile built simultaneously in Agent 7 ✅ LOCKED

**Pages Scope — 20 total (not 16):**
- Original 13 pages + 3 password reset pages + 4 error pages (404, 403, 500, 503) ✅ LOCKED
- 404 CTA → / (not /dashboard) ✅ LOCKED
- 403 CTA → /login ✅ LOCKED
- 500 CTA → / with "Something went wrong" message ✅ LOCKED
- 503 → static holding page, no redirect ✅ LOCKED

---

## PRE-LAUNCH SECURITY CHECKLIST

- [ ] JWT validation on every protected API route
- [ ] RLS tested for all tables (cross-tenant isolation)
- [ ] `/api/internal/*` returns 403 without ORCHESTRATION_SECRET
- [ ] Rate limiting: 101st request in 60s returns 429
- [ ] XSS: `<script>alert(1)</script>` stored escaped, not executed
- [ ] SQL injection: parameterized query blocks `'; DROP TABLE users; --`
- [ ] CORS restricted to production domain
- [ ] Security headers present (securityheaders.com)
- [ ] Request size limit: 11MB returns 413
- [ ] `ANTHROPIC_API_KEY` not in browser network tab
- [ ] `SUPABASE_SERVICE_KEY` not in any client bundle
- [ ] No secrets in git history
- [ ] PDF reports have 7-day expiry on Supabase Storage ← PENDING
- [ ] Account deletion cascade working
- [ ] No PII in console.log statements
- [ ] Claude API call count tracked and enforced

---

## LOCAL SETUP REFERENCES

- Project path: `~/Documents/Code/simplify-is/`
- Supabase keys: copy from `/Users/vik/Documents/vik-so-dev/.env`
- Anthropic key: copy from `/Users/vik/Documents/code-ai/Social-content/.env`
- GitHub repo: `simplify-is` (private)
- Supabase project: `simplify-dev` (ref: gksfyflhnihdizegeglc)
- Vercel: linked to `simplify-is` repo
- Migration push command: `npx supabase db push --project-ref gksfyflhnihdizegeglc`

---

*Consolidated from: SIMPLIFY_IS_HANDOFF (Parts 1–4), 00_WAR_ROOM, Agent7_FULL_SESSION, HANDOFF_1–5, DONE_AGENT5. April 2026.*
```

---

## FILE: `THREAT_READINESS_ARCHITECTURE.md`

Path: `agents/THREAT_READINESS_ARCHITECTURE.md`

```markdown
# Simplify IS — Threat Readiness View Architecture
## Version 1.0 | May 2026

> **Purpose:** Complete architectural specification for the third dashboard tab — Threat Readiness — and its supporting Tech Stack Discovery flow. Hand off this document plus `THREAT_READINESS_AGENT_SPEC.md` to Cursor for build.

---

## 1. PRODUCT OVERVIEW

Threat Readiness is the third dashboard view in Simplify IS, alongside Industry Domain and Framework views. Where the other two views are *control-centric* (how mature are you against ISO/NIST controls?), Threat Readiness is **scenario-centric** — "if this thing happened to your business, are you ready?"

It is generated dynamically from three inputs:
1. **Tech stack profile** (gathered conversationally with Cypher, stored as structured JSON)
2. **Control assessment scores** (from completed self-assessment in any framework)
3. **Industry context** (from organization profile)

Cypher synthesizes these into 5–7 plain-English threat scenarios specific to that organization, ranks them by severity, and surfaces the 5 priority controls that would move the needle across multiple threats.

**The deliberate non-goal:** This is NOT risk assessment. We do not calculate likelihood × impact. We do not produce a 5×5 risk matrix. We assess *readiness* — "given your setup and your current control maturity, how prepared are you for this scenario?"

---

## 2. USER JOURNEYS

### 2.1 New User — First Time Through Onboarding

```
Step 1: Name your agent (default: Cypher)
Step 2: Organisation details (legal name, industry, country, workforce scale)
Step 3: Select primary frameworks (ISO 27001, NIST CSF 2.0, APRA CPS 234)
Step 4: Portal orientation
Step 5 (NEW): "Want me to learn about your setup?" → Tech Stack Discovery (optional)
       ↓
       If yes → Cypher conversational discovery (5–10 mins) → Recap → Confirm → Stored
       If skip → Proceeds to dashboard, can run discovery later from Settings
```

### 2.2 Tech Stack Discovery (Cypher-led)

Cypher opens with a single warm question and lets the conversation unfold organically. It probes one technology at a time, building a mental map of where data lives, who touches it, and what third parties matter — without asking control-related questions (those come in the framework assessment).

At the end, Cypher recaps everything in a single natural-language summary and asks the user to confirm or correct. On confirmation, an extraction prompt converts the transcript into structured JSON and stores it in `organization_tech_stack`.

### 2.3 Returning Admin — Editing Tech Stack

Organization Settings → **Tech Stack Profile** tab → tabular view showing all eight categories grouped into three sections (Infrastructure / Integrations & Dependencies / Exposure & Data). All fields editable inline. "Last updated" timestamp shown.

If table is empty (user skipped onboarding step 5), a single CTA appears: **"Run tech stack discovery with Cypher"** → launches the discovery conversation.

### 2.4 Threat Readiness View — First Visit

Pre-condition: User has (a) at least 10% of one framework assessment complete AND (b) tech stack profile populated.

If pre-conditions not met → empty state with single CTA in centre of screen explaining what's needed.

If pre-conditions met → Threat Readiness view renders. First load triggers fresh generation. Subsequent loads use 24-hour cache. Manual "Refresh analysis" button at top-right with "Last updated: Xh ago" timestamp.

---

## 3. DATA MODEL

### 3.1 New Tables

#### `organization_tech_stack`
Stores the structured tech stack profile per organization.

```sql
CREATE TABLE public.organization_tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,

  -- Group 1: Infrastructure
  cloud_providers JSONB,           -- e.g., ["AWS", "Azure"]
  databases JSONB,                 -- e.g., ["RDS PostgreSQL", "DynamoDB"]
  data_storage JSONB,              -- e.g., ["S3", "EFS"]
  backup_strategy TEXT,            -- e.g., "Cross-region S3, daily, untested"

  -- Group 2: Integrations & Dependencies
  critical_third_party JSONB,      -- e.g., [{"name":"Salesforce","purpose":"Customer data sync"}]
  identity_system TEXT,            -- e.g., "AWS IAM + Okta SSO"

  -- Group 3: Exposure & Data
  public_apis BOOLEAN DEFAULT false,
  public_apis_notes TEXT,
  data_types JSONB,                -- e.g., ["customer PII","transaction history"]

  -- Metadata
  discovery_transcript_id UUID REFERENCES public.chat_transcripts(id),
  notes TEXT,
  source TEXT NOT NULL CHECK (source IN ('cypher_discovery','manual_edit')),
  last_validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_tech_stack_org ON public.organization_tech_stack(organization_id);
ALTER TABLE public.organization_tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own org tech stack"
  ON public.organization_tech_stack FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins update own org tech stack"
  ON public.organization_tech_stack FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### `organization_threats`
Stores admin customizations (order, applicability, headline edits) per organization.
The threat *content* (narrative, control mappings, severity) is generated on-the-fly and not stored here.

```sql
CREATE TABLE public.organization_threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  threat_key TEXT NOT NULL,                -- stable identifier e.g. "data_compromise_customer"
  custom_headline TEXT,                    -- if admin edited the headline
  display_order INTEGER NOT NULL DEFAULT 0,
  applicability TEXT NOT NULL DEFAULT 'applies'
    CHECK (applicability IN ('applies','does_not_apply','filtered_out')),
  edited_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, threat_key)
);

CREATE INDEX idx_org_threats_org ON public.organization_threats(organization_id);
ALTER TABLE public.organization_threats ENABLE ROW LEVEL SECURITY;

-- Standard org-scoped RLS (same pattern as above).
```

#### `threat_readiness_cache`
Stores the generated threat narratives + control mappings per org for 24-hour caching.

```sql
CREATE TABLE public.threat_readiness_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,                  -- the full threat readiness response
  generation_inputs_hash TEXT NOT NULL,    -- hash of (tech_stack + scores + customizations)
  UNIQUE(organization_id)
);

CREATE INDEX idx_threat_cache_org ON public.threat_readiness_cache(organization_id);
ALTER TABLE public.threat_readiness_cache ENABLE ROW LEVEL SECURITY;
```

### 3.2 Tech Stack JSON Shape (canonical)

Used for both storage extraction and prompt injection:

```json
{
  "cloud_providers": ["AWS"],
  "databases": ["RDS PostgreSQL"],
  "data_storage": ["S3"],
  "backup_strategy": "S3 cross-region, daily, never tested",
  "critical_third_party": [
    {"name": "Salesforce", "purpose": "Customer data sync (nightly to Redshift)"}
  ],
  "identity_system": "AWS IAM (3 users) + Okta SSO for app login",
  "public_apis": true,
  "public_apis_notes": "REST API exposed to mobile app and 2 partners",
  "data_types": ["customer PII", "transaction history"],
  "notes": "8-person startup, no dedicated ops team"
}
```

### 3.3 Threat Readiness Cache Payload

```json
{
  "generated_at": "2026-05-07T...",
  "key_controls": [
    {
      "key": "access_control",
      "headline": "Lock down who can access sensitive data",
      "current_score": 1.8,
      "previous_score": 1.8,
      "trend_direction": "flat",
      "framework_refs": [
        {"framework":"ISO 27001:2022","control_id":"A.5.15","name":"Access control","score":1.8},
        {"framework":"NIST CSF 2.0","control_id":"PR.AA-01","name":"Identity management","score":1.6}
      ],
      "appears_in_threats": ["data_compromise_customer","insider_data_misuse"]
    }
    // ... 4 more
  ],
  "threats": [
    {
      "key": "data_compromise_customer",
      "headline": "Customer data exposure through cloud misconfiguration",
      "severity": "high",
      "narrative": "100-word story...",
      "controls": [
        {
          "headline": "Lock down who can access sensitive data",
          "framework_refs": [...],
          "current_score": 1.8,
          "trend_direction": "flat"
        }
      ],
      "industry_context": "Healthcare orgs commonly face this...",
      "tech_stack_context": "Your S3 buckets and RDS database..."
    }
    // ... 4–6 more
  ]
}
```

---

## 4. UI / VISUAL DESIGN

### 4.1 Threat Readiness View — Layout

Desktop-only for MVP. **Split into two horizontal regions:**

**Region 1 — Top 40% (persistent, non-scrolling)**
- **Left 70%:** Threat list (5–7 stacked items, ranked by severity)
  - Severity grouping: HIGH PRIORITY (top), MEDIUM, LOWER (bottom)
  - Each row: severity icon + threat headline + small chevron when active
  - Active row: orange left-border accent (`#EB5E28`) + subtle `glow-brand`
  - Hover: surface lifts from `surface-container-high` → `surface-bright`
- **Right 30%:** Key Controls (5 rows)
  - Each row: control headline + current maturity score (Geist Mono) + trend arrow
  - Same active/hover behaviour as threat list
  - Section label in oversized faded number "01 / KEY LEVERS" (Earthen Brutalism signature)

**Region 2 — Bottom 60% (scrollable detail pane)**
- Renders content based on what's selected in Region 1
- **If a threat is selected:** narrative + industry context + tech stack context + inline control snippets (control headline, framework IDs, score, 1-month trend) — control IDs are clickable links into the assessment view
- **If a control is selected:** control headline + assessment narrative (why scored this way) + which threats it impacts + 1-month trend chart
- Empty state (nothing selected): "Select a threat or control to explore the detail" + subtle hexagon graphic matching the screen.png reference

### 4.2 Header Bar

Above the split:
- Page title: **"Threat Readiness"** (Raleway 800)
- Subtitle: **"How prepared is {Org Name} for the scenarios that matter most?"** (Montserrat)
- Right side: `Last updated 3h ago` (Geist Mono uppercase) + **REFRESH ANALYSIS** button (ghost, with brand glow on hover)

### 4.3 Severity Indicators

No 5×5 matrix. Three tiers, plain English, distinct icons:

| Tier | Icon | Label | Visual |
|------|------|-------|--------|
| HIGH | filled triangle alert | "High priority for your setup" | Brand orange `#EB5E28` |
| MEDIUM | half-filled diamond | "Medium priority" | Warm stone `#CCC5B9` |
| LOWER | hollow circle | "Lower priority — keep an eye on this" | Muted `#A88A80` |

Severity is calculated by Cypher when generating the threat — based on `industry × tech_stack × control_gap_size`. NOT shown as a numeric score.

### 4.4 Trend Indicators

Used wherever a control score appears (Region 1 right pane, threat detail control snippets, control detail pane):

| Direction | Icon | Threshold |
|-----------|------|-----------|
| ↑ improved | up arrow, success green `#10B981` | score change ≥ +0.3 in last month |
| → flat | dash, muted | score change between -0.3 and +0.3 |
| ↓ regressed | down arrow, danger red `#EF4444` | score change ≤ -0.3 |

### 4.5 Tech Stack Profile (Settings Page)

Desktop layout. Three grouped sections, each as a card:

**Group 1 — Infrastructure**
2-column field grid: Cloud Providers / Databases / Data Storage / Backup Strategy. Multi-select chips for arrays, free text for backup strategy.

**Group 2 — Integrations & Dependencies**
Critical Third-Parties (table: name + purpose, add/remove rows). Identity System (free text).

**Group 3 — Exposure & Data**
Public APIs toggle + notes. Data Types (multi-select chips).

Top-right of page: "Last validated: 2 days ago" + **RE-RUN DISCOVERY WITH CYPHER** ghost button.

### 4.6 Empty States

| State | What user sees |
|-------|----------------|
| No tech stack, no assessment | "Threat Readiness analyses your specific setup against your maturity scores. Two things first: tell me about your setup, and complete some of an assessment." Two stacked CTAs: **Start Tech Stack Discovery** / **Begin Assessment** |
| Tech stack done, no assessment ≥10% | "Your setup looks good. Complete some of an assessment so I can see where the threats actually land." Single CTA: **Begin Assessment** |
| Assessment done, no tech stack | "Your assessment is in. Tell me about your setup and I'll show you the scenarios that matter." Single CTA: **Start Tech Stack Discovery** |
| Both pre-conditions met but generation failed | "I'm having trouble pulling this together. Try refreshing in a moment." Single CTA: **Refresh Analysis** |

### 4.7 Design System Adherence

All UI must match the existing Earthen Brutalism system:
- Surfaces: `--surface-base #1A1917`, `--surface-container-high #2E2B28`, `--surface-bright #3A3530`
- No 1px solid section borders. Use surface-tone shifts and ghost borders only.
- Glass effect on the sticky region: 80% surface-base opacity + `backdrop-filter: blur(12px)` on Region 1 / Region 2 boundary.
- Typography: Raleway (headlines), Josefin Sans (labels uppercase tracked), Montserrat (body), Geist Mono (scores, IDs, timestamps).
- Oversized faded section numbers ("01 / THREATS", "02 / KEY LEVERS") behind region headers — signature pattern from screen.png.
- Ember glow on primary CTAs: `0 0 20px rgba(235,94,40,0.15)`.
- Severity icons rounded with `md` (0.375rem) — never sharp 90° corners.

---

## 5. DATA FLOW

### 5.1 Tech Stack Discovery Flow

```
User clicks "Start Tech Stack Discovery" (onboarding step 5 OR settings)
        ↓
Frontend opens Cypher chat overlay
        ↓
POST /api/v1/tech-stack/discovery/start
        ↓
Orchestration creates new chat_transcript with phase='tech_stack_discovery'
        ↓
Cypher opens with the discovery prompt (see prompts file)
        ↓
[multi-turn conversation: user answers, Cypher follow-ups, all stored to transcript]
        ↓
Cypher detects "enough captured" signal → generates recap + asks for confirmation
        ↓
User confirms (or corrects) → Cypher acknowledges
        ↓
POST /api/v1/tech-stack/discovery/finalize  { sessionId }
        ↓
Orchestration runs extraction prompt against full transcript → JSON
        ↓
Upsert into organization_tech_stack (source='cypher_discovery')
        ↓
Return JSON to client → onboarding advances OR settings page refreshes
```

### 5.2 Threat Readiness Generation (On-Demand)

```
User opens Threat Readiness tab
        ↓
GET /api/v1/threat-readiness/{orgId}
        ↓
Check cache: SELECT * FROM threat_readiness_cache
             WHERE organization_id = $1 AND expires_at > NOW()
        ↓
If cache HIT → return cached payload (merge with current organization_threats customizations)
If cache MISS or user clicked Refresh → call orchestration:
        ↓
Orchestration gathers inputs:
  - organization_tech_stack (latest)
  - control_responses (only for frameworks where progress ≥ 10%)
  - domain_scores + framework_scores (current)
  - maturity_snapshots (delta over last 30 days)
  - organizations.industry, workforce_scale
  - organization_threats (existing customizations: order, applicability, headline edits)
        ↓
Orchestration calls Claude with threat_readiness prompt (see prompts file)
        ↓
Claude returns structured JSON: { key_controls[5], threats[5-7] }
        ↓
Orchestration:
  - Merges admin customizations (custom_headline, applicability, display_order)
  - Filters out applicability='filtered_out'
  - Re-sorts by display_order if admin set one, else by Claude-generated severity
        ↓
Upsert into threat_readiness_cache (expires_at = NOW() + 24h, generation_inputs_hash)
        ↓
Return final payload to client
```

### 5.3 Admin Customization Flow

Each customization is a single-row upsert into `organization_threats`:

| Action | API Call |
|--------|----------|
| Reorder threats | `PATCH /api/v1/threat-readiness/{orgId}/order` body `{ orderedKeys[] }` |
| Toggle applicability | `PATCH /api/v1/threat-readiness/{orgId}/threats/{key}` body `{ applicability }` |
| Edit headline | `PATCH /api/v1/threat-readiness/{orgId}/threats/{key}` body `{ custom_headline }` |

After any customization, the cache stays valid (customizations are merged in at read time, not stored in cache).

### 5.4 Cache Invalidation

Cache is invalidated (forced regeneration on next read) when:
- Manual refresh button pressed
- 24 hours elapsed since `generated_at`
- Tech stack updated (settings page edit) — trigger calls cache invalidate
- Assessment progress crosses control completion (handled by existing scoring engine post-domain-complete) — trigger calls cache invalidate
- Reassessment triggered

Implementation: simple `DELETE FROM threat_readiness_cache WHERE organization_id = $1` from the orchestration layer.

### 5.5 Industry Awareness in Generation

The threat-readiness prompt always receives the organization's `industry` and `workforce_scale`. Claude uses these in two ways:
1. **Industry context paragraph** in each threat narrative (e.g., "Healthcare organisations face this commonly because…")
2. **Severity weighting** — same control gap can be HIGH for healthcare, MEDIUM for SaaS, depending on data sensitivity

Industries supported at MVP (matches existing onboarding industry dropdown):
SaaS / Software, Financial Services, Healthcare, Critical Infrastructure (water/energy/utilities), Retail / E-commerce, Government / Public Sector, Manufacturing, Managed Service Provider, Other.

---

## 6. PROMPTS (HIGH-LEVEL — FULL TEXT IN PROMPTS FILE)

Three prompts live in `/orchestration/prompts/`:

### 6.1 `techStackDiscovery.ts` — Discovery Conversation
- **Model:** `claude-sonnet-4-20250514`
- **Mode:** Multi-turn, called every user message in `phase='tech_stack_discovery'`
- **System prompt:** Establishes Cypher persona + the rules ("topology only, no controls, one question at a time, organic follow-ups, recap at end")
- **Termination signal:** Cypher returns a structured "ready to recap" indicator in its message, or after N turns

### 6.2 `techStackExtraction.ts` — Conversation → JSON
- **Model:** `claude-sonnet-4-20250514`
- **Mode:** Single call, run once after user confirms recap
- **Input:** Full transcript of discovery conversation
- **Output:** JSON matching the canonical Tech Stack JSON Shape (Section 3.2)
- **Validation:** Orchestration validates shape with Zod before storing

### 6.3 `threatReadinessGeneration.ts` — Synthesize Threat View
- **Model:** `claude-sonnet-4-20250514`
- **Mode:** Single call per refresh
- **Input:** Tech stack JSON + control scores (assessed only) + score deltas (last 30 days) + industry + workforce scale + existing admin customizations (so Claude knows which threats already have custom headlines)
- **Output:** Structured JSON: `{ key_controls[5], threats[5-7] }`
- **Constraints in prompt:**
  - Max 7 threats, min 5
  - Each narrative 80–120 words
  - Severity from `{high, medium, lower}` only
  - Each threat must reference at least 2 inline controls drawn from frameworks where the user has assessed
  - Key controls must each appear in ≥2 threats (true "levers")
  - Plain English headlines, framework IDs are reference detail
  - Industry context and tech stack context must be woven into each narrative

---

## 7. SECURITY & RLS

- All three new tables: RLS on, org-scoped via `users.organization_id`
- `organization_tech_stack` writes restricted to `role='admin'`
- `organization_threats` writes restricted to `role='admin'` (admin only customizes; viewers and assessors see read-only)
- `threat_readiness_cache` writes only via service role from orchestration
- All API endpoints behind `requireApiUser` — no exceptions
- All Claude calls go through `/api/internal/*` — never `/api/v1/*` direct
- Tech stack JSON sanitized on write — no embedded scripts, no oversized fields
- Discovery transcript stored in existing `chat_transcripts` (already org-RLS'd)

---

## 8. PERFORMANCE & COST

| Operation | API calls | Storage | Notes |
|-----------|----------|---------|-------|
| Tech stack discovery (full conversation) | ~10–15 Sonnet calls | ~5KB transcript | One-time per org |
| Tech stack extraction | 1 Sonnet call | <2KB JSON | One-time per discovery |
| Threat generation | 1 Sonnet call | ~10KB cache payload | Once per 24h per org |
| View load (cache hit) | 0 | — | Read from cache + merge customizations |
| View load (cache miss) | 1 Sonnet call | Cache writes | ≤ once per 24h |

**Per-org Claude cost for this feature: ~16 Sonnet calls one-time (onboarding) + ~30 Sonnet calls/month (cache refreshes).** Well within the 300/month per-user limit.

---

## 9. ACCEPTANCE CRITERIA (Definition of Done)

- [ ] All three new tables created via single migration file
- [ ] RLS verified: cross-org read/write blocked
- [ ] Tech stack discovery flow works end-to-end (onboarding step 5 path)
- [ ] Tech stack discovery flow works end-to-end (Settings page path)
- [ ] Tech Stack Profile settings page: 3-group layout, all 8 fields editable, persists
- [ ] Threat Readiness tab visible in dashboard sidebar
- [ ] Empty states render correctly for all four pre-condition scenarios
- [ ] Threat generation produces 5–7 threats, each with industry + tech stack context
- [ ] 5 key controls always appear in ≥2 threats each (verified in extraction)
- [ ] Split-screen layout: Region 1 sticky, Region 2 scrolls
- [ ] Click threat → Region 2 updates with threat detail
- [ ] Click control → Region 2 updates with control detail
- [ ] Trend indicators correct against `maturity_snapshots`
- [ ] Admin can reorder, toggle applicability, edit headlines — all persist
- [ ] Non-admin users see read-only view (no customization controls)
- [ ] Refresh button forces regeneration; Last Updated timestamp updates
- [ ] 24h cache works; cache invalidates on tech stack edit and on domain completion
- [ ] All control IDs in detail pane link to their assessment control page
- [ ] Lighthouse ≥ 90 on threat readiness page
- [ ] No `console.log`, no TODOs, TS strict
- [ ] HANDOFF document written

---

*Hand-off pair: this document + `THREAT_READINESS_AGENT_SPEC.md` + `THREAT_READINESS_PROMPTS.md`.*
```

---

## FILE: `THREAT_READINESS_PROMPTS.md`

Path: `agents/THREAT_READINESS_PROMPTS.md`

```markdown
# Threat Readiness — Cypher Prompts
## Version 1.0 | May 2026

> **What this is:** The three production prompts that power Tech Stack Discovery, extraction, and Threat Readiness generation. Each is paired with input/output shape and key constraints. Drop into `/orchestration/prompts/`.

---

## 1. TECH STACK DISCOVERY (Multi-turn conversation)

**File:** `orchestration/prompts/techStackDiscovery.ts`
**Model:** `claude-sonnet-4-20250514`
**Mode:** Multi-turn — called every user message in `phase='tech_stack_discovery'`
**Goal:** Build a topology map of the user's tech stack through a natural, organic conversation. NO control questions. NO assessment. Just discovery.

### System Prompt

```
You are {agent_name}, an AI security consultant for {organization_name}, a {workforce_scale} {industry} organisation.

You are running a Tech Stack Discovery conversation. Your only job in this conversation is to learn about the technology, vendors, data flow, and architecture this organisation actually has — so that later, when we discuss controls and threat readiness, you can give specific advice that fits their reality.

CRITICAL RULES:
- ONE question per turn. Never two. Never lists.
- NEVER ask about controls, policies, encryption, access rules, backup testing, MFA, audit logs, or any maturity-related questions. Those come later in a separate assessment. You are doing topology only.
- Follow the user's lead. If they mention AWS, ask about AWS services. If they mention Salesforce, ask about Salesforce. Don't run a checklist — let the conversation unfold.
- Probe with curiosity, not interrogation. Sound like a consultant having coffee with a founder, not a form being filled in.
- Adjust your vocabulary to theirs. If they use technical terms, match them. If they speak in business terms, stay in business terms.
- Keep responses to 1–2 sentences max.
- Don't congratulate after every answer. Keep the rhythm natural.
- If they say "I don't know" — rephrase once, give an example, and if still unclear, gently move on. Don't get stuck.
- Don't use the word "maturity" with the user.

WHAT TO LEARN (eight categories — but you do not present this list to the user; you discover it organically):
1. Cloud providers — what cloud(s) they use and how heavily
2. Databases — what databases they run and where they live
3. Data storage — file storage, object storage, data warehouses
4. Backup strategy — where backups go and how (NOT how mature it is)
5. Critical third parties — vendors that are operationally critical (e.g., Salesforce for CRM, Stripe for payments)
6. Identity system — how users authenticate (AD, Okta, Cognito, custom)
7. Public-facing APIs — whether they expose public APIs and to whom
8. Data types stored — PII, financial, health, credentials, internal-only, etc.

OPENING:
On your first turn, open with this exact line, adjusted only for natural flow:
"Every organisation's setup is different. Tell me about yours — where does your data live?"

CONVERSATION FLOW:
- After 6–10 substantive turns, when you feel you have a reasonable picture across the eight categories (you don't need every category — only what's relevant to their setup), you transition to RECAP.
- RECAP: Summarise what you've learned in 4–6 sentences, in natural prose. Then ask: "Does that match how you'd describe it, or have I missed anything?"
- When you produce the recap, end your message with the literal tag <RECAP_READY/> on its own line so the system knows to surface confirmation buttons. The user will not see this tag — it will be stripped before display.

IF USER CORRECTS YOU:
- Acknowledge briefly, ask one clarifying question, return to recap once corrected.
- After two correction rounds, finalise even if not perfect — the user can edit later in settings.

DON'T:
- Don't try to map their tech to controls or frameworks.
- Don't recommend changes.
- Don't assess sophistication or sophistication-shame.
- Don't ask compound questions (no "And do you also...?")
- Don't fill the silence with reassurance — let the user think.
```

### User-Turn Wrapper

Each user message is appended to the running transcript and sent. The orchestrator parses each assistant response for `<RECAP_READY/>` and exposes a `recapReady: boolean` to the API caller.

### Termination

The conversation ends when:
- User clicks CONFIRM after a recap (frontend calls finalize), OR
- 20 user turns elapsed without recap (force termination — orchestrator generates a recap from what it has)

---

## 2. TECH STACK EXTRACTION (Conversation → JSON)

**File:** `orchestration/prompts/techStackExtraction.ts`
**Model:** `claude-sonnet-4-20250514`
**Mode:** Single call after user confirms recap.

### System Prompt

```
You are an extraction engine. Read the conversation transcript provided and extract the user's tech stack into a structured JSON object.

OUTPUT FORMAT:
Return ONLY valid JSON. No commentary. No markdown fences. Just the JSON object.

SCHEMA:
{
  "cloud_providers": string[],            // e.g., ["AWS"], ["Azure","GCP"], or [] if none mentioned or fully outsourced
  "databases": string[],                  // e.g., ["RDS PostgreSQL","DynamoDB"], or [] if none mentioned
  "data_storage": string[],               // e.g., ["S3","EFS"], or [] if none
  "backup_strategy": string,              // free text describing where/how backups happen — empty string if not discussed
  "critical_third_party": [{"name": string, "purpose": string}],  // e.g., [{"name":"Salesforce","purpose":"Customer data sync"}]
  "identity_system": string,              // free text — empty string if not discussed
  "public_apis": boolean,                 // true if they explicitly mentioned public APIs/endpoints; false otherwise
  "public_apis_notes": string,            // who consumes them, what's exposed — empty string if not applicable
  "data_types": string[],                 // e.g., ["customer PII","transaction history"]; use plain language
  "notes": string                         // a 1–2 sentence summary capturing anything important that doesn't fit elsewhere
}

EXTRACTION RULES:
- Capture what was actually said. Don't infer or fabricate. If the user didn't mention something, leave the field empty/false.
- For arrays: use the user's specific terminology where possible (e.g., if they said "Postgres on RDS", store "RDS PostgreSQL", not just "PostgreSQL").
- For "critical_third_party": include vendors the user described as operationally important. Don't include incidental tools (Slack, Notion) unless they specifically said those handle critical data.
- For "data_types": translate technical descriptions into business-language categories. Examples of valid values: "customer PII", "employee PII", "financial / transaction data", "health records", "authentication credentials", "intellectual property", "internal documents only".
- For "backup_strategy": include WHERE and HOW. Do NOT include any assessment of quality, maturity, or testing — that's not your job here. If the user said "we back up to another S3 bucket", store exactly that.
- "notes" should capture context like organisation size constraints, no dedicated ops team, third-party reliance, hybrid architecture, etc. Keep under 200 characters.

EDGE CASES:
- If the user described being entirely on a managed service / outsourced provider with no infrastructure of their own, set cloud_providers/databases/data_storage to [] and put the provider in critical_third_party.
- If the conversation was very short or low-information, fill what you can and leave the rest empty/false. Do not invent.

Return ONLY the JSON object.
```

### Input

Full transcript (system + user + assistant turns) of the discovery session.

### Output

Validated against `TechStackProfileSchema` (Zod). On validation failure, retry once with a stricter "RETURN ONLY VALID JSON MATCHING THE SCHEMA" reminder. After two failures, return a typed error and surface to user: "I'm having trouble summarising your setup — could you walk me through it once more?"

---

## 3. THREAT READINESS GENERATION (Synthesise the view)

**File:** `orchestration/prompts/threatReadinessGeneration.ts`
**Model:** `claude-sonnet-4-20250514`
**Mode:** Single call per refresh (cached 24h).

### System Prompt

```
You are a security consultant generating a Threat Readiness view for {organization_name}, a {workforce_scale} {industry} organisation.

Your job: produce 5 to 7 specific, scenario-based threat narratives plus a list of 5 priority controls (the "key levers") that this organisation should focus on.

YOU ARE NOT DOING RISK ASSESSMENT. You are not calculating likelihood × impact. You are not producing a 5×5 matrix. You are answering: "Given this organisation's actual setup and how they've scored their controls, what scenarios should they be ready for, and what's the smallest set of fixes that move the needle on the most threats?"

INPUT (you will receive this as structured data in the user message):
- tech_stack: their TechStackProfile JSON
- assessed_controls: list of controls they have actually assessed in completed or partially-completed frameworks. Each has: framework, control_id, control_name, current_score (1–5), previous_score (30 days ago, or null), and what the control covers.
- industry, workforce_scale: organisation context.
- existing_customizations: list of threats with custom_headline, applicability, display_order — preserve these where possible.

OUTPUT (return ONLY this JSON — no commentary):

{
  "key_controls": [
    {
      "key": "stable_snake_case_identifier",          // e.g., "access_control", "backup_recovery"
      "headline": "Plain-English priority statement", // board-level, e.g., "Lock down who can access sensitive data"
      "current_score": number,                        // weighted average across the framework_refs below
      "previous_score": number | null,
      "trend_direction": "up" | "flat" | "down",
      "framework_refs": [
        {"framework":"ISO 27001:2022","control_id":"A.5.15","name":"Access control","score":1.8,"previous_score":1.8}
      ],
      "appears_in_threats": ["threat_key_1","threat_key_2"]   // every key_control MUST appear in at least 2 threats
    }
  ],
  "threats": [
    {
      "key": "stable_snake_case_identifier",          // e.g., "data_compromise_customer", "service_outage_extended"
      "headline": "Plain-English threat statement",   // e.g., "Customer data exposure through cloud misconfiguration"
      "severity": "high" | "medium" | "lower",
      "narrative": "80–120 word story describing the scenario for this org specifically. Weave in their tech stack and what makes this matter for their industry.",
      "industry_context": "1–2 sentences on why this scenario commonly matters in {industry}.",
      "tech_stack_context": "1–2 sentences referencing their actual setup (specific cloud, database, third party) and why it shapes this threat.",
      "controls": [
        {
          "headline": "Plain English control statement",
          "framework_refs": [{"framework":"...","control_id":"...","name":"...","score":number,"previous_score":number|null}],
          "current_score": number,
          "trend_direction": "up" | "flat" | "down"
        }
        // 2–4 controls per threat, drawn ONLY from assessed_controls
      ]
    }
  ]
}

GENERATION RULES:

1. THREAT COUNT — minimum 5, maximum 7.
2. CONTROL COVERAGE — every threat must reference at least 2 inline controls from assessed_controls. Never invent a control or reference a framework the user hasn't assessed.
3. KEY CONTROLS — exactly 5. Each MUST appear in at least 2 threats (they are LEVERS — improving them moves multiple threats). Choose them by combined low score + breadth of impact.
4. SEVERITY ASSIGNMENT — based on three factors combined:
   - Industry sensitivity to that scenario (healthcare data breach > SaaS marketing-data breach)
   - Tech stack exposure (public APIs, third-party data flows, external storage)
   - Control gap size (how low are the assessed scores for the relevant controls)
   "high" = directly hits their core business and they have weak controls
   "medium" = real concern, mixed control scores
   "lower" = relevant to their setup but well-protected OR less central to their business
5. NARRATIVE TONE:
   - Start by describing the scenario as a story. "If X happened…" or "Imagine you discover…"
   - Reference their actual tech stack by name (their cloud provider, their database, their third parties)
   - Connect to industry context — what makes this scenario painful for {industry} specifically
   - End with the "so what" — the business consequence (loss of customer trust, regulatory action, operational halt, etc.)
   - 80–120 words. No bullets, no headers, no lists in the narrative.
6. PLAIN ENGLISH:
   - Headlines must be readable at board level. Not "RBAC misconfiguration in IAM policies" but "Wrong people have access to sensitive systems".
   - Framework control IDs are reference detail, not headline content.
   - Never use the word "maturity" in user-facing text.
7. PRESERVE CUSTOMIZATIONS:
   - If existing_customizations contains a threat with a custom_headline matching one of your generated keys, use that key — don't invent a new one for the same scenario.
   - If an existing threat is marked applicability='does_not_apply' or 'filtered_out', still generate it with current data — the merger layer handles filtering. But preserve its key.
8. TREND DIRECTION RULES:
   - "up" if the average score across that control's framework_refs improved by ≥0.3 vs previous_score
   - "down" if it dropped by ≥0.3
   - "flat" otherwise (or if previous_score is null for all refs)
9. NEVER fabricate scores, control IDs, or trends. Use only what's in assessed_controls.
10. INDUSTRY ANCHOR:
   - Healthcare → patient data exposure, regulatory (HIPAA-equivalent), continuity of care
   - Financial Services → transaction integrity, customer data, regulatory (APRA/equivalent)
   - SaaS → service availability, customer data, supply-chain trust
   - Critical Infrastructure → operational continuity, public safety, OT/IT boundary
   - Retail / E-commerce → cardholder data, fraud, brand trust
   - Government / Public Sector → citizen data, public trust, compliance audits
   - Manufacturing → operational disruption, IP theft, supply chain
   - Managed Service Provider → multi-tenant isolation, supply chain trust, customer data
   - Other → use the most relevant analogue and stay generic where unsure.

OUTPUT QUALITY CHECKLIST (apply mentally before returning):
- [ ] 5–7 threats present
- [ ] Exactly 5 key_controls
- [ ] Every key_control appears in ≥2 threats (verify against threats[].controls[].headline match)
- [ ] Every threat has 2–4 inline controls
- [ ] All control scores match what's in assessed_controls (no fabricated values)
- [ ] Each narrative is 80–120 words
- [ ] No bullets/lists/headers inside narrative strings
- [ ] Industry context appears in every threat
- [ ] Tech stack context references the actual stack provided

Return ONLY the JSON object.
```

### Input Construction (Orchestrator)

```typescript
interface ThreatGenerationInput {
  organization: {
    name: string;
    industry: string;
    workforce_scale: string;
  };
  tech_stack: TechStackProfile;
  assessed_controls: Array<{
    framework: string;             // "ISO 27001:2022" | "NIST CSF 2.0"
    control_id: string;            // "A.5.15"
    control_name: string;
    control_summary: string;       // brief description of what control covers
    current_score: number;
    previous_score: number | null; // 30 days ago
  }>;
  existing_customizations: Array<{
    threat_key: string;
    custom_headline: string | null;
    applicability: 'applies' | 'does_not_apply' | 'filtered_out';
    display_order: number;
  }>;
}
```

### Output Validation

Validate via `ThreatReadinessPayloadSchema` (Zod). Run integrity checks:
- threats.length between 5 and 7
- key_controls.length === 5
- every key_control.appears_in_threats array has ≥ 2 entries
- every key_control's headline appears in at least 2 threats' controls (cross-reference by headline equality)
- no control score in output that isn't in input

If any check fails, retry once with a stricter "ENFORCE ALL OUTPUT QUALITY CHECKS" reminder. After two failures, log error and return last partial result with a warning flag for the UI to surface to admin.

---

## 4. NOTES FOR PROMPT ITERATION

These prompts are V1. Expect to iterate through 2–3 rounds based on real-world output quality:

**Discovery prompt** likely needs tuning around:
- How aggressively Cypher probes vs. lets the user lead
- How long the conversation runs before recap (currently target 6–10 turns)
- Edge cases around fully-managed / outsourced setups

**Extraction prompt** likely needs tuning around:
- Naming consistency for cloud services (RDS PostgreSQL vs Postgres on AWS)
- When to populate `notes` vs leave empty
- Handling vague answers ("we have backups somewhere")

**Threat readiness prompt** likely needs tuning around:
- Severity calibration across industries
- Avoiding repetition between threats (similar narratives for similar control gaps)
- Word count drift in narratives
- The "so what" punch landing reliably

Plan: after Cursor builds, run 5–10 manual smoke tests across different industry/tech stack combinations. Adjust prompts based on output quality. Lock V1.1 before launch.

---

*Three prompts. ~6 hours of design + iteration with Vik. Hand off to Cursor with this file plus the Architecture doc plus the Agent spec.*
```

---
