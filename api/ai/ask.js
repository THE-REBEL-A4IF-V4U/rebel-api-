import axios from "axios";
import { getKeys } from "../../lib/keys.js";
import { getUserIP } from "../../lib/ipDetect.js";
import { log } from "../../lib/logger.js";

export default async function handler(req, res) {
  const q = req.query.q;
  
  // ইনপুট চেক
  if (!q) return res.status(400).json({ error: "Missing q" });

  const ip = getUserIP(req);
  log("AI", "Ask request", ip);

  try {
    // Key ফোল্ডার থেকে বা Env থেকে আনা
    const keys = await getKeys();
    const GEMINI_KEY = keys.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      console.error("Server Error: Gemini Key Not Found");
      return res.status(500).json({ error: "Configuration Error: Key missing" });
    }

    // Axios রিকোয়েস্ট (v1beta ব্যবহার করা হয়েছে)
    const r = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
        // Key টি এখানে params হিসেবে দেওয়া নিরাপদ এবং ক্লিন
        params: {
          key: GEMINI_KEY
        }
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
    // সার্ভার কনসোলে আসল এররটা প্রিন্ট করা জরুরি ডিবাগিংয়ের জন্য
    console.error("Gemini API Error:", err.response?.data || err.message);
    
    res.status(500).json({ 
      error: "AI failed", 
      details: err.response?.data?.error?.message || "Internal Server Error"
    });
  }
}
