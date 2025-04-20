import { expect, Page, test } from "@playwright/test";

  test('US2-2: View Job' , async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('mock01@email.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
  await page.getByTestId('auth-dropdown-menu-trigger').click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await page.getByRole('heading', { name: 'Job Listings' }).click();
  await page.getByRole('heading', { name: 'Junior Software Engineer' }).click();
  await page.locator('div').filter({ hasText: /^Junior Software EngineerAladin$/ }).getByTestId('company-name').click();
  await page.locator('div').filter({ hasText: /^Junior Software EngineerAladinTokyo summer time Saga0956644440$/ }).getByTestId('company-address').click();
  await page.locator('div').filter({ hasText: /^Junior Software EngineerAladinTokyo summer time Saga0956644440$/ }).getByTestId('company-tel').click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.getByTestId('job-title').click();
  await page.getByTestId('job-description').click();
});