import { test, expect } from '@playwright/test';
import { addCacheDirectiveIfNotExists, clickCacheSettingsButtonForDomain } from '../helpers/cacheSettings';

const domains = ['test01.p9m.net', 'test02.p9m.net', 'test03.p9m.net'];

test.describe('Cache Mode Test ', () => { 
    for (const domain of domains) {

        test(`Validating Cache mode for ${domain}`, async ({ page }) => {
            await page.goto('https://console.asians.group/');
            await page.fill('#username', 'qa.assessment@asians.cloud');
            await page.fill('#password', 'qaengineer123');
            await page.click('#kc-login');
            await clickCacheSettingsButtonForDomain(page, domain);
            await expect(page.getByRole('heading', { name: domain })).toBeVisible();
            const flag = await addCacheDirectiveIfNotExists(page, 'public');
            if (flag) {
                await expect(page.getByText('Save Success')).toBeVisible();
                console.log("Cache mode to public saved succesfully")
            }
            else {
                await expect(page.getByText('Cannot add same directive twice.')).toBeVisible();
                console.log("Cache mode is alredy existed")
            }
        })
    }
});
