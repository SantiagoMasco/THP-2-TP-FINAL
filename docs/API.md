# HelpDesk Lite – API (MVP)

## Base URLs
- Development: `http://localhost:3000`

## Health & Status

### GET /ping
Verifica que el servidor responde.

```bash
curl http://localhost:3000/ping
# Response: { "pong": true }
```

### GET /health
Estado del servidor con uptime.

```bash
curl http://localhost:3000/health
# Response: { "ok": true, "uptime": 120 }
```

## Users

### GET /users
Lista usuarios con paginación.

```bash
# Listar todos (página 1, 20 por página por defecto)
curl http://localhost:3000/users

# Con paginación personalizada
curl "http://localhost:3000/users?page=2&pageSize=10"
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1,
  "totalPages": 1
}
```

### POST /users
Crear nuevo usuario.

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }'
```

### GET /users/:id
Obtener usuario por ID.

```bash
curl http://localhost:3000/users/1
```

### PUT /users/:id
Actualizar usuario (solo name, role, active).

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "role": "admin",
    "active": true
  }'
```

### DELETE /users/:id
Desactivar usuario (borrado lógico).

```bash
curl -X DELETE http://localhost:3000/users/1
# Response: usuario con active: false
```

## Roles
- `admin`: Administrador del sistema
- `agent`: Agente de soporte
- `customer`: Cliente (default)
