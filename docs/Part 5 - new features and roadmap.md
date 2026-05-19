# Simplify IS — Full Project Handover Document
## Context Transfer for New Chat Session

> **Purpose:** This document captures everything discussed across the Simplify IS project chats so the new conversation has full context with zero loss of detail. Upload this alongside the SIMPLIFY_IS_MASTER_SPEC.md file when starting the new chat.
>
> **Prepared:** April 2026  
> **Prepared by:** Vik Soni + Claude  
> **Document version:** 1.0

---

## 1. WHO WE ARE AND WHAT WE'RE BUILDING

### The People
- **Vik Soni** — Product Owner, Security SME (ISO 27001, NIST CSF, ASD Essential Eight, APRA CPS 234), domain expert. Vik brings the security domain knowledge that is the moat. Also owns the free public site **vik.so**.
- **Claude** — Product Developer, Architect, and Product Manager acting as a co-founder-level strategic partner throughout this build. Not just a coding tool — actively contributes roadmap decisions, architecture choices, and product strategy.

### The Two Non-Negotiable Principles (from the spec — apply to every decision)
1. **World-class product quality** — This must be the best AI-driven security assessment tool ever built. No shortcuts, no compromises. The moat is Vik's domain expertise combined with Claude's capability.
2. **Security first, always** — Security baked into every architectural decision from day one. No retrofitting. Enterprise-grade from the start. Zero critical findings when pen-tested.

---

## 2. THE PRODUCTS

### vik.so (Already Built — Free)
- Personal brand / credibility site
- ISO 27001 and NIST CSF AI consultants powered by Claude API + Supabase RAG
- D3.js control mesh visualisation mapping cross-framework controls
- Free public access — community value and trust-building
- Remains free permanently — it is the public-facing credibility layer for Simplify IS
- Proven that the Claude API + Supabase RAG pattern works

### Simplify IS — simplify.is (What We Are Building)
- Commercial SaaS: paid intelligent security assessment platform
- Monthly subscription model
- Users interact with **Cypher** — their AI Security Consultant
- Cypher guides users through structured security assessments conversationally
- Must NOT feel like a chatbot or checkbox exercise — must feel like a real consultant
- Separate domain: simplify.is
- Note: decipher.net domain also owned by Vik — reserved for future expansion

---

## 3. TECHNICAL STACK (ALL LOCKED)

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Auth:** Supabase Auth with RLS pre-configured
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude API (claude-sonnet-4-20250514) + Supabase RAG pattern (same as vik.so — proven working)
- **Base Template:** `https://github.com/Razikus/supabase-nextjs-template` — adapt, do not rewrite
- **Key Architecture Decision (LOCKED):** The fine-tuned LLaMA model has been **removed from the inference path**. All AI responses go through **Claude API + Supabase database (RAG pattern)**. Do not revisit this decision.
- **Deployment:** [refer to master spec for full deployment architecture]

---

## 4. THE AGENT — CYPHER

### Persona (Critical — Do Not Dilute)
- Name: **Cypher**
- Role: AI Security Consultant
- Personality: Warm, curious, intelligent, direct. Adapts vocabulary to the user's level automatically.
- Never uses lists, bullet points, or headers in conversation
- Asks **one question at a time only** — never multiple questions in a single turn
- Remembers everything across sessions (cross-session memory via Supabase)
- Probes intelligently — detects contradictions, extracts signals from how users talk
- Feels like a trusted expert colleague, not a form or a chatbot
- Does NOT congratulate after every answer — keeps a natural conversational rhythm
- Does NOT use the word "Maturity" with users — uses plain language equivalents

### What Cypher Does
- Guides users through security framework assessments conversationally
- Scores each domain/control on a CMMI 1–5 maturity scale
- Remembers prior sessions, prior answers, user's name, org context
- Detects contradictions across conversations and gently probes them
- Extracts compliance signals from how users describe their environment
- Adapts depth of questioning based on user's apparent expertise level

---

## 5. FRAMEWORKS SUPPORTED (Spec + Roadmap)

### In Build (MVP)
- **ISO 27001:2022** — full domain-by-domain assessment
- **NIST CSF 2.0** — full function-by-function assessment

### Phase 1 Post-Launch (Months 1–3)
- **ASD Essential Eight** — Australia's government-endorsed cyber framework (ACSC mandate)
- **APRA CPS 234** — mandatory for Australian banks, insurers, superannuation funds

