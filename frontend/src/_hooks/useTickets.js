import { useEffect, useMemo, useState } from 'react';
import { getUserTickets } from '../api/tickets.js';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '../_constants/index.js';

export const useTickets = (userId, userRole = 'USER') => {
  const canViewAll = userRole === 'AGENT' || userRole === 'ADMIN';
  
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSizeRaw, setPageSizeRaw] = useState(DEFAULT_PAGE_SIZE);
  const [scope, setScope] = useState(canViewAll ? 'all' : 'created');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hasNext, setHasNext] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pageSize = useMemo(
    () => Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, Number(pageSizeRaw) || DEFAULT_PAGE_SIZE)),
    [pageSizeRaw]
  );

  // Debounce para la búsqueda: espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetear página a 1 cuando cambian los filtros o la búsqueda
  useEffect(() => {
    setPage(1);
  }, [scope, status, debouncedSearch]);

  useEffect(() => {
    if (!userId) {
      console.warn('useTickets: NO userId provided');
      return;
    }
    
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
          status,
          search: debouncedSearch
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
  }, [userId, page, pageSize, scope, status, debouncedSearch, refreshTrigger]);

  const setPageSize = (v) => setPageSizeRaw(v);
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1); 
  };

  return {
    items, hasNext, loading, error,
    page, pageSize, scope, status, searchTerm,
    setPage, setPageSize, setScope, setStatus, setSearchTerm,
    refresh,
    canViewAll,
  };
};
