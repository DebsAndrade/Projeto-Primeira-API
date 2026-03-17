# Projeto API - Gestão de Tarefas

API REST simples em Node.js + Express para gerir utilizadores, tarefas, tags e comentários.

O projeto usa dados em memória (arrays nos services), sem base de dados persistente.

## Autoria

- Nome: Debora Andrade
- Repositório: https://github.com/DebsAndrade/Projeto-Primeira-API

## Tecnologias

- Node.js
- Express 5
- JavaScript (ES Modules)
- pnpm

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

- Os dados são mantidos apenas em memória; ao reiniciar o servidor, as alterações são perdidas.
- Existe middleware de log em todas as rotas, imprimindo data/hora, método e URL no terminal.

## Script disponível

- start: inicia o servidor (node src/app.js)
