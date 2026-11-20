import { readFileSync } from 'node:fs'
import { act, render, screen, within } from '@testing-library/react'
import { siCss } from 'simple-icons'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { skills } from '../../data/skills'
import { Skills } from '../../sections/Skills/Skills'

// Arquivo ainda inexistente vira texto vazio: a asserção falha, o módulo carrega.
function read(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

const skillsCss = read('src/sections/Skills/Skills.module.css')
const techIconCss = read('src/components/ui/TechIcon/TechIcon.module.css')
const techIconTsx = read('src/components/ui/TechIcon/TechIcon.tsx')
const skillsTsx = read('src/sections/Skills/Skills.tsx')

const LEVELS = ['Foco principal', 'Em aprofundamento', 'Fundamentos']
const DECORATIVE_INITIALS = /^[\p{L}\p{N}]{1,2}$/u

type ObserverCallback = (
  entries: Array<Partial<IntersectionObserverEntry>>,
  observer: unknown,
) => void

interface FakeObserver {
  callback: ObserverCallback
  targets: Element[]
}

function stubIntersectionObserver(): FakeObserver[] {
  const instances: FakeObserver[] = []
  class FakeIntersectionObserver {
    private readonly state: FakeObserver
    constructor(callback: ObserverCallback) {
      this.state = { callback, targets: [] }
      instances.push(this.state)
    }
    observe(target: Element) {
      this.state.targets.push(target)
    }
    unobserve() {}
    takeRecords() {
      return []
    }
    disconnect() {}
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

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function follows(a: Node, b: Node): boolean {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function group(level: string): HTMLElement {
  const heading = screen.getByRole('heading', { level: 3, name: level })
  const section = heading.closest('section')
  if (!section) throw new Error(`Grupo ${level} não é um <section>`)
  return section
}

function itemOf(name: string): HTMLElement {
  const matches = screen.getAllByText(name)
  expect(matches, `"${name}" deve aparecer uma vez`).toHaveLength(1)
  const li = matches[0].closest('li')
  if (!li) throw new Error(`"${name}" não está em um item de lista`)
  return li
}

// Ícone decorativo do item: o <svg> ou o elemento com as iniciais.
function icon(li: HTMLElement): Element {
  const found = li.querySelectorAll('[aria-hidden="true"]')
  expect(found.length, 'ícone aria-hidden no item').toBeGreaterThan(0)
  return found[0]
}

function allItems() {
  return skills.flatMap((g) => g.items.map((name) => ({ level: g.level, name })))
}

// Algum ancestral (dentro do container) já com a classe "visível" do Reveal.
function litAncestor(el: Element, container: HTMLElement): boolean {
  let node: Element | null = el
  while (node && node !== container.parentElement) {
    if (/visible/i.test(node.getAttribute('class') ?? '')) return true
    node = node.parentElement
  }
  return false
}

beforeEach(() => {
  stubIntersectionObserver()
  stubMatchMedia(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('núcleo e grupos', () => {
  it('mostraONucleoBackendJavaAntesDosTresGruposNaOrdemDosNiveis', () => {
    render(<Skills />)
    const core = screen.getByText('Backend Java')
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toEqual(LEVELS)
    for (const h of headings) expect(follows(core, h)).toBe(true)
  })

  it('cadaGrupoESectionComH3EListaDeItens', () => {
    render(<Skills />)
    for (const level of LEVELS) {
      const section = group(level)
      expect(within(section).getAllByRole('list')).toHaveLength(1)
    }
  })
})

describe('tecnologias', () => {
  it('mostraCadaTecnologiaUmaVezNoGrupoDoSeuNivelComNomeEmTexto', () => {
    render(<Skills />)
    for (const { level, name } of allItems()) {
      const li = itemOf(name)
      expect(group(level), name).toContainElement(li)
    }
  })

  it('cadaGrupoTemExatamenteOsItensDoSeuNivel', () => {
    render(<Skills />)
    for (const g of skills) {
      expect(within(group(g.level)).getAllByRole('listitem')).toHaveLength(
        g.items.length,
      )
    }
  })
})

describe('logotipos e iniciais', () => {
  it('tecnologiaComIconeMostraSvgDecorativoComPathECurrentColor', () => {
    render(<Skills />)
    for (const name of ['Spring Boot', 'PostgreSQL']) {
      const svg = itemOf(name).querySelector('svg')
      expect(svg, `svg de ${name}`).not.toBeNull()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('fill', 'currentColor')
      expect(svg?.querySelector('path[d]')).not.toBeNull()
    }
  })

  it('tecnologiaSemIconeMostraIniciaisDeAteDuasLetrasComAriaHidden', () => {
    render(<Skills />)
    // O logotipo do Java não existe no Simple Icons (spec).
    const li = itemOf('Java')
    expect(li.querySelector('svg')).toBeNull()
    const initials = icon(li)
    expect(initials).toHaveAttribute('aria-hidden', 'true')
    expect(initials.textContent?.trim()).toMatch(DECORATIVE_INITIALS)
  })

  it('todoItemTemUmIconeDecorativoEONomeEmTextoLegivel', () => {
    render(<Skills />)
    for (const { name } of allItems()) {
      const li = itemOf(name)
      const decorative = icon(li)
      const svg = li.querySelector('svg')
      if (svg) {
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      } else {
        expect(decorative.textContent?.trim()).toMatch(DECORATIVE_INITIALS)
      }
      // o nome acessível do item vem do texto, não do ícone
      expect(within(li).getByText(name).closest('[aria-hidden="true"]')).toBeNull()
    }
  })
})

describe('regras dos logotipos', () => {
  it('semImgComDataUriNemEstiloInline', () => {
    const { container } = render(<Skills />)
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
    for (const img of container.querySelectorAll('img')) {
      expect(img.getAttribute('src') ?? '').not.toMatch(/^data:/i)
    }
    expect(techIconTsx).not.toMatch(/style=/)
    expect(techIconTsx).not.toMatch(/data:image/i)
    expect(skillsTsx).not.toMatch(/style=/)
  })

  it('corDoLogotipoVemDoCssComTokens', () => {
    const css = stripComments(techIconCss)
    expect(css).toMatch(/color:\s*var\([^;]*var\(--color-text-muted\)\s*\)/)
    expect(stripComments(skillsCss)).toMatch(/var\(--color-accent\)/)
  })

  it('css3MostraLogotipoDoSiCssComoSvgDecorativoEJavaContinuaComIniciais', () => {
    render(<Skills />)
    const svg = itemOf('CSS3').querySelector('svg')
    expect(svg, 'svg de CSS3').not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg?.querySelector('path')).toHaveAttribute('d', siCss.path)

    const java = itemOf('Java')
    expect(java.querySelector('svg')).toBeNull()
    expect(icon(java).textContent?.trim()).toMatch(DECORATIVE_INITIALS)
  })

  it('realceAmbarDoLogotipoVemDoHoverDoItemInteiroPorPropriedadeCustomizada', () => {
    const iconCss = stripComments(techIconCss)
    expect(iconCss).toMatch(
      /color:\s*var\(\s*--tech-icon-color\s*,\s*var\(--color-text-muted\)\s*\)/,
    )
    expect(iconCss).not.toMatch(/:hover/)

    const css = stripComments(skillsCss)
    const hover = [...css.matchAll(/([^{}]*\.item:hover[^{}]*)\{([^{}]*)\}/g)]
    expect(hover.length).toBeGreaterThan(0)
    const bodies = hover.map(([, , body]) => body).join('\n')
    expect(bodies).toMatch(/--tech-icon-color:\s*var\(--color-accent\)/)
    // o nome continua na cor de texto: o hover do item não troca `color`
    expect(bodies).not.toMatch(/(^|[;\s])color\s*:/)

    // a regra de hover é do item da lista renderizado
    render(<Skills />)
    expect(itemOf('CSS3').getAttribute('class') ?? '').toMatch(/item/)
  })
})

describe('medidas com tokens', () => {
  it('skillsCssNaoTemMedidaEmPxLiteralEUsaTokensDeLinhaEBorda', () => {
    const css = stripComments(skillsCss)
    expect(css).not.toBe('')
    expect(css).not.toMatch(/\d+(\.\d+)?px\b/)
    expect(css).toContain('var(--line-width)')
    expect(css).toContain('var(--border-width)')
    expect(css).toMatch(
      /calc\(\s*-1\s*\*\s*var\(--space-6\)\s*-\s*var\(--line-width\)\s*\)/,
    )
  })
})

describe('linhas do diagrama', () => {
  it('linhasSaoDesenhadasPorPseudoElementosDoCssComTokenAccent', () => {
    const css = stripComments(skillsCss)
    const pseudo = [
      ...css.matchAll(/([^{}]*::?(?:before|after)[^{}]*)\{([^{}]*)\}/g),
    ]
    expect(pseudo.length).toBeGreaterThan(0)
    expect(
      pseudo.some(
        ([, , body]) =>
          /content:\s*(''|"")/.test(body) && /var\(--color-accent\)/.test(body),
      ),
    ).toBe(true)
  })

  it('animacaoDasLinhasUsaScaleXNoDesktopEScaleYNoCelular', () => {
    const css = stripComments(skillsCss)
    expect(css).toMatch(/scaleX\(/)
    expect(css).toMatch(/scaleY\(/)
    expect(css).toMatch(/(transition|animation)-delay/)
    expect(css).toMatch(/@media/)
  })

  it('posicaoENaoCalculadaEmJavaScriptNemPorEstiloInline', () => {
    expect(skillsTsx).not.toMatch(
      /style=|getBoundingClientRect|offsetWidth|offsetHeight|offsetTop|offsetLeft|getComputedStyle|clientWidth|clientHeight/,
    )
  })

  it('elementosDeLinhaNoDomSaoDecorativos', () => {
    const { container } = render(<Skills />)
    const lines = container.querySelectorAll(
      '[class*="line" i], [class*="linha" i], [class*="connector" i]',
    )
    for (const el of lines) {
      expect(
        el.closest('[aria-hidden="true"]'),
        `linha ${el.getAttribute('class')}`,
      ).not.toBeNull()
    }
  })
})

describe('movimento', () => {
  it('comMovimentoReduzidoAsLinhasJaNascemAcesas', () => {
    const observers = stubIntersectionObserver()
    stubMatchMedia(true)
    const { container } = render(<Skills />)
    const core = screen.getByText('Backend Java')
    expect(litAncestor(core, container)).toBe(true)
    for (const level of LEVELS) {
      expect(litAncestor(group(level), container)).toBe(true)
    }
    const watching = observers.flatMap((o) => o.targets)
    expect(watching.some((t) => t.contains(core))).toBe(false)
  })

  it('semMovimentoReduzidoAsLinhasAcendemSoAoEntrarNaTela', () => {
    const observers = stubIntersectionObserver()
    stubMatchMedia(false)
    const { container } = render(<Skills />)
    const core = screen.getByText('Backend Java')
    expect(litAncestor(core, container)).toBe(false)

    const observer = observers.find((o) => o.targets.some((t) => t.contains(core)))
    expect(observer).toBeDefined()
    const target = observer?.targets.find((t) => t.contains(core)) as Element
    act(() => {
      observer?.callback(
        [{ isIntersecting: true, target }],
        observer as unknown,
      )
    })
    expect(litAncestor(core, container)).toBe(true)
  })
})

describe('CSS só com tokens', () => {
  it('skillsETechIconNaoTemCorLiteral', () => {
    expect(skillsCss).not.toBe('')
    expect(techIconCss).not.toBe('')
    for (const raw of [skillsCss, techIconCss]) {
      const css = stripComments(raw)
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
      expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla|hwb|oklch|oklab|lab|lch)\(/i)
      expect(css).not.toMatch(
        /(color|background|border[\w-]*|fill|stroke|outline[\w-]*)\s*:[^;{}]*\b(white|black|red|blue|green|yellow|orange|gray|grey|purple|amber)\b/i,
      )
    }
  })
})

describe('níveis sem barras nem notas', () => {
  it('semBarraDeProgressoMedidorNemNotaNosNiveis', () => {
    const { container } = render(<Skills />)
    expect(
      container.querySelectorAll(
        'progress, meter, [role="progressbar"], [role="meter"]',
      ),
    ).toHaveLength(0)
    for (const level of LEVELS) {
      const heading = screen.getByRole('heading', { level: 3, name: level })
      expect(heading.textContent).toBe(level)
    }
  })
})

describe('layout no celular', () => {
  it('cssTemRegraDeCelularComLinhasNaVertical', () => {
    const css = stripComments(skillsCss)
    const media = css.match(/@media[^{]*\{/g) ?? []
    expect(media.length).toBeGreaterThan(0)
    expect(css).toMatch(/scaleY\(/)
  })
})

describe('acessibilidade', () => {
  it('secaoNaoTemViolacoesNoAxe', async () => {
    const { container } = render(<Skills />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('secaoNaoTemViolacoesNoAxeComMovimentoReduzido', async () => {
    stubMatchMedia(true)
    const { container } = render(<Skills />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
