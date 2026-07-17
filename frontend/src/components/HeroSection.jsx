import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/hero.css";

const HOME_SOCIAL_ORDER = ["whatsapp", "instagram", "tiktok", "facebook", "snapchat"];

// Hero plein ecran reutilisable sur chaque page (home, music, videos, biography, contact).
// Si plusieurs heros sont actifs pour la meme page, ils tournent en carousel automatique.
// "compact" reduit la hauteur (utilise sur la boutique pour remonter les packs sans scroll).
export default function HeroSection({ page, fallbackTitle, fallbackSubtitle, compact = false }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    api
      .get(`/heroes?page=${page}`)
      .then((res) => setSlides(res.data))
      .catch(() => setSlides([]))
      .finally(() => setLoaded(true));
  }, [page]);

  useEffect(() => {
    if (page !== "home") return;
    api
      .get("/socials")
      .then((res) => setSocials(res.data))
      .catch(() => setSocials([]));
  }, [page]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [slides]);

  const orderedSocials = HOME_SOCIAL_ORDER.map((platform) =>
    socials.find((s) => s.platform === platform)
  ).filter(Boolean);

  const socialRow =
    page === "home" && orderedSocials.length > 0 ? (
      <div className="hero__socials">
        {orderedSocials.map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hero__social-btn"
            aria-label={s.platform}
          >
            {s.image ? (
              <img src={s.image} alt={s.platform} />
            ) : (
              <span className="hero__social-fallback">{s.platform[0].toUpperCase()}</span>
            )}
          </a>
        ))}
      </div>
    ) : null;

  if (loaded && slides.length === 0) {
    return (
      <section className={`hero hero--fallback ${compact ? "hero--compact" : ""}`}>
        <div className="hero__gradient" />
        <div className="container hero__content">
          {socialRow}
          <span className="eyebrow">STELAIR</span>
          <h1 className="hero__title">{fallbackTitle}</h1>
          {fallbackSubtitle && <p className="hero__subtitle">{fallbackSubtitle}</p>}
        </div>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className={`hero ${compact ? "hero--compact" : ""}`}>
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
        {socialRow}
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

      {!compact && (
        <div className="hero__scroll-cue">
          <span className="eq"><span /><span /><span /><span /></span>
          <span>DEFILER</span>
        </div>
      )}
    </section>
  );
}