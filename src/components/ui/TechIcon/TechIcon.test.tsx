import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TechIcon } from './TechIcon'

describe('TechIcon', () => {
  it('desenha svg decorativo com currentColor quando há ícone', () => {
    const { container } = render(<TechIcon name="PostgreSQL" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('fill', 'currentColor')
  })

  it('mostra iniciais de até duas letras sem ícone', () => {
    const { container } = render(<TechIcon name="Java" />)
    expect(container.querySelector('svg')).toBeNull()
    const el = container.querySelector('[aria-hidden="true"]')
    expect(el?.textContent).toBe('Ja')
  })

  it('usa as iniciais das duas primeiras palavras', () => {
    const { container } = render(<TechIcon name="Testes automatizados" />)
    expect(container.textContent).toBe('Ta')
  })
})
