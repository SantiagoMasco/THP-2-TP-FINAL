import { supabase, handleSupabaseError } from '../lib/supabaseClient.js';

/**
 * API para operaciones de usuarios usando Supabase
 * Mantiene las mismas firmas que la versión anterior para compatibilidad
 */

/**
 * Busca usuarios por email (para login)
 * @param {string} email - Email del usuario
 * @returns {Promise<Array>} Lista de usuarios encontrados
 */
export const getUsersByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('active', true);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, active, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Obtiene un usuario por ID
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Usuario
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, active, created_at, updated_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
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
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        role: userData.role || 'USER',
        active: true
      })
      .select('id, name, email, role, active, created_at, updated_at')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Actualiza un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (userId, userData) => {
  try {
    const updateData = {};
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.role !== undefined) updateData.role = userData.role;
    if (userData.active !== undefined) updateData.active = userData.active;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, name, email, role, active, created_at, updated_at')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Desactiva un usuario (marca active = false)
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Usuario desactivado
 */
export const deactivateUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ active: false })
      .eq('id', userId)
      .select('id, name, email, role, active, created_at, updated_at')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};
