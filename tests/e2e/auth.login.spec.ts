import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test("renders login form fields and submit button", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(
      page.getByPlaceholder("Enter your email address")
    ).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 6 characters")
    ).toBeVisible();
  });

  test("shows invalid email error for malformed email", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByPlaceholder("Enter your email address");
    await page.getByPlaceholder("Enter your email address").fill("not-an-email");
    await page.getByPlaceholder("Enter your password").fill("secret123");
    await page.getByRole("button", { name: "Login" }).click();

    const hasBrowserValidation = await emailInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      return input.validationMessage.length > 0;
    });
    expect(hasBrowserValidation).toBeTruthy();
  });

  test("password visibility toggle switches input type", async ({ page }) => {
    await page.goto("/login");

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("login page shows navigation links", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator('a[href="/register"]')).toBeVisible();
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });
});
