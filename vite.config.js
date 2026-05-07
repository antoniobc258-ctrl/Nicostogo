// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,tsx,js,ts}',
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'] } // separa vendor
      }
    }
  }
})
