import { expect, test } from '@playwright/test';

const PAGES = ['/', '/solicitar-participacao', '/privacidade', '/en', '/en/apply', '/en/privacy'];

test.describe('links', () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, 'runs once'));

  test('every internal link and anchor resolves', async ({ page, request }) => {
    const checked = new Map<string, number>();

    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page
        .locator('a[href]')
        .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));

      for (const href of new Set(hrefs)) {
        const url = new URL(href);
        if (url.origin !== new URL(page.url()).origin) continue;

        const target = url.pathname;
        if (!checked.has(target)) checked.set(target, (await request.get(target)).status());
        expect(checked.get(target), `${path} → ${target}`).toBe(200);

        if (url.hash.length > 1) {
          const html = await (await request.get(target)).text();
          expect(html, `${path} → ${target}${url.hash}`).toContain(`id="${url.hash.slice(1)}"`);
        }
      }
    }
  });

  test('external links open safely', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const unsafe = await page
        .locator('a[target="_blank"]')
        .evaluateAll((links) =>
          links
            .filter((link) => !(link.getAttribute('rel') ?? '').includes('noopener'))
            .map((l) => l.outerHTML),
        );
      expect(unsafe, path).toEqual([]);
    }
  });
});
