# Projeto API - Gestão de Tarefas

**Versão:** 2.0 | **Segunda Entrega**

API REST em Node.js + Express para gerir utilizadores, tarefas, tags e comentários com persistência de dados em base de dados SQL.

## Novidades na Segunda Entrega

- ✅ Integração com base de dados SQL
- ✅ Schema definido com suporte completo para entidades (Utilizadores, Tarefas, Tags, Comentários)
- ✅ Persistência de dados entre reinicializações
- ✅ Validações aprimoradas
- ✅ Middlewares de tratamento de erros
- ✅ Documentação atualizada com exemplos de uso

## Autoria

- Nome: Debora Andrade
- Repositório: https://github.com/DebsAndrade/Projeto-Primeira-API

## Tecnologias

- Node.js 18+
- Express 5
- JavaScript (ES Modules)
- pnpm
- Base de Dados SQL (PostgreSQL/MySQL/SQLite)

## Base de Dados

O projeto inclui um schema SQL em `database/schema_projeto_api.sql` com as seguintes tabelas:
- `users` - Utilizadores do sistema
- `tasks` - Tarefas a realizar
- `tags` - Etiquetas para categorização
- `task_tags` - Associação entre tarefas e tags
- `comments` - Comentários nas tarefas

## Pré-requisitos

- Node.js 18+ (recomendado)
- pnpm instalado globalmente

## Instalação

```bash
pnpm install
```

## Executar o projeto

```bash
pnpm start
```

Servidor disponível em:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
src/
	app.js
	controllers/
		commentController.js
		tagController.js
		taskController.js
		userController.js
	middlewares/
		checkUserExists.js
		loggerMiddleware.js
	routes/
		tagRoutes.js
		taskRoutes.js
		userRoutes.js
	services/
		commentServices.js
		tagServices.js
		taskServices.js
		userServices.js
```

## Base URL

```text
http://localhost:3000
```

## Endpoints

### Utilizadores

- GET /users
	- Query params opcionais:
		- sort=asc|desc (ordena por nome)
		- search=texto (filtra por nome)
- GET /users/stats
- POST /users
- PUT /users/:id
- PATCH /users/:id (alterna active true/false)
- DELETE /users/:id

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/users \
	-H "Content-Type: application/json" \
	-d '{"name":"Debora","email":"debora@example.com"}'
```

### Tarefas

- GET /tasks
	- Query params opcionais:
		- sort=asc|desc (ordena por title)
		- search=texto (filtra por title)
- GET /tasks/stats
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id
- POST /tasks/:id/tags
- POST /tasks/:id/comments
- GET /tasks/:id/comments

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"Criar README","category":"Documentacao","nameResponsible":"Debora"}'
```

### Tags

- GET /tags
- POST /tags
- DELETE /tags/:id
- GET /tags/:id/tasks

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"Backend"}'
```

Exemplo de associação de tag a tarefa:

```bash
curl -X POST http://localhost:3000/tasks/1/tags \
	-H "Content-Type: application/json" \
	-d '{"tagId":2}'
```

Exemplo para listar tarefas de uma tag:

```bash
curl http://localhost:3000/tags/2/tasks
```

### Comentários em tarefas

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tasks/1/comments \
	-H "Content-Type: application/json" \
	-d '{"userId":1,"conteudo":"Tarefa iniciada."}'
```

Exemplo de listagem:

```bash
curl http://localhost:3000/tasks/1/comments
```

## Validações importantes

- Users:
	- name obrigatório e string
	- email obrigatório e deve conter @
	- active deve ser boolean quando enviado
- Tasks:
	- title obrigatório e com pelo menos 3 caracteres
	- category obrigatório
	- nameResponsible obrigatório
	- done deve ser boolean quando enviado
- Task-Tags:
	- tagId obrigatório no POST /tasks/:id/tags
	- tarefa e tag devem existir
	- a mesma tag não pode ser associada duas vezes à mesma tarefa
- Comments:
	- userId e conteudo obrigatórios no POST /tasks/:id/comments
	- tarefa e utilizador devem existir

## Observações

- Os dados são persistidos em base de dados SQL
- Existe middleware de log em todas as rotas, imprimindo data/hora, método e URL no terminal
- Todas as validações ocorrem antes da persistência dos dados
- O schema da base de dados deve ser importado antes de usar a API pela primeira vez

## Script disponível

- start: inicia o servidor (node src/app.js)
