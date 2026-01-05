import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const { data } = await axios.get(
      "https://nayan-video-downloader.vercel.app/fbdown2",
      { params: { url } }
    );

    res.json({
      success: true,
      platform: "facebook",
      data: data.data || data
    });
  } catch {
    res.status(500).json({ error: "Facebook download failed" });
  }
}
