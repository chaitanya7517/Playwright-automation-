import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.deepseek.com/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Now Free access to' }).click();
  const page1 = await page1Promise;
});