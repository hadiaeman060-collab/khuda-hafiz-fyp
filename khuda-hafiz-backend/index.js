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

// In-memory store for pending signup OTPs: { email -> { code, expiresAt } }
// NOTE: For production use a persistent store (Redis/DB) and rate-limiting.
const pendingOtps = new Map();

// In-memory store for pending login OTPs: { email -> { code, expiresAt, password } }
const pendingLoginOtps = new Map();

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
    // Verify SMTP connection at startup so problems surface in logs early
    transporter.verify()
      .then(() => console.log('SMTP transporter configured and verified'))
      .catch((err) => console.warn('SMTP transporter verification failed:', err));
  }
} catch (e) {
  console.warn('nodemailer not available or SMTP not configured');
}

// ✅ Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName, extra, otp } = req.body;

    if (!email) return res.status(400).json({ error: "email required" });

    // If no OTP provided, generate and send one to the user's email.
    if (!otp) {
      if (!transporter) return res.status(500).json({ error: 'SMTP not configured on server' });

      // Rate-limit: prevent spamming OTPs (simple approach)
      const prev = pendingOtps.get(email);
      if (prev && prev.expiresAt && prev.expiresAt - Date.now() > (9 * 60 * 1000)) {
        // If a recent OTP was issued within the last minute, don't reissue.
        return res.status(429).json({ error: 'OTP recently sent. Please check your email.' });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      pendingOtps.set(email, { code, expiresAt });

      try {
        const from = process.env.EMAIL_FROM || `no-reply@${process.env.SMTP_HOST || 'localhost'}`;
        await transporter.verify();
        const info = await transporter.sendMail({
          from,
          to: email,
          subject: 'Your Khuda Hafiz signup OTP',
          text: `Your verification code is ${code}. It will expire in 10 minutes.`,
          html: `<p>Your verification code is <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
        });
        console.log('Signup OTP sent via SMTP', info.messageId || info);
        return res.json({ ok: true, message: 'OTP sent to email' });
      } catch (mailErr) {
        console.error('Failed to send signup OTP via SMTP:', mailErr);
        return res.status(500).json({ error: 'Failed to send OTP email', detail: mailErr.message || String(mailErr) });
      }
    }

    // OTP provided -> verify and create account
    const record = pendingOtps.get(email);
    if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (record.expiresAt < Date.now()) {
      pendingOtps.delete(email);
      return res.status(400).json({ error: 'OTP expired' });
    }
    if (record.code !== String(otp)) return res.status(400).json({ error: 'Invalid OTP' });

    // Ensure required fields for account creation
    if (!password || !displayName) return res.status(400).json({ error: 'password and displayName required to complete signup' });

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // cleanup
    pendingOtps.delete(email);

    res.json({ token: { idToken: token }, profile: { uid: userRecord.uid, email, displayName, ...extra } });
  } catch (err) {
    console.error('Signup error:', err.response?.data || err.message || err);
    res.status(400).json({ error: err.response?.data || err.message || String(err) });
  }
});

// ✅ Login endpoint with OTP verification
app.post("/login", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    // If no OTP provided, validate credentials and send OTP
    if (!otp) {
      if (!password) return res.status(400).json({ error: "Password required" });

      // Validate credentials with Firebase first
      try {
        const firebaseResp = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          { email, password, returnSecureToken: true }
        );
        // Credentials valid, now send OTP
      } catch (err) {
        console.error("Credential validation failed:", err.response?.data || err.message);
        return res.status(400).json({
          error: err.response?.data?.error?.message || "Invalid email or password",
        });
      }

      if (!transporter) return res.status(500).json({ error: 'SMTP not configured on server' });

      // Rate-limit: prevent spamming OTPs
      const prev = pendingLoginOtps.get(email);
      if (prev && prev.expiresAt && prev.expiresAt - Date.now() > (9 * 60 * 1000)) {
        return res.status(429).json({ error: 'OTP recently sent. Please check your email.' });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      pendingLoginOtps.set(email, { code, expiresAt, password });

      try {
        const from = process.env.EMAIL_FROM || `no-reply@${process.env.SMTP_HOST || 'localhost'}`;
        await transporter.verify();
        const info = await transporter.sendMail({
          from,
          to: email,
          subject: 'Your Khuda Hafiz login OTP',
          text: `Your verification code is ${code}. It will expire in 10 minutes.`,
          html: `<p>Your verification code is <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
        });
        console.log('Login OTP sent via SMTP', info.messageId || info);
        return res.json({ ok: true, message: 'OTP sent to email' });
      } catch (mailErr) {
        console.error('Failed to send login OTP via SMTP:', mailErr);
        return res.status(500).json({ error: 'Failed to send OTP email', detail: mailErr.message || String(mailErr) });
      }
    }

    // OTP provided -> verify and complete login
    const record = pendingLoginOtps.get(email);
    if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
    if (record.expiresAt < Date.now()) {
      pendingLoginOtps.delete(email);
      return res.status(400).json({ error: 'OTP expired' });
    }
    if (record.code !== String(otp)) return res.status(400).json({ error: 'Invalid OTP' });

    // OTP verified, now authenticate with Firebase
    const firebaseResp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      { email, password: record.password, returnSecureToken: true }
    );

    const profile = {
      uid: firebaseResp.data.localId,
      email: firebaseResp.data.email,
      displayName: firebaseResp.data.displayName || email,
    };

    // cleanup
    pendingLoginOtps.delete(email);

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
            // re-verify before sending to catch transient issues
            await transporter.verify();
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
            console.error('Failed to send reset email via SMTP:', mailErr);
            return res.status(500).json({ error: 'Failed to send reset email', detail: mailErr.message || String(mailErr) });
          }
        }

        // If SMTP is not configured, return an explicit error so frontend doesn't receive the link
        return res.status(500).json({ error: 'SMTP not configured on server. Password reset email could not be sent.' });
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
