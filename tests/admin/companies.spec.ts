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
  
  // Click on the user button (with name "Brenda Luettgen") to open the dropdown menu
  await page.getByRole("button", { name: "Brenda Luettgen" }).click();

  // Click on the "Profile" option in the dropdown menu
  await page.getByRole("menuitem", { name: "Profile" }).click();

  // Assert that the text "ProfileBrenda" is visible on the page
  await expect(page.getByText("ProfileBrenda")).toBeVisible();

  // Assert that the heading with the name "Profile" is visible
  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

  // Assert that the user's full name "Brenda Luettgen" is visible within the main section
  await expect(
    page.getByRole("main").getByText("Brenda Luettgen"),
  ).toBeVisible();

  // Assert that the user's email "Keaton_Yost@yahoo.com" is visible
  await expect(page.getByText("Keaton_Yost@yahoo.com")).toBeVisible();

  // Assert that a phone number ending in "-960-2295" is visible
  await expect(page.getByText("-960-2295")).toBeVisible();

  // Assert that the user button (with name "Brenda Luettgen") is still visible
  await expect(
    page.getByRole("button", { name: "Brenda Luettgen" }),
  ).toBeVisible();
});
