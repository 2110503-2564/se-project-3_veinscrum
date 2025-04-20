import { expect, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

test.beforeEach(async ({ page }) => {
  const { email, password } = await signUp(page, "company");
  await signIn(page, {
    email,
    password,
  });
});

test("Create Company as Company user", async ({ page }) => {

  await expect(page.getByRole('heading', { name: 'Online Job Fair Registration' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'CompanyTest01' })).toBeVisible();
  await page.getByRole('button', { name: 'CompanyTest01' }).click();
  await page.getByRole('menuitem', { name: 'Create Company' }).click();

  await expect(page.getByRole('heading', { name: 'Create Company' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Company Name' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).fill('Test001');
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).fill('789 ok na ja');
  await page.getByRole('textbox', { name: 'Website' }).click();
  await page.getByRole('textbox', { name: 'Website' }).fill('https://google.com');
  await page.getByRole('textbox', { name: 'Telephone' }).click();
  await page.getByRole('textbox', { name: 'Telephone' }).fill('0875685285');
  await page.getByRole('textbox', { name: 'editable markdown' }).getByRole('paragraph').click();
  await page.getByRole('textbox', { name: 'editable markdown' }).fill('pol');
  await page.getByRole('button', { name: 'Create' }).click();


  await page.getByRole('button', { name: 'CompanyTest01' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();

  await expect(page.getByRole('heading', { name: 'Test001' })).toBeVisible();
  await expect(page.getByText('789 ok na ja')).toBeVisible();
  await expect(page.getByText('comp01@gmail.com')).toBeVisible();
  await expect(page.getByText('https://google.com')).toBeVisible();
  await expect(page.getByText('0875685285')).toBeVisible();
  await expect(page.getByText('pol')).toBeVisible();
  await page.getByRole('main').getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete Profile' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No Company Profile' })).toBeVisible();
  await expect(page.getByText('You havent created a company')).toBeVisible();
});
