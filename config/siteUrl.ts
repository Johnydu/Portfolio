import type { Plugin } from 'vite'
import { isHttpsUrl } from '../src/data/isHttpsUrl.ts'

export const SITE_URL_PLACEHOLDER = '%SITE_URL%'
const DEV_SITE_URL = 'http://localhost:5173'

export function resolveSiteUrl(
  command: 'build' | 'serve',
  value: string | undefined,
): string {
  const url = value?.trim()

  if (command === 'build') {
    if (!url || !isHttpsUrl(url)) {
      throw new Error(
        'VITE_SITE_URL é obrigatória no build e deve ser uma URL https. ' +
          'Exemplo: VITE_SITE_URL=https://johnydu.github.io/Portfolio',
      )
    }
    return url.replace(/\/+$/, '')
  }

  return url ? url.replace(/\/+$/, '') : DEV_SITE_URL
}

export function applySiteUrl(html: string, siteUrl: string): string {
  return html.replaceAll(SITE_URL_PLACEHOLDER, siteUrl)
}

export function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => applySiteUrl(html, siteUrl),
  }
}
