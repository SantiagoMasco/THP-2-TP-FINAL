/**
 * Helpers para construcción de queries comunes
 * Funciones pequeñas y específicas para evitar duplicación
 */

/**
 * Construye filtros de rango de fechas con validación consistente
 * @param {Object} input - Input con from/to opcionales
 * @param {string} input.from - Fecha de inicio (formato ISO string)
 * @param {string} input.to - Fecha de fin (formato ISO string) 
 * @returns {Object|null} - Objeto createdAt para usar en where, o null si no hay fechas
 * @throws {Error} - Si las fechas tienen formato inválido
 */
function buildDateRange(input) {
  const { from, to } = input;
  
  // Si no hay fechas, retornar null
  if (!from && !to) {
    return null;
  }

  const dateRange = {};

  // Validar y construir fecha desde
  if (from) {
    const fromDate = new Date(from);
    if (isNaN(fromDate.getTime())) {
      throw new Error("Invalid date format");
    }
    dateRange.gte = fromDate;
  }

  // Validar y construir fecha hasta
  if (to) {
    const toDate = new Date(to);
    if (isNaN(toDate.getTime())) {
      throw new Error("Invalid date format");
    }
    dateRange.lte = toDate;
  }

  return dateRange;
}

/**
 * Construye paginación básica con validación
 * @param {Object} input - Input con page opcional
 * @param {number} pageSize - Tamaño de página fijo
 * @returns {Object} - { page, pageSize, skip, take }
 */
function buildPagination(input, pageSize = 20) {
  const page = Math.max(1, parseInt(input.page, 10) || 1);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return {
    page,
    pageSize, 
    skip,
    take
  };
}

/**
 * Aplica filtro de fecha al objeto where si hay rango de fechas válido
 * @param {Object} where - Objeto where a modificar
 * @param {Object} input - Input con from/to opcionales
 * @param {string} fieldName - Nombre del campo de fecha (default: 'createdAt')
 * @throws {Error} - Si las fechas tienen formato inválido
 */
function applyDateFilter(where, input, fieldName = 'createdAt') {
  const dateRange = buildDateRange(input);
  if (dateRange) {
    where[fieldName] = dateRange;
  }
}

module.exports = {
  buildDateRange,
  buildPagination,
  applyDateFilter
};
