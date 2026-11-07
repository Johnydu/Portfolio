import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { focusAreas } from '../../data/focusAreas'
import { projects } from '../../data/projects'
import { skills } from '../../data/skills'
import { About } from './About'

describe('focusAreas', () => {
  it('tem quatro áreas, cada uma com título, descrição e tecnologias', () => {
    expect(focusAreas).toHaveLength(4)
    for (const area of focusAreas) {
      expect(area.title.length).toBeGreaterThan(0)
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
})

describe('About com O que faço', () => {
  it('mostra o título O que faço e um item por área, na ordem dos dados', () => {
    render(<About />)
    const heading = screen.getByRole('heading', {
      level: 3,
      name: 'O que faço',
    })
    expect(heading).toBeInTheDocument()
    const list = screen.getByRole('list', { name: 'O que faço' })
    const titles = within(list)
      .getAllByRole('heading', { level: 4 })
      .map((title) => title.textContent)
    expect(titles).toEqual(focusAreas.map((area) => area.title))
  })
})
