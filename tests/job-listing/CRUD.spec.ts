import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Company CRUD", () => {
  let page: Page;
  const jobTitle = faker.person.jobTitle();
  const jobDescription = faker.lorem.paragraph();
  

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test("US2-1: Create Job Listing by Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE));

    await expect(
      page.getByRole("heading", { name: "Create Job" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Job Title" }).click();
    await page.getByRole("textbox", { name: "Job Title" }).fill(jobTitle);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .getByRole("paragraph")
      .click();
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);
    await page.getByRole("button", { name: "Create" }).click();
  
  });

  
});