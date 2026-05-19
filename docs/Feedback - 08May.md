# Simplify IS Website Feedback - Action Tracker (08 May)

Use this file as the working checklist for implementation and QA.  
Legend: `[ ]` not started, `[~]` in progress, `[x]` complete, `[-]` deferred/question.

## 1) Onboarding UX

- [x] Step 2 (Organisation): move selected country chips so they are always visible while typing, not hidden under dropdown results.
- [x] Step 3 (Choose Frameworks): show clear plan-state indicator:
  - [x] Essential: cannot select additional frameworks here.
  - [x] Professional: can select 3 additional frameworks + NIST CSF 2.0.
- [x] Keep existing "Need more frameworks?" post-login billing guidance where relevant.
- [x] Orientation (Step 4): replace "risk view" wording with "threat" terminology.
- [x] Orientation (Step 4): make agent name callout visually distinct (badge/box/icon treatment), not buried in sentence text.

## 2) Initialisation Complete / "Where would you like to start?"

- [x] Remove scrollbar from initialisation completion modal/card (resize/reflow text/layout).
- [x] Reword tech stack discovery description:
  - [x] Use agent's chosen name (fallback "Cypher" only if not renamed).
  - [x] Clarify objective: cloud hosting, backups, key vendors, and infrastructure posture discovery.
- [x] Begin Assessment copy: include agent name callout (same visual style as above).
- [x] Remove "consult/map industry risk" wording and replace with threat-oriented wording.
- [x] Ensure destination links:
  - [x] Team action routes to organisation/team members.
  - [x] Begin Assessment routes to assessment flow.

## 3) Core Navigation & Dashboard Information Architecture

- [x] Replace/remove "Risk View" everywhere.
- [x] Dashboard tab order should be:
  - [x] Industry View
  - [x] Framework View
  - [x] Threat Readiness
- [x] Fix "organisation linked to your account" errors where they block discovery/dashboard access.

## 4) Industry View Dashboard UX Polish

- [x] Rename "Maturity Radar" to a better benchmark-oriented title.
- [x] Prevent awkward text wraps where there is enough horizontal space:
  - [x] Data benchmarking consent sentence.
  - [x] NIST sentence under radar panel.
- [x] Center/align page content consistently (reduce left-heavy composition).
- [x] Ask-agent floating button should show agent icon + chosen agent name (fallback only if unnamed).
- [x] Rework tile proportions/layout (current 60/40 + 50/50 feels visually inconsistent).
- [x] Keep "Industry updates" section and improve surrounding layout.

## 5) Threat Readiness View

- [x] Resolve empty-state blocker ("Complete onboarding first"/org linkage issues).
- [x] Seed realistic dummy data for review on target account (`vsoni@outlook.com`).
- [x] Ensure page alignment/width consistency with other dashboard views.

## 6) Framework View & Assessment Engine

- [x] Show only frameworks selected by the user in onboarding (while supporting all 9 definitions).
- [x] Provide unique-but-consistent design per framework view.
- [x] Fix malformed framework labels in assessment routes (e.g. URL encoding artifacts like `%3A`).
- [x] Fix "no questions available" issues where Supabase has questions.
- [x] Ensure all selected framework icons and routes load correctly.
- [x] Ensure every selected framework can run assessment from its mapped question set.
- [x] Confirm answer reuse/cross-mapping across overlapping controls for multi-framework orgs.
- [x] Add "finish now and return later" flow in assessment.

## 7) Assessment Experience Improvements (Interaction Design)

- [x] Reduce question card width (too wide for current text density).
- [x] Explore transitions/animation between questions (optional polish).
- [x] Reduce repetitive answer fatigue:
  - [x] Evaluate slider/tiered response interaction by domain.
  - [x] Evaluate tile/drag-drop categorisation interaction.
  - [x] Keep skip/unsure/discuss-with-agent pathway.
- [x] APRA CPS 234 assessment currently failing: fix end-to-end.
- [x] Validate all 9 frameworks are connected to the correct question sets.

## 8) Cross-Page Layout Consistency

- [x] Standardize content width, spacing, and centering across:
  - [x] dashboard pages
  - [x] assessment pages
  - [x] roadmap pages
  - [x] progress/milestones pages
- [x] Ensure footer width/alignment matches page content width patterns.

## 9) Maturity Roadmap

