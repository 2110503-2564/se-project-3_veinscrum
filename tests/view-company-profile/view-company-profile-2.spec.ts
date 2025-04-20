// import { BackendRoutes } from "@/constants/routes/Backend";
// import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
// import { expect, test } from "@playwright/test";

// test.describe("Company Job Listings Feature", () => {
//   const COMPANY_ID = "68027db06431ebb14df8026a";

//   test.beforeEach(async ({ page }) => {
//     // ไปที่หน้า login และ login เข้า
//     await page.goto("http://localhost:3000/auth/signin");
//     await page.getByRole("textbox", { name: "Email" }).click();
//     await page.getByRole("textbox", { name: "Email" }).fill("mock01@email.com");
//     await page.getByRole("textbox", { name: "Password" }).click();
//     await page.getByRole("textbox", { name: "Password" }).fill("12345678");
//     await page
//       .getByRole("main")
//       .getByRole("button", { name: "Sign in" })
//       .click();
//     await page.waitForURL(withFrontendRoute(BackendRoutes.HOME));
//   });

//   test("should display job listings on company profile", async ({ page }) => {
//     // Navigate to company profile page
//     await page.goto(`http://localhost:3000/company/${COMPANY_ID}`);

//     // Check if we're on the company profile page
//     await expect(page).toHaveTitle(/Online Job Fair Registration/);

//     // Check if job listings section exists using a more specific selector
//     const jobListingsSection = page.getByRole("heading", {
//       name: "Job Listings",
//       exact: true,
//     });
//     await expect(jobListingsSection).toBeVisible({
//       timeout: 15000,
//     });

//     // Wait for job cards to be loaded
//     await page.waitForSelector('[data-testid="job-card"]', { timeout: 15000 });

//     // Get all job cards
//     const jobCards = page.locator('[data-testid="job-card"]');
//     const count = await jobCards.count();
//     expect(count).toBeGreaterThan(0);

//     // Check first job card content
//     const firstJobCard = jobCards.first();
//     await expect(firstJobCard.getByTestId("job-title")).toBeVisible();
//     await expect(firstJobCard.getByTestId("company-name")).toBeVisible();
//     await expect(firstJobCard.getByTestId("company-address")).toBeVisible();
//     await expect(firstJobCard.getByTestId("company-tel")).toBeVisible();
//     await expect(
//       firstJobCard.getByRole("button", { name: "View Details" }),
//     ).toBeVisible({
//       timeout: 15000,
//     });
//   });

//   test("should navigate to job details page when clicking View Details", async ({
//     page,
//   }) => {
//     // Navigate to company profile page first
//     await page.goto(`http://localhost:3000/company/${COMPANY_ID}`);

//     // Wait for the page to load and job cards to appear
//     await page.waitForSelector('[data-testid="job-card"]', { timeout: 15000 });

//     // Find and click the View Details button on the first job card
//     const viewDetailsButton = page
//       .getByRole("button", { name: "View Details" })
//       .first();
//     await expect(viewDetailsButton).toBeVisible({
//       timeout: 15000,
//     });
//     await viewDetailsButton.click();

//     // Check if we're on the job details page
//     await expect(page).toHaveURL(/.*\/jobs\/.*/);

//     // Verify job details content
//     await expect(page.getByTestId("job-title")).toBeVisible();
//     await expect(page.getByTestId("job-description")).toBeVisible();
//     await expect(
//       page.getByRole("button", { name: "Book Interview Session" }),
//     ).toBeVisible();

//     // Verify that edit and delete buttons are not present
//     await expect(page.getByRole("button", { name: /edit/i })).not.toBeVisible();
//     await expect(
//       page.getByRole("button", { name: /delete/i }),
//     ).not.toBeVisible();
//   });

//   test("should display loading state while fetching job details", async ({
//     page,
//   }) => {
//     // Navigate to job details page first
//     await page.goto(`http://localhost:3000/jobs/${COMPANY_ID}`);

//     // Set up route interception after navigation
//     await page.route("**/api/v1/job-listings/*", async (route) => {
//       // Add longer delay to ensure loading state is visible
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       await route.continue();
//     });

//     // Trigger a reload to see the loading state
//     await page.reload();

//     // Check if loading state is shown
//     const loadingState = page.getByText("Loading job details...");
//     await expect(loadingState).toBeVisible({ timeout: 15000 }); // Use consistent timeout
//   });

//   test("should handle error state when job listing not found", async ({
//     page,
//   }) => {
//     // Navigate to non-existent job
//     await page.goto("http://localhost:3000/jobs/nonexistent-id");

//     // Check if error message is shown (using the text-red-500 class)
//     const errorMessage = page.locator(".text-red-500");
//     await expect(errorMessage).toBeVisible({ timeout: 15000 }); // Increased timeout for error state
//   });
// });
