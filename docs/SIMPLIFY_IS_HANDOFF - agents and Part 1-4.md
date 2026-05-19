# Simplify IS — Complete Project Handoff
## Everything from Parts 1–4, Agent Design, Multi-User & UI/UX Specs
### New Chat Context Document — Upload to Claude Project

> **Purpose:** This document is a complete handoff from all previous conversations about Simplify IS. Upload this to the Claude project so every new chat has full context without gaps.
> **Authored:** Vik Soni (Security SME + Product Owner) + Claude (Product Developer & Architect)
> **Status:** Infrastructure complete. Agents designed. Ready to build.

---

## Two Non-Negotiables — Apply To Every Decision

1. **World-class product quality** — This must be the best AI-driven security assessment tool ever built. No shortcuts, no compromises. The moat is Vik's domain expertise combined with Claude's capability.
2. **Security first, always** — Enterprise-grade from day one. No retrofitting. Zero critical findings when pen-tested.

---

## What This Project Is

**Simplify IS (simplify.is)** is a commercial SaaS product — a paid AI-driven security assessment platform. Users interact with **Cypher**, their AI Security Consultant, who guides them through structured ISO 27001 and NIST CSF assessments conversationally. It does NOT feel like a chatbot or checkbox exercise. It feels like a real consultant.

**vik.so** is Vik's existing free personal brand site (already built) with ISO 27001 and NIST CSF AI consultants. It is the public credibility layer and proven the RAG pattern. Simplify IS is the commercial product built on the same architecture.

**Core value proposition:** "Instead of hiring an expensive security consultant, organizations subscribe monthly to an AI agent that continuously assesses their security maturity, tracks compliance across frameworks, and guides them on what to do next."

**Target market:** Australian market first (APRA, ASD Essential Eight appeal), then global. Security managers, CISOs, GRC professionals, IT managers at small-to-mid-size organizations that can't afford full-time consultants.

---

## Key Architecture Decision (Locked)

The fine-tuned LLaMA model has been **removed from the inference path entirely**. All AI responses go through **Claude API + Supabase RAG**. This pattern is proven and live on vik.so. No Mac Mini dependency for inference.

---

## Technical Stack (All Locked)

| Layer | Technology |
|-------|-----------|
| Base Template | github.com/Razikus/supabase-nextjs-template — Next.js 15, Supabase Auth, RLS pre-built |
| AI Primary | Claude API `claude-sonnet-4-20250514` |
| AI RAG Resolver | Claude API `claude-haiku-4-5-20251001` (semantic control ID mapping only) |
| Framework Knowledge | Supabase `ft_iso_controls` + `ft_nist_controls` (same tables as vik.so) |
| Frontend | Next.js 15 App Router + TypeScript (strict) + Tailwind CSS |
| Database | Supabase (Postgres + Auth + Storage) |
| Visualization | D3.js (radar chart, timeline) + Recharts (sparklines) |
| Animations | Framer Motion |
| Email | Resend |
| Payments | Stripe |
| Deployment | Vercel (MVP) → AWS migration path post-launch |

---

## Infrastructure Status — All Pre-Dev Tasks Complete ✅

- ✅ GitHub private repo `simplify-is` created
- ✅ Vercel project created, linked to `simplify-is` repo
- ✅ Supabase `simplify-dev` project created
- ✅ Existing tables confirmed in Supabase: `ft_iso_controls`, `ft_nist_controls`, `control_mappings`, `domains` (21 rows), `top_risks` (seeded), `controls`
- ✅ Claude Code Max configured (`~/.claude/` rules, agents, commands, skills)
- ✅ `CLAUDE.md` created at `~/Documents/Code/simplify-is/CLAUDE.md`
- ✅ Project path: `~/Documents/Code/simplify-is/`
- ✅ Supabase keys: copy from `/Users/vik/Documents/vik-so-dev/.env`
- ✅ Anthropic key: copy from `/Users/vik/Documents/code-ai/Social-content/.env`

---

## Three-Layer Security Architecture

```
INTERNET/USERS
     ↓ HTTPS only
API LAYER (/api/v1/*)
- JWT auth + validation
- Request sanitization
- Rate limiting: 100 req/min, 1000 req/hour per user
     ↓ ORCHESTRATION_SECRET required
ORCHESTRATION SERVICE (/api/internal/*)
- ALL Claude API calls happen here
- ALL RAG context building
- ALL database writes
- Signal extraction, contradiction detection, scoring
     ↓
SUPABASE + Claude API
```

**Rules that are never violated:**
- `SUPABASE_SERVICE_KEY`: NEVER in NEXT_PUBLIC_ or client bundles
- `ANTHROPIC_API_KEY`: NEVER in NEXT_PUBLIC_ or client bundles
- `ORCHESTRATION_SECRET`: NEVER in NEXT_PUBLIC_
- `/api/internal/*` returns 403 without valid `ORCHESTRATION_SECRET`
- All SQL: parameterized queries only — never string interpolation
- RLS on ALL data tables
- JWT validation on EVERY `/api/v1/*` route

---

## RAG Architecture (Three-Pass Strategy)

Every user message goes through this pipeline:

