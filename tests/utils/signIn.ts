import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { Page } from "@playwright/test";

const CREDENTIALS = {
  admin: {
    email: "alice@eventplanner.com",
    password: "g00dD@y$",
  },
  company: {
    email: "testJob@gmail.com",
    password: "TJ6666",
  },
  user: {
    email: "joshman@gmail.com",
    password: "12345678",
  },
};

interface SignInRole {
  role: "admin" | "company" | "user";
  email?: never;
  password?: never;
}

interface SignInCredentials {
  role?: never;
  email: string;
  password: string;
}

export async function signIn(
  page: Page,
  credentials: SignInCredentials | SignInRole,
) {
  await page.goto(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));
  await page.getByTestId("signin-email-input").click();
  await page
    .getByTestId("signin-email-input")
    .fill(
      credentials.role
        ? CREDENTIALS[credentials.role].email
        : credentials.email,
    );
  await page.getByTestId("signin-password-input").click();
  await page
    .getByTestId("signin-password-input")
    .fill(
      credentials.role
        ? CREDENTIALS[credentials.role].password
        : credentials.password,
    );
  await page.getByTestId("signin-submit-button").click();
  await page.waitForURL(withFrontendRoute(FrontendRoutes.HOME));
  await page.waitForLoadState("domcontentloaded");
}
