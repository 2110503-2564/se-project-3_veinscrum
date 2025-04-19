import { BackendRoutes } from "@/constants/routes/Backend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { test } from "@playwright/test";

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

test("Create Company as admin", async ({ page }) => {
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.getByRole("link", { name: "Companies" }).click();
  await page.getByRole("link", { name: "Add Company" }).click();
  await page.getByRole("textbox", { name: "Company Name" }).click();
  await page
    .getByRole("textbox", { name: "Company Name" })
    .fill("Playwright Company 234");
  await page.getByRole("textbox", { name: "Address" }).click();
  await page
    .getByRole("textbox", { name: "Address" })
    .fill("Floor 5th Room 508 Jumpi Hornai");
  await page.getByRole("textbox", { name: "Website" }).click();
  await page
    .getByRole("textbox", { name: "Website" })
    .fill("http://www.playwright.com");
  await page
    .getByRole("textbox", { name: "editable markdown" })
    .getByRole("paragraph")
    .click();
  await page
    .getByRole("textbox", { name: "editable markdown" })
    .fill("This is the best company, Even room 508 bed A said it was great.");
  await page.getByText("This is the best company,").click();
  await page.getByRole("combobox", { name: "Block type" }).click();
  await page.getByRole("option", { name: "Heading 1" }).click();
  await page.getByText("This is the best company,").click();
  await page.getByRole("textbox", { name: "Telephone" }).click();
  await page.getByRole("textbox", { name: "Telephone" }).fill("0842164545");
  await page.getByRole("button", { name: "Create" }).click();
});
