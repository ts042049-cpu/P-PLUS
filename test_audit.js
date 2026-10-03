const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all buttons with onclick
const regex = /<button\b[^>]*onclick="([^"]*)"[^>]*>/g;
let m;
const list = [];
while ((m = regex.exec(html)) !== null) {
  const line = html.substring(0, m.index).split('\n').length;
  list.push({ line, onclick: m[1] });
}

console.log('Total button onclicks found: ' + list.length);
// Check if any onclick calls navigateTo with a non-existent screen
const validScreens = [
  'screen-login', 'screen-home', 'screen-live', 'screen-posture',
  'screen-risk', 'screen-sos', 'screen-doctors', 'screen-find',
  'screen-profile', 'screen-graphs'
];

list.forEach(item => {
  const navMatch = item.onclick.match(/navigateTo\(['"]([^'"]+)['"]\)/);
  if (navMatch) {
    const target = navMatch[1];
    if (!validScreens.includes(target)) {
      console.log(`INVALID navigateTo on line ${item.line}: ${item.onclick}`);
    }
  }
});
