import { ActionError, defineAction } from 'astro:actions';
import {
  APPLICATION_FROM_EMAIL,
  APPLICATION_TO_EMAIL,
  RESEND_API_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { getContent } from '@/i18n';
import { SOURCE_FIELDS, SPAM_FIELDS, type FieldErrors, type FormValues } from '@/lib/application/fields';
import { readValues, validateApplication } from '@/lib/application/validate';
import { buildNotification, type Source } from '@/lib/application/notification';
import { DeliveryError, resolveDelivery, type DeliveryMode } from '@/lib/application/delivery';
import { verifyTurnstile } from '@/lib/turnstile';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/config/site';

/** Applicant's language, as shown in the club's (Portuguese) e-mail. */
const APPLICANT_LANGUAGE: Record<Locale, string> = { 'pt-BR': 'Português', en: 'Inglês' };

/** Submissions faster than this after the page rendered are treated as bots. */
const MIN_FILL_MS = 3000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ApplyResult =
  | { status: 'ok'; name: string; mode: DeliveryMode }
  | { status: 'invalid'; errors: FieldErrors; values: FormValues };

/** Failure codes carried in ActionError.message; the UI maps them to copy. */
export type ApplyFailure = 'verification' | 'unavailable' | 'delivery';

export const server = {
  apply: defineAction({
    accept: 'form',
    handler: async (form, context): Promise<ApplyResult> => {
      const isDev = import.meta.env.DEV;

      // Bots get a normal-looking response and nothing is sent. People never
      // see this: the honeypot is invisible, and the timing trap only applies
      // to otherwise-valid submissions (a person with mistakes gets errors).
      const silentlyDrop: ApplyResult = { status: 'ok', name: '', mode: 'email' };

      // 1. Honeypot.
      if (form.get(SPAM_FIELDS.honeypot)) return silentlyDrop;

      // 2. Validate before verification, so a correctable mistake does not
      //    spend the single-use Turnstile token.
      // The form's language decides the phone rule; the club's e-mail is always pt-BR.
      const locale = isLocale(form.get('locale')) ? (form.get('locale') as Locale) : DEFAULT_LOCALE;
      const values = readValues(form);
      const result = validateApplication(values, {
        assumeBrazil: getContent(locale).application.assumeBrazilianPhone,
      });
      if (!result.ok) return { status: 'invalid', errors: result.errors, values };
      const application = result.application;

      // 3. A complete form filled faster than a person could is a bot.
      const startedAt = Number(form.get(SPAM_FIELDS.startedAt));
      if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return silentlyDrop;

      // 4. Spam protection. Fails closed in production when not configured.
      if (TURNSTILE_SECRET_KEY) {
        let remoteIp: string | undefined;
        try {
          remoteIp = context.clientAddress;
        } catch {
          remoteIp = undefined;
        }
        const token = String(form.get(SPAM_FIELDS.turnstile) ?? '');
        if (!(await verifyTurnstile(token, TURNSTILE_SECRET_KEY, remoteIp))) {
          throw new ActionError({ code: 'FORBIDDEN', message: 'verification' satisfies ApplyFailure });
        }
      } else if (!isDev) {
        console.error('[application] TURNSTILE_SECRET_KEY is not configured.');
        throw new ActionError({ code: 'SERVICE_UNAVAILABLE', message: 'unavailable' satisfies ApplyFailure });
      }

      // 5. Delivery.
      const delivery = resolveDelivery({
        apiKey: RESEND_API_KEY,
        to: APPLICATION_TO_EMAIL,
        from: APPLICATION_FROM_EMAIL,
        isDev,
      });
      if (!delivery) {
        console.error('[application] Resend delivery is not configured.');
        throw new ActionError({ code: 'SERVICE_UNAVAILABLE', message: 'unavailable' satisfies ApplyFailure });
      }

      const source: Source = {};
      for (const key of SOURCE_FIELDS) {
        const value = form.get(key);
        if (typeof value === 'string' && value) source[key] = value.slice(0, 100);
      }

      // One id per rendered form: retries and double submits are de-duplicated.
      const submissionId = String(form.get('submissionId') ?? '');
      const idempotencyKey = `application/${UUID.test(submissionId) ? submissionId : crypto.randomUUID()}`;

      const copy = getContent(DEFAULT_LOCALE).application;
      const notification = buildNotification(
        application,
        copy,
        source,
        new Date(),
        APPLICANT_LANGUAGE[locale],
      );

      try {
        await delivery.send(notification, { replyTo: application.email, idempotencyKey });
      } catch (error) {
        // Log the status only — never applicant data.
        const status = error instanceof DeliveryError ? error.status : 'network';
        console.error(`[application] Delivery failed (${status}).`);
        throw new ActionError({ code: 'BAD_GATEWAY', message: 'delivery' satisfies ApplyFailure });
      }

      return { status: 'ok', name: application.name.split(/\s+/)[0], mode: delivery.mode };
    },
  }),
};
