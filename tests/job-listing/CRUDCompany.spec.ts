import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Job Listing CRUD", () => {
  let page: Page;
  let notLoginPage: Page;
  let jobId: string | undefined;
  let companyId: string | undefined;

  const jobTitle = faker.person.jobTitle();
  const jobDescription = faker.lorem.paragraph();

  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.describe.configure({ mode: "serial" });

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const notLogincontext = await browser.newContext();

    page = await context.newPage();
    notLoginPage = await notLogincontext.newPage();

    const { email, password } = await signUp(page, "company");

    await signIn(page, {
      email,
      password,
    });

    await page.waitForTimeout(2000);

    await signIn(notLoginPage, {
      email,
      password,
    });

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.COMPANY_CREATE));

    await expect(page.getByTestId("company-create-title")).toBeVisible();
    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page.getByTestId("company-create-website-input").fill(website);
    await page.getByTestId("company-create-tel-input").fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.COMPANIES) &&
        response.status() === 201,
    );

    await page.getByTestId("company-create-submit-button").click();

    const response: { data: Company } = await responsePromise.then(
      async (response) => await response.json(),
    );

    companyId = response.data.id;

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
  });

  test("US1-5A: Create Job Listing by Company (Success)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE));

    await expect(page.getByTestId("job-listing-create-title")).toBeVisible();

    await page.getByTestId("job-listing-create-job-title-input").fill(jobTitle);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    await page.waitForTimeout(2000);

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await page.getByTestId("job-listing-create-submit-button").click();

    const response: { data: JobListing } = await responsePromise.then(
      async (response) => await response.json(),
    );

    jobId = response.data._id;
  });

  test("US1-5B: Create Job Listing by Company (Fail)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE));

    await expect(page.getByTestId("job-listing-create-title")).toBeVisible();

    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    await page.waitForTimeout(2000);

    await page.getByTestId("job-listing-create-submit-button").click();

    await expect(
      page.getByTestId("job-listing-create-job-title-error"),
    ).toBeVisible();
  });

  test("US1-6A: View Job Listing in Profile (Success)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(jobTitle)).toBeVisible();
  });

  test("US1-6B: View Job Listing in Profile (Not Logged In)", async () => {
    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.HOME));

    await notLoginPage.getByTestId("auth-dropdown-menu-trigger").click();
    await notLoginPage.getByTestId("auth-dropdown-menu-profile").click();

    await notLoginPage.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await notLoginPage.waitForLoadState("domcontentloaded");

    await expect(notLoginPage.getByText(jobTitle)).toBeVisible();

    await notLoginPage.getByTestId("auth-dropdown-menu-trigger").click();
    await notLoginPage.getByTestId("auth-dropdown-menu-logout").click();

    await notLoginPage.waitForTimeout(2000);

    await notLoginPage.waitForURL(
      withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN),
    );
    await notLoginPage.waitForLoadState("domcontentloaded");

    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.PROFILE));

    await expect(notLoginPage.getByTestId("signin-title")).toBeVisible();
  });

  test("US1-7A: Edit Job Listing by Company (Success)", async () => {
    const newJobTitle = faker.person.jobTitle();
    const newJobDescription = faker.lorem.paragraph();

    if (!jobId) {
      throw new Error("Job ID is not set");
    }

    await page.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID_EDIT({ jobId })),
    );
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("form")).toBeVisible();

    const titleInput = page.getByTestId("job-listing-edit-job-title-input");
    const descriptionEditor = page.getByRole("textbox", {
      name: "editable markdown",
    });

    await expect(titleInput).toBeVisible();
    await expect(descriptionEditor).toBeVisible();

    await titleInput.clear();
    await titleInput.fill(newJobTitle);

    await descriptionEditor.clear();
    await descriptionEditor.fill(newJobDescription);

    await page.getByTestId("job-listing-edit-submit-button").click();

    if (!companyId) {
      throw new Error("Company ID is not set");
    }

    await page.waitForURL(
      withFrontendRoute(
        FrontendRoutes.COMPANY_PROFILE({
          companyId: companyId,
        }),
      ),
    );
  });

  test("US1-7B: Edit Job Listing by Company (Fail)", async () => {
    const newJobDescription = faker.lorem.paragraph();

    if (!jobId) {
      throw new Error("Job ID is not set");
    }

    await page.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID_EDIT({ jobId })),
    );
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("form")).toBeVisible();

    const titleInput = page.getByTestId("job-listing-edit-job-title-input");
    const descriptionEditor = page.getByRole("textbox", {
      name: "editable markdown",
    });

    await expect(titleInput).toBeVisible();
    await expect(descriptionEditor).toBeVisible();

    await titleInput.clear();
    await descriptionEditor.clear();
    await descriptionEditor.fill(newJobDescription);

    await page.getByTestId("job-listing-edit-submit-button").click();

    await expect(
      page.getByTestId("job-listing-edit-job-title-error"),
    ).toBeVisible();
  });

  test("US1-8A: Delete Job Listing by Company (Success)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await page.getByTestId("job-card-delete-button").click();
    await page.getByTestId("job-listing-delete-dialog-submit-button").click();
    await expect(
      page.getByTestId("company-profile-no-job-listings"),
    ).toBeVisible();
  });

  test("US1-8B: Delete Job Listing by Company (No Job Listing)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("job-card-delete-button")).not.toBeVisible();
    await expect(
      page.getByTestId("job-listing-delete-dialog-submit-button"),
    ).not.toBeVisible();

    await expect(
      page.getByTestId("company-profile-no-job-listings"),
    ).toBeVisible();
  });
});
