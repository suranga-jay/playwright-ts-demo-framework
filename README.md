# Playwright TS Demo Framework

A TypeScript test automation framework built on [Playwright Test](https://playwright.dev/), demonstrating Page Object Model design, authenticated session reuse, combined UI + API testing, and a CI pipeline — exercised against [automationexercise.com](https://automationexercise.com).

## Architecture

```
pages/        Page Object Model classes (BasePage, LoginPage, ProductsPage)
fixtures/     Custom test fixtures that inject page objects into tests
tests/
  auth.setup.ts   Logs in once, saves session to .auth/user.json
  ui/             UI specs, reuse the saved session
  api/             API specs, hit endpoints directly via Playwright's request context
```

`playwright.config.ts` wires this together with three projects:

- **setup** — runs `auth.setup.ts` first and stores the authenticated session.
- **chromium** — UI tests, depends on `setup`, reuses `storageState: '.auth/user.json'` so every test starts already logged in.
- **api** — API tests, run independently with no browser/session needed.

`baseURL` is configured once in `playwright.config.ts`; page objects navigate with relative paths (e.g. `/login`) rather than hardcoded full URLs.

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # then fill in TEST_EMAIL / TEST_PASSWORD
```

## Running tests

```bash
npm test                              # full suite (setup -> chromium -> api)
npx playwright test --project=chromium
npx playwright test --project=api
npx playwright show-report            # view the last HTML report
```

Tests run headed locally (for debugging) and headless automatically in CI, via `headless: !!process.env.CI` in the config.

## CI

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on every push/PR to `main`/`master`: installs dependencies and browsers, runs the suite headless, and uploads the HTML report as a build artifact. It expects `TEST_EMAIL` and `TEST_PASSWORD` to be configured as repository secrets (Settings → Secrets and variables → Actions).

## What this demonstrates

- Page Object Model with a shared `BasePage`
- Custom fixture composition (`fixtures/base.ts`) instead of instantiating page objects per test
- Authenticated session reuse across a whole test run via `storageState` + Playwright project dependencies
- Mixed UI and API testing in a single framework
- Environment-based configuration with secrets kept out of version control (`.env` / `.env.example`)
- A CI pipeline with secret management, headless execution, and report artifacts
