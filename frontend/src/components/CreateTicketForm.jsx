import React, { useState } from 'react';

/**
 * Formulario para crear un nuevo ticket
 * @param {Object} props
 * @param {Function} props.onCreate - Callback cuando se crea un ticket exitosamente
 * @param {Function} props.onCancel - Callback cuando se cancela la creación
 * @param {boolean} props.loading - Si está en proceso de creación
 */
export const CreateTicketForm = ({ onCreate, onCancel, loading }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!body.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    // Limpiar error y llamar callback
    setError('');
    const result = await onCreate({ title: title.trim(), body: body.trim() });
    
    // Si se creó exitosamente, limpiar campos
    if (result) {
      setTitle('');
      setBody('');
    }
  };

  const handleReset = () => {
    setTitle('');
    setBody('');
    setError('');
  };

  const handleCancel = () => {
    setTitle('');
    setBody('');
    setError('');
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <div className="form-group">
        <label htmlFor="ticket-title">
          Título <span className="required">*</span>
        </label>
        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ingrese el título del ticket"
          disabled={loading}
          maxLength={200}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="ticket-body">
          Descripción <span className="required">*</span>
        </label>
        <textarea
          id="ticket-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describa el problema o solicitud"
          disabled={loading}
          rows={5}
          maxLength={1000}
        />
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear ticket'}
        </button>
        
        <button 
          type="button" 
          onClick={handleReset}
          className="btn btn-secondary"
          disabled={loading}
        >
          Limpiar
        </button>
        
        <button 
          type="button" 
          onClick={handleCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
