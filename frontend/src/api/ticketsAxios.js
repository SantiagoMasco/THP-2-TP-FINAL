import axiosInstance from './axiosInstance.js';
import { getDefaultUserId } from '../_helpers/index.js';

/**
 * API para operaciones de tickets usando Axios
 */

/**
 * Obtiene los tickets de un usuario específico
 * @param {Object} params - Parámetros de la consulta
 * @param {number} [params.userId] - ID del usuario
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.pageSize=20] - Tamaño de página
 * @param {string} [params.scope='assigned'] - Scope de tickets ('assigned' | 'created')
 * @param {string} [params.status] - Filtro por status
 * @returns {Promise<Object>} Respuesta con tickets y metadatos
 */
export const getUserTickets = async (params = {}) => {
  const {
    userId = getDefaultUserId(),
    page = 1,
    pageSize = 20,
    scope = 'assigned',
    status
  } = params;

  const queryParams = { page, pageSize, scope };
  if (status && status.trim() !== '') {
    queryParams.status = status;
  }

  const response = await axiosInstance.get(`/users/${userId}/tickets`, {
    params: queryParams
  });
  
  return response.data;
};

/**
 * Crea un nuevo ticket
 * @param {Object} data - Datos del ticket
 * @param {string} data.title - Título del ticket
 * @param {string} data.body - Descripción del ticket
 * @param {number} data.userId - ID del usuario creador
 * @param {string} [data.priority] - Prioridad ('low' | 'med' | 'high')
 * @param {string} [data.category] - Categoría del ticket
 * @returns {Promise<Object>} Ticket creado
 */
export const createTicket = async (data) => {
  const {
    title,
    body,
    userId,
    priority,
    category
  } = data;

  const requestBody = {
    title,
    body,
    userId
  };

  if (priority) requestBody.priority = priority;
  if (category) requestBody.category = category;

  const response = await axiosInstance.post('/tickets', requestBody);
  return response.data;
};

/**
 * Actualiza el estado de un ticket
 * @param {number} ticketId - ID del ticket
 * @param {string} status - Nuevo estado
 * @returns {Promise<Object>} Ticket actualizado
 */
export const updateTicketStatus = async (ticketId, status) => {
  const response = await axiosInstance.put(`/tickets/${ticketId}`, { status });
  return response.data;
};

/**
 * Obtiene un ticket por ID
 * @param {number} ticketId - ID del ticket
 * @returns {Promise<Object>} Ticket
 */
export const getTicketById = async (ticketId) => {
  const response = await axiosInstance.get(`/tickets/${ticketId}`);
  return response.data;
};

/**
 * Elimina un ticket
 * @param {number} ticketId - ID del ticket
 * @returns {Promise<void>}
 */
export const deleteTicket = async (ticketId) => {
  const response = await axiosInstance.delete(`/tickets/${ticketId}`);
  return response.data;
};




