import { test, expect } from '@playwright/test';

test("Given a user is on a company profile page When they scroll down to the job listings section Then they should see all active job postings from that company", async ({ page }) => {
  // Log in as a user
  await page.goto("http://localhost:3000/auth/signin");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("test727@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("123456789");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("http://localhost:3000");


  // Go to the company profile page
  await page.goto('http://localhost:3000/company');
  const card = page.getByRole("heading", { name: "Domtao" }).locator("..").locator("..");
  await card.getByText("View Company").waitFor({ state: "visible" });
  await card.getByRole("link", { name: "View Company" }).click();

  // Verify the URL
  await expect(page).toHaveURL(/\/company\/68027db06431ebb14df8026a$/);

  await page
  .getByRole('heading', { name: 'Job Listings', level: 2 })
  .waitFor({ state: 'visible' });

  // Scroll down to the job listings section
  const jobCards = page.getByRole('heading', { level: 3 });
  await expect(jobCards).toHaveCount(2);
  await expect(jobCards.first()).toHaveText(/test job listings/);
  await expect(jobCards.nth(1)).toHaveText(/test2 job listing/);

});

test("Given a user is on a company profile page and company does not add any job When they scroll down to the job listings section Then they should see all active job postings from that company", async ({ page }) => {
  // Log in as a user
  await page.goto("http://localhost:3000/auth/signin");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("test727@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("123456789");
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("http://localhost:3000");


  // Go to the company profile page
  await page.goto('http://localhost:3000/company');
  const card = page.getByRole("heading", { name: "TechNova Solutions" }).locator("..").locator("..");
  await card.getByText("View Company").waitFor({ state: "visible" });
  await card.getByRole("link", { name: "View Company" }).click();

  // Verify the URL
  await expect(page).toHaveURL(/\/company\/6803ba8b7e9d89f309f84126$/);

  await page
  .getByRole('heading', { name: 'Job Listings', level: 2 })
  .waitFor({ state: 'visible' });

  // Scroll down to the job listings section
  const jobCards = page.getByRole('heading', { level: 3 });
  await expect(jobCards).toHaveCount(0);

  // Verify that the job listings section is empty
  await expect(page.getByText('No job listings available.')).toBeVisible();

});