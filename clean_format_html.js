const fs = require('fs');

const originalHtml = fs.readFileSync('index.html', 'utf8');

// Step 1: Collect all IDs from original
const origIds = [...originalHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Original IDs count:', origIds.length);

// Step 2: Clean up multi-line opening tags: <tag attr1\n  attr2="val"> -> <tag attr1 attr2="val">
let cleaned = originalHtml.replace(/<([a-zA-Z0-9\-]+)([^>]*?)>/gs, (match, tagName, attrs) => {
  if (match.startsWith('<!--')) return match;
  // If attrs has newlines, replace them with a single space
  const normalizedAttrs = attrs.replace(/\r?\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
  if (normalizedAttrs.length > 0) {
    return `<${tagName} ${normalizedAttrs}>`;
  }
  return `<${tagName}>`;
});

// Step 3: Collapse inline simple elements where opening, text, and closing are needlessly on 3 lines
// e.g. <span class="...">\n  text\n</span> -> <span class="...">text</span>
cleaned = cleaned.replace(/<span([^>]*)>\s*\n\s*([^<>\n]+)\s*\n\s*<\/span>/g, '<span$1>$2</span>');
cleaned = cleaned.replace(/<h([1-6])([^>]*)>\s*\n\s*([^<>\n]+)\s*\n\s*<\/h\1>/g, '<h$1$2>$3</h$1>');
cleaned = cleaned.replace(/<p([^>]*)>\s*\n\s*([^<>\n]+)\s*\n\s*<\/p>/g, '<p$1>$2</p>');

// Step 4: Collapse multiple blank lines to at most 1 blank line
cleaned = cleaned.replace(/(\r?\n\s*){3,}/g, '\n\n');

// Step 5: Trim trailing whitespace on each line
const lines = cleaned.split('\n').map(l => l.trimEnd());
cleaned = lines.join('\n').trim() + '\n';

// Step 6: Validate IDs
const newIds = [...cleaned.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
const missingIds = origIds.filter(id => !newIds.includes(id));
if (missingIds.length > 0) {
  console.error('ERROR: Missing IDs!', missingIds);
  process.exit(1);
}

const origLines = originalHtml.split('\n').length;
const newLines = cleaned.split('\n').length;
console.log(`Success! Original lines: ${origLines} -> Cleaned lines: ${newLines}`);
console.log('All IDs verified 100% intact.');

fs.writeFileSync('index.html', cleaned, 'utf8');
