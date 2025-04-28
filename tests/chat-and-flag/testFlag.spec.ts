import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Flag", () => {
  let companyPage: Page;
  let userPage: Page;
  let notLoginPage: Page;
  let jobId: string | undefined;

  let userEmailTemp: string;

  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  const jobTitle = faker.person.jobTitle();
  const jobDescription = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    // Create a new browser context for the company and user
    const companyContext = await browser.newContext();
    const userContext = await browser.newContext();
    const anoymousetext = await browser.newContext();

    companyPage = await companyContext.newPage();
    userPage = await userContext.newPage();
    notLoginPage = await anoymousetext.newPage();

    // Sign in as a company
    const { email: companyEmail, password: companyPassword } = await signUp(
      companyPage,
      "company",
    );
    await signIn(companyPage, {
      email: companyEmail,
      password: companyPassword,
    });

    await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));

    // Create company profile
    await companyPage.getByTestId("auth-dropdown-menu-trigger").click();
    await companyPage.getByTestId("auth-dropdown-menu-create-company").click();

    await companyPage.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(companyPage.getByTestId("company-create-title")).toBeVisible();
    await companyPage
      .getByTestId("company-create-name-input")
      .fill(companyName);
    await companyPage.getByTestId("company-create-address-input").fill(address);
    await companyPage.getByTestId("company-create-website-input").fill(website);
    await companyPage.getByTestId("company-create-tel-input").fill(telephone);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await companyPage.getByTestId("company-create-submit-button").click();

    await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await companyPage.waitForLoadState("domcontentloaded");

    // Create job listing
    await companyPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE),
    );
    await companyPage.waitForURL(FrontendRoutes.JOB_LISTINGS_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(
      companyPage.getByTestId("job-listing-create-title"),
    ).toBeVisible();
    await companyPage
      .getByTestId("job-listing-create-job-title-input")
      .fill(jobTitle);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    const responsePromise = companyPage.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await companyPage.waitForTimeout(2000);

    await companyPage.getByTestId("job-listing-create-submit-button").click();

    const response = (await (await responsePromise).json()) as {
      data: JobListing;
    };

    jobId = response.data._id;

    // User -----------------------------------------------------------------
    // Sign in as a user
    const { email: userEmail, password: userPassword } = await signUp(
      userPage,
      "user",
    );

    userEmailTemp = userEmail;

    await signIn(userPage, {
      email: userEmail,
      password: userPassword,
    });

    await userPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));

    // User goes to the job listing page
    if (!jobId) {
      throw new Error("jobId is undefined");
    }

    await userPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID({ jobId })),
    );
    await userPage.waitForLoadState("domcontentloaded");

    // User Books a job
    await userPage.getByTestId("book-interview-session-button").click();

    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Tab");
    await userPage.keyboard.press("Enter");
    await userPage.mouse.click(0, 0);

    await userPage.getByTestId("book-interview-session-button-submit").click();
    await userPage.waitForLoadState("domcontentloaded");

    // User goes to the My Sessions page
    await userPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await userPage.waitForLoadState("domcontentloaded");

    // Company goes to the session page
    await companyPage.reload();
    await companyPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await companyPage.waitForLoadState("domcontentloaded");
  });

  test.describe.configure({ mode: "serial" });

  test("US2-7A: Flag a user", async () => {
    // Flag a user
    await companyPage.getByTestId("flag-user-card-accordion-trigger").click();

    await companyPage.getByTestId("flag-button").click();

    // Reload the page
    await companyPage.reload();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the flag button is highlighted
    await companyPage.getByTestId("flag-user-card-accordion-trigger").click();

    await expect(companyPage.getByTestId("flag-button-icon")).toHaveClass(
      /fill-yellow-400 text-yellow-400/,
    );
  });

  test("US2-7B: Flag but not login as company", async () => {
    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.HOME));
    await expect(
      notLoginPage.getByRole("link", { name: "My Session" }),
    ).not.toBeVisible();

    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await notLoginPage.waitForLoadState("domcontentloaded");

    await expect(notLoginPage.getByTestId("navbar-sign-in-link")).toBeVisible();
  });

  test("US2-8A: Unflag a user", async () => {
    // Flag a user

    await companyPage.getByText(new RegExp(jobTitle, "i")).click();

    const isFlagged = await companyPage
      .getByTestId("flag-button-icon")
      .evaluate(
        (el) =>
          el.classList.contains("fill-yellow-400") &&
          el.classList.contains("text-yellow-400"),
      );

    if (!isFlagged) {
      await companyPage.getByTestId("flag-button").click();

      // Reload the page
      await companyPage.reload();
      await companyPage.waitForLoadState("domcontentloaded");

      await companyPage.getByTestId("flag-user-card-accordion-trigger").click();
    }

    // Unflag the user
    await companyPage.getByTestId("flag-button").click();

    // Reload the page
    await companyPage.reload();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the flag is OFF
    await companyPage.getByTestId("flag-user-card-accordion-trigger").click();

    await expect(companyPage.getByTestId("flag-button-icon")).not.toHaveClass(
      /fill-yellow-400 text-yellow-400/,
    );
  });

  test("US2-8B: Unflag but not login as company", async () => {
    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.HOME));
    await expect(
      notLoginPage.getByTestId("navbar-my-session-link"),
    ).not.toBeVisible();

    await notLoginPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await notLoginPage.waitForLoadState("domcontentloaded");

    await expect(notLoginPage.getByTestId("navbar-sign-in-link")).toBeVisible();
  });
});
