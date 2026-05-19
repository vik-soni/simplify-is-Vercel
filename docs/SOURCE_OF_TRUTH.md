# Simplify IS — Source of Truth

> **One file. End-to-end. Maintained going forward.**
> What we are doing · why · where we started · what is done · what is next.
>
> _Last refresh: 2026-04-28 — branch `feat/round2-ui-feedback`._
> _Compiled from: `CLAUDE.md`, `docs/SPEC.md`, `docs/SIMPLIFY_IS_MASTER_CONTEXT.md`, `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` §28, `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2, `docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md`, `docs/HANDOFF_10/11`, every commit since `fa2a7d7`, working tree on this branch, and the Notion bridge page (`3179e9b1-def7-81a1-87c1-f462b297ce28`)._

---

## 0 · How to use this document

This is the single page anyone — Vik, Claude, a future engineer, an investor, an auditor — should be able to open and understand the whole product. It is **append-only at the section level**: when something changes, update the relevant section in place; do not rewrite the whole file. Sections deliberately mirror the "what / why / where started / what done / what next" structure the team uses everywhere else.

**Sister documents (don't duplicate, link):**
- `CLAUDE.md` — agent rules (architecture, env, AU English, security). Authoritative.
- `docs/SPEC.md` — full MVP spec (Parts 1–4 combined).
- `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` — every locked UI/UX decision; §28 = Round 2 deltas.
- `docs/UI_UX_FEEDBACK_REMEDIATION.md` — file-level fix briefs (§R1, §R2).
- `docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md` — page-by-page audit (Apr 26 2026).
- `docs/HANDOFF_10_POSTLOGIN_CLAUDE_CODE.md` — full-site Stitch fidelity pass log.
- `docs/HANDOFF_11_ROUND2_BACKEND.md` — backend tasks queued for Agent 11.
- `agents/00_WAR_ROOM_MasterOrchestration.md` — agent build playbook.
- Notion: `Simplify.is — Comprehensive Guide` (parent `3179e9b1-def7-81a1-87c1-f462b297ce28`) — narrative copy for slides / external sharing.

---

## 1 · What we are doing

**Simplify IS** (`simplify.is`) is a commercial SaaS — monthly subscription, AI-driven security maturity assessment platform.

Users hold a structured, conversational maturity review with **Cypher**, a Claude-powered AI security consultant. Cypher walks them through ISO 27001:2022 and NIST CSF 2.0 by industry-standard domain (not control-by-control), scores them on a CMMI 1.0–5.0 ladder, tracks progress over time, and produces a board-ready PDF.

It is _not_ a chatbot, and it is _not_ a checkbox tool. It feels like a real consultant — one who never forgets a conversation, knows 210 controls across two global frameworks, and is available 24/7.

**Two surfaces, one philosophy:**
- **`vik.so`** (free, permanent) — Vik's personal brand site. ISO 27001 + NIST CSF AI consultants powered by Claude + Supabase RAG. Credibility, community, lead-gen. Also serves as the proven RAG pattern that Simplify IS adopts.
- **`simplify.is`** (paid SaaS) — the structured assessment engine, persistent Cypher, scoring, dashboards, PDF reports, compliance tracking, Risk View, multi-user, billing.

`decipher.net` is also owned by Vik and reserved for future expansion.

### 1.1 The two non-negotiables — applied to every decision

1. **World-class product quality.** No shortcuts, no compromises, no placeholder logic, no TODO in production code.
2. **Security first, always.** Enterprise-grade from day one. Target: zero critical findings on a real penetration test.

### 1.2 Target market

- **Sweet spot:** organisations with 50–5,000 employees that can't afford a full-time CISO or expensive consultants but need to demonstrate compliance.
- **Geo:** Australia first (APRA, ASD Essential Eight, AU privacy framing) → global.
- **Sectors:** financial services, healthcare, SaaS, technology, retail, professional services.
- **Buyer personas:** primary = Security Manager · secondary = CISO · tertiary = GRC / Compliance Officer.

### 1.3 What's in MVP scope

- Marketing pages, auth (Supabase + MFA), onboarding (4 steps), persistent organisational profile.
- Two frameworks at launch: **ISO 27001:2022** (93 controls) and **NIST CSF 2.0** (~117 subcategories).
- Full assessment flow: Discovery → Scope (7 questions) → Baseline by 21 industry-standard domains.
- Three dashboards: Industry Domain (default) · Framework-specific (ISO / NIST) · Risk View (opt-in).
- Cypher persona — user-named on first use, persists forever in `users.agent_name`.
- Real-time CMMI scoring (domain + framework levels), revision history, contradiction detection.
- PDF export — internal checklist + executive summary.
- Compliance cadence (6-month reassessment + event-based + manual button).
- Notifications (email: reassessment + recovery; in-app bell: everything else).
- Stripe subscription (single tier at MVP).
- Power BI / BI export endpoint (stubbed for the integration shape).

**Explicitly out of MVP:** PCI-DSS, HIPAA, APRA CPS 234, ASD Essential Eight (post-MVP add-ons); document upload + signal extraction; advanced peer benchmarking beyond anonymised aggregates; bulk executive reporting; MCP server integrations.

---

## 2 · Why we are doing it

99% of organisations can't afford a full-time CISO or a $400–$800/hour consultant. The tools they use today are checkbox forms from the 2000s with modern skins on top. Neither guides. Neither remembers. Neither builds maturity.

Most companies prepare for one audit, pass it, then drift for 2–3 years. Security maturity decays silently. Security managers spend their time on administration, not actual improvement.

**The product is a third option:** a conversational AI consultant that conducts a real assessment, scores it on the international maturity standard, tracks progress, and produces an artefact you can take to a board or an auditor.

**The moat** is real and specific: a decade of Vik's hands-on security consulting (large-enterprise CISO advisory, MSSP work at Triskel Labs, vik.so) encoded into prompts, control libraries, and a state machine — running on Anthropic Claude (Sonnet 4 + Haiku 4.5 RAG resolver) with Supabase as the framework knowledge base. The vik.so RAG pattern is already live and proven.

### 2.1 Why now

- **EU AI Act** full enforcement begins **2 August 2026** (~14 weeks from today). Every enterprise procurement form now has an AI section.
- **ISO 42001** (AI management) is the new AI MS standard — no major commercial GRC tool has mapped it to NIST CSF 2.0 yet. We can be first.
- **GRC market dislocation:** ~$2T software cap wiped Jan–Feb 2026 (Atlassian -35%, Salesforce -28%). Buyers are unhappy with current GRC tools and will switch. Gartner: 33% of enterprise software is agentic by 2028.
- **OWASP Agentic Top 10 (ASI01–ASI10)** released Black Hat Europe Dec 2025 — no commercial mapping to ISO/NIST exists. Free PDF on vik.so = pure lead-gen for Simplify IS.
- **Anthropic flagged as supply-chain risk** by the Pentagon (Apr 2026 brief). Self-hosted, explainable framework-mapped advisors become a credible enterprise buy. Vik's fine-tunes (vik.so) are well positioned for a future "Defender" tier.

---

## 3 · Where we started

**Pre-build (Phase 0 — before March 20, 2026):**
- Domain `simplify.is` acquired.
- GitHub repo `simplify-is` (private) created and linked to Vercel for auto-deploys.
- Supabase project `simplify-dev` initialised (ref: `gksfyflhnihdizegeglc`).
- 6 reference databases seeded — **210 controls** (93 ISO 27001:2022 + 117 NIST CSF 2.0), 21 industry-standard domains, cross-framework `control_mappings`, 7 risk templates in `top_risks`, plus the `controls` mesh.
- Architecture decided: three-layer (API → Orchestration → Supabase), vendor-agnostic, Next.js 14 App Router, TypeScript strict, Claude API + Supabase RAG (no LLaMA in inference path), Vercel for MVP.
- Agent build sequence planned: 5 specialist agents in sequence, one HANDOFF file between each.
- Claude Code configured — agent rules in `~/.claude/`, project `CLAUDE.md`, slash commands.

**Locked stack (do not re-open):**

| Layer | Choice |
|---|---|
| Frontend + API | Next.js 14 App Router, TypeScript strict, Tailwind |
| Database + Auth | Supabase (Postgres + RLS + Storage) |
| AI primary | Claude API `claude-sonnet-4-20250514` |
| AI RAG resolver | Claude API `claude-haiku-4-5-20251001` (semantic ID mapping only) |
| Framework knowledge | Supabase `ft_iso_controls`, `ft_nist_controls` |
| Visualisation | D3 (radar / timeline) + Recharts (sparklines) — note: `d3` & `recharts` packages were removed in cleanup PR 1 in favour of bespoke SVG; restore when richer charts are needed |
| Animations | Framer Motion (also currently removed; bespoke CSS keyframes used now) |
| Email | Resend |
| Payments | Stripe |
| Deployment | Vercel (MVP) → AWS migration path post-launch |

**Locked architecture rules** (mirrored from `CLAUDE.md` — never violate):
1. Three layers: API routes → `/api/internal/*` orchestration → Supabase. No skipping.
2. No direct Supabase calls from frontend components — always via an API route.
3. No direct Claude calls from `/api/v1/*` — always via `/api/internal/*` orchestration.
4. `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `ORCHESTRATION_SECRET` — never in any `NEXT_PUBLIC_` var or client bundle.
5. All SQL parameterised; no string interpolation.
6. RLS on every data table.
7. JWT validation on every `/api/v1/*` route.
8. `/api/internal/*` returns 403 without `x-orchestration-secret`.
9. ISO 27001:**2022** only (never 2013 IDs). NIST CSF **2.0** only (GV / ID / PR / DE / RS / RC).
10. Env access only via `lib/config/env.ts`.
11. TypeScript strict — no `any`.
12. Rate limiting: 100 req/min, 1000 req/hr per user.
13. Claude API: 3 retries with exponential backoff (500/1000/2000 ms); token logging to `claude_api_usage`; 300 calls/month/user hard cap with alerts at 80% and 100%.

---

## 4 · What has been done so far

### 4.1 Build sequence — agent-by-agent (chronological)

| # | Agent | Status | Headline |
|---|---|---|---|
| 1 | Foundation (Infra + Auth) | ✅ | Next.js scaffold, Zod env, DB abstractions, **13 new Supabase tables + RLS**, auth, onboarding scaffold, middleware. Commits `46f6491`, `fa2a7d7`. |
| 2 | The Brain (Orchestration) | ✅ | 8-function Claude abstraction, three-pass RAG, scoring (CMMI 1.0–5.0 + 0.20 overdue penalty), session state machine, usage monitor (300/mo), cadence engine, 9 prompts. Commit `a77c1a7`. |
| 3 | The API Layer | ✅ | 10 endpoints, rate-limit, security headers, CORS, ISO/NIST control libraries, PDF export route, integration tests. Commit `a591ac2`. |
| 4 | The Face (frontend v1) | ✅ — later superseded | Dashboard, Cypher chat, D3 charts, assessment flow. Commit `2badb7a`. _Most components replaced by Agent 10._ |
| 5 | The Shield (Security + Polish) | ✅ | Full security audit, 8 Playwright E2E, Stripe (subscription + webhooks + trial), Resend (3 templates), bundle analysis, landing page. Commit `12a5111`. |
| — | Spec-gap closure | ✅ | Real frameworks (101 ISO + 106 NIST), real PDF export, full assessment phase flow, dashboard searchParams routing, Settings, ComplianceCalendar, NotificationBell wired, cross-framework answer mapping, Cypher hex avatar + score animations + confetti, BroadcastChannel concurrent-session detection. Commit `16182ba`. |
| 6 | Multi-User Platform | ✅ | Admin + assessor + assignment APIs, team-response handling, email templates, multi-user audit trail. Commit `62bcc5e`. |
| 7 + 8 | Pre-login UX + Auth Backend | ✅ | 20 pre-login pages (3 breakpoints, dark + light, SEO), Supabase TOTP MFA, email verify, password reset, rate-limit, soft-delete. Commits `cbafe87`, `e6038f9`, `40fecef`. |
| 9 | Auth UI/API Wiring | ✅ | Pre-login forms wired to auth backend; 8 complete flows. (Inside the same set of commits above.) |
| 10 | Post-Login UI/UX | ✅ | Canonical chrome (Header / LeftSidebar / Footer / DashboardLayout) with glass surfaces, Industry Hero / Framework View / Risk Workspace / Maturity Roadmap / Progress & Milestones / Organisation Settings, 4-step onboarding rebuilt to Stitch, Pill Cypher FAB, shared UI primitives, mock-data hooks. Commit `a6b658e`. |
| — | Cleanup PRs 1–3 | ✅ | PR 1 (`c5e3bfb`): 48 files / -3,511 LOC / 92 packages dropped. PR 2 (`7a7b73d`): pruned exports + dead orchestration; coverage compliance 45→78%, monitoring 57→61%. PR 3 (`35ca1a7`): split 741-LOC OnboardingFlow → file-per-step, `NEXT_PUBLIC_USE_MOCKS` flag, every doc moved under `docs/`, real README. |
| — | Round 2 (Phases 1–10) | ✅ | Vik's second-pass walkthrough. Phase commits `aaf4af8` → `51e74fc`. See §5.6. |

**Round 2 phase log:**
- Phase 1 (`aaf4af8`) — pre-login chrome, Contact email field, home tile alignment.
- Phase 2 (`5adca86`) — Frameworks Coming Soon set mirrors Pricing add-ons.
- Phase 3 (`858bc2d`) — pre-login copy audit (APRA CPG→CPS, ISO 2013→2022, every Stitch-filler line replaced).
- Phase 4 (`6356ce5`) — onboarding state provider + hints + circle checkboxes + sidebar-mirror tiles.
- Phase 5 (`c0fa0e0`) — authenticated chrome: dropdown wire-up, footer, 404 grounded copy.
- Phase 6 (`06ac365`) — Industry Dashboard zero-state, radar labels, peer-only rail.
- Phase 7 (`a924598`) — Framework View per-tab viz + Risk Stage 1 No-path fix.
- Phase 8 (`9327a06`) — Assessment zero-state tiles, humanised header, Next-advance + answer stub.
- Phase 9 (`a6c274f`) — Progress & Milestones tabs (Timeline / Comparison / Milestones).
- Phase 10 (`51e74fc`) — verification sweep, Stitch + copyright cleanup.

### 4.2 In-flight on `feat/round2-ui-feedback` (uncommitted in working tree)

**Auth — SSR cookies + temp signup-verification bypass (must remove before launch):**
- `app/api/v1/auth/login/route.ts` rebuilt around `@supabase/ssr` `createServerClient` — session cookies written through the SSR adapter and merged into the response.
- `app/api/v1/auth/signup/route.ts` TEMP-switched to `admin.auth.admin.createUser({ email_confirm: true })` — accounts ship pre-verified, response is `201 { auto_verified: true }`. Login email-verification gate commented out.
- New TEMP dev-only routes: `/api/v1/auth/dev-confirm` (force-confirms email by lookup) and `/api/v1/auth/dev-set-password` (sets a known password + confirms email).
- Login form surfaces server messages directly so wrong-password vs unconfirmed vs banned can be distinguished.
- Signup form skips `verify` route and redirects `/login?email=…&just_signed_up=1`.
- Team-size enum normalised to `1-10 / 11-50 / 51-200 / 201-500 / 500+`.
- Middleware CORS: in non-production any localhost / 127.0.0.1 origin is accepted.

**Earthen Brutalism — full Stitch fidelity pass:**
- Two surface tokens locked. Default `--surface: #141311` (post-login / auth / onboarding); `body.marketing` overrides to `#1A1917`. `MarketingShell` + `AuthShell` both attach the class on mount.
- Light-mode palette rebuilt from `stitch_output/*_light_mode/*` — cream `#FDFCF0` base, full `surface-container` ladder, `#211F1D` on-surface, `#85736E` outline, `#D8C2BB` outline-variant.
- Stitch primary tokens added: `--color-primary-container #f2632d`, `--on-primary #5c1900`, `--on-primary-fixed #390c00`, `--on-primary-fixed-variant #822700`, `--on-primary-container #511500` — all exposed as Tailwind utilities.
- Canonical font aliases: `font-headline` → Raleway, `font-body` → Montserrat, `font-label` → Josefin Sans, `font-mono` → Geist (mapped via JetBrains Mono variable).
- New utilities: `.editorial-shadow`, `.input-underline`. `OnboardingCard` promoted `surface-container-low → surface-container-high` with the new shadow.
- Footer top border promoted from inner wrapper to the `<footer>` itself.
- TopNav rebuilt as 3-column grid (`grid-cols-[1fr_auto_1fr]`) so the centre nav is true-centred at every breakpoint.
- New marketing components: `ContactCtaButton`, `PolicyScrollSpyNav`. New hook: `lib/hooks/useScrollSpyNav.ts` (IntersectionObserver, prefers-reduced-motion safe).
- `how-it-works` page final AU-English fix: `Initialize` → `Initialise`.

### 4.3 Build verification (every phase)

- `npm run lint` — green (0 warnings, 0 errors).
- `npm run build` — green (every route compiles, no TS errors).
- `npm test -- --runInBand` — 19/19 across 6 suites.
- Stitch coverage matrix re-checked per phase — dark + light, web + tablet + mobile.
- Round-trip grep for forbidden Stitch slugs (`monolithic`, `Sentinel Status`, `Registry Audit`, `Access Protocol`, `CPG 234`, `882-ARCHIVE`, `CYPHER_CORE`, `ISO 27001 A.9`, `ISO_27001:2022 slug`).

### 4.4 Database — what exists today

**Pre-seeded (DO NOT recreate or re-seed):**
- `ft_iso_controls` — 93 ISO 27001:2022 controls (A.5–A.8, C.4–C.10).
- `ft_nist_controls` — 117 NIST CSF 2.0 subcategories (GV / ID / PR / DE / RS / RC).
- `control_mappings` — cross-framework equivalences.
- `domains` — 21 industry-standard groupings.
- `top_risks` — 7 risk templates: Data Compromise, System Availability, Insider Threat, Compliance Violation, Supply Chain Attack, Ransomware, Unauthorized Access.
- `controls` — control mesh used by the RAG layer.

**Created by Agent 1 (migration `20250320000001_simplify_schema.sql`):** `users`, `organizations`, `assessment_sessions`, `control_responses`, `extracted_signals`, `domain_scores`, `framework_scores`, `chat_transcripts`, `compliance_tracker`, `organization_risks`, `risk_control_mappings`, `claude_api_usage`, `audit_log`, `session_metadata_log`. RLS enabled on every one.

**Subsequent migrations:**
- `20250407000001_fix_audit_trigger.sql`
- `20260410000001_agent6_multiuser.sql` — `users.role`, `users.status`, `users.invited_by`, `domain_assignments`, `final_answers`, `multi_user_audit_trail`.
- `20260410000002_agent6_dashboard_rpc.sql`
- `20260416000003_agent8_auth_backend.sql` — auth rate-limit tables, MFA support tables.
- `20260416000004_auth_fixes.sql`
- `20260423000001_contact_submissions.sql`
- `20260424000001_contact_submissions_email.sql` — adds `email TEXT NOT NULL` to `contact_submissions`.

### 4.5 API endpoints that exist today

**`/api/v1/`** (JWT-gated, the only public surface):

- `POST /assessments/sessions` — start session.
- `POST /assessments/sessions/{id}/responses` — submit message (10-step pipeline).
- `GET /assessments/sessions/{id}` — fetch state.
- `PUT /assessments/sessions/{id}/responses/{rid}` — revise.
- `GET /assessments/organizations/{id}/scores` — hero dashboard.
- `GET /assessments/organizations/{id}/sessions` — history.
- `POST /assessments/sessions/{id}/export` — PDF export.
- `POST /assessments/organizations/{id}/reassess` — trigger reassessment.
- `GET/POST /assessments/organizations/{id}/risks` — risk view.
- `GET /assessments/organizations/{id}/export/bi` — BI export stub.
- `DELETE /api/v1/account` — soft-delete cascade.
- `POST /api/v1/notifications/preferences`
- `POST /api/v1/notifications/send` (internal)
- `POST /api/v1/contact` — Contact Us submission (validated email + replyTo).
- Auth: `/api/v1/auth/login`, `/signup`, `/verify`, `/reset-password`, `/mfa/*`. Plus the in-flight TEMP `/dev-confirm`, `/dev-set-password` (remove before launch).
- `POST /api/v1/assessment/answer` — **stub** returning `{ ok: true, stubbed: true }` (Round 2 Phase 8). Real persistence is Agent 11 work.

**`/api/internal/`** (orchestration-secret gated): single `route.ts` entry; action strings `start_session`, `submit_response`, `extract_signals`, `score_domain`, `check_usage`, `generate_greeting`.

**Missing (Agent 11 backlog):** five `/api/v1/onboarding/*` endpoints (consultant-name, organisation, frameworks, complete, state), plus the real `/api/v1/assessment/answer` persistence (see §5.2).

### 4.6 Orchestration code that exists today

```
orchestration/
├── abstraction/claudeOrchestrator.ts   # ONLY file calling Anthropic API
├── compliance/                          # cadence engine
├── handlers/                            # responseHandler, scoreHandler, sessionHandler, signalHandler, usageHandler
├── monitoring/                          # usage monitor (300/month)
├── rag/                                 # three-pass context builder
├── scoring/maturityEngine.ts            # CMMI scoring
└── session/                             # state machine
```

Eight Cypher functions exist: `extractSignals`, `generateFollowUpQuestion`, `detectContradiction`, `generateAgentMessage`, `generateDomainCompletionMessage`, `generateSessionOpening`, `resolveControlsFromNaturalLanguage`, `generateRiskControlMapping`. **`scoreControl.ts` is skeleton — see §5.2.**

### 4.7 Frontend reality — what is real vs mocked

| Surface | State | Notes |
|---|---|---|
| Marketing pages (8) | ✅ shipped | Round 2 polished, Stitch-fidelity, dark + light. |
| Auth pages | ✅ shipped | SSR cookie rework in flight; **TEMP signup verification bypass active**. |
| Onboarding (4 steps + Initialisation) | ✅ shipped | State persists to `sessionStorage` only — no Supabase persistence yet (Agent 11). |
| Industry Dashboard | ⚠️ shell shipped, mock-backed | Radar + zero-state correct (Round 2 Phase 6). Reads `MOCK_INDUSTRY_DASHBOARD` via `useIndustryDashboard()`. |
| Framework View | ⚠️ shell + per-tab viz | Round 2 Phase 7 added per-framework viz. Control tree + detail rail still scaffold. `// PLACEHOLDER: pending Vik's Claude AI transcripts` flag in code. |
| Risk View | ⚠️ Stage 1 + Stage 2 stubs | Stage 1 No-path fixed (Round 2 Phase 7). Stage 2 priority groups + per-risk control mapping outstanding. |
| Assessment landing | ⚠️ tiles real, data mocked | Round 2 Phase 8 — zero-state tiles, humanised header. |
| Assessment question flow | ⚠️ stub backed | Selecting + Next advances cursor; `POST /api/v1/assessment/answer` returns `{ ok: true, stubbed: true }`. |
| Maturity Roadmap | ⚠️ tabs scaffolded | Action lists are placeholders. |
| Progress & Milestones | ✅ shell shipped | Round 2 Phase 9 — three real visual treatments (SVG line chart, comparison bars, milestone ribbon) + unified empty state. |
| Admin: team / invite / audit-trail / assignments | ✅ real Supabase logic | But on legacy design tokens (`bg-bg-deep`, `accent-primary`) — visually inconsistent. |
| `/organisation/*` (Users / Preferences / Billing / Audit) | ⚠️ stubs (63 LOC total) | Decision pending: redirect to `/admin/*` equivalents, or rebuild on M3 tokens. See §5.5. |
| Top-level `/billing` | ⚠️ partial Stripe | Manage Subscription works; Cancel + invoice list are stubs. |
| Cypher chat | ⚠️ floating button + modal | Streaming, typing indicator, quick-reply pills, signal-captured UI all deferred. |

**Mock data flag:** `lib/mock-data.ts` — `USING_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"` (defaults to `true`). All `lib/api/hooks/usePostLogin.ts` hooks branch off this; they currently always return mock data even when the flag is `false`, and emit a `console.warn` so the regression is visible. Real API hooks are §5.2.

---

## 5 · What is next

Ordered by what unblocks customer access fastest. Each block is sized so a single focused engineering week can clear it.

### 5.1 P0 — must clear before any user touches prod

1. **Rotate secrets — RIGHT NOW.** `.env.local` is committed with real `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_KEY`, `ORCHESTRATION_SECRET`. Action: rotate all three in Vercel + Supabase + Anthropic, add `.env.local` to `.gitignore` if not already, create `.env.example` with placeholders, add a `detect-secrets` pre-commit hook. **~30 min. Skip = total credential compromise.**
2. ✅ **Email verification gate re-enabled** (2026-04-28). `app/api/v1/auth/login/route.ts` now blocks unverified `email_confirmed_at`, the TEMP `/api/v1/auth/dev-confirm` and `/api/v1/auth/dev-set-password` routes are deleted. _Still pending:_ wire Resend into signup, add a Playwright signup → verify → login E2E.
3. **Verify Stripe webhook signature.** Webhook handler exists but no signature verification was found in audit. **~1 h.**
4. **Add `/api/health`.** Checks Supabase + Anthropic + Stripe reachability under 500ms. Vercel cron pings every 5 min. **~1 h.**
5. **Add Sentry + structured logging.** Wire Sentry into `app/error.tsx`, every API route, every Claude call. Add Logtail/BetterStack for structured logs (search by user / session / request_id). **~3 h.**
6. ✅ **Footer routes cleaned up** (2026-04-28). `/legal/terms` → `/terms`, `/legal/privacy` → `/privacy`, `Cookie Settings` link removed. _Still pending:_ tagline + "© 2026 Simplify.IS" copyright sweep on every footer instance.
7. ✅ **Risk View Stage 1 No-button** — re-verified and hardened on this branch (2026-04-28). `RiskWorkspace.tsx` now tracks reviewed count locally; Yes _and_ No advance through the library and only open Stage 2 when every risk has been reviewed.
8. ✅ **Industry Dashboard `INDUSTRY_METRICS_V2` label removed** (2026-04-28). `OrgMetricsCard` heading is now `Industry Metrics` with no orange version eyebrow.
9. **Terms page `null` sections** — either get drafted or hide behind a banner: "Terms v1 — final legal review in progress."

### 5.2 P0 — Agent 11 backend wiring (queued in `docs/HANDOFF_11_ROUND2_BACKEND.md`)

Owner: next agent. Reference: `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` §28.8.

**5.2.a — Durable onboarding state**
Add columns on `organizations`: `onboarding_step INT`, `onboarding_completed_at TIMESTAMPTZ`, `industry TEXT`, `countries JSONB`, `workforce_scale TEXT`, `selected_frameworks JSONB`. Add `users.organisation_name_staged TEXT`, `users.job_title TEXT` if not already mirrored from signup. Every onboarding step POST writes through; every step GET reads through.

**5.2.b — Five `/api/v1/onboarding/*` endpoints**
- `POST /consultant-name` → writes `users.agent_name`.
- `POST /organisation` → writes `organizations.*` (create-or-update by owner).
- `POST /frameworks` → writes `organizations.selected_frameworks`.
- `POST /complete` → sets `organizations.onboarding_completed_at`.
- `GET /state` → returns staged values for hydrate-on-mount.

**5.2.c — Real `POST /api/v1/assessment/answer`** ✅ landed 2026-04-28.
Persists a single answer to `assessment_answers` (new table) keyed by `(user_id, question_key)`. Returns `{ ok: true, nextQuestionKey }` computed by next position inside the same `(framework_id, domain_id)`. Companion `GET /api/v1/assessment/questions?framework=…&domain=…` reads the seeded catalogue. New migration `20260428000001_assessment_questions.sql` creates `assessment_questions` + `assessment_answers` with RLS, then seeds 18 starter questions (6 each across NIST CSF 2.0 Govern / Identify / Protect). `AssessmentQuestionFlow.tsx` rebuilt around the real reader; the old 44-line stub is gone. Scoring hand-off is still pending the scoring engine in §5.3.

**5.2.d — Signup → onboarding bridge**
Ensure `SignupForm.tsx` `organisation_name` + `full_name` land somewhere Step 2 can read (prefer `auth.users.raw_user_meta_data`, expose via `/api/v1/onboarding/state`).

**5.2.e — `contact_submissions.email`**
Migration `20260424000001_contact_submissions_email.sql` already shipped. Ensure `/api/v1/contact` Zod schema requires `email: z.string().email().max(320)` and persists it.

### 5.3 P1 — real data + scoring (Week 2, ~3–4 days)

- **Implement `scoreControl.ts`.** Skeleton exists in `orchestration/scoring/`. CMMI 1.0–5.0 logic: `SIGNAL_WEIGHTS = { high: 1.0, medium: 0.7, low: 0.4, planned: 0.0 }`, `OVERDUE_PENALTY = 0.20`. Domain score calculates ONLY when all controls in domain complete (never per-answer). Maturity bands: 1.0–1.99 Initial / 2.0–2.74 Developing / 2.75–3.49 Defined / 3.5–4.24 Managed / 4.25–5.0 Optimizing.
- **Wire `usePostLogin` to live API.** Remove `mockResult(...)` bodies and call the v1 endpoints. Keep the same hook signatures so components don't change.
- **Drop the `NEXT_PUBLIC_USE_MOCKS` flag** once all hooks are real.
- **Integration tests:** session → response → score → dashboard refresh.
- **Playwright E2E:** signup → assessment → score → export.

### 5.4 P1 — PDF export (Week 3)

- Two-mode generator (internal checklist + executive summary) using react-pdf or Puppeteer.
- Cache at the assessment level (regenerate on score change).
- Audit-ready packet: PDF + raw signal log + Cypher conversation snippets — what real auditors actually want.

### 5.5 P1 — round out post-login surfaces

- **Framework View** (Product Review §5.2 + Master Decisions §28.5): hierarchical control tree (Domain → Control → Sub-control), inline Cypher chat per control, evidence rail, maturity slider. Real download-report when PDF engine ships.
- **Risk View Stage 2** (Master Decisions §28.5.c): three priority groups (Actively Tracking / Concerned but Managing / Aware but Low Priority); per-risk control mapping + mitigation conversation with Cypher.
- **Maturity Roadmap** (Product Review §7.2): real Maintain / Uplift / Industry Shifts action lists with effort + maturity-impact estimates ("This 2-day fix raises GV.OC-01 from 1.2 → 3.0").
- **Onboarding tightening** carried over from Round 2 (already partly shipped, verify on branch): Step 1 hint, Step 2 backfill from signup, Step 3 always-visible circle checkbox, Step 4 mirror of real sidebar exactly.

### 5.6 P1 — cleanup PR 4 (rationalisation)

- **Consolidate `/admin/*` and `/organisation/*`.** `/admin/*` routes have real Supabase logic but legacy design tokens; `/organisation/*` has new chrome but mock data. Decision: wire real Supabase logic into `/organisation/*`, redirect `/admin/*` → `/organisation/*`, delete the legacy half. Master Decisions §28.7 confirms `/organisation/*` is the canonical path.
- **Single billing page.** `/billing` and `/organisation/billing` both exist. Pick one; redirect the other. Best path: keep `/organisation/billing` and embed the Stripe Customer Portal.
- **Migrate Admin pages to Material 3 token system** (the M3 + editorial-type pairing the rest of the post-login app uses). Drop legacy `bg-bg-deep`, `accent-primary`, `text-text-primary` — see Product Review §9.3.
- **`SettingsScreens.tsx` stubs** (63 LOC for Users + Preferences + Billing + Audit combined): delete; route `/organisation/audit` → `/admin/audit-trail`, `/organisation/users` → `/admin/team`.

### 5.7 P1 — Cypher experience deepening

- **Streaming chat.** SSE, typing indicator, quick-reply pills.
- **Signal-captured inline UI.** Confirm-as-you-go signal extraction visible in chat.
- **Contradiction surfacing live in chat.** Soft prompt: "I understood X earlier — has that changed, or did I misunderstand?"
- **MFA full enrolment.** QR screen + recovery-code download. (Currently MFA is verify-only.)
- **D3 interactivity on Industry radar.** Hover tooltips, axis-level peer/delta, morph-from-centre animation.
- **Persistent Cypher rail across all pages** — not a floating button modal. The Cypher experience is the moat; the IA must reflect that. Product Review §1.7 + §9.2.

### 5.8 P2 — observability + scale prep

- PostHog (free up to 1M events) — funnel: signup → org-create → assessment-start → first-control-completed → first-domain-completed → score-viewed.
- Per-user cost dashboard (Claude tokens × pricing × user). Spot $40/mo users.
- Slow-query log on Supabase. RLS makes queries 2–10× slower; find offenders before they impact UX.
- Move rate-limit state from in-process to Redis/Upstash before scale testing.
- Lighthouse + bundle analysis pass.
- Light-mode + mobile per-screen QA walk-through.

### 5.9 P2 — security hardening (research-driven, from `PRODUCT_REVIEW_NEXT_EVOLUTION.md` §11)

- **Prompt canary in Cypher's system prompt** — a unique tagged sentence that should NEVER appear in user-visible output. Alarm if it leaks. Cheap signal that prompt-injection is happening.
- **Output validation** — Claude responses passed through Lakera Guard or Microsoft Prompt Shields (sub-50ms). Demonstrates due-diligence to enterprise buyers.
- **Vector DB hygiene** — RAG context retrieved from `contextBuilder.ts` hash-checked at write time. Insurance against AgentPoison-class attacks.
- **Supply-chain pinning** — pin `@anthropic-ai/sdk` and `@supabase/supabase-js` to exact versions. (Apr 2026 brief flagged the Axios npm hijack at 100M weekly downloads.)

### 5.10 P2 — Outstanding decisions / data Vik owes the build

These are blocking specific surfaces. Listed verbatim from `HANDOFF_10_POSTLOGIN_CLAUDE_CODE.md` + Notion `📋 Outstanding Work`:

- Cypher's welcome greeting wording on Industry Dashboard.
- The 20 template risks for Risk View Stage 1 (the Risk Library).
- 5–8 assessment questions per domain per framework (ISO / NIST / APRA).
- 30-day cooldown copy for the framework toggle in Preferences.
- Notification type catalogue (Assessment due / Domain completed / Cypher insight / Framework change).
- Security Briefing feed-source contract from the research agent (signal-social-agent).
- Whether the Initialisation screen should render inside `DashboardLayout` or as a chrome-less hand-off page (currently uses `DashboardLayout`).

### 5.11 P3 — post-MVP roadmap (the moat-builders)

**ISO 42001 add-on (~2 weeks).** Seed `ft_iso_42001_controls` (~38 controls) alongside the existing ISO/NIST tables. Extend `control_mappings` to cover ISO 42001 ↔ NIST AI RMF ↔ ISO 27001. Add an "AI Systems Inventory" assessment phase distinct from security maturity. Premium tier: "AI Maturity Assessment" as a separate scored axis on the dashboard. **First mover** — no major commercial GRC tool has mapped ISO 42001 yet, and EU AI Act enforcement begins 2 Aug 2026.

**OWASP Agentic Top 10 (ASI01–ASI10) mapping (~1 week).** Map each of OWASP's 10 Agentic Security risks to NIST CSF 2.0 subcategories and ISO 27001 Annex A controls. Ship as a free downloadable PDF on `vik.so` — pure lead-gen for Simplify IS. Apr 2026 research flagged this as a gap: "this mapping does not yet exist in any major commercial tool."

**Australian add-ons (~1 week each).** ASD Essential Eight (every IRAP audit asks for it). APRA CPS 234 (financial sector, premium pricing). CPS 230 operational resilience (enforceable since 1 July 2025).

**International add-ons.** PCI-DSS 4.0, HIPAA.

**Cypher experience evolution:**
- "What Cypher learned this session" 3–5-bullet summary surfaced on the dashboard.
- Per-organisation timeline — every signal extracted, every contradiction surfaced, every score change. Investor-grade narrative.
- Proactive nudges: "It's been 4 weeks since we discussed your access reviews — has anything changed?" Drives reassessment + engagement + renewal.

**Sharable artefacts:**
- Public read-only score badge (opt-in) — `simplify.is/badges/<orgId>` for the user's security page.
- Audit-ready packet — single PDF with maturity scores, signals, evidence references, Cypher conversation snippets.
- Board-ready slide deck — auto-generated 8–10 slides; use Anthropic prompt caching to keep per-export cost < $0.10.

**Onboarding speed-runs:**
- "Quick Start" — import SOC 2 reports / vendor questionnaires / prior assessments. Cypher pre-fills 30–50%, then validates conversationally.
- Pre-built industry templates (SaaS / healthcare / finance / professional services).
- "Reassess in 90 seconds" — only re-asks controls that changed last time OR are due for review. Targets the renewal-driven user.

**Platform plays:**
- Multi-org per user (multiple organisations contributing to one assessment).
- BI integrations (Power BI, Tableau exports). API endpoint structure already designed.
- Peer benchmarking using anonymised aggregates.
- Document upload + signal extraction.
- SSO (SAML/OIDC) — required for enterprise procurement.
- Public Cypher API — security teams want to script assessments.

### 5.12 Pricing tier evolution (proposed, post-MVP)

| Tier | Price | Includes |
|---|---|---|
| **Free** (vik.so) | — perm. — | Claude-powered ISO 27001 / NIST CSF consultants. No persistence. Lead-gen. Add OWASP ASI advisor (first to market). |
| **Starter** | ~$49/mo | One organisation, one framework, persistent Cypher, dashboards, single PDF type. Replaces current MVP single tier. |
| **Pro** | ~$199/mo | Multi-framework (ISO 27001 + NIST CSF + ISO 42001 + Essential Eight). Both PDF types. Reassessment reminders, compliance calendar, risk-to-control mapping. 3 users. |
| **Business** | ~$499/mo | Everything in Pro + APRA CPS 234, CPS 230, PCI-DSS, HIPAA. Peer benchmarking. BI exports. Unlimited users. SSO. |
| **Defender** (custom) | — | For critical-infra security teams (banks, hospitals, gov). Self-hosted using Vik's fine-tuned ISO/NIST LLaMA. Air-gapped Cypher — no Anthropic API dependency. Glasswing-style invite-only. |

### 5.13 Six-week beta plan (from research-driven recommendations)

| Wk | Focus | Outcome |
|----|---|---|
| 1 | Unblock + harden | Secrets rotated · email verification on · Sentry + `/api/health` · Stripe sig verified |
| 2 | Real data | `scoreControl.ts` real · `usePostLogin` live · integration + E2E tests |
| 3 | PDF export | Two-mode generator + audit packet |
| 4 | OWASP ASI advisor on vik.so | Free PDF lead-magnet |
| 5 | ISO 42001 add-on | ~38 controls seeded · cross-mappings · AI Systems Inventory phase |
| 6 | Beta launch | 10 design partners (Triskel-Labs / vik.so network) · 60-day free Pro tier |

Target: ~6 June 2026, defensible the day EU AI Act enforcement begins.

### 5.14 Distribution wedge (for the deck, not the build)

- **MSSP partnerships** — Vik's old Triskel-Labs network. Resell Simplify IS bundled into their assessments.
- **Cyber-insurance brokers** — every renewal needs an updated maturity assessment. Simplify IS becomes the on-ramp.
- **Big-4 audit firms** — co-marketing on the ISO 42001 + EU AI Act readiness angle. They sell the audit, we provide the prep.

---

## 6 · How we work — enduring principles

### 6.1 Build-quality bar (every change)

- `npm run lint` — zero warnings, zero errors.
- `npm run build` — every route compiles, no TS errors.
- `npm test -- --runInBand` — 19/19 across 6 suites.
- Stitch coverage matrix re-checked per phase (dark + light, web + tablet + mobile).
- Round-trip grep for forbidden Stitch slugs (`monolithic`, `Sentinel Status`, `Registry Audit`, `Access Protocol`, `CPG 234`, `882-ARCHIVE`, `CYPHER_CORE`).
- Every API handler must: authenticate, authorise (`assertOrgAdmin` / `assertOrgOwnership`), validate input with Zod, write to `audit_log`, return the envelope shape in `lib/api/response.ts`.
- Orchestration functions must check `checkUsageLimit` before calling Claude, and call `incrementUsage` after.

### 6.2 Cypher persona — never dilute

- Default name: **Cypher**. User-renameable on first use, stored forever in `users.agent_name`.
- Agent intro order: agent introduces → asks to be named → asks user's name.
- One question at a time. Always.
- Never lists, bullets, or headers in conversation.
- Vocabulary: start simple, detect sophistication dynamically, adjust mid-conversation.
- Does NOT congratulate after every answer.
- Does NOT use the word "Maturity" with users — plain language only.
- Off-topic → brief answer + redirect. Burning issue → pause, handle, resume.
- "I don't know" → rephrase → example → max 2 probes → mark TBC → move on.
- N.A. controls → always probe for justification, store reasoning, re-validate on reassessment.
- Contradiction → soft, human inquiry, three options for the user.
- Score → never revealed mid-group; always paired with a Cypher message on update.

### 6.3 Round-N convention

- Round 2 was Vik's second-pass walkthrough. Captured in `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` §28 (decisions layer) and `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2 (file-level fix brief).
- When Round 3 lands we **append §29** rather than rewriting §28. History stays readable.
- Phase-by-phase commit log lives in §4.1 above.

### 6.4 Locked decisions — do not re-open

- Fine-tuned LLaMA model **removed from the inference path entirely**. All AI goes through Claude API + Supabase RAG.
- Base template adapted (not rewritten) from `github.com/Razikus/supabase-nextjs-template`.
- ISO 27001:**2022 only**. NIST CSF **2.0 only**.
- Primary model `claude-sonnet-4-20250514`. RAG resolver `claude-haiku-4-5-20251001`. No others.
- Pricing at launch: **single flat monthly tier** until 50 customers.
- Dark mode is the primary theme. Light mode available pre-login + dashboard.
- Theme persists in `localStorage` key `simplify-theme`.
- Australian English globally.
- Score updates ONLY after a domain is fully complete — never per individual answer.

---

## 7 · Reference index

### 7.1 File locations

```
Project root:    /Users/vik/Documents/Code/simplify-is/
CLAUDE.md:       <root>/CLAUDE.md
Source of truth: <root>/docs/SOURCE_OF_TRUTH.md  (this file)
Spec:            <root>/docs/SPEC.md
Master Decisions:<root>/docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md
Round 2 brief:   <root>/docs/UI_UX_FEEDBACK_REMEDIATION.md
Product review:  <root>/docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md
Handoffs:        <root>/docs/HANDOFF_*.md
Agent briefs:    <root>/agents/*.md
Migrations:      <root>/supabase/migrations/
Stitch refs:     <root>/stitch_output/
```

### 7.2 External services

| Service | Detail |
|---|---|
| Supabase | Project `simplify-dev` · ref `gksfyflhnihdizegeglc` · free tier → Pro before peer testing |
| GitHub | Repo `simplify-is` (private) · branch `main` |
| Vercel | Project `simplify-is` · domain `simplify.is` · free → Pro on first real user |
| Anthropic Claude | Sonnet primary + Haiku RAG resolver · 300 calls/mo/user hard cap |
| Stripe | Subscription + webhooks (Agent 5) |
| Resend | Transactional email — 3 templates wired (Agent 5) + Contact Us pipeline (Round 2) |

### 7.3 Required env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
SUPABASE_SERVICE_ROLE_KEY      # NEVER client-side
ANTHROPIC_API_KEY              # NEVER client-side
ORCHESTRATION_SECRET           # min 32 chars, NEVER client-side
VIK_ALERT_EMAIL                # usage alerts
RESEND_API_KEY                 # optional
RESEND_FROM_EMAIL              # optional
STRIPE_SECRET_KEY              # optional
STRIPE_WEBHOOK_SECRET          # optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
PDF_STORAGE_BUCKET             # default: reports
E2E_BYPASS_TOKEN               # testing only — NEVER prod
NEXT_PUBLIC_USE_MOCKS          # dev flag — defaults to true
```

Validated at startup via `lib/config/env.ts` (the only place that reads `process.env`). All env vars import from there.

### 7.4 Run commands

```bash
npm run dev              # next dev — http://localhost:3000
npm run build            # next build
npm run lint
npm test                 # jest --coverage
npm run test:e2e         # playwright
npm run security:audit   # node scripts/security/audit.mjs

npx supabase db push --project-ref gksfyflhnihdizegeglc   # migrations
```

### 7.5 Notion bridge

Parent page: `3179e9b1-def7-81a1-87c1-f462b297ce28` (Simplify.is — Comprehensive Guide).

Sub-pages used as the narrative source for this document:
- 🚀 Story & Overview
- ⚡ Wow Facts
- 📅 Timeline (parts 1 + 2)
- 💬 How It Works & Who It's For
- 💼 Business Model, Tech & Key Decisions
- 🔒 Infrastructure, Roadmap & Deck One-Liners
- 🌀 Round 2 — Decisions & Every Change
- 🛠 Build Log — Every Change Since 20 March
- 📋 Outstanding Work & Enduring Principles
- 🛠 Improvement Recommendations
- 🧭 Strategic Intelligence Bridge

The Strategic Intelligence Bridge regenerates nightly via `signal-social-agent` and surfaces new opportunities (OWASP ASI assessments, ISO 42001 framing, supply-chain hardening sprints, etc.). Triage new entries on the bridge page itself; don't merge unreviewed items into this document.

---

## 8 · Maintaining this file

- This file is **append-only at the section level**. Update sections in place. Don't rewrite the whole document.
- When a phase / agent / round completes, log it in §4. When a P0/P1 item clears, move it to §4 and add a one-line "completed" note.
- New decisions: add the rule to §6 and the originating context wherever relevant. If it changes the spec, update Master Decisions §28+ first; reflect the summary here.
- New roadmap items from research / nightly bridge: triage them on the Notion bridge page first; only promote to §5.11+ here once Vik decides Keep.
- When data Vik owes the build (5.10) lands, move the bullet from §5.10 into the relevant feature section in §4.
- Keep file paths and line numbers fresh. If `lib/api/hooks/usePostLogin.ts` moves, find-and-replace here.
- `Last refresh:` line at the top — update on every change.
