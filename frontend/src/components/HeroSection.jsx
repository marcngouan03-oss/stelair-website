import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/hero.css";

// Hero plein ecran reutilisable sur chaque page (home, music, videos, biography, contact).
// Si plusieurs heros sont actifs pour la meme page, ils tournent en carousel automatique.
export default function HeroSection({ page, fallbackTitle, fallbackSubtitle }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get(`/heroes?page=${page}`)
      .then((res) => setSlides(res.data))
      .catch(() => setSlides([]))
      .finally(() => setLoaded(true));
  }, [page]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [slides]);

  if (loaded && slides.length === 0) {
    return (
      <section className="hero hero--fallback">
        <div className="hero__gradient" />
        <div className="container hero__content">
          <span className="eyebrow">STELAIR</span>
          <h1 className="hero__title">{fallbackTitle}</h1>
          {fallbackSubtitle && <p className="hero__subtitle">{fallbackSubtitle}</p>}
        </div>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div key={s._id} className={`hero__bg ${i === index ? "hero__bg--active" : ""}`}>
          {s.mediaType === "video" ? (
            <video src={s.mediaUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={s.mediaUrl} alt={s.title} />
          )}
        </div>
      ))}
      <div className="hero__gradient" />

      <div className="container hero__content">
        <span className="eyebrow">STELAIR</span>
        {slide && (
          <>
            <h1 className="hero__title">{slide.title}</h1>
            {slide.subtitle && <p className="hero__subtitle">{slide.subtitle}</p>}
            {slide.ctaLabel && slide.ctaLink && (
              <a href={slide.ctaLink} className="btn btn-primary hero__cta">
                {slide.ctaLabel}
              </a>
            )}
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="hero__dots">
          {slides.map((s, i) => (
            <button
              key={s._id}
              className={`hero__dot ${i === index ? "hero__dot--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="hero__scroll-cue">
        <span className="eq"><span /><span /><span /><span /></span>
        <span>DEFILER</span>
      </div>
    </section>
  );
}
