import axios from "axios";
import { getKeys } from "../../lib/keys.js";
import { getUserIP } from "../../lib/ipDetect.js";
import { log } from "../../lib/logger.js";

export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing q" });

  const ip = getUserIP(req);
  log("AI", "Ask request", ip);

  try {
    const keys = await getKeys();
    const GEMINI_KEY = keys.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({ error: "GEMINI key missing" });
    }

    const r = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [{ parts: [{ text: q }] }]
      }
    );

    const reply =
      r.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({
      success: true,
      ip,
      reply,
      source: "github-keys"
    });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
}
