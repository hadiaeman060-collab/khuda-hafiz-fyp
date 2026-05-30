/**
 * encode-service-account.js
 *
 * Run this once to get your Base64-encoded service account for Back4app.
 *
 * Usage:
 *   node scripts/encode-service-account.js
 *
 * Copy the output and paste it as FIREBASE_SERVICE_ACCOUNT_BASE64
 * in your Back4app environment variables.
 */

const fs = require('fs');
const path = require('path');

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(saPath)) {
  console.error('serviceAccountKey.json not found in backend root!');
  process.exit(1);
}

const raw = fs.readFileSync(saPath, 'utf8');

// Validate it's valid JSON first
try {
  JSON.parse(raw);
} catch (e) {
  console.error('serviceAccountKey.json is not valid JSON!', e.message);
  process.exit(1);
}

const base64 = Buffer.from(raw).toString('base64');

console.log('\nYour Base64-encoded Firebase service account:\n');
console.log(base64);
console.log('\nCopy the above string and add it to Back4app as:');
console.log('   Key:   FIREBASE_SERVICE_ACCOUNT_BASE64');
console.log('   Value: (the string above)\n');
