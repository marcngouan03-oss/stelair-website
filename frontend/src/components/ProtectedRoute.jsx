import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const adminBase = `/${import.meta.env.VITE_ADMIN_PATH || "backstage"}`;

  if (!isAuthenticated) {
    return <Navigate to={`${adminBase}/connexion`} replace />;
  }
  return children;
}
