import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@mascot': path.resolve(__dirname, './src/mascot'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@journal': path.resolve(__dirname, './src/journal'),
      '@backdrops': path.resolve(__dirname, './src/backdrops'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
})