### Phase 3 (Months 8–18)
- **ISO 42001** — AI Governance / AI Management System (highest priority new framework — EU AI Act enforcement Aug 2026)
- **PCI-DSS** — payment card industry
- **HIPAA** — healthcare (US market)

### Phase 4 (Months 18–36)
- **NIS2** — EU network and information security
- **DORA** — EU digital operational resilience (already enforceable Jan 2025)
- **GDPR** — data privacy (EU + global)

---

## 6. SCORING + DASHBOARD

### Scoring
- CMMI 1–5 maturity scale
- Weighted domain scores → overall organisational maturity score
- Score changes animate on the dashboard — creates tangible achievement feeling
- Full scoring algorithm is documented in the master spec (Section 29)

### Dashboard — Three Views
1. **Industry Domain view** (default) — controls grouped by business function
2. **Framework view** — controls organised by ISO/NIST/ASD structure
3. **Risk view** — controls prioritised by risk exposure

### Cross-Session Memory
- All assessment signals, scores, user context, and conversation history stored in Supabase
- Cypher references these in every subsequent session
- This is a core differentiator — competitors do not do this

---

## 7. MULTI-USER COLLABORATION (Agent 6 — In Build)

### Roles
- **Admin** — full access, invites users, sets domain assignments, approves final answers
- **Assessor** — can answer questions in assigned domains
- **Viewer** — read-only access to dashboard and reports

### Key Features
- Domain assignments per user
- Conflict resolution when multiple users answer the same question differently
- Full audit trail of who answered what and when
- All documented in master spec Part H (Sections 33–38)

---

## 8. WHAT WAS DISCUSSED IN THIS CHAT SESSION

### Topic 1: Teams / Slack Integration
- **Question asked:** How challenging is it to integrate Cypher into Microsoft Teams and Slack so users don't need to visit the Simplify IS portal?
- **Answer:** Technically straightforward — 1–2 weeks of build. Both platforms have well-documented bot APIs (incoming/outgoing webhooks). The tricky part is authentication/permissions so users can only do what they're authorised to do in Simplify IS.
- **Scope agreed:** Full update capability (not just read-only). Users can answer assessment questions, get scores, and update the system entirely through Teams or Slack, with Simplify IS updating in the background.
- **Decision:** This is a Phase 1 Quick Win (Months 1–3 post-launch), not a post-MVP feature. Rationale: users live in Teams/Slack — ambient access dramatically improves daily engagement and retention.

### Topic 2: Strategic Product Roadmap Research
- **Request:** Vik asked Claude to act as product manager, research the market, and come back with a prioritised list of what to build — what can be a quick win, what drives recurring revenue, what makes the product sticky.
- **Research conducted:** GRC market size and trends, competitor analysis (Vanta, Drata, Secureframe, ISMS.online, 6clicks, ISMS Copilot, Scytale, Sprinto), SaaS retention science, ISO 42001 emergence, ISMS policy management trends, vendor risk management space, security awareness training space.

### Topic 3: Competitive Landscape (Researched)
- **Vanta** — 8,000+ customers, $2.45B valuation, ease of use, 375+ integrations. Weakness: expensive, rigid, US-centric, complex for non-technical SMBs.
- **Drata** — 7,000+ customers, $2B+ valuation, strong automation depth. Weakness: steep learning curve, developer-centric, expensive for SMBs.
- **Secureframe** — white-glove support, broad framework coverage. Weakness: still template/checklist-driven.
- **ISMS.online** — UK-based, pre-configured ISMS platform, guided step-by-step. Closest in spirit but document/checklist-driven, no conversational AI agent.
- **ISMS Copilot** — AI assistant for ISO 27001 consultants. Starting at $20/month. Key distinction: built FOR consultants, not for end-customer organisations doing their own assessment.
- **6clicks** — Melbourne-founded 2019, AU/US/UK/India offices. GRC automation with AI, partner program, white labelling. Aimed at consultants and enterprises. Not conversational, not SMB-friendly.
- **Simplify IS's unique position:** Nobody has an AI agent that acts as a *persistent security consultant* — one that remembers you, tracks maturity over time, probes intelligently, and sits in your workflows. Genuinely differentiated.

