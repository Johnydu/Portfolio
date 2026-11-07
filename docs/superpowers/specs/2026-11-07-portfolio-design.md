# Portfólio Profissional — Especificação de Design

Data: 2026-11-07
Autor: Johny Erick Remijo Duarte
Status: aguardando revisão (versão 3, alinhada ao perfil do GitHub e aos objetivos informados por Johny)

## 1. Objetivo e público

Site pessoal para apresentar Johny e seus projetos, com dois resultados esperados: conseguir uma vaga de desenvolvedor Backend Java e conseguir trabalhos freelance. Exibe, como complemento, competência em front-end moderno (React + TypeScript). É o portfólio oficial, vinculado ao GitHub e ao LinkedIn.

Público-alvo:
- Recrutadores e empresas de TI, que avaliam candidatos a vagas de desenvolvimento.
- Empresas do setor industrial, que podem precisar de sistemas de gestão como o LumiFlow. Para esse público, a experiência de Johny em ambiente industrial e o LumiFlow são o principal argumento.

Fonte de conteúdo: o perfil e o README do GitHub de Johny são a referência para textos, tecnologias, experiência e formação. Os textos do site reaproveitam esse material e os objetivos informados por Johny, sem acrescentar informações novas.

Critérios de sucesso:
- Um recrutador ou uma empresa industrial entende em menos de 30 segundos quem é Johny, qual é seu foco, onde ver seus projetos e como falar com ele sobre uma vaga ou um trabalho freelance.
- O repositório do site demonstra qualidade de código (tipagem estrita, componentes pequenos, testes, lint).
- O site é publicado no Railway com deploy automático a cada push na `main`.
- Metas de auditoria (Lighthouse): Performance, Acessibilidade, Boas práticas e SEO com nota mínima de 90. As metas são verificadas na implementação.

## 2. Decisões já tomadas

| Tema | Decisão |
|---|---|
| Arquitetura | SPA estática: Vite + React + TypeScript (modo `strict`) |
| Hospedagem | Railway, via Dockerfile multi-stage (Node compila, nginx serve) |
| Contato | LinkedIn (canal principal), GitHub e Instagram. Sem e-mail e sem formulário |
| Back-end | Nenhum nesta versão |
| Tema | Somente escuro, com destaque violeta |
| Roteamento | Nenhum. Página única com navegação por âncoras |

## 3. Fora do escopo (YAGNI)

- API ou back-end (pode surgir depois como segundo serviço no mesmo projeto Railway).
- Formulário de contato e exibição de e-mail, mesmo que o e-mail conste no README do GitHub.
- Alternância de tema claro/escuro.
- Blog, CMS e internacionalização. O idioma é pt-BR.

## 4. Estrutura do repositório

```
portfolio/
├── public/                  favicon.svg, og-image.png, robots.txt
├── src/
│   ├── styles/              tokens.css, global.css
│   ├── data/                profile.ts, projects.ts, skills.ts, experience.ts
│   ├── types/               Project, SkillGroup, SkillLevel, Profile, TimelineItem
│   ├── components/
│   │   ├── ui/              Button, Tag, Card, SectionTitle
│   │   └── layout/          Header, Footer
│   ├── sections/            Hero, About, Skills, Projects, Timeline, Contact
│   ├── App.tsx
│   └── main.tsx
├── nginx/default.conf.template
├── Dockerfile
├── CLAUDE.md                regras do projeto para sessões do Claude Code
├── README.md                documentação para quem visita o repositório
└── .github/workflows/ci.yml lint, testes e build
```

Princípio central: o conteúdo (textos, projetos, tecnologias) fica em `src/data/`, separado da interface. Adicionar um projeto exige editar apenas uma lista tipada.

## 5. Stack e ferramentas

- Build e servidor de desenvolvimento: Vite.
- UI: React + TypeScript com `strict` ativo e sem `any`.
- Estilo: CSS Modules mais variáveis CSS (tokens). Sem biblioteca de UI.
- Fontes: Inter e JetBrains Mono, servidas pelo próprio site (pacotes `@fontsource`), sem dependência de CDN.
- Qualidade: ESLint, Prettier, Vitest, Testing Library e verificação de acessibilidade com axe.
- As versões exatas são confirmadas na etapa de scaffolding, conforme o Node instalado na máquina de Johny.

