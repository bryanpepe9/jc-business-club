import type { FieldErrorCode, FieldName, Segment } from '@/lib/application/fields';
import type { Locale, PageKey } from '@/config/site';

/**
 * Shape of all public copy. Every locale file (pt-BR today, en later) must
 * satisfy this type, so a translation cannot silently miss a section.
 *
 * Optional fields hold information that is NOT yet confirmed by the owner.
 * Leave them undefined and the corresponding block does not render — no
 * placeholder ever reaches the public page.
 */

export interface Link {
  label: string;
  href: string;
}

export interface SectionIntro {
  /** Anchor id used by the navigation. */
  id: string;
  /** Editorial index, e.g. "01". */
  index: string;
  /** Short section label, e.g. "O clube". */
  label: string;
}

export interface PhotoCopy {
  /** Describes what is visible. Never names or implies who the people are. */
  alt: string;
}

export interface FieldCopy {
  label: string;
  hint?: string;
  placeholder?: string;
  /** Field-specific messages; `tooLong` falls back to the shared message. */
  errors: Partial<Record<FieldErrorCode, string>>;
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Rendered after the list. */
  note?: string;
}

export interface PressItem {
  outlet: string;
  headline: string;
  /** Required for the item to render. Must be a verified article URL. */
  url?: string;
  /** ISO date, shown when present. */
  date?: string;
  /** Language of the headline when it differs from the page (never translated). */
  lang?: string;
}

export interface SiteContent {
  locale: Locale;
  /** This locale's URL for each page. */
  routes: Record<PageKey, string>;

  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
  };

  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    pillars: string[];
    closingLine: string;
  };

  a11y: {
    skipLink: string;
    homeLink: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    footerNav: string;
    newTab: string;
    languageNav: string;
  };

  nav: {
    items: Link[];
    cta: Link;
  };

  hero: {
    title: string;
    lead: string;
    primaryCta: Link;
    secondaryCta: Link;
    facts: string[];
    photo: PhotoCopy;
  };

  club: {
    intro: SectionIntro;
    title: string;
    body: string[];
    principles: { title: string; text: string }[];
  };

  experience: {
    intro: SectionIntro;
    numeral: string;
    title: string;
    body: string;
    details: { term: string; description: string }[];
    statement: string[];
    photo: PhotoCopy;
  };

  audience: {
    intro: SectionIntro;
    roles: string[];
    body: string;
    sectors: {
      label: string;
      items: string[];
      note: string;
    };
    photo: PhotoCopy;
  };

  benefits: {
    intro: SectionIntro;
    title: string;
    items: { title: string; text: string }[];
  };

  track: {
    intro: SectionIntro;
    title: string;
    lead: string;
    caption: string;
    photos: PhotoCopy[];
    galleryLabel: string;
  };

  press: {
    title: string;
    lead: string;
    readLabel: string;
    items: PressItem[];
  };

  founder: {
    intro: SectionIntro;
    name: string;
    role: string;
    /** Pending owner confirmation (e.g. "Founder & CEO, JC Capital"). */
    affiliation?: Link | string;
    /** Pending: approved biography paragraphs. */
    bio?: string[];
    quote: string;
    /** Pending: approved headshot. */
    photo?: PhotoCopy;
  };

  membership: {
    intro: SectionIntro;
    title: string;
    price: {
      label: string;
      amount: string;
      period: string;
      /** Full spoken form for screen readers, e.g. "990 reais por mês". */
      spoken: string;
    };
    inclusions: string[];
    statement: string;
    cta: Link;
    /** Pending owner confirmation of the selection process. */
    selectionNote?: string;
  };

  closing: {
    statement: string;
    cta: Link;
  };

  application: {
    meta: { title: string; description: string };
    /** Whether phone numbers typed without a country code are taken as Brazilian. */
    assumeBrazilianPhone: boolean;
    /** Language code for the Turnstile widget. */
    turnstileLanguage: string;
    eyebrow: string;
    title: string;
    intro: string;
    summaryNote: string;
    requiredNote: string;
    optionalLabel: string;
    fieldsets: { about: string; company: string; participation: string };
    fields: Record<Exclude<FieldName, 'consent'>, FieldCopy>;
    segmentPlaceholder: string;
    segmentOptions: Record<Segment, string>;
    consent: {
      before: string;
      link: string;
      after: string;
      notice: string;
      errors: Partial<Record<FieldErrorCode, string>>;
    };
    counter: string;
    tooLong: string;
    /** Screen-reader prefix announced before each error message. */
    errorPrefix: string;
    errorSummary: string;
    submit: string;
    submitting: string;
    verificationPending: string;
    noscript: string;
    failures: {
      verification: string;
      unavailable: string;
      delivery: string;
      network: string;
    };
    success: {
      title: string;
      /** Shown only when the first name is known. */
      greeting: string;
      body: string;
      devNotice: string;
      back: Link;
    };
    devBanner: string;
    honeypotLabel: string;
  };

  privacy: {
    meta: { title: string; description: string };
    title: string;
    /** ISO date of the last revision. */
    updated: string;
    updatedLabel: string;
    intro: string;
    sections: LegalSection[];
    /** Pending: data controller details (legal name, CNPJ, contact). */
    controller?: LegalSection;
    draftNotice: string;
  };

  notFound: {
    title: string;
    body: string;
    back: Link;
    /** Shown on the default 404 (served for every missing address, any language). */
    otherLanguage?: Link & { lang: string };
  };

  footer: {
    tagline: string;
    /** Pending owner approval of geographic wording. */
    location?: string;
    legal: Link[];
    copyright: string;
  };
}
