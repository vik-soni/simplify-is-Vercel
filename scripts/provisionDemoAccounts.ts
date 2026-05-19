/**
 * Provision demo test accounts for simplify.is
 *
 * Usage:
 *   cd simplify-is && npx tsx scripts/provisionDemoAccounts.ts
 *   cd simplify-is && npx tsx scripts/provisionDemoAccounts.ts --email wdata@demo.com
 */

import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

function bootstrapPublicEnv(): void {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_URL) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.SUPABASE_URL;
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    process.env.NEXT_PUBLIC_APP_URL = process.env.APP_URL ?? "http://localhost:3000";
  }
}

bootstrapPublicEnv();

type AdminDb = ReturnType<
  Awaited<ReturnType<typeof loadRuntime>>["createAdminSupabaseClient"]
>;

async function loadRuntime() {
  const { createAdminSupabaseClient } = await import("../lib/db/admin");
  const {
    SUPPORTED_ASSESSMENT_FRAMEWORKS,
    CANONICAL_TO_CONTROLS_CATALOG,
    consolidatedQuestionKey,
  } = await import("../lib/frameworks/assessmentFrameworks");
  const { FRAMEWORK_TILE_DATA } = await import("../lib/frameworks/library");
  const { deriveSubdomainKey } = await import("../lib/orchestration/assessment/subdomain");
  const { _aggregateScoresForTest } = await import("../lib/orchestration/scoring/maturityScoring");
  const { loadConsolidatedQuestionsForFramework } = await import(
    "../lib/orchestration/assessment/consolidatedQuestions"
  );
  return {
    createAdminSupabaseClient,
    SUPPORTED_ASSESSMENT_FRAMEWORKS,
    CANONICAL_TO_CONTROLS_CATALOG,
    consolidatedQuestionKey,
    FRAMEWORK_TILE_DATA,
    deriveSubdomainKey,
    _aggregateScoresForTest,
    loadConsolidatedQuestionsForFramework,
  };
}

const PASSWORD = "123";

type ProvisionMode = "seeded" | "blank";

interface AccountSpec {
  email: string;
  orgName: string;
  userName: string;
  mode: ProvisionMode;
}

const ACCOUNTS: AccountSpec[] = [
  {
    email: "wdata@demo.com",
    orgName: "Demo With Data Pty Ltd",
    userName: "Demo Data Admin",
    mode: "seeded",
  },
  {
    email: "wodata@demo.com",
    orgName: "Demo Without Data Pty Ltd",
    userName: "Demo Empty Admin",
    mode: "blank",
  },
];

