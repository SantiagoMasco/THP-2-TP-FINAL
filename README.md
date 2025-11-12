# HelpDesk Lite

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

* **Variables de entorno:** este frontend usa variables `.env`. Pedirle a **@santimasco**.
* Abrí la URL que muestra Vite (por ej. `http://localhost:5173`).

---

## 2) Dependencias principales

* **React** → Librería para construir la interfaz (UI).
* **Vite** → Dev server y build rápido para React.
* **React Router DOM** → Navegación entre pantallas sin recargar.
* **Axios** → Peticiones HTTP a la API (GET/POST/PUT/DELETE).
* **Zustand** → Estado global simple (ej: usuario logueado, token).
* **@tanstack/react-query** → Cache y sincronización de datos del servidor (loading, error, refetch).

---

## 3) Hooks

### Hooks de React usados

* **`useState`** → Guardar y actualizar valores dentro del componente (ej: `const [open, setOpen] = useState(false)`).
* **`useEffect`** → Ejecutar código después de que el componente se renderiza, ejecutándolo nuevamente solo cuando cambian los valores que especifiques (ej: pedir datos al cargar una página).

### Hooks personalizados (custom)

* **`useAuth`** → Encapsula login, logout, usuario actual y manejo de token (usa Zustand + localStorage).
* **`useTickets`** → Lógica para listar/crear/actualizar tickets (usa useEffect + Axios, maneja paginación, filtros y búsqueda con debounce).

> Por qué custom hooks: evitan repetir lógica y dejan los componentes más limpios.

---

## 4) Estado global con Zustand

* **Qué guarda:** datos compartidos entre pantallas (ej: `user`, `token`, funciones `login/logout`).
* **Por qué Zustand:** sintaxis mínima, sin boilerplate, rendimiento sólido.
* **Cómo se usa en la práctica:** cualquier componente puede leer/escribir `user` sin pasar props por todos lados.

> **Nota:** Se usa principalmente para mantener el estado de autenticación y datos del usuario logueado accesibles en toda la aplicación.

---

## 5) Data Fetching con React Query + Axios

* **Axios** hace la **petición** HTTP.
* **React Query** maneja:

  * **cache** (no repite pedidos innecesarios),
  * **estados** `isLoading / error`,
  * **refetch** e **invalidaciones** cuando creo/edito algo.

> **Nota:** React Query está configurado globalmente pero actualmente se usa principalmente en `UsersManager` para gestión de usuarios. Los tickets usan `useTickets` con `useEffect` para manejo manual de estados.

---

## 6) Routing con React Router DOM

* Permite cambiar entre pantallas (ej: `/login` y `/tickets`) **sin recargar** el navegador.
* Se define una ruta por pantalla y se usan links/botones para navegar.
* Soporta rutas protegidas mediante el componente `ProtectedRoute` para controlar acceso por autenticación.

---

## 7) Componentes

* **Qué es un componente:** una **función** que devuelve una parte de la interfaz (un botón, un formulario, una página).
* **Ejemplos típicos:** `LoginPage`, `UsersManager`, `TicketsPage`, `Modal`, `Spinner`, `Pagination`.

---

## 8) Patrones aplicados

* **Contenedor/Presentacional** → separo lógica (datos/acciones) de la UI (render).
* **Hooks personalizados** → empaqueto lógica repetida (auth, tickets).
* **Atomic thinking** (en pequeño) → piezas simples (botón/input) que se combinan en secciones/páginas.
* **Singleton (store)** → un único **store** global (Zustand) para el estado compartido.

---

## 9) Resumen técnico

El frontend está construido con **React + Vite**. Utiliza **Axios** para comunicación HTTP con la API, **Zustand** para gestión del estado global (autenticación y sesión de usuario) y **React Router DOM** para navegación en una Single Page Application (SPA). **React Query** está configurado y se emplea principalmente para cache y gestión de estados de carga/errores en `UsersManager` (usuarios), mientras que los tickets usan hooks personalizados (`useTickets`) con `useEffect` para manejo de datos y estados.
