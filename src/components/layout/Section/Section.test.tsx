import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('renderiza uma região nomeada pelo título, com o id da âncora', () => {
    render(
      <Section id="sobre" titleId="titulo-sobre">
        <h2 id="titulo-sobre">Sobre mim</h2>
      </Section>,
    )
    const region = screen.getByRole('region', { name: 'Sobre mim' })
    expect(region).toHaveAttribute('id', 'sobre')
  })
})
