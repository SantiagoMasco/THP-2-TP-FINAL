import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase
 * Configuración centralizada para todas las operaciones de base de datos
 */

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(' Faltan variables de entorno de Supabase:');
}

/**
 * Cliente de Supabase para operaciones de base de datos
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

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

