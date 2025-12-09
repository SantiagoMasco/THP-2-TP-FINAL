import { supabase, handleSupabaseError } from '../lib/supabaseClient.js';

/**
 * API para operaciones de configuración usando Supabase
 * Maneja la lógica de round-robin para asignación automática de agentes
 */

/**
 * Obtiene la configuración de la aplicación
 * Si no existe, la crea con valores por defecto
 * @returns {Promise<Object>} Configuración de la aplicación
 */
export const getSettings = async () => {
  try {
    // Intentar obtener la configuración existente
    const { data: settings, error: fetchError } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1)
      .single();

    // Si no existe, crear una nueva configuración
    if (fetchError && fetchError.code === 'PGRST116') {
      const { data: newSettings, error: createError } = await supabase
        .from('app_settings')
        .insert({
          last_assigned_agent_id: null
        })
        .select()
        .single();

      if (createError) throw createError;
      return newSettings;
    }

    if (fetchError) throw fetchError;
    return settings;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Actualiza el último agente asignado
 * @param {number} agentId - ID del agente
 * @returns {Promise<Object>} Configuración actualizada
 */
export const updateLastAssignedAgent = async (agentId) => {
  try {
    const settings = await getSettings();
    
    const { data, error } = await supabase
      .from('app_settings')
      .update({
        last_assigned_agent_id: agentId
      })
      .eq('id', settings.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Obtiene el siguiente agente usando round-robin
 * Rota entre agentes activos de forma circular
 * @returns {Promise<Object|null>} Siguiente agente o null si no hay agentes disponibles
 */
export const getNextAgent = async () => {
  try {
    // Obtener agentes activos ordenados por id ASC
    const { data: agents, error: agentsError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'AGENT')
      .eq('active', true)
      .order('id', { ascending: true });

    if (agentsError) throw agentsError;

    if (!agents || agents.length === 0) {
      return null; // No hay agentes disponibles
    }

    // Obtener configuración actual
    const settings = await getSettings();
    const lastAssignedId = settings?.last_assigned_agent_id;

    let nextAgent = null;

    if (!lastAssignedId) {
      // Primera asignación: usar el primer agente
      nextAgent = agents[0];
    } else {
      // Buscar el índice del último agente asignado
      const lastIndex = agents.findIndex(agent => agent.id === lastAssignedId);

      if (lastIndex === -1 || lastIndex === agents.length - 1) {
        // Si no se encuentra o es el último, volver al primero (round-robin)
        nextAgent = agents[0];
      } else {
        // Usar el siguiente agente
        nextAgent = agents[lastIndex + 1];
      }
    }

    // Actualizar el último agente asignado
    if (nextAgent) {
      await updateLastAssignedAgent(nextAgent.id);
    }

    return nextAgent;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