### Topic 4: Market Data (Researched)
- GRC software market: $21B in 2025, growing to $39B by 2031 at 10.84% CAGR
- AI for security compliance market: $231M in 2025, growing to $1.69B by 2035
- Only 13.76% of GRC professionals have actually integrated AI into their frameworks (rest are evaluating or planning)
- 43% of GRC teams are using AI to automate compliance workflows
- Cloud-based SaaS = 64% of market share
- SMB segment fastest-growing, most underserved
- 65% of annual B2B SaaS churn happens in first 90 days — retention investment must front-load onboarding

### Topic 5: ISO 42001 — AI Governance (Researched, High Priority)
- ISO/IEC 42001 is the world's first certifiable AI Management System (AIMS) standard
- Published December 2023, demand surging in 2025–2026
- EU AI Act enforcement begins August 2026 — ISO 42001 directly addresses its requirements
- Colorado's AI Act explicitly recognises ISO 42001 as a safe harbor for compliance
- Enterprise procurement teams are already demanding ISO 42001 certification alongside SOC 2 and ISO 27001
- Organisations with ISO 27001 can achieve ISO 42001 30–40% faster due to structural overlap
- This is Phase 3 priority (Months 8–18) — natural upsell conversation for existing ISO 27001 customers
- Verdict: most commercially timely new framework of the next 5 years for Simplify IS

---

## 9. THE FULL PRODUCT ROADMAP (Agreed in This Chat)

### Phase 0 — Pre-Launch Foundations (In Build Now)
| Feature | Notes |
|---|---|
| Cypher conversational agent | Core product. Quality of conversation is everything. |
| ISO 27001 + NIST CSF 2.0 frameworks | Both in full — domain-by-domain assessment flow |
| Maturity scoring + 3-view dashboard | CMMI 1–5, animating scores, three dashboard views |
| Cross-session memory | Supabase-stored full conversation + signal memory |
| PDF Export (2 types) | Internal checklist + branded executive summary |
| Multi-user collaboration | Admin/Assessor/Viewer roles, domain assignments (Agent 6) |

### Phase 1 — Quick Wins Post-Launch (Months 1–3)
| Feature | Category | Dev Effort | Why |
|---|---|---|---|
| AI Policy Generation | Moat | ~1 week | Biggest "wow" moment. Cypher drafts a tailored ISO-aligned policy mid-conversation when a gap is detected. Stored in policy library. First step to ISMS library. |
| Teams + Slack Bot Integration | Retention | ~2 weeks | Users live in Teams/Slack. Ambient access = ambient compliance. Full update capability (not read-only). First mover in SMB GRC space. |
| ASD Essential Eight | Growth | ~2 weeks | Australia-specific, no US competitor has invested here. ACSC mandatory for federal/critical infra. |
| APRA CPS 234 | Growth | ~2 weeks | Mandatory for AU banks/insurers/super funds. High-ACV segment. |
| Shareable Trust Profile / Security Badge | Growth | ~1 week | Public URL showing compliance status. "Powered by Simplify IS." Viral referral loop. |
| Action Plan Generator | Retention | ~1 week | Post-assessment prioritised remediation plan: what to fix first, why, estimated effort. |

### Phase 2 — System of Record (Months 3–8)
| Feature | Category | Dev Effort | Why |
|---|---|---|---|
| ISMS Document Library | Retention | ~3 weeks | When customer's entire ISMS documentation lives here, they cannot leave. Most important retention feature. |
| Document Upload + Signal Extraction | Moat | ~3 weeks | Upload existing policies/reports. Cypher reads, extracts compliance signals, maps to controls, auto-updates scores. |
| Vendor / Supplier Risk Module | Revenue | ~4 weeks | Cypher-guided assessments sent to suppliers. Responses map to risk register. Every supplier assessed = potential new customer (viral loop). |
| Internal Audit Workflow | Revenue | ~3 weeks | ISO 27001 mandates internal audits. Makes consultants want to recommend and use Simplify IS. Opens consultant channel. |
| Risk Register | Retention | ~2 weeks | ISO 27001 Clause 6.1 mandates a risk register. Auto-built from Cypher conversations. Mission-critical data that can't move. |
| Employee Awareness Module | Retention | ~3 weeks | ISO 27001 Annex A 6.3 mandates documented staff training. Eliminates a competing tool (KnowBe4 etc.). |

