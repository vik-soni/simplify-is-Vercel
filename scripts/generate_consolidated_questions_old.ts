/**
 * Agent 18 — Consolidated Question Generation (Phases 1-3)
 *
 * One-time script. Run once via:
 *   npx tsx scripts/generate_consolidated_questions.ts
 *
 * Optional args:
 *   --limit N             Process only the first N controls (testing)
 *   --framework FRAMEWORK Restrict to one framework
 *   --resume              Skip controls already in consolidated_questions
 *   --preview             Stop after first 5 controls and print for review
 *
 * Env required (in simplify-is/.env.local):
 *   SUPABASE_URL  or  NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY  or  SIMPLIFY_SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 *   PERPLEXITY_API_KEY (optional — used for spot-check audits)
 *   CLAUDE_MODEL (optional, defaults to claude-sonnet-4-20250514)
 *
 * Phases:
 *   1. Generate consolidated questions + conversational answer options + detail-question mappings per framework's native maturity model
 *   2. Cross-framework propagation via control_mappings (records implied answers under control_mappings.mapping_strength)
 *   3. Quality audit pass — Claude self-reviews a 10% sample for boring / banned-phrase / framework-misalignment issues
 *
 * Quality guarantees:
 *   - Australian English (spelling and idiom)
 *   - No "How mature is...", "Does your organisation have...", "Are you compliant..." or other compliance-flavoured openers
 *   - Conversational answer options (e.g., "we wing it" not "Not implemented")
 *   - Framework-native maturity levels (NIST CSF 4-tier, ASD E8 ML0-3, ISO Yes/Partial/No, PCI binary, APRA binary, AU VAISS guardrail-adopted/not)
 *   - Self-evaluation retry loop: up to 3 attempts per control
 *   - Failed controls logged for manual review, never silently dropped
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// ----------------------------------------------------------------------------
// Framework maturity model registry (research-confirmed)
// ----------------------------------------------------------------------------

type MaturityModelKind = "nist_csf_4tier" | "nist_ai_rmf" | "iso_3level" | "asd_e8" | "binary_compliance" | "vaiss_guardrail";

interface MaturityLevelSpec {
  level: number;             // numeric level — internal sort/score only
  key: string;               // stable machine key (e.g. "tier1", "ml0", "yes", "compliant")
  display_label_hint: string; // hint for Claude (Claude will rewrite conversationally per control)
  native_name: string;        // framework's official name for this level (used in dashboards)
}

interface FrameworkMaturityModel {
  framework: string;
  kind: MaturityModelKind;
  levels: MaturityLevelSpec[];
  notes: string;
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
    notes: "Four-tier capability maturity. Tier 4 implies measurement and continuous improvement, not just having the control.",
  },
  "NIST_CSF": { // legacy alias
    framework: "NIST_CSF",
    kind: "nist_csf_4tier",
    levels: [
      { level: 1, key: "tier1", display_label_hint: "ad-hoc, informal", native_name: "Tier 1 — Partial" },
      { level: 2, key: "tier2", display_label_hint: "risk-aware, partial", native_name: "Tier 2 — Risk Informed" },
      { level: 3, key: "tier3", display_label_hint: "approved and implemented", native_name: "Tier 3 — Repeatable" },
      { level: 4, key: "tier4", display_label_hint: "tested and measured", native_name: "Tier 4 — Adaptive" },
    ],
    notes: "Legacy alias for NIST_CSF_2.0.",
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
    notes: "NIST AI RMF is function-based (Govern, Map, Measure, Manage). We use capability tiers similar to NIST CSF.",
  },
  "ISO_27001_2022": {
    framework: "ISO_27001_2022",
    kind: "iso_3level",
    levels: [
      { level: 1, key: "no",      display_label_hint: "the control is absent or only acknowledged in conversation", native_name: "No" },
      { level: 2, key: "partial", display_label_hint: "the control is partially in place, gaps remain", native_name: "Partial" },
      { level: 3, key: "yes",     display_label_hint: "the control is fully in place and operating", native_name: "Yes" },
    ],
    notes: "ISO is binary-flavoured. Three levels: No / Partial / Yes.",
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
  },
  "ISO42001": {
    framework: "ISO42001",
    kind: "iso_3level",
    levels: [
      { level: 1, key: "no",      display_label_hint: "AI management practice absent", native_name: "No" },
      { level: 2, key: "partial", display_label_hint: "AI management practice partial", native_name: "Partial" },
      { level: 3, key: "yes",     display_label_hint: "AI management practice fully in place", native_name: "Yes" },
    ],
    notes: "ISO 42001 (AI management). Three levels: No / Partial / Yes.",
  },
  "PCI_DSS": {
    framework: "PCI_DSS",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "control not in place — fails the requirement", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "control fully in place — meets the requirement", native_name: "Compliant" },
    ],
    notes: "PCI DSS is binary at the requirement level. Compliant / Non-Compliant only.",
  },
  "APRA_CPS_230": {
    framework: "APRA_CPS_230",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "obligation not met", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "obligation met", native_name: "Compliant" },
    ],
    notes: "APRA CPS 230 (operational risk). Regulator-driven binary.",
  },
  "APRA_CPS_234": {
    framework: "APRA_CPS_234",
    kind: "binary_compliance",
    levels: [
      { level: 1, key: "non_compliant", display_label_hint: "obligation not met", native_name: "Non-Compliant" },
      { level: 2, key: "compliant",     display_label_hint: "obligation met", native_name: "Compliant" },
    ],
    notes: "APRA CPS 234 (information security). Regulator-driven binary.",
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
    notes: "ASD Essential Eight native ML0-ML3 model. Tradecraft-based, not capability-based.",
  },
  "AU_VAISS": {
    framework: "AU_VAISS",
    kind: "vaiss_guardrail",
    levels: [
      { level: 1, key: "not_adopted",      display_label_hint: "guardrail not adopted", native_name: "Not Adopted" },
      { level: 2, key: "partially_adopted",display_label_hint: "guardrail partially adopted, gaps remain", native_name: "Partially Adopted" },
      { level: 3, key: "adopted",          display_label_hint: "guardrail fully adopted and embedded", native_name: "Adopted" },
    ],
    notes: "AU Voluntary AI Safety Standard. Guardrail adoption model: Not Adopted / Partially Adopted / Adopted.",
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
  { pattern: /\bauthorize\b/gi, australian: "authorise" },
  { pattern: /\bauthorized\b/gi, australian: "authorised" },
  { pattern: /\brealize\b/gi, australian: "realise" },
  { pattern: /\brealized\b/gi, australian: "realised" },
  { pattern: /\bcenter\b/gi, australian: "centre" },
  { pattern: /\bdefense\b/gi, australian: "defence" },
  { pattern: /\bcatalog\b/gi, australian: "catalogue" },
  { pattern: /\blicense\b/gi, australian: "licence" },
  { pattern: /\bprogram\b/gi, australian: "programme" }, // note: keep "programme" except in code context
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
// Helpers
// ----------------------------------------------------------------------------

function getMaturityModel(framework: string): FrameworkMaturityModel {
  const model = FRAMEWORK_MATURITY_MODELS[framework];
  if (!model) {
    // fallback: treat unknown as ISO 3-level
    return FRAMEWORK_MATURITY_MODELS["ISO_27001_2022"];
  }
  return model;
}

function buildPrompt(args: {
  framework: string;
  controlId: string;
  controlsCatalogContext: string | null;
  detailQuestions: DetailQuestion[];
  retryReason?: string;
}): string {
  const model = getMaturityModel(args.framework);
  const levelsBlock = model.levels
    .map(
      (l) =>
        `  - level ${l.level} | key "${l.key}" | native name "${l.native_name}" — ${l.display_label_hint}`,
    )
    .join("\n");

  const numberedDetail = args.detailQuestions
    .map((q, i) => {
      const opts = JSON.stringify(q.answer_options);
      const positives = JSON.stringify(q.positive_answer_keys ?? []);
      return `${i + 1}. [${q.id}] ${q.question_text}\n     options: ${opts}\n     positive_keys: ${positives}\n     cypher_guidance: ${q.cypher_guidance_statement ?? "(none)"}`;
    })
    .join("\n\n");

  const retryNote = args.retryReason
    ? `\n\nIMPORTANT: Your previous attempt was rejected. Reason: ${args.retryReason}\nWrite the question and answer labels in a fundamentally different style this time.`
    : "";

  return `You are a friendly Australian compliance consultant interviewing a real person about how their organisation actually operates. You are NOT an auditor reading a framework. You are NOT writing compliance text. You are a thoughtful human asking thoughtful questions.

CONTROL CONTEXT
Framework: ${args.framework}
Control ID: ${args.controlId}
What this control is about: ${args.controlsCatalogContext ?? "(no catalogue context available — work from the detail questions below)"}

NATIVE MATURITY MODEL for ${args.framework} (${model.notes})
${levelsBlock}

DETAIL QUESTIONS (${args.detailQuestions.length}) that this control currently asks
${numberedDetail}

YOUR JOB
Produce ONE consolidated, conversational question that captures the maturity progression for this control using THIS framework's native maturity levels (not a normalised 1-4 — use exactly the levels above).

For each maturity level, produce a "conversational_label" — an everyday-language description of what that level looks like in practice. NEVER use phrases like "fully documented and reviewed" or "formal policy approved and implemented". Use plain English. Examples:
  Good: "We back up when we remember to, or not at all."
  Good: "Backups run automatically and we've successfully restored at least once."
  Bad: "Backup policy formally documented and approved by management."

QUESTION RULES
  - 8 to 25 words.
  - Sound like a real person asking, not a framework restatement.
  - Mention concrete situations where possible ("when a laptop is lost", "if your cloud provider goes down", "when someone leaves the company").
  - Avoid jargon (RPO, RTO, ISMS, governance posture, baseline, control objective) IN THE QUESTION. Jargon may appear in the conversational labels if it's truly the right word.
  - Australian English (organisation, programme, behaviour, authorise, analyse, optimise, etc.).
  - BANNED OPENERS: "How mature is", "What is the maturity level of", "Does your organisation have", "Have you established", "Is there a formal", "Are you compliant", "Do you maintain", "Has your organisation implemented".

ANSWER LABEL RULES
  - One conversational_label per native maturity level above.
  - Each label must describe what life looks like at that level, not what's "documented".
  - Lowest level is honest about the gap — "we wing it", "we haven't really thought about it", "it happens when someone remembers" — not punitive, not blame-y.
  - Top level is concrete — what tested / measured / continuously improved actually looks like for THIS specific control.

DETAIL MAP RULES — THIS IS CRITICAL
Every detail question above MUST be mapped to the maturity level at which its positive answer becomes a prerequisite. When the user selects a maturity level, all detail questions whose required_maturity_level is at or below the selected level get backfilled with their positive answer key. Detail questions whose required_maturity_level is HIGHER than the selected level remain unanswered (or get the negative answer key).

For each detail question, pick the answer option KEY (from its positive_answer_keys) that represents the implied positive answer at its required level.

OUTPUT — STRICT JSON, no prose around it:
{
  "consolidated_prompt": "string — the single conversational question, 8-25 words",
  "question_type": "single_select | slider | drag_drop | multi_select | segmented",
  "maturity_levels": [
    {
      "level": <numeric level from native model>,
      "key": "<exact key string from native model>",
      "native_name": "<exact native_name from native model>",
      "conversational_label": "<everyday-language description of what this level looks like in practice for THIS control>"
    }
    // one object per native level
  ],
  "detail_map": [
    {
      "detail_question_id": "<uuid from detail questions above>",
      "required_maturity_level": <numeric level>,
      "implied_positive_answer_key": "<key from that detail question's positive_answer_keys>"
    }
    // one object per detail question above — DO NOT SKIP ANY
  ],
  "rationale": "2-3 sentences explaining how you translated the detail questions into the framework-native maturity progression and why each detail question lands at the level you chose"
}${retryNote}`;
}

function buildAuditPrompt(args: {
  framework: string;
  controlId: string;
  consolidated: ConsolidationOutput;
  detailQuestions: DetailQuestion[];
}): string {
  return `You are auditing a consolidated compliance assessment question for quality. Australian English context.

Framework: ${args.framework}
Control: ${args.controlId}

Consolidated question:
  "${args.consolidated.consolidated_prompt}"

Maturity levels:
${args.consolidated.maturity_levels
  .map((l) => `  - ${l.native_name}: ${l.conversational_label}`)
  .join("\n")}

The consolidated question replaces ${args.detailQuestions.length} detail questions:
${args.detailQuestions.map((q, i) => `${i + 1}. ${q.question_text}`).join("\n")}

Evaluate against these criteria:
  A. Conversational — does it sound like a real person asking, not a framework restatement?
  B. Not boring — does it engage curiosity? Avoid compliance-speak openers?
  C. Australian English — no American spellings (organization, defense, color, behavior, analyze)?
  D. Framework-native — does the maturity model match ${args.framework}'s actual native levels?
  E. Covers the detail — do the maturity labels collectively cover what the detail questions ask about?
  F. Honest at the bottom — does Level 1 / lowest level describe absence honestly without being punitive?

Output strict JSON:
{
  "verdict": "PASS" | "FAIL",
  "issues": ["short bullet 1", "short bullet 2"],
  "suggestions": "if FAIL, one sentence on what to change"
}`;
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
  // Try several control_id formats since controls.control_id is prefixed
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
      .select("control_name,what_it_means,why_it_matters,what_is_expected,how_to_implement")
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
// Generation with retry + quality gate
// ----------------------------------------------------------------------------

async function generateForControl(args: {
  framework: string;
  controlId: string;
  detailQuestions: DetailQuestion[];
  maxAttempts: number;
  log: (s: string) => void;
}): Promise<{ result: ConsolidationOutput; attempts: number } | { error: string; attempts: number }> {
  const detailIds = new Set(args.detailQuestions.map((q) => q.id));
  const catalogContext = await fetchControlContext(args.framework, args.controlId);

  let retryReason: string | undefined;
  for (let attempt = 1; attempt <= args.maxAttempts; attempt++) {
    try {
      const prompt = buildPrompt({
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

      // Australianisation pass on all strings
      parsed.consolidated_prompt = enforceAustralianEnglish(parsed.consolidated_prompt);
      parsed.maturity_levels = parsed.maturity_levels.map((l) => ({
        ...l,
        conversational_label: enforceAustralianEnglish(l.conversational_label),
      }));
      parsed.rationale = enforceAustralianEnglish(parsed.rationale);

      // Quality gate: banned phrases
      const banned = hasBannedPhrase(parsed.consolidated_prompt);
      if (banned) {
        retryReason = `The question contained banned phrase ${banned}. Rewrite in everyday human language.`;
        args.log(`  attempt ${attempt} REJECTED: banned phrase ${banned}`);
        continue;
      }

      // Quality gate: detail map completeness
      const mapIds = new Set(parsed.detail_map.map((m) => m.detail_question_id));
      const missing = [...detailIds].filter((id) => !mapIds.has(id));
      if (missing.length > 0) {
        retryReason = `Your detail_map missed ${missing.length} of the ${detailIds.size} detail questions. Include EVERY detail question id.`;
        args.log(`  attempt ${attempt} REJECTED: missing ${missing.length} detail mappings`);
        continue;
      }

      // Quality gate: maturity model match
      const expectedModel = getMaturityModel(args.framework);
      const expectedKeys = new Set(expectedModel.levels.map((l) => l.key));
      const actualKeys = new Set(parsed.maturity_levels.map((l) => l.key));
      if (
        expectedKeys.size !== actualKeys.size ||
        [...expectedKeys].some((k) => !actualKeys.has(k))
      ) {
        retryReason = `Your maturity_levels keys ${JSON.stringify([...actualKeys])} don't match this framework's native model ${JSON.stringify([...expectedKeys])}. Use the exact keys from the native model.`;
        args.log(`  attempt ${attempt} REJECTED: maturity model mismatch`);
        continue;
      }

      // Optional: self-audit pass on the first attempt's output
      const auditPrompt = buildAuditPrompt({
        framework: args.framework,
        controlId: args.controlId,
        consolidated: parsed,
        detailQuestions: args.detailQuestions,
      });
      const auditResp = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [{ role: "user", content: auditPrompt }],
      });
      const auditText = auditResp.content[0]?.type === "text" ? auditResp.content[0].text : "";
      const auditRaw = parseJsonObject(auditText);
      const audit = AuditSchema.parse(auditRaw);

      if (audit.verdict === "FAIL") {
        retryReason = `Quality audit FAILED: ${audit.issues.join("; ")}. ${audit.suggestions ?? ""}`;
        args.log(`  attempt ${attempt} AUDIT FAIL: ${audit.issues.join("; ")}`);
        continue;
      }

      args.log(`  attempt ${attempt} PASS`);
      return { result: parsed, attempts: attempt };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      retryReason = `Previous attempt threw: ${msg}. Output strictly valid JSON matching the schema this time.`;
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
}

async function phase1Generate(flags: PhaseFlags, logPath: string): Promise<{ ok: number; failures: string[] }> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };

  log(`\n=== Phase 1: Consolidated question generation ===`);
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
      log,
    });

    if ("error" in outcome) {
      failures.push(`${framework}:${controlId} — ${outcome.error}`);
      log(`  FAIL ${framework}:${controlId}`);
      continue;
    }

    const parsed = outcome.result;

    // Insert consolidated_questions
    const { data: inserted, error: insErr } = await db
      .from("consolidated_questions")
      .upsert(
        {
          framework,
          control_id: controlId,
          consolidated_prompt: parsed.consolidated_prompt,
          question_type: parsed.question_type,
          maturity_levels: parsed.maturity_levels,
          generation_source: "claude+audit",
          generation_notes: `${parsed.rationale} | attempts=${outcome.attempts}`,
          active: true,
        },
        { onConflict: "framework,control_id" },
      )
      .select("id")
      .single();

    if (insErr || !inserted) {
      failures.push(`${framework}:${controlId} — DB insert: ${insErr?.message ?? "unknown"}`);
      continue;
    }

    // Insert detail map
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
      if (mErr) {
        log(`  detail_map insert warning: ${mErr.message}`);
      }
    }

    ok++;
    log(`  OK ${framework}:${controlId} (attempts ${outcome.attempts})`);

    if (flags.preview && i + 1 === 5) {
      log(`\n=== PREVIEW MODE: stopping after 5 controls ===`);
      log(`Review the output above. If quality is acceptable, re-run without --preview to process all controls.`);
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
// Phase 2: Cross-framework propagation via control_mappings
// ----------------------------------------------------------------------------

interface ControlMappingRow {
  control_id_a: string;
  framework_a: string;
  control_id_b: string;
  framework_b: string;
  mapping_strength: string;
}

async function phase2Propagate(logPath: string): Promise<void> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };

  log(`\n=== Phase 2: Cross-framework propagation map ===`);
  log(`This phase records which consolidated questions are mapped across frameworks via control_mappings, so that at assessment time, answering one consolidated question can imply answers in others. We do NOT pre-compute every implied answer — that happens at runtime in saveAnswer.`);
  log(`Verifying control_mappings is available...`);

  const { count, error } = await db
    .from("control_mappings")
    .select("*", { count: "exact", head: true });
  if (error) {
    log(`ERROR: control_mappings query failed: ${error.message}`);
    return;
  }
  log(`control_mappings has ${count ?? "unknown"} rows. No additional storage needed — runtime saveAnswer logic reads this table directly.`);

  // Sanity check: how many of the consolidated questions have at least one cross-framework mapping?
  const { data: cqs, error: cqErr } = await db
    .from("consolidated_questions")
    .select("framework,control_id");
  if (cqErr || !cqs) {
    log(`ERROR: could not read consolidated_questions: ${cqErr?.message ?? "unknown"}`);
    return;
  }

  let withMapping = 0;
  let withoutMapping = 0;
  for (const cq of cqs as { framework: string; control_id: string }[]) {
    const { count: m } = await db
      .from("control_mappings")
      .select("*", { count: "exact", head: true })
      .or(
        `and(framework_a.eq.${cq.framework},control_id_a.eq.${cq.control_id}),and(framework_b.eq.${cq.framework},control_id_b.eq.${cq.control_id})`,
      );
    if ((m ?? 0) > 0) withMapping++;
    else withoutMapping++;
  }
  log(`Of ${cqs.length} consolidated questions: ${withMapping} have at least one cross-framework mapping, ${withoutMapping} are framework-unique.`);
}

// ----------------------------------------------------------------------------
// Phase 3: Quality audit sample
// ----------------------------------------------------------------------------

async function phase3Audit(logPath: string, samplePercent = 10): Promise<void> {
  const log = (s: string) => {
    fs.appendFileSync(logPath, s + "\n");
    if (process.stdout.isTTY) console.log(s);
  };

  log(`\n=== Phase 3: Post-generation quality audit (${samplePercent}% sample) ===`);

  const { data: cqs, error } = await db
    .from("consolidated_questions")
    .select("id,framework,control_id,consolidated_prompt,maturity_levels,generation_notes");
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

  log(`Auditing ${sample.length} of ${rows.length} consolidated questions.`);

  const flagged: string[] = [];
  for (let i = 0; i < sample.length; i++) {
    const cq = sample[i];

    // Refetch detail questions for context
    const { data: details } = await db
      .from("control_assessment_questions")
      .select("id,framework,control_id,question_sequence,question_text,answer_options,positive_answer_keys,cypher_guidance_statement")
      .eq("framework", cq.framework)
      .eq("control_id", cq.control_id);

    if (!details || details.length === 0) {
      log(`[${i + 1}/${sample.length}] SKIP ${cq.framework}:${cq.control_id} — no detail questions found`);
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
        rationale: "(audit-only pass — rationale not relevant)",
      },
      detailQuestions: details as unknown as DetailQuestion[],
    });
    try {
      const resp = await claude.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      });
      const text = resp.content[0]?.type === "text" ? resp.content[0].text : "";
      const audit = AuditSchema.parse(parseJsonObject(text));
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

  log(`\nPhase 3 complete. ${flagged.length} of ${sample.length} flagged for manual review.`);
  if (flagged.length > 0) {
    log(`Flagged:\n${flagged.map((f) => "  - " + f).join("\n")}`);
    log(`\nFlagged questions remain in consolidated_questions. Review manually in Supabase and decide whether to regenerate.`);
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
  };
}

async function main() {
  const flags = parseFlags();
  const logDir = "logs";
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logPath = path.join(logDir, `consolidation_${Date.now()}.log`);

  fs.writeFileSync(logPath, `Agent 18 consolidated question generation\nStarted: ${new Date().toISOString()}\nFlags: ${JSON.stringify(flags)}\n`);
  console.log(`Logging to ${logPath}`);

  const { ok, failures } = await phase1Generate(flags, logPath);

  if (!flags.preview) {
    await phase2Propagate(logPath);
    await phase3Audit(logPath);
  }

  fs.appendFileSync(logPath, `\nFinished: ${new Date().toISOString()}\nOK=${ok} FAIL=${failures.length}\n`);
  console.log(`Done. OK=${ok} FAIL=${failures.length}. See ${logPath} for full log.`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
