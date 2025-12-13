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

// ✅ Correctly read API key from .env
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

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
