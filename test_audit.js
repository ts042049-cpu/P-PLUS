const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// 1. Find all inline handlers in index.html and check their syntax
const eventRegex = /on(?:click|submit|change|input|keyup|keydown)="([^"]+)"/g;
let match;
const handlers = [];
while ((match = eventRegex.exec(html)) !== null) {
  handlers.push({ code: match[1], line: html.substring(0, match.index).split('\n').length });
}

console.log('Total inline event handlers found:', handlers.length);
let syntaxErrors = 0;
handlers.forEach(h => {
  try {
    new Function('event', h.code);
  } catch (err) {
    syntaxErrors++;
    console.error('SYNTAX ERROR on line ' + h.line + ': ' + h.code + ' -> ' + err.message);
  }
});
if (syntaxErrors === 0) {
  console.log('All inline event handler snippets are valid JavaScript syntax!');
}

// 2. Extract every function called
const calledFns = new Set();
handlers.forEach(h => {
  const matches = h.code.match(/([a-zA-Z0-9_$]+)\s*\(/g);
  if (matches) {
    matches.forEach(m => calledFns.add(m.replace('(', '').trim()));
  }
});

const builtins = new Set(['parseInt', 'parseFloat', 'alert', 'confirm', 'prompt', 'preventDefault', 'stopPropagation', 'encodeURIComponent', 'decodeURIComponent']);
const missing = [];
calledFns.forEach(fn => {
  if (builtins.has(fn)) return;
  // Check if defined in js
  const inJs = js.includes('function ' + fn) || js.includes('window.' + fn) || js.includes(fn + ' =');
  const inHtml = html.includes('function ' + fn) || html.includes('window.' + fn);
  if (!inJs && !inHtml) {
    missing.push(fn);
  }
});
console.log('\nMissing function definitions called in index.html:', missing);

// 3. Check all functions exported to window in app.js
const windowExports = [];
const winExportRegex = /window\.([a-zA-Z0-9_$]+)\s*=/g;
while ((match = winExportRegex.exec(js)) !== null) {
  windowExports.push(match[1]);
}
console.log('\nTotal window exports in app.js:', windowExports.length);

// Check if any missing function from index.html is in windowExports
missing.forEach(fn => {
  console.log('Needs implementation: ' + fn);
});

