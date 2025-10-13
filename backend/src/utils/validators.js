const { 
  VALID_TICKET_STATUSES, 
  VALID_TICKET_PRIORITIES, 
  VALID_USER_ROLES,
  VALID_TICKET_SCOPES 
} = require('../constants/enums');

/**
 * Validador de IDs - garantiza que sea un número entero válido
 * @param {*} id - El ID a validar
 * @param {string} fieldName - Nombre del campo para el mensaje de error
 * @returns {number} - ID parseado como entero
 * @throws {Error} - Si el ID no es válido
 */
function validateId(id, fieldName = 'id') {
  if (!id || isNaN(parseInt(id))) {
    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    throw new Error(`Valid ${capitalizedField} is required`);
  }
  return parseInt(id);
}

/**
 * Validador de roles de usuario
 * @param {string} role - El rol a validar
 * @throws {Error} - Si el rol no es válido
 */
function validateRole(role) {
  if (role && !VALID_USER_ROLES.includes(role)) {
    throw new Error(`Role must be ${VALID_USER_ROLES.join(', ')}`);
  }
}

/**
 * Validador de prioridad de ticket
 * @param {string} priority - La prioridad a validar
 * @throws {Error} - Si la prioridad no es válida
 */
function validatePriority(priority) {
  if (priority && !VALID_TICKET_PRIORITIES.includes(priority)) {
    throw new Error(`Priority must be ${VALID_TICKET_PRIORITIES.join(', ')}`);
  }
}

/**
 * Validador de estado de ticket
 * @param {string} status - El estado a validar
 * @throws {Error} - Si el estado no es válido
 */
function validateStatus(status) {
  if (status && !VALID_TICKET_STATUSES.includes(status)) {
    throw new Error(`Status must be ${VALID_TICKET_STATUSES.join(', ')}`);
  }
}

/**
 * Validador de scope para tickets de usuario
 * @param {string} scope - El scope a validar
 * @returns {string} - Scope validado
 * @throws {Error} - Si el scope no es válido
 */
function validateScope(scope) {
  if (scope && !VALID_TICKET_SCOPES.includes(scope)) {
    throw new Error(`Scope must be ${VALID_TICKET_SCOPES.join(' or ')}`);
  }
  return scope;
}

/**
 * Parser de página con validación
 * @param {*} page - El número de página a parsear
 * @returns {number} - Página válida (mínimo 1)
 */
function parsePage(page) {
  return Math.max(1, parseInt(page, 10) || 1);
}

/**
 * Parser de pageSize con validación y límites
 * @param {*} pageSize - El tamaño de página a parsear
 * @param {number} defaultSize - Tamaño por defecto
 * @param {number} maxSize - Tamaño máximo permitido
 * @returns {number} - PageSize válido dentro de los límites
 */
function parsePageSize(pageSize, defaultSize = 20, maxSize = 50) {
  let size = parseInt(pageSize, 10) || defaultSize;
  return Math.max(1, Math.min(size, maxSize));
}

/**
 * Validador de strings requeridos
 * @param {*} value - El valor a validar
 * @param {string} fieldName - Nombre del campo para el error
 * @throws {Error} - Si el valor no es válido
 */
function validateRequiredString(value, fieldName) {
  if (!value || typeof value !== 'string') {
    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    throw new Error(`${capitalizedField} is required and must be a string`);
  }
}

/**
 * Validador de números opcionales
 * @param {*} value - El valor a validar
 * @param {string} fieldName - Nombre del campo para el error
 * @throws {Error} - Si el valor no es válido
 */
function validateOptionalNumber(value, fieldName) {
  if (value && isNaN(parseInt(value))) {
    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    throw new Error(`${capitalizedField} must be a number`);
  }
}

/**
 * Validador de booleanos opcionales
 * @param {*} value - El valor a validar
 * @param {string} fieldName - Nombre del campo para el error
 * @throws {Error} - Si el valor no es válido
 */
function validateOptionalBoolean(value, fieldName) {
  if (value !== undefined && typeof value !== 'boolean') {
    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    throw new Error(`${capitalizedField} must be a boolean`);
  }
}

module.exports = {
  validateId,
  validateRole,
  validatePriority,
  validateStatus,
  validateScope,
  parsePage,
  parsePageSize,
  validateRequiredString,
  validateOptionalNumber,
  validateOptionalBoolean
};
