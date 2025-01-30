import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://drxuat.bajajfinservhealth.in/login');
  await page.getByTestId('header-send-app-link').click();
  await page.getByTestId('send-app-link-close-button').click();
  await page.getByRole('button', { name: 'Our Products' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('menuitem', { name: 'Electronic Health Records' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Sign Up', exact: true }).click();
  await page1.getByText('×').click();
});