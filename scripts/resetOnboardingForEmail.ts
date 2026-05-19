/**
 * Reset post-login onboarding for a user (by email): step 1+ again from naming Cypher,
 * and clears org completion so /onboarding layout + initialisation flow can replay.
 *
 * Usage (from repo root):
 *   cd simplify-is && npx dotenv -e .env.local -- npx tsx scripts/resetOnboardingForEmail.ts vsoni@outlook.com
 */

import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { createAdminSupabaseClient } from "../lib/db/admin";

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Usage: npx tsx scripts/resetOnboardingForEmail.ts <email>");
  process.exit(1);
}

async function main(): Promise<void> {
  const db = createAdminSupabaseClient();

  const { data: userRow, error: userErr } = await db
    .from("users")
    .select("id,email,org_id,is_onboarded")
    .ilike("email", email)
    .maybeSingle();

  if (userErr) {
    console.error("users lookup failed:", userErr.message);
    process.exit(1);
  }
  if (!userRow) {
    console.error("No public.users row for email:", email);
    process.exit(1);
  }

  const userId = userRow.id as string;
  const orgIdFromUser = userRow.org_id as string | null;

  const { error: userUpErr } = await db
    .from("users")
    .update({ is_onboarded: false, agent_name: "Cypher" } as never)
    .eq("id", userId);

  if (userUpErr) {
    console.error("users update failed:", userUpErr.message);
    process.exit(1);
  }

  const orgIds = new Set<string>();
  if (orgIdFromUser) orgIds.add(orgIdFromUser);

  const { data: owned } = await db
    .from("organizations")
    .select("id")
    .eq("owner_user_id", userId);

  for (const row of (owned as { id: string }[] | null) ?? []) {
    orgIds.add(row.id);
  }

  if (orgIds.size === 0) {
    console.warn("Updated user only (no organisation linked). Login will redirect to /onboarding.");
    console.log("OK", { userId, email: userRow.email });
    return;
  }

  for (const orgId of orgIds) {
    const { error: orgErr } = await db
      .from("organizations")
      .update({
        onboarding_step: 0,
        onboarding_completed_at: null,
        consultant_name: null,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", orgId);

    if (orgErr) {
      console.error("organizations update failed for", orgId, orgErr.message);
      process.exit(1);
    }
  }

  console.log("OK — onboarding reset", {
    email: userRow.email,
    userId,
    organisationIds: [...orgIds],
  });
  console.log(
    "Note: Client localStorage/sessionStorage keys (initialisation, tech stack banner) are per-browser; clear site data or use incognito to replay the initialisation modal.",
  );
}

void main();
