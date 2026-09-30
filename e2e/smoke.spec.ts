import { expect, test } from '@playwright/test';

test('welcome page shows app title and goals link', async ({ page }) => {
  await page.goto('/welcome');
  await expect(page.getByRole('heading', { name: /your goals/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /open goals/i })).toBeVisible();
});
