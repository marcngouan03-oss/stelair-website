import { useEffect, useState } from "react";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import { getSpotifyEmbedUrl } from "../utils/embedHelpers";
import "../styles/pages.css";

export default function Biography() {
  const [bio, setBio] = useState(null);

  useEffect(function () {
    api
      .get("/bio")
      .then(function (r) {
        setBio(r.data);
      })
      .catch(function () {});
  }, []);

  if (!bio) {
    return (
      <>
        <HeroSection page="biography" fallbackTitle="Biographie" fallbackSubtitle="A propos de STELAIR" />
        <div className="section container">
          <div className="loading-screen">Chargement...</div>
        </div>
      </>
    );
  }

  const sections = bio.sections || [];

  return (
    <>
      <HeroSection page="biography" fallbackTitle="Biographie" fallbackSubtitle="A propos de STELAIR" />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Qui est STELAIR</span>
          <h1 className="section-title">{bio.pageTitle}</h1>
          <p className="section-lede" style={{ maxWidth: 720 }}>
            {bio.pageSubtitle}
          </p>

          {bio.introText && (
            <p className="bio-grid__paragraph" style={{ maxWidth: 780, marginTop: 24 }}>
              {bio.introText}
            </p>
          )}

          <p className="bio-grid__identity" style={{ marginTop: 20 }}>
            {bio.realName} — Ne le {bio.birthDate} a {bio.birthPlace}
          </p>

          {bio.introImage && (
            <div className="bio-intro-image">
              <img src={bio.introImage} alt="STELAIR" />
            </div>
          )}
        </div>
      </section>

      {bio.musicQuote && (
        <section className="section section--alt music-quote-section">
          <div className="container">
            <span className="eyebrow">Ma musique</span>
            <blockquote className="music-quote">« {bio.musicQuote} »</blockquote>
          </div>
        </section>
      )}

      {sections.map(function (s, i) {
        const embedUrl = s.spotifyUrl ? getSpotifyEmbedUrl(s.spotifyUrl) : null;
        const imageOnLeft = s.imagePosition === "left";
        const sectionClass = i % 2 === 0 ? "section" : "section section--alt";
        const blockClass = imageOnLeft ? "bio-block bio-block--reverse" : "bio-block";

        return (
          <section key={s._id || i} className={sectionClass}>
            <div className="container">
              <div className={blockClass}>
                <div className="bio-block__text">
                  {s.title && (
                    <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
                      {s.title}
                    </h2>
                  )}
                  {s.text && <p className="bio-grid__paragraph">{s.text}</p>}

                  {(s.stat || s.certification) && (
                    <div className="bio-block__stats">
                      {s.stat && <span className="bio-stat-badge">{s.stat}</span>}
                      {s.certification && (
                        <span className="bio-stat-badge bio-stat-badge--gold">{s.certification}</span>
                      )}
                    </div>
                  )}

                  {embedUrl && (
                    <div className="bio-block__embed">
                      <iframe
                        src={embedUrl}
                        title={s.title || "STELAIR"}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {s.image && (
                  <div className="bio-block__image">
                    <img src={s.image} alt={s.title || "STELAIR"} />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}