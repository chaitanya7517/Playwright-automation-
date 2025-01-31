import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.deepseek.com/');
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Now Free access to' }).dblclick();
  const page2 = await page2Promise;
});