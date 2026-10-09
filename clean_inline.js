const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace style="font-variation-settings: 'FILL' 1;"
html = html.replace(/class="([^"]*material-symbols-outlined[^"]*)"\s+style="font-variation-settings:\s*'FILL'\s*1;?"/g, 'class="$1 icon-filled"');
html = html.replace(/style="font-variation-settings:\s*'FILL'\s*1;?"\s+class="([^"]*material-symbols-outlined[^"]*)"/g, 'class="$1 icon-filled"');

// Replace SOS ring inline styles
html = html.replace(
  'class="absolute rounded-full bg-[#e5ecfa]/65 shadow-md transition-all duration-500" id="sos-ring-outer" style="width: 13.5rem; height: 13.5rem;"',
  'class="absolute rounded-full bg-[#e5ecfa]/65 shadow-md transition-all duration-500 sos-ring-outer-size" id="sos-ring-outer"'
);

html = html.replace(
  'class="absolute rounded-full bg-[#dbe4f8]/80 transition-all duration-500" id="sos-ring-mid" style="width: 11rem; height: 11rem;"',
  'class="absolute rounded-full bg-[#dbe4f8]/80 transition-all duration-500 sos-ring-mid-size" id="sos-ring-mid"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully replaced recurring inline styles with CSS classes in index.html');
