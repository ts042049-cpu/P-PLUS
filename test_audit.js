const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const eventRegex = /on(?:click|submit|change|input|keyup|keydown)="([^"]+)"/g;
let match;
const handlers = [];
while ((match = eventRegex.exec(html)) !== null) {
  handlers.push({ code: match[1], line: html.substring(0, match.index).split('\n').length });
}

const calledFns = new Set();
handlers.forEach(h => {
  const matches = h.code.match(/([a-zA-Z0-9_$]+)\s*\(/g);
  if (matches) {
    matches.forEach(m => calledFns.add(m.replace('(', '').trim()));
  }
});

const builtins = new Set(['parseInt', 'parseFloat', 'alert', 'confirm', 'prompt', 'preventDefault', 'stopPropagation', 'encodeURIComponent', 'decodeURIComponent']);
console.log('Unique functions called from inline handlers:');
const missing = [];
calledFns.forEach(fn => {
  if (builtins.has(fn)) return;
  // Does window[fn] exist or is window.fn = ... in app.js or index.html?
  const regex = new RegExp('(?:window\\.' + fn + '\\s*=|function\\s+' + fn + '\\b)');
  const inJs = regex.test(js);
  const inHtml = regex.test(html);
  if (!inJs && !inHtml) {
    missing.push(fn);
  }
});

console.log('Truly missing functions (not defined via function or window.fn):', missing);
