"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testNationalViewOnlyUsername = String(process.env.TEST_NATIONAL_VIEWONLY_USERNAME);
const testNationalViewOnlyPassword = String(process.env.TEST_NATIONAL_VIEWONLY_PASSWORD);
const user = {
    username: testNationalViewOnlyUsername,
    password: testNationalViewOnlyPassword,
    role: "National User",
};
(0, test_1.test)(`National user can log in and does not see Approval Queue dashboard widget or tab`, async ({ page, }) => {
    await page.goto("https://member.fop.net/signin/");
    await (0, test_1.expect)(page).toHaveTitle("");
    await page.locator("#username").fill(testNationalViewOnlyUsername);
    await page.locator("#password").fill(testNationalViewOnlyPassword);
    await page.waitForTimeout(500);
    const button = page.getByRole("button", { name: /sign in|log in/i });
    await (0, test_1.expect)(button).toBeVisible();
    await (0, test_1.expect)(button).toBeEnabled();
    await Promise.all([page.waitForURL(/dashboard/), button.click()]);
    await (0, test_1.expect)(page.getByText(user.role)).toBeVisible();
    await (0, test_1.expect)(page.getByText("Approval Queue")).not.toBeVisible();
});
