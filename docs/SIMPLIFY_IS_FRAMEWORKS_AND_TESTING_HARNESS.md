# Simplify IS — Frameworks Roadmap + Autonomous Testing Harness
## Session Summary: May 2026 | Decisions Locked + Spec Ready for Cursor

---

## SESSION OUTCOMES

This chat resolved two things:
1. **Which frameworks to add to Simplify IS and in what order** (especially AI-first positioning)
2. **How to autonomously test Cypher to gold standard quality** (Karpathy-style validation harness)

By the end of this session, the user (Vik) had:
- A revised framework roadmap with AI bundle pulled into Phase 1
- Decision: PCI-DSS already done (questions + mappings), so AI bundle becomes the Phase 1 priority
- Complete build spec for an autonomous test runner that runs unattended overnight (12–18 hrs)

---

## PART 1 — REVISED FRAMEWORK ROADMAP

### What Was Already Locked (Coming In)
- **MVP:** ISO 27001:2022, NIST CSF 2.0
- **Phase 1:** ASD Essential Eight, APRA CPS 234
- **Phase 3:** ISO 42001, PCI-DSS, HIPAA
- **Phase 4:** NIS2, DORA, GDPR

### What Vik Already Built During This Session
- **PCI-DSS** — questions and mappings complete (moved out of Phase 3, now done)

### NEW DECISION: AI-First Positioning Pulled to Phase 1

The AI governance bundle is now the centerpiece of Phase 1, alongside the AU compliance bundle.

#### The 3 AI Frameworks (Build in This Order)

**1. ISO/IEC 42001 — Build first**
- World's first certifiable AI management system standard
- Maps to ISO 27001's structure (Clauses 4–10 + ~38 Annex A controls)
- Reuses existing ISO 27001 conversational architecture
- Highest commercial value — procurement teams already speak its language
- Anchor framework for the AI bundle

**2. AU Voluntary AI Safety Standard — Build second**
- Only 10 guardrails — tiny content lift after 42001
- Mostly mappings to 42001 + AU presentation layer
- AU-defining, defensive positioning before mandatory guardrails arrive
- Aligned with AS ISO/IEC 42001:2023 and NIST AI RMF 1.0

**3. NIST AI RMF 1.0 — Build third**
- 4 functions: Govern, Map, Measure, Manage (~70 categories)
- Pairs with ISO 42001 the way NIST CSF pairs with ISO 27001
- Mostly last-mile work after 42001 + AU AI Safety mature
- Required for US federal procurement

#### EU AI Act Treatment
- **Not a standalone framework** — treat as regulatory overlay
- Cypher cross-references EU AI Act articles during 42001 conversations
- High-risk obligations map heavily onto 42001 controls
- Surface as feature of 42001 assessment, not separate flow

### REVISED Phase Roadmap (Final)

| Phase | Frameworks | Notes |
|-------|-----------|-------|
| **MVP** | ISO 27001:2022, NIST CSF 2.0 | Locked, in build |
| **Phase 1** | + Essential Eight, APRA CPS 234, **ISO 42001**, **AU Voluntary AI Safety Standard**, **NIST AI RMF**, **PCI-DSS** (already done) | AI-first + AU launch bundle |
| **Phase 2** | + AU Privacy Act + NDB, **SOC 2 Type II** | SOC 2 deferred — needs scoping-flow muscle built first |
| **Phase 3** | + HIPAA, **SOCI Act / CIRMP**, ISO 27701 | CIRMP needs underlying frameworks first |
| **Phase 4** | + NIS2, DORA, GDPR | EU expansion |
| **Skip / Much Later** | CMMC 2.0, IEC 62443, AESCSF standalone | Wrong ICP |

### Why This Order (Strategic Rationale)

- **AI window is now** — EU AI Act enforcement August 2026 is forcing
- **PCI-DSS done** means content pipeline proven, ready for harder frameworks
- **42001 first** teaches the system what AI controls look like
- **AU AI Safety nearly free** after 42001 (small + mappable)
- **NIST AI RMF third** because most work shared with 42001
- **SOC 2 deferred** — needs different product flow (TSC scoping) Cypher doesn't have yet
- **CIRMP deferred** — meta-framework requiring multiple underlying frameworks mature first
- **Cross-framework mappings table is the moat** — adding frameworks scales non-linearly because every new framework needs mapping to every existing one

