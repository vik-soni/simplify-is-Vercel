#!/usr/bin/env node
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

const port = process.env.PORT ?? "3000";
const base = process.env.CONTACT_TEST_URL ?? `http://localhost:${port}`;

const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/contact`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Contact Test",
    email: "contact-test@example.com",
    country: "Australia",
    subject: "product_capability",
    message: "This is a smoke test from the simplify-is-Vercel CLI script.",
  }),
});

const body = await res.json().catch(() => ({}));
console.log("Status:", res.status);
console.log("Body:", JSON.stringify(body, null, 2));
if (!res.ok) process.exit(1);
console.log("\nCheck inbox:", process.env.VIK_ALERT_EMAIL ?? "vik@simplify.is");
