# Propostas do Analista — 2026-11-18

Base: as 8 runs de `.time/aprendizado/registro.jsonl`, todas de 2026-11-14, e os artefatos de `.time/aprendizado/runs/`.
Não havia `docs/aprendizado/licoes.md`, então nenhuma lição anterior foi reavaliada.

Resumo das runs: 4 `PR_ABERTO`, 3 `ESCALADA` e 1 `FALHA_ETAPA`. As três escaladas (`20261114-1306-2-topo-2`,
`20261114-1618-5-acabamento` e `20261114-1633-5-acabamento`) usaram os 3 ciclos.

Padrões descartados por aparecerem numa run só: o mapa de testes considerado ilegível (`20261114-1013-1-base-visual`)
e o erro de tipo TS2677 que só o build do orquestrador pegou (`20261114-1515-3-tecnologias`).

> **Atenção:** as propostas 1 e 2 não foram gravadas no espelho. A ferramenta negou a escrita em
> `.time/aprendizado/proposta/.claude/agents/tester.md` e em `.../desenvolvedor.md`, tratando os dois como "sensitive
> file", provavelmente porque o caminho contém `.claude/`. Por isso nada foi copiado para `.claude/`. O texto exato
> de cada mudança está abaixo, para aplicar à mão ou numa nova execução depois de corrigir a permissão (proposta 4).

## Aplicado neste projeto

### 1. Tester: testes de aceitação em conflito com a base existente

**Padrão:** os testes novos do Tester, ou testes antigos de aceitação que a spec nova contradiz, entram em conflito
com o que o projeto já tem. O Desenvolvedor, que não pode mexer em `src/test/aceitacao/`, contesta. Cada contestação
custa um ciclo, e as duas runs terminaram escaladas.

**Runs:**

- `20261114-1306-2-topo-2`: o teste buscava o link com `name: 'LinkedIn'` exato, mas o `Button` externo acrescenta
  ` (abre em nova aba)`. O teste antigo `BaseVisual.aceitacao#mostraOConteudoDeImediatoComMovimentoReduzido` exigia o
  token literal `visible`, e o CSS Modules gera essa classe com hash. A contestação foi aceita no ciclo 2.
- `20261114-1618-5-acabamento`: o arquivo antigo `Topo.aceitacao.test.tsx` esperava a frase antiga. O teste do CA-10
  exigia que esse arquivo deixasse de existir, mas nenhum agente pode apagar arquivos. Houve duas rodadas de correção,
  a falha continuou e a run escalou.

**Mudança** (`.claude/agents/tester.md`, só o corpo, +11 linhas):

1. Depois do item "Procure os elementos por papel e nome acessível…", acrescentar:
   > - Nome acessível que um componente existente monta não é o texto visível: o `Button` com `external` acrescenta
   >   ` (abre em nova aba)`. Para esses, use regex ancorada no início (`/^LinkedIn\b/`), nunca o nome exato. Classe de
   >   CSS Modules tem hash: confira com "contém" (`visible`), nunca com o token literal.
2. Reescrever o fim do item "Não crie código de produção…": trocar "A única exceção é confirmar que um arquivo ou
   trecho que um teste afirma existe (listar e buscar no repositório é permitido para isso)." por:
   > As exceções são confirmar que um arquivo ou trecho que um teste afirma existe (listar e buscar no repositório é
   > permitido para isso) e ler um componente que já existe para saber o papel e o nome acessível que ele produz.
3. Antes do item "Quando o prompt indicar uma rodada de verificação…", acrescentar:
   > - Nenhum agente apaga arquivo. Não escreva teste que exija que um arquivo deixe de existir; quando a spec mandar
   >   consolidar ou remover um arquivo de aceitação, reescreva o arquivo antigo para a spec nova.
4. No fim de `## Execução dos testes`, acrescentar o parágrafo:
   > Depois, leia os outros arquivos de `src/test/aceitacao/` atrás de asserções que a spec nova contradiz (frase,
   > classe, composição ou nome antigo). Atualize cada uma no próprio arquivo, na mesma entrega: o Desenvolvedor não
   > pode mexer nessa pasta, e um teste antigo em conflito vira contestação e custa um ciclo.

### 2. Desenvolvedor corrige achado visual sem abrir as capturas

**Padrão:** o revisor de front reprova com ALTA um defeito que aparece nas capturas de 768 ou 1440 px. O Desenvolvedor
corrige o CSS deduzindo a geometria sem abrir as imagens, e o defeito volta. As capturas do ciclo anterior estão em
`.time/telas/`, e o agente tem `Read` sem restrição (só `Edit(.time/**)` é negado).

**Runs:**

