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
