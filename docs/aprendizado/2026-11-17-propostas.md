# Propostas do analista — 2026-11-17

Runs analisadas (todas de 2026-11-14): `20261114-1013-1-base-visual`, `20261114-1025-1-base-visual`,
`20261114-1306-2-topo-2`, `20261114-1359-2-topo`, `20261114-1515-3-tecnologias`, `20261114-1540-4-projetos`,
`20261114-1618-5-acabamento`, `20261114-1633-5-acabamento`.

Não existia `docs/aprendizado/licoes.md`, então não havia lição anterior para reavaliar. O crítico de spec
(`critico-spec.md`) foi criado depois dessas runs (nenhuma tem `vereditoCritico`). Por isso a parte do padrão 4 que
ele já cobre não gerou proposta.

Nota: esta execução tentou aplicar os padrões 1 e 2 em `.claude/agents/tester.md`, mas a permissão de escrita em
`.claude/` foi negada. Nenhum arquivo de `.claude/` mudou. As mudanças abaixo têm o texto pronto para alguém aplicar à
mão, ou para a próxima execução do analista, se ela tiver permissão.

## Aplicado neste projeto

Nenhuma. As mudanças estavam prontas, mas a permissão de escrita em `.claude/` foi negada.

São quatro padrões (quatro propostas). Os padrões 1 a 3 têm mudança pendente no projeto, e os padrões 2, 3 e 4 têm
parte no orquestrador.

### Padrão 1 (pendente): o Tester ignora testes de aceitação antigos e o comportamento dos componentes reaproveitados

- **Padrão:** os testes novos do Tester contradizem testes de aceitação de specs anteriores ou o que os componentes
  existentes renderizam. O Desenvolvedor contesta, a correção gasta ciclos e a run escala.
- **Runs:**
  - `20261114-1306-2-topo-2` (escalada): o teste buscou o link pelo nome exato `'LinkedIn'`, mas o `Button` com
    `external` acrescenta " (abre em nova aba)". Além disso, `BaseVisual.aceitacao` exigia a classe literal `visible`,
    e o CA-13 manda usar `styles.visible`, que gera um nome com hash.
  - `20261114-1618-5-acabamento` (escalada): o antigo `Topo.aceitacao.test.tsx` esperava a frase antiga. O teste novo
    do CA-10 exigia que esse arquivo fosse apagado, e nenhum agente pode apagar arquivos. Foram dois ciclos sem nenhuma
    alteração.
- **Mudança proposta** em `.claude/agents/tester.md`, seção "O que fazer". Ela substitui o item "Não crie código de
  produção…" (+5 linhas):

  ```
  - Não crie código de produção. Fora do modo de correção, também não o leia: leia apenas a spec, o plano, o
    `CLAUDE.md` e os testes existentes. Exceções: confirmar que um arquivo ou trecho que um teste afirma existe, e ler os
    componentes de `src/components/ui/` que a tarefa reaproveita, para saber o nome acessível que eles geram (o `Button`
    com `external` acrescenta " (abre em nova aba)"; use `/^LinkedIn\b/`, não `'LinkedIn'`). Classe de CSS Module tem
    hash: compare com o token contido (`toMatch(/visible/)`), nunca com o nome literal.
  - Antes de responder, rode `npm test` e procure nos outros `*.aceitacao.test.tsx` asserções que a spec desta tarefa
    muda (texto, classe, estrutura). Teste antigo que contradiz a spec nova você corrige no próprio arquivo, mantendo o
    que ele ainda cobre. Ninguém do time apaga arquivo: nunca escreva teste que exija a remoção de um.
  ```

### Padrão 2 (pendente): um critério que só as capturas verificam fica com um mapeamento falso no mapa de testes

- **Padrão:** um critério de layout (390, 768 ou 1440 px, sem corte nem rolagem) não tem teste próprio. O Tester o liga
  no mapa a um teste de outro critério "só para cumprir o formato", ou o deixa de fora e o orquestrador pede outra
  resposta. Além disso, um teste estático de CSS fixou um detalhe de implementação que atrapalhou a correção visual.
- **Runs:**
  - `20261114-1306-2-topo-2`: CA-10 ligado a `usaAFotoDoPerfilComMarcasDeCotaDecorativas`. O próprio Tester admite
    que fez isso "só para cumprir o formato do mapa".
  - `20261114-1618-5-acabamento`: CA-12 faltou no mapa da correção, e o orquestrador pediu uma nova resposta (log
    `006-tester-1`).
  - `20261114-1633-5-acabamento`: CA-12 ligado a `heroUsaOsTokensDeSublinhadoBordaEQuadro`, que é o teste do CA-6. O
    teste do CA-14 exigia `reverso` com `right`, e o Desenvolvedor manteve essa regra por causa dele (ciclo 2).
- **Mudança proposta** em `.claude/agents/tester.md`, logo depois do item sobre o jsdom (+4 linhas):

  ```
  - Critério que só as capturas verificam (corte, rolagem, layout em 390, 768 ou 1440 px): escreva um teste próprio para
    ele, com o nome do critério, que leia o CSS Module e confira a regra que o sustenta (por exemplo, sem `width` fixa em
    px). Nunca ligue o critério no mapa a um teste de outro critério só para cumprir o formato. Não fixe nesse teste um
    valor de `object-position` ou de recuo que a spec não define: isso trava a correção visual do Desenvolvedor.
  ```

  Com as duas mudanças, `tester.md` cresce 9 linhas, dentro do limite de 15.

### Padrão 3 (pendente): a correção visual é feita sem olhar as capturas

