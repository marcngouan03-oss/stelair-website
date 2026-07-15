import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/help-widget.css";

// Bouton flottant "Besoin d'aide ?" : active/desactive et rempli entierement
// depuis l'admin (texte du bouton + liste des actualites affichees a l'ouverture).
export default function HelpWidget() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/help-widget").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data || !data.isActive) return null;

  const items = data.items || [];

  return (
    <div className={`help-widget ${open ? "help-widget--open" : ""}`}>
      {open && (
        <div className="help-widget__panel">
          <div className="help-widget__panel-header">
            <span>Actualites</span>
            <button
              className="help-widget__close"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>

          <div className="help-widget__list">
            {items.length === 0 ? (
              <p className="help-widget__empty">Rien de nouveau pour le moment.</p>
            ) : (
              items.map((item, i) => (
                <div key={i} className="help-widget__item">
                  <p>{item.text}</p>
                  {item.link && item.linkLabel && (
                    <>
                      {item.link.startsWith("http") ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="help-widget__item-link">
                          {item.linkLabel} &rarr;
                        </a>
                      ) : (
                        <Link to={item.link} className="help-widget__item-link" onClick={() => setOpen(false)}>
                          {item.linkLabel} &rarr;
                        </Link>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button className="help-widget__button" onClick={() => setOpen((o) => !o)}>
        <span className="help-widget__button-icon">{open ? "×" : "?"}</span>
        <span>{data.buttonLabel || "Besoin d'aide ?"}</span>
      </button>
    </div>
  );
}
