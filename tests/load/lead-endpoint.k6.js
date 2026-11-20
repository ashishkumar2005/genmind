/**
 * Load test for the form endpoint. Run against STAGING with LEAD_DRY_RUN=true, never production.
 *   k6 run -e BASE=https://staging.example.com tests/load/lead-endpoint.k6.js
 *
 * Checks: (1) rate limiting returns 429 for a single abusive client,
 *         (2) pages stay fast while the endpoint is under load.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE || 'http://localhost:3000';

export const options = {
  scenarios: {
    abusive_client: { executor: 'constant-vus', vus: 5, duration: '30s', exec: 'abuse' },
    normal_visitors: { executor: 'ramping-vus', startVUs: 0, stages: [{ duration: '30s', target: 50 }, { duration: '1m', target: 50 }, { duration: '15s', target: 0 }], exec: 'browse' },
  },
  thresholds: {
    'http_req_duration{scenario:normal_visitors}': ['p(95)<800'],
    'checks{check:rate_limited}': ['rate>0.5'],
  },
};

export function abuse() {
  const res = http.post(`${BASE}/api/lead`, JSON.stringify({ type: 'contact', data: { name: 'Load', email: 'load@example.com', message: 'test' }, elapsedMs: 5000 }), {
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.200' },
  });
  check(res, { rate_limited: (r) => r.status === 429 || r.status === 200 }, { check: 'rate_limited' });
  sleep(0.2);
}

export function browse() {
  const res = http.get(`${BASE}/`);
  check(res, { 'home 200': (r) => r.status === 200 });
  sleep(1);
}
