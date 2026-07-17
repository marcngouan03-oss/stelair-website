import { useState } from "react";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import { downloadPurchase } from "../utils/download";
import "../styles/pages.css";
import "../styles/forms.css";
import "../styles/shop.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";

export default function MyPurchases() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/orders/lookup", { email, accessCode });
      setOrders(data);
    } catch (err) {
      setOrders(null);
      setError(err?.response?.data?.message || "Aucun achat trouve.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order) => {
    setDownloadingId(order.id);
    setError("");
    try {
      await downloadPurchase({ email, accessCode, orderId: order.id, filename: order.beatTitle });
    } catch {
      setError("Le telechargement a echoue, reessayez ou contactez le support.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <HeroSection
        page="my-purchases"
        fallbackTitle="Mes achats"
        fallbackSubtitle="Retrouvez et retelechargez tous vos packs achetes."
      />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Espace client</span>
          <h2 className="section-title">Retrouver mes achats</h2>
          <p className="section-lede">
            Entrez l&apos;email utilise lors de l&apos;achat et le code recu apres paiement.
          </p>

          <form className="my-purchases-form" onSubmit={handleLookup}>
            <div className="form-field">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@example.com" />
            </div>
            <div className="form-field">
              <label>Code d&apos;acces (recu apres achat)</label>
              <input
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="AB3D-9F2K"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 10 }}>
              {loading ? "Recherche..." : "Retrouver mes achats"}
            </button>
          </form>

          {orders && (
            <div style={{ marginTop: 40, maxWidth: 620 }}>
              {orders.length === 0 ? (
                <div className="empty-state">Aucun achat trouve.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="purchase-row">
                    <div>
                      <strong>{o.beatTitle}</strong>
                      <div style={{ color: "var(--c-grey)", fontSize: "0.8rem" }}>
                        {formatDate(o.purchasedAt)} · {formatEUR(o.amount)}
                      </div>
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDownload(o)}
                      disabled={downloadingId === o.id}
                    >
                      {downloadingId === o.id ? "..." : "Telecharger"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
