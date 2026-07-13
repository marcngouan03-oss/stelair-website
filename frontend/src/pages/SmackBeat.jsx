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
    return rankLabel[r] || `${r}eme`;
  }

  return (
    <div className="smackbeat-page">
      {instrumentalReady && (
        <a
          href={data.instrumentalUrl}
          download
          className="smackbeat-float-download"
          aria-label="Telecharger l'instrumental"
        >
          <span className="smackbeat-float-download__icon">↓</span>
          <span>Telecharger l'instru</span>
        </a>
      )}

      <div className="container">
        <div className="smackbeat-topbar">
          <span className="smackbeat-topbar__spacer" />
          {data.tagline && <p className="smackbeat-topbar__tagline">{data.tagline}</p>}
        </div>

        <div className="smackbeat-columns">
          <div className="smackbeat-columns__main">
            <h2 className="smackbeat-heading">condition.</h2>
            <ul className="smackbeat-list">
              <li className="smackbeat-list__item-with-btn">
                <span>telecharge l'instrumental</span>
                {instrumentalReady ? (
                  <a href={data.instrumentalUrl} download className="smackbeat-inline-btn">
                    Telecharger
                  </a>
                ) : (
                  <span className="footer__muted">(bientot disponible)</span>
                )}
              </li>
              <li>
                fait un titre sur l'instrumental
                {studios.length > 0
                  ? " dans l'un de nos studios agrees"
                  : " en studio"}
              </li>
              <li>
                cree un challenge sur tiktok qui atteint ou depasse les{" "}
                {(data.reprisesGoal || 4000).toLocaleString("fr-FR")} reprises
              </li>
            </ul>

            <h2 className="smackbeat-heading" style={{ marginTop: 50 }}>prix.</h2>
            <ul className="smackbeat-list">
              {data.prizeAmount && <li>gagne {data.prizeAmount} en recompense</li>}
              {data.clipCredit && <li>gagne {data.clipCredit}</li>}
              {!data.prizeAmount && !data.clipCredit && (
                <li className="footer__muted">Prix bientot annonces</li>
              )}
            </ul>
          </div>

          {data.conceptImage && (
            <div className="smackbeat-columns__image">
              <img src={data.conceptImage} alt="Smart BitLock" />
            </div>
          )}
        </div>

        {months.length > 0 && (
          <div className="smackbeat-ranking">
            <span className="eyebrow">Classement</span>
            <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Les vainqueurs du challenge
            </h2>

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
                              className="smackbeat-ranking__tiktok"
                              aria-label="Voir sur TikTok"
                            >
                              <SocialIcon platform="tiktok" />
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