import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
    include: ["@emotion/react"],
  },
    build: {
    rollupOptions: {
      output: {
        entryFileNames: `api/build/static/[name].js`,
        chunkFileNames: `api/build/static/[name].js`,
        assetFileNames: `api/build/static/[name].[ext]`
      }
    }
    },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
