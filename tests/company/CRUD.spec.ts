import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Company CRUD", () => {
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

  test("US1-1: Create Company", async () => {
    await page.goto(withFrontendRoute(FrontendRoutes.HOME));

    await expect(
      page.getByRole("heading", { name: "Online Job Fair Registration" }),
    ).toBeVisible();

    await page.getByTestId("auth-dropdown-menu-trigger").click();

    await page.getByRole("menuitem", { name: "Create Company" }).click();

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

  test("US1-2: View Company", async () => {
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await expect(
      page.getByRole("heading", { name: companyName }),
    ).toBeVisible();
    await expect(page.getByText(address)).toBeVisible();
    await expect(page.getByText(website)).toBeVisible();
    await expect(page.getByText(telephone)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });

  test("US1-3: Edit Company", async () => {
    const newCompanyName = faker.company.name();
    const newAddress = faker.location.streetAddress();
    const newWebsite = faker.internet.url();
    const newTelephone = faker.phone.number({ style: "international" });
    const newDescription = faker.lorem.paragraph();

    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await expect(
      page.getByRole("heading", { name: companyName }),
    ).toBeVisible();

    await page.getByTestId("company-profile-dropdown-menu-trigger").click();

    await page.getByRole("menuitem", { name: "Edit Profile" }).click();

    await page.getByRole("textbox", { name: "Enter company name" }).click();
    await page
      .getByRole("textbox", { name: "Enter company name" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "Enter company name" })
      .fill(newCompanyName);

    await page.getByRole("textbox", { name: "Enter company address" }).click();
    await page
      .getByRole("textbox", { name: "Enter company address" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "Enter company address" })
      .fill(newAddress);

    await page.getByRole("textbox", { name: "Enter company website" }).click();
    await page
      .getByRole("textbox", { name: "Enter company website" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "Enter company website" })
      .fill(newWebsite);

    await page.getByRole("textbox", { name: "Enter telephone number" }).click();
    await page
      .getByRole("textbox", { name: "Enter telephone number" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "Enter telephone number" })
      .fill(newTelephone);

    await page
      .getByRole("textbox", { name: "editable markdown" })
      .getByRole("paragraph")
      .click();
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "editable markdown" })
      .fill(newDescription);

    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(
      page.getByRole("heading", { name: newCompanyName }),
    ).toBeVisible();
    await expect(page.getByText(newAddress)).toBeVisible();
    await expect(page.getByText(newWebsite)).toBeVisible();
    await expect(page.getByText(newTelephone)).toBeVisible();
    await expect(page.getByText(newDescription)).toBeVisible();
  });

  test.afterAll("US1-4: Delete Company", async () => {
    await page.getByTestId("auth-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Profile" }).click();

    await page.getByTestId("company-profile-dropdown-menu-trigger").click();
    await page.getByRole("menuitem", { name: "Delete Profile" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(
      page.getByRole("heading", { name: "No Company Profile" }),
    ).toBeVisible();

    await expect(page.getByText("You havent created a company")).toBeVisible();
  });
});
