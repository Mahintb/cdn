import { test, expect } from '@playwright/test';
import { clickCacheSettingsButtonForDomain, setCacheTTL } from '../helpers/cacheSettings';
import { validCredentials } from '../helpers/credentials';

const domains = ['test01.p9m.net', 'test02.p9m.net', 'test03.p9m.net'];

test.describe.serial('Cache Strategy Sequential Tests', () => {

    //  Positive Tests
    for (const domain of domains) {
        test(` Validate Cache TTL for ${domain}`, async ({ page }) => {
            await page.goto('https://console.asians.group/');
            await page.fill('#username', validCredentials.username);
            await page.fill('#password', validCredentials.password);
            await page.click('#kc-login');

            await clickCacheSettingsButtonForDomain(page, domain);
            await expect(page.getByRole('heading', { name: domain })).toBeVisible();
            const flag = await setCacheTTL(page, '1000');
            if (flag) {
                await expect(page.getByText('Save Success')).toBeVisible();
                console.log("Cache TTL to 1000 ms saved succesfully")
            }
            else {
                await expect(page.getByText('Cannot add same directive twice.')).toBeVisible();
                console.log("Cache TTL is alredy existed")
            }
        });
    }

});
