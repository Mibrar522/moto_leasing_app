import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: env.VITE_APP_HOST || '0.0.0.0',
      port: Number(env.VITE_APP_PORT || 5173),
      strictPort: true,
    },
  }
})
