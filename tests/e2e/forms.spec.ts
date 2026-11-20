import { test, expect } from '@playwright/test';

test.describe('forms', () => {
  test('consultation: empty submit shows an error summary that receives focus @smoke', async ({ page }) => {
    await page.goto('/book-consultation');
    await page.getByRole('button', { name: /Request my consultation/ }).click();
    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Please fix');
    await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
    // Error links jump to the field.
    await alert.getByRole('link').first().click();
    await expect(page.locator('[aria-invalid="true"]').first()).toBeFocused();
  });

  test('consultation: valid submit goes to the thank-you page', async ({ page }, info) => {
    // Unique client IP per run so parallel tests don't share a rate-limit bucket.
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': `198.51.100.${info.workerIndex + 10}` });
    await page.goto('/book-consultation');
    await page.getByLabel('I am contacting you as').selectOption('school');
    await page.getByLabel('Your name').fill('Test Person');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone', { exact: false }).first().fill('9876543210');
    await page.waitForTimeout(2100); // minimum fill time (bot protection)
    await page.getByRole('button', { name: /Request my consultation/ }).click();
    await expect(page).toHaveURL(/\/thank-you\?type=consultation/);
    await expect(page.getByRole('status')).toContainText('Received');
  });

  test('phone and email fields use the right mobile keyboards', async ({ page }) => {
    await page.goto('/enquiry');
    await expect(page.getByLabel('Email')).toHaveAttribute('inputmode', 'email');
    await expect(page.getByLabel(/^Phone/)).toHaveAttribute('inputmode', 'tel');
    await expect(page.getByLabel('Email')).toHaveAttribute('autocomplete', 'email');
  });

  test('API validates server-side and rejects bad input', async ({ request }) => {
    const r = await request.post('/api/lead', { data: { type: 'contact', data: { name: '', email: 'not-an-email' }, elapsedMs: 5000 }, headers: { 'x-forwarded-for': '192.0.2.1' } });
    expect(r.status()).toBe(422);
    const json = await r.json();
    expect(json.errors.email).toBeTruthy();
  });

  test('API rejects unknown form types and oversized bodies', async ({ request }) => {
    const headers = { 'x-forwarded-for': '192.0.2.2' };
    expect((await request.post('/api/lead', { data: { type: 'admin', data: {} }, headers })).status()).toBe(400);
    const big = 'x'.repeat(20_000);
    expect((await request.post('/api/lead', { data: { type: 'contact', data: { message: big } }, headers })).status()).toBe(413);
  });

  test('API rate-limits repeated submissions', async ({ request }) => {
    const body = { type: 'contact', data: { name: 'A', email: 'a@example.com', message: 'Hi' }, elapsedMs: 5000 };
    const headers = { 'x-forwarded-for': `203.0.113.${Math.floor(Math.random() * 200) + 20}` };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) statuses.push((await request.post('/api/lead', { data: body, headers })).status());
    expect(statuses).toContain(429);
  });
});

test.describe('consent', () => {
  test('no analytics requests before consent; choice is remembered @smoke', async ({ page }) => {
    const thirdParty: string[] = [];
    page.on('request', (r) => { if (/googletagmanager|plausible\.io|clarity\.ms/.test(r.url())) thirdParty.push(r.url()); });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toBeVisible();
    expect(thirdParty).toEqual([]);
    await page.getByRole('button', { name: 'Reject non-essential' }).click();
    await page.reload();
    await expect(page.getByRole('region', { name: 'Your privacy choices' })).toHaveCount(0);
    expect(thirdParty).toEqual([]);
  });

  test('cookie settings can be reopened from the footer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Accept all' }).click();
    await page.getByRole('button', { name: 'Cookie settings' }).click();
    await expect(page.getByRole('checkbox', { name: /Analytics/ })).toBeChecked();
  });
});

test('solution finder routes a school that is ready to a quote', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'A school' }).check();
  await page.getByRole('radio', { name: 'Set up a lab' }).check();
  await page.getByRole('radio', { name: 'Ready to start now' }).check();
  await expect(page.getByRole('link', { name: 'Request a quote' }).first()).toBeVisible();
});
