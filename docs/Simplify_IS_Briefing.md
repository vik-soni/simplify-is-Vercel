# Simplify.is — Product Briefing

**May 2026 · Vik Soni**

**Sources:** [`SPEC.md`](./SPEC.md) · [`SOURCE_OF_TRUTH.md`](./SOURCE_OF_TRUTH.md) · [`Supabse-schema.md`](./Supabse-schema.md) · Notion Command Centre (`3179e9b1-def7-81a1-87c1-f462b297ce28`)

---

## The Problem

Organisations with 50–5,000 employees cannot afford a full-time CISO or $400–$800/hr consultants. Existing GRC tools are checkbox forms with modern skins — they measure compliance at a point in time, then decay. The $23B GRC market (growing to $39B by 2031) is dominated by enterprise tools that don't serve SMBs. 86% of organisations are evaluating AI for GRC, but only 14% have integrated it. The gap is enormous.

Simplify.is is not a chatbot. It is not a checkbox tool. It is an AI-powered security maturity platform that feels like hiring a senior consultant who never forgets a conversation, knows hundreds of controls across nine global standards, and is available around the clock.

### Ecosystem

| Surface | Role |
|---------|------|
| **[vik.so](https://vik.so)** | Free, permanent — ISO 27001 + NIST CSF RAG consultants. Credibility, community, lead-gen. Proves the Claude + Supabase RAG pattern Simplify.is runs on. |
| **simplify.is** | Paid SaaS — structured assessments, persistent Cypher, scoring, dashboards, PDF, compliance cadence, billing. |
| **decipher.net** | Owned; reserved for future expansion. |

### Why now

- **EU AI Act** full enforcement from **2 August 2026** — procurement forms now include AI sections.
- **ISO 42001** (AI management) — few commercial GRC tools map it to NIST CSF 2.0; we ship it in the nine-framework bundle.
- **GRC market dislocation** (Jan–Feb 2026) — buyers unhappy with incumbents; agentic software share rising (Gartner: 33% of enterprise software agentic by 2028).
- **OWASP Agentic Top 10** (Dec 2025) — no commercial ISO/NIST mapping yet; vik.so PDF = lead-gen.
- **Australian regulatory pull** — APRA CPS 230/234, ASD Essential Eight, AU Voluntary AI Safety — home-market wedge before global scale.

### Target market

- **Sweet spot:** 50–5,000 employees; can't afford full-time CISO or expensive consultants; must still demonstrate compliance.
- **Geo:** Australia first → global.
- **Sectors:** financial services, healthcare, SaaS, technology, retail, professional services.
- **Buyers:** Security Manager (primary) · CISO (secondary) · GRC / Compliance Officer (tertiary).

### Two non-negotiables

1. **World-class product quality** — no placeholder logic, no shortcuts, no TODO in production.
2. **Security first, always** — enterprise-grade from day one; target zero critical findings on a real pen test.

---

## What We Built (and Why It Matters)

### The Core Experience

A user signs up, names their AI consultant (default: **Cypher**), selects their industry, picks their compliance frameworks, and starts a structured assessment. They can answer via a clean form interface or have a real conversation with Cypher — either path produces scored, auditable results.

**Assessment flow** (per `SPEC.md` — locked):

1. **Discovery** — Cypher learns context; no scoring yet.
2. **Scope** — seven scope questions captured in `assessment_sessions.scope_data` (JSONB).
3. **Baseline** — maturity by **21 industry-standard domains** (from `domains` table), not control-by-control checkbox fatigue.
4. **Reassessment / freeflow** — returning users; ad-hoc Cypher chat with signal extraction.

**Posture surfaces:** Industry Domain (default) · nine Framework executive views · **Threat Readiness** (scenario-centric; replaced legacy “Risk View” IA).

Every answer writes to an append-only ledger. Scores recalculate live. Cross-framework mappings propagate knowledge silently — answer a question for NIST, and your ISO 27001 posture updates automatically where the controls overlap.

**Compliance cadence** (spec): six-month reassessment default · event-based triggers · manual reassessment button · email for reassessment due + system recovery; in-app bell for everything else.

### The Architecture (Three Layers, No Shortcuts)

```
Browser
  ↓ HTTPS
API Layer        /api/v1/*     JWT auth, Zod validation, rate limits, audit log
  ↓ orchestration secret
Orchestration    /api/internal/*    Claude reasoning, RAG, scoring, threats
  ↓
Supabase         Postgres + RLS + pre-seeded framework libraries
```

**Hard rules** (from `CLAUDE.md` / `SOURCE_OF_TRUTH.md`):

- No direct Supabase calls from React components.
- No direct Anthropic calls from `/api/v1/*`.
- `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `ORCHESTRATION_SECRET` never in `NEXT_PUBLIC_*`.
- Parameterised SQL only; RLS on every tenant table.
- JWT on every `/api/v1/*` route; `/api/internal/*` returns 403 without `x-orchestration-secret`.
- Rate limits: **100 req/min**, **1000 req/hr** per user.
- Claude: **300 calls/month/user** hard cap; alerts at 80% and 100%; token logging to `claude_api_usage`.
- Version anchors: **ISO 27001:2022 only** (never 2013 IDs) · **NIST CSF 2.0 only** (GV/ID/PR/DE/RS/RC).

**Supabase project:** `simplify-dev` (ref `gksfyflhnihdizegeglc`).

### What Is Actually Running

| Capability | Detail |
|---|---|
| **9 compliance frameworks** | NIST CSF 2.0, ISO 27001:2022, ISO 42001 (AI), NIST AI RMF, PCI DSS 4.0, APRA CPS 230, APRA CPS 234, ASD Essential Eight, AU Voluntary AI Safety Standard |
| **898 controls catalogued** | Full control text with implementation guidance, related tools, maturity criteria |
| **3,615 assessment questions** | Rich detail bank in `control_assessment_questions` (~4 MB) — consolidated to ~1 question per control via Claude-audited pipeline |
| **16,343 cross-framework mappings** | Strength-weighted (full / strong / partial) in `control_mappings` (~3.4 MB) — “answer once, benefit everywhere” |
| **Consolidated question engine** | `consolidated_questions` + `consolidated_question_detail_map`; ~440 user-facing questions with quality gates, banned-phrase detection, AU English |
| **Cypher conversational assessment** | Dual path: structured form or adaptive conversation; answers extracted and mapped to controls; `source` = `form` \| `cypher` |
| **Three-pass RAG** | Explicit control ID → Haiku semantic resolver → keyword fallback. Sonnet `claude-sonnet-4-20250514` · Haiku `claude-haiku-4-5-20251001` |
| **Live scoring** | `subdomain_maturity_scores` → `domain_maturity_scores` → `organization_maturity_scores`; framework-native models; recalc on every answer |
| **9 executive dashboards** | Each framework gets its own chart module — not one generic widget |
| **Threat Readiness** | Scenario-based; triangulated from tech stack + live maturity + industry; Key Levers panel; 24h cache + Tue/Fri cron refresh |
| **Tech Stack Discovery** | Conversational interview → `organization_tech_stack` → feeds threat generation |
| **Monthly score snapshots** | `monthly_score_snapshots` frozen 1st of month 02:00 UTC; dashboard month slider |
| **Cross-framework propagation** | `assessment_answers` stores `propagated_from_*` + `propagation_strength`; full audit trail |
| **Append-only answer history** | Never update/delete answer rows; provenance preserved |
| **Onboarding** | Org profile → industry → framework picker (9 tiles) → meet Cypher → initialisation → tech stack discovery |
| **Auth stack** | Supabase Auth, MFA-capable, server-side session cookies, `auth_rate_limits`, soft delete |
| **Autonomous QA harness** | `npm run test:autonomous` — Karpathy-style grading, framework ID validation, cross-mapping checks |

### The Velocity Story

Zero to working multi-framework platform in ~3 months (March–May 2026). Built using specialist agent passes — each agent owns one layer with explicit handoffs. **Agents 1–18 shipped** (foundation → orchestration → API → UI → security → multi-user → auth → post-login Stitch pass → onboarding → Threat Readiness → industry multipliers → Cypher assessment → consolidated questions + snapshots). **Agent 19 in scope:** assessment orchestration and cross-framework conflict-resolution UX.

### What Makes This Hard to Replicate

The product moat is not the UI or the chatbot. It is the **mapping layer**: 16,343 calibrated cross-framework control mappings that enable “answer once, score everywhere.” Every new framework creates N² mapping work — content plus calibration plus semantic alignment.

The AI-first bundle (ISO 42001 + AU Voluntary AI Safety + NIST AI RMF) is timed for EU AI Act enforcement (August 2026). The SMB GRC space rarely ships this combination ready to assess.

**Domain expertise moat:** Vik's consulting background (enterprise CISO advisory, MSSP at Triskel Labs, vik.so) encoded in prompts, control libraries, and session state — not generic LLM wrappers.

---

## What Is Honest and Incomplete

| Area | Status |
|---|---|
| PDF export | Spec'd (internal checklist + executive summary); generator not fully wired |
| CSRF protection | Stubs exist; real token issuance pending |
| MFA resend endpoint | UI expects it; backend missing |
| Rate limiting | In-memory; needs Redis/Upstash before scale |
| Some dashboard hooks | `usePostLogin` can still warn/mock when `NEXT_PUBLIC_USE_MOCKS` unset |
| Multi-user collaboration | Schema ready (`domain_assignments`, `final_answers`, `org_audit_trail`); not fully active in UX |
| Maturity roadmap view | Rebuild per UX feedback (Maintain / Uplift / Industry Shifts) |
| Re-assessment UX | Data model + cadence engine exist; end-user flow undesigned |
| Conflict resolution UX | Propagation vs direct answer conflicts captured in data; Agent 19 user flow |
| Cypher persistent rail | FAB/modal today; full workspace rail spec'd not shipped |
| Stripe webhook | Verify signature enforcement before prod |
| Health check / Sentry | `/api/health` and structured logging on P0 list |

Tracked in `SOURCE_OF_TRUTH.md` §5 (P0–P3).

---

## Strategic Roadmap (Refreshed May 2026)

Maps the original 24-month product roadmap against actual progress. ✅ shipped · 🔧 active · ◻ planned.

*Note: Original `SPEC.md` MVP listed two frameworks only; production UI and data model now support **nine** — ahead of the written MVP scope.*

### Phase 0 — Pre-Launch Foundations

| Feature | Status | Notes |
|---|---|---|
| Cypher conversational agent | ✅ Shipped | Dual-path (form + chat), cross-session memory, user-renamable, RAG-backed |
| ISO 27001 + NIST CSF 2.0 assessment | ✅ Shipped | Plus 7 additional frameworks (9 total) |
| Maturity scoring + dashboard | ✅ Shipped | Live recalc, framework-native models, 9 executive views |
| Cross-session memory | ✅ Shipped | Append-only answers, `chat_transcripts` (user-private RLS) |
| Threat Readiness + Tech Stack | ✅ Shipped | Agent 15–16; not in original MVP spec |
| PDF Export | 🔧 In progress | Two modes spec'd; branded executive summary pending |
| Multi-user collaboration | ◻ Designed | Agent 6 schema; roles, assignments, audit trail |

### Phase 1 — Quick Wins Post-Launch (Months 1–3)

| Feature | Status | Strategic Rationale |
|---|---|---|
| AI Policy Generation | ◻ Planned | Cypher drafts tailored policies mid-conversation |
| Teams + Slack Bot | ◻ Planned | Ambient compliance in Slack/Teams |
| ASD Essential Eight | ✅ Shipped | Australian federal / critical-infra resonance |
| APRA CPS 234 + CPS 230 | ✅ Shipped | Australian financial services segment |
| Shareable Trust Profile | ◻ Planned | Public posture URL — viral growth |
| Action Plan Generator | ◻ Planned | Prioritised remediation post-assessment |

### Phase 2 — System of Record (Months 3–8)

| Feature | Status | Strategic Rationale |
|---|---|---|
| ISMS Document Library | ◻ Planned | Version-controlled policies linked to controls |
| Document Upload + Signal Extraction | ◻ Planned | Upload policies; Cypher maps signals to controls |
| Vendor / Supplier Risk Module | ◻ Planned | Supplier assessments → funnel |
| Internal Audit Workflow | ◻ Planned | ISO 27001 internal audit requirement |
| Risk Register | ◻ Planned | Auto-populated from Cypher (Clause 6.1) |
| Employee Awareness Module | ◻ Planned | Training + policy acknowledgment |

### Phase 3 — Expansion (Months 8–18)

| Feature | Status | Strategic Rationale |
|---|---|---|
| ISO 42001 — AI Governance | ✅ Shipped | EU AI Act Aug 2026; shipped ahead of original Phase 3 plan |
| Consultant / Partner Tier | ◻ Planned | White-label multi-client accounts |
| PCI-DSS | ✅ Shipped | Retail / e-commerce; originally Phase 3 |
| Peer Benchmarking | ◻ Planned | Anonymised industry comparison |
| Regulatory Change Monitoring | ◻ Planned | Cypher alerts + impact analysis |
| Board Reporting Pack | ◻ Planned | Quarterly exec PDF |
| Power BI / BI Export API | ◻ Planned | Stub exists (`/api/v1/.../export/bi`) |

### Phase 4 — Platform + Ecosystem (Months 18–36)

| Feature | Status | Strategic Rationale |
|---|---|---|
| MCP Integrations | ◻ Planned | Okta, CrowdStrike, Entra, Jira live evidence |
| Marketplace / Extensions | ◻ Planned | Third-party consultants and developers |

---

## Database at a Glance

**~45 tables** in `simplify-dev` (41 listed in latest schema snapshot + maturity/consolidated tables from Agent 17–18 migrations). RLS on all tenant data. Largest tables by storage:

| Table | Size (snapshot) | Role |
|-------|-----------------|------|
| `audit_log` | ~6 MB | Mutation audit trail |
| `control_assessment_questions` | ~4 MB | Detail question bank (3,615 rows) |
| `control_mappings` | ~3.4 MB | Cross-framework mappings (16,343 rows) |
| `ft_iso_controls` | ~2.1 MB | ISO 27001:2022 library |
| `ft_nist_controls` | ~1.9 MB | NIST CSF 2.0 library |
| `controls` | ~1.6 MB | Control mesh for RAG |
| `chat_transcripts` | ~1.1 MB | Cypher conversation history |

### Content scale

| Metric | Count |
|---|---|
| Controls catalogued | 898 |
| Detail assessment questions | 3,615 |
| Consolidated user-facing questions | ~440 |
| Cross-framework control mappings | 16,343 |
| Question-level aliases | 415 |
| Industry domains | 21 |
| Top-risk templates | 7 (`top_risks`) |

### Tables by function

**Tenancy & identity**

| Table | Purpose |
|-------|---------|
| `users` | Profile, `agent_name`, org link, role, Claude usage counters |
| `organizations` | Tenant root; `selected_frameworks`, industry, onboarding metadata |
| `audit_log` | All mutations logged |
| `auth_rate_limits` | Auth endpoint throttling |
| `claude_api_usage` | Token / call accounting |

**Framework libraries (pre-seeded — do not re-seed)**

| Table | Purpose |
|-------|---------|
| `ft_iso_controls` | ISO 27001:2022 |
| `ft_nist_controls` | NIST CSF 2.0 |
| `ft_iso_42001_controls` | ISO 42001 |
| `ft_nist_ai_rmf_controls` | NIST AI RMF |
| `ft_pci_dss_controls` | PCI DSS 4.0 |
| `ft_apra_cps230_controls` | APRA CPS 230 |
| `ft_apra_cps234_controls` | APRA CPS 234 |
| `ft_essential_eight_controls` | ASD Essential Eight |
| `ft_au_voluntary_ai_safety_controls` | AU Voluntary AI Safety |
| `control_mappings` | Cross-framework propagation graph |
| `control_assessment_questions` | Detail question bank |
| `question_aliases` | Consolidated / legacy key aliasing |
| `controls` | Control mesh |
| `domains` | 21 industry-standard groupings |
| `top_risks` | Risk templates |

**Assessment runtime**

| Table | Purpose |
|-------|---------|
| `assessment_sessions` | Session state, phase, scope JSONB, subdomain cursor |
| `assessment_questions` | Per-catalogue question rows |
| `assessment_answers` | **Append-only** answers + propagation metadata |
| `consolidated_questions` | ~1 prompt per control |
| `consolidated_question_detail_map` | Links consolidated → detail questions |
| `control_responses` | Legacy/alternate response path |
| `chat_transcripts` | Cypher messages (user-private RLS) |
| `extracted_signals` | Signals from freeflow chat |
| `session_metadata_log` | Session diagnostics |

**Scoring outputs**

| Table | Purpose |
|-------|---------|
| `organization_maturity_scores` | Framework-level scores |
| `domain_maturity_scores` | Domain rollups |
| `subdomain_maturity_scores` | Chart granularity |
| `monthly_score_snapshots` | Frozen monthly history |
| `framework_scores` | Legacy framework scores |
| `domain_scores` | Legacy domain scores |

**Threat Readiness & tech stack**

| Table | Purpose |
|-------|---------|
| `organization_tech_stack` | Discovered stack profile |
| `tech_stack_discovery_sessions` | Discovery session state |
| `tech_stack_discovery_messages` | Discovery chat log |
| `threat_readiness_cache` | Generated scenarios (TTL) |
| `organization_threats` | Persisted threats + user buckets |
| `organization_risks` | Org risk register rows |
| `risk_control_mappings` | Risk ↔ control links |

**Multi-user (schema ready)**

| Table | Purpose |
|-------|---------|
| `domain_assignments` | Assessor ↔ domain assignments |
| `team_responses` | Collaborative answers |
| `final_answers` | Locked team consensus |
| `org_audit_trail` | Multi-user audit events |

**Operations & compliance**

| Table | Purpose |
|-------|---------|
| `compliance_tracker` | Reassessment due dates |
| `contact_submissions` | Marketing contact form |

Full size listing: [`Supabse-schema.md`](./Supabse-schema.md).

---

## The Next Sprint: Agent 19

Assessment flow orchestration when users work across frameworks and propagated knowledge conflicts with new direct answers.

**Decided:** One framework per assessment session; answers propagate across frameworks. Users can work frameworks in any order. Full-strength mappings auto-fill silently; partial mappings require confirmation.

**Being decided:** Cascade direction on updates, confidence decay, re-assessment scope, recalculation depth, audit granularity, and how visible propagation is in the UI.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Application | Next.js 14 App Router, TypeScript strict, Tailwind |
| Data + Auth | Supabase (Postgres, RLS, Auth) — `simplify-dev` |
| AI | Anthropic Claude — Sonnet for reasoning, Haiku for RAG resolution |
| Email / Billing | Resend, Stripe |
| Deployment | Vercel (MVP) → AWS migration path documented in `SPEC.md` |
| Testing | Jest + Playwright + autonomous Cypher harness |
| Design | Earthen Brutalism — Raleway / Montserrat / Josefin Sans; `--surface` `#141311`; marketing `#1A1917`; primary `#f2632d` |

Charts: bespoke SVG/CSS (D3, Recharts, Framer Motion removed in cleanup PRs; restore when richer interactivity needed).

---

## Pricing Positioning

| Tier | Frameworks | Indicative Price |
|---|---|---|
| Essential | NIST CSF 2.0 only | ~AUD $290/mo |
| Professional | NIST + up to 3 additional | ~AUD $590/mo |

All nine frameworks enabled on demo accounts (`wdata@demo.com` / `wodata@demo.com` — see [`Demo account.md`](./Demo%20account.md)).

---

## Demo & local dev

| Account | Password | Use |
|---------|----------|-----|
| `wdata@demo.com` | `123` | Full seeded data — all dashboards populated |
| `wodata@demo.com` | `123` | Blank — live assessment backfill testing |

```bash
npm run dev
npx tsx scripts/provisionDemoAccounts.ts
```

Walkthrough: [`Demo prep - product walkthrough.md`](./Demo%20prep%20-%20product%20walkthrough.md).

---

*Built by Vik + Claude · March–May 2026 · Nine frameworks live ahead of original two-framework MVP spec*
