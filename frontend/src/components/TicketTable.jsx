import { EmptyState } from './EmptyState.jsx';

/**
 * Componente de tabla para mostrar tickets
 * @param {Array} items - Array de tickets
 * @param {Function} onSelect - Callback cuando se selecciona un ticket
 */

// Función auxiliar para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función auxiliar para obtener clase CSS del status
const getStatusClass = (status) => {
  const statusClasses = {
    open: 'status-open',
    in_progress: 'status-progress',
    resolved: 'status-resolved',
    closed: 'status-closed'
  };
  return statusClasses[status] || 'status-default';
};

export const TicketTable = ({ items, onSelect }) => {
  if (!items || items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Creado por</th>
            <th>Asignado a</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((ticket) => (
            <tr
              key={ticket.id}
              onClick={() => onSelect && onSelect(ticket)}
              className={onSelect ? 'clickable' : ''}
            >
              <td>#{ticket.id}</td>
              <td className="ticket-title">{ticket.title}</td>
              <td>
                <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </td>
              <td>{ticket.priority || '-'}</td>
              <td>{ticket.createdBy?.name || '-'}</td>
              <td>{ticket.assignedTo?.name || '-'}</td>
              <td>{formatDate(ticket.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
