import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { profile } from '../../data/profile'
import { Contact } from './Contact'

const ALT =
  'Johny Duarte sorrindo, de óculos escuros e blazer claro, num terraço com a cidade ao entardecer ao fundo'

describe('Foto da seção Contato', () => {
  it('o perfil tem a foto do Contato com texto alternativo e dimensões', () => {
    expect(profile.contactPhoto.alt).toBe(ALT)
    expect(profile.contactPhoto.width).toBe(800)
    expect(profile.contactPhoto.height).toBe(1013)
  })

  it('mostra a foto na região Contato, carregada sob demanda', () => {
    render(<Contact />)
    const region = screen.getByRole('region', { name: 'Contato' })
    const photo = within(region).getByRole('img', { name: ALT })
    expect(photo.getAttribute('src')).toBeTruthy()
    expect(photo).toHaveAttribute('width', '800')
    expect(photo).toHaveAttribute('height', '1013')
    expect(photo).toHaveAttribute('loading', 'lazy')
    expect(photo).toHaveAttribute('decoding', 'async')
  })

  it('continua sem e-mail nem formulário', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('form, a[href^="mailto:"]')).toBeNull()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Contact />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