- [x] Revisit against intended product spec from `docs/2026-05-07/*`.
- [x] Add sufficient meaningful content beyond current minimal tiles.
- [x] Seed dummy roadmap data for target account for visual QA.

## 10) Progress & Milestones

- [x] Fix width/alignment mismatch between top content and footer.
- [x] Rebuild page content based on `docs/2026-05-07/*` intent.
- [x] Seed realistic dummy milestones/progress data for target account.

## 11) Organisation Settings (Information Architecture + Features)

- [x] Move/promote organisation settings entry into left navigation (admin context), not only top-right avatar menu.
- [x] Replace fixed role label behavior:
  - [x] show user name + actual role title (e.g., CISO) where available.
- [x] Build out organisation area to include:
  - [x] Billing
  - [x] Invite team members
  - [x] Framework selection management
  - [x] Framework switching controls
- [x] Enforce framework switching rule:
  - [x] One framework change per calendar month.
  - [x] After change, next change allowed next month (not mid-cycle repeat).
- [x] Current org page only showing users is incomplete; expand to full agreed scope.

## 12) Data Seeding for Review

- [x] Seed substantial dummy data for the target org/account (`vsoni@outlook.com`) across:
  - [x] Industry View
  - [x] Threat Readiness
  - [x] Framework dashboards
  - [x] Maturity Roadmap
  - [x] Progress & Milestones

## Open Questions / Decisions Needed

- [x] Confirm preferred replacement name for "Maturity Radar" (or approve proposal set).
- [x] Confirm whether interaction redesign for assessments (slider vs drag/drop) should be prototyped first or directly implemented.
- [x] Confirm whether "Organisation Settings" should be visible only to admins or visible to all with role-based subsections.

---

## 13) Marketing / Landing — Standards & Positioning (Home)

- [x] **Dialogue, context & continuity (item 2):** Remove APRA call-out; use global / industry-leading framing — ISO, NIST, and **AI governance** (e.g. ISO 42001), not Australia-only frameworks in that hero path.
- [x] **Compliance intelligence — Global standards:** Keep ISO, NIST, PCI DSS; add explicit call-out for **AI-based / AI governance frameworks** where regional frameworks are listed.
- [x] **Regional / industry frameworks block:** Add reference to **AI-based frameworks** (align with product: AI RMF, ISO 42001, etc.).

## 14) Marketing — How it Works

- [x] **Context-mapping box (mid-page, right):** Replace narrow “ISO 27001 in CFS infrastructure risk register” example with copy covering: **selected framework(s)**, **tech stack**, **threat assessment**, **industry / peer context**; mention **security**, **payment**, and **AI** framework families.
- [x] **Core architecture — Cypher score:** **NIST CSF = 1–4** (not 1–5); add **ISO** language (conformity, nonconformity, opportunity for improvement); add **distinct treatment for AI-based frameworks**.
- [x] **First consultation:** Default = **full NIST CSF 2.0** conversational assessment; **ISO, PCI, AI-based frameworks** as **optional** add-ons (copy only — must match product).

## 15) Marketing — Framework Library Page

- [x] Change **“all available now”** → **“available now”** (or equivalent without “all”).
- [x] Add **“Upcoming”** section using **same tile pattern** as shipped frameworks.
- [x] Three **upcoming** tiles (placeholders): **SOC 2**, **ISM** (Australian Government Information Security Manual), **HIPAA** (tune list if legal/comms prefers).

## 16) Marketing — Meet Cypher & Executive Hero

- [x] **Training / knowledge copy:** Broaden beyond ISO 27001 + NIST + CPS 234 to include **payment-related** and **AI / AI governance** standards — one coherent block.
- [x] **“Designed for cyber executives and leaders”:** Full stop after the orange phrase should use **orange** (not white).

## 17) Site Chrome — Footer

- [x] **De-duplicate “Maturity model”:** It appears under **Platform** and **Resources** — keep **one** (prefer **Resources**); remove from the other.

## 18) Contact / Talk to Founder (Modal)

- [x] Add **reason** dropdown for the message (**Pricing**, **Security**, **Frameworks**, **Maturity model**, **Product / capability**, **Privacy**, **Partnership**, **Support**, **Other**) — no separate free-text subject line (**Other** is triaged from the message body).
- [x] **API:** Persist `subject`; `subject_detail` column remains null unless we revive a dedicated field later.

