import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Job Listing CRUD", () => {
  let page: Page;

  let jobId: string | undefined;

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
    page = await context.newPage();

    const { email: companyEmail, password: companyPassword } = await signUp(
      page,
      "company",
    );
    await signIn(page, {
      email: companyEmail,
      password: companyPassword,
    });

    await expect(
      page.getByRole("heading", { name: "Online Job Fair Registration" }),
    ).toBeVisible();

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

    await page.getByTestId("company-create-submit-button").click();

    await page.goto(withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE));

    await expect(page.getByTestId("job-listing-create-title")).toBeVisible();
    await page.getByTestId("job-listing-create-job-title-input").fill(jobTitle);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await page.waitForTimeout(2000);

    await page.getByTestId("job-listing-create-submit-button").click();

    const response: { data: JobListing } = await responsePromise.then(
      async (response) => await response.json(),
    );

    jobId = response.data._id;

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-logout").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));
    await page.waitForLoadState("domcontentloaded");

    await page.waitForTimeout(2000);

    const { email: userEmail, password: userPassword } = await signUp(
      page,
      "user",
    );

    await signIn(page, {
      email: userEmail,
      password: userPassword,
    });
  });

  test("US1-9A: User View Job Listings on a Company Profile", async () => {
    if (!jobId) {
      throw new Error("Job ID is not set");
    }

    await page.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID({ jobId })),
    );

    await expect(page.getByTestId("job-title")).toBeVisible();
  });

  test("US1-9B: User View Job Listings on Company Profile When None Exist", async ({
    page: newPage,
  }) => {
    const companyNameWithoutJobs = faker.company.name();
    const address = faker.location.streetAddress();
    const website = faker.internet.url();
    const telephone = faker.phone.number({ style: "international" });
    const description = faker.lorem.paragraph();

    const { email: emptyCompanyEmail, password: emptyCompanyPassword } =
      await signUp(newPage, "company");

    await signIn(newPage, {
      email: emptyCompanyEmail,
      password: emptyCompanyPassword,
    });

    await newPage.getByTestId("auth-dropdown-menu-trigger").click();
    await newPage.getByTestId("auth-dropdown-menu-create-company").click();
    await newPage.waitForURL(withFrontendRoute(FrontendRoutes.COMPANY_CREATE));

    await newPage
      .getByTestId("company-create-name-input")
      .fill(companyNameWithoutJobs);
    await newPage.getByTestId("company-create-address-input").fill(address);
    await newPage.getByTestId("company-create-website-input").fill(website);
    await newPage.getByTestId("company-create-tel-input").fill(telephone);
    await newPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    const responsePromise = newPage.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.COMPANIES) &&
        response.status() === 201,
    );

    await newPage.getByTestId("company-create-submit-button").click();

    const response: { data: Company } = await responsePromise.then(
      async (response) => await response.json(),
    );

    const companyId = response.data.id;

    await newPage.waitForLoadState("networkidle");

    await newPage.getByTestId("auth-dropdown-menu-trigger").click();
    await newPage.getByTestId("auth-dropdown-menu-logout").click();
    await newPage.close();

    await page.goto(
      withFrontendRoute(FrontendRoutes.COMPANY_PROFILE({ companyId })),
    );
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByTestId("company-profile-no-job-listings"),
    ).toBeVisible();
  });
});
