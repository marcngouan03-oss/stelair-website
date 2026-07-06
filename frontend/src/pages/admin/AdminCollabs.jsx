import { useEffect, useState } from "react";
import api from "../../api/api";

const statusLabels = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traite",
  archive: "Archive",
};

export default function AdminCollabs() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/collab").then((r) => setRequests(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/collab/${id}`, { status });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    await api.delete(`/collab/${id}`);
    load();
  };

  if (loading) return <div className="loading-screen">Chargement...</div>;

  return (
    <div>
      <span className="eyebrow">Formulaire du site</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        Demandes de collaboration
      </h2>

      {requests.length === 0 ? (
        <div className="empty-state">Aucune demande recue pour le moment.</div>
      ) : (
        <div className="admin-list">
          {requests.map((r) => (
            <div key={r._id} className="admin-list__row" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpanded(expanded === r._id ? null : r._id)}>
                <div>
                  <strong>{r.fullName}</strong>{" "}
                  <span style={{ color: "var(--c-grey)", fontSize: "0.85rem" }}>
                    — {r.email} · {r.projectType}
                  </span>
                </div>
                <span className="admin-chip">{statusLabels[r.status]}</span>
              </div>

              {expanded === r._id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--c-charcoal)" }}>
                  <p style={{ color: "var(--c-grey)", lineHeight: 1.6 }}>{r.message}</p>
                  {r.phone && <p>Tel : {r.phone}</p>}
                  {r.company && <p>Structure : {r.company}</p>}
                  {r.linkToWork && (
                    <p>
                      Lien :{" "}
                      <a href={r.linkToWork} target="_blank" rel="noreferrer" style={{ color: "var(--c-lime)" }}>
                        {r.linkToWork}
                      </a>
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {Object.keys(statusLabels).map((s) => (
                      <button key={s} className="admin-chip" onClick={() => updateStatus(r._id, s)}>
                        {statusLabels[s]}
                      </button>
                    ))}
                    <button className="btn btn-outline btn-sm btn-danger" onClick={() => remove(r._id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
