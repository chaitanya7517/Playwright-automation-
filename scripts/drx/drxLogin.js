import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://drxuat.bajajfinservhealth.in/login');
  await page.getByRole('radio', { name: 'Login via Username' }).check();
  await page.getByRole('radio', { name: 'Login via Username' }).press('s');
  await page.getByRole('radio', { name: 'Login via Username' }).press('d');
  await page.getByRole('textbox', { name: 'Enter Username' }).click();
  await page.getByRole('textbox', { name: 'Enter Username' }).fill('fsdfsdf');
});