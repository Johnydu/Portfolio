# Portfólio Profissional — Plano de Implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa a tarefa. Os passos usam caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** construir e publicar no Railway o portfólio de Johny Duarte como SPA estática em React + TypeScript.

**Arquitetura:** Vite gera arquivos estáticos que um container nginx serve. O conteúdo vive em `src/data/` (tipado) e flui por props até seções e componentes de UI. Não há back-end, roteamento nem estado global.

**Stack:** Vite, React, TypeScript `strict`, CSS Modules + variáveis CSS, Vitest, Testing Library, vitest-axe, ESLint, Prettier, `@fontsource` (Inter, JetBrains Mono), Docker (Node + nginx), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-07-portfolio-design.md` (também em `claude/spec-design-portfolio.md` no projeto do Claude). Leia-a antes de qualquer tarefa.

## Restrições globais

- Diretório e repositório: `portfolio/`. Branch principal: `main`.
- TypeScript com `strict: true` e sem `any`. Idioma do site: pt-BR (`lang="pt-BR"`).
- Nenhuma cor, espaçamento ou raio fora de `src/styles/tokens.css`.
- Sem estilos inline (`style=`), sem scripts inline e sem data URIs (`build.assetsInlineLimit: 0`), por causa da CSP `default-src 'self'`.
- Fontes servidas pelo próprio site. Sem CDN.
- Todo link externo é `https`, abre com `target="_blank"` e `rel="noopener noreferrer"`.
- Contato: LinkedIn (principal), GitHub e Instagram. Nenhum e-mail e nenhum formulário.
- Habilidades por nível qualitativo: "Foco principal", "Em aprofundamento", "Fundamentos". Sem barras nem porcentagens.
- Cores base (tokens): fundo `#0B0B0F`, superfície `#14141A`, borda `#23232C`, texto `#E8E8EE`, texto secundário `#A0A0B0`, destaque `#8B5CF6`.
- Versões das dependências: confirmar as estáveis atuais e a compatibilidade com o Node instalado (`node -v`) no momento do scaffolding. Não fixar versões de memória.
- Commits em Conventional Commits, com descrição em português.

## Foco de revisão

1. Link externo com esquema inseguro (`http:`, `javascript:`) nos dados: o teste de dados deve reprovar.
2. `demoUrl` ou `resumeUrl` ausentes: nenhum botão vazio nem link quebrado deve ser renderizado.
3. Usuário de teclado: o "pular para o conteúdo" é o primeiro elemento focável e todo elemento interativo mostra foco visível.
4. Container: o nginx deve subir em qualquer valor de `PORT` (não só 80) e responder `index.html` a rotas desconhecidas.
5. Build sem `VITE_SITE_URL`: deve falhar com mensagem clara, em vez de publicar Open Graph com `%VITE_SITE_URL%` literal.

---

### Tarefa 1: Scaffolding e ferramentas de qualidade

