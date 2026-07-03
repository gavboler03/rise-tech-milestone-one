import { test, expect } from "@playwright/test";

import dotenv from "dotenv";

dotenv.config();

const testNationalViewOnlyUsername = String(
  process.env.TEST_NATIONAL_VIEWONLY_USERNAME,
);
const testNationalViewOnlyPassword = String(
  process.env.TEST_NATIONAL_VIEWONLY_PASSWORD,
);

const user = {
  username: testNationalViewOnlyUsername,
  password: testNationalViewOnlyPassword,
  role: "National User",
};
test(`National user can log in and does not see Approval Queue dashboard widget or tab`, async ({
  page,
}) => {
  await page.goto("https://member.fop.net/signin/");

  await expect(page).toHaveTitle("");

  await page.locator("#username").fill(testNationalViewOnlyUsername);
  await page.locator("#password").fill(testNationalViewOnlyPassword);

  await page.waitForTimeout(500);

  const button = page.getByRole("button", { name: /sign in|log in/i });

  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();

  await Promise.all([page.waitForURL(/dashboard/), button.click()]);

  await expect(page.getByText(user.role)).toBeVisible();

  await expect(page.getByText("Approval Queue")).not.toBeVisible();
});
