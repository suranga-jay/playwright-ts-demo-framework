# Playwright TS Demo Framework

A TypeScript test automation framework built on [Playwright Test](https://playwright.dev/), demonstrating Page Object Model design, authenticated session reuse, combined UI + API testing, built-in failure diagnostics, and a CI pipeline — exercised against [automationexercise.com](https://automationexercise.com/).


## Architecture

```
pages/          Page Object Model classes (BasePage, LoginPage, ProductsPage)
fixtures/       Custom test fixtures that inject page objects into tests
tests/
  auth.setup.ts   Logs in once, saves session to .auth/user.json
  ui/             UI specs, reuse the saved session
  api/            API specs, hit endpoints directly via Playwright's request context
practice/       Standalone exploratory specs (no saved session)
docs/           Report screenshots used in this README
```

`playwright.config.ts` wires this together with four projects:

| Project    | What it runs                  | Notes |
|------------|-------------------------------|-------|
| `setup`    | `tests/auth.setup.ts`         | Runs first and stores the authenticated session |
| `chromium` | `tests/ui/**/*.spec.ts`       | Depends on `setup`; reuses `storageState: '.auth/user.json'` so every test starts logged in |
| `api`      | `tests/api/**/*.spec.ts`      | Runs independently — no browser or session needed |
| `practice` | `practice/**/*.spec.ts`       | Desktop Chrome, no saved session |

`baseURL` is configured once in `playwright.config.ts`; page objects navigate with relative paths (e.g. `/login`) rather than hardcoded full URLs.

## Failure diagnostics

When a test fails, the HTML report gives everything needed to diagnose it without re-running:

- **Clear assertion error** with the failing line highlighted
- **Step-by-step timeline** showing which step failed
- **Screenshot** of the page at the moment of failure (`screenshot: 'only-on-failure'`)
- **Video** of the failed run (`video: 'retain-on-failure'`)
- **Trace** for step-by-step replay in Trace Viewer (`trace: 'on-first-retry'`, with `retries: 1`)


## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # then fill in TEST_EMAIL / TEST_PASSWORD
```

## Running tests

```bash
npm test                                 # full suite
npx playwright test --project=chromium   # UI tests only
npx playwright test --project=api        # API tests only
npx playwright test --project=practice   # practice specs only
npx playwright show-report               # open the last HTML report
```

Tests run headed locally (for debugging) and headless automatically in CI, via `headless: !!process.env.CI` in the config.

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on every push/PR to `main`/`master`: installs dependencies and browsers, runs the suite headless, and uploads the HTML report as a build artifact.

It expects `TEST_EMAIL` and `TEST_PASSWORD` to be configured as repository secrets (**Settings → Secrets and variables → Actions**).

## What this demonstrates

- Page Object Model with a shared `BasePage`
- Custom fixture composition (`fixtures/base.ts`) instead of instantiating page objects per test
- Authenticated session reuse across a whole run via `storageState` + project dependencies
- Mixed UI and API testing in a single framework
- Failure evidence out of the box: screenshots, videos, traces and an HTML report
- Environment-based configuration with secrets kept out of version control (`.env` / `.env.example`)
- A CI pipeline with secret management, headless execution and report artifacts

## Roadmap

- Cross-browser projects (Firefox, WebKit) and mobile device emulation
- Scheduled nightly CI run
- Test-data cleanup fixtures for specs that create data
