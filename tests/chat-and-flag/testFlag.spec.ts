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
      await companyPage.getByRole("menuitem", { name: "Create Company" }).click();
      await companyPage.waitForURL(FrontendRoutes.COMPANY_CREATE);
      await companyPage.waitForLoadState("domcontentloaded");
  
      await expect(
        companyPage.getByRole("heading", { name: "Create Company" }),
      ).toBeVisible();
      await companyPage.getByRole("textbox", { name: "Company Name" }).click();
      await companyPage
        .getByRole("textbox", { name: "Company Name" })
        .fill(companyName);
      await companyPage.getByRole("textbox", { name: "Address" }).click();
      await companyPage.getByRole("textbox", { name: "Address" }).fill(address);
      await companyPage.getByRole("textbox", { name: "Website" }).click();
      await companyPage.getByRole("textbox", { name: "Website" }).fill(website);
      await companyPage.getByRole("textbox", { name: "Telephone" }).click();
      await companyPage
        .getByRole("textbox", { name: "Telephone" })
        .fill(telephone);
      await companyPage
        .getByRole("textbox", { name: "editable markdown" })
        .getByRole("paragraph")
        .click();
      await companyPage
        .getByRole("textbox", { name: "editable markdown" })
        .fill(description);
  
      const createCompanyResponsePromise = companyPage.waitForResponse(
        (response) =>
          response.url().includes("/api/v1/companies") &&
          response.request().method() === "POST" &&
          response.status() === 201,
      );
  
      await companyPage.getByRole("button", { name: "Create" }).click();
  
      const createCompanyResponse = await createCompanyResponsePromise;
      const createdCompany = await createCompanyResponse.json();
      const companyId = createdCompany.data._id;
  
      await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));
      await companyPage.waitForLoadState("domcontentloaded");
  
      // Create job listing
      await companyPage.goto(
        withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE),
      );
      await companyPage.waitForURL(FrontendRoutes.JOB_LISTINGS_CREATE);
      await companyPage.waitForLoadState("domcontentloaded");
  
      await expect(
        companyPage.getByRole("heading", { name: "Create Job" }),
      ).toBeVisible();
      await companyPage.getByRole("textbox", { name: "Job Title" }).click();
      await companyPage
        .getByRole("textbox", { name: "Job Title" })
        .fill(jobTitle);
      await companyPage
        .getByRole("textbox", { name: "editable markdown" })
        .getByRole("paragraph")
        .click();
      await companyPage
        .getByRole("textbox", { name: "editable markdown" })
        .fill(jobDescription);
      await companyPage.waitForTimeout(2000);

      const responsePromise = companyPage.waitForResponse(
        (response) =>
          response.url().includes(BackendRoutes.JOB_LISTINGS) &&
          response.status() === 201,
      );
  
      await companyPage.evaluate((companyIdFromApi) => {
        let input = document.querySelector(
          'input[name="company"]',
        ) as HTMLInputElement;
        if (!input) {
          input = document.createElement("input");
          input.name = "company";
          input.type = "hidden";
          document.querySelector("form")?.appendChild(input);
        }
        input.value = companyIdFromApi;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, companyId);
      await companyPage.waitForTimeout(2000);
      
      await companyPage.getByRole("button", { name: "Create" }).click();
  
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
      await userPage.waitForLoadState("networkidle");
  
      // User Books a job
      await userPage
        .getByRole("button", { name: "Book Interview Session" })
        .click();
  
      await userPage.keyboard.press("Enter");
      await userPage.keyboard.press("Enter");
      await userPage.keyboard.press("Tab");
      await userPage.keyboard.press("Enter");
      await userPage.mouse.click(0, 0);
  
      await userPage
        .getByRole("button", { name: "Book Interview Session" })
        .click();
      await userPage.waitForLoadState("networkidle");
  
      // User goes to the My Sessions page
      await userPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
      await userPage.waitForLoadState("networkidle");
  
      // Company goes to the session page
      await companyPage.reload();
      await companyPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
      await companyPage.waitForLoadState("networkidle");
    });
  
    test.describe.configure({ mode: "serial" });
  
    test("US2-7A: Flag a user", async () => {
      // Flag a user
      await companyPage.getByText(new RegExp(jobTitle, "i")).click();
  
      const emailLocator = companyPage.getByText(userEmailTemp);
      const userRow = emailLocator.locator("..").locator("..").locator("..");
      const flagButton = userRow.locator("button").first();
      await flagButton.click();
  
      // Reload the page
      await companyPage.reload();
      await companyPage.waitForLoadState("networkidle");
  
      // Verify the flag button is highlighted
      await companyPage.getByText(new RegExp(jobTitle, "i")).click();
  
      const emailLocatorAfter = companyPage.getByText(userEmailTemp);
      const userRowAfter = emailLocatorAfter
        .locator("..")
        .locator("..")
        .locator("..");
      const titleLocator = userRowAfter.getByRole("heading");
      await expect(titleLocator).toHaveClass(/text-yellow-600/);
    });

    test("US2-7B: Flag but not login as company", async () => {
      await notLoginPage.goto(withFrontendRoute(FrontendRoutes.HOME));
      await expect(notLoginPage.getByRole('link', { name: 'My Session' })).not.toBeVisible();

      await notLoginPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
      await notLoginPage.waitForLoadState("networkidle");

      await expect(notLoginPage.getByRole("heading", { name: "Sign in" }),
    ).toBeVisible();

    });
  
    test("US2-8A: Unflag a user", async () => {
      // Flag a user
      
      await companyPage.getByText(new RegExp(jobTitle, "i")).click();
  
      const emailLocator = companyPage.getByText(userEmailTemp);
      const userRow = emailLocator.locator("..").locator("..").locator("..");
      const flagButton = userRow.locator("button").first();
      const titleLocator = userRow.getByRole("heading");
  
      // Verify the flag is ON
      const isFlagged = await titleLocator.evaluate((el) =>
        el.className.includes("text-yellow-600")
      );
  
      if (!isFlagged) {
        await flagButton.click();
  
        // Reload the page
        await companyPage.reload();
        await companyPage.waitForLoadState("networkidle");
    
        await companyPage.getByText(new RegExp(jobTitle, "i")).click();
      }
  
      // Unflag the user
      const emailLocatorAfterFlag = companyPage.getByText(userEmailTemp);
      const userRowAfterFlag = emailLocatorAfterFlag
        .locator("..")
        .locator("..")
        .locator("..");
      const flagButtonAfter = userRowAfterFlag.locator("button").first();
      await flagButtonAfter.click();
  
      // Reload the page
      await companyPage.reload();
      await companyPage.waitForLoadState("networkidle");
  
      // Verify the flag is OFF
      await companyPage.getByText(new RegExp(jobTitle, "i")).click();
  
      const emailLocatorAfterUnflag = companyPage.getByText(userEmailTemp);
      const userRowAfterUnflag = emailLocatorAfterUnflag
        .locator("..")
        .locator("..")
        .locator("..");
      const titleLocatorAfterUnflag = userRowAfterUnflag.getByRole("heading");
  
      await expect(titleLocatorAfterUnflag).not.toHaveClass(/text-yellow-600/);
    });

    test("US2-8B: Unflag but not login as company", async () => {
      await notLoginPage.goto(withFrontendRoute(FrontendRoutes.HOME));
      await expect(notLoginPage.getByRole('link', { name: 'My Session' })).not.toBeVisible();

      await notLoginPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
      await notLoginPage.waitForLoadState("networkidle");

      await expect(notLoginPage.getByRole("heading", { name: "Sign in" }),
    ).toBeVisible();

    });
  });
  