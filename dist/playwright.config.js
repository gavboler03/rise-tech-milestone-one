"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
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
