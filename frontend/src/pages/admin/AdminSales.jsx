import { useEffect, useState } from "react";
import api from "../../api/api";

const statusLabels = {
  CREATED: "En attente",
  COMPLETED: "Payee",
  FAILED: "Echouee",
  CANCELLED: "Annulee",
};

const formatEUR = (n) => `${(n || 0).toFixed(2).replace(".", ",")} €`;
const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");

export default function AdminSales() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/orders/summary"), api.get("/orders/all")])
      .then(([s, o]) => {
        setSummary(s.data);
        setOrders(o.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <div className="loading-screen">Chargement...</div>;

  return (
    <div>
      <span className="eyebrow">Boutique</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        Ventes
      </h2>
      <p style={{ color: "var(--c-grey)", maxWidth: 620 }}>
        Split 70/30 calcule automatiquement. Reglement manuel entre vous.
      </p>

      <div className="dashboard-grid" style={{ marginBottom: 32 }}>
        <div className="dashboard-card">
          <span className="eyebrow">Ventes confirmees</span>
          <h3>{summary?.totalOrders || 0}</h3>
        </div>
        <div className="dashboard-card">
          <span className="eyebrow">Total encaisse</span>
          <h3>{formatEUR(summary?.totalRevenueEUR)}</h3>
        </div>
        <div className="dashboard-card">
          <span className="eyebrow">Part artiste (70%)</span>
          <h3>{formatEUR(summary?.totalArtistShareEUR)}</h3>
        </div>
        <div className="dashboard-card">
          <span className="eyebrow">Ta part (30%)</span>
          <h3 style={{ color: "var(--c-lime)" }}>{formatEUR(summary?.totalOwnerShareEUR)}</h3>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">Aucune vente pour le moment.</div>
      ) : (
        <div className="admin-list">
          {orders.map((o) => (
            <div key={o._id} className="admin-list__row" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <strong>{o.beatTitleSnapshot}</strong>{" "}
                  <span style={{ color: "var(--c-grey)", fontSize: "0.85rem" }}>
                    — {o.buyerEmail} · {formatDate(o.paidAt || o.createdAt)}
                  </span>
                </div>
                <span className="admin-chip">{statusLabels[o.paymentStatus] || o.paymentStatus}</span>
              </div>
              {o.paymentStatus === "COMPLETED" && (
                <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap", fontSize: "0.85rem", color: "var(--c-grey)" }}>
                  <span>Montant : <strong style={{ color: "var(--c-white)" }}>{formatEUR(o.amountTotalEUR)}</strong></span>
                  <span>Part artiste : {formatEUR(o.artistShareEUR)}</span>
                  <span>Ta part : {formatEUR(o.ownerShareEUR)}</span>
                  {o.customerAccessCode && <span>Code acheteur : <code>{o.customerAccessCode}</code></span>}
                </div>
              )}
              {o.paymentStatus === "FAILED" && o.failureReason && (
                <p style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--c-ember)" }}>{o.failureReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
