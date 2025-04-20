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
    await page.getByText("View Company").first().click();
    await expect(page.locator("h1")).toContainText("TechNova Solutions");
    await expect(page.locator("span")).toContainText(
      "TechNova Solutions is a leading provider of cutting-edge software and IT services, delivering innovative digital solutions to businesses worldwide.",
    );
    await expect(page.locator("body")).toContainText(
      "123 Innovation Avenue, Silicon Valley, CA 94043",
    );
    await expect(page.locator("body")).toContainText("http://www.google.com");
    await expect(page.locator("body")).toContainText("0805557890");
    await expect(page.locator("h2")).toContainText("Job Listings");
    await expect(page.locator("body")).toContainText(
      "No job listings available.",
    );
  });
});
