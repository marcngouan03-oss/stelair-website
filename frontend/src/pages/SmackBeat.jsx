import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/pages.css";

export default function SmackBeat() {
  const [data, setData] = useState(null);
  const [winners, setWinners] = useState([]);

  useEffect(function () {
    api.get("/smackbeat").then(function (r) {
      setData(r.data);
    }).catch(function () {});

    api.get("/smackbeat-winners").then(function (r) {
      setWinners(r.data);
    }).catch(function () {});
  }, []);

  if (!data) {
    return (
      <div className="section container">
        <div className="loading-screen">Chargement...</div>
      </div>
    );
  }

  const phoneDigitsOnly = (data.studioPhone || "").replace(/[^\d+]/g, "");

  return (
    <>
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Le challenge</span>
          <h1 className="section-title">SmackBeat</h1>

          {data.rulesText && (
            <p className="section-lede" style={{ maxWidth: 720, marginTop: 20 }}>
              {data.rulesText}
            </p>
          )}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <span className="eyebrow">Comment participer</span>
          <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
            Les conditions
          </h2>

          <div className="smackbeat-steps">
            <div className="smackbeat-step">
              <span className="smackbeat-step__number">1</span>
              <div>
                <h3>Telecharger l'instrumental</h3>
                <p>Recupere l'instrumental officiel du mois pour enregistrer ton titre.</p>
                {data.instrumentalUrl ? (
                  <a
                    href={data.instrumentalUrl}
                    download
                    className="btn btn-primary"
                    style={{ marginTop: 14 }}
                  >
                    Telecharger l'instrumental
                  </a>
                ) : (
                  <span className="footer__muted">Instrumental bientot disponible</span>
                )}
              </div>
            </div>

            <div className="smackbeat-step">
              <span className="smackbeat-step__number">2</span>
              <div>
                <h3>Enregistrer ta chanson chez {data.studioName || "Studio Agri"}</h3>
                <p>Contacte le studio pour reserver ton creneau d'enregistrement.</p>
                {data.studioPhone ? (
                  <a href={`tel:${phoneDigitsOnly}`} className="btn btn-outline" style={{ marginTop: 14 }}>
                    {data.studioName || "Studio Agri"} — {data.studioPhone}
                  </a>
                ) : (
                  <span className="footer__muted">Contact bientot disponible</span>
                )}
              </div>
            </div>

            <div className="smackbeat-step">
              <span className="smackbeat-step__number">3</span>
              <div>
                <h3>Lancer ton challenge sur TikTok</h3>
                <p>
                  {data.tiktokInstructions ||
                    "Publie ta video sur TikTok avec ton titre sur l'instrumental SmackBeat."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {data.prizeText && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">A gagner</span>
            <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Les prix du mois
            </h2>
            <p className="section-lede" style={{ maxWidth: 720 }}>
              {data.prizeText}
            </p>
          </div>
        </section>
      )}

      {winners.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <span className="eyebrow">Historique</span>
            <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Les gagnants precedents
            </h2>

            <div className="grid" style={{ marginTop: 30 }}>
              {winners.map(function (w) {
                return (
                  <div key={w._id} className="smackbeat-winner-card">
                    {w.image && (
                      <div className="smackbeat-winner-card__image">
                        <img src={w.image} alt={w.winnerName} />
                      </div>
                    )}
                    <div className="smackbeat-winner-card__content">
                      <span className="admin-chip">{w.month}</span>
                      <h3>{w.winnerName}</h3>
                      {w.description && <p>{w.description}</p>}
                      {w.tiktokUrl && (
                        <a href={w.tiktokUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                          Voir sur TikTok
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}