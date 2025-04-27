import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";
import { use } from "react";

test.describe("Chat ", () => {
  let companyPage: Page;
  let userPage: Page;
  let jobId: string | undefined;

  let userEmailTemp: string;
  let userPasswordTemp: string;

  let companyEmailTemp: string;
  let companyPasswordTemp: string;

  const companyName = faker.company.name();
  const address = faker.location.streetAddress();
  const website = faker.internet.url();
  const telephone = faker.phone.number({ style: "international" });
  const description = faker.lorem.paragraph();

  const jobTitle = faker.person.jobTitle();
  const jobDescription = faker.lorem.paragraph();

  test.beforeAll(async ({ browser }) => {
    // Create a new browser context for the company and user
    const companyContext = await browser.newContext();
    const userContext = await browser.newContext();

    companyPage = await companyContext.newPage();
    userPage = await userContext.newPage();

    // Sign in as a company
    const { email: companyEmail, password: companyPassword } = await signUp(
      companyPage,
      "company",
    );
    companyEmailTemp = companyEmail;
    companyPasswordTemp = companyPassword;
    await signIn(companyPage, {
      email: companyEmail,
      password: companyPassword,
    });

    await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));

    // Create company profile
    await companyPage.getByTestId("auth-dropdown-menu-trigger").click();
    await companyPage.getByRole("menuitem", { name: "Create Company" }).click();
    await companyPage.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(
      companyPage.getByRole("heading", { name: "Create Company" }),
    ).toBeVisible();
    await companyPage.getByRole("textbox", { name: "Company Name" }).click();
    await companyPage
      .getByRole("textbox", { name: "Company Name" })
      .fill(companyName);
    await companyPage.getByRole("textbox", { name: "Address" }).click();
    await companyPage.getByRole("textbox", { name: "Address" }).fill(address);
    await companyPage.getByRole("textbox", { name: "Website" }).click();
    await companyPage.getByRole("textbox", { name: "Website" }).fill(website);
    await companyPage.getByRole("textbox", { name: "Telephone" }).click();
    await companyPage
      .getByRole("textbox", { name: "Telephone" })
      .fill(telephone);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .getByRole("paragraph")
      .click();
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    const createCompanyResponsePromise = companyPage.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/companies") &&
        response.request().method() === "POST" &&
        response.status() === 201,
    );

    await companyPage.getByRole("button", { name: "Create" }).click();

    const createCompanyResponse = await createCompanyResponsePromise;
    const createdCompany = await createCompanyResponse.json();
    const companyId = createdCompany.data._id;

    await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));
    await companyPage.waitForLoadState("domcontentloaded");

    // Create job listing
    await companyPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE),
    );
    await companyPage.waitForURL(FrontendRoutes.JOB_LISTINGS_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(
      companyPage.getByRole("heading", { name: "Create Job" }),
    ).toBeVisible();
    await companyPage.getByRole("textbox", { name: "Job Title" }).click();
    await companyPage
      .getByRole("textbox", { name: "Job Title" })
      .fill(jobTitle);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .getByRole("paragraph")
      .click();
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    const responsePromise = companyPage.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await companyPage.evaluate((companyIdFromApi) => {
      let input = document.querySelector(
        'input[name="company"]',
      ) as HTMLInputElement;
      if (!input) {
        input = document.createElement("input");
        input.name = "company";
        input.type = "hidden";
        document.querySelector("form")?.appendChild(input);
      }
      input.value = companyIdFromApi;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, companyId);

    await companyPage.getByRole("button", { name: "Create" }).click();

    const response = (await (await responsePromise).json()) as {
      data: JobListing;
    };

    jobId = response.data._id;

    // User -----------------------------------------------------------------
    // Sign in as a user
    const { email: userEmail, password: userPassword } = await signUp(
      userPage,
      "user",
    );
    userEmailTemp = userEmail;
    userPasswordTemp = userPassword;
    await signIn(userPage, {
      email: userEmail,
      password: userPassword,
    });

    await userPage.waitForURL(withFrontendRoute(FrontendRoutes.HOME));

    // User goes to the job listing page
    if (!jobId) {
      throw new Error("jobId is undefined");
    }
    await userPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID({ jobId })),
    );
    await userPage.waitForLoadState("networkidle");

    // User Books a job
    await userPage
      .getByRole("button", { name: "Book Interview Session" })
      .click();

    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Tab");
    await userPage.keyboard.press("Enter");
    await userPage.mouse.click(0, 0);

    await userPage
      .getByRole("button", { name: "Book Interview Session" })
      .click();
    await userPage.waitForLoadState("networkidle");

    // User goes to the My Sessions page
    await userPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await userPage.waitForLoadState("networkidle");

    // User goes to the chat page
    await userPage.getByRole("button", { name: "Start Chat" }).click();
    await userPage.waitForLoadState("networkidle");

    // Company goes to the chat page
    await companyPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await companyPage.waitForLoadState("networkidle");

    await companyPage.getByText(new RegExp(jobTitle, "i")).click();

    const emailLocator = companyPage.getByText(userEmail);
    await emailLocator.waitFor({ state: "attached" });
    const dropdownButton = emailLocator
      .locator("..")
      .locator("..")
      .locator("..")
      .locator("div.flex.w-full.items-center.justify-between")
      .locator("button");

    await dropdownButton.click();
    await companyPage.getByRole("menuitem", { name: "Chat" }).click();

    await companyPage.waitForLoadState("networkidle");
    await expect(companyPage).toHaveURL(/\/chat\/.+/);
  });

  test.describe.configure({ mode: "serial" });

  test("US2-1.1: Users send messages to company", async ({ browser }) => {
    // User sends a message to the company
    await userPage
      .getByPlaceholder("Type a message...")
      .fill("Hello, I am interested in this job.");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(
      userPage.getByText("Hello, I am interested in this job."),
    ).toBeVisible();
    await expect(
      companyPage.getByText("Hello, I am interested in this job."),
    ).toBeVisible();
  });

  test("US2-1.2: Refresh page should see full history", async ({ browser }) => {
    // User sends a message to the company
    await userPage
      .getByPlaceholder("Type a message...")
      .fill("sup bro, how are you?");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(userPage.getByText("sup bro, how are you?")).toBeVisible();
    await expect(companyPage.getByText("sup bro, how are you?")).toBeVisible();

    // User refresh the page
    await userPage.reload();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is still there
    await expect(userPage.getByText("sup bro, how are you?")).toBeVisible();
    await expect(companyPage.getByText("sup bro, how are you?")).toBeVisible();
  });

  test("US2-2.1: Users edit messages", async ({ browser }) => {
    // User sends a message to the company
    await userPage.getByPlaceholder("Type a message...").fill("ggez");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(userPage.getByText("ggez")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("ggez")).toBeVisible();

    // User edits the message
    const messageContainer = userPage
      .locator("div.group", { hasText: /^ggez$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await userPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    // Click on the edit message button and fill the input
    await userPage.getByRole("menuitem", { name: "Edit Message" }).click();
    await userPage.getByPlaceholder("Enter message").fill("Sorry bro");
    await userPage.getByRole("button", { name: "Save changes" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is updated
    await expect(userPage.getByText("Sorry bro")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("Sorry bro")).toBeVisible();
  });

  test("US2-2.2: Editing a message without changing", async ({ browser }) => {
    // User sends a message to the company
    await userPage.getByPlaceholder("Type a message...").fill("notedit");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(userPage.getByText("notedit")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("notedit")).toBeVisible();

    // User edits the message
    const messageContainer = userPage
      .locator("div.group", { hasText: /^notedit$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await userPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    // Click on the edit message button but don't change the message
    await userPage.getByRole("menuitem", { name: "Edit Message" }).click();
    await userPage.getByRole("button", { name: "Save changes" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is still the same
    await expect(userPage.getByText("notedit")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("notedit")).toBeVisible();
  });

  test("US2-3.1: Users delete messages", async ({ browser }) => {
    // User sends a message to the company
    await userPage
      .getByPlaceholder("Type a message...")
      .fill("free robux click here");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(userPage.getByText("free robux click here")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("free robux click here")).toBeVisible();

    // find the message container
    const messageContainer = userPage
      .locator("div.group", { hasText: /^free robux click here$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await userPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    await userPage.getByRole("menuitem", { name: "Delete Message" }).click();
    await userPage.getByRole("button", { name: "Delete" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is deleted
    await expect(userPage.getByText("free robux click here")).not.toBeVisible();
    await companyPage.reload();
    await expect(
      companyPage.getByText("free robux click here"),
    ).not.toBeVisible();
  });

  test("US2-3.2: Not logged in user clicking Delete", async ({ browser }) => {
    // User sends a message to the company
    await userPage
      .getByPlaceholder("Type a message...")
      .fill("not logged");
    await userPage.getByRole("button", { name: "Send" }).click();
    await userPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(userPage.getByText("not logged")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("not logged")).toBeVisible();

    // Temp URL chat page
    const tempURL = userPage.url();

    // log out the user
    await userPage.getByTestId("auth-dropdown-menu-trigger").click();
    await userPage.getByRole("menuitem", { name: "Logout" }).click();
    await userPage.waitForURL(FrontendRoutes.AUTH_SIGN_IN);
    await userPage.waitForLoadState("networkidle");

    // go to the chat page but go to the sign in page
    await userPage.goto(tempURL);
    await userPage.waitForLoadState("networkidle");
    await expect(userPage).toHaveURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));

    // Sign in as a user
    await signIn(userPage, {
      email: userEmailTemp,
      password: userPasswordTemp,
    });
    await userPage.waitForLoadState("networkidle");
    await expect(userPage).toHaveURL(withFrontendRoute(FrontendRoutes.HOME));

    // go to the chat page
    await userPage.goto(tempURL);
    await userPage.waitForLoadState("networkidle");
    await expect(userPage).toHaveURL(/\/chat\/.+/);
    await expect(userPage.getByText("not logged")).toBeVisible();
  });

  test("US2-4.1: Company send messages to user", async ({ browser }) => {
    // Company sends a message to the user
    await companyPage
      .getByPlaceholder("Type a message...")
      .fill("Hello, I am Big Boss.");
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(companyPage.getByText("Hello, I am Big Boss.")).toBeVisible();
    await expect(userPage.getByText("Hello, I am Big Boss.")).toBeVisible();
  });

  test("US2-4.2: Company sending empty message", async ({ browser }) => {
    // Company sends an empty message to the user
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is not sent
    await expect(
      companyPage.getByText("Type a message..."),
    ).not.toBeVisible();
    await expect(
      userPage.getByText("Type a message..."),
    ).not.toBeVisible();
  });

  test("US2-5.1: Company edit messages", async ({ browser }) => {
    // User sends a message to the company
    await companyPage
      .getByPlaceholder("Type a message...")
      .fill("omgto is among us");
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");
    await expect(companyPage.getByText("omgto is among us")).toBeVisible();

    // User edits the message
    const messageContainer = companyPage
      .locator("div.group", { hasText: /^omgto is among us$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await companyPage.mouse.move(
        box.x + box.width / 2,
        box.y + box.height / 2,
      );
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    await companyPage.getByRole("menuitem", { name: "Edit Message" }).click();
    await companyPage
      .getByPlaceholder("Enter message")
      .fill("My company is the best in the world");
    await companyPage.getByRole("button", { name: "Save changes" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is updated
    await expect(
      companyPage.getByText("My company is the best in the world"),
    ).toBeVisible();
    await userPage.reload();
    await expect(
      userPage.getByText("My company is the best in the world"),
    ).toBeVisible();
  });

  test("US2-5.2: Company editing a message without change", async ({ browser }) => {
    // Company sends a message to the company
    await companyPage.getByPlaceholder("Type a message...").fill("company not edit");
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(companyPage.getByText("company not edit")).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByText("company not edit")).toBeVisible();

    // Company edits the message
    const messageContainer = companyPage
      .locator("div.group", { hasText: /^company not edit$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await companyPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    // Click on the edit message button but don't change the message
    await companyPage.getByRole("menuitem", { name: "Edit Message" }).click();
    await companyPage.getByRole("button", { name: "Save changes" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is still the same
    await expect(companyPage.getByText("company not edit")).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByText("company not edit")).toBeVisible();
  });

  test("US2-6.1: Company delete messages", async ({ browser }) => {
    // Company sends a message to the user
    await companyPage
      .getByPlaceholder("Type a message...")
      .fill("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(
      companyPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).toBeVisible();
    await userPage.reload();
    await expect(
      userPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).toBeVisible();

    // find the message container
    const messageContainer = companyPage
      .locator("div.group", { hasText: /^aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$/ })
      .first();

    // Use mouse to hover the dropdown menu
    const box = await messageContainer.boundingBox();
    if (box) {
      await companyPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    await companyPage.getByRole("menuitem", { name: "Delete Message" }).click();
    await companyPage.getByRole("button", { name: "Delete" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is deleted
    await expect(
      companyPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).not.toBeVisible();
    await userPage.reload();
    await expect(
      userPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).not.toBeVisible();
  });

  test("US2-6.2: Company not logged in clicking Delete", async ({ browser }) => {
    // Company sends a message to the company
    await companyPage
      .getByPlaceholder("Type a message...")
      .fill("Company not logged");
    await companyPage.getByRole("button", { name: "Send" }).click();
    await companyPage.waitForLoadState("networkidle");

    // Verify the message is sent
    await expect(companyPage.getByText("Company not logged")).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByText("Company not logged")).toBeVisible();

    // Temp URL chat page
    const tempURL = companyPage.url();

    // log out the user
    await companyPage.getByTestId("auth-dropdown-menu-trigger").click();
    await companyPage.getByRole("menuitem", { name: "Logout" }).click();
    await companyPage.waitForURL(FrontendRoutes.AUTH_SIGN_IN);
    await companyPage.waitForLoadState("networkidle");

    // go to the chat page but go to the sign in page
    await companyPage.goto(tempURL);
    await companyPage.waitForLoadState("networkidle");
    await expect(companyPage).toHaveURL(withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN));

    // Sign in as a user
    await signIn(companyPage, {
      email: companyEmailTemp,
      password: companyPasswordTemp,
    });
    await companyPage.waitForLoadState("networkidle");
    await expect(companyPage).toHaveURL(withFrontendRoute(FrontendRoutes.HOME));

    // go to the chat page
    await companyPage.goto(tempURL);
    await companyPage.waitForLoadState("networkidle");
    await expect(companyPage).toHaveURL(/\/chat\/.+/);
    await expect(companyPage.getByText("Company not logged")).toBeVisible();
  });
});
