import { describe, expect, it } from 'vitest'
import { isHttpsUrl } from './isHttpsUrl'

describe('isHttpsUrl', () => {
  it('aceita URLs https', () => {
    expect(isHttpsUrl('https://github.com/Johnydu')).toBe(true)
  })

  it('rejeita http, javascript, mailto e URLs inválidas', () => {
    expect(isHttpsUrl('http://github.com')).toBe(false)
    expect(isHttpsUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpsUrl('mailto:alguem@exemplo.com')).toBe(false)
    expect(isHttpsUrl('github.com/Johnydu')).toBe(false)
    expect(isHttpsUrl('')).toBe(false)
  })
})
