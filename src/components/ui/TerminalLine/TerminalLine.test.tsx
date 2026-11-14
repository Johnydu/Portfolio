import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TerminalLine } from './TerminalLine'

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('TerminalLine', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('digita um caractere a cada 45 ms e para ao terminar', () => {
    mockReducedMotion(false)
    const { container } = render(<TerminalLine text="abc" />)
    const typed = container.querySelector('[aria-hidden="true"]')
    expect(typed).toHaveTextContent('>')
    act(() => {
      vi.advanceTimersByTime(45 * 3)
    })
    expect(typed).toHaveTextContent('> abc')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('mostra o texto completo de imediato com movimento reduzido', () => {
    mockReducedMotion(true)
    const { container } = render(<TerminalLine text="abc" />)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '> abc',
    )
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancela o temporizador ao desmontar', () => {
    mockReducedMotion(false)
    const { unmount } = render(<TerminalLine text="abc" />)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('aceita texto vazio', () => {
    mockReducedMotion(false)
    const { container } = render(<TerminalLine text="" />)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      '>',
    )
  })
})
