require('dotenv').config({ path: './.env' }); // load environment variables
console.log("BACKEND MONGODB_URI =", process.env.MONGODB_URI);
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Service = require("./models/Service");
const Booking = require("./models/Booking");
const Package = require("./models/Package");
const Graveyard = require("./models/Graveyard");
const Feedback = require("./models/Feedback");
const graveyardRoutes = require("./routes/graveyard.routes");
const rateLimit = require("express-rate-limit");



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
app.use("/graveyards", graveyardRoutes);
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
// --- Submit feedback ---
app.post("/feedback", async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required" });
    }

    const feedback = new Feedback({ rating, message });
    await feedback.save();

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
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

// --- Middleware: verifyAuth ---
const verifyAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing Bearer token' });
    const idToken = auth.split(' ')[1];
    if (!admin.apps.length) return res.status(500).json({ error: 'Firebase Admin not initialized' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message || err);
    res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }
};

// --- Search Graveyards Nearby ---
app.get("/graveyards/search", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    // 1) Validate existence
    if (lat == null || lng == null) {
      return res.status(400).json({ success: false, error: "lat and lng are required" });
    }

    // 2) Parse + validate numeric
    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      return res.status(400).json({ success: false, error: "lat and lng must be valid numbers" });
    }

    // 3) Validate ranges
    if (latNum < -90 || latNum > 90) {
      return res.status(400).json({ success: false, error: "lat must be between -90 and 90" });
    }
    if (lngNum < -180 || lngNum > 180) {
      return res.status(400).json({ success: false, error: "lng must be between -180 and 180" });
    }

    // 4) Radius (meters) with sane defaults + cap
    let searchRadius = radius == null || radius === "" ? 5000 : Number(radius);

    if (!Number.isFinite(searchRadius) || searchRadius <= 0) {
      return res.status(400).json({ success: false, error: "radius must be a positive number (meters)" });
    }

    // cap radius to avoid abuse (e.g., 50km max)
    const MAX_RADIUS = 50000;
    if (searchRadius > MAX_RADIUS) searchRadius = MAX_RADIUS;

    // 5) Query (requires 2dsphere index on location)
    const nearbyGraveyards = await Graveyard.find({
      isActive: true,
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lngNum, latNum], // [lng, lat]
          },
          $maxDistance: searchRadius,
        },
      },
    })
      .select("name address city location contactNumber") // keep payload small
      .lean();

    res.json({
      success: true,
      count: nearbyGraveyards.length,
      radiusUsed: searchRadius,
      graveyards: nearbyGraveyards,
    });
  } catch (err) {
    console.error("Error fetching graveyards:", err);
    res.status(500).json({ success: false, error: "Failed to fetch graveyards" });
  }
});


// Existing chat endpoint
const GEMINI_KEY = process.env.GEMINI_API_KEY;

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

// =========================
// ✅ Gemini Chatbot Endpoint
// =========================
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests/minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
async function classifyIntent(genAI, userMessage) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_CLASSIFIER_MODEL || process.env.GEMINI_MODEL || "gemini-flash-latest",
    systemInstruction:
      "You are an intent classifier for the Khuda Hafiz funeral booking app. " +
      "Return ONLY valid JSON. No markdown. No extra text."
  });

  const prompt = `
Classify the user's message into EXACTLY one intent and extract parameters.

Allowed intents:
- "get_services"
- "get_packages"
- "search_graveyards"
- "book_package"
- "general"

Output JSON schema:
{
  "intent": "<one of the allowed intents>",
  "params": { ... },
  "missing": ["field1", "field2"],
  "confidence": 0.0
}

Parameter rules:
- search_graveyards params: { "lat": number|null, "lng": number|null, "radius": number|null }
  missing must include "lat" and/or "lng" if not present.
- book_package params: { "packageType": "basic"|"standard"|"premium"|null, "city": string|null, "date": string|null, "time": string|null, "budget": number|null }
  missing list what is required if not present: packageType, city, date, time.
- get_services/get_packages: params can be empty.

User message: ${JSON.stringify(userMessage)}
`;

  const result = await model.generateContent(prompt);
  const raw = result?.response?.text?.() || "";

  // Try strict JSON parse
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    // Fallback: attempt to salvage JSON between first { and last }
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {}
    }
    return { intent: "general", params: {}, missing: [], confidence: 0 };
  }
}
// app.post("/api/chat", chatLimiter, async (req, res) => {
//   try {
//     const { message, history } = req.body;

//     if (!message || typeof message !== "string") {
//       return res.status(400).json({ error: "message is required (string)" });
//     }

//     if (!process.env.GEMINI_API_KEY) {
//       return res.status(500).json({ error: "GEMINI_API_KEY missing in .env" });
//     }

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     // Use a fast model by default; you can change via .env
//     const model = genAI.getGenerativeModel({
//       model: process.env.GEMINI_MODEL || "gemini-flash-latest",
//       systemInstruction:
//         process.env.GEMINI_SYSTEM_PROMPT ||
//         "You are a helpful assistant inside the Khuda Hafiz app. Keep replies concise and friendly.",
//     });

//     // Optional: keep conversation memory
//     // history format expected from frontend:
//     // [{ role: "user"|"model", text: "..." }, ...]
//     const safeHistory = Array.isArray(history)
//       ? history
//           .filter(
//             (h) =>
//               h &&
//               (h.role === "user" || h.role === "model") &&
//               typeof h.text === "string"
//           )
//           .map((h) => ({
//             role: h.role,
//             parts: [{ text: h.text }],
//           }))
//       : [];

