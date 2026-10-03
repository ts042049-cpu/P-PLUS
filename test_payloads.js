const http = require('http');

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      } : {}
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (_) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function inspectPayloads() {
  const p1 = await request('/api/profile?role=patient');
  console.log('1. /api/profile response:', JSON.stringify(p1.data).slice(0, 150));

  const p5 = await request('/api/appointments');
  console.log('5. /api/appointments response:', JSON.stringify(p5.data).slice(0, 150));

  const p9 = await request('/api/diagnostics');
  console.log('9. /api/diagnostics response:', JSON.stringify(p9.data).slice(0, 150));

  const p11 = await request('/api/sos');
  console.log('11. /api/sos response:', JSON.stringify(p11.data).slice(0, 150));

  const p12 = await request('/api/sos', 'POST', { patientName: 'Alex Turner' });
  console.log('12. /api/sos POST response:', JSON.stringify(p12.data).slice(0, 150));

  const p13 = await request('/api/vitals');
  console.log('13. /api/vitals response:', JSON.stringify(p13.data).slice(0, 150));
}

inspectPayloads();
