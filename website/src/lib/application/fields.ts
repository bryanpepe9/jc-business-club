/**
 * Membership application: field definitions shared by the browser and the
 * server. Keep this module dependency-free — it is bundled into the page.
 */

export const SEGMENTS = ['imobiliario', 'hospitalidade', 'agronegocio', 'investimentos', 'outro'] as const;
export type Segment = (typeof SEGMENTS)[number];

export const FIELD_NAMES = [
  'name',
  'email',
  'phone',
  'city',
  'linkedin',
  'company',
  'role',
  'segment',
  'segmentOther',
  'about',
  'goals',
  'consent',
] as const;
export type FieldName = (typeof FIELD_NAMES)[number];

/** Character limits, mirrored in the inputs' `maxlength` attributes. */
export const MAX_LENGTH = {
  name: 120,
  email: 254,
  phone: 32,
  city: 120,
  linkedin: 200,
  company: 120,
  role: 120,
  segmentOther: 80,
  about: 600,
  goals: 600,
} as const satisfies Partial<Record<FieldName, number>>;

export const OPTIONAL_FIELDS: readonly FieldName[] = ['linkedin'];

export type FieldErrorCode = 'required' | 'invalid' | 'tooLong';
export type FieldErrors = Partial<Record<FieldName, FieldErrorCode>>;
export type FormValues = Partial<Record<FieldName, string>>;

/** A validated, normalised application. */
export interface Application {
  name: string;
  email: string;
  /** E.164, e.g. +5511912345678 */
  phone: string;
  city: string;
  linkedin?: string;
  company: string;
  role: string;
  segment: Segment;
  segmentOther?: string;
  about: string;
  goals: string;
}

/** Hidden, non-user fields posted with the form. */
export const SPAM_FIELDS = {
  honeypot: 'website',
  startedAt: 'startedAt',
  turnstile: 'cf-turnstile-response',
} as const;

export const SOURCE_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
