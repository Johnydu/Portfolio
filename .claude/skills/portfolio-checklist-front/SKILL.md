---
name: portfolio-checklist-front
description: Checklist de front-end e design system do Portfolio, usado na revisão de componentes React, CSS Modules, tokens e capturas de tela de um diff. Usada pelos agentes do time de agentes.
---

# Checklist de front-end do Portfolio

Responda a cada item com sim ou não olhando o diff do ciclo e as capturas de tela. Quando a resposta indicar violação,
registre um achado com `caminho:linha` no formato da skill `portfolio-formato-relatorio`. Considere apenas os
arquivos alterados e o que eles mudam na tela; não varra o legado fora do diff.

## Severidades

- `ALTA`: violação da CSP (atributo `style`, `<style>` ou `<script>` inline, `eval`, data URI, recurso de outro
  domínio), `dangerouslySetInnerHTML`, conteúdo inventado, texto ilegível ou cortado nas capturas, página que muda o
  visual sem nenhuma captura avaliada.
- `MEDIA`: valor literal no lugar de token, estilo fora de CSS Module, animação sem versão reduzida, contraste abaixo
  de AA, link externo sem `rel="noopener noreferrer"`, problema de hierarquia ou de sobreposição nas capturas, e demais
  regras de estrutura e acessibilidade.
- `BAIXA`: texto da interface fora do padrão e pequenos desalinhamentos.

Havendo achado `ALTA`, o veredito é `REPROVADO`.

## Stack e dependências

1. O diff acrescenta dependência ao `package.json`? Confira se a spec cita o pacote pelo nome. Pacote não citado é
   `ALTA` (o orquestrador também reprova o ciclo).
2. O código novo é TypeScript com `strict`, sem `any`, `@ts-ignore` nem `as unknown as`? Achado é `MEDIA`.
3. Os componentes são pequenos, com uma responsabilidade e props tipadas, e reaproveitam os componentes de interface
   que já existem (botão, etiqueta, cartão, título de seção) em vez de recriá-los à mão? Recriar componente existente é
   `MEDIA`.
4. O conteúdo (textos, projetos, tecnologias) fica na pasta de dados do projeto, separado da interface? Texto de
   conteúdo escrito direto no componente é `MEDIA`.

## CSP e XSS

5. Há atributo `style` em JSX ou no `index.html`? Procure `style=` nos arquivos alterados. A CSP `default-src 'self'`
   bloqueia o estilo inline; use classe de CSS Module. Achado é `ALTA`.
6. Há `<style>` ou `<script>` inline, `eval`, `new Function` ou manipulador de evento em atributo HTML? Procure em
   `index.html` e nos componentes. Achado é `ALTA`.
7. Há imagem, fonte ou SVG em data URI (`data:`), inclusive em CSS? Achado é `ALTA`.
8. Há recurso de outro domínio (`<link>`, `<script>`, `<img>`, `@import`, `url(` com `http`)? Fontes vêm do próprio
   site (pacotes `@fontsource`), nunca de CDN. Achado é `ALTA`.
9. Há `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML` ou `insertAdjacentHTML`? Achado é `ALTA`.

## CSS Modules e tokens

10. O estilo novo está em `*.module.css` ao lado do componente, e o CSS global só traz o que é realmente global? Estilo
    de componente no CSS global é `MEDIA`.
11. Cores, espaçamentos, raios, sombras, durações e tipografia vêm dos tokens do projeto (`var(--...)`)? Procure `#`,
    `rgb(`, `rgba(`, `hsl(` e medidas em `px` fora do arquivo de tokens. Valor literal é `MEDIA`; falta de token se
    resolve criando-o no arquivo de tokens.
12. O diff muda o valor de um token existente? Confira o efeito em todas as seções que o usam. Mudança que quebra outra
    seção é `MEDIA`.
13. Há `!important` ou seletor que depende de estrutura frágil (`div > div > span`)? Achado é `MEDIA`.

## Acessibilidade

14. O contraste do texto é de ao menos 4.5:1 (3:1 para texto a partir de 24 px ou 18,66 px em negrito, bordas de
    controle, ícones e foco)? Confira as combinações de token de texto com token de fundo, inclusive texto sobre
    brilho, gradiente ou imagem. Achado é `MEDIA`; texto ilegível nas capturas é `ALTA`.
