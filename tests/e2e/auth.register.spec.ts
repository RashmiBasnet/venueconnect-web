import { expect, test } from "@playwright/test";

test.describe("Register page", () => {
  test("renders register form fields and submit button", async ({ page }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("heading", { name: "Create Account" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Enter your name")).toBeVisible();
    await expect(
      page.getByPlaceholder("Enter your email address")
    ).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
  });

  test("shows required/invalid validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 6 characters").first()
    ).toBeVisible();
  });

  test("shows password mismatch validation", async ({ page }) => {
    await page.goto("/register");

    await page.getByPlaceholder("Enter your name").fill("Test User");
    await page
      .getByPlaceholder("Enter your email address")
      .fill("test@example.com");
    await page.locator('input[name="password"]').fill("secret123");
    await page.locator('input[name="confirmPassword"]').fill("different123");
    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("password visibility toggles work for both fields", async ({ page }) => {
    await page.goto("/register");

    const passwordInput = page.locator('input[name="password"]');
    const confirmInput = page.locator('input[name="confirmPassword"]');
    const passwordToggle = passwordInput.locator("xpath=following-sibling::button");
    const confirmToggle = confirmInput.locator("xpath=following-sibling::button");

    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(confirmInput).toHaveAttribute("type", "password");

    await passwordToggle.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await confirmToggle.click();
    await expect(confirmInput).toHaveAttribute("type", "text");
  });

  test("shows login cross-links", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('a[href="/login"]').first()).toBeVisible();
    await expect(page.locator('a[href="/login"]').nth(1)).toBeVisible();
  });
});
