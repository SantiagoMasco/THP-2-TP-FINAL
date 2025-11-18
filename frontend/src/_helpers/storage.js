import { STORAGE_KEYS, DEFAULT_VALUES } from '../_constants/index.js';

/**
 * Helpers para manejo de localStorage
 */

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base de la API
 */
export const getApiBaseUrl = () => {
  return 'https://thp-2-tp-final.onrender.com';
};

/**
 * Obtiene el ID del usuario por defecto
 * @returns {number} ID del usuario
 */
export const getDefaultUserId = () => {
  return Number(localStorage.getItem(STORAGE_KEYS.DEFAULT_USER_ID) ?? DEFAULT_VALUES.DEFAULT_USER_ID);
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token JWT o null si no existe
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? null;
};

/**
 * Guarda el token de autenticación
 * @param {string} token - Token JWT
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

/**
 * Obtiene el usuario guardado
 * @returns {Object|null} Usuario o null
 */
export const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error al cargar usuario desde localStorage:', error);
    return null;
  }
};

/**
 * Guarda el usuario en localStorage
 * @param {Object|null} user - Usuario a guardar
 */
export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  } catch (error) {
    console.error('Error al guardar usuario en localStorage:', error);
  }
};

/**
 * Limpia todos los datos de autenticación
 */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
};






