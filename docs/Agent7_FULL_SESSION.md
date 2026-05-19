# Simplify IS — Full Chat Context for New Session
## Agent 7 Planning: Complete Handoff Document

> **How to use this file:**
> Upload this to a new Claude chat inside the Simplify IS project.
> Say: *"Read this context file fully. You are the Architect and Product Manager for Simplify IS. When ready, continue from where we left off — ask me the open questions one by one so we can lock the Agent 7 spec."*
>
> **Date of original session:** April 2026
> **Participants:** Vik Soni (Product Owner) + Claude (Architect / Product Manager)

---

## YOUR ROLE IN THIS CHAT

You are the **Architect and Product Manager** for Simplify IS. You know this project deeply. You think like a senior product manager — ask precise questions, eliminate ambiguity before build starts, and produce agent specs that Claude Code can execute mechanically with zero confusion.

**Your style:**
- Ask one question at a time, go deep before moving to the next
- Never assume — confirm everything before writing specs
- Spend more time planning so execution is fast and clean
- Always have security reasoning behind every decision

**Two non-negotiables in every decision:**
1. **Pitch-perfect UI/UX** — when someone lands on these pages, the reaction is "how cool is that." No layout jank, no text shifts, no obvious faults. Animations purposeful. Spacing precise. Easy on eyes. People should look at it and think "wow, this is *built*."
2. **Security first, always** — every build decision has security reasoning behind it. At project end, a full **Security Justification Report** will be produced documenting every decision. Build it right now, not patched later. Balance usability and security intelligently — no 40-character passwords, but everything done with security in mind.

---

## PROJECT OVERVIEW — SIMPLIFY IS

**Simplify IS** (simplify.is) is an AI-driven security assessment SaaS.

**What it does:**
- Users interact with **Cypher** — their AI Security Consultant
- Cypher guides users through structured ISO 27001:2022 and NIST CSF 2.0 assessments conversationally
- Does NOT feel like a chatbot or checkbox exercise — feels like a real consultant
- Tracks maturity scores, compliance across frameworks, produces executive reports
- Monthly subscription model

**Key principles:**
- World-class product quality — no shortcuts, no compromises
- Security baked into every architectural decision from day one
- Enterprise-grade from the start

**Base template:** Built on `https://github.com/Razikus/supabase-nextjs-template`

---

## TECHNICAL STACK

| Layer | Technology |
|-------|-----------|
| Frontend + API | Next.js 14 App Router, TypeScript (strict), Tailwind CSS |
| Database + Auth | Supabase (Postgres, RLS, Storage) |
| AI | Claude API — claude-sonnet-4-20250514 (primary), claude-haiku-4-5-20251001 (RAG resolver) |
| Visualization | D3.js (radar chart, timeline), Recharts (sparklines) |
| Animations | Framer Motion |
| Email | Resend |
| Payments | Stripe |
| Deployment | Vercel (MVP) |

---

## DESIGN LANGUAGE — EARTHEN BRUTALISM

The visual identity is **Earthen Brutalism** — a refined dark ops aesthetic. Warm, tactile, authoritative.

### Color Tokens (Dark Mode — Primary)
```css
--color-primary: #EB5E28          /* Terracotta / burnt orange accent */
--color-secondary: #7C3AED        /* Purple accent */
--surface-base: #1A1917           /* Near-black background */
--surface-container-low: #252320  /* Slightly elevated */
--surface-container-high: #2E2B28 /* Cards / panels */
--surface-bright: #3A3530         /* Hover elevated */
--text-primary: #FFFCF2           /* Near-white */
--text-secondary: #E6E2DE         /* Warm off-white */
--text-muted: #CCC5B9             /* Warm grey */
--text-subtle: #A88A80            /* Muted terracotta */
--border-subtle: rgba(168,138,128,0.15)
```

### Typography
- **Headlines:** DM Serif Display (italic for emphasis), Raleway (uppercase, wide tracking)
- **Body:** DM Sans, Montserrat
- **UI Labels:** Josefin Sans (uppercase, wide tracking)
- **Code / Mono:** JetBrains Mono

### Component Patterns (Confirmed from Pages 1–13)
- Buttons: solid fill (primary), ghost (secondary), sharp edges or very subtle radius
- Cards: surface-container-high background, ghost border (border-subtle), hover → surface-bright
- Nav: sticky, backdrop-blur, bottom divider gradient, uppercase tracking
- Section dividers: gradient fade (transparent → accent → transparent)
- Staggered layouts: alternating left/right content blocks
- Number labels: oversized faded background numbers (01, 02, 03)
- Ghost borders on interactive elements — no harsh lines
- Generous whitespace throughout

