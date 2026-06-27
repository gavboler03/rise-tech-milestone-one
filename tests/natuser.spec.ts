import { test, expect } from "@playwright/test";

import dotenv from "dotenv";

dotenv.config();

const testNationalViewOnlyUsername = String(
  process.env.TEST_NATIONAL_VIEWONLY_USERNAME,
);
const testNationalViewOnlyPassword = String(
  process.env.TEST_NATIONAL_VIEWONLY_PASSWORD,
);

const users = [
  {
    username: testNationalViewOnlyUsername,
    password: testNationalViewOnlyPassword,
    role: "National User",
  },
];

test(`National user does not see Approval Queue dashboard widget or tab`, async ({
  page,
}) => {});
