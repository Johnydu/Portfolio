import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { profile } from '../data/profile'
import { skills } from '../data/skills'
import { About } from './About/About'
import { Hero } from './Hero/Hero'
import { Skills } from './Skills/Skills'

describe('Hero', () => {
  it('mostra o h1 com o nome, o título e a frase de abertura a oportunidades', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Johny Duarte' }),
    ).toBeInTheDocument()
    expect(screen.getByText(profile.headline)).toBeInTheDocument()
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
    expect(screen.getByText(profile.location)).toBeInTheDocument()
  })

  it('tem botões https para GitHub e LinkedIn que abrem em nova aba', () => {
    render(<Hero />)
    const github = screen.getByRole('link', { name: /GitHub/ })
    const linkedin = screen.getByRole('link', { name: /LinkedIn/ })
    expect(github).toHaveAttribute('href', profile.links.github)
    expect(linkedin).toHaveAttribute('href', profile.links.linkedin)
    for (const link of [github, linkedin]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('mostra a foto de Johny com texto alternativo e dimensões', () => {
    render(<Hero />)
    const foto = screen.getByRole('img', { name: profile.photo.alt })
    expect(foto.getAttribute('src')).toBeTruthy()
    expect(foto).toHaveAttribute('width', '800')
    expect(foto).toHaveAttribute('height', '800')
  })

  it('é a âncora inicial da página', () => {
    render(<Hero />)
    expect(document.getElementById('inicio')).not.toBeNull()
  })
})

describe('About', () => {
  it('é a região Sobre mim com a âncora sobre', () => {
    render(<About />)
    expect(screen.getByRole('region', { name: 'Sobre mim' })).toHaveAttribute(
      'id',
      'sobre',
    )
    expect(screen.getByText(profile.about[0])).toBeInTheDocument()
  })

  it('mostra o bloco de IA aplicada ao desenvolvimento', () => {
    render(<About />)
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'IA aplicada ao desenvolvimento',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(profile.aiNote)).toBeInTheDocument()
  })
})

describe('Skills', () => {
  it('agrupa por nível, na ordem Foco principal, Em aprofundamento, Fundamentos', () => {
    render(<Skills />)
    const levels = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(levels).toEqual([
      'Foco principal',
      'Em aprofundamento',
      'Fundamentos',
    ])
  })

  it('lista todas as tecnologias de cada nível', () => {
    render(<Skills />)
    for (const group of skills) {
      const heading = screen.getByRole('heading', { name: group.level })
      const list = within(heading.parentElement as HTMLElement).getByRole(
        'list',
      )
      const items = within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
      expect(items).toEqual([...group.items])
    }
  })

  it('não contém porcentagens nem elementos de progresso', () => {
    const { container } = render(<Skills />)
    expect(screen.queryByRole('progressbar')).toBeNull()
    expect(container.querySelector('progress, meter')).toBeNull()
    expect(container.textContent).not.toContain('%')
  })
})

describe('seções A', () => {
  it('não têm violações de acessibilidade', async () => {
    const { container } = render(
      <main>
        <Hero />
        <About />
        <Skills />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
