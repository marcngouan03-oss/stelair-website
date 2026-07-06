import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Biography from "./pages/Biography";
import Music from "./pages/Music";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHeroes from "./pages/admin/AdminHeroes";
import AdminTracks from "./pages/admin/AdminTracks";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminBio from "./pages/admin/AdminBio";
import AdminSocials from "./pages/admin/AdminSocials";
import AdminPlatforms from "./pages/admin/AdminPlatforms";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminCollabs from "./pages/admin/AdminCollabs";

// Le chemin de la page admin est configurable via VITE_ADMIN_PATH pour rester discret
// et facile a changer sans toucher au code (ex: /backstage, /studio-stelair, etc.)
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "backstage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- SITE PUBLIC --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/biographie" element={<Biography />} />
          <Route path="/musique" element={<Music />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* --- ADMINISTRATION (lien discret) --- */}
        <Route path={`/${ADMIN_PATH}/connexion`} element={<AdminLogin />} />
        <Route
          path={`/${ADMIN_PATH}`}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="heros" element={<AdminHeroes />} />
          <Route path="musique" element={<AdminTracks />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="biographie" element={<AdminBio />} />
          <Route path="reseaux" element={<AdminSocials />} />
          <Route path="plateformes" element={<AdminPlatforms />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="demandes" element={<AdminCollabs />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
