// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Copy file _redirects sang dist sau khi build
    {
      name: 'copy-netlify-redirects',
      apply: 'build',
      closeBundle() {
        const src = resolve(__dirname, 'public', '_redirects');
        const outDir = resolve(__dirname, 'dist');
        const dest = resolve(outDir, '_redirects');

        if (existsSync(src)) {
          if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
          copyFileSync(src, dest);
          console.log('\n[netlify] Copied public/_redirects -> dist/_redirects\n');
        } else {
          console.warn('\n[netlify] WARNING: public/_redirects not found. SPA routes may 404 on Netlify.\n');
        }
      },
    },
  ],
  server: { port: 5173 },
});
