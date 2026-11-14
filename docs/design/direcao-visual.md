# Direção visual do Portfolio: grafite e âmbar

Aprovada pelo Johny em 2026-11-13. Referência para o Desenvolvedor, o revisor de front (que compara as capturas de
tela com este documento) e o Gerente.

## Objetivo

Tirar a aparência de "feito por IA" (fundo quase preto com violeta, Inter em tudo, cartões iguais, um único fade-in) e
dar vida à página **sem perder o profissionalismo**. O público são recrutadores e empresas de TI e do setor industrial.
A identidade conta a história real do Johny: desenvolvedor backend Java com experiência prática em ambiente
industrial, autor de um ERP de produção industrial (LumiFlow).

## Princípios

1. Personalidade no visual (luz, textura, composição, movimento); texto e tipografia sóbrios.
2. Nada de conteúdo inventado. Todo texto sai de `src/data/` e do perfil do Johny.
3. Contraste AA em todo texto. Status e níveis sempre com rótulo em texto.
4. Todo movimento para com `prefers-reduced-motion: reduce`.
5. CSP `default-src 'self'`: sem estilo inline, sem script inline, sem data URI, fontes locais.

## Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#141413` | fundo da página |
| `--color-surface` | `#1C1C1A` | cartões e áreas elevadas |
| `--color-border` | `#2C2C2A` | bordas e divisórias |
| `--color-text` | `#F1EFE8` | texto principal |
| `--color-text-muted` | `#B4B2A9` | texto secundário |
| `--color-accent` | `#EF9F27` | destaque: botão principal, terminal, linhas do diagrama |
| `--color-accent-hover` | `#FAC775` | hover do destaque |
| `--color-accent-text` | `#EF9F27` | links e textos em destaque sobre o fundo |
| `--color-on-accent` | `#412402` | texto sobre o âmbar |
| `--color-grid` | `rgb(255 255 255 / 4%)` | malha de planta técnica |
| `--color-glow` | `rgb(239 159 39 / 30%)` | brilho desfocado |

Sem violeta e sem rosa em lugar nenhum.

## Tipografia

- Títulos (`h1` a `h3`, nome, títulos de seção): **Space Grotesk** (`@fontsource-variable/space-grotesk`), peso 500.
- Texto corrido: **Inter** (já instalada).
- Terminal, rótulos técnicos e números: **JetBrains Mono** (já instalada).
- Sem fonte manuscrita.

## Textura e luz

- Malha de planta técnica (linhas de 1px a cada 24px, `--color-grid`) no fundo do topo, desvanecendo para baixo.
- Um a três brilhos âmbar desfocados (`--color-glow`, `filter: blur`) por trás do topo e da seção de projetos, parados.
- Anotações técnicas discretas em JetBrains Mono, em `--color-text-muted`: os rótulos de seção que já existem
  (`02 / tecnologias`) e marcas de cota (traços com números de medida) ao lado da foto do topo.

## Componentes

- **Botões:** cantos de 6px. Principal: fundo `--color-accent`, texto `--color-on-accent`. Secundário: só contorno
  `--color-border`, texto `--color-text`.
- **Cartões:** `--color-surface`, borda `--color-border`, cantos de 10px; no hover, borda em `--color-accent`.
- **Foco:** contorno de 2px em `--color-accent`, nunca removido.

## Seções

- **Topo:** linha de terminal digitada (`> johny.duarte --stack java spring postgresql`), frase de destaque com uma
  palavra sublinhada por um traço âmbar, foto real num quadro de cantos retos com borda âmbar fina e marcas de cota,
  botões "Ver projetos" (principal) e LinkedIn (secundário).
- **Tecnologias:** diagrama em que os logotipos das tecnologias (Simple Icons, CC0) se ligam por linhas âmbar finas a
  um núcleo, agrupados pelos três níveis (Foco principal, Em aprofundamento, Fundamentos), com os nomes em texto.
- **Projetos:** zigue-zague; mídia de um lado, cartão grafite translúcido com borda âmbar sobreposto do outro,
  alternando a cada projeto.
- **Experiência (Timeline) e demais seções:** mesmos tokens, cartões e tipografia; sem layout novo nesta fase.

## Movimento

- Digitação do terminal (uma vez, ao carregar).
- Seções surgindo ao entrar na tela (opacidade e 8px de deslocamento, 300 ms).
- Linhas do diagrama de tecnologias acendendo em sequência, uma vez.
- Com `prefers-reduced-motion: reduce`: tudo aparece pronto, sem animação.

## O que o revisor de front confere nas capturas

- Nenhum resquício de violeta ou do visual antigo.
- Contraste e legibilidade em 390, 768 e 1440 px; nada cortado ou sobreposto em 390 px.
- Hierarquia: o topo e a seção de projetos chamam mais atenção que o resto.
- Aparência profissional: nada de efeito chamativo, brilho exagerado ou texto informal.
