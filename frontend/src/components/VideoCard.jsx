import { useState } from "react";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "../utils/embedHelpers";
import "../styles/music.css";

export default function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
  const thumb = video.thumbnail || getYoutubeThumbnail(video.youtubeUrl);

  return (
    <div className="video-card">
      {playing && embedUrl ? (
        <div className="video-card__frame">
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button className="video-card__thumb" onClick={() => setPlaying(true)} aria-label={`Lire ${video.title}`}>
          {thumb && <img src={thumb} alt={video.title} />}
          <span className="video-card__play-icon">▶</span>
        </button>
      )}
      <div className="video-card__meta">
        <h3>{video.title}</h3>
        {video.description && <p>{video.description}</p>}
      </div>
    </div>
  );
}
