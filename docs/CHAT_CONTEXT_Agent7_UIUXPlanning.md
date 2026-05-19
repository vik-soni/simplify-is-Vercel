# Simplify IS — Chat Context: Agent 7 Planning Session
## Use this file to initialise a new chat for Agent 7 build

> **Purpose:** This document captures all decisions, agreements, and outstanding questions from the Agent 7 planning session. Paste this into a new Claude chat to continue without re-explaining context.
> **Date of conversation:** April 2026
> **Participants:** Vik Soni (Product Owner) + Claude (Architect / Product Manager)

---

## WHO YOU ARE IN THIS CHAT

You are the **Architect and Product Manager** for Simplify IS. You know this project deeply. You ask precise questions, eliminate ambiguity before build starts, and produce agent specs that Claude Code can execute mechanically with zero confusion.

Your two non-negotiables in every decision:
1. **Pitch-perfect UI/UX** — when someone lands on these pages, the reaction is "how cool is that." No layout jank, no text shifts, no obvious faults. Animations purposeful. Spacing precise. Easy on eyes.
2. **Security first, always** — every build decision has security reasoning behind it. At project end, a full security justification report will be produced documenting every decision. Build it right now, not patched later.

---

## PROJECT OVERVIEW

**Simplify IS** (simplify.is) is an AI-driven security assessment SaaS.

