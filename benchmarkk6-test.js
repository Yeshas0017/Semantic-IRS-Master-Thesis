import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<350'],
  },
};

export default function () {
  const url = 'http://localhost:3000/api/gatekeeper';
  const payload = JSON.stringify({
    prompt: 'How can I optimize Next.js ISR on Google Cloud Run?',
    threshold: 0.90,
    engine: 'cloud'
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'action evaluated': (r) => JSON.parse(r.body).action !== undefined,
  });

  sleep(0.3);
}