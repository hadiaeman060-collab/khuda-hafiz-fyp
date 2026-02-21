import { Router } from "express";

const router = Router();

/**
 * POST /api/chat
 * body: {
 *   message: string,
 *   history?: Array<{ role: "user" | "model", text: string }>
 * }
 *
 * returns: { reply: string }
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing on server" });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const systemPrompt = process.env.GEMINI_SYSTEM_PROMPT || "";

    // Convert your stored history into Gemini "contents"
    const contents = [];

    // Optional system instruction (recommended)
    // Gemini API supports system instructions in request body. :contentReference[oaicite:2]{index=2}
    const systemInstruction = systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined;

    // Add past turns
    for (const h of history) {
      if (!h?.text) continue;
      const role = h.role === "model" ? "model" : "user";
      contents.push({ role, parts: [{ text: String(h.text) }] });
    }

    // Add current user message
    contents.push({ role: "user", parts: [{ text: message }] });

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(systemInstruction ? { systemInstruction } : {}),
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512
        }
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(resp.status).json({
        error: "Gemini API error",
        status: resp.status,
        details: errText
      });
    }

    const data = await resp.json();

    // Typical shape: candidates[0].content.parts[0].text :contentReference[oaicite:3]{index=3}
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text)
        ?.filter(Boolean)
        ?.join("") || "";

    return res.json({ reply: reply || "(No response text returned)" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
});

export default router;