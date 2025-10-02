# HelpDesk Lite

HelpDesk Lite es un sistema básico de gestión de tickets desarrollado con **Node.js**, **Express** y **Prisma** sobre una base de datos **SQLite**.  
El proyecto se construyó siguiendo estrictamente la metodología **TDD (Test-Driven Development)**.

## Requisitos

- Node.js v18 o superior  
- npm v9 o superior  
- SQLite3 instalado  
- Postman (opcional, para probar la API manualmente)

## Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPO>
   cd helpdesk-lite
Instalar dependencias

bash
Copy
Edit
npm install
Inicializar la base de datos

bash
Copy
Edit
npx prisma migrate dev --name init
Ejecutar los tests

bash
Copy
Edit
npm test
Levantar el servidor en modo desarrollo

bash
Copy
Edit
npm run dev
El servidor quedará disponible en:

arduino
Copy
Edit
http://localhost:3000
Endpoints principales
Health
GET /ping

GET /health

Users
POST /users

GET /users

GET /users/:id

PUT /users/:id

DELETE /users/:id

Tickets
POST /tickets

GET /tickets

GET /tickets/:id

PUT /tickets/:id

DELETE /tickets/:id

Stats
GET /stats/count-by-status?from=YYYY-MM-DD&to=YYYY-MM-DD

Ejemplos básicos cURL
Crear usuario

bash
Copy
Edit
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
Crear ticket

bash
Copy
Edit
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Error en login", "status": "open", "priority": "high", "createdByUserId": 1}'
Obtener estadísticas

bash
Copy
Edit
curl -X GET "http://localhost:3000/stats/count-by-status?from=2024-01-01&to=2024-01-31"
Documentación API
La documentación completa con ejemplos cURL está disponible en:

Copy
Edit
docs/API.md
Estado del proyecto
CRUD completo de usuarios con borrado lógico.

CRUD completo de tickets con relaciones y filtros avanzados.

Estadísticas de tickets por estado con filtros de fechas.

Persistencia con SQLite + Prisma.

Arquitectura en capas: controllers, use-cases, repositories.

40 tests unitarios en verde desarrollados con TDD.

## ⚙️ Variables de Entorno

### CORS Configuration

Por defecto, la API acepta requests desde:
- `http://localhost:3000` 
- `http://localhost:3001`
- `http://127.0.0.1:3000`

Para configurar origins adicionales en producción:

```bash
export ALLOWED_ORIGINS="https://mi-frontend.com,https://admin.mi-app.com"
```

O en Windows:
```cmd
set ALLOWED_ORIGINS=https://mi-frontend.com,https://admin.mi-app.com
```

La configuración CORS permite:
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization  
- **Credentials**: Habilitado para cookies/auth

## 🔐 Sistema de Autenticación 

### Roles de Usuario
- **USER**: Usuarios normales que pueden crear tickets
- **AGENT**: Agentes que reciben tickets asignados automáticamente  
- **ADMIN**: Administradores con permisos completos

### Endpoints de Autenticación

