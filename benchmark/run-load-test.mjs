const URL = 'http://localhost:3000/api/gatekeeper';
const TOTAL_REQUESTS = 100;
const CONCURRENCY = 10;

const payload = JSON.stringify({
  prompt: 'How can I optimize Next.js ISR on Google Cloud Run?',
  threshold: 0.90,
  engine: 'cloud'
});

async function sendRequest() {
  const start = performance.now();
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    const data = await res.json();
    const duration = performance.now() - start;
    return {
      status: res.status,
      action: data.action,
      duration,
      success: res.status === 200 && data.action === 'CACHE_HIT'
    };
  } catch (err) {
    const duration = performance.now() - start;
    return { status: 500, action: 'ERROR', duration, success: false };
  }
}

async function runBenchmark() {
  console.log(`\nStarting Load Test: ${TOTAL_REQUESTS} requests, Concurrency: ${CONCURRENCY}`);
  console.log(`Target: ${URL}\n`);

  const results = [];
  let index = 0;

  async function worker() {
    while (index < TOTAL_REQUESTS) {
      index++;
      const res = await sendRequest();
      results.push(res);
      process.stdout.write(res.success ? '.' : 'x');
    }
  }

  const startTime = performance.now();
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  const totalTime = (performance.now() - startTime) / 1000;

  const latencies = results.map(r => r.duration).sort((a, b) => a - b);
  const successes = results.filter(r => r.success).length;

  const p50 = latencies[Math.floor(latencies.length * 0.50)].toFixed(2);
  const p90 = latencies[Math.floor(latencies.length * 0.90)].toFixed(2);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(2);
  const p99 = latencies[Math.floor(latencies.length * 0.99)].toFixed(2);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const rps = (results.length / totalTime).toFixed(2);

  console.log('\n\n========================================');
  console.log('       GATEKEEPER BENCHMARK SUMMARY     ');
  console.log('========================================');
  console.log(`Total Requests Completed : ${results.length}`);
  console.log(`Successful Cache Hits    : ${successes} (${((successes/results.length)*100).toFixed(1)}%)`);
  console.log(`Total Execution Time     : ${totalTime.toFixed(2)}s`);
  console.log(`Throughput               : ${rps} req/sec`);
  console.log('----------------------------------------');
  console.log(`Average Latency (Mean)   : ${avg} ms`);
  console.log(`Median Latency (P50)     : ${p50} ms`);
  console.log(`90th Percentile (P90)    : ${p90} ms`);
  console.log(`95th Percentile (P95)    : ${p95} ms`);
  console.log(`99th Percentile (P99)    : ${p99} ms`);
  console.log('========================================\n');
}

runBenchmark();