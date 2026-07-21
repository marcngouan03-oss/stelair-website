import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const adminBase = `/${import.meta.env.VITE_ADMIN_PATH || "backstage"}`;

const links = [
  { to: "", label: "Tableau de bord", end: true },
  { to: "/heros", label: "Heros / Bannieres" },
  { to: "/musique", label: "Musique" },
  { to: "/videos", label: "Videos" },
  { to: "/biographie", label: "Biographie" },
  { to: "/reseaux", label: "Reseaux sociaux" },
  { to: "/plateformes", label: "Plateformes streaming" },
  { to: "/agents", label: "Agents / Contacts" },
  { to: "/demandes", label: "Demandes de collab" },
  { to: "/beats", label: "Boutique — Catalogue" },
  { to: "/ventes", label: "Boutique — Ventes" },
  { to: "/boutique-reglages", label: "Boutique — Logos de paiement" },
  { to: "/smackbeat", label: "SmackBeat" },
  { to: "/smackbeat-gagnants", label: "SmackBeat — Gagnants" },
  { to: "/bouton-aide", label: "Bouton d'aide" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="admin-shell">
      <header className="admin-mobile-topbar">
        <div className="admin-mobile-topbar__logo">
          STE<span>LAIR</span>
        </div>
        <button
          className={`admin-mobile-topbar__toggle ${menuOpen ? "admin-mobile-topbar__toggle--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Ouvrir le menu d'administration"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && <div className="admin-sidebar__backdrop" onClick={closeMenu} />}

      <aside className={`admin-sidebar ${menuOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__logo">
          STE<span>LAIR</span>
        </div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={`${adminBase}${l.to}`}
            end={l.end}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            {l.label}
          </NavLink>
        ))}
        <button
          className="admin-sidebar__logout"
          onClick={() => {
            closeMenu();
            logout();
          }}
        >
          Deconnexion {admin?.name ? `(${admin.name})` : ""}
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}