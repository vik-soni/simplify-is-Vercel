import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
    extraHTTPHeaders: {
      "x-e2e-bypass": "local-e2e-token",
    },
  },
  webServer: {
    command: "E2E_BYPASS_TOKEN=local-e2e-token npm run dev -- --port 3100",
    port: 3100,
    reuseExistingServer: false,
  },
});
