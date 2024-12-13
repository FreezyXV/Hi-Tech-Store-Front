import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {

  },
  build: {
    rollupOptions: {
      external: ['react-toastify', 'react-toastify/dist/ReactToastify.css'],
    },
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
      VITE_STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY),
    },
  },
});
