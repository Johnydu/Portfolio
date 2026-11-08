import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../../data/projects'
import { Projects } from './Projects'

const TITLE = 'convite-aniversario-caleb'
const CONVITE_ALT =
  'Captura do topo do convite: cena em pixel art com bandeirinhas, balões, uma criança de chapéu de festa e um bolo com o número 2, sob o título “Caleb faz 2 anos!”'

function conviteArticle() {
  render(<Projects />)
  const heading = screen.getByRole('heading', { level: 3, name: TITLE })
  const article = heading.closest('article')
  if (!article) throw new Error('vitrine do convite não encontrada')
  return article
}

describe('Vitrine do convite de aniversário', () => {
  it('o convite tem banner com a captura real, sem logo e sem destaque', () => {
    const convite = projects.find((p) => p.title === TITLE)
    expect(convite?.showcase?.media?.alt).toBe(CONVITE_ALT)
    expect(convite?.showcase?.logo).toBeUndefined()
    expect(convite?.featured).toBeFalsy()
  })

  it('vem depois da landing-page na lista de projetos', () => {
    const titles = projects.map((p) => p.title)
    expect(titles.indexOf(TITLE)).toBeGreaterThan(
      titles.indexOf('landing-page'),
    )
  })

  it('mostra o banner do convite com carregamento sob demanda', () => {
    const article = conviteArticle()
    const banner = within(article).getByRole('img', { name: CONVITE_ALT })
    expect(banner).toHaveAttribute('loading', 'lazy')
    expect(within(article).queryByText('Projeto em destaque')).toBeNull()
  })

  it('tem links para o repositório e para a página publicada, em nova aba', () => {
    const article = conviteArticle()
    const repo = within(article).getByRole('link', {
      name: /Repositório\s*do projeto convite-aniversario-caleb/,
    })
    const demo = within(article).getByRole('link', {
      name: /Ver página\s*do projeto convite-aniversario-caleb/,
    })
    expect(repo).toHaveAttribute(
      'href',
      'https://github.com/Johnydu/convite-aniversario-caleb',
    )
    expect(demo).toHaveAttribute(
      'href',
      'https://johnydu.github.io/convite-aniversario-caleb/',
    )
    for (const link of [repo, demo]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
