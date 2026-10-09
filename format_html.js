const fs = require('fs');

const original = fs.readFileSync('index.html', 'utf8');

// Function to join multi-line opening tags
function joinMultiLineTags(html) {
  // Regex to match tags from < until > where it contains newlines, but not inside comments or scripts
  return html.replace(/<([a-zA-Z0-9\-]+)([^>]*?)>/gs, (match, tagName, attrs) => {
    if (match.startsWith('<!--')) return match;
    // Replace newlines and excessive whitespace inside tag attributes with a single space
    const cleanedAttrs = attrs.replace(/\r?\n\s*/g, ' ').trim();
    if (cleanedAttrs.length > 0) {
      return `<${tagName} ${cleanedAttrs}>`;
    } else {
      return `<${tagName}>`;
    }
  });
}

// Function to collapse excessive blank lines (more than 1 empty line in a row)
function collapseBlankLines(html) {
  return html.replace(/(\r?\n\s*){3,}/g, '\n\n');
}

let result = joinMultiLineTags(original);
result = collapseBlankLines(result);

// Also compact simple 1-child button / span / link elements if clean
const linesBefore = original.split('\n').length;
const linesAfter = result.split('\n').length;

console.log('Original lines:', linesBefore);
console.log('Cleaned lines:', linesAfter);

fs.writeFileSync('index_formatted_test.html', result, 'utf8');