---

## WHAT HAS BEEN BUILT — AGENTS 1–5

### Agent Naming Convention (Locked Going Forward)
**Format:** `[##]_AGENT_[DOMAIN]_[SPECIFIC_FUNCTION].md`
**Handoff files:** `HANDOFF_[##]_[DOMAIN].md`

| Old Name | New Name | What It Built |
|----------|----------|---------------|
| `01_AGENT_INFRA_AUTH.md` | `01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md` | Next.js 14 scaffold, TypeScript strict, Tailwind, Supabase migrations (11 tables + RLS), env validation (Zod), auth abstraction layer (/lib/auth/), onboarding flow (5-step), .cursorrules, CLAUDE.md |
| `02_AGENT_ORCHESTRATION.md` | `02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md` | Claude API abstraction (8 functions), RAG context builder (3-pass), signal extraction, contradiction detection, maturity scoring (CMMI 1.0–5.0), session state machine, usage monitor (300 calls/month limit), compliance cadence engine, 9 prompt templates, unit tests (80%+ coverage) |
| `03_AGENT_API_LAYER.md` | `03_AGENT_BACKEND_APILayerControlLibraries.md` | 10 API endpoints, security middleware, rate limiting (100 req/min, 1000 req/hr), ISO 27001:2022 control library (93 controls), NIST CSF 2.0 control library (~117 subcategories), PDF export, integration tests |
| `04_AGENT_FRONTEND.md` | `04_AGENT_UIUX_PostLoginDashboardAssessment.md` | Design system, dashboard layout, Cypher chat interface, D3 radar + timeline charts, assessment flow, domain card grid (21 domains), score animations, risk view, compliance calendar, notification system, session timeout handler |
| `05_AGENT_SECURITY_POLISH.md` | `05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md` | Security audit (full checklist), E2E tests (Playwright, 8 scenarios), Stripe integration, email templates (Resend), performance optimisation, pre-launch checklist |

> **Note:** Agent 6 (Multi-User Collaboration — Admin/Assessor/Viewer roles) is post-MVP, deferred until after launch.
> **Note:** Rename guide file created: `AGENT_RENAME_GUIDE.md` — Vik has this locally for renaming files + running terminal commands.

