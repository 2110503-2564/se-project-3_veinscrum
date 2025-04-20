import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";

export async function signUp(page: Page, role: "company" | "user") {
  const email = faker.internet.email();
  const password = faker.internet.password();

  await page.goto(
    withFrontendRoute(
      role === "company"
        ? FrontendRoutes.AUTH_SIGN_UP_COMPANY
        : FrontendRoutes.AUTH_SIGN_UP,
    ),
  );
  await page.getByRole("textbox", { name: "Name" }).click();
  await page
    .getByRole("textbox", { name: "Name" })
    .fill(faker.person.fullName());
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Telephone number" }).click();
  await page
    .getByRole("textbox", { name: "Telephone number" })
    .fill(faker.phone.number({ style: "international" }));
  await page.getByRole("textbox", { name: "Password", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill(password);
  await page.getByRole("textbox", { name: "Confirm password" }).click();
  await page.getByRole("textbox", { name: "Confirm password" }).fill(password);
  await page.getByRole("main").getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));

  return {
    email: email,
    password: password,
  };
}
