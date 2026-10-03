const http = require('http');

const endpoints = [
  { path: '/api/users', method: 'GET' },
  { path: '/api/appointments', method: 'GET' },
  { path: '/api/diagnostics', method: 'GET' },
  { path: '/api/vitals', method: 'GET' },
  { path: '/api/posture/settings', method: 'GET' },
  { path: '/api/sos', method: 'GET' }
];

async function testEndpoint(ep) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: ep.path,
      method: ep.method
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ path: ep.path, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, len: body.length });
      });
    });
    req.on('error', (err) => {
      resolve({ path: ep.path, error: err.message });
    });
    req.end();
  });
}

async function run() {
  console.log('Testing server endpoints on http://localhost:8080...');
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`${ep.path} [${ep.method}] -> Status: ${res.status || 'ERROR'} (${res.ok ? 'OK' : res.error})`);
  }
}

run();
