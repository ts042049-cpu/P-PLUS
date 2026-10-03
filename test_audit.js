const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const btnRegex = /<button\b([^>]*)>/g;
let m;
let count = 0;
const inactiveButtons = [];
while ((m = btnRegex.exec(html)) !== null) {
  count++;
  const attrs = m[1];
  const hasOnclick = attrs.includes('onclick=');
  const hasTypeSubmit = attrs.includes('type="submit"') || attrs.includes("type='submit'");
  const hasId = attrs.includes('id=');
  if (!hasOnclick && !hasTypeSubmit && !hasId) {
    const line = html.substring(0, m.index).split('\n').length;
    inactiveButtons.push({ line, tag: m[0] });
  }
}

console.log(`Total buttons: ${count}`);
console.log(`Buttons without onclick, submit, or id (${inactiveButtons.length}):`);
inactiveButtons.forEach(b => console.log(`Line ${b.line}: ${b.tag}`));

// Also check anchor tags <a>
const aRegex = /<a\b([^>]*)>/g;
let aCount = 0;
const inactiveLinks = [];
while ((m = aRegex.exec(html)) !== null) {
  aCount++;
  const attrs = m[1];
  const hasOnclick = attrs.includes('onclick=');
  const hasHref = attrs.includes('href=') && !attrs.includes('href="#"') && !attrs.includes("href='#'");
  const hasId = attrs.includes('id=');
  if (!hasOnclick && !hasHref && !hasId) {
    const line = html.substring(0, m.index).split('\n').length;
    inactiveLinks.push({ line, tag: m[0] });
  }
}
console.log(`\nTotal links: ${aCount}`);
console.log(`Links without valid href or onclick (${inactiveLinks.length}):`);
inactiveLinks.forEach(l => console.log(`Line ${l.line}: ${l.tag}`));
