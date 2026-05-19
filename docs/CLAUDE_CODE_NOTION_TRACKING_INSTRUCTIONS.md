# Claude Code — Notion Tracking Page Instructions
## Build the Simplify IS 8-Week Beta Build Plan in Notion

> **Read this entire file before executing.**
> **Owner:** Vik Soni
> **Generated:** 28 April 2026
> **Goal:** Create a Notion sub-page under the existing "Simplify IS — Comprehensive Guide" parent page that tracks an 8-week build plan from 28 April to 27 June 2026, with beta launch as the deliverable.
> **Parent page ID:** `3179e9b1-def7-81a1-87c1-f462b297ce28`

---

## 0 · What you are doing

Vik is sprinting toward a beta-test-ready release of Simplify IS by **27 June 2026**. He needs a Notion-based tracking system that mirrors how his existing Simplify IS pages are structured (data-rich, well-architected, no scattered statuses) but adds week-by-week visibility into:

- What's due this week
- What blocks the next week (dependencies)
- What can run in parallel (if you have capacity)
- Who owns what (Vik vs Claude Code)
- Where the project stands at any moment

**You will create:**
1. One new **child page** under the Simplify IS parent
2. One **inline database** on that page (the Build Tracker)
3. **Three database views** (the same database filtered/sorted differently)
4. **Eight pre-populated week sections** below the database
5. **One initial dataset** of ~80–100 tasks across the 8 weeks

Do not create a separate page per week. Everything lives on one page so Vik can scroll, scan, and track without clicking around.

---

## 1 · Research summary — Notion best practices for project tracking

