import { BackendRoutes } from "@/constants/routes/Backend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(withFrontendRoute(BackendRoutes.AUTH_LOGIN));
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("comp01@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("12345678");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(withFrontendRoute(BackendRoutes.HOME));
});

test("Create Company as Company user", async ({ page }) => {
  // // Verify that the heading "Online Job Fair Registration" is visible on the page
  // await expect(
  //   page.getByRole("heading", { name: "Online Job Fair Registration" }),
  // ).toBeVisible();

  // // Verify that the button with the company user name "CompanyTest01" is visible
  // await expect(
  //   page.getByRole("button", { name: "CompanyTest01" }),
  // ).toBeVisible();

  // // Click on the user button to open the dropdown menu
  // await page.getByRole("button", { name: "CompanyTest01" }).click();

  // // Verify the dropdown menu contains the "Profile" option
  // await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible();

  // // Verify the dropdown menu contains the "Logout" option
  // await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();

  // // Navigate to the company creation form
  // await page.goto(withFrontendRoute(BackendRoutes.COMPANIES_CREATE));
  // await page.waitForURL(withFrontendRoute(BackendRoutes.COMPANIES_CREATE));

  // // Focus and fill in the "Company Name" text field
  // await page.getByRole("textbox", { name: "Company Name" }).click();
  // await page
  //   .getByRole("textbox", { name: "Company Name" })
  //   .fill("Mock Company01");

  // // Click the file input to simulate selecting a file (e.g., uploading a logo)
  // await page.locator('input[type="file"]').click();

  // // Fill in the "Address" field
  // await page.getByRole("textbox", { name: "Address" }).click();
  // await page.getByRole("textbox", { name: "Address" }).fill("123 สยาม");

  // // Fill in the "Website" field
  // await page.getByRole("textbox", { name: "Website" }).click();
  // await page
  //   .getByRole("textbox", { name: "Website" })
  //   .fill("https://www.google.com/");

  // // Fill in the "Telephone" field
  // await page.getByRole("textbox", { name: "Telephone" }).click();
  // await page.getByRole("textbox", { name: "Telephone" }).fill("0977456123");

  // // Click on the editable markdown description field and enter text
  // await page
  //   .getByRole("textbox", { name: "editable markdown" })
  //   .getByRole("paragraph")
  //   .click();
  // await page
  //   .getByRole("textbox", { name: "editable markdown" })
  //   .fill("Test Create Company");

  // // Submit the form by clicking the "Create" button
  // await page.getByRole("button", { name: "Create" }).click();

  // Reopen the user menu to access the "Profile" section
  await page.getByRole("button", { name: "CompanyTest01" }).click();
  await page.getByRole("menuitem", { name: "Profile" }).click();

  // Verify that the newly created company's name is shown on the profile page
  await expect(
    page.getByRole("heading", { name: "Mock Company01" }),
  ).toBeVisible();

  // Confirm that the address appears correctly
  await expect(page.getByText("123 สยาม")).toBeVisible();

  // Confirm the email is visible (assuming this was pre-filled or part of the user profile)
  await expect(page.getByText("comp01@gmail.com")).toBeVisible();

  // Confirm the website is correctly displayed
  await expect(page.getByText("https://www.google.com/")).toBeVisible();

  // Confirm the telephone number is displayed
  await expect(page.getByText("0977456123")).toBeVisible();

  // Confirm the markdown description text is visible
  await expect(page.getByText("Test Create Company")).toBeVisible();
});
