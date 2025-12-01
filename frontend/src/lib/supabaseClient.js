import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase
 * Configuración centralizada para todas las operaciones de base de datos
 */

// Variable privada para almacenar la instancia única
let supabaseInstance = null;

/**
 * Obtiene la instancia única del cliente de Supabase (Singleton)
 * @returns {Object} Instancia del cliente de Supabase
 */
const getSupabaseClient = () => {
  // Si ya existe una instancia, retornarla
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Obtener las variables de entorno
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // Validar que existan las variables de entorno
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables de entorno de Supabase no configuradas');
  }

  // Crear la instancia única del cliente
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseInstance;
};

/**
 * Todas las importaciones obtendrán la misma instancia
 */
export const supabase = getSupabaseClient();

/**
 * Helper para manejar errores de Supabase
 */
export const handleSupabaseError = (error) => {
  if (error?.message) {
    return error.message;
  }
  if (error?.error_description) {
    return error.error_description;
  }
  return 'Error desconocido en la base de datos';
};