- **Cypher** is the AI security consultant agent — guides users through ISO 27001:2022 and NIST CSF 2.0 assessments conversationally
- **Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Supabase (Postgres + Auth + RLS), Claude API, D3.js, Framer Motion, Stripe, Resend
- **Design language:** Earthen Brutalism — dark ops aesthetic, DM Serif Display headlines, DM Sans body, JetBrains Mono code, warm terracotta accents (#EB5E28), generous spacing, ghost borders, purposeful animations
- **Base template:** Built on `https://github.com/Razikus/supabase-nextjs-template`

---

## WHAT HAS BEEN BUILT (Agents 1–5)

| Agent | New Name | What It Built |
|-------|----------|---------------|
| Agent 1 | `01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md` | Next.js scaffold, Supabase migrations (11 tables), auth abstraction layer, onboarding flow, .cursorrules, CLAUDE.md |
| Agent 2 | `02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md` | Claude orchestration layer, RAG context builder, signal extraction, maturity scoring engine, session state machine, usage monitor, compliance cadence, 9 prompt templates |
| Agent 3 | `03_AGENT_BACKEND_APILayerControlLibraries.md` | 10 API endpoints, security middleware, ISO 27001:2022 control library, NIST CSF 2.0 control library, rate limiting, PDF export |
| Agent 4 | `04_AGENT_UIUX_PostLoginDashboardAssessment.md` | Dashboard layout, Cypher chat interface, D3 radar + timeline charts, assessment flow, domain card grid, score animations, risk view, compliance calendar |
| Agent 5 | `05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md` | Security audit, E2E tests (Playwright), Stripe integration, email templates (Resend), performance optimisation, pre-launch checklist |

> **Note:** Agent 6 (Multi-User Collaboration) is post-MVP and deferred. Agents 7+ resume the pre-login experience.

---

## AGENT NAMING CONVENTION (Locked Going Forward)

**Format:** `[##]_AGENT_[DOMAIN]_[SPECIFIC_FUNCTION].md`

**Handoff files:** `HANDOFF_[##]_[DOMAIN].md`

---

## PLANNED BUILD SEQUENCE (Agents 7 Onwards)

```
07_AGENT_UIUX_PreLoginPagesAuthFlow.md
    → HANDOFF_7_PRELOGIN_UIUX.md

08_AGENT_BACKEND_AuthenticationEmailService.md
    → HANDOFF_8_AUTH_BACKEND.md

09_AGENT_INTEGRATION_AuthUIAPIWiring.md
    → HANDOFF_9_AUTH_INTEGRATION.md

10_AGENT_UIUX_PostLoginDashboardCypherChat.md
    → HANDOFF_10_DASHBOARD_UIUX.md

11_AGENT_UIUX_AssessmentFlowD3Visualizations.md
    → HANDOFF_11_ASSESSMENT_UIUX.md

12_AGENT_BACKEND_AssessmentScoringEngine.md
    → HANDOFF_12_ASSESSMENT_BACKEND.md

13_AGENT_INTEGRATION_DashboardAPIWiring.md
    → HANDOFF_13_DASHBOARD_INTEGRATION.md

14_AGENT_SECURITYQA_FinalAuditLaunchReady.md
    → DONE_FINAL.md
```

---

## AGENT 7 SCOPE — LOCKED

**Name:** `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`

**Mission:** Build the complete pre-login user experience — from landing page through to MFA confirmation — pitch-perfect, fully responsive, dark and light mode, security-first.

### Pages Agent 7 Will Build

**Pre-Login Marketing Pages:**
1. Landing Page (Page 1)
2. How It Works (Page 2)
3. Frameworks (Page 3)
4. Pricing (Page 4)
5. Maturity Model (Page 5)
6. Contact Page
7. Privacy Policy Page
8. Terms of Service Page
9. 404 Error Page

**Auth Flow Pages:**
10. Login Page
11. Signup Page
12. Verify Email Page
13. Password Reset Page
14. Password Reset Success / Confirmation Page
15. MFA / 2FA Code Entry Page
16. MFA Success / Redirect Page

**Breakpoints:**
- Desktop (1920px / 1440px / 1280px)
- Tablet (768px–1024px)
- Mobile (375px–480px)

**Themes:**
- Dark mode (primary)
- Light mode (full variant)

**Agent 7 does NOT wire to backend.** It leaves clean hooks (form handlers, API call stubs) for Agent 8 to fill in.

---

## AGENT 8 SCOPE (Next Phase — After Agent 7)

**Name:** `08_AGENT_BACKEND_AuthenticationEmailService.md`

**Mission:** Build all backend auth logic — Supabase auth routes, email verification, password reset, MFA setup, session handling, email templates via Resend.

---

## AGENT 9 SCOPE (After Agents 7 + 8)

**Name:** `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`

**Mission:** Wire Agent 7 UI pages to Agent 8 backend routes. End-to-end auth flow works: signup → verify → login → MFA → dashboard redirect.

---

## POST-LOGIN SCREENS (Deferred — Agent 10+)

Vik will design post-login screens (dashboard, Cypher chat, assessment flow, D3 visualizations, score cards, team management, compliance tracking) over the next ~1 week. Once ready, they will be uploaded and Agent 10 will handle that layer.

---

## DESIGN FILES STATUS

### Already Uploaded to Project (Pages 1–5, Dark Mode, Desktop)
- ✅ Page 1 — Landing Page (`Page_1_-_Landing_Page_-_web_dark_-_code.html` + DESIGN.md)
- ✅ Page 2 — How It Works (`Page_2_-_How_it_works_-_web_dark_-_code.html` + DESIGN.md)
- ✅ Page 3 — Frameworks (`Page_3_-_Frameworks_-_web_dark_-_code.html` + DESIGN.md)
- ✅ Page 4 — Pricing (`Page_4_-_Pricing_-_web_dark_-_code.html` + DESIGN.md)
- ✅ Page 5 — Maturity Model (`Page_5_-_Maturity_Model_-_web_dark_-_code.html` + DESIGN.md)
- ✅ Multiple mobile/tablet/light mode variants uploaded for Pages 1–5

### Still To Be Uploaded by Vik (Before Agent 7 Spec Is Locked)

**Must-Have:**
- [ ] Login Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Signup Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Verify Email Page — Desktop / Tablet / Mobile — Dark / Light *(new — not yet designed)*
- [ ] Password Reset Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Password Reset Success Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] MFA / 2FA Code Entry Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] MFA Success / Redirect Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] 404 Error Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Contact Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Privacy Policy Page — Desktop / Tablet / Mobile — Dark / Light
- [ ] Terms of Service Page — Desktop / Tablet / Mobile — Dark / Light

