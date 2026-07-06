import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import FeaturedPlayer from "../components/FeaturedPlayer";
import TrackCard from "../components/TrackCard";
import VideoCard from "../components/VideoCard";
import PlatformLinks from "../components/PlatformLinks";
import "../styles/pages.css";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bio, setBio] = useState(null);

  useEffect(function () {
    api.get("/tracks").then(function (r) {
      setTracks(r.data);
    }).catch(function () {});

    api.get("/videos").then(function (r) {
      setVideos(r.data);
    }).catch(function () {});

    api.get("/bio").then(function (r) {
      setBio(r.data);
    }).catch(function () {});
  }, []);

  const featured = tracks.find(function (t) {
    return t.featured;
  }) || tracks[0];

  const otherTracks = tracks
    .filter(function (t) {
      return t._id !== (featured && featured._id);
    })
    .slice(0, 3);

  const latestVideos = videos.slice(0, 3);

  let bioImageBlock = <div className="bio-teaser__placeholder" />;
  if (bio && bio.introImage) {
    bioImageBlock = <img src={bio.introImage} alt="STELAIR" />;
  }

  return (
    <>
      <HeroSection
        page="home"
        fallbackTitle="STELAIR"
        fallbackSubtitle="Artiste, auteur, compositeur ivoirien. Cameleon musical entre afrobeat, drill et flows rap percutants."
      />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Nouveau son</span>
          <h2 className="section-title">Ecouter maintenant</h2>
          <p className="section-lede">
            Plonge directement dans l'univers de STELAIR, sans quitter le site.
          </p>

          {featured ? (
            <FeaturedPlayer track={featured} />
          ) : (
            <div className="empty-state">
              Aucun titre pour le moment — ajoute ta musique depuis la page administrateur.
            </div>
          )}

          <PlatformLinks />
        </div>
      </section>

      {otherTracks.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <span className="eyebrow">Discographie</span>
            <h2 className="section-title">Derniers titres</h2>
            <div className="grid">
              {otherTracks.map(function (t) {
                return <TrackCard key={t._id} track={t} />;
              })}
            </div>
            <Link to="/musique" className="btn btn-outline" style={{ marginTop: 40 }}>
              Voir toute la musique
            </Link>
          </div>
        </section>
      )}

      {latestVideos.length > 0 && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">A l'image</span>
            <h2 className="section-title">Derniers clips</h2>
            <div className="grid">
              {latestVideos.map(function (v) {
                return <VideoCard key={v._id} video={v} />;
              })}
            </div>
            <Link to="/videos" className="btn btn-outline" style={{ marginTop: 40 }}>
              Voir toutes les videos
            </Link>
          </div>
        </section>
      )}

      <section className="section section--alt">
        <div className="container bio-teaser">
          <div className="bio-teaser__image">{bioImageBlock}</div>
          <div className="bio-teaser__text">
            <span className="eyebrow">Qui est STELAIR</span>
            <h2 className="section-title">Un cameleon musical</h2>
            <p className="section-lede">
              Ne le 31 juillet 1993 a Treichville, STELAIR fusionne afrobeat, drill et flows rap
              percutants pour offrir une palette musicale riche et un talent indeniable.
            </p>
            <Link to="/biographie" className="btn btn-primary" style={{ marginTop: 20 }}>
              Decouvrir sa biographie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}