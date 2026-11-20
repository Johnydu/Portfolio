# Propostas de aprendizado — 2026-11-19

Análise das 8 runs de `.time/aprendizado/registro.jsonl` (todas de 2026-11-14). Não havia `licoes.md`, então
nenhuma lição anterior foi comparada. Ficaram de fora problemas que apareceram em uma run só: o mapa de testes
ilegível (`20261114-1013-1-base-visual`) e o erro de tipo do `tsc` que o Vitest não pega
(`20261114-1515-3-tecnologias`).

## Aplicado neste projeto

### 1. Testes de aceitação de specs anteriores que a spec nova invalida

- **Padrão:** a spec nova muda um comportamento que um teste de aceitação antigo ainda afirma. O Tester não atualiza
  esse teste, o Desenvolvedor não pode editá-lo, e o ciclo vai embora em contestação e correção. Nas duas runs a
  tarefa terminou escalada.
- **Runs:**
  - `20261114-1306-2-topo-2`: o teste de `BaseVisual.aceitacao` (spec 1) exigia a classe literal `visible`, o que
    contradiz o CA-13 da spec 2. Além disso, o teste novo procurava o link pelo nome exato `LinkedIn`, mas o `Button`
    externo acrescenta " (abre em nova aba)". Houve 3 ciclos e a run escalou.
  - `20261114-1618-5-acabamento`: `Topo.aceitacao.test.tsx` ainda tinha a frase antiga, e um teste novo exigia que
    esse arquivo não existisse (`existsSync(...) === false`). Ninguém do time pode apagar arquivo. Foram 3 ciclos e
    2 correções do Tester, e a run escalou por falta de rodada de correção.
- **Mudança:** `.claude/agents/tester.md`, em "O que fazer", ganhou três regras:
  - buscar nos testes de aceitação existentes as asserções que a spec muda e atualizá-las na mesma rodada;
  - não escrever teste que dependa de apagar ou renomear arquivo, e atualizar o arquivo antigo no lugar;
  - usar regex de início para nomes acessíveis que o componente completa, como o aviso do `Button` externo.

### 2. Correção visual feita sem olhar a captura

- **Padrão:** o revisor de front reprova pelo que vê nas capturas de 768 ou 1440 px. O Desenvolvedor corrige o CSS
  sem abrir a imagem ("Não conferi as capturas de tela") e o mesmo defeito volta no ciclo seguinte.
- **Runs:**
  - `20261114-1359-2-topo`: no ciclo 1 foi reprovado o quadro da foto sumido em 1440 px (ALTA). O Desenvolvedor
    corrigiu escrevendo "as capturas de 1440 px precisam ser conferidas depois".
  - `20261114-1633-5-acabamento`: o título da captura da landing-page aparecia cortado em 768 e 1440 px. Foram 3
    reprovações seguidas pelo mesmo achado ALTA (`ProjectShowcase.module.css`). O Desenvolvedor trocou
    `object-position` e recuo por tentativa, sem abrir `inicio-1440.png`, e a run escalou no limite de ciclos.
- **Mudança:** `.claude/agents/desenvolvedor.md`, em "Como trabalhar", logo depois da regra das "Correções pedidas".
  Diante de um achado visual, ele abre com Read a captura citada em `.time/telas/`, calcula a correção a partir da
  imagem e diz em `## Decisões` qual captura conferiu.

## Para os modelos do time

- As duas mudanças acima valem para qualquer projeto com testes de aceitação e capturas de tela. Elas precisam ser
  levadas à mão para os modelos de `tester` e `desenvolvedor` do `time-de-agentes`, trocando os exemplos do
  Portfolio (`Button`, `inicio-1440.png`) pelos genéricos.
- No modelo do `critico-spec`: tratar como não cumprível um critério que exija apagar ou renomear arquivo, se nenhum
  agente tiver essa permissão. Isso vem da run `20261114-1618-5-acabamento` e é parte do padrão 3 abaixo.

## Para o orquestrador

### 3. Ciclos gastos num bloqueio que nenhum agente resolve

- **Padrão:** o ciclo falha por algo fora da permissão de todos os agentes. O Desenvolvedor responde "Nenhum arquivo
  foi alterado" e explica que o passo cabe ao orquestrador. Mesmo assim, o orquestrador continua rodando ciclos até
  o limite e só então escala.
- **Runs:**
  - `20261114-1306-2-topo-2`: o Chromium do Playwright não estava instalado e as capturas falharam. No ciclo 3 o
    Desenvolvedor não alterou nada, porque `npx playwright install` é negado, e a run escalou por "não alterou nenhum
    arquivo".
  - `20261114-1618-5-acabamento`: era preciso apagar `src/test/aceitacao/Topo.aceitacao.test.tsx`. Os ciclos 2 e 3
    do Desenvolvedor e as 2 correções do Tester não mudaram nada que importasse, e todos pediram `git rm` ao
    orquestrador.
- **Rascunho de spec:**
  1. Fazer uma pré-verificação do ambiente antes do primeiro ciclo: conferir que o navegador das capturas existe
     (`chrome-headless-shell` do Playwright) e, se faltar, instalar ou parar a run com estado `FALHA_AMBIENTE` e um
     motivo claro, sem gastar ciclos.
  2. Se o Desenvolvedor não alterar arquivo nenhum e o build falhar pela mesma causa do ciclo anterior, escalar
     na hora, com o texto das `## Decisões` dele no motivo. Hoje isso só acontece depois de mais ciclos.
  3. Dar ao Tester um jeito de remover um arquivo de aceitação. Uma opção é uma linha `REMOVER: <arquivo>` na
     resposta, que o orquestrador aplica só dentro de `src/test/aceitacao/`. A outra é o Crítico de spec recusar
     critérios que exijam apagar arquivo.
  4. No registro, gravar um campo `bloqueio` (`ambiente`, `permissao`) para o analista separar esses casos das
     falhas de código.

### Observação (uma run só, não é proposta)

Em `20261114-1633-5-acabamento`, o revisor de front disse que as capturas são "tiras muito longas e reduzidas" e que
isso limitou a leitura fina. Vale acompanhar. Se voltar a aparecer, a proposta é gerar também capturas por seção.
