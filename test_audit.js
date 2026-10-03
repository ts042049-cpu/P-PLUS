const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const checkFunctionIds = (fnName) => {
  console.log(`\n=== Checking IDs queried in ${fnName} ===`);
  const fnStart = js.indexOf(`function ${fnName}`);
  if (fnStart === -1) {
    console.log(`Function ${fnName} not found!`);
    return;
  }
  const fnBody = js.slice(fnStart, fnStart + 3000).split('function ')[1] || js.slice(fnStart, fnStart + 3000);
  const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
  let m;
  const ids = new Set();
  while ((m = idRegex.exec(fnBody)) !== null) {
    ids.add(m[1]);
  }
  ids.forEach(id => {
    const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    if (!exists) {
      console.log(`  MISSING ID in index.html: #${id}`);
    } else {
      console.log(`  OK: #${id}`);
    }
  });
};

checkFunctionIds('handleLoginSubmit');
checkFunctionIds('handlePatientRegistration');
checkFunctionIds('handleDoctorRegistration');
checkFunctionIds('saveProfileDetails');
checkFunctionIds('saveDoctorProfileDetails');
