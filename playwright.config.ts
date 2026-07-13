import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  retries: 1,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://automationexercise.com',
    headless: !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Auth setup runs first
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // UI tests reuse saved auth session
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
    },

    // API tests
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});