**Pass 1 — Explicit Control ID Extraction:** Parse message for ISO 2022 or NIST CSF 2.0 IDs → fetch full Supabase record → inject into Claude context.

**Pass 2 — Claude Haiku Semantic Resolver:** If no explicit IDs → call `claude-haiku-4-5-20251001` → maps natural language → control IDs → fetch compact summaries from Supabase.

**Pass 3 — Offline Fallback:** Topic keyword map → known control IDs → full-text Supabase search. Never fails to answer.

**Version anchors (always inject):**
- ISO: "IMPORTANT: You cover ISO 27001:2022 ONLY. ISO 27001:2022 has 93 Annex A controls (A.5–A.8). ISO 27001:2013 numbering does NOT exist in 2022."
- NIST: "IMPORTANT: You cover NIST CSF 2.0 ONLY. CSF 2.0 has 6 functions: GV, ID, PR, DE, RS, RC. CSF 1.1 subcategory IDs do NOT apply."

---

## Database Schema — All New Tables

The following tables are already in Supabase and must NOT be recreated:
`ft_iso_controls`, `ft_nist_controls`, `control_mappings`, `domains`, `top_risks`, `controls`

New tables to create via migration:

```
users, organizations, assessment_sessions, control_responses, extracted_signals,
domain_scores, framework_scores, chat_transcripts, compliance_tracker,
risk_control_mappings, organization_risks, claude_api_usage, session_metadata_log, audit_log
```

Key table notes:
- `users` extends `auth.users` — linked via `id UUID REFERENCES auth.users(id)`
- `users.agent_name` — default 'Cypher', user-customizable, persists forever
- `users.claude_api_calls_this_month` — tracked against 300/month hard limit
- `assessment_sessions.current_domain_id` — references `domains` table (not `control_groups`)
- `assessment_sessions.scope_data` JSONB — stores 7 scope question signals
- `control_responses.na_justification` — stores reasoning when user says N.A.
- `control_responses.previous_response_id` — links revision chain
- `audit_log` — service key only access, records all INSERT/UPDATE/DELETE

RLS: enabled on ALL new tables. Org-scoped: users can only access data belonging to their own organization.

---

## API Endpoints (All 10)

Base: `/api/v1/` — all require JWT except auth routes.

1. `POST /assessments/sessions` — Start session (discovery or returning user)
2. `POST /assessments/sessions/{id}/responses` — Submit message (10-step pipeline)
3. `GET /assessments/sessions/{id}` — Fetch session state for resumption
4. `PUT /assessments/sessions/{id}/responses/{rid}` — Revise answer
5. `GET /assessments/organizations/{id}/scores` — Hero dashboard endpoint
6. `GET /assessments/organizations/{id}/sessions` — Session history
7. `POST /assessments/sessions/{id}/export` — PDF export (checklist or executive)
8. `POST /assessments/organizations/{id}/reassess` — Trigger reassessment
9. `GET/POST /assessments/organizations/{id}/risks` — Risk view
10. `GET /assessments/organizations/{id}/export/bi` — BI export (stub for MVP)

Submit response (endpoint 2) processing order:
1. Validate JWT + session ownership
2. Store message in `chat_transcripts`
3. Build RAG context (three-pass)
4. Generate Cypher response (Claude API)
5. Extract signals from user message
6. Store signals in `extracted_signals`
7. Detect contradictions vs prior responses
8. Update session state + phase
9. Check domain completion → trigger scoring if complete
10. Check Claude API usage limit

---

## Orchestration Service — Key Functions

All in `/orchestration/abstraction/claudeOrchestrator.ts` — the ONLY file that calls Anthropic API.

All Claude functions: 3 retries with exponential backoff (500ms/1000ms/2000ms), token logging after every call, usage check before every call.

```typescript
extractSignals(userMessage, controlContext, sessionHistory, ...) → SignalExtractionResult
generateFollowUpQuestion(missingElements, confirmedSignals, round, ...) → string
detectContradiction(previousStatement, newStatement, ...) → string
generateAgentMessage(context, messageType) → string
generateDomainCompletionMessage(domainData) → string
generateSessionOpening(sessionContext) → string
resolveControlsFromNaturalLanguage(message, framework) → string[] // uses Haiku
generateRiskControlMapping(customRiskDescription, framework) → string[]
```

Scoring engine: CMMI 1.0–5.0. Signal weights: high=1.0, medium=0.7, low=0.4, planned=0.0.
**Score updates ONLY when ALL controls in a domain are complete — not per individual answer.**
20% penalty for overdue controls.

Usage monitor: 300 calls/month hard limit. Alert Vik (VIK_ALERT_EMAIL) at 80% (240) and 100% (300). User-facing message at limit: "You've hit your monthly limit — we're looking into it."

Session state machine states: `not_started → discovery → framework_selected → scope → baseline → domain_complete → paused | completed | abandoned`

---

## Assessment Flow

**Phase 1 — Discovery:**
Cypher introduces itself → asks to be named → asks user's name → builds rapport → detects maturity signals passively → checks compliance requirements → identifies top pain points.
Maturity signals (never ask — detect): compliance-driven ("audit coming up") = lower maturity; threat-driven ("we built this ourselves") = higher maturity.

