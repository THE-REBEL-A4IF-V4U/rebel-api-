import axios from "axios";

export default async function handler(req, res) {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({
      error: "Missing TikTok video URL. Use ?url="
    });
  }

  try {
    const { data } = await axios.get("https://tikwm.com/api", {
      params: { url: videoUrl, hd: 1 }
    });

    if (!data || data.code !== 0) {
      return res.status(500).json({
        error: "Failed to fetch TikTok video data"
      });
    }

    res.json({
      success: true,
      result: {
        no_watermark_video: data.data.play,
        audio: data.data.music,
        title: data.data.title,
        views: data.data.play_count,
        author: {
          nickname: data.data.author.nickname,
          username: data.data.author.unique_id
        },
        cover: data.data.cover
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error while downloading TikTok video"
    });
  }
}
