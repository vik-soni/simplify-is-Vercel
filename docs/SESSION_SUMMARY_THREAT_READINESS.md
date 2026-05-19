# Simplify IS — Session Summary
## Threat Readiness + Tech Stack Discovery Design Session
### May 2026 | For carry-over to next chat

> **Purpose:** Capture context, decisions, and rationale from this design session that are NOT already inside `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`, `THREAT_READINESS_ARCHITECTURE.md`, or `THREAT_READINESS_PROMPTS.md`. Upload those three files PLUS this summary to the next project chat.

---

## 1. WHAT THIS SESSION PRODUCED

Three files (uploaded separately to the project):
- `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md` — Cursor agent build spec
- `THREAT_READINESS_ARCHITECTURE.md` — full architectural blueprint
- `THREAT_READINESS_PROMPTS.md` — three production prompts (discovery, extraction, generation)

This file captures everything else — the journey to those decisions, what was rejected, and what's still open.

---

## 2. THE BIG REFRAME (Why This Feature Exists The Way It Does)

The third dashboard tab started as "Risk View" in earlier specs. Through this session it transformed substantially:

**From:** A library of pre-built risks where users tick which apply to them, mapping to controls.
**To:** A dynamic, scenario-based readiness view generated from their actual tech stack, control scores, and industry — with admin-curatable threat narratives.

**Key reframe:** This is NOT risk assessment. We deliberately do NOT do likelihood × impact, NOT a 5×5 matrix, NOT formal risk scoring. We answer: *"Given your specific setup and how you've scored your controls, what scenarios should you be ready for?"*

Why this matters: every organisation defines impact and likelihood differently. Rather than force a generic risk taxonomy, we let the readiness narrative emerge from concrete inputs (tech, scores, industry) and let the admin curate it.

---

## 3. KEY ALTERNATIVES CONSIDERED AND REJECTED

These rejected approaches matter — they help future-you avoid re-opening these debates:

| Considered | Rejected because |
|------------|------------------|
| Pre-built risk library, user picks from list | Doesn't add real value over the framework view — most risks map to the same 20–25 controls. Becomes a UI wrapper, not a feature. |
| Calling them "Security Events" | Too clinical, doesn't fit the warmer Cypher tone |
| Calling them "Security Concerns" or "Preparedness Areas" | Too vague |
| Calling them "Threat Scenarios" | We landed on "Threats" — same idea, tighter phrasing |
| Risk view available pre-assessment with generic content | Two views (generic + personalised) too much complexity. One view, gated behind tech stack + ≥10% assessment, single empty state with CTA. |
| Dynamic generation of framework assessment questions based on tech stack | Can't validate, can't score, can't let users edit. Static questions stay; tech stack only shapes Cypher's *follow-up phrasing depth*, not the question itself. |
| Pre-built threat × tech-stack permutation matrix | Too rigid, too much pre-build work. Claude generates on the fly with structured inputs. |
| Re-running discovery every reassessment | Annoying for admins who've customised the view. Discovery is a one-time event; admins edit the table afterwards. |
| Storing generated threats permanently | Goes stale. Replaced with on-demand generation + 24h cache. |
| Regenerating threats every page load | Too expensive. 24h cache + manual refresh button. |
| Five priority controls always (started at three) | Three felt too few. Settled on five. |
| Mobile/tablet support for threat readiness | Deferred to post-MVP. Desktop-first. |
| Industry-specific discovery prompts | Universal prompt for MVP. Industry-specific tuning is post-MVP. |

---

## 4. NAMING DECISIONS LOCKED

