require('dotenv').config({ path: './.env' }); // make sure path points to .env
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

// Environment variables used by this backend:
// - FIREBASE_API_KEY  => Firebase Web API key (used for REST sign-in)
// - FIREBASE_SERVICE_ACCOUNT (optional) => JSON string of service account credentials
// - PORT => port to listen on

const PORT = process.env.PORT || 3000;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// Initialize Firebase Admin SDK
try {
  let serviceAccount;
  const saPath = './serviceAccountKey.json';
  if (fs.existsSync(saPath)) {
    serviceAccount = require(saPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (!serviceAccount) {
    console.warn('No Firebase service account found at ./serviceAccountKey.json and FIREBASE_SERVICE_ACCOUNT env not set. Firebase Admin will not be initialized. Signup/login endpoints will fail.');
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized');
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err);
}

const app = express();
app.use(express.json());
app.use(cors());

// Helper: sign in with email/password via Firebase Auth REST API
async function signInWithEmailPassword(email, password) {
  if (!FIREBASE_API_KEY) throw new Error('FIREBASE_API_KEY not set in env');
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
  const resp = await axios.post(url, { email, password, returnSecureToken: true });
  return resp.data; // contains idToken, refreshToken, localId (uid), expiresIn
}

// Health check
app.get('/ping', (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// Signup: create user in Firebase Auth and create user document in Firestore
app.post('/signup', async (req, res) => {
  try {
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const { email, password, displayName, extra = {} } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({ email, password, displayName });

    // Create Firestore user doc
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...extra,
    });

    // Sign in the user via REST to return idToken (so client can use it immediately)
    let tokenResp = null;
    try {
      tokenResp = await signInWithEmailPassword(email, password);
    } catch (err) {
      console.warn('Could not sign in after signup via REST:', err.message || err.toString());
    }

    res.json({ uid: userRecord.uid, token: tokenResp });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Signup failed', detail: err.response?.data || err.message });
  }
});

// Login: exchange email/password for ID token via Firebase Auth REST API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const tokenResp = await signInWithEmailPassword(email, password);

    // Optionally fetch user profile from Firestore
    let profile = null;
    if (admin.apps.length) {
      try {
        const db = admin.firestore();
        const snap = await db.collection('users').doc(tokenResp.localId).get();
        if (snap.exists) profile = snap.data();
      } catch (e) {
        console.warn('Failed to fetch user profile:', e.message || e);
      }
    }

    res.json({ token: tokenResp, profile });
  } catch (err) {
    console.error(err.response?.data || err.toString());
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Login failed', detail: err.response?.data || err.message });
  }
});

// Middleware to verify Firebase ID token from Authorization header
async function verifyAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing Bearer token' });
    const idToken = auth.split(' ')[1];
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message || err);
    res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }
}

// Protected route example
app.get('/profile', verifyAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = admin.firestore();
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return res.status(404).json({ error: 'Profile not found' });
    res.json({ profile: snap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Logout: revoke refresh tokens for the currently authenticated user
app.post('/logout', verifyAuth, async (req, res) => {
  try {
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const uid = req.user.uid;
    // Revoke all refresh tokens for the user; forces re-login
    await admin.auth().revokeRefreshTokens(uid);
    res.json({ ok: true, message: 'Logout successful; refresh tokens revoked' });
  } catch (err) {
    console.error('Logout failed:', err);
    res.status(500).json({ error: 'Logout failed', detail: err.message || err });
  }
});

// Debug: list registered routes (helps verify that /logout is actually registered)
app.get('/__routes', (req, res) => {
  try {
    const routes = [];
    if (app && app._router && app._router.stack) {
      app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          // routes registered directly on the app
          const methods = Object.keys(middleware.route.methods).map((m) => m.toUpperCase());
          routes.push({ path: middleware.route.path, methods });
        } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
          // router middleware
          middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods).map((m) => m.toUpperCase());
              routes.push({ path: handler.route.path, methods });
            }
          });
        }
      });
    }
    res.json({ routes });
  } catch (e) {
    res.status(500).json({ error: 'Could not list routes', detail: e.message || e });
  }
});

// --- Existing Gemini /chat route preserved ---
const GEMINI_KEY = process.env.GEMINI_API_KEY;
app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages;

    const userPrompt = messages
      .map((m) => `${m.sender === 'user' ? 'User' : 'Bot'}: ${m.text}`)
      .join('\n');

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      { contents: [{ parts: [{ text: userPrompt }] }] },
      { headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY } }
    );

    const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a reply.";
    res.json({ reply: botReply });
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
