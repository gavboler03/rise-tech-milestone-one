import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const testLocalUsername = String(process.env.TEST_LOCAL_USERNAME);
const testLocalPassword = String(process.env.TEST_LOCAL_PASSWORD);
const testLocalFirstName = String(process.env.TEST_LOCAL_FIRSTNAME);
const testLocalLastName = String(process.env.TEST_LOCAL_LASTNAME);

const testStateUsername = String(process.env.TEST_STATE_USERNAME);
const testStatePassword = String(process.env.TEST_STATE_PASSWORD);
const testStateFirstName = String(process.env.TEST_STATE_FIRSTNAME);
const testStateLastName = String(process.env.TEST_STATE_LASTNAME);

const testNationalUsername = String(process.env.TEST_NATIONAL_USERNAME);
const testNationalPassword = String(process.env.TEST_NATIONAL_PASSWORD);
const testNationalFirstName = String(process.env.TEST_NATIONAL_FIRSTNAME);
const testNationalLastName = String(process.env.TEST_NATIONAL_LASTNAME);

const users = [
  {
    username: testLocalUsername,
    password: testLocalPassword,
    firstname: testLocalFirstName,
    lastname: testLocalLastName,
    role: "Local Admin",
  },
  {
    username: testStateUsername,
    password: testStatePassword,
    firstname: testStateFirstName,
    lastname: testStateLastName,
    role: "State Admin",
  },
  {
    username: testNationalUsername,
    password: testNationalPassword,
    firstname: testNationalFirstName,
    lastname: testNationalLastName,
    role: "National Admin",
  },
];

users.map((user) => {
  test(`Testing for ${user.role}`, async ({ page }) => {
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
      ? await expect(reports).not.toBeVisible()
      : await expect(reports).toBeVisible();

    const officers = page.getByRole("link", { name: "Officers" });
    user.role == "Local Admin"
      ? await expect(officers).not.toBeVisible()
      : await expect(officers).toBeVisible();

    const profile = page.getByRole("button", {
      name: `${user.firstname} ${user.lastname}`,
    });

    await profile.click();

    const sign_out = page.getByRole("menuitem", { name: "Sign Out" });
    await sign_out.click();

    await expect(page).toHaveURL(/signin/);
  });
});