//     const chat = model.startChat({ history: safeHistory });

//     const result = await chat.sendMessage(message);
//     const reply = result?.response?.text?.() || "No reply from Gemini";

//     return res.json({ reply });
//   } catch (err) {
//     console.error("Gemini chat error:", err);
//     return res.status(500).json({
//       error: "Chatbot error",
//       details: String(err?.message || err),
//     });
//   }
// });
app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing in .env" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 1) INTENT CLASSIFICATION (Option A)
    const intentResult = await classifyIntent(genAI, message);
    const intent = intentResult?.intent || "general";
    const params = intentResult?.params || {};
    const missing = Array.isArray(intentResult?.missing) ? intentResult.missing : [];

    // 2) DISPATCH
    if (intent === "get_services") {
      const services = await Service.find().select("name price description").lean();
      if (!services.length) return res.json({ reply: "No services are available right now." });

      const lines = services.map((s) => `• ${s.name}${s.price ? ` — ${s.price}` : ""}${s.description ? ` (${s.description})` : ""}`);
      return res.json({
        reply:
          "Here are the available services in Khuda Hafiz:\n" +
          lines.join("\n") +
          "\n\nIf you want, tell me your city and budget and I’ll suggest a suitable package."
      });
    }

    if (intent === "get_packages") {
      // You currently build packages from services; keep it consistent with your /packages logic
      const allServices = await Service.find().lean();

      const pick = (names) => allServices.filter((s) => names.includes(s.name));
      const basic = pick(["Flowers", "Kafan", "Catering"]);
      const standard = pick(["Flowers", "Kafan", "Grave", "Catering"]);
      const premium = allServices;

      const fmt = (arr) => (arr.length ? arr.map((x) => x.name).join(", ") : "No items configured");

      return res.json({
        reply:
          `Here are the packages available in Khuda Hafiz:\n` +
          `• Basic: ${fmt(basic)}\n` +
          `• Standard: ${fmt(standard)}\n` +
          `• Premium: ${fmt(premium)}\n\n` +
          `Tell me your city + preferred date/time, and I can help you book.`
      });
    }

    if (intent === "search_graveyards") {
      // Require lat/lng; if missing, ask
      const lat = typeof params.lat === "number" ? params.lat : null;
      const lng = typeof params.lng === "number" ? params.lng : null;
      const radius = typeof params.radius === "number" ? params.radius : 5000;

      if (!lat || !lng) {
        return res.json({
          reply:
            "To find nearby graveyards, I need your location (latitude & longitude). " +
            "Please share your current location or allow location access in the app."
        });
      }

      const nearby = await Graveyard.find({
        isActive: true,
        location: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radius
          }
        }
      })
        .select("name address city contactNumber")
        .limit(10)
        .lean();

      if (!nearby.length) {
        return res.json({
          reply: `I couldn't find any active graveyards within ${radius} meters. Try increasing the radius.`
        });
      }

      const lines = nearby.map((g) => `• ${g.name}${g.city ? ` (${g.city})` : ""}\n  ${g.address || "Address not available"}${g.contactNumber ? ` | ${g.contactNumber}` : ""}`);
      return res.json({
        reply: `Here are nearby graveyards:\n${lines.join("\n")}\n\nIf you want, tell me which one you prefer and your preferred time.`
      });
    }

    if (intent === "book_package") {
      // Soft booking flow: collect required fields; do NOT confirm booking without user confirmation
      const packageType = params.packageType || null;
      const city = params.city || null;
      const date = params.date || null;
      const time = params.time || null;

      const need = [];
      if (!packageType) need.push("package type (basic / standard / premium)");
      if (!city) need.push("city");
      if (!date) need.push("date");
      if (!time) need.push("time");

      if (need.length) {
        return res.json({
          reply:
            "I can help you book a funeral package. I just need:\n" +
            need.map((x) => `• ${x}`).join("\n") +
            "\n\nReply with these details and I’ll prepare the booking for confirmation."
        });
      }

      return res.json({
        reply:
          `Understood. Here’s what I have:\n` +
          `• Package: ${packageType}\n` +
          `• City: ${city}\n` +
          `• Date/Time: ${date} at ${time}\n\n` +
          `Should I place the booking now? Reply "confirm" to proceed.`
      });
    }

    // 3) GENERAL CHAT (fallback)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      systemInstruction:
        process.env.GEMINI_SYSTEM_PROMPT ||
        "You are the Khuda Hafiz Assistant for a digital funeral booking platform. Be respectful, concise, and do not invent prices or confirmations."
    });

    const safeHistory = Array.isArray(history)
      ? history
          .filter((h) => h && (h.role === "user" || h.role === "model") && typeof h.text === "string")
          .map((h) => ({ role: h.role, parts: [{ text: h.text }] }))
      : [];

    const chat = model.startChat({ history: safeHistory });
    const result = await chat.sendMessage(message);
    const reply = result?.response?.text?.() || "No reply from assistant.";

    return res.json({ reply });
  } catch (err) {
    console.error("Gemini chat error:", err);
    return res.status(500).json({
      error: "Chatbot error",
      details: String(err?.message || err)
    });
  }
});
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});