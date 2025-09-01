## Possiveis Melhorias

- Aumentar a cobertura dos testes (Devido ao tempo realizei apenas alguns testes dos cases principais);
- Terminar de resolver todos os lint's;
- Melhorar documentação;

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 22 LTS)
- pnpm (npm install -g pnpm@latest-10)
- Docker e Docker Compose

### 1. Clonar o repositório

```bash
git clone https://github.com/BrunoPiresXavier/api-sku.git
cd api-sku
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=sku_management

```

### 4. Subir o banco de dados

```bash
# Subir apenas o PostgreSQL
docker compose up -d postgres

### 5. Executar migrações
pnpm run migration:run
```

### 6. Iniciar a aplicação

```bash
# Desenvolvimento (com hot reload)
pnpm run start:dev

# Produção
pnpm run build
pnpm run start:prod
```

A API estará disponível em: `http://localhost:3000`

## 🧪 Como Testar

```bash
pnpm run test
pnpm run test:cov
pnpm run test:e2e
```
