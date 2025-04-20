import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.describe("Job-lissting CRUD", () => {
  let page: Page;
//   const companyName = faker.company.name();
//   const address = faker.location.streetAddress();
//   const website = faker.internet.url();
//   const telephone = faker.phone.number({ style: "international" });
//   const description = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    const { email, password } = await signUp(page, "company");
    await signIn(page, {
      email,
      password,
    });
  });

  test.afterAll("US1-8: Delete ", async () => {

    await page.getByRole("button", { name: "Delete Details" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("No job listings available.")).toBeVisible();

  });
});
