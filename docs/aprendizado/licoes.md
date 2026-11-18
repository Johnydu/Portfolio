# Lições aplicadas

Lições que o Analista aplicou aos agentes e às checklists deste projeto, a partir de padrões repetidos nas runs do
time. Cada lição é conferida nas runs seguintes; se o padrão voltar, ela é marcada como "não resolveu" e revista.

## 2026-11-18

Nenhuma lição foi aplicada nesta execução. As duas abaixo foram escritas, mas a ferramenta negou a gravação em
`.time/aprendizado/proposta/.claude/`, tratando o caminho como arquivo sensível. O texto exato está em
`docs/aprendizado/2026-11-18-propostas.md`. Quando for copiado para `.claude/agents/`, troque a situação para
"aplicada" com a data da cópia.

### Tester confere os testes de aceitação antigos e o nome acessível real

- **Lição:** o Tester procura nos arquivos de aceitação existentes asserções que a spec nova contradiz e as atualiza
  na mesma entrega. Usa regex ancorada para nomes acessíveis montados por componentes existentes (o `Button` externo
  acrescenta ` (abre em nova aba)`). Confere classes de CSS Modules por "contém". Não escreve teste que exija apagar
  arquivo.
- **Runs:** `20261114-1306-2-topo-2`, `20261114-1618-5-acabamento`.
- **Arquivos:** `.claude/agents/tester.md`.
- **Situação:** pendente (gravação no espelho negada).

### Desenvolvedor abre as capturas antes de corrigir achado visual

- **Lição:** quando uma correção pedida ou um critério cita captura de tela, o Desenvolvedor abre os PNGs de
  `.time/telas/` antes de mexer no CSS e diz em `## Decisões` o que viu. Se o mesmo achado voltar, ele troca de
  abordagem em vez de repetir a anterior.
- **Runs:** `20261114-1359-2-topo`, `20261114-1633-5-acabamento`.
- **Arquivos:** `.claude/agents/desenvolvedor.md`.
- **Situação:** pendente (gravação no espelho negada).
