require('dotenv').config({ path: './.env' }); // load environment variables
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

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
    console.warn('No Firebase service account found. Signup/login endpoints will fail.');
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

// ✅ Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName, extra } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Create a custom token for frontend login
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      token: { idToken: token },
      profile: { uid: userRecord.uid, email, displayName, ...extra },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Firebase REST API sign-in
    const firebaseResp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const profile = {
      uid: firebaseResp.data.localId,
      email: firebaseResp.data.email,
      displayName: firebaseResp.data.displayName || email,
    };

    res.json({
      token: { idToken: firebaseResp.data.idToken },
      profile,
    });
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message || err);
    res.status(400).json({
      error: err.response?.data?.error?.message || "Login failed. Check credentials",
    });
  }
});

// Existing chat endpoint
const GEMINI_KEY = process.env.GEMINI_API_KEY;
app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    const userPrompt = messages
      .map((m) => `${m.sender === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      { contents: [{ parts: [{ text: userPrompt }] }] },
      { headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY } }
    );

    const botReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't get a reply.";

    res.json({ reply: botReply });
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
