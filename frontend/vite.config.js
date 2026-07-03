import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  const isVercelBuild = process.env.VERCEL === '1'

  return {
    plugins: [react()],
    build: {
      outDir: isVercelBuild ? 'dist' : '../src/main/resources/static',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://gymtracker-8tzz.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})