### The Real Cost of Adding a Framework (Internalize This)

Each framework requires:
1. **Control content** (~14 long-form fields × N controls)
2. **Cross-framework mappings** (the silent killer — N² growth)
3. **Cypher prompt engineering** (vocabulary, ID format, version anchors)
4. **Scoring calibration** (CMMI 1–5 means different things per framework)
5. **Dashboard surface** (Framework views + Industry Domain mapping + Risk view)
6. **PDF export templates** (auditor expectations vary)
7. **Testing burden** (multiplies 100+ conversation harness)

**The thing that takes time is NOT writing questions** — Cypher does that conversationally. It's the cross-framework mapping work and scoring calibration, both of which scale non-linearly.

### Content Quality Risk for AI Frameworks

- Security frameworks have decades of consensus on "good"
- AI governance does NOT — harder judgment calls
- Cypher will be perceived as authoritative
- **Mitigation 1:** Phase 1 testing harness needs AI-specific adversarial cases
- **Mitigation 2:** Clearer "consultative guidance, not legal advice" disclaimer pattern for AI frameworks specifically

---

## PART 2 — AUTONOMOUS TESTING HARNESS

### Core Philosophy: Karpathy-Style Validation
Karpathy's AutoResearch ran 700 experiments in 2 days because **the evaluation function was cheap and automated**. The whole point: define success precisely enough that grading happens without a human in the loop.

### What Can Be Graded Automatically (4 Categories)

1. **Framework correctness** (deterministic regex) — "Did Cypher cite ISO A.5.17, not the deprecated 2013 ID? Did it use NIST CSF 2.0 GV.OC-01, not PR.AC-1 from 1.1?"
2. **Cross-framework consistency** (structured check against `control_mappings`) — "Signal for MFA correctly applied across ISO A.5.17 + NIST PR.AA-03 + Essential Eight ML2 + APRA CPS 234 + ISO 42001 + AU AI Safety guardrail 4?"
3. **Conversational rule adherence** (LLM judge) — "One question per turn. No bullets. No 'maturity' word. Max 2 sentences."
4. **Insight extraction accuracy** (LLM judge + ground truth) — "Given scripted message with 3 known signals, extracted those 3 (and not hallucinated a 4th)?"

### What Cannot Be Graded Automatically (Don't Try)
- "Does this feel like a human consultant?" — vibes, sample by hand
- "Did this save 30+ minutes vs Googling?" — only real users can tell

### THE THREE METRICS THAT MATTER (Narrowed from 8 Constitutional Principles)

| Metric | Target | How |
|--------|--------|-----|
| Framework citation accuracy | ≥99% | Deterministic regex |
| Cross-framework signal-reuse coverage | ≥92% | Structured check vs mappings table |
| Conversation rule adherence | ≥95% | Deterministic + light LLM judge |

Everything else gets sampled by hand from a stratified subset of 20 conversations per cycle.

---

## PART 3 — AUTONOMOUS RUN SETUP