### Phase 3 — Revenue Expansion (Months 8–18)
| Feature | Category | Dev Effort | Why |
|---|---|---|---|
| ISO 42001 — AI Governance | Revenue | ~3 weeks | Most timely new framework. EU AI Act enforcement Aug 2026. Natural upsell from ISO 27001. Colorado safe harbor. |
| Consultant / Partner Tier | Growth | ~4 weeks | White-label for consultants managing multiple client orgs. Every consultant = 5–20 new orgs. 6clicks model. |
| PCI-DSS + HIPAA | Revenue | ~2 wks each | Opens retail/e-commerce/healthcare. Add-on pricing to avoid diluting base product. |
| Peer Benchmarking (anonymised) | Moat | ~2 weeks | "You're in the top 34% of financial services orgs with 50–200 employees." Requires customer data volume — Phase 3 timing. Proprietary data moat. |
| Regulatory Change Monitoring | Moat | ~2 weeks | Cypher alerts when relevant regulatory changes occur. Drives reassessment cycles naturally. |
| Board Reporting Pack | Retention | ~1 week | Auto-generated quarterly PDF for board/exec committee. Plain language. Embeds product in governance cadence. |
| Power BI / BI Export API (Full) | Retention | ~2 weeks | Structured JSON feed for BI dashboards. Product becomes infrastructure for larger orgs. |

### Phase 4 — Platform + Ecosystem (Months 18–36)
| Feature | Category | Dev Effort | Why |
|---|---|---|---|
| MCP Integrations (Okta, CrowdStrike, Entra ID, Jira) | Moat | ~6 weeks | Cypher reads real tool data and auto-updates control assessments. Transforms from periodic to continuous. |
| Marketplace / Extension Ecosystem | Moat | ~8 weeks | Third-party devs build extensions. Network effects. Salesforce/ServiceNow model. |
| Certification Readiness Score + Auditor Portal | Revenue | ~4 weeks | Evidence bundles for certification bodies. Certification body partnerships and referral fees. |
| NIS2 / DORA / GDPR Frameworks | Growth | ~2 wks each | European market entry. DORA already enforceable. |
| Mobile App (iOS + Android) | Retention | ~8 weeks | Extends ambient access beyond Teams/Slack. Push notifications for overdue controls. |

### What NOT to Build (Agreed)
| Feature | Reason |
|---|---|
| Vulnerability scanning / technical testing | Competing with CrowdStrike/Tenable/Qualys — billion-dollar moats. Integrate via MCP in Phase 4 instead. |
| Custom framework builder (DIY) | Complex to build, rarely used, power users can use a spreadsheet. Add pre-built frameworks instead. |
| Bulk CSV / spreadsheet imports | Bypasses Cypher conversation entirely — destroys the core differentiator and habit formation. |
| Complex tiered pricing at launch | Zero market data to justify it. One flat price → prove value → tier after 50 customers. |
| AI-generated compliance certifications | Cannot certify anyone. Legal liability. Creates credibility damage. Readiness score + certified body referrals instead. |

---

## 10. STRATEGIC INSIGHTS AND DECISIONS MADE

### The One Highest-Priority Feature
**AI Policy Generation** (Phase 1) — when Cypher detects a missing policy during assessment and offers to draft it tailored to the organisation. This is the "wow" moment that drives word of mouth. Competitors have generic templates; Cypher generates a tailored policy in a real-time conversation. Also the first step toward the ISMS library that creates true lock-in.

### The Most Important Retention Strategy
The **ISMS Document Library + Risk Register + Policy Library + Employee Training Records** (Phase 2) — once customer data lives in Simplify IS, churn approaches zero. This transforms the product from a SaaS tool to a mission-critical platform. Every piece of customer data added makes switching cost higher.

### The Most Commercially Timely Opportunity
**ISO 42001** (Phase 3) — EU AI Act enforcement August 2026, Colorado AI Act recognises it as safe harbor, enterprise procurement teams already demanding it. Organisations with ISO 27001 already in Simplify IS can achieve ISO 42001 30–40% faster — natural upsell Cypher can facilitate conversationally.

### The Channel Strategy
**Consultant / Partner Tier** (Phase 3) — security consultants are the most trusted distribution channel in this market. Every consultant who uses Simplify IS to deliver their services brings 5–20 new customer orgs. 6clicks built a significant business on this model. Simplify IS can do it better because the product is AI-native and SMB-accessible.

