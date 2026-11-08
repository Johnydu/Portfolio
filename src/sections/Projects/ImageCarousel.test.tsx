import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { ImageCarousel } from './ImageCarousel'

const images = [
  { src: '/a.webp', alt: 'Primeira tela', width: 800, height: 1000 },
  { src: '/b.webp', alt: 'Segunda tela', width: 800, height: 1000 },
  { src: '/c.webp', alt: 'Terceira tela', width: 800, height: 1000 },
]

function visibleImage() {
  return screen
    .getAllByRole('img', { hidden: true })
    .filter((img) => !img.closest('[hidden]'))
}

describe('ImageCarousel', () => {
  it('é um grupo nomeado que começa na primeira imagem', () => {
    render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
    const group = screen.getByRole('group', { name: 'Imagens do LumiFlow' })
    expect(group).toHaveAttribute('aria-roledescription', 'carrossel')
    expect(visibleImage().map((img) => img.getAttribute('alt'))).toEqual([
      'Primeira tela',
    ])
    expect(screen.getByText('1 de 3')).toBeInTheDocument()
  })

  it('a seta de próxima avança e a de anterior volta, dando a volta nas pontas', async () => {
    const user = userEvent.setup()
    render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
    await user.click(screen.getByRole('button', { name: 'Próxima imagem' }))
    expect(visibleImage()[0]).toHaveAttribute('alt', 'Segunda tela')
    expect(screen.getByText('2 de 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Imagem anterior' }))
    await user.click(screen.getByRole('button', { name: 'Imagem anterior' }))
    expect(visibleImage()[0]).toHaveAttribute('alt', 'Terceira tela')
  })

  it('os indicadores levam direto a uma imagem e marcam a atual', async () => {
    const user = userEvent.setup()
    render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
    const dots = within(
      screen.getByRole('group', { name: 'Escolher imagem' }),
    ).getAllByRole('button')
    expect(dots).toHaveLength(3)
    await user.click(dots[2])
    expect(visibleImage()[0]).toHaveAttribute('alt', 'Terceira tela')
    expect(dots[2]).toHaveAttribute('aria-current', 'true')
    expect(dots[0]).not.toHaveAttribute('aria-current')
  })

  it('as setas do teclado também trocam a imagem', async () => {
    const user = userEvent.setup()
    render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
    screen.getByRole('button', { name: 'Próxima imagem' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(visibleImage()[0]).toHaveAttribute('alt', 'Segunda tela')
    await user.keyboard('{ArrowLeft}')
    expect(visibleImage()[0]).toHaveAttribute('alt', 'Primeira tela')
  })

  it('carrega sob demanda e não tem violações de acessibilidade', async () => {
    const { container } = render(
      <ImageCarousel images={images} label="Imagens do LumiFlow" />,
    )
    for (const img of screen.getAllByRole('img', { hidden: true })) {
      expect(img).toHaveAttribute('loading', 'lazy')
    }
    expect(await axe(container)).toHaveNoViolations()
  })
})
