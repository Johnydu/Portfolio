// Capturas de tela para o revisor de front, rodadas pelo orquestrador depois do build (telas.comando.*).
//
// Roda na raiz do projeto, com a pasta dist/ já gerada. Sobe o `vite preview` na porta 4173, espera o servidor
// responder, captura a página inicial inteira em 390, 768 e 1440 px de largura, com e sem movimento reduzido, e grava
// os PNGs em .time/telas/. O servidor sempre é derrubado no fim, mesmo em caso de erro ou interrupção.
//
// Sai com código 0 quando todas as capturas foram gravadas e com código 1, e uma mensagem clara, em qualquer falha.
//
// Os globais do Node vêm de imports explícitos para o arquivo passar pelo ESLint do projeto sem configuração extra.

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { get } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as esperar } from 'node:timers/promises'

const PORTA = 4173
const ENDERECO = `http://localhost:${PORTA}/`
const LARGURAS = [390, 768, 1440]
const ALTURA_JANELA = 900
const ESPERA_SERVIDOR_MS = 30_000
const INTERVALO_SONDAGEM_MS = 250
const ESPERA_ENCERRAR_MS = 5_000
const ESPERA_ANIMACOES_MS = 1_500
const LIMITE_SAIDA_SERVIDOR = 4_000
const PASTA_CAPTURAS = path.resolve('.time', 'telas')
const VITE = path.resolve('node_modules', 'vite', 'bin', 'vite.js')

// Rola a página até o fim, aos poucos, para disparar animações de entrada que dependem da rolagem, e volta ao topo.
const ROLAR_PAGINA = `(async () => {
  const passo = Math.max(200, Math.floor(window.innerHeight * 0.8))
  for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
    window.scrollTo(0, y)
    await new Promise((fim) => setTimeout(fim, 100))
  }
  window.scrollTo(0, 0)
  await document.fonts.ready
  return true
})()`

class FalhaCaptura extends Error {}

let servidor = null
let saidaServidor = ''
let navegador = null

function escrever(texto) {
  process.stdout.write(`${texto}\n`)
}

function guardarSaida(pedaco) {
  saidaServidor = (saidaServidor + pedaco.toString()).slice(-LIMITE_SAIDA_SERVIDOR)
}

function subirServidor() {
  if (!existsSync(path.resolve('dist'))) {
    throw new FalhaCaptura('A pasta dist/ não existe. Rode o build (npm run build) antes das capturas.')
  }
  if (!existsSync(VITE)) {
    throw new FalhaCaptura(`O Vite não foi encontrado em ${VITE}. Rode npm ci antes das capturas.`)
  }
  // Sem shell: o processo filho é o próprio Node, e encerrá-lo derruba o servidor também no Windows.
  servidor = spawn(process.execPath, [VITE, 'preview', '--port', String(PORTA), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    // Sem cores: a saída do servidor entra na mensagem de erro e no log do orquestrador.
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  })
  servidor.stdout.on('data', guardarSaida)
  servidor.stderr.on('data', guardarSaida)
  servidor.on('error', (erro) => guardarSaida(`\n${erro.message}\n`))
}

function servidorSaiu() {
  return servidor !== null && (servidor.exitCode !== null || servidor.signalCode !== null)
}

function responde() {
  return new Promise((resolver) => {
    const pedido = get(ENDERECO, (resposta) => {
      resposta.resume()
      resolver(resposta.statusCode !== undefined && resposta.statusCode < 500)
    })
    pedido.setTimeout(2_000, () => pedido.destroy())
    pedido.on('error', () => resolver(false))
  })
}

async function esperarServidor() {
  const limite = Date.now() + ESPERA_SERVIDOR_MS
  while (Date.now() < limite) {
    if (servidorSaiu()) {
      throw new FalhaCaptura(
        `O vite preview terminou antes de responder (código ${servidor.exitCode ?? servidor.signalCode}). ` +
          `A porta ${PORTA} pode estar em uso. Saída do servidor:\n${saidaServidor.trim()}`,
      )
    }
    if (await responde()) {
      return
    }
    await esperar(INTERVALO_SONDAGEM_MS)
  }
  throw new FalhaCaptura(
    `O vite preview não respondeu em ${ENDERECO} dentro de ${ESPERA_SERVIDOR_MS / 1000} segundos. ` +
      `Saída do servidor:\n${saidaServidor.trim()}`,
  )
}

