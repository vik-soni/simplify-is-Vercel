# Simplify IS — Social & Funnel Plan (Reader Summary)

**Source:** `Social Plan 8 May 2026.md` (full operational detail, prompts, and metrics).  
**Horizon:** About **20 weeks** (~May–September 2026 if Week 1 starts 11 May 2026). This is the “longer than 8 weeks” plan for **audience, credibility, and launch runway** alongside the separate **8-week MVP engineering tracker** in Notion.

---

## What we are doing

We are running a **coordinated, multi-channel content and community program** before and through the first public Simplify IS launch. Every channel has a role: some are anonymous to the product (employer-safe), some are candid (validation and beta). The work is **not** random posting — it is a phased narrative that moves from *problem → vision → build-in-public → book → product*.

---

## Why we are doing it

- **Market timing (2026):** vCISO costs, AI added to CISO scope without playbooks, compliance cost pressure, and the gap between “everyone wants continuous compliance” versus “almost nobody has automated reporting” all point to demand for an **AI security partner** positioned early.
- **Category, not feature war:** The plan intentionally frames **“AI security partner that knows your business”** before incumbents crowd the story.
- **Proof and pipeline:** Long-term goals include a **qualified email list (hundreds to low thousands by week 20)**, **Reddit/X design partners and beta testers**, and **LinkedIn authority** in AI + security leadership — so launch week is a conversion event, not a cold start.

---

## North star (one idea, three voices)

- **Headline:** AI does not replace the security leader; it removes what blocks them from leading.
- **Vision:** An AI partner that knows your stack and frameworks, available in Slack/Teams, handles reporting; you handle strategy.
- **Provocation:** In 2026 everyone is told to “do more with AI”; few are told how — that gap decides who leads.

---

## How phases roll out

| Phase | Weeks | Theme | What changes |
|------|-------|--------|--------------|
| **Foundation** | 1–4 | Why security leadership is broken in 2026 | Problem and authority only — no product pitch. |
| **Vision** | 5–10 | What an AI security partner looks like | Paint the future; introduce book arc toward the end of this phase. |
| **Pre-launch** | 11–16 | Building in public + book | More candor on Reddit/X; book launch ~weeks 12–14; bridge readers toward what comes next. |
| **Launch** | 17–20 | It is here | Cohort/beta language → named beta → public launch. |

---

## Channel playbook (at a glance)

### Vik.so (SEO + email)

- **Intent:** Education and **email capture** with high-utility downloadables.
- **Voice:** Researching / exploring — **no Simplify IS naming**, no “I’m building a SaaS.”
- **Cadence (target):** Two long articles per week plus one downloadable asset; sticky + mid + footer capture mechanics on every post.
- **Outcome:** List growth and a permissioned audience for later **email blast** milestones (e.g. book, early access).
- **Depends on:** Drafting/edit capacity, template design, analytics on signups, NOT on engineering shipping ( orthogonal to MVP tracker ).

### LinkedIn (reach + credibility)

- **Intent:** Thought leadership among security and compliance leaders; **carousel-first** (algorithm and engagement skew).
- **Voice:** Same firewall as Vik.so — **no product name**; avoid generic AI tone; heavy editing so your voice shows.
- **Cadence (target):** Four posts per week (often three carousels + one long text), with extra density in book-launch week.
- **Outcome:** Saves, comments, DMs — **saves called out as a primary metric** in the source plan.
- **Depends on:** Carousel design/PDF workflow; personal stories to dodge AI-detection penalties.

### Reddit (validation + early adopters)

- **Intent:** Honest questions, AMAs, occasional giveaways — **credibility before promotion.**
- **Voice:** Peer, not marketer; **can** be more direct about building/research than LinkedIn/Vik.so.
- **Cadence (target):** Roughly two substantive posts per week plus **daily-ish comment engagement** in target subs.
- **Outcome:** **20–30** serious early-adopter / beta conversations called out in the strategy doc.
- **Depends on:** Sub rules, time in comments, not flooding; willingness to give value (e.g. free workbook) without hard sell.

### X / Twitter (builder graph)

- **Intent:** Threads, industry commentary, **build-in-public** — most permissive channel for naming Simplify IS **once beta-appropriate.**
- **Cadence (target):** Roughly five to seven posts per week including replies; threads for big ideas.
- **Outcome:** Network with builders, founders, and practitioners; surface for **beta and launch** announcements.
- **Depends on:** Consistency without burnout; same authenticity rules as Reddit on promotion.

### Email (list)

- **Intent:** Owned channel when third-party algorithms shift; launches (book, cohort, product).
- **Outcome:** Repeatable **blast** moments tied to Vik.so capture and major milestones.
- **Depends on:** List hygiene, consent, and a single landing path per campaign (avoid scattered CTAs).

---

## Email capture (why it matters)

Downloadables (PDFs, Excel, decision trees) are the **high-conversion** magnets on Vik.so — the source plan targets **8–15%** conversion on those versus generic newsletter signup. Over ~40 articles and ~20 assets, even moderate traffic can yield **hundreds to low thousands** of subscribers by week 20.

---

## Measurement (lightweight weekly review)

Every **Sunday** (or your chosen slot): traffic and signups on Vik.so; LinkedIn followers/saves/comments/DMs; Reddit DMs and beta interest; X conversations; sanity-check whether cadence is sustainable.

---

## Risks (and how the plan mitigates them)

- **Employer sensitivity:** Vik.so + LinkedIn stay research/thought-leadership; **naming and hard sell concentrate on Reddit/X** (and later LinkedIn if you choose).
- **Spam / promotion penalties:** Stay within **sub rules** on Reddit, limit **LinkedIn volume**, lead with value.
- **AI-looking content:** Edit hard; use carousels and **specific** stories and numbers.
- **Burnout:** Phases 2–3 reuse patterns and prompts; phase 4 leans on **repurpose and conversion** versus all-new invention.

---

## How this relates to the 8-week MVP Notion plan

- **MVP tracker:** Engineering and product execution to a beta-ready build.
- **This social plan:** **Go-to-audience** work across Vik.so, LinkedIn, Reddit, X, and email — same parent **Simplify IS** workspace in Notion, **separate database** so engineering and marketing tasks do not tangle.
- **Shared dependency:** Only where you intentionally align (e.g. **beta messaging** week ~18–20 needs a real beta surface; **book** milestones need manuscript and distribution).

---

## Where to find more detail

- **Operator detail, prompts, and verbatim week-by-week asset titles:** `docs/Social Plan 8 May 2026.md`
- **Day-by-day execution + checkboxes:** Notion page **📣 20-Week Social & Funnel Calendar** (sibling to the **🎯 8-Week Beta Build Tracker** under **Simplify IS — Comprehensive Guide**). Canonical URL is maintained in the Signal Social Agent dashboard (**20-Week Social** view) and in `signal-social-agent/database/db.py` as `NOTION_SOCIAL_PAGE_URL`.
- **Copy-paste drafts + local tracking:** **signal-social-agent** repo — open the SIGNAL dashboard → **20-Week Social**. It seeds the same 216 rows from `data/social_calendar.json`; use **Generate** after the nightly **Research** job so Perplexity + Claude briefing context is fresh in BrainDB.
