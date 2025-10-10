# Tickets con Productos - Documentación

## Descripción

Los tickets ahora pueden estar asociados opcionalmente a productos, además de estar siempre asociados a un usuario.

## Endpoints

### 1. Crear un Producto

**POST** `/products`

```json
{
  "name": "Impresora HP 2130",
  "price": 299.99
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Impresora HP 2130",
  "price": 299.99,
  "createdAt": "2025-10-02T10:00:00.000Z",
  "updatedAt": "2025-10-02T10:00:00.000Z"
}
```

### 2. Listar Productos

**GET** `/products`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Impresora HP 2130",
    "price": 299.99,
    "createdAt": "2025-10-02T10:00:00.000Z",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Mouse Logitech MX Master",
    "price": 89.99,
    "createdAt": "2025-10-02T10:05:00.000Z",
    "updatedAt": "2025-10-02T10:05:00.000Z"
  }
]
```

### 3. Crear un Ticket sin Producto

**POST** `/tickets`

```json
{
  "title": "No me anda la contraseña",
  "body": "No puedo loguearme en el sistema",
  "userId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "title": "No me anda la contraseña",
  "description": "No puedo loguearme en el sistema",
  "status": "open",
  "priority": "med",
  "category": null,
  "createdAt": "2025-10-02T10:10:00.000Z",
  "updatedAt": "2025-10-02T10:10:00.000Z",
  "resolvedAt": null,
  "createdByUserId": 1,
  "assignedUserId": 2,
  "productId": null,
  "createdBy": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "assignedTo": {
    "id": 2,
    "name": "Ana García",
    "email": "ana@example.com"
  },
  "product": null
}
```

### 4. Crear un Ticket con Producto

**POST** `/tickets`

```json
{
  "title": "No imprime bien",
  "body": "La impresora hace ruido raro y las hojas salen manchadas",
  "userId": 1,
  "productId": 1
}
```

**Response:**
```json
{
  "id": 2,
  "title": "No imprime bien",
  "description": "La impresora hace ruido raro y las hojas salen manchadas",
  "status": "open",
  "priority": "med",
  "category": null,
  "createdAt": "2025-10-02T10:15:00.000Z",
  "updatedAt": "2025-10-02T10:15:00.000Z",
  "resolvedAt": null,
  "createdByUserId": 1,
  "assignedUserId": 3,
  "productId": 1,
  "createdBy": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "assignedTo": {
    "id": 3,
    "name": "Carlos Rodríguez",
    "email": "carlos@example.com"
  },
  "product": {
    "id": 1,
    "name": "Impresora HP 2130",
    "price": 299.99,
    "createdAt": "2025-10-02T10:00:00.000Z",
    "updatedAt": "2025-10-02T10:00:00.000Z"
  }
}
```

### 5. Listar Tickets

**GET** `/tickets`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "No me anda la contraseña",
      "description": "No puedo loguearme en el sistema",
      "status": "open",
      "createdByUserId": 1,
      "productId": null,
      "createdBy": {
        "id": 1,
        "name": "Juan Pérez"
      },
      "assignedTo": {
        "id": 2,
        "name": "Ana García"
      },
      "product": null
    },
    {
      "id": 2,
      "title": "No imprime bien",
      "description": "La impresora hace ruido raro y las hojas salen manchadas",
      "status": "open",
      "createdByUserId": 1,
      "productId": 1,
      "createdBy": {
        "id": 1,
        "name": "Juan Pérez"
      },
      "assignedTo": {
        "id": 3,
        "name": "Carlos Rodríguez"
      },
      "product": {
        "id": 1,
        "name": "Impresora HP 2130",
        "price": 299.99
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 2,
  "totalPages": 1
}
```

## Validaciones

- **userId**: Siempre obligatorio. Debe existir en la base de datos.
- **productId**: Opcional. Si se proporciona, debe existir en la base de datos.
- Si el usuario no existe, retorna `404 - CreatedBy user not found`
- Si el producto no existe, retorna `404 - Product not found`

## Ejemplos de cURL

### Crear un producto
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Impresora HP 2130",
    "price": 299.99
  }'
```

### Crear ticket sin producto
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No me anda la contraseña",
    "body": "No puedo loguearme",
    "userId": 1
  }'
```

### Crear ticket con producto
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No imprime bien",
    "body": "Hace ruido raro",
    "userId": 1,
    "productId": 1
  }'
```

### Listar tickets
```bash
curl http://localhost:3000/tickets
```

### Listar productos
```bash
curl http://localhost:3000/products
```


