import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://gitingest.com/chaitanya7517/Playwright-automation-');
  await page.getByRole('button', { name: 'Ingest' }).dblclick();
  await page.getByRole('button', { name: 'Copy' }).nth(2).click();
});