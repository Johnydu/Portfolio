import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('mostra o conteúdo quando não há IntersectionObserver', () => {
    render(
      <Reveal>
        <p>Texto</p>
      </Reveal>,
    )
    expect(screen.getByText('Texto')).toBeInTheDocument()
  })
})
