import { test, expect } from '@playwright/test';

// Visual regression at 3 breakpoints (via projects: desktop, tablet, mobile).
// First run creates baselines: npx playwright test visual --update-snapshots
const KEY_PAGES = ['/', '/solutions/schools', '/book-consultation', '/labs', '/about'];

for (const path of KEY_PAGES) {
  test(`visual: ${path}`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('genminded-consent', JSON.stringify({ v: 1, analytics: false, widgets: false, ts: Date.now() }));
      localStorage.setItem('genminded-reduce-effects', 'true');
    });
    await page.goto(path);
    await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled' });
  });
}