**Arquivos:**
- Criar: projeto Vite (template `react-ts`) em `portfolio/`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc`, `src/test/setup.ts`, `src/App.test.tsx`, `CLAUDE.md`, `README.md` (esqueleto), `.gitignore`, `.env.example`

**Interfaces:**
- Produz: scripts npm `dev`, `build`, `lint`, `test`, `format`; `App` exportado de `src/App.tsx`; matcher `toHaveNoViolations` registrado em `src/test/setup.ts`.

- [ ] **Passo 1:** Rodar `node -v`, criar o projeto Vite `react-ts`, `git init` e instalar `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `vitest-axe`, `prettier`, `eslint-config-prettier`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`.
- [ ] **Passo 2: Teste falho** em `src/App.test.tsx`: `renderiza o título principal` — renderiza `<App />` e espera `screen.getByRole("heading", { level: 1, name: /Johny Duarte/ })`.
- [ ] **Passo 3:** Rodar `npm test` e confirmar que falha (o `App` do template não tem esse título).
- [ ] **Passo 4:** Configurar `strict`, `assetsInlineLimit: 0`, ambiente de teste `jsdom` com `setupFiles`, e fazer `App` renderizar um `<h1>Johny Duarte</h1>` mínimo.
- [ ] **Passo 5:** Escrever `CLAUDE.md` com: objetivo, comandos, estrutura, convenções (as restrições globais), regras de conteúdo (contato só LinkedIn/GitHub/Instagram, sem inventar dados, sem porcentagens) e padrão de commits. Escrever `.env.example` com `VITE_SITE_URL=`.
- [ ] **Passo 6:** `npm run lint && npm test && npm run build` passam.
- [ ] **Passo 7: Commit** `chore: scaffolding Vite + React + TypeScript com lint e testes`.

### Tarefa 2: Tipos e dados de conteúdo

**Arquivos:**
- Criar: `src/types/index.ts`, `src/data/profile.ts`, `src/data/skills.ts`, `src/data/projects.ts`, `src/data/experience.ts`
- Teste: `src/data/data.test.ts`

**Interfaces:**
- Produz (em `src/types/index.ts`):
  - `type SkillLevel = "Foco principal" | "Em aprofundamento" | "Fundamentos"`
  - `interface SkillGroup { level: SkillLevel; items: readonly string[] }`
  - `interface Project { title: string; description: string; technologies: readonly string[]; repoUrl: string; demoUrl?: string; featured?: boolean; highlights?: readonly string[] }`
  - `interface TimelineItem { title: string; organization: string; period: string; description: string }`
  - `interface Profile { name: string; headline: string; location: string; tagline: string; about: readonly string[]; aiNote: string; links: { linkedin: string; github: string; instagram: string }; resumeUrl?: string }`
- Produz (em `src/data`): `profile: Profile`, `skills: readonly SkillGroup[]`, `projects: readonly Project[]`, `timeline: readonly TimelineItem[]`.

- [ ] **Passo 1: Testes falhos** em `data.test.ts`, com estas asserções:
  - `todo projeto tem repoUrl https e ao menos uma tecnologia`
  - `todo link externo usa https` (percorre `profile.links`, `resumeUrl` quando existe, `repoUrl` e `demoUrl` dos projetos e reprova `http:` e `javascript:`)
  - `os níveis de habilidade são os três definidos, sem porcentagens` (nenhum item contém `%`)
  - `Java e Spring Boot estão em Foco principal`
  - `o LumiFlow é o projeto em destaque e a landing-page é secundária`
  - `a linha do tempo tem RBL Iluminação e UNIRP`
- [ ] **Passo 2:** Rodar e confirmar que falha (módulos inexistentes).
- [ ] **Passo 3:** Implementar tipos e dados com os textos e valores da seção 7 da spec (headline, frase "Aberto a oportunidades…", níveis de habilidade, LumiFlow com tecnologias e destaques, landing-page, linha do tempo, URLs de LinkedIn, GitHub e Instagram).
- [ ] **Passo 4:** `npm test` passa.
- [ ] **Passo 5: Commit** `feat: tipos e dados de conteúdo do portfólio`.

### Tarefa 3: Design System (tokens, estilos globais e componentes de UI)

**Arquivos:**
- Criar: `src/styles/tokens.css`, `src/styles/global.css`, `src/components/ui/{Button,Tag,Card,SectionTitle}/` (cada pasta com `.tsx` e `.module.css`)
- Teste: `src/components/ui/ui.test.tsx`

**Interfaces:**
- Consome: nada de tarefas anteriores.
- Produz:
  - `Button({ variant?: "primary" | "secondary"; href?: string; external?: boolean; children }): JSX.Element` (renderiza `<a>` quando há `href`, senão `<button>`)
  - `Tag({ children }): JSX.Element`
  - `Card({ children, featured?: boolean }): JSX.Element`
  - `SectionTitle({ label: string; title: string; id: string }): JSX.Element` (renderiza `<h2 id>`)

- [ ] **Passo 1: Testes falhos** em `ui.test.tsx`:
  - `Button com href externo renderiza link com target _blank e rel noopener noreferrer`
  - `Button sem href renderiza um botão`
  - `SectionTitle expõe o título como h2 com o id informado`
  - `componentes de UI não têm violações de acessibilidade` (`axe` sobre os quatro componentes)
- [ ] **Passo 2:** Rodar e confirmar que falha.
- [ ] **Passo 3:** Criar `tokens.css` com os valores das restrições globais, famílias de fonte, escala de 4px, raios e sombras. `global.css` importa as fontes `@fontsource`, aplica reset mínimo, `:focus-visible` com contorno na cor de destaque, `scroll-behavior` e a classe de entrada com *fade-in* dentro de `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Passo 4:** Implementar os quatro componentes com CSS Modules usando somente tokens, com estados de hover e foco.
- [ ] **Passo 5:** `npm test` passa.
- [ ] **Passo 6: Commit** `feat: design system com tokens e componentes de UI`.

### Tarefa 4: Layout (Header e Footer)

**Arquivos:**
- Criar: `src/components/layout/Header/`, `src/components/layout/Footer/`
- Teste: `src/components/layout/layout.test.tsx`

**Interfaces:**
- Consome: `Button` (Tarefa 3), `profile` (Tarefa 2).
- Produz:
  - `Header(): JSX.Element` com link "Pular para o conteúdo" apontando para `#conteudo` como primeiro elemento focável e navegação por âncoras `#sobre`, `#tecnologias`, `#projetos`, `#trajetoria`, `#contato`. Marca o item da seção visível com `aria-current="true"` (via `IntersectionObserver`).
  - `Footer(): JSX.Element` com nome, links de LinkedIn, GitHub e Instagram e direitos autorais.

