import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES } from './pages';

// WCAG 2.2 AA automated checks. Any violation fails CI.
for (const path of PAGES) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`)).toEqual([]);
  });
}

test('a11y: consent banner open with details', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose' }).click();
  const results = await new AxeBuilder({ page }).include('.consent').analyze();
  expect(results.violations).toEqual([]);
});

test('keyboard: skip link moves focus to main content @smoke', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('keyboard: mobile menu opens, closes with Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Schools' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('targets: interactive elements are at least 44px tall', async ({ page }) => {
  await page.goto('/');
  const small = await page.$$eval('main a.btn, main button, header a, header button', (els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim()),
  );
  expect(small).toEqual([]);
});
