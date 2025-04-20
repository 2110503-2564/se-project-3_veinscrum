import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { Page, test } from "@playwright/test";

const CREDENTIALS = {
  admin: {
    email: "admin@gmail.com",
    password: "12345678",
  },
  company: {
    email: "comp01@gmail.com",
    password: "12345678",
  },
  user: {
    email: "user01@gmail.com",
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
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(
      credentials.role
        ? CREDENTIALS[credentials.role].email
        : credentials.email,
    );
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(
      credentials.role
        ? CREDENTIALS[credentials.role].password
        : credentials.password,
    );
  await page.getByRole("main").getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(withFrontendRoute(FrontendRoutes.HOME));
}

test("Log in as admin", async ({ page }) => {
  await signIn(page, {
    role: "admin",
  });
});
