/**
 * Where applications go. Resend when configured; in development without
 * configuration, the terminal. In production without configuration there is
 * no delivery at all and the action reports an error — it never pretends.
 */
import type { Notification } from './notification';

export type DeliveryMode = 'email' | 'dev';

export interface Delivery {
  mode: DeliveryMode;
  send(notification: Notification, options: { replyTo: string; idempotencyKey: string }): Promise<void>;
}

export class DeliveryError extends Error {
  constructor(readonly status: number) {
    super(`Delivery failed with status ${status}`);
  }
}

interface DeliveryConfig {
  apiKey?: string;
  to?: string;
  from?: string;
  isDev: boolean;
}

export function resolveDelivery({ apiKey, to, from, isDev }: DeliveryConfig): Delivery | null {
  if (apiKey && to && from) return resendDelivery(apiKey, to, from);
  return isDev ? devDelivery : null;
}

function resendDelivery(apiKey: string, to: string, from: string): Delivery {
  const recipients = to
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  return {
    mode: 'email',
    async send(notification, { replyTo, idempotencyKey }) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'jc-business-club-website/1.0',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          from,
          to: recipients,
          reply_to: replyTo,
          subject: notification.subject,
          text: notification.text,
          html: notification.html,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new DeliveryError(response.status);
    },
  };
}

const devDelivery: Delivery = {
  mode: 'dev',
  async send(notification) {
    console.info(
      `\n[application] Development mode — not sent.\n${notification.subject}\n\n${notification.text}\n`,
    );
  },
};
