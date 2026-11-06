import type { Page } from '@playwright/test';

export const validApplication = {
  name: 'Maria Teste Silva',
  email: 'maria.teste@example.com',
  phone: '(11) 91234-5678',
  city: 'São Paulo, Brasil',
  company: 'Empresa Exemplo',
  role: 'Diretora',
  segment: 'imobiliario',
  about: 'Empresa fictícia usada nos testes automatizados.',
  goals: 'Validar o formulário de ponta a ponta.',
};

/** Fills every required field with valid test data and ticks consent. */
export async function fillValidApplication(page: Page) {
  const { segment, ...text } = validApplication;
  for (const [name, value] of Object.entries(text)) {
    await page.locator(`#field-${name}`).fill(value);
  }
  await page.locator('#field-segment').selectOption(segment);
  await page.locator('#field-consent').check();
}

/** The server treats instant submissions as bots; backdate the render time. */
export async function backdateForm(page: Page) {
  await page
    .locator('input[name="startedAt"]')
    .evaluate((input: HTMLInputElement) => (input.value = String(Date.now() - 10_000)));
}
