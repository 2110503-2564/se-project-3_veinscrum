import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("User View Company Profile", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "user");
    await signIn(page, {
      email,
      password,
    });
  });

  test("US1-9: User View Company Profile", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));
    await expect(
      page.getByRole("heading", { name: "Online Job Fair Registration" }),
    ).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: "Aladin" })
      .nth(2)
      .getByText("View Company")
      .click();
    await expect(page.locator("h1")).toContainText("Aladin");
    await expect(page.locator("body")).toContainText("Tokyo summer time Saga");
    await expect(page.locator("body")).toContainText("https://Aladin.com");
    await expect(page.locator("body")).toContainText("0956644440");
    await expect(
      page.getByLabel("editable markdown").getByRole("paragraph"),
    ).toContainText("Develop everything from Saudi environment");
    await expect(page.locator("h2")).toContainText("Job Listings");
    await expect(page.locator("body")).toContainText(
      "Junior Software Engineer",
    );
    await expect(page.locator("body")).toContainText("Aladin");
    await expect(page.locator("body")).toContainText("Tokyo summer time Saga");
  });
});
