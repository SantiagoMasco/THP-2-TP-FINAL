import { request } from './http.js';
import { getDefaultUserId } from '../config/env.js';

/**
 * API wrapper para operaciones de tickets
 */

/**
 * Obtiene los tickets de un usuario específico
 * @param {Object} params - Parámetros de la consulta
 * @param {number} [params.userId] - ID del usuario (usa getDefaultUserId() si no se proporciona)
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.pageSize=20] - Tamaño de página (máximo 50)
 * @param {string} [params.scope='assigned'] - Scope de tickets ('assigned' | 'created')
 * @param {string} [params.status] - Filtro por status (opcional)
 * @returns {Promise<Object>} Respuesta con tickets y metadatos de paginación
 */
export const getUserTickets = async (params = {}) => {
  const {
    userId = getDefaultUserId(),
    page = 1,
    pageSize = 20,
    scope = 'assigned',
    status
  } = params;

  // Construir parámetros de query
  const queryParams = {
    page,
    pageSize,
    scope
  };

  // Agregar status solo si se proporciona y no está vacío
  if (typeof status === 'string' && status.trim() !== '') {
    queryParams.status = status;
  }

  // Hacer request al endpoint
  return await request(`/users/${userId}/tickets`, {
    method: 'GET',
    params: queryParams
  });
};
