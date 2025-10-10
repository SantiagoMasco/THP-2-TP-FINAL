import { useEffect, useMemo, useState } from 'react';
import { getUserTickets } from '../api/tickets.js';
import { getDefaultUserId } from '../_helpers/index.js';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '../_constants/index.js';

/**
 * Hook personalizado para manejar el estado y fetching de tickets
 * @returns {Object} Estado y funciones para manejar tickets
 */
export const useTickets = () => {
  // userId estable tomado una sola vez
  const [userId] = useState(() => getDefaultUserId());

  // estados principales
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSizeRaw, setPageSizeRaw] = useState(DEFAULT_PAGE_SIZE);
  const [scope, setScope] = useState('assigned');
  const [status, setStatus] = useState('');
  const [hasNext, setHasNext] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // normalizado a string

  // clamp de pageSize a [MIN_PAGE_SIZE, MAX_PAGE_SIZE]
  const pageSize = useMemo(
    () => Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, Number(pageSizeRaw) || DEFAULT_PAGE_SIZE)),
    [pageSizeRaw]
  );

  // resetear page cuando cambian filtros
  useEffect(() => {
    setPage(1);
  }, [scope, status]);

  // cargar tickets con abort controller
  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getUserTickets({
          userId,
          page,
          pageSize,
          scope,
          status
        });
        if (ctrl.signal.aborted) return;
        setItems(res?.data ?? []);
        setHasNext(Boolean(res?.hasNext));
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setError((err && err.message) ? String(err.message) : 'Error inesperado');
        setItems([]);
        setHasNext(false);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    };
    run();
    return () => ctrl.abort();
  }, [userId, page, pageSize, scope, status, refreshTrigger]);

  // helpers expuestos
  const setPageSize = (v) => setPageSizeRaw(v);
  const refresh = () => {
    // Incrementar el trigger para forzar un re-fetch
    setRefreshTrigger(prev => prev + 1); 
  };

  return {
    // data
    items, hasNext, loading, error,
    // state
    page, pageSize, scope, status,
    // setters
    setPage, setPageSize, setScope, setStatus,
    // actions
    refresh,
  };
};