## 6. Design System

Tokens em `src/styles/tokens.css`. Os valores são a proposta inicial e podem ser refinados no mockup.

- Cores: fundo `#0B0B0F`, superfície `#14141A`, borda `#23232C`, texto `#E8E8EE`, texto secundário `#A0A0B0`, destaque `#8B5CF6`.
- Tipografia: Inter para texto e JetBrains Mono para rótulos e tags técnicas.
- Espaçamento: escala em múltiplos de 4px. Raios de borda e sombras discretas.
- Regra: nenhuma cor, espaçamento ou raio fora dos tokens.

Componentes base:
- `Button`: variantes primária e secundária. Pode renderizar como link externo.
- `Tag`: tecnologia ou rótulo.
- `Card`: bloco de projeto.
- `SectionTitle`: título de seção com rótulo em fonte mono.

Todos têm props tipadas e estados visíveis de hover e foco.

## 7. Seções e conteúdo

Ordem: Hero, Sobre, Tecnologias, Projetos, Experiência e formação, Contato, Footer.

1. **Hero:** nome "Johny Duarte", título "Desenvolvedor Backend Java | Spring Boot | PostgreSQL" (o mesmo do README do GitHub), localização São José do Rio Preto — SP, a frase "Aberto a oportunidades como desenvolvedor Backend Java e a projetos freelance" e botões para GitHub e LinkedIn.
2. **Sobre:** texto adaptado do README: estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor com foco em Java e backend, interessado em aplicações bem estruturadas, APIs REST e sistemas que resolvam problemas reais de negócio. Destaca a experiência em ambiente industrial como base para entender processos operacionais e necessidades de sistemas de gestão. Inclui o bloco "IA aplicada ao desenvolvimento": uso do Claude Code como apoio, com as sugestões avaliadas e a responsabilidade técnica mantida por Johny.
3. **Tecnologias:** grupos por nível qualitativo, sem barras nem porcentagens. Os dois primeiros níveis seguem a classificação de Johny; os demais itens vêm do README do GitHub:

   | Nível | Itens |
   |---|---|
   | Foco principal | Java, Spring Boot |
   | Em aprofundamento | Spring Data JPA / Hibernate, Spring Security, APIs REST, PostgreSQL, testes automatizados, TypeScript, React |
   | Fundamentos | HTML5, CSS3, JavaScript, Thymeleaf, Bootstrap, Flyway, Maven, MySQL, Git, GitHub, IntelliJ IDEA, Claude Code |

   O nível "Em aprofundamento" reflete a seção "Atualmente aprofundando conhecimentos" do README (APIs REST, JPA e PostgreSQL, Spring Security e testes automatizados), somada a TypeScript e React, que Johny classificou como em estudo. Os itens de "Fundamentos" que Johny não classificou explicitamente (Bootstrap, Flyway, Maven, MySQL, Git, GitHub, IntelliJ IDEA) ficam nesse nível por ser a opção que não superestima a experiência. Qualquer nível pode ser alterado em `skills.ts`.
4. **Projetos:** o LumiFlow aparece em destaque, com o texto do README: sistema web de gestão da produção industrial, nascido de uma necessidade real do contexto fabril, em evolução e validação em ambiente real. Tecnologias: Java 21, Spring Boot 3, Spring Data JPA e Hibernate, Spring Security, PostgreSQL e Flyway, Thymeleaf, HTML5, CSS3, Maven e Git. Áreas do sistema: usuários e níveis de acesso, cadastro de produtos, máquinas e setores, roteiros de produção, ordens de produção com acompanhamento de etapas, registros e histórico das operações. Link do repositório: `https://github.com/Johnydu/LumiFlow`. O botão de demonstração só aparece se `demoUrl` existir. A lista aceita novos projetos.

   Segundo projeto, em card secundário: **landing-page**, uma landing page responsiva para divulgação de uma academia de karatê, desenvolvida com HTML5 e CSS3 (descrição do próprio repositório). Tecnologias: HTML5 e CSS3. Link do repositório: `https://github.com/Johnydu/landing-page`. Os demais repositórios públicos ficam fora desta versão.
