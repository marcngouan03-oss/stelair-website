import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import SocialIcon from "./SocialIcon";
import "../styles/layout.css";

export default function Footer() {
  const [socials, setSocials] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    api.get("/socials").then((r) => setSocials(r.data)).catch(() => {});
    api.get("/platforms").then((r) => setPlatforms(r.data)).catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">STELAIR</div>
        </div>

        <div className="footer__col">
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/biographie">Biographie</Link>
          <Link to="/musique">Musique</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/contact">Contact / Booking</Link>
        </div>

        <div className="footer__col">
          <h4>Ecouter</h4>
          {platforms.length === 0 && <span className="footer__muted">Bientot disponible</span>}
          {platforms.map((p) => (
            <a key={p._id} href={p.url} target="_blank" rel="noreferrer">
              {p.label || p.platform}
            </a>
          ))}
        </div>

        <div className="footer__col">
          <h4>Suivre</h4>
          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s._id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.platform}
                className="footer__social-icon"
              >
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        
        <span className="footer__copyright">
          © {new Date().getFullYear()} STELAIR. Tous droits reserves.
        </span>

        <span className="footer__credit">CREATEUR : Marc N'gouan</span>

        {/* Lien discret vers l'espace d'administration : un simple point, sans texte visible */}
        <Link
          to={`/${import.meta.env.VITE_ADMIN_PATH.replace(/^\/+/, "")}/connexion`}
          className="footer__admin-dot"
        >
          •
        </Link>
      </div>
    </footer>
  );
}