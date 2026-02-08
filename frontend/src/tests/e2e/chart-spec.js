import { test, expect } from '@playwright/test';

test.describe('Task Chart Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.kanban-board', { timeout: 10000 });
  });

  test('should display task chart component', async ({ page }) => {
    await expect(page.locator('.task-chart-container')).toBeVisible();
    await expect(page.getByText('📊 Task Progress')).toBeVisible();
  });

  test('should show total tasks count', async ({ page }) => {
    await expect(page.getByText('Total Tasks:')).toBeVisible();
    
    const totalTasksElement = page.locator('.stat-item:has-text("Total Tasks:") .stat-value');
    await expect(totalTasksElement).toBeVisible();
    
    const totalCount = await totalTasksElement.textContent();
    expect(parseInt(totalCount)).toBeGreaterThanOrEqual(0);
  });

  test('should show completion percentage', async ({ page }) => {
    await expect(page.getByText('Completion:')).toBeVisible();
    
    const completionElement = page.locator('.stat-item:has-text("Completion:") .stat-value');
    await expect(completionElement).toBeVisible();
    
    const completionText = await completionElement.textContent();
    expect(completionText).toMatch(/\d+(\.\d+)?%/);
  });

  test('should update chart when new task is created', async ({ page }) => {
    // Get initial total count
    const initialTotalElement = page.locator('.stat-item:has-text("Total Tasks:") .stat-value');
    const initialTotal = parseInt(await initialTotalElement.textContent());
    
    // Create new task
    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Chart Update Test');
    await page.click('button[type="submit"]');
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Verify total increased
    const newTotal = parseInt(await initialTotalElement.textContent());
    expect(newTotal).toBe(initialTotal + 1);
  });

  test('should update chart when task is moved to done', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Get initial completion rate
    const completionElement = page.locator('.stat-item:has-text("Completion:") .stat-value');
    const initialCompletion = await completionElement.textContent();
    
    // Find a task not in Done and edit it
    const todoColumn = page.locator('.kanban-column').first();
    const task = todoColumn.locator('.task-card').first();
    
    if (await task.count() > 0) {
      await task.locator('button[title="Edit"]').click();
      await page.selectOption('#status', 'done');
      await page.click('button[type="submit"]');
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Verify completion rate changed (unless it was already 100%)
      const newCompletion = await completionElement.textContent();
      if (initialCompletion !== '100.0%') {
        expect(newCompletion).not.toBe(initialCompletion);
      }
    }
  });

  test('should display bar chart with task counts', async ({ page }) => {
    // Check for Recharts bar chart elements
    const chartElement = page.locator('.recharts-wrapper');
    await expect(chartElement).toBeVisible();
    
    // Verify bars are rendered
    const bars = page.locator('.recharts-bar-rectangle');
    expect(await bars.count()).toBeGreaterThan(0);
  });

  test('should show correct column names in chart', async ({ page }) => {
    // Wait for chart to render
    await page.waitForSelector('.recharts-wrapper', { timeout: 5000 });
    
    // Check for X-axis labels (column names)
    const xAxisLabels = page.locator('.recharts-xAxis .recharts-text');
    
    const labelTexts = await xAxisLabels.allTextContents();
    expect(labelTexts).toContain('To Do');
    expect(labelTexts).toContain('In Progress');
    expect(labelTexts).toContain('Done');
  });

  test('should update chart when task is deleted', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Get initial total
    const totalElement = page.locator('.stat-item:has-text("Total Tasks:") .stat-value');
    const initialTotal = parseInt(await totalElement.textContent());
    
    if (initialTotal > 0) {
      // Delete a task
      page.on('dialog', dialog => dialog.accept());
      await page.click('.task-card >> button[title="Delete"]');
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Verify total decreased
      const newTotal = parseInt(await totalElement.textContent());
      expect(newTotal).toBe(initialTotal - 1);
    }
  });

  test('should show 0% completion when no tasks are done', async ({ page }) => {
    // This test assumes we can reset the board or it starts fresh
    // Check if all tasks are in To Do or In Progress
    const doneColumn = page.locator('.kanban-column').nth(2);
    const doneTasks = doneColumn.locator('.task-card');
    
    if (await doneTasks.count() === 0) {
      const completionElement = page.locator('.stat-item:has-text("Completion:") .stat-value');
      const completion = await completionElement.textContent();
      expect(completion).toBe('0.0%');
    }
  });

  test('should show 100% completion when all tasks are done', async ({ page }) => {
    // Create a new task and immediately move it to done
    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Done Task');
    await page.selectOption('#status', 'done');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(500);
    
    // If this is the only task, completion should be 100%
    const totalElement = page.locator('.stat-item:has-text("Total Tasks:") .stat-value');
    const total = parseInt(await totalElement.textContent());
    
    if (total === 1) {
      const completionElement = page.locator('.stat-item:has-text("Completion:") .stat-value');
      const completion = await completionElement.textContent();
      expect(completion).toBe('100.0%');
    }
  });

  test('should render chart legend', async ({ page }) => {
    await page.waitForSelector('.recharts-wrapper', { timeout: 5000 });
    
    // Check for legend
    const legend = page.locator('.recharts-legend-wrapper');
    await expect(legend).toBeVisible();
  });

  test('should render Y-axis for task counts', async ({ page }) => {
    await page.waitForSelector('.recharts-wrapper', { timeout: 5000 });
    
    // Check for Y-axis
    const yAxis = page.locator('.recharts-yAxis');
    await expect(yAxis).toBeVisible();
  });
});
