import { describe, expect, it } from 'vitest'
import { applySiteUrl, resolveSiteUrl } from './siteUrl'

describe('resolveSiteUrl', () => {
  it('falha no build quando VITE_SITE_URL está ausente ou vazia', () => {
    expect(() => resolveSiteUrl('build', undefined)).toThrow(/VITE_SITE_URL/)
    expect(() => resolveSiteUrl('build', '')).toThrow(/VITE_SITE_URL/)
  })

  it('falha no build quando a URL não é https', () => {
    expect(() => resolveSiteUrl('build', 'http://exemplo.test')).toThrow(
      /https/,
    )
    expect(() => resolveSiteUrl('build', 'exemplo.test')).toThrow(/https/)
  })

  it('remove a barra final da URL válida', () => {
    expect(resolveSiteUrl('build', 'https://exemplo.test/')).toBe(
      'https://exemplo.test',
    )
  })

  it('usa localhost no desenvolvimento quando a variável não existe', () => {
    expect(resolveSiteUrl('serve', undefined)).toBe('http://localhost:5173')
  })
})

describe('applySiteUrl', () => {
  it('substitui todos os marcadores %SITE_URL%', () => {
    const html = '<link href="%SITE_URL%/"><meta content="%SITE_URL%/og.png">'
    expect(applySiteUrl(html, 'https://exemplo.test')).toBe(
      '<link href="https://exemplo.test/"><meta content="https://exemplo.test/og.png">',
    )
  })
})
