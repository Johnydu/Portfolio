import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { Reveal } from '../../components/ui/Reveal/Reveal'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')
const globalCss = readFileSync('src/styles/global.css', 'utf8')
const mainTsx = readFileSync('src/main.tsx', 'utf8')
const buttonCss = readFileSync(
  'src/components/ui/Button/Button.module.css',
  'utf8',
)

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

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return cssFiles(path)
    return entry.name.endsWith('.css') ? [path] : []
  })
}

interface Rule {
  selectors: string[]
  body: string
}

// Regras simples (sem aninhamento) de um trecho de CSS.
function rules(css: string): Rule[] {
  const found: Rule[] = []
  const pattern = /([^{}]+)\{([^{}]*)\}/g
  let match = pattern.exec(css)
  while (match) {
    const selectors = match[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    found.push({ selectors, body: match[2] })
    match = pattern.exec(css)
  }
  return found
}

// Conteúdo do bloco `@media (...)` cuja condição contém o texto dado.
function mediaBlock(css: string, condition: string): string {
  const start = css.indexOf(condition)
  if (start === -1) return ''
  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') depth--
    if (depth === 0) return css.slice(open + 1, i)
  }
  return ''
}

function ruleFor(selector: string, all: Rule[] = rules(globalCss)): Rule {
  const rule = all.find((r) => r.selectors.includes(selector))
  if (!rule) throw new Error(`Regra ${selector} não encontrada`)
  return rule
}

type ObserverCallback = (
  entries: Array<Partial<IntersectionObserverEntry>>,
  observer: unknown,
) => void

interface FakeObserver {
  callback: ObserverCallback
  options: IntersectionObserverInit | undefined
  targets: Element[]
  disconnected: boolean
}

