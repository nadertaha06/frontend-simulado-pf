import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Em dev (npm run dev), /api/* é repassado para o backend (VITE_PROXY_TARGET).
// Na Vercel quem faz esse papel é o vercel.json.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  }
})
