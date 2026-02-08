import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for WebSocket connection
    await page.waitForSelector('.kanban-board', { timeout: 10000 });
  });

  test('should display kanban board with three columns', async ({ page }) => {
    await expect(page.locator('.kanban-column')).toHaveCount(3);
    await expect(page.getByText('To Do')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Click new task button
    await page.click('button:has-text("+ New Task")');
    
    // Wait for modal
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Fill form
    await page.fill('#title', 'Test Task from E2E');
    await page.fill('#description', 'This is a test task description');
    await page.selectOption('#priority', 'High');
    await page.selectOption('#category', 'Bug');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify task appears
    await expect(page.getByText('Test Task from E2E')).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Click first task's edit button
    await page.click('.task-card >> button[title="Edit"]');
    
    // Wait for modal
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Update title
    await page.fill('#title', 'Updated Task Title');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify updated title appears
    await expect(page.getByText('Updated Task Title')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Get initial task count
    const initialCount = await page.locator('.task-card').count();
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    await page.click('.task-card >> button[title="Delete"]');
    
    // Wait a bit for deletion
    await page.waitForTimeout(500);
    
    // Verify task count decreased
    const finalCount = await page.locator('.task-card').count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('should drag and drop task between columns', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Find a task in "To Do" column
    const todoColumn = page.locator('.kanban-column').first();
    const task = todoColumn.locator('.task-card').first();
    
    if (await task.count() === 0) {
      // Create a task if none exist
      await page.click('button:has-text("+ New Task")');
      await page.fill('#title', 'Drag Test Task');
      await page.selectOption('#status', 'todo');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }
    
    // Get task title for verification
    const taskTitle = await task.locator('.task-title').textContent();
    
    // Get target column (In Progress)
    const targetColumn = page.locator('.kanban-column').nth(1);
    
    // Perform drag and drop
    await task.dragTo(targetColumn);
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Verify task moved to In Progress column
    const inProgressColumn = page.locator('.kanban-column').nth(1);
    await expect(inProgressColumn.getByText(taskTitle)).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate with network blocked temporarily
    await page.route('**/*', route => route.abort());
    
    const navigationPromise = page.goto('/');
    
    // Check for loading indicator
    await expect(page.getByText('Connecting to server...')).toBeVisible();
    
    // Unblock network
    await page.unroute('**/*');
    
    await navigationPromise;
  });

  test('should display task count in column headers', async ({ page }) => {
    await page.waitForSelector('.task-count', { timeout: 5000 });
    
    const taskCounts = page.locator('.task-count');
    await expect(taskCounts).toHaveCount(3);
    
    // Verify counts are numbers
    const firstCount = await taskCounts.first().textContent();
    expect(parseInt(firstCount)).toBeGreaterThanOrEqual(0);
  });

  test('should show chart with task statistics', async ({ page }) => {
    await expect(page.locator('.task-chart-container')).toBeVisible();
    await expect(page.getByText('📊 Task Progress')).toBeVisible();
    await expect(page.getByText('Total Tasks:')).toBeVisible();
    await expect(page.getByText('Completion:')).toBeVisible();
  });
});
