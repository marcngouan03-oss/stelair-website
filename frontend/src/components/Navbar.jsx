import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/layout.css";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/biographie", label: "Biographie" },
  { to: "/musique", label: "Musique" },
  { to: "/videos", label: "Videos" },
  { to: "/boutique", label: "Boutique" },
  { to: "/contact", label: "Contact" },
];

const smackbeatLink = { to: "/smackbeat", label: "SmackBeat" };

// Icone "sac" minimaliste (style Nike) au lieu d'un emoji, pour rester
// coherent avec le reste des icones vectorielles du site.
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 8h11l1 12.2a1.8 1.8 0 0 1-1.8 1.8H7.3a1.8 1.8 0 0 1-1.8-1.8L6.5 8z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const cartCount = cart?.items?.length || 0;

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
          <button
            type="button"
            className="navbar__link navbar__cart"
            onClick={() => {
              setOpen(false);
              cart?.openDrawer();
            }}
            aria-label="Ouvrir le panier"
          >
            <BagIcon />
            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
          </button>
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