- `20261114-1633-5-acabamento`: o título da landing-page ficou cortado nos 3 ciclos e a run escalou. No ciclo 2 o
  Desenvolvedor escreveu "Não conferi isso numa captura de tela" e alinhou a imagem para o lado errado. O revisor
  apontou que a regra mantinha o conteúdo sob o cartão. No ciclo 3 ele tentou outra regra, ainda sem olhar a
  captura ("Não conferi as capturas de tela"), e o achado voltou.
- `20261114-1359-2-topo`: no ciclo 1 o quadro da foto ficou escondido a partir de 64rem. O revisor reprovou com ALTA
  na captura de 1440 px. O Desenvolvedor tinha deixado o CA visual inteiro para o revisor ("fica para o revisor de
  front, nas capturas").

**Mudança** (`.claude/agents/desenvolvedor.md`, só o corpo, +7 linhas): depois do item "O build de produção…", acrescentar:

> - As capturas do ciclo anterior ficam em `.time/telas/` (`inicio-390.png`, `inicio-768.png`, `inicio-1440.png` e as
>   versões `-reduzido`). Quando uma correção pedida ou um critério citar captura, largura ou corte, abra as imagens
>   citadas com a ferramenta Read antes de mexer no CSS. Descubra nelas onde está o conteúdo e o que o cobre, e diga
>   em `## Decisões` o que viu. Corrigir layout sem olhar a captura é adivinhar.
> - Se um achado visual voltar no ciclo seguinte, a abordagem anterior falhou: troque de abordagem (outra das opções
>   do revisor, ou uma que não dependa do recorte da imagem) em vez de ajustar a mesma regra.

## Para os modelos do time

As propostas 1 e 2 valem para qualquer projeto web do `time-de-agentes`. A parte geral pode ir à mão para os modelos
do Tester e do Desenvolvedor:

- **Tester:** ler os testes de aceitação antigos e atualizar os que a spec nova contradiz; não exigir que um arquivo
  deixe de existir; confirmar o nome acessível real dos componentes existentes. Os exemplos do `Button` e do CSS
  Modules são deste projeto.
- **Desenvolvedor:** abrir as capturas da pasta de telas antes de corrigir um achado visual e trocar de abordagem
  quando o mesmo achado voltar.

Runs: as mesmas das propostas 1 e 2.

## Para o orquestrador

### 3. Ciclos gastos com bloqueios que nenhum agente consegue resolver

**Padrão:** a run para numa ação fora das permissões de todos os agentes. O Desenvolvedor gasta o resto dos ciclos
sem alterar nenhum arquivo, só explicando o bloqueio, até a run escalar.

**Runs:**

- `20261114-1306-2-topo-2`: o Chromium do Playwright não estava instalado e as capturas falharam. O ciclo 3 terminou
  sem alteração ("a falha das capturas é de ambiente"), e o Desenvolvedor tem `npx playwright *` negado.
- `20261114-1618-5-acabamento`: a spec mandava remover `Topo.aceitacao.test.tsx`, e nem o Tester nem o Desenvolvedor
  podem apagar arquivos. Os ciclos 2 e 3 terminaram sem alteração, e o mesmo pedido foi repetido ao orquestrador em
  `tester-correcao-1.md`, `tester-correcao-2.md` e `ciclo-3/dev.md`.

**Rascunho de spec:**

- Antes do primeiro ciclo com `toca-tela: sim`, conferir se o navegador do Playwright está instalado e falhar a etapa
  na hora, com motivo claro, em vez de deixar a falha cair nas capturas do ciclo.
- Quando o Desenvolvedor responder sem nenhum arquivo alterado e o build falhar pelo mesmo motivo do ciclo anterior,
  escalar já, com o pedido dele no motivo, sem gastar os ciclos que faltam.
- Dar um caminho para remover arquivos de aceitação: o Tester declara na resposta uma linha `REMOVER: <arquivo>`, e o
  orquestrador faz `git rm` antes de rodar os testes. A outra opção é o Crítico de spec reprovar critério que exija
  apagar arquivo.

### 4. Gravação do espelho `.time/aprendizado/proposta/.claude/` negada

**Padrão:** observado nesta execução do Analista, ainda não em runs. A ferramenta Write negou a gravação nos dois
caminhos do espelho como "sensitive file". O fluxo do comando `aprender` depende dessa pasta, então nenhuma proposta
de agente ou skill consegue chegar ao PR.

**Rascunho de spec:** liberar explicitamente, nas permissões do Analista, a escrita em
`.time/aprendizado/proposta/.claude/**`, ou mudar o espelho para um caminho sem `.claude/` (por exemplo
`.time/aprendizado/proposta/agents/` e `.time/aprendizado/proposta/skills/`), com o orquestrador fazendo o mapeamento
na cópia. Esta proposta não conta para o limite de padrões repetidos, porque é um bloqueio do próprio comando.
