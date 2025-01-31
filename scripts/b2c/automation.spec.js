import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://gitingest.com/chaitanya7517/Playwright-automation-');
  await page.getByRole('button', { name: 'Ingest' }).click();
  await page.getByRole('button', { name: 'Copy' }).nth(1).click();
  await page.getByRole('slider', { name: 'Include files under: 50kb' }).fill('500');
  await page.getByRole('slider', { name: 'Include files under: 100mb' }).fill('245');
  await page.getByRole('button', { name: 'Ingest' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'GitHub' }).click();
  const page1 = await page1Promise;
});