- **Padrão:** o revisor de front reprova por um defeito que só aparece nas capturas. O Desenvolvedor corrige o CSS sem
  abrir as imagens ("Não conferi isso numa captura de tela") e o defeito volta no ciclo seguinte.
- **Runs:**
  - `20261114-1359-2-topo`: no ciclo 1, `.frame { display: none }` em 1440 px.
  - `20261114-1633-5-acabamento`: o título da landing-page ficou cortado nos ciclos 1, 2 e 3, e a run escalou no
    limite de ciclos. Os `dev.md` dos ciclos 2 e 3 dizem que as capturas não foram vistas.
- **Mudança proposta** em `.claude/agents/desenvolvedor.md`, seção "Como trabalhar". Ela substitui o primeiro item
  (+4 linhas):

  ```
  - Se o prompt trouxer "Correções pedidas", trate cada item delas antes de qualquer outra coisa. Achado do revisor de
    front que cita uma captura (`inicio-<largura>.png`): abra com Read essa imagem do ciclo anterior, em
    `.time/tarefa-<n>/ciclo-<anterior>/telas/`, antes de mudar o CSS. Em `## Decisões`, explique com as medidas (largura
    da sobreposição, onde o conteúdo da imagem começa) por que a correção tira o defeito.
  ```

  Mudança complementar em `.claude/skills/portfolio-checklist-front/SKILL.md`, na abertura da seção "Capturas de
  tela" (+2 linhas): "Quando o mesmo defeito visual volta em outro ciclo, a correção sugerida traz a medida concreta
  (token ou valor) e o motivo de a correção anterior não ter bastado."

## Para os modelos do time

### Padrões 1 a 3: mesmas regras nos modelos de Tester, Desenvolvedor e checklist de front

- **Padrão e runs:** os mesmos dos padrões 1 (`20261114-1306-2-topo-2`, `20261114-1618-5-acabamento`), 2
  (`20261114-1306-2-topo-2`, `20261114-1618-5-acabamento`, `20261114-1633-5-acabamento`) e 3
  (`20261114-1359-2-topo`, `20261114-1633-5-acabamento`).
- **Mudança proposta:** levar aos modelos do `time-de-agentes` as partes que não dependem do Portfolio:
  - Tester: conferir os testes de aceitação antigos que a spec muda, ler os componentes reaproveitados para saber os
    nomes acessíveis, não exigir remoção de arquivo e nunca fazer um mapeamento falso de critério.
  - Desenvolvedor: abrir a captura citada antes de uma correção visual.
  - Checklist de front: dar a medida concreta quando um defeito volta.

## Para o orquestrador

### Padrão 4: bloqueio de ambiente ou de permissão gasta ciclos sem mudança de código

- **Padrão:** um ciclo termina sem nenhum arquivo alterado, porque falta algo que nenhum agente pode fazer. O
  orquestrador conta esse ciclo como tentativa e a run escala ou gasta um ciclo a mais.
- **Runs:**
  - `20261114-1306-2-topo-2`: o Chromium do Playwright não estava instalado (`ciclo-2/telas.log`). O ciclo 3 terminou
    sem alteração e a run escalou.
  - `20261114-1515-3-tecnologias`: a spec citava o `simple-icons`, mas ele não estava em `node_modules` no ciclo 1. As
    suítes falharam com `Failed to resolve import`, e foi preciso um segundo ciclo.
  - `20261114-1618-5-acabamento`: a remoção de `Topo.aceitacao.test.tsx` só o orquestrador poderia fazer, e a run usou
    dois ciclos sem alteração. A causa da spec hoje é coberta pelo crítico de spec, mas o tratamento do ciclo vazio
    continua igual.
- **Rascunho de spec:**
  - Pré-voo antes do Tester: conferir se o navegador do Playwright existe. Se não existir, encerrar a run com o motivo
    "ambiente: rode `npx playwright install chromium`", sem chamar nenhum agente.
  - Em `preparar-dependencias`, instalar as dependências novas que o `## Desenho técnico` da spec cita pelo nome, antes
    do primeiro ciclo do Desenvolvedor. O critério é o mesmo que hoje vale para aprovar a dependência.
  - Um ciclo em que o Desenvolvedor não altera nenhum arquivo e aponta uma ação fora das permissões não conta no
    limite de ciclos: a run escala na hora, com essa ação no motivo.

### Padrões 2 e 3 (parte do orquestrador): o critério visual não tem lugar no mapa, e o Desenvolvedor não recebe as capturas

- **Padrão:** os mesmos dos padrões 2 e 3. O formato do mapa obriga a ligar todo critério a um teste, inclusive o que
  só as capturas verificam. E o prompt de correção do Desenvolvedor traz o achado com o nome da captura, mas não o
  caminho dela.
- **Runs:** `20261114-1306-2-topo-2`, `20261114-1618-5-acabamento`, `20261114-1633-5-acabamento` (mapa);
  `20261114-1359-2-topo`, `20261114-1633-5-acabamento` (capturas).
- **Rascunho de spec:**
  - Aceitar no mapa do Tester a linha `- CA-<n>: capturas`. O orquestrador passa esses critérios ao revisor de front
    numa seção `## Critérios das capturas`, e o revisor responde cada um em `## Observações`. Um critério das capturas
    não atendido é achado `ALTA`.
  - No prompt de "Correções pedidas" do Desenvolvedor, listar os caminhos das capturas do ciclo reprovado, como já se
    faz para o revisor de front.
  - Gerar, além da página inteira, uma captura por seção (com a altura da tela). No ciclo 3 de
    `20261114-1633-5-acabamento`, o revisor diz que "as capturas são tiras muito longas e reduzidas", o que limita a
    leitura fina.
