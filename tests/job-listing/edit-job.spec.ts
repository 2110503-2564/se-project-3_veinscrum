import { expect, Page, test } from "@playwright/test";

test.describe("Company Job Listing Management", () => {
  const JOB_ID = "6803cc086c2b0061e6e00d48";

  async function signInAsCompany(page: Page) {
    await page.goto("http://localhost:3000/auth/signin");

    await page.getByRole("textbox", { name: "Email" }).fill("mock01@email.com");
    await page.getByRole("textbox", { name: "Password" }).fill("12345678");

    await Promise.all([
      page.getByRole("main").getByRole("button", { name: "Sign in" }).click(),
    ]);
  }

  test("Given a company is logged in When they edit a job listing Then they should be able to update job details", async ({
    page,
  }) => {
    // Sign in
    await signInAsCompany(page);
    await page.waitForLoadState("networkidle");

    // Navigate and wait
    await Promise.all([
      page.goto(`http://localhost:3000/job-listing/edit/${JOB_ID}`),
      page.waitForLoadState("domcontentloaded"),
      page.waitForSelector("form"), // ระบุชัดว่ารอ form ปรากฏ
    ]);

    // Wait for form
    await expect(page.locator("form")).toBeVisible();

    // Get form elements and wait for them
    const titleInput = page.locator("input[name='jobTitle']");
    const descriptionEditor = page.locator("[contenteditable='true']");

    await expect(titleInput).toBeVisible();
    await expect(descriptionEditor).toBeVisible();

    // Update job details
    const newTitle = "Junior Software Engineer";
    const newDescription =
      "We are looking for an experienced software engineer to join our team.";

    // Fill in the title
    await titleInput.clear();
    await titleInput.fill(newTitle);

    // Fill in the description using the rich text editor
    await descriptionEditor.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(newDescription);

    // Find and click the submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Submit and wait for navigation
    await Promise.all([
      submitButton.click(),
      page.waitForNavigation({ waitUntil: "networkidle" }),
    ]);

    // Check we're redirected
    await expect(page).toHaveURL(/.*\/company\/.*/);
  });
});
