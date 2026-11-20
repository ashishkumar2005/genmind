import { test, expect } from '@playwright/test';
import { PAGES } from './pages';

for (const path of PAGES) {
  test(`smoke: ${path} loads with one H1, title, description, canonical and no console errors @smoke`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));

    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/.{10,}/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(path === '/' ? '' : path);
    expect(await page.locator('html').getAttribute('lang')).toBe('en-IN');
    // Every image needs alt text (empty alt allowed only for decorative images).
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    expect(errors).toEqual([]);
  });
}

test('titles and descriptions are unique across pages', async ({ page }) => {
  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  for (const path of PAGES) {
    await page.goto(path);
    const t = await page.title();
    const d = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(titles.get(t), `duplicate title on ${path} and ${titles.get(t)}`).toBeUndefined();
    expect(descs.get(d), `duplicate description on ${path} and ${descs.get(d)}`).toBeUndefined();
    titles.set(t, path);
    descs.set(d, path);
  }
});

test('internal links all resolve (link checker)', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href') || ''));
    for (const h of hrefs) seen.add(h.split('#')[0]);
  }
  for (const href of seen) {
    const r = await request.get(href);
    expect(r.status(), href).toBeLessThan(400);
  }
});

test('404 page is helpful', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('could not find');
});

test('robots, sitemap and llms.txt are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain('GenMindedTech');
});

test('security headers are present', async ({ request }) => {
  const r = await request.get('/');
  const h = r.headers();
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['x-powered-by']).toBeUndefined();
});

test('internal pages require authentication', async ({ request }) => {
  // In CI, INTERNAL_USER/INTERNAL_PASSWORD are set, so unauthenticated access must be refused.
  test.skip(!process.env.INTERNAL_USER, 'internal credentials not configured');
  expect((await request.get('/brand')).status()).toBe(401);
  expect((await request.get('/internal/placeholders')).status()).toBe(401);
});
