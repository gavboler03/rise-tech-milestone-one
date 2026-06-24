import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const testLocalUsername = String(process.env.TEST_LOCAL_USERNAME);
const testLocalPassword = String(process.env.TEST_LOCAL_PASSWORD);

const testStateUsername = String(process.env.TEST_STATE_USERNAME);
const testStatePassword = String(process.env.TEST_STATE_PASSWORD);

const testNationalUsername = String(process.env.TEST_NATIONAL_USERNAME);
const testNationalPassword = String(process.env.TEST_NATIONAL_PASSWORD);

const users = [
  {
    username: testLocalUsername,
    password: testLocalPassword,
    role: "Local Admin",
  },
];

for (const user of users) {
  test(`login works for ${user.role}`, async ({ page }) => {
    await page.goto("https://member.fop.net/signin/");

    await expect(page).toHaveTitle("");

    await page.locator("#username").fill(testLocalUsername);
    await page.locator("#password").fill(testLocalPassword);

    await page.waitForTimeout(500);

    const submit = page.getByRole("button", { name: /sign in|log in/i });

    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();

    await Promise.all([page.waitForURL(/dashboard/), submit.click()]);

    await expect(page.getByText(user.role)).toBeVisible();
  });
}
