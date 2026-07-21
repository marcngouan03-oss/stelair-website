import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import { useCart } from "../context/CartContext";
import "../styles/pages.css";
import "../styles/forms.css";
import "../styles/shop.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;

export default function Shop() {
  const [beats, setBeats] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    api.get("/beats").then((r) => setBeats(r.data)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = filter === "popular" ? beats.filter((b) => b.isPopular) : beats;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((b) => b.title.toLowerCase().includes(q));
    return list;
  }, [beats, filter, search]);

  return (
    <>
      <HeroSection
        page="shop"
        fallbackTitle="Boutique"
        fallbackSubtitle="Des packs de sons exclusifs, prets a l'emploi, a prix unique."
        compact
      />

      <section id="packs" className="section">
        <div className="container">
          <span className="eyebrow">Boutique</span>
          <h2 className="section-title">Packs de sons</h2>
          <p className="section-lede">
            Chaque pack est un fichier ZIP telechargeable immediatement apres paiement,
            paiement securise par Stripe.
          </p>

          {beats.length > 0 && (
            <div className="shop-toolbar">
              <div className="filter-bar">
                <button
                  className={`filter-chip ${filter === "all" ? "filter-chip--active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  Tout
                </button>
                <button
                  className={`filter-chip ${filter === "popular" ? "filter-chip--active" : ""}`}
                  onClick={() => setFilter("popular")}
                >
                  ★ Populaires
                </button>
              </div>
              <input
                type="search"
                className="shop-search"
                placeholder="Rechercher un pack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {beats.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 40 }}>
              Aucun pack disponible pour le moment, revenez bientot.
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 40 }}>
              Aucun pack ne correspond a votre recherche.
            </div>
          ) : (
            <div className="beat-grid">
              {filtered.map((b) => (
                <div key={b._id} className="beat-card">
                  <Link to={`/boutique/${b._id}`} className="beat-card__art">
                    {b.isPopular && <span className="beat-card__badge">★ Populaire</span>}
                    <span className="beat-card__format">ZIP</span>
                    {b.coverImage ? (
                      <img src={b.coverImage} alt={b.title} />
                    ) : (
                      <div className="beat-card__art-fallback">
                        <span className="eq"><span /><span /><span /><span /></span>
                      </div>
                    )}
                  </Link>
                  <div className="beat-card__body">
                    <h3>{b.title}</h3>
                    {b.description && <p>{b.description}</p>}
                    <span className="beat-card__price">{formatEUR(b.price)}</span>
                    <div className="beat-card__actions">
                      <Link to={`/boutique/${b._id}`} className="btn btn-outline">
                        Voir le pack
                      </Link>
                      <button type="button" className="btn btn-primary" onClick={() => addItem(b)}>
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/mes-achats" className="shop-link-muted">
            Deja achete ? Retrouvez vos achats
          </Link>
        </div>
      </section>
    </>
  );
}
