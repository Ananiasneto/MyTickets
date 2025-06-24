# My Tickets

Aplicação de back-end utilizada para a administração de eventos e tickets.

---

## Pré-requisitos

- Docker
- Docker Compose

---

## Como rodar

1. Clone o repositório:

```bash
git clone <https://github.com/Ananiasneto/MyTickets>
cd MyTickets-main
```

2. Configure seu arquivo `.env` (exemplo em `back-end/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mytickets
PORT=5000
```

3. Suba os containers com Docker Compose:

```bash
docker compose up --build
```

4. A API estará disponível em:

```
http://localhost:5000

```

## Endpoints da API

### Health Check
- `GET /health`  
  Verifica se a API está online. Retorna status 200 com a mensagem `"I'm okay!"`.

---

### Tickets

- `GET /tickets/:eventId`  
  Retorna os tickets do evento com o ID especificado.

- `POST /tickets`  
  Cria um novo ticket. Valida os dados conforme o esquema `ticketSchema`.

- `PUT /tickets/use/:id`  
  Marca o ticket com o ID especificado como usado.

---

### Events

- `GET /events`  
  Retorna a lista de todos os eventos.

- `GET /events/:id`  
  Retorna os detalhes do evento com o ID especificado.

- `POST /events`  
  Cria um novo evento. Valida os dados conforme o esquema `eventSchema`.

- `PUT /events/:id`  
  Atualiza o evento com o ID especificado. Valida os dados conforme o esquema `eventSchema`.

- `DELETE /events/:id`  
  Remove o evento com o ID especificado.

---