- [ ] **Passo 1: Testes falhos:**
  - `o primeiro elemento focável é o link pular para o conteúdo` (`userEvent.tab()` e verificação do foco)
  - `o cabeçalho tem os cinco links de navegação com os hrefs esperados`
  - `o rodapé tem links https para LinkedIn, GitHub e Instagram`
  - `layout sem violações de acessibilidade`
- [ ] **Passo 2:** Rodar e confirmar que falha.
- [ ] **Passo 3:** Implementar `Header` (`<header>` e `<nav aria-label="Principal">`) e `Footer` (`<footer>`). Usar um hook `useActiveSection(ids: readonly string[]): string` em `Header/useActiveSection.ts`, com `IntersectionObserver` simulado nos testes.
- [ ] **Passo 4:** `npm test` passa.
- [ ] **Passo 5: Commit** `feat: header com navegação acessível e footer`.

### Tarefa 5: Seções Hero, Sobre e Tecnologias

**Arquivos:**
- Criar: `src/sections/{Hero,About,Skills}/` (`.tsx` e `.module.css`)
- Teste: `src/sections/sections-a.test.tsx`

**Interfaces:**
- Consome: `Button`, `Tag`, `SectionTitle` (Tarefa 3); `profile`, `skills` (Tarefa 2).
- Produz: `Hero()`, `About()` (`id="sobre"`), `Skills()` (`id="tecnologias"`), todos `(): JSX.Element`.

- [ ] **Passo 1: Testes falhos:**
  - `Hero mostra o h1 com o nome, o título e a frase de abertura a oportunidades`
  - `Hero tem botões https para GitHub e LinkedIn`
  - `About mostra o bloco de IA aplicada ao desenvolvimento`
  - `Skills agrupa por nível, na ordem Foco principal, Em aprofundamento, Fundamentos`
  - `Skills não contém porcentagens nem elementos de progresso` (`queryByRole("progressbar")` nulo)
- [ ] **Passo 2:** Rodar e confirmar que falha.
- [ ] **Passo 3:** Implementar as seções somente com dados de `src/data`. Cada seção usa `<section aria-labelledby>` e o `SectionTitle`.
- [ ] **Passo 4:** `npm test` passa.
- [ ] **Passo 5: Commit** `feat: seções Hero, Sobre e Tecnologias`.

### Tarefa 6: Seções Projetos, Trajetória e Contato, e composição do App

**Arquivos:**
- Criar: `src/sections/{Projects,Timeline,Contact}/`
- Modificar: `src/App.tsx` (substitui o h1 provisório), `src/main.tsx` (importa `tokens.css`, `global.css`)
- Teste: `src/sections/sections-b.test.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consome: Tarefas 2 a 4.
- Produz: `Projects()` (`id="projetos"`), `Timeline()` (`id="trajetoria"`), `Contact()` (`id="contato"`), e `App()` que compõe `Header`, `main#conteudo` com as seis seções na ordem da spec, e `Footer`.

- [ ] **Passo 1: Testes falhos:**
  - `Projects mostra o LumiFlow em destaque com link do repositório e a landing-page como secundária`
  - `Projects não renderiza botão de demonstração quando demoUrl não existe`
  - `Timeline mostra RBL Iluminação e UNIRP com os períodos`
  - `Contact mostra LinkedIn em destaque, GitHub e Instagram, sem e-mail nem formulário` (`queryByRole("textbox")` nulo, nenhum `mailto:`)
  - `Contact não renderiza o botão de currículo quando resumeUrl não existe`
  - `App tem um único h1, landmarks header, main e footer, e não tem violações de acessibilidade`
- [ ] **Passo 2:** Rodar e confirmar que falha.
- [ ] **Passo 3:** Implementar as seções e a composição. `Contact` usa o `Button` externo para os três links.
- [ ] **Passo 4:** `npm test && npm run lint && npm run build` passam.
- [ ] **Passo 5: Commit** `feat: seções Projetos, Trajetória e Contato e composição do App`.

### Tarefa 7: `index.html`, SEO, favicon e verificação de variável de ambiente

**Arquivos:**
- Modificar: `index.html`, `vite.config.ts`
- Criar: `public/favicon.svg`, `public/robots.txt`, `public/og-image.png`
- Teste: `src/seo.test.ts`

**Interfaces:**
- Consome: `VITE_SITE_URL` (variável de ambiente).
- Produz: `index.html` com `lang="pt-BR"`, título, descrição, canonical, Open Graph e `<noscript>` com links para GitHub e LinkedIn; build que falha sem `VITE_SITE_URL`.

