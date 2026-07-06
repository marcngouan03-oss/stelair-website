import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attache automatiquement le token admin (stocke en memoire via localStorage)
// a chaque requete si present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stelair_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token est expire/invalide, on nettoie la session locale.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("stelair_admin_token");
      localStorage.removeItem("stelair_admin_info");
    }
    return Promise.reject(error);
  }
);

export default api;
