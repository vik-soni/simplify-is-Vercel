/**
 * (Re)seed tech stack + threat readiness for wdata@demo.com.
 *
 * Usage: cd simplify-is && node scripts/seedWdataThreatAndTech.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const TARGET_EMAIL = "wdata@demo.com";

function readEnvLocal() {
  const raw = fs.readFileSync(".env.local", "utf8");
  return Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
}

function buildThreatPayload(now) {
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
        controls: [],
      },
      {
        key: "vendor_account_takeover",
        headline: "Third-party support account compromise",
        severity: "high",
        narrative:
          "A supplier account with privileged access is compromised and used for lateral movement.",
        industry_context: "Third-party access incidents continue to be a dominant breach entry point.",
        tech_stack_context: "Multiple SaaS dependencies increase identity governance complexity.",
        controls: [],
      },
      {
        key: "ransomware_disruption",
        headline: "Ransomware-driven service interruption",
        severity: "medium",
        narrative: "Endpoint compromise escalates to encryption and service disruption.",
        industry_context: "Sector peers recover faster where backup drills are tested frequently.",
        tech_stack_context: "Hybrid cloud increases response coordination requirements.",
        controls: [],
      },
      {
        key: "data_processor_breach",
        headline: "Data processor breach with customer impact",
        severity: "medium",
        narrative: "A downstream processor suffers a breach affecting customer data.",
        industry_context: "Processor incidents are rising with stricter regulator attention.",
        tech_stack_context: "Sensitive datasets and third-party connectors raise exposure.",
        controls: [],
      },
      {
        key: "cloud_region_outage",
        headline: "Cloud region outage affecting core workloads",
        severity: "lower",
        narrative: "A regional cloud event degrades availability.",
        industry_context: "Peers with regular continuity exercises restore key services faster.",
        tech_stack_context: "Cross-region dependencies and backup strategy are central.",
        controls: [],
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

  return payload;
}

function rowToTechStackProfile(row) {
  return {
    cloud_providers: row.cloud_providers ?? [],
    databases: row.databases ?? [],
    data_storage: row.data_storage ?? [],
    backup_strategy: row.backup_strategy ?? "",
    critical_third_party: row.critical_third_party ?? [],
    identity_system: row.identity_system ?? "",
    public_apis: Boolean(row.public_apis),
    public_apis_notes: row.public_apis_notes ?? "",
    data_types: row.data_types ?? [],
    notes: row.notes ?? "",
  };
}

function mapFrameworkForDomainScores(frameworkId) {
  if (frameworkId === "ISO_27001_2022") return "ISO27001";
  if (frameworkId === "NIST_CSF_2.0") return "NIST_CSF";
  return frameworkId;
}

function computeInputsHash(input) {
  const normalized = JSON.stringify({
    organization: input.organization,
    tech_stack: input.tech_stack,
    assessed_controls: [...input.assessed_controls].sort((a, b) =>
      `${a.framework}${a.control_id}`.localeCompare(`${b.framework}${b.control_id}`),
    ),
  });
  return crypto.createHash("sha256").update(normalized).digest("hex");
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
    throw new Error(`User not found: ${userError?.message ?? TARGET_EMAIL}`);
  }

  const orgId = user.org_id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const techStackRow = {
    organization_id: orgId,
    cloud_providers: ["AWS", "Azure"],
    databases: ["RDS PostgreSQL", "MongoDB Atlas"],
    data_storage: ["S3", "SharePoint Online"],
    backup_strategy:
      "Daily encrypted snapshots to S3 with quarterly restore drills; critical DBs use point-in-time recovery.",
    critical_third_party: [
      { name: "Salesforce", purpose: "CRM and customer workflow" },
      { name: "CrowdStrike", purpose: "EDR and endpoint telemetry" },
      { name: "Okta", purpose: "Identity and MFA for workforce" },
    ],
    identity_system: "Azure AD + Okta MFA (phishing-resistant for admins)",
    public_apis: true,
    public_apis_notes:
      "Partner APIs on api.demo-with-data.com behind WAF, OAuth2 client credentials, and per-tenant rate limits.",
    data_types: ["Customer PII", "Financial transactions", "Employee HR data", "Cardholder data (CDE subset)"],
    notes: "Seeded demo profile for wdata@demo.com — Tech Stack + Threat Readiness review.",
    source: "manual_edit",
    last_validated_at: now.toISOString(),
  };

  const { error: stackErr } = await supabase
    .from("organization_tech_stack")
    .upsert(techStackRow, { onConflict: "organization_id" });
  if (stackErr) throw new Error(`tech stack: ${stackErr.message}`);

  await supabase.from("domain_scores").delete().eq("organization_id", orgId);

  const { data: maturityDomains } = await supabase
    .from("domain_maturity_scores")
    .select("framework_id,domain_id,maturity_score")
    .eq("organization_id", orgId);

  const domainRows = [];
  for (const row of maturityDomains ?? []) {
    const score = Number(row.maturity_score ?? 2.2);
    const prev = Math.max(1, Math.round((score - 0.15) * 100) / 100);
    domainRows.push({
      organization_id: orgId,
      framework_id: mapFrameworkForDomainScores(row.framework_id),
      domain_id: row.domain_id,
      domain_name: row.domain_id,
      maturity_score: score,
      previous_score: prev,
      score_delta: Math.round((score - prev) * 100) / 100,
      scored_at: now.toISOString(),
    });
  }

  if (domainRows.length > 0) {
    const { error: dsErr } = await supabase.from("domain_scores").insert(domainRows);
    if (dsErr) console.warn("domain_scores insert:", dsErr.message);
  }

  const payload = buildThreatPayload(now);
  const threatKeys = payload.threats.map((t) => t.key);

  await supabase.from("organization_threats").delete().eq("organization_id", orgId);
  const { error: otErr } = await supabase.from("organization_threats").insert(
    threatKeys.map((threat_key, display_order) => ({
      organization_id: orgId,
      threat_key,
      display_order,
      applicability: "applies",
    })),
  );
  if (otErr) console.warn("organization_threats:", otErr.message);

  const { data: org } = await supabase
    .from("organizations")
    .select("name,industry,workforce_scale,size")
    .eq("id", orgId)
    .single();

  const assessed_controls = [];
  const seen = new Set();
  for (const row of domainRows) {
    const key = `${row.framework_id}::${row.domain_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    assessed_controls.push({
      framework: row.framework_id === "ISO27001" ? "ISO 27001:2022" : "NIST CSF 2.0",
      control_id: row.domain_id,
      control_name: row.domain_name,
      control_summary: "",
      current_score: Number(row.maturity_score),
      previous_score: row.previous_score === null ? null : Number(row.previous_score),
    });
  }

  const generationInput = {
    organization: {
      name: org?.name ?? "Demo With Data Pty Ltd",
      industry: org?.industry ?? "Financial Services (Banking, Insurance, Superannuation)",
      workforce_scale: org?.workforce_scale ?? org?.size ?? "medium",
    },
    tech_stack: rowToTechStackProfile(techStackRow),
    assessed_controls,
    existing_customizations: threatKeys.map((threat_key, display_order) => ({
      threat_key,
      custom_headline: null,
      applicability: "applies",
      display_order,
    })),
  };

  const hash = computeInputsHash(generationInput);

  const { error: cacheErr } = await supabase.from("threat_readiness_cache").upsert(
    {
      organization_id: orgId,
      generated_at: now.toISOString(),
      expires_at: expiresAt,
      payload,
      generation_inputs_hash: hash,
    },
    { onConflict: "organization_id" },
  );
  if (cacheErr) throw new Error(`threat cache: ${cacheErr.message}`);

  console.log("OK — seeded tech stack + threat readiness for", TARGET_EMAIL);
  console.log({
    orgId,
    domain_scores: domainRows.length,
    threats: threatKeys.length,
    cacheExpires: expiresAt,
    generation_inputs_hash: hash.slice(0, 16) + "…",
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
