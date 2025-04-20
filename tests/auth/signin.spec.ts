import { test } from "@playwright/test";
import { signIn } from "../utils/signIn";

test("Log in as admin", async ({ page }) => {
  await signIn(page, {
    role: "admin",
  });
});
