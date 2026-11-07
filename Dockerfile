# Etapa 1: build da SPA
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# URL pública do site (https). O build falha se não for informada.
ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN npm run build

# Etapa 2: nginx servindo os arquivos estáticos
FROM nginx:1.27-alpine AS runtime

# O Railway define PORT; 8080 é o padrão para execução local.
ENV PORT=8080

COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
# A imagem oficial aplica envsubst em /etc/nginx/templates/*.template ao iniciar.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
