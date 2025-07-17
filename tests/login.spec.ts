// login.spec.ts
import { test, expect } from '@playwright/test';
import { invalidCredentials, validCredentials } from '../helpers/credentials';

test('Login to Console Portal - valid credentials', async ({ page }) => {
  await page.goto('https://console.asians.group/');
  await page.fill('#username', validCredentials.username);
  await page.fill('#password', validCredentials.password);
  await page.click('#kc-login');

  await expect(page).toHaveURL(/domain/);
});

test('Login with invalid credentials should fail', async ({ page }) => {
  await page.goto('https://console.asians.group/');
  await page.fill('#username', invalidCredentials.username);
  await page.fill('#password', invalidCredentials.password);
  await page.click('#kc-login');

  await expect(page.locator('.alert-error, .kc-feedback-text, .error')).toHaveText(/Invalid username or password./i);
  await expect(page).toHaveURL(/login-actions/);
});
