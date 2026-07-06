import { useState } from "react";
import { getEmbedUrl } from "../utils/embedHelpers";
import "../styles/music.css";

const platformLabels = {
  spotify: "Spotify",
  deezer: "Deezer",
  soundcloud: "SoundCloud",
  apple: "Apple Music",
  other: "Ecouter",
};

export default function TrackCard({ track }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(track.sourceUrl, track.platform);

  return (
    <div className={`track-card ${playing ? "track-card--playing" : ""}`}>
      {!playing ? (
        <>
          <div className="track-card__art">
            {track.coverImage ? (
              <img src={track.coverImage} alt={track.title} />
            ) : (
              <div className="track-card__art-fallback">
                <span className="eq"><span /><span /><span /><span /></span>
              </div>
            )}
            <button
              className="track-card__play"
              onClick={() => setPlaying(true)}
              aria-label={`Ecouter ${track.title}`}
            >
              ▶
            </button>
          </div>
          <div className="track-card__meta">
            <h3>{track.title}</h3>
            <span className="track-card__platform">
              {platformLabels[track.platform] || "Ecouter"} · {track.type}
            </span>
            {track.description && <p>{track.description}</p>}
          </div>
        </>
      ) : (
        <div className="track-card__embed">
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
              Ecouter sur {platformLabels[track.platform]}
            </a>
          )}
          <button className="track-card__close" onClick={() => setPlaying(false)}>
            Fermer le lecteur
          </button>
        </div>
      )}
    </div>
  );
}
