import { useState, useCallback } from 'react';
import { useTickets } from '../_hooks/index.js';
import { createTicket, updateTicketStatus } from '../api/tickets.js';
import { Spinner, ErrorBox, EmptyState, Modal, Pagination } from '../components/Shared/index.js';
import { Filters, TicketTable, CreateTicketForm } from '../components/Tickets/index.js';

/**
 * Contenedor principal que conecta la lógica de datos con los componentes UI
 * @param {number} userId - ID del usuario logueado
 * @param {string} userRole - Rol del usuario (USER | AGENT | ADMIN)
 */
export const TicketsContainer = ({ userId, userRole }) => {
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
    // permissions
    canViewAll,
  } = useTickets(userId, userRole);

  // Estado para el modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Handlers para filtros - optimizados con useCallback
  const handleScopeChange = useCallback((newScope) => {
    setScope(newScope);
    setPage(1); // resetear a página 1 al cambiar filtros
  }, [setScope, setPage]);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
    setPage(1); // resetear a página 1 al cambiar filtros
  }, [setStatus, setPage]);

  // Handlers para paginación - optimizados con useCallback
  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const handleNextPage = useCallback(() => {
    if (hasNext) {
      setPage(page + 1);
    }
  }, [hasNext, setPage]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // resetear a página 1 al cambiar tamaño
  }, [setPageSize, setPage]);

  const handleGoToPage = useCallback((newPage) => {
    setPage(newPage);
  }, [setPage]);

  // Handler para seleccionar ticket (placeholder por ahora) - optimizado con useCallback
  const handleTicketSelect = useCallback((ticket) => {
    console.log('Ticket seleccionado:', ticket);
    // TODO: Implementar navegación o modal de detalle
  }, []);

  // Handler para cuando se actualiza el estado de un ticket individual - optimizado con useCallback
  const handleTicketStatusUpdate = useCallback((updatedTicket) => {
    // Forzar refresh para actualizar la lista
    refresh();
  }, [refresh]);

  // Handler para abrir el modal - optimizado con useCallback
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setCreateError('');
  }, []);

  // Handler para cerrar el modal - optimizado con useCallback
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCreateError('');
  }, []);

  // Handler para crear ticket - optimizado con useCallback
  const handleCreate = useCallback(async (data) => {
    setCreating(true);
    setCreateError('');
    
    let resultado = null;
    try {
      const newTicket = await createTicket(data);
      resultado = newTicket;
      
      // Cerrar el modal
      setIsModalOpen(false);
      
      // Cambiar el scope a "created" para ver los tickets creados por el usuario
      // Esto asegura que el nuevo ticket aparezca en la lista
      if (scope !== 'created') {
        setScope('created');
        setPage(1);
      } else {
        // Si ya estamos en "created", solo refrescar
        refresh();
      }
      
    } catch (err) {
      const errorMessage = (err && err.message) ? String(err.message) : 'Error al crear el ticket';
      setCreateError(errorMessage);
      resultado = null;
    } finally {
      setCreating(false);
    }
    
    return resultado;
  }, [scope, setScope, setPage, refresh]);

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>Tickets</h1>
        <div className="tickets-header-actions">
          <button onClick={handleOpenModal} className="btn btn-primary">
            + Crear nuevo ticket
          </button>
          <button onClick={refresh} className="btn btn-secondary">
            Actualizar
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Crear nuevo ticket"
        size="medium"
      >
        {createError && <ErrorBox error={createError} />}
        <CreateTicketForm 
          onCreate={handleCreate}
          onCancel={handleCloseModal}
          loading={creating}
          userId={userId}
        />
      </Modal>

      <Filters
        scope={scope}
        status={status}
        onChangeScope={handleScopeChange}
        onChangeStatus={handleStatusChange}
        canViewAll={canViewAll}
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
              onStatusChange={handleTicketStatusUpdate}
              allowStatusChange={true}
              updateStatusFunction={updateTicketStatus}
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
