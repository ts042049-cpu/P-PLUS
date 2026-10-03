const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const modals = [
  'clinical-report-modal',
  'booking-modal',
  'register-modal',
  'edit-profile-modal',
  'avatar-modal',
  'esp32-ble-modal',
  'theme-selector-modal',
  'notifications-modal'
];

modals.forEach(id => {
  console.log(`\n=== Modal: ${id} ===`);
  const lines = js.split('\n');
  lines.forEach((l, i) => {
    if (l.includes(id)) {
      console.log(`  Line ${i+1}: ${l.trim()}`);
    }
  });
});