- [ ] **Passo 1: Testes falhos** em `seo.test.ts`, lendo `index.html` do disco:
  - `declara lang pt-BR, title e meta description`
  - `declara og:title, og:description, og:type, og:url e og:image absolutos a partir de VITE_SITE_URL`
  - `declara link canonical`
  - `inclui noscript com links para GitHub e LinkedIn`
  - `não contém scripts inline` (todo `<script>` tem `src`)
- [ ] **Passo 2:** Rodar e confirmar que falha.
- [ ] **Passo 3:** Editar `index.html` usando `%VITE_SITE_URL%` nas URLs absolutas. Em `vite.config.ts`, lançar erro com mensagem clara quando o modo for `production` e `VITE_SITE_URL` estiver vazio. Criar o favicon SVG com o monograma "JD" na cor de destaque, `robots.txt` permissivo e uma `og-image.png` 1200×630 simples no padrão visual do site.
- [ ] **Passo 4:** Verificar `VITE_SITE_URL= npm run build` falhando com a mensagem e `VITE_SITE_URL=https://exemplo.test npm run build` passando, com `dist/index.html` sem `%VITE_SITE_URL%`.
- [ ] **Passo 5:** `npm test` passa.
- [ ] **Passo 6: Commit** `feat: SEO, Open Graph, favicon e validação de VITE_SITE_URL`.

### Tarefa 8: Container, nginx e CI

**Arquivos:**
- Criar: `Dockerfile`, `nginx/default.conf.template`, `.dockerignore`, `.github/workflows/ci.yml`

**Interfaces:**
- Consome: `VITE_SITE_URL` como `ARG` do Docker (o Railway repassa variáveis do serviço como argumentos de build) e `PORT` em tempo de execução.
- Produz: imagem que serve `dist/` em `${PORT}`.

- [ ] **Passo 1:** Escrever o `Dockerfile` multi-stage: estágio Node (`npm ci`, `ARG VITE_SITE_URL`, `npm run build`) e estágio nginx copiando `dist/` e o template para `/etc/nginx/templates/default.conf.template`, que o entrypoint da imagem oficial processa com `envsubst` usando `PORT`.
- [ ] **Passo 2:** Escrever `default.conf.template` com `listen ${PORT};`, `try_files $uri /index.html`, gzip, `Cache-Control` longo (`public, max-age=31536000, immutable`) para `/assets/` e `no-cache` para `index.html`, e os cabeçalhos: `Content-Security-Policy` (`default-src 'self'; frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] **Passo 3:** Escrever `ci.yml` (push e pull request): `npm ci`, `npm run lint`, `npm test`, `npm run build` com `VITE_SITE_URL` de exemplo.
- [ ] **Passo 4: Verificar no container:**
  - `docker build --build-arg VITE_SITE_URL=https://exemplo.test -t portfolio .`
  - `docker run -d -e PORT=8080 -p 8080:8080 portfolio` e `curl -sI localhost:8080` devolve `200` com os três cabeçalhos de segurança.
  - `curl -s -o /dev/null -w "%{http_code}" localhost:8080/rota-inexistente` devolve `200`.
  - Repetir com `PORT=3000` e confirmar que também responde.
  - `curl -sI localhost:8080/` mostra `Cache-Control: no-cache`.
- [ ] **Passo 5: Commit** `feat: Dockerfile, nginx e pipeline de CI`.

### Tarefa 9: README, auditoria e publicação

**Arquivos:**
- Modificar: `README.md`

- [ ] **Passo 1:** Escrever o `README.md` profissional: descrição, captura de tela, stack, estrutura de pastas, como rodar (`npm install`, `npm run dev`, `npm test`, `npm run build`), como rodar o container, variáveis de ambiente e como publicar no Railway.
- [ ] **Passo 2: Auditoria local:** rodar `npm run build && npm run preview`, abrir no navegador e conferir CSP no console (fontes carregadas, nenhum bloqueio), foco visível, responsividade em larguras de celular, tablet e desktop, e `prefers-reduced-motion`. Rodar Lighthouse e confirmar nota mínima 90 em Performance, Acessibilidade, Boas práticas e SEO.
- [ ] **Passo 3: Publicação:** criar o repositório `portfolio` no GitHub, enviar a `main`, criar o serviço no Railway a partir do repositório, definir `VITE_SITE_URL` com o domínio gerado, publicar e conferir a URL pública.
- [ ] **Passo 4:** Rodar Lighthouse na URL pública e conferir as mesmas metas.
- [ ] **Passo 5: Commit** `docs: README com instruções de uso e publicação`.
