import React, { useState } from 'react';

/**
 * Selector de estado de ticket con actualización en tiempo real
 * @param {Object} props
 * @param {Object} props.ticket - Ticket a actualizar
 * @param {Function} props.onStatusChange - Callback cuando el estado cambia exitosamente
 * @param {Function} props.updateFunction - Función para actualizar el ticket (recibe ticketId y status)
 */
export const TicketStatusSelect = ({ ticket, onStatusChange, updateFunction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Abierto', className: 'status-open' },
    { value: 'in_progress', label: 'En progreso', className: 'status-progress' },
    { value: 'resolved', label: 'Resuelto', className: 'status-resolved' },
    { value: 'closed', label: 'Cerrado', className: 'status-closed' }
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    // Si es el mismo estado, no hacer nada
    if (newStatus === ticket.status) {
      return;
    }

    setLoading(true);
    setError('');
    setShowSuccess(false);

    try {
      const updatedTicket = await updateFunction(ticket.id, newStatus);
      
      // Mostrar checkmark de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Notificar al componente padre
      if (onStatusChange) {
        onStatusChange(updatedTicket);
      }
    } catch (err) {
      const errorMessage = (err && err.message) ? String(err.message) : 'Error al actualizar';
      setError(errorMessage);
      
      // Limpiar error después de 3 segundos
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = ticket.status || 'open';
  const currentOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0];

  return (
    <div className="ticket-status-select-container">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className={`ticket-status-select ${currentOption.className} ${loading ? 'loading' : ''}`}
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {loading && <span className="status-loading">⏳</span>}
      {showSuccess && <span className="status-success">✅</span>}
      {error && <span className="status-error" title={error}>❌</span>}
    </div>
  );
};

