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

## Tickets

### GET /tickets
Lista tickets con filtros y paginación.

```bash
# Listar todos (página 1, 20 por página por defecto)
curl http://localhost:3000/tickets

# Con filtros
curl "http://localhost:3000/tickets?status=open&priority=high&page=1&pageSize=10"

# Filtros por usuario
curl "http://localhost:3000/tickets?assignedUserId=1&createdByUserId=2"

# Filtros por fecha
curl "http://localhost:3000/tickets?from=2024-01-01&to=2024-01-31"

# Combinando filtros
curl "http://localhost:3000/tickets?status=in_progress&assignedUserId=1&from=2024-01-01"
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Login issue",
      "description": "Cannot login to account",
      "status": "open",
      "priority": "high",
      "category": "bug",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "resolvedAt": null,
      "createdByUserId": 2,
      "assignedUserId": 1,
      "createdBy": {
        "id": 2,
        "name": "John Customer",
        "email": "customer@example.com"
      },
      "assignedTo": {
        "id": 1,
        "name": "Jane Agent", 
        "email": "agent@example.com"
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1,
  "totalPages": 1
}
```

### POST /tickets
Crear nuevo ticket.

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login issue",
    "description": "Cannot access my account",
    "createdByUserId": 2,
    "assignedUserId": 1,
    "priority": "high",
    "category": "bug"
  }'
```

### GET /tickets/:id
Obtener ticket por ID.

```bash
curl http://localhost:3000/tickets/1
```

### PUT /tickets/:id
Actualizar ticket (solo status, priority, assignedUserId).

```bash
curl -X PUT http://localhost:3000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "med",
    "assignedUserId": 3
  }'
```

### DELETE /tickets/:id
Eliminar ticket (borrado duro).

```bash
curl -X DELETE http://localhost:3000/tickets/1
# Response: { "success": true }
```

## Estados de Tickets
- `open`: Abierto (default)
- `in_progress`: En progreso
- `resolved`: Resuelto
- `closed`: Cerrado

## Prioridades
- `low`: Baja
- `med`: Media (default)
- `high`: Alta

## Filtros disponibles
- `status`: Estado del ticket
- `priority`: Prioridad del ticket
- `category`: Categoría del ticket
- `assignedUserId`: ID del usuario asignado
- `createdByUserId`: ID del usuario creador
- `from`: Fecha de inicio (YYYY-MM-DD)
- `to`: Fecha de fin (YYYY-MM-DD)
- `page`: Número de página
- `pageSize`: Elementos por página

## Estadísticas

### GET /stats/count-by-status
Obtiene conteo de tickets agrupados por status con filtros opcionales de fecha.

```bash
# Conteo general de todos los tickets
curl http://localhost:3000/stats/count-by-status

# Conteo en un rango de fechas
curl "http://localhost:3000/stats/count-by-status?from=2024-01-01&to=2024-01-31"

# Conteo desde una fecha
curl "http://localhost:3000/stats/count-by-status?from=2024-01-01"

# Conteo hasta una fecha
curl "http://localhost:3000/stats/count-by-status?to=2024-01-31"
```

Response:
```json
{
  "from": "2024-01-01",
  "to": "2024-01-31",
  "counts": {
    "open": 15,
    "in_progress": 8,
    "resolved": 12,
    "closed": 5
  }
}
```

**Parámetros:**
- `from` (opcional): Fecha de inicio en formato YYYY-MM-DD
- `to` (opcional): Fecha de fin en formato YYYY-MM-DD

**Notas:**
- Si no se proporcionan fechas, cuenta todos los tickets
- Los conteos incluyen todos los estados posibles (open, in_progress, resolved, closed)
- Estados sin tickets aparecen con count: 0
- Fechas inválidas retornan error 400