**File format per page (same as Pages 1–5):**
1. `[PageName]-code.html` — Full working HTML + Tailwind + inline styles
2. `[PageName]-DESIGN.md` — Design tokens, typography, component specs, interaction notes
3. Screenshot / annotated image (optional but helpful)

---

## DECISIONS ALREADY MADE

| Topic | Decision |
|-------|----------|
| Agent 7 scope | Pre-login pages (landing → MFA) only. Post-login is Agent 10. |
| Agent 8 scope | Backend auth + email service only. |
| Agent 9 scope | Wiring Agent 7 UI to Agent 8 backend. |
| Build approach | Option B (Collaborative) — plan thoroughly now, Agents 7+8 execute in parallel, Agent 9 wires. |
| Design tool | Google Stitch (Vik designs) → HTML/DESIGN.md files (uploaded to Claude project) |
| Theme | Dark mode primary, light mode full variant required |
| Responsive | Desktop + Tablet + Mobile all required for Agent 7 |
| Post-login screens | Vik designing now, ~1 week timeline, will be Agent 10+ |
| Naming convention | `[##]_AGENT_[DOMAIN]_[SPECIFIC_FUNCTION].md` locked going forward |
| Quality bar | Pitch-perfect. Lighthouse ≥90. Zero layout shift. 60fps animations. No console errors. |
| Security posture | Security-first in every decision. Justification report produced at project end. |

---

## QUESTIONS STILL OPEN (Must Answer Before Agent 7 Spec Is Locked)

When Vik uploads the remaining design files, work through these questions one by one:

### AUTH FLOW
- **Q1:** Verification flow — email link → auto-logged in + redirect to /onboarding? Or email link → /verify-success screen → user must login manually?
- **Q2:** Password reset — email link → /reset-password form → success → redirect to /login? Or auto-login after reset?
- **Q3:** Session handling — "remember me" checkbox? Or always require login each session?
- **Q4:** Error states — if signup email already exists, show error inline on form? Or redirect to error page?
- **Q5:** MFA — 6-digit code entry? Auto-submit on 6th digit, or requires button press?
- **Q6:** MFA — Backup codes shown at signup? Downloadable PDF?
- **Q7:** MFA — Lock after N failed attempts? How many? What does lockout screen look like?
- **Q8:** After MFA success — redirect to /dashboard directly? Or to /onboarding if first login?

### NAVIGATION & ROUTING
- **Q9:** Top nav links (How it works, Frameworks, Pricing) — anchor links on same page, or separate routes (/how-it-works, /frameworks, /pricing)?
- **Q10:** "Book a Demo" / "Get Started" CTAs — route to /signup directly? Open modal first? Link to Calendly?
- **Q11:** Login — dedicated page (/login) or modal overlay on top of current page?

### CONTENT & COPY
- **Q12:** Is all copy on Pages 1–5 final and locked, or still being iterated?
- **Q13:** Hero images / mockup screenshots — are these static assets Vik will provide, or should Agent 7 use placeholder images?
- **Q14:** "Founder Pricing" banner on Page 4 — permanent feature or time-limited toggle?

### DESIGN SYSTEM
- **Q15:** Dark mode toggle — visible on pre-login pages? Top-right corner? Or settings page only?
- **Q16:** Light mode color mapping — is there a formal color palette document, or does Agent 7 infer from the light mode HTML files?
- **Q17:** Animation preferences — scroll-triggered fade-ins? Parallax? Page transitions (fade, slide, none)?

