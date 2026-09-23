import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Remplacer par le domaine final de production lors du lancement public
  site: 'https://trajektia.qc.ca',
  integrations: [sitemap(), react()],
  server: {
    port: 3000,
    host: true
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', 'motion/react']
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    }
  },
});
