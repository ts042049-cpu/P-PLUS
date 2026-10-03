const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// Find all function calls in inline event handlers
const eventRegex = /on(?:click|submit|change|input|keyup|keydown)="([^"]+)"/g;
let match;
const calledFns = new Set();
while ((match = eventRegex.exec(html)) !== null) {
  const code = match[1];
  const re = /([a-zA-Z0-9_$]+)\s*\(/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    calledFns.add(m[1]);
  }
}

const builtins = new Set(['parseInt', 'parseFloat', 'alert', 'confirm', 'prompt', 'preventDefault', 'stopPropagation', 'encodeURIComponent', 'decodeURIComponent', 'if', 'getElementById']);

console.log('Total functions called in HTML inline handlers:', calledFns.size);

const missingInAppJs = [];
const definedInAppJs = [];

calledFns.forEach(fn => {
  if (builtins.has(fn)) return;
  // Look for: window.fn = OR function fn( OR const fn = OR let fn =
  const hasWin = js.includes('window.' + fn + ' =') || js.includes('window.' + fn + '=');
  const hasFn = new RegExp('\\bfunction\\s+' + fn + '\\s*\\(').test(js);
  const hasConst = new RegExp('\\bconst\\s+' + fn + '\\s*=').test(js);
  const hasLet = new RegExp('\\blet\\s+' + fn + '\\s*=').test(js);
  
  if (hasWin || hasFn || hasConst || hasLet) {
    // If defined inside IIFE, check if it's exported to window
    if (!hasWin) {
      console.warn(`WARNING: ${fn} is defined in app.js but NOT exported to window! Inline onclick will throw ReferenceError!`);
    } else {
      definedInAppJs.push(fn);
    }
  } else {
    missingInAppJs.push(fn);
  }
});

console.log('\nDEFINED & EXPORTED TO WINDOW (' + definedInAppJs.length + '):', definedInAppJs);
console.log('\nTRULY MISSING FUNCTIONS (' + missingInAppJs.length + '):', missingInAppJs);
