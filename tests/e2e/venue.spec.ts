import { expect, test } from "@playwright/test";

test.describe("Venue page", () => {
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

  test("loads venues route", async ({ page }) => {
    await page.goto("/user/venues");
    await expect(page).toHaveURL(/\/user\/venues/);
  });

  test("shows venues heading or fetch error state", async ({ page }) => {
    await page.goto("/user/venues");

    const heading = page.getByRole("heading", { name: "Venues" });
    const error = page.getByText(/Failed to fetch venues|Fetch venues failed/i);
    await expect(heading.or(error).first()).toBeVisible();
  });

  test("shows venue grid actions or empty/error message", async ({ page }) => {
    await page.goto("/user/venues");

    const hasBookNow = (await page.getByRole("link", { name: "Book Now" }).count()) > 0;
    const hasEmpty = (await page.getByText("No venues found.").count()) > 0;
    const hasError =
      (await page.getByText(/Failed to fetch venues|Fetch venues failed/i).count()) > 0;

    expect(hasBookNow || hasEmpty || hasError).toBeTruthy();
  });

  test("shows venues navigation link in user header", async ({ page }) => {
    await page.goto("/user/venues");
    await expect(page.locator('a[href="/user/venues"]').first()).toBeVisible();
  });

  test("redirects to login when auth cookies are missing", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/user/venues");
    await expect(page).toHaveURL(/\/login/);
  });
});
