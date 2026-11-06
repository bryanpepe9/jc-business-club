/**
 * Resolves validation error codes to final copy. Used to render errors on the
 * server and serialised (as plain strings) for the browser.
 */
import type { SiteContent } from '@/i18n/types';
import { FIELD_NAMES, MAX_LENGTH, type FieldErrorCode, type FieldName } from './fields';

export type FieldMessages = Record<FieldName, Record<FieldErrorCode, string>>;

export function buildFieldMessages(copy: SiteContent['application']): FieldMessages {
  const messages = {} as FieldMessages;
  for (const name of FIELD_NAMES) {
    const errors = name === 'consent' ? copy.consent.errors : copy.fields[name].errors;
    const max = (MAX_LENGTH as Partial<Record<FieldName, number>>)[name];
    const required = errors.required ?? errors.invalid ?? '';
    messages[name] = {
      required,
      invalid: errors.invalid ?? required,
      tooLong: (errors.tooLong ?? copy.tooLong).replace('{max}', String(max ?? '')),
    };
  }
  return messages;
}
