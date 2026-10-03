const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const findLines = (str, file, label) => {
  file.split('\n').forEach((l, i) => {
    if (l.includes(str)) {
      console.log(label + ' line ' + (i+1) + ': ' + l.trim());
    }
  });
};

findLines('screen-chat', html, 'index.html');
findLines('screen-chat', js, 'app.js');
findLines('screen-consultation', html, 'index.html');
findLines('screen-consultation', js, 'app.js');
