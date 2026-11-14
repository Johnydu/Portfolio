---
name: portfolio-checklist-seguranca
description: Checklist de segurança do Portfolio e guia de leitura dos relatórios Semgrep, Gitleaks e npm audit, usado na revisão de segurança de um diff. Usada pelos agentes do time de agentes.
---

# Checklist de segurança do Portfolio

Responda a cada item com sim ou não olhando o diff do ciclo. Quando a resposta indicar violação, registre um achado
com `caminho:linha` no formato da skill `portfolio-formato-relatorio`. Itens que não se aplicam ao diff não geram
achado.

O Portfolio é um site estático, sem back-end: não há sessão, banco nem API própria. Os riscos são XSS, afrouxamento da
CSP, recurso de terceiros, segredo publicado no bundle ou no histórico, link externo inseguro e dependência
vulnerável.

## Severidades

- `CRITICA`: segredo exposto no código, no bundle ou no histórico.
- `ALTA`: XSS, CSP afrouxada, recurso de outro domínio, dependência nova não pedida pela spec, vulnerabilidade `high`
  ou `critical` do `npm audit` em dependência alterada pelo diff.
- `MEDIA`: link externo sem `rel="noopener noreferrer"`, dado pessoal exposto sem necessidade, vulnerabilidade
  `moderate`.
- `BAIXA`: boas práticas.

Havendo achado `CRITICA` ou `ALTA`, o veredito é `REPROVADO`.

## Segurança

1. Há `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML` ou `document.write`? Procure nos
   arquivos alterados. Com qualquer dado que não seja constante do código, é `ALTA`.
2. Há `eval`, `new Function`, `setTimeout` ou `setInterval` com string? Achado é `ALTA` (a CSP também bloqueia).
3. Algum `href` ou `src` é montado com valor que pode vir de fora (parâmetro da URL, `location`, `localStorage`)?
   Procure `javascript:` e URLs montadas por concatenação. Achado é `ALTA`.
4. A CSP continua `default-src 'self'`, sem afrouxar? Procure no `index.html`, na configuração do Vite e nos plugins
   que injetam a meta de segurança: `unsafe-inline`, `unsafe-eval`, `data:`, `blob:`, `*` e domínios novos. Afrouxar é
   `ALTA`.
5. Há `<style>` ou `<script>` inline, atributo `style`, manipulador de evento em atributo HTML ou recurso de outro
   domínio (`<script src="https://...">`, `<link href="https://...">`, `@import url(https://...)`, fonte de CDN)?
   Achado é `ALTA`: a CSP bloqueia e o recurso falha em produção.
6. Todo link externo é `https`, com `target="_blank"` e `rel="noopener noreferrer"`? `http://` ou `rel` ausente é
   `MEDIA`.
7. Nenhuma credencial no código? Procure chave, token, senha e URL com usuário e senha em `*.ts`, `*.tsx`, `*.js`,
   `*.json`, `*.env*`, `*.yml` e `index.html`. Tudo o que está em `import.meta.env.VITE_*` vai para o bundle público:
   segredo em variável `VITE_` é `CRITICA`.
8. O diff acrescenta dependência ao `package.json` (em `dependencies` ou `devDependencies`)? Confira se a spec cita o
   pacote. Dependência não pedida é `ALTA`. Dependência pedida também é avaliada: pacote sem manutenção, com nome
   parecido com outro conhecido (typosquatting) ou com script de instalação suspeito é `ALTA`.
9. O diff altera `.github/` (workflows de deploy)? Confira permissões (`permissions:`), ações de terceiros sem versão
   fixa e segredos expostos em log. Permissão ampliada sem motivo na spec é `ALTA`.
10. O site expõe dado pessoal além do que a spec pede (e-mail, telefone, endereço)? Achado é `MEDIA`, ou o que as
    regras do projeto disserem.
11. O diff acrescenta e-mail (`mailto:`, endereço escrito no texto) ou formulário de contato? O contato do projeto é
    somente LinkedIn (principal), GitHub e Instagram, e não há back-end para receber formulário. Achado é `MEDIA`.

## Relatórios das ferramentas

As saídas das ferramentas ficam na pasta `ferramentas/` do ciclo (o prompt informa o caminho exato). Leia os arquivos
existentes e cruze com o diff.

- `semgrep.json`: leia `results[]`. Em cada item, `check_id` (regra), `path`, `start.line`, `extra.message` e
  `extra.severity`. Severidade `ERROR` costuma indicar `ALTA`; `WARNING`, `MEDIA`; `INFO`, `BAIXA`. Ajuste conforme o
  contexto. As regras usadas são as de TypeScript, React e segredos.
- `gitleaks.json`: é um array de objetos. Leia `RuleID`, `File`, `StartLine` e `Commit`. Se o array está vazio (ou o
  conteúdo é `null`), nenhum segredo foi encontrado. Um achado do gitleaks em qualquer commit da faixa analisada é
  `CRITICA`, mesmo que um commit posterior tenha removido o segredo do código: o histórico da branch vai inteiro no
  push. Aponte o `File:StartLine` do achado em `caminho:linha`. Nunca copie o valor do segredo para o relatório (o
  orquestrador roda o gitleaks com `--redact`).
- `npm-audit.json`: saída de `npm audit --audit-level=high --json`. Leia `vulnerabilities`: cada chave é um pacote,
  com `severity` (`critical`, `high`, `moderate`, `low`), `isDirect`, `via` (os avisos, com `title` e `url`) e
  `fixAvailable`. Mapeie `critical` e `high` para `ALTA`, `moderate` para `MEDIA` e `low` para `BAIXA`. O
  `caminho:linha` é a linha do `package.json` que declara o pacote (ou a dependência direta que o traz). Vulnerabilidade
  que já existia antes do diff vai para `## Observações`, não para os achados; a que o diff introduz é achado.
- Se existir um arquivo `<ferramenta>-erro.txt` (por exemplo `semgrep-erro.txt` ou `npm-audit-erro.txt`), aquela
  ferramenta falhou. Registre um achado `ALTA` com a descrição "A ferramenta <nome> não executou", apontando o arquivo
  `-erro.txt` e a linha 1 em `caminho:linha`, e não conclua nada a partir de um relatório ausente.
- Se o relatório de uma ferramenta que devia rodar não existe e também não há `<ferramenta>-erro.txt`, registre isso em
  `## Observações` (qual ferramenta e qual arquivo faltou) e não conclua nada a partir dele. O Semgrep só roda quando o
  diff tem arquivos existentes, e o `npm audit` só quando o diff altera o `package.json` ou o `package-lock.json`.
- Achado do Semgrep só entra no relatório depois de confirmado no código, e precisa trazer `caminho:linha` como
  qualquer outro. Falso positivo não vira achado; explique-o em `## Observações`. Achados do gitleaks e do `npm audit`
  seguem as regras acima.
