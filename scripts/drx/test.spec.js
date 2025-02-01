import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.deepseek.com/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Now Free access to' }).click();
  const page1 = await page1Promise;
  await page1.locator('iframe[src="https\\:\\/\\/challenges\\.cloudflare\\.com\\/cdn-cgi\\/challenge-platform\\/h\\/b\\/turnstile\\/if\\/ov2\\/av0\\/rcv\\/dm9fy\\/0x4AAAAAAADnPIDROrmt1Wwj\\/light\\/fbE\\/new\\/normal\\/auto\\/"]').contentFrame().locator('body').click();
  await page1.goto('https://chat.deepseek.com/');
  await page1.locator('iframe[src="https\\:\\/\\/challenges\\.cloudflare\\.com\\/cdn-cgi\\/challenge-platform\\/h\\/b\\/turnstile\\/if\\/ov2\\/av0\\/rcv\\/5liww\\/0x4AAAAAAADnPIDROrmt1Wwj\\/light\\/fbE\\/new\\/normal\\/auto\\/"]').contentFrame().locator('body').click();
  await page1.goto('https://chat.deepseek.com/');
  await page1.locator('iframe[src="https\\:\\/\\/challenges\\.cloudflare\\.com\\/cdn-cgi\\/challenge-platform\\/h\\/b\\/turnstile\\/if\\/ov2\\/av0\\/rcv\\/jtn3y\\/0x4AAAAAAADnPIDROrmt1Wwj\\/light\\/fbE\\/new\\/normal\\/auto\\/"]').contentFrame().locator('body').click();
  await page1.goto('https://chat.deepseek.com/');
});