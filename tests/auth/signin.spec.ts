import { test } from "@playwright/test";
import { signIn } from "../utils/signIn";

test("Log in as admin", async ({ page }) => {
  await signIn(page, {
    role: "admin",
  });
});

test("Log in as company", async ({ page }) => {
  await signIn(page, {
    role: "company",
  });
});

test("Log in as user", async ({ page }) => {
  await signIn(page, {
    role: "user",
  });
});