async function carregarPlaywright() {
  try {
    const playwright = await import('playwright')
    return playwright.chromium ?? playwright.default.chromium
  } catch (erro) {
    throw new FalhaCaptura(
      'O pacote playwright não foi encontrado no projeto. Instale-o como dependência de desenvolvimento ' +
        `(npm install -D playwright) e rode npx playwright install chromium. Detalhe: ${primeiraLinha(erro)}`,
    )
  }
}

async function abrirNavegador(chromium) {
  try {
    return await chromium.launch()
  } catch (erro) {
    const texto = String(erro?.message ?? erro)
    if (texto.includes("Executable doesn't exist") || texto.includes('playwright install')) {
      throw new FalhaCaptura(
        'O navegador Chromium do Playwright não está instalado. Rode npx playwright install chromium. ' +
          `Detalhe: ${primeiraLinha(erro)}`,
      )
    }
    throw new FalhaCaptura(`Não foi possível abrir o Chromium do Playwright: ${primeiraLinha(erro)}`)
  }
}

async function capturar(largura, reduzido) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: ALTURA_JANELA },
    reducedMotion: reduzido ? 'reduce' : 'no-preference',
  })
  try {
    const pagina = await contexto.newPage()
    const resposta = await pagina.goto(ENDERECO, { waitUntil: 'networkidle' })
    if (resposta === null || !resposta.ok()) {
      throw new FalhaCaptura(
        `A página ${ENDERECO} respondeu com o código ${resposta?.status() ?? 'desconhecido'} na largura ${largura} px.`,
      )
    }
    await pagina.evaluate(ROLAR_PAGINA)
    if (!reduzido) {
      await pagina.waitForTimeout(ESPERA_ANIMACOES_MS)
    }
    const arquivo = path.join(PASTA_CAPTURAS, `inicio-${largura}${reduzido ? '-reduzido' : ''}.png`)
    await pagina.screenshot({ path: arquivo, fullPage: true })
    escrever(`Captura gravada: ${path.relative(process.cwd(), arquivo)}`)
  } finally {
    await contexto.close()
  }
}

async function encerrarServidor() {
  if (servidor === null || servidorSaiu()) {
    return
  }
  const saiu = new Promise((resolver) => servidor.once('exit', resolver))
  servidor.kill()
  await Promise.race([saiu, esperar(ESPERA_ENCERRAR_MS)])
  if (!servidorSaiu()) {
    servidor.kill('SIGKILL')
  }
}

async function fecharNavegador() {
  if (navegador !== null) {
    try {
      await navegador.close()
    } catch {
      // o navegador já pode ter caído; o que importa é não deixar o servidor no ar
    }
    navegador = null
  }
}

function primeiraLinha(erro) {
  return String(erro?.message ?? erro).split('\n')[0].trim()
}

function interromper(sinal) {
  process.stderr.write(`Capturas de tela interrompidas (${sinal}); o servidor foi derrubado.\n`)
  if (servidor !== null && !servidorSaiu()) {
    servidor.kill()
  }
  process.exit(1)
}

process.once('SIGINT', () => interromper('SIGINT'))
process.once('SIGTERM', () => interromper('SIGTERM'))
process.once('exit', () => {
  if (servidor !== null && !servidorSaiu()) {
    servidor.kill()
  }
})

async function principal() {
  const chromium = await carregarPlaywright()
  await mkdir(PASTA_CAPTURAS, { recursive: true })
  if (await responde()) {
    throw new FalhaCaptura(
      `A porta ${PORTA} já está em uso por outro servidor. Encerre-o e rode as capturas de novo.`,
    )
  }
  subirServidor()
  await esperarServidor()
  navegador = await abrirNavegador(chromium)
  for (const reduzido of [false, true]) {
    for (const largura of LARGURAS) {
      await capturar(largura, reduzido)
    }
  }
  escrever(`Capturas de tela concluídas: ${LARGURAS.length * 2} imagens em ${path.relative(process.cwd(), PASTA_CAPTURAS)}.`)
}

let codigo = 0
try {
  await principal()
} catch (erro) {
  codigo = 1
  const texto = erro instanceof FalhaCaptura ? erro.message : `Erro inesperado: ${erro?.stack ?? erro}`
  process.stderr.write(`Falha nas capturas de tela. ${texto}\n`)
} finally {
  await fecharNavegador()
  await encerrarServidor()
}
process.exit(codigo)
