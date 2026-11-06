/**
 * Validation and normalisation for the membership application. Runs in the
 * browser (instant feedback) and again on the server (the authority), so the
 * rules can never drift apart. Returns locale-independent error codes; the UI
 * maps them to copy.
 */
import {
  FIELD_NAMES,
  MAX_LENGTH,
  OPTIONAL_FIELDS,
  SEGMENTS,
  type Application,
  type FieldErrorCode,
  type FieldErrors,
  type FieldName,
  type FormValues,
  type Segment,
} from './fields';

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_CHARS = /^[\d\s().+-]+$/;
const LINKEDIN = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/\S+$/i;

/** Reads the application fields from a form, trimming text values. */
export function readValues(data: FormData): FormValues {
  const values: FormValues = {};
  for (const name of FIELD_NAMES) {
    const raw = data.get(name);
    if (typeof raw === 'string') values[name] = raw.trim();
  }
  return values;
}

export interface ValidationOptions {
  /**
   * Treat numbers typed without a country code as Brazilian (+55). Off for the
   * English form, where a number like "415 555 0100" must not become Brazilian.
   */
  assumeBrazil?: boolean;
}

/** Brazilian numbers get +55; international numbers must start with + or 00. */
export function normalizePhone(raw: string, { assumeBrazil = true }: ValidationOptions = {}): string | null {
  if (!PHONE_CHARS.test(raw)) return null;
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+') || digits.startsWith('00')) {
    if (digits.startsWith('00')) digits = digits.slice(2);
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  if (!assumeBrazil) return null;
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return `+${digits}`;
  return null;
}

export function normalizeLinkedIn(raw: string): string | null {
  if (!LINKEDIN.test(raw)) return null;
  return `https://${raw.replace(/^https?:\/\//i, '')}`;
}

export function validateField(
  name: FieldName,
  values: FormValues,
  options: ValidationOptions = {},
): FieldErrorCode | undefined {
  const value = values[name] ?? '';

  if (name === 'consent') return value === 'on' ? undefined : 'required';

  if (name === 'segmentOther' && values.segment !== 'outro') return undefined;

  if (!value) return OPTIONAL_FIELDS.includes(name) ? undefined : 'required';

  const max = (MAX_LENGTH as Partial<Record<FieldName, number>>)[name];
  if (max !== undefined && value.length > max) return 'tooLong';

  switch (name) {
    case 'email':
      return EMAIL.test(value) ? undefined : 'invalid';
    case 'phone':
      return normalizePhone(value, options) ? undefined : 'invalid';
    case 'linkedin':
      return normalizeLinkedIn(value) ? undefined : 'invalid';
    case 'segment':
      return (SEGMENTS as readonly string[]).includes(value) ? undefined : 'required';
    default:
      return undefined;
  }
}

export type ValidationResult = { ok: true; application: Application } | { ok: false; errors: FieldErrors };

export function validateApplication(values: FormValues, options: ValidationOptions = {}): ValidationResult {
  const errors: FieldErrors = {};
  for (const name of FIELD_NAMES) {
    const error = validateField(name, values, options);
    if (error) errors[name] = error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const segment = values.segment as Segment;
  return {
    ok: true,
    application: {
      name: values.name!,
      email: values.email!,
      phone: normalizePhone(values.phone!, options)!,
      city: values.city!,
      linkedin: values.linkedin ? normalizeLinkedIn(values.linkedin)! : undefined,
      company: values.company!,
      role: values.role!,
      segment,
      segmentOther: segment === 'outro' ? values.segmentOther : undefined,
      about: values.about!,
      goals: values.goals!,
    },
  };
}
