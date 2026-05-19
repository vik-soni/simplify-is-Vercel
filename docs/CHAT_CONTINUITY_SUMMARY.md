# Simplify IS — Chat Continuity Summary
## What's NOT in Agent 10 / Agent 11 Files
### Generated: April 2026 | For New Chat Context

---

## PURPOSE OF THIS FILE

This summary captures everything discussed in the previous chat that is **NOT already documented** in:
- `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`
- `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`
- `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`
- `11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`
- `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`

Use this to brief any new chat with the strategic, process, and forward-looking context that doesn't live in the agent specs.

---

## 1. CURRENT BUILD STATUS (April 2026)

### Completed Agents
- **Agents 1–5:** Infrastructure, Orchestration, API Layer, Frontend, Security/QA — all complete
- **Agents 7–9:** Pre-login pages, Auth backend, Auth UI/API wiring — all complete
- **Agent 10:** Post-login UI/UX — Cursor build complete, Claude Code polish pass available

### In Progress / Recently Generated
- **Agent 10:** Cursor build done, Claude Code polish pass available (already run)
- **Agent 15:** Tech Stack Discovery — running in Cursor in parallel, expected complete before Agent 11 runs
- **Agent 11:** UI/UX onboarding refinement + initialisation + public pages — spec generated, ready to run in Cursor

### Not Yet Built
- **Agent 12:** API wiring + state management — connects all UI from Agents 10 & 11 to backend endpoints
- **Agent 13+:** TBD (no specs written yet)
- **Agent 6:** Multi-user collaboration — spec ready, deferred to post-MVP

---

## 2. WORKFLOW & TOOLING DECISIONS

### Cursor → Claude Code Pattern (Locked)
For every UI/UX agent (10, 11, future):
1. **Cursor first** — heavy lifting, scaffolds the build, ~60-65% of spec coverage
2. **Claude Code second** — polish pass, completes light mode, responsive, accessibility, edge cases, Australian English audit, custom icons
3. **Each agent generates 2 MD files** — one for Cursor, one for Claude Code

### Tool Strategy (Locked)
- **Cursor:** ALL code generation, primary build tool. One agent at a time.
- **Claude (chat):** Architecture decisions, spec writing, debugging, prompt refinement
- **Claude Code:** Polish/review pass on top of Cursor; large refactors; complex migrations

### Vik's Working Style
- **One question at a time** in conversational planning sessions
- Voice/audio interface — interpret intent, not literal words (transcription errors common)
- Wants to be challenged with better ideas, not just validated
- **Critical reminder:** No PNG uploads via chat (causes audio dropout). PNGs go via local file paths in `/Users/vik/Documents/Code/simplify-is/stitch_output/` for Cursor to read directly.

---

## 3. STRATEGIC DECISIONS NOT IN AGENT FILES

### 3.1 Plan Tiers (Pricing Model — Locked)

**Essential Plan:**
- 14-day free trial available
- Includes: NIST CSF 2.0 ONLY
- No optional frameworks
- No multi-user collaboration

**Professional Plan:**
- Paid only (no trial)
- Includes: NIST CSF 2.0 + choice of 3 additional frameworks
- Each additional framework beyond 3: $249/month add-on
- Multi-user collaboration enabled
- Priority support

**Enterprise Plan:**
- **NOT BUILT IN MVP** — explicitly deferred per Vik's instruction
- "I don't really want that to be enabled or an option straight away"

### 3.2 Framework Library Expansion (April 2026)

**Original MVP plan (Agent 10):** ISO 27001 + NIST CSF 2.0 + APRA CPS 234

**Expanded scope (Agent 11):** Now 9 frameworks ready, all listed below. NIST CSF 2.0 is the new default (replacing the original ISO + NIST default).

**All 9 frameworks (current as of April 2026):**
1. NIST CSF 2.0 (default for everyone — Essential + Professional)
2. ISO 27001:2022 (was previously default, now optional add-on)
3. PCI DSS 4.0
4. APRA CPS 234
5. APRA CPS 230
6. ASD Essential Eight
7. ISO 42001 (AI Management)
8. AUVA ISS (Australian Voluntary AI Safety Standard)
9. NIST AI RMF (AI Risk Management Framework)

