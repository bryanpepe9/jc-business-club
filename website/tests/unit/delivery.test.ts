import { afterEach, describe, expect, it, vi } from 'vitest';
import { DeliveryError, resolveDelivery } from '@/lib/application/delivery';

const notification = { subject: 'Assunto', text: 'Texto', html: '<p>HTML</p>' };
const options = { replyTo: 'maria@empresa.com.br', idempotencyKey: 'application/abc' };

afterEach(() => vi.unstubAllGlobals());

describe('resolveDelivery', () => {
  it('uses Resend when fully configured', () => {
    expect(resolveDelivery({ apiKey: 'k', to: 'a@b.c', from: 'd@e.f', isDev: false })?.mode).toBe('email');
  });

  it('falls back to the terminal only in development', () => {
    expect(resolveDelivery({ apiKey: 'k', isDev: true })?.mode).toBe('dev');
  });

  it('returns no delivery in production without configuration', () => {
    expect(resolveDelivery({ isDev: false })).toBeNull();
    expect(resolveDelivery({ apiKey: 'k', to: 'a@b.c', isDev: false })).toBeNull();
  });
});

describe('Resend delivery', () => {
  it('sends the expected request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const delivery = resolveDelivery({
      apiKey: 're_test',
      to: 'clube@exemplo.com, jennifer@exemplo.com',
      from: 'Site <site@exemplo.com>',
      isDev: false,
    })!;
    await delivery.send(notification, options);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer re_test',
      'Idempotency-Key': 'application/abc',
    });
    expect(JSON.parse(init.body)).toEqual({
      from: 'Site <site@exemplo.com>',
      to: ['clube@exemplo.com', 'jennifer@exemplo.com'],
      reply_to: 'maria@empresa.com.br',
      subject: 'Assunto',
      text: 'Texto',
      html: '<p>HTML</p>',
    });
  });

  it('throws with the status when Resend refuses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 422 })));
    const delivery = resolveDelivery({ apiKey: 'k', to: 'a@b.c', from: 'd@e.f', isDev: false })!;
    await expect(delivery.send(notification, options)).rejects.toEqual(new DeliveryError(422));
  });
});
