import React from 'react';
import { Filters } from './components/Filters.jsx';
import { TicketTable } from './components/TicketTable.jsx';
import { Pagination } from './components/Pagination.jsx';

/**
 * Componente raíz de la aplicación
 */
export const App = () => {
  // Estados de prueba para los filtros
  const [scope, setScope] = React.useState('assigned');
  const [status, setStatus] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  // Datos de ejemplo para mostrar la tabla
  const mockTickets = [
    {
      id: 1,
      title: "No puedo acceder al sistema",
      status: "open",
      priority: "Alta",
      createdBy: { name: "Juan Pérez", email: "juan@ejemplo.com" },
      assignedTo: { name: "Ana López", email: "ana@ejemplo.com" },
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Error en el reporte de ventas",
      status: "in_progress",
      priority: "Media",
      createdBy: { name: "María García", email: "maria@ejemplo.com" },
      assignedTo: { name: "Carlos Ruiz", email: "carlos@ejemplo.com" },
      createdAt: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      title: "Solicitud de nueva funcionalidad",
      status: "resolved",
      priority: "Baja",
      createdBy: { name: "Pedro Martín", email: "pedro@ejemplo.com" },
      assignedTo: null,
      createdAt: "2024-01-13T09:15:00Z"
    }
  ];

  const handleTicketSelect = (ticket) => {
    alert(`Ticket seleccionado: ${ticket.title}`);
  };

  return (
    <div className="app">
      <div className="page">
        <div className="page-content">
          <h1>Frontend MVP - Helpdesk</h1>
          <p>Sistema de tickets funcionando con datos de ejemplo</p>
          
          <div className="tickets-container">
            <div className="tickets-header">
              <h1>Tickets</h1>
              <button className="btn btn-secondary">Actualizar</button>
            </div>
            
            <Filters
              scope={scope}
              status={status}
              onChangeScope={setScope}
              onChangeStatus={setStatus}
            />
            
            <TicketTable
              items={mockTickets}
              onSelect={handleTicketSelect}
            />
            
            <Pagination
              page={page}
              pageSize={pageSize}
              hasNext={true}
              onPrev={() => setPage(Math.max(1, page - 1))}
              onNext={() => setPage(page + 1)}
              onChangePageSize={setPageSize}
              onGoToPage={setPage}
            />
            

          </div>
        </div>
      </div>
    </div>
  );
};
