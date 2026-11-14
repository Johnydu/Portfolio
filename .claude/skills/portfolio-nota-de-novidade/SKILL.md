---
name: portfolio-nota-de-novidade
description: Regras para escrever a nota de novidade de uma entrega do site, voltada a quem visita e à divulgação, usada ao documentar uma entrega. Usada pelos agentes do time de agentes.
---

# Nota de novidade

A nota de novidade é para quem visita o site e para a divulgação. Fica em `docs/novidades/AAAA-MM-DD-<slug>.md` e vai
no PR. Não confunda com o relatório técnico, que é para o desenvolvimento e fica fora do git.

## Estrutura

Use exatamente estes títulos, nesta ordem:

```
# <título>

## O que há de novo

## Para quem

## Como ver

## Benefício
```

- `# <título>`: curto, em linguagem de quem visita, sem nome técnico.
- `## O que há de novo`: o que passou a existir ou a aparecer diferente no site, em uma ou duas frases.
- `## Para quem`: quem aproveita a novidade, em linguagem comum (por exemplo, recrutadores, empresas que procuram um
  desenvolvedor, quem acessa pelo celular).
- `## Como ver`: passos numerados, descritos pelo que a pessoa vê na página (seções, botões, links), usando os mesmos
  rótulos que aparecem no site.
- `## Benefício`: o ganho para quem visita, em uma ou duas frases.

## Estilo

- Até 200 palavras no total.
- Português do Brasil, com acentuação correta, frases completas, sem emoji e sem jargão técnico.
- Fale com quem visita, no tom de quem apresenta o próprio trabalho.

## Proibido

- Nomes de componentes, arquivos, pastas, tokens, bibliotecas e ferramentas de build.
- Endereços internos e trechos de código.
- Detalhes de segurança e vulnerabilidades.
- Informação que não está no site: nada de experiência, número, empresa ou depoimento inventado.

## Quando toca segurança

Se a spec traz `toca-seguranca: sim`, a nota diz apenas que houve melhorias de segurança, em uma frase, sem descrever
o que era a falha nem como foi corrigida. A razão é não expor uma falha antes de a correção estar em produção. As
demais seções continuam valendo para a parte visível a quem visita, se houver.
