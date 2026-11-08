# CLAUDE.md — Portfólio de Johny Duarte

Regras do projeto para sessões do Claude Code. A especificação completa está em
`docs/superpowers/specs/2026-11-07-portfolio-design.md` e o plano em
`docs/superpowers/plans/2026-11-07-portfolio.md`.

## Objetivo

Portfólio profissional de Johny Duarte (Desenvolvedor Backend Java) para
conseguir vaga de desenvolvedor e trabalhos freelance. Público: recrutadores e
empresas de TI, e empresas do setor industrial. É uma SPA estática (Vite +
React + TypeScript) publicada no GitHub Pages. Não há back-end.

## Comandos

- `npm install` — instala as dependências
- `npm run dev` — servidor de desenvolvimento
- `npm test` — testes (Vitest)
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `VITE_SITE_URL=https://exemplo.test npm run build` — build de produção
- `npx vite preview --base /Portfolio/` — ver o build como no GitHub Pages

## Estrutura

- `src/data/` — todo o conteúdo (textos, projetos, tecnologias), tipado
- `src/types/` — tipos do conteúdo
- `src/components/ui/` — Button, Tag, Card, SectionTitle
- `src/components/layout/` — Header, Footer, Section
- `src/sections/` — Hero, About, Skills, Projects, Timeline, Contact
- `src/styles/` — `tokens.css` (Design System) e `global.css`

O conteúdo fica em `src/data/`, separado da interface. Para adicionar um
projeto, edite apenas `src/data/projects.ts`.

## Convenções de código

- TypeScript com `strict` e sem `any`.
- CSS Modules; cores, espaçamentos e raios apenas via tokens de `tokens.css`.
- Sem estilos inline, sem scripts inline e sem imagens embutidas em data URI
  (a CSP é `default-src 'self'`).
- Fontes servidas pelo próprio site (`@fontsource`), sem CDN.
- Componentes pequenos, com uma responsabilidade e props tipadas.
- Todo código novo nasce de um teste que falha primeiro (TDD).

## Regras de conteúdo

- Contato somente por LinkedIn (principal), GitHub e Instagram. Nenhum e-mail e
  nenhum formulário.
- Não inventar informações. O texto vem do perfil e do README do GitHub de Johny.
- Habilidades por nível qualitativo (Foco principal, Em aprofundamento,
  Fundamentos). Nunca barras nem porcentagens.
- Todo link externo é `https`, com `target="_blank"` e
  `rel="noopener noreferrer"`.
- Idioma do site: pt-BR.

## Qualidade

- HTML semântico, navegação por teclado e contraste WCAG AA.
- Animação apenas um _fade-in_ sutil, desativado com `prefers-reduced-motion`.

## Git

- Commits em Conventional Commits, com descrição em português
  (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Deploy automático no GitHub Pages a cada push na `main`
  (`.github/workflows/pages.yml`), em https://johnydu.github.io/Portfolio/.
