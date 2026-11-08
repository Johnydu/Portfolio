import type { Plugin } from 'vite'

/**
 * O GitHub Pages não permite cabeçalhos HTTP próprios. A política de
 * segurança que o nginx enviava passa a ir numa <meta> do index.html.
 * `frame-ancestors` e `X-Content-Type-Options` não funcionam via <meta>.
 */
export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'"

const CHARSET_META = '<meta charset="UTF-8" />'

/** Caminho base do site, a partir da URL pública (ex.: /Portfolio/). */
export function basePathFromSiteUrl(siteUrl: string): string {
  const path = new URL(siteUrl).pathname.replace(/\/+$/, '')
  return `${path}/`
}

export function applySecurityMeta(html: string): string {
  if (!html.includes(CHARSET_META)) {
    throw new Error('index.html precisa de <meta charset="UTF-8" />')
  }
  const meta =
    `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />` +
    '<meta name="referrer" content="strict-origin-when-cross-origin" />'
  return html.replace(CHARSET_META, CHARSET_META + meta)
}

/** Só no build: o servidor de desenvolvimento do Vite usa scripts inline. */
export function securityMetaPlugin(): Plugin {
  return {
    name: 'security-meta',
    apply: 'build',
    transformIndexHtml: (html) => applySecurityMeta(html),
  }
}
