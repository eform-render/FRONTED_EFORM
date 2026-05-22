import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* global process */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
    port: Number(process.env.PORT) || 4173,
  },
})
