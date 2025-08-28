import { useTickets } from '../hooks/useTickets.js';
import { Spinner } from '../components/Spinner.jsx';
import { ErrorBox } from '../components/ErrorBox.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Filters } from '../components/Filters.jsx';
import { TicketTable } from '../components/TicketTable.jsx';
import { Pagination } from '../components/Pagination.jsx';

/**
 * Contenedor principal que conecta la lógica de datos con los componentes UI
 */
export const TicketsContainer = () => {
  const {
    // data
    items,
    hasNext,
    loading,
    error,
    // state
    page,
    pageSize,
    scope,
    status,
    // setters
    setPage,
    setPageSize,
    setScope,
    setStatus,
    // actions
    refresh,
  } = useTickets();

  // Handlers para filtros
  const handleScopeChange = (newScope) => {
    setScope(newScope);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  // Handlers para paginación
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      setPage(page + 1);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // resetear a página 1 al cambiar tamaño
  };

  const handleGoToPage = (newPage) => {
    setPage(newPage);
  };

  // Handler para seleccionar ticket (placeholder por ahora)
  const handleTicketSelect = (ticket) => {
    console.log('Ticket seleccionado:', ticket);
    // TODO: Implementar navegación o modal de detalle
  };

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>Tickets</h1>
        <button onClick={refresh} className="btn btn-secondary">
          Actualizar
        </button>
      </div>

      <Filters
        scope={scope}
        status={status}
        onChangeScope={handleScopeChange}
        onChangeStatus={handleStatusChange}
      />

      <div className="tickets-content">
        {loading && <Spinner />}
        
        {error && <ErrorBox error={error} />}
        
        {!loading && !error && items.length === 0 && <EmptyState />}
        
        {!loading && !error && items.length > 0 && (
          <>
            <TicketTable
              items={items}
              onSelect={handleTicketSelect}
            />
            
            <Pagination
              page={page}
              pageSize={pageSize}
              hasNext={hasNext}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
              onChangePageSize={handlePageSizeChange}
              onGoToPage={handleGoToPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
