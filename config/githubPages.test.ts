import { describe, expect, it } from 'vitest'
import {
  CONTENT_SECURITY_POLICY,
  applySecurityMeta,
  basePathFromSiteUrl,
} from './githubPages.ts'

describe('basePathFromSiteUrl', () => {
  it('usa o caminho do site do GitHub Pages como base', () => {
    expect(basePathFromSiteUrl('https://johnydu.github.io/Portfolio')).toBe(
      '/Portfolio/',
    )
  })

  it('aceita a URL com barra no final', () => {
    expect(basePathFromSiteUrl('https://johnydu.github.io/Portfolio/')).toBe(
      '/Portfolio/',
    )
  })

  it('usa a raiz quando o site não tem caminho', () => {
    expect(basePathFromSiteUrl('https://exemplo.test')).toBe('/')
  })
})

describe('applySecurityMeta', () => {
  const html =
    '<!doctype html><html><head><meta charset="UTF-8" /><title>x</title></head><body></body></html>'

  it('insere a CSP e a política de referrer logo após o charset', () => {
    const result = applySecurityMeta(html)
    expect(result).toContain(
      `<meta charset="UTF-8" /><meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" /><meta name="referrer" content="strict-origin-when-cross-origin" />`,
    )
  })

  it('mantém a política só com origem própria, sem unsafe-inline', () => {
    expect(CONTENT_SECURITY_POLICY).toBe(
      "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
    )
    expect(CONTENT_SECURITY_POLICY).not.toContain('unsafe')
  })

  it('falha se o HTML não tiver a meta charset', () => {
    expect(() => applySecurityMeta('<html><head></head></html>')).toThrow()
  })
})
