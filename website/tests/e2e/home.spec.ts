import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('leads with the brand promise and the application CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('JC Business Club — Conexões que geram negócios');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conexões que geram negócios.');
    await expect(page.getByRole('link', { name: 'Quero fazer parte' })).toHaveAttribute(
      'href',
      '/solicitar-participacao',
    );
    await expect(page.getByText('Sem palestras ou apresentações').first()).toBeVisible();
  });

  test('shows the confirmed membership facts', async ({ page }) => {
    await page.goto('/');
    const membership = page.locator('#membro-fundador');
    await expect(membership.getByText('R$ 990')).toBeVisible();
    await expect(membership.getByText('2 cafés da manhã por mês')).toBeVisible();
  });

  test('every navigation anchor points to a section on the page', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('header a[href*="#"], footer a[href*="#"]')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).hash.slice(1)));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const id of new Set(hrefs)) {
      await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
  });

  test('press: linked articles open in a new tab, pending ones are plain text', async ({ page }) => {
    await page.goto('/');
    const press = page.locator('.press');
    await expect(press.getByRole('heading', { name: 'Reconhecimento na mídia' })).toBeVisible();
    const links = press.locator('a.press__item');
    await expect(links).toHaveCount(5);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('href', /^https:\/\//);
    }
    await expect(press.locator('div.press__item')).toHaveCount(4);
  });

  test('skip link moves focus to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard navigation');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#conteudo')).toBeFocused();
  });

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'viewport sweep runs once');
      await page.setViewportSize({ width, height: 900 });
      for (const path of ['/', '/solicitar-participacao', '/privacidade', '/en', '/en/apply']) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('mobile menu', () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, 'mobile only'));

  test('opens, traps focus, closes with Escape and restores focus', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Solicitar participação' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('navigates to a section and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'A experiência' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL(/#experiencia$/);
  });
});
