import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    // Allow your ngrok URL
    allowedHosts: ['utile-ester-isopiestically.ngrok-free.dev']
    
    // If you want to allow any host for testing, you can use:
    // allowedHosts: 'all'
  }
})
