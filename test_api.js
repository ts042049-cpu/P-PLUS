const fs = require('fs');

const serverJs = fs.readFileSync('server.js', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// Find all api endpoints called in app.js
const appApiRegex = /apiRequest\(['"]([^'"]+)['"]/g;
const calledEndpoints = new Set();
let m;
while ((m = appApiRegex.exec(appJs)) !== null) {
  calledEndpoints.add(m[1]);
}

console.log('API Endpoints called in app.js:', Array.from(calledEndpoints));

// Find all endpoints in server.js
const serverApiRegex = /url(?:\.startsWith|\.pathname ===| ===)\(['"]([^'"]+)['"]\)/g;
const serverEndpoints = new Set();
while ((m = serverApiRegex.exec(serverJs)) !== null) {
  serverEndpoints.add(m[1]);
}
console.log('Endpoints in server.js:', Array.from(serverEndpoints));

// Check if any called endpoint in app.js is missing from server.js
calledEndpoints.forEach(ep => {
  const baseEp = ep.split('?')[0];
  const handled = serverJs.includes(baseEp);
  console.log(`Endpoint ${ep} handled in server.js? ${handled ? 'YES' : 'NO (BUG!)'}`);
});
