import { EmptyState } from './EmptyState.jsx';
import { TicketStatusSelect } from './TicketStatusSelect.jsx';

/**
 * Componente de tabla para mostrar tickets
 * @param {Array} items - Array de tickets
 * @param {Function} onSelect - Callback cuando se selecciona un ticket
 * @param {Function} onStatusChange - Callback cuando cambia el estado de un ticket (opcional)
 * @param {boolean} allowStatusChange - Si se permite cambiar el estado (por defecto false)
 * @param {Function} updateStatusFunction - Función para actualizar el estado del ticket
 */

// Formateador de fecha reutilizable (evita recrear por fila)
const dtf = new Intl.DateTimeFormat('es-AR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const formatDate = (iso) => (iso ? dtf.format(new Date(iso)) : '-');

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

export const TicketTable = ({ items, onSelect, onStatusChange, allowStatusChange = false, updateStatusFunction }) => {
  if (!items || items.length === 0) return <EmptyState />;

  const handleRowClick = (ticket, e) => {
    // No hacer nada si se hace clic en el select de estado
    if (e.target.tagName === 'SELECT') {
      return;
    }
    onSelect?.(ticket);
  };

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Título</th>
            <th scope="col">Estado</th>
            <th scope="col">Prioridad</th>
            <th scope="col">Creado por</th>
            <th scope="col">Asignado a</th>
            <th scope="col">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr
              key={t.id}
              onClick={(e) => handleRowClick(t, e)}
              className={onSelect ? 'clickable' : ''}
            >
              <td>#{t.id}</td>
              <td className="ticket-title" title={t.title}>{t.title}</td>
              <td>
                {allowStatusChange && onStatusChange && updateStatusFunction ? (
                  <TicketStatusSelect 
                    ticket={t} 
                    onStatusChange={onStatusChange}
                    updateFunction={updateStatusFunction}
                  />
                ) : (
                  <span className={`status-badge ${getStatusClass(t.status)}`}>
                    {t.status}
                  </span>
                )}
              </td>
              <td>{t.priority || '-'}</td>
              <td>{t.createdBy?.name || t.createdBy?.email || '-'}</td>
              <td>{t.assignedTo?.name || t.assignedTo?.email || '-'}</td>
              <td>{formatDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
