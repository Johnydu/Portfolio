import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { resolveSiteUrl, siteUrlPlugin } from './config/siteUrl.ts'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = resolveSiteUrl(command, env.VITE_SITE_URL)

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
    build: {
      assetsInlineLimit: 0,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: false,
      css: false,
    },
  }
})
