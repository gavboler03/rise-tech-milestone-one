import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 60_000,

  fullyParallel: false,

  workers: 1,

  outputDir: "/tmp/playwright-test-results",

  reporter: [
    ["line"],
    [
      "html",
      {
        outputFolder: "/tmp/playwright-report",
        open: "never",
      },
    ],
  ],

  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
});
