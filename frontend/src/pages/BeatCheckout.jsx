import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import "../styles/pages.css";
import "../styles/shop.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;
// L'extrait reste un teaser marketing, pas une ecoute complete gratuite :
// la lecture est coupee automatiquement passe ce nombre de secondes, meme
// si le fichier uploade est plus long.
const PREVIEW_CAP_SECONDS = 20;

// Page produit : presentation du pack (pochette, description, extrait audio,
// ce qui est inclus) + un bouton "Ajouter au panier" qui envoie vers /panier,
// ou le paiement (email + PayPal) a reellement lieu.
export default function BeatCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const { addItem } = useCart();
  const [beat, setBeat] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/beats/${id}`).then((r) => setBeat(r.data)).catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.currentTime >= PREVIEW_CAP_SECONDS) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [beat?.previewAudioUrl]);

  if (notFound) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">Ce pack n&apos;existe pas ou n&apos;est plus disponible.</div>
          <Link to="/boutique" className="shop-link-muted">
            ← Retour a la boutique
          </Link>
        </div>
      </section>
    );
  }

  if (!beat) {
    return <div className="loading-screen">Chargement...</div>;
  }

  const handleAddToCart = () => {
    addItem(beat);
  };

  return (
    <section className="section checkout-page">
      <div className="container">
        <button className="checkout-page__back" onClick={() => navigate("/boutique")}>
          ← Retour a la boutique
        </button>

        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="checkout-main__cover">
              {beat.coverImage ? (
                <img src={beat.coverImage} alt={beat.title} />
              ) : (
                <div className="beat-card__art-fallback">
                  <span className="eq"><span /><span /><span /><span /></span>
                </div>
              )}
              {beat.isPopular && <span className="beat-card__badge">★ Populaire</span>}
              <span className="beat-card__format beat-card__format--panel">ZIP</span>
            </div>

            <span className="eyebrow">Pack de sons</span>
            <h1 className="section-title" style={{ fontSize: "1.9rem" }}>{beat.title}</h1>
            {beat.description && <p className="section-lede">{beat.description}</p>}

            {beat.previewAudioUrl && (
              <div className="checkout-preview">
                <span className="checkout-preview__label">🎧 Extrait ({PREVIEW_CAP_SECONDS}s)</span>
                <audio ref={audioRef} src={beat.previewAudioUrl} controls preload="none" />
              </div>
            )}

            <ul className="checkout-includes">
              <li>Fichier ZIP haute qualite, telechargement immediat apres paiement</li>
              <li>Paiement securise par PayPal</li>
              <li>Achats retrouvables a tout moment avec votre code d&apos;acces</li>
            </ul>
          </div>

          <aside className="checkout-side">
            <div className="checkout-summary">
              <div className="checkout-summary__row">
                <div className="checkout-summary__thumb">
                  {beat.coverImage && <img src={beat.coverImage} alt="" />}
                </div>
                <div className="checkout-summary__info">
                  <strong>{beat.title}</strong>
                  <span className="checkout-summary__qty">1 pack numerique</span>
                </div>
                <span className="checkout-summary__price">{formatEUR(beat.price)}</span>
              </div>
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>{formatEUR(beat.price)}</span>
              </div>
            </div>

            <button className="btn btn-primary checkout-cart-btn" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
