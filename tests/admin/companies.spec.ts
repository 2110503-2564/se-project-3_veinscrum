import { BackendRoutes } from "@/constants/routes/Backend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(withFrontendRoute(BackendRoutes.AUTH_LOGIN));
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("Keaton_Yost@yahoo.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("8V3cbW0hJqu656i");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(withFrontendRoute(BackendRoutes.HOME));
});

test("should navigate to admin sessions page", async ({ page }) => {
  // Navigate to admin companies page
  await page.goto(withFrontendRoute(BackendRoutes.ADMIN_SESSION));

  // Verify we're on the admin companies page
  await expect(
    page.getByRole("heading", { name: "All Scheduled Sessions" }),
  ).toBeVisible();
});
