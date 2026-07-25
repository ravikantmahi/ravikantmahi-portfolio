/**
 * generate-config.js
 * ==================
 * Reads Firebase credentials from .env and writes firebase-config.js
 *
 * Usage:
 *   node generate-config.js
 *
 * Run this once after cloning, or whenever you update .env
 */

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌  .env file not found!');
    console.error('    Copy .env.example → .env and fill in your Firebase credentials.');
    process.exit(1);
}

// Parse .env manually (no external packages needed)
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    if (key) env[key.trim()] = rest.join('=').trim();
});

// Validate all required keys exist
const required = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID'
];

const missing = required.filter(k => !env[k] || env[k].startsWith('YOUR_'));
if (missing.length > 0) {
    console.error('❌  Missing or placeholder values in .env:');
    missing.forEach(k => console.error(`    - ${k}`));
    process.exit(1);
}

// Generate firebase-config.js
const output = `// ============================================================
//  firebase-config.js  —  AUTO-GENERATED from .env
//  DO NOT edit manually — run: node generate-config.js
//  This file is listed in .gitignore
// ============================================================

export const firebaseConfig = {
    apiKey:            "${env.FIREBASE_API_KEY}",
    authDomain:        "${env.FIREBASE_AUTH_DOMAIN}",
    projectId:         "${env.FIREBASE_PROJECT_ID}",
    storageBucket:     "${env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
    appId:             "${env.FIREBASE_APP_ID}",
    measurementId:     "${env.FIREBASE_MEASUREMENT_ID}"
};
`;

const outputPath = path.join(__dirname, 'firebase-config.js');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('✅  firebase-config.js generated successfully from .env');
console.log(`    Project: ${env.FIREBASE_PROJECT_ID}`);
