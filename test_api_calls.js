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

async function runTests() {
  console.log('Testing live API responses...\n');

  try {
    // 1. GET /api/profile
    const p1 = await request('/api/profile?role=patient');
    console.log('1. GET /api/profile?role=patient:', p1.status, p1.data ? 'OK (User: ' + p1.data.name + ')' : 'FAIL');

    // 2. POST /api/profile
    const p2 = await request('/api/profile', 'POST', { role: 'patient', name: 'Alex Turner', age: 29 });
    console.log('2. POST /api/profile:', p2.status, p2.data ? 'OK' : 'FAIL');

    // 3. POST /api/auth/login
    const p3 = await request('/api/auth/login', 'POST', { name: 'Alex Turner', email: 'alex@example.com', password: 'password', role: 'patient' });
    console.log('3. POST /api/auth/login:', p3.status, p3.data ? 'OK (Token: ' + (p3.data.token ? 'YES' : 'NO') + ')' : 'FAIL');

    // 4. POST /api/auth/register
    const p4 = await request('/api/auth/register', 'POST', { name: 'Test User', email: 'test' + Date.now() + '@example.com', role: 'patient' });
    console.log('4. POST /api/auth/register:', p4.status, p4.data ? 'OK' : 'FAIL');

    // 5. GET /api/appointments
    const p5 = await request('/api/appointments');
    console.log('5. GET /api/appointments:', p5.status, Array.isArray(p5.data) ? 'OK (' + p5.data.length + ' appointments)' : 'FAIL');

    // 6. POST /api/appointments
    const p6 = await request('/api/appointments', 'POST', { doctorName: 'Dr. Neha Sharma', slot: 'Today 10:30 AM', patientName: 'Alex Turner' });
    console.log('6. POST /api/appointments:', p6.status, p6.data ? 'OK (ID: ' + p6.data.appointment?.id + ')' : 'FAIL');

    // 7. GET /api/posture/settings
    const p7 = await request('/api/posture/settings');
    console.log('7. GET /api/posture/settings:', p7.status, p7.data ? 'OK' : 'FAIL');

    // 8. POST /api/posture/settings
    const p8 = await request('/api/posture/settings', 'POST', { alertAngle: 15, holdTime: 10 });
    console.log('8. POST /api/posture/settings:', p8.status, p8.data ? 'OK' : 'FAIL');

    // 9. GET /api/diagnostics
    const p9 = await request('/api/diagnostics');
    console.log('9. GET /api/diagnostics:', p9.status, Array.isArray(p9.data) ? 'OK' : 'FAIL');

    // 10. POST /api/diagnostics
    const p10 = await request('/api/diagnostics', 'POST', { type: 'Test Log', heartRate: 75 });
    console.log('10. POST /api/diagnostics:', p10.status, p10.data ? 'OK' : 'FAIL');

    // 11. GET /api/sos
    const p11 = await request('/api/sos');
    console.log('11. GET /api/sos:', p11.status, Array.isArray(p11.data) ? 'OK' : 'FAIL');

    // 12. POST /api/sos
    const p12 = await request('/api/sos', 'POST', { patientName: 'Alex Turner', contact: 'Emergency Triage', heartRate: 110, spO2: 95 });
    console.log('12. POST /api/sos:', p12.status, p12.data ? 'OK (Alert ID: ' + p12.data.alert?.id + ')' : 'FAIL');

    // 13. GET /api/vitals
    const p13 = await request('/api/vitals');
    console.log('13. GET /api/vitals:', p13.status, p13.data ? 'OK (HR: ' + p13.data.heartRate + ')' : 'FAIL');

    // 14. POST /api/vitals
    const p14 = await request('/api/vitals', 'POST', { heartRate: 74, spO2: 99 });
    console.log('14. POST /api/vitals:', p14.status, p14.data ? 'OK' : 'FAIL');

  } catch (err) {
    console.error('Error during testing:', err);
  }
}

runTests();