function buildThreatPayload(now: Date) {
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const payload = {
    generated_at: now.toISOString(),
    key_controls: [
      {
        key: "identity_hardening",
        headline: "Identity hardening across privileged users",
        current_score: 2.4,
        previous_score: 2.1,
        trend_direction: "up",
        framework_refs: [
          { framework: "NIST CSF 2.0", control_id: "PR.AA-01", name: "Access control", score: 2.4, previous_score: 2.1 },
          { framework: "ISO 27001:2022", control_id: "A.5.15", name: "Access control policy", score: 2.2, previous_score: 2.0 },
        ],
        appears_in_threats: ["credential_stuffing", "vendor_account_takeover"],
      },
      {
        key: "backup_recovery_testing",
        headline: "Backup and restore testing cadence",
        current_score: 2.1,
        previous_score: 1.9,
        trend_direction: "up",
        framework_refs: [
          { framework: "NIST CSF 2.0", control_id: "RC.RP-01", name: "Recovery plan", score: 2.1, previous_score: 1.9 },
          { framework: "APRA CPS 230", control_id: "BCP-01", name: "Business continuity", score: 2.0, previous_score: 1.8 },
        ],
        appears_in_threats: ["ransomware_disruption", "cloud_region_outage"],
      },
      {
        key: "supplier_assurance",
        headline: "Critical supplier security assurance",
        current_score: 1.9,
        previous_score: 2.0,
        trend_direction: "down",
        framework_refs: [
          { framework: "NIST CSF 2.0", control_id: "ID.SC-01", name: "Supply chain risk", score: 1.9, previous_score: 2.0 },
          { framework: "APRA CPS 234", control_id: "3.4", name: "Third-party controls", score: 1.8, previous_score: 1.9 },
        ],
        appears_in_threats: ["vendor_account_takeover", "data_processor_breach"],
      },
      {
        key: "api_surface_protection",
        headline: "External API exposure controls",
        current_score: 2.0,
        previous_score: 1.8,
        trend_direction: "up",
        framework_refs: [
          { framework: "PCI DSS 4.0", control_id: "6.2.4", name: "Secure software", score: 2.0, previous_score: 1.8 },
          { framework: "NIST AI RMF", control_id: "MAP-2", name: "System boundaries", score: 2.1, previous_score: 1.9 },
        ],
        appears_in_threats: ["api_abuse", "credential_stuffing"],
      },
      {
        key: "monitoring_detection",
        headline: "Detection and triage consistency",
        current_score: 2.3,
        previous_score: 2.2,
        trend_direction: "flat",
        framework_refs: [
          { framework: "NIST CSF 2.0", control_id: "DE.CM-01", name: "Continuous monitoring", score: 2.3, previous_score: 2.2 },
          { framework: "ISO 42001", control_id: "A.8.4", name: "Monitoring", score: 2.2, previous_score: 2.1 },
        ],
        appears_in_threats: ["ransomware_disruption", "data_processor_breach"],
      },
    ],
    threats: [
      {
        key: "credential_stuffing",
        headline: "Credential stuffing against customer and admin accounts",
        severity: "high",
        narrative:
          "Attackers reuse breached credentials against exposed login surfaces. Weak MFA coverage and uneven anomaly detection increase account takeover risk.",
        industry_context: "Financial services peers are seeing sustained auth-layer probing.",
        tech_stack_context: "External APIs and mixed identity providers increase attack paths.",
        controls: [] as unknown[],
      },
      {
        key: "vendor_account_takeover",
        headline: "Third-party support account compromise",
        severity: "high",
        narrative:
          "A supplier account with privileged access is compromised and used for lateral movement.",
        industry_context: "Third-party access incidents continue to be a dominant breach entry point.",
        tech_stack_context: "Multiple SaaS dependencies increase identity governance complexity.",
        controls: [] as unknown[],
      },
      {
        key: "ransomware_disruption",
        headline: "Ransomware-driven service interruption",
        severity: "medium",
        narrative: "Endpoint compromise escalates to encryption and service disruption.",
        industry_context: "Sector peers recover faster where backup drills are tested frequently.",
        tech_stack_context: "Hybrid cloud increases response coordination requirements.",
        controls: [] as unknown[],
      },
      {
        key: "data_processor_breach",
        headline: "Data processor breach with customer impact",
        severity: "medium",
        narrative: "A downstream processor suffers a breach affecting customer data.",
        industry_context: "Processor incidents are rising with stricter regulator attention.",
        tech_stack_context: "Sensitive datasets and third-party connectors raise exposure.",
        controls: [] as unknown[],
      },
      {
        key: "cloud_region_outage",
        headline: "Cloud region outage affecting core workloads",
        severity: "lower",
        narrative: "A regional cloud event degrades availability.",
        industry_context: "Peers with regular continuity exercises restore key services faster.",
        tech_stack_context: "Cross-region dependencies and backup strategy are central.",
        controls: [] as unknown[],
      },
    ],
  };

  const snippets = payload.key_controls.map((c) => ({
    headline: c.headline,
    framework_refs: c.framework_refs,
    current_score: c.current_score,
    trend_direction: c.trend_direction,
  }));
  payload.threats[0].controls = [snippets[0], snippets[3]];
  payload.threats[1].controls = [snippets[0], snippets[2]];
  payload.threats[2].controls = [snippets[1], snippets[4]];
  payload.threats[3].controls = [snippets[2], snippets[4]];
  payload.threats[4].controls = [snippets[1], snippets[3]];

  return { payload, expiresAt };
}

