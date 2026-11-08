import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { focusAreas } from '../../data/focusAreas'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { skills } from '../../data/skills'
import { About } from './About'

describe('focusAreas', () => {
  it('apresenta os serviços: landing pages, sites, sistemas web e desktop', () => {
    expect(focusAreas.map((area) => area.title)).toEqual([
      'Landing pages',
      'Sites institucionais',
      'Sistemas web',
      'Sistemas desktop',
    ])
    for (const area of focusAreas) {
      expect(area.description.length).toBeGreaterThan(0)
      expect(area.technologies.length).toBeGreaterThan(0)
    }
  })

  it('só cita tecnologias que já estão nas habilidades ou nos projetos', () => {
    const known = new Set([
      ...skills.flatMap((group) => group.items),
      ...projects.flatMap((project) => project.technologies),
    ])
    for (const technology of focusAreas.flatMap((area) => area.technologies)) {
      expect(known.has(technology), technology).toBe(true)
    }
  })

  it('os exemplos apontam só para projetos reais do portfólio', () => {
    const projectUrls = new Set([
      ...projects.flatMap((p) => [
        p.repoUrl,
        ...(p.demoUrl ? [p.demoUrl] : []),
      ]),
      // o próprio portfólio, cujo código é público
      'https://github.com/Johnydu/Portfolio',
    ])
    const examples = focusAreas.flatMap((area) =>
      area.example ? [area.example] : [],
    )
    expect(examples.length).toBeGreaterThanOrEqual(3)
    for (const example of examples) {
      expect(projectUrls.has(example.href), example.href).toBe(true)
    }
  })
})

describe('About com O que faço', () => {
  it('mostra o título O que faço e um item por área, na ordem dos dados', () => {
    render(<About />)
    const list = screen.getByRole('list', { name: 'O que faço' })
    const titles = within(list)
      .getAllByRole('heading', { level: 4 })
      .map((title) => title.textContent)
    expect(titles).toEqual(focusAreas.map((area) => area.title))
  })

  it('cada exemplo abre o projeto em nova aba', () => {
    render(<About />)
    const list = screen.getByRole('list', { name: 'O que faço' })
    const landing = within(list).getByRole('link', {
      name: /Ver exemplo:\s*landing page Bushido Karatê/,
    })
    expect(landing).toHaveAttribute(
      'href',
      'https://johnydu.github.io/landing-page/',
    )
    expect(landing).toHaveAttribute('target', '_blank')
    expect(landing).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('convida a pedir orçamento pelo LinkedIn', () => {
    render(<About />)
    const cta = screen.getByRole('link', {
      name: /Pedir orçamento pelo LinkedIn/,
    })
    expect(cta).toHaveAttribute('href', profile.links.linkedin)
    expect(cta).toHaveAttribute('target', '_blank')
  })
})
