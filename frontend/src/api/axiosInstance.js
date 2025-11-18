import axios from 'axios';
import { getApiBaseUrl, getAuthToken } from '../_helpers/index.js';

/**
 * Instancia centralizada de Axios para todas las peticiones API
 */
const axiosInstance = axios.create({
  baseURL: 'https://thp-2-tp-final.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de request para agregar token de autorización
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response para manejo de errores centralizado
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // Error del servidor con respuesta
      const errorMessage = error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`;
      error.message = errorMessage;
    } else if (error.request) {
      // Error de red (no hay respuesta)
      error.message = 'Error de conexión. Verifica que el servidor esté corriendo.';
    } else {
      // Error en la configuración de la petición
      error.message = error.message || 'Error inesperado';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;