Before you build, you need to understand *why* the structure below exists. This is the standard pattern used in production engineering teams using Notion (Linear-style discipline, but in Notion's interface).

### 1.1 Why a database (not just bullet lists)

Bullet lists rot. Within two weeks they become out-of-date and the team loses trust in them. A Notion database with structured properties survives because:
- Properties enforce consistency (Status is always one of 5 values, never "kinda done")
- Filters and views let you ask different questions of the same data
- Relations let you link work to dependencies without copying text
- Updates happen in one place and ripple through every view

### 1.2 The four properties that matter most for week-by-week tracking

After looking at how engineering teams actually use Notion (versus how vendors *say* they use Notion), the minimal property set is:

| Property | Type | Why it matters |
|---|---|---|
| **Status** | Select | The single most-checked field. Must be glance-readable. |
| **Week** | Select | Week 1 / Week 2 / ... / Week 8. Drives every weekly view. |
| **Owner** | Select | Vik / Claude Code. Two values, no ambiguity. Shows who's the bottleneck. |
| **Blocks** | Relation (self-referential) | Links to other rows in the same database. The dependency graph. |

Optional but high-value:

| Property | Type | Why |
|---|---|---|
| **Track** | Select | Content / Engineering / QA / Design / Infra. Helps Vik scan by area. |
| **Parallel-safe** | Checkbox | True = can start as soon as upstream is done, doesn't need Vik's attention. False = needs Vik in the loop. |
| **Critical path** | Checkbox | True = if this slips, the whole beta date slips. False = there's slack. |
| **Notes** | Text | One-line context — not a duplicate of the title. |

### 1.3 Status values — what they mean

Pick exactly five. Any more and the team stops using them.

1. **Not started** — work has not begun. Default state.
2. **In progress** — actively being worked.
3. **Blocked** — cannot move forward; the `Blocks` relation will show why.
4. **In review** — done by the owner, waiting on the other party to verify.
5. **Done** — verified and locked. Does not move back from Done unless explicitly reopened.

Use Notion's built-in status colours — green for Done, yellow for In progress, red for Blocked, grey for Not started, blue for In review.

### 1.4 The three views Vik needs

The same database, filtered three ways:

**View A — This Week** (the daily-driver view)
- Filter: `Week = current week`
- Sort: Status (Blocked first, then In progress, then Not started, then In review, then Done), then Critical path (true first)
- Group by: Owner
- This is the view Vik opens on Monday morning and closes on Friday night.

**View B — Blocks Next Week** (the dependency view)
- Filter: `Week = next week` AND `Status ≠ Done` AND `Blocks` is not empty
- Sort: Critical path (true first)
- This view answers: "What do I need to land THIS week to not stall next week?"

**View C — Parallel-safe Backlog** (the capacity view)
- Filter: `Status = Not started` AND `Parallel-safe = true` AND upstream `Status = Done`
- Sort: Week ascending
- This view answers: "If Claude Code has spare cycles, what can it pull forward?"

### 1.5 Theme consistency with existing Simplify IS pages

Vik's existing Simplify IS pages follow a pattern:
- **H1 = page name**, with a short tagline italicised below
- **Callout block** with the parent context, last refreshed date, and key links
- **Numbered top-level sections** (`## 0 · How to use this page` style — number, mid-dot, title)
- **Sister-document links** as a list inside the opening callout
- **Tables of decisions / status** with bold left-column labels
- **No emojis in body copy**, but heading emojis (🚀, 📅, 💼) are used on Notion sub-page titles — match that style on this page's title

Match this exactly. Do not invent a new pattern.

---

## 2 · What to create — step by step

### 2.1 Create the page

**Parent:** `3179e9b1-def7-81a1-87c1-f462b297ce28` (Simplify IS — Comprehensive Guide)

**Title:** `🎯 8-Week Beta Build Tracker — 28 Apr to 27 Jun 2026`

**Icon:** Use a target / bullseye emoji or the existing Simplify IS theme colour-block.

**Cover:** Match whatever cover the parent page uses, or leave blank if Vik's other sub-pages don't use covers.

**Page intro block (callout, default colour):**
```
This page tracks every task between 28 April 2026 and 27 June 2026.
Beta launch target: Friday 27 June 2026 — staging URL handed to two non-security tech-exec testers before Vik travels.
Maintained by Vik + Claude Code. Update statuses as work moves; do not delete rows once Done.

Sister documents (do not duplicate, link):
• docs/SOURCE_OF_TRUTH.md — current state of the build
• docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md — page-by-page audit (26 Apr 2026)
• docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md — every locked UI/UX decision
• simplify-is-roadmap-print.pdf — strategic 24-month roadmap

Last refreshed: 28 Apr 2026.
```

### 2.2 Create the inline database

Below the callout, insert an **inline database** (not full-page). Title it: `Build Tracker`.

Properties (create in this order, exactly):

| # | Name | Type | Configuration |
|---|---|---|---|
| 1 | **Task** | Title | (the default title field — rename it from "Name" to "Task") |
| 2 | **Status** | Status | Options: Not started (grey), In progress (yellow), Blocked (red), In review (blue), Done (green) |
| 3 | **Week** | Select | Options: Week 1 / Week 2 / Week 3 / Week 4 / Week 5 / Week 6 / Week 7 / Week 8 — colour them in a gradient (light to dark) so the timeline reads visually |
| 4 | **Owner** | Select | Options: Vik (orange), Claude Code (blue) |
| 5 | **Track** | Select | Options: Content (purple), Engineering (blue), QA (green), Design (pink), Infra (grey), Decision (yellow) |
| 6 | **Critical path** | Checkbox | Default unchecked |
| 7 | **Parallel-safe** | Checkbox | Default unchecked |
| 8 | **Blocks** | Relation | Self-referential — relates to the same Build Tracker database. Use "Limit: No limit". Show on related entry as `Blocked by`. |
| 9 | **Notes** | Text | Plain text, single line preferred |

### 2.3 Create the three views

After the database is populated (see §3), create these views in this order. They should be tabs at the top of the database.

**View A — `This Week` (default view)**
- Type: Table
- Filter: `Week` is `Week 1` (will be manually advanced each Monday — leave a note for Vik in §4 below)
- Sort: `Status` ascending (Blocked → In progress → In review → Not started → Done), then `Critical path` descending
- Group by: `Owner`
- Show properties: Task, Status, Track, Critical path, Blocks, Notes
- Hide: Week (it's filtered to one), Parallel-safe

**View B — `Blocks Next Week`**
- Type: Table
- Filter: `Week` is `Week 2` AND `Status` is not `Done` AND `Blocks` is not empty
- Sort: `Critical path` descending, then `Owner` ascending
- Show properties: Task, Status, Owner, Blocks, Notes
- Hide: Week, Track, Parallel-safe

**View C — `Parallel-safe Backlog`**
- Type: Table
- Filter: `Status` is `Not started` AND `Parallel-safe` is checked
- Sort: `Week` ascending
- Show properties: Task, Week, Owner, Track, Notes
- Hide: Status (it's filtered), Critical path, Blocks

### 2.4 Below the database — eight week sections

After the inline database, add eight `## ` (H2) headed sections, one per week. Each section has:

- A short paragraph stating the **theme** of the week (one sentence)
- A short paragraph stating the **deliverable** at the end of the week (what "done" looks like)
- A bulleted **Risk flags** list (where this week could slip)

Use the data in §3 below to populate these. Do not duplicate the task list under each week — the database already does that. The week sections are for *narrative context*, not task tracking.

---

## 3 · The dataset to populate

Insert each row below as a database entry. The dependency graph is encoded in the `Blocks` column — when you create a row, look up the prior row by Task name and link it. If a row has multiple things it's blocked by, link all of them.

> **Estimating note:** Hours have been deliberately omitted (Vik's request). Critical path and Parallel-safe are the gating signals.

### Week 1 (28 Apr – 4 May) — Theme: Unblock + first content

**Deliverable by Sunday 4 May:** Secrets rotated, email verification gate live in code, audit-readiness questions drafted, three domain briefs written, assessment flow stub replaced with a real-question reader.

**Risk flags:** Vik can only commit Tue/Wed of this week (~6 hrs). Anything beyond that slips into Week 2.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks (link to) | Notes |
|---|---|---|---|---|---|---|---|---|
| Rotate ANTHROPIC_API_KEY in Anthropic + Vercel | Not started | Week 1 | Vik | Infra | ✓ | | | Was committed to .env.local. Rotate first. |
| Rotate SUPABASE_SERVICE_KEY in Supabase + Vercel | Not started | Week 1 | Vik | Infra | ✓ | | | Same exposure. |
| Rotate ORCHESTRATION_SECRET in Vercel | Not started | Week 1 | Vik | Infra | ✓ | | | Min 32 chars. |
| Add .env.local to .gitignore + add detect-secrets pre-commit hook | Not started | Week 1 | Claude Code | Infra | ✓ | ✓ | Rotate ANTHROPIC_API_KEY + Rotate SUPABASE_SERVICE_KEY + Rotate ORCHESTRATION_SECRET | One-time hardening. |
| Audit-readiness — answer the 8 framing questions | Not started | Week 1 | Vik | Decision | ✓ | | | 30–45 min. Drives the design doc next week. |
| Pick 3 starter domains (Access Control, Incident Mgmt, Vendor Risk) and write briefs | Not started | Week 1 | Vik | Content | ✓ | | | ~15 min × 3 = 45 min. |
| Generate first-pass 6 questions × 3 starter domains | Not started | Week 1 | Claude Code | Content | ✓ | | Pick 3 starter domains and write briefs | Vik reviews same session. |
| Wire /api/v1/assessment/answer to real Supabase persistence | Not started | Week 1 | Claude Code | Engineering | ✓ | ✓ | | Replaces the stub returning {ok:true,stubbed:true}. |
| Replace AssessmentQuestionFlow.tsx (44-line stub) with real question reader | Not started | Week 1 | Claude Code | Engineering | ✓ | ✓ | Wire /api/v1/assessment/answer to real Supabase persistence | Reads from assessment_questions table. |
| Create assessment_questions table + seed migration scaffolding | Not started | Week 1 | Claude Code | Engineering | ✓ | ✓ | | Schema needs to match Vik's question structure. |
| Re-enable email verification gate in /api/v1/auth/login | Not started | Week 1 | Claude Code | Infra | ✓ | ✓ | | Removes TEMP bypass. |
| Delete /api/v1/auth/dev-confirm + /api/v1/auth/dev-set-password | Not started | Week 1 | Claude Code | Infra | ✓ | ✓ | Re-enable email verification gate in /api/v1/auth/login | Sweep TEMP routes before launch. |
| Fix footer routes (/legal/* → /terms, /privacy, drop /cookies) | Not started | Week 1 | Claude Code | Engineering | | ✓ | | P0 from Product Review §1.2. |
| Fix INDUSTRY_METRICS_V2 leftover label | Not started | Week 1 | Claude Code | Engineering | | ✓ | | R2.3.3 — flagged but still shipped. |
| Fix Risk View Stage 1 No-button bug (RiskWorkspace.tsx:22) | Not started | Week 1 | Claude Code | Engineering | | ✓ | | Both Yes/No advance to Stage 2 — broken. |

### Week 2 (5–11 May) — Theme: Question corpus sprint + onboarding persistence

**Deliverable by Sunday 11 May:** All 21 ISO domains have briefs written; ~75% of ISO questions generated and reviewed; onboarding persists to Supabase (Steps 1–4).

**Risk flags:** Vik must hit 6–8 hrs this week — if briefs slip, the whole question generation pipeline stalls. Tightest week of the project for Vik.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Write briefs for ISO domains 4–10 (7 domains) | Not started | Week 2 | Vik | Content | ✓ | | | Tue/Wed/Thu evenings. |
| Generate first-pass questions for ISO domains 4–10 | Not started | Week 2 | Claude Code | Content | ✓ | | Write briefs for ISO domains 4–10 | Bulk pass — review same session. |
| Vik reviews + iterates ISO domains 4–10 questions | Not started | Week 2 | Vik | Content | ✓ | | Generate first-pass questions for ISO domains 4–10 | Annotate, request rewrites. |
| Write briefs for ISO domains 11–17 (7 domains) | Not started | Week 2 | Vik | Content | ✓ | | | Weekend session. |
| Generate first-pass questions for ISO domains 11–17 | Not started | Week 2 | Claude Code | Content | ✓ | | Write briefs for ISO domains 11–17 | |
| Vik reviews + iterates ISO domains 11–17 questions | Not started | Week 2 | Vik | Content | ✓ | | Generate first-pass questions for ISO domains 11–17 | |
| Write briefs for ISO domains 18–21 (4 domains) | Not started | Week 2 | Vik | Content | ✓ | | | Sunday evening. |
| Generate first-pass questions for ISO domains 18–21 | Not started | Week 2 | Claude Code | Content | ✓ | | Write briefs for ISO domains 18–21 | |
| Build POST /api/v1/onboarding/consultant-name | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Persists users.agent_name. |
| Build POST /api/v1/onboarding/organisation | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Persists organisations.* (create-or-update). |
| Build POST /api/v1/onboarding/frameworks | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Persists organisations.selected_frameworks. |
| Build POST /api/v1/onboarding/complete | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Sets onboarding_completed_at. |
| Build GET /api/v1/onboarding/state | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Hydrates UI on mount. |
| Add organizations columns: onboarding_step, onboarding_completed_at, industry, countries (jsonb), workforce_scale, selected_frameworks (jsonb) | Not started | Week 2 | Claude Code | Engineering | ✓ | ✓ | | Migration. |
| Wire onboarding UI Steps 1–4 to real /onboarding/* endpoints | Not started | Week 2 | Claude Code | Engineering | ✓ | | Build POST /api/v1/onboarding/consultant-name + Build POST /api/v1/onboarding/organisation + Build POST /api/v1/onboarding/frameworks + Build POST /api/v1/onboarding/complete + Build GET /api/v1/onboarding/state | Drops sessionStorage-only state. |
| Audit-readiness design doc — Claude Code drafts from Vik's answers | Not started | Week 2 | Claude Code | Decision | ✓ | | Audit-readiness — answer the 8 framing questions | Drafts from Week 1 answers. |
| Vik reviews audit-readiness doc, refines voice + judgement | Not started | Week 2 | Vik | Decision | ✓ | | Audit-readiness design doc — Claude Code drafts | Editing pass, not writing. |

### Week 3 (12–18 May) — Theme: Finish question corpus + scoring engine

**Deliverable by Sunday 18 May:** All 126 ISO questions locked. NIST briefing started. Real `scoreControl.ts` shipped. Risk library (7 risks) seeded. Cypher voice rules drafted.

**Risk flags:** Scoring algorithm is non-trivial — `scoreControl.ts` has been a skeleton for weeks. If it goes deeper than expected, NIST work spills into Week 4.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Final ISO question polish across all 21 domains | Not started | Week 3 | Vik | Content | ✓ | | Vik reviews + iterates ISO domains 18–21 questions | Coherence pass — does the corpus feel like one consultant? |
| Seed assessment_questions table with all 126 ISO questions | Not started | Week 3 | Claude Code | Content | ✓ | | Final ISO question polish across all 21 domains | Production data. |
| Write briefs for first 10 NIST CSF 2.0 functions/categories | Not started | Week 3 | Vik | Content | ✓ | | | NIST is structured differently — 6 functions × subcategories. |
| Generate first-pass questions for first 10 NIST groupings | Not started | Week 3 | Claude Code | Content | ✓ | | Write briefs for first 10 NIST CSF 2.0 functions/categories | |
| Implement orchestration/scoring/scoreControl.ts (real CMMI) | Not started | Week 3 | Claude Code | Engineering | ✓ | ✓ | | SIGNAL_WEIGHTS = {high:1.0, med:0.7, low:0.4, planned:0.0}; OVERDUE_PENALTY = 0.20. |
| Implement domain-level scoring (only when ALL controls in domain complete) | Not started | Week 3 | Claude Code | Engineering | ✓ | | Implement orchestration/scoring/scoreControl.ts | Per spec. Never per-answer. |
| Implement framework-level scoring (weighted average of domains) | Not started | Week 3 | Claude Code | Engineering | ✓ | | Implement domain-level scoring | |
| Seed top_risks → organisation_risks for new org (7 risks) | Not started | Week 3 | Claude Code | Engineering | ✓ | ✓ | | Auto-seed on org creation. |
| Vik writes Cypher voice + signal extraction rules (5–6 worked examples) | Not started | Week 3 | Vik | Content | ✓ | | | Persona, contradiction handling, N.A. probing. |
| Refine 9 Cypher orchestration prompts using Vik's voice examples | Not started | Week 3 | Claude Code | Engineering | ✓ | | Vik writes Cypher voice + signal extraction rules | Prompts in /orchestration/prompts/. |
| Add /api/health endpoint (Supabase + Anthropic + Stripe reachability) | Not started | Week 3 | Claude Code | Infra | | ✓ | | Vercel cron pings every 5 min. |
| Verify Stripe webhook signature validation | Not started | Week 3 | Claude Code | Infra | | ✓ | | P0 from §5.1. |

### Week 4 (19–25 May) — Theme: Real data wiring + autonomous testing setup

**Deliverable by Sunday 25 May:** All `usePostLogin` hooks live (no mocks). Industry Dashboard reads real scores. Autonomous test agent harness running and producing first batch of results. NIST corpus 50% done.

**Risk flags:** This is the highest Claude Code output week. If real-data wiring uncovers schema bugs, autonomous testing slips. Autonomous testing must start by Wed 21 May or Week 5 UI work loses its safety net.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Finish remaining NIST domain briefs | Not started | Week 4 | Vik | Content | ✓ | | Generate first-pass questions for first 10 NIST groupings | |
| Generate + review remaining NIST questions | Not started | Week 4 | Claude Code | Content | ✓ | | Finish remaining NIST domain briefs | |
| Seed assessment_questions table with all NIST questions | Not started | Week 4 | Claude Code | Content | ✓ | | Generate + review remaining NIST questions | |
| Wire useIndustryDashboard to live API (drop mockResult) | Not started | Week 4 | Claude Code | Engineering | ✓ | | Implement framework-level scoring | |
| Wire useFrameworkView to live API | Not started | Week 4 | Claude Code | Engineering | ✓ | | Implement framework-level scoring | |
| Wire useRiskWorkspace to live API | Not started | Week 4 | Claude Code | Engineering | ✓ | | Seed top_risks → organisation_risks | |
| Wire useMaturityRoadmap to live API | Not started | Week 4 | Claude Code | Engineering | ✓ | | Implement framework-level scoring | |
| Wire useProgressMilestones to live API | Not started | Week 4 | Claude Code | Engineering | ✓ | | Implement framework-level scoring | |
| Implement NIST radar visualisation (Framework View) | Not started | Week 4 | Claude Code | Engineering | ✓ | | Wire useFrameworkView to live API | Per Vik's spec — NIST radar required. |
| Implement ISO stacked-bar visualisation (Framework View) | Not started | Week 4 | Claude Code | Engineering | ✓ | | Wire useFrameworkView to live API | Per Vik's spec — ISO bars required. |
| Implement Risk View Stage 2 priority groups + per-risk control mapping | Not started | Week 4 | Claude Code | Engineering | ✓ | | Wire useRiskWorkspace to live API | Master Decisions §28.5.c. |
| Implement Maturity Roadmap real action lists (Maintain / Uplift / Industry Shifts) | Not started | Week 4 | Claude Code | Engineering | ✓ | | Wire useMaturityRoadmap to live API | Replaces "Filtered action list placeholder". |
| Implement Progress & Milestones (Timeline / Comparison / Milestones) | Not started | Week 4 | Claude Code | Engineering | ✓ | | Wire useProgressMilestones to live API | Replaces 3 placeholder strings. |
| Build autonomous test agent harness (separate Anthropic API agent probing Cypher) | Not started | Week 4 | Claude Code | QA | ✓ | ✓ | | Constitutional AI / AutoResearch pattern. See §5 below. |
| Define 8 constitutional principles for Cypher evaluation | Not started | Week 4 | Vik | QA | ✓ | | | E.g. "cite org knowledge naturally", "detect contradictions with humility", "never confuse ISO with NIST IDs". |
| Run first batch (50 simulated assessments) through autonomous tester | Not started | Week 4 | Claude Code | QA | ✓ | | Build autonomous test agent harness + Define 8 constitutional principles | Adversarial + happy-path mix. |
| Vik reviews autonomous test report + flags improvements | Not started | Week 4 | Vik | QA | ✓ | | Run first batch (50 simulated assessments) | Plain-English summary. |
| Drop NEXT_PUBLIC_USE_MOCKS flag | Not started | Week 4 | Claude Code | Engineering | | | Wire useIndustryDashboard to live API + Wire useFrameworkView to live API + Wire useRiskWorkspace to live API + Wire useMaturityRoadmap to live API + Wire useProgressMilestones to live API | Once all hooks are live. |
| Add Sentry + structured logging (every API route + Claude call) | Not started | Week 4 | Claude Code | Infra | | ✓ | | BetterStack/Logtail for structured logs. |

### Week 5 (26 May – 1 Jun) — Theme: Cypher as the workspace (Option C)

**Deliverable by Sunday 1 Jun:** Persistent Cypher right-rail across all authenticated pages (desktop). Right-click → Ask Cypher on core elements. Inline Cypher chat in assessment flow. Streaming responses. Mobile defers to floating button.

**Risk flags:** This is the most architecturally complex week. State management for the persistent rail (cross-page context) is the highest-risk task. If the rail's state hydration breaks, fall back to a non-persistent rail and ship right-click + inline only.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop) | Not started | Week 5 | Claude Code | Engineering | ✓ | | Run first batch (50 simulated assessments) | Persistent right-side panel. |
| Implement cross-page state for CypherRail (Zustand or React Context) | Not started | Week 5 | Claude Code | Engineering | ✓ | | Convert FloatingCypherButton + CypherChatModal → CypherRail | "Awareness" not "omniscience" — track current page + last-clicked element. |
| Build CypherContextMenu component (right-click handler + popup) | Not started | Week 5 | Claude Code | Engineering | ✓ | ✓ | | Generic — reused across element types. |
| Wire right-click on Industry Dashboard maturity scores | Not started | Week 5 | Claude Code | Engineering | ✓ | | Build CypherContextMenu component + Implement cross-page state for CypherRail | Pre-loads context: score, domain, current maturity. |
| Wire right-click on Framework View controls | Not started | Week 5 | Claude Code | Engineering | ✓ | | Build CypherContextMenu component + Implement cross-page state for CypherRail | Pre-loads context: control_id, framework, answer history. |
| Wire right-click on Risk View risks | Not started | Week 5 | Claude Code | Engineering | ✓ | | Build CypherContextMenu component + Implement cross-page state for CypherRail | Pre-loads context: risk_id, mitigations, mapped controls. |
| Add inline "Discuss with Cypher" expandable below each assessment question | Not started | Week 5 | Claude Code | Engineering | ✓ | | Convert FloatingCypherButton + CypherChatModal → CypherRail | Single source of truth — same conversation as the rail. |
| Implement streaming responses (SSE from /api/internal/* → CypherRail) | Not started | Week 5 | Claude Code | Engineering | ✓ | | Convert FloatingCypherButton + CypherChatModal → CypherRail | Token-by-token rendering. |
| Mobile fallback: keep FloatingCypherButton on mobile breakpoints | Not started | Week 5 | Claude Code | Engineering | | ✓ | | Don't try to fit a rail on mobile. |
| Inline "Signal captured" UI confirmation in chat | Not started | Week 5 | Claude Code | Engineering | ✓ | | Add inline "Discuss with Cypher" expandable | Visible signal extraction. |
| Vik QAs Cypher voice + interaction quality (test conversations) | Not started | Week 5 | Vik | QA | ✓ | | Inline "Signal captured" UI confirmation in chat | 2–3 hours of structured probing. |
| Run second batch (50 simulated assessments — adversarial focus) | Not started | Week 5 | Claude Code | QA | ✓ | | Inline "Signal captured" UI confirmation in chat | Should show measurable improvement vs first batch. |
| Migration: consolidate /admin/* and /organisation/* design tokens to M3 | Not started | Week 5 | Claude Code | Design | | ✓ | | Product Review §9.3 — visual two-system split. |
| Onboarding tightening (Step 1 hint, Step 2 signup backfill, Step 3 always-visible checkbox, Step 4 sidebar mirror) | Not started | Week 5 | Claude Code | Engineering | | ✓ | Wire onboarding UI Steps 1–4 to real /onboarding/* endpoints | Round 2 carry-over. |

### Week 6 (2–8 Jun) — Theme: PDF export + integration tests + Cypher polish

**Deliverable by Sunday 8 Jun:** Internal-checklist PDF generated from real session data. End-to-end integration tests pass. Playwright E2E covers signup → assessment → score → Cypher interaction → PDF. Third autonomous test batch shows further improvement.

**Risk flags:** PDF generation has a history of being underestimated. If Puppeteer/react-pdf misbehaves on Vercel, allocate Week 7 buffer.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Build PDF export — internal checklist mode (Puppeteer or react-pdf) | Not started | Week 6 | Claude Code | Engineering | ✓ | | Implement framework-level scoring | Executive summary deferred post-beta. |
| Wire PDF export to /api/v1/assessments/sessions/[id]/export | Not started | Week 6 | Claude Code | Engineering | ✓ | | Build PDF export — internal checklist mode | 7-day Supabase Storage signed link. |
| Integration tests: session create → response submit → score update → dashboard refresh | Not started | Week 6 | Claude Code | QA | ✓ | | Wire useIndustryDashboard to live API | Jest + supertest. |
| Playwright E2E: signup → onboarding → assessment 5 questions → domain complete → score → dashboard → Cypher interaction → PDF | Not started | Week 6 | Claude Code | QA | ✓ | | Wire PDF export to /api/v1/assessments/sessions/[id]/export | The headline E2E test. |
| Vik runs the E2E manually (the "be a customer" pass) | Not started | Week 6 | Vik | QA | ✓ | | Playwright E2E: signup → ... → PDF | Two full passes — desktop + tablet. |
| Run third autonomous test batch (refined principles) | Not started | Week 6 | Claude Code | QA | ✓ | | Run second batch (50 simulated assessments — adversarial focus) | Compare to first/second batch. |
| Vik reviews third batch + locks Cypher voice | Not started | Week 6 | Vik | QA | ✓ | | Run third autonomous test batch (refined principles) | Final voice sign-off. |
| Lighthouse pass on every authenticated page | Not started | Week 6 | Claude Code | QA | | ✓ | | ≥90 across the board. |
| Bundle analysis + lazy-load heavy components | Not started | Week 6 | Claude Code | Engineering | | ✓ | | D3 / framer-motion / recharts lazy. |
| Light-mode QA pass on dashboards | Not started | Week 6 | Vik | QA | | | Vik runs the E2E manually | If post-login dark-only, skip. |
| MFA full enrolment flow (QR + recovery codes) | Not started | Week 6 | Claude Code | Engineering | | ✓ | | Currently MFA is verify-only. |

### Week 7 (9–15 Jun) — Theme: Pre-launch hardening + content polish

**Deliverable by Sunday 15 Jun:** Production logging fully wired. Security audit re-run with zero criticals. Error pages polished. All copy QA'd in Australian English. Autonomous testing passes its acceptance criteria.

**Risk flags:** This is the buffer week. If Weeks 5–6 slipped, this absorbs the slip. If everything's on track, use it for polish, not new features.

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Run security audit script + fix anything new | Not started | Week 7 | Claude Code | Infra | ✓ | | | npm run security:audit. |
| Cross-tenant RLS isolation re-test (manual) | Not started | Week 7 | Claude Code | QA | ✓ | | Run security audit script | Two test orgs, verify nothing leaks. |
| Australian English sweep (global string check) | Not started | Week 7 | Claude Code | Content | | ✓ | | Per Master Decisions. |
| Polish error pages (403/404/503) — match not-found.tsx quality | Not started | Week 7 | Claude Code | Design | | ✓ | | Product Review §1.6. |
| Add prompt canary in Cypher's system prompt | Not started | Week 7 | Claude Code | Infra | | ✓ | | Tagged sentence that should never appear in user output — alarms on prompt-injection. |
| Pin @anthropic-ai/sdk + @supabase/supabase-js to exact versions | Not started | Week 7 | Claude Code | Infra | | ✓ | | Supply-chain hardening. |
| Vik QA — full test as a brand-new user (fresh email, no shortcuts) | Not started | Week 7 | Vik | QA | ✓ | | | Catches anything seeded data hides. |
| Audit-trail page polish | Not started | Week 7 | Claude Code | Design | | ✓ | | Migrated to M3 in Week 5; polish here. |
| Performance re-test (300 concurrent simulated users) | Not started | Week 7 | Claude Code | QA | | ✓ | | Cheap load test before staging. |
| Final Vik review of audit-readiness doc | Not started | Week 7 | Vik | Decision | | | Vik reviews audit-readiness doc, refines voice + judgement | Lock for beta. |

### Week 8 (16–22 Jun) — Theme: Staging deploy + tester handoff

**Deliverable by Friday 27 Jun:** Staging URL live on private domain. Two beta tester accounts created. Welcome packet sent. Vik travels with confidence.

**Risk flags:** First production-shaped deploy. Allow 2 days for the unexpected (env var mismatches, Vercel build quirks, Supabase RLS edge cases).

| Task | Status | Week | Owner | Track | Critical | Parallel | Blocks | Notes |
|---|---|---|---|---|---|---|---|---|
| Configure private staging domain | Not started | Week 8 | Vik | Infra | ✓ | | | Not searchable. |
| Deploy to staging (full env var sweep) | Not started | Week 8 | Claude Code | Infra | ✓ | | Configure private staging domain + Run security audit script + fix anything new | Production-shaped. |
| Smoke test on staging (signup → assessment → score → PDF → Cypher) | Not started | Week 8 | Claude Code | QA | ✓ | | Deploy to staging | Same as E2E but on real infra. |
| Vik smoke-tests staging as a fresh user | Not started | Week 8 | Vik | QA | ✓ | | Smoke test on staging | One more pair of eyes. |
| Create two beta tester accounts | Not started | Week 8 | Vik | Decision | ✓ | | Vik smoke-tests staging | Real names, real orgs. |
| Write tester welcome packet (what to test, what to ignore, how to give feedback) | Not started | Week 8 | Vik | Content | ✓ | | | Plain-language. ~1 page. |
| Set up feedback channel (email alias or Notion form) | Not started | Week 8 | Vik | Infra | ✓ | | | Single inbox, not scattered. |
| Hand over staging link + welcome packet to testers | Not started | Week 8 | Vik | Decision | ✓ | | Create two beta tester accounts + Write tester welcome packet | Friday 27 Jun. |
| Final autonomous test batch on staging (sanity check) | Not started | Week 8 | Claude Code | QA | | | Deploy to staging | Last signal that nothing regressed. |
| Document the "if it breaks while I'm away" runbook | Not started | Week 8 | Vik | Decision | | | | Short list — common failure modes + Claude Code triage instructions. |

---

## 4 · Manual operations Vik does each week

Add this as a callout block near the top of the page, below the intro:

```
HOW TO USE THIS PAGE — WEEKLY RHYTHM

Every Monday morning:
1. Open View A (This Week). Update its filter to the current week.
2. Scan View B (Blocks Next Week). Anything red here is your priority.
3. Scan View C (Parallel-safe Backlog). If Claude Code is ahead, pull one forward.

During the week:
- Move tasks: Not started → In progress → In review → Done.
- If something blocks, set Status = Blocked AND link the blocking row in "Blocks".
- Add Notes if the context changes (one line, no essays).

Every Friday evening:
- Anything still Not started in this week's view → either Done by Sunday, or it slips. Update the Week column to next week and add a note explaining why.
- Check the deliverable in §3 against what's actually shipped. Be honest.

Never:
- Delete rows. Move them to Done or to a future week.
- Mark Done unless it's verified working — In review is the right state for "I think it's done".
```

---

## 5 · The autonomous testing harness — what to build in Week 4

This deserves its own section because Vik specifically called it out. The reference is Andrej Karpathy's AutoResearch — agents probing other agents, generating test data, scoring outputs against a constitution, iterating.

### 5.1 What you are building

A Node.js script (`/scripts/qa/autonomousTest.ts`) that:

1. Loads N **org archetypes** (e.g. healthcare startup, mid-size financial services, SaaS scale-up). Five archetypes is enough to start.
2. For each archetype, spins up a **simulated user agent** using a separate Anthropic API key (or the same key with a budget cap).
3. The simulated user signs up, runs through onboarding, starts an assessment, and answers Cypher's questions in character — sometimes correctly, sometimes evasively, sometimes contradicting earlier answers.
4. Cypher's responses (every message, every signal extracted, every score change) are logged to a structured JSONL file (`test-runs/{timestamp}/transcript.jsonl`).
5. After each session, a **judge agent** evaluates the transcript against the **8 constitutional principles** (defined by Vik in Week 4). Principles are things like:
   - "Cypher cited org knowledge naturally without breaking conversation flow."
   - "Cypher detected the contradiction with humility, not accusation."
   - "Cypher never confused ISO controls with NIST subcategories."
   - "Cypher's answer would save the user 30+ minutes vs Googling."
6. The judge produces a per-principle score (0–10) and a plain-English summary of where Cypher fell short.
7. A consolidated report is written to `test-runs/{timestamp}/report.md` — what improved, what regressed, specific failure modes to fix.

### 5.2 Cost ceiling

Vik's budget guidance: **$100–150 of Anthropic API spend** for the full Phase 1 validation (~150 simulated assessments across the three batches). Hard cap the script — no surprises.

### 5.3 What gets fed back

After each batch:
- Vik reviews the report.
- Failure modes get logged as new tasks in the Week 5 / Week 6 backlog (in this same Notion database).
- Cypher prompts get refined based on the worst-performing principles.
- The judge's evaluation criteria get tightened too — first batch teaches you what "good" looks like.

This is the **Constitutional AI improvement loop** in miniature, and it scales without adding human review hours.

### 5.4 What to defer post-beta

- Real-time monitoring of production Cypher conversations against the same principles.
- Public dashboard showing Cypher's quality score over time.
- Letting users see the principles Cypher is being evaluated against (transparency play).

These are post-beta features. Build the harness now; productionise the loop later.

---

## 6 · Acceptance criteria — when this Notion page is "done"

Before you tell Vik the page is ready, verify all of the following:

- [ ] Page is created as a child of `3179e9b1-def7-81a1-87c1-f462b297ce28`.
- [ ] Page title is `🎯 8-Week Beta Build Tracker — 28 Apr to 27 Jun 2026`.
- [ ] Intro callout is in place, with sister-document links and last-refreshed date.
- [ ] Inline database `Build Tracker` exists with all 9 properties from §2.2.
- [ ] All three views (`This Week`, `Blocks Next Week`, `Parallel-safe Backlog`) exist as tabs.
- [ ] All ~95 tasks from §3 are populated as rows in the database.
- [ ] Every `Blocks` relation in §3 is linked to the correct upstream row.
- [ ] Eight `## Week N` sections exist below the database with theme + deliverable + risk flags.
- [ ] The "How to use this page" callout from §4 is in place.
- [ ] The autonomous testing harness section (§5 here) is captured as a sub-page or block on the main tracker page so Vik can reference it during Week 4.

When Vik opens the page, he should be able to answer in 30 seconds:
- What am I doing this week?
- What is Claude Code doing this week?
- What's blocked?
- What blocks next week?
- What's parallel-safe?

If the page can't answer those five questions in half a minute, fix it before reporting Done.

---

## 7 · After you create the page

Send Vik:
1. The Notion URL.
2. A one-line confirmation that all ~95 tasks were inserted with dependencies linked.
3. A flag-list of any tasks where you guessed at the dependency (so Vik can correct them).
4. An estimate of how many tasks per week — sanity check the load:
   - Vik should never have more than ~6 tasks marked Owner=Vik in any single week.
   - Claude Code can carry as many as 12–14 per week.
   - If a week looks lopsided, flag it.

Do not push notifications, do not edit the parent page, do not modify any other Simplify IS pages. Single-page deliverable.

---

*End of instructions. Execute methodically. Report back when the page is live.*
