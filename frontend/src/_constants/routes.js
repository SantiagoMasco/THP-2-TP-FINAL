/**
 * Constantes de rutas de la aplicación
 */

export const ROUTES = {
  HOME: '/',
  TICKETS: '/tickets',
  TICKET_DETAIL: (id) => `/tickets/${id}`,
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
  PROFILE: '/profile',
  NOT_FOUND: '/404'
};

export const ROUTE_NAMES = {
  HOME: 'Inicio',
  TICKETS: 'Tickets',
  LOGIN: 'Iniciar Sesión',
  SIGNUP: 'Registrarse',
  ADMIN: 'Administración',
  PROFILE: 'Perfil'
};


