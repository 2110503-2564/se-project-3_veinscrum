import { BackendRoutes } from "@/constants/routes/Backend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { expect, test } from "@playwright/test";

test.describe("Company Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/auth/signin");
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("mock01@email.com");
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill("12345678");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Sign in" })
      .click();
    await page.waitForURL(withFrontendRoute(BackendRoutes.HOME));
  });

  test("should show company name, email, and info", async ({ page }) => {
    // Navigate to profile page and wait for network to be idle
    await page.goto("http://localhost:3000/profile", {
      waitUntil: "networkidle",
    });

    // Check company name in the heading
    await expect(page.getByRole("heading", { name: "Aladin" })).toBeVisible({
      timeout: 10000,
    });

    // Check address
    await expect(
      page.getByText("Tokyo summer time Saga", { exact: true }),
    ).toBeVisible({ timeout: 10000 });

    // Check website URL
    await expect(
      page.getByText("https://Aladin.com", { exact: true }),
    ).toBeVisible({ timeout: 10000 });

    // Check phone number
    await expect(page.getByText("0956644440", { exact: true })).toBeVisible({
      timeout: 10000,
    });

    // Check description
    await expect(
      page.getByText("Develop everything from Saudi environment", {
        exact: true,
      }),
    ).toBeVisible({ timeout: 10000 });
  });
});
