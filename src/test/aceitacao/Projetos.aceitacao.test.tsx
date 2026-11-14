import { readFileSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { projects } from '../../data/projects'
import { Projects } from '../../sections/Projects/Projects'
import { ProjectShowcase } from '../../sections/Projects/ProjectShowcase'

function read(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

const showcaseCss = read('src/sections/Projects/ProjectShowcase.module.css')
const projectsCss = read('src/sections/Projects/Projects.module.css')
const showcaseTsx = read('src/sections/Projects/ProjectShowcase.tsx')
const projectsTsx = read('src/sections/Projects/Projects.tsx')

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

// CSS sem os blocos @media/@supports (o que vale fora de qualquer condição).
function withoutAtBlocks(css: string): string {
  let out = css
  for (;;) {
    const match = /@(media|supports)[^{]*\{/.exec(out)
    if (!match) return out
    const open = out.indexOf('{', match.index)
    out = out.slice(0, match.index) + out.slice(closeOf(out, open) + 1)
  }
}

// Margem negativa de sobreposição; o `margin: -1px` do texto só para leitor de tela não conta.
const NEGATIVE_MARGIN =
  /margin[\w-]*\s*:\s*(-(?!1px)|calc\(\s*-|calc\([^;)]*\*\s*-)/
const DESKTOP = /@media[^{]*min-width:\s*(768px|48rem|48em)[^{]*/

function stubObservers() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

beforeEach(stubObservers)
afterEach(() => {
  vi.unstubAllGlobals()
})

const showcases = projects.filter((p) => p.showcase)

function articleOf(title: string): HTMLElement {
  const heading = screen.getByRole('heading', { level: 3, name: title })
  const article = heading.closest('article')
  if (!article) throw new Error(`${title} não está em um <article>`)
  return article
}

function isReversed(article: HTMLElement): boolean {
  return [article, ...article.querySelectorAll('*')].some((el) =>
    /revers/i.test(el.getAttribute('class') ?? ''),
  )
}

function mediaOf(article: HTMLElement, title: string): HTMLElement {
  const project = projects.find((p) => p.title === title)
  const gallery = project?.showcase?.gallery
  if (gallery && gallery.length > 0) {
    return within(article).getByRole('group', { name: `Imagens do ${title}` })
  }
  const media = project?.showcase?.media
  if (!media) throw new Error(`${title} não tem mídia`)
  return within(article).getByRole('img', { name: media.alt })
}

function follows(a: Node, b: Node): boolean {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

describe('alternância das vitrines', () => {
  it('primeiraVitrineTemMidiaAEsquerdaESegundaADireitaAlternando', () => {
    render(<Projects />)
    expect(showcases.length).toBeGreaterThanOrEqual(2)
    showcases.forEach((project, index) => {
      expect(isReversed(articleOf(project.title)), project.title).toBe(
        index % 2 === 1,
      )
    })
  })

  it('projetoSemVitrineNaoEntraNaAlternancia', () => {
    // Só os projetos com `showcase` contam: o índice vem da lista filtrada.
    const withoutShowcase = projects.filter((p) => !p.showcase)
    render(<Projects />)
    for (const project of withoutShowcase) {
      expect(isReversed(articleOf(project.title)), project.title).toBe(false)
    }
    const flags = showcases.map((p) => isReversed(articleOf(p.title)))
    expect(flags[0]).toBe(false)
  })

  it('vitrineSozinhaFicaComMidiaAEsquerda', () => {
    const { container } = render(<ProjectShowcase project={showcases[0]} />)
    const article = container.querySelector('article') as HTMLElement
    expect(isReversed(article)).toBe(false)
  })

  it('propReversoInverteAVitrine', () => {
    const { container } = render(
      <ProjectShowcase project={showcases[0]} reverso />,
    )
    const article = container.querySelector('article') as HTMLElement
    expect(isReversed(article)).toBe(true)
  })
})

describe('ordem do HTML', () => {
  it('tituloDescricaoTecnologiasLinksEDepoisAMidiaEmTodaVitrine', () => {
    render(<Projects />)
    for (const project of showcases) {
      const article = articleOf(project.title)
      const title = within(article).getByRole('heading', {
        level: 3,
        name: project.title,
      })
      const description = within(article).getByText(project.description)
      const firstTech = within(article).getByText(project.technologies[0])
      const lastTech = within(article).getByText(
        project.technologies[project.technologies.length - 1],
      )
      const links = within(article).getAllByRole('link')
      const media = mediaOf(article, project.title)

      expect(follows(title, description), `${project.title}: título → descrição`).toBe(true)
      expect(follows(description, firstTech), `${project.title}: descrição → tecnologias`).toBe(true)
      for (const link of links) {
        expect(follows(lastTech, link), `${project.title}: tecnologias → links`).toBe(true)
        expect(follows(link, media), `${project.title}: links → mídia`).toBe(true)
      }
    }
  })

  it('inversaoEFeitaSoComCssPorOrderOuAreasDoGrid', () => {
    const css = stripComments(showcaseCss)
    expect(css).toMatch(/display:\s*grid/)
    expect(css).toMatch(/\border:\s*-?\d|grid-template-areas|grid-area|grid-column/)
    expect(showcaseTsx).not.toMatch(/style=/)
  })
})

describe('cartão de texto', () => {
  it('temBordaDe1pxEmAccent', () => {
    const css = stripComments(showcaseCss)
    expect(css).toMatch(/border(-[\w]+)?:\s*1px\s+solid\s+var\(--color-accent\)/)
  })

  it('usaSurfaceTranslucidoComDesfoqueEOpacoSemSuporteABackdropFilter', () => {
    const css = stripComments(showcaseCss)
    const supports = atBlocks(css, /@supports[^{]*backdrop-filter[^{]*/)
    expect(supports.length).toBeGreaterThan(0)
    const inside = supports.join('\n')
    expect(inside).toMatch(
      /color-mix\(\s*in srgb\s*,\s*var\(--color-surface\)\s+\d+%\s*,\s*transparent\s*\)/,
    )
    expect(inside).toMatch(/backdrop-filter:\s*blur\(/)
    // fora do @supports: surface opaco
    expect(withoutAtBlocks(css)).toMatch(
      /background(-color)?:\s*var\(--color-surface\)\s*;/,
    )
  })
})

describe('conteúdo atual', () => {
  it('mostraTituloDescricaoTecnologiasDestaquesLinksLogoEMidia', () => {
    render(<Projects />)
    for (const project of showcases) {
      const article = articleOf(project.title)
      const view = within(article)
      expect(view.getByText(project.description)).toBeInTheDocument()
      for (const tech of project.technologies) {
        expect(view.getByText(tech), tech).toBeInTheDocument()
      }
      for (const highlight of project.highlights ?? []) {
        expect(view.getByText(highlight), highlight).toBeInTheDocument()
      }
      const hrefs = view.queryAllByRole('link').map((a) => a.getAttribute('href'))
      if (project.repoUrl) expect(hrefs).toContain(project.repoUrl)
      if (project.demoUrl) expect(hrefs).toContain(project.demoUrl)
      const logo = project.showcase?.logo
      if (logo) {
        expect(view.getByRole('img', { name: logo.alt })).toBeInTheDocument()
      }
      expect(mediaOf(article, project.title)).toBeInTheDocument()
    }
  })

  it('carrosselDoLumiFlowMostraTodasAsImagens', () => {
    render(<Projects />)
    const lumiflow = projects.find((p) => p.showcase?.gallery)
    expect(lumiflow).toBeDefined()
    const carousel = within(articleOf(lumiflow?.title ?? '')).getByRole('group', {
      name: `Imagens do ${lumiflow?.title}`,
    })
    expect(within(carousel).getAllByRole('img', { hidden: true })).toHaveLength(
      lumiflow?.showcase?.gallery?.length ?? -1,
    )
  })
})

describe('links externos', () => {
  it('linksDasVitrinesAbremEmNovaAbaComRelEHttps', () => {
    render(<Projects />)
    for (const project of showcases) {
      const links = within(articleOf(project.title)).getAllByRole('link')
      expect(links.length, project.title).toBeGreaterThan(0)
      for (const link of links) {
        expect(link.getAttribute('href') ?? '').toMatch(/^https:\/\//)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
    }
  })
})

describe('brilho da seção', () => {
  it('brilhoEPseudoElementoDecorativoSemTextoComTokenGlow', () => {
    const css = stripComments(projectsCss)
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    const glow = rules.filter(([, , body]) => body.includes('var(--color-glow)'))
    expect(glow.length).toBeGreaterThan(0)
    for (const [, selector, body] of glow) {
      expect(
        selector
          .split(',')
          .map((s) => s.trim())
          .every((s) => /::?(before|after)$/.test(s)),
        selector,
      ).toBe(true)
      expect(body).toMatch(/content:\s*(''|"")/)
    }
  })
})

describe('CSS só com tokens', () => {
  it('semCorLiteralNosDoisCssESemEstiloInline', () => {
    expect(showcaseCss).not.toBe('')
    expect(projectsCss).not.toBe('')
    for (const raw of [showcaseCss, projectsCss]) {
      const css = stripComments(raw)
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
      expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla|hwb|oklch|oklab|lab|lch)\(/i)
      expect(css).not.toMatch(
        /(color|background|border[\w-]*|fill|stroke|outline[\w-]*)\s*:[^;{}]*\b(white|black|red|blue|green|yellow|orange|gray|grey|purple|amber)\b/i,
      )
    }
    expect(showcaseTsx).not.toMatch(/style=/)
    expect(projectsTsx).not.toMatch(/style=/)
    const { container } = render(<Projects />)
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
  })
})

describe('celular', () => {
  it('sobreposicaoSoExisteApartirDe768pxEMidiaFicaAcimaNoCelular', () => {
    const css = stripComments(showcaseCss)
    expect(css).not.toBe('')
    // fora de qualquer @media/@supports: sem margem negativa (sem sobreposição)
    expect(withoutAtBlocks(css)).not.toMatch(NEGATIVE_MARGIN)
    const desktop = atBlocks(css, DESKTOP).join('\n')
    expect(desktop).toMatch(NEGATIVE_MARGIN)
    expect(desktop).toMatch(/z-index:\s*\d+/)
  })
})

describe('acessibilidade', () => {
  it('secaoNaoTemViolacoesNoAxe', async () => {
    const { container } = render(<Projects />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
