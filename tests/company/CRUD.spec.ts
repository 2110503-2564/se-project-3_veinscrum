import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("US1-1: Create Company Profile", () => {
  let page: Page;
  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test.describe.configure({ mode: "serial" });

  test("US1-1A: Create Company (Not Created)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-create-title")).toBeVisible();

    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-create-submit-button").click();

    await page.goto(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByTestId("company-profile-no-company-profile-title"),
    ).toBeVisible();

    await expect(
      page.getByTestId("company-profile-no-company-profile-description"),
    ).toBeVisible();
  });

  test("US1-1B: Create Company (Created)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-create-title")).toBeVisible();

    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page.getByTestId("company-create-website-input").fill(website);
    await page.getByTestId("company-create-tel-input").fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-create-submit-button").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(companyName)).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(website)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });
});

test.describe("US1-2: View Company Profile", () => {
  let page: Page;
  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test.describe.configure({ mode: "serial" });

  test("US1-2A: View Company", async () => {
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-profile-name")).not.toBeVisible();
    await expect(page.getByTestId("company-profile-address")).not.toBeVisible();
    await expect(page.getByTestId("company-profile-email")).not.toBeVisible();
    await expect(page.getByTestId("company-profile-website")).not.toBeVisible();
    await expect(
      page.getByTestId("company-profile-telephone"),
    ).not.toBeVisible();
  });

  test("MATERIAL: Create Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-create-title")).toBeVisible();

    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page.getByTestId("company-create-website-input").fill(website);
    await page.getByTestId("company-create-tel-input").fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-create-submit-button").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");
  });

  test("US1-2B: View Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));
    await page.waitForLoadState("domcontentloaded");
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(companyName)).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(website)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });
});

test.describe("US1-3: Update Company Profile", () => {
  let page: Page;
  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test.describe.configure({ mode: "serial" });

  test("MATERIAL: Create Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-create-title")).toBeVisible();

    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page.getByTestId("company-create-website-input").fill(website);
    await page.getByTestId("company-create-tel-input").fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-create-submit-button").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");
  });

  test("US1-3A: Edit Company (Fail)", async () => {
    const newCompanyName = faker.company.name();
    const newAddress = faker.location.streetAddress();
    const newWebsite = faker.internet.url();
    const newTelephone = faker.phone.number({ style: "international" });
    const newDescription = faker.lorem.paragraph();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-profile-name")).toBeVisible();
    await page.getByTestId("company-profile-dropdown-menu-trigger").click();
    await page.getByTestId("company-profile-edit-profile").click();

    await page.getByTestId("company-profile-company-name-input").clear();
    await page
      .getByTestId("company-profile-company-name-input")
      .fill(companyName);

    await page.getByTestId("company-profile-address-input").clear();
    await page.getByTestId("company-profile-address-input").fill(address);

    await page.getByTestId("company-profile-website-input").clear();
    await page.getByTestId("company-profile-website-input").fill(website);

    await page.getByTestId("company-profile-telephone-input").clear();
    await page.getByTestId("company-profile-telephone-input").fill(telephone);

    await page.getByRole("textbox", { name: "editable markdown" }).clear();
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-profile-submit-button").click();

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(newCompanyName)).not.toBeVisible();
    await expect(page.getByText(newAddress)).not.toBeVisible();
    await expect(page.getByText(newWebsite)).not.toBeVisible();
    await expect(page.getByText(newTelephone)).not.toBeVisible();
    await expect(page.getByText(newDescription)).not.toBeVisible();
  });

  test("US1-3B: Edit Company (Success)", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));
    await page.waitForLoadState("domcontentloaded");

    const newCompanyName = faker.company.name();
    const newAddress = faker.location.streetAddress();
    const newWebsite = faker.internet.url();
    const newTelephone = faker.phone.number({ style: "international" });
    const newDescription = faker.lorem.paragraph();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-profile-name")).toBeVisible();

    await page.getByTestId("company-profile-dropdown-menu-trigger").click();
    await page.getByTestId("company-profile-edit-profile").click();

    await page.getByTestId("company-profile-company-name-input").clear();
    await page
      .getByTestId("company-profile-company-name-input")
      .fill(newCompanyName);
    await page.getByTestId("company-profile-address-input").clear();
    await page.getByTestId("company-profile-address-input").fill(newAddress);
    await page.getByTestId("company-profile-website-input").clear();
    await page.getByTestId("company-profile-website-input").fill(newWebsite);
    await page.getByTestId("company-profile-telephone-input").clear();
    await page
      .getByTestId("company-profile-telephone-input")
      .fill(newTelephone);

    await page.getByRole("textbox", { name: "editable markdown" }).clear();
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(newDescription);

    await page.getByTestId("company-profile-submit-button").click();

    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(BackendRoutes.COMPANIES_ID({ companyId: "" })) &&
        response.status() === 200,
    );

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(newCompanyName)).toBeVisible();
    await expect(page.getByText(newAddress)).toBeVisible();
    await expect(page.getByText(newWebsite)).toBeVisible();
    await expect(page.getByText(newTelephone)).toBeVisible();
    await expect(page.getByText(newDescription)).toBeVisible();
  });
});

test.describe("US1-4: Delete Company Profile", () => {
  let page: Page;
  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test.describe.configure({ mode: "serial" });

  test("US1-4A: Delete Company (Non-existent)", async () => {
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText(companyName)).not.toBeVisible();
    await expect(page.getByText(address)).not.toBeVisible();
    await expect(page.getByText(website)).not.toBeVisible();
    await expect(page.getByText(telephone)).not.toBeVisible();
    await expect(page.getByText(description)).not.toBeVisible();
  });

  test("MATERIAL: Create Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(page.getByTestId("home-title")).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();

    await page.getByTestId("auth-dropdown-menu-create-company").click();

    await page.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByTestId("company-create-title")).toBeVisible();
    await page.getByTestId("company-create-name-input").fill(companyName);
    await page.getByTestId("company-create-address-input").fill(address);
    await page.getByTestId("company-create-website-input").fill(website);
    await page.getByTestId("company-create-tel-input").fill(telephone);
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await page.getByTestId("company-create-submit-button").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");
  });

  test("US1-4B: Delete Company (Success)", async () => {
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByTestId("auth-dropdown-menu-profile").click();

    await page.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await page.waitForLoadState("domcontentloaded");

    await page.getByTestId("company-profile-dropdown-menu-trigger").click();
    await page.getByTestId("company-profile-delete-profile").click();

    await page.getByTestId("company-profile-delete-profile-button").click();

    await page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(BackendRoutes.COMPANIES_ID({ companyId: "" })) &&
        response.status() === 200,
    );

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByTestId("company-profile-no-company-profile-title"),
    ).toBeVisible();
    await expect(
      page.getByTestId("company-profile-no-company-profile-description"),
    ).toBeVisible();
  });
});
