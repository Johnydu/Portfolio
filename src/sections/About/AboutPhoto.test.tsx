import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { profile } from '../../data/profile'
import { About } from './About'

describe('Foto da seção Sobre mim', () => {
  it('o perfil tem a foto do Sobre com texto alternativo e dimensões', () => {
    expect(profile.aboutPhoto.alt).toBe(
      'Johny Duarte lendo um livro com uma xícara de café, com o notebook aberto ao fundo',
    )
    expect(profile.aboutPhoto.width).toBe(800)
    expect(profile.aboutPhoto.height).toBe(1071)
  })

  it('mostra a foto dentro da região Sobre mim, carregada sob demanda', () => {
    render(<About />)
    const region = screen.getByRole('region', { name: 'Sobre mim' })
    const photo = within(region).getByRole('img', {
      name: profile.aboutPhoto.alt,
    })
    expect(photo.getAttribute('src')).toBeTruthy()
    expect(photo).toHaveAttribute('width', '800')
    expect(photo).toHaveAttribute('height', '1071')
    expect(photo).toHaveAttribute('loading', 'lazy')
    expect(photo).toHaveAttribute('decoding', 'async')
  })

  it('a foto vem antes do texto, para aparecer logo abaixo do título no celular', () => {
    render(<About />)
    const photo = screen.getByRole('img', { name: profile.aboutPhoto.alt })
    const firstParagraph = screen.getByText(profile.about[0])
    expect(
      photo.compareDocumentPosition(firstParagraph) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
