# Simplify IS — Session Summary: Cypher Architecture + Testing Framework
## Generated: April 2026 | Complete Chat Context Export

---

## SESSION OVERVIEW

This chat session resolved critical architectural decisions for Cypher (Simplify IS's AI security consultant) and designed a comprehensive testing framework. We moved from a basic chatbot concept to a sophisticated agentic system with org-scoped learning, real-time scoring integration, and autonomous improvement capabilities.

---

## CURRENT PROJECT STATE

### Agent Status (All Complete)
- **Agent 7:** 20 pre-login pages built (Cursor) + design fixes (Claude Code) ✅
- **Agent 8:** Auth backend built (Cursor) ✅
- **Agent 9:** Auth UI/API wiring spec written, ready to run ✅

### Next Major Milestone
- **Agent 10+:** Post-login dashboard (waiting on Google Stitch designs from Vik)

---

## LOCKED ARCHITECTURAL DECISIONS

### Cypher's Nature (Fundamental Shift)
**FROM:** Simple chatbot that extracts assessment signals
**TO:** Agentic system with memory, real-time learning, multi-model orchestration

| Decision | Choice |
|----------|--------|
| **Cypher's purpose** | Simultaneous advisor + assessor — answers questions using industry knowledge + APIs while learning about the org |
| **Data isolation** | Org-scoped learning only — zero cross-org contamination |
| **Benchmarking** | Anonymized industry aggregates (24-hour cache) for dashboard display only |
| **Knowledge storage** | Structured facts table (MVP) + transcript blobs (on-demand retrieval, S3/Supabase) |
| **Context retrieval** | Hybrid smart retrieval: session profile + dynamic per-question |
| **Learning validation** | Admin-only "insights" validation before maturity scoring updates |
| **Terminology** | "Insights" not "signals" (user-friendly) |
| **Contradiction handling** | Detect mid-conversation with humility: "I understood X before — has that changed?" |
| **Insight resolution** | Show old vs new value, one-click choice: Keep / Update / Both valid |

### Technical Architecture
| Component | Storage | Purpose | Cost Estimate |
|-----------|---------|---------|---------------|
| **Facts table** | Supabase relational | Structured org knowledge (validated insights) | ~$10-20/mo |
| **Transcripts** | S3/Supabase blob | Full conversation history (reference only, on-demand) | ~$10-30/mo |
| **Scoring integration** | Real-time | Instant maturity recalculation on insight validation | Negligible |
| **Benchmarking** | Hybrid cache | Overnight aggregation jobs, 24hr cache | Negligible |

### Authentication Flow (Locked for Agent 9)
| Flow Step | Behavior |
|-----------|----------|
| **Signup** | Full Name, Email, Password, Confirm Password, Organisation Name, Job Title, Team Size, Industry |
| **Email verification** | Link-based → "verified" confirmation → login form with banner |
| **Login flow** | POST immediately, disable button, show spinner, HttpOnly cookies |
| **MFA** | Supabase TOTP, auto-submit on 6th digit |
| **Remember me** | 7-day session extension, checkbox defaulted unchecked |
| **Post-login routing** | First-time org → `/onboarding`, others → `/dashboard` |
| **Session persistence** | HttpOnly cookie, Supabase sessions handle JWT + refresh |
| **Account deletion** | Soft delete (`deleted_at` timestamp, keep data for audit) |
| **Rate limiting** | 10 failed logins → 5 min lockout, 5 failed MFA → 5 min lockout |

---

## PHASE 1 TESTING FRAMEWORK (Pre-MVP)

### Constitutional Testing Architecture
Inspired by Andrej Karpathy's AutoResearch (700 experiments in 2 days), we're building a Constitutional AI-style testing loop where Claude autonomously validates Cypher's behavior.

### Testing Approach
**Phase 1 (Cypher in isolation):** Test conversational quality before full system build
**Phase 2 (post-app):** Full pipeline testing once dashboard/scoring is complete

### Phase 1 Specification
| Component | Details |
|-----------|---------|
| **Scope** | End-to-end holistic testing |
| **Simulations** | 100+ conversations across real org archetypes (healthcare startup, financial services, etc.) |
| **Test types** | Real personas + adversarial (contradictions, edge cases) + pipeline monitoring |
| **Implementation** | Claude auto-implements improvements directly to main branch (pre-launch) |
| **Reporting** | Plain English summary for human review + improvement metrics |
| **Cost** | ~$100-150 API spend for entire Phase 1 validation suite |
| **Iteration** | Phase 2: 30-40 conversations, comparison report showing improvement deltas |

### Constitutional Principles (For Cypher Evaluation)
1. "Cite org knowledge naturally without breaking conversation flow"
2. "Detect contradictions with humility, not accusation"
3. "Never confuse ISO controls with NIST subcategories"
4. "Validate every insight with org admin before scoring"
5. "Answer should save 30+ minutes vs Googling"
6. "Feel like interacting with a human security consultant"
7. "Capture insights accurately without false positives"
8. "Maintain conversational flow while learning"

### Testing Metrics
- **Accuracy:** Control framework correctness
- **Relevance:** Appropriate use of org knowledge
- **Usefulness:** Time-saving vs manual research
- **Safety:** No data leakage between orgs
- **Conversation quality:** Natural, consultant-like interaction
- **Learning quality:** Insight capture accuracy

---

## CURRENT BLOCKERS (For Phase 1 Testing)

### From Mac Mini Diagnostic (Real Environment)
| Blocker | Status | Solution |
|---------|--------|----------|
| Database empty | ❌ Critical | Need to seed framework controls + test data |
| Dev server not running | ❌ Trivial | `npm run dev` |
| Framework controls missing | ❌ Critical | `ft_iso_controls` and `ft_nist_controls` tables empty |

### The Big Question (Unresolved)
**Do you already have the 93 ISO 27001:2022 controls and ~117 NIST CSF 2.0 subcategories seeded in your vik.so project's Supabase?**

**If YES:** Copy data over with migration script (~30 minutes)
**If NO:** Generate from scratch (2-3 days of careful content creation)

---

## AGENT SPECIFICATIONS CREATED

### Agent 7: Pre-Login Pages + Auth Flow (COMPLETE)
- **File:** `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
- **Scope:** 20 pages, 3 breakpoints, dark + light modes, SEO, analytics
- **Status:** Built in Cursor, refined with Claude Code ✅

### Agent 8: Authentication Backend (COMPLETE)
- **Scope:** Supabase TOTP, email verification, password reset, session management
- **Key decisions:** HttpOnly cookies, soft delete, rate limiting, auto-create user rows
- **Status:** Built in Cursor ✅

### Agent 9: Auth UI/API Wiring (SPEC COMPLETE)
- **File:** `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`
- **Scope:** Wire Agent 7 forms to Agent 8 endpoints, 8 complete flows
- **Status:** Ready to run in Cursor (waiting for Agent 8 completion confirmation)

---

## SYSTEM ARCHITECTURE OVERVIEW

### Three-Layer Security Model (Enforced)
```
USERS/INTERNET
     ↓ HTTPS only
API LAYER (/api/v1/*)
- JWT auth + validation on EVERY route
- Rate limiting: 100 req/min, 1000 req/hour per user
     ↓ ORCHESTRATION_SECRET required
ORCHESTRATION SERVICE (/api/internal/*)
- ALL Claude API calls happen here ONLY
- ALL RAG context building
- ALL database writes
- Signal extraction, scoring, insight validation
     ↓
SUPABASE + CLAUDE API
```

### Cypher's Learning Pipeline
```
User Conversation → Extract Insights → Store as "Pending" → 
Notify Org Admin → Admin Validates → Update Knowledge Graph + Maturity Scores → 
Context Available for Future Conversations
```

### Knowledge Graph Schema (MVP)
```sql
-- Facts table (structured knowledge)
CREATE TABLE org_insights (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  fact TEXT NOT NULL, -- "Uses Terraform for IaC"
  confidence DECIMAL(3,2), -- 0.0 to 1.0
  source TEXT, -- "user_stated" | "inferred"
  status TEXT, -- "pending" | "validated" | "rejected"
  conversation_reference UUID, -- Link to transcript
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcripts (full conversation history)
CREATE TABLE conversation_transcripts (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  session_id UUID REFERENCES assessment_sessions(id),
  full_transcript JSONB, -- Complete conversation for on-demand retrieval
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## UPGRADE PATH (Post-MVP)

### Claude Pro/Max Recommendation
**Current situation:** You're hitting Pro limits in 3-4 hours of Cursor usage
**Recommendation:** Upgrade to Max 5x ($100/month) for 2-week sprint
**Reasoning:** Uninterrupted dev sessions, priority access, no limit-waiting

### Phase 2 Testing (After Dashboard Complete)
- Full pipeline: insights → validation → scoring → dashboard refresh → knowledge persistence
- Cross-component consistency testing
- Performance testing under load
- Real user simulation with complete workflows

### Multi-Model Orchestration (Future)
**Current:** Single Claude Sonnet 4 for all tasks
**Future possibilities:**
- Haiku for RAG resolution (cost optimization) ✅ Already implemented
- Different models for different conversation phases
- Ensemble approaches for critical decisions
- Real-time model performance monitoring

---

## KEY FILES TO REFERENCE

### Core Specifications
- `07_AGENT_UIUX_PreLoginPagesAuthFlow.md` — Complete pre-login build spec
- `09_AGENT_INTEGRATION_AuthUIAPIWiring.md` — Auth integration spec
- `SIMPLIFY_IS_MASTER_CONTEXT.md` — Updated with all locked decisions
- `SIMPLIFY_IS_DESIGN_SYSTEM.md` — Earthen brutalism design tokens

### Implementation Files (Already Built)
- `/orchestration/abstraction/claudeOrchestrator.ts` — 8 Cypher functions
- `/orchestration/rag/contextBuilder.ts` — 3-pass RAG strategy
- `/orchestration/session/stateMachine.ts` — Session management
- `/orchestration/scoring/maturityEngine.ts` — Real-time scoring
- `/orchestration/monitoring/usageMonitor.ts` — 300/month limits

---

## CRITICAL NEXT STEPS

### Immediate (This Week)
1. **Resolve framework controls seeding** — biggest blocker for testing
2. **Create test org + user data** — minimal seed for API testing
3. **Run Agent 9** — complete auth flow end-to-end
4. **Start dev server** — enable endpoint testing

### Testing Phase (Next Week)
1. **Write Phase 1 testing harness** — Constitutional AI loop for Cypher
2. **Run 100+ autonomous conversations** — validate Cypher quality
3. **Iterate on improvements** — 2-3 testing cycles
4. **Document improvement metrics** — baseline → final performance delta

### Dashboard Phase (Following Week)
1. **Complete Google Stitch designs** — post-login experience
2. **Build Agent 10** — dashboard + Cypher chat integration
3. **Run Phase 2 testing** — full pipeline validation
4. **MVP launch readiness** — security audit + performance validation

---

## SESSION INSIGHTS

### What Changed During This Chat
- **Vision clarity:** From simple chatbot to sophisticated agentic consultant
- **Architecture maturity:** Multi-model orchestration + real-time learning
- **Testing methodology:** Autonomous validation inspired by cutting-edge AI research
- **Security posture:** Zero cross-org contamination with robust validation
- **User experience:** Human-like consultant that remembers everything about your org

### Key Breakthroughs
1. **Org-scoped learning architecture** — Cypher gets smarter within each org's context
2. **Insight validation workflow** — Human-in-the-loop prevents false scoring updates
3. **Constitutional testing framework** — Autonomous quality validation at scale
4. **Hybrid knowledge retrieval** — Session profile + dynamic facts for optimal context

### Product Differentiation
- **vs Google/Perplexity:** Cypher knows your organization deeply
- **vs Generic AI:** Security-specialized with framework expertise
- **vs Human consultants:** Available 24/7, perfect memory, continuously learning
- **vs Other security tools:** Conversational, not checkbox-based

---

*This session established the foundational architecture for Simplify IS as a genuinely differentiated AI security consultant platform. Next chat should focus on resolving the framework controls blocker and implementing the testing harness.*
