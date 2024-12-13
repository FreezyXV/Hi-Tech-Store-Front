import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    // No proxy needed if calling API directly from axiosInstance
    // If you want a proxy, you can add it back here.
  },
});
