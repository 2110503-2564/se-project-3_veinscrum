import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { withFrontendRoute } from "@/utils/routes/withFrontendRoute";
import { faker } from "@faker-js/faker";
import { expect, Page, test } from "@playwright/test";
import { signIn } from "../utils/signIn";
import { signUp } from "../utils/signUp";

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
    const companyContext = await browser.newContext();
    const userContext = await browser.newContext();

    companyPage = await companyContext.newPage();
    userPage = await userContext.newPage();

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
    await companyPage.getByTestId("auth-dropdown-menu-create-company").click();

    await companyPage.waitForURL(FrontendRoutes.COMPANY_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(companyPage.getByTestId("company-create-title")).toBeVisible();
    await companyPage
      .getByTestId("company-create-name-input")
      .fill(companyName);
    await companyPage.getByTestId("company-create-address-input").fill(address);
    await companyPage.getByTestId("company-create-website-input").fill(website);
    await companyPage.getByTestId("company-create-tel-input").fill(telephone);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(description);

    await companyPage.getByTestId("company-create-submit-button").click();

    await companyPage.waitForURL(withFrontendRoute(FrontendRoutes.PROFILE));
    await companyPage.waitForLoadState("domcontentloaded");

    await companyPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_CREATE),
    );

    await companyPage.waitForURL(FrontendRoutes.JOB_LISTINGS_CREATE);
    await companyPage.waitForLoadState("domcontentloaded");

    await expect(
      companyPage.getByTestId("job-listing-create-title"),
    ).toBeVisible();

    await companyPage
      .getByTestId("job-listing-create-job-title-input")
      .fill(jobTitle);
    await companyPage
      .getByRole("textbox", { name: "editable markdown" })
      .fill(jobDescription);

    const responsePromise = companyPage.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.JOB_LISTINGS) &&
        response.status() === 201,
    );

    await companyPage.waitForTimeout(2000);

    await companyPage.getByTestId("job-listing-create-submit-button").click();

    const response: { data: JobListing } = await responsePromise.then(
      async (response) => await response.json(),
    );

    jobId = response.data._id;

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

    if (!jobId) {
      throw new Error("jobId is undefined");
    }

    await userPage.goto(
      withFrontendRoute(FrontendRoutes.JOB_LISTINGS_ID({ jobId })),
    );
    await userPage.waitForLoadState("domcontentloaded");

    await userPage.getByTestId("book-interview-session-button").click();

    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Enter");
    await userPage.keyboard.press("Tab");
    await userPage.keyboard.press("Enter");
    await userPage.mouse.click(0, 0);

    const sessionIdPromise = userPage.waitForResponse(
      (response) =>
        response.url().includes(BackendRoutes.SESSIONS) &&
        response.status() === 201,
    );

    await userPage.getByTestId("book-interview-session-button-submit").click();
    await userPage.waitForLoadState("domcontentloaded");

    const sessionId = await sessionIdPromise.then(async (response) => {
      const json = await response.json();
      return json.data._id;
    });

    await userPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await userPage.waitForLoadState("domcontentloaded");

    await userPage
      .getByTestId("user-interview-session-card-chat-button")
      .click();

    await userPage.waitForURL(
      withFrontendRoute(FrontendRoutes.CHAT_SESSION({ sessionId })),
    );
    await userPage.waitForLoadState("domcontentloaded");

    await companyPage.goto(withFrontendRoute(FrontendRoutes.SESSION_LIST));
    await companyPage.waitForLoadState("domcontentloaded");

    await companyPage.getByTestId("flag-user-card-accordion-trigger").click();

    await companyPage
      .getByTestId("flag-user-card-dropdown-menu-trigger")
      .click();
    await companyPage
      .getByTestId("flag-user-card-dropdown-menu-item-chat")
      .click();

    await companyPage.waitForLoadState("domcontentloaded");

    await expect(companyPage).toHaveURL(
      withFrontendRoute(FrontendRoutes.CHAT_SESSION({ sessionId })),
    );
  });

  test.describe.configure({ mode: "serial" });

  test("US2-1A: Users send messages to company", async () => {
    await userPage
      .getByTestId("chat-input")
      .fill("Hello, I am interested in this job.");

    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

    await expect(
      userPage.getByText("Hello, I am interested in this job."),
    ).toBeVisible();
    await expect(
      companyPage.getByText("Hello, I am interested in this job."),
    ).toBeVisible();
  });

  test("US2-1B: Refresh page should see full history", async () => {
    // User sends a message to the company
    await userPage.getByTestId("chat-input").fill("sup bro, how are you?");
    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is sent
    await expect(userPage.getByText("sup bro, how are you?")).toBeVisible();
    await expect(companyPage.getByText("sup bro, how are you?")).toBeVisible();

    // User refresh the page
    await userPage.reload();
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is still there
    await expect(userPage.getByText("sup bro, how are you?")).toBeVisible();
    await expect(companyPage.getByText("sup bro, how are you?")).toBeVisible();
  });

  test("US2-2A: Users edit messages", async () => {
    // User sends a message to the company
    await userPage.getByTestId("chat-input").fill("ggez");
    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

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
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is updated
    await expect(userPage.getByText("Sorry bro")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("Sorry bro")).toBeVisible();
  });

  test("US2-2B: Editing a message without changing", async () => {
    // User sends a message to the company
    await userPage.getByTestId("chat-input").fill("notedit");
    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

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
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is still the same
    await expect(userPage.getByText("notedit")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("notedit")).toBeVisible();
  });

  test("US2-3A: Users delete messages", async () => {
    // User sends a message to the company
    await userPage.getByTestId("chat-input").fill("free robux click here");
    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

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
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is deleted
    await expect(userPage.getByText("free robux click here")).not.toBeVisible();
    await companyPage.reload();
    await expect(
      companyPage.getByText("free robux click here"),
    ).not.toBeVisible();
  });

  test("US2-3B: Not logged in user clicking Delete", async () => {
    // User sends a message to the company
    await userPage.getByTestId("chat-input").fill("not logged");
    await userPage.getByTestId("chat-send-button").click();
    await userPage.waitForLoadState("domcontentloaded");

    // Verify the message is sent
    await expect(userPage.getByText("not logged")).toBeVisible();
    await companyPage.reload();
    await expect(companyPage.getByText("not logged")).toBeVisible();

    // Temp URL chat page
    const tempURL = userPage.url();

    // log out the user
    await userPage.getByTestId("auth-dropdown-menu-trigger").click();
    await userPage.getByTestId("auth-dropdown-menu-logout").click();
    await userPage.waitForURL(FrontendRoutes.AUTH_SIGN_IN);
    await userPage.waitForLoadState("domcontentloaded");

    // go to the chat page but go to the sign in page
    await userPage.goto(tempURL);
    await userPage.waitForLoadState("domcontentloaded");
    await expect(userPage).toHaveURL(
      withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN),
    );

    // Sign in as a user
    await signIn(userPage, {
      email: userEmailTemp,
      password: userPasswordTemp,
    });
    await userPage.waitForLoadState("domcontentloaded");
    await expect(userPage).toHaveURL(withFrontendRoute(FrontendRoutes.HOME));

    // go to the chat page
    await userPage.goto(tempURL);
    await userPage.waitForLoadState("domcontentloaded");
    await expect(userPage).toHaveURL(/\/chat\/.+/);
    await expect(userPage.getByText("not logged")).toBeVisible();
  });

  test("US2-4A: Company send messages to user", async () => {
    // Company sends a message to the user
    await companyPage.getByTestId("chat-input").fill("Hello, I am Big Boss.");
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is sent
    await expect(companyPage.getByText("Hello, I am Big Boss.")).toBeVisible();
    await expect(userPage.getByText("Hello, I am Big Boss.")).toBeVisible();
  });

  test("US2-4B: Company sending empty message", async () => {
    // Company sends an empty message to the user
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is not sent
    await expect(companyPage.getByText("Type a message...")).not.toBeVisible();
    await expect(userPage.getByText("Type a message...")).not.toBeVisible();
  });

  test("US2-5A: Company edit messages", async () => {
    // User sends a message to the company
    await companyPage.getByTestId("chat-input").fill("omgto is among us");
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");
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
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is updated
    await expect(
      companyPage.getByText("My company is the best in the world"),
    ).toBeVisible();
    await userPage.reload();
    await expect(
      userPage.getByText("My company is the best in the world"),
    ).toBeVisible();
  });

  test("US2-5B: Company editing a message without change", async () => {
    // Company sends a message to the company
    await companyPage.getByTestId("chat-input").fill("company not edit");
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");

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
      await companyPage.mouse.move(
        box.x + box.width / 2,
        box.y + box.height / 2,
      );
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    // Click on the edit message button but don't change the message
    await companyPage.getByRole("menuitem", { name: "Edit Message" }).click();
    await companyPage.getByRole("button", { name: "Save changes" }).click();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is still the same
    await expect(companyPage.getByText("company not edit")).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByText("company not edit")).toBeVisible();
  });

  test("US2-6A: Company delete messages", async () => {
    // Company sends a message to the user
    await companyPage
      .getByTestId("chat-input")
      .fill("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");

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
      await companyPage.mouse.move(
        box.x + box.width / 2,
        box.y + box.height / 2,
      );
    }
    const dropdownTrigger = messageContainer.locator("button").first();
    await dropdownTrigger.click();

    await companyPage.getByRole("menuitem", { name: "Delete Message" }).click();
    await companyPage.getByRole("button", { name: "Delete" }).click();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is deleted
    await expect(
      companyPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).not.toBeVisible();
    await userPage.reload();
    await expect(
      userPage.getByText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    ).not.toBeVisible();
  });

  test("US2-6B: Company not logged in clicking Delete", async () => {
    // Company sends a message to the company
    await companyPage.getByTestId("chat-input").fill("Company not logged");
    await companyPage.getByTestId("chat-send-button").click();
    await companyPage.waitForLoadState("domcontentloaded");

    // Verify the message is sent
    await expect(companyPage.getByText("Company not logged")).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByText("Company not logged")).toBeVisible();

    // Temp URL chat page
    const tempURL = companyPage.url();

    // log out the user
    await companyPage.getByTestId("auth-dropdown-menu-trigger").click();
    await companyPage.getByTestId("auth-dropdown-menu-logout").click();

    await companyPage.waitForURL(FrontendRoutes.AUTH_SIGN_IN);
    await companyPage.waitForLoadState("domcontentloaded");

    // go to the chat page but go to the sign in page
    await companyPage.goto(tempURL);
    await companyPage.waitForLoadState("domcontentloaded");
    await expect(companyPage).toHaveURL(
      withFrontendRoute(FrontendRoutes.AUTH_SIGN_IN),
    );

    // Sign in as a user
    await signIn(companyPage, {
      email: companyEmailTemp,
      password: companyPasswordTemp,
    });
    await companyPage.waitForLoadState("domcontentloaded");
    await expect(companyPage).toHaveURL(withFrontendRoute(FrontendRoutes.HOME));

    // go to the chat page
    await companyPage.goto(tempURL);
    await companyPage.waitForLoadState("domcontentloaded");
    await expect(companyPage).toHaveURL(/\/chat\/.+/);

    await companyPage.waitForTimeout(2000);

    await expect(companyPage.getByText("Company not logged")).toBeVisible();
  });
});
