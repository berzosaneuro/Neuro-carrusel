import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the same build works both at a domain root (Vercel) and
// under a subdirectory (GitHub Pages). Routing uses HashRouter, so the
// document URL always stays at the base directory and relative asset paths
// resolve correctly.
export default defineConfig({
  base: './',
  plugins: [react()],
})