**Strategic note:** AI governance frameworks (ISO 42001, AUVA ISS, NIST AI RMF) added because of EU AI Act enforcement (August 2026) timing. This positions Simplify IS for the AI governance market expansion.

### 3.3 Framework Change Cooldown (Locked)

- Once user selects frameworks during onboarding, they can change selection in Organisation Settings → Preferences
- **30-day cooldown** between changes (was previously vague)
- Will change post-MVP (allow more flexibility once stable)
- Prevents "framework gaming" (toggling between frameworks to manipulate maturity scores)

### 3.4 "Maturity Roadmap" Naming (Locked)

- Originally proposed "Compliance Center" — explicitly rejected
- **"Maturity Roadmap"** chosen — frames it as forward-looking growth, not regulatory checkbox
- Reasoning: customers don't want a "compliance dashboard nobody cares about" — want active, interactive content

### 3.5 "Progress & Milestones" Naming (Locked)

- Originally proposed "History" — explicitly rejected
- **"Progress & Milestones"** chosen — emphasises celebration + trajectory, not a static log
- Strategic reason: gives CISOs board-ready talking points

### 3.6 Audit Sub-Section Reframing (Locked)

- Audit log is NOT about user account changes (password resets, MFA toggles, login events)
- Audit log IS about **user contribution to organisational maturity** — who answered which control, what impact on score, when, with revision history
- This is critical for multi-user collaboration (Agent 6 post-MVP)

---

## 4. AGENT NAMING DISPLAY CONVENTION (Critical Detail)

**Vik's locked decision (changed during chat):**
- User enters max 10 characters as agent name
- **Display format throughout entire app: `🤖 {name}` (emoji PREFIX, not suffix)**
- Originally proposed `{name} 🤖` (suffix) — corrected to PREFIX during conversation
- Reasoning: "So it looks like it's not really a person. It's a person that is more of an agent."
- Reserve UI space for ~15-20 character display width

**Examples:**
- Chat button: `Ask 🤖 Sarah`
- Chat header: `🤖 Sarah`
- Review button: `Review with 🤖 Sarah`
- "Discuss with" CTAs: `Discuss with 🤖 Sarah`

