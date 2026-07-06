import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "host: true" fait apparaitre l'URL reseau (ex: http://192.168.x.x:5173) en plus
// de l'URL locale quand tu lances "npm run dev" -> pratique pour tester sur telephone.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
  },
});
