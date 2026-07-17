import { useEffect, useState } from "react";
import api from "../api/api";
import SocialIcon from "../components/SocialIcon";
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

  const studios = data.studios || [];
  const instrumentalReady = !!data.instrumentalUrl;

  const customRules = (data.rulesText || "")
    .split("\n")
    .map(function (l) { return l.trim(); })
    .filter(function (l) { return l !== ""; });

  const winnersByMonth = {};
  winners.forEach(function (w) {
    if (!winnersByMonth[w.month]) winnersByMonth[w.month] = [];
    winnersByMonth[w.month].push(w);
  });
  const months = Object.keys(winnersByMonth).sort().reverse();
  months.forEach(function (m) {
    winnersByMonth[m].sort(function (a, b) {
      return (a.rank || 1) - (b.rank || 1);
    });
  });

  const rankLabel = { 1: "1er", 2: "2eme", 3: "3eme", 4: "4eme" };

  function getRankLabel(rank) {
    const r = rank || 1;
    return rankLabel[r] || (r + "eme");
  }

  return (
    <div className="smackbeat-page">
      {data.heroImage && (
        <div className="smackbeat-hero">
          <img src={data.heroImage} alt="SmackBeat" />
          <div className="smackbeat-hero__overlay" />
          <div className="container smackbeat-hero__content">
            <span className="eyebrow">Challenge du mois</span>
            <h1 className="smackbeat-hero__title">SmackBeat</h1>
          </div>
        </div>
      )}

      <div className={`container smackbeat-content ${data.heroImage ? "smackbeat-content--with-hero" : ""}`}>
        {!data.heroImage && (
          <>
            <span className="eyebrow">Challenge du mois</span>
            <h1 className="smackbeat-hero__title" style={{ marginBottom: 10 }}>SmackBeat</h1>
          </>
        )}

        {data.tagline && <p className="smackbeat-intro">{data.tagline}</p>}

        <div className="smackbeat-block">
          <h2 className="smackbeat-heading">Comment participer</h2>

          <div className="smackbeat-download-cta">
            {instrumentalReady ? (
              <a href={data.instrumentalUrl} download className="smackbeat-inline-btn">
                ↓ Telecharger l'instrumental
              </a>
            ) : (
              <span className="footer__muted">Instrumental bientot disponible</span>
            )}
          </div>

          {customRules.length > 0 ? (
            <ol className="smackbeat-steps-list">
              {customRules.map(function (rule, i) {
                return <li key={i}>{rule}</li>;
              })}
            </ol>
          ) : (
            <ol className="smackbeat-steps-list">
              <li>
                Enregistre un titre sur l'instrumental
                {studios.length > 0
                  ? " dans l'un de nos studios agrees."
                  : " en studio."}
              </li>
              <li>
                Cree un challenge TikTok qui atteint ou depasse les{" "}
                {(data.reprisesGoal || 4000).toLocaleString("fr-FR")} reprises.
              </li>
            </ol>
          )}
        </div>

        {data.conceptImage && (
          <div className="smackbeat-feature-image">
            <img src={data.conceptImage} alt="SmackBeat" />
          </div>
        )}

        <div className="smackbeat-block">
          <h2 className="smackbeat-heading">Recompenses</h2>
          {data.prizeAmount && <p className="smackbeat-prize-amount">{data.prizeAmount}</p>}
          <ul className="smackbeat-list">
            {data.clipCredit && <li>{data.clipCredit}.</li>}
            {!data.prizeAmount && !data.clipCredit && (
              <li className="footer__muted">Prix bientot annonces.</li>
            )}
          </ul>
        </div>

        {months.length > 0 && (
          <div className="smackbeat-ranking">
            <span className="eyebrow">Classement</span>
            <h2 className="smackbeat-heading">Les vainqueurs du challenge</h2>

            {months.map(function (month) {
              const monthWinners = winnersByMonth[month];
              return (
                <div key={month} className="smackbeat-ranking__month">
                  <h3 className="smackbeat-ranking__month-title">{month}</h3>
                  <div className="smackbeat-ranking__list">
                    {monthWinners.map(function (w) {
                      return (
                        <div key={w._id} className="smackbeat-ranking__row">
                          <span className="smackbeat-ranking__rank">
                            {getRankLabel(w.rank)}
                          </span>

                          <div className="smackbeat-ranking__person">
                            {w.image && (
                              <div className="smackbeat-ranking__image">
                                <img src={w.image} alt={w.winnerName} />
                              </div>
                            )}
                            <div className="smackbeat-ranking__info">
                              <strong>{w.winnerName}</strong>
                              {w.repriseCount ? (
                                <span className="footer__muted">
                                  {w.repriseCount.toLocaleString("fr-FR")} republications
                                </span>
                              ) : null}
                            </div>
                          </div>

                          {w.tiktokUrl && (
                            <a
                              href={w.tiktokUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={
                                data.tiktokIcon
                                  ? "smackbeat-ranking__tiktok smackbeat-ranking__tiktok--custom"
                                  : "smackbeat-ranking__tiktok smackbeat-ranking__tiktok--default"
                              }
                              aria-label="Voir sur TikTok"
                            >
                              {data.tiktokIcon ? (
                                <img src={data.tiktokIcon} alt="TikTok" />
                              ) : (
                                <SocialIcon platform="tiktok" />
                              )}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
