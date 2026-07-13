import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loggedInUser: Locator
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput    = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton   = page.locator('[data-qa="login-button"]');
    this.loggedInUser  = page.locator('a:has-text("Logged in as")');
    this.errorMessage  = page.locator('p:has-text("Your email or password is incorrect")');
  }

  async goto() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInUser.isVisible();
  }
}