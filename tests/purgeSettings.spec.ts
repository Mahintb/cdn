import { test, expect } from '@playwright/test';
import { clickCacheSettingsButtonForDomain, setCacheTTL } from '../helpers/cacheSettings';
import { validCredentials } from '../helpers/credentials';

const domains = ['test01.p9m.net', 'test02.p9m.net', 'test03.p9m.net'];

test.describe.serial('Purge clear Sequential Tests', () => {

    for (const domain of domains) {
        test(` Purge clear for ${domain}`, async ({ page }) => {
            await page.goto('https://console.asians.group/');
            await page.fill('#username', validCredentials.username);
            await page.fill('#password', validCredentials.password);
            await page.click('#kc-login');

            await clickCacheSettingsButtonForDomain(page, domain);

            await page.locator("//button[normalize-space()='Clear cache']").click();
            await expect(page.getByText('Clear cache action was successful')).toBeVisible();
         });
    }

});
