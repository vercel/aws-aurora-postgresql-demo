import http from 'k6/http';
import { check, sleep } from 'k6';
import type { Options } from 'k6/options';

const baseUrl = 'http://localhost:3000';

export const options: Options = {
  scenarios: {
    reads: {
      executor: 'ramping-arrival-rate',
      exec: 'readScenario',
      startRate: 50,          // 50 iterations/sec to start
      timeUnit: '1s',         // per second
      preAllocatedVUs: 50,    // pool of VUs to start with
      maxVUs: 300,            // upper cap if latency spikes
      stages: [
        { duration: '30s', target: 100 },  // ramp to 100 rps
        { duration: '1m', target: 200 },   // ramp to 200 rps
        { duration: '1m', target: 200 },   // hold
        { duration: '30s', target: 0 },    // ramp down
      ],
    },

    writes: {
      executor: 'ramping-arrival-rate',
      exec: 'writeScenario',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 150,
      stages: [
        { duration: '30s', target: 30 },
        { duration: '1m', target: 60 },
        { duration: '1m', target: 60 },
        { duration: '30s', target: 0 },
      ],
    },
  },

  thresholds: {
    // global
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<400'],

    // reads only
    'http_req_duration{kind:read}': ['p(95)<250'],

    // writes only
    'http_req_duration{kind:write}': ['p(95)<600'],
  },

  // keep responses to reduce RAM pressure under big load
  discardResponseBodies: true,
};

export function readScenario() {
  const res = http.get(`${baseUrl}/api/k6/reads`, {
    tags: { kind: 'read' },
  });

  check(res, {
    'read status is 200': (r) => r.status === 200,
  });

  // Tiny think time to avoid “pure hammer”
  sleep(0.1);
}

export function writeScenario() {
  const res = http.post(`${baseUrl}/api/k6/writes`, {}, {
    headers: { 'Content-Type': 'application/json' },
    tags: { kind: 'write' },
  });

  check(res, {
    'write status is 200/201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.1);
}
