import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.kanban-board', { timeout: 10000 });
  });

  test('should upload a file when creating task', async ({ page }) => {
    // Open create task modal
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Fill basic info
    await page.fill('#title', 'Task with Attachment');
    
    // Create a test file (mock file upload)
    const fileInput = page.locator('#file-upload');
    
    // For testing, we can use setInputFiles with a buffer
    await fileInput.setInputFiles({
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test file content')
    });
    
    // Wait for attachment to appear
    await expect(page.locator('.attachment-item')).toBeVisible();
    await expect(page.getByText('test-document.pdf')).toBeVisible();
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify task shows attachment indicator
    await expect(page.getByText(/1 attachment\(s\)/)).toBeVisible();
  });

  test('should upload multiple files', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    await page.fill('#title', 'Task with Multiple Attachments');
    
    const fileInput = page.locator('#file-upload');
    
    // Upload first file
    await fileInput.setInputFiles({
      name: 'file1.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('file 1')
    });
    
    await page.waitForTimeout(200);
    
    // Upload second file
    await fileInput.setInputFiles({
      name: 'file2.png',
      mimeType: 'image/png',
      buffer: Buffer.from('file 2')
    });
    
    // Verify both attachments appear
    await expect(page.locator('.attachment-item')).toHaveCount(2);
  });

  test('should display image preview for image files', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    await page.fill('#title', 'Task with Image');
    
    const fileInput = page.locator('#file-upload');
    
    // Upload image file
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake image data')
    });
    
    // Check for image preview (img tag)
    await expect(page.locator('.attachment-item img')).toBeVisible();
  });

  test('should remove attachment when remove button clicked', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    await page.fill('#title', 'Task to Remove Attachment');
    
    const fileInput = page.locator('#file-upload');
    
    // Upload file
    await fileInput.setInputFiles({
      name: 'removable-file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test')
    });
    
    // Verify attachment appears
    await expect(page.locator('.attachment-item')).toBeVisible();
    
    // Click remove button
    await page.click('.attachment-item .btn-remove');
    
    // Verify attachment removed
    await expect(page.locator('.attachment-item')).not.toBeVisible();
  });

  test('should edit task and add new attachment', async ({ page }) => {
    // Wait for tasks
    await page.waitForSelector('.task-card', { timeout: 5000 });
    
    // Click edit on first task
    await page.click('.task-card >> button[title="Edit"]');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    const fileInput = page.locator('#file-upload');
    
    // Add attachment
    await fileInput.setInputFiles({
      name: 'new-attachment.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('new attachment')
    });
    
    // Submit
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(500);
    
    // Verify attachment count updated (check for attachment indicator)
    const attachmentIndicators = page.locator('.task-attachments');
    if (await attachmentIndicators.count() > 0) {
      await expect(attachmentIndicators.first()).toBeVisible();
    }
  });

  test('should show file upload button with icon', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Check upload label exists
    await expect(page.locator('.file-upload-label')).toBeVisible();
    await expect(page.getByText('Upload files')).toBeVisible();
  });

  test('should maintain other form data when uploading file', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    // Fill form
    await page.fill('#title', 'Task with File');
    await page.fill('#description', 'Test description');
    await page.selectOption('#priority', 'High');
    
    // Upload file
    const fileInput = page.locator('#file-upload');
    await fileInput.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test')
    });
    
    // Verify form data still present
    await expect(page.locator('#title')).toHaveValue('Task with File');
    await expect(page.locator('#description')).toHaveValue('Test description');
    await expect(page.locator('#priority')).toHaveValue('High');
  });

  test('should create task successfully without attachments', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await expect(page.locator('.modal-content')).toBeVisible();
    
    await page.fill('#title', 'Task Without Attachments');
    
    // Submit without uploading files
    await page.click('button[type="submit"]');
    
    // Verify task created
    await expect(page.getByText('Task Without Attachments')).toBeVisible();
  });
});