async function findAuthUserId(db: AdminDb, email: string) {
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`listUsers: ${error.message}`);
  const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return found?.id ?? null;
}

async function ensureAuthUser(db: AdminDb, email: string): Promise<string> {
  const existingId = await findAuthUserId(db, email);
  if (existingId) {
    await db.auth.admin.updateUserById(existingId, {
      password: PASSWORD,
      email_confirm: true,
    } as { password: string; email_confirm: boolean });
    return existingId;
  }

  const { data, error } = await db.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: email.split("@")[0],
      organisation_name: email.split("@")[0],
    },
  });
  if (error || !data.user) throw new Error(`createUser ${email}: ${error?.message ?? "unknown"}`);
  return data.user.id;
}

async function clearOrgData(db: AdminDb, orgId: string, userId: string) {
  const tables = [
    "assessment_answers",
    "assessment_sessions",
    "control_responses",
    "extracted_signals",
    "domain_scores",
    "framework_scores",
    "domain_maturity_scores",
    "subdomain_maturity_scores",
    "organization_maturity_scores",
    "monthly_score_snapshots",
    "monthly_summary_cache",
    "organization_risks",
    "organization_tech_stack",
    "threat_readiness_cache",
    "organization_threats",
    "chat_transcripts",
    "cypher_assessment_transcripts",
  ] as const;

  for (const table of tables) {
    const col =
      table === "organization_tech_stack" || table === "threat_readiness_cache"
        ? "organization_id"
        : "organization_id";
    const { error } = await db.from(table as never).delete().eq(col, orgId);
    if (error && error.code !== "PGRST205") {
      console.warn(`  clear ${table}:`, error.message);
    }
  }

  await db.from("assessment_answers" as never).delete().eq("user_id", userId);
}