### The Australian Competitive Moat
**ASD Essential Eight + APRA CPS 234** (Phase 1) — no US competitor has invested in these. Positions Simplify IS as the tool that understands Australia. These two frameworks alone are enough to dominate the Australian market before any competitor reacts.

### SaaS Retention Science Applied
- Best-in-class B2B SaaS NRR is 120–125% — target this
- 65% of annual churn happens in first 90 days — onboarding quality is the single biggest lever
- Annual contracts churn at ~1/3 the rate of monthly contracts — push annual billing with 15–20% discount
- Features that drive highest NRR: usage-based expansion (more users, more frameworks, more add-ons), not flat subscriptions

### The North Star (Strategic)
Every durable feature makes the cost of leaving higher than the cost of staying. ISMS documents, risk register, policy library, vendor assessments, employee training records, 2 years of conversation history — all data customers cannot recreate elsewhere. Build for depth of integration before breadth of features.

---

## 11. OUTPUTS CREATED IN THIS CHAT

1. **Strategic analysis** — full competitive landscape, market research, recommended feature priorities with rationale
2. **Product roadmap** — 4 phases over 24 months, all features with category, dev effort, revenue impact, and stickiness ratings
3. **Two HTML files** (saved as outputs):
   - `simplify-is-roadmap.html` — full interactive version with dark/light theme for screen viewing
   - `simplify-is-roadmap-print.html` — compact A4 landscape print-optimised version

---

## 12. WHAT THE NEW CHAT SHOULD KNOW / PICK UP FROM

### Current Build Status
- Agents 1–5 are in build covering the Phase 0 foundations
- Agent 6 (Multi-user collaboration) is scoped and next
- The spec is in SIMPLIFY_IS_MASTER_SPEC.md (upload alongside this file)

### Key Locked Decisions (Do Not Re-Open)
- Claude API + Supabase RAG — not LLaMA fine-tuning
- Next.js 15 + Supabase + TypeScript + Tailwind — no framework changes
- Base template: Razikus/supabase-nextjs-template — adapt not rewrite
- Cypher persona: one question at a time, no lists, vocabulary-adaptive, no "maturity" word with users
- Agent-by-agent build sequence (as documented in spec Section 22)

### Things Still to Be Decided / Discussed
- Exact pricing (recommendation: one flat monthly price at launch, no tiers until 50 customers)
- Onboarding flow design for new users (critical — 65% of churn is in first 90 days)
- Whether Teams or Slack integration gets built first (Teams likely given enterprise AU focus)
- Specific wording and tone for Cypher's first-ever message to a new user
- Marketing / go-to-market strategy for Australia launch
- Whether to approach 6clicks about anything (they're Melbourne-based, potential partnership or just competitor intelligence)

### Vik's Communication Style Notes
- Speaks via voice transcription — occasional transcription errors in messages, interpret intent not literal words
- Prefers concise, direct answers — doesn't want lengthy preambles
- Thinks out loud — sometimes a topic lands mid-conversation that wasn't the original question
- Treats Claude as a co-founder level partner, not a tool — strategic input is welcomed and expected
- Wants to be challenged with better ideas, not just validated

---

## 13. MASTER SPEC SUMMARY (KEY SECTIONS TO KNOW)

The SIMPLIFY_IS_MASTER_SPEC.md (v5.0 — Final Combined) covers:

- **Part A** — Product vision, target customer, business model, MVP scope
- **Part B** — Full technical stack, RAG architecture, database schema, API endpoints, orchestration service, security architecture, deployment
- **Part C** — Assessment flow, Cypher agent persona, empty state/onboarding, UI architecture, scoring/maturity logic, signal extraction, contradiction detection, cross-session memory, all locked UX decisions
- **Part D** — Production-ready prompt library
- **Part E** — Build sequence (5 agents), agent rules and handoff protocol, file/folder structure, environment variables, Supabase setup
- **Part F** — ISO 27001 domain structure, NIST CSF domain structure, full scoring algorithm implementation
- **Part G** — Testing strategy, pre-launch security checklist, post-MVP backlog
- **Part H** — Multi-user collaboration full spec (Agent 6): overview, database schema, API endpoints, role permissions matrix, business logic, UI/UX design

**Always upload SIMPLIFY_IS_MASTER_SPEC.md alongside this handover document when starting a new chat.**

---

*End of handover document. Everything above represents the complete context of the Simplify IS project as of April 2026. No detail intentionally omitted.*
