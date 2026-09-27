const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

// Ensure data directory and db.json exist
function initDB() {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: 'P-8821',
          role: 'patient',
          name: 'Alex Turner',
          email: 'alex.turner@clinical.org',
          phone: '+1 (555) 234-8890',
          bloodGroup: 'O+',
          age: 28,
          gender: 'Male',
          height: 178,
          weight: 71,
          emergencyName: 'Dr. Robert Kelly',
          emergencyPhone: '+1 (555) 019-2834',
          allergies: 'Penicillin, Dust',
          conditions: 'Mild Hypertension',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oLNhZft-_5NFE_r1jeWbiYhe5D9ugz7wfXM_HqTUzvz4H9IwmLxhE94qekm-wUFfC9UOsjKGm3G3-HnS29iK_1RsLqnSDTP7diXu1tcinjvlSyuIhzPd7eRoDLVjP58-VfabynwpbfyB1EkpTwDHzOBji70n_CDiW9b1RTWsc1XuygDGX2w3n31EUdG5yBq7M6YCy3aPgQGtJqPy2aJDBbswLqVB9QmuzeBBBXa7jrur4hltT8SOOw'
        },
        {
          id: 'DOC-CARD-492',
          role: 'doctor',
          name: 'Dr. Neha Sharma',
          email: 'dr.neha.sharma@hospital.org',
          phone: '+1 (555) 882-9912',
          degree: 'MD, FACC',
          specialty: 'Cardiology & Electrophysiology',
          license: 'MED-REG-IND-88419',
          hospital: 'Metro Heart Institute & Research Centre',
          department: 'Cardiovascular Sciences',
          opdRoom: 'Room 304, Wing B',
          opdHours: 'Mon - Fri • 09:00 AM - 02:00 PM',
          rating: '4.9',
          consultationsCount: '1,420+',
          onDuty: true,
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIqde2zHWq5d75xmp5aVgxeVego2Sai2irnWTj-vmHBG_t27ybS25MvuSVXxfzw01o8CZPgCxM3Lxj5K9m-lgCCegetXS7QKxdc7ysjQ2UWbJLPqNL_ZRRGwCgooxO7n2G6Kyb75y4Ou8sl1XjAcIZxy_uZ4aCd6MYGz5vN_zChy0g_8047jL7xNjraXRqE7MxTw6xWd730310TSuyGxwnyPpDLqJwIRkbUnKJMpxb8Z9IB-tOdt63Ug'
        }
      ],
      posture_settings: {
        alertAngle: 15,
        holdTime: 10,
        vibrate: true,
        mode: 'Desk & Mobile',
        updatedAt: new Date().toISOString()
      },
      appointments: [
        {
          id: 'APT-1001',
          doctorName: 'Dr. Neha Sharma',
          specialty: 'General Physician',
          slot: 'Today 10:30 AM',
          patientName: 'Alex Turner',
          status: 'Confirmed',
          bookedAt: new Date().toISOString()
        }
      ],
      sos_events: [],
      diagnostics: [
        {
          id: 'DIAG-1',
          type: 'Routine Vitals Log',
          heartRate: 72,
          spO2: 98,
          temp: 36.6,
          postureAngle: 0,
          status: 'Optimal',
          loggedAt: new Date().toISOString()
        }
      ],
      vitals_stream: {
        heartRate: 72,
        spO2: 98,
        temp: 36.6,
        postureAngle: 0,
        motion: 'Normal (Resting Phase)',
        battery: 78,
        connected: true,
        device: 'P+ Wearable ESP32-S3',
        updatedAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readDB() {
  try {
    initDB();
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return null;
  }
}

function writeDB(data) {
  try {
    initDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

// Parse JSON request body helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

// Send JSON response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Main HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:8080'}`);
  const pathname = urlObj.pathname;

  // ==========================================
  // BACKEND REST API ROUTES (/api/*)
  // ==========================================
  if (pathname.startsWith('/api/')) {
    const db = readDB();
    if (!db) {
      return sendJSON(res, 500, { error: 'Database unavailable' });
    }

    // 1. Health Status
    if (pathname === '/api/status' && req.method === 'GET') {
      return sendJSON(res, 200, {
        status: 'online',
        uptime: process.uptime(),
        database: 'connected',
        timestamp: new Date().toISOString(),
        stats: {
          usersCount: db.users ? db.users.length : 0,
          appointmentsCount: db.appointments ? db.appointments.length : 0,
          sosEventsCount: db.sos_events ? db.sos_events.length : 0,
          diagnosticsCount: db.diagnostics ? db.diagnostics.length : 0
        }
      });
    }

    // 2. User Profiles: GET /api/profile?role=patient|doctor
    if (pathname === '/api/profile' && req.method === 'GET') {
      const role = urlObj.searchParams.get('role') || 'patient';
      const user = db.users.find(u => u.role === role) || db.users[0];
      return sendJSON(res, 200, { success: true, profile: user });
    }

    // 3. User Profiles: POST /api/profile (Save/update profile)
    if (pathname === '/api/profile' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.role) body.role = 'patient';
      
      const idx = db.users.findIndex(u => u.role === body.role);
      if (idx >= 0) {
        db.users[idx] = Object.assign({}, db.users[idx], body, { updatedAt: new Date().toISOString() });
      } else {
        db.users.push(Object.assign({ id: `USR-${Date.now()}` }, body, { createdAt: new Date().toISOString() }));
      }
      writeDB(db);
      return sendJSON(res, 200, { success: true, profile: idx >= 0 ? db.users[idx] : body });
    }

    // 4. Auth: POST /api/auth/login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const emailOrPhone = (body.emailOrPhone || body.email || '').trim().toLowerCase();
      const role = body.role || 'patient';

      let user = db.users.find(u => {
        const uEmail = (u.email || '').toLowerCase();
        const uPhone = (u.phone || '').replace(/\D/g, '');
        const targetClean = emailOrPhone.replace(/\D/g, '');
        return (uEmail === emailOrPhone) || (targetClean && uPhone === targetClean) || (u.role === role);
      });

      if (!user) {
        user = db.users.find(u => u.role === role) || db.users[0];
      }

      return sendJSON(res, 200, {
        success: true,
        message: 'Authentication successful',
        user: user,
        token: `JWT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      });
    }

    // 5. Auth: POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      const role = body.role || 'patient';
      const newId = role === 'doctor' ? `DOC-${Math.floor(1000 + Math.random() * 9000)}` : `P-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUser = Object.assign({
        id: newId,
        role: role,
        name: body.name || (role === 'doctor' ? 'Dr. New Doctor' : 'New Patient'),
        email: body.email || '',
        phone: body.phone || '',
        createdAt: new Date().toISOString()
      }, body);

      const existingIdx = db.users.findIndex(u => u.email && u.email.toLowerCase() === (body.email || '').toLowerCase());
      if (existingIdx >= 0) {
        db.users[existingIdx] = Object.assign({}, db.users[existingIdx], newUser);
      } else {
        db.users.push(newUser);
      }
      writeDB(db);

      return sendJSON(res, 201, {
        success: true,
        message: 'Account created successfully',
        user: newUser
      });
    }


    // 6. Live Telemetry & Vitals: GET /api/vitals
    if (pathname === '/api/vitals' && req.method === 'GET') {
      // Dynamic realistic micro-fluctuations
      const base = db.vitals_stream || { heartRate: 72, spO2: 98, temp: 36.6, postureAngle: 0 };
      const bpmJitter = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const liveVitals = Object.assign({}, base, {
        heartRate: Math.max(65, Math.min(95, base.heartRate + bpmJitter)),
        spO2: Math.random() > 0.8 ? 99 : 98,
        temp: Number((36.5 + (Math.random() * 0.2)).toFixed(1)),
        updatedAt: new Date().toISOString()
      });
      return sendJSON(res, 200, { success: true, vitals: liveVitals });
    }

    // 7. Live Telemetry: POST /api/vitals
    if (pathname === '/api/vitals' && req.method === 'POST') {
      const body = await parseBody(req);
      db.vitals_stream = Object.assign({}, db.vitals_stream, body, { updatedAt: new Date().toISOString() });
      writeDB(db);
      return sendJSON(res, 200, { success: true, vitals: db.vitals_stream });
    }

    // 8. Posture Settings: GET & POST /api/posture/settings
    if (pathname === '/api/posture/settings' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, settings: db.posture_settings });
    }
    if (pathname === '/api/posture/settings' && req.method === 'POST') {
      const body = await parseBody(req);
      db.posture_settings = Object.assign({}, db.posture_settings, body, { updatedAt: new Date().toISOString() });
      writeDB(db);
      return sendJSON(res, 200, { success: true, settings: db.posture_settings });
    }

    // 9. Appointments: GET & POST /api/appointments
    if (pathname === '/api/appointments' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, appointments: db.appointments || [] });
    }
    if (pathname === '/api/appointments' && req.method === 'POST') {
      const body = await parseBody(req);
      const newApt = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: body.doctorName || 'Dr. Specialist',
        specialty: body.specialty || 'General Physician',
        slot: body.slot || 'Today 10:30 AM',
        patientName: body.patientName || 'Alex Turner',
        notes: body.notes || 'Routine consultation',
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
      };
      if (!Array.isArray(db.appointments)) db.appointments = [];
      db.appointments.unshift(newApt);
      writeDB(db);
      return sendJSON(res, 201, { success: true, appointment: newApt });
    }

    // 10. Emergency SOS: GET & POST /api/sos
    if (pathname === '/api/sos' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, events: db.sos_events || [] });
    }
    if (pathname === '/api/sos' && req.method === 'POST') {
      const body = await parseBody(req);
      const newSOS = {
        id: `SOS-${Date.now()}`,
        status: 'DISPATCH_TRIGGERED',
        emergencyContact: body.contact || 'Dr. Robert Kelly (+1 555-019-2834)',
        patientName: body.patientName || 'Alex Turner',
        location: body.location || 'Lat 28.6139° N, Lon 77.2090° E',
        vitalSnapshot: {
          heartRate: body.heartRate || 74,
          spO2: body.spO2 || 98
        },
        timestamp: new Date().toISOString()
      };
      if (!Array.isArray(db.sos_events)) db.sos_events = [];
      db.sos_events.unshift(newSOS);
      writeDB(db);
      return sendJSON(res, 201, { success: true, message: 'Emergency dispatch triggered & logged', event: newSOS });
    }

    // 11. Diagnostic Logs: GET & POST /api/diagnostics
    if (pathname === '/api/diagnostics' && req.method === 'GET') {
      return sendJSON(res, 200, { success: true, diagnostics: db.diagnostics || [] });
    }
    if (pathname === '/api/diagnostics' && req.method === 'POST') {
      const body = await parseBody(req);
      const newDiag = {
        id: `DIAG-${Date.now()}`,
        type: body.type || 'Diagnostic Stream Calibrated',
        heartRate: body.heartRate || 72,
        spO2: body.spO2 || 98,
        temp: body.temp || 36.6,
        postureAngle: body.postureAngle || 0,
        status: body.status || 'Optimal',
        notes: body.notes || 'ESP32 sensor calibrated successfully',
        loggedAt: new Date().toISOString()
      };
      if (!Array.isArray(db.diagnostics)) db.diagnostics = [];
      db.diagnostics.unshift(newDiag);
      writeDB(db);
      return sendJSON(res, 201, { success: true, diagnostic: newDiag });
    }

    // Unknown API Route
    return sendJSON(res, 404, { error: 'API route not found' });
  }

  // ==========================================
  // STATIC ASSET SERVING
  // ==========================================
  let reqPath = decodeURIComponent(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

initDB();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[P+ Pro Backend] Server running at http://0.0.0.0:${PORT}`);
  console.log(`[P+ Pro Backend] Persistent JSON store at ${DB_FILE}`);
});
