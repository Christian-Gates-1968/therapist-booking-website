import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      events: 'events',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['simple-peer', 'events', 'util'],
  },
});