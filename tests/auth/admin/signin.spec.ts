import { test } from "@playwright/test";

test("Log in as admin", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/signin");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("Keaton_Yost@yahoo.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("8V3cbW0hJqu656i");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
});
