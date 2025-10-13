/**
 * Componente de filtros para tickets
 * @param {string} scope - Scope actual ('assigned' | 'created' | 'all')
 * @param {string} status - Status actual
 * @param {Function} onChangeScope - Callback para cambiar scope
 * @param {Function} onChangeStatus - Callback para cambiar status
 * @param {boolean} canViewAll - Si el usuario puede ver todos los tickets
 */
export const Filters = ({ scope, status, onChangeScope, onChangeStatus, canViewAll = false }) => {
  const handleScope = (v) => {
    onChangeScope(v);
    onChangeStatus(''); // resetear a "Todos"
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="scope-filter">Mostrar:</label>
        <select
          id="scope-filter"
          aria-label="Filtro de alcance"
          value={scope}
          onChange={(e) => handleScope(e.target.value)}
        >
          <option value="created">Creados por mí</option>
          <option value="assigned">Asignados a mí</option>
          {canViewAll && <option value="all">Todos los tickets</option>}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Estado:</label>
        <select
          id="status-filter"
          aria-label="Filtro de estado"
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="in_progress">En progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>
    </div>
  );
};
