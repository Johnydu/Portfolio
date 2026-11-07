import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza o título principal', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Johny Duarte/ }),
    ).toBeInTheDocument()
  })

  it('tem um único h1 e os landmarks header, main e footer', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('apresenta as seções na ordem da spec', () => {
    render(<App />)
    const ids = Array.from(document.querySelectorAll('main > section')).map(
      (section) => section.id,
    )
    expect(ids).toEqual([
      'inicio',
      'sobre',
      'tecnologias',
      'projetos',
      'trajetoria',
      'contato',
    ])
  })

  it('toda âncora interna da página aponta para um elemento existente', () => {
    render(<App />)
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    )
    expect(anchors.length).toBeGreaterThanOrEqual(7)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(1) ?? ''
      expect(document.getElementById(id), `#${id}`).not.toBeNull()
    }
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
