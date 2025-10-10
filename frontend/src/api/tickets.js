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

/**
 * Crea un nuevo ticket
 * @param {Object} data - Datos del ticket a crear
 * @param {string} data.title - Título del ticket (obligatorio)
 * @param {string} data.body - Descripción del ticket (obligatorio)
 * @param {number} [data.userId] - ID del usuario creador (usa getDefaultUserId() si no se proporciona)
 * @param {string} [data.priority] - Prioridad del ticket ('low' | 'med' | 'high')
 * @param {string} [data.category] - Categoría del ticket
 * @returns {Promise<Object>} Ticket creado
 */
export const createTicket = async (data) => {
  const {
    title,
    body,
    userId = getDefaultUserId(),
    priority,
    category
  } = data;

  // Construir body del request
  const requestBody = {
    title,
    body,
    userId
  };

  // Agregar campos opcionales si están presentes
  if (priority) requestBody.priority = priority;
  if (category) requestBody.category = category;

  // Hacer request al endpoint
  return await request('/tickets', {
    method: 'POST',
    body: requestBody
  });
};

/**
 * Actualiza el estado de un ticket SQLite
 * @param {number} ticketId - ID del ticket
 * @param {string} status - Nuevo estado ('open' | 'in_progress' | 'resolved' | 'closed')
 * @returns {Promise<Object>} Ticket actualizado
 */
export const updateTicketStatus = async (ticketId, status) => {
  return await request(`/tickets/${ticketId}`, {
    method: 'PUT',
    body: { status }
  });
};
