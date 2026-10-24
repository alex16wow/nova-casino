import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /nova-casino/.
export default defineConfig({
  base: '/nova-casino/',
  plugins: [react()],
  // Bundles go to static/ so they never mix with the images in public/assets.
  build: { assetsDir: 'static' },
});
