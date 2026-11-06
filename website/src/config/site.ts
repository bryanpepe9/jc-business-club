/**
 * Non-localized site settings: locales, per-locale routes, contact channels.
 *
 * Contact channels and social profiles are intentionally empty until the
 * owner supplies them. Blocks that depend on them do not render while empty.
 */

export const LOCALES = ['pt-BR', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const isLocale = (value: unknown): value is Locale => (LOCALES as readonly unknown[]).includes(value);

/** Pages that exist in every language, keyed so each can find its translation. */
export type PageKey = 'home' | 'apply' | 'privacy';

export const localizedRoutes: Record<Locale, Record<PageKey, string>> = {
  'pt-BR': { home: '/', apply: '/solicitar-participacao', privacy: '/privacidade' },
  en: { home: '/en', apply: '/en/apply', privacy: '/en/privacy' },
};

/** Each language is named in its own language. */
export const LANGUAGE_NAMES: Record<Locale, { short: string; name: string }> = {
  'pt-BR': { short: 'PT', name: 'Português' },
  en: { short: 'EN', name: 'English' },
};

export interface ContactChannels {
  email?: string;
  /** E.164 format, e.g. +5511999999999 */
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
}

export const contact: ContactChannels = {};

export const hasContact = Object.values(contact).some(Boolean);
