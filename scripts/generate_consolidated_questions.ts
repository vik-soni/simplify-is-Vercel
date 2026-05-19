/**
 * Agent 18 — Consolidated Question Generation (Phases 1-3)
 *
 * v2: fixed audit prompt to stop rejecting valid output because of:
 *   - hallucinated "American spellings" that aren't in the text
 *   - second-guessing the prescribed framework maturity model
 *
 * One-time script. Run once via:
 *   npx tsx scripts/generate_consolidated_questions.ts
 *
 * Optional args:
 *   --limit N             Process only the first N controls (testing)
 *   --framework FRAMEWORK Restrict to one framework
 *   --resume              Skip controls already in consolidated_questions
 *   --preview             Stop after first 5 controls and print for review
 *   --no-audit            Skip the post-generation Claude audit gate (faster, lower quality)
 *
 * Env required (in simplify-is/.env.local or control-research/.env):
 *   SUPABASE_URL  or  NEXT_PUBLIC_SUPABASE_URL  or  SIMPLIFY_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY  or  SIMPLIFY_SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 *   CLAUDE_MODEL (optional, defaults to claude-sonnet-4-20250514)
 *
 * Phases:
 *   1. Generate consolidated questions + conversational answer options + detail-question mappings per framework's PRESCRIBED maturity model
 *   2. Cross-framework propagation diagnostic (reads control_mappings)
 *   3. Quality audit pass — Claude self-reviews a 10% sample
 *
 * Quality gates (in order):
 *   - Schema validation (Zod)
 *   - Banned phrases (programmatic regex)
 *   - American spelling detection (programmatic regex on literal output text only)
 *   - Detail-map completeness (every detail question must be mapped)
 *   - Maturity model key match (must use the EXACT keys for this framework's PRESCRIBED model)
 *   - Optional Claude audit (only checks conversational tone + coverage — does NOT second-guess framework choice)
 *
 * Up to 3 retry attempts per control. Failed controls logged for manual review.
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// ----------------------------------------------------------------------------
// Framework maturity model registry — PRESCRIBED, NOT NEGOTIABLE
// These were chosen by the product team. Do not allow Claude (generator or
// auditor) to "correct" them based on what a framework "really" uses.
// ----------------------------------------------------------------------------

type MaturityModelKind = "nist_csf_4tier" | "nist_ai_rmf" | "iso_3level" | "asd_e8" | "binary_compliance" | "vaiss_guardrail";

interface MaturityLevelSpec {
  level: number;
  key: string;
  display_label_hint: string;
  native_name: string;
}

interface FrameworkMaturityModel {
  framework: string;
  kind: MaturityModelKind;
  levels: MaturityLevelSpec[];
  notes: string;
  product_decision: string; // Why we chose this — passed to the audit prompt so it stops second-guessing
}

const FRAMEWORK_MATURITY_MODELS: Record<string, FrameworkMaturityModel> = {
  "NIST_CSF_2.0": {
    framework: "NIST_CSF_2.0",
    kind: "nist_csf_4tier",
    levels: [
      { level: 1, key: "tier1", display_label_hint: "ad-hoc, informal, only when reminded", native_name: "Tier 1 — Partial" },
      { level: 2, key: "tier2", display_label_hint: "risk-aware, some practices in place, not systematic", native_name: "Tier 2 — Risk Informed" },
      { level: 3, key: "tier3", display_label_hint: "approved policy, implemented consistently, repeatable", native_name: "Tier 3 — Repeatable" },
      { level: 4, key: "tier4", display_label_hint: "tested, measured, continuously improved, integrated into business", native_name: "Tier 4 — Adaptive" },
    ],
    notes: "Four-tier capability maturity using NIST CSF's native Implementation Tiers.",
    product_decision: "NIST CSF 2.0 uses Implementation Tiers (Partial, Risk Informed, Repeatable, Adaptive). The product team has applied these tiers as per-control maturity levels for assessment purposes. This is the prescribed model — do not suggest 'maturity levels like Initial/Managed/Defined' or other alternatives.",
  },
  "NIST_CSF": { // legacy alias — same as NIST_CSF_2.0
    framework: "NIST_CSF",
    kind: "nist_csf_4tier",
    levels: [
      { level: 1, key: "tier1", display_label_hint: "ad-hoc, informal", native_name: "Tier 1 — Partial" },
      { level: 2, key: "tier2", display_label_hint: "risk-aware, partial", native_name: "Tier 2 — Risk Informed" },
      { level: 3, key: "tier3", display_label_hint: "approved and implemented", native_name: "Tier 3 — Repeatable" },
      { level: 4, key: "tier4", display_label_hint: "tested and measured", native_name: "Tier 4 — Adaptive" },
    ],
    notes: "Legacy alias for NIST_CSF_2.0.",
    product_decision: "NIST CSF Implementation Tiers used as per-control maturity. Prescribed by product team.",
  },
  "NIST_AI_RMF": {
    framework: "NIST_AI_RMF",
    kind: "nist_ai_rmf",
    levels: [
      { level: 1, key: "absent",     display_label_hint: "the function is not performed", native_name: "Absent" },
      { level: 2, key: "emerging",   display_label_hint: "the function is partially performed, ad-hoc", native_name: "Emerging" },
      { level: 3, key: "established",display_label_hint: "the function is performed consistently and documented", native_name: "Established" },
      { level: 4, key: "optimised",  display_label_hint: "the function is measured, tested, and continuously improved", native_name: "Optimised" },
    ],
    notes: "Four capability levels: Absent / Emerging / Established / Optimised.",
    product_decision: "NIST AI RMF is function-based with no native maturity levels. The product team has prescribed a four-level capability scale: Absent, Emerging, Established, Optimised. Use these exact names.",
  },
  "ISO_27001_2022": {
    framework: "ISO_27001_2022",
    kind: "iso_3level",
    levels: [
      { level: 1, key: "no",      display_label_hint: "the control is absent or only acknowledged in conversation", native_name: "No" },
      { level: 2, key: "partial", display_label_hint: "the control is partially in place, gaps remain", native_name: "Partial" },
      { level: 3, key: "yes",     display_label_hint: "the control is fully in place and operating", native_name: "Yes" },
    ],
    notes: "Three-level binary-flavoured: No / Partial / Yes.",
    product_decision: "ISO 27001:2022 is a binary certification standard. The product team has prescribed a three-level scale (No / Partial / Yes) for assessment purposes because true binary loses too much nuance. This is the model — do not suggest 'Not implemented / Partially implemented / Implemented' or 'Initial / Managed / Defined' or any other alternative. Use exactly: No, Partial, Yes.",
  },
  "ISO27001": { // legacy alias
    framework: "ISO27001",
    kind: "iso_3level",
    levels: [
      { level: 1, key: "no",      display_label_hint: "absent", native_name: "No" },
      { level: 2, key: "partial", display_label_hint: "partial", native_name: "Partial" },
      { level: 3, key: "yes",     display_label_hint: "fully in place", native_name: "Yes" },
    ],
    notes: "Legacy alias for ISO_27001_2022.",
    product_decision: "ISO 27001 binary-flavoured three-level (No / Partial / Yes). Prescribed by product team.",
  },
  "ISO42001": {
    framework: "ISO42001",
    kind: "iso_3level",
    levels: [
      { level: 1, key: "no",      display_label_hint: "AI management practice absent", native_name: "No" },
      { level: 2, key: "partial", display_label_hint: "AI management practice partial", native_name: "Partial" },
      { level: 3, key: "yes",     display_label_hint: "AI management practice fully in place", native_name: "Yes" },
    ],
    notes: "Three-level: No / Partial / Yes.",
    product_decision: "ISO 42001 (AI management) prescribed by product team as No / Partial / Yes three-level scale for assessment purposes. Do not suggest alternatives.",
  },
  "PCI_DSS": {
    framework: "PCI_DSS",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "control not in place — fails the requirement", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "control fully in place — meets the requirement", native_name: "Compliant" },
    ],
    notes: "Binary compliance: Non-Compliant / Compliant.",
    product_decision: "PCI DSS is a binary compliance standard at the requirement level. The product team has prescribed a two-level model: Non-Compliant / Compliant. Use exactly these two levels. Do not introduce 'partially compliant' or other intermediate states.",
  },
  "APRA_CPS_230": {
    framework: "APRA_CPS_230",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "obligation not met", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "obligation met", native_name: "Compliant" },
    ],
    notes: "Binary compliance.",
    product_decision: "APRA CPS 230 (operational risk) prescribed by product team as binary: Non-Compliant / Compliant.",
  },
  "APRA_CPS_234": {
    framework: "APRA_CPS_234",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "obligation not met", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "obligation met", native_name: "Compliant" },
    ],
    notes: "Binary compliance.",
    product_decision: "APRA CPS 234 (information security) prescribed by product team as binary: Non-Compliant / Compliant.",
  },
  "ASD_E8": {
    framework: "ASD_E8",
    kind: "asd_e8",
    levels: [
      { level: 0, key: "ml0", display_label_hint: "mitigation strategy not implemented in any meaningful way", native_name: "Maturity Level 0" },
      { level: 1, key: "ml1", display_label_hint: "partly aligned with the mitigation strategy intent — protects against opportunistic attacks", native_name: "Maturity Level 1" },
      { level: 2, key: "ml2", display_label_hint: "mostly aligned with the mitigation strategy intent — protects against targeted attacks", native_name: "Maturity Level 2" },
      { level: 3, key: "ml3", display_label_hint: "fully aligned with the mitigation strategy intent — protects against sophisticated and persistent attacks", native_name: "Maturity Level 3" },
    ],
    notes: "ASD Essential Eight native ML0-ML3 tradecraft-based model.",
    product_decision: "ASD Essential Eight uses its OWN native Maturity Levels 0-3 (ML0, ML1, ML2, ML3). This is the official ASD model. Use exactly these four levels.",
  },
  "AU_VAISS": {
    framework: "AU_VAISS",
    kind: "vaiss_guardrail",
    levels: [
      { level: 1, key: "not_adopted",      display_label_hint: "guardrail not adopted", native_name: "Not Adopted" },
      { level: 2, key: "partially_adopted",display_label_hint: "guardrail partially adopted, gaps remain", native_name: "Partially Adopted" },
      { level: 3, key: "adopted",          display_label_hint: "guardrail fully adopted and embedded", native_name: "Adopted" },
    ],
    notes: "Guardrail adoption: Not Adopted / Partially Adopted / Adopted.",
    product_decision: "AU Voluntary AI Safety Standard uses guardrails (not maturity levels). The product team has prescribed a three-level adoption scale: Not Adopted, Partially Adopted, Adopted. Use exactly these three.",
  },
};

// ----------------------------------------------------------------------------
// Banned phrases — flagged in quality gate and trigger retry
// ----------------------------------------------------------------------------

const BANNED_PHRASES_RE: RegExp[] = [
  /\bhow mature is\b/i,
  /\bwhat is the maturity level\b/i,
  /\bdoes your organi[sz]ation have\b/i,
  /\bhave you established\b/i,
  /\bis there a formal\b/i,
  /\bdo you have a documented\b/i,
  /\bare you compliant\b/i,
  /\bdo you maintain\b/i,
  /\bdoes your organi[sz]ation maintain\b/i,
  /\bis there documentation\b/i,
  /\bhas your organi[sz]ation implemented\b/i,
];

const AMERICAN_SPELLINGS_RE: { pattern: RegExp; australian: string }[] = [
  { pattern: /\borganization\b/gi, australian: "organisation" },
  { pattern: /\borganizations\b/gi, australian: "organisations" },
  { pattern: /\borganizational\b/gi, australian: "organisational" },
  { pattern: /\borganize\b/gi, australian: "organise" },
  { pattern: /\borganized\b/gi, australian: "organised" },
  { pattern: /\borganizing\b/gi, australian: "organising" },
  { pattern: /\bauthorize\b/gi, australian: "authorise" },
  { pattern: /\bauthorized\b/gi, australian: "authorised" },
  { pattern: /\brealize\b/gi, australian: "realise" },
  { pattern: /\brealized\b/gi, australian: "realised" },
  { pattern: /\bcenter\b/gi, australian: "centre" },
  { pattern: /\bdefense\b/gi, australian: "defence" },
  { pattern: /\bcatalog\b/gi, australian: "catalogue" },
  { pattern: /\blicense\b/gi, australian: "licence" },
  { pattern: /\bcolor\b/gi, australian: "colour" },
  { pattern: /\bbehavior\b/gi, australian: "behaviour" },
  { pattern: /\bcustomize\b/gi, australian: "customise" },
  { pattern: /\bprioritize\b/gi, australian: "prioritise" },
  { pattern: /\boptimization\b/gi, australian: "optimisation" },
  { pattern: /\banalyze\b/gi, australian: "analyse" },
  { pattern: /\banalyzed\b/gi, australian: "analysed" },
  { pattern: /\bjeopardize\b/gi, australian: "jeopardise" },
];

function enforceAustralianEnglish(text: string): string {
  let out = text;
  for (const { pattern, australian } of AMERICAN_SPELLINGS_RE) {
    out = out.replace(pattern, australian);
  }
  return out;
}

function hasBannedPhrase(text: string): RegExp | null {
  for (const re of BANNED_PHRASES_RE) {
    if (re.test(text)) return re;
  }
  return null;
}

function findRemainingAmericanSpellings(text: string): string[] {
  const found: string[] = [];
  for (const { pattern } of AMERICAN_SPELLINGS_RE) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches);
  }
  return found;
}

// ----------------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------------

const ConsolidationSchema = z.object({
  consolidated_prompt: z.string().min(15).max(300),
  question_type: z.enum(["single_select", "slider", "drag_drop", "multi_select", "segmented"]),
  maturity_levels: z.array(
    z.object({
      level: z.number().int(),
      key: z.string(),
      native_name: z.string(),
      conversational_label: z.string().min(8),
    }),
  ).min(2).max(5),
  detail_map: z.array(
    z.object({
      detail_question_id: z.string().uuid(),
      required_maturity_level: z.number().int(),
      implied_positive_answer_key: z.string(),
    }),
  ),
  rationale: z.string().min(20),
});

type ConsolidationOutput = z.infer<typeof ConsolidationSchema>;

interface DetailQuestion {
  id: string;
  framework: string;
  control_id: string;
  question_sequence: number;
  question_text: string;
  answer_options: unknown;
  positive_answer_keys: string[] | null;
  cypher_guidance_statement: string | null;
}

// ----------------------------------------------------------------------------
// Prompt builders
// ----------------------------------------------------------------------------

function getMaturityModel(framework: string): FrameworkMaturityModel {
  const model = FRAMEWORK_MATURITY_MODELS[framework];
  if (!model) return FRAMEWORK_MATURITY_MODELS["ISO_27001_2022"];
  return model;
}

function buildGenerationPrompt(args: {
  framework: string;
  controlId: string;
  controlsCatalogContext: string | null;
  detailQuestions: DetailQuestion[];
  retryReason?: string;
}): string {
  const model = getMaturityModel(args.framework);
  const levelsBlock = model.levels
    .map((l) => `  - level ${l.level} | key "${l.key}" | native name "${l.native_name}" — ${l.display_label_hint}`)
    .join("\n");

  const numberedDetail = args.detailQuestions
    .map((q, i) => {
      const opts = JSON.stringify(q.answer_options);
      const positives = JSON.stringify(q.positive_answer_keys ?? []);
      return `${i + 1}. [${q.id}] ${q.question_text}\n     options: ${opts}\n     positive_keys: ${positives}\n     cypher_guidance: ${q.cypher_guidance_statement ?? "(none)"}`;
    })
    .join("\n\n");

  const retryNote = args.retryReason
    ? `\n\nIMPORTANT: Your previous attempt was rejected. Reason: ${args.retryReason}\nFix the specific issues above and try again.`
    : "";

  return `You are a friendly Australian compliance consultant. You write conversational questions, not auditor jargon.

CONTROL CONTEXT
Framework: ${args.framework}
Control ID: ${args.controlId}
What this control is about: ${args.controlsCatalogContext ?? "(no catalogue context — work from the detail questions below)"}

PRESCRIBED MATURITY MODEL for ${args.framework}
${model.notes}

PRODUCT DECISION (this is locked, do not propose alternatives):
${model.product_decision}

The levels you MUST use (exact keys, exact native names):
${levelsBlock}

DETAIL QUESTIONS (${args.detailQuestions.length}) that this control currently asks
${numberedDetail}

YOUR JOB
Produce ONE consolidated, conversational question that captures the maturity progression for this control using the EXACT levels above.

For each maturity level, produce a "conversational_label" — an everyday-language description of what that level looks like in practice. Australian English. No compliance jargon in labels (or only minimal where unavoidable). Examples:
  Good: "We back up when we remember to, or not at all."
  Good: "Backups run automatically and we've successfully restored at least once."
  Bad: "Backup policy formally documented and approved by management."

QUESTION RULES
  - 8 to 25 words.
  - Sound like a real person asking, not a framework restatement.
  - Mention concrete situations where possible ("when a laptop is lost", "if your cloud provider goes down").
  - Australian English in the question (organisation, programme, behaviour, authorise, analyse, optimise).
  - BANNED OPENERS: "How mature is", "What is the maturity level of", "Does your organisation have", "Have you established", "Is there a formal", "Are you compliant", "Do you maintain", "Has your organisation implemented".

ANSWER LABEL RULES
  - One conversational_label per prescribed maturity level above.
  - Lowest level: honest, not punitive — "we wing it", "we haven't really thought about it", "it happens when someone remembers".
  - Top level: concrete — what tested / measured / continuously improved actually looks like for THIS specific control.

DETAIL MAP RULES
Every detail question above MUST be mapped to the maturity level at which its positive answer becomes a prerequisite. For each detail question, pick the answer option KEY (from its positive_answer_keys) that represents the implied positive answer at its required level.

OUTPUT — STRICT JSON, no prose around it:
{
  "consolidated_prompt": "the single conversational question",
  "question_type": "single_select | slider | drag_drop | multi_select | segmented",
  "maturity_levels": [
    {
      "level": <numeric level from PRESCRIBED model>,
      "key": "<EXACT key string from PRESCRIBED model>",
      "native_name": "<EXACT native_name from PRESCRIBED model>",
      "conversational_label": "<everyday-language description for this level>"
    }
  ],
  "detail_map": [
    {
      "detail_question_id": "<uuid from detail questions above>",
      "required_maturity_level": <numeric level>,
      "implied_positive_answer_key": "<key from that detail question's positive_answer_keys>"
    }
  ],
  "rationale": "2-3 sentences explaining how detail questions map to the prescribed levels"
}${retryNote}`;
}

function buildAuditPrompt(args: {
  framework: string;
  controlId: string;
  consolidated: ConsolidationOutput;
  detailQuestions: DetailQuestion[];
}): string {
  const model = getMaturityModel(args.framework);
  return `You are auditing a consolidated compliance question for the simplify.is platform. Be CONCISE and PRECISE.

CONTEXT — CRITICAL
The maturity model used in this output is PRESCRIBED by the product team. It is not Claude's job to evaluate whether this matches the framework's official maturity scheme. The product team has chosen this scale deliberately and it is FIXED.

PRESCRIBED maturity model for ${args.framework} (do NOT flag this as wrong):
${model.product_decision}

Levels used (these are correct, do not propose alternatives):
${model.levels.map((l) => `  - ${l.native_name} (key: ${l.key})`).join("\n")}

WHAT TO AUDIT — ONLY THESE FOUR CRITERIA
  A. CONVERSATIONAL TONE: Does the question sound like a real Australian consultant asking, not a framework restatement? Is it under 25 words?
  B. AUSTRALIAN ENGLISH: Are there any literal American spellings (organization, defense, analyze, color, behavior, customize) in the consolidated_prompt or any conversational_label? Only flag spellings that ACTUALLY appear in the text below. Do not flag "implied" or "could be" American spellings.
  C. HONEST LOWEST LEVEL: Does the lowest maturity level honestly describe absence without being punitive? ("we wing it" good; "non-compliant failure" bad)
  D. COVERAGE: Do the maturity labels collectively cover what the detail questions ask about, at least at a thematic level? Specific elements that are missing should be noted but only if a critical theme is absent — not if every detail nuance is missing.

DO NOT AUDIT
  - The framework maturity model choice (it is prescribed and correct)
  - Whether the framework "really" uses different levels
  - Whether ISO 27001 / NIST CSF / etc. should use Initial/Managed/Defined or any other alternative
  - Spellings or words that don't literally appear in the output

Framework: ${args.framework}
Control: ${args.controlId}

Consolidated question:
"${args.consolidated.consolidated_prompt}"

Maturity levels:
${args.consolidated.maturity_levels.map((l) => `  - ${l.native_name}: ${l.conversational_label}`).join("\n")}

Rationale: ${args.consolidated.rationale}

Detail questions this should cover thematically:
${args.detailQuestions.map((q, i) => `${i + 1}. ${q.question_text}`).join("\n")}

Output strict JSON:
{
  "verdict": "PASS" | "FAIL",
  "issues": ["specific issue 1 with literal evidence", "specific issue 2"],
  "suggestions": "if FAIL, one sentence on what to change"
}

Verdict guidance:
  - PASS if the output is conversational, has no LITERAL American spellings, has an honest lowest level, and covers the themes of detail questions. Minor coverage gaps are OK.
  - FAIL only if there is a CONCRETE problem with literal evidence (a banned phrase that's actually present, an American spelling that's actually in the text, a punitive lowest-level label, or a major coverage theme missing).
  - Do NOT fail for "could be more specific" or "framework typically uses different levels" — those are not failures.`;
}

const AuditSchema = z.object({
  verdict: z.enum(["PASS", "FAIL"]),
  issues: z.array(z.string()),
  suggestions: z.string().optional(),
});

function parseJsonObject(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in response");
  return JSON.parse(match[0]);
}

// ----------------------------------------------------------------------------
// Supabase + Anthropic clients
// ----------------------------------------------------------------------------

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SIMPLIFY_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ??
  process.env.SIMPLIFY_SUPABASE_SERVICE_ROLE_KEY;

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514";

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_KEY in env");
if (!ANTHROPIC_KEY) throw new Error("Missing ANTHROPIC_API_KEY in env");

const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
const claude = new Anthropic({ apiKey: ANTHROPIC_KEY });

// ----------------------------------------------------------------------------
// Data fetchers
// ----------------------------------------------------------------------------

async function fetchAllDetailQuestions(frameworkFilter?: string): Promise<DetailQuestion[]> {
  const pageSize = 1000;
  let from = 0;
  const all: DetailQuestion[] = [];
  while (true) {
    let query = db
      .from("control_assessment_questions")
      .select(
        "id,framework,control_id,question_sequence,question_text,answer_options,positive_answer_keys,cypher_guidance_statement",
      )
      .range(from, from + pageSize - 1);
    if (frameworkFilter) query = query.eq("framework", frameworkFilter);
    const { data, error } = await query;
    if (error) throw error;
    const batch = (data ?? []) as unknown as DetailQuestion[];
    all.push(...batch);
    if (batch.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function fetchControlContext(framework: string, controlId: string): Promise<string | null> {
  const candidates = [
    controlId,
    `${framework}_${controlId}`,
    `${framework.replace(/_/g, "")}_${controlId}`,
    `NIST_CSF_${controlId}`,
    `ISO_${controlId}`,
    `PCI_DSS_${controlId}`,
    `APRA_${controlId}`,
    `ASD_${controlId}`,
  ];
  for (const c of candidates) {
    const { data } = await db
      .from("controls")
      .select("control_name,what_it_means,why_it_matters,what_is_expected")
      .eq("control_id", c)
      .maybeSingle();
    if (data) {
      const d = data as Record<string, unknown>;
      return [
        d.control_name && `Name: ${d.control_name}`,
        d.what_it_means && `What it means: ${d.what_it_means}`,
        d.why_it_matters && `Why it matters: ${d.why_it_matters}`,
        d.what_is_expected && `What is expected: ${d.what_is_expected}`,
      ]
        .filter(Boolean)
        .join("\n");
    }
  }
  return null;
}

async function alreadyGenerated(framework: string, controlId: string): Promise<boolean> {
  const { data } = await db
    .from("consolidated_questions")
    .select("id")
    .eq("framework", framework)
    .eq("control_id", controlId)
    .maybeSingle();
  return !!data;
}

// ----------------------------------------------------------------------------
// Generation with retry + quality gates
// ----------------------------------------------------------------------------

interface GenerateArgs {
  framework: string;
  controlId: string;
  detailQuestions: DetailQuestion[];
  maxAttempts: number;
  runAudit: boolean;
  log: (s: string) => void;
}

async function generateForControl(
  args: GenerateArgs,
): Promise<{ result: ConsolidationOutput; attempts: number } | { error: string; attempts: number }> {
  const detailIds = new Set(args.detailQuestions.map((q) => q.id));
  const catalogContext = await fetchControlContext(args.framework, args.controlId);
  const expectedModel = getMaturityModel(args.framework);
  const expectedKeys = new Set(expectedModel.levels.map((l) => l.key));

  let retryReason: string | undefined;
  for (let attempt = 1; attempt <= args.maxAttempts; attempt++) {
    try {
      const prompt = buildGenerationPrompt({
        framework: args.framework,
        controlId: args.controlId,
        controlsCatalogContext: catalogContext,
        detailQuestions: args.detailQuestions,
        retryReason,
      });
      const resp = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 6000,
        messages: [{ role: "user", content: prompt }],
      });
      const text = resp.content[0]?.type === "text" ? resp.content[0].text : "";
      const raw = parseJsonObject(text);
      const parsed = ConsolidationSchema.parse(raw);

      // Programmatic Australian English enforcement
      parsed.consolidated_prompt = enforceAustralianEnglish(parsed.consolidated_prompt);
      parsed.maturity_levels = parsed.maturity_levels.map((l) => ({
        ...l,
        conversational_label: enforceAustralianEnglish(l.conversational_label),
      }));
      parsed.rationale = enforceAustralianEnglish(parsed.rationale);

      // Gate 1: banned phrases
      const banned = hasBannedPhrase(parsed.consolidated_prompt);
      if (banned) {
        retryReason = `Banned phrase ${banned} in consolidated_prompt. Rewrite the question opener.`;
        args.log(`  attempt ${attempt} REJECTED: banned phrase ${banned}`);
        continue;
      }

      // Gate 2: detail map completeness
      const mapIds = new Set(parsed.detail_map.map((m) => m.detail_question_id));
      const missing = [...detailIds].filter((id) => !mapIds.has(id));
      if (missing.length > 0) {
        retryReason = `detail_map is missing ${missing.length} of ${detailIds.size} detail questions. Include EVERY detail question id from the list above.`;
        args.log(`  attempt ${attempt} REJECTED: missing ${missing.length} detail mappings`);
        continue;
      }

      // Gate 3: maturity model keys must match exactly
      const actualKeys = new Set(parsed.maturity_levels.map((l) => l.key));
      const missingKeys = [...expectedKeys].filter((k) => !actualKeys.has(k));
      const extraKeys = [...actualKeys].filter((k) => !expectedKeys.has(k));
      if (missingKeys.length > 0 || extraKeys.length > 0) {
        retryReason = `Your maturity_levels keys ${JSON.stringify([...actualKeys])} don't match the prescribed model. Expected keys: ${JSON.stringify([...expectedKeys])}. Use EXACTLY those keys, no fewer, no more.`;
        args.log(`  attempt ${attempt} REJECTED: maturity key mismatch (missing ${JSON.stringify(missingKeys)}, extra ${JSON.stringify(extraKeys)})`);
        continue;
      }

      // Gate 4: literal American spellings (after enforcement, should be zero)
      const americanInPrompt = findRemainingAmericanSpellings(parsed.consolidated_prompt);
      const americanInLabels = parsed.maturity_levels.flatMap((l) =>
        findRemainingAmericanSpellings(l.conversational_label),
      );
      if (americanInPrompt.length + americanInLabels.length > 0) {
        // Should not happen after enforcement, but keep gate as belt and braces
        retryReason = `Literal American spellings remain after enforcement: ${[...americanInPrompt, ...americanInLabels].join(", ")}. Use Australian spelling.`;
        args.log(`  attempt ${attempt} REJECTED: literal American spellings`);
        continue;
      }

      // Gate 5 (optional): Claude audit
      if (args.runAudit) {
        const auditPrompt = buildAuditPrompt({
          framework: args.framework,
          controlId: args.controlId,
          consolidated: parsed,
          detailQuestions: args.detailQuestions,
        });
        const auditResp = await claude.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 800,
          messages: [{ role: "user", content: auditPrompt }],
        });
        const auditText = auditResp.content[0]?.type === "text" ? auditResp.content[0].text : "";
        try {
          const audit = AuditSchema.parse(parseJsonObject(auditText));
          if (audit.verdict === "FAIL") {
            retryReason = `Audit FAILED: ${audit.issues.join("; ")}. ${audit.suggestions ?? ""}`;
            args.log(`  attempt ${attempt} AUDIT FAIL: ${audit.issues.join("; ")}`);
            continue;
          }
        } catch {
          // Audit parse failure — log but don't fail the generation
          args.log(`  attempt ${attempt} audit parse failed, proceeding`);
        }
      }

      args.log(`  attempt ${attempt} PASS`);
      return { result: parsed, attempts: attempt };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      retryReason = `Previous attempt failed: ${msg}. Output strictly valid JSON matching the schema.`;
      args.log(`  attempt ${attempt} ERROR: ${msg}`);
    }
  }
  return { error: `Failed after ${args.maxAttempts} attempts. Last reason: ${retryReason ?? "unknown"}`, attempts: args.maxAttempts };
}

// ----------------------------------------------------------------------------
// Phase 1: Generate per control
// ----------------------------------------------------------------------------

interface PhaseFlags {
  limit?: number;
  framework?: string;
  resume: boolean;
  preview: boolean;
  runAudit: boolean;
}

async function phase1Generate(flags: PhaseFlags, logPath: string): Promise<{ ok: number; failures: string[] }> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };

  log(`\n=== Phase 1: Consolidated question generation ===`);
  log(`Audit gate: ${flags.runAudit ? "ENABLED" : "DISABLED"}`);
  log(`Fetching detail questions${flags.framework ? ` for framework ${flags.framework}` : ""}...`);

  const all = await fetchAllDetailQuestions(flags.framework);
  log(`Fetched ${all.length} detail rows.`);

  const byControl = new Map<string, DetailQuestion[]>();
  for (const q of all) {
    const key = `${q.framework}|${q.control_id}`;
    const arr = byControl.get(key) ?? [];
    arr.push(q);
    byControl.set(key, arr);
  }
  log(`Grouped into ${byControl.size} unique (framework, control_id) pairs.`);

  let allKeys = [...byControl.keys()];
  if (flags.limit) allKeys = allKeys.slice(0, flags.limit);
  if (flags.preview) allKeys = allKeys.slice(0, 5);

  const failures: string[] = [];
  let ok = 0;

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    const [framework, controlId] = key.split("|");
    const detailQuestions = byControl.get(key)!.sort((a, b) => a.question_sequence - b.question_sequence);

    if (flags.resume && (await alreadyGenerated(framework, controlId))) {
      log(`[${i + 1}/${allKeys.length}] SKIP (already generated) ${framework}:${controlId}`);
      ok++;
      continue;
    }

    log(`[${i + 1}/${allKeys.length}] ${framework}:${controlId} (${detailQuestions.length} detail qs)`);

    const outcome = await generateForControl({
      framework,
      controlId,
      detailQuestions,
      maxAttempts: 3,
      runAudit: flags.runAudit,
      log,
    });

    if ("error" in outcome) {
      failures.push(`${framework}:${controlId} — ${outcome.error}`);
      log(`  FAIL ${framework}:${controlId}`);
      continue;
    }

    const parsed = outcome.result;

    const { data: inserted, error: insErr } = await db
      .from("consolidated_questions")
      .upsert(
        {
          framework,
          control_id: controlId,
          consolidated_prompt: parsed.consolidated_prompt,
          question_type: parsed.question_type,
          maturity_levels: parsed.maturity_levels,
          generation_source: flags.runAudit ? "claude+audit" : "claude",
          generation_notes: `${parsed.rationale} | attempts=${outcome.attempts}`,
          active: true,
        },
        { onConflict: "framework,control_id" },
      )
      .select("id")
      .single();

    if (insErr || !inserted) {
      failures.push(`${framework}:${controlId} — DB insert: ${insErr?.message ?? "unknown"}`);
      log(`  DB INSERT FAIL ${framework}:${controlId}: ${insErr?.message}`);
      continue;
    }

    for (const m of parsed.detail_map) {
      const { error: mErr } = await db.from("consolidated_question_detail_map").upsert(
        {
          consolidated_question_id: (inserted as { id: string }).id,
          detail_question_id: m.detail_question_id,
          required_maturity_level: m.required_maturity_level,
          implied_positive_answer_key: m.implied_positive_answer_key,
        },
        { onConflict: "consolidated_question_id,detail_question_id" },
      );
      if (mErr) log(`  detail_map insert warning: ${mErr.message}`);
    }

    ok++;
    log(`  OK ${framework}:${controlId} (attempts ${outcome.attempts})`);

    if (flags.preview && i + 1 === 5) {
      log(`\n=== PREVIEW MODE: stopping after 5 controls ===`);
      log(`Review the rows in Supabase. If quality is acceptable, re-run without --preview.`);
      break;
    }
  }

  log(`\nPhase 1 complete. OK=${ok} FAIL=${failures.length}`);
  if (failures.length > 0) {
    log(`Failures:\n${failures.map((f) => "  - " + f).join("\n")}`);
  }
  return { ok, failures };
}

// ----------------------------------------------------------------------------
// Phase 2: Cross-framework propagation diagnostic
// ----------------------------------------------------------------------------

async function phase2Propagate(logPath: string): Promise<void> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };

  log(`\n=== Phase 2: Cross-framework propagation diagnostic ===`);
  const { count, error } = await db.from("control_mappings").select("*", { count: "exact", head: true });
  if (error) {
    log(`ERROR: control_mappings query failed: ${error.message}`);
    return;
  }
  log(`control_mappings has ${count ?? "unknown"} rows. Runtime saveAnswer reads this table directly.`);
}

// ----------------------------------------------------------------------------
// Phase 3: Post-generation audit sample
// ----------------------------------------------------------------------------

async function phase3Audit(logPath: string, samplePercent = 10): Promise<void> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };
  log(`\n=== Phase 3: Quality audit (${samplePercent}% sample) ===`);

  const { data: cqs, error } = await db
    .from("consolidated_questions")
    .select("id,framework,control_id,consolidated_prompt,maturity_levels");
  if (error || !cqs) {
    log(`ERROR: ${error?.message ?? "no rows"}`);
    return;
  }

  const rows = cqs as {
    id: string;
    framework: string;
    control_id: string;
    consolidated_prompt: string;
    maturity_levels: ConsolidationOutput["maturity_levels"];
  }[];

  const sampleSize = Math.max(5, Math.floor(rows.length * (samplePercent / 100)));
  const sample = rows.sort(() => Math.random() - 0.5).slice(0, sampleSize);

  log(`Auditing ${sample.length} of ${rows.length}.`);

  const flagged: string[] = [];
  for (let i = 0; i < sample.length; i++) {
    const cq = sample[i];
    const { data: details } = await db
      .from("control_assessment_questions")
      .select("id,framework,control_id,question_sequence,question_text,answer_options,positive_answer_keys,cypher_guidance_statement")
      .eq("framework", cq.framework)
      .eq("control_id", cq.control_id);

    if (!details || details.length === 0) {
      log(`[${i + 1}/${sample.length}] SKIP ${cq.framework}:${cq.control_id}`);
      continue;
    }

    const prompt = buildAuditPrompt({
      framework: cq.framework,
      controlId: cq.control_id,
      consolidated: {
        consolidated_prompt: cq.consolidated_prompt,
        question_type: "single_select",
        maturity_levels: cq.maturity_levels,
        detail_map: [],
        rationale: "(post-generation audit pass)",
      },
      detailQuestions: details as unknown as DetailQuestion[],
    });
    try {
      const resp = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      });
      const t = resp.content[0]?.type === "text" ? resp.content[0].text : "";
      const audit = AuditSchema.parse(parseJsonObject(t));
      if (audit.verdict === "FAIL") {
        flagged.push(`${cq.framework}:${cq.control_id} — ${audit.issues.join("; ")}`);
        log(`[${i + 1}/${sample.length}] FAIL ${cq.framework}:${cq.control_id} — ${audit.issues.join("; ")}`);
      } else {
        log(`[${i + 1}/${sample.length}] PASS ${cq.framework}:${cq.control_id}`);
      }
    } catch (e) {
      log(`[${i + 1}/${sample.length}] AUDIT ERROR ${cq.framework}:${cq.control_id} — ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  log(`\nPhase 3 complete. ${flagged.length} of ${sample.length} flagged.`);
  if (flagged.length > 0) {
    log(`Flagged:\n${flagged.map((f) => "  - " + f).join("\n")}`);
  }
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

function parseFlags(): PhaseFlags {
  const args = process.argv.slice(2);
  const getValue = (flag: string): string | undefined => {
    const i = args.indexOf(flag);
    return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
  };
  return {
    limit: getValue("--limit") ? Number.parseInt(getValue("--limit")!, 10) : undefined,
    framework: getValue("--framework"),
    resume: args.includes("--resume"),
    preview: args.includes("--preview"),
    runAudit: !args.includes("--no-audit"),
  };
}

async function main() {
  const flags = parseFlags();
  const logDir = "logs";
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logPath = path.join(logDir, `consolidation_${Date.now()}.log`);

  fs.writeFileSync(logPath, `Agent 18 consolidated question generation (v2)\nStarted: ${new Date().toISOString()}\nFlags: ${JSON.stringify(flags)}\n`);
  console.log(`Logging to ${logPath}`);

  const { ok, failures } = await phase1Generate(flags, logPath);

  if (!flags.preview) {
    await phase2Propagate(logPath);
    await phase3Audit(logPath);
  }

  fs.appendFileSync(logPath, `\nFinished: ${new Date().toISOString()}\nOK=${ok} FAIL=${failures.length}\n`);
  console.log(`Done. OK=${ok} FAIL=${failures.length}. See ${logPath}.`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