**Phase 2 — Framework Selection:**
Cypher recommends framework based on discovery signals. UI transforms on selection.

**Phase 3 — Scope (7 Questions):**
Logical scope, risk maturity, self-assessed maturity, team composition, budget constraints, incident history, executive awareness.

**Phase 4 — Baseline Assessment:**
By domain/group (not individual control-by-control). Probes using Policy → People → Awareness → Practice → Tools ladder. Score only updates when entire domain is complete.

---

## Cypher Persona Rules

- Default name: **Cypher** (user-renameable on first use, persists forever in `users.agent_name`)
- Agent intro order: agent introduces → asks to be named → asks user's name
- One question at a time. Always.
- Vocabulary: start simple, detect sophistication dynamically, adjust mid-conversation
- Off-topic: brief answer + redirect
- Burning issue: pause, handle, resume
- "I don't know": rephrase → example → max 2 probes → mark To Be Confirmed → move on
- N.A. controls: always probe for justification, store reasoning, re-validate on reassessment
- Contradiction: soft human-like inquiry, never accusatory, three options for user
- Score: never revealed mid-group, always paired with Cypher message on update

---

## Dashboard — Three Views

**Design system:**
- Background: `#0A0F1E` | Surface: `#111827` | Accent: `#00D4FF` (cyan) | Secondary: `#7C3AED` (violet)
- Success: `#10B981` | Warning: `#F59E0B` | Danger: `#EF4444`
- Fonts: DM Serif Display (headings) + DM Sans (body) + JetBrains Mono (scores, IDs)
- Dark theme only. No light mode for MVP.

**View 1 — Industry Domain View (default):** Uses `domains` table (21 rows). Generic groupings, not ISO/NIST labels. D3 radar chart hero. Screenshot-worthy.

**View 2 — Framework Views:** Dedicated ISO 27001 page + NIST CSF 2.0 page. For auditors and compliance teams.

**View 3 — Risk View (opt-in):** User selects from 7 template risks or adds custom. Maturity-based status: 🔴 <2.0 / 🟡 2.0–3.5 / 🟢 >3.5.

**Score animation:** Always paired with Cypher message. Never just visual. Green flash + ↑ for up. Red flash + ↓ for down.

**PDF Export — two types:**
- Internal Checklist: control-by-control, exact answers, scores, N.A. justifications
- Executive Summary: domain summaries, top 5 strengths, top 5 gaps, recommendations, Simplify IS branding

**Notifications:** Email: reassessment due (6 months) + system recovery only. In-app bell: everything else.

**Session timeout:** 15 min default, 15–60 min user-configurable slider, per-window (not global).

---

## Scoring Algorithm

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
// ONLY calculates when ALL controls in domain are complete
// Framework score = weighted average of all domain scores
```

Maturity levels: 1.0–1.99=Initial, 2.0–2.74=Developing, 2.75–3.49=Defined, 3.5–4.24=Managed, 4.25–5.0=Optimizing

---

## All Production Prompts (9 Total)

All prompts live in `/orchestration/prompts/`. Key prompts:

**Signal Extraction (JSON output):** Extracts structured signals from user message. Returns JSON with signals array, confidence levels, contradiction detection, maturity ladder level. Never scores planned as implemented.

**Assessment Baseline:** Conducts structured group-by-group assessment. Probes Policy → People → Awareness → Practice → Tools. Never reveals control IDs to user. Never reveals running score.

**Discovery Phase:** Builds rapport before suggesting framework. Detects maturity signals passively. One question at a time. Max 2 sentences per response.

**Follow-Up Generation:** Single follow-up question max 2 sentences. Max 2 clarification rounds per control then mark TBC.

**Contradiction Detection:** Soft inquiry max 60 words. Three natural options. Never accusatory.

**Domain Completion:** Warm acknowledgement + new score + 1-2 specific strengths + 1 gap as opportunity + bridge to next group. Max 100 words.

**Session Opening:** Timezone-aware greeting. New user: 2 sentences, ask for agent name. Returning user: 2 sentence recap, mention overdue, ask focus. Max 80 words.

---

## Build Plan — 5 Agents, Sequential

```
AGENT 1: INFRA + AUTH          (~6h)
Tasks: Clone Supabase template, clean demo content, Zod env validation,
       DB client abstraction, migration (11 new tables + RLS), auth layer,
       onboarding flow (org setup), route protection middleware,
       design system (Tailwind + CSS vars + fonts), .cursorrules, CLAUDE.md
Writes: HANDOFF_1.md (includes actual Supabase column names for all existing tables)

AGENT 2: ORCHESTRATION ENGINE  (~10h)
Reads: HANDOFF_1.md
Tasks: /api/internal/ security gate (timing-safe ORCHESTRATION_SECRET check),
       three-pass RAG context builder, all 8 Claude API functions with exact prompts,
       usage monitor (300/month limit + Vik alerts), scoring engine (exact CMMI algorithm),
       session state machine (all 7 phase transitions), compliance cadence engine,
       unit tests (80% coverage, Jest + ts-jest)
