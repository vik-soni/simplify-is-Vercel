# Framework executive dashboards — research log (iteration 1)

**Date:** 2026-05-08  
**Goal:** One distinct “one-pager” per framework tab in post-login Framework View, faithful to how auditors and CISOs reason about each standard. Design language: Earthen Brutalism (existing tokens).

## NIST CSF 2.0

- **Official structure:** Six functions (GV, ID, PR, DE, RS, RC) with categories and subcategories; implementation tiers are often described as **tiers** (Partial → Adaptive); product copy should use **1–4** scale where aligned with organisational implementation tiers (avoid implying a fictional “five-level NIST score” unrelated to CSF tiers).
- **Executive needs:** Identify **where ahead / on par / behind** peers; **top gaps** by function; **trend** (month/quarter/year); heatmap or ranked list beats a single KPI.
- **Proposed widgets:** Leading vs lagging summary; numeric scores by function; “top five” weakest categories; peer/cohort percentile; time-range selector for delta narrative.

## ISO/IEC 27001:2022

- **Mental model:** **Management system conformity** — statement of applicability, Annex A controls, internal audit, NC (nonconformity), OFI (opportunity for improvement).
- **Executive needs:** **% conforming** controls (or domains), **open NCs**, **audit readiness** (ready / in progress / gap), **certification alignment** messaging (without promising certification).
- **Proposed widgets:** Donut or summary stat for conformity; gap list; open actions table; timeline toward external audit (dummy).

## PCI DSS 4.0

- **Mental model:** **Requirement**-driven; SAQ vs full assessment context; pass/fail + compensating controls.
- **Proposed widgets:** Requirement groups progress; critical failures callout; testing frequency reminders (dummy).

## APRA CPS 234 / CPS 230

- **Mental model:** Prudential; **capability** and **incident** narrative; board/reporting hooks.
- **Proposed widgets:** Capability domains with RAG; incident readiness strip (dummy).

## ASD Essential Eight

- **Maturity model:** 0–3 maturity levels per strategy.
- **Proposed widgets:** Eight tiles with maturity badge per strategy; uplift order (dummy).

## ISO/IEC 42001 (AI)

- **Mental model:** AI management system; risk & impact assessment; lifecycle controls.
- **Proposed widgets:** AI governance pillars; model/data risk summary; tie to organisational AI use (dummy).

## AUVA ISS

- **Proposed widgets:** Regional control themes; alignment summary (dummy — verify official structure in iteration 2).

## NIST AI RMF

- **Mental model:** Govern, Map, Measure, Manage functions.
- **Proposed widgets:** Four-function map with risk posture; **trend** shows composite of function scores; Cypher ties to TEV and incident playbooks.

## Chart & time-range design (all frameworks)

| Range | X-axis intent | Suited graph |
|-------|----------------|-------------|
| **Month** | Recent operational cadence (weekly / rolling) | Dense line, few points — good for sprint-style fixes |
| **Quarter** | Exec / committee rhythm | Mid-density line — shows programme momentum |
| **Year** | Audit & budget cycles | 12-point line — shows structural uplift |

**Why line + area (not bar):** Executives read **direction** faster than category comparisons for a single KPI stream; bars remain on static KPI tiles (PCI groups, AUVA domains).

**Cypher chat:** Prompts are scoped to the visible trend + static tiles so the model can explain deltas without inventing new numbers (until API-backed).

---

## Ten-round research & validation log (synthetic → UI)

| Round | Activity | Outcome |
|-------|-----------|---------|
| **1** | Desk research per standard (structure, auditor language) | Captured in sections above; informed widget choice per framework. |
| **2** | IA pass: what is *one* headline trend per standard? | One primary KPI stream per tab (conformity %, capability index, etc.). |
| **3** | Month vs quarter vs year granularity | Three series lengths; labels W/M vs M1–6 vs initial letters for months. |
| **4** | Graph type selection | Line + light area under curve; micro-bars on tiles for static breakdowns. |
| **5** | NIST CSF alignment | Trend + tier list + top five; narrative from `nistNarrativeByRange`. |
| **6** | ISO / PCI / APRA pair | ISO NC story + conformity arc; PCI requirement groups + aggregate trend; APRA 234 RAG + prudential index; 230 mapping %. |
| **7** | ASD / ISO 42001 / AUVA | E8 per-strategy bars + mean index; 42001 lifecycle + readiness; AUVA three lanes + composite. |
| **8** | NIST AI RMF | Four-up cards + composite trend with y-axis mapped to 0–5 mental model. |
| **9** | Accessibility & contrast | SVG text ≥7px, primary on dark passes with existing tokens; `aria-label` on chart. |
| **10** | Cross-framework consistency | Shared `RangeToggle`, `NarrativeStripe`, `CypherTrendCard`, `FrameworkTrendChart` contract. |

_Future rounds:_ wire `dashboardTrendData` from Supabase aggregates; add second series (e.g. peer percentile band) when data exists.

## Iteration log (legacy table — superseded by 10-round log above)

| # | Focus |
|---|--------|
| 2 | Wireframe intent captured in UI cards per framework (`FrameworkExecutiveDashboard.tsx`). |
| 3–5 | NIST (range toggle, tiers 1–4, top five); ISO conformance/gaps; PCI, APRA, ASD, ISO 42001, AUVA, NIST AI RMF distinct layouts. |
| 6–7 | Shared card chrome (`Card`), type scale, WCAG-oriented contrast checks. |
| 8–10 | Copy pass on dummy narratives; stakeholder review when live data lands. |

_Extend the 10-round table as API wiring lands._
