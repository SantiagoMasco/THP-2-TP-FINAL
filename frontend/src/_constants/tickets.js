/**
 * Constantes relacionadas con tickets
 */

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.OPEN]: 'Abierto',
  [TICKET_STATUS.IN_PROGRESS]: 'En progreso',
  [TICKET_STATUS.RESOLVED]: 'Resuelto',
  [TICKET_STATUS.CLOSED]: 'Cerrado'
};

export const TICKET_STATUS_COLORS = {
  [TICKET_STATUS.OPEN]: '#d1ecf1',
  [TICKET_STATUS.IN_PROGRESS]: '#fff3cd',
  [TICKET_STATUS.RESOLVED]: '#d4edda',
  [TICKET_STATUS.CLOSED]: '#f8d7da'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'med',
  HIGH: 'high'
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITY.LOW]: 'Baja',
  [TICKET_PRIORITY.MEDIUM]: 'Media',
  [TICKET_PRIORITY.HIGH]: 'Alta'
};

export const TICKET_SCOPE = {
  ASSIGNED: 'assigned',
  CREATED: 'created'
};

export const TICKET_SCOPE_LABELS = {
  [TICKET_SCOPE.ASSIGNED]: 'Asignados a mí',
  [TICKET_SCOPE.CREATED]: 'Creados por mí'
};

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;
export const MIN_PAGE_SIZE = 1;




