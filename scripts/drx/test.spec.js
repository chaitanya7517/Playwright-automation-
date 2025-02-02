import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://gymoryx.in/');
  await page.getByRole('link', { name: 'Login', exact: true }).click();
  await page.getByRole('textbox', { name: 'email' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill('demo2');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('checkbox', { name: 'Show Password' }).check();
  await page.getByRole('button', { name: 'Login' }).click();
});