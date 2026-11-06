import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstile } from '@/lib/turnstile';

afterEach(() => vi.unstubAllGlobals());

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('verifyTurnstile', () => {
  it('rejects a missing or oversized token without calling Cloudflare', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await verifyTurnstile('', 'secret')).toBe(false);
    expect(await verifyTurnstile('x'.repeat(2049), 'secret')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts only an explicit success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ success: true })));
    expect(await verifyTurnstile('token', 'secret')).toBe(true);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ success: false })));
    expect(await verifyTurnstile('token', 'secret')).toBe(false);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({}, 500)));
    expect(await verifyTurnstile('token', 'secret')).toBe(false);
  });

  it('fails closed on network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await verifyTurnstile('token', 'secret')).toBe(false);
  });

  it('sends the secret, token and visitor IP', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply({ success: true }));
    vi.stubGlobal('fetch', fetchMock);
    await verifyTurnstile('token', 'secret', '203.0.113.7');
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(Object.fromEntries(body)).toEqual({
      secret: 'secret',
      response: 'token',
      remoteip: '203.0.113.7',
    });
  });
});
