# Projeto API - Gestão de Tarefas

API REST em Node.js + Express para gerir utilizadores, tarefas, tags e comentários com persistência em base de dados SQL.

## Tecnologias

- Node.js 18+
- Express 5
- MySQL2
- CORS habilitado
- JavaScript (ES Modules)
- pnpm

## Autoria

- Nome: Debora Andrade
- Repositório: https://github.com/DebsAndrade/Projeto-Primeira-API

## Instalação e Execução

```bash
pnpm install
pnpm start
```

Servidor em: http://localhost:3000

## Configuração CORS

A API está configurada para aceitar requisições do frontend em `http://localhost:5173`:
- Métodos: GET, POST, PUT, PATCH, DELETE
- Credentials habilitadas

## Base de Dados

Schema SQL em `database/schema_projeto_api.sql` com tabelas: `users`, `tasks`, `tags`, `task_tags`, `comments`

## Endpoints

**Utilizadores:**
- GET /users (com sort e search)
- POST, PUT, PATCH, DELETE /users/:id
- GET /users/stats

**Tarefas:**
- GET /tasks (com sort e search)
- POST, PUT, DELETE /tasks/:id
- POST /tasks/:id/tags
- POST/GET /tasks/:id/comments
- GET /tasks/stats

**Tags:**
- GET /tags
- POST /tags
- DELETE /tags/:id
- GET /tags/:id/tasks

## Validações

- **Users:** name, email (com @), active (boolean)
- **Tasks:** title (3+ caracteres), category, nameResponsible, done (boolean)
- **Tags:** tagId obrigatório, sem duplicatas
- **Comments:** userId e conteudo obrigatórios

## Estrutura

```
src/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
├── app.js
└── db.js
```
