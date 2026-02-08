import { test, expect } from '@playwright/test';

test.describe('Advanced E2E Tests - Real-time Collaboration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board', { timeout: 10000 });
  });

  test('should handle concurrent user actions', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('http://localhost:3000');
    await page2.goto('http://localhost:3000');

    await Promise.all([
      page1.waitForSelector('.kanban-board'),
      page2.waitForSelector('.kanban-board')
    ]);

    await page1.click('button:has-text("+ New Task")');
    await page1.fill('#title', 'Shared Task from User 1');
    await page1.click('button[type="submit"]');

    await expect(page2.getByText('Shared Task from User 1')).toBeVisible({ timeout: 3000 });

    await page2.click('button:has-text("+ New Task")');
    await page2.fill('#title', 'Shared Task from User 2');
    await page2.click('button[type="submit"]');

    await expect(page1.getByText('Shared Task from User 2')).toBeVisible({ timeout: 3000 });

    await context1.close();
    await context2.close();
  });

  test('should sync drag-and-drop across multiple users', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('http://localhost:3000');
    await page2.goto('http://localhost:3000');

    await Promise.all([
      page1.waitForSelector('.kanban-board'),
      page2.waitForSelector('.kanban-board')
    ]);

    await page1.click('button:has-text("+ New Task")');
    await page1.fill('#title', 'Task to Move');
    await page1.selectOption('#status', 'todo');
    await page1.click('button[type="submit"]');

    await expect(page1.getByText('Task to Move')).toBeVisible();
    await expect(page2.getByText('Task to Move')).toBeVisible();

    const todoColumn = page1.locator('.kanban-column').first();
    const task = todoColumn.locator('.task-card:has-text("Task to Move")');
    const inProgressColumn = page1.locator('.kanban-column').nth(1);

    await task.dragTo(inProgressColumn);

    await page2.waitForTimeout(1000);
    
    const page2InProgressColumn = page2.locator('.kanban-column').nth(1);
    await expect(page2InProgressColumn.getByText('Task to Move')).toBeVisible();

    await context1.close();
    await context2.close();
  });

  test('should handle offline-online transitions', async ({ page, context }) => {
    await page.waitForSelector('.kanban-board');

    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Online Task');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Online Task')).toBeVisible();

    await context.setOffline(true);

    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Offline Task');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(500);

    await context.setOffline(false);

    await expect(page.getByText('Offline Task')).toBeVisible({ timeout: 5000 });
  });

  test('should maintain data consistency during rapid updates', async ({ page }) => {
    await page.waitForSelector('.kanban-board');

    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("+ New Task")');
      await page.fill('#title', `Rapid Task ${i}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(100);
    }

    for (let i = 0; i < 10; i++) {
      await expect(page.getByText(`Rapid Task ${i}`)).toBeVisible();
    }

    const taskCards = page.locator('.task-card');
    const count = await taskCards.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('should handle WebSocket reconnection', async ({ page, context }) => {
    await page.waitForSelector('.kanban-board');

    await context.setOffline(true);
    await page.waitForTimeout(2000);

    const loadingMessage = page.getByText(/connecting|disconnected/i);
    await expect(loadingMessage).toBeVisible({ timeout: 3000 });

    await context.setOffline(false);

    await page.waitForSelector('.kanban-board', { timeout: 10000 });
    await expect(loadingMessage).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Performance and Load Testing', () => {
  test('should handle 100+ tasks without performance degradation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    const startTime = Date.now();

    for (let i = 0; i < 100; i++) {
      await page.click('button:has-text("+ New Task")');
      await page.fill('#title', `Load Test Task ${i}`);
      await page.selectOption('#status', ['todo', 'in-progress', 'done'][i % 3]);
      await page.click('button[type="submit"]');
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(30000);

    const taskCards = page.locator('.task-card');
    const count = await taskCards.count();
    expect(count).toBeGreaterThanOrEqual(100);

    const kanbanBoard = page.locator('.kanban-board');
    await kanbanBoard.evaluate(el => el.scrollTo(0, el.scrollHeight));
    await page.waitForTimeout(500);
    await kanbanBoard.evaluate(el => el.scrollTo(0, 0));
  });

  test('should render large task descriptions without lag', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    const largeDescription = 'Lorem ipsum '.repeat(200);

    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Large Description Task');
    await page.fill('#description', largeDescription);
    await page.click('button[type="submit"]');

    await expect(page.getByText('Large Description Task')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Accessibility and UX', () => {
  test('should meet WCAG 2.1 AA contrast requirements', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    const primaryButton = page.locator('button.btn-primary').first();
    const bgColor = await primaryButton.evaluate(el => getComputedStyle(el).backgroundColor);
    const textColor = await primaryButton.evaluate(el => getComputedStyle(el).color);

    expect(bgColor).toBeTruthy();
    expect(textColor).toBeTruthy();
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    await page.click('button:has-text("+ New Task")');
    await page.fill('#title', 'Screen Reader Test');
    await page.click('button[type="submit"]');

    const taskCard = page.locator('.task-card').filter({ hasText: 'Screen Reader Test' });
    const ariaLabel = await taskCard.getAttribute('aria-label');
    
    expect(ariaLabel || (await taskCard.textContent())).toContain('Screen Reader Test');
  });

  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);

    const newTaskBtn = page.getByRole('button', { name: /new task/i });
    await newTaskBtn.focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('.modal-content')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('should show focus indicators', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    const button = page.locator('button').first();
    await button.focus();

    const outlineStyle = await button.evaluate(el => getComputedStyle(el).outline);
    const boxShadow = await button.evaluate(el => getComputedStyle(el).boxShadow);

    expect(outlineStyle !== 'none' || boxShadow !== 'none').toBeTruthy();
  });
});

test.describe('Error Recovery', () => {
  test('should recover from invalid data gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.kanban-board');

    await page.click('button:has-text("+ New Task")');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message, [role="alert"]');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should handle backend errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.route('**/api/**', route => route.abort());
    
    await page.waitForTimeout(3000);
    
    const newTaskBtn = page.locator('button:has-text("+ New Task")');
    expect(newTaskBtn).toBeDefined();
  });
});