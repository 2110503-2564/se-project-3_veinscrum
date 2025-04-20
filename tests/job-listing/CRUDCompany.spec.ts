import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Job Listing CRUD", () => {
  let page: Page;
  const jobTitle = faker.person.jobTitle();
  const jobDescription = faker.lorem.paragraph();

  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test("US1-0: Pre Create Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(
      page.getByRole("heading", { name: "Online Job Fair Registration" }),
    ).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();

    await page.getByRole("menuitem", { name: "Create Company" }).click();
    await page.waitForURL(withFrontendRoute(FrontendRoutes.COMPANY_CREATE));

    await expect(
      page.getByRole("heading", { name: "Create Company" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Company Name" }).click();
    await page.getByRole("textbox", { name: "Company Name" }).fill(companyName);
    await page.getByRole("textbox", { name: "Address" }).click();
    await page.getByRole("textbox", { name: "Address" }).fill(address);
    await page.getByRole("textbox", { name: "Website" }).click();
    await page.getByRole("textbox", { name: "Website" }).fill(website);
    await page.getByRole("textbox", { name: "Telephone" }).click();
    await page.getByRole("textbox", { name: "Telephone" }).fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .getByRole("paragraph")
      .click();
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.HOME));
  });

  test("US1-5: Create Job Listing by Company", async () => {
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

  test("US1-6: View Job Listing by Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();
    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));

    await expect(page.getByText(jobTitle)).toBeVisible();
    await expect(page.getByText(jobDescription)).toBeVisible();
  });

  test("US1-7: Edit Job Listing by Company", async () => {
    const JOB_ID = "6803cc086c2b0061e6e00d48";
    const JOB_TITLE = faker.person.jobTitle();
    const JOB_DESCRIPTION = faker.lorem.paragraph();

    await page.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID_EDIT({ jobId: JOB_ID })),
    );
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("form");

    // Wait for form
    await expect(page.locator("form")).toBeVisible();

    // Get form elements and wait for them
    const titleInput = page.locator("input[name='jobTitle']");
    const descriptionEditor = page.locator("[contenteditable='true']");

    await expect(titleInput).toBeVisible();
    await expect(descriptionEditor).toBeVisible();

    // Fill in the title
    await titleInput.clear();
    await titleInput.fill(JOB_TITLE);

    // Fill in the description using the rich text editor
    await descriptionEditor.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(JOB_DESCRIPTION);

    // Find and click the submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Submit
    await submitButton.click();
  });

  test("US1-8: delete Job Listing by Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();
    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));

    await page.getByRole("button", { name: "Delete Details" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("No job listings available.")).toBeVisible();
  });

  
});
