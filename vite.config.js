import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes every asset path relative, so the built site works on
// GitHub Pages (any repository name), Netlify, Vercel or a plain folder.
export default defineConfig({
  plugins: [react()],
});
