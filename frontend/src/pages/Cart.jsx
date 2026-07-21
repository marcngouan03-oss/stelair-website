import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PaymentMethods from "../components/PaymentMethods";
import "../styles/pages.css";
import "../styles/forms.css";
import "../styles/shop.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <span className="eyebrow">Panier</span>
          <h1 className="section-title">Votre panier est vide</h1>
          <Link to="/boutique" className="btn btn-primary" style={{ marginTop: 20 }}>
            Voir la boutique
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section checkout-page">
      <div className="container">
        <button className="checkout-page__back" onClick={() => navigate("/boutique")}>
          ← Continuer mes achats
        </button>

        <span className="eyebrow">Panier</span>
        <h1 className="section-title" style={{ fontSize: "1.9rem" }}>
          {items.length} pack{items.length > 1 ? "s" : ""} dans votre panier
        </h1>

        <div className="checkout-layout">
          <div className="checkout-main">
            {items.map((item) => (
              <div key={item._id} className="purchase-row">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="checkout-summary__thumb">
                    {item.coverImage && <img src={item.coverImage} alt="" />}
                  </div>
                  <strong>{item.title}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className="checkout-summary__price">{formatEUR(item.price)}</span>
                  <button className="btn btn-outline" onClick={() => removeItem(item._id)}>
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="checkout-side">
            <div className="checkout-summary">
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>{formatEUR(total)}</span>
              </div>
            </div>

            <div className="checkout-payment">
              <h2 className="checkout-payment__title">Paiement securise par Stripe</h2>
              <PaymentMethods style={{ marginBottom: 16 }} />
              <button type="button" className="btn btn-primary checkout-cart-btn" disabled>
                Payer {formatEUR(total)}
              </button>
              <p className="beat-checkout__hint">Le paiement par carte arrive tres bientot.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
