import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function listFiles(dir, match) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, match));
    else if (match(full)) out.push(full);
  }
  return out;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const apiRoutes = listFiles(path.join(root, "app", "api", "v1"), (f) => f.endsWith("route.ts"));
const authCoverage = apiRoutes.map((file) => {
  const content = read(file);
  const needsInternalSecret = file.includes("/notifications/send/") || file.includes("/billing/webhook/");
  const hasAuth = /requireApiUser\(/.test(content);
  const hasSecret = /x-orchestration-secret|stripe-signature/.test(content);
  return {
    file: path.relative(root, file),
    passes: needsInternalSecret ? hasSecret : hasAuth,
    reason: needsInternalSecret ? "internal secret validation" : "requireApiUser validation",
  };
});

const appAndComponents = listFiles(root, (f) =>
  /\.(ts|tsx)$/.test(f) &&
  (f.includes("/app/") || f.includes("/components/")) &&
  !f.includes("/node_modules/") &&
  !f.includes("/.next/") &&
  !f.includes("/coverage/"),
);
const secretLeaks = appAndComponents.filter((file) => /SUPABASE_SERVICE_KEY|ANTHROPIC_API_KEY/.test(read(file)));
const productionSource = listFiles(root, (f) =>
  /\.(ts|tsx|js|mjs)$/.test(f) &&
  (f.includes("/app/") || f.includes("/components/") || f.includes("/lib/") || f.includes("/orchestration/")) &&
  !f.includes("/tests/") &&
  !f.includes("/node_modules/") &&
  !f.includes("/.next/"),
);
const consoleLogLeaks = productionSource.filter((file) => /console\.log\(/.test(read(file)));

const report = {
  generatedAt: new Date().toISOString(),
  authCoverage,
  authCoveragePass: authCoverage.every((item) => item.passes),
  secretLeakFiles: secretLeaks.map((file) => path.relative(root, file)),
  consoleLogFiles: consoleLogLeaks.map((file) => path.relative(root, file)),
};

const outPath = path.join(root, "agents", "SECURITY_AUDIT_REPORT.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

if (!report.authCoveragePass || report.secretLeakFiles.length > 0 || report.consoleLogFiles.length > 0) {
  console.error("Security audit failed. See agents/SECURITY_AUDIT_REPORT.json");
  process.exit(1);
}

console.error("Security audit passed. Report: agents/SECURITY_AUDIT_REPORT.json");
