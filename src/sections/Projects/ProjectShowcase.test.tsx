import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import type { Project } from '../../types'
import { ProjectShowcase } from './ProjectShowcase'
import { Projects } from './Projects'

const lumiflow = projects.find((project) => project.title === 'LumiFlow')

if (!lumiflow?.showcase) {
  throw new Error('O LumiFlow precisa ter imagens de vitrine em projects.ts')
}

const featured: Project = lumiflow

describe('ProjectShowcase', () => {
  it('é um article com o título do projeto e o rótulo de destaque', () => {
    render(<ProjectShowcase project={featured} />)
    const article = screen.getByRole('article')
    expect(
      within(article).getByRole('heading', { level: 3, name: 'LumiFlow' }),
    ).toBeInTheDocument()
    expect(within(article).getByText('Projeto em destaque')).toBeInTheDocument()
  })

  it('mostra o logo com texto alternativo e a imagem de fundo como decorativa', () => {
    const { container } = render(<ProjectShowcase project={featured} />)
    expect(screen.getByRole('img', { name: 'Logo do LumiFlow' })).toBeVisible()
    const media = container.querySelector('figure img[alt=""]')
    expect(media).not.toBeNull()
    expect(media).toHaveAttribute('loading', 'lazy')
  })

  it('lista os destaques e as tecnologias', () => {
    render(<ProjectShowcase project={featured} />)
    const items = screen.getAllByRole('listitem').map((i) => i.textContent)
    expect(items).toEqual(
      expect.arrayContaining(['Roteiros de produção', 'Java 21', 'Flyway']),
    )
  })

  it('é apresentado como produto comercial, sem link para o código', () => {
    render(<ProjectShowcase project={featured} />)
    expect(screen.getByText('Produto comercial')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Repositório/ })).toBeNull()
  })

  it('convida a solicitar uma demonstração pelo LinkedIn, em nova aba', () => {
    render(<ProjectShowcase project={featured} />)
    const link = screen.getByRole('link', {
      name: /Solicitar demonstração\s*do LumiFlow/,
    })
    expect(link).toHaveAttribute('href', profile.links.linkedin)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<ProjectShowcase project={featured} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Projects com vitrine', () => {
  it('usa a vitrine para o projeto em destaque', () => {
    render(<Projects />)
    const [first] = screen.getAllByRole('article')
    expect(within(first).getByText('Projeto em destaque')).toBeInTheDocument()
    expect(
      within(first).getByRole('img', { name: 'Logo do LumiFlow' }),
    ).toBeInTheDocument()
  })
})
