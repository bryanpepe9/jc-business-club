import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Reduced motion keeps scroll-reveal content fully visible for the scan.
test.use({ colorScheme: 'light' });
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const path of [
  '/',
  '/solicitar-participacao',
  '/privacidade',
  '/pagina-inexistente',
  '/en',
  '/en/apply',
  '/en/privacy',
  '/en/missing-page',
]) {
  test(`no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });
}

test('no violations in the form error state', async ({ page }) => {
  await page.goto('/solicitar-participacao');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(page.locator('[data-summary]')).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
});

test('no violations with the mobile menu open', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
});
