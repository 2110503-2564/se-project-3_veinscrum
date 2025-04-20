import { test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test("Sign up as user", async ({ page }) => {
  const { email, password } = await signUp(page, "user");

  await signIn(page, {
    email,
    password,
  });
});

test("Sign up as company", async ({ page }) => {
  const { email, password } = await signUp(page, "company");

  await signIn(page, {
    email,
    password,
  });
});