function stubIntersectionObserver(): FakeObserver[] {
  const instances: FakeObserver[] = []
  class FakeIntersectionObserver {
    private readonly state: FakeObserver
    constructor(
      callback: ObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      this.state = { callback, options, targets: [], disconnected: false }
      instances.push(this.state)
    }
    observe(target: Element) {
      this.state.targets.push(target)
    }
    unobserve() {}
    takeRecords() {
      return []
    }
    disconnect() {
      this.state.disconnected = true
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  return instances
}

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

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('tokens.css', () => {
  it('defineAsCoresDaDirecaoGrafiteEAmbar', () => {
    expect(token('--color-bg').toUpperCase()).toBe('#141413')
    expect(token('--color-surface').toUpperCase()).toBe('#1C1C1A')
    expect(token('--color-border').toUpperCase()).toBe('#2C2C2A')
    expect(token('--color-text').toUpperCase()).toBe('#F1EFE8')
    expect(token('--color-text-muted').toUpperCase()).toBe('#B4B2A9')
    expect(token('--color-accent').toUpperCase()).toBe('#EF9F27')
    expect(token('--color-accent-hover').toUpperCase()).toBe('#FAC775')
    expect(token('--color-accent-text').toUpperCase()).toBe('#EF9F27')
    expect(token('--color-on-accent').toUpperCase()).toBe('#412402')
  })

  it('naoUsaMaisAsCoresAntigasEmNenhumCss', () => {
    const files = cssFiles('src')
    expect(files.length).toBeGreaterThan(10)
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      expect(content, file).not.toMatch(/#8B5CF6|#A78BFA|#0B0B0F|#14141A/i)
    }
  })

  it.each([
    ['--color-text', '--color-bg'],
    ['--color-text', '--color-surface'],
    ['--color-text-muted', '--color-bg'],
    ['--color-text-muted', '--color-surface'],
    ['--color-on-accent', '--color-accent'],
  ])('contrasteDe%sSobre%sTemPeloMenos4ponto5', (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5)
  })

  it('definePropriedadesDaMalhaDoBrilhoEDaFonteDeTitulo', () => {
    expect(tokens).toMatch(/--color-grid:/)
    expect(tokens).toMatch(/--color-glow:/)
    expect(tokens).toMatch(
      /--font-display:\s*['"]Space Grotesk Variable['"],\s*var\(--font-sans\)/,
    )
  })
})

describe('fonte dos títulos', () => {
  it('importaASpaceGroteskNoMain', () => {
    expect(mainTsx).toMatch(
      /import\s+['"]@fontsource-variable\/space-grotesk['"]/,
    )
  })

  it('aplicaFontDisplayAH1H2EH3', () => {
    const all = rules(globalCss)
    for (const tag of ['h1', 'h2', 'h3']) {
      const applies = all.some(
        (r) =>
          r.selectors.includes(tag) &&
          /font-family:\s*var\(--font-display\)/.test(r.body),
      )
      expect(applies, tag).toBe(true)
    }
  })

  it('mantemOCorpoDoTextoEmInter', () => {
    expect(ruleFor('body').body).toMatch(/font-family:\s*var\(--font-sans\)/)
    expect(tokens).toMatch(/--font-sans:[^;]*Inter/)
  })
})

describe('global.css', () => {
  it('desenhaMalhaEBrilhoSoComPseudoElementosDecorativos', () => {
    const all = rules(globalCss)
    const usesGrid = all.filter((r) => r.body.includes('var(--color-grid)'))
    const usesGlow = all.filter((r) => r.body.includes('var(--color-glow)'))
    expect(usesGrid.length).toBeGreaterThan(0)
    expect(usesGlow.length).toBeGreaterThan(0)
    for (const rule of [...usesGrid, ...usesGlow]) {
      expect(
        rule.selectors.every((s) => /::(before|after)$/.test(s)),
        rule.selectors.join(', '),
      ).toBe(true)
      // decorativo: sem texto de conteúdo
      expect(rule.body).toMatch(/content:\s*(''|"")/)
    }
  })

  it('zeraAsDuracoesComMovimentoReduzido', () => {
    const block = mediaBlock(globalCss, 'prefers-reduced-motion: reduce')
    expect(block).not.toBe('')
    const universal = rules(block).find((r) => r.selectors.includes('*'))
    expect(universal).toBeDefined()
    const zero = /:\s*(0|0s|0ms|0\.0+1ms)\s*(!important)?\s*;/
    expect(universal?.body).toMatch(
      new RegExp(`animation-duration${zero.source}`),
    )
    expect(universal?.body).toMatch(
      new RegExp(`transition-duration${zero.source}`),
    )
  })

  it('focoVisivelEContornoDe2pxEmAccent', () => {
    const focus = ruleFor(':focus-visible')
    expect(focus.body).toMatch(/outline:\s*2px\s+solid\s+var\(--color-accent\)/)
  })
})

describe('Button', () => {
  it('botaoPrincipalUsaAccentDeFundoEOnAccentDeTexto', () => {
    const primary = ruleFor('.primary', rules(buttonCss))
    expect(primary.body).toMatch(/background:\s*var\(--color-accent\)/)
    expect(primary.body).toMatch(/color:\s*var\(--color-on-accent\)/)
  })
})

describe('Reveal', () => {
  it('renderizaOConteudoFilho', () => {
    stubIntersectionObserver()
    stubMatchMedia(false)
    render(
      <Reveal>
        <p>Conteúdo revelado</p>
      </Reveal>,
    )
    expect(screen.getByText('Conteúdo revelado')).toBeInTheDocument()
  })

  it('trocaDeEstadoAoEntrarNaTelaEDesconectaOObserver', () => {
    const observers = stubIntersectionObserver()
    stubMatchMedia(false)
    const { container, unmount } = render(
      <Reveal>
        <p>Conteúdo</p>
      </Reveal>,
    )
    const root = container.firstElementChild as HTMLElement
    const observer = observers.find((o) => o.targets.includes(root))
    expect(observer).toBeDefined()
    expect(observer?.options?.threshold).toBe(0.15)

    const before = root.className
    observer?.callback(
      [{ isIntersecting: true, target: root }],
      observer as unknown,
    )
    return Promise.resolve().then(() => {
      expect(root.className).not.toBe(before)
      unmount()
      expect(observer?.disconnected).toBe(true)
    })
  })

  it('mostraOConteudoDeImediatoSemIntersectionObserver', () => {
    // referência: classe do estado final (visível) com observer disponível
    const observers = stubIntersectionObserver()
    stubMatchMedia(false)
    const reference = render(
      <Reveal>
        <p>Conteúdo</p>
      </Reveal>,
    )
    const refRoot = reference.container.firstElementChild as HTMLElement
    const initial = refRoot.className
    const observer = observers.find((o) => o.targets.includes(refRoot))
    observer?.callback(
      [{ isIntersecting: true, target: refRoot }],
      observer as unknown,
    )
    const hiddenTokens = initial
      .split(/\s+/)
      .filter((t) => t && !refRoot.className.split(/\s+/).includes(t))
    reference.unmount()

    vi.stubGlobal('IntersectionObserver', undefined)
    const { container } = render(
      <Reveal>
        <p>Sem observer</p>
      </Reveal>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(screen.getByText('Sem observer')).toBeInTheDocument()
    expect(root.className).not.toMatch(/hidden|oculto|invisible/i)
    for (const t of hiddenTokens) {
      expect(root.className.split(/\s+/)).not.toContain(t)
    }
    expect(root.className.split(/\s+/)).toContain(
      refRoot.className.split(/\s+/).find((t) => /visible/i.test(t)) ??
        'visible',
    )
  })

  it('mostraOConteudoDeImediatoComMovimentoReduzido', () => {
    const observers = stubIntersectionObserver()
    stubMatchMedia(true)
    const { container } = render(
      <Reveal>
        <p>Movimento reduzido</p>
      </Reveal>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(screen.getByText('Movimento reduzido')).toBeInTheDocument()
    expect(root.className).not.toMatch(/hidden|oculto|invisible/i)
    expect(root.className.split(/\s+/)).toContain('visible')
    expect(observers.some((o) => o.targets.includes(root))).toBe(false)
  })
})

describe('App', () => {
  it('cadaSecaoTemOConteudoEnvolvidoPorReveal', () => {
    const observers = stubIntersectionObserver()
    stubMatchMedia(false)
    render(<App />)
    const observed = observers.flatMap((o) => o.targets)
    for (const id of [
      'inicio',
      'sobre',
      'tecnologias',
      'projetos',
      'trajetoria',
      'contato',
    ]) {
      const section = document.getElementById(id) as HTMLElement
      expect(section, id).not.toBeNull()
      const heading = section.querySelector('h1, h2') as HTMLElement
      expect(heading, `título de ${id}`).not.toBeNull()
      const wrapper = observed.find(
        (el) => el !== section && section.contains(el) && el.contains(heading),
      )
      expect(wrapper, `Reveal em ${id}`).toBeDefined()
    }
  })

  it('naoTemViolacoesDeAcessibilidade', async () => {
    stubIntersectionObserver()
    stubMatchMedia(false)
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
