import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: "/Hi-Tech-Store-Front/", // Set the base path for GitHub Pages
  server: {
    // Add custom server options if needed (e.g., port, proxy)
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ['react-toastify', 'react-toastify/dist/ReactToastify.css'], // External dependencies
    },
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL), // API URL for the front-end
      VITE_STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY), // Stripe Key
    },
  },
});
