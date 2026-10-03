const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// 1. Find all inline handlers in index.html
const eventRegex = /on(?:click|submit|change|input|keyup|keydown)="([^"]+)"/g;
let match;
const inlineCalls = new Set();
while ((match = eventRegex.exec(html)) !== null) {
  const code = match[1].trim();
  const fnMatches = code.match(/([a-zA-Z0-9_$]+)\s*\(/g);
  if (fnMatches) {
    fnMatches.forEach(f => inlineCalls.add(f.replace('(', '').trim()));
  }
}

console.log('--- Inline event functions called in index.html (' + inlineCalls.size + ') ---');
const missingFns = [];
const nonExportedFns = [];

inlineCalls.forEach(fn => {
  // Builtins like parseInt, alert, confirm, prompt, event.preventDefault, etc.
  if (['parseInt', 'parseFloat', 'alert', 'confirm', 'prompt', 'preventDefault', 'stopPropagation', 'encodeURIComponent', 'decodeURIComponent'].includes(fn)) return;
  
  // Check if defined in js or html
  const inJsDef = new RegExp('(function\\s+' + fn + '\\b|const\\s+' + fn + '\\s*=|let\\s+' + fn + '\\s*=|var\\s+' + fn + '\\s*=)').test(js);
  const inHtmlDef = new RegExp('(function\\s+' + fn + '\\b|window\\.' + fn + '\\s*=)').test(html);
  
  if (!inJsDef && !inHtmlDef) {
    missingFns.push(fn);
  } else if (!inHtmlDef) {
    // Check if exported to window in app.js
    const isExported = new RegExp('window\\.' + fn + '\\s*=').test(js) || new RegExp('^function\\s+' + fn, 'm').test(js);
    // Since app.js might be wrapped in an IIFE or DOMContentLoaded, let's check
    if (!new RegExp('window\\.' + fn + '\\s*=').test(js)) {
      nonExportedFns.push(fn);
    }
  }
});

console.log('Completely Missing Functions:', missingFns);
console.log('Functions in app.js that may NOT be attached to window (could fail if called inline):', nonExportedFns);

// 2. Check getElementById in app.js
const getElemRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const elemIdsInJs = new Set();
while ((match = getElemRegex.exec(js)) !== null) {
  elemIdsInJs.add(match[1]);
}

console.log('\n--- Checking getElementById in app.js (' + elemIdsInJs.size + ' unique IDs) ---');
const missingIds = [];
elemIdsInJs.forEach(id => {
  if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'")) {
    missingIds.push(id);
  }
});
console.log('IDs in app.js not found in index.html:', missingIds);

// 3. Check querySelector / querySelectorAll with ID in app.js
const qsIdRegex = /querySelector(?:All)?\(['"]#([a-zA-Z0-9_\-]+)['"]\)/g;
const qsIdsInJs = new Set();
while ((match = qsIdRegex.exec(js)) !== null) {
  qsIdsInJs.add(match[1]);
}
const missingQsIds = [];
qsIdsInJs.forEach(id => {
  if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'")) {
    missingQsIds.push(id);
  }
});
console.log('IDs in querySelector not found in index.html:', missingQsIds);
