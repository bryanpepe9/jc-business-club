import { expect, test } from '@playwright/test';
import { backdateForm, fillValidApplication } from './helpers';

const ACTION = '**/_actions/apply*';

test.describe('application form (JavaScript)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solicitar-participacao');
  });

  test('shows a focused error summary for an empty submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();

    const summary = page.locator('[data-summary]');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole('link')).toHaveCount(10);
    await expect(page.locator('#field-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#field-linkedin')).not.toHaveAttribute('aria-invalid', 'true');

    // Summary links move focus to the field.
    await summary.getByRole('link', { name: 'Informe seu e-mail.' }).click();
    await expect(page.locator('#field-email')).toBeFocused();
  });

  test('validates as you go and clears errors once fixed', async ({ page }) => {
    const email = page.locator('#field-email');
    await email.fill('maria@');
    await email.blur();
    await expect(page.locator('#field-email-error')).toContainText('Informe um e-mail válido');
    await email.fill('maria@empresa.com.br');
    await expect(page.locator('#field-email-error')).toBeEmpty();
  });

  test('asks for the segment only when "Outro" is chosen', async ({ page }) => {
    const other = page.locator('#field-segmentOther');
    await expect(other).toBeHidden();
    await page.locator('#field-segment').selectOption('outro');
    await expect(other).toBeVisible();
    await page.locator('#field-segment').selectOption('agronegocio');
    await expect(other).toBeHidden();
  });

  test('submits and shows an honest confirmation in development mode', async ({ page }) => {
    await fillValidApplication(page);
    await backdateForm(page);
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();

    const title = page.getByRole('heading', { name: 'Solicitação recebida' });
    await expect(title).toBeVisible();
    await expect(title).toBeFocused();
    await expect(page.getByText('Obrigado, Maria.')).toBeVisible();
    await expect(page.getByText('nada foi enviado')).toBeVisible();
  });

  test('reports a delivery failure and keeps the answers', async ({ page }) => {
    await page.route(ACTION, (route) =>
      route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'AstroActionError',
          code: 'BAD_GATEWAY',
          status: 502,
          message: 'delivery',
        }),
      }),
    );
    await fillValidApplication(page);
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();

    const alert = page.getByRole('alert').filter({ hasText: 'Não foi possível enviar' });
    await expect(alert).toBeVisible();
    await expect(alert).toBeFocused();
    await expect(page.locator('#field-name')).toHaveValue('Maria Teste Silva');
    await expect(page.getByRole('button', { name: 'Enviar solicitação' })).toBeVisible();
  });

  test('reports a lost connection', async ({ page }) => {
    await page.route(ACTION, (route) => route.abort('internetdisconnected'));
    await fillValidApplication(page);
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Verifique sua internet' })).toBeVisible();
  });

  test('reports when submissions are unavailable', async ({ page }) => {
    await page.route(ACTION, (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'AstroActionError',
          code: 'SERVICE_UNAVAILABLE',
          status: 503,
          message: 'unavailable',
        }),
      }),
    );
    await fillValidApplication(page);
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'temporariamente indisponível' })).toBeVisible();
  });
});

test.describe('application form (no JavaScript)', () => {
  test.use({ javaScriptEnabled: false });

  test('server renders errors and keeps the answers', async ({ page }) => {
    await page.goto('/solicitar-participacao');
    await page.locator('#field-name').fill('Ana');
    await page.locator('#field-email').fill('ana@');
    // Native validation would block the empty form; submit past it.
    await page.locator('[data-form]').evaluate((form: HTMLFormElement) => (form.noValidate = true));
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();

    await expect(page.locator('[data-summary]')).toBeVisible();
    await expect(page.locator('#field-name')).toHaveValue('Ana');
    await expect(page.locator('#field-email-error')).toContainText('Informe um e-mail válido');
  });

  test('server renders the confirmation', async ({ page }) => {
    await page.goto('/solicitar-participacao');
    await fillValidApplication(page);
    await backdateForm(page);
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();
    await expect(page.getByRole('heading', { name: 'Solicitação recebida' })).toBeVisible();
    await expect(page.getByText('Obrigado, Maria.')).toBeVisible();
  });
});
