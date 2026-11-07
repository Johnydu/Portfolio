import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { Contact } from './Contact/Contact'
import { ProjectCard } from './Projects/ProjectCard'
import { Projects } from './Projects/Projects'
import { Timeline } from './Timeline/Timeline'
import type { Project } from '../types'

describe('Projects', () => {
  it('é a região Projetos com a âncora projetos', () => {
    render(<Projects />)
    expect(screen.getByRole('region', { name: 'Projetos' })).toHaveAttribute(
      'id',
      'projetos',
    )
  })

  it('mostra o LumiFlow em destaque com link do repositório e a landing-page como secundária', () => {
    render(<Projects />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(2)

    const [lumiflow, landing] = cards
    expect(
      within(lumiflow).getByRole('heading', { level: 3, name: 'LumiFlow' }),
    ).toBeInTheDocument()
    expect(
      within(lumiflow).getByRole('link', { name: /Repositório/ }),
    ).toHaveAttribute('href', 'https://github.com/Johnydu/LumiFlow')

    expect(
      within(landing).getByRole('heading', { level: 3, name: 'landing-page' }),
    ).toBeInTheDocument()
    expect(
      within(landing).getByRole('link', { name: /Repositório/ }),
    ).toHaveAttribute('href', 'https://github.com/Johnydu/landing-page')
  })

  it('não renderiza botão de demonstração quando demoUrl não existe', () => {
    render(<Projects />)
    expect(screen.queryByRole('link', { name: /Demonstração/ })).toBeNull()
  })
})

describe('ProjectCard', () => {
  const withDemo: Project = {
    ...projects[1],
    demoUrl: 'https://exemplo.test/demo',
  }

  it('renderiza o botão de demonstração quando demoUrl existe', () => {
    render(<ProjectCard project={withDemo} />)
    const demo = screen.getByRole('link', { name: /Demonstração/ })
    expect(demo).toHaveAttribute('href', 'https://exemplo.test/demo')
    expect(demo).toHaveAttribute('target', '_blank')
  })

  it('lista as tecnologias do projeto', () => {
    render(<ProjectCard project={projects[0]} />)
    const items = screen.getAllByRole('listitem').map((i) => i.textContent)
    expect(items).toEqual(expect.arrayContaining(['Java 21', 'PostgreSQL']))
  })
})

describe('Timeline', () => {
  it('mostra RBL Iluminação e UNIRP com os períodos', () => {
    render(<Timeline />)
    expect(
      screen.getByRole('region', { name: 'Experiência e formação' }),
    ).toHaveAttribute('id', 'trajetoria')
    expect(screen.getByText(/RBL Iluminação/)).toBeInTheDocument()
    expect(screen.getByText('2023 — atual')).toBeInTheDocument()
    expect(screen.getByText(/UNIRP/)).toBeInTheDocument()
    expect(screen.getByText(/dezembro de 2026/)).toBeInTheDocument()
  })
})

describe('Contact', () => {
  it('mostra LinkedIn, GitHub e Instagram, sem e-mail nem formulário', () => {
    const { container } = render(<Contact />)
    expect(screen.getByRole('region', { name: 'Contato' })).toHaveAttribute(
      'id',
      'contato',
    )
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      profile.links.linkedin,
    )
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      profile.links.github,
    )
    expect(screen.getByRole('link', { name: /Instagram/ })).toHaveAttribute(
      'href',
      profile.links.instagram,
    )
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(container.querySelector('form, a[href^="mailto:"]')).toBeNull()
  })

  it('não renderiza o botão de currículo quando resumeUrl não existe', () => {
    render(<Contact />)
    expect(screen.queryByRole('link', { name: /currículo/i })).toBeNull()
  })

  it('renderiza o botão de currículo quando resumeUrl existe', () => {
    render(<Contact resumeUrl="https://exemplo.test/curriculo.pdf" />)
    expect(screen.getByRole('link', { name: /currículo/i })).toHaveAttribute(
      'href',
      'https://exemplo.test/curriculo.pdf',
    )
  })
})

describe('seções B', () => {
  it('não têm violações de acessibilidade', async () => {
    const { container } = render(
      <main>
        <Projects />
        <Timeline />
        <Contact />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
