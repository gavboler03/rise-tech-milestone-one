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
  {
    username: testStateUsername,
    password: testStatePassword,
    role: "State Admin",
  },
  {
    username: testNationalUsername,
    password: testNationalPassword,
    role: "National Admin",
  },
];

users.map((user) => {
  test(`login works for ${user.role} and has correct access to Reports tab`, async ({
    page,
  }) => {
    await page.goto("https://member.fop.net/signin/");

    await expect(page).toHaveTitle("");

    await page
      .locator("#username")
      .fill(
        user.role === "Local Admin"
          ? testLocalUsername
          : user.role === "State Admin"
            ? testStateUsername
            : testNationalUsername,
      );
    await page
      .locator("#password")
      .fill(
        user.role === "Local Admin"
          ? testLocalPassword
          : user.role === "State Admin"
            ? testStatePassword
            : testNationalPassword,
      );

    await page.waitForTimeout(500);

    const login = page.getByRole("button", { name: /sign in|log in/i });

    await expect(login).toBeVisible();
    await expect(login).toBeEnabled();

    await Promise.all([page.waitForURL(/dashboard/), login.click()]);

    await expect(page.getByText(user.role)).toBeVisible();

    const reports = page.getByRole("button", { name: "Reports" });
    user.role === "Local Admin"
      ? await expect(reports).not.toBeVisible
      : await expect(reports).toBeVisible();
  });
});
