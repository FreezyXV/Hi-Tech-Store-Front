import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: "/Hi-Tech-Store-Front/", // Set the base path for GitHub Pages
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      // Remove 'react-toastify' from external dependencies
    },
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
      VITE_STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY),
    },
  },
});
