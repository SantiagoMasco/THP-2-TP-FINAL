import axiosInstance from './axiosInstance.js';

/**
 * API para operaciones de usuarios usando Axios
 */

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

/**
 * Obtiene un usuario por ID
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Usuario
 */
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.name - Nombre del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.role - Rol del usuario (USER | AGENT | ADMIN)
 * @returns {Promise<Object>} Usuario creado
 */
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

/**
 * Actualiza un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(`/users/${userId}`, userData);
  return response.data;
};

/**
 * Desactiva un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Usuario desactivado
 */
export const deactivateUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};




