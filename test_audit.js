const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /data-navigate="([^"]+)"/g;
let m;
const targets = new Set();
while ((m = regex.exec(html)) !== null) {
  targets.add(m[1]);
}
console.log('data-navigate targets:', Array.from(targets));
const validScreens = [
  'back', 'screen-login', 'screen-home', 'screen-live', 'screen-posture',
  'screen-risk', 'screen-sos', 'screen-doctors', 'screen-find',
  'screen-profile', 'screen-graphs'
];

targets.forEach(t => {
  if (!validScreens.includes(t)) {
    console.log(`INVALID data-navigate: ${t}`);
  }
});
