#!/usr/bin/env node
/**
 * Smoke-test Resend waitlist delivery. Loads .env.local from repo root.
 * Usage: node scripts/test-waitlist-email.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const base =
  process.env.WAITLIST_TEST_URL ??
  (process.env.NEXT_PUBLIC_APP_URL?.includes("localhost")
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000");
const payload = {
  first_name: "Waitlist",
  last_name: "Test",
  organisation_name: "Simplify IS Smoke Test",
  email: "waitlist-test@example.com",
  source: "cli_smoke_test",
};

const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/waitlist`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const body = await res.json().catch(() => ({}));
console.log("Status:", res.status);
console.log("Body:", JSON.stringify(body, null, 2));

if (!res.ok) {
  process.exit(1);
}

console.log("\nCheck inbox:", process.env.VIK_ALERT_EMAIL ?? "vik@simplify.is");
