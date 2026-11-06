import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

/**
 * End-to-end tests against the dev server (development delivery mode, no
 * Turnstile keys). Uses the locally installed Google Chrome — no browser
 * download needed.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
