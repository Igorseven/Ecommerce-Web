# E-Commerce MVP - Frontend React

Sistema web componentizado de e-commerce desenvolvido como projeto de pós-graduação. Este repositório contém o front-end React que se comunica com um backend Flask e integra APIs externas.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Métodos HTTP Implementados](#métodos-http-implementados)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
  - [Com Docker Compose (Recomendado)](#com-docker-compose-recomendado)
  - [Desenvolvimento Local](#desenvolvimento-local)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [APIs Utilizadas](#apis-utilizadas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Funcionalidades Extras](#funcionalidades-extras)
- [Screenshots](#screenshots)
- [Links Relacionados](#links-relacionados)

## 🎯 Sobre o Projeto

Este é um MVP (Minimum Viable Product) de um sistema de e-commerce desenvolvido como trabalho de conclusão da pós-graduação em Engenharia de Software. O projeto demonstra a integração de múltiplas tecnologias e APIs, seguindo boas práticas de desenvolvimento.

**Principais características:**
- Interface moderna e responsiva com Material-UI
- Integração com backend Flask
- Consumo de APIs externas (FakeStore, ViaCEP)
- Gerenciamento de estado com Context API
- Validação de formulários em tempo real
- Containerização com Docker

## 🏗️ Arquitetura

```
┌─────────────────┐
│  Frontend React │
│  (Port 3000)    │
└────────┬────────┘
         │
         ├─────────────────────► FakeStore API
         │                       (Produtos)
         │
         ▼
┌─────────────────┐              ┌──────────────┐
│  Backend Flask  │◄────────────►│   MySQL DB   │
│  (Port 5000)    │              │  (Port 3306) │
└────────┬────────┘              └──────────────┘
         │
         └─────────────────────► ViaCEP API
                                 (Validação CEP)
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool rápida e moderna
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router DOM** - Roteamento de páginas
- **Axios** - Cliente HTTP para requisições
- **React Toastify** - Notificações elegantes
- **Context API** - Gerenciamento de estado global

### DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de múltiplos containers

## ✨ Funcionalidades

### 1. Página de Produtos (`/`)
- ✅ Listagem de produtos da FakeStore API
- ✅ Paginação (9 produtos por página)
- ✅ Busca por nome de produto
- ✅ Filtro por categoria
- ✅ Adicionar produtos ao carrinho
- ✅ Contador de itens no carrinho
- ✅ Controle de quantidade (+/-)
- ✅ Design responsivo (grid adaptativo)

### 2. Página de Pedidos (`/orders`)
- ✅ Listagem de todos os pedidos
- ✅ Exibição de detalhes do pedido
- ✅ Visualização completa em modal
- ✅ Deletar pedido (com confirmação)
- ✅ Status coloridos e ícones
- ✅ Botão de atualização manual

### 3. Página de Checkout (`/checkout`)
- ✅ Formulário completo de dados
- ✅ Validação de CEP automática
- ✅ Preenchimento automático de endereço (ViaCEP)
- ✅ Validação em tempo real
- ✅ Formatação de CEP e telefone
- ✅ Resumo do carrinho com controle de quantidade
- ✅ Finalização de pedido (POST)
- ✅ Redirecionamento após sucesso

## 🔄 Métodos HTTP Implementados

| Método | Endpoint | Descrição | Onde é usado |
|--------|----------|-----------|--------------|
| **GET** | `/api/orders` | Listar todos os pedidos | OrdersPage.jsx:37 |
| **GET** | `/api/orders/:id` | Buscar pedido específico | OrderCard.jsx (modal) |
| **POST** | `/api/orders` | Criar novo pedido | CheckoutPage.jsx:31 |
| **PUT** | `/api/orders/:id` | Atualizar pedido | api.js:79 (implementado) |
| **DELETE** | `/api/orders/:id` | Deletar pedido | OrdersPage.jsx:53 |
| **GET** | `/api/cep/:cep` | Validar CEP (ViaCEP) | CheckoutForm.jsx:142 |
| **GET** | FakeStore `/products` | Buscar produtos | ProductsPage.jsx:27 |

## 📦 Pré-requisitos

### Para executar com Docker (Recomendado):
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- [Git](https://git-scm.com/) para clonar os repositórios

### Para desenvolvimento local:
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Backend Flask rodando em `http://localhost:5000`

## 🔧 Instalação e Execução

### Com Docker Compose (Recomendado)

Esta é a forma mais simples de executar o projeto completo (MySQL + Backend + Frontend).

**1. Clone os repositórios na mesma pasta:**

```bash
# Clone o backend
git clone https://github.com/Igorseven/Ecommerce-API.git

# Clone o frontend
git clone https://github.com/Igorseven/Ecommerce-Web.git
```

**Estrutura esperada:**
```
meus-projetos/
├── ecommerce-backend/
│   ├── app.py
│   ├── Dockerfile
│   └── ...
└── ecommerce-frontend/
    ├── src/
    ├── docker-compose.yml
    ├── Dockerfile
    └── ...
```

**2. Execute com Docker Compose:**

```bash
cd Ecommerce-Web
docker-compose up --build
```

**3. Aguarde os containers iniciarem:**

O Docker Compose irá:
- Criar o banco de dados MySQL
- Inicializar o backend Flask
- Buildar e servir o frontend React

**4. Acesse a aplicação:**

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **MySQL:** localhost:3306

**Para parar os containers:**

```bash
docker-compose down
```

**Para parar e remover volumes (limpar banco):**

```bash
docker-compose down -v
```

### Desenvolvimento Local

Para desenvolver localmente sem Docker:

**1. Clone o repositório:**

```bash
git clone https://github.com/Igorseven/Ecommerce-Web.git
cd Ecommerce-Web
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_FAKESTORE_URL=https://fakestoreapi.com
```

**4. Certifique-se que o backend está rodando:**

O backend Flask deve estar rodando em `http://localhost:5000`

**5. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

**6. Acesse no navegador:**

```
http://localhost:3000
```

**Comandos úteis:**

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
ecommerce-frontend/
├── public/
│   └── vite.svg                 # Ícone da aplicação
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Header.jsx           # Barra de navegação
│   │   ├── Loading.jsx          # Componente de loading
│   │   ├── ProductCard.jsx      # Card de produto
│   │   ├── ProductList.jsx      # Lista de produtos
│   │   ├── OrderCard.jsx        # Card de pedido
│   │   ├── OrderList.jsx        # Lista de pedidos
│   │   ├── CheckoutForm.jsx     # Formulário de checkout
│   │   └── CartSummary.jsx      # Resumo do carrinho
│   ├── pages/                   # Páginas da aplicação
│   │   ├── ProductsPage.jsx     # Página de produtos (/)
│   │   ├── OrdersPage.jsx       # Página de pedidos (/orders)
│   │   └── CheckoutPage.jsx     # Página de checkout (/checkout)
│   ├── services/                # Serviços HTTP
│   │   ├── api.js               # Cliente do backend Flask
│   │   └── fakestore.js         # Cliente da FakeStore API
│   ├── context/                 # Context API
│   │   └── CartContext.jsx      # Contexto do carrinho
│   ├── App.jsx                  # Componente principal + rotas
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globais
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── docker-compose.yml           # Orquestração completa
├── Dockerfile                   # Container do frontend
├── index.html                   # HTML base
├── package.json                 # Dependências do projeto
├── vite.config.js               # Configuração do Vite
└── README.md                    # Este arquivo
```

## 🌐 APIs Utilizadas

### 1. Backend API (Flask)

**Base URL:** `http://localhost:5000`

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/orders` | GET | Listar todos os pedidos |
| `/api/orders/:id` | GET | Buscar pedido por ID |
| `/api/orders` | POST | Criar novo pedido |
| `/api/orders/:id` | PUT | Atualizar pedido |
| `/api/orders/:id` | DELETE | Deletar pedido |
| `/api/cep/:cep` | GET | Validar CEP (ViaCEP) |

**Exemplo de requisição POST:**

```json
{
  "customer_name": "João Silva",
  "customer_email": "joao@email.com",
  "customer_phone": "11999999999",
  "address": {
    "cep": "01310100",
    "street": "Avenida Paulista",
    "number": "1578",
    "complement": "Andar 10",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP"
  },
  "items": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "product_image": "https://...",
      "quantity": 2,
      "unit_price": 50.00
    }
  ]
}
```

### 2. FakeStore API

**Base URL:** `https://fakestoreapi.com`

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/products` | GET | Listar todos os produtos |
| `/products/:id` | GET | Buscar produto por ID |
| `/products/categories` | GET | Listar categorias |
| `/products/category/:name` | GET | Produtos por categoria |

**Documentação:** https://fakestoreapi.com/docs

### 3. ViaCEP (via Backend)

Integrado através do backend Flask. O frontend faz requisição para o backend, que por sua vez consulta a ViaCEP API.

**Endpoint:** `GET /api/cep/:cep`

**Exemplo de resposta:**

```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# FakeStore API URL
VITE_FAKESTORE_URL=https://fakestoreapi.com
```

## 🎨 Funcionalidades Extras

Além dos requisitos obrigatórios, o projeto inclui:

- ✅ **Paginação bonita** - Navegação entre páginas de produtos
- ✅ **Animações suaves** - Transições do Material-UI
- ✅ **Toast notifications** - Feedback visual com react-toastify
- ✅ **Loading states** - Spinners em todas as requisições
- ✅ **Tratamento de erros** - Mensagens amigáveis
- ✅ **Validação em tempo real** - Formulários validados
- ✅ **Formatação automática** - CEP (xxxxx-xxx) e telefone ((xx) xxxxx-xxxx)
- ✅ **Responsividade** - Mobile-first design
- ✅ **Filtro por categoria** - Categorias da FakeStore
- ✅ **Busca por nome** - Filtro de produtos
- ✅ **Contador de quantidade** - Aumentar/diminuir no carrinho
- ✅ **Confirmação de exclusão** - Modal antes de deletar
- ✅ **Modal de detalhes** - Visualização completa do pedido
- ✅ **Persistência do carrinho** - Salvo no localStorage
- ✅ **Status coloridos** - Identificação visual de status de pedido


## 🔗 Links Relacionados

- **Backend Repository:** [ecommerce-backend](https://github.com/Igorseven/Ecommerce-API.git)
- **FakeStore API:** https://fakestoreapi.com
- **ViaCEP API:** https://viacep.com.br
- **Material-UI Docs:** https://mui.com

## 📝 Observações Importantes

1. **CORS**: O backend Flask deve estar configurado para aceitar requisições do frontend (`CORS_ORIGINS=http://localhost:3000`)

2. **Backend URL**: Certifique-se que a variável `VITE_API_URL` aponta para o backend correto

3. **Docker**: O docker-compose.yml assume que o backend está em `../ecommerce-backend`. Ajuste o caminho se necessário.

4. **Healthchecks**: Os containers possuem healthchecks para garantir que as dependências estejam prontas antes de iniciar.

5. **Persistência**: O banco de dados MySQL usa um volume Docker para persistir os dados entre reinicializações.

## 👨‍💻 Autor

**Igor Henrique de Souza Silva**
- Email: igorsevenn@gmail.com
- LinkedIn: [linkedin.com/in/igor-sevenn](https://www.linkedin.com/in/igor-sevenn)
- GitHub: [github.com/Igorseven](https://github.com/Igorseven)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do trabalho de conclusão da pós-graduação.

---
