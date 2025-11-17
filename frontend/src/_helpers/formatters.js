import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '../_constants/index.js';

/**
 * Helpers para formateo de datos
 */

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '-';
  }
};

/**
 * Formatea un estado de ticket a su etiqueta
 * @param {string} status - Estado del ticket
 * @returns {string} Etiqueta del estado
 */
export const formatTicketStatus = (status) => {
  return TICKET_STATUS_LABELS[status] || status;
};

/**
 * Formatea una prioridad de ticket a su etiqueta
 * @param {string} priority - Prioridad del ticket
 * @returns {string} Etiqueta de la prioridad
 */
export const formatTicketPriority = (priority) => {
  return TICKET_PRIORITY_LABELS[priority] || priority;
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formatea un nombre de usuario
 * @param {Object} user - Usuario
 * @returns {string} Nombre formateado
 */
export const formatUserName = (user) => {
  if (!user) return 'N/A';
  return user.name || user.email || `Usuario #${user.id}`;
};






