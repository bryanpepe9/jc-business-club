/**
 * Cloudflare Turnstile server-side verification.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  // Tokens are at most 2048 characters and single-use.
  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
