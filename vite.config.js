import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api/v1': {
        target: 'https://visit-ethiopia-backend-3a56.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
