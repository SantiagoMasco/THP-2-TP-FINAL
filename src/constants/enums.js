/**
 * Constantes centralizadas para la aplicación
 * Fuente única de verdad para enums y valores válidos
 */

const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress', 
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'med',
  HIGH: 'high'
};

const USER_ROLE = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  USER: 'USER'
};

const TICKET_SCOPE = {
  ASSIGNED: 'assigned',
  CREATED: 'created'
};

// Arrays para validaciones
const VALID_TICKET_STATUSES = Object.values(TICKET_STATUS);
const VALID_TICKET_PRIORITIES = Object.values(TICKET_PRIORITY);
const VALID_USER_ROLES = Object.values(USER_ROLE);
const VALID_TICKET_SCOPES = Object.values(TICKET_SCOPE);

// Defaults
const DEFAULT_TICKET_STATUS = TICKET_STATUS.OPEN;
const DEFAULT_TICKET_PRIORITY = TICKET_PRIORITY.MEDIUM;
const DEFAULT_USER_ROLE = USER_ROLE.USER;
const DEFAULT_TICKET_SCOPE = TICKET_SCOPE.ASSIGNED;

module.exports = {
  TICKET_STATUS,
  TICKET_PRIORITY,
  USER_ROLE,
  TICKET_SCOPE,
  VALID_TICKET_STATUSES,
  VALID_TICKET_PRIORITIES,
  VALID_USER_ROLES,
  VALID_TICKET_SCOPES,
  DEFAULT_TICKET_STATUS,
  DEFAULT_TICKET_PRIORITY,
  DEFAULT_USER_ROLE,
  DEFAULT_TICKET_SCOPE
};