- The view is called **"Threat Readiness"** in UI copy
- The conversational data-gathering flow is called **"Tech Stack Discovery"**
- The settings page is called **"Tech Stack Profile"**
- The 5 priority controls are called **"Key Levers"** in the UI (per the design language — they're the levers that move multiple threats)
- Severity tiers in UI: **"High priority for your setup"** / **"Medium priority"** / **"Lower priority — keep an eye on this"**
- Never use the word **"Risk"** in user-facing copy for this feature
- Never use the word **"Maturity"** in user-facing copy (existing rule, applies here too)

---

## 5. ORG ROLES AND PERMISSIONS — DECISIONS

Inherited from existing Agent 6 spec, applied to this feature:

| Action | Admin | Assessor | Viewer |
|--------|-------|----------|--------|
| Run Tech Stack Discovery | ✅ | ❌ | ❌ |
| Edit Tech Stack Profile | ✅ | ❌ | ❌ |
| View Threat Readiness | ✅ | ✅ | ✅ |
| Reorder threats | ✅ | ❌ | ❌ |
| Edit threat headlines | ✅ | ❌ | ❌ |
| Toggle threat applicability | ✅ | ❌ | ❌ |
| Click "Refresh Analysis" | ✅ | ❌ | ❌ |

Customisations are **organisation-scoped** (not per-admin). Whichever admin makes the last edit, that's what the whole org sees. Audit trail captures who edited what (uses existing audit_log infrastructure from Agent 1).

---

## 6. ONBOARDING FLOW DECISION (Pending Confirmation)

Two options were on the table. The agent spec went with Option B but this needs confirmation:

**Option A:** Keep onboarding at 4 steps, add a CTA on the Portal Orientation screen ("Want me to learn about your setup before you launch?" with two buttons — Start Discovery / Launch Application). Discovery is post-onboarding.

**Option B (chosen in spec):** Extend onboarding to 5 steps. Step 5 is "Tech Stack Discovery" with Skip / Start buttons. Progress indicator updates from `04 / 04` to `04 / 05` etc.

Open question for next session: **Confirm A or B before Cursor runs the build.** B is cleaner UX but updates more existing code (progress indicators on all 4 onboarding screens).

---

## 7. EFFORT & TIMELINE ESTIMATE (For This Feature)

| Activity | Time |
|----------|------|
| Session design (this session) | ~9 hours of conversation, complete |
| Cursor agent run (write all files, run migrations, wire UI) | ~2–3 days of agent work |
| Manual smoke-test of 3 prompts across diverse industries | ~3 hours |
| Prompt V1.1 iteration based on smoke tests | ~3–4 hours |
| Total time from "agent runs" to "feature locked" | ~1 week |

Within MVP scope. Doesn't push launch significantly if started promptly.

---

## 8. CLAUDE API COST ESTIMATE FOR THIS FEATURE

Per organisation, lifetime:
- Tech stack discovery: ~10–15 Sonnet calls (one-time)
- Tech stack extraction: 1 Sonnet call (one-time, repeatable on re-run)
- Threat generation: 1 Sonnet call per 24h max

Per organisation, monthly steady-state: ~30 Sonnet calls (mostly threat regenerations from cache expiry + manual refreshes).

Well within the existing 300/month per-user limit.

---

## 9. WHAT WAS NOT DECIDED THIS SESSION

These came up but were deferred:

- **Whether 24h is the right cache TTL.** Could be longer (weekly?) — depends on how often users reassess. Revisit after seeing real usage.
- **Whether trend window is 30 days or configurable.** 30-day delta feels right but worth A/B-testing later.
- **Localisation of discovery prompt.** English only at MVP. Multi-language is post-launch.
- **Whether discovery should support voice input.** Vik already prefers voice transcription — could be a nice touch — but post-MVP.
- **Export of threat readiness view as PDF.** Feels like a natural Phase 1 add (board reporting). Not in MVP.
- **Threats appearing in the existing notification system.** Should an admin get an in-app bell when a new threat emerges from reassessment? Probably yes — but not specced for MVP.

---

## 10. CRITICAL CARRY-OVER CONTEXT FOR NEXT CHAT

### What Vik wants to discuss next session

Ranked by Vik's stated priority:

1. **Backend wiring for the assessment flow itself** — pre-login + post-login pages exist but the actual assessment isn't wired end-to-end yet
2. **Cypher in Teams / Slack** — delivery channel for Cypher (Teams likely first per earlier decisions, given AU enterprise focus)
3. **Other MVP blockers** — Vik flagged "many things still pending" — needs a triage session

### Where the project is right now (May 2026)

- Agents 1–5: ✅ Complete
- Agent 6 (Multi-User Collaboration): Spec ready, deferred to post-MVP
- Agent 7 (Pre-Login Pages): ✅ Built in Cursor + Claude Code
- Agent 8 (Auth Backend): ✅ Built in Cursor
- Agent 9 (Auth UI/API Wiring): Spec ready, ready to run
- Agent 10+ (Post-Login Dashboard): Waiting on Google Stitch designs from Vik
- Agent 15 (this feature — Threat Readiness + Tech Stack Discovery): Spec ready, ready to run after Agent 9

Vik flagged: **"the project is getting delayed and the MVP seems to be slipping the deadline. I was really hoping early May, we'd have a working product."** Today is 7 May 2026. Time pressure is real and should drive decision-making in the next session.

### Vik's working preferences (reinforce in next chat)

- **One question at a time.** Always. Vik will repeat "ask me one question at a time" if you batch.
- **Don't draft things speculatively.** Vik will tell you when to do the heavy lifting; until then, ask clarifying questions.
- **Vik thinks out loud.** Voice transcription means occasional errors, missing words, and topics landing mid-sentence. Interpret intent, not literal text.
- **Vik wants to be challenged.** If you have a better idea, say so. Don't just validate.
- **Cursor = code execution. Claude chat = architecture, decisions, prompt design.** Cursor first; only burn Claude API tokens when Cursor genuinely can't.
- **All deliverables in Markdown.**
- **Vik treats Claude as co-founder-level partner.** Strategic input is welcomed and expected.

---

## 11. INTEGRATION POINTS WITH EXISTING SYSTEM

The Threat Readiness feature plugs into existing infrastructure:

- Uses existing `chat_transcripts` table for discovery conversation storage (with new `phase='tech_stack_discovery'` value)
- Uses existing `maturity_snapshots` table for trend calculations
- Uses existing `domains`, `ft_iso_controls`, `ft_nist_controls` tables for control reference data
- Uses existing scoring engine (Agent 2) — invalidates threat cache on domain completion via existing post-scoring hook
- Uses existing `usageMonitor` (Agent 2) for the 300/month Claude limit
- Uses existing `claudeOrchestrator.ts` (Agent 2) — extended with three new functions, NOT replaced
- Uses existing org-scoped RLS pattern from Agent 1
- Uses existing design system (Agent 4) — Earthen Brutalism tokens, no new design language
- Uses existing CypherChat primitive (Agent 4) for the discovery conversation UI shell
- Uses existing audit_log trigger (Agent 1) for change tracking
- Uses existing React Query + API client pattern (Agent 4) for data fetching

No new infrastructure. Just three new tables and a vertical feature slice.

---

## 12. OPEN ITEMS BEFORE CURSOR RUNS

Confirm these before pressing Go on Agent 15:

- [ ] Onboarding flow: 4 steps with post-step CTA, OR 5 steps (decide A or B from §6)
- [ ] Cache TTL: confirm 24h
- [ ] Drag-to-reorder library: check if `@dnd-kit/core` is already installed; only add if missing
- [ ] Industry list: confirm onboarding industry dropdown values match the list assumed in the threat generation prompt (SaaS, Financial Services, Healthcare, Critical Infrastructure, Retail/E-commerce, Government, Manufacturing, MSP, Other)
- [ ] Confirm: Threat Readiness tab placement in sidebar — between Frameworks and Risks (as specced) or somewhere else
- [ ] Confirm: Tech Stack Profile sidebar nav lives under "Settings" section (admin-only)

---

## 13. WHAT TO DO IN THE NEXT CHAT

Suggested opening for the new chat:

> "Carrying over from previous chat on Threat Readiness. Files uploaded:
> - 15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md
> - THREAT_READINESS_ARCHITECTURE.md
> - THREAT_READINESS_PROMPTS.md
> - SESSION_SUMMARY_THREAT_READINESS.md (this file)
>
> Threat Readiness spec is locked and ready for Cursor. Need to:
> 1. Confirm the §12 open items
> 2. Then triage the remaining MVP blockers — assessment wiring, Teams/Slack, anything else slipping the early-May target.
>
> Start with question 1."

---

*End of session summary. May 2026.*
