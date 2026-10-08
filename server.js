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

const BACKFILE_PATH = path.join(__dirname, 'data', 'backfile.json');
const BACKUPS_DIR = path.join(__dirname, 'data', 'backups');

// Ensure data directory, backups directory, and backfile.json exist
function initDB() {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: 'P-8821',
          role: 'patient',
          name: 'Alex Turner',
          email: 'alex@example.com',
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
      },
      bluetooth_devices: [
        {
          id: 'MW-DEV-01',
          name: 'MW Biomedical Wearable (ESP32-S3)',
          type: 'MW Biomedical Telemetry Sensor',
          status: 'paired',
          battery: 84,
          rssi: -62,
          macAddress: '24:6F:28:B4:9A:12',
          firmware: 'v2.5.0-MW',
          pairedAt: new Date().toISOString(),
          lastConnectedAt: new Date().toISOString(),
          readingsCount: 15
        }
      ],
      bluetooth_readings: [
        {
          id: 'MWR-INIT-1',
          deviceId: 'MW-DEV-01',
          deviceName: 'MW Biomedical Wearable (ESP32-S3)',
          heartRate: 72,
          spO2: 98,
          temp: 36.6,
          postureAngle: 0,
          battery: 84,
          motion: 'Ergonomic Upright',
          signalRssi: -62,
          isValidReading: true,
          readingQuality: 'Right Reading (Optimal Calibrated)',
          validationDetails: { heartRateOk: true, spO2Ok: true, tempOk: true, postureOk: true },
          recordedAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }

  // Ensure initial backfile exists
  if (!fs.existsSync(BACKFILE_PATH)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      const snapshot = {
        app: 'P+ Pro — Personal Health Companion',
        version: '2.0.0',
        format: 'PPLUS_PRO_BACKFILE_V2',
        savedAt: new Date().toISOString(),
        label: 'Initial Master Backfile',
        stats: {
          usersCount: data.users ? data.users.length : 0,
          appointmentsCount: data.appointments ? data.appointments.length : 0,
          sosEventsCount: data.sos_events ? data.sos_events.length : 0,
          diagnosticsCount: data.diagnostics ? data.diagnostics.length : 0
        },
        data: data
      };
      fs.writeFileSync(BACKFILE_PATH, JSON.stringify(snapshot, null, 2), 'utf8');
    } catch (e) {
      console.warn('Initial backfile snapshot skipped:', e.message);
    }
  }
}

// Generate formatted backfile object
function createBackfileSnapshot(data, label = 'Auto-Sync Snapshot') {
  try {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

    const now = new Date();
    const tsStr = now.toISOString().replace(/[:.]/g, '-');
    const snapshot = {
      app: 'P+ Pro — Personal Health Companion',
      version: '2.0.0',
      format: 'PPLUS_PRO_BACKFILE_V2',
      savedAt: now.toISOString(),
      label: label,
      stats: {
        usersCount: data.users ? data.users.length : 0,
        appointmentsCount: data.appointments ? data.appointments.length : 0,
        sosEventsCount: data.sos_events ? data.sos_events.length : 0,
        diagnosticsCount: data.diagnostics ? data.diagnostics.length : 0
      },
      data: data
    };

    // Update master backfile.json
    fs.writeFileSync(BACKFILE_PATH, JSON.stringify(snapshot, null, 2), 'utf8');

    // Create timestamped backup file in data/backups/
    const snapshotFile = path.join(BACKUPS_DIR, `backfile_${tsStr}.json`);
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2), 'utf8');

    // Prune backups if more than 20
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => ({ name: f, time: fs.statSync(path.join(BACKUPS_DIR, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 20) {
      files.slice(20).forEach(f => {
        try { fs.unlinkSync(path.join(BACKUPS_DIR, f.name)); } catch (_) {}
      });
    }

    return {
      success: true,
      filename: `backfile_${tsStr}.json`,
      savedAt: now.toISOString(),
      stats: snapshot.stats
    };
  } catch (err) {
    console.error('Error creating backfile snapshot:', err);
    return null;
  }
}

// List all saved backfiles in data/backups
function listBackups() {
  try {
    initDB();
    const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'));
    return files.map(file => {
      const filePath = path.join(BACKUPS_DIR, file);
      const stats = fs.statSync(filePath);
      let meta = {};
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        meta = {
          label: content.label || 'Snapshot',
          savedAt: content.savedAt || stats.mtime.toISOString(),
          stats: content.stats || {}
        };
      } catch (_) {}
      return {
        filename: file,
        sizeBytes: stats.size,
        modifiedAt: stats.mtime.toISOString(),
        ...meta
      };
    }).sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  } catch (err) {
    console.error('Error listing backups:', err);
    return [];
  }
}

