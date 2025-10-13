/**
 * Constantes relacionadas con la API
 */

export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_TICKETS: (id) => `/users/${id}/tickets`,
  
  // Tickets
  TICKETS: '/tickets',
  TICKET_BY_ID: (id) => `/tickets/${id}`,
  
  // Stats
  STATS: '/stats',
  STATS_BY_STATUS: '/stats/count-by-status'
};

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  JSON: 'application/json'
};




