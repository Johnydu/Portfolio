import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const html = readFileSync('index.html', 'utf8')
const doc = new DOMParser().parseFromString(html, 'text/html')

function meta(selector: string): string | null {
  return doc.querySelector(selector)?.getAttribute('content') ?? null
}

describe('index.html', () => {
  it('declara lang pt-BR, title e meta description', () => {
    expect(doc.documentElement.lang).toBe('pt-BR')
    expect(doc.title).toContain('Johny Duarte')
    expect(meta('meta[name="description"]')).toMatch(/Backend Java/)
  })

  it('declara Open Graph com URLs absolutas a partir de %SITE_URL%', () => {
    expect(meta('meta[property="og:title"]')).toBeTruthy()
    expect(meta('meta[property="og:description"]')).toBeTruthy()
    expect(meta('meta[property="og:type"]')).toBe('website')
    expect(meta('meta[property="og:locale"]')).toBe('pt_BR')
    expect(meta('meta[property="og:url"]')).toBe('%SITE_URL%/')
    expect(meta('meta[property="og:image"]')).toBe('%SITE_URL%/og-image.png')
    expect(meta('meta[property="og:image:alt"]')).toBeTruthy()
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  })

  it('declara link canonical', () => {
    expect(
      doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('%SITE_URL%/')
  })

  it('inclui noscript com links para GitHub e LinkedIn', () => {
    const noscript = doc.querySelector('noscript')
    expect(noscript).not.toBeNull()
    const hrefs = Array.from(noscript?.querySelectorAll('a') ?? []).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toContain('https://github.com/Johnydu')
    expect(hrefs).toContain(
      'https://www.linkedin.com/in/johny-duarte-3a2b6435b/',
    )
  })

  it('não contém scripts inline', () => {
    const scripts = Array.from(doc.querySelectorAll('script'))
    expect(scripts.length).toBeGreaterThan(0)
    for (const script of scripts) {
      expect(script.getAttribute('src')).toBeTruthy()
    }
  })
})

describe('arquivos públicos', () => {
  it('existem favicon, robots e imagem Open Graph', () => {
    expect(existsSync('public/favicon.svg')).toBe(true)
    expect(existsSync('public/robots.txt')).toBe(true)
    expect(existsSync('public/og-image.png')).toBe(true)
  })

  it('o favicon tem o monograma JD', () => {
    expect(readFileSync('public/favicon.svg', 'utf8')).toContain('JD')
  })

  it('a imagem Open Graph é um PNG de 1200x630', () => {
    const png = readFileSync('public/og-image.png')
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
  })
})
