import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Job Listing CRUD", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "user");
    await signIn(page, {
      email,
      password,
    });
  });

  test("US1-9: User View Job Listings on a Company Profile", async () => {
    // Go to the company profile page
    const companyId = "68027db06431ebb14df8026a";
    const jobCount = 2;
    await page.getByRole("link", { name: "Companies" }).click();
    await expect(page).toHaveURL(/\/company$/);

    const card = page
      .getByRole("heading", { name: "Domtao" })
      .locator("..")
      .locator("..");
    await card.getByText("View Company").waitFor({ state: "visible" });
    await card.getByRole("link", { name: "View Company" }).click();

    // Verify the URL
    await expect(page).toHaveURL(new RegExp(`/company/${companyId}$`));

    // Job listings section
    await page
      .getByRole("heading", { name: "Job Listings", level: 2 })
      .waitFor({ state: "visible" });

    const jobCards = page.getByTestId("job-card");
    await expect(jobCards).toHaveCount(jobCount);

    for (let i = 0; i < 2; i++) {
      const card = jobCards.nth(i);
      await expect(card).toBeVisible();
      await card.getByRole("link", { name: "View Details" }).click();

      await expect(
        page.getByRole("button", { name: "Book Interview Session" }),
      ).toBeVisible();
      await expect(page.getByTestId("job-title").first()).toBeVisible();

      await page.goBack();
      await page.getByTestId("job-card").first().waitFor({ state: "visible" });
    }
  });
});
