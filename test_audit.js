const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

// Find all forms
const formRegex = /<form\b([^>]*)>/g;
let m;
const forms = [];
while ((m = formRegex.exec(html)) !== null) {
  const line = html.substring(0, m.index).split('\n').length;
  forms.push({ line, tag: m[0] });
}

console.log('Forms found (' + forms.length + '):');
forms.forEach(f => {
  console.log(`Line ${f.line}: ${f.tag}`);
});
