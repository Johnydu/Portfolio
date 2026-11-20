import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
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
  'Transformo regras de negócio complicadas em sistemas simples de usar.'
const ACEITACAO_DIR = 'src/test/aceitacao'

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

// Posição da chave que fecha o bloco aberto em `open`.
function closeOf(css: string, open: number): number {
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') depth--
    if (depth === 0) return i
  }
  return css.length - 1
}

// Conteúdo dos blocos `@<at> ...{ ... }` cuja condição casa com o padrão.
function atBlocks(css: string, header: RegExp): string[] {
  const found: string[] = []
  const pattern = new RegExp(header.source, 'g')
  let match = pattern.exec(css)
  while (match) {
    const open = css.indexOf('{', match.index)
    const close = closeOf(css, open)
    found.push(css.slice(open + 1, close))
    pattern.lastIndex = close
    match = pattern.exec(css)
  }
  return found
}

// Nome original das classes do CSS Module (`_tagline_1a2b3` → `tagline`).
function baseClassNames(el: Element): string[] {
  return Array.from(el.classList).map(
    (c) => /^_?([A-Za-z][\w-]*?)_[A-Za-z0-9]{4,}$/.exec(c)?.[1] ?? c,
  )
}

// Arquivos .ts/.tsx de produção (fora dos testes).
function productionSources(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      if (entry !== 'test') out.push(...productionSources(path))
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      out.push(path)
    }
  }
  return out
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
    expect(profile.statementHighlight).toBe('simples')
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

  it('conteinerDoTopoUsaClasseLayoutSemTemplateLiteral', () => {
    expect(heroTsx).toMatch(/className=\{styles\.layout\}/)
    expect(heroTsx).not.toMatch(/className=\{`[^`]*styles\.layout/)
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
  it('poeAPalavraSimplesEmSpanProprioEMantemAFraseLegivelComoTextoUnico', () => {
    const { container } = render(<Hero />)
    const highlight = container.querySelector('[class*="highlight"]')
    expect(highlight).not.toBeNull()
    expect(highlight?.tagName).toBe('SPAN')
    expect(highlight?.textContent).toBe('simples')
    const paragraph = statementParagraph()
    expect(paragraph).toContainElement(highlight as HTMLElement)
    expect(paragraph.textContent).toBe(STATEMENT)
  })
})

describe('tagline e localização', () => {
  it('heroRenderizaTaglineELocalizacaoEEscondeAPartirDe64rem', () => {
    render(<Hero />)
    const tagline = screen.getByText(profile.tagline)
    const location = screen.getByText(profile.location)

    const css = stripComments(heroCss)
    const wide = atBlocks(css, /@media[^{]*min-width:\s*64rem[^{]*/).join('\n')
    const hidden = [...wide.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(
      ([, , body]) => /display:\s*none/.test(body),
    )
    expect(hidden.length).toBeGreaterThan(0)
    const hiddenSelectors = hidden.map(([, selector]) => selector).join(',')
    for (const el of [tagline, location]) {
      const names = baseClassNames(el)
      expect(names.length, el.textContent ?? '').toBeGreaterThan(0)
      expect(
        names.some((n) => new RegExp(`\\.${n}(?![\\w-])`).test(hiddenSelectors)),
        `classe de "${el.textContent}" escondida a partir de 64rem`,
      ).toBe(true)
    }
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

  it('tokensDeFormaDefinemBordaLinhaSublinhadoEQuadro', () => {
    const css = stripComments(tokens)
    expect(css).toMatch(/--border-width:\s*1px\s*;/)
    expect(css).toMatch(/--line-width:\s*2px\s*;/)
    expect(css).toMatch(/--underline-thickness:\s*3px\s*;/)
    expect(css).toMatch(/--underline-offset:\s*6px\s*;/)
    expect(css).toMatch(/--frame-max-width:\s*20rem\s*;/)
  })

  it('heroCssNaoTemMedidaEmPxLiteralEUsaOsTokensDeForma', () => {
    const css = stripComments(heroCss)
    expect(css).not.toBe('')
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/)
    expect(css).toMatch(
      /text-decoration-thickness:\s*var\(--underline-thickness\)/,
    )
    expect(css).toMatch(/text-underline-offset:\s*var\(--underline-offset\)/)
    expect(css).toContain('var(--border-width)')
    expect(css).toContain('var(--line-width)')
    expect(css).toMatch(/max-width:\s*var\(--frame-max-width\)/)
  })

  it('globalNaoTemFadeInENenhumComponenteUsaAClasse', () => {
    const global = stripComments(globalCss)
    expect(global).not.toMatch(/\.fade-in\b/)
    expect(global).not.toMatch(/@keyframes\s+fade-in\b/)
    const sources = productionSources('src')
    expect(sources.length).toBeGreaterThan(0)
    for (const file of sources) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/fade-in/)
    }
  })

  it('existeUmUnicoArquivoDeAceitacaoDoTopoComAFraseNova', () => {
    const topo = readdirSync(ACEITACAO_DIR).filter((f) =>
      /^Topo.*\.aceitacao\.test\.tsx$/.test(f),
    )
    expect(topo).toEqual(['TopoRedesenhado.aceitacao.test.tsx'])
    const content = readFileSync(join(ACEITACAO_DIR, topo[0]), 'utf8')
    expect(content).toContain(STATEMENT)
  })

  it('revealUsaClasseLocalDoModuloParaOEstadoVisivel', () => {
    expect(revealCss).not.toContain(':global(')
    expect(revealTsx).toMatch(/styles\.visible/)
    expect(revealTsx).not.toMatch(/['"`]visible['"`]/)
  })
})
