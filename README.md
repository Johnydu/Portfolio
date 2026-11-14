# Portfólio — Johny Duarte

Portfólio profissional de **Johny Duarte**, Desenvolvedor Backend Java. Apresenta
perfil, tecnologias, projetos e trajetória, com contato por LinkedIn, GitHub e
Instagram. O objetivo é mostrar o trabalho e conquistar tanto uma vaga de
desenvolvedor backend Java quanto projetos freelance.

![Pré-visualização do portfólio](docs/images/preview.png)

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript (`strict`, sem `any`)
- CSS Modules com _design tokens_ em CSS (`src/styles/tokens.css`)
- Fontes servidas pelo próprio site (`@fontsource`), sem CDN
- Vitest + Testing Library + vitest-axe (testes e acessibilidade)
- ESLint + Prettier
- Publicado no GitHub Pages pelo GitHub Actions

É uma SPA estática: não há back-end, rotas nem formulário.

## Estrutura

```
src/
  data/                 conteúdo tipado (perfil, tecnologias, projetos, trajetória)
  types/                tipos do conteúdo
  components/ui/        Button, Tag, Card, SectionTitle, Reveal
  components/layout/    Header, Footer, Section
  sections/             Hero, About, Skills, Projects, Timeline, Contact
  styles/               tokens.css (Design System) e global.css
config/                 plugin do Vite que resolve VITE_SITE_URL
nginx/                  template de configuração e cabeçalhos de segurança
scripts/                verify-container.sh (verificação da imagem Docker)
```

Para adicionar um projeto, edite apenas `src/data/projects.ts`.

## Como rodar

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm test           # testes (Vitest)
npm run lint       # ESLint
npm run format     # Prettier
```

### Build de produção

```bash
VITE_SITE_URL=https://seu-dominio.exemplo npm run build
npm run preview
```

O build falha se `VITE_SITE_URL` não for informada ou não for uma URL `https`.

## Variáveis de ambiente

| Variável        | Quando | Descrição                                                                                                        |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL` | build  | URL pública `https` do site. Define canonical, Open Graph e og:image, e o caminho base (`/Portfolio/`) do build. |

## Publicação no GitHub Pages

O site está em **https://johnydu.github.io/Portfolio/**.

1. Em **Settings → Pages**, a origem (_Source_) é **GitHub Actions**.
2. A cada push na `main`, o workflow `.github/workflows/pages.yml` roda lint,
   testes e build com `VITE_SITE_URL=https://johnydu.github.io/Portfolio` e
   publica a pasta `dist/`.
3. Também dá para publicar manualmente em **Actions → Publicar no GitHub Pages
   → Run workflow**.

Para ver localmente o build como no GitHub Pages:

```bash
VITE_SITE_URL=https://johnydu.github.io/Portfolio npm run build
npx vite preview --base /Portfolio/
```

Se o endereço mudar, atualize `VITE_SITE_URL` no workflow: o caminho base sai
dessa URL.

## Qualidade

- HTML semântico, navegação por teclado e contraste WCAG AA (verificado em teste).
- Política de segurança de conteúdo `default-src 'self'` numa `<meta>` inserida no build
  (o GitHub Pages não permite cabeçalhos HTTP próprios).
- Animação limitada a um _fade-in_ sutil, desativado com `prefers-reduced-motion`.
- Lighthouse local: 100 em Performance, Acessibilidade, Boas práticas e SEO.
- CI no GitHub Actions: lint, testes e build a cada push e pull request.