15. Há um único `h1` e os títulos seguem a ordem (`h2` dentro da página, `h3` dentro da seção)? Achado é `MEDIA`.
16. A navegação por teclado funciona e o foco é visível? Procure `outline: none` e `outline: 0` sem substituto. Achado
    é `MEDIA`.
17. Imagem tem `alt` que descreve o conteúdo, e imagem decorativa tem `alt=""`? Ícone decorativo tem
    `aria-hidden="true"` e botão só com ícone tem `aria-label`? Achado é `MEDIA`.
18. Toda animação, transição e efeito de rolagem tem a versão sem movimento em
    `@media (prefers-reduced-motion: reduce)`, e o conteúdo fica completo e legível sem a animação (texto que se digita
    aparece inteiro, elemento que entra com fade aparece visível)? Achado é `MEDIA`; conteúdo que some com movimento
    reduzido é `ALTA`.
19. Animação que pisca ou muda rápido demais (mais de três vezes por segundo)? Achado é `ALTA`.

## Links e conteúdo

20. Todo link externo é `https`, com `target="_blank"` e `rel="noopener noreferrer"`? Achado é `MEDIA`.
21. Algum texto, número, empresa, experiência, depoimento, projeto ou link foi inventado? Compare com a spec e com os
    dados que o projeto já tinha. Conteúdo que não vem de nenhum dos dois, inclusive texto de exemplo, é `ALTA`.

22. O diff acrescenta e-mail (`mailto:`, endereço escrito no texto) ou formulário de contato? O contato do projeto é
    somente LinkedIn (principal), GitHub e Instagram. Achado é `ALTA`.
23. As habilidades aparecem por nível qualitativo (Foco principal, Em aprofundamento, Fundamentos)? Barra de
    progresso, porcentagem, estrelas ou nota numérica são `MEDIA`.
24. O HTML é semântico (`header`, `nav`, `main`, `section`, `footer`, `ul`, `button` e `a` no papel certo, sem `div`
    clicável) e a única animação é um fade-in sutil? Outro tipo de animação (deslize, escala, rotação, parallax) é
    `MEDIA`.

## Capturas de tela

Abra cada imagem listada no prompt, nas três larguras, com e sem movimento reduzido. O achado aponta o arquivo e a
linha do código que causa o problema e diz em qual captura ele aparece.

25. Alguma captura está faltando, não abre ou o prompt não traz a seção `## Capturas de tela` numa tarefa que muda o
    visual? Ninguém viu a página. Achado é `ALTA`.
26. O texto tem contraste suficiente sobre o fundo real da captura (brilhos, gradientes, imagens, vidro)? Texto que se
    perde no fundo é `ALTA`; contraste fraco mas legível é `MEDIA`.
27. Há sobreposição indevida: texto sobre texto, elemento cobrindo botão ou link, cartão invadindo outra seção? Achado
    é `MEDIA`; se esconde conteúdo ou ação, `ALTA`.
28. Em 390 px, algo é cortado, sai da tela ou cria rolagem horizontal (título partido no meio da palavra, imagem
    estourando a largura, botão fora da tela)? Achado é `ALTA`.
29. A hierarquia está clara em cada largura: o título principal domina, as seções se distinguem, a ação principal é
    evidente? Hierarquia confusa é `MEDIA`.
30. Espaçamento e alinhamento são consistentes entre seções e larguras (margens laterais, ritmo vertical, grade)?
    Achado é `BAIXA`; quebra evidente de layout é `MEDIA`.
31. A captura com movimento reduzido mostra todo o conteúdo, sem elemento invisível ou pela metade? Achado é `ALTA`.
32. O resultado segue a direção visual indicada no prompt (paleta, tipografia, composição e elementos pedidos) nas
    partes que a spec da tarefa cobre? Divergência é `MEDIA`; quando contraria a direção na parte principal da tarefa,
    `ALTA`.

## Texto da interface

33. O texto está em português do Brasil, com acentuação correta e sem emoji? Achado é `BAIXA`.
34. Botões e links de ação têm verbo claro, só com a primeira letra maiúscula, e a caixa alta, quando houver, vem do CSS
    (`text-transform`), não do texto? Achado é `BAIXA`.
