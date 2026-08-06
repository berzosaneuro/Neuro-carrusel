import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<user>.github.io/neuro-carrusel/, so assets need that prefix.
export default defineConfig({
  base: '/neuro-carrusel/',
  plugins: [react()],
})