Writes: HANDOFF_2.md (all function signatures + action strings for Agent 3)

AGENT 3: API LAYER             (~8h)
Reads: HANDOFF_1.md + HANDOFF_2.md
Tasks: Rate limiting middleware (100/min + 1000/hr), security headers (HSTS, CSP, etc.),
       input sanitization, all 10 API endpoints with exact request/response shapes,
       ISO 27001:2022 control library (93 controls, TypeScript constants, 2022 IDs only),
       NIST CSF 2.0 control library (~117 subcategories, CSF 2.0 IDs only),
       domains loader (reads from Supabase `domains` table),
       PDF export (puppeteer or pdfkit, Supabase Storage, 7-day expiry),
       integration tests
Writes: HANDOFF_3.md (all endpoint shapes + TypeScript types for Agent 4)

AGENT 4: FRONTEND              (~14h)
Reads: HANDOFF_1.md + HANDOFF_2.md + HANDOFF_3.md
Tasks: Design system (CSS vars, Tailwind extension, fonts),
       API client hooks (React Query for all 10 endpoints),
       dashboard layout (sidebar, header, 3-tab view),
       cinematic empty state (staggered reveal, Cypher centered → bottom-right),
       Cypher chat (all message types: regular, signal reflection, contradiction, score update),
       score cards (count-up animations, glow on update),
       D3 radar chart (interactive, two polygons, animated morphing),
       D3 timeline with historical state freeze,
       domain card grid (21 cards, color bands, two-way radar binding),
       assessment flow controller (all phase transitions + UI transforms),
       domain complete overlay (score animation, Cypher message, confetti),
       answer revision drawer,
       risk view (template + custom),
       compliance calendar,
       notification bell,
       session timeout handler (per-window, 15–60 min configurable)
Writes: HANDOFF_4.md

AGENT 5: SECURITY + POLISH     (~4h)
Reads: ALL HANDOFF files + spec Section 26
Tasks: Security audit (every checklist item verified, cross-tenant test, XSS test, SQLi test),
       E2E test suite (8 Playwright scenarios: full signup → assessment → PDF export),
       landing page (7 sections, dark theme, converts),
       Stripe integration (checkout, webhooks, billing page, 14-day trial),
       Resend email notifications (3 templates),
       performance pass (bundle analysis, lazy load D3/framer-motion, Lighthouse > 90),
       final visual + copy QA pass
