import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:3001/api/gatekeeper';
  const payload = JSON.stringify({ prompt: 'How do I optimize Next.js ISR on Cloud Run?' });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'is cache hit': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.action === 'CACHE_HIT' || body.decision?.action === 'CACHE_HIT';
      } catch (e) {
        return false;
      }
    },
  });
  sleep(0.02);
}
