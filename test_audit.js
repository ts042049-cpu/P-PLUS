const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// Find all addEventListener calls in app.js
const listenerRegex = /([a-zA-Z0-9_$.]+)\.addEventListener\(['"]([^'"]+)['"]/g;
let m;
console.log('Event listeners in app.js:');
while ((m = listenerRegex.exec(js)) !== null) {
  console.log(`  ${m[1]}.addEventListener('${m[2]}')`);
}

// Find all event delegations on document or window
const docListenerRegex = /document\.addEventListener\(['"]([^'"]+)['"]/g;
while ((m = docListenerRegex.exec(js)) !== null) {
  console.log(`  document.addEventListener('${m[1]}')`);
}
