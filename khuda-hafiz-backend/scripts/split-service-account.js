/**
 * split-service-account.js
 *
 * Splits serviceAccountKey.json into 3 chunks for Back4app.
 *
 * Usage:
 *   node scripts/split-service-account.js
 *
 * Then add the 3 printed values as env variables in Back4app:
 *   FIREBASE_SA_CHUNK_1
 *   FIREBASE_SA_CHUNK_2
 *   FIREBASE_SA_CHUNK_3
 */

const fs = require('fs');
const path = require('path');

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(saPath)) {
  console.error('serviceAccountKey.json not found!');
  process.exit(1);
}

// Minify the JSON (remove all whitespace) to make it as short as possible
const raw = JSON.stringify(JSON.parse(fs.readFileSync(saPath, 'utf8')));

console.log(`\nTotal length: ${raw.length} characters`);

// Split into 3 equal chunks
const chunkSize = Math.ceil(raw.length / 3);
const chunk1 = raw.slice(0, chunkSize);
const chunk2 = raw.slice(chunkSize, chunkSize * 2);
const chunk3 = raw.slice(chunkSize * 2);

console.log(`\nChunk 1 (${chunk1.length} chars) - add as FIREBASE_SA_CHUNK_1:`);
console.log(chunk1);

console.log(`\nChunk 2 (${chunk2.length} chars) - add as FIREBASE_SA_CHUNK_2:`);
console.log(chunk2);

console.log(`\nChunk 3 (${chunk3.length} chars) - add as FIREBASE_SA_CHUNK_3:`);
console.log(chunk3);

console.log('\nAdd all 3 as separate env variables in Back4app.');