Writes: DONE.md
```

**Total: ~42 hours. One agent per day. Human checkpoint between each — review HANDOFF file before proceeding.**

---

## Agent Global Rules (Every Agent Follows)

**Security:**
- JWT on every `/api/v1/*` route — no exceptions
- `SUPABASE_SERVICE_KEY`: NEVER in NEXT_PUBLIC_ or client-side code
- `ANTHROPIC_API_KEY`: NEVER in NEXT_PUBLIC_ or client-side code
- `ORCHESTRATION_SECRET`: NEVER in NEXT_PUBLIC_
- All SQL: parameterized only
- RLS on ALL data tables
- `/api/internal/*` returns 403 without valid `ORCHESTRATION_SECRET`

**Architecture:**
- Three-layer: API Layer → Orchestration → Database
- No direct Supabase calls from frontend components
- No direct Claude API calls from `/api/v1/` routes
- All external service calls wrapped in abstraction layers (vendor-agnostic)

**Code quality:**
- TypeScript strict mode — no `any` types
- Env vars only from `/lib/config/env.ts` — never `process.env` directly elsewhere
- All Supabase calls through `/lib/db/` abstractions
- All auth calls through `/lib/auth/` abstractions
- No `console.log` in production
- No TODO comments in merged code
- Error handling on every async function

**Framework data:**
- ISO 27001:2022 ONLY — never 2013 IDs (A.7.2.x, A.9.x, A.10.x, A.11.x–A.18.x)
- NIST CSF 2.0 ONLY — GV, ID, PR, DE, RS, RC prefixes only (never PR.AC-1 style)

**Claude models:**
- Primary: `claude-sonnet-4-20250514`
- RAG resolver only: `claude-haiku-4-5-20251001`

---

## Handoff Protocol Between Agents

Each agent writes `HANDOFF_N.md` containing:
- Every file created with one-line description
- What was tested and confirmed working
- Required environment variables
- Database tables created + migration file name
- **Actual column names from all inspected Supabase tables** (critical for downstream agents)
- Function signatures and return types (API contracts)
- Known issues or deferred items
- Specific notes for the next agent

---

## Tool Strategy

**Cursor:** All code generation. Paste relevant agent instruction MD + spec sections into context. One agent session at a time. Never run two agents simultaneously on same codebase.

**Claude (chat):** Architecture decisions not covered in spec, reviewing HANDOFF files, debugging orchestration logic, security questions, prompt refinement.

**Claude Code:** Tasks too large for single Cursor session, full E2E test suite, complex migrations.

**Rule:** Cursor first (subscription included). Only use Claude API tokens when Cursor genuinely can't handle it.

---

## File & Folder Structure

```
simplify-is/
├── app/
│   ├── (marketing)/           # Landing page, pricing
│   ├── (auth)/                # Login, signup, verify, callback, reset-password
│   ├── onboarding/            # Post-signup org setup
│   ├── dashboard/             # Main app — 3-tab view
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Industry Domain View (default)
│   │   ├── frameworks/        # ISO + NIST framework views
│   │   └── risks/             # Risk View
│   ├── assessment/[sessionId]/
│   ├── billing/
│   └── api/
│       ├── v1/assessments/    # All 10 public endpoints
│       ├── v1/billing/
│       ├── v1/notifications/
│       └── internal/orchestrate/  # Secured orchestration entry point
│
├── orchestration/
│   ├── abstraction/claudeOrchestrator.ts  # ONLY file calling Anthropic API
│   ├── rag/contextBuilder.ts              # Three-pass RAG
│   ├── scoring/maturityEngine.ts          # CMMI scoring
│   ├── compliance/cadenceEngine.ts        # Review cadence
│   ├── session/stateMachine.ts            # Session phases
│   ├── monitoring/usageMonitor.ts         # 300/month limit
│   ├── prompts/                           # All 9 prompt templates
│   └── handlers/                         # Action handlers
│
├── lib/
│   ├── auth/                  # Auth abstraction (swappable to Cognito)
│   ├── db/                    # Supabase client + query helpers
│   ├── config/env.ts          # Zod-validated env (ONLY place reading process.env)
│   ├── api/                   # Response helpers, sanitization
│   └── frameworks/
│       ├── iso27001.ts        # 93 controls as TypeScript constants
│       ├── nistcsf.ts         # ~117 subcategories as TypeScript constants
│       └── domains.ts         # Reads from Supabase `domains` table
│
├── components/
│   ├── chat/CypherChat.tsx              # Primary interaction surface
│   ├── dashboard/
│   │   ├── ScoreCard.tsx               # Animated score with count-up
│   │   ├── RadarChart.tsx              # D3 radar (hero visual)
│   │   ├── ScoreTimeline.tsx           # D3 timeline with historical freeze
│   │   ├── DomainCard.tsx             # 21 domain cards with color bands
│   │   ├── RiskView.tsx               # Risk profile
│   │   └── ComplianceCalendar.tsx     # Overdue/due-soon controls
│   ├── assessment/
│   │   ├── AssessmentController.tsx    # Phase transitions + UI transforms
│   │   ├── GroupView.tsx              # Left sidebar: domain progress
│   │   ├── DomainCompleteOverlay.tsx  # Score reveal overlay
│   │   ├── AnswerRevision.tsx         # Revision drawer
│   │   └── ScopeConfirmation.tsx
│   ├── onboarding/EmptyState.tsx       # Cinematic first-time reveal
│   ├── layout/NotificationBell.tsx
│   └── ui/                            # Button, Card, Badge, Input, ScoreDisplay
│
├── types/
│   ├── api.ts, db.ts, assessment.ts, orchestration.ts
│
├── styles/design-system.ts
├── middleware.ts
├── CLAUDE.md                  # Auto-loaded by Claude Code every session
├── .cursorrules               # Persistent Cursor system prompt
├── .env.example               # All variable names (no values)
├── .env.local                 # Never committed
├── agents/                    # All 7 agent instruction files
│   ├── 00_WAR_ROOM.md
│   ├── 01_AGENT_INFRA_AUTH.md
│   ├── 02_AGENT_ORCHESTRATION.md
│   ├── 03_AGENT_API_LAYER.md
│   ├── 04_AGENT_FRONTEND.md
│   ├── 05_AGENT_SECURITY_POLISH.md
│   └── CLAUDE.md
└── supabase/migrations/001_simplify_schema.sql
```

---

## Environment Variables

| Variable | Where Used | Notes |
|----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + API | Safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend only | Safe for client |
| `NEXT_PUBLIC_APP_URL` | Frontend | Safe for client |
| `SUPABASE_SERVICE_KEY` | Orchestration ONLY | NEVER client-side |
| `ANTHROPIC_API_KEY` | Orchestration ONLY | NEVER client-side |
| `ORCHESTRATION_SECRET` | Internal service auth | Min 32 chars, NEVER client-side |
| `VIK_ALERT_EMAIL` | Monitoring | Receives Claude API usage alerts |
| `PDF_STORAGE_BUCKET` | Orchestration | Default: `reports` |
| `RESEND_API_KEY` | Email (Phase 5) | |
| `STRIPE_SECRET_KEY` | Billing (Phase 5) | NEVER client-side |
| `STRIPE_WEBHOOK_SECRET` | Billing (Phase 5) | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend (Phase 5) | Safe for client |

---

## Framework Structure

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

**Critical data rules:**
- ISO: 2022 format ONLY. Correct: `A.5.19`. Wrong: `A.15.1` (2013 — never use)
- NIST: CSF 2.0 format ONLY. Correct: `GV.OC-01`, `PR.AA-01`. Wrong: `PR.AC-1` (1.1 — never use)

---

## Agent 1 — Infra + Auth: Full Task List

1. Clone `github.com/Razikus/supabase-nextjs-template`, remove demo content, keep infrastructure
2. Build `/lib/config/env.ts` — Zod validation, throws on missing required vars, single source of truth for all env vars
3. Build `/lib/db/client.ts` and `/lib/db/server.ts` — Supabase client abstractions (admin + server + browser)
4. Build `/lib/db/queries.ts` — typed query helpers, parameterized only
5. Create `/supabase/migrations/001_simplify_schema.sql` — all 11+ new tables, indexes, FK constraints, RLS policies
6. Build `/lib/auth/` — `client.ts`, `server.ts`, `context.tsx` — all auth calls abstracted (swappable to Cognito)
7. Build auth pages: `/app/(auth)/login/`, `/signup/`, `/verify/`, `/callback/`, `/reset-password/`
8. Build `/app/onboarding/page.tsx` — 5-step org setup form, creates org record + initial framework_scores
9. Build `/middleware.ts` — JWT protection on dashboard/assessment/api routes, 403 on /api/internal/* without secret, security headers
10. Extend Tailwind config + `globals.css` with design system (CSS vars + DM Serif Display + DM Sans + JetBrains Mono)
11. Create `.cursorrules` at project root
12. Run `npm run build` — zero TypeScript errors before writing HANDOFF_1.md
13. Write `HANDOFF_1.md` with **actual column names of all existing Supabase tables**

---

## Agent 2 — Orchestration: Full Task List

1. Build `/app/api/internal/orchestrate/route.ts` — security gate (timing-safe secret check), action router, audit logging
2. Build `/orchestration/rag/contextBuilder.ts` — three-pass RAG strategy, version anchors, context injection wrapper
3. Build `/orchestration/abstraction/claudeOrchestrator.ts` — all 8 Claude API functions using exact prompts from spec
4. Build `/orchestration/monitoring/usageMonitor.ts` — 300/month hard limit, 80%/100% alerts to Vik
5. Build `/orchestration/scoring/maturityEngine.ts` — exact CMMI algorithm, signal weights, maturity levels, overdue penalty
6. Build `/orchestration/session/stateMachine.ts` — all phase transitions, cross-session memory injection, scope signal tracking
7. Build `/orchestration/compliance/cadenceEngine.ts` — review frequency defaults, due/overdue checks, reassessment triggers
8. Write Jest unit tests — 80% coverage on all orchestration functions
9. Write `HANDOFF_2.md` with all function signatures + action strings Agent 3 needs

---

## Agent 3 — API Layer: Full Task List

1. Update `/middleware.ts` — rate limiting (100/min + 1000/hr per user), security headers (HSTS, CSP, X-Frame-Options etc.), CORS to prod domain only, 10MB request size limit
2. Build `/lib/api/response.ts` — standard success/error response helpers, common error codes
3. Build `/lib/api/sanitize.ts` — strip HTML/script tags, validate UUIDs, trim whitespace
4. Build `/lib/frameworks/iso27001.ts` — all 93 controls as TypeScript constants (2022 IDs only)
5. Build `/lib/frameworks/nistcsf.ts` — all ~117 subcategories as TypeScript constants (CSF 2.0 IDs only)
6. Build `/lib/frameworks/domains.ts` — reads from Supabase `domains` table using HANDOFF_1.md column names
7. Build all 10 API endpoints with Zod validation, exact request/response shapes from spec
8. Build PDF export — puppeteer or pdfkit, Supabase Storage, 7-day expiry on files, signed URL response
9. Write integration tests for all endpoints
10. Write `HANDOFF_3.md` with all endpoint shapes + TypeScript types exported from `/types/api.ts`

---

## Agent 4 — Frontend: Full Task List

1. Build `/styles/design-system.ts` + `globals.css` — Tailwind extension, CSS vars, Google Fonts
2. Install: framer-motion, recharts, d3, lucide-react, clsx, tailwind-merge
3. Build `/components/ui/` primitives — Button (4 variants), Card (3 variants), Badge, Input/Textarea, ScoreDisplay
4. Build `/lib/api/client.ts` + React Query hooks for all 10 endpoints
5. Build `/app/dashboard/layout.tsx` — collapsible sidebar, top header, 3-tab view
6. Build `/components/onboarding/EmptyState.tsx` — cinematic staggered reveal, Cypher centered → shrinks to bottom-right
7. Build `/components/chat/CypherChat.tsx` — all message types (regular, signal reflection, contradiction, score update), typing indicator, quick-action chips
8. Build `/components/dashboard/ScoreCard.tsx` — count-up animation, glow pulse, delta arrow, sparkline
9. Build `/components/dashboard/RadarChart.tsx` — D3, two polygons, interactive hover, animated morphing
10. Build `/components/dashboard/ScoreTimeline.tsx` — D3 line chart, dual-handle slider, historical state freeze
11. Build `/components/dashboard/DomainCard.tsx` — 21 cards, color bands, two-way radar binding
12. Build `/components/assessment/AssessmentController.tsx` — all phase transitions + UI transforms
13. Build `/components/assessment/GroupView.tsx` — left sidebar with domain/control progress
14. Build `/components/assessment/DomainCompleteOverlay.tsx` — score animation, Cypher message, subtle confetti
15. Build `/components/assessment/AnswerRevision.tsx` — revision drawer with history
16. Build `/components/dashboard/RiskView.tsx`, `ComplianceCalendar.tsx`
17. Build `/components/layout/NotificationBell.tsx`
18. Build `/components/assessment/SessionTimeoutHandler.tsx` — per-window, 15–60 min configurable
19. Write `HANDOFF_4.md`

---

## Agent 5 — Security + Polish: Full Task List

1. Security audit — every item in the pre-launch checklist (cross-tenant test, XSS, SQLi, CORS, headers, secret scanning)
2. E2E tests — 8 full Playwright scenarios from signup through PDF export
3. Landing page — 7 sections, dark theme, converts
4. Stripe integration — checkout, webhooks (5 event types), billing page, 14-day trial, subscription middleware
5. Resend email — 3 templates: `reassessment_due`, `system_recovery`, `usage_alert_vik`
6. Performance pass — bundle analysis, lazy-load D3/framer-motion/recharts, Lighthouse > 90
7. Final visual + copy QA — no orphaned states, no Lorem ipsum, all errors helpful, Cypher named consistently
8. Write `DONE.md`

---

## Agent 6 — Multi-User Collaboration (Post-MVP)

**Build this AFTER Agents 1–5 are complete. This is a post-MVP feature.**

### What It Adds
A single organization can have multiple users with different roles. Each user can be assigned specific domains to assess. Admin has final authority on all answers. Full immutable audit trail.

### Three Roles
- **Admin:** Full access. Invites users, assigns domains, selects final answers, sees all responses with names, views audit trail.
- **Assessor:** Can answer their assigned domains, view dashboard, see other answers anonymised ("Another team member answered...").
- **Viewer:** Read-only access to dashboard and Cypher AI.

### Database Changes
```sql
-- Extend users table
ALTER TABLE public.users ADD COLUMN role VARCHAR(20) DEFAULT 'admin'; -- admin | assessor | viewer
ALTER TABLE public.users ADD COLUMN status VARCHAR(20) DEFAULT 'active'; -- active | inactive | pending
ALTER TABLE public.users ADD COLUMN invited_by UUID REFERENCES public.users(id);
ALTER TABLE public.users ADD COLUMN invited_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN expires_at TIMESTAMPTZ;

-- New: domain_assignments
CREATE TABLE public.domain_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  framework_id VARCHAR(50) NOT NULL,
  domain_id VARCHAR(100) NOT NULL,
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pending' -- pending | in_progress | completed
);

-- New: final_answers (admin canonical answer per control)
CREATE TABLE public.final_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  control_id VARCHAR(100) NOT NULL,
  selected_response_id UUID REFERENCES public.control_responses(id),
  custom_answer TEXT,
  admin_id UUID REFERENCES public.users(id),
  admin_note TEXT,
  finalized_at TIMESTAMPTZ DEFAULT NOW()
);

-- New: multi_user_audit_trail (immutable)
CREATE TABLE public.multi_user_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id VARCHAR(50) NOT NULL,
  control_id VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL, -- answer_submitted | answer_edited | final_selected | final_edited | final_custom
  performed_by UUID REFERENCES public.users(id),
  response_id UUID REFERENCES public.control_responses(id),
  final_answer_id UUID REFERENCES public.final_answers(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Scoring Priority with Multi-User
```
IF final_answer exists → use for scoring
ELSE IF single response exists → use that
ELSE → control = "unanswered"
```

### New API Endpoints
```
POST   /api/users/invite                    -- Admin only
GET    /api/users                           -- List org users
PATCH  /api/users/:id                       -- Update role/status/expiry
DELETE /api/users/:id                       -- Deactivate
GET    /api/users/:id/activity

POST   /api/assignments                     -- Assign domain to user
GET    /api/assignments                     -- All assignments (admin)
GET    /api/assignments/mine                -- My assignments (assessor)
PATCH  /api/assignments/:id
DELETE /api/assignments/:id

POST   /api/responses                       -- Submit answer
GET    /api/responses/:framework/:controlId -- All responses for control
PATCH  /api/responses/:id                   -- Edit own response

POST   /api/final-answers                   -- Set final answer (admin)
PATCH  /api/final-answers/:id
GET    /api/final-answers/:framework

GET    /api/audit-trail                     -- Full audit trail (admin)
GET    /api/audit-trail/:controlId          -- Per-control trail
```

### Role Permissions Matrix
| Action | Admin | Assessor | Viewer |
|--------|-------|----------|--------|
| Invite users | ✅ | ❌ | ❌ |
| Assign domains | ✅ | ❌ | ❌ |
| Answer controls | ✅ | ✅ assigned only | ❌ |
| See own answers | ✅ | ✅ | ✅ |
| See others' answers (named) | ✅ | ❌ | ❌ |
| See others' answers (anon) | ✅ | ✅ | ❌ |
| Select final answer | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| View audit trail | ✅ | ❌ | ❌ |
| Access Cypher AI | ✅ | ✅ | ✅ |
| Manage org settings | ✅ | ❌ | ❌ |

### UI Changes for Agent 6

**Navigation:** Left sidebar adds "👥 Team" (admin only) and "📋 My Tasks" (assessors only). Audit Trail accessible only via avatar dropdown — NOT in sidebar.

**Dashboard domain cards:** Add contributor count ("🤝 2 team members contributed"), conflict indicator (⚠️ amber, admin only), final answer author.

**Admin dashboard bar:** Team progress summary + "⚠️ X controls need your review [Review Now →]"

**New pages:**
- `/admin/team` — User list (name, role, status badges: Active/Pending/Expires), quick stats panel
- `/admin/team/invite` — Slide-over panel: email, name, role radio, optional domain assignment + expiry
- `/admin/assignments` — Tabs: By Domain / By User / Unassigned
- `/admin/audit-trail` — Immutable record, reverse chronological, colour-coded action types, CSV export
- `/assessor/assignments` — My assigned domains with progress and due dates

**Control detail page:** Assessors see anon preview of existing answer (gray box, no name). Admin sees all responses with names + [Select as Final] / [✏️ Edit] options + conflict indicator.

**Conflict resolution view:** Accessible from "Review Now" link. Lists controls with score conflicts. [Resolve →] links to control detail.

**Colour additions:**
- Conflict: `#F59E0B` | Final answer: `#10B981` | Pending: `#6B7280`
- Anonymous answer bg: `#F3F4F6` | Admin highlight: `#EFF6FF`

**Interaction notes:** Slide-over panels (not center modals). Conflict indicators: subtle pulse animation. Final answer selection: requires confirmation step (not single-click). Evidence checkboxes: pre-checked by control type.

### Agent 6 Build Order
1. DB schema migrations (extend users + 3 new tables)
2. Auth middleware updates (role guard)
3. User management API (invite, list, update, deactivate)
4. Domain assignment API
5. Control responses API (with response anonymisation middleware)
6. Final answers API
7. Audit trail (auto-logging hooked into response save logic)
8. Email notifications (invited, assigned, expiring)
9. Frontend: Team Management + Audit Trail pages
10. Frontend: Dashboard updates (contributor labels, conflict indicators)
11. Frontend: Control detail updates (response list + evidence selection)
12. Testing: all 18 role permission combinations + conflict flow

### Out of Scope (Agent 7+)
Internal audit workflow, ISMS/Policy Management, file/document upload for evidence, bulk user import (CSV), SSO/SAML, real-time websockets.

---

## All UX Decisions — Locked

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
| Database | Supabase (MVP) → AWS RDS migration path |
| Pricing | Single monthly tier at MVP launch |
| Multi-user | Post-MVP (Agent 6): Admin/Assessor/Viewer roles |

---

## Post-MVP Backlog (Priority Order)

| Feature | Priority |
|---------|---------|
| ASD Essential Eight | High — Australian market |
| APRA CPS 234 | High — Australian financial sector |
| Document upload + signal extraction | High |
| Multi-user organizations | High — Agent 6 |
| PCI-DSS | Medium |
| HIPAA | Medium |
| Power BI integration (full) | Medium |
| Peer benchmarking | Medium |
| Executive auto-reports | Medium |
| MCP server integrations (Okta, SailPoint) | Medium |
| Cross-framework answer porting | Low |
| Mobile app | Low — after web product validated |

---

## Pre-Launch Security Checklist

- [ ] JWT validation on every protected API route
- [ ] RLS tested for all tables (User A cannot read User B's data)
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
- [ ] PDF reports have 7-day expiry on Supabase Storage
- [ ] Account deletion cascade working (user can delete all their data)
- [ ] No PII in console.log statements
- [ ] Claude API call count tracked and enforced

---

## E2E Test Scenarios (8 Playwright Tests)

1. Full new user onboarding: signup → verify → login → onboarding → dashboard → empty state
2. Discovery phase: Cypher naming exchange → rapport building → maturity signal detection
3. Framework selection → scope: UI transformation → 7 scope questions → scope confirmation
4. Baseline assessment: first domain → 3 control questions → signal reflection messages → confirm
5. Domain completion: complete all controls → domain overlay → score animation → dashboard update
6. Session pause and resume: navigate away → return → Cypher recap → continue from exact point
7. PDF export: at least 1 domain complete → request executive report → download URL returned
8. Answer revision: open domain → revision drawer → edit → score recalculation → revision history

---

## Vik's Working Style & Preferences

- Vik is the security domain expert and product owner. Claude is the product developer and architect.
- Always treat Vik's security knowledge as authoritative. Never override security-related domain decisions.
- Prefers one question at a time rather than batches.
- Works mobile/audio when away from computer.
- Prefers Claude to act as product developer while Vik is SME.
- All documentation in Markdown files.
- Cursor for code execution. Claude for architecture, review, and decisions not in spec.
- Non-negotiable design principles: world-class quality + security first.

---

*Handoff document covering all sessions: Parts 1–4 product spec, agent build plan, Agent 6 multi-user, UI/UX design, all locked decisions.*
*Next step: Open a new chat, upload this file + SIMPLIFY_IS_MASTER_SPEC.md to the Claude project, and continue from Agent 1.*
