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

// Optional email transporter (nodemailer) - configured via env
let transporter = null;
try {
  const nodemailer = require('nodemailer');
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT && Number(process.env.SMTP_PORT);
  const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE || false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    console.log('SMTP transporter configured');
  }
} catch (e) {
  console.warn('nodemailer not available or SMTP not configured');
}

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

// Password reset: generate or send a password reset email
app.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    // Prefer Admin SDK to generate a link
    if (admin.apps.length) {
      try {
        const link = await admin.auth().generatePasswordResetLink(email);

        // If SMTP configured, send the link by email from server-side
        if (transporter) {
          try {
            const from = process.env.EMAIL_FROM || `no-reply@${process.env.SMTP_HOST || 'localhost'}`;
            const info = await transporter.sendMail({
              from,
              to: email,
              subject: 'Reset your Khuda Hafiz password',
              text: `Click the link to reset your password: ${link}`,
              html: `<p>Click the link to reset your password:</p><p><a href="${link}">${link}</a></p>`,
            });
            console.log('Password reset email sent via SMTP', info.messageId || info);
            return res.json({ ok: true, message: 'Password reset email sent' });
          } catch (mailErr) {
            console.warn('Failed to send reset email via SMTP:', mailErr);
            // fall through to returning link for debugging
          }
        }

        // If SMTP not configured or sending failed, return the link (useful for development)
        return res.json({ ok: true, message: 'Password reset link generated', link });
      } catch (e) {
        console.warn('Admin generatePasswordResetLink failed:', e.message || e);
      }
    }

    // Fallback: use Firebase Auth REST API (requires FIREBASE_API_KEY)
    if (!FIREBASE_API_KEY) return res.status(500).json({ error: 'No Firebase admin or API key configured' });

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`;
    await axios.post(url, { requestType: 'PASSWORD_RESET', email });
    res.json({ ok: true, message: 'Password reset email sent' });
  } catch (err) {
    console.error('Reset password failed:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Reset password failed', detail: err.response?.data || err.message });
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
