import { DEFAULT_LOCALE, isLocale, type Locale } from '@/config/site';
import { ptBR } from './pt-BR';
import { en } from './en';
import type { SiteContent } from './types';

const locales = { 'pt-BR': ptBR, en } satisfies Record<Locale, SiteContent>;

export function getContent(locale: string | undefined = DEFAULT_LOCALE): SiteContent {
  return locales[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

export type { SiteContent } from './types';
