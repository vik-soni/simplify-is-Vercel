import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e/"],
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "orchestration/**/*.ts",
    "!orchestration/**/index.ts",
  ],
};

export default config;

