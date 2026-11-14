---
name: portfolio-formato-relatorio
description: Define o formato exato dos relatórios de revisão e de verificação que o orquestrador lê, usado ao encerrar qualquer revisão ou verificação de critérios. Usada pelos agentes do time de agentes.
---

# Formato dos relatórios

O orquestrador lê a sua resposta por programa. Qualquer desvio de formato faz a resposta ser rejeitada. Siga os
modelos abaixo sem alterar os tokens em maiúsculas.

## Regras gerais

- A resposta final contém só o relatório. Nenhum texto antes dele e nenhum texto depois da seção final.
- Nunca envolva o relatório em bloco de código (sem crases triplas).
- A primeira linha é exatamente `VEREDITO: APROVADO` ou `VEREDITO: REPROVADO`.
- Os tokens de severidade e de status não levam acento: `CRITICA`, `ALTA`, `MEDIA`, `BAIXA`, `ATENDE`, `NAO_ATENDE`.
- Os cabeçalhos são exatamente `## Achados`, `## Observações` e `## Critérios`.
- O restante do texto é em português do Brasil, com acentuação correta, frases completas e sem emoji.

## Relatório de revisão (Segurança e Front)

Modelo:

```
VEREDITO: APROVADO | REPROVADO

## Achados
- [CRITICA|ALTA|MEDIA|BAIXA] caminho/Componente.tsx:linha: descrição e correção sugerida

## Observações
texto livre
```

Regras:

- Uma linha por achado, no formato `- [SEVERIDADE] caminho/Arquivo.ext:linha: descrição e correção sugerida`.
- Todo achado traz `caminho:linha`, com o caminho relativo à raiz do repositório e o número da linha. Achado sem
  `caminho:linha` é inválido. Se o problema é a ausência de algo, aponte o arquivo e a linha onde deveria estar.
- Use `APROVADO` somente quando não houver nenhum achado `CRITICA` ou `ALTA`. Havendo ao menos um, use `REPROVADO`.
  Achados `MEDIA` e `BAIXA` não impedem a aprovação, mas continuam listados.
- Sem achados: mantenha o cabeçalho `## Achados` com nada embaixo dele (nem "nenhum", nem traço).
- `## Observações` é texto livre e sempre presente. Se não houver o que observar, escreva uma frase curta, por
  exemplo "Nada a observar."

## Relatório de verificação (Gerente)

Modelo:

```
VEREDITO: APROVADO | REPROVADO

## Critérios
- CA-1: ATENDE: justificativa
- CA-2: NAO_ATENDE: o que falta
  tarefa: T2
```

Regras:

- Uma linha por critério de aceite da spec, na ordem da spec, no formato `- CA-<n>: ATENDE: justificativa` ou
  `- CA-<n>: NAO_ATENDE: o que falta`.
- Nenhum critério da spec pode ficar de fora.
- Abaixo de cada linha `NAO_ATENDE`, acrescente uma linha com dois espaços de recuo: `  tarefa: T<n>`, indicando a
  tarefa do plano que deve corrigir a falta. Exemplo: `  tarefa: T2`.
- Use `APROVADO` somente quando todos os critérios forem `ATENDE`. Existindo qualquer `NAO_ATENDE`, use `REPROVADO`.
- A justificativa de `ATENDE` aponta a evidência (teste, arquivo e linha). A de `NAO_ATENDE` diz objetivamente o que
  falta.
