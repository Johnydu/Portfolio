#!/usr/bin/env bash
# Verifica a imagem Docker do portfólio (build, porta dinâmica, cabeçalhos, cache, SPA).
# Uso: scripts/verify-container.sh
set -euo pipefail

IMAGE="portfolio-verify"
SITE_URL="https://exemplo.test"
fail() { echo "FALHOU: $*" >&2; exit 1; }
ok() { echo "ok: $*"; }

# 1. O build deve falhar sem VITE_SITE_URL
if docker build -q -t "$IMAGE-sem-url" . >/dev/null 2>&1; then
  fail "build sem VITE_SITE_URL deveria falhar"
fi
ok "build falha sem VITE_SITE_URL"

# 2. Build com VITE_SITE_URL
docker build -q --build-arg VITE_SITE_URL="$SITE_URL" -t "$IMAGE" . >/dev/null
ok "build com VITE_SITE_URL"

check_port() {
  local port="$1" name="portfolio-verify-$1"
  docker rm -f "$name" >/dev/null 2>&1 || true
  docker run -d --rm --name "$name" -e PORT="$port" -p "$port:$port" "$IMAGE" >/dev/null
  trap 'docker rm -f "$name" >/dev/null 2>&1 || true' RETURN
  for _ in $(seq 1 30); do
    curl -fs "http://localhost:$port/" >/dev/null 2>&1 && break
    sleep 0.5
  done

  local base="http://localhost:$port"
  local home assets
  home="$(curl -si -H 'Accept-Encoding: gzip' "$base/")"
  echo "$home" | head -1 | grep -q "200" || fail "/ nao retornou 200 (PORT=$port)"
  echo "$home" | grep -qi "^content-security-policy:.*default-src 'self'" || fail "CSP ausente em / (PORT=$port)"
  echo "$home" | grep -qi "^x-content-type-options: nosniff" || fail "nosniff ausente em /"
  echo "$home" | grep -qi "^referrer-policy:" || fail "Referrer-Policy ausente em /"
  echo "$home" | grep -qi "^cache-control:.*no-cache" || fail "Cache-Control no-cache ausente em /"
  echo "$home" | grep -qi "^content-encoding: gzip" || fail "gzip ausente em /"
  echo "$home" | grep -qi "^server: nginx/" && fail "versao do nginx exposta"

  local asset
  asset="$(curl -s "$base/" | grep -o '/assets/[^"]*\.js' | head -1)"
  [ -n "$asset" ] || fail "nenhum asset JS referenciado no index.html"
  assets="$(curl -sI "$base$asset")"
  echo "$assets" | head -1 | grep -q "200" || fail "$asset nao retornou 200"
  echo "$assets" | grep -qi "^cache-control:.*immutable" || fail "cache immutable ausente em $asset"
  echo "$assets" | grep -qi "^content-security-policy:" || fail "CSP ausente em /assets (cabecalho perdido no location)"
  echo "$assets" | grep -qi "^x-content-type-options: nosniff" || fail "nosniff ausente em /assets"

  curl -s "$base/rota-que-nao-existe" | grep -q '<div id="root">' || fail "rota desconhecida nao devolve index.html"
  ok "PORT=$port: 200, CSP, nosniff, Referrer-Policy, cache, gzip, SPA fallback"
}

check_port 8080
check_port 3000
echo "Container verificado."
