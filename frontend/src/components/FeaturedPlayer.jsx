import { useState } from "react";
import { getEmbedUrl } from "../utils/embedHelpers";

export default function FeaturedPlayer({ track }) {
  const [playing, setPlaying] = useState(false);
  if (!track) return null;
  const embedUrl = getEmbedUrl(track.sourceUrl, track.platform);

  return (
    <div className="featured-player">
      <div className="featured-player__art">
        {track.coverImage ? (
          <img src={track.coverImage} alt={track.title} />
        ) : (
          <div className="track-card__art-fallback" style={{ height: "100%" }}>
            <span className="eq"><span /><span /><span /><span /></span>
          </div>
        )}
      </div>
      <div className="featured-player__info">
        <span className="eyebrow">A la une</span>
        <h3>{track.title}</h3>
        {track.description && <p>{track.description}</p>}

        {!playing ? (
          <button className="btn btn-primary" onClick={() => setPlaying(true)}>
            ▶ Ecouter maintenant
          </button>
        ) : (
          <div className="featured-player__embed">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={track.title}
                width="100%"
                height={track.platform === "soundcloud" ? "300" : "352"}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            ) : (
              <a href={track.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                Ecouter sur la plateforme
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