#### Registro
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "mi-password"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com", 
  "password": "mi-password"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "role": "USER"
  }
}
```

### 🎫 Auto-asignación de Tickets

Los tickets se asignan automáticamente a AGENTs usando **round-robin determinista**:

```bash
POST /api/tickets
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "No puedo acceder a mi cuenta",
  "body": "Descripción del problema"
}
```

**Características:**
- ✅ **Creador automático**: Usa `req.user.id` del token JWT
- ✅ **Auto-asignación**: Rota entre AGENTs activos por orden de ID
- ✅ **Sin agentes**: Si no hay AGENTs, `assignedUserId = null`
- ✅ **Status inicial**: `'open'` (minúsculas)
- ✅ **Persistente**: El puntero de rotación sobrevive reinicios del servidor

### 👥 Permisos de Acceso

#### GET /api/users/:userId/tickets
- ✅ **USER**: Solo puede ver sus propios tickets  
- ✅ **AGENT**: Solo puede ver sus propios tickets
- ✅ **ADMIN**: Puede ver tickets de cualquier usuario

```bash
GET /api/users/123/tickets
Authorization: Bearer <jwt-token>
```

### Variables de Entorno Requeridas

```bash
# .env
DATABASE_URL="file:./data/app.sqlite"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
MONGODB_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"
```

## 🍃 MongoDB Setup (Paralelo)

### Configuración de MongoDB

1. **Configurar variable de entorno:**
   ```bash
   # En .env agregar:
   MONGODB_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"
   ```

2. **Generar cliente Prisma para MongoDB:**
   ```bash
   npm run prisma:generate:mongo
   ```

3. **Verificar conexión:**
   ```bash
   GET http://localhost:3000/health/mongo
   ```
   
   **Respuesta esperada:**
   ```json
   { "ok": true, "mongo": "up" }
   ```

## 🔧 CRUD User Mongo

### Endpoints disponibles:

**Crear usuario:**
```bash
curl -X POST http://localhost:3000/mongo/users -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@test.com"}'
```

**Listar usuarios:**
```bash
curl http://localhost:3000/mongo/users
```

**Actualizar usuario:**
```bash
curl -X PUT http://localhost:3000/mongo/users/<id> -H "Content-Type: application/json" -d '{"name":"Updated"}'
```

**Eliminar usuario:**
```bash
curl -X DELETE http://localhost:3000/mongo/users/<id>
```

## 📊 Modelos en MongoDB

### Modelos disponibles:

1. **User** - Usuarios del sistema
2. **Ticket** - Tickets de soporte
3. **AppSettings** - Configuraciones de la aplicación
4. **Product** - Productos del catálogo
5. **Order** - Órdenes de compra

### Relaciones:

Las relaciones se manejan vía `ObjectId` (`userId`, `productId`). Prisma en MongoDB no soporta joins nativos, solo referencias manuales.

- `Ticket.userId` → referencia a `User.id`
- `Order.userId` → referencia a `User.id`
- `Order.productId` → referencia a `Product.id`

## 🎫 CRUD Ticket Mongo

### Endpoints disponibles:

**Crear ticket:**
```bash
curl -X POST http://localhost:3000/mongo/tickets -H "Content-Type: application/json" -d '{"title":"Soporte técnico","userId":"<UserId>"}'
```

**Listar tickets:**
```bash
curl http://localhost:3000/mongo/tickets
```

**Actualizar ticket:**
```bash
curl -X PUT http://localhost:3000/mongo/tickets/<id> -H "Content-Type: application/json" -d '{"title":"Nuevo título"}'
```

**Eliminar ticket:**
```bash
curl -X DELETE http://localhost:3000/mongo/tickets/<id>
```

## ⚙️ CRUD AppSettings Mongo

### Endpoints disponibles:

**Crear configuración:**
```bash
curl -X POST http://localhost:3000/mongo/settings -H "Content-Type: application/json" -d '{"key":"theme","value":"dark"}'
```

**Listar configuraciones:**
```bash
curl http://localhost:3000/mongo/settings
```

**Actualizar configuración:**
```bash
curl -X PUT http://localhost:3000/mongo/settings/<id> -H "Content-Type: application/json" -d '{"value":"light"}'
```

**Eliminar configuración:**
```bash
curl -X DELETE http://localhost:3000/mongo/settings/<id>
```

## 🛒 CRUD Product Mongo

### Endpoints disponibles:

**Crear producto:**
```bash
curl -X POST http://localhost:3000/mongo/products -H "Content-Type: application/json" -d '{"name":"Laptop","price":1200}'
```

**Listar productos:**
```bash
curl http://localhost:3000/mongo/products
```

**Actualizar producto:**
```bash
curl -X PUT http://localhost:3000/mongo/products/<id> -H "Content-Type: application/json" -d '{"price":999}'
```

**Eliminar producto:**
```bash
curl -X DELETE http://localhost:3000/mongo/products/<id>
```

## 📦 CRUD Order Mongo

### Endpoints disponibles:

**Crear orden:**
```bash
curl -X POST http://localhost:3000/mongo/orders -H "Content-Type: application/json" -d '{"userId":"<UserId>","productId":"<ProductId>"}'
```

**Listar órdenes:**
```bash
curl http://localhost:3000/mongo/orders
```

**Actualizar orden:**
```bash
curl -X PUT http://localhost:3000/mongo/orders/<id> -H "Content-Type: application/json" -d '{"productId":"<AnotherProductId>"}'
```

**Eliminar orden:**
```bash
curl -X DELETE http://localhost:3000/mongo/orders/<id>
```

### 🚀 Comandos de Desarrollo

```bash

# Instalar dependencias (si no las tienes)
npm install

# Desarrollo con auto-reload + migración automática
npm run dev

# Solo aplicar cambios de schema
npm run db:push

# Ejecutar tests
npm test

# Producción
npm start
```