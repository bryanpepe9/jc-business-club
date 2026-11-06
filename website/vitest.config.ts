import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit tests cover the framework-free modules (validation, e-mail, delivery,
// Turnstile). Page and action behaviour is covered end to end by Playwright.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
