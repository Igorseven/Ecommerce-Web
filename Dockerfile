# Etapa 1: Build da aplicação React
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: Servir a aplicação com servidor estático
FROM node:18-alpine

WORKDIR /app

# Instalar servidor estático (serve)
RUN npm install -g serve

# Copiar build da etapa anterior
COPY --from=build /app/dist ./dist

# Expor porta 3000
EXPOSE 3000

# Comando para servir a aplicação
CMD ["serve", "-s", "dist", "-l", "3000"]
