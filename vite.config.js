import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? "/" : "/Hi-Tech-Store-Front/", // Use "/" for Vercel, GitHub Pages base for GitHub
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      // Customize Rollup options if needed
    },
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL_VERCEL || process.env.VITE_API_URL), // Use VERCEL API URL if available
      VITE_STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY),
    },
  },
});
