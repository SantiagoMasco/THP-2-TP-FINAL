// TODO: Implementar hook de tickets
export const useTickets = () => {
  // TODO: Implementar
  return {
    items: [],
    page: 1,
    pageSize: 20,
    scope: 'assigned',
    status: '',
    hasNext: false,
    loading: false,
    error: null,
    setPage: () => {},
    setPageSize: () => {},
    setScope: () => {},
    setStatus: () => {},
    refresh: () => {}
  };
};
