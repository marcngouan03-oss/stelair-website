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
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          STE<span>LAIR</span>
        </div>
        {links.map((l) => (
          <NavLink key={l.to} to={`${adminBase}${l.to}`} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
        <button className="admin-sidebar__logout" onClick={logout}>
          Deconnexion {admin?.name ? `(${admin.name})` : ""}
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
