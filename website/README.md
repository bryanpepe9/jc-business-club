# JC Business Club — website

Marketing and membership-application site for JC Business Club. Built with
[Astro](https://astro.build) 7, TypeScript and hand-written CSS, deployed to
Cloudflare Workers. Public copy is in Brazilian Portuguese and English.

> Status: Phases 1–5 of the build plan complete (foundation, design system,
> home page, application form, QA). Not production-ready until the launch
> items below are resolved: delivery credentials, domain, legal review of the
> privacy policy and asset approvals.

## Requirements

- Node.js **22.23.4 or newer** (Astro 7). The repo pins Node 24 LTS in `.nvmrc`:
  ```bash
  nvm use
  ```

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

The dev server also serves a style guide at `/styleguide` (dev only — never
included in production builds).

## Scripts

| Command            | What it does                                                |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Local dev server (runs server code in Cloudflare's runtime) |
| `npm run build`    | Production build to `dist/`                                 |
| `npm run preview`  | Serve the production build locally (Cloudflare runtime)     |
| `npm run check`    | Type-check Astro and TypeScript files                       |
| `npm run lint`     | ESLint, including accessibility rules                       |
| `npm run format`   | Format with Prettier                                        |
| `npm run test`     | Unit tests (Vitest)                                         |
| `npm run test:e2e` | End-to-end + accessibility tests (Playwright, axe)          |
| `npm run verify`   | Format check, lint, type check, unit tests and build        |
| `npm run images`   | Re-generate cropped and graded photos (see below)           |

## Pages

| Route                     | Rendering | Notes                                          |
| ------------------------- | --------- | ---------------------------------------------- |
| `/`                       | Static    | Home                                           |
| `/solicitar-participacao` | On demand | Application form; never cached (`no-store`)    |
| `/privacidade`            | Static    | Privacy policy (**draft, needs legal review**) |
| `404`                     | Static    | Not found                                      |

## Membership application

The form posts to an [Astro Action](https://docs.astro.build/en/guides/actions/)
(`src/actions/index.ts`) running on Cloudflare Workers.

- **Validation** lives in `src/lib/application/validate.ts` and runs identically
  in the browser (instant feedback) and on the server (the authority). Error
  codes map to copy in `src/i18n/pt-BR.ts`.
- **Works without JavaScript**: the form posts natively and the server renders
  errors or the confirmation. With JavaScript it submits without reloading and
  manages focus (error summary, alerts, confirmation).
- **Spam protection**: Cloudflare Turnstile (verified server-side), a honeypot
  field, a minimum fill time, and Astro's cross-site POST protection. Add a
  Cloudflare WAF rate-limiting rule for `/_actions/apply` and
  `/solicitar-participacao` before launch.
- **Delivery**: one e-mail per application via [Resend](https://resend.com),
  sent to the club with `Reply-To` set to the applicant. Each rendered form has
  a submission id used as Resend's `Idempotency-Key`, so retries and double
  submits never send twice.
- **No data is stored** by the site: not in a database, not in the browser, and
  applicant data is never written to logs.

### Delivery modes — it never pretends

| Situation                                      | Result                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Dev, no credentials                            | Submission printed to the terminal; the page says clearly that nothing was sent.   |
| Credentials configured                         | E-mail sent through Resend.                                                        |
| Production, Resend or Turnstile not configured | Submission refused (HTTP 503) and the visitor sees "temporariamente indisponível". |
| Turnstile check fails                          | Refused (HTTP 403) with a message to refresh and retry.                            |
| Resend error                                   | Refused (HTTP 502) with a message to try again; values are kept.                   |

### Configuration

| Variable                    | Where                       | Purpose                                                             |
| --------------------------- | --------------------------- | ------------------------------------------------------------------- |
| `SITE_URL`                  | build environment / `.env`  | Absolute site URL (canonical, Open Graph, sitemap)                  |
| `PUBLIC_TURNSTILE_SITE_KEY` | build environment / `.env`  | Turnstile site key (public, embedded at build time)                 |
| `TURNSTILE_SECRET_KEY`      | Worker secret / `.dev.vars` | Turnstile secret                                                    |
| `RESEND_API_KEY`            | Worker secret / `.dev.vars` | Resend API key                                                      |
| `APPLICATION_TO_EMAIL`      | Worker secret / `.dev.vars` | Recipient(s); comma-separate several                                |
| `APPLICATION_FROM_EMAIL`    | Worker secret / `.dev.vars` | Sender, e.g. `JC Business Club <site@yourdomain>` (verified domain) |

Copy `.env.example` → `.env` and `.dev.vars.example` → `.dev.vars` for local
work (both are git-ignored). Production builds also read `.env.production`
(git-ignored), which holds the real Turnstile site key. Local development keeps
using test mode: the production site key only works on the domains configured
for the widget in Cloudflare. To exercise Turnstile locally, use Cloudflare's
[test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/):
site key `1x00000000000000000000AA` with secret
`1x0000000000000000000000000000000AA` (always passes), or secret
`2x0000000000000000000000000000000AA` (always fails). Restart the dev server
after changing these files.

## Testing and quality

```bash
npm run verify     # format, lint, type check, unit tests, production build
npm run test:e2e   # starts the dev server if needed; uses your installed Google Chrome
```

- **Unit tests** (`tests/unit`, 43 tests): validation and normalisation rules,
  error copy coverage, e-mail escaping and header-injection safety, delivery
  modes and the exact Resend request, Turnstile verification failing closed.
- **End-to-end** (`tests/e2e`, desktop + mobile): navigation anchors, skip
  link, mobile menu (focus, Escape, navigation), no horizontal overflow from
  320px to 1440px, the full application flow with and without JavaScript,
  delivery/network/unavailable failures, internal links and anchors.
- **Accessibility**: axe scans for WCAG 2.2 AA on every page, the form error
  state and the open mobile menu — zero violations.
- **Performance** (Lighthouse, mobile, simulated slow 4G, brotli like
  Cloudflare): home 98 · accessibility 100 · best practices 100 · SEO 100;
  LCP 2.5 s, CLS 0, TBT 0 ms. Application and privacy pages: 100 across the
  board. To re-run against the production build:
  ```bash
  npm run build && npx astro preview --port 4322
  npx lighthouse http://localhost:4322/ --view
  npx astro preview stop
  ```
  (The local preview does not compress responses, so its scores are slightly
  lower than production.)
- **Content audit**: `docs/content-audit.md` traces every public statement to
  the presentation or the brief and lists what still needs owner confirmation.

Not covered automatically: Safari/WebKit and Firefox (run a manual pass on an
iPhone and in Firefox before launch), real e-mail delivery (needs Resend
credentials), and a screen-reader walkthrough (VoiceOver on iOS/macOS).

## Deployment (Cloudflare Workers)

1. Create the Turnstile widget (Cloudflare dashboard → Turnstile) for the
   production domain, and a Resend account with the sending domain verified
   (SPF/DKIM DNS records).
2. Set the secrets once:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put APPLICATION_TO_EMAIL
   npx wrangler secret put APPLICATION_FROM_EMAIL
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```
3. Build with the public values and deploy:
   ```bash
   SITE_URL=https://your-domain PUBLIC_TURNSTILE_SITE_KEY=… npm run build
   npx wrangler deploy
   ```
4. Attach the custom domain to the Worker, add the WAF rate-limiting rule, and
   submit a real test application end to end.

`wrangler.jsonc` holds only project settings; Astro generates the entry point
and asset binding at build time. Hashed assets are served with immutable
caching.

## Languages

Portuguese (default, at the root) and English (under `/en`):

| Page        | Português                 | English               |
| ----------- | ------------------------- | --------------------- |
| Home        | `/`                       | `/en`                 |
| Application | `/solicitar-participacao` | `/en/apply`           |
| Privacy     | `/privacidade`            | `/en/privacy`         |
| Not found   | `404`                     | `/en/…` → English 404 |

- Copy: `src/i18n/pt-BR.ts` and `src/i18n/en.ts`, both typed by
  `src/i18n/types.ts` — a missing translation is a type error.
- Page addresses per language: `localizedRoutes` in `src/config/site.ts`. Pages
  are shared views in `src/views/`; the files in `src/pages/` only pick the
  language.
- Each page declares its translations with `hreflang` (Portuguese is
  `x-default`) and links to them from the header, mobile menu and footer.
- The English form requires phone numbers with a country code. The club's
  notification e-mail is always in Portuguese and notes the form's language.

## Editing content

All public copy lives in **`src/i18n/pt-BR.ts`**, typed by `src/i18n/types.ts`.
Layout components never contain copy.

- Text from the official presentation is kept verbatim and marked with comments.
- **Optional fields are for information not yet confirmed by the owner**
  (founder bio and photo, press URLs, location wording, selection-process note,
  privacy-policy controller details, contact channels). Leave them empty and the
  block does not render — no placeholder ever reaches the public page.
- Press mentions render only once each item has a verified `url`.
- Contact channels go in `src/config/site.ts`.

## Photography

Source photos live outside the app in `../assets/`. The deck photos are in
`../assets/from-presentation/`. `npm run images` crops and grades them into
`src/assets/photos/` (originals are never modified); Astro then serves
AVIF/WebP at the sizes each layout needs.

Crops are defined in `scripts/prepare-images.mjs`, with a note explaining each
one (several crops remove third-party logos visible in event photos). When
higher-resolution originals or new photos arrive, add them to `../assets/` and
update the list there.

## Project structure

```
src/
  actions/       server actions (membership application)
  i18n/          copy (pt-BR.ts) and its type (types.ts)
  config/        routes, contact channels
  lib/
    application/ fields, validation, messages, notification e-mail, delivery
    turnstile.ts server-side Turnstile verification
  styles/        tokens.css, base.css, form.css (application page only)
  layouts/       BaseLayout.astro (SEO, fonts, header, footer)
  components/
    layout/      Header, MobileMenu, Footer, Section, SectionHeader
    ui/          Button, ArrowLink, Photo, Wordmark, Pillars, Arrow
    sections/    Hero, Club, Experience, Audience, Benefits, Track, Press,
                 Founder, Membership, Closing
    form/        ApplicationForm, Field, SuccessPanel, application-form.ts
  dev/           dev-only pages (style guide)
  pages/         routes
scripts/         prepare-images.mjs
```

### Design system in brief

- Each section sets a theme class (`theme-paper`, `theme-sand`, `theme-ink`,
  `theme-graphite`). Components read only semantic tokens (`--fg`, `--bg`,
  `--accent`, `--line`, …), so they work on any section.
- Fonts: Newsreader (display) and Inter (text), self-hosted through Astro's
  Fonts API with metric-matched fallbacks to avoid layout shift.
- Motion is minimal and disabled under `prefers-reduced-motion`.

## Open items before launch

1. Resend account + verified sending domain, recipient address, Turnstile
   widget, Cloudflare account (credentials above).
2. Domain name (`SITE_URL`).
3. Privacy policy: data-controller details (legal name, CNPJ, contact for data
   requests) and legal review of the draft text (LGPD).
4. Approval to publish the event photos (attendee consent, visible brands).
5. Contact channels to display, if any.
6. Founder headshot and approved biography.
7. Verified URLs for the four press mentions.
8. Official logo (an interim typographic wordmark is used).
9. Higher-resolution photo originals (current sources are ≤1536px wide).
10. What happens after an application (who replies, how, how soon) — the
    confirmation currently says only that the club will be in touch.
