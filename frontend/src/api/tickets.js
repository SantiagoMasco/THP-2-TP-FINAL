import { supabase, handleSupabaseError } from '../lib/supabaseClient.js';
import { getDefaultUserId } from '../_helpers/index.js';
import { getNextAgent } from './settings.js';

/**
 * API wrapper para operaciones de tickets usando Supabase
 * Mantiene las mismas firmas que la versión anterior para compatibilidad
 */

/**
 * Obtiene los tickets de un usuario específico
 * @param {Object} params - Parámetros de la consulta
 * @param {number} [params.userId] - ID del usuario (usa getDefaultUserId() si no se proporciona)
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.pageSize=20] - Tamaño de página (máximo 50)
 * @param {string} [params.scope='assigned'] - Scope de tickets ('assigned' | 'created' | 'all')
 * @param {string} [params.status] - Filtro por status (opcional)
 * @param {string} [params.search] - Búsqueda en título/descripción (opcional)
 * @returns {Promise<Object>} Respuesta con tickets y metadatos de paginación
 */
export const getUserTickets = async (params = {}) => {
  try {
    const {
      userId = getDefaultUserId(),
      page = 1,
      pageSize = 20,
      scope = 'assigned',
      status,
      search
    } = params;

    // Construir query base
    // Intentamos hacer JOIN con usuarios, si falla haremos consulta simple
    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' });

    // Aplicar filtro de scope
    if (scope === 'assigned') {
      query = query.eq('assigned_user_id', userId);
    } else if (scope === 'created') {
      query = query.eq('created_by_user_id', userId);
    } else if (scope === 'all') {
      // No filtrar por usuario, mostrar todos
    }

    // Aplicar filtro de status si existe
    if (status && status.trim() !== '') {
      query = query.eq('status', status);
    }

    // Aplicar búsqueda si existe
    if (search && search.trim() !== '') {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.order('created_at', { ascending: false });

    // Aplicar paginación
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: tickets, error, count } = await query;

    if (error) throw error;

    // Obtener IDs únicos de usuarios para hacer consulta separada
    const userIds = new Set();
    (tickets || []).forEach(ticket => {
      if (ticket.created_by_user_id) userIds.add(ticket.created_by_user_id);
      if (ticket.assigned_user_id) userIds.add(ticket.assigned_user_id);
    });

    // Obtener usuarios en una sola consulta
    let usersMap = {};
    if (userIds.size > 0) {
      const userIdsArray = Array.from(userIds);
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', userIdsArray);
      
      if (usersError) {
        console.warn('Error al obtener usuarios:', usersError);
      }
      
      if (users && users.length > 0) {
        usersMap = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        console.log('Usuarios obtenidos:', usersMap);
      } else {
        console.warn('No se encontraron usuarios para los IDs:', userIdsArray);
      }
    }

    // Transformar los datos agregando información de usuarios
    const transformedData = (tickets || []).map(ticket => ({
      ...ticket,
      // Agregar nombres de usuario de forma plana para compatibilidad
      created_by_name: usersMap[ticket.created_by_user_id]?.name || null,
      created_by_email: usersMap[ticket.created_by_user_id]?.email || null,
      assigned_to_name: usersMap[ticket.assigned_user_id]?.name || null,
      assigned_to_email: usersMap[ticket.assigned_user_id]?.email || null,
      // Mantener los objetos completos también
      created_by_user: usersMap[ticket.created_by_user_id] || null,
      assigned_user: usersMap[ticket.assigned_user_id] || null
    }));

    // Calcular si hay más páginas
    const hasNext = count > (page * pageSize);

    return {
      data: transformedData,
      hasNext,
      total: count || 0
    };
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Crea un nuevo ticket
 * @param {Object} data - Datos del ticket a crear
 * @param {string} data.title - Título del ticket (obligatorio)
 * @param {string} data.body - Descripción del ticket (obligatorio)
 * @param {number} [data.userId] - ID del usuario creador (usa getDefaultUserId() si no se proporciona)
 * @param {string} [data.priority] - Prioridad del ticket ('low' | 'med' | 'high')
 * @param {string} [data.category] - Categoría del ticket
 * @returns {Promise<Object>} Ticket creado
 */
export const createTicket = async (data) => {
  try {
    const {
      title,
      body,
      userId = getDefaultUserId(),
      priority,
      category
    } = data;

    // Auto-asignación round-robin a un AGENT
    const nextAgent = await getNextAgent();
    const assignedUserId = nextAgent ? nextAgent.id : null;

    const ticketData = {
      title,
      description: body, // Supabase usa 'description', el frontend usa 'body'
      created_by_user_id: userId,
      assigned_user_id: assignedUserId, // Asignar agente automáticamente
      status: 'open',
      priority: priority || 'med'
    };

    if (category) ticketData.category = category;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single();

    if (error) throw error;

    return ticket;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

/**
 * Actualiza el estado de un ticket
 * @param {number} ticketId - ID del ticket
 * @param {string} status - Nuevo estado ('open' | 'in_progress' | 'resolved' | 'closed')
 * @returns {Promise<Object>} Ticket actualizado
 */
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const updateData = { status };
    
    // Si se resuelve, agregar fecha de resolución
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};
