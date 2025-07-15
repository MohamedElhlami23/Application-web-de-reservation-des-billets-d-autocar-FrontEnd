import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173, // <- le bon port ici
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // <- ton backend Spring Boot
        changeOrigin: true,
        secure: false,
      },
    },
  },
});