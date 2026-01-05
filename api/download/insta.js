import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const { data } = await axios.get(
      "https://nayan-video-downloader.vercel.app/instagram",
      { params: { url } }
    );

    res.json({
      success: true,
      platform: "instagram",
      data: data.data || data
    });
  } catch (e) {
    res.status(500).json({ error: "Instagram download failed" });
  }
}
