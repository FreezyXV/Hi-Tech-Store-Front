import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? "/" : "/Hi-Tech-Store-Front/",
  server: {
    port: 3000,
  },
  define: {
    "process.env": {
      VITE_API_URL: JSON.stringify(
        process.env.VITE_API_URL_VERCEL || process.env.VITE_API_URL
      ),
      VITE_STRIPE_PUBLISHABLE_KEY: JSON.stringify(
        process.env.VITE_STRIPE_PUBLISHABLE_KEY
      ),
    },
  },
});