### Architecture Rules (NEVER VIOLATE)
```
Internet → API Layer (/api/v1/*) → Orchestration (/api/internal/*) → Supabase + Claude API
```
1. No direct Supabase calls from frontend components — always through API routes
2. No direct Claude API calls from /api/v1/ routes — always through /api/internal/ orchestration
3. SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, ORCHESTRATION_SECRET: NEVER in NEXT_PUBLIC_ variables
4. All SQL: parameterized queries only — never string interpolation
5. RLS on ALL data tables — org-scoped policies on every table
6. JWT validation on EVERY /api/v1/* route — no exceptions
7. /api/internal/* returns 403 without valid ORCHESTRATION_SECRET header

---

## PLANNED BUILD SEQUENCE (Agents 7 Onwards)

```
[PRE-LOGIN — CURRENT FOCUS]
07_AGENT_UIUX_PreLoginPagesAuthFlow.md
    reads: CLAUDE.md + HANDOFF_1_INFRASTRUCTURE.md + all design files
    writes: HANDOFF_7_PRELOGIN_UIUX.md

08_AGENT_BACKEND_AuthenticationEmailService.md
    reads: HANDOFF_7_PRELOGIN_UIUX.md
    writes: HANDOFF_8_AUTH_BACKEND.md

09_AGENT_INTEGRATION_AuthUIAPIWiring.md
    reads: HANDOFF_7_PRELOGIN_UIUX.md + HANDOFF_8_AUTH_BACKEND.md
    writes: HANDOFF_9_AUTH_INTEGRATION.md

[POST-LOGIN — NEXT PHASE, ~1 WEEK]
10_AGENT_UIUX_PostLoginDashboardCypherChat.md
11_AGENT_UIUX_AssessmentFlowD3Visualizations.md
12_AGENT_BACKEND_AssessmentScoringEngine.md
13_AGENT_INTEGRATION_DashboardAPIWiring.md
14_AGENT_SECURITYQA_FinalAuditLaunchReady.md  → DONE_FINAL.md
```

---

## AGENT 7 SCOPE — LOCKED

**Name:** `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
**Domain:** UI/UX
**Mission:** Build the complete pre-login user experience — from landing page through to MFA confirmation — pitch-perfect, fully responsive (desktop + tablet + mobile), dark and light mode, security-first. No backend wiring — leaves clean stubs for Agent 8.

### Pages Agent 7 Will Build (13 total)

| # | Page | Route | Status |
|---|------|-------|--------|
| 1 | Landing Page | / | Design files ✅ |
| 2 | How It Works | /how-it-works | Design files ✅ |
| 3 | Frameworks | /frameworks | Design files ✅ |
| 4 | Pricing | /pricing | Design files ✅ |
| 5 | Maturity Model | /maturity-model | Design files ✅ |
| 6 | Meet Cypher | /meet-cypher | Design files ✅ |
| 7 | Terms of Service | /terms | Design files ✅ |
| 8 | Privacy Policy | /privacy | Design files ✅ (code file missing — Agent 7 builds from DESIGN.md + screenshot) |
| 9 | Login | /login | Design files ✅ |
| 10 | MFA / 2FA Verification | /login/mfa | Design files ✅ |
| 11 | Signup | /signup | Design files ✅ |
| 12 | Email Verify | /signup/verify | Design files ✅ |
| 13 | 404 Error | /404 | Design files ✅ |

**Still to be built (no design files — Agent 7 builds from design system):**
- Password Reset Request page (/forgot-password)
- Password Reset Form page (/reset-password)
- Contact page (/contact)

### Breakpoints Required
- Desktop (1280px–1920px)
- Tablet (768px–1024px)
- Mobile (375px–480px)

### Themes Required
- Dark mode (primary — default)
- Light mode (full variant)

---

## DESIGN FILES UPLOADED — FULL INVENTORY

### Core Pages (Dark Desktop) — All 13 Present
All 13 pages have HTML code file + DESIGN.md uploaded to the project.
Exception: Page 8 (Privacy Policy) is missing the code.html — DESIGN.md and screenshot present.

### Responsive Variants Uploaded

| Page | Mobile Dark | Tablet Dark | Desktop Light | Mobile Light | Tablet Light |
|------|------------|------------|--------------|-------------|-------------|
| Landing Page | ✅ | ✅ | ✅ (x2 variants) | ✅ | ✅ |
| How It Works | ✅ | ✅ | ✅ (x2 variants) | ✅ | ✅ |
| Frameworks | ✅ | ✅ | ✅ (x2 variants) | ✅ | ✅ |
| Pricing | ✅ | ✅ | ✅ (x2 variants) | ✅ | ✅ |
| Maturity Model | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cypher Intro (Page 6) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login (Page 9) | ⚠️ missing | ✅ | ✅ | ⚠️ missing | ✅ |
| MFA Verification (Page 10) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Signup (Page 11) | ⚠️ missing | ✅ | ⚠️ missing | ⚠️ missing | ✅ |
| Email Verify (Page 12) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Privacy Policy (Page 8) | ✅ | ✅ | ⚠️ missing | ✅ | ✅ |
| Terms of Service (Page 7) | ✅ | ✅ | ⚠️ missing | ✅ | ✅ |
| Unified Signup (alt) | ✅ | ⚠️ missing | ✅ | ✅ | ⚠️ missing |

**Verdict:** Gaps are minor. Agent 7 has enough to extrapolate all missing variants from the design system. No blockers.

---

## DECISIONS ALREADY MADE (DO NOT RE-LITIGATE)

| Topic | Decision | Notes |
|-------|----------|-------|
| Agent 7 scope | Pre-login only (Pages 1–13 + password reset + contact) | Post-login is Agent 10+ |
| Agent 8 scope | Backend auth + email service | No UI work |
| Agent 9 scope | Wiring Agent 7 UI to Agent 8 backend | End-to-end auth working |
| Build approach | Plan thoroughly first, then execute | Spend time on planning, execution is mechanical |
| Post-login screens | Vik designing now, ~1 week | Agent 10 handles dashboard, Cypher chat, D3, assessment, compliance |
| Design tool | Google Stitch → HTML/DESIGN.md files | Uploaded to Claude project as design source |
| Themes | Dark mode primary, light mode full variant | Both required |
| Responsive | Desktop + Tablet + Mobile all required | Agent 7 builds all three |
| Quality bar | Lighthouse ≥90, zero CLS, 60fps animations, no console errors | Non-negotiable |
| Security posture | Security-first in every decision | Justification report at project end |
| Naming convention | `[##]_AGENT_[DOMAIN]_[SPECIFIC_FUNCTION].md` | Locked for Agents 7+ |
| Agent 7 backend wiring | None — stubs only | Agent 8 fills in real API calls |
| Framework — routing | Pages are Next.js App Router routes | Not standalone static HTML |
| Mobile version | Vik doing mobile in Google Stitch | Web version is priority for Agent 7 |

---

## OPEN QUESTIONS — MUST ANSWER BEFORE AGENT 7 SPEC IS LOCKED

Work through these **one at a time** in the new chat. Do NOT rush. Each answer shapes the spec.

### GROUP 1 — AUTH FLOW (Critical — affects page design)

**Q1:** After clicking the email verification link — does the user get auto-logged in and redirected to /onboarding? Or do they land on a "verified successfully" screen and then must log in manually?

**Q2:** Password reset flow — after user submits new password, do they get auto-logged in and redirected to dashboard? Or redirected to /login with a success message to log in manually?

**Q3:** Session handling — is there a "Remember me" checkbox on the login page? If yes, what's the session duration (7 days? 30 days?)? If no, what's the default session timeout?

**Q4:** If a user tries to sign up with an email that already exists — show inline error on the form ("An account with this email already exists. Log in instead?") or redirect to an error page?

**Q5:** MFA code entry — does it auto-submit when the 6th digit is entered? Or does the user press a confirm button?

**Q6:** MFA backup codes — are these shown at signup (one-time view, downloadable PDF)? Or is MFA setup post-login in account settings?

**Q7:** After too many failed MFA attempts — what happens? Lock the account for N minutes? Show a "too many attempts" screen? How many attempts before lockout?

**Q8:** After successful MFA — redirect to /dashboard directly? Or /onboarding if it's the user's first login?

### GROUP 2 — NAVIGATION & ROUTING

**Q9:** Top nav links (How it works, Frameworks, Pricing) — are these separate routes (/how-it-works, /frameworks, /pricing) or anchor links on the same page (#how-it-works)?

**Q10:** "Get Started" / "Book a Demo" / "Consult an Expert" CTAs — where do these go? Directly to /signup? Open a modal first? Link to external Calendly?

**Q11:** Login — is it a dedicated page (/login) or a modal overlay that appears on top of whatever page the user is on?

**Q12:** After logout — redirect to / (landing page) or /login?

### GROUP 3 — FORMS & VALIDATION

**Q13:** Signup form fields — confirm the exact fields required: email, password, confirm password, full name, organisation name — anything else? Company size? Industry?

**Q14:** Password strength requirements — minimum length? Must include uppercase + number + symbol? Or just minimum 8 characters?

**Q15:** Form validation timing — inline real-time validation as user types (show error immediately when field loses focus), or validate only on submit?

**Q16:** After signup form submitted — does the user see a "Check your email" holding screen, or do they get redirected somewhere immediately?

### GROUP 4 — CONTENT & COPY

**Q17:** Is all copy on Pages 1–13 final and locked, or still being refined? (Affects whether Agent 7 uses it verbatim or treats it as placeholder)

**Q18:** Hero images and mockup screenshots in the landing page — are these static assets Vik will provide as files, or should Agent 7 use placeholder images (e.g., blurred/generated)?

**Q19:** "Founder Pricing" banner on the Pricing page — is this permanent, or a time-limited feature that needs a toggle to hide/show?

### GROUP 5 — DESIGN SYSTEM DETAILS

**Q20:** Dark mode / light mode toggle — is it visible on the pre-login pages (e.g., top-right corner toggle)? Or is it only available in account settings post-login?

**Q21:** Light mode color mapping — is there a formal light palette document, or should Agent 7 infer purely from the light mode HTML files uploaded?

**Q22:** Animation preferences — which of these are wanted for pre-login pages?
- Scroll-triggered fade-ins on sections as they enter viewport?
- Parallax effects on hero background?
- Page transition animations (fade between pages)?
- Micro-interactions on buttons (hover glow, active scale)?

### GROUP 6 — TECHNICAL & SEO

**Q23:** SEO requirements for MVP — Open Graph tags, meta descriptions, structured data (JSON-LD), sitemap.xml? Or minimal SEO for now?

**Q24:** Analytics — do CTA button clicks need event tracking (GTM / Mixpanel / Posthog) wired up in Agent 7? Or just stub the events?

**Q25:** Browser support target — latest 2 versions of Chrome, Firefox, Safari, Edge? Anything specific to exclude or prioritise?

---

## AGENT 7 DEFINITION OF DONE (Pre-Agreed)

Agent 7 spec will be locked only when all 25 questions above are answered.

Agent 7 is complete when:
- [ ] All 13 core pages built + password reset + contact (16 pages total)
- [ ] All three breakpoints working (desktop, tablet, mobile)
- [ ] Dark mode and light mode both fully implemented
- [ ] Lighthouse score ≥ 90 (performance, accessibility, best practices, SEO)
- [ ] Zero console errors or warnings
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1
- [ ] All animations smooth (60fps)
- [ ] All interactive elements have hover, focus, and active states
- [ ] All form inputs have validation states (default, focus, error, success)
- [ ] All buttons have loading states (spinner + disabled)
- [ ] Error messages are generic — no data leakage ("Invalid credentials" not "Email not found")
- [ ] No secrets, API keys, or internal routes in any client file
- [ ] Form handlers stubbed — no real API calls yet (Agent 8 wires those)
- [ ] `HANDOFF_7_PRELOGIN_UIUX.md` written with every component documented

---

## SECURITY REQUIREMENTS FOR AGENT 7 (UI Layer)

These are non-negotiable and must be explicitly called out in the Agent 7 spec:

- Form inputs: protected against XSS via autocomplete or paste injection
- Passwords: never logged, never in query strings, never in localStorage or sessionStorage
- No secrets, API keys, or internal route references in any client-side code or HTML comments
- CSRF tokens: stubbed in forms (Agent 8 wires actual tokens)
- Rate limiting visual cues: button disabled + loading spinner after first click (prevents double-submit and UI hammering)
- Error messages: always generic — never reveal whether an email address exists in the system
- All auth error messages: non-leaking, user-friendly
- Focus states: all interactive elements fully keyboard-accessible
- Reduced motion: `prefers-reduced-motion` media query respected on all animations
- WCAG AA contrast ratios on all text in both dark and light mode
- ARIA labels on all interactive elements
- No sensitive data exposed in page source comments

---

## POST-LOGIN PHASE (Agent 10 Onwards — Not Yet Started)

Vik is currently designing the post-login experience in Google Stitch. Expected timeline: ~1 week.

**Screens that will be needed for Agent 10+:**
- Dashboard (main landing after login)
- Cypher chat interface
- Assessment flow (domain selection, question/answer, completion)
- D3 radar chart (maturity visualization)
- D3 score timeline
- Domain card grid (21 domains)
- Score cards with animations
- Risk view
- Compliance calendar
- Team management (post-MVP)
- Account settings
- Billing / subscription management

Once Vik uploads these designs in the same format (HTML + DESIGN.md per screen), a new planning session will happen to lock Agent 10 spec — same process as Agent 7.

---

## FILES CREATED IN THIS SESSION (Available to Download)

1. **`AGENT_RENAME_GUIDE.md`** — Complete rename mapping for Agents 1–5, terminal commands to run locally, CLAUDE.md update instructions, updated build sequence
2. **`CHAT_CONTEXT_Agent7_UIUXPlanning.md`** — Earlier version of chat context (superseded by this file)
3. **`CHAT_CONTEXT_Agent7_FULL_SESSION.md`** — This file (most complete, use this one)

---

## QUICK REFERENCE — FILE NAMING IN PROJECT

```
/project/
├── 00_WAR_ROOM.md                                    → rename to 00_WAR_ROOM_MasterOrchestration.md
├── 01_AGENT_INFRA_AUTH.md                            → rename per AGENT_RENAME_GUIDE.md
├── 02_AGENT_ORCHESTRATION.md                         → rename per AGENT_RENAME_GUIDE.md
├── 03_AGENT_API_LAYER.md                             → rename per AGENT_RENAME_GUIDE.md
├── 04_AGENT_FRONTEND.md                              → rename per AGENT_RENAME_GUIDE.md
├── 05_AGENT_SECURITY_POLISH.md                       → rename per AGENT_RENAME_GUIDE.md
├── CLAUDE.md                                         → stays as-is, update agent references inside
├── SIMPLIFY_IS_MASTER_SPEC.md                        → stays as-is
├── Page_1 through Page_13 (code + DESIGN.md files)  → design source for Agent 7
├── [page]_mobile/tablet/light_mode-code.html files  → responsive design source for Agent 7
└── [to be created] 07_AGENT_UIUX_PreLoginPagesAuthFlow.md
```

---

*Document created: April 2026*
*Simplify IS — Vik Soni (Product Owner) + Claude (Architect / Product Manager)*
*This file is the single source of truth for continuing the Agent 7 planning session.*
