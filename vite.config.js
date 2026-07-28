import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base:'./' + HashRouter is what makes GitHub Pages deep-links work from a
// project subpath (https://<user>.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
