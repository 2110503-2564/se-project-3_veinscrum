import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("comp01@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("12345678");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(withFrontendRoute(BackendRoutes.HOME));

});

