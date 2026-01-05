import axios from "axios";

const ALLOWED = [
  "alldown",
  "ytdown",
  "instagram",
  "fbdown2",
  "tikdown",
  "terabox",
  "pintarest",
  "capcut",
];

export default async function handler(req, res) {
  const { url, platform = "alldown" } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Missing media url"
    });
  }

  if (!ALLOWED.includes(platform)) {
    return res.status(400).json({
      success: false,
      error: "Invalid platform"
    });
  }

  try {
    const { data } = await axios.get(
      `https://nayan-video-downloader.vercel.app/${platform}`,
      { params: { url } }
    );

    const result = data.data || data;

    res.json({
      success: true,
      platform,
      title: result.title || null,
      thumbnail:
        result.thumbnail ||
        "https://i.postimg.cc/FHdTnVgj/Not-Available.jpg",
      result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Media fetch failed",
      details: err.message
    });
  }
}