async function ensureOrg(
  db: AdminDb,
  userId: string,
  spec: AccountSpec,
  allFrameworkSlugs: string[],
  allFrameworksActive: string[],
): Promise<string> {
  await db.from("users" as never).upsert(
    {
      id: userId,
      email: spec.email,
      name: spec.userName,
      agent_name: "Cypher",
      role: "admin",
      status: "active",
      is_onboarded: false,
      claude_api_calls_this_month: 0,
    } as never,
    { onConflict: "id" },
  );

  const { data: owned } = await db
    .from("organizations" as never)
    .select("id")
    .eq("owner_user_id", userId)
    .limit(1);
  let orgId = (owned?.[0] as { id: string } | undefined)?.id;

  if (!orgId) {
    const { data: newOrg, error } = await db
      .from("organizations" as never)
      .insert({
        name: spec.orgName,
        industry: "Financial Services (Banking, Insurance, Superannuation)",
        size: "medium",
        country: "Australia",
        countries: ["Australia"],
        workforce_scale: "medium",
        owner_user_id: userId,
        frameworks_active: allFrameworksActive,
        selected_frameworks: allFrameworkSlugs,
        onboarding_step: 0,
        onboarding_completed_at: null,
        consultant_name: null,
        metadata: {
          provisioned_demo_at: new Date().toISOString(),
          mode: spec.mode,
          ...(spec.email === "wdata@demo.com" ? { always_replay_onboarding: true } : {}),
        },
      } as never)
      .select("id")
      .single();
    if (error || !newOrg) throw new Error(`org insert: ${error?.message ?? "unknown"}`);
    orgId = (newOrg as { id: string }).id;
  } else {
    const { error } = await db
      .from("organizations" as never)
      .update({
        name: spec.orgName,
        frameworks_active: allFrameworksActive,
        selected_frameworks: allFrameworkSlugs,
        onboarding_step: 0,
        onboarding_completed_at: null,
        consultant_name: null,
        industry: "Financial Services (Banking, Insurance, Superannuation)",
        countries: ["Australia"],
        workforce_scale: "medium",
        metadata: {
          reprovisioned_demo_at: new Date().toISOString(),
          mode: spec.mode,
          ...(spec.email === "wdata@demo.com" ? { always_replay_onboarding: true } : {}),
        },
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", orgId);
    if (error) throw new Error(`org update: ${error.message}`);
  }

  await db
    .from("users" as never)
    .update({ org_id: orgId, is_onboarded: false, agent_name: "Cypher" } as never)
    .eq("id", userId);

  return orgId;
}

async function seedThreatAndTechStack(db: AdminDb, orgId: string) {
  const now = new Date();
  const { payload, expiresAt } = buildThreatPayload(now);

  const techStack = {
    organization_id: orgId,
    cloud_providers: ["AWS", "Azure"],
    databases: ["RDS PostgreSQL", "MongoDB Atlas"],
    data_storage: ["S3", "SharePoint"],
    backup_strategy: "Daily encrypted snapshots with quarterly restore testing.",
    critical_third_party: [
      { name: "Salesforce", purpose: "CRM and customer workflow" },
      { name: "CrowdStrike", purpose: "EDR and endpoint telemetry" },
    ],
    identity_system: "Azure AD + Okta MFA",
    public_apis: true,
    public_apis_notes: "Public partner APIs fronted by WAF and token-based auth.",
    data_types: ["Customer PII", "Financial transactions", "Employee HR data"],
    notes: "Seeded demo account — full dashboard review data.",
    source: "manual_edit",
    last_validated_at: now.toISOString(),
  };

  const { error: stackErr } = await db
    .from("organization_tech_stack" as never)
    .upsert(techStack as never, { onConflict: "organization_id" });
  if (stackErr) throw new Error(`tech stack: ${stackErr.message}`);

  const { error: cacheErr } = await db.from("threat_readiness_cache" as never).upsert(
    {
      organization_id: orgId,
      generated_at: now.toISOString(),
      expires_at: expiresAt,
      payload,
      generation_inputs_hash: `demo_seed_${now.getTime()}`,
    } as never,
    { onConflict: "organization_id" },
  );
  if (cacheErr) throw new Error(`threat cache: ${cacheErr.message}`);
}

async function seedOrganizationRisks(db: AdminDb, orgId: string) {
  const { data: templates, error } = await db
    .from("top_risks" as never)
    .select("id")
    .order("sort_order", { ascending: true })
    .limit(5);
  if (error) throw new Error(`top_risks: ${error.message}`);

  const rows = ((templates as { id: string }[] | null) ?? []).map((t) => ({
    organization_id: orgId,
    risk_id: t.id,
  }));
  if (rows.length === 0) return;

  const { error: insErr } = await db.from("organization_risks" as never).insert(rows as never);
  if (insErr && !insErr.message.includes("duplicate")) {
    throw new Error(`organization_risks: ${insErr.message}`);
  }
}

function pickMaturityLevel(index: number): 1 | 2 | 3 | 4 {
  const pattern: (1 | 2 | 3 | 4)[] = [2, 2, 3, 2, 3, 3, 2, 4];
  return pattern[index % pattern.length];
}

const DEFAULT_ANSWER_OPTIONS = [
  "Yes, formally documented and reviewed in the last 12 months",
  "Yes, but not reviewed recently",
  "Informal practices only",
  "Planned but not in place",
  "No",
];

/** assessment_answers.question_key FK → assessment_questions (…:Q1 suffix). */
function legacyQuestionKey(frameworkId: string, controlId: string): string {
  return `${frameworkId}:${controlId}:Q1`;
}

async function ensureAssessmentQuestionsForFramework(
  db: AdminDb,
  frameworkId: string,
  deriveSubdomainKeyFn: (fw: string, controlId: string) => { key: string; domainId: string } | null,
) {
  const { data: questions, error } = await db
    .from("consolidated_questions" as never)
    .select("framework,control_id,consolidated_prompt")
    .eq("framework", frameworkId)
    .eq("active", true);
  if (error) throw new Error(`consolidated_questions ${frameworkId}: ${error.message}`);

  const rows: Record<string, unknown>[] = [];
  let position = 0;
  for (const q of (questions ?? []) as {
    framework: string;
    control_id: string;
    consolidated_prompt: string;
  }[]) {
    position += 1;
    const sd = deriveSubdomainKeyFn(frameworkId, q.control_id);
    const domainId = sd?.domainId ?? q.control_id.split(/[._-]/)[0] ?? "";
    rows.push({
      question_key: legacyQuestionKey(frameworkId, q.control_id),
      framework_id: frameworkId,
      domain_id: domainId,
      domain_name: domainId,
      control_id: q.control_id,
      control_name: q.control_id,
      position,
      prompt: q.consolidated_prompt,
      answer_options: DEFAULT_ANSWER_OPTIONS,
      allows_freeform: true,
    });
  }

  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const { error: upErr } = await db
      .from("assessment_questions" as never)
      .upsert(chunk as never, { onConflict: "question_key" });
    if (upErr) throw new Error(`assessment_questions ${frameworkId}: ${upErr.message}`);
  }
}

async function seedAssessmentAnswersForFramework(
  db: AdminDb,
  orgId: string,
  userId: string,
  frameworkId: string,
  answerRatio: number,
  deriveSubdomainKeyFn: (fw: string, controlId: string) => { key: string; domainId: string } | null,
) {
  await ensureAssessmentQuestionsForFramework(db, frameworkId, deriveSubdomainKeyFn);

  const { data: questions, error } = await db
    .from("consolidated_questions" as never)
    .select("framework,control_id,maturity_levels")
    .eq("framework", frameworkId)
    .eq("active", true);
  if (error) throw new Error(`consolidated_questions ${frameworkId}: ${error.message}`);

  const rows: Record<string, unknown>[] = [];
  const now = new Date().toISOString();
  let idx = 0;

  for (const q of (questions ?? []) as {
    framework: string;
    control_id: string;
    maturity_levels: { level: number; label: string; key?: string; conversational_label?: string }[];
  }[]) {
    if (Math.random() > answerRatio) continue;
    const level = pickMaturityLevel(idx++);
    const mat = q.maturity_levels?.find((m) => m.level === level) ?? q.maturity_levels?.[level - 1];
    const selected =
      mat?.conversational_label ?? mat?.label ?? mat?.key ?? `level_${level}`;
    const sd = deriveSubdomainKeyFn(frameworkId, q.control_id);
    const domainId = sd?.domainId ?? q.control_id.split(/[._-]/)[0] ?? "";

    rows.push({
      user_id: userId,
      org_id: orgId,
      organization_id: orgId,
      question_key: legacyQuestionKey(frameworkId, q.control_id),
      framework_id: frameworkId,
      domain_id: domainId,
      subdomain_key: sd?.key ?? "",
      control_id: q.control_id,
      selected_option: selected,
      maturity_value: level,
      answer_value: level,
      source: "form",
      status: "answered",
      submitted_at: now,
      created_at: now,
    });
  }

  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const { error: insErr } = await db.from("assessment_answers" as never).insert(chunk as never);
    if (insErr) throw new Error(`assessment_answers ${frameworkId}: ${insErr.message}`);
  }

  return rows.length;
}

