import { useEffect, useState } from "react";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import VideoCard from "../components/VideoCard";
import "../styles/pages.css";

export default function Videos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get("/videos").then((r) => setVideos(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection page="videos" fallbackTitle="Videos" fallbackSubtitle="Les clips officiels de STELAIR, a regarder directement ici." compact />

      <section className="section">
        <div className="container">
          <span className="eyebrow">A l&apos;image</span>
          <h2 className="section-title">Clips &amp; visuels</h2>

          {videos.length > 0 ? (
            <div className="video-grid">
              {videos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: 40 }}>
              Aucune video a afficher pour le moment.
            </div>
          )}
        </div>   
      </section>
    </>
  );
}
