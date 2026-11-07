import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import App from '../../../App'
import { profile } from '../../../data/profile'
import { ProfileCard } from './ProfileCard'

describe('ProfileCard', () => {
  it('é um aside chamado Perfil com a foto, o nome e a localização', () => {
    render(<ProfileCard />)
    const aside = screen.getByRole('complementary', { name: 'Perfil' })
    expect(
      within(aside).getByRole('img', { name: profile.photo.alt }),
    ).toBeInTheDocument()
    expect(within(aside).getByText(profile.name)).toBeInTheDocument()
    expect(within(aside).getByText(profile.location)).toBeInTheDocument()
  })

  it('separa o cargo das tecnologias da headline', () => {
    render(<ProfileCard />)
    expect(screen.getByText('Desenvolvedor Backend Java')).toBeInTheDocument()
    expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
  })

  it('não usa título, para manter um único h1 na página', () => {
    render(<ProfileCard />)
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('tem LinkedIn, GitHub e Instagram em https, abrindo em nova aba, e nenhum e-mail', () => {
    const { container } = render(<ProfileCard />)
    const expected = [
      [/LinkedIn/, profile.links.linkedin],
      [/GitHub/, profile.links.github],
      [/Instagram/, profile.links.instagram],
    ] as const
    for (const [name, href] of expected) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(container.querySelector('a[href^="mailto:"], form')).toBeNull()
    expect(container.textContent).not.toMatch(/@/)
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<ProfileCard />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('App com cartão de perfil', () => {
  it('coloca o cartão fora do main, ao lado do conteúdo', () => {
    render(<App />)
    const aside = screen.getByRole('complementary', { name: 'Perfil' })
    expect(screen.getByRole('main').contains(aside)).toBe(false)
  })
})
