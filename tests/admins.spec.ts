import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { getSecret } from "../helpers/secrets.js";

dotenv.config();

const adminCredentials = await getSecret(
  process.env.ADMIN_SECRET_NAME || "secrets/playwright/ortu3_admin",
);

const users = [
  {
    username: adminCredentials.LOCAL_ADMIN_USERNAME,
    password: adminCredentials.LOCAL_ADMIN_PASSWORD,
    firstname: adminCredentials.LOCAL_ADMIN_FIRSTNAME,
    lastname: adminCredentials.LOCAL_ADMIN_LASTNAME,
    role: "Local Admin",
  },
  {
    username: adminCredentials.STATE_ADMIN_USERNAME,
    password: adminCredentials.STATE_ADMIN_PASSWORD,
    firstname: adminCredentials.STATE_ADMIN_FIRSTNAME,
    lastname: adminCredentials.STATE_ADMIN_LASTNAME,
    role: "State Admin",
  },
  {
    username: adminCredentials.NATIONAL_ADMIN_USERNAME,
    password: adminCredentials.NATIONAL_ADMIN_PASSWORD,
    firstname: adminCredentials.NATIONAL_ADMIN_FIRSTNAME,
    lastname: adminCredentials.NATIONAL_ADMIN_LASTNAME,
    role: "National Admin",
  },
];

users.forEach((user) => {
  test(`Testing for ${user.role}`, async ({ page }) => {
    await page.goto("https://member.fop.net/signin/");

    await expect(page).toHaveTitle("");

    await page.locator("#username").fill(user.username);
    await page.locator("#password").fill(user.password);

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
