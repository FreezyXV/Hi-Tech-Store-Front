// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Définir le chemin de base en fonction du mode de build
export default defineConfig(({ mode }) => {
  let base = "/"; // Par défaut pour Vercel

  if (mode === "gh-pages") {
    // Chemin de base pour GitHub Pages
    base = "/Hi-Tech-Store-Front/";
  }

  console.log(`Build mode: ${mode}, Base path: ${base}`); // Ajouté pour le diagnostic

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