### TECHNICAL
- **Q18:** Framework — Next.js 14 App Router pages (integrated into main codebase), or standalone static HTML?
- **Q19:** SEO — Open Graph tags, structured data, meta descriptions required for MVP?
- **Q20:** Analytics — GTM or Mixpanel event hooks on CTA clicks required for MVP?
- **Q21:** Browser support target — latest 2 versions of all major browsers?
- **Q22:** Accessibility beyond WCAG AA — any color-blind specific requirements? Font scaling?

### FORMS
- **Q23:** Signup form fields — email, password, confirm password, full name, organisation name? Anything else?
- **Q24:** Password strength requirements — minimum length? Must include uppercase/number/symbol?
- **Q25:** Form validation — inline real-time validation as user types, or on submit only?

---

## DESIGN SYSTEM REFERENCE (From Pages 1–5)

### Color Tokens (Dark Mode — Confirmed)
```css
--color-primary: #EB5E28          /* Terracotta accent */
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

### Typography (Confirmed)
- **Headlines:** DM Serif Display (italic for emphasis), Raleway (uppercase, tracking)
- **Body:** DM Sans, Montserrat
- **UI Labels:** Josefin Sans (uppercase, wide tracking)
- **Code/Mono:** JetBrains Mono

### Component Patterns (Confirmed from Pages 1–5)
- Buttons: solid fill (primary), ghost (secondary), no border-radius or very subtle
- Cards: surface-container-high background, ghost border, hover → surface-bright
- Nav: sticky, backdrop-blur, bottom divider gradient
- Section dividers: gradient fade (transparent → accent → transparent)
- Staggered layouts: alternating left/right content blocks
- Number labels: oversized faded background numbers (01, 02, 03)

---

## SECURITY REQUIREMENTS FOR AGENT 7 (UI Layer)

- Form inputs: no XSS via autocomplete or paste (sanitized)
- Passwords: never logged, never in query strings, never in localStorage
- No secrets, API keys, or internal routes referenced in client-side code or HTML comments
- CSRF tokens: stubbed in forms (Agent 8 wires actual tokens)
- Rate limiting visual cues: button disabled + spinner after first click (prevents hammering)
- Error messages: never reveal whether email exists ("Invalid credentials" not "Email not found")
- All auth error messages: generic, non-leaking
- Focus states: all interactive elements keyboard-accessible
- Reduced motion: `prefers-reduced-motion` media query respected on all animations

---

## DEFINITION OF DONE — AGENT 7

Agent 7 is complete when:
- [ ] All 16 pages listed above are built
- [ ] All three breakpoints work (desktop, tablet, mobile)
- [ ] Dark mode and light mode both fully implemented
- [ ] Lighthouse score ≥ 90 (performance, accessibility, best practices, SEO)
- [ ] Zero console errors or warnings
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1
- [ ] All animations run at 60fps
- [ ] All interactive elements have hover, focus, and active states
- [ ] All form inputs have validation states (default, focus, error, success)
- [ ] All buttons have loading states (spinner, disabled)
- [ ] Error messages are generic (no data leakage)
- [ ] No secrets, API keys, or internal routes in any client file
- [ ] Form handlers are stubbed (no real API calls yet — Agent 8 wires those)
- [ ] `HANDOFF_7_PRELOGIN_UIUX.md` is written with every component documented

---

## HOW TO USE THIS FILE

1. **Start a new Claude chat** in the Simplify IS project
2. **Paste this entire document** as your first message (or upload it)
3. Say: *"Read this context file. When ready, ask me the open questions one by one so we can lock the Agent 7 spec."*
4. **Answer each question.** Claude will synthesise your answers into a complete, bulletproof Agent 7 instruction file.
5. **Once all questions are answered + design files are uploaded**, Claude will produce `07_AGENT_UIUX_PreLoginPagesAuthFlow.md` ready for Claude Code execution.

---

*Document created: April 2026*
*Simplify IS — Vik Soni (Product Owner) + Claude (Architect)*
