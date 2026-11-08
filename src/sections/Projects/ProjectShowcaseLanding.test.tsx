import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { projects } from '../../data/projects'
import { Projects } from './Projects'

const LANDING_ALT =
  'Captura da tela inicial da landing page Bushido Karatê, com o título “Disciplina que transforma vidas.” e um ensō vermelho em volta de 空手道'

describe('Vitrine da landing-page', () => {
  it('a landing-page tem banner com a captura real e sem logo', () => {
    const landing = projects.find((p) => p.title === 'landing-page')
    expect(landing?.showcase?.media.alt).toBe(LANDING_ALT)
    expect(landing?.showcase?.logo).toBeUndefined()
    expect(landing?.featured).toBeFalsy()
  })

  it('mostra o banner da landing-page, sem o selo de destaque', () => {
    render(<Projects />)
    const [, landing] = screen.getAllByRole('article')
    expect(
      within(landing).getByRole('heading', { level: 3, name: 'landing-page' }),
    ).toBeInTheDocument()
    const banner = within(landing).getByRole('img', { name: LANDING_ALT })
    expect(banner).toHaveAttribute('loading', 'lazy')
    expect(within(landing).queryByText('Projeto em destaque')).toBeNull()
  })

  it('o LumiFlow continua com o selo de destaque', () => {
    render(<Projects />)
    const [lumiflow] = screen.getAllByRole('article')
    expect(
      within(lumiflow).getByText('Projeto em destaque'),
    ).toBeInTheDocument()
  })

  it('a seção de projetos não tem violações de acessibilidade', async () => {
    const { container } = render(<Projects />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
