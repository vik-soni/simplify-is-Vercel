import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const TARGET_EMAIL = "vsoni@outlook.com";

function readEnvLocal() {
  const raw = fs.readFileSync(".env.local", "utf8");
  const pairs = raw
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    });
  return Object.fromEntries(pairs);
}

function buildQuestions(frameworkId) {
  const options = [
    "Yes, formally documented and reviewed in the last 12 months",
    "Yes, but not reviewed recently",
    "Informal practices only",
    "Planned but not in place",
    "No",
  ];
  const base = [
    { domain: "GV", name: "Govern", control: "GV.OC-01", label: "Governance ownership documented" },
    { domain: "ID", name: "Identify", control: "ID.AM-01", label: "Critical assets inventoried and owned" },
    { domain: "PR", name: "Protect", control: "PR.AA-01", label: "Access controls and least privilege enforced" },
    { domain: "DE", name: "Detect", control: "DE.CM-01", label: "Security monitoring in place" },
    { domain: "RS", name: "Respond", control: "RS.RP-01", label: "Incident response playbooks maintained" },
    { domain: "RC", name: "Recover", control: "RC.RP-01", label: "Recovery plans tested and improved" },
  ];
  return base.map((item, idx) => ({
    question_key: `${frameworkId}:${item.control}:Q1`,
    framework_id: frameworkId,
    domain_id: item.domain,
    domain_name: item.name,
    control_id: item.control,
    control_name: item.label,
    position: idx + 1,
    prompt: `For ${item.name}, is ${item.label.toLowerCase()}?`,
    answer_options: options,
    allows_freeform: true,
  }));
}

async function main() {
  const env = readEnvLocal();
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id,org_id,email")
    .eq("email", TARGET_EMAIL)
    .maybeSingle();

  if (userError || !user?.org_id) {
    throw new Error(`Target user not found or unlinked: ${userError?.message ?? "unknown"}`);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const frameworks = [
    "NIST_CSF_2_0",
    "ISO_27001_2022",
    "PCI_DSS_4_0",
    "APRA_CPS_234",
    "APRA_CPS_230",
    "ASD_ESSENTIAL_EIGHT",
    "ISO_42001",
    "AUVA_ISS",
    "NIST_AI_RMF",
  ];

  for (const frameworkId of frameworks) {
    const { count, error: countError } = await supabase
      .from("assessment_questions")
      .select("id", { count: "exact", head: true })
      .eq("framework_id", frameworkId);
    if (countError) throw new Error(`Failed reading question count for ${frameworkId}: ${countError.message}`);
    if ((count ?? 0) > 0) continue;
    const { error: insertError } = await supabase
      .from("assessment_questions")
      .insert(buildQuestions(frameworkId));
    if (insertError) throw new Error(`Failed seeding questions for ${frameworkId}: ${insertError.message}`);
  }

  const techStack = {
    organization_id: user.org_id,
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
    notes: "Seeded for UI/UX review (08 May feedback pass).",
    source: "manual_edit",
    last_validated_at: now.toISOString(),
  };

  const { error: stackError } = await supabase
    .from("organization_tech_stack")
    .upsert(techStack, { onConflict: "organization_id" });
  if (stackError) throw new Error(`Failed seeding tech stack: ${stackError.message}`);

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
        narrative: "Attackers reuse breached credentials against exposed login surfaces. Weak MFA coverage and uneven anomaly detection increase account takeover risk, especially during peak usage windows.",
        industry_context: "Financial services peers are seeing sustained auth-layer probing and bot traffic spikes.",
        tech_stack_context: "External APIs and mixed identity providers increase attack paths if rate-limits and MFA are inconsistent.",
        controls: [],
      },
      {
        key: "vendor_account_takeover",
        headline: "Third-party support account compromise",
        severity: "high",
        narrative: "A supplier account with privileged access is compromised and used for lateral movement. Incomplete supplier assurance and role scoping create elevated blast radius.",
        industry_context: "Third-party access incidents continue to be a dominant breach entry point across regulated orgs.",
        tech_stack_context: "Multiple SaaS dependencies and shared support channels increase identity governance complexity.",
        controls: [],
      },
      {
        key: "ransomware_disruption",
        headline: "Ransomware-driven service interruption",
        severity: "medium",
        narrative: "Endpoint compromise escalates to encryption and service disruption. Recovery confidence depends on tested restore paths and triage speed under pressure.",
        industry_context: "Sector peers recover faster where backup drills and runbooks are tested frequently.",
        tech_stack_context: "Hybrid cloud + endpoint diversity increases response coordination requirements.",
        controls: [],
      },
      {
        key: "data_processor_breach",
        headline: "Data processor breach with customer impact",
        severity: "medium",
        narrative: "A downstream processor suffers a breach affecting your customer data. Notification, contractual controls, and segmentation maturity determine legal and operational impact.",
        industry_context: "Processor incidents are rising with stricter regulator attention on accountability chains.",
        tech_stack_context: "Sensitive datasets and third-party connectors raise exposure if governance is uneven.",
        controls: [],
      },
      {
        key: "cloud_region_outage",
        headline: "Cloud region outage affecting core workloads",
        severity: "lower",
        narrative: "A regional cloud event degrades availability. Recovery posture depends on architecture resilience and tested continuity plans.",
        industry_context: "Peers with regular continuity exercises restore key services materially faster.",
        tech_stack_context: "Cross-region dependencies and backup strategy are central to outage resilience.",
        controls: [],
      },
    ],
  };

  // Attach control snippets to threat controls arrays
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

  const { error: cacheError } = await supabase
    .from("threat_readiness_cache")
    .upsert(
      {
        organization_id: user.org_id,
        generated_at: now.toISOString(),
        expires_at: expiresAt,
        payload,
        generation_inputs_hash: `seed_08may_${now.getTime()}`,
      },
      { onConflict: "organization_id" },
    );
  if (cacheError) throw new Error(`Failed seeding threat cache: ${cacheError.message}`);

  const { error: orgError } = await supabase
    .from("organizations")
    .update({
      selected_frameworks: ["nist_csf_2_0", "iso_27001_2022", "pci_dss_4_0", "apra_cps_234"],
      metadata: { seeded_feedback_08may_at: now.toISOString() },
      updated_at: now.toISOString(),
    })
    .eq("id", user.org_id);
  if (orgError) throw new Error(`Failed updating organisation frameworks: ${orgError.message}`);

  console.log("Seed complete for:", TARGET_EMAIL, "org:", user.org_id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