5. **Experiência e formação:** linha do tempo com dois itens:
   - RBL Iluminação, área industrial, de 2023 até o momento, em São José do Rio Preto — SP: atuação em ambiente de produção industrial, com experiência prática em processos produtivos, rotina operacional e qualidade.
   - UNIRP — Centro Universitário de Rio Preto, Tecnólogo em Análise e Desenvolvimento de Sistemas, em andamento, com conclusão prevista em dezembro de 2026.
6. **Contato:** chamada para contato sobre vagas e projetos freelance, com links para LinkedIn (`https://www.linkedin.com/in/johny-duarte-3a2b6435b/`), GitHub (`https://github.com/Johnydu`) e Instagram (`https://www.instagram.com/johnydu/`). O LinkedIn é o canal principal e vem em destaque. O botão de currículo em PDF só aparece quando `resumeUrl` for definido.
7. **Footer:** identificação, links para LinkedIn, GitHub e Instagram e direitos autorais.

## 8. Fluxo de dados

`src/data/*.ts` → `App.tsx` → seções (props) → componentes de UI. Sem chamadas de rede e sem estado global. Campos opcionais ausentes (`demoUrl`, `resumeUrl`) fazem o elemento correspondente não ser renderizado.

## 9. Acessibilidade, responsividade e SEO

- HTML semântico (`header`, `main`, `section`, `footer`), link "pular para o conteúdo" e `aria-current` na navegação.
- `:focus-visible` em todo elemento interativo. Contraste mínimo WCAG AA.
- Animação limitada a um *fade-in* sutil, desativado com `prefers-reduced-motion`.
- Layout *mobile first* com ajustes para tablet e desktop.
- `lang="pt-BR"`, título, descrição, Open Graph e canonical no `index.html`. A URL absoluta vem da variável `VITE_SITE_URL`, definida no Railway.
- Favicon SVG em formato de monograma "JD" na cor de destaque.

## 10. Deploy e segurança

- `Dockerfile` multi-stage: estágio Node executa o build, estágio nginx serve `dist/`.
- O nginx lê a porta da variável `PORT` do Railway, usando o mecanismo de templates da imagem oficial (`default.conf.template`).
- Cabeçalhos: Content-Security-Policy restritiva (`default-src 'self'`, sem scripts inline), `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'none'`.
- Cache longo para arquivos com hash e `no-cache` para `index.html`. Compressão gzip. Rotas desconhecidas respondem com `index.html`.
- Links externos usam `target="_blank"` com `rel="noopener noreferrer"`.
- Fluxo: Railway conectado ao repositório GitHub, com deploy automático na `main`.

## 11. Testes e CI

- Dados: todo projeto tem `repoUrl` com `https` e ao menos uma tecnologia. Todo link externo é `https`.
- Componentes e seções renderizam o esperado, inclusive a ausência de `demoUrl` e `resumeUrl`.
- Verificação axe nos componentes principais.
- GitHub Actions executa lint, testes e build a cada push. O deploy fica a cargo do Railway.

## 12. Riscos e pontos a confirmar com Johny antes da implementação

- **Visibilidade do LumiFlow (resolvido):** Johny confirmou que o repositório `Johnydu/LumiFlow` agora é público, então o card exibe o botão de repositório. O README do perfil ainda diz que o código é privado e deve ser atualizado por Johny para ficar coerente com o site.
- **Banco de dados do LumiFlow (resolvido):** Johny confirmou PostgreSQL. A descrição do repositório no GitHub ainda cita MySQL e deve ser corrigida por Johny para ficar coerente com o site.
- **Cards secundários (resolvido):** além do LumiFlow, entra apenas a landing-page. Os outros repositórios públicos não aparecem nesta versão.
- CSP restritiva pode bloquear algum recurso: validar no navegador durante a implementação.
