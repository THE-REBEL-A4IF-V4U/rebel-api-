import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing YouTube URL",
      developer: "THE REBEL"
    });
  }

  try {
    const { data } = await axios.get(
      "https://nayan-video-downloader.vercel.app/ytdown",
      { params: { url } }
    );

    res.json({
      success: true,
      platform: "youtube",
      data: data.data || data,
      developer: "THE REBEL"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "YouTube download failed",
      details: err.message
    });
  }
}
