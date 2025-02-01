import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.deepseek.com/');
  await page.locator('iframe[src="https\\:\\/\\/challenges\\.cloudflare\\.com\\/cdn-cgi\\/challenge-platform\\/h\\/b\\/turnstile\\/if\\/ov2\\/av0\\/rcv\\/0e7sg\\/0x4AAAAAAADnPIDROrmt1Wwj\\/light\\/fbE\\/new\\/normal\\/auto\\/"]').contentFrame().locator('body').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Now Free access to' }).click();
  const page1 = await page1Promise;
});