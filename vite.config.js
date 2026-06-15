import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }),
    viteCompression({ algorithm: 'gzip' }),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    // Enable code splitting with manual chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: stable deps that rarely change (good for caching)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'vendor-auth': ['@react-oauth/google', 'axios'],
          'vendor-misc': ['react-hot-toast', 'react-helmet-async'],
        },
      },
    },
    // Increase chunk size warning threshold (we're intentionally splitting)
    chunkSizeWarningLimit: 600,
    // Enable source map for production debugging (disable if bundle size is a concern)
    sourcemap: false,
    // Minify with esbuild (default, fastest)
    minify: 'esbuild',
    // Target modern browsers (reduces polyfill weight)
    target: 'es2020',
  },
  // Pre-bundle heavy deps for fast dev-server cold starts
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react'],
  },
})
