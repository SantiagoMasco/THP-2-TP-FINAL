import { useState } from 'react';
import { useTickets } from '../hooks/useTickets.js';
import { createTicket } from '../api/tickets.js';
import { Spinner } from '../components/Spinner.jsx';
import { ErrorBox } from '../components/ErrorBox.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Filters } from '../components/Filters.jsx';
import { TicketTable } from '../components/TicketTable.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { CreateTicketForm } from '../components/CreateTicketForm.jsx';
import { Modal } from '../components/Modal.jsx';

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

  // Estado para el modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Handlers para filtros
  const handleScopeChange = (newScope) => {
    setScope(newScope);
    setPage(1); // resetear a página 1 al cambiar filtros
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // resetear a página 1 al cambiar filtros
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

  // Handler para abrir el modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCreateError('');
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreateError('');
  };

  // Handler para crear ticket
  const handleCreate = async (data) => {
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
  };

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
        />
      </Modal>

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
