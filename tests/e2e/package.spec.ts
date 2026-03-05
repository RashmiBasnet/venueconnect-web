import { expect, test } from "@playwright/test";

test.describe("Package page", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "auth_token",
        value: "playwright-test-token",
        domain: "localhost",
        path: "/",
      },
      {
        name: "user_data",
        value: JSON.stringify({
          _id: "playwright-user",
          role: "user",
          email: "playwright@example.com",
        }),
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("loads packages route", async ({ page }) => {
    await page.goto("/user/packages");
    await expect(page).toHaveURL(/\/user\/packages/);
  });

  test("shows packages heading or fetch error state", async ({ page }) => {
    await page.goto("/user/packages");

    const heading = page.getByRole("heading", { name: "Packages" });
    const error = page.getByText(/Failed to fetch packages|Fetch packages failed/i);
    await expect(heading.or(error).first()).toBeVisible();
  });

  test("shows package search controls when content loads", async ({ page }) => {
    await page.goto("/user/packages");

    const searchInput = page.getByPlaceholder(
      "Search packages (name, description...)"
    );
    if ((await searchInput.count()) === 0) {
      await expect(
        page.getByText(/Failed to fetch packages|Fetch packages failed/i)
      ).toBeVisible();
      return;
    }

    await searchInput.fill("wedding");
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
  });

  test("shows clear button when search query is set", async ({ page }) => {
    await page.goto("/user/packages?search=party&page=2");

    const clearButton = page.getByRole("button", { name: "Clear" });
    if ((await clearButton.count()) === 0) {
      await expect(
        page.getByText(/Failed to fetch packages|Fetch packages failed/i)
      ).toBeVisible();
      return;
    }

    await expect(clearButton).toBeVisible();
    await expect(
      page.getByPlaceholder("Search packages (name, description...)")
    ).toHaveValue("party");
  });

  test("redirects to login when auth cookies are missing", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/user/packages");
    await expect(page).toHaveURL(/\/login/);
  });
});
