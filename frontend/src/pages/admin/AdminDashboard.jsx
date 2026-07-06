import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const adminBase = `/${import.meta.env.VITE_ADMIN_PATH || "backstage"}`;

const cards = [
  { to: "/heros", title: "Heros / Bannieres", desc: "Gerer les grandes images/videos d'accueil de chaque page." },
  { to: "/musique", title: "Musique", desc: "Ajouter vos titres, albums et playlists Spotify/Deezer/SoundCloud." },
  { to: "/videos", title: "Videos", desc: "Ajouter vos clips YouTube a regarder directement sur le site." },
  { to: "/biographie", title: "Biographie", desc: "Modifier les textes de la page Biographie / Ma Musique." },
  { to: "/reseaux", title: "Reseaux sociaux", desc: "Instagram, Facebook, TikTok, X..." },
  { to: "/plateformes", title: "Plateformes streaming", desc: "Spotify, Apple Music, SoundCloud, Deezer..." },
  { to: "/agents", title: "Agents / Contacts", desc: "Contacts affiches sur la page Contact / Booking." },
  { to: "/demandes", title: "Demandes de collab", desc: "Consulter les messages recus via le formulaire du site." },
];

export default function AdminDashboard() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    api.get("/collab").then((r) => setCount(r.data.filter((c) => c.status === "nouveau").length)).catch(() => {});
  }, []);

  return (
    <div>
      <span className="eyebrow">Bienvenue</span>
      <h2 className="section-title" style={{ fontSize: "2.2rem" }}>
        Tableau de bord
      </h2>
      <p style={{ color: "var(--c-grey)", maxWidth: 560 }}>
        Gerez tout le contenu du site depuis cet espace : images, videos, musique, textes et
        demandes de collaboration. Cette page n&apos;est accessible qu&apos;a l&apos;adresse{" "}
        <code>{adminBase}</code> — gardez ce lien confidentiel.
      </p>
      {count > 0 && (
        <p style={{ color: "var(--c-ember)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
          {count} nouvelle(s) demande(s) de collaboration non traitee(s).
        </p>
      )}

      <div className="dashboard-grid">
        {cards.map((c) => (
          <Link key={c.to} to={`${adminBase}${c.to}`} className="dashboard-card">
            <span className="eyebrow">Gerer</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