## 19) Legal — Privacy Policy

- [x] Fix typo **“condolation”** → intended term (e.g. **consultation** or **access request** — align with legal review). _(Not present in current `privacy/page.tsx`; no change needed.)_
- [x] Fix **double space** before “form” if present in source. _(Verified single space.)_
- [x] **Response time:** **Acknowledge within three working days**; **fulfil / take substantive action within up to 30 days** where permitted by law (confirmed with product owner May 08).

## 20) Post-Login — Onboarding Must Not Repeat After Complete

- [x] When **`onboarding_completed_at`** is set, returning users go **straight to dashboard** — no repeated full onboarding flow for that org/admin path.
- [ ] Verify **secondary users** / invitees per product spec; document edge cases.

---

## 21) Framework View — Nine Per-Framework Dashboards (research-heavy)

**Goal:** **Tabs for all nine in-product frameworks.** Each tab = **different layout and metrics** appropriate to that standard (not one shared radar for all). **Earthen Brutalism** design language; **dummy data** until Supabase wiring. Framework View tab strip is **not** limited to onboarding `selected_frameworks` — all nine are navigable for every org (assessment scope can still gate depth elsewhere later).

### 21.1 Research & iteration (minimum 7 documented cycles)

- [x] **Iteration 1:** Per-framework desk research; capture in `docs/framework-dashboards/RESEARCH.md`.
- [x] **Iteration 2:** One-page IA (wireframe notes) per framework.
- [x] **Iteration 3:** Implement **NIST CSF 2.0** template in app (first tab).
- [x] **Iteration 4:** **ISO 27001** (conformance %, gaps, NC/OFI, certification readiness).
- [x] **Iteration 5:** **PCI, APRA, ASD, ISO 42001, AUVA, NIST AI RMF** — distinct widgets per standard.
- [x] **Iteration 6:** Cross-framework **design-language** pass (tokens, spacing, type).
- [x] **Iteration 7:** Content density + accessibility review.
- [x] **Iterations 8–10:** Self/stakeholder review loops; refine copy and charts. _(See iteration table in RESEARCH.md; ongoing with live data.)_

### 21.2 NIST CSF 2.0 tab (required widgets)

- [x] **Leading vs lagging** functions/categories (clear visual distinction).
- [x] **Scores** + **top five** by maturity.
- [x] **Peer / cohort** context (“vs typical”).
- [x] **Time range:** **month / quarter / year** selector for movement / narrative.
- [x] Additional NIST-native widgets justified in research notes.

### 21.3 Other frameworks — distinct presentation (dummy data OK)

- [x] **PCI DSS 4.0**, **APRA CPS 234/230**, **ASD Essential Eight**, **ISO 42001**, **AUVA ISS**, **NIST AI RMF** — **no clone** of NIST layout; cite research in docs.

### 21.4 Engineering

- [x] Tab strip keyed by **framework id**; lazy-load heavy charts.
- [x] `docs/framework-dashboards/README.md` — links research, iterations, component map.

## 22) Maturity Roadmap — Spec-Aligned, High-Impact UI + Actions

- [ ] Re-read `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`, `docs/SOURCE_OF_TRUTH.md`, relevant `agents/*`; capture intended **purpose** in `docs/roadmap/INTENT.md`.
- [ ] **Research** reference UIs; **rebuild** page — visually strong, rich **dummy data**.
- [ ] **In-app actions:** Mark items **done** from roadmap; **persist** state; **backflow** design to assessment / controls (implement API or document contract + stub).

## 23) Progress & Milestones — Spec-Aligned, High-Impact UI + Actions

- [ ] Same intent pass as §22 for **Progress & Milestones**.
- [ ] **Wow-factor** layout + **dummy data**.
- [ ] **Actionable milestones** with **completion** UX and **sync** plan to underlying model / assessment.

## 24) Organisation — Primary Left-Nav Block (Admin)

- [ ] **Left sidebar** section **above** user footer chip: label **Organisation** (admin-only); not only avatar menu.
- [ ] **Subsections:** **Team / invites**, **Audit trail**, **Billing**, **Frameworks** (add/change within product rules).
- [ ] **Pattern:** Choose **full-page hub** vs **settings layout** vs **modal** — document in checklist + short `docs/` note once decided.
- [ ] Align labels and routes with **`agents/`** + **`docs/`** org IA specs.
