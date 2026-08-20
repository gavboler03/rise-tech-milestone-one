import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const localAdminUsername = String(process.env.LOCAL_ADMIN_USERNAME);
const localAdminPassword = String(process.env.LOCAL_ADMIN_PASSWORD);
const localAdminFirstName = String(process.env.LOCAL_ADMIN_FIRSTNAME);
const localAdminLastName = String(process.env.LOCAL_ADMIN_LASTNAME);

const stateAdminUsername = String(process.env.STATE_ADMIN_USERNAME);
const stateAdminPassword = String(process.env.STATE_ADMIN_PASSWORD);
const stateAdminFirstName = String(process.env.STATE_ADMIN_FIRSTNAME);
const stateAdminLastName = String(process.env.STATE_ADMIN_LASTNAME);

const nationalAdminUsername = String(process.env.NATIONAL_ADMIN_USERNAME);
const nationalAdminPassword = String(process.env.NATIONAL_ADMIN_PASSWORD);
const nationalAdminFirstName = String(process.env.NATIONAL_ADMIN_FIRSTNAME);
const nationalAdminLastName = String(process.env.NATIONAL_ADMIN_LASTNAME);

const users = [
  {
    username: localAdminUsername,
    password: localAdminLastName,
    firstname: localAdminFirstName,
    lastname: localAdminLastName,
    role: "Local Admin",
  },
  {
    username: stateAdminUsername,
    password: stateAdminPassword,
    firstname: stateAdminFirstName,
    lastname: stateAdminLastName,
    role: "State Admin",
  },
  {
    username: nationalAdminUsername,
    password: nationalAdminPassword,
    firstname: nationalAdminFirstName,
    lastname: nationalAdminLastName,
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
          ? localAdminUsername
          : user.role === "State Admin"
            ? stateAdminUsername
            : nationalAdminUsername,
      );
    await page
      .locator("#password")
      .fill(
        user.role === "Local Admin"
          ? localAdminPassword
          : user.role === "State Admin"
            ? stateAdminPassword
            : nationalAdminPassword,
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
