// // app.config.js — injects .env into Expo `extra` so the JS bundle can read runtime config
// const fs = require('fs');

// // Load dotenv if available (best-effort; dev dependency not strictly required)
// try {
//   require('dotenv').config();
// } catch (e) {
//   // dotenv not installed; rely on process.env provided by the shell
// }

// let appJson = {};
// try {
//   appJson = require('./app.json');
// } catch (e) {
//   appJson = { expo: {} };
// }

// const API_URL = process.env.API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

// appJson.expo = appJson.expo || {};
// appJson.expo.extra = Object.assign({}, appJson.expo.extra || {}, { API_URL });

// module.exports = appJson;
import 'dotenv/config';

export default {
  expo: {
    name: "KhudaHafiz",
    slug: "khuda-hafiz",
    version: "1.0.0",
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
