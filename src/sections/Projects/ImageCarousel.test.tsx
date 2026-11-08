import { readFileSync } from 'node:fs'
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

  it('a troca de imagem tem um fade, desligado com prefers-reduced-motion', () => {
    const css = readFileSync(
      'src/sections/Projects/ImageCarousel.module.css',
      'utf8',
    )
    const reduced = css.indexOf(
      '@media (prefers-reduced-motion: no-preference)',
    )
    expect(reduced).toBeGreaterThan(-1)
    const animation = css.indexOf('animation:')
    expect(animation).toBeGreaterThan(reduced)
    expect(css).toMatch(/@keyframes\s+\w+/)
  })

  describe('visualizador ampliado', () => {
    it('a imagem é um botão que abre a versão ampliada', async () => {
      const user = userEvent.setup()
      render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
      expect(screen.queryByRole('dialog')).toBeNull()
      await user.click(
        screen.getByRole('button', { name: 'Ampliar imagem 1 de 3' }),
      )
      const dialog = screen.getByRole('dialog', { name: 'Imagem ampliada' })
      expect(
        within(dialog).getByRole('img', { name: 'Primeira tela' }),
      ).toBeInTheDocument()
      expect(
        within(dialog).getByRole('button', { name: 'Fechar' }),
      ).toHaveFocus()
    })

    it('fecha pelo botão Fechar e devolve o foco à imagem', async () => {
      const user = userEvent.setup()
      render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
      const zoom = screen.getByRole('button', { name: 'Ampliar imagem 1 de 3' })
      await user.click(zoom)
      await user.click(screen.getByRole('button', { name: 'Fechar' }))
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(zoom).toHaveFocus()
    })

    it('fecha com Esc', async () => {
      const user = userEvent.setup()
      render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
      await user.click(
        screen.getByRole('button', { name: 'Ampliar imagem 1 de 3' }),
      )
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('as setas do visualizador passam as imagens junto com o carrossel', async () => {
      const user = userEvent.setup()
      render(<ImageCarousel images={images} label="Imagens do LumiFlow" />)
      await user.click(
        screen.getByRole('button', { name: 'Ampliar imagem 1 de 3' }),
      )
      const dialog = screen.getByRole('dialog', { name: 'Imagem ampliada' })
      await user.click(
        within(dialog).getByRole('button', { name: 'Próxima imagem' }),
      )
      expect(
        within(dialog).getByRole('img', { name: 'Segunda tela' }),
      ).toBeInTheDocument()
      await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))
      expect(screen.getByText('2 de 3')).toBeInTheDocument()
    })

    it('aberto, não tem violações de acessibilidade', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <ImageCarousel images={images} label="Imagens do LumiFlow" />,
      )
      await user.click(
        screen.getByRole('button', { name: 'Ampliar imagem 1 de 3' }),
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
