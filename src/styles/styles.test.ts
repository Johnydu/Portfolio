import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const globalCss = readFileSync('src/styles/global.css', 'utf8')

function token(name: string): string {
  const match = tokens.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`Token ${name} não encontrado`)
  return match[1]
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const value = parseInt(hex.slice(i, i + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

describe('tokens.css', () => {
  it('define as cores base da spec', () => {
    expect(token('--color-bg').toUpperCase()).toBe('#141413')
    expect(token('--color-surface').toUpperCase()).toBe('#1C1C1A')
    expect(token('--color-border').toUpperCase()).toBe('#2C2C2A')
    expect(token('--color-text').toUpperCase()).toBe('#F1EFE8')
    expect(token('--color-text-muted').toUpperCase()).toBe('#B4B2A9')
    expect(token('--color-accent').toUpperCase()).toBe('#EF9F27')
  })

  it.each([
    ['--color-text', '--color-bg'],
    ['--color-text', '--color-surface'],
    ['--color-text-muted', '--color-bg'],
    ['--color-text-muted', '--color-surface'],
    ['--color-accent-text', '--color-bg'],
    ['--color-accent-text', '--color-surface'],
    ['--color-on-accent', '--color-accent'],
  ])('contraste de %s sobre %s é no mínimo 4.5:1 (WCAG AA)', (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5)
  })
})

describe('global.css', () => {
  it('define foco visível para elementos interativos', () => {
    expect(globalCss).toContain(':focus-visible')
  })

  it('só anima quando o usuário não pede movimento reduzido', () => {
    expect(globalCss).toContain('prefers-reduced-motion: no-preference')
  })

  it('não usa cores fora dos tokens', () => {
    expect(globalCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })
})
