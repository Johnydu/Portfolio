import { readFileSync } from 'node:fs'
import { act, render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { profile } from '../../data/profile'
import { Hero } from '../../sections/Hero/Hero'
import { TerminalLine } from '../../components/ui/TerminalLine/TerminalLine'

const heroCss = readFileSync('src/sections/Hero/Hero.module.css', 'utf8')
const heroTsx = readFileSync('src/sections/Hero/Hero.tsx', 'utf8')
const terminalTsx = readFileSync(
  'src/components/ui/TerminalLine/TerminalLine.tsx',
  'utf8',
)
const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const globalCss = readFileSync('src/styles/global.css', 'utf8')
const revealCss = readFileSync(
  'src/components/ui/Reveal/Reveal.module.css',
  'utf8',
)
const revealTsx = readFileSync('src/components/ui/Reveal/Reveal.tsx', 'utf8')

const TERMINAL = 'johny.duarte --stack java spring postgresql'
const STATEMENT =
  'Sistemas backend para processos reais, do chão de fábrica ao estoque.'

function stubMatchMedia(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

function stubIntersectionObserver() {
  class FakeIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function follows(a: Node, b: Node): boolean {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function typedPart(container: HTMLElement): HTMLElement {
  const hidden = container.querySelector('p [aria-hidden="true"]')
  if (!hidden) throw new Error('Parte digitada (aria-hidden) não encontrada')
  return hidden as HTMLElement
}

function statementParagraph(): HTMLElement {
  return screen.getByText(
    (_, el) => el?.tagName === 'P' && el.textContent === STATEMENT,
  )
}

beforeEach(() => {
  stubIntersectionObserver()
  stubMatchMedia(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('dados do perfil', () => {
  it('perfilTemTerminalFraseEPalavraDeDestaque', () => {
    expect(profile.terminal).toBe(TERMINAL)
    expect(profile.statement).toBe(STATEMENT)
    expect(profile.statementHighlight).toBe('reais')
  })
})

describe('composição do topo', () => {
  it('ordenaTerminalTituloFraseBotoesEFoto', () => {
    render(<Hero />)
    const terminal = screen.getByText(TERMINAL)
    const h1 = screen.getByRole('heading', { level: 1, name: 'Johny Duarte' })
    const projetos = screen.getByRole('link', { name: 'Ver projetos' })
    const linkedin = screen.getByRole('link', { name: /^LinkedIn\b/ })
    const photo = screen.getByRole('img', { name: profile.photo.alt })
    expect(follows(terminal, h1)).toBe(true)
    expect(follows(h1, statementParagraph())).toBe(true)
    expect(follows(statementParagraph(), projetos)).toBe(true)
    expect(follows(projetos, linkedin)).toBe(true)
    expect(follows(linkedin, photo)).toBe(true)
  })

  it('fotoVemDepoisDoTextoNoFluxoParaFicarEmbaixoNoCelular', () => {
    const { container } = render(<Hero />)
    const photo = screen.getByRole('img', { name: profile.photo.alt })
    const h1 = screen.getByRole('heading', { level: 1, name: 'Johny Duarte' })
    expect(follows(h1, photo)).toBe(true)
    // largura e altura declaradas evitam salto de layout e corte
    expect(photo).toHaveAttribute('width')
    expect(photo).toHaveAttribute('height')
    expect(container.querySelectorAll('img')).toHaveLength(1)
  })
})

describe('TerminalLine e leitores de tela', () => {
  it('expoeOTextoCompletoDeUmaVezEEscondeAParteDigitada', () => {
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text={TERMINAL} />)
    const p = container.querySelector('p') as HTMLElement
    expect(p).not.toBeNull()

    const full = within(p).getByText(TERMINAL)
    expect(full.closest('[aria-hidden="true"]')).toBeNull()

    const typed = typedPart(container)
    expect(typed).toHaveAttribute('aria-hidden', 'true')
    expect(typed.textContent?.startsWith('> ')).toBe(true)

    const exposed = Array.from(p.childNodes)
      .filter(
        (n) =>
          !(n instanceof HTMLElement && n.getAttribute('aria-hidden') === 'true'),
      )
      .map((n) => n.textContent)
      .join('')
    expect(exposed).toBe(TERMINAL)
  })

  it('cursorEDecorativoEFicaEscondidoDosLeitoresDeTela', () => {
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text={TERMINAL} />)
    const cursor = container.querySelector('[class*="cursor"]')
    expect(cursor).not.toBeNull()
    expect(cursor).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('TerminalLine e movimento', () => {
  it('mostraOTextoCompletoDeImediatoSemTemporizadorComMovimentoReduzido', () => {
    stubMatchMedia(true)
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text={TERMINAL} />)
    expect(typedPart(container).textContent).toBe(`> ${TERMINAL}`)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('digitaUmCaracterePorVezACada45msEPara', () => {
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text={TERMINAL} />)
    expect(typedPart(container).textContent).not.toContain(TERMINAL)

    act(() => {
      vi.advanceTimersByTime(45 * 3)
    })
    expect(typedPart(container).textContent).toBe(`> ${TERMINAL.slice(0, 3)}`)

    act(() => {
      vi.advanceTimersByTime(45 * (TERMINAL.length - 3))
    })
    expect(typedPart(container).textContent).toBe(`> ${TERMINAL}`)
    expect(vi.getTimerCount()).toBe(0)

    act(() => {
      vi.advanceTimersByTime(45 * 30)
    })
    expect(typedPart(container).textContent).toBe(`> ${TERMINAL}`)
  })

  it('naoTerminaAntesDeTodosOsCaracteres', () => {
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text={TERMINAL} />)
    act(() => {
      vi.advanceTimersByTime(45 * TERMINAL.length - 1)
    })
    expect(typedPart(container).textContent).toBe(
      `> ${TERMINAL.slice(0, TERMINAL.length - 1)}`,
    )
  })

  it('cancelaOTemporizadorAoDesmontarNoMeioDaDigitacao', () => {
    vi.useFakeTimers()
    const { unmount } = render(<TerminalLine text={TERMINAL} />)
    act(() => {
      vi.advanceTimersByTime(45 * 5)
    })
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('mostraSoOPromptEOCursorQuandoOTextoEVazio', () => {
    vi.useFakeTimers()
    const { container } = render(<TerminalLine text="" />)
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(typedPart(container).textContent).toBe('> ')
    expect(container.querySelector('[class*="cursor"]')).not.toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('frase de destaque', () => {
  it('poeAPalavraReaisEmSpanProprioEMantemAFraseLegivelComoTextoUnico', () => {
    const { container } = render(<Hero />)
    const highlight = container.querySelector('[class*="highlight"]')
    expect(highlight).not.toBeNull()
    expect(highlight?.tagName).toBe('SPAN')
    expect(highlight?.textContent).toBe(profile.statementHighlight)
    const paragraph = statementParagraph()
    expect(paragraph).toContainElement(highlight as HTMLElement)
    expect(paragraph.textContent).toBe(profile.statement)
  })
})

describe('botões', () => {
  it('botaoPrincipalLevaAProjetos', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute(
      'href',
      '#projetos',
    )
  })

  it('botaoLinkedInAbreEmNovaAbaDeFormaSegura', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /^LinkedIn\b/ })
    expect(link).toHaveAttribute('href', profile.links.linkedin)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('foto em quadro', () => {
  it('usaAFotoDoPerfilEMarcasDeCotaSaoDecorativas', () => {
    const { container } = render(<Hero />)
    const photo = screen.getByRole('img', { name: profile.photo.alt })
    expect(photo).toHaveAttribute('src', profile.photo.src)
    expect(photo).toHaveAttribute('alt', profile.photo.alt)
    expect(photo).toHaveAttribute('width', String(profile.photo.width))
    expect(photo).toHaveAttribute('height', String(profile.photo.height))

    const terminalP = typedPart(container).closest('p')
    const section = photo.closest('section') ?? container
    let frame: HTMLElement | null = photo.parentElement
    let marks: HTMLElement[] = []
    while (frame && frame !== section) {
      marks = Array.from(
        frame.querySelectorAll<HTMLElement>('[aria-hidden="true"]'),
      ).filter((el) => !terminalP?.contains(el))
      if (marks.length > 0) break
      frame = frame.parentElement
    }
    expect(marks.length).toBeGreaterThan(0)
    expect(frame).not.toBe(section)
    expect(frame).not.toContainElement(
      screen.getByRole('heading', { level: 1, name: 'Johny Duarte' }),
    )
    // o quadro só expõe a foto: as marcas de cota não entram na leitura
    expect(within(frame as HTMLElement).getAllByRole('img')).toHaveLength(1)
  })

  it('quadroTemBordaEmAccentECantosRetos', () => {
    const css = stripComments(heroCss)
    expect(css).toMatch(/border[^;{}]*var\(--color-accent\)/)
    expect(css).not.toMatch(/border-radius:\s*(?!0\s*[;}])[^;}]+/)
  })
})

describe('regras de código', () => {
  it('heroCssSoUsaTokensEHeroETerminalNaoTemEstiloInline', () => {
    const css = stripComments(heroCss)
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla|hwb|oklch|lab|lch)\(/i)
    expect(heroTsx).not.toMatch(/style=/)
    expect(terminalTsx).not.toMatch(/style=/)

    const { container } = render(<Hero />)
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
  })
})

describe('acessibilidade', () => {
  it('topoNaoTemViolacoesNoAxe', async () => {
    const { container } = render(<Hero />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('topoNaoTemViolacoesNoAxeComMovimentoReduzido', async () => {
    stubMatchMedia(true)
    const { container } = render(<Hero />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('tokens da base visual', () => {
  it('tokensDefinemGridGlowERevealComOsValoresCombinados', () => {
    expect(tokens).toMatch(/--grid-size:\s*24px/)
    expect(tokens).toMatch(/--glow-blur:\s*96px/)
    expect(tokens).toMatch(/--reveal-distance:\s*8px/)
    expect(tokens).toMatch(/--duration-reveal:\s*300ms/)
  })

  it('globalERevealUsamTokensEmVezDeValorLiteral', () => {
    const global = stripComments(globalCss)
    const reveal = stripComments(revealCss)
    expect(global).not.toMatch(/\b24px\b/)
    expect(global).not.toMatch(/\b96px\b/)
    expect(global).toContain('var(--grid-size)')
    expect(global).toContain('var(--glow-blur)')
    expect(reveal).not.toMatch(/\b8px\b/)
    expect(reveal).not.toMatch(/\b300ms\b/)
    expect(reveal).toContain('var(--reveal-distance)')
    expect(reveal).toContain('var(--duration-reveal)')
  })

  it('revealUsaClasseLocalDoModuloParaOEstadoVisivel', () => {
    expect(revealCss).not.toContain(':global(')
    expect(revealTsx).toMatch(/styles\.visible/)
    expect(revealTsx).not.toMatch(/['"`]visible['"`]/)
  })
})
