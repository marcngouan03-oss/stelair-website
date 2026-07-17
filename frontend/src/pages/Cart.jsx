import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import PayPalButton from "../components/PayPalButton";
import { downloadPurchase } from "../utils/download";
import "../styles/pages.css";
import "../styles/forms.css";
import "../styles/shop.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;
const PAYPAL_OFFICIAL_LOGO = "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg";

export default function Cart() {
  const { items, removeItem, total, clear } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { accessCode, items: [{orderId, beatTitle}] }
  const [downloadingId, setDownloadingId] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/shop-settings").then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  const logoSrc = settings?.paymentLogo || PAYPAL_OFFICIAL_LOGO;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleDownload = async (item) => {
    setDownloadingId(item.orderId);
    setError("");
    try {
      await downloadPurchase({
        email,
        accessCode: result.accessCode,
        orderId: item.orderId,
        filename: item.beatTitle,
      });
    } catch {
      setError("Le telechargement a echoue, reessayez ou contactez le support.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (result) {
    return (
      <section className="section checkout-page">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="checkout-payment beat-checkout__success">
            <span className="beat-checkout__success-icon">✓</span>
            <span className="eyebrow">Achat confirme</span>
            <h1 className="section-title" style={{ fontSize: "1.5rem" }}>Merci !</h1>
            <p className="section-lede">
              Gardez precieusement ce code : avec votre email, il vous permettra de
              retrouver tous vos achats a tout moment sur la page &laquo; Mes achats &raquo;.
            </p>
            <div className="beat-checkout__code">{result.accessCode}</div>
            {error && <p className="form-error">{error}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {result.items.map((item) => (
                <div key={item.orderId} className="purchase-row">
                  <strong>{item.beatTitle}</strong>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleDownload(item)}
                    disabled={downloadingId === item.orderId}
                  >
                    {downloadingId === item.orderId ? "..." : "Telecharger"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              <h2 className="checkout-payment__title">Paiement</h2>

              <div className="form-field">
                <label>Votre email (pour recevoir votre code d&apos;acces)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@example.com"
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              {emailValid ? (
                <PayPalButton
                  beatIds={items.map((i) => i._id)}
                  buyerEmail={email}
                  onSuccess={(data) => {
                    setError("");
                    setResult(data);
                    clear();
                  }}
                  onError={(msg) => setError(msg)}
                />
              ) : (
                <p className="beat-checkout__hint">
                  Entrez une adresse email valide pour activer le paiement.
                </p>
              )}

              <div className="beat-checkout__secure">
                <span>🔒 Paiement securise</span>
                <img src={logoSrc} alt="PayPal" className="paypal-badge" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