async function seedFrameworkScoresLegacy(
  db: AdminDb,
  orgId: string,
  scores: { frameworkId: string; score: number }[],
) {
  const now = new Date().toISOString();
  for (const { frameworkId, score } of scores) {
    await db.from("framework_scores" as never).insert({
      organization_id: orgId,
      framework_id: frameworkId,
      overall_maturity_score: score,
      domains_completed: Math.floor(score * 2),
      domains_total: 6,
      scored_at: now,
    } as never);
  }
}

async function loadLatestAnswers(
  db: AdminDb,
  frameworkId: string,
  organizationId: string,
  userId: string,
) {
  const { data, error } = await db
    .from("assessment_answers" as never)
    .select(
      "question_key,framework_id,domain_id,control_id,selected_option,maturity_value,submitted_at,created_at",
    )
    .eq("framework_id", frameworkId)
    .eq("user_id", userId)
    .eq("org_id", organizationId)
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const byControl = new Map<string, Record<string, unknown>>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    const cid = String(row.control_id ?? "");
    if (cid && !byControl.has(cid)) byControl.set(cid, row);
  }
  return Array.from(byControl.values());
}

async function recalculateAndPersistScoresProvision(
  db: AdminDb,
  organizationId: string,
  frameworkId: string,
  userId: string,
  runtime: Awaited<ReturnType<typeof loadRuntime>>,
) {
  const consolidated = await runtime.loadConsolidatedQuestionsForFramework(
    frameworkId as never,
  );
  const questions = consolidated.map((q) => ({
    question_key: legacyQuestionKey(q.framework, q.control_id),
    framework_id: q.framework,
    domain_id: q.domain_id,
    control_id: q.control_id,
  }));
  const answers = await loadLatestAnswers(db, frameworkId, organizationId, userId);
  const rollup = runtime._aggregateScoresForTest(
    frameworkId,
    questions,
    answers as never,
  );
  const now = new Date().toISOString();
  const round2 = (v: number | null) => (v === null ? null : Math.round(v * 100) / 100);

  await db
    .from("subdomain_maturity_scores" as never)
    .delete()
    .eq("organization_id", organizationId)
    .eq("framework_id", frameworkId);
  await db
    .from("domain_maturity_scores" as never)
    .delete()
    .eq("organization_id", organizationId)
    .eq("framework_id", frameworkId);
  await db
    .from("organization_maturity_scores" as never)
    .delete()
    .eq("organization_id", organizationId)
    .eq("framework_id", frameworkId);

  if (rollup.subdomains.length > 0) {
    const { error } = await db.from("subdomain_maturity_scores" as never).insert(
      rollup.subdomains.map((s) => ({
        organization_id: organizationId,
        framework_id: frameworkId,
        domain_id: s.domain_id,
        subdomain_key: s.subdomain_key,
        maturity_score: round2(s.score),
        control_count: s.control_count,
        answered_count: s.answered_count,
        completion_percentage: s.completion_percentage,
        last_calculated_at: now,
      })) as never,
    );
    if (error && error.code !== "PGRST205") throw new Error(error.message);
  }

  if (rollup.domains.length > 0) {
    const { error } = await db.from("domain_maturity_scores" as never).insert(
      rollup.domains.map((d) => ({
        organization_id: organizationId,
        framework_id: frameworkId,
        domain_id: d.domain_id,
        maturity_score: round2(d.score),
        control_count: d.control_count,
        answered_count: d.answered_count,
        completion_percentage: d.completion_percentage,
        last_calculated_at: now,
      })) as never,
    );
    if (error && error.code !== "PGRST205") throw new Error(error.message);
  }

  const { error: oErr } = await db.from("organization_maturity_scores" as never).insert({
    organization_id: organizationId,
    framework_id: frameworkId,
    maturity_score: round2(rollup.organization.score),
    total_controls: rollup.organization.total_controls,
    answered_controls: rollup.organization.answered_controls,
    completion_percentage: rollup.organization.completion_percentage,
    last_calculated_at: now,
  } as never);
  if (oErr && oErr.code !== "PGRST205") throw new Error(oErr.message);

  return rollup;
}

