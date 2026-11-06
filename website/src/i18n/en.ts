import type { SiteContent } from './types';
import { localizedRoutes } from '@/config/site';

const routes = localizedRoutes.en;

/**
 * Public copy — English.
 *
 * A translation of pt-BR.ts (which follows the official presentation). Same
 * facts, no additions. Press headlines are not translated. Pending owner review.
 */
export const en: SiteContent = {
  locale: 'en',
  routes,

  meta: {
    title: 'JC Business Club — Connections that drive business',
    description:
      'A selected network of entrepreneurs, investors and leaders. Two in-person breakfasts a month, no lectures: relationships, opportunities and business.',
    ogImageAlt: 'JC Business Club — Connections that drive business.',
  },

  brand: {
    name: 'JC Business Club',
    wordmark: 'JC BUSINESS CLUB',
    tagline: 'Connections that drive business.', // approved by owner
    pillars: ['Relationships', 'Opportunities', 'Business'],
    closingLine: 'Great business begins with great connections.',
  },

  a11y: {
    skipLink: 'Skip to content',
    homeLink: 'JC Business Club — home',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menu: 'Menu',
    footerNav: 'Footer navigation',
    newTab: '(opens in a new tab)',
    languageNav: 'Language',
  },

  nav: {
    items: [
      { label: 'The club', href: `${routes.home}#the-club` },
      { label: 'The experience', href: `${routes.home}#experience` },
      { label: 'Who it’s for', href: `${routes.home}#who-its-for` },
      { label: 'Track record', href: `${routes.home}#track-record` },
      { label: 'Jennifer Chen', href: `${routes.home}#jennifer-chen` },
      { label: 'Founding member', href: `${routes.home}#founding-member` },
    ],
    cta: { label: 'Apply for membership', href: routes.apply },
  },

  hero: {
    title: 'Connections that drive business.',
    lead: 'A private, selected network that brings together entrepreneurs, investors and leaders to build relationships and business opportunities.',
    primaryCta: { label: 'Apply to join', href: routes.apply },
    secondaryCta: { label: 'Discover the club', href: '#the-club' },
    facts: ['2 breakfasts a month', 'In-person meetings', 'No lectures or presentations'],
    photo: {
      alt: 'Business people seated side by side at a table, following the conversation at a business meeting.',
    },
  },

  club: {
    intro: { id: 'the-club', index: '01', label: 'The club' },
    title: 'Why we created the club',
    body: [
      'After many business rounds and editions of the JC Business Forum, Jennifer Chen saw the need for recurring meetings that keep the opportunities that arise moving forward.',
      'The club connects complementary business fronts, expands cross-selling and follows projects from start to finish.',
    ],
    principles: [
      {
        title: 'Complementary fronts',
        text: 'Business areas that complement each other, brought together in the same room.',
      },
      {
        title: 'Cross-selling',
        text: 'More business opportunities among the participants themselves.',
      },
      {
        title: 'Continuity',
        text: 'Projects followed from start to finish, meeting after meeting.',
      },
    ],
  },

  experience: {
    intro: { id: 'experience', index: '02', label: 'The experience' },
    numeral: '2',
    title: 'breakfasts a month',
    body: 'In-person meetings of about four hours, in a private and welcoming setting, with time for good conversation, exchanging experience and developing opportunities.',
    details: [
      { term: 'Format', description: 'In person' },
      { term: 'Duration', description: 'About four hours' },
      { term: 'Setting', description: 'Private and welcoming' },
    ],
    statement: ['No lectures or presentations.', 'Closer relationships, continuity and business.'],
    photo: {
      alt: 'Executives talking while standing in a bright corporate space.',
    },
  },

  audience: {
    intro: { id: 'who-its-for', index: '03', label: 'Who it’s for' },
    roles: ['Entrepreneurs', 'Investors', 'Executives', 'Leaders'],
    body: 'A selected network that brings together complementary profiles, shared interests and the capacity to create opportunities and make business happen.',
    sectors: {
      label: 'Initial sectors',
      items: ['Real estate', 'Hospitality', 'Agribusiness', 'Investments'],
      note: 'Initial areas of experience and activity, open to complementary businesses.',
    },
    photo: {
      alt: 'Executives seated side by side at a meeting table.',
    },
  },

  benefits: {
    intro: { id: 'what-members-find', index: '04', label: 'Benefits' },
    title: 'What members find',
    items: [
      {
        title: 'A selected network',
        text: 'Relationships with entrepreneurs, investors and leaders.',
      },
      {
        title: 'Strategic connections',
        text: 'Introductions to potential partners and investors.',
      },
      {
        title: 'Opportunities',
        text: 'Sharing of business, projects and collaboration possibilities.',
      },
      {
        title: 'Exclusive meetings',
        text: 'Two breakfasts a month, curated and close-knit.',
      },
    ],
  },

  track: {
    intro: { id: 'track-record', index: '05', label: 'Track record' },
    title: 'A track record that already creates connections.',
    lead: 'Events held with entrepreneurs, investors and representatives from different sectors.',
    caption: 'Meetings that bring people, projects and opportunities together.',
    galleryLabel: 'Gallery of past events',
    photos: [
      { alt: 'Participants shaking hands in front of the opening screen of a business event.' },
      { alt: 'An attentive audience at an event with entrepreneurs and investors.' },
      { alt: 'Participants seated at U-shaped tables in a large room.' },
      { alt: 'Participants at the table during a business meeting in a restaurant.' },
      { alt: 'A meeting in a corporate room, with participants around a large table.' },
    ],
  },

  press: {
    title: 'In the media',
    lead: 'Our work in business rounds and in connecting projects with investors has been featured in several outlets.',
    readLabel: 'Read the article (in Portuguese)',
    // Headlines stay in Portuguese. Items with a verified `url` render as links;
    // the deck's mentions show as text until their links are confirmed.
    items: [
      {
        outlet: 'Notícias Agrícolas',
        headline:
          'Conversa de Cerca Podcast #145 – Evento foca em conectar investidores a projetos do agronegócio e pode ser modelo para superar momentos de crise',
        url: 'https://www.noticiasagricolas.com.br/videos/agronegocio/387845-conversa-de-cerca-podcast-145-evento-foca-em-conectar-investidores-a-projetos-do-agronegocio-e-pode-ser-modelo-para-superar-momentos-de-crise.html',
        date: '2024-10-30',
        lang: 'pt-BR',
      },
      {
        outlet: 'Gazeta da Semana',
        headline:
          'Crescimento nos mercados imobiliário e turístico no Brasil abrem oportunidades para investimentos',
        url: 'https://gazetadasemana.com.br/noticia/192384/crescimento-nos-mercados-imobiliario-e-turistico-no-brasil-abrem-oportunidades-para-investimentos',
        date: '2024-09-24',
        lang: 'pt-BR',
      },
      {
        outlet: 'Brasil Inovador',
        headline: 'Road Shows: modelo atrai atenção de investidores no Brasil',
        url: 'https://brasilinovador.com.br/road-shows-modelo-esta-sendo-adaptado-para-o-mercado-brasileiro-e-atrai-atencao-de-investidores/',
        date: '2024-06-08',
        lang: 'pt-BR',
      },
      {
        outlet: 'AgFeed',
        headline: 'Nascida no mundo da moda, JC Capital vai até a Arábia buscar investidores para o agro',
        url: 'https://agfeed.com.br/financas/nascida-no-mundo-da-moda-jc-capital-vai-ate-a-arabia-buscar-investidores-para-o-agro',
        date: '2024-02-05',
        lang: 'pt-BR',
      },
      {
        outlet: 'Gazeta da Semana',
        headline: 'Elementos para uma rodada de negócios de sucesso',
        lang: 'pt-BR',
      },
      {
        outlet: 'Turismo em Foco',
        headline: 'Mercado imobiliário e turístico: oportunidades para investimentos',
        lang: 'pt-BR',
      },
      {
        outlet: 'Agromais / UOL',
        headline: 'Projetos promissores do agronegócio conectados a investidores',
        lang: 'pt-BR',
      },
      {
        outlet: 'MT Agora',
        headline: 'Grandes players do agronegócio e investidores em São Paulo',
        lang: 'pt-BR',
      },
    ],
  },

  founder: {
    intro: { id: 'jennifer-chen', index: '06', label: 'Founder' },
    name: 'Jennifer Chen',
    role: 'Founder of JC Business Club',
    // Translation of the deck quote — pending Jennifer's approval.
    quote:
      'When we bring the right people to the table, projects move forward with greater ease and confidence for everyone.',
  },

  membership: {
    intro: { id: 'founding-member', index: '07', label: 'Founding member' },
    title: 'Join the first group of JC Business Club.',
    price: {
      label: 'Monthly fee',
      // Billed in reais; the dollar figure is a guide for international readers.
      amount: 'R$ 990',
      period: '/month',
      spoken: '990 Brazilian reais per month, about 180 US dollars',
      approx: 'About US$ 180 per month',
    },
    inclusions: [
      '2 breakfasts a month',
      'In-person meetings of about four hours',
      'Relationships with entrepreneurs, investors and leaders',
      'Introductions to potential partners and investors',
    ],
    statement: 'A network built on curation, trust and the purpose of generating business.',
    cta: { label: 'Apply for membership', href: routes.apply },
  },

  closing: {
    statement: 'Great business begins with great connections.',
    cta: { label: 'Apply for membership', href: routes.apply },
  },

  application: {
    assumeBrazilianPhone: false,
    turnstileLanguage: 'en',
    meta: {
      title: 'Apply for membership',
      description:
        'Apply to become a founding member of JC Business Club: two in-person breakfasts a month with entrepreneurs, investors and leaders.',
    },
    eyebrow: 'Founding member',
    title: 'Apply for membership',
    intro:
      'Tell us a little about yourself and your company. We will use this information to get to know your profile and get in touch.',
    summaryNote: 'No payment is requested on this form.',
    requiredNote: 'All fields are required unless marked optional.',
    optionalLabel: 'optional',
    fieldsets: { about: 'About you', company: 'Your company', participation: 'Your membership' },
    fields: {
      name: { label: 'Full name', errors: { required: 'Enter your full name.' } },
      email: {
        label: 'Email',
        errors: { required: 'Enter your email.', invalid: 'Enter a valid email, like name@company.com.' },
      },
      phone: {
        label: 'WhatsApp',
        hint: 'Include the country code, starting with + (for example +1 or +55).',
        errors: {
          required: 'Enter your WhatsApp number.',
          invalid: 'Enter the number with its country code, like +1 415 555 0100 or +55 11 91234-5678.',
        },
      },
      city: {
        label: 'City / Country',
        hint: 'For example: São Paulo, Brazil.',
        errors: { required: 'Enter your city and country.' },
      },
      linkedin: {
        label: 'LinkedIn',
        hint: 'Your profile address, like linkedin.com/in/your-name.',
        errors: { invalid: 'Enter a LinkedIn profile address, like linkedin.com/in/your-name.' },
      },
      company: { label: 'Company', errors: { required: 'Enter your company name.' } },
      role: { label: 'Job title', errors: { required: 'Enter your job title.' } },
      segment: { label: 'Sector', errors: { required: 'Select your company’s sector.' } },
      segmentOther: {
        label: 'Which sector?',
        hint: 'Fill in if you chose “Other”.',
        errors: { required: 'Enter your company’s sector.' },
      },
      about: {
        label: 'Tell us briefly about your company',
        hint: 'Field of activity, size and current stage.',
        errors: { required: 'Tell us briefly about your company.' },
      },
      goals: {
        label: 'What are you looking for in JC Business Club?',
        hint: 'Connections, partnerships, investors, business opportunities…',
        errors: { required: 'Tell us what you are looking for in the club.' },
      },
    },
    segmentPlaceholder: 'Select',
    segmentOptions: {
      imobiliario: 'Real estate',
      hospitalidade: 'Hospitality',
      agronegocio: 'Agribusiness',
      investimentos: 'Investments',
      outro: 'Other',
    },
    consent: {
      before: 'I have read and agree to the ',
      link: 'Privacy Policy',
      after: '.',
      notice: 'Your data will be used only to review your application and contact you.',
      errors: { required: 'To submit, you need to agree to the Privacy Policy.' },
    },
    counter: '{count} of {max} characters',
    tooLong: 'Use no more than {max} characters.',
    errorPrefix: 'Error:',
    errorSummary: 'Review the highlighted fields to submit:',
    submit: 'Submit application',
    submitting: 'Submitting…',
    verificationPending: 'Wait for the security check to finish, then submit again.',
    noscript:
      'To submit the form, enable JavaScript in your browser. It is used for the anti-spam security check.',
    failures: {
      verification: 'We couldn’t complete the security check. Refresh the page and try again.',
      unavailable: 'Applications are temporarily unavailable. Try again later.',
      delivery: 'We couldn’t send your application right now. Try again in a few minutes.',
      network: 'Couldn’t connect. Check your internet connection and try again.',
    },
    success: {
      title: 'Application received',
      greeting: 'Thank you, {name}.',
      body: 'We have received your details and will be in touch.',
      devNotice: 'Development mode: nothing was sent. The application was only logged in the terminal.',
      back: { label: 'Back to the home page', href: routes.home },
    },
    devBanner:
      'Development mode — email delivery is not configured. Applications only appear in the terminal.',
    honeypotLabel: 'Leave this field empty',
  },

  // DRAFT translation of the Portuguese draft, pending legal review.
  privacy: {
    meta: {
      title: 'Privacy policy',
      description: 'How JC Business Club handles the personal data submitted through its website.',
    },
    title: 'Privacy policy',
    updated: '2026-11-01',
    updatedLabel: 'Last updated',
    intro:
      'This policy explains what personal data the JC Business Club website collects, what it is used for and what your rights are, in accordance with Brazil’s General Data Protection Law (Law No. 13,709/2018 — LGPD).',
    sections: [
      {
        title: 'Data we collect',
        paragraphs: [
          'When you submit the membership application form, we collect the information you provide:',
        ],
        list: [
          'full name, email, WhatsApp number, city and country;',
          'LinkedIn profile, if provided;',
          'company, job title and sector;',
          'what you write about your company and what you are looking for in the club;',
          'campaign parameters from the link you used (such as utm_source), when present.',
        ],
      },
      {
        title: 'Technical data',
        paragraphs: [
          'To protect the form against spam, the security check may process technical data about your visit, such as your IP address and browser information.',
        ],
      },
      {
        title: 'How we use your data',
        list: [
          'to review your membership application;',
          'to contact you about JC Business Club;',
          'to protect the form against spam and abuse.',
        ],
        note: 'We do not use your data for advertising and we do not sell it.',
      },
      {
        title: 'Legal bases',
        paragraphs: [
          'We process your data based on your consent, given when you submit the form (LGPD art. 7, I), and for preliminary steps related to your possible membership, at your request (art. 7, V). The spam check is based on our legitimate interest in keeping the website secure (art. 7, IX).',
        ],
      },
      {
        title: 'Who we share it with',
        paragraphs: ['To run the website, we rely on service providers that process data on our behalf:'],
        list: [
          'Vercel — website hosting;',
          'Cloudflare — the form’s security check (Turnstile);',
          'Resend — delivery by email of the applications received to the club’s team.',
        ],
      },
      {
        title: 'International transfers',
        paragraphs: [
          'These providers may process data outside Brazil. In those cases, the transfer follows the conditions set out in the LGPD.',
        ],
      },
      {
        title: 'How long we keep it',
        paragraphs: [
          'We keep your data for as long as needed to review your application and manage our relationship with you, or while a legal obligation applies. You can ask for it to be deleted at any time.',
        ],
      },
      {
        title: 'Cookies',
        paragraphs: [
          'This website does not use advertising or tracking cookies. The form’s security check uses only technical resources needed for it to work.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: ['Under LGPD art. 18, you can request:'],
        list: [
          'confirmation that your data is processed, and access to it;',
          'correction of incomplete, inaccurate or outdated data;',
          'anonymization, blocking or deletion of unnecessary data or data processed in breach of the law;',
          'data portability;',
          'deletion of data processed based on consent;',
          'information about who we share your data with;',
          'withdrawal of consent.',
        ],
      },
      {
        title: 'Changes to this policy',
        paragraphs: [
          'We may update this policy. The date of the latest revision appears at the top of the page.',
        ],
      },
    ],
    draftNotice:
      'Draft for legal review (visible in development only). Missing the data controller’s details — legal name, CNPJ and the contact for data requests — and validation of the text.',
  },

  notFound: {
    title: 'Page not found',
    body: 'The address may have changed or may no longer exist.',
    back: { label: 'Back to the home page', href: routes.home },
  },

  footer: {
    tagline: 'Connections that drive business.',
    legal: [{ label: 'Privacy policy', href: routes.privacy }],
    copyright: `© ${new Date().getFullYear()} JC Business Club`,
  },
};
