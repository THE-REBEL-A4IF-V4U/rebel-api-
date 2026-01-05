import axios from "axios";
import { getUserIP } from "../../lib/ipDetect.js";
import { log } from "../../lib/logger.js";

const GEMINI_KEY = "AIzaSyDrbt2Xt83Qko_gfp4rhHysB4jqi1uTYqs";

export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing q" });
  }

  const ip = getUserIP(req);
  log("AI", q, ip);

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: q }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          key: GEMINI_KEY
        }
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({
      success: true,
      reply,
      model: "gemini-1.5-flash"
    });
  } catch (err) {
    res.status(500).json({
      error: "AI failed",
      details: err.response?.data || err.message
    });
  }
}