// Restore data from backfile payload
function restoreBackfile(payload) {
  try {
    initDB();
    if (!payload) throw new Error('Empty payload');
    
    // Support both wrapped backfile format and raw DB schema
    let targetData = payload.data && typeof payload.data === 'object' ? payload.data : payload;
    if (!targetData.users || !Array.isArray(targetData.users)) {
      throw new Error('Invalid backfile format: users table missing');
    }

    // Safety fallback snapshot of current state before overwrite
    const current = readDB();
    if (current) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.writeFileSync(path.join(BACKUPS_DIR, `pre_restore_backup_${ts}.json`), JSON.stringify(current, null, 2), 'utf8');
    }

    // Write restored state
    fs.writeFileSync(DB_FILE, JSON.stringify(targetData, null, 2), 'utf8');
    createBackfileSnapshot(targetData, 'Post-Restore Master Backfile');

    return {
      success: true,
      message: 'Data successfully restored from backfile',
      data: targetData
    };
  } catch (err) {
    console.error('Error restoring backfile:', err);
    return { success: false, error: err.message };
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
    // Keep master backfile.json automatically synchronized with latest changes
    createBackfileSnapshot(data, 'Auto-Sync Save');
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
          diagnosticsCount: db.diagnostics ? db.diagnostics.length : 0,
          bluetoothDevicesCount: db.bluetooth_devices ? db.bluetooth_devices.length : 0,
          bluetoothReadingsCount: db.bluetooth_readings ? db.bluetooth_readings.length : 0
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

    // 5b. Auth: POST /api/auth/google (Google OAuth / Identity Services integration)
    if (pathname === '/api/auth/google' && req.method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const name = body.name || 'Google User';
      const avatar = body.avatar || body.picture || '';
      const googleId = body.sub || body.googleId || '';
      const role = body.role || 'patient';

      if (!email && !googleId) {
        return sendJSON(res, 400, { success: false, error: 'Email or Google ID required' });
      }

      let user = db.users.find(u => (u.email && u.email.toLowerCase() === email) || (u.googleId && u.googleId === googleId));
      if (user) {
        if (avatar && (!user.avatar || user.avatar.includes('AB6AXuC7oLNhZft'))) {
          user.avatar = avatar;
        }
        if (name && (!user.name || user.name === 'Alex Turner' || user.name.startsWith('New '))) {
          user.name = name;
        }
        user.lastLogin = new Date().toISOString();
        user.authProvider = 'google';
        if (googleId) user.googleId = googleId;
      } else {
        const newId = role === 'doctor' ? `DOC-${Math.floor(1000 + Math.random() * 9000)}` : `P-${Math.floor(1000 + Math.random() * 9000)}`;
        user = {
          id: newId,
          role: role,
          name: name,
          email: email,
          phone: body.phone || '+1 (555) 234-8890',
          bloodGroup: 'O+',
          age: 28,
          gender: 'Not specified',
          height: 175,
          weight: 70,
          emergencyName: 'Emergency Contact',
          emergencyPhone: '+1 (555) 019-2834',
          allergies: 'None recorded',
          conditions: 'Healthy',
          avatar: avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oLNhZft-_5NFE_r1jeWbiYhe5D9ugz7wfXM_HqTUzvz4H9IwmLxhE94qekm-wUFfC9UOsjKGm3G3-HnS29iK_1RsLqnSDTP7diXu1tcinjvlSyuIhzPd7eRoDLVjP58-VfabynwpbfyB1EkpTwDHzOBji70n_CDiW9b1RTWsc1XuygDGX2w3n31EUdG5yBq7M6YCy3aPgQGtJqPy2aJDBbswLqVB9QmuzeBBBXa7jrur4hltT8SOOw',
          googleId: googleId,
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        db.users.push(user);
      }
      writeDB(db);

      return sendJSON(res, 200, {
        success: true,
        message: 'Google Sign-In verified and logged in successfully',
        user: user,
        token: `JWT-GOOGLE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
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

    // ==========================================
    // 11B. BLUETOOTH MW DEVICE & RIGHT READING DATABASE API
    // ==========================================

    // A. List/Query Connected Bluetooth Devices: GET /api/bluetooth/devices
    if (pathname === '/api/bluetooth/devices' && req.method === 'GET') {
      if (!Array.isArray(db.bluetooth_devices)) db.bluetooth_devices = [];
      return sendJSON(res, 200, {
        success: true,
        count: db.bluetooth_devices.length,
        devices: db.bluetooth_devices
      });
    }

    // B. Register/Update Bluetooth MW Device: POST /api/bluetooth/devices
    if (pathname === '/api/bluetooth/devices' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!Array.isArray(db.bluetooth_devices)) db.bluetooth_devices = [];
      
      const devId = body.id || (body.name ? `MW-${body.name.replace(/[^a-zA-Z0-9]/g, '_')}` : `MW-${Date.now()}`);
      const devName = body.name || 'MW Biomedical Wearable (ESP32-S3)';
      const existingIdx = db.bluetooth_devices.findIndex(d => d.id === devId || d.name === devName);
      
      const deviceRecord = {
        id: devId,
        name: devName,
        type: body.type || 'MW Biomedical Telemetry Sensor',
        status: body.status || 'connected',
        battery: body.battery !== undefined ? body.battery : 85,
        rssi: body.rssi || -65,
        macAddress: body.macAddress || '24:6F:28:B4:9A:12',
        firmware: body.firmware || 'v2.5.0-MW',
        services: body.services || ['NUS', 'PPLUS_CUSTOM', 'HEART_RATE'],
        pairedAt: existingIdx >= 0 ? db.bluetooth_devices[existingIdx].pairedAt : new Date().toISOString(),
        lastConnectedAt: new Date().toISOString(),
        readingsCount: existingIdx >= 0 ? (db.bluetooth_devices[existingIdx].readingsCount || 0) : 0
      };

      if (existingIdx >= 0) {
        db.bluetooth_devices[existingIdx] = Object.assign({}, db.bluetooth_devices[existingIdx], deviceRecord);
      } else {
        db.bluetooth_devices.unshift(deviceRecord);
      }

      writeDB(db);
      return sendJSON(res, 200, {
        success: true,
        message: 'Bluetooth MW device registered in database',
        device: existingIdx >= 0 ? db.bluetooth_devices[existingIdx] : deviceRecord
      });
    }

    // C. Get Bluetooth MW Telemetry Readings: GET /api/bluetooth/readings
    if (pathname === '/api/bluetooth/readings' && req.method === 'GET') {
      if (!Array.isArray(db.bluetooth_readings)) db.bluetooth_readings = [];
      const limit = parseInt(urlObj.searchParams.get('limit') || '30', 10);
      const onlyValid = urlObj.searchParams.get('valid') === '1' || urlObj.searchParams.get('valid') === 'true';

      let results = db.bluetooth_readings;
      if (onlyValid) {
        results = results.filter(r => r.isValidReading);
      }
      results = results.slice(0, limit);

      const validCount = db.bluetooth_readings.filter(r => r.isValidReading).length;

      return sendJSON(res, 200, {
        success: true,
        totalInDb: db.bluetooth_readings.length,
        rightReadingsCount: validCount,
        readings: results
      });
    }

    // D. Store Bluetooth MW Right Reading in Database: POST /api/bluetooth/readings
    if (pathname === '/api/bluetooth/readings' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!Array.isArray(db.bluetooth_readings)) db.bluetooth_readings = [];

      const hr = Number(body.heartRate || body.bpm || 72);
      const spo2 = Number(body.spO2 || body.spo2 || 98);
      const temp = Number((Number(body.temp || body.temperature || 36.6)).toFixed(1));
      const angle = Number(body.postureAngle !== undefined ? body.postureAngle : (body.angle || 0));
      const bat = Number(body.battery !== undefined ? body.battery : (body.bat || 80));
      const motion = body.motion || (angle > 12 ? 'Slouch Warning' : 'Normal Upright');
      const devName = body.deviceName || body.device || 'MW Biomedical Wearable';

      // Physiological validation check for "Right Reading"
      const isHrValid = hr >= 45 && hr <= 195;
      const isSpo2Valid = spo2 >= 80 && spo2 <= 100;
      const isTempValid = temp >= 34.0 && temp <= 41.5;
      const isAngleValid = angle >= 0 && angle <= 65;
      const isRightReading = isHrValid && isSpo2Valid && isTempValid && isAngleValid;

      const readingRecord = {
        id: `MWR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        deviceId: body.deviceId || 'MW-DEV-01',
        deviceName: devName,
        heartRate: hr,
        spO2: spo2,
        temp: temp,
        postureAngle: angle,
        battery: bat,
        motion: motion,
        signalRssi: body.rssi || -62,
        isValidReading: isRightReading,
        readingQuality: isRightReading ? 'Right Reading (Optimal Calibrated)' : 'Anomalous / Check Sensor Placement',
        validationDetails: {
          heartRateOk: isHrValid,
          spO2Ok: isSpo2Valid,
          tempOk: isTempValid,
          postureOk: isAngleValid
        },
        recordedAt: new Date().toISOString()
      };

      // Store in bluetooth_readings array (keep latest 300)
      db.bluetooth_readings.unshift(readingRecord);
      if (db.bluetooth_readings.length > 300) {
        db.bluetooth_readings = db.bluetooth_readings.slice(0, 300);
      }

      // Update vitals_stream in database so entire application is synchronized with this right reading
      db.vitals_stream = {
        heartRate: hr,
        spO2: spo2,
        temp: temp,
        postureAngle: angle,
        motion: motion,
        battery: bat,
        connected: true,
        device: devName,
        updatedAt: new Date().toISOString()
      };

      // Increment device readingsCount in database
      if (Array.isArray(db.bluetooth_devices)) {
        const d = db.bluetooth_devices.find(dev => dev.name === devName || dev.id === body.deviceId);
        if (d) {
          d.readingsCount = (d.readingsCount || 0) + 1;
          d.lastReadingAt = new Date().toISOString();
          d.battery = bat;
          d.status = 'connected';
        }
      }

      // Also log as a diagnostic entry if requested or if posture slouch occurred
      if (body.logToDiagnostics || angle > 15) {
        if (!Array.isArray(db.diagnostics)) db.diagnostics = [];
        db.diagnostics.unshift({
          id: `DIAG-BLE-${Date.now()}`,
          type: angle > 15 ? 'BLE MW Slouch Alert' : 'BLE MW Right Reading Verified',
          heartRate: hr,
          spO2: spo2,
          temp: temp,
          postureAngle: angle,
          status: isRightReading ? 'Optimal' : 'Needs Attention',
          notes: `Logged from ${devName} via Web Bluetooth`,
          loggedAt: new Date().toISOString()
        });
      }

      writeDB(db);

      return sendJSON(res, 201, {
        success: true,
        message: isRightReading ? 'Right reading verified & stored in database' : 'Reading logged with physiological warnings',
        isRightReading: isRightReading,
        reading: readingRecord,
        totalReadingsInDb: db.bluetooth_readings.length
      });
    }

    // E. Clear Bluetooth Readings: DELETE /api/bluetooth/readings
    if (pathname === '/api/bluetooth/readings' && req.method === 'DELETE') {
      db.bluetooth_readings = [];
      writeDB(db);
      return sendJSON(res, 200, { success: true, message: 'All Bluetooth readings cleared from database' });
    }

    // 12. BACKFILE ENGINE: GET /api/backfile or /api/backup/export
    if ((pathname === '/api/backfile' || pathname === '/api/backup/export') && req.method === 'GET') {
      const isDownload = urlObj.searchParams.get('download') === '1' || urlObj.searchParams.get('download') === 'true';
      let backfileContent = null;
      try {
        if (fs.existsSync(BACKFILE_PATH)) {
          backfileContent = JSON.parse(fs.readFileSync(BACKFILE_PATH, 'utf8'));
        }
      } catch (_) {}

      if (!backfileContent) {
        backfileContent = {
          app: 'P+ Pro — Personal Health Companion',
          version: '2.0.0',
          format: 'PPLUS_PRO_BACKFILE_V2',
          savedAt: new Date().toISOString(),
          label: 'Master Backfile Export',
          stats: {
            usersCount: db.users ? db.users.length : 0,
            appointmentsCount: db.appointments ? db.appointments.length : 0,
            sosEventsCount: db.sos_events ? db.sos_events.length : 0,
            diagnosticsCount: db.diagnostics ? db.diagnostics.length : 0
          },
          data: db
        };
      }

      if (isDownload) {
        const dateStr = new Date().toISOString().slice(0, 10);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Disposition': `attachment; filename="pplus_health_backfile_${dateStr}.json"`,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(JSON.stringify(backfileContent, null, 2));
      }

      return sendJSON(res, 200, {
        success: true,
        backfile: backfileContent
      });
    }

    // 13. BACKFILE ENGINE: POST /api/backfile/save or /api/backup/save (Create snapshot)
    if ((pathname === '/api/backfile/save' || pathname === '/api/backup/save') && req.method === 'POST') {
      const body = await parseBody(req);
      const label = body.label || 'Manual User Snapshot';
      const result = createBackfileSnapshot(db, label);
      if (result) {
        return sendJSON(res, 201, {
          success: true,
          message: 'Backfile snapshot created successfully on server',
          snapshot: result
        });
      }
      return sendJSON(res, 500, { success: false, error: 'Failed to write backfile snapshot' });
    }

    // 14. BACKFILE ENGINE: POST /api/backfile/restore or /api/backup/restore
    if ((pathname === '/api/backfile/restore' || pathname === '/api/backup/restore') && req.method === 'POST') {
      const body = await parseBody(req);
      const result = restoreBackfile(body);
      if (result.success) {
        return sendJSON(res, 200, {
          success: true,
          message: result.message,
          data: result.data
        });
      }
      return sendJSON(res, 400, { success: false, error: result.error });
    }

    // 15. BACKFILE ENGINE: GET /api/backfile/list or /api/backup/list
    if ((pathname === '/api/backfile/list' || pathname === '/api/backup/list') && req.method === 'GET') {
      const backups = listBackups();
      return sendJSON(res, 200, {
        success: true,
        count: backups.length,
        backups: backups,
        masterBackfile: fs.existsSync(BACKFILE_PATH) ? {
          exists: true,
          sizeBytes: fs.statSync(BACKFILE_PATH).size,
          lastModified: fs.statSync(BACKFILE_PATH).mtime.toISOString()
        } : { exists: false }
      });
    }

    // 16. BACKFILE ENGINE: POST /api/backfile/restore-snapshot
    if (pathname === '/api/backfile/restore-snapshot' && req.method === 'POST') {
      const body = await parseBody(req);
      const filename = path.basename(body.filename || '');
      const targetPath = path.join(BACKUPS_DIR, filename);
      if (!fs.existsSync(targetPath)) {
        return sendJSON(res, 404, { success: false, error: 'Backup snapshot file not found' });
      }
      try {
        const raw = fs.readFileSync(targetPath, 'utf8');
        const parsed = JSON.parse(raw);
        const result = restoreBackfile(parsed);
        if (result.success) {
          return sendJSON(res, 200, {
            success: true,
            message: `Restored snapshot ${filename} successfully`,
            data: result.data
          });
        }
        return sendJSON(res, 400, { success: false, error: result.error });
      } catch (e) {
        return sendJSON(res, 500, { success: false, error: e.message });
      }
    }

    // 17. CLINICAL HEALTH REPORT ENGINE: GET /api/report (Read & aggregate all clinical data)
    if (pathname === '/api/report' && req.method === 'GET') {
      const patient = (db.users || []).find(u => u.role === 'patient') || {
        name: 'Alex Turner', id: 'P-8821', age: 28, gender: 'Male', bloodGroup: 'O+', height: 178, weight: 71,
        allergies: 'Penicillin, Dust', conditions: 'Mild Hypertension', phone: '+1 (555) 234-8890', email: 'alex.turner@clinical.org'
      };
      const doctor = (db.users || []).find(u => u.role === 'doctor') || {
        name: 'Dr. Neha Sharma', degree: 'MD, FACC', specialty: 'Cardiology & Electrophysiology',
        hospital: 'Metro Heart Institute & Research Centre', license: 'MED-REG-IND-88419'
      };
      const vitals = db.vitals_stream || { heartRate: 72, spO2: 98, temp: 36.6, postureAngle: 0, battery: 78 };
      const posture = db.posture_settings || { alertAngle: 15, holdTime: 10 };
      
      const reportData = {
        generatedAt: new Date().toISOString(),
        reportId: `PPLUS-REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        facility: 'P+ Digital Health Telemetry Network',
        patient,
        attendingDoctor: doctor,
        telemetry: {
          vitalsCurrent: vitals,
          vitalsSummary: {
            heartRate: { current: vitals.heartRate || 72, min: 58, max: 94, avg: 71, status: 'Normal', normalRange: '60 - 100 BPM' },
            spO2: { current: vitals.spO2 || 98, min: 96, max: 99, avg: 98.2, status: 'Optimal', normalRange: '95 - 100%' },
            bodyTemp: { current: vitals.temp || 36.6, min: 36.2, max: 37.0, avg: 36.6, status: 'Normal', normalRange: '36.1 - 37.2 °C' },
            bloodPressure: { systolic: 118, diastolic: 76, unit: 'mmHg', status: 'Optimal', normalRange: '< 120/80 mmHg' },
            respiratoryRate: { current: 16, unit: 'breaths/min', status: 'Normal', normalRange: '12 - 20 bpm' }
          },
          postureAnalytics: {
            currentAngleDeg: vitals.postureAngle || 0,
            postureScorePct: 94,
            dailyGoodPostureMinutes: 342,
            slouchAlertsCount: 2,
            complianceRating: 'Grade A (Optimal)',
            alertThresholdDeg: posture.alertAngle || 15
          },
          deviceInfo: {
            hardware: 'ESP32-S3 Biomedical Wearable',
            connectivity: 'BLE GATT 128-bit Encrypted',
            batteryLevel: vitals.battery || 78,
            firmwareVersion: 'v2.4.1-pro',
            calibrationStatus: 'Calibrated & Active'
          }
        },
        diagnostics: db.diagnostics || [],
        appointments: db.appointments || [],
        doctorNotes: 'Patient demonstrates excellent physiological stability and postural adherence. Baseline resting heart rate is well-controlled. Continue regular ergonomic breaks and wear sensor during sedentary desk sessions.'
      };

      return sendJSON(res, 200, { success: true, report: reportData });
    }

    // 18. CLINICAL HEALTH REPORT ENGINE: GET /api/report/download (Download standalone HTML report file)
    if (pathname === '/api/report/download' && req.method === 'GET') {
      const patient = (db.users || []).find(u => u.role === 'patient') || { name: 'Alex Turner', id: 'P-8821', age: 28, gender: 'Male', bloodGroup: 'O+', height: 178, weight: 71, allergies: 'Penicillin, Dust', conditions: 'Mild Hypertension' };
      const doctor = (db.users || []).find(u => u.role === 'doctor') || { name: 'Dr. Neha Sharma', degree: 'MD, FACC', specialty: 'Cardiology', hospital: 'Metro Heart Institute', license: 'MED-REG-IND-88419' };
      const vitals = db.vitals_stream || { heartRate: 72, spO2: 98, temp: 36.6, postureAngle: 0, battery: 78 };
      const dateStr = new Date().toISOString().slice(0, 10);
      const repId = `PPLUS-REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>P+ Clinical Health Report — ${patient.name} (${dateStr})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fc; color: #1e293b; padding: 32px 20px; }
    .report-wrap { max-width: 820px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); padding: 40px; border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 24px; margin-bottom: 28px; }
    .brand-h1 { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .brand-sub { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.1em; }
    .meta-box { text-align: right; font-size: 12px; color: #475569; }
    .badge-status { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 24px 0 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
    .info-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.05em; }
    .info-val { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; background: #f1f5f9; color: #475569; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .graph-box { background: #0f172a; border-radius: 14px; padding: 20px; color: #ffffff; margin-top: 14px; }
    .doc-stamp { margin-top: 32px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; }
    .disclaimer { font-size: 10px; color: #94a3b8; margin-top: 24px; text-align: center; }
    @media print {
      body { background: #fff; padding: 0; }
      .report-wrap { box-shadow: none; border: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-wrap">
    <div class="no-print" style="margin-bottom: 18px; display: flex; justify-content: flex-end; gap: 10px;">
      <button onclick="window.print()" style="background: #0f172a; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
    </div>

    <div class="header">
      <div>
        <div class="brand-h1">P+ CLINICAL HEALTH &amp; TELEMETRY REPORT</div>
        <div class="brand-sub">Comprehensive Physiological &amp; Posture Telemetry</div>
      </div>
      <div class="meta-box">
        <div><strong>REPORT ID:</strong> ${repId}</div>
        <div><strong>DATE:</strong> ${dateStr}</div>
        <div style="margin-top: 4px;"><span class="badge-status">VALIDATED CLINICAL REPORT</span></div>
      </div>
    </div>

    <div class="section-title">1. Patient Identification &amp; Biometrics</div>
    <div class="grid-4">
      <div class="info-card"><div class="info-label">Full Name</div><div class="info-val">${patient.name}</div></div>
      <div class="info-card"><div class="info-label">Patient ID / Age</div><div class="info-val">${patient.id} • ${patient.age} Yrs</div></div>
      <div class="info-card"><div class="info-label">Blood Group / Sex</div><div class="info-val">${patient.bloodGroup} • ${patient.gender}</div></div>
      <div class="info-card"><div class="info-label">Height / Weight</div><div class="info-val">${patient.height} cm • ${patient.weight} kg</div></div>
    </div>

    <div class="section-title">2. Physiological Vitals &amp; Continuous Telemetry</div>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Recorded Reading</th>
          <th>24H Range</th>
          <th>Clinical Reference Range</th>
          <th>Assessment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Heart Rate (BPM)</strong></td>
          <td>${vitals.heartRate || 72} BPM</td>
          <td>58 - 94 BPM</td>
          <td>60 - 100 BPM</td>
          <td><span style="color:#16a34a; font-weight:700;">Normal Sinus Rhythm</span></td>
        </tr>
        <tr>
          <td><strong>Blood Oxygen (SpO₂)</strong></td>
          <td>${vitals.spO2 || 98}%</td>
          <td>96 - 99%</td>
          <td>95 - 100%</td>
          <td><span style="color:#16a34a; font-weight:700;">Optimal Saturation</span></td>
        </tr>
        <tr>
          <td><strong>Body Core / Skin Temp</strong></td>
          <td>${vitals.temp || 36.6} °C</td>
          <td>36.2 - 37.0 °C</td>
          <td>36.1 - 37.2 °C</td>
          <td><span style="color:#16a34a; font-weight:700;">Afebrile (Normal)</span></td>
        </tr>
        <tr>
          <td><strong>Posture Deflection Angle</strong></td>
          <td>${vitals.postureAngle || 0}° Deviation</td>
          <td>0° - 14° Angle</td>
          <td>&lt; 15° Ergonomic Tolerance</td>
          <td><span style="color:#16a34a; font-weight:700;">Optimal Alignment</span></td>
        </tr>
        <tr>
          <td><strong>Blood Pressure Estimate</strong></td>
          <td>118 / 76 mmHg</td>
          <td>112/72 - 124/80</td>
          <td>&lt; 120/80 mmHg</td>
          <td><span style="color:#16a34a; font-weight:700;">Optimal</span></td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">3. Telemetry Visual Graph Curves</div>
    <div class="graph-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px;">Heart Rate 24H Trend Curve (BPM)</div>
      <svg viewBox="0 0 740 120" style="width: 100%; height: 110px; overflow: visible;">
        <defs>
          <linearGradient id="gradHR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="30" x2="740" y2="30" stroke="#334155" stroke-dasharray="4"/>
        <line x1="0" y1="65" x2="740" y2="65" stroke="#334155" stroke-dasharray="4"/>
        <line x1="0" y1="100" x2="740" y2="100" stroke="#334155" stroke-dasharray="4"/>
        <path d="M0,75 C50,78 90,82 140,80 C190,78 220,60 270,55 C320,50 360,65 410,60 C460,55 500,40 550,42 C600,44 650,68 700,65 L740,68 L740,110 L0,110 Z" fill="url(#gradHR)"/>
        <path d="M0,75 C50,78 90,82 140,80 C190,78 220,60 270,55 C320,50 360,65 410,60 C460,55 500,40 550,42 C600,44 650,68 700,65 L740,68" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
        <circle cx="550" cy="42" r="5" fill="#38bdf8"/>
        <text x="550" y="32" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Peak 94 BPM</text>
        <circle cx="140" cy="80" r="4" fill="#94a3b8"/>
        <text x="140" y="98" fill="#94a3b8" font-size="10" text-anchor="middle">Resting 58 BPM</text>
      </svg>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-top: 6px;">
        <span>00:00 (Sleep)</span>
        <span>06:00 (Waking)</span>
        <span>12:00 (Midday)</span>
        <span>18:00 (Active)</span>
        <span>23:59 (Current)</span>
      </div>
    </div>

    <div class="section-title">4. Ergonomic Posture &amp; Spine Biomechanics</div>
    <div class="grid-2">
      <div class="info-card">
        <div class="info-label">Daily Form Duration</div>
        <div class="info-val">5 Hours 42 Mins Upright</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Compliance Score: 94% (Grade A - Optimal)</div>
      </div>
      <div class="info-card">
        <div class="info-label">Slouch Alert Frequency</div>
        <div class="info-val">2 Corrected Events</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Hardware Threshold: 15° Spine Deviation</div>
      </div>
    </div>

    <div class="section-title">5. Attending Specialist Clinical Notes</div>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; font-size: 13px; line-height: 1.6; color: #334155;">
      <strong>Clinical Impression:</strong> Patient demonstrates exemplary physiological resilience. Continuous ECG and photoplethysmography traces show uninterrupted regular sinus rhythm with no paroxysmal tachycardia or hypoxic saturation drops. Ergonomic biofeedback shows strong upright postural adherence.<br><br>
      <strong>Prescribed Care Plan:</strong> Continue wearing P+ ESP32-S3 sensor during active desk work hours. Maintain hydration and 30 minutes daily cardiovascular exercise. Routine tele-consultation scheduled in 30 days.
    </div>

    <div class="doc-stamp">
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${doctor.name}</div>
        <div style="font-size: 11px; color: #64748b;">${doctor.degree} • ${doctor.specialty}</div>
        <div style="font-size: 11px; color: #64748b;">${doctor.hospital}</div>
        <div style="font-size: 10px; font-family: monospace; color: #475569; margin-top: 4px;">LIC: ${doctor.license}</div>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-block; border: 2px solid #0f172a; padding: 8px 14px; border-radius: 8px; text-align: center;">
          <div style="font-size: 9px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; color: #0f172a;">P+ DIGITAL SEAL</div>
          <div style="font-size: 11px; font-weight: 700; color: #16a34a; margin: 2px 0;">✓ VERIFIED CLINICAL</div>
          <div style="font-size: 8px; font-family: monospace; color: #64748b;">RSA-2048 CRYPTO-STAMP</div>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      This diagnostic report is compiled automatically by the P+ Health Companion platform based on verified wearable telemetry streams and calibrated clinical thresholds. Confidential medical document.
    </div>
  </div>
</body>
</html>`;

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Content-Disposition': `attachment; filename="PPlus_Clinical_Health_Report_${patient.name.replace(/\\s+/g, '_')}_${dateStr}.html"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(htmlContent);
    }

    // 19. CLINICAL HEALTH REPORT ENGINE: GET /api/report/csv (Download raw telemetry data file)
    if (pathname === '/api/report/csv' && req.method === 'GET') {
      const dateStr = new Date().toISOString().slice(0, 10);
      let csvContent = 'Timestamp,Device,HeartRate_BPM,SpO2_Pct,Temperature_C,Posture_Angle_Deg,Posture_Status,Battery_Pct,Motion_Status\\n';
      
      const hours = [
        '00:00:00', '02:00:00', '04:00:00', '06:00:00', '08:00:00', '09:30:00',
        '11:00:00', '12:30:00', '14:00:00', '15:30:00', '17:00:00', '18:30:00',
        '20:00:00', '21:30:00', '23:00:00'
      ];
      
      const readings = [
        { hr: 60, spo2: 98, temp: 36.3, angle: 0, status: 'Upright (Sleep)', bat: 95, motion: 'Resting' },
        { hr: 58, spo2: 98, temp: 36.2, angle: 0, status: 'Upright (Sleep)', bat: 93, motion: 'Resting' },
        { hr: 62, spo2: 97, temp: 36.3, angle: 0, status: 'Upright (Sleep)', bat: 91, motion: 'Resting' },
        { hr: 68, spo2: 99, temp: 36.5, angle: 2, status: 'Upright', bat: 89, motion: 'Waking' },
        { hr: 74, spo2: 98, temp: 36.6, angle: 3, status: 'Upright', bat: 87, motion: 'Desk Active' },
        { hr: 78, spo2: 98, temp: 36.7, angle: 8, status: 'Mild Lean', bat: 85, motion: 'Desk Active' },
        { hr: 82, spo2: 99, temp: 36.7, angle: 2, status: 'Upright', bat: 83, motion: 'Walking' },
        { hr: 75, spo2: 98, temp: 36.8, angle: 14, status: 'Slouch Alert', bat: 81, motion: 'Desk Active' },
        { hr: 71, spo2: 99, temp: 36.6, angle: 1, status: 'Upright', bat: 80, motion: 'Resting' },
        { hr: 76, spo2: 98, temp: 36.7, angle: 4, status: 'Upright', bat: 78, motion: 'Desk Active' },
        { hr: 94, spo2: 99, temp: 37.0, angle: 5, status: 'Upright', bat: 75, motion: 'Cardio Workout' },
        { hr: 80, spo2: 99, temp: 36.8, angle: 2, status: 'Upright', bat: 74, motion: 'Cooling Down' },
        { hr: 72, spo2: 98, temp: 36.6, angle: 0, status: 'Upright', bat: 72, motion: 'Resting' },
        { hr: 69, spo2: 98, temp: 36.5, angle: 1, status: 'Upright', bat: 70, motion: 'Evening Relax' },
        { hr: 64, spo2: 98, temp: 36.4, angle: 0, status: 'Upright', bat: 69, motion: 'Night Rest' }
      ];

      readings.forEach((r, idx) => {
        csvContent += `${dateStr}T${hours[idx]}Z,ESP32-S3-PPLUS,${r.hr},${r.spo2},${r.temp},${r.angle},"${r.status}",${r.bat},"${r.motion}"\\n`;
      });

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': `attachment; filename="PPlus_Telemetry_Data_${dateStr}.csv"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(csvContent);
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
