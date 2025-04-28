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
  await page.getByTestId("signup-name-input").fill(faker.person.fullName());
  await page.getByTestId("signup-email-input").fill(email);
  await page
    .getByTestId("signup-tel-input")
    .fill(faker.phone.number({ style: "international" }));
  await page.getByTestId("signup-password-input").fill(password);
  await page.getByTestId("signup-confirm-password-input").fill(password);

  await page.getByTestId("signup-submit-button").click();

  await page.waitForURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));

  return {
    email: email,
    password: password,
  };
}
