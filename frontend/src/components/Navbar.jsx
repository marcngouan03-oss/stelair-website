import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/layout.css";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/biographie", label: "Biographie" },
  { to: "/musique", label: "Musique" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact" },
];

const smackbeatLink = { to: "/smackbeat", label: "SmackBeat" };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [window.location.pathname]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          STELAIR
        </NavLink>

        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to={smackbeatLink.to}
            className={({ isActive }) =>
              `navbar__link navbar__link--smackbeat ${isActive ? "navbar__link--active" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            {smackbeatLink.label}
          </NavLink>
        </nav>

        <button
          className={`navbar__burger ${open ? "navbar__burger--open" : ""}`}
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}