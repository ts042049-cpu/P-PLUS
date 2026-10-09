const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

let currentSection = 'HEADER';
let counts = {};

lines.forEach((line, idx) => {
  const match = line.match(/<section id="([^"]+)"|<div id="([^"]+modal[^"]*)"/);
  if (match) {
    currentSection = match[1] || match[2];
  }
  counts[currentSection] = (counts[currentSection] || 0) + 1;
});

console.log(JSON.stringify(counts, null, 2));
