import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

function stubIntersectionObserver() {
  let callback: ObserverCallback = () => {}
  class FakeObserver {
    constructor(cb: ObserverCallback) {
      callback = cb
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return (entries: Partial<IntersectionObserverEntry>[]) =>
    act(() => callback(entries))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Header', () => {
  it('o primeiro elemento focável é o link pular para o conteúdo', async () => {
    render(<Header />)
    await userEvent.tab()
    const skipLink = screen.getByRole('link', { name: /Pular para o conteúdo/ })
    expect(skipLink).toHaveFocus()
    expect(skipLink).toHaveAttribute('href', '#conteudo')
  })

  it('tem os cinco links de navegação com os hrefs esperados', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(links).toEqual([
      ['Sobre', '#sobre'],
      ['Tecnologias', '#tecnologias'],
      ['Projetos', '#projetos'],
      ['Trajetória', '#trajetoria'],
      ['Contato', '#contato'],
    ])
  })

  it('funciona quando o navegador não tem IntersectionObserver', () => {
    expect('IntersectionObserver' in globalThis).toBe(false)
    render(<Header />)
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeVisible()
    expect(document.querySelector('[aria-current]')).toBeNull()
  })

  it('marca com aria-current o item da seção visível', () => {
    const notify = stubIntersectionObserver()
    render(
      <>
        <Header />
        {['sobre', 'tecnologias', 'projetos', 'trajetoria', 'contato'].map(
          (id) => (
            <section key={id} id={id} />
          ),
        )}
      </>,
    )
    notify([
      {
        isIntersecting: true,
        target: document.getElementById('projetos') as Element,
      },
    ])
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Sobre' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})

describe('Footer', () => {
  it('tem links https para LinkedIn, GitHub e Instagram que abrem em nova aba', () => {
    render(<Footer />)
    const expected: Record<string, string> = {
      LinkedIn: 'https://www.linkedin.com/in/johny-duarte-3a2b6435b/',
      GitHub: 'https://github.com/Johnydu',
      Instagram: 'https://www.instagram.com/johnydu/',
    }
    for (const [name, href] of Object.entries(expected)) {
      const link = screen.getByRole('link', { name: new RegExp(name) })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('mostra o nome e os direitos autorais', () => {
    render(<Footer />)
    expect(screen.getByText(/©\s*\d{4}\s*Johny Duarte/)).toBeInTheDocument()
  })
})

describe('layout', () => {
  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <>
        <Header />
        <main id="conteudo">
          <h1>Título</h1>
        </main>
        <Footer />
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