### Decision: Use Vik's Local Machine
- Vik's machine has 64+ GB GPU, plenty of resources
- No need for cloud infrastructure
- Cursor writes the script; user kicks it off in terminal; closes Cursor; walks away
- Script keeps running in terminal (Cursor doesn't need to stay open)

### Database Decision: Use Existing simplify-dev Supabase
- No real production customers yet
- Test data deleted at end via cleanup SQL
- **What gets deleted:** test orgs, test users, test sessions, test responses, test signals, test transcripts
- **What stays:** framework content (`ft_*`), mappings (`control_mappings`), prompt updates, code fixes, RAG improvements, scoring fixes — all the actual learning

### Two-Terminal Setup
- **Terminal 1:** `npm run dev` (Simplify IS on localhost:3000)
- **Terminal 2:** `npm run test:autonomous` (test harness loops)

### Run Duration
- **Decision: 12–18 hours, NOT 48 hours**
- First 3–4 hours: massive gains (15–20pp improvements on obvious stuff)
- Hours 4–18: diminishing returns (5–8pp gains on subtler issues)
- After 18 hours: 1–2pp gains chasing edge cases of edge cases — not worth the cost
- Auto-stop on plateau (2 consecutive iterations <1% improvement)

### What Cypher Becomes Better At (Concrete Deliverables)

By the end of the run, you have:

1. **Updated prompt files** — `/orchestration/prompts/` rewritten based on what broke
2. **New rows in `control_mappings`** — missing cross-framework links added
3. **Fixed/enhanced `ft_*` content** — vague maturity tier descriptions rewritten
4. **RAG context builder improvements** — `/orchestration/rag/contextBuilder.ts` improved resolver
5. **Scoring engine fixes** — `/orchestration/scoring/maturityEngine.ts` weighting/algorithm fixes
6. **Signal extraction improvements** — tighter prompts to prevent hallucination

Each fix is a separate git commit with descriptive message.

---

## PART 4 — TEST HARNESS BUILD SPEC (FOR CURSOR)

### Mission
Build an autonomous test runner at `/test-harness/autonomous-validator.ts` that validates Cypher across all 7 seeded frameworks (ISO 27001:2022, NIST CSF 2.0, APRA CPS 234, ASD Essential Eight, ISO 42001, NIST AI RMF, AU Voluntary AI Safety Standard) and applies fixes automatically.

### Directory Structure to Create

```
/test-harness/
├── autonomous-validator.ts           # Main runner
├── personas/                         # 10 organizational archetypes
│   ├── healthcare-startup.ts
│   ├── fintech-apra-regulated.ts
│   ├── ai-company-eu-exposure.ts
│   ├── retail-pci-relevant.ts
│   ├── tech-saas-australian.ts
│   ├── manufacturing-soci-adjacent.ts
│   ├── education-data-handler.ts
│   ├── consulting-firm.ts
│   ├── financial-services-broker.ts
│   └── nonprofit-grant-funded.ts
├── scenarios/                        # 15 conversation flows
│   ├── happy-path-iso27001.ts
│   ├── happy-path-nist.ts
│   ├── happy-path-iso42001.ts
│   ├── happy-path-apra.ts
│   ├── happy-path-essential-eight.ts
│   ├── happy-path-nist-ai-rmf.ts
│   ├── happy-path-au-ai-safety.ts
│   ├── adversarial-iso2013-ids.ts
│   ├── adversarial-nist-1-1-ids.ts
│   ├── contradiction-mid-session.ts
│   ├── cross-framework-signal-reuse.ts
│   ├── ambiguous-na-justification.ts
│   ├── multi-framework-org.ts
│   ├── low-maturity-startup.ts
│   └── high-maturity-enterprise.ts
├── eval/
│   ├── framework-correctness.ts      # Deterministic regex
│   ├── signal-reuse-coverage.ts      # Checks mappings table
│   ├── conversation-rules.ts         # One question, no lists
│   ├── llm-judge.ts                  # Claude judges quality
│   └── ground-truth.ts               # Expert answers to compare
├── fix-applier/
│   ├── prompt-fixer.ts               # Updates /orchestration/prompts/
│   ├── mapping-fixer.ts              # Upserts control_mappings rows
│   ├── content-fixer.ts              # Updates ft_* tables
│   ├── rag-fixer.ts                  # Updates contextBuilder.ts
│   └── scoring-fixer.ts              # Updates maturityEngine.ts
├── results/
│   ├── iteration-N.json              # Per-iteration logs
│   └── final-report.md               # Human-readable summary
└── lib/
    ├── api-client.ts                 # Hits localhost:3000
    ├── claude-client.ts              # Anthropic SDK wrapper
    ├── supabase-admin.ts             # Test data ops
    ├── git-helper.ts                 # Auto-commit fixes
    └── logger.ts
```

### Core Loop Logic

```typescript
const CONFIG = {
  MAX_ITERATIONS: 12,
  MAX_HOURS: 18,
  CONVERSATIONS_PER_ITERATION: 20,
  PLATEAU_THRESHOLD: 0.01,            // 1% improvement = plateau
  PLATEAU_ITERATIONS: 2,              // 2 consecutive plateau = stop
  TARGET_FRAMEWORK_CORRECTNESS: 0.96,
  TARGET_SIGNAL_REUSE: 0.92,
  TARGET_CONVERSATION_RULES: 0.95,
  API_BASE: "http://localhost:3000/api/v1",
};

async function main() {
  const startTime = Date.now();
  const previousMetrics = [];
  
  // SETUP: Create test user once, reuse across iterations
  const { token, orgId } = await setupTestEnvironment();
  
  for (let i = 1; i <= CONFIG.MAX_ITERATIONS; i++) {
    // 1. Generate test conversations
    const conversations = generateConversationSet(20, i);
    
    // 2. Run conversations in parallel batches of 5
    const transcripts = await runConversationsParallel(conversations, token, orgId, 5);
    
    // 3. Grade automatically
    const grades = await gradeAllTranscripts(transcripts);
    const metrics = aggregateMetrics(grades);
    
    // 4. Save iteration log
    saveIterationLog(i, transcripts, grades, metrics);
    
    // 5. Check stopping conditions
    if (allTargetsMet(metrics)) break;
    if (timeExceeded(startTime)) break;
    if (hasPlateaued(previousMetrics, metrics)) break;
    
    // 6. Analyze failures, generate + apply fixes
    const failures = extractFailures(grades);
    const topFailures = prioritizeFailures(failures, 5);
    
    for (const failure of topFailures) {
      const fix = await analyzeFix(failure);              // Ask Claude
      const applied = await applyFix(fix);                // Deterministic
      if (applied.success) await commitFix(fix, failure); // Git commit
    }
    
    await sleep(5000);  // Wait for Next.js hot reload
    previousMetrics.push(metrics);
  }
  
  await generateFinalReport(previousMetrics);
}
```

### API Client Required Functions

```typescript
async function createTestUser(email, password, orgName, industry, teamSize): Promise<{userId, token, orgId}>
async function login(email, password): Promise<{token}>
async function startSession(token, orgId, frameworkId): Promise<{sessionId}>
async function sendMessage(token, sessionId, message): Promise<{
  cypherResponse: string,
  extractedSignals: Signal[],
  appliedToControls: string[],
  scoreUpdate?: ScoreUpdate
}>
async function getSessionState(token, sessionId): Promise<SessionState>
```

All requests include `Authorization: Bearer ${token}`.

### Persona Shape

```typescript
{
  name: "Healthcare Startup",
  orgProfile: {
    industry: "Healthcare",
    size: "20-50 employees",
    location: "Sydney, AU",
    frameworks: ["ISO 27001", "NIST CSF 2.0", "APRA CPS 234"],
    maturityLevel: "low",  // 1-2 on CMMI
  },
  voiceStyle: "casual, slightly nervous, simple language",
  knownFacts: [
    "Uses Office 365 for email",
    "MFA on admin accounts only, not all staff",
    "No formal incident response plan",
    "Stores PHI in EHR system (third-party)",
    // ...
  ],
  expectedSignalsPerFramework: {
    "ISO 27001": ["A.5.17", "A.5.24", "A.5.30", ...],
    "NIST CSF 2.0": ["GV.OC-01", "PR.AA-03", ...],
  },
  expectedScores: {
    "ISO 27001": { "access_identity": 1.8, "incident_mgmt": 1.2 }
  }
}
```

### Scenario Shape

```typescript
{
  name: "Adversarial: User uses ISO 2013 IDs",
  framework: "ISO 27001",
  persona: "tech-saas-australian",
  messages: [
    {
      turn: 1,
      user: "Hi, I want to assess against ISO 27001",
      expectedBehavior: "greeting + ask to be named or user's name"
    },
    {
      turn: 2,
      user: "Sure, call yourself Cypher. We're already compliant with A.9.2.1",
      expectedBehavior: "MUST use 2022 ID A.5.17, NOT 2013 A.9.2.1",
      mustNotContain: ["A.9.2.1", "A.9.2", "A.10.1", "ISO 27001:2013"],
      mustContain: ["A.5.17"]
    },
    // ... ~20 turns
  ],
  groundTruthSignals: [...],
  groundTruthMappings: [...]
}
```

### Eval Function Examples

**`framework-correctness.ts`** — deterministic, no LLM
```typescript
function checkFrameworkCorrectness(transcript, framework) {
  const violations = [];
  if (framework === "ISO 27001") {
    const forbidden2013 = /A\.([6-9]|1[0-8])\.\d+(\.\d+)?/g;
    transcript.cypherTurns.forEach((turn, idx) => {
      const matches = turn.text.match(forbidden2013);
      if (matches) violations.push({turn: idx, type: "forbidden_iso_2013_id", found: matches, severity: "critical"});
    });
  }
  if (framework === "NIST CSF 2.0") {
    const forbidden11 = /PR\.AC-\d+|PR\.IP-\d+/g;
    // similar logic
  }
  return {framework, pass: violations.length === 0, violations, score: ...};
}
```

**`signal-reuse-coverage.ts`** — checks against `control_mappings` table
```typescript
async function checkSignalReuse(transcript, supabase) {
  const violations = [];
  for (const signal of transcript.extractedSignals) {
    const expected = await supabase.from("control_mappings")
      .select("*").eq("control_id_a", signal.controlId);
    for (const mapping of expected.data) {
      if (!transcript.appliedToControls.includes(mapping.control_id_b)) {
        violations.push({signal, missedMapping: mapping, severity: "high"});
      }
    }
  }
  return {pass: violations.length === 0, violations};
}
```

### Fix Applier — Deterministic Only

Each fix type has a known input shape and known transformation. Cursor never executes arbitrary code — only applies specific edits to known files.

**Fix shape (returned by Claude analysis):**
```typescript
{
  type: "prompt_fix" | "mapping_fix" | "content_fix" | "rag_fix" | "scoring_fix",
  rootCause: "1-2 sentence explanation",
  fix: {
    // Shape depends on type
  },
  summary: "1-line description for git commit"
}
```

**Example fix applications:**

```typescript
// prompt-fixer.ts
async function applyPromptFix(fix) {
  const filePath = path.join(REPO_ROOT, fix.file);
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.includes(fix.change.from)) return {success: false, error: "Source not found"};
  fs.writeFileSync(filePath, content.replace(fix.change.from, fix.change.to));
  return {success: true};
}

// mapping-fixer.ts
async function applyMappingFix(fix, supabase) {
  await supabase.from("control_mappings").upsert(fix.row, {
    onConflict: "framework_a,control_id_a,framework_b,control_id_b"
  });
  return {success: true};
}
```

### Claude Analysis Prompt

```typescript
const prompt = `
You are analyzing a test failure in Cypher, an AI security consultant.

FAILURE DETAILS:
Framework: ${failure.framework}
Failure type: ${failure.type}
User message: "${failure.userMessage}"
Cypher's response: "${failure.cypherResponse}"
Expected behavior: ${failure.expected}
Actual issue: ${failure.actualIssue}

CONTEXT: ${failure.relevantContext}

CONSTRAINTS:
- Cypher MUST use ISO 27001:2022 (never 2013) and NIST CSF 2.0 (never 1.1)
- Cypher MUST follow signal-reuse via control_mappings table
- Cypher MUST follow one-question-per-turn, no bullets, no "maturity" word

POSSIBLE FIX TYPES (pick ONE):
1. prompt_fix
2. mapping_fix
3. content_fix
4. rag_fix
5. scoring_fix

Respond ONLY with valid JSON:
{
  "type": "...",
  "rootCause": "...",
  "fix": { ... },
  "summary": "..."
}
`;
```

Use `claude-sonnet-4-20250514`, max 2000 tokens.

### Git Auto-Commit

```typescript
async function commitFix(fix, failure) {
  const message = `Test harness fix: ${fix.summary}

Failure type: ${failure.type}
Framework: ${failure.framework}
Root cause: ${fix.rootCause}

Auto-applied by autonomous validator iteration ${currentIteration}.`;
  exec(`cd ${REPO_ROOT} && git add -A && git commit -m "${escapeShell(message)}"`);
}
```

### Final Report Format (`results/final-report.md`)

```markdown
# Cypher Autonomous Validation — Final Report

**Run started:** [timestamp]
**Run ended:** [timestamp]
**Total duration:** [hours]
**Total iterations:** [N]
**Total conversations tested:** [N × 20]
**Total API cost:** $[X.XX]

## Summary Metrics
| Metric | Iter 1 | Final | Improvement |
|--------|--------|-------|-------------|
| Framework Correctness | 78% | 97% | +19pp |
| Signal-Reuse Coverage | 71% | 94% | +23pp |
| Conversation Rules | 89% | 96% | +7pp |

## Per-Framework Performance
[Table for each of 7 frameworks]

## Fixes Applied (N total)
### Prompt Fixes (N)
- [Iteration X] Strengthened ISO 2022 anchor — [git SHA]

### Mapping Fixes (N)
- [Iteration X] Added 12 missing ISO 42001 ↔ NIST AI RMF mappings — [git SHA]

### Content / RAG / Scoring Fixes
- ...

## Remaining Issues
[Any failures still present in final iteration]

## Recommendations
[Production-ready? More testing needed?]

## Test Data Cleanup SQL
\`\`\`sql
DELETE FROM chat_transcripts WHERE organization_id IN (SELECT id FROM organizations WHERE name LIKE 'Test Org %');
DELETE FROM extracted_signals WHERE organization_id IN (SELECT id FROM organizations WHERE name LIKE 'Test Org %');
DELETE FROM control_responses WHERE organization_id IN (SELECT id FROM organizations WHERE name LIKE 'Test Org %');
DELETE FROM assessment_sessions WHERE organization_id IN (SELECT id FROM organizations WHERE name LIKE 'Test Org %');
DELETE FROM organizations WHERE name LIKE 'Test Org %';
DELETE FROM users WHERE email = 'test-cipher-validator@simplify.local';
\`\`\`
```

### Environment Variables (`/test-harness/.env.test`, gitignored)

```
ANTHROPIC_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
LOCAL_API_BASE=http://localhost:3000/api/v1
TEST_USER_EMAIL=test-cipher-validator@simplify.local
TEST_USER_PASSWORD=AutoTest_2026!@#
GIT_AUTHOR_NAME=AutonomousValidator
[email protected]
```

### Add to `package.json`

```json
{
  "scripts": {
    "test:autonomous": "ts-node --transpile-only test-harness/autonomous-validator.ts"
  }
}
```

### Critical Implementation Notes

1. **Hot reload:** Next.js auto-reloads on file changes. After applying fix, `await sleep(5000)`.
2. **Rate limits:** Add `await sleep(500)` between Claude API calls.
3. **Fail gracefully:** If a fix fails to apply, log it but don't crash. Move to next failure.
4. **Idempotency:** Test user creation checks if user exists first.
5. **Test isolation:** Each iteration creates fresh test org. Old test orgs accumulate — fine, deleted in cleanup.
6. **Commit frequency:** Commit each fix individually — granular git history is the deliverable.
7. **Logging:** Logger writes to stdout AND `results/run-log.txt`.
8. **Cost tracking:** Track tokens per iteration. Log to final report.
9. **Resume capability:** Support `--resume` flag (nice-to-have).
10. **Safety:** Never delete or modify framework content tables (`ft_*`) unless `content_fix` type is explicitly invoked. Never modify auth/security code.

### Definition of Done

- [ ] All files in directory structure created
- [ ] 10 personas, 15 scenarios written
- [ ] All 5 fix appliers implemented and manually tested with 1 example each
- [ ] Single iteration runs end-to-end without errors
- [ ] Final report generates correctly
- [ ] Git commits land properly
- [ ] Cleanup SQL provided in final report
- [ ] Tested with `--max-iterations 2` first to confirm flow before unleashing 18-hour run

---

## PART 5 — HOW TO ACTUALLY RUN IT

### Prerequisites Before Leaving Machine

1. ✅ All 7 frameworks seeded in `ft_*` tables (verify with manual control retrieval)
2. ✅ `control_mappings` table populated for all 7 frameworks (spot check ISO A.5.17 → NIST PR.AA-03)
3. ✅ `/api/v1/assessments/sessions` endpoint works (manually create session via curl/Postman)
4. ✅ `ANTHROPIC_API_KEY` in `.env.local`
5. ✅ `SUPABASE_SERVICE_KEY` in `.env.local`
6. ✅ Cursor has built test harness (use spec above)
7. ✅ Smoke test: run `--max-iterations 1 --conversations 3` (~5 min) and confirm full pipeline works

### Cursor Build Command

Open Cursor Composer (Cmd+I), tag relevant files:
```
@01_MASTER_CONTEXT.md
@02_AGENT_SPECS.md
@03_AGENTS_AND_HANDOFFS.md
@orchestration/
@app/api/v1/
```

Then paste this single instruction + the full spec from PART 4:
```
Build this autonomous test harness exactly as specified.
Create all files in /test-harness/.
Use existing API endpoints, Supabase schema, and orchestration code as context.
Ask before making architectural decisions that deviate from the spec.
```

Cursor takes 2–4 hours to build the harness with iteration.

### Watch Cursor For (Common Issues)

- API client uses correct endpoint paths (matches `/api/v1/` real routes)
- Supabase code uses correct column names (cross-reference with master context)
- Auth flow uses JWT correctly (`Authorization: Bearer ${token}`)
- Claude API model is `claude-sonnet-4-20250514`, not deprecated/wrong model

### Two-Terminal Run

```bash
# Terminal 1
npm run dev

# Terminal 2 — smoke test FIRST
npx ts-node test-harness/autonomous-validator.ts --max-iterations 1 --conversations 3

# Terminal 2 — real run after smoke test passes
npx ts-node test-harness/autonomous-validator.ts
```

Walk away. Come back in 12–18 hours.

### What You Get Back

1. **`final-report.md`** — Iteration-by-iteration metrics, all fixes with diffs, remaining issues, recommendations
2. **Git history** — 20–40 individual commits, each describing one fix
3. **Updated production code** — prompts, mappings, content, RAG, scoring all improved
4. **Per-iteration JSON logs** — Replay any conversation transcript
5. **Cost accounting** — Token spend breakdown per framework and per iteration
6. **Cleanup SQL** — One command to delete all test data

### Expected API Cost
- ~$50–300 for full 12–18 hour run
- ~$0.30–0.50 per conversation (8k user + 12k Cypher + 5k judge tokens)
- 15–20 iterations × 20 conversations × ~$0.40 = ~$120–160

### Expected Outcome
- Starting baseline: framework correctness ~78%, signal-reuse ~71%, conversation rules ~89%
- Target final state: framework correctness ≥96%, signal-reuse ≥92%, conversation rules ≥95%
- Cypher promoted from "okay" to "gold standard"

---

## CRITICAL NEXT STEPS (When Starting New Chat)

1. **Confirm framework seeding for all 7 frameworks** — biggest blocker, must be done before harness runs
2. **Confirm `control_mappings` table populated** — silent killer if incomplete (false positives)
3. **Run Agent 9** if not done — auth UI/API wiring
4. **Have Cursor build test harness using spec in PART 4**
5. **Smoke test with `--max-iterations 1 --conversations 3`** before full overnight run
6. **Kick off real run before going AFK**
7. **Read final report on return, decide: ship or run another cycle**

---

## OPEN QUESTIONS FOR NEXT CHAT

- Are framework controls actually seeded? (PCI-DSS confirmed yes, others to verify)
- Is `control_mappings` table populated for all 7 framework pairs?
- Status of Agent 9 auth wiring?
- Has Cursor finished writing the framework questions Vik mentioned were in progress?

---

## REFERENCE: KEY FILE LOCATIONS

```
Project root:        ~/Documents/Code/simplify-is/
CLAUDE.md:           ~/Documents/Code/simplify-is/CLAUDE.md
Agent files:         ~/Documents/Code/simplify-is/agents/
Test harness (new):  ~/Documents/Code/simplify-is/test-harness/
Supabase env:        /Users/vik/Documents/vik-so-dev/.env
Anthropic key:       /Users/vik/Documents/code-ai/Social-content/.env
Supabase project:    simplify-dev (ref: gksfyflhnihdizegeglc)
```

---

*Session date: May 2026. Generated for upload to next Claude project chat to continue work without losing context. Pairs with existing project knowledge files (00-05).*
