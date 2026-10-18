import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve('certs/key.pem')),
      cert: fs.readFileSync(path.resolve('certs/cert.pem')),
    },
    host: true,
    port: 5173,
  },
})