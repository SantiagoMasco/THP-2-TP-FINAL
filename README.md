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