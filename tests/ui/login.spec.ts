import { test, expect } from '../../fixtures/base';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Login', () => {

  test.use({ storageState: { cookies: [], origins: [] } });

  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });

});