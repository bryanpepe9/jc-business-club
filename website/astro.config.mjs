// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Production address. Override with SITE_URL (e.g. for a preview domain).
const site = process.env.SITE_URL ?? 'https://clube.jccapital.com.br';

/** @param {string} pkg @param {string} file */
const fontFile = (pkg, file) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

/**
 * Dev-only routes (the style guide) are injected here so they never ship
 * in a production build.
 * @returns {import('astro').AstroIntegration}
 */
const devRoutes = () => ({
  name: 'jc:dev-routes',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/styleguide', entrypoint: './src/dev/styleguide.astro' });
    },
  },
});

export default defineConfig({
  site,
  // One URL per page (no trailing slash) so canonical links, the sitemap and
  // Vercel's static file serving all agree.
  trailingSlash: 'never',
  // CSS is small (~12 KB gzipped); inlining it removes render-blocking requests.
  build: { format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },

  // Pages are prerendered; only the application pages and the form action
  // run on demand (Vercel Functions). Images are optimised at build time.
  adapter: vercel(),
  session: false,

  env: {
    schema: {
      // Application delivery (Resend). Read at runtime on the server only.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      APPLICATION_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      APPLICATION_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Spam protection (Cloudflare Turnstile).
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  i18n: {
    // Portuguese at the root, English under /en.
    locales: ['pt-BR', 'en'],
    defaultLocale: 'pt-BR',
    routing: { prefixDefaultLocale: false },
  },

  fonts: [
    {
      // Display serif: headlines, quote, numerals, price.
      // Optical-size axis file so large settings use the refined display cut.
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          {
            src: [fontFile('newsreader', 'newsreader-latin-opsz-normal.woff2')],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
    {
      // Text and UI sans.
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [fontFile('inter', 'inter-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],

  image: {
    // Layout styles are authored in our own CSS.
    responsiveStyles: false,
  },

  integrations: [sitemap({ filter: (page) => !page.includes('/404') }), devRoutes()],
});
