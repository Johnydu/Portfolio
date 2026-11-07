import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Button, Card, SectionTitle, Tag } from '.'

describe('Button', () => {
  it('com href externo renderiza link com target _blank e rel noopener noreferrer', () => {
    render(
      <Button href="https://github.com/Johnydu" external>
        GitHub
      </Button>,
    )
    const link = screen.getByRole('link', { name: /GitHub/ })
    expect(link).toHaveAttribute('href', 'https://github.com/Johnydu')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('com href interno não abre nova aba', () => {
    render(<Button href="#sobre">Sobre</Button>)
    const link = screen.getByRole('link', { name: 'Sobre' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('sem href renderiza um botão', () => {
    render(<Button>Enviar</Button>)
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute(
      'type',
      'button',
    )
  })
})

describe('SectionTitle', () => {
  it('expõe o título como h2 com o id informado', () => {
    render(
      <SectionTitle label="02 / projetos" title="Projetos" id="projetos" />,
    )
    const heading = screen.getByRole('heading', { level: 2, name: 'Projetos' })
    expect(heading).toHaveAttribute('id', 'projetos')
    expect(screen.getByText('02 / projetos')).toBeInTheDocument()
  })
})

describe('Tag e Card', () => {
  it('Tag mostra o texto da tecnologia', () => {
    render(<Tag>Java</Tag>)
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('Card agrupa o conteúdo em um article', () => {
    render(<Card>Conteúdo do projeto</Card>)
    expect(screen.getByRole('article')).toHaveTextContent('Conteúdo do projeto')
  })
})

describe('acessibilidade', () => {
  it('componentes de UI não têm violações de acessibilidade', async () => {
    const { container } = render(
      <main>
        <SectionTitle label="01 / sobre" title="Sobre" id="sobre" />
        <Card featured>
          <Tag>Java</Tag>
          <Button href="https://github.com/Johnydu" external variant="primary">
            GitHub
          </Button>
          <Button variant="secondary">Ação</Button>
        </Card>
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
