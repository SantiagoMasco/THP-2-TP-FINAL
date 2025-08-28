/**
 * Configuración de variables de entorno desde localStorage
 * 
 * Para configurar desde la consola del navegador:
 * localStorage.setItem('API_BASE_URL', 'http://localhost:3000')
 * localStorage.setItem('DEFAULT_USER_ID', '1')
 * localStorage.setItem('AUTH_TOKEN', 'tu-jwt-token-aqui')
 */

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base de la API
 */
export const getApiBaseUrl = () => {
  return localStorage.getItem('API_BASE_URL') ?? 'http://localhost:3000';
};

/**
 * Obtiene el ID del usuario por defecto
 * @returns {number} ID del usuario
 */
export const getDefaultUserId = () => {
  return Number(localStorage.getItem('DEFAULT_USER_ID') ?? 1);
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token JWT o null si no existe
 */
export const getAuthToken = () => {
  return localStorage.getItem('AUTH_TOKEN') ?? null;
};
