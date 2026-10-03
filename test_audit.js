const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// 1. Screens
const screenRegex = /<section\s+id="([^"]+)"\s+class="[^"]*screen-view/g;
let m;
const screens = [];
while ((m = screenRegex.exec(html)) !== null) {
  screens.push(m[1]);
}
console.log('Screens found in index.html (' + screens.length + '):', screens);

// 2. All navigateTo calls in index.html and app.js
const navRegex = /navigateTo\(['"]([^'"]+)['"]/g;
const navTargets = new Set();
while ((m = navRegex.exec(html)) !== null) {
  navTargets.add(m[1]);
}
while ((m = navRegex.exec(js)) !== null) {
  navTargets.add(m[1]);
}

console.log('\nNav targets called (' + navTargets.size + '):', Array.from(navTargets));
const invalidScreens = [];
navTargets.forEach(target => {
  if (!screens.includes(target)) {
    invalidScreens.push(target);
  }
});

console.log('Invalid navigateTo screen targets (BUG!):', invalidScreens);
