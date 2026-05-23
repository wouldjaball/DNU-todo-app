import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("page loads with title and empty state", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "To-Do List" })).toBeVisible();
  await expect(page.getByTestId("empty-message")).toBeVisible();
  await expect(page.getByTestId("todo-item")).toHaveCount(0);
});

test("can add a task", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Buy groceries");
  await page.getByTestId("add-button").click();

  await expect(page.getByTestId("todo-item")).toHaveCount(1);
  await expect(page.getByTestId("todo-text")).toHaveText("Buy groceries");
  await expect(page.getByTestId("empty-message")).not.toBeVisible();
});

test("can mark a task complete and incomplete", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Walk the dog");
  await page.getByTestId("add-button").click();

  const checkbox = page.getByTestId("todo-checkbox");
  const text = page.getByTestId("todo-text");

  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(text).toHaveCSS("text-decoration-line", "line-through");

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
});

test("can delete a task", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Read a book");
  await page.getByTestId("add-button").click();
  await expect(page.getByTestId("todo-item")).toHaveCount(1);

  await page.getByTestId("delete-button").click();
  await expect(page.getByTestId("todo-item")).toHaveCount(0);
  await expect(page.getByTestId("empty-message")).toBeVisible();
});
