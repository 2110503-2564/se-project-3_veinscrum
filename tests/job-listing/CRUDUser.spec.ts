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

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await page.getByRole("button", { name: "Create" }).click();

    const response = (await (await responsePromise).json()) as {
      data: JobListing;
    };

    jobId = response.data._id;

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));
    await page.waitForLoadState("domcontentloaded");

    const { email: userEmail, password: userPassword } = await signUp(
      page,
      "user",
    );
    await signIn(page, {
      email: userEmail,
      password: userPassword,
    });
  });

  test("US1-9: User View Job Listings on a Company Profile", async () => {
    if (!jobId) {
      throw new Error("Job ID is not set");
    }

    await page.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID({ jobId })),
    );

    await expect(page.getByRole("heading", { name: jobTitle })).toBeVisible();
  });
});
