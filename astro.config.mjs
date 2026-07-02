// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
    vite: {
    // Redirige /api hacia el server de Express (api/index.js) tanto en
    // `astro dev` como en `astro preview`. En Vercel esto ya lo resuelve
    // el rewrite de vercel.json; esto es solo para local/CI.
    server: { proxy: { '/api': 'http://localhost:3000' } },
    preview: { proxy: { '/api': 'http://localhost:3000' } },
  },
});