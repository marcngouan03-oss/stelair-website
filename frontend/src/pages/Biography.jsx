import { useEffect, useState } from "react";
import api from "../api/api";
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
      <div className="section container">
        <div className="loading-screen">Chargement...</div>
      </div>
    );
  }

  const sections = bio.sections || [];

  return (
    <>
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Qui est STELAIR</span>
          <h1 className="section-title bio-page-title">
            {bio.pageTitle || "STELAIR : biographie, parcours et actualites"}
          </h1>
          {bio.pageSubtitle && (
            <p className="section-lede bio-page-subtitle" style={{ maxWidth: 720 }}>
              {bio.pageSubtitle}
            </p>
          )}

          {bio.introText && (
            <p className="bio-grid__paragraph bio-page-intro" style={{ maxWidth: 780, marginTop: 24 }}>
              {bio.introText}
            </p>
          )}

          {bio.introImage && (
            <div className="bio-intro-image">
              <img src={bio.introImage} alt="STELAIR" />
            </div>
          )}
        </div>
      </section>

      {sections.map(function (s, i) {
        const imageOnLeft = s.imagePosition === "left";
        const sectionClass = i % 2 === 0 ? "section bio-section" : "section section--alt bio-section";
        const blockClass = !s.image
          ? "bio-block bio-block--text-only"
          : imageOnLeft
          ? "bio-block bio-block--reverse"
          : "bio-block";

        return (
          <section key={s._id || i} className={sectionClass}>
            <div className="container">
              <div className={blockClass}>
                <div className="bio-block__text">
                  {s.title && (
                    <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 600 }}>
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

      {bio.musicQuote && (
        <section className="section section--alt music-quote-section">
          <div className="container">
            <span className="eyebrow">Ma musique</span>
            <blockquote className="music-quote">« {bio.musicQuote} »</blockquote>
          </div>
        </section>
      )}
    </>
  );
}