async function seedMonthlySnapshots(
  db: AdminDb,
  orgId: string,
  frameworkId: string,
  rollup: {
    organization: { score: number | null; answered_controls: number; total_controls: number };
    domains: unknown[];
    subdomains: unknown[];
  },
) {
  const months = ["2026-02-01", "2026-03-01", "2026-04-01", "2026-05-01"];
  for (let i = 0; i < months.length; i++) {
    const drift = (i - 2) * 0.08;
    const base = rollup.organization.score ?? 2.2;
    const score = Math.min(4, Math.max(1, Math.round((base + drift) * 100) / 100));
    await db.from("monthly_score_snapshots" as never).upsert(
      {
        organization_id: orgId,
        framework_id: frameworkId,
        snapshot_month: months[i],
        organization_score: score,
        domain_scores: rollup.domains,
        subdomain_scores: rollup.subdomains,
        controls_answered_count: rollup.organization.answered_controls,
        controls_total_count: rollup.organization.total_controls,
        controls_changed_this_month: [],
        no_activity_flag: false,
      } as never,
      { onConflict: "organization_id,framework_id,snapshot_month" },
    );
  }
}

async function provisionAccount(
  spec: AccountSpec,
  runtime: Awaited<ReturnType<typeof loadRuntime>>,
) {
  const db = runtime.createAdminSupabaseClient();
  const allFrameworkSlugs = runtime.FRAMEWORK_TILE_DATA.map((f) => f.id);
  const allFrameworksActive = [...new Set(Object.values(runtime.CANONICAL_TO_CONTROLS_CATALOG))];

  console.log(`\n── ${spec.email} (${spec.mode}) ──`);

  const userId = await ensureAuthUser(db, spec.email);
  const orgId = await ensureOrg(db, userId, spec, allFrameworkSlugs, allFrameworksActive);
  await clearOrgData(db, orgId, userId);

  if (spec.mode === "seeded") {
    await seedThreatAndTechStack(db, orgId);
    await seedOrganizationRisks(db, orgId);

    const legacyScores: { frameworkId: string; score: number }[] = [];
    for (const frameworkId of runtime.SUPPORTED_ASSESSMENT_FRAMEWORKS) {
      const count = await seedAssessmentAnswersForFramework(
        db,
        orgId,
        userId,
        frameworkId,
        0.78,
        runtime.deriveSubdomainKey,
      );
      console.log(`  ${frameworkId}: ${count} answers`);
      const rollup = await recalculateAndPersistScoresProvision(
        db,
        orgId,
        frameworkId,
        userId,
        runtime,
      );
      await seedMonthlySnapshots(db, orgId, frameworkId, rollup);
      const catalogKey = runtime.CANONICAL_TO_CONTROLS_CATALOG[frameworkId];
      legacyScores.push({
        frameworkId: catalogKey,
        score: rollup.organization.score ?? 2.2,
      });
    }
    await seedFrameworkScoresLegacy(db, orgId, legacyScores);
  }

  console.log("  OK", {
    email: spec.email,
    userId,
    orgId,
    password: PASSWORD,
    frameworks: allFrameworkSlugs.length,
    orientation:
      "is_onboarded=false, onboarding_completed_at=null — use incognito or clear site localStorage for initialisation modal",
  });
}

async function main() {
  const runtime = await loadRuntime();
  const filterEmail = process.argv.find((a) => /@demo\.com$/i.test(a));
  const targets = filterEmail
    ? ACCOUNTS.filter((a) => a.email.toLowerCase() === filterEmail.toLowerCase())
    : ACCOUNTS;

  if (targets.length === 0) {
    console.error("No matching account spec for", filterEmail);
    process.exit(1);
  }

  for (const spec of targets) {
    await provisionAccount(spec, runtime);
  }

  console.log("\nDone. Login at simplify.is with the credentials above.");
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