**Edge cases:**
- Empty name → defaults silently to "Cypher" (no error)
- Profanity filter on entry — uses `bad-words` npm package or similar
- Duplicate names allowed (even matching user's own name) because emoji prefix makes it clearly an agent

---

## 5. THINGS DISCUSSED BUT INTENTIONALLY DEFERRED

### 5.1 Tech Stack Coverage Display Pattern (Discussed but Deferred)

- During Risk View planning, Vik raised "control coverage" concept
- Example: MFA enabled (control) vs MFA on 45% of critical systems (coverage)
- **Deferred decision:** Where exactly to display coverage data
- Vik's intention: Capture coverage through Cypher conversation (not separate UI flow)
- Agreed approach: Show coverage badge alongside maturity score wherever controls appear (Framework View detail panel + Risk View detail panel)
- **NOT yet decided:** Whether Coverage gets its own dedicated dashboard view in future

### 5.2 Framework-Agnostic "Simplify IS Domains" (Future Post-MVP)

- 21 domains in Supabase `domains` table — were originally going to be the Industry Dashboard categorisation
- **Decision:** For MVP, use 6 NIST functions instead (Govern, Identify, Protect, Detect, Respond, Recover)
- 21 domains deferred to post-MVP — will become "Simplify IS Domains" (proprietary classification independent of any framework)
- Strategic reason: avoid forcing custom taxonomy on users before product-market fit

### 5.3 Executive Board Report PDF Export (Post-MVP)

- Discussed: monthly/quarterly PDF for board/leadership
- Two PDF types previously specced: Internal Checklist + Executive Summary
- **Deferred:** Full board report generation — too much scope for MVP
- Future: Auto-generated quarterly board report with talking points

### 5.4 Power BI / BI Export API (Phase 3)

- Briefly mentioned during roadmap planning
- Deferred to Phase 3 (Months 8–18)
- Strategic value: positions product as "infrastructure for larger orgs"

### 5.5 MCP Integrations (Phase 4)

- Vik mentioned "decipher.net" domain reserved for future expansion
- MCP integrations (Okta, CrowdStrike, Entra ID, Jira) planned for Phase 4 (Months 18–36)
- Idea: Cypher reads real tool data, auto-updates control assessments — transforms from periodic to continuous assessment

---

## 6. PRODUCT PHILOSOPHY DECISIONS (Underlying Logic)

### 6.1 Cypher as Hero, Not Forced (Locked)

- Cypher is the centre of value, but should NEVER feel forced on users
- "Make it subtle, but make it obvious" — Vik's exact phrasing
- Floating button bottom-right; modal overlay when engaged
- Empty states should suggest Cypher as helper, not auto-open Cypher panel

### 6.2 No Fake Confidence (Locked)

- Empty dashboards must NOT show fake zeros or placeholder data
- Skeleton loaders during fetch, then graceful empty state with CTAs
- Better to show "—" than to show "0.0/5.0" (which implies "you're terrible at security")

### 6.3 Honest Framework Visualisation (Locked)

- NIST = maturity (1-5) → use radar chart
- ISO = compliance (yes/no + findings) → use stacked horizontal bars
- APRA = level distribution (Level 2/3/4) → use stacked bars
- **Rejected:** Forcing all frameworks into one visualisation type
- **Reasoning:** "ISO doesn't talk about maturity. ISO talks about whether you are compliant or not compliant." Honest representation > visual consistency.

### 6.4 Risk-First, Not Control-First (Locked)

- During Risk View planning, Vik explicitly rejected framework-specific follow-up questions
- "I don't want it to be a control-driven risk. I would rather it to be a risk risk, and the outcome is that controls can mitigate."
- Risk View shows risks → controls (not controls → risks)
- Custom risks supported via Claude reverse-engineering: user types description, Claude maps to controls

### 6.5 Australian English Throughout (Locked)

- Vik: "we need to stick to Australian English. We're not going to go to American English."
- Applies to: every label, error, placeholder, helper text, button text
- Date format: DD/MM/YYYY
- Specific words: organisation, colour, centre, licence, realise, optimise, prioritise

---

## 7. PROCESS LESSONS LEARNED

### 7.1 Agent 10 Took ~3.5–4 Hours of Planning

- Vik confirmed planning + spec writing took roughly that long
- This sets the **benchmark for major UI/UX agents**
- Smaller agents (e.g., Agent 11 refinement) take ~1.5–2 hours of planning

### 7.2 Cursor Output Pattern (Empirical)

Based on Agent 10 output:
- Cursor delivers ~60–65% of spec coverage
- Always passes lint/build/tests
- Always missing/stubbed:
  - D3 chart polish
  - Light mode coverage
  - Responsive (tablet/mobile)
  - Empty states
  - Animation polish
  - Accessibility ARIA refinements
  - Australian English audit
- Claude Code polish pass is essential — not optional

### 7.3 PNG File Reference Strategy

- Vik uploads PNGs to local folder: `/Users/vik/Documents/Code/simplify-is/stitch_output/`
- Cursor reads PNGs directly (Claude in chat cannot view images)
- For each new agent, leave a TODO in handoff for Vik to confirm PNG file paths if needed

### 7.4 Agent Spec Length Sweet Spot

- Agent 10 Cursor spec: ~99KB (comprehensive, detailed)
- Agent 10 Claude Code spec: ~31KB (focused checklist)
- Vik prefers detailed specs to reduce back-and-forth: "more the better"

---

## 8. UNRESOLVED OPEN QUESTIONS (Before Agent 12 Wiring)

### 8.1 Backend Endpoints Not Yet Designed
- `/api/v1/onboarding/state` — needs DB schema for tracking onboarding progress
- `/api/v1/tech-stack/state` — Agent 15 should define this
- `/api/v1/billing/available-frameworks` — needs Stripe product mapping for 8 add-on frameworks at $249/month each
- `/api/v1/frameworks/library` — needs Supabase seeding of all 9 framework metadata

### 8.2 Cypher Welcome Greeting Final Wording
- Vik's intent: "Warm, human, consultant-like. Welcome them. Yes. This is the first time. Tell them what they are looking at and what is where."
- **NOT YET FINALISED** — placeholder used in specs
- TODO for Vik before Agent 12 wires Cypher conversations

### 8.3 20 Template Risks (Database Seeding)
- Vik: "I will give you twenty risks in a Supabase database"
- **NOT YET PROVIDED** — placeholder risks for MVP UI
- Required before Agent 12 wires Risk View Stage 1 selection flow

### 8.4 Assessment Questions (5–8 per Domain)
- Vik: "Claude Code will write the questions, but later, and will be stored in Supabase"
- **NOT YET WRITTEN** — placeholder questions in MVP UI
- Required before Agent 12 fully wires Assessment Path 1 flow

### 8.5 Notification Types
- Vik mentioned but didn't fully enumerate
- Agent 12 needs to know exact list: Assessment due, Domain completed, Cypher insight, Framework change, Reassessment due, etc.

### 8.6 Security Briefing / Industry Advisory Source
- Vik mentioned a "separate research agent" he runs
- **NOT YET CONNECTED** — Industry Dashboard tile shows static placeholder
- TODO for Vik to define data feed integration

---

## 9. AGENT 12 SCOPE PREVIEW (For Next Planning Session)

### What Agent 12 Will Do
1. Wire all UI components from Agents 10 & 11 to real API endpoints (replace mocks)
2. Implement React Query hooks for all data fetching
3. Implement form handlers (Edit Profile, Change Password, etc.)
4. Implement Cypher chat SSE streaming (connect to Agent 2 orchestration)
5. Implement real-time score updates
6. Implement session persistence (resume where user left off)
7. Implement error boundaries + loading states everywhere
8. Implement JWT refresh + 401 handling

### Estimated Scope
- ~30–35 hours of Cursor build
- ~10–15 hours of Claude Code polish
- 2–3 hours of Vik+Claude planning before spec write

### Pre-Requisites for Agent 12
- All 6 unresolved open questions in Section 8 above must be answered
- Agent 11 (Cursor + Claude Code) must be complete and verified

---

## 10. ARCHITECTURAL REMINDERS (Always)

### Three-Layer Architecture (Never Violate)
```
INTERNET → /api/v1/* (JWT, rate limit) → /api/internal/* (ORCHESTRATION_SECRET) → Supabase + Claude
```

### Never Break Rules
- No direct Supabase calls from React components
- No direct Claude API calls from `/api/v1/*` routes
- All AI calls go through `/api/internal/*` orchestration
- Service keys NEVER in client bundles
- TypeScript strict — zero `any` types
- All env vars from `lib/config/env.ts`

### Models
- Primary: `claude-sonnet-4-20250514`
- RAG resolver: `claude-haiku-4-5-20251001`
- Never any other model

---

## 11. WHAT TO SAY IN THE NEW CHAT

When starting the new chat, brief Claude with:

> "I'm continuing work on Simplify IS — an AI-driven security assessment platform. I'm uploading my project knowledge files including:
>
> - SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md (all locked design decisions)
> - 10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md + Claude Code spec
> - 11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md + Claude Code spec
> - This chat continuity summary
>
> Agent 10 is built. Agent 11 spec is ready to run. Agent 15 (Tech Stack Discovery) is running in parallel.
>
> Next step: Agent 12 (API wiring + state management). When ready, ask me one question at a time to plan it.
>
> Critical reminders: Australian English everywhere. Agent name displays as `🤖 {name}` prefix. Desktop first, tablet/mobile secondary. Three-layer architecture inviolable."

That gives the new chat enough context to pick up exactly where we left off without re-litigating decisions already locked.

---

## 12. KEY FILES INVENTORY (For New Chat Upload)

Upload these files to project knowledge in the new chat:

**Master reference:**
- `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`

**Agent 10:**
- `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`
- `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`
- `HANDOFF_10_POSTLOGIN_CURSOR.md` (Cursor's actual output)

**Agent 11:**
- `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`
- `11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`

**Agent 15 (when complete):**
- `15_AGENT_FEATURE_TechStack_Discovery_*.md`
- `HANDOFF_15_*.md`

**This file:**
- `CHAT_CONTINUITY_SUMMARY.md`

**Foundation (for context):**
- `01_MASTER_CONTEXT.md`
- `02_ROADMAP_STRATEGY.md`
- `03_AGENTS_AND_HANDOFFS.md`
- `04_DESIGN_SYSTEM.md`

---

*This file captures the context, philosophy, process decisions, and forward-looking concerns that don't fit cleanly into agent specs. Use it to bridge chats without losing institutional memory.*

*Last updated: April 2026*
