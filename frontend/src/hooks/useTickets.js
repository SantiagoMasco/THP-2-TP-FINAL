import { useState, useEffect } from 'react';
import { getUserTickets } from '../api/tickets.js';
import { getDefaultUserId } from '../config/env.js';

/**
 * Hook personalizado para manejar el estado y fetching de tickets
 * @returns {Object} Estado y funciones para manejar tickets
 */
export const useTickets = () => {
  // Estados principales
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [scope, setScope] = useState('assigned');
  const [status, setStatus] = useState('');
  const [hasNext, setHasNext] = useState(false);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener userId por defecto
  const userId = getDefaultUserId();

  /**
   * Función para cargar tickets
   */
  const loadTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUserTickets({
        userId,
        page,
        pageSize,
        scope,
        status
      });

      setItems(response.data);
      setHasNext(response.hasNext);
    } catch (err) {
      setError(err.message);
      setItems([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para refrescar datos
   */
  const refresh = () => {
    loadTickets();
  };

  // Efecto para cargar tickets cuando cambian los parámetros
  useEffect(() => {
    loadTickets();
  }, [userId, page, pageSize, scope, status]);

  return {
    // Estados
    items,
    page,
    pageSize,
    scope,
    status,
    hasNext,
    loading,
    error,
    
    // Setters
    setPage,
    setPageSize,
    setScope,
    setStatus,
    
    // Funciones
    refresh
  };
};
