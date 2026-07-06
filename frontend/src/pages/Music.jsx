import { useEffect, useState } from "react";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import TrackCard from "../components/TrackCard";
import PlatformLinks from "../components/PlatformLinks";
import "../styles/pages.css";

export default function Music() {
  const [tracks, setTracks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/tracks").then((r) => setTracks(r.data)).catch(() => {});
  }, []);

  const filtered = filter === "all" ? tracks : tracks.filter((t) => t.type === filter);
  const types = ["all", "track", "album", "playlist"];
  const typeLabels = { all: "Tout", track: "Titres", album: "Albums", playlist: "Playlists" };

  return (
    <>
      <HeroSection
        page="music"
        fallbackTitle="Musique"
        fallbackSubtitle="Ecoute directement les titres, albums et playlists de STELAIR."
      />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Discographie</span>
          <h2 className="section-title">Ecouter STELAIR</h2>
          <PlatformLinks />

          <div className="filter-bar">
            {types.map((t) => (
              <button
                key={t}
                className={`filter-chip ${filter === t ? "filter-chip--active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid">
              {filtered.map((t) => (
                <TrackCard key={t._id} track={t} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: 40 }}>
              Aucun titre a afficher pour le moment.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
