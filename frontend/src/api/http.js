import { getApiBaseUrl, getAuthToken } from '../_helpers/index.js';

/**
 * Cliente HTTP para hacer requests a la API
 * @param {string} path - Ruta relativa de la API
 * @param {Object} options - Opciones del request
 * @param {string} [options.method='GET'] - Método HTTP
 * @param {Object} [options.params] - Parámetros de query string
 * @param {Object} [options.body] - Cuerpo del request
 * @returns {Promise<Object>} Respuesta de la API
 */
export const request = async (path, options = {}) => {
  const {
    method = 'GET',
    params,
    body
  } = options;

  // Construir URL absoluta
  const baseUrl = getApiBaseUrl();
  const url = new URL(path, baseUrl);

  // Agregar parámetros de query string
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  // Preparar headers
  const headers = {
    'Content-Type': 'application/json'
  };

  // Agregar token de autorización si existe
  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Preparar configuración del fetch
  const config = {
    method,
    headers
  };

  // Agregar body si existe
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), config);

    // Manejar errores HTTP
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Si no se puede parsear JSON, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    // Parsear respuesta JSON
    return await response.json();
  } catch (error) {
    // Re-lanzar errores para que los componentes los manejen
    throw error;
  }
};
