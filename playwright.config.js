// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

webServer: [
  { command: 'node api/index.js', url: 'http://localhost:3000/api', reuseExistingServer: !process.env.CI },
  {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },
],
});