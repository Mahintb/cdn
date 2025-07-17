import { Page, Locator } from '@playwright/test';


export async function clickCacheSettingsButtonForDomain(page: Page, domain: string): Promise<void> {

  const domainSection: Locator = page.locator('.domain-list-item').filter({ hasText: domain });
  await domainSection.waitFor({ state: 'visible' });
  const cacheSettingsButton: Locator = domainSection.locator('.plugin-indicators .btn').nth(1);
  await cacheSettingsButton.click();
}

export async function setCacheTTL(page: Page, value: string = '1000') {
  const switchLocator = page.locator('form div').filter({ hasText: 'Cache Control' }).getByRole('switch');
  const directiveTags = page.locator('div.border.rounded span.ant-tag');
  const existingDirectives = await directiveTags.allInnerTexts();
  const normalized = existingDirectives.map(t => t.trim().toLowerCase());

  const isEnabled = await switchLocator.getAttribute('aria-checked') === 'true';
  if (!isEnabled) {
    await switchLocator.click();
  }

  await page.locator('#cacheDirective div').nth(1).click();
  await page.getByRole('option', { name: 'max-age' }).click();
  await page.getByRole('spinbutton', { name: 'Cache Value' }).fill(value);
  await page.getByRole('button', { name: 'Add', exact: true }).click();

  if (normalized.includes(`max-age=${value}`)) {
    console.log("max-age already present, skipping...");
    return false;
  }
  await page.getByRole('button', { name: /save/i }).click();
  return true;
}


export async function addCacheDirectiveIfNotExists(page: Page, directive: string) {
  const directiveTags = page.locator('div.border.rounded span.ant-tag');
  const existingDirectives = await directiveTags.allInnerTexts();
  const normalized = existingDirectives.map(t => t.trim().toLowerCase());


  const switchLocator = page
    .locator('form div')
    .filter({ hasText: 'Cache Control' })
    .getByRole('switch');

  const isEnabled = await switchLocator.getAttribute('aria-checked') === 'true';

  if (!isEnabled) {
    await switchLocator.click();
  }
  await page.locator('#cacheDirective div').nth(1).click();
  await page.getByRole('option', { name: directive }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  if (normalized.includes(directive.toLowerCase())) {
    console.log(`${directive} already present, skipping...`);
    return false;
  }
  await page.getByRole('button', { name: /save/i }).click();
  return true;
}