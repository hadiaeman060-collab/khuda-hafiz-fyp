require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_KEY = process.env.GEMINI_API_KEY;

// -------------------------
// WORKING CHAT ENDPOINT
// -------------------------
app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    // Prepare prompt for Gemini
    const userPrompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_KEY,
      {
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ]
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({ reply });

  } catch (err) {
    console.error("🔥 Backend Error:", err.response?.data || err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
