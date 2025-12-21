require('dotenv').config({ path: './.env' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const mongoose = require("mongoose");
const Service = require("./models/Service");
const Booking = require("./models/Booking");
const package = require("./models/Package");

const PORT = process.env.PORT || 3000;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const HF_API_KEY = process.env.HF_API_KEY; // Hugging Face Router API Key

// --- Firebase Admin SDK initialization ---
try {
  let serviceAccount;
  const saPath = './serviceAccountKey.json';
  if (fs.existsSync(saPath)) {
    serviceAccount = require(saPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (!serviceAccount) {
    console.warn('No Firebase service account found. Firebase Admin will not be initialized.');
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized');
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err);
}

// --- Express setup ---
const app = express();
app.use(express.json());
app.use(cors());

// --- Firebase REST sign-in helper ---
async function signInWithEmailPassword(email, password) {
  if (!FIREBASE_API_KEY) throw new Error('FIREBASE_API_KEY not set in env');
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
  const resp = await axios.post(url, { email, password, returnSecureToken: true });
  return resp.data;
}

// --- Health check ---
app.get('/ping', (req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// --- Signup ---
app.post('/signup', async (req, res) => {
  try {
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const { email, password, displayName, extra = {} } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const userRecord = await admin.auth().createUser({ email, password, displayName });

    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...extra,
    });

    let tokenResp = null;
    try {
      tokenResp = await signInWithEmailPassword(email, password);
    } catch (err) {
      console.warn('Could not sign in after signup:', err.message || err.toString());
    }

    res.json({ uid: userRecord.uid, token: tokenResp });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Signup failed', detail: err.response?.data || err.message });
  }
});

// --- Login ---
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const tokenResp = await signInWithEmailPassword(email, password);

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

// --- Auth middleware ---
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

// --- Profile ---
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

// --- Logout ---
app.post('/logout', verifyAuth, async (req, res) => {
  try {
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const uid = req.user.uid;
    await admin.auth().revokeRefreshTokens(uid);
    res.json({ ok: true, message: 'Logout successful; refresh tokens revoked' });
  } catch (err) {
    console.error('Logout failed:', err);
    res.status(500).json({ error: 'Logout failed', detail: err.message || err });
  }
});
// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  // --- Book a package ---
app.post("/bookings", async (req, res) => {
  try {
    const { userId, packageName, items, totalPrice } = req.body;

    if (!userId || !packageName || !items || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = new Booking({
      userId,
      packageName,
      items,
      totalPrice,
    });

    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});
  // --- Services (for Customize Package) ---
app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error("Failed to fetch services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.get("/packages", async (req, res) => {
  try {
    const allServices = await Service.find();

    const basicServices = allServices.filter(s => 
      ["Flowers", "Kafan", "Catering"].includes(s.name)
    );

    const standardServices = allServices.filter(s =>
      ["Flowers", "Kafan", "Grave", "Catering"].includes(s.name)
    );

    const premiumServices = allServices; // all services

    const packages = [
      { type: "basic", items: basicServices },
      { type: "standard", items: standardServices },
      { type: "premium", items: premiumServices },
    ];

    res.json(packages);
  } catch (err) {
    console.error("Failed to fetch packages:", err);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});



// --- Chatbot route using Hugging Face Router API ---
app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const prompt = `
You are an AI assistant for a funeral services app named "Khuda Hafiz".
Your tone must be respectful, calm, compassionate, and emotionally supportive.
Do not joke. Do not be casual. Be culturally sensitive.

Conversation:
${messages.map(m => `${m.sender}: ${m.text}`).join('\n')}

Assistant:
`;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data?.generated_text?.trim() || "I am here to help you. Please try again.";

    res.json({ reply });
  } catch (err) {
    console.error('❌ Chatbot error:', err.response?.data || err.message || err);
    res.status(500).json({
      reply: "I'm here for you, but I'm unable to respond right now. Please try again shortly.",
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
