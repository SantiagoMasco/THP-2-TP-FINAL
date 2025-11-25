# MVP GESTIENDO USUARIOS

## Frontend

> **Qué es:** MVP (mínimo producto viable) para gestionar usuarios y tickets desde la interfaz web. Construido en **React + Vite**.

---

## 1) Cómo correr el frontend localmente

```bash
# 1) Instalar dependencias
npm install

# 2) Levantar en modo desarrollo
npm run dev
```

* **Variables de entorno:** este frontend usa Supabase. Configura las variables en `.env` (ver `SUPABASE_SETUP.md`).
* Abrí la URL que muestra Vite (por ej. `http://localhost:5173`).

---

## 2) Dependencias principales (una línea por lib)

* **React** → Librería para construir la interfaz (UI).
* **Vite** → Dev server y build rápido para React.
* **React Router DOM** → Navegación entre pantallas sin recargar.
* **@supabase/supabase-js** → Cliente para conectarse directamente a Supabase (base de datos).
* **Zustand** → Estado global simple (ej: usuario logueado, token).
* **@tanstack/react-query** → Cache y sincronización de datos del servidor (loading, error, refetch).
* **ESLint** → Reglas básicas de calidad de código (opcional en el flujo de dev).

---

## 3) Hooks (qué son y cuáles usamos)

**Idea simple:** un *hook* es una función especial que te da superpoderes en componentes.

### Hooks de React (built-in)

* **`useState`** → Guardar y actualizar valores dentro del componente (ej: `const [open, setOpen] = useState(false)`).
* **`useEffect`** → Ejecutar algo cuando el componente se monta o cambian dependencias (ej: pedir datos al cargar una página).

### Hooks personalizados (custom)

* **`useAuth`** → Encapsula login, logout, usuario actual y manejo de token (usa Zustand + localStorage).
* **`useTickets`** → Lógica para listar/crear/actualizar tickets (usa useEffect + Axios, maneja paginación, filtros y búsqueda con debounce).

> Por qué custom hooks: evitan repetir lógica y dejan los componentes más limpios.

---

## 4) Estado global con Zustand (simple y directo)

* **Qué guarda:** datos compartidos entre pantallas (ej: `user`, `token`, funciones `login/logout`).
* **Por qué Zustand:** sintaxis mínima, sin boilerplate, rendimiento sólido.
* **Cómo se usa en la práctica:** cualquier componente puede leer/escribir `user` sin pasar props por todos lados.

> **Nota:** Se usa principalmente para mantener el estado de autenticación y datos del usuario logueado accesibles en toda la aplicación.

---

## 5) Data Fetching con Supabase

* **Supabase** se conecta directamente a la base de datos PostgreSQL.
* Las funciones en `src/api/` usan el cliente de Supabase para:
  * **Consultas** (SELECT) con filtros, paginación y búsqueda
  * **Inserción** (INSERT) de nuevos registros
  * **Actualización** (UPDATE) de registros existentes
  * **Eliminación** (DELETE) o desactivación de registros

> **Nota:** El frontend ahora se conecta directamente a Supabase, sin necesidad del backend Node.js. Ver `SUPABASE_SETUP.md` para configuración.

---

## 6) Routing con React Router DOM

* Permite cambiar entre pantallas (ej: `/login`, `/users`, `/tickets`) **sin recargar** el navegador.
* Se define una ruta por pantalla y se usan links/botones para navegar.
* Soporta rutas protegidas mediante el componente `ProtectedRoute` para controlar acceso por autenticación.

---

## 7) Componentes (qué son y cómo los usamos)

* **Qué es un componente:** una **función** que devuelve una parte de la interfaz (un botón, un formulario, una página).
* **Cuándo crear uno:** cuando una parte se repite o conviene separar la UI (reutilizable o por claridad).
* **Ejemplos típicos:** `LoginPage`, `UsersManager`, `TicketsPage`, `Modal`, `Spinner`, `Pagination`.

---

## 8) Patrones aplicados (en 1 línea cada uno)

* **Contenedor/Presentacional** → separo lógica (datos/acciones) de la UI (render).
* **Hooks personalizados** → empaqueto lógica repetida (auth, tickets).
* **Atomic thinking** (en pequeño) → piezas simples (botón/input) que se combinan en secciones/páginas.
* **Singleton (store)** → un único **store** global (Zustand) para el estado compartido.

---

## 9) Resumen técnico

El frontend está construido con **React + Vite**. Utiliza **Supabase** para conectarse directamente a la base de datos PostgreSQL, **Zustand** para gestión del estado global (autenticación y sesión de usuario) y **React Router DOM** para navegación en una Single Page Application (SPA). Los tickets usan hooks personalizados (`useTickets`) con `useEffect` para manejo de datos y estados. **React Query** está configurado pero actualmente no se usa activamente.
