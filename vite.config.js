// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Définir le chemin de base en fonction du mode de build
export default defineConfig(({ mode }) => {
  let base = "/"; // Par défaut pour Vercel

  if (mode === "gh-pages") {
    // Remplacez 'Hi-Tech-Store-Front' par le nom exact de votre dépôt si nécessaire
    base = "/Hi-Tech-Store-Front/";
  }

  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
    },
    build: {
      outDir: "dist",
    },
  };
});
