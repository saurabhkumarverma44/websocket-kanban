import { test, expect } from '@playwright/test';

test.describe('Dropdown Selection Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.kanban-board', { timeout: 10000 });
  });

  test('should create task with selected priority', async ({ page }) => {
    // Open create task modal
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Fill basic info
    await page.fill('#title', 'Priority Test Task');
    
    // Select High priority
    await page.selectOption('#priority', 'High');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify task has High priority badge
    await expect(page.locator('.priority-badge:has-text("High")')).toBeVisible();
  });

  test('should create task with selected category', async ({ page }) => {
    // Open create task modal
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Fill basic info
    await page.fill('#title', 'Category Test Task');
    
    // Select Bug category
    await page.selectOption('#category', 'Bug');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify task has Bug category badge
    await expect(page.locator('.category-badge:has-text("Bug")')).toBeVisible();
  });

  test('should update task priority via dropdown', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Click edit on first task
    await page.click('.task-card >> button[title="Edit"]');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Change priority to Low
    await page.selectOption('#priority', 'Low');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify updated priority
    await page.waitForTimeout(500);
    await expect(page.locator('.priority-badge:has-text("Low")')).toBeVisible();
  });

  test('should update task category via dropdown', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Click edit on first task
    await page.click('.task-card >> button[title="Edit"]');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Change category to Enhancement
    await page.selectOption('#category', 'Enhancement');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify updated category
    await page.waitForTimeout(500);
    await expect(page.locator('.category-badge:has-text("Enhancement")')).toBeVisible();
  });

  test('should have all priority options available', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    const prioritySelect = page.locator('#priority');
    const options = await prioritySelect.locator('option').allTextContents();
    
    expect(options).toContain('Low');
    expect(options).toContain('Medium');
    expect(options).toContain('High');
  });

  test('should have all category options available', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    const categorySelect = page.locator('#category');
    const options = await categorySelect.locator('option').allTextContents();
    
    expect(options).toContain('Bug');
    expect(options).toContain('Feature');
    expect(options).toContain('Enhancement');
  });

  test('should have all status options available', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    const statusSelect = page.locator('#status');
    const options = await statusSelect.locator('option').allTextContents();
    
    expect(options).toContain('To Do');
    expect(options).toContain('In Progress');
    expect(options).toContain('Done');
  });

  test('should default to Medium priority and Feature category', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    const priorityValue = await page.locator('#priority').inputValue();
    const categoryValue = await page.locator('#category').inputValue();
    
    expect(priorityValue).toBe('Medium');
    expect(categoryValue).toBe('Feature');
  });
});
