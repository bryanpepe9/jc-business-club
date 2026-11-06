import { expect, test } from '@playwright/test';
import { backdateForm, fillValidApplication } from './helpers';

test.describe('English version', () => {
  test('home is in English and declares its translations', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connections that drive business.');
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', /\/$/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en$/);
    await expect(page.locator('#founding-member').getByText('R$ 990')).toBeVisible();
  });

  test('the language switch links each page to its translation', async ({ page }) => {
    const pairs = [
      ['/', '/en'],
      ['/solicitar-participacao', '/en/apply'],
      ['/privacidade', '/en/privacy'],
    ];
    for (const [pt, en] of pairs) {
      await page.goto(pt);
      await expect(page.locator('.site-header a[hreflang="en"]')).toHaveAttribute('href', en);
      await page.goto(en);
      await expect(page.locator('.site-header a[hreflang="pt-BR"]')).toHaveAttribute('href', pt);
    }
  });

  test('English form requires a country code and submits', async ({ page }) => {
    await page.goto('/en/apply');
    await fillValidApplication(page);
    // A US number without +1 must not be mistaken for a Brazilian one.
    await page.locator('#field-phone').fill('415 555 0100');
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.locator('#field-phone-error')).toContainText('country code');

    await page.locator('#field-phone').fill('+1 415 555 0100');
    await backdateForm(page);
    await page.getByRole('button', { name: 'Submit application' }).click();
    await expect(page.getByRole('heading', { name: 'Application received' })).toBeFocused();
    await expect(page.getByText('Thank you, Maria.')).toBeVisible();
  });

  test('English errors and summary', async ({ page }) => {
    await page.goto('/en/apply');
    await page.getByRole('button', { name: 'Submit application' }).click();
    const summary = page.locator('[data-summary]');
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Enter your full name.');
  });

  test('unknown English addresses get the English 404', async ({ page }) => {
    const response = await page.goto('/en/missing-page');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  